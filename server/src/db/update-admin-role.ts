import { db } from './index.js';
import { users } from './schema.js';
import { eq, or } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

async function updateAdminRole() {
  try {
    console.log('Updating admin user role...');

    // Update user with username 'admin' to have ADMIN role
    const result = await db
      .update(users)
      .set({ role: 'ADMIN' })
      .where(eq(users.username, 'admin'))
      .returning();

    if (result.length > 0) {
      console.log(`✓ Successfully updated user 'admin' to ADMIN role`);
      console.log(`  User: ${result[0].name} (${result[0].email})`);
      console.log(`  Role: ${result[0].role}`);
    } else {
      console.log('⚠ No user found with username "admin"');
      console.log('  Creating admin user...');
      
      // If admin user doesn't exist, check if we should create it
      // For now, just inform the user to run the seed script
      console.log('  Please run: npm run db:seed');
    }

    // Also check for admin@example.com
    const resultByEmail = await db
      .update(users)
      .set({ role: 'ADMIN' })
      .where(eq(users.email, 'admin@example.com'))
      .returning();

    if (resultByEmail.length > 0) {
      console.log(`✓ Successfully updated user with email 'admin@example.com' to ADMIN role`);
      console.log(`  User: ${resultByEmail[0].name} (${resultByEmail[0].username})`);
      console.log(`  Role: ${resultByEmail[0].role}`);
    }

    console.log('\n✓ Admin role update completed!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error updating admin role:', error);
    process.exit(1);
  }
}

updateAdminRole();

