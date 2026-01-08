import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Korumalı sayfalar sadece /dashboard ve /chat
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/chat')) {
    const authCookie = request.cookies.get('auxidien_admin_auth');
    
    if (authCookie?.value !== 'authenticated_admin_session') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/chat/:path*'],
};
