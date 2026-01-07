'use client';

import { METALS } from '@/config/contracts';

interface MetalPriceProps {
  prices: {
    gold: number;
    silver: number;
    platinum: number;
    palladium: number;
  };
  weights: {
    gold: number;
    silver: number;
    platinum: number;
    palladium: number;
  };
}

export function MetalPrices({ prices, weights }: MetalPriceProps) {
  const metals = [
    { key: 'gold', ...METALS.XAU, price: prices.gold, weight: weights.gold },
    { key: 'silver', ...METALS.XAG, price: prices.silver, weight: weights.silver },
    { key: 'platinum', ...METALS.XPT, price: prices.platinum, weight: weights.platinum },
    { key: 'palladium', ...METALS.XPD, price: prices.palladium, weight: weights.palladium },
  ];

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Metal Prices & Weights</h2>
      
      <div className="space-y-4">
        {metals.map((metal) => (
          <div key={metal.key} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            {/* Metal Info */}
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ backgroundColor: `${metal.color}20` }}
              >
                {metal.icon}
              </div>
              <div>
                <p className="font-medium text-white">{metal.name}</p>
                <p className="text-xs text-gray-400">{metal.symbol}/USD</p>
              </div>
            </div>

            {/* Price & Weight */}
            <div className="text-right">
              <p className="font-semibold text-white">
                ${metal.price.toFixed(4)}<span className="text-gray-500 text-sm">/g</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div 
                  className="h-1.5 rounded-full"
                  style={{ 
                    width: `${metal.weight * 100}px`,
                    backgroundColor: metal.color,
                  }}
                />
                <span className="text-xs text-gray-400">{(metal.weight * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weight Distribution Bar */}
      <div className="mt-6">
        <p className="text-sm text-gray-400 mb-2">Weight Distribution</p>
        <div className="h-4 rounded-full overflow-hidden flex">
          {metals.map((metal) => (
            <div
              key={metal.key}
              style={{ 
                width: `${metal.weight * 100}%`,
                backgroundColor: metal.color,
              }}
              className="h-full transition-all duration-500"
              title={`${metal.name}: ${(metal.weight * 100).toFixed(1)}%`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
