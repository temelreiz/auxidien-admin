// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ana sayfa (login), API ve static dosyalar açık
  if (
    pathname === '/' || 
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Diğer tüm sayfalar korumalı (/dashboard, /chat vs.)
  const authCookie = request.cookies.get('auxidien_admin_auth');
  
  if (authCookie?.value !== 'authenticated_admin_session') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
