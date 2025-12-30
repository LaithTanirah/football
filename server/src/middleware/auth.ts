import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users, teams, teamMembers } from '../db/schema.js';
import { eq, and, or } from 'drizzle-orm';

export interface AuthRequest extends Request {
  userId?: string;
  user?: typeof users.$inferSelect;
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // Read token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized', code: 'NO_TOKEN' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized', code: 'NO_TOKEN' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; username: string; role?: string };
    const user = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);

    if (!user[0]) {
      return res.status(401).json({ message: 'User not found', code: 'USER_NOT_FOUND' });
    }

    req.userId = decoded.userId;
    req.user = user[0];
    next();
  } catch (error: any) {
    // Check error type by name property (jsonwebtoken uses name property)
    if (error?.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    if (error?.name === 'JsonWebTokenError' || error?.name === 'NotBeforeError') {
      return res.status(401).json({ message: 'Invalid token', code: 'INVALID_TOKEN' });
    }
    // For any other error, return generic invalid token message
    return res.status(401).json({ message: 'Invalid token', code: 'INVALID_TOKEN' });
  }
}

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized', code: 'NO_USER' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden', code: 'INSUFFICIENT_PERMISSIONS' });
    }

    next();
  };
}

export async function requireTeamOwner(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized', code: 'NO_USER' });
    }

    const teamId = req.params.id || req.params.teamId;
    if (!teamId) {
      return res.status(400).json({ message: 'Team ID is required', code: 'MISSING_TEAM_ID' });
    }

    // Check if user is team owner (captainId) or has OWNER role in team_members
    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.id, teamId))
      .limit(1);

    if (!team) {
      return res.status(404).json({ message: 'Team not found', code: 'TEAM_NOT_FOUND' });
    }

    // Check if user is the captain (owner)
    if (team.captainId === req.userId) {
      return next();
    }

    // Check if user has OWNER or ADMIN role in team_members
    const [member] = await db
      .select()
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.teamId, teamId),
          eq(teamMembers.userId, req.userId),
          or(eq(teamMembers.role, 'OWNER'), eq(teamMembers.role, 'ADMIN'))
        )
      )
      .limit(1);

    if (!member) {
      return res.status(403).json({ 
        message: 'Only team owner or admin can perform this action', 
        code: 'FORBIDDEN' 
      });
    }

    next();
  } catch (error) {
    console.error('requireTeamOwner error:', error);
    return res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
}

