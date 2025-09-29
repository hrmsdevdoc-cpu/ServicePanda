-- Create team_tasks table for task management system
CREATE TABLE IF NOT EXISTS team_tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    priority VARCHAR(10) NOT NULL DEFAULT 'P3',
    due_date TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    
    -- Foreign key references (only one should be set)
    potential_provider_id INTEGER REFERENCES potential_providers(id),
    provider_id INTEGER REFERENCES service_providers(id),
    customer_id VARCHAR REFERENCES users(id),
    
    -- Admin who created/assigned the task
    admin_id VARCHAR NOT NULL,
    assigned_to VARCHAR,
    comments TEXT,
    
    -- Task metadata
    task_type VARCHAR(50) NOT NULL DEFAULT 'general',
    tags JSONB,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_team_tasks_status ON team_tasks(status);
CREATE INDEX IF NOT EXISTS idx_team_tasks_priority ON team_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_team_tasks_due_date ON team_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_team_tasks_admin_id ON team_tasks(admin_id);
CREATE INDEX IF NOT EXISTS idx_team_tasks_assigned_to ON team_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_team_tasks_potential_provider ON team_tasks(potential_provider_id);
CREATE INDEX IF NOT EXISTS idx_team_tasks_provider ON team_tasks(provider_id);
CREATE INDEX IF NOT EXISTS idx_team_tasks_customer ON team_tasks(customer_id);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_team_tasks_status_due_date ON team_tasks(status, due_date);
CREATE INDEX IF NOT EXISTS idx_team_tasks_priority_due_date ON team_tasks(priority, due_date);

-- Add some sample data for testing
INSERT INTO team_tasks (title, description, status, priority, due_date, admin_id, assigned_to, task_type, comments) VALUES
('Follow up with John Smith', 'Contact John Smith regarding his potential provider application', 'pending', 'P2', NOW() + INTERVAL '1 day', 'admin', 'manager1', 'follow_up', 'Initial contact needed'),
('Review Sarah Johnson documents', 'Review and approve Sarah Johnson''s submitted documents', 'pending', 'P1', NOW() + INTERVAL '2 hours', 'admin', 'manager2', 'review', 'Urgent - documents pending'),
('Call Mike Wilson', 'Schedule a call with Mike Wilson about service expansion', 'pending', 'P3', NOW() + INTERVAL '3 days', 'admin', 'manager1', 'call', 'Discuss new service areas'),
('Email campaign for new providers', 'Send welcome email to newly approved providers', 'pending', 'P4', NOW() + INTERVAL '1 week', 'admin', 'manager3', 'email', 'Bulk email campaign'),
('Meeting with team leads', 'Weekly team meeting to discuss progress', 'pending', 'P2', NOW() + INTERVAL '2 days', 'admin', 'manager1', 'meeting', 'Regular team sync');

-- Update the updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_team_tasks_updated_at 
    BEFORE UPDATE ON team_tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
