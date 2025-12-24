import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const uploadsRouter = Router();

const uploadSchema = z.object({
  image: z.string().regex(/^data:image\/(png|jpeg|jpg|webp|svg\+xml);base64,/, {
    message: 'Invalid image format. Expected base64 image data.',
  }),
});

// Ensure uploads directory exists
// Use the same path resolution as in index.ts
// In development: server/src/routes -> go up two levels -> server/public/uploads
// In production: dist/routes -> go up two levels -> dist/public/uploads
// This matches index.ts which goes: server/src -> ../public/uploads
const uploadsDir = path.resolve(__dirname, '../../public/uploads');
// Ensure directory exists before use
fs.mkdir(uploadsDir, { recursive: true })
  .then(() => console.log(`Uploads directory ready: ${uploadsDir}`))
  .catch((err) => console.error('Failed to create uploads directory:', err));

// Upload team logo
uploadsRouter.post('/team-logo', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = uploadSchema.parse(req.body);
    const userId = req.userId!;

    // Extract image data - handle svg+xml and other formats
    const matches = data.image.match(/^data:image\/([^;]+);base64,(.+)$/);
    if (!matches || !matches[1] || !matches[2]) {
      return res.status(400).json({
        message: 'Invalid image data format',
        code: 'INVALID_FORMAT',
      });
    }

    const imageType = matches[1];
    const base64Data = matches[2];
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (imageBuffer.length > maxSize) {
      return res.status(400).json({
        message: 'Image size exceeds 2MB limit',
        code: 'FILE_TOO_LARGE',
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    // Handle different image types
    let extension = imageType;
    if (imageType === 'svg+xml' || imageType === 'svg') {
      extension = 'svg';
    } else if (imageType === 'jpeg') {
      extension = 'jpg';
    }
    const filename = `team-logo-${userId}-${timestamp}-${randomStr}.${extension}`;
    const filepath = path.join(uploadsDir, filename);

    // Ensure directory exists
    await fs.mkdir(uploadsDir, { recursive: true });

    // Save file
    await fs.writeFile(filepath, imageBuffer);
    
    // Verify file was saved
    const stats = await fs.stat(filepath);
    console.log(`Logo saved to: ${filepath}`);
    console.log(`File size: ${stats.size} bytes`);
    console.log(`File exists: ${stats.isFile()}`);

    // Return URL (relative path that can be served statically)
    const url = `/uploads/${filename}`;
    console.log(`Returning URL: ${url}`);

    res.json({
      data: { url },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: error.errors,
      });
    }
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

