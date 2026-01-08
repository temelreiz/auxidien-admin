// middleware.ts
// Protect admin routes

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'auxidien_admin_auth';
const AUTH_TOKEN = 'authenticated_admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/chat and /admin/chat/* routes
  if (pathname.startsWith('/admin/chat')) {
    const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
    
    if (authCookie?.value !== AUTH_TOKEN) {
      // Redirect to login
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/chat/:path*'],
};
