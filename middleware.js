import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // All routes except: _next/static, _next/image, favicon, public assets
    '/((?!_next/static|_next/image|favicon.ico|pics/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
