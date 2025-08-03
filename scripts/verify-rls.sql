-- RLS Verification Script for ContractGPT
-- Run this in your Supabase SQL editor to verify RLS is properly configured

-- ============================================================================
-- VERIFY RLS IS ENABLED ON ALL TABLES
-- ============================================================================

SELECT 
    'RLS Status Check' as check_type,
    schemaname,
    tablename,
    CASE 
        WHEN rowsecurity = true THEN '✅ RLS ENABLED'
        ELSE '❌ RLS DISABLED'
    END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'contracts')
ORDER BY tablename;

-- ============================================================================
-- VERIFY ALL POLICIES ARE IN PLACE
-- ============================================================================

SELECT 
    'Policy Check' as check_type,
    tablename,
    policyname,
    cmd as operation,
    CASE 
        WHEN qual IS NOT NULL THEN '✅ USING clause present'
        ELSE '❌ No USING clause'
    END as using_status,
    CASE 
        WHEN with_check IS NOT NULL THEN '✅ WITH CHECK clause present'
        ELSE '⚠️  No WITH CHECK clause'
    END as with_check_status
FROM pg_policies 
WHERE schemaname = 'public'
    AND tablename IN ('users', 'contracts')
ORDER BY tablename, policyname;

-- ============================================================================
-- VERIFY POLICY COVERAGE
-- ============================================================================

-- Check if all CRUD operations are covered for users table
SELECT 
    'Users Table Policy Coverage' as check_type,
    'SELECT' as operation,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
                AND tablename = 'users' 
                AND cmd = 'SELECT'
        ) THEN '✅ Policy exists'
        ELSE '❌ Missing policy'
    END as status
UNION ALL
SELECT 
    'Users Table Policy Coverage' as check_type,
    'INSERT' as operation,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
                AND tablename = 'users' 
                AND cmd = 'INSERT'
        ) THEN '✅ Policy exists'
        ELSE '❌ Missing policy'
    END as status
UNION ALL
SELECT 
    'Users Table Policy Coverage' as check_type,
    'UPDATE' as operation,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
                AND tablename = 'users' 
                AND cmd = 'UPDATE'
        ) THEN '✅ Policy exists'
        ELSE '❌ Missing policy'
    END as status
UNION ALL
SELECT 
    'Users Table Policy Coverage' as check_type,
    'DELETE' as operation,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
                AND tablename = 'users' 
                AND cmd = 'DELETE'
        ) THEN '✅ Policy exists'
        ELSE '❌ Missing policy'
    END as status;

-- Check if all CRUD operations are covered for contracts table
SELECT 
    'Contracts Table Policy Coverage' as check_type,
    'SELECT' as operation,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
                AND tablename = 'contracts' 
                AND cmd = 'SELECT'
        ) THEN '✅ Policy exists'
        ELSE '❌ Missing policy'
    END as status
UNION ALL
SELECT 
    'Contracts Table Policy Coverage' as check_type,
    'INSERT' as operation,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
                AND tablename = 'contracts' 
                AND cmd = 'INSERT'
        ) THEN '✅ Policy exists'
        ELSE '❌ Missing policy'
    END as status
UNION ALL
SELECT 
    'Contracts Table Policy Coverage' as check_type,
    'UPDATE' as operation,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
                AND tablename = 'contracts' 
                AND cmd = 'UPDATE'
        ) THEN '✅ Policy exists'
        ELSE '❌ Missing policy'
    END as status
UNION ALL
SELECT 
    'Contracts Table Policy Coverage' as check_type,
    'DELETE' as operation,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
                AND tablename = 'contracts' 
                AND cmd = 'DELETE'
        ) THEN '✅ Policy exists'
        ELSE '❌ Missing policy'
    END as status;

-- ============================================================================
-- SECURITY SUMMARY
-- ============================================================================

SELECT 
    'Security Summary' as summary_type,
    COUNT(*) as total_tables,
    COUNT(CASE WHEN rowsecurity = true THEN 1 END) as tables_with_rls,
    COUNT(CASE WHEN rowsecurity = false THEN 1 END) as tables_without_rls
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'contracts');

SELECT 
    'Policy Summary' as summary_type,
    tablename,
    COUNT(*) as total_policies,
    COUNT(CASE WHEN cmd = 'SELECT' THEN 1 END) as select_policies,
    COUNT(CASE WHEN cmd = 'INSERT' THEN 1 END) as insert_policies,
    COUNT(CASE WHEN cmd = 'UPDATE' THEN 1 END) as update_policies,
    COUNT(CASE WHEN cmd = 'DELETE' THEN 1 END) as delete_policies
FROM pg_policies 
WHERE schemaname = 'public'
    AND tablename IN ('users', 'contracts')
GROUP BY tablename
ORDER BY tablename; 