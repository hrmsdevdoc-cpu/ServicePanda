import { db } from './dist/server/db.js';
import { roles, permissions, rolePermissions } from './dist/shared/schema.js';

async function initializeRolesAndPermissions() {
  try {
    console.log('🚀 Initializing roles and permissions...');

    // Insert default permissions
    const defaultPermissions = [
      // General
      { name: 'Dashboard', description: 'Access to dashboard overview', category: 'General' },
      
      // Providers
      { name: 'Providers', description: 'View and manage service providers', category: 'Providers' },
      { name: 'Approve Providers', description: 'Approve or reject provider applications', category: 'Providers' },
      { name: 'Edit Providers', description: 'Edit provider information', category: 'Providers' },
      
      // Leads
      { name: 'Leads', description: 'View and manage leads', category: 'Leads' },
      { name: 'Assign Leads', description: 'Assign leads to providers', category: 'Leads' },
      
      // Customers
      { name: 'Potential Customers', description: 'View and manage potential customers', category: 'Customers' },
      { name: 'Potential Providers', description: 'View and manage potential providers', category: 'Providers' },
      
      // Marketing
      { name: 'Vouchers', description: 'Create and manage vouchers', category: 'Marketing' },
      { name: 'Email Campaigns', description: 'Send email campaigns', category: 'Marketing' },
      { name: 'SMS Campaigns', description: 'Send SMS campaigns', category: 'Marketing' },
      
      // Reports
      { name: 'Reports', description: 'View system reports', category: 'Reports' },
      { name: 'Export Reports', description: 'Export report data', category: 'Reports' },
      
      // Settings
      { name: 'Settings', description: 'Access system settings', category: 'Settings' },
      { name: 'Admin Users', description: 'Manage admin users', category: 'Settings' },
      { name: 'Departments', description: 'Manage departments', category: 'Settings' },
    ];

    console.log('📝 Inserting permissions...');
    const insertedPermissions = await db.insert(permissions).values(defaultPermissions).returning();
    console.log(`✅ Inserted ${insertedPermissions.length} permissions`);

    // Insert default roles
    const defaultRoles = [
      {
        name: 'Administrator',
        description: 'Full system access with all permissions',
        isDefault: true
      },
      {
        name: 'Manager',
        description: 'Management access with limited settings',
        isDefault: false
      },
      {
        name: 'Team Member',
        description: 'Basic access for daily operations',
        isDefault: false
      }
    ];

    console.log('👥 Inserting roles...');
    const insertedRoles = await db.insert(roles).values(defaultRoles).returning();
    console.log(`✅ Inserted ${insertedRoles.length} roles`);

    // Assign permissions to roles
    const rolePermissionMappings = [
      // Administrator - all permissions
      ...insertedPermissions.map(permission => ({
        roleId: insertedRoles.find(r => r.name === 'Administrator').id,
        permissionId: permission.id
      })),
      
      // Manager - most permissions except settings
      ...insertedPermissions
        .filter(p => !['Settings', 'Admin Users', 'Departments'].includes(p.name))
        .map(permission => ({
          roleId: insertedRoles.find(r => r.name === 'Manager').id,
          permissionId: permission.id
        })),
      
      // Team Member - basic permissions
      ...insertedPermissions
        .filter(p => ['Dashboard', 'Providers', 'Leads', 'Potential Customers', 'Potential Providers'].includes(p.name))
        .map(permission => ({
          roleId: insertedRoles.find(r => r.name === 'Team Member').id,
          permissionId: permission.id
        }))
    ];

    console.log('🔗 Assigning permissions to roles...');
    await db.insert(rolePermissions).values(rolePermissionMappings);
    console.log(`✅ Assigned permissions to roles`);

    console.log('🎉 Roles and permissions initialized successfully!');
    
    // Display summary
    console.log('\n📊 Summary:');
    console.log(`- ${insertedPermissions.length} permissions created`);
    console.log(`- ${insertedRoles.length} roles created`);
    console.log(`- ${rolePermissionMappings.length} role-permission mappings created`);
    
    console.log('\n👥 Roles:');
    insertedRoles.forEach(role => {
      const rolePerms = rolePermissionMappings.filter(rp => rp.roleId === role.id);
      console.log(`  - ${role.name}: ${rolePerms.length} permissions`);
    });

  } catch (error) {
    console.error('❌ Error initializing roles and permissions:', error);
  } finally {
    process.exit(0);
  }
}

initializeRolesAndPermissions();
