import React from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Heart, Activity, Droplet, Zap, Moon, TrendingUp } from 'lucide-react';

export default function Vitals() {
  const vitals = [
    { icon: Heart, label: 'RESTING HEART RATE', value: '58', unit: 'BPM', status: 'optimal', color: '#10B981' },
    { icon: Activity, label: 'HEART RATE VARIABILITY', value: '72', unit: 'ms', status: 'optimal', color: '#00D4FF' },
    { icon: Droplet, label: 'BLOOD OXYGEN', value: '98', unit: '%', status: 'optimal', color: '#3B82F6' },
    { icon: Zap, label: 'ENERGY LEVEL', value: '87', unit: '%', status: 'optimal', color: '#F59E0B' },
    { icon: Moon, label: 'SLEEP QUALITY', value: '8.2', unit: 'hrs', status: 'optimal', color: '#9D4EDD' },
    { icon: TrendingUp, label: 'RECOVERY SCORE', value: '92', unit: '%', status: 'optimal', color: '#10B981' },
  ];

  return (
    <div className="min-h-screen p-8">
      <TacticalHeader title="VITAL STATISTICS" subtitle="BIOLOGICAL PERFORMANCE METRICS" />

      <div className="grid grid-cols-3 gap-6 mb-6">
        {vitals.map((vital) => {
          const Icon = vital.icon;
          return (
            <TacticalCard key={vital.label}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded" style={{ background: `${vital.color}20`, border: `1px solid ${vital.color}40` }}>
                  <Icon className="w-5 h-5" style={{ color: vital.color }} />
                </div>
                <div className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>{vital.label}</div>
              </div>

              <div className="flex items-baseline gap-2">
                <div className="font-mono font-bold text-4xl" style={{ color: vital.color }}>{vital.value}</div>
                <div className="font-mono text-sm" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>{vital.unit}</div>
              </div>

              <div className="mt-2 font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.4)' }}>
                Status: {vital.status.toUpperCase()}
              </div>
            </TacticalCard>
          );
        })}
      </div>

      <TacticalCard>
        <div className="mb-4">
          <div className="font-mono font-bold text-sm mb-1" style={{ color: '#00D4FF' }}>24-HOUR HEART RATE TREND</div>
          <div className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>RESTING & ACTIVE ZONES</div>
        </div>
        <div className="space-y-2">
          {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'].map((time, i) => {
            const rates = [58, 62, 145, 88, 168, 75];
            const rate = rates[i];
            const percent = (rate / 200) * 100;
            const color = rate > 140 ? '#F43F5E' : rate > 100 ? '#F59E0B' : '#10B981';
            return (
              <div key={time}>
                <div className="flex justify-between mb-1">
                  <span className="font-mono text-xs" style={{ color: '#00D4FF' }}>{time}</span>
                  <span className="font-mono text-xs" style={{ color }}>{rate} BPM</span>
                </div>
                <div className="w-full h-2 rounded" style={{ background: 'rgba(26, 26, 26, 0.6)' }}>
                  <div className="h-full rounded" style={{ width: `${percent}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </TacticalCard>
    </div>
  );
}
