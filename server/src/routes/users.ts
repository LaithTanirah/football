import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/index.js';
import { users, teamMembers, teams, leagues, bookings, posts } from '../db/schema.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { eq, and, or, like, ilike, notInArray, sql, ne, count } from 'drizzle-orm';
import { validateCity } from '../utils/cities.js';

export const usersRouter = Router();

// Arabic text normalization utility
function normalizeArabic(text: string): string {
  if (!text) return '';
  
  // Normalize common Arabic characters
  return text
    .replace(/[أإآ]/g, 'ا') // Normalize Alef variations
    .replace(/[ى]/g, 'ي') // Normalize Yeh variations
    .replace(/[ة]/g, 'ه') // Normalize Teh Marbuta
    .replace(/[ؤ]/g, 'و') // Normalize Waw with Hamza
    .replace(/[ئ]/g, 'ي') // Normalize Yeh with Hamza
    .trim();
}

// Search users endpoint
usersRouter.get('/search', authenticate, async (req: AuthRequest, res) => {
  try {
    const query = z.object({
      q: z.string().min(2).max(100), // Minimum 2 characters for search
      excludeTeamId: z.string().uuid().optional(),
      limit: z.coerce.number().min(1).max(20).default(10),
    });

    const { q, excludeTeamId, limit } = query.parse(req.query);
    const userId = req.userId!;

    // Normalize search query
    const normalizedQuery = normalizeArabic(q);
    const searchPattern = `%${normalizedQuery}%`;

    // Exclude users already in the team
    let excludedIds: string[] = [];
    if (excludeTeamId) {
      const teamMemberIds = await db
        .select({ userId: teamMembers.userId })
        .from(teamMembers)
        .where(eq(teamMembers.teamId, excludeTeamId));

      excludedIds = teamMemberIds.map((m) => m.userId);
    }

    // Build query conditions - use case-insensitive search
    // ilike already handles case-insensitive matching in PostgreSQL
    const conditions = [
      ne(users.id, userId), // Exclude current user
      or(
        ilike(users.name, searchPattern),
        ilike(users.username, searchPattern),
        ilike(users.email, searchPattern),
        ilike(users.phone, searchPattern)
      )!,
    ];

    // Add exclusion for team members if needed
    if (excludedIds.length > 0) {
      conditions.push(notInArray(users.id, excludedIds));
    }

    const results = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        phone: users.phone,
        city: users.city,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(and(...conditions))
      .limit(limit);

    res.json({ data: results });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: error.errors,
      });
    }
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

// Get current user profile
usersRouter.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized', code: 'UNAUTHORIZED' });
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        phone: users.phone,
        role: users.role,
        city: users.city,
        bio: users.bio,
        avatar: users.avatar,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, req.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ message: 'User not found', code: 'USER_NOT_FOUND' });
    }

    res.json({ data: user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

// Update current user profile
usersRouter.patch('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized', code: 'UNAUTHORIZED' });
    }

    const updateSchema = z.object({
      name: z.string().min(1).max(255).optional(),
      username: z.string().min(3).max(100).optional(),
      city: z.string().optional(),
      bio: z.string().max(250).optional().nullable(),
      avatar: z.union([
        z.string().url(),
        z.string().startsWith('data:image/'), // Allow base64 data URLs
      ]).optional().nullable(),
    });

    const data = updateSchema.parse(req.body);

    // Validate and normalize city if provided
    if (data.city !== undefined && data.city && data.city.trim() !== '') {
      // Normalize to uppercase first, then validate
      const normalizedCity = data.city.trim().toUpperCase();
      const cityValidation = validateCity(normalizedCity);
      if (!cityValidation.valid) {
        return res.status(400).json({
          message: cityValidation.error,
          code: 'VALIDATION_ERROR',
        });
      }
      // Use normalized city
      data.city = normalizedCity;
    } else if (data.city !== undefined && (!data.city || data.city.trim() === '')) {
      // Allow clearing city by sending empty string
      data.city = null;
    }

    // Check if username is being changed and if it's already taken
    if (data.username) {
      const existing = await db
        .select({ id: users.id })
        .from(users)
        .where(and(eq(users.username, data.username), ne(users.id, req.userId)))
        .limit(1);

      if (existing.length > 0) {
        return res.status(400).json({
          message: 'Username already exists',
          code: 'USERNAME_EXISTS',
        });
      }
    }

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set({
        ...(data.name && { name: data.name }),
        ...(data.username && { username: data.username }),
        ...(data.city !== undefined && { city: data.city || null }),
        ...(data.bio !== undefined && { bio: data.bio || null }),
        ...(data.avatar !== undefined && { avatar: data.avatar || null }),
      })
      .where(eq(users.id, req.userId))
      .returning({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        phone: users.phone,
        role: users.role,
        city: users.city,
        bio: users.bio,
        avatar: users.avatar,
        createdAt: users.createdAt,
      });

    res.json({ data: updatedUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: error.errors,
      });
    }
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

// Get user stats
usersRouter.get('/me/stats', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized', code: 'UNAUTHORIZED' });
    }

    // Get teams count (where user is captain or member)
    const teamsCountResult = await db
      .select({ count: count() })
      .from(teams)
      .where(eq(teams.captainId, req.userId));

    // Get teams where user is a member
    const memberTeamsResult = await db
      .select({ count: count() })
      .from(teamMembers)
      .where(eq(teamMembers.userId, req.userId));

    const teamsCount = (teamsCountResult[0]?.count || 0) + (memberTeamsResult[0]?.count || 0);

    // Get leagues count (where user is owner)
    const leaguesCountResult = await db
      .select({ count: count() })
      .from(leagues)
      .where(eq(leagues.ownerId, req.userId));

    const leaguesCount = leaguesCountResult[0]?.count || 0;

    // Get bookings count
    const bookingsCountResult = await db
      .select({ count: count() })
      .from(bookings)
      .where(eq(bookings.userId, req.userId));

    const bookingsCount = bookingsCountResult[0]?.count || 0;

    // Get posts count
    const postsCountResult = await db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.authorId, req.userId));

    const postsCount = postsCountResult[0]?.count || 0;

    res.json({
      data: {
        teamsCount,
        leaguesCount,
        bookingsCount,
        postsCount,
      },
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

