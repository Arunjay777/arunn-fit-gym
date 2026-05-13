import React from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Flame, Zap, Heart, Target, Dumbbell, TrendingUp, Activity, Play, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <TacticalHeader title="AJ-FIT COMMAND CENTER" subtitle="NEURAL-SYNC FITNESS ECOSYSTEM" />

      {/* Hero Section with Gym Image */}
      <div className="mb-6 relative rounded-3xl overflow-hidden h-[400px] lg:h-[500px] group border border-white/5">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80"
          alt="Gym Training"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(3, 3, 3, 0.4) 0%, rgba(3, 3, 3, 0.95) 100%), linear-gradient(to right, rgba(3, 3, 3, 0.8) 0%, transparent 100%)' }} />
        <div className="absolute inset-0 flex items-end lg:items-center">
          <div className="p-6 lg:p-12 w-full">
            <div className="font-mono text-[10px] lg:text-sm mb-2 tracking-[0.3em] text-cyan-400">STATUS: SYSTEM OPTIMAL // WELCOME WARRIOR</div>
            <h1 className="font-mono font-bold text-3xl lg:text-6xl mb-4 leading-[0.9] text-white tracking-tighter">
              READY TO<br />DOMINATE TODAY?
            </h1>
            <p className="font-mono text-[11px] lg:text-lg mb-8 text-white/50 max-w-[280px] lg:max-w-xl leading-relaxed">
              Biological optimization protocol initiated. Accessing training subroutines for maximum performance output.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/training')}
                className="px-8 py-4 rounded-2xl font-mono font-bold transition-all bg-cyan-500 text-black hover:scale-105 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
              >
                <Play className="w-5 h-5 fill-current" />
                START MISSION
              </button>
              <button
                onClick={() => navigate('/rep-counter')}
                className="px-8 py-4 rounded-2xl font-mono font-bold transition-all bg-white/5 border border-white/10 text-white hover:bg-white/10 flex items-center justify-center gap-3 backdrop-blur-md"
              >
                <Camera className="w-5 h-5" />
                AI TRACKER
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <TacticalCard>
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-4 lg:w-5 h-4 lg:h-5" style={{ color: '#FF3366' }} />
            <span className="font-mono text-[10px] lg:text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>WEEKLY VOLUME</span>
          </div>
          <div className="font-mono font-bold text-2xl lg:text-3xl" style={{ color: '#00D4FF' }}>93.6K</div>
          <div className="font-mono text-[10px] mt-1 lg:text-xs text-white/40">lbs lifted</div>
        </TacticalCard>

        <TacticalCard>
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-4 lg:w-5 h-4 lg:h-5" style={{ color: '#F59E0B' }} />
            <span className="font-mono text-[10px] lg:text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>MAX INTENSITY</span>
          </div>
          <div className="font-mono font-bold text-2xl lg:text-3xl" style={{ color: '#F59E0B' }}>95%</div>
          <div className="font-mono text-[10px] mt-1 lg:text-xs text-white/40">Peak performance</div>
        </TacticalCard>

        <TacticalCard>
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-4 lg:w-5 h-4 lg:h-5" style={{ color: '#10B981' }} />
            <span className="font-mono text-[10px] lg:text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>RECOVERY SCORE</span>
          </div>
          <div className="font-mono font-bold text-2xl lg:text-3xl" style={{ color: '#10B981' }}>86%</div>
          <div className="font-mono text-[10px] mt-1 lg:text-xs text-white/40">Good condition</div>
        </TacticalCard>

        <TacticalCard>
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-4 lg:w-5 h-4 lg:h-5" style={{ color: '#3B82F6' }} />
            <span className="font-mono text-[10px] lg:text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>GOAL PROGRESS</span>
          </div>
          <div className="font-mono font-bold text-2xl lg:text-3xl" style={{ color: '#3B82F6' }}>78%</div>
          <div className="font-mono text-[10px] mt-1 lg:text-xs text-white/40">On track</div>
        </TacticalCard>
      </div>

      {/* Featured Workouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <TacticalCard noPadding className="overflow-hidden cursor-pointer hover:scale-105 transition-all" onClick={() => navigate('/workouts/chest')}>
          <div className="relative h-48">
            <img
              src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"
              alt="Chest Workout"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(3, 3, 3, 0.95) 0%, rgba(3, 3, 3, 0.3) 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="font-mono font-bold text-xl mb-1" style={{ color: '#FF3366' }}>CHEST DAY</div>
              <div className="font-mono text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>6 exercises • 75 min</div>
            </div>
          </div>
        </TacticalCard>

        <TacticalCard noPadding className="overflow-hidden cursor-pointer hover:scale-105 transition-all" onClick={() => navigate('/workouts/legs')}>
          <div className="relative h-48">
            <img
              src="https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&q=80"
              alt="Leg Workout"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(3, 3, 3, 0.95) 0%, rgba(3, 3, 3, 0.3) 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="font-mono font-bold text-xl mb-1" style={{ color: '#00FF88' }}>LEG DAY</div>
              <div className="font-mono text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>7 exercises • 80 min</div>
            </div>
          </div>
        </TacticalCard>

        <TacticalCard noPadding className="overflow-hidden cursor-pointer hover:scale-105 transition-all" onClick={() => navigate('/workouts/back')}>
          <div className="relative h-48">
            <img
              src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&q=80"
              alt="Back Workout"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(3, 3, 3, 0.95) 0%, rgba(3, 3, 3, 0.3) 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="font-mono font-bold text-xl mb-1" style={{ color: '#00D4FF' }}>BACK DAY</div>
              <div className="font-mono text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>6 exercises • 70 min</div>
            </div>
          </div>
        </TacticalCard>
      </div>

      {/* Weekly Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TacticalCard>
          <div className="mb-4">
            <div className="font-mono font-bold text-sm mb-1" style={{ color: '#00D4FF' }}>WEEKLY VOLUME TRACKING</div>
            <div className="font-mono text-[10px] lg:text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>TOTAL LOAD PER SESSION</div>
          </div>
          <div className="space-y-4">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => {
              const volumes = [12500, 15200, 9800, 16500, 14200, 18900, 6500];
              const volume = volumes[i];
              const percent = (volume / 20000) * 100;
              return (
                <div key={day}>
                  <div className="flex justify-between mb-1">
                    <span className="font-mono text-[10px] lg:text-xs" style={{ color: '#00D4FF' }}>{day}</span>
                    <span className="font-mono text-[10px] lg:text-xs" style={{ color: '#00D4FF' }}>{volume.toLocaleString()} lbs</span>
                  </div>
                  <div className="w-full h-1.5 lg:h-2 rounded bg-white/5">
                    <div className="h-full rounded" style={{ width: `${percent}%`, background: '#00D4FF', boxShadow: '0 0 10px rgba(0, 212, 255, 0.4)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </TacticalCard>

        <TacticalCard>
          <div className="mb-4">
            <div className="font-mono font-bold text-sm mb-1" style={{ color: '#00D4FF' }}>ACTIVE TRAINING PROTOCOLS</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:block lg:space-y-3">
            {[
              { label: 'HYPERTROPHY', value: 'Phase 2/4', color: '#00D4FF' },
              { label: 'STRENGTH', value: '85% 1RM', color: '#10B981' },
              { label: 'ENDURANCE', value: 'Active', color: '#3B82F6' },
              { label: 'POWER', value: 'Pending', color: '#F59E0B' },
              { label: 'MOBILITY', value: 'Daily', color: '#10B981' },
              { label: 'RECOVERY', value: 'High Priority', color: '#F43F5E' },
            ].map((protocol) => (
              <div key={protocol.label} className="p-3 rounded flex justify-between items-center" style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div className="font-mono text-[10px] lg:text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>{protocol.label}</div>
                <div className="font-mono font-bold text-[10px] lg:text-xs px-2 py-0.5 rounded bg-white/5" style={{ color: protocol.color }}>{protocol.value}</div>
              </div>
            ))}
          </div>
        </TacticalCard>
      </div>

      {/* AI Messages */}
      <TacticalCard glow>
        <div className="mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10B981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)' }} />
          <div className="font-mono font-bold text-sm" style={{ color: '#00D4FF' }}>NEURAL AI TRANSMISSION</div>
        </div>
        <div className="space-y-3">
          {[
            "System optimal. Recovery protocols engaged.",
            "Detected +12% volume increase. Monitor fatigue markers.",
            "Recommend deload in 4-6 days based on current trajectory.",
          ].map((message, i) => (
            <div key={i} className="p-3 rounded font-mono text-xs" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10B981' }}>
              {message}
            </div>
          ))}
        </div>
      </TacticalCard>
    </div>
  );
}
