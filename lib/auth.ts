import { getSupabaseClient } from './supabase';

// ============================================================================
// AUTHENTICATION UTILITIES
// ============================================================================

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

// Sign up with email and password
export async function signUp(email: string, password: string, name?: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    throw new Error(`Sign up failed: ${error.message}`);
  }

  return data;
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Sign in failed: ${error.message}`);
  }

  return data;
}

// Sign in with Google OAuth
export async function signInWithGoogle() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(`Google sign in failed: ${error.message}`);
  }

  return data;
}

// Sign out
export async function signOut() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`Sign out failed: ${error.message}`);
  }
}

// Get current user
export async function getCurrentUser() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null; // Return null if Supabase is not configured
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }

  return user;
}

// Check if user is authenticated
export async function isAuthenticated() {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch {
    return false;
  }
}

// Get user session
export async function getSession() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null; // Return null if Supabase is not configured
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(`Failed to get session: ${error.message}`);
  }

  return session;
}
