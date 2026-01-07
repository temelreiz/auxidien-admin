'use client';

import { Lock, Unlock, Calendar, Clock } from 'lucide-react';

interface VestingSchedule {
  beneficiary: string;
  totalAmount: number;
  releasedAmount: number;
  startTime: Date;
  cliffTime: Date;
  endTime: Date;
}

interface VestingStatusProps {
  schedules: VestingSchedule[];
}

export function VestingStatus({ schedules }: VestingStatusProps) {
  const now = new Date();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getVestingProgress = (schedule: VestingSchedule) => {
    if (now < schedule.cliffTime) return 0;
    if (now >= schedule.endTime) return 100;
    
    const totalDuration = schedule.endTime.getTime() - schedule.cliffTime.getTime();
    const elapsed = now.getTime() - schedule.cliffTime.getTime();
    return Math.min(100, (elapsed / totalDuration) * 100);
  };

  const getStatus = (schedule: VestingSchedule) => {
    if (now < schedule.startTime) return { label: 'Not Started', color: 'text-gray-400' };
    if (now < schedule.cliffTime) return { label: 'Cliff Period', color: 'text-yellow-500' };
    if (now >= schedule.endTime) return { label: 'Fully Vested', color: 'text-green-500' };
    return { label: 'Vesting', color: 'text-blue-500' };
  };

  const totalLocked = schedules.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalReleased = schedules.reduce((sum, s) => sum + s.releasedAmount, 0);

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Team Vesting</h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Lock className="w-4 h-4" />
          <span>{formatNumber(totalLocked - totalReleased)} AUXI locked</span>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white/5">
          <div className="flex items-center gap-2 text-yellow-500 mb-2">
            <Lock className="w-5 h-5" />
            <span className="text-sm">Total Allocated</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatNumber(totalLocked)}</p>
          <p className="text-xs text-gray-400">AUXI</p>
        </div>
        <div className="p-4 rounded-xl bg-white/5">
          <div className="flex items-center gap-2 text-green-500 mb-2">
            <Unlock className="w-5 h-5" />
            <span className="text-sm">Released</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatNumber(totalReleased)}</p>
          <p className="text-xs text-gray-400">AUXI</p>
        </div>
      </div>

      {/* Schedules */}
      <div className="space-y-4">
        {schedules.map((schedule, index) => {
          const progress = getVestingProgress(schedule);
          const status = getStatus(schedule);
          
          return (
            <div key={index} className="p-4 rounded-xl bg-white/5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-400">Beneficiary #{index + 1}</p>
                  <p className="font-mono text-sm text-white">
                    {schedule.beneficiary.slice(0, 6)}...{schedule.beneficiary.slice(-4)}
                  </p>
                </div>
                <span className={`text-sm ${status.color}`}>{status.label}</span>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{formatNumber(schedule.releasedAmount)} released</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-auxi-gold to-orange-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Cliff: {formatDate(schedule.cliffTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>End: {formatDate(schedule.endTime)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
