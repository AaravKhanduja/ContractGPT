export function validateEnv() {
  const required = ['OPENAI_API_KEY'];
  const missing: string[] = [];

  for (const var_name of required) {
    if (!process.env[var_name]) {
      missing.push(var_name);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

// Lazy environment variable access
export const env = {
  get NODE_ENV() {
    return process.env.NODE_ENV || 'development';
  },
  get OPENAI_API_KEY() {
    const value = process.env.OPENAI_API_KEY;
    if (!value) {
      throw new Error('Environment variable OPENAI_API_KEY is not set');
    }
    return value;
  },
  get NEXT_PUBLIC_APP_URL() {
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  },
  get DATABASE_URL() {
    return process.env.DATABASE_URL;
  },
  get SUPABASE_URL() {
    return process.env.SUPABASE_URL;
  },
  get SUPABASE_ANON_KEY() {
    return process.env.SUPABASE_ANON_KEY;
  },
} as const;

// Helper function to check if Supabase is configured
export function isSupabaseConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}
