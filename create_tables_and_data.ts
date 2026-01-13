import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

async function createTablesAndData() {
  const pool = new Pool({
    connectionString: 'postgresql://servicepanda:servicepanda@8954@13.201.64.152:5432/servicepanda'
  });

  try {
    console.log('🚀 Creating tables and inserting data...');

    // Read the SQL file
    const sqlFile = path.join(process.cwd(), 'create_role_permission_tables.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Execute the SQL
    await pool.query(sql);

    console.log('✅ Tables created and data inserted successfully!');

    // Verify the data
    const rolesResult = await pool.query('SELECT COUNT(*) as count FROM roles');
    const permissionsResult = await pool.query('SELECT COUNT(*) as count FROM permissions');
    const mappingsResult = await pool.query('SELECT COUNT(*) as count FROM role_permissions');

    console.log('\n📊 Summary:');
    console.log(`- ${rolesResult.rows[0].count} roles created`);
    console.log(`- ${permissionsResult.rows[0].count} permissions created`);
    console.log(`- ${mappingsResult.rows[0].count} role-permission mappings created`);

    // Show role details
    const roleDetails = await pool.query(`
      SELECT 
        r.name as role_name,
        r.description,
        r.is_default,
        COUNT(rp.permission_id) as permission_count
      FROM roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      GROUP BY r.id, r.name, r.description, r.is_default
      ORDER BY r.is_default DESC, r.name
    `);

    console.log('\n👥 Roles:');
    roleDetails.rows.forEach(role => {
      console.log(`  - ${role.role_name}: ${role.permission_count} permissions (${role.is_default ? 'Default' : 'Custom'})`);
    });

  } catch (error) {
    console.error('❌ Error creating tables and data:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

createTablesAndData();
