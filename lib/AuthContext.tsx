'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Development mode user type
interface DevUser {
  id: string;
  email: string;
  user_metadata?: { name?: string };
}

// Singleton Supabase client
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

const getSupabaseClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase environment variables not configured');
    }

    // Generate storage key from Supabase URL
    const url = new URL(supabaseUrl);
    const projectRef = url.hostname.split('.')[0];
    const storageKey = `sb-${projectRef}-auth-token`;

    supabaseClient = createBrowserClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey,
        flowType: 'pkce',
      },
    });
  }
  return supabaseClient!;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  const isDevMode = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (isDevMode) {
      // Development mode: check localStorage
      const storedUser = localStorage.getItem('dev-user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setUser(user as User);
        } catch {
          // Invalid stored user
        }
      }
      setLoading(false);
    } else {
      // Production mode: initialize Supabase
      const supabase = getSupabaseClient();

      // Get initial session
      supabase.auth
        .getSession()
        .then(({ data: { session } }: { data: { session: Session | null } }) => {
          setUser(session?.user ?? null);
          setLoading(false);
        });

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event: string, session: Session | null) => {
        setUser(session?.user ?? null);
      });

      subscriptionRef.current = subscription;
    }
  }, [isDevMode]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (isDevMode) {
        // Development mode: check localStorage
        const storedUser = localStorage.getItem('dev-user');
        const storedPassword = localStorage.getItem('dev-password');

        if (!storedUser || !storedPassword) {
          return { error: new Error('User not found') };
        }

        try {
          const user = JSON.parse(storedUser);
          if (user.email !== email || storedPassword !== password) {
            return { error: new Error('Invalid credentials') };
          }

          setUser(user as User);
          return { error: null };
        } catch {
          return { error: new Error('Invalid stored user data') };
        }
      } else {
        // Production mode: use Supabase
        try {
          const supabase = getSupabaseClient();
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            return { error: new Error(error.message) };
          }

          setUser(data.user);
          return { error: null };
        } catch (error) {
          return { error: new Error('Failed to sign in') };
        }
      }
    },
    [isDevMode]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      if (isDevMode) {
        // Development mode: validate and store in localStorage
        if (!email || !password) {
          return { error: new Error('Email and password are required') };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return { error: new Error('Invalid email format') };
        }

        if (password.length < 6) {
          return { error: new Error('Password must be at least 6 characters') };
        }

        // Check if user already exists
        const existingUser = localStorage.getItem('dev-user');
        if (existingUser) {
          try {
            const parsed = JSON.parse(existingUser);
            if (parsed.email === email) {
              return { error: new Error('User already exists') };
            }
          } catch {
            // Invalid stored user, continue
          }
        }

        // Create dev user
        const devUser: DevUser = {
          id: 'dev-user-' + Date.now(),
          email,
          user_metadata: { name: email.split('@')[0] },
        };

        localStorage.setItem('dev-user', JSON.stringify(devUser));
        localStorage.setItem('dev-password', password);

        return { error: null };
      } else {
        // Production mode: use Supabase
        try {
          const supabase = getSupabaseClient();
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) {
            return { error: new Error(error.message) };
          }

          return { error: null };
        } catch (error) {
          return { error: new Error('Failed to sign up') };
        }
      }
    },
    [isDevMode]
  );

  const signInWithGoogle = useCallback(async () => {
    if (isDevMode) {
      // Development mode: simulate Google sign-in
      const devUser: DevUser = {
        id: 'dev-google-user-' + Date.now(),
        email: 'dev-user@example.com',
        user_metadata: { name: 'Dev User' },
      };

      setUser(devUser as User);
      return { error: null };
    } else {
      // Production mode: use Supabase Google OAuth
      try {
        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          return { error: new Error(error.message) };
        }

        return { error: null };
      } catch (error) {
        return { error: new Error('Failed to sign in with Google') };
      }
    }
  }, [isDevMode]);

  const signOut = useCallback(async () => {
    if (isDevMode) {
      // Development mode: clear localStorage
      localStorage.removeItem('dev-user');
      localStorage.removeItem('dev-password');
      setUser(null);
    } else {
      // Production mode: use Supabase sign out
      try {
        const supabase = getSupabaseClient();
        await supabase.auth.signOut();
        setUser(null);
      } catch (error) {
        console.error('Failed to sign out:', error);
      }
    }
  }, [isDevMode]);

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
