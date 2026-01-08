// app/api/admin/auth/route.ts
// Admin Authentication API

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'auxidien2026';
const AUTH_COOKIE_NAME = 'auxidien_admin_auth';
const AUTH_TOKEN = 'authenticated_admin_session';

// POST /api/admin/auth - Login
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Set auth cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set(AUTH_COOKIE_NAME, AUTH_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/auth - Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}

// GET /api/admin/auth - Check auth status
export async function GET() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
  
  const isAuthenticated = authCookie?.value === AUTH_TOKEN;
  
  return NextResponse.json({ authenticated: isAuthenticated });
}
