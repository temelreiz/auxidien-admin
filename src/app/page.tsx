"use client";

import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { PortfolioOverview } from "@/components/PortfolioOverview";
import MetalPriceGrid from "@/components/MetalPriceGrid"; // Default import
import { ExchangeModal } from "@/components/ExchangeModal";
import { TransactionHistory } from "@/components/TransactionHistory";

export default function HomePage() {
  const [showExchange, setShowExchange] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <TopNav />

        <div className="space-y-8">
          {/* Portfolio Overview */}
          <PortfolioOverview 
            lang="en" 
            onExchangeClick={() => setShowExchange(true)}
          />

          {/* Transaction History */}
          <TransactionHistory lang="en" />

          {/* Metal Price Grid */}
          <MetalPriceGrid lang="en" />
        </div>
      </div>

      {/* Exchange Modal */}
      <ExchangeModal
        isOpen={showExchange}
        onClose={() => setShowExchange(false)}
        lang="en"
      />
    </main>
  );
}
