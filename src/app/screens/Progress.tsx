import React from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { TrendingUp, Award, Target, Flame } from 'lucide-react';

export default function Progress() {
  const strengthProgress = [
    { exercise: 'Bench Press', start: 185, current: 225, goal: 275, unit: 'lbs' },
    { exercise: 'Squat', start: 225, current: 315, goal: 405, unit: 'lbs' },
    { exercise: 'Deadlift', start: 315, current: 405, goal: 500, unit: 'lbs' },
    { exercise: 'Pull-ups', start: 8, current: 15, goal: 20, unit: 'reps' },
  ];

  const bodyMetrics = [
    { metric: 'Body Weight', start: '185 lbs', current: '195 lbs', change: '+10 lbs', positive: true },
    { metric: 'Body Fat', start: '18%', current: '14%', change: '-4%', positive: true },
    { metric: 'Muscle Mass', start: '152 lbs', current: '168 lbs', change: '+16 lbs', positive: true },
    { metric: 'Waist', start: '34"', current: '32"', change: '-2"', positive: true },
  ];

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <TacticalHeader title="PROGRESS TRACKING" subtitle="PERFORMANCE EVOLUTION ANALYSIS" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <TacticalCard className="p-3 lg:p-6 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-3 mb-2">
            <TrendingUp className="w-4 lg:w-5 h-4 lg:h-5 text-emerald-400" />
            <span className="font-mono text-[10px] lg:text-xs text-emerald-400/60 uppercase tracking-widest">STRENGTH GAIN</span>
          </div>
          <div className="font-mono font-bold text-xl lg:text-3xl text-emerald-400">+24%</div>
          <div className="font-mono text-[10px] lg:text-xs mt-1 text-white/40">Since start</div>
        </TacticalCard>

        <TacticalCard className="p-3 lg:p-6 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-3 mb-2">
            <Award className="w-4 lg:w-5 h-4 lg:h-5 text-amber-400" />
            <span className="font-mono text-[10px] lg:text-xs text-amber-400/60 uppercase tracking-widest">PRS SET</span>
          </div>
          <div className="font-mono font-bold text-xl lg:text-3xl text-amber-400">24</div>
          <div className="font-mono text-[10px] lg:text-xs mt-1 text-white/40">New records</div>
        </TacticalCard>

        <TacticalCard className="p-3 lg:p-6 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-3 mb-2">
            <Target className="w-4 lg:w-5 h-4 lg:h-5 text-blue-400" />
            <span className="font-mono text-[10px] lg:text-xs text-blue-400/60 uppercase tracking-widest">GOALS HIT</span>
          </div>
          <div className="font-mono font-bold text-xl lg:text-3xl text-blue-400">8/12</div>
          <div className="font-mono text-[10px] lg:text-xs mt-1 text-white/40">This year</div>
        </TacticalCard>

        <TacticalCard className="p-3 lg:p-6 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-3 mb-2">
            <Flame className="w-4 lg:w-5 h-4 lg:h-5 text-red-400" />
            <span className="font-mono text-[10px] lg:text-xs text-red-400/60 uppercase tracking-widest">STREAK</span>
          </div>
          <div className="font-mono font-bold text-xl lg:text-3xl text-red-400">12</div>
          <div className="font-mono text-[10px] lg:text-xs mt-1 text-white/40">days active</div>
        </TacticalCard>
      </div>

      <TacticalCard className="mb-6">
        <div className="mb-4">
          <div className="font-mono font-bold text-sm mb-1" style={{ color: '#00D4FF' }}>STRENGTH PROGRESSION</div>
          <div className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>MAIN LIFTS PERFORMANCE</div>
        </div>
        <div className="space-y-4">
          {strengthProgress.map((exercise) => {
            const progress = ((exercise.current - exercise.start) / (exercise.goal - exercise.start)) * 100;
            return (
              <div key={exercise.exercise}>
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="font-mono font-bold text-sm" style={{ color: '#00D4FF' }}>{exercise.exercise}</div>
                    <div className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>
                      {exercise.start} → {exercise.current} / {exercise.goal} {exercise.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-xl" style={{ color: '#10B981' }}>{Math.round(progress)}%</div>
                    <div className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>
                      +{exercise.current - exercise.start} {exercise.unit}
                    </div>
                  </div>
                </div>
                <div className="w-full h-3 rounded" style={{ background: 'rgba(26, 26, 26, 0.6)' }}>
                  <div className="h-full rounded transition-all" style={{ width: `${progress}%`, background: '#10B981' }} />
                </div>
              </div>
            );
          })}
        </div>
      </TacticalCard>

      <TacticalCard>
        <div className="mb-4">
          <div className="font-mono font-bold text-sm mb-1 text-cyan-400 tracking-widest uppercase">BODY COMPOSITION CHANGES</div>
          <div className="font-mono text-[10px] lg:text-xs text-cyan-400/40 uppercase tracking-widest">PHYSICAL TRANSFORMATION</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bodyMetrics.map((metric) => (
            <div key={metric.metric} className="p-3 lg:p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all">
              <div className="font-mono text-[10px] lg:text-xs mb-2 text-white/40 tracking-widest uppercase">{metric.metric}</div>
              <div className="flex items-baseline gap-2 mb-1">
                <div className="font-mono text-xs lg:text-sm text-white/30">{metric.start}</div>
                <div className="font-mono text-[10px] text-cyan-400">→</div>
                <div className="font-mono font-bold text-lg lg:text-xl text-white">{metric.current}</div>
              </div>
              <div className="font-mono font-bold text-[10px] lg:text-sm" style={{ color: metric.positive ? '#10B981' : '#F43F5E' }}>
                {metric.change}
              </div>
            </div>
          ))}
        </div>
      </TacticalCard>
    </div>
  );
}
