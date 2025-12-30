import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/index.js';
import { posts, comments, postLikes, users, pitches, teams } from '../db/schema.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { eq, and, or, like, desc, asc, sql, isNull, isNotNull, inArray } from 'drizzle-orm';
import { validateCity } from '../utils/cities.js';

export const postsRouter = Router();

const createPostSchema = z.object({
  content: z.string().min(1).max(5000),
  city: z.preprocess(
    (val) => {
      // Handle undefined, null, or empty values
      if (val === undefined || val === null || val === '') {
        return undefined;
      }
      // Handle string values
      if (typeof val === 'string') {
        const trimmed = val.trim();
        return trimmed === '' ? undefined : trimmed;
      }
      // For any other type, return undefined
      return undefined;
    },
    z.string().max(100).optional()
  ),
  pitchId: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().uuid().optional()
  ),
  teamId: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().uuid().optional()
  ),
  mediaType: z.enum(['none', 'image']).default('none'),
  mediaUrl: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().url().optional()
  ),
});

const updatePostSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  mediaType: z.enum(['none', 'image']).optional(),
  mediaUrl: z.string().url().optional().nullable(),
});

const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
});

// GET /api/posts - List posts with filters
postsRouter.get('/', async (req, res) => {
  try {
    const search = req.query.search as string | undefined;
    const city = req.query.city as string | undefined;
    const tagType = req.query.tagType as 'pitches' | 'teams' | undefined;
    const tagId = req.query.tagId as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const sort = (req.query.sort as 'newest' | 'mostLiked') || 'newest';
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];

    if (search) {
      conditions.push(like(posts.content, `%${search}%`));
    }

    if (city) {
      conditions.push(eq(posts.city, city));
    }

    if (tagType === 'pitches' && tagId) {
      conditions.push(eq(posts.pitchId, tagId));
    } else if (tagType === 'teams' && tagId) {
      conditions.push(eq(posts.teamId, tagId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get posts with author info
    const postsList = await db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        authorName: posts.authorName,
        authorUsername: posts.authorUsername,
        authorAvatar: posts.authorAvatar,
        content: posts.content,
        mediaType: posts.mediaType,
        mediaUrl: posts.mediaUrl,
        city: posts.city,
        pitchId: posts.pitchId,
        teamId: posts.teamId,
        likesCount: posts.likesCount,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .where(whereClause)
      .orderBy(sort === 'mostLiked' ? desc(posts.likesCount) : desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(whereClause);
    const total = Number(totalResult[0]?.count || 0);

    // Get liked status for authenticated users
    let likedPostIds: string[] = [];
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const userLikes = await db
          .select({ postId: postLikes.postId })
          .from(postLikes)
          .where(eq(postLikes.userId, decoded.userId));
        likedPostIds = userLikes.map(l => l.postId);
      } catch (error) {
        // Invalid token, continue without liked status
      }
    }

    // Get comment counts
    const postIds = postsList.map(p => p.id);
    const commentCounts = postIds.length > 0
      ? await db
          .select({
            postId: comments.postId,
            count: sql<number>`count(*)`,
          })
          .from(comments)
          .where(inArray(comments.postId, postIds))
          .groupBy(comments.postId)
      : [];

    const commentCountMap = new Map(commentCounts.map(c => [c.postId, Number(c.count)]));

    // Get pitch/team info if tagged
    const pitchIds = [...new Set(postsList.filter(p => p.pitchId).map(p => p.pitchId!))];
    const teamIds = [...new Set(postsList.filter(p => p.teamId).map(p => p.teamId!))];

    const pitchInfo = pitchIds.length > 0
      ? await db.select().from(pitches).where(inArray(pitches.id, pitchIds))
      : [];
    const teamInfo = teamIds.length > 0
      ? await db.select().from(teams).where(inArray(teams.id, teamIds))
      : [];

    const pitchMap = new Map(pitchInfo.map(p => [p.id, p]));
    const teamMap = new Map(teamInfo.map(t => [t.id, t]));

    const result = postsList.map(post => ({
      ...post,
      isLiked: likedPostIds.includes(post.id),
      commentsCount: commentCountMap.get(post.id) || 0,
      taggedPitch: post.pitchId ? pitchMap.get(post.pitchId) : null,
      taggedTeam: post.teamId ? teamMap.get(post.teamId) : null,
    }));

    res.json({
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

// GET /api/posts/:id - Get single post
postsRouter.get('/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      return res.status(404).json({ message: 'Post not found', code: 'POST_NOT_FOUND' });
    }

    // Get liked status
    let isLiked = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const [like] = await db
          .select()
          .from(postLikes)
          .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, decoded.userId)))
          .limit(1);
        isLiked = !!like;
      } catch (error) {
        // Invalid token, continue without liked status
      }
    }

    // Get tagged entities
    const taggedPitch = post.pitchId
      ? await db.select().from(pitches).where(eq(pitches.id, post.pitchId)).limit(1)
      : null;
    const taggedTeam = post.teamId
      ? await db.select().from(teams).where(eq(teams.id, post.teamId)).limit(1)
      : null;

    res.json({
      data: {
        ...post,
        isLiked,
        taggedPitch: taggedPitch?.[0] || null,
        taggedTeam: taggedTeam?.[0] || null,
      },
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

// POST /api/posts - Create post (auth required)
postsRouter.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = createPostSchema.parse(req.body);
    const userId = req.userId!;
    const user = req.user!;

    // City is optional - only validate if a non-empty string value is provided
    // After preprocess, empty strings should be undefined, but check anyway
    if (data.city !== undefined && data.city !== null) {
      // If city is provided, it must be a valid city key
      if (typeof data.city === 'string' && data.city.trim() !== '') {
        const cityValidation = validateCity(data.city.trim());
        if (!cityValidation.valid) {
          return res.status(400).json({
            message: cityValidation.error,
            code: 'VALIDATION_ERROR',
          });
        }
      } else {
        // If city is provided but empty, treat as undefined
        data.city = undefined;
      }
    }

    // Verify pitch/team exists if provided
    if (data.pitchId) {
      const [pitch] = await db.select().from(pitches).where(eq(pitches.id, data.pitchId)).limit(1);
      if (!pitch) {
        return res.status(404).json({ message: 'Pitch not found', code: 'PITCH_NOT_FOUND' });
      }
    }

    if (data.teamId) {
      const [team] = await db.select().from(teams).where(eq(teams.id, data.teamId)).limit(1);
      if (!team) {
        return res.status(404).json({ message: 'Team not found', code: 'TEAM_NOT_FOUND' });
      }
    }

    // Sanitize content (basic)
    const sanitizedContent = data.content.trim().replace(/\s+/g, ' ');

    const [newPost] = await db
      .insert(posts)
      .values({
        authorId: userId,
        authorName: user.name,
        authorUsername: user.username,
        authorAvatar: null, // Can be extended later
        content: sanitizedContent,
        mediaType: data.mediaType || 'none',
        mediaUrl: data.mediaUrl || null,
        city: data.city || null,
        pitchId: data.pitchId || null,
        teamId: data.teamId || null,
        likesCount: 0,
      })
      .returning();

    res.status(201).json({ data: newPost });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: error.errors,
      });
    }
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

