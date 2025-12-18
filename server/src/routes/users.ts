import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/index.js';
import { users, teamMembers } from '../db/schema.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { eq, and, or, like, ilike, notInArray, sql, ne } from 'drizzle-orm';

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

