'use client';

import { useReadContract } from 'wagmi';
import { Header } from '@/components/Header';
import { PriceCard } from '@/components/PriceCard';
import { MetalPrices } from '@/components/MetalPrices';
import { TokenInfo } from '@/components/TokenInfo';
import { VestingStatus } from '@/components/VestingStatus';
import { StatsGrid } from '@/components/StatsGrid';
import { CONTRACTS, ORACLE_ABI, TOKEN_INFO } from '@/config/contracts';

export default function Dashboard() {
  // Read metal prices from Oracle
  const { data: goldPriceE6 } = useReadContract({
    address: CONTRACTS.ORACLE as `0x${string}`,
    abi: ORACLE_ABI,
    functionName: 'goldPrice',
  });

  const { data: silverPriceE6 } = useReadContract({
    address: CONTRACTS.ORACLE as `0x${string}`,
    abi: ORACLE_ABI,
    functionName: 'silverPrice',
  });

  const { data: platinumPriceE6 } = useReadContract({
    address: CONTRACTS.ORACLE as `0x${string}`,
    abi: ORACLE_ABI,
    functionName: 'platinumPrice',
  });

  const { data: palladiumPriceE6 } = useReadContract({
    address: CONTRACTS.ORACLE as `0x${string}`,
    abi: ORACLE_ABI,
    functionName: 'palladiumPrice',
  });

  // Convert prices from E6 format
  const prices = {
    gold: goldPriceE6 ? Number(goldPriceE6) / 1e6 : 144.58,
    silver: silverPriceE6 ? Number(silverPriceE6) / 1e6 : 2.61,
    platinum: platinumPriceE6 ? Number(platinumPriceE6) / 1e6 : 78.54,
    palladium: palladiumPriceE6 ? Number(palladiumPriceE6) / 1e6 : 58.68,
  };

  // Default weights (from preprocessor)
  const weights = {
    gold: 0.4449,
    silver: 0.2193,
    platinum: 0.1858,
    palladium: 0.1500,
  };

  // Mock vesting data (would come from contract in production)
  const vestingSchedules = [
    {
      beneficiary: '0x7bb286a8C876aC6283Dd0B95d8ec853bbDb20378',
      totalAmount: 5_000_000,
      releasedAmount: 0,
      startTime: new Date('2026-02-05'),
      cliffTime: new Date('2026-08-04'),
      endTime: new Date('2029-02-04'),
    },
    {
      beneficiary: '0x7bb286a8C876aC6283Dd0B95d8ec853bbDb20378',
      totalAmount: 5_000_000,
      releasedAmount: 0,
      startTime: new Date('2026-02-05'),
      cliffTime: new Date('2026-08-04'),
      endTime: new Date('2029-02-04'),
    },
    {
      beneficiary: '0x7bb286a8C876aC6283Dd0B95d8ec853bbDb20378',
      totalAmount: 5_000_000,
      releasedAmount: 0,
      startTime: new Date('2026-02-05'),
      cliffTime: new Date('2026-08-04'),
      endTime: new Date('2029-02-04'),
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gold-gradient mb-2">
            Auxidien Index
          </h1>
          <p className="text-gray-400">
            Volatility-Weighted Precious Metals Index Token
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8">
          <StatsGrid totalSupply={TOKEN_INFO.totalSupply} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Price Card */}
          <div className="lg:col-span-1">
            <PriceCard />
          </div>

          {/* Middle Column - Metal Prices */}
          <div className="lg:col-span-2">
            <MetalPrices prices={prices} weights={weights} />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Token Info */}
          <TokenInfo />

          {/* Vesting Status */}
          <VestingStatus schedules={vestingSchedules} />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Auxidien Index Token © 2026 | BSC Mainnet</p>
          <div className="flex justify-center gap-4 mt-2">
            <a 
              href={`https://bscscan.com/token/${CONTRACTS.AUXI_TOKEN}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-auxi-gold transition-colors"
            >
              BscScan
            </a>
            <span>•</span>
            <a 
              href="#"
              className="hover:text-auxi-gold transition-colors"
            >
              Documentation
            </a>
            <span>•</span>
            <a 
              href="#"
              className="hover:text-auxi-gold transition-colors"
            >
              GitHub
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