// PATCH /api/posts/:id - Update post (auth, author only)
postsRouter.patch('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId!;
    const data = updatePostSchema.parse(req.body);

    // Check if post exists and user is author
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      return res.status(404).json({ message: 'Post not found', code: 'POST_NOT_FOUND' });
    }

    if (post.authorId !== userId) {
      return res.status(403).json({ message: 'Forbidden', code: 'FORBIDDEN' });
    }

    // Sanitize content if provided
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.content !== undefined) {
      updateData.content = data.content.trim().replace(/\s+/g, ' ');
    }

    if (data.mediaType !== undefined) {
      updateData.mediaType = data.mediaType;
    }

    if (data.mediaUrl !== undefined) {
      updateData.mediaUrl = data.mediaUrl;
    }

    const [updatedPost] = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, postId))
      .returning();

    res.json({ data: updatedPost });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: error.errors,
      });
    }
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

// DELETE /api/posts/:id - Delete post (auth, author only)
postsRouter.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId!;

    // Check if post exists and user is author
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      return res.status(404).json({ message: 'Post not found', code: 'POST_NOT_FOUND' });
    }

    if (post.authorId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden', code: 'FORBIDDEN' });
    }

    await db.delete(posts).where(eq(posts.id, postId));

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

// POST /api/posts/:id/like - Like post (auth)
postsRouter.post('/:id/like', authenticate, async (req: AuthRequest, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId!;

    // Check if post exists
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      return res.status(404).json({ message: 'Post not found', code: 'POST_NOT_FOUND' });
    }

    // Check if already liked
    const [existingLike] = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)))
      .limit(1);

    if (existingLike) {
      return res.status(409).json({ message: 'Post already liked', code: 'ALREADY_LIKED' });
    }

    // Create like
    await db.insert(postLikes).values({
      postId,
      userId,
    });

    // Update likes count
    await db
      .update(posts)
      .set({ likesCount: sql`${posts.likesCount} + 1` })
      .where(eq(posts.id, postId));

    res.json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

