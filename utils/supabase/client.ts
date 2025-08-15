// Client-side Supabase utility for development mode only
// In production, authentication is handled by your existing auth system

export const createClient = () => {
  // Only used in development mode
  if (process.env.NODE_ENV === 'development') {
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: (callback: any) => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
        signInWithPassword: async () => ({ data: { user: null }, error: null }),
        signUp: async () => ({ data: { user: null }, error: null }),
        signInWithOAuth: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
      },
    };
  }

  // In production, this should not be used
  throw new Error('Client-side Supabase is not used in production');
};
