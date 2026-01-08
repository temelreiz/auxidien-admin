// app/api/admin/chat/route.ts
// Admin API for chat management

import { NextRequest, NextResponse } from 'next/server';
import { 
  listSessions, 
  getSession, 
  updateSessionStatus, 
  overrideResponse,
  deleteSession,
  getAnalytics,
  flagSession 
} from '@/lib/chat-store';

// GET /api/admin/chat - List sessions or get analytics
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  try {
    if (action === 'analytics') {
      const analytics = await getAnalytics();
      return NextResponse.json(analytics);
    }
    
    if (action === 'session') {
      const sessionId = searchParams.get('id');
      if (!sessionId) {
        return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
      }
      const session = await getSession(sessionId);
      return NextResponse.json(session);
    }
    
    // Default: list sessions
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status') as 'active' | 'resolved' | 'flagged' | undefined;
    
    const sessions = await listSessions(limit, offset, status || undefined);
    return NextResponse.json({ sessions, count: sessions.length });
  } catch (error) {
    console.error('Admin API GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/chat - Actions on sessions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sessionId, messageId, content, status, reason, notes } = body;

    switch (action) {
      case 'override':
        if (!sessionId || !messageId || !content) {
          return NextResponse.json({ error: 'sessionId, messageId, and content required' }, { status: 400 });
        }
        await overrideResponse(sessionId, messageId, content);
        return NextResponse.json({ success: true, message: 'Response overridden' });

      case 'updateStatus':
        if (!sessionId || !status) {
          return NextResponse.json({ error: 'sessionId and status required' }, { status: 400 });
        }
        await updateSessionStatus(sessionId, status, notes);
        return NextResponse.json({ success: true, message: 'Status updated' });

      case 'flag':
        if (!sessionId || !reason) {
          return NextResponse.json({ error: 'sessionId and reason required' }, { status: 400 });
        }
        await flagSession(sessionId, reason);
        return NextResponse.json({ success: true, message: 'Session flagged' });

      case 'delete':
        if (!sessionId) {
          return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
        }
        await deleteSession(sessionId);
        return NextResponse.json({ success: true, message: 'Session deleted' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin API POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
