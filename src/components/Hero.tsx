'use client';

import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="hero-bg min-h-screen flex items-center pt-20">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm text-auxi-gold">Live on BSC Mainnet</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">The Future of</span>
              <br />
              <span className="text-gold-gradient">Precious Metals</span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              AUXI is a volatility-weighted index token backed by Gold, Silver, 
              Platinum, and Palladium. Smart, stable, and transparent.
            </p>

            {/* Live Price */}
            <div className="glass-gold rounded-2xl p-6 mb-8 inline-block">
              <p className="text-sm text-gray-400 mb-1">AUXI Index Price</p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-gold-gradient">$88.30</span>
                <span className="text-gray-500">/gram</span>
                <span className="flex items-center gap-1 text-green-500 text-sm">
                  <TrendingUp size={16} />
                  +2.4%
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <a href="#about" className="btn-primary flex items-center gap-2">
                Learn More
                <ArrowRight size={20} />
              </a>
              <a 
                href="https://bscscan.com/token/0x03e5FD0dfc9755f070BA420Ae364c452C1aFbd36"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                View Contract
              </a>
            </div>
          </div>

          {/* Right Content - Metal Orbs */}
          <div className="relative h-[500px] hidden lg:block">
            {/* Gold Orb */}
            <div className="absolute top-10 left-20 floating">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-2xl gold-glow flex items-center justify-center">
                <span className="text-3xl">🥇</span>
              </div>
              <p className="text-center mt-3 text-sm text-gray-400">Gold</p>
            </div>

            {/* Silver Orb */}
            <div className="absolute top-40 right-20 floating floating-delay-1">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-2xl flex items-center justify-center">
                <span className="text-2xl">🥈</span>
              </div>
              <p className="text-center mt-3 text-sm text-gray-400">Silver</p>
            </div>

            {/* Platinum Orb */}
            <div className="absolute bottom-40 left-10 floating floating-delay-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-2xl flex items-center justify-center">
                <span className="text-xl">⚪</span>
              </div>
              <p className="text-center mt-3 text-sm text-gray-400">Platinum</p>
            </div>

            {/* Palladium Orb */}
            <div className="absolute bottom-20 right-40 floating">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 shadow-2xl flex items-center justify-center">
                <span className="text-lg">🔘</span>
              </div>
              <p className="text-center mt-3 text-sm text-gray-400">Palladium</p>
            </div>

            {/* Center AUXI Logo */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-44 h-44 rounded-full bg-auxi-dark/80 shadow-2xl gold-glow flex items-center justify-center p-4">
                <img src="/favicon.png" alt="AUXI" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {[
            { icon: Shield, label: 'Backed Assets', value: '4 Metals' },
            { icon: TrendingUp, label: 'Total Supply', value: '100M AUXI' },
            { icon: Zap, label: 'Update Frequency', value: '5 Minutes' },
            { icon: Shield, label: 'Network', value: 'BSC Mainnet' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center card-hover">
              <stat.icon className="w-8 h-8 text-auxi-gold mx-auto mb-3" />
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
