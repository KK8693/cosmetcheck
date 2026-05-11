-- Batch Processing Tables for Pro Feature
-- Created: 2026-05-09

-- Batch tasks table
CREATE TABLE IF NOT EXISTS batch_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    task_type VARCHAR(20) NOT NULL CHECK (task_type IN ('detect', 'generate')),
    total_count INTEGER NOT NULL DEFAULT 0,
    completed_count INTEGER DEFAULT 0,
    passed_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    critical_count INTEGER DEFAULT 0,
    warning_count INTEGER DEFAULT 0,
    info_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Batch results table
CREATE TABLE IF NOT EXISTS batch_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES batch_tasks(id) ON DELETE CASCADE,
    row_index INTEGER NOT NULL,
    product_id VARCHAR(100),
    original_text TEXT NOT NULL,
    country VARCHAR(10) NOT NULL CHECK (country IN ('BR', 'MX', 'AR', 'CL', 'CO')),
    is_compliant BOOLEAN DEFAULT true,
    violations JSONB DEFAULT '[]'::jsonb,
    compliant_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_batch_tasks_user_id ON batch_tasks(user_id);
CREATE INDEX idx_batch_tasks_status ON batch_tasks(status);
CREATE INDEX idx_batch_results_task_id ON batch_results(task_id);

-- Enable RLS
ALTER TABLE batch_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for batch_tasks
CREATE POLICY "Users can view own batch tasks" ON batch_tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create batch tasks" ON batch_tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own batch tasks" ON batch_tasks
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for batch_results
CREATE POLICY "Users can view own batch results" ON batch_results
    FOR SELECT USING (
        task_id IN (SELECT id FROM batch_tasks WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can create batch results" ON batch_results
    FOR INSERT WITH CHECK (
        task_id IN (SELECT id FROM batch_tasks WHERE user_id = auth.uid())
    );