// middleware.ts
// Protect ALL admin routes except login

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login sayfası ve API hariç her şeyi koru
  if (pathname === '/login' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Auth kontrolü
  const authCookie = request.cookies.get('auxidien_admin_auth');
  
  if (authCookie?.value !== 'authenticated_admin_session') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.png|.*\\.ico).*)'],
};
