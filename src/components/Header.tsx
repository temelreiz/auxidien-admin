'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Activity, MessageCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/');
  };

  return (
    <header className="glass sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center">
          <img src="/logo.png" alt="Auxidien" className="h-10" />
        </Link>

        {/* Status & Wallet */}
        <div className="flex items-center gap-4">
          {/* Chat Link */}
          <Link 
            href="/chat"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-auxi-gold/10 border border-auxi-gold/30 hover:bg-auxi-gold/20 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-auxi-gold" />
            <span className="text-sm text-auxi-gold">Chat</span>
          </Link>

          {/* Live Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
            <Activity className="w-4 h-4 text-green-500 live-pulse" />
            <span className="text-sm text-green-500">Live</span>
          </div>

          {/* Network Badge */}
          <div className="px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30">
            <span className="text-sm text-yellow-500">BSC Mainnet</span>
          </div>

          {/* Wallet Connect */}
          <ConnectButton 
            showBalance={false}
            chainStatus="icon"
            accountStatus="address"
          />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
