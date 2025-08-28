import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // Check if we're in development mode
  const isDevMode = process.env.NODE_ENV === 'development';

  // In development mode, allow all requests (auth is handled client-side with localStorage)
  if (isDevMode) {
    return NextResponse.next({ request });
  }

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If no Supabase config, allow all requests
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request });
  }

  // Generate storage key from Supabase URL
  const url = new URL(supabaseUrl);
  const projectRef = url.hostname.split('.')[0];
  const storageKey = `sb-${projectRef}-auth-token`;

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, {
            ...options,
            domain: options?.domain || undefined,
            path: options?.path || '/',
            httpOnly: options?.httpOnly || false,
            secure: options?.secure || process.env.NODE_ENV === 'production',
            sameSite: options?.sameSite || 'lax',
          })
        );
      },
    },
  });

  // Check if Supabase auth cookie exists
  const authCookie = request.cookies.get(storageKey);

  // If no auth cookie, definitely no user
  if (!authCookie) {
    if (
      !request.nextUrl.pathname.startsWith('/auth/signin') &&
      !request.nextUrl.pathname.startsWith('/auth/signup') &&
      !request.nextUrl.pathname.startsWith('/error')
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/signin';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // If auth cookie exists, try to get user (with retry for race condition)
  let user = null;
  let retries = 0;
  const maxRetries = 2;

  while (retries < maxRetries) {
    try {
      const {
        data: { user: userData },
        error,
      } = await supabase.auth.getUser();
      if (!error && userData) {
        user = userData;
        break;
      }
      retries++;
      if (retries < maxRetries) {
        // Wait a bit before retrying (race condition)
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (error) {
      retries++;
      if (retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  // Protect routes that require authentication
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/auth/signin') &&
    !request.nextUrl.pathname.startsWith('/auth/signup') &&
    !request.nextUrl.pathname.startsWith('/error')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/signin';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
