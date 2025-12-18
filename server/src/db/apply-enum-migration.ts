import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);

async function applyEnumMigration() {
  try {
    console.log('Applying team_member_role enum migration...');
    
    // Add OWNER to enum
    await sql`
      DO $$ BEGIN
        ALTER TYPE "team_member_role" ADD VALUE IF NOT EXISTS 'OWNER';
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    console.log('✓ Added OWNER to enum');
    
    // Add ADMIN to enum
    await sql`
      DO $$ BEGIN
        ALTER TYPE "team_member_role" ADD VALUE IF NOT EXISTS 'ADMIN';
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    console.log('✓ Added ADMIN to enum');
    
    // Update existing CAPTAIN records to OWNER
    await sql`
      UPDATE "team_members" SET "role" = 'OWNER' WHERE "role" = 'CAPTAIN';
    `;
    console.log('✓ Updated existing CAPTAIN records to OWNER');
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

applyEnumMigration();

