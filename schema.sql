-- Database Schema for AtomQuest Hackathon 1.0 Goal Setting & Tracking Portal

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('employee', 'manager', 'admin')),
    department VARCHAR(255),
    manager_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cycles Table
CREATE TABLE IF NOT EXISTS cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    active_window VARCHAR(50) NOT NULL DEFAULT 'Goal Setting' CHECK (active_window IN ('Goal Setting', 'Q1', 'Q2', 'Q3', 'Q4', 'Closed')),
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Goal Sheets Table
CREATE TABLE IF NOT EXISTS goal_sheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'Approved', 'Returned')),
    total_weightage NUMERIC(5, 2) DEFAULT 0 CHECK (total_weightage >= 0 AND total_weightage <= 100),
    overall_score NUMERIC(5, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, cycle_id)
);

-- Goals Table
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_sheet_id UUID NOT NULL REFERENCES goal_sheets(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    uom_type VARCHAR(50) NOT NULL CHECK (uom_type IN ('Numeric Higher Better', 'Numeric Lower Better', 'Timeline', 'Zero-based')),
    target_value NUMERIC(10, 2),
    target_date DATE,
    weightage NUMERIC(5, 2) NOT NULL CHECK (weightage >= 10),
    is_shared BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Goal Progress (Actuals & Check-ins)
CREATE TABLE IF NOT EXISTS goal_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    quarter VARCHAR(10) NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
    actual_value NUMERIC(10, 2),
    actual_date DATE,
    employee_comment TEXT,
    manager_comment TEXT,
    calculated_score NUMERIC(5, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(goal_id, quarter)
);

-- Audit Log Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    performed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Triggers to update updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_cycles
BEFORE UPDATE ON cycles
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_goal_sheets
BEFORE UPDATE ON goal_sheets
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_goals
BEFORE UPDATE ON goals
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_goal_progress
BEFORE UPDATE ON goal_progress
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Indexes for performance
CREATE INDEX idx_goal_sheets_employee ON goal_sheets(employee_id);
CREATE INDEX idx_goals_sheet ON goals(goal_sheet_id);
CREATE INDEX idx_goal_progress_goal ON goal_progress(goal_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_id);
