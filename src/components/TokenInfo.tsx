'use client';

import { Copy, ExternalLink, Check } from 'lucide-react';
import { useState } from 'react';
import { CONTRACTS, TOKEN_INFO, TOKENOMICS } from '@/config/contracts';

export function TokenInfo() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const tokenomicsData = [
    { ...TOKENOMICS.public, color: '#22c55e' },     // green
    { ...TOKENOMICS.treasury, color: '#3b82f6' },   // blue
    { ...TOKENOMICS.liquidity, color: '#8b5cf6' },  // purple
    { ...TOKENOMICS.team, color: '#f59e0b' },       // amber
    { ...TOKENOMICS.advisors, color: '#ec4899' },   // pink
  ];

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Token Information</h2>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 rounded-xl bg-white/5">
          <p className="text-xs text-gray-400">Name</p>
          <p className="font-medium text-white">{TOKEN_INFO.name}</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <p className="text-xs text-gray-400">Symbol</p>
          <p className="font-medium text-gold-gradient">{TOKEN_INFO.symbol}</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <p className="text-xs text-gray-400">Total Supply</p>
          <p className="font-medium text-white">{formatNumber(TOKEN_INFO.totalSupply)}</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <p className="text-xs text-gray-400">Decimals</p>
          <p className="font-medium text-white">{TOKEN_INFO.decimals}</p>
        </div>
      </div>

      {/* Contract Addresses */}
      <div className="space-y-3 mb-6">
        <p className="text-sm text-gray-400">Contract Addresses</p>
        
        {Object.entries(CONTRACTS).map(([name, address]) => (
          <div key={name} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div>
              <p className="text-xs text-gray-400">{name.replace('_', ' ')}</p>
              <p className="font-mono text-sm text-white">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(address, name)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                title="Copy address"
              >
                {copied === name ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <a
                href={`https://bscscan.com/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                title="View on BscScan"
              >
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Tokenomics */}
      <div>
        <p className="text-sm text-gray-400 mb-3">Tokenomics</p>
        
        {/* Pie Chart Representation */}
        <div className="h-4 rounded-full overflow-hidden flex mb-4">
          {tokenomicsData.map((item) => (
            <div
              key={item.label}
              style={{ 
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
              className="h-full"
              title={`${item.label}: ${item.percentage}%`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2">
          {tokenomicsData.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-400">
                {item.label} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
