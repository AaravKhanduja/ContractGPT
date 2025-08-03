'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { getSupabaseClient } from './supabase';
import { getCurrentUser } from './auth';

// ============================================================================
// AUTH HOOKS FOR REACT
// ============================================================================

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    getCurrentUser()
      .then((user) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    // Listen for auth changes
    const supabase = getSupabaseClient();
    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  return { user, loading };
}

// ============================================================================
// PROTECTED ROUTE COMPONENT
// ============================================================================

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

// ============================================================================
// AUTH STATUS COMPONENT
// ============================================================================

export function AuthStatus() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <span>Welcome, {user.email}</span>
        <button
          onClick={() => {
            const supabase = getSupabaseClient();
            if (supabase) {
              supabase.auth.signOut();
            }
          }}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div>
      <a href="/auth/signin" className="text-sm text-gray-600 hover:text-gray-800">
        Sign in
      </a>
    </div>
  );
}
