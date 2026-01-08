// app/chat/page.tsx
// Auxidien Chat Admin Dashboard

'use client';

import { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Flag, 
  Check, 
  Trash2, 
  RefreshCw, 
  Search,
  BarChart3,
  Users,
  MessageSquare,
  AlertTriangle,
  Edit3,
  X,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  overridden?: boolean;
  originalContent?: string;
}

interface ChatSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  userAgent?: string;
  ip?: string;
  status: 'active' | 'resolved' | 'flagged';
  notes?: string;
}

interface Analytics {
  totalSessions: number;
  totalMessages: number;
  topQuestions: { question: string; count: number }[];
  flaggedCount: number;
  avgMessagesPerSession: number;
}

export default function ChatAdminDashboard() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved' | 'flagged'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const statusParam = filter !== 'all' ? `&status=${filter}` : '';
      const [sessionsRes, analyticsRes] = await Promise.all([
        fetch(`/api/admin/chat?limit=100${statusParam}`),
        fetch('/api/admin/chat?action=analytics'),
      ]);

      if (sessionsRes.ok) {
        const data = await sessionsRes.json();
        setSessions(data.sessions || []);
      }

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
    setLoading(false);
  };

  const updateStatus = async (sessionId: string, status: string) => {
    await fetch('/api/admin/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateStatus', sessionId, status }),
    });
    fetchData();
    if (selectedSession?.id === sessionId) {
      setSelectedSession({ ...selectedSession, status: status as any });
    }
  };

  const flagSessionHandler = async (sessionId: string) => {
    const reason = prompt('Reason for flagging:');
    if (reason) {
      await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'flag', sessionId, reason }),
      });
      fetchData();
    }
  };

  const deleteSessionHandler = async (sessionId: string) => {
    if (confirm('Delete this session permanently?')) {
      await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', sessionId }),
      });
      setSelectedSession(null);
      fetchData();
    }
  };

  const overrideResponse = async (sessionId: string, messageId: string) => {
    if (!editContent.trim()) return;
    
    await fetch('/api/admin/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'override', sessionId, messageId, content: editContent }),
    });
    setEditingMessage(null);
    setEditContent('');
    
    // Refresh session
    const res = await fetch(`/api/admin/chat?action=session&id=${sessionId}`);
    if (res.ok) {
      const session = await res.json();
      setSelectedSession(session);
    }
    fetchData();
  };

  const filteredSessions = sessions.filter(session => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return session.messages.some(m => m.content.toLowerCase().includes(searchLower));
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('tr-TR', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'flagged': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-auxi-dark text-white">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-auxi-gold" />
              <h1 className="text-xl font-semibold">Chat Admin</h1>
            </div>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-400">Total Sessions</span>
              </div>
              <p className="text-2xl font-bold">{analytics.totalSessions}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-400">Total Messages</span>
              </div>
              <p className="text-2xl font-bold">{analytics.totalMessages}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-gray-400">Avg/Session</span>
              </div>
              <p className="text-2xl font-bold">{analytics.avgMessagesPerSession}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-sm text-gray-400">Flagged</span>
              </div>
              <p className="text-2xl font-bold">{analytics.flaggedCount}</p>
            </div>
          </div>
        )}

        {/* Top Questions */}
        {analytics && analytics.topQuestions.length > 0 && (
          <div className="glass rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-auxi-gold" />
              Top Questions
            </h2>
            <div className="space-y-2">
              {analytics.topQuestions.slice(0, 5).map((q, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-gray-300 truncate flex-1">{q.question}</span>
                  <span className="text-sm text-auxi-gold ml-4">{q.count}x</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <div className="lg:col-span-1">
            {/* Filters */}
            <div className="mb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-auxi-gold/50"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'active', 'resolved', 'flagged'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      filter === f
                        ? 'bg-auxi-gold text-black'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Sessions */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : filteredSessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No sessions found</div>
              ) : (
                filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`glass rounded-xl p-4 cursor-pointer transition-all hover:bg-white/10 ${
                      selectedSession?.id === session.id ? 'ring-2 ring-auxi-gold' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(session.updatedAt)}</span>
                    </div>
                    <p className="text-sm text-gray-300 truncate">
                      {session.messages[0]?.content || 'No messages'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {session.messages.length} messages
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Session Detail */}
          <div className="lg:col-span-2">
            {selectedSession ? (
              <div className="glass rounded-xl">
                {/* Session Header */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(selectedSession.status)}`}>
                        {selectedSession.status}
                      </span>
                      <span className="text-sm text-gray-400">
                        {formatDate(selectedSession.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateStatus(selectedSession.id, 'resolved')}
                        className="p-2 rounded-lg hover:bg-green-500/20 text-green-400 transition-colors"
                        title="Mark Resolved"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => flagSessionHandler(selectedSession.id)}
                        className="p-2 rounded-lg hover:bg-amber-500/20 text-amber-400 transition-colors"
                        title="Flag"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSessionHandler(selectedSession.id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {selectedSession.notes && (
                    <p className="text-xs text-amber-400 mt-2">Note: {selectedSession.notes}</p>
                  )}
                </div>

                {/* Messages */}
                <div className="p-4 max-h-[500px] overflow-y-auto space-y-4">
                  {selectedSession.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl p-3 ${
                          message.role === 'user'
                            ? 'bg-blue-500/20 text-white'
                            : 'bg-white/5 text-gray-300'
                        }`}
                      >
                        {editingMessage === message.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full bg-black/30 rounded-lg p-2 text-sm resize-none"
                              rows={4}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => overrideResponse(selectedSession.id, message.id)}
                                className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingMessage(null);
                                  setEditContent('');
                                }}
                                className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {formatDate(message.timestamp)}
                              </span>
                              {message.role === 'assistant' && (
                                <div className="flex items-center gap-2">
                                  {message.overridden && (
                                    <span className="text-xs text-amber-400">Edited</span>
                                  )}
                                  <button
                                    onClick={() => {
                                      setEditingMessage(message.id);
                                      setEditContent(message.content);
                                    }}
                                    className="p-1 hover:bg-white/10 rounded transition-colors"
                                    title="Edit Response"
                                  >
                                    <Edit3 className="w-3 h-3 text-gray-400" />
                                  </button>
                                </div>
                              )}
                            </div>
                            {message.overridden && message.originalContent && (
                              <details className="mt-2">
                                <summary className="text-xs text-gray-500 cursor-pointer">
                                  Show original
                                </summary>
                                <p className="text-xs text-gray-600 mt-1 p-2 bg-black/20 rounded">
                                  {message.originalContent}
                                </p>
                              </details>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass rounded-xl p-8 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a session to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
