import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);

async function runMigration() {
  try {
    console.log('Running user bio and avatar migration...');
    
    // Execute each ALTER TABLE statement separately
    try {
      await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bio" text`;
      console.log('✓ Added bio column');
    } catch (error: any) {
      if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
        console.log('✓ bio column already exists');
      } else {
        throw error;
      }
    }
    
    try {
      await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar" text`;
      console.log('✓ Added avatar column');
    } catch (error: any) {
      if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
        console.log('✓ avatar column already exists');
      } else {
        throw error;
      }
    }
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();

