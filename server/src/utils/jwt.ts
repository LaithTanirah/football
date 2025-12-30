import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  username: string;
  role?: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  // Use 7 days expiration as per user requirement (or 1h if they prefer)
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
}
