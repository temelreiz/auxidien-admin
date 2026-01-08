'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="glass sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-auxi-gold to-orange-500 flex items-center justify-center">
            <span className="text-xl font-bold text-auxi-primary">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gold-gradient">AUXIDIEN</h1>
            <p className="text-xs text-gray-400">Admin Dashboard</p>
          </div>
        </div>

        {/* Status & Wallet */}
        <div className="flex items-center gap-4">
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
        </div>
      </div>
    </header>
  );
}
