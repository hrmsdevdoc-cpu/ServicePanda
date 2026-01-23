import { db } from './dist/server/db.js';
import { permissions } from './dist/shared/schema.js';
import { eq } from 'drizzle-orm';

async function addNewPermissions() {
  try {
    console.log('🚀 Adding new permissions...');

    // Check which permissions already exist
    const existingPermissions = await db.select().from(permissions);
    const existingNames = existingPermissions.map(p => p.name);

    // New permissions to add
    const newPermissions = [
      { name: 'Role and Permissions', description: 'Manage roles and permissions', category: 'Settings' },
      { name: 'Mailgun Settings', description: 'Manage Mailgun email settings', category: 'Settings' },
      { name: 'Lead Settings', description: 'Manage lead distribution settings', category: 'Settings' },
      { name: 'Terms and Conditions', description: 'Manage terms and conditions', category: 'Settings' },
      { name: 'Service Type', description: 'Manage service types', category: 'Settings' },
      { name: 'Change Password', description: 'Change user password', category: 'Settings' },
      { name: 'Stripe Settings', description: 'Manage Stripe payment settings', category: 'Settings' },
    ];

    // Filter out permissions that already exist
    const permissionsToAdd = newPermissions.filter(p => !existingNames.includes(p.name));

    if (permissionsToAdd.length === 0) {
      console.log('✅ All permissions already exist!');
      return;
    }

    console.log(`📝 Adding ${permissionsToAdd.length} new permissions...`);
    const insertedPermissions = await db.insert(permissions).values(permissionsToAdd).returning();
    
    console.log(`✅ Successfully added ${insertedPermissions.length} permissions:`);
    insertedPermissions.forEach(perm => {
      console.log(`   - ${perm.name} (ID: ${perm.id})`);
    });

    // Display all permissions with their IDs for reference
    const allPermissions = await db.select().from(permissions);
    console.log('\n📊 All permissions in database:');
    allPermissions.forEach(perm => {
      console.log(`   ID ${perm.id}: ${perm.name} (${perm.category})`);
    });

  } catch (error) {
    console.error('❌ Error adding permissions:', error);
  } finally {
    process.exit(0);
  }
}

addNewPermissions();