// DELETE /api/posts/:id/like - Unlike post (auth)
postsRouter.delete('/:id/like', authenticate, async (req: AuthRequest, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId!;

    // Check if like exists
    const [existingLike] = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)))
      .limit(1);

    if (!existingLike) {
      return res.status(404).json({ message: 'Like not found', code: 'LIKE_NOT_FOUND' });
    }

    // Delete like
    await db
      .delete(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));

    // Update likes count
    await db
      .update(posts)
      .set({ likesCount: sql`GREATEST(${posts.likesCount} - 1, 0)` })
      .where(eq(posts.id, postId));

    res.json({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error('Unlike post error:', error);
    res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

// GET /api/posts/:id/comments - Get comments for a post
postsRouter.get('/:id/comments', async (req, res) => {
  try {
    const postId = req.params.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const offset = (page - 1) * limit;

    // Check if post exists
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      return res.status(404).json({ message: 'Post not found', code: 'POST_NOT_FOUND' });
    }

    // Get comments
    const commentsList = await db
      .select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(asc(comments.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(comments)
      .where(eq(comments.postId, postId));
    const total = Number(totalResult[0]?.count || 0);

    res.json({
      data: commentsList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

// POST /api/posts/:id/comments - Create comment (auth)
postsRouter.post('/:id/comments', authenticate, async (req: AuthRequest, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId!;
    const user = req.user!;
    const data = createCommentSchema.parse(req.body);

    // Check if post exists
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      return res.status(404).json({ message: 'Post not found', code: 'POST_NOT_FOUND' });
    }

    // Sanitize content
    const sanitizedContent = data.content.trim().replace(/\s+/g, ' ');

    const [newComment] = await db
      .insert(comments)
      .values({
        postId,
        authorId: userId,
        authorName: user.name,
        authorUsername: user.username,
        content: sanitizedContent,
      })
      .returning();

    res.status(201).json({ data: newComment });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: error.errors,
      });
    }
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

// DELETE /api/posts/comments/:id - Delete comment (auth, author or admin)
postsRouter.delete('/comments/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.userId!;

    // Check if comment exists
    const [comment] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found', code: 'COMMENT_NOT_FOUND' });
    }

    // Check if user is author or admin
    if (comment.authorId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden', code: 'FORBIDDEN' });
    }

    await db.delete(comments).where(eq(comments.id, commentId));

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

