import React from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { TrendingUp, Activity, Zap, Target } from 'lucide-react';

export default function Analytics() {
  const monthlyVolume = [
    { month: 'JAN', volume: 245000 },
    { month: 'FEB', volume: 280000 },
    { month: 'MAR', volume: 310000 },
    { month: 'APR', volume: 295000 },
    { month: 'MAY', volume: 350000 },
  ];

  const muscleGroups = [
    { name: 'Chest', percentage: 18, color: '#00D4FF' },
    { name: 'Back', percentage: 22, color: '#10B981' },
    { name: 'Legs', percentage: 28, color: '#F59E0B' },
    { name: 'Shoulders', percentage: 15, color: '#3B82F6' },
    { name: 'Arms', percentage: 12, color: '#9D4EDD' },
    { name: 'Core', percentage: 5, color: '#F43F5E' },
  ];

  return (
    <div className="min-h-screen p-8">
      <TacticalHeader title="PERFORMANCE ANALYTICS" subtitle="COMPREHENSIVE TRAINING INSIGHTS" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <TacticalCard>
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5" style={{ color: '#00D4FF' }} />
            <span className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>TOTAL VOLUME</span>
          </div>
          <div className="font-mono font-bold text-3xl" style={{ color: '#00D4FF' }}>1.48M</div>
          <div className="font-mono text-xs mt-1" style={{ color: 'rgba(0, 212, 255, 0.4)' }}>lbs this year</div>
        </TacticalCard>

        <TacticalCard>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5" style={{ color: '#10B981' }} />
            <span className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>WORKOUTS</span>
          </div>
          <div className="font-mono font-bold text-3xl" style={{ color: '#10B981' }}>247</div>
          <div className="font-mono text-xs mt-1" style={{ color: 'rgba(0, 212, 255, 0.4)' }}>sessions total</div>
        </TacticalCard>

        <TacticalCard>
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5" style={{ color: '#F59E0B' }} />
            <span className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>AVG INTENSITY</span>
          </div>
          <div className="font-mono font-bold text-3xl" style={{ color: '#F59E0B' }}>87%</div>
          <div className="font-mono text-xs mt-1" style={{ color: 'rgba(0, 212, 255, 0.4)' }}>effort level</div>
        </TacticalCard>

        <TacticalCard>
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5" style={{ color: '#3B82F6' }} />
            <span className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>PRS HIT</span>
          </div>
          <div className="font-mono font-bold text-3xl" style={{ color: '#3B82F6' }}>24</div>
          <div className="font-mono text-xs mt-1" style={{ color: 'rgba(0, 212, 255, 0.4)' }}>new records</div>
        </TacticalCard>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <TacticalCard>
          <div className="mb-4">
            <div className="font-mono font-bold text-sm mb-1" style={{ color: '#00D4FF' }}>MONTHLY VOLUME PROGRESSION</div>
          </div>
          <div className="space-y-3">
            {monthlyVolume.map((data) => {
              const maxVolume = Math.max(...monthlyVolume.map(d => d.volume));
              const percentage = (data.volume / maxVolume) * 100;
              return (
                <div key={data.month}>
                  <div className="flex justify-between mb-1">
                    <span className="font-mono text-xs" style={{ color: '#00D4FF' }}>{data.month}</span>
                    <span className="font-mono text-xs font-bold" style={{ color: '#00D4FF' }}>{(data.volume / 1000).toFixed(0)}K lbs</span>
                  </div>
                  <div className="w-full h-3 rounded" style={{ background: 'rgba(26, 26, 26, 0.6)' }}>
                    <div className="h-full rounded transition-all" style={{ width: `${percentage}%`, background: '#00D4FF' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </TacticalCard>

        <TacticalCard>
          <div className="mb-4">
            <div className="font-mono font-bold text-sm mb-1" style={{ color: '#00D4FF' }}>MUSCLE GROUP DISTRIBUTION</div>
          </div>
          <div className="space-y-3">
            {muscleGroups.map((muscle) => (
              <div key={muscle.name}>
                <div className="flex justify-between mb-1">
                  <span className="font-mono text-xs" style={{ color: muscle.color }}>{muscle.name}</span>
                  <span className="font-mono text-xs font-bold" style={{ color: muscle.color }}>{muscle.percentage}%</span>
                </div>
                <div className="w-full h-3 rounded" style={{ background: 'rgba(26, 26, 26, 0.6)' }}>
                  <div className="h-full rounded" style={{ width: `${muscle.percentage}%`, background: muscle.color }} />
                </div>
              </div>
            ))}
          </div>
        </TacticalCard>
      </div>
    </div>
  );
}
