import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Must run before any Supabase call — refreshes the session if expired.
  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Protect /me and /admin routes
  if (!user && (path.startsWith('/me') || path.startsWith('/admin') || path.startsWith('/learn'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }

  // Admin gate (lightweight — full DB check happens in the page)
  if (user && path.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/me';
      url.searchParams.set('error', 'admin-only');
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
