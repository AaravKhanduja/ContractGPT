-- ContractGPT Database Setup with Comprehensive RLS
-- Run this in your Supabase SQL editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create contracts table (uses Supabase Auth users)
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    prompt TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_created_at ON contracts(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) CONFIGURATION
-- ============================================================================

-- Enable RLS on contracts table
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "Users can view own contracts" ON contracts;
DROP POLICY IF EXISTS "Users can insert own contracts" ON contracts;
DROP POLICY IF EXISTS "Users can update own contracts" ON contracts;
DROP POLICY IF EXISTS "Users can delete own contracts" ON contracts;

-- ============================================================================
-- CONTRACTS TABLE POLICIES
-- ============================================================================

-- Users can only view their own contracts
CREATE POLICY "Users can view own contracts" ON contracts
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert contracts for themselves
CREATE POLICY "Users can insert own contracts" ON contracts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own contracts
CREATE POLICY "Users can update own contracts" ON contracts
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own contracts
CREATE POLICY "Users can delete own contracts" ON contracts
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- ADDITIONAL SECURITY MEASURES
-- ============================================================================

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify RLS is enabled on contracts table
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename = 'contracts';

-- List all policies for verification
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname; 