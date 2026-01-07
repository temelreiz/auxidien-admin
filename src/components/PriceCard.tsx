'use client';

import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { TrendingUp, TrendingDown, Clock, RefreshCw } from 'lucide-react';
import { CONTRACTS, ORACLE_ABI } from '@/config/contracts';

export function PriceCard() {
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);

  // Read AUXI price from Oracle
  const { data: priceE6, isLoading, refetch } = useReadContract({
    address: CONTRACTS.ORACLE as `0x${string}`,
    abi: ORACLE_ABI,
    functionName: 'getPricePerOzE6',
  });

  // Read last update time
  const { data: lastUpdateAt } = useReadContract({
    address: CONTRACTS.ORACLE as `0x${string}`,
    abi: ORACLE_ABI,
    functionName: 'lastUpdateAt',
  });

  const price = priceE6 ? Number(priceE6) / 1e6 : 0;
  const lastUpdate = lastUpdateAt ? new Date(Number(lastUpdateAt) * 1000) : null;

  useEffect(() => {
    if (price && lastPrice && lastPrice !== price) {
      const change = ((price - lastPrice) / lastPrice) * 100;
      setPriceChange(change);
    }
    if (price) {
      setLastPrice(price);
    }
  }, [price, lastPrice]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="glass rounded-2xl p-6 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-gray-400 text-sm font-medium">AUXI Index Price</h2>
          <p className="text-xs text-gray-500 mt-1">USD per gram</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Price */}
      <div className="flex items-end gap-3 mb-4">
        <span className="text-4xl font-bold text-gold-gradient">
          ${price.toFixed(4)}
        </span>
        {priceChange !== 0 && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
            priceChange >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{priceChange.toFixed(2)}%</span>
          </div>
        )}
      </div>

      {/* Last Update */}
      {lastUpdate && (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Clock className="w-4 h-4" />
          <span>Last updated: {formatTime(lastUpdate)}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !price && (
        <div className="animate-pulse">
          <div className="h-10 bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-24"></div>
        </div>
      )}
    </div>
  );
}
