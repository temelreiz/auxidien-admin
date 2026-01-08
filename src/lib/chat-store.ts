// lib/chat-store.ts
// Auxidien Chat Storage with Upstash Redis

import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error('Redis environment variables not configured');
    }
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  overridden?: boolean;
  originalContent?: string;
}

export interface ChatSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  userAgent?: string;
  ip?: string;
  status: 'active' | 'resolved' | 'flagged';
  notes?: string;
}

export interface ChatAnalytics {
  totalSessions: number;
  totalMessages: number;
  topQuestions: { question: string; count: number }[];
  flaggedCount: number;
  avgMessagesPerSession: number;
}

// ═══════════════════════════════════════════════════════════════
// CHAT OPERATIONS
// ═══════════════════════════════════════════════════════════════

export async function createSession(sessionId: string, userAgent?: string, ip?: string): Promise<ChatSession> {
  const session: ChatSession = {
    id: sessionId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
    userAgent,
    ip,
    status: 'active',
  };
  
  await getRedis().hset(`chat:${sessionId}`, {
    ...session,
    messages: JSON.stringify([]),
  });
  await getRedis().zadd('chat:sessions', { score: Date.now(), member: sessionId });
  await getRedis().incr('chat:stats:totalSessions');
  
  return session;
}

export async function getSession(sessionId: string): Promise<ChatSession | null> {
  const session = await getRedis().hgetall(`chat:${sessionId}`) as Record<string, any>;
  if (!session || Object.keys(session).length === 0) return null;
  
  return {
    ...session,
    messages: typeof session.messages === 'string' ? JSON.parse(session.messages) : session.messages || [],
  } as ChatSession;
}

export async function addMessage(sessionId: string, message: ChatMessage): Promise<void> {
  let session = await getSession(sessionId);
  if (!session) {
    session = await createSession(sessionId);
  }
  
  const messages = session?.messages || [];
  messages.push(message);
  
  await getRedis().hset(`chat:${sessionId}`, {
    messages: JSON.stringify(messages),
    updatedAt: new Date().toISOString(),
  });
  
  // Update session score for sorting
  await getRedis().zadd('chat:sessions', { score: Date.now(), member: sessionId });
  
  await getRedis().incr('chat:stats:totalMessages');
  
  // Track question for analytics
  if (message.role === 'user') {
    const questionKey = message.content.toLowerCase().slice(0, 100);
    await getRedis().zincrby('chat:questions', 1, questionKey);
  }
}

export async function overrideResponse(
  sessionId: string, 
  messageId: string, 
  newContent: string
): Promise<void> {
  const session = await getSession(sessionId);
  if (!session) return;
  
  const messages = session.messages.map(msg => {
    if (msg.id === messageId) {
      return {
        ...msg,
        originalContent: msg.content,
        content: newContent,
        overridden: true,
      };
    }
    return msg;
  });
  
  await getRedis().hset(`chat:${sessionId}`, {
    messages: JSON.stringify(messages),
    updatedAt: new Date().toISOString(),
  });
}

export async function updateSessionStatus(
  sessionId: string, 
  status: ChatSession['status'],
  notes?: string
): Promise<void> {
  const updates: Record<string, any> = {
    status,
    updatedAt: new Date().toISOString(),
  };
  if (notes !== undefined) {
    updates.notes = notes;
  }
  await getRedis().hset(`chat:${sessionId}`, updates);
}

export async function flagSession(sessionId: string, reason: string): Promise<void> {
  await updateSessionStatus(sessionId, 'flagged', reason);
  await getRedis().incr('chat:stats:flaggedCount');
}

// ═══════════════════════════════════════════════════════════════
// LIST & ANALYTICS
// ═══════════════════════════════════════════════════════════════

export async function listSessions(
  limit: number = 50, 
  offset: number = 0,
  status?: ChatSession['status']
): Promise<ChatSession[]> {
  const sessionIds = await getRedis().zrange('chat:sessions', offset, offset + limit - 1, { rev: true });
  
  const sessions: ChatSession[] = [];
  for (const id of sessionIds) {
    const session = await getSession(id as string);
    if (session) {
      if (!status || session.status === status) {
        sessions.push(session);
      }
    }
  }
  
  return sessions;
}

export async function getAnalytics(): Promise<ChatAnalytics> {
  const totalSessions = (await getRedis().get('chat:stats:totalSessions') as number) || 0;
  const totalMessages = (await getRedis().get('chat:stats:totalMessages') as number) || 0;
  const flaggedCount = (await getRedis().get('chat:stats:flaggedCount') as number) || 0;
  
  const topQuestionsRaw = await getRedis().zrange('chat:questions', 0, 9, { rev: true, withScores: true });
  
  const topQuestions: { question: string; count: number }[] = [];
  for (let i = 0; i < topQuestionsRaw.length; i += 2) {
    topQuestions.push({
      question: topQuestionsRaw[i] as string,
      count: topQuestionsRaw[i + 1] as number,
    });
  }
  
  return {
    totalSessions,
    totalMessages,
    topQuestions,
    flaggedCount,
    avgMessagesPerSession: totalSessions > 0 ? Math.round(totalMessages / totalSessions) : 0,
  };
}

export async function deleteSession(sessionId: string): Promise<void> {
  await getRedis().del(`chat:${sessionId}`);
  await getRedis().zrem('chat:sessions', sessionId);
}

export { getRedis as redis };
