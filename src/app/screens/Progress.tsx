import React, { useState } from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { TrendingUp, Award, Target, Flame, Calculator, LineChart as ChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { day: 'Mon', bench: 185, squat: 225, deadlift: 315 },
  { day: 'Tue', bench: 190, squat: 235, deadlift: 320 },
  { day: 'Wed', bench: 195, squat: 245, deadlift: 335 },
  { day: 'Thu', bench: 205, squat: 265, deadlift: 355 },
  { day: 'Fri', bench: 215, squat: 285, deadlift: 385 },
  { day: 'Sat', bench: 225, squat: 315, deadlift: 405 },
];

export default function Progress() {
  const [weight, setWeight] = useState('225');
  const [reps, setReps] = useState('5');
  
  const calculate1RM = () => {
    const w = parseFloat(weight);
    const r = parseFloat(reps);
    if (isNaN(w) || isNaN(r)) return 0;
    return Math.round(w * (1 + r / 30));
  };

  const oneRM = calculate1RM();
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Strength Progress Chart */}
        <TacticalCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ChartIcon className="w-5 h-5 text-cyan-400" />
              <div className="font-mono font-bold text-sm text-cyan-400 tracking-widest uppercase">Performance Analytics</div>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="day" 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(3, 3, 3, 0.95)', 
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontFamily: 'monospace'
                  }} 
                />
                <Line type="monotone" dataKey="bench" stroke="#00D4FF" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="squat" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="deadlift" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TacticalCard>

        {/* 1RM Calculator */}
        <TacticalCard glow className="bg-cyan-500/5 border-cyan-500/20">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono font-bold text-sm text-cyan-400 tracking-widest uppercase">1RM Calculator</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2 block">Weight (lbs)</label>
              <input 
                type="number" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-xl p-3 font-mono text-cyan-400 outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2 block">Reps</label>
              <input 
                type="number" 
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-xl p-3 font-mono text-cyan-400 outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>
            <div className="mt-8 p-4 rounded-2xl bg-black/60 border border-cyan-500/30 text-center">
              <div className="font-mono text-[10px] text-white/40 uppercase mb-2">Estimated One Rep Max</div>
              <div className="font-mono font-bold text-4xl text-white">{oneRM} <span className="text-xs text-cyan-400">lbs</span></div>
            </div>
          </div>
        </TacticalCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TacticalCard>
          <div className="mb-4">
            <div className="font-mono font-bold text-sm mb-1 text-cyan-400 tracking-widest uppercase">STRENGTH PROGRESSION</div>
            <div className="font-mono text-[10px] lg:text-xs text-cyan-400/40 uppercase tracking-widest">MAIN LIFTS PERFORMANCE</div>
          </div>
        <div className="space-y-4">
          {strengthProgress.map((exercise) => {
            const progressValue = ((exercise.current - exercise.start) / (exercise.goal - exercise.start)) * 100;
            return (
              <div key={exercise.exercise}>
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="font-mono font-bold text-sm text-cyan-400">{exercise.exercise}</div>
                    <div className="font-mono text-[10px] text-white/40 uppercase">
                      {exercise.start} → {exercise.current} / {exercise.goal} {exercise.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-lg text-emerald-400">{Math.round(progressValue)}%</div>
                    <div className="font-mono text-[10px] text-emerald-400/50 uppercase">
                      +{exercise.current - exercise.start} {exercise.unit}
                    </div>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000 bg-emerald-500" style={{ width: `${progressValue}%` }} />
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
  </div>
  );
}
