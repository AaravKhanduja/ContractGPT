import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Lazy Supabase client creation
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseAnonKey = env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      // Return a mock client for development when Supabase is not configured
      console.warn('Supabase not configured, using localStorage fallback');
      return null;
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseClient;
}

// Export the client for backward compatibility
export const supabase = getSupabaseClient();

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      contracts: {
        Row: {
          id: string;
          title: string;
          type: string;
          content: string;
          prompt: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          type: string;
          content: string;
          prompt: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          type?: string;
          content?: string;
          prompt?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
