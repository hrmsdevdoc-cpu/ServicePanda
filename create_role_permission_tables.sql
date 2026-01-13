-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create role_permissions table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_permissions_category ON permissions(category);

-- Insert default permissions
INSERT INTO permissions (name, description, category) VALUES
-- General
('Dashboard', 'Access to dashboard overview', 'General'),

-- Providers
('Providers', 'View and manage service providers', 'Providers'),
('Approve Providers', 'Approve or reject provider applications', 'Providers'),
('Edit Providers', 'Edit provider information', 'Providers'),

-- Leads
('Leads', 'View and manage leads', 'Leads'),
('Assign Leads', 'Assign leads to providers', 'Leads'),

-- Customers
('Potential Customers', 'View and manage potential customers', 'Customers'),
('Potential Providers', 'View and manage potential providers', 'Providers'),

-- Marketing
('Vouchers', 'Create and manage vouchers', 'Marketing'),
('Email Campaigns', 'Send email campaigns', 'Marketing'),
('SMS Campaigns', 'Send SMS campaigns', 'Marketing'),

-- Reports
('Reports', 'View system reports', 'Reports'),
('Export Reports', 'Export report data', 'Reports'),

-- Settings
('Settings', 'Access system settings', 'Settings'),
('Admin Users', 'Manage admin users', 'Settings'),
('Departments', 'Manage departments', 'Settings')
ON CONFLICT (name) DO NOTHING;

-- Insert default roles
INSERT INTO roles (name, description, is_default) VALUES
('Administrator', 'Full system access with all permissions', TRUE),
('Manager', 'Management access with limited settings', FALSE),
('Team Member', 'Basic access for daily operations', FALSE)
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to Administrator role (all permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Administrator'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Manager role (most permissions except settings)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Manager'
AND p.name NOT IN ('Settings', 'Admin Users', 'Departments')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Team Member role (basic permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Team Member'
AND p.name IN ('Dashboard', 'Providers', 'Leads', 'Potential Customers', 'Potential Providers')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Display summary
SELECT 
    'Roles created:' as info,
    COUNT(*) as count
FROM roles
UNION ALL
SELECT 
    'Permissions created:' as info,
    COUNT(*) as count
FROM permissions
UNION ALL
SELECT 
    'Role-permission mappings:' as info,
    COUNT(*) as count
FROM role_permissions;

-- Show role details
SELECT 
    r.name as role_name,
    r.description,
    r.is_default,
    COUNT(rp.permission_id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
GROUP BY r.id, r.name, r.description, r.is_default
ORDER BY r.is_default DESC, r.name;
