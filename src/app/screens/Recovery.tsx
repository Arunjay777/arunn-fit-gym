import React from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Heart, Moon, Battery, TrendingUp, Zap, Activity } from 'lucide-react';

export default function Recovery() {
  const recoveryMetrics = [
    { icon: Heart, label: 'HRV SCORE', value: '72', unit: 'ms', status: 'optimal', color: '#10B981' },
    { icon: Moon, label: 'SLEEP QUALITY', value: '8.2', unit: 'hrs', status: 'good', color: '#3B82F6' },
    { icon: Battery, label: 'ENERGY LEVEL', value: '87', unit: '%', status: 'high', color: '#F59E0B' },
    { icon: Activity, label: 'MUSCLE SORENESS', value: 'Low', unit: '', status: 'optimal', color: '#10B981' },
    { icon: Zap, label: 'STRESS LEVEL', value: '32', unit: '%', status: 'low', color: '#10B981' },
    { icon: TrendingUp, label: 'RECOVERY RATE', value: '92', unit: '%', status: 'excellent', color: '#10B981' },
  ];

  const recommendations = [
    { title: 'Sleep Optimization', text: 'Maintain 8+ hours of quality sleep', priority: 'high' },
    { title: 'Active Recovery', text: 'Light cardio or stretching recommended', priority: 'medium' },
    { title: 'Hydration', text: 'Increase water intake by 500ml', priority: 'medium' },
    { title: 'Nutrition', text: 'Focus on protein and complex carbs', priority: 'low' },
  ];

  return (
    <div className="min-h-screen p-8">
      <TacticalHeader title="RECOVERY METRICS" subtitle="REST & REGENERATION TRACKING" />

      <div className="grid grid-cols-3 gap-6 mb-6">
        {recoveryMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <TacticalCard key={metric.label}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded" style={{ background: `${metric.color}20`, border: `1px solid ${metric.color}40` }}>
                  <Icon className="w-5 h-5" style={{ color: metric.color }} />
                </div>
                <div className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>{metric.label}</div>
              </div>

              <div className="flex items-baseline gap-2">
                <div className="font-mono font-bold text-4xl" style={{ color: metric.color }}>{metric.value}</div>
                {metric.unit && <div className="font-mono text-sm" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>{metric.unit}</div>}
              </div>

              <div className="mt-2 font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.4)' }}>
                Status: {metric.status.toUpperCase()}
              </div>
            </TacticalCard>
          );
        })}
      </div>

      <TacticalCard glow>
        <div className="mb-4">
          <div className="font-mono font-bold text-sm mb-1" style={{ color: '#00D4FF' }}>RECOVERY RECOMMENDATIONS</div>
          <div className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>AI-POWERED SUGGESTIONS</div>
        </div>
        <div className="space-y-3">
          {recommendations.map((rec) => {
            const colors = { high: '#F43F5E', medium: '#F59E0B', low: '#10B981' };
            const color = colors[rec.priority as keyof typeof colors];
            return (
              <div key={rec.title} className="p-4 rounded flex items-start gap-3"
                   style={{ background: 'rgba(26, 26, 26, 0.6)', borderLeft: `3px solid ${color}` }}>
                <div className="flex-1">
                  <div className="font-mono font-bold text-sm mb-1" style={{ color: '#00D4FF' }}>{rec.title}</div>
                  <div className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>{rec.text}</div>
                </div>
                <div className="font-mono text-xs px-2 py-1 rounded" style={{ background: `${color}20`, color }}>
                  {rec.priority.toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
      </TacticalCard>
    </div>
  );
}
