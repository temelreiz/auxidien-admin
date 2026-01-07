'use client';

import { Activity, Users, Wallet, BarChart3 } from 'lucide-react';

interface StatsGridProps {
  totalSupply: number;
  holders?: number;
  marketCap?: number;
  volume24h?: number;
}

export function StatsGrid({ totalSupply, holders = 0, marketCap = 0, volume24h = 0 }: StatsGridProps) {
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const stats = [
    {
      label: 'Total Supply',
      value: formatNumber(totalSupply),
      suffix: 'AUXI',
      icon: Wallet,
      color: 'text-auxi-gold',
      bgColor: 'bg-auxi-gold/10',
    },
    {
      label: 'Holders',
      value: holders > 0 ? formatNumber(holders) : '-',
      suffix: '',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Market Cap',
      value: marketCap > 0 ? `$${formatNumber(marketCap)}` : '-',
      suffix: '',
      icon: BarChart3,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: '24h Volume',
      value: volume24h > 0 ? `$${formatNumber(volume24h)}` : '-',
      suffix: '',
      icon: Activity,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="glass rounded-xl p-4 card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <span className="text-sm text-gray-400">{stat.label}</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stat.value}
            {stat.suffix && <span className="text-sm text-gray-400 ml-1">{stat.suffix}</span>}
          </p>
        </div>
      ))}
    </div>
  );
}
