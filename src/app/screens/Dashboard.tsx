import React from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { 
  Flame, Zap, Heart, Target, Dumbbell, TrendingUp, Activity, Play, Camera, 
  Users, AlertCircle, ShieldAlert, Clipboard, Utensils, Star, Award, Shield, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'user';

  if (userRole === 'admin') {
    // --- COACH / ADMIN DESIGNATED INTERFACE ---
    return (
      <div className="min-h-screen p-4 lg:p-8" style={{ background: '#08080c' }}>
        <TacticalHeader 
          title="AJ-FIT COACH STATION" 
          subtitle="TACTICAL COMMAND & ATHLETE ROSTER DESPATCH" 
        />

        {/* Hero Section with Admin Theme */}
        <div className="mb-6 relative rounded-3xl overflow-hidden h-[400px] lg:h-[500px] group border border-emerald-500/10">
          <img
            src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1600&q=80"
            alt="Coach Strategy Center"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.3]"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8, 8, 12, 0.4) 0%, rgba(8, 8, 12, 0.95) 100%), linear-gradient(to right, rgba(8, 8, 12, 0.8) 0%, transparent 100%)' }} />
          <div className="absolute inset-0 flex items-end lg:items-center">
            <div className="p-6 lg:p-12 w-full">
              <div className="font-mono text-[10px] lg:text-sm mb-2 tracking-[0.3em] text-emerald-400">STATUS: ACTIVE COACH SESSION // COMMANDER PRIME</div>
              <h1 className="font-mono font-bold text-3xl lg:text-6xl mb-4 leading-[0.9] text-white tracking-tighter uppercase">
                DESIGN THE PROTOCOL.<br />GUIDE TEAM SUCCESS.
              </h1>
              <p className="font-mono text-[11px] lg:text-lg mb-8 text-white/50 max-w-[280px] lg:max-w-xl leading-relaxed">
                Central scheduling & biological adjustments active. Adjust roster splitting layouts, supplement logs, injury thresholds, and control custom split modules.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/admin')}
                  className="px-8 py-4 rounded-2xl font-mono font-bold transition-all bg-emerald-400 text-black hover:scale-105 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                >
                  <Shield className="w-5 h-5 fill-current" />
                  LAUNCH CONTROL PANEL
                </button>
                <button
                  onClick={() => navigate('/tools/custom')}
                  className="px-8 py-4 rounded-2xl font-mono font-bold transition-all bg-white/5 border border-white/10 text-white hover:bg-white/10 flex items-center justify-center gap-3 backdrop-blur-md"
                >
                  <Clipboard className="w-5 h-5" />
                  BUILD PROTOCOLS
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Coach Tactical Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <TacticalCard>
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-4 lg:w-5 h-4 lg:h-5 text-emerald-400" />
              <span className="font-mono text-[10px] lg:text-xs text-white/50 uppercase">ACTIVE ROSTER</span>
            </div>
            <div className="font-mono font-bold text-2xl lg:text-3xl text-emerald-400">1,247</div>
            <div className="font-mono text-[10px] mt-1 lg:text-xs text-white/30">Registered Athletes</div>
          </TacticalCard>

          <TacticalCard>
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-4 lg:w-5 h-4 lg:h-5 text-amber-400" />
              <span className="font-mono text-[10px] lg:text-xs text-white/50 uppercase">FATIGUE INDEX</span>
            </div>
            <div className="font-mono font-bold text-2xl lg:text-3xl text-amber-400">84%</div>
            <div className="font-mono text-[10px] mt-1 lg:text-xs text-white/30">Average Distress Level</div>
          </TacticalCard>

          <TacticalCard>
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="w-4 lg:w-5 h-4 lg:h-5 text-rose-500" />
              <span className="font-mono text-[10px] lg:text-xs text-white/50 uppercase">INJURY ALERTS</span>
            </div>
            <div className="font-mono font-bold text-2xl lg:text-3xl text-rose-500">4</div>
            <div className="font-mono text-[10px] mt-1 lg:text-xs text-white/30">Needs Urgent Action</div>
          </TacticalCard>

          <TacticalCard>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-4 lg:w-5 h-4 lg:h-5 text-indigo-400" />
              <span className="font-mono text-[10px] lg:text-xs text-white/50 uppercase">DELOAD ACTIVE</span>
            </div>
            <div className="font-mono font-bold text-2xl lg:text-3xl text-indigo-400">18</div>
            <div className="font-mono text-[10px] mt-1 lg:text-xs text-white/30">Athletes in Recovery Phase</div>
          </TacticalCard>
        </div>

        {/* Tactical Coach Program Cards */}
        <div className="mb-4">
          <h2 className="font-mono font-bold text-sm text-emerald-400 mb-3 tracking-wider uppercase">TACTICAL DISPATCH OPERATIONS</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <TacticalCard noPadding className="overflow-hidden cursor-pointer hover:border-emerald-500/40 transition-all border border-white/5" onClick={() => navigate('/admin')}>
            <div className="p-5 flex flex-col justify-between h-40 bg-zinc-950/40">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
                <span className="font-mono text-[8px] text-white/30 bg-white/5 px-2 py-0.5 rounded uppercase">SYSTEM DIRECTORY</span>
              </div>
              <div>
                <div className="font-mono font-bold text-base text-white uppercase mb-0.5">ATHLETE ROSTER MANAGEMENT</div>
                <p className="font-sans text-[10px] text-white/40">Assign roles, inspect registration timers, and modify member stats.</p>
              </div>
            </div>
          </TacticalCard>

          <TacticalCard noPadding className="overflow-hidden cursor-pointer hover:border-emerald-500/40 transition-all border border-white/5" onClick={() => navigate('/tools/custom')}>
            <div className="p-5 flex flex-col justify-between h-40 bg-zinc-950/40">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                  <Clipboard className="w-6 h-6" />
                </div>
                <span className="font-mono text-[8px] text-white/30 bg-white/5 px-2 py-0.5 rounded uppercase font-bold text-emerald-400">ACTIVE DISPATCH</span>
              </div>
              <div>
                <div className="font-mono font-bold text-base text-white uppercase mb-0.5">CUSTOM ROUTINES TEMPLATER</div>
                <p className="font-sans text-[10px] text-white/40 font-normal">Formulate physical splits, workout parameters, and loading weights.</p>
              </div>
            </div>
          </TacticalCard>

          <TacticalCard noPadding className="overflow-hidden cursor-pointer hover:border-emerald-500/40 transition-all border border-white/5" onClick={() => navigate('/diet-plan')}>
            <div className="p-5 flex flex-col justify-between h-40 bg-zinc-950/40">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                  <Utensils className="w-6 h-6" />
                </div>
                <span className="font-mono text-[8px] text-white/30 bg-white/5 px-2 py-0.5 rounded uppercase">NUTRITION SUITE</span>
              </div>
              <div>
                <div className="font-mono font-bold text-base text-white uppercase mb-0.5">DIET & RECONSTRUCTION SETS</div>
                <p className="font-sans text-[10px] text-white/40">Configure tactical proteins and supplementary layouts for active combat athletes.</p>
              </div>
            </div>
          </TacticalCard>
        </div>

        {/* Roster diagnostics & Active Stress Charts equivalent */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TacticalCard>
            <div className="mb-4">
              <div className="font-mono font-bold text-sm mb-1 text-emerald-405" style={{ color: '#10B981' }}>TEAM FATIGUE EXERTION FREQUENCY</div>
              <div className="font-mono text-[10px] lg:text-xs text-white/40">AVERAGE BIOLOGICAL STATUS OVER PAST WEEK</div>
            </div>
            <div className="space-y-4">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => {
                const stressLoads = [42, 68, 85, 54, 76, 92, 31];
                const stress = stressLoads[i];
                return (
                  <div key={day}>
                    <div className="flex justify-between mb-1">
                      <span className="font-mono text-[10px] lg:text-xs text-white/60">{day}</span>
                      <span className="font-mono text-[10px] lg:text-xs font-bold" style={{ color: stress > 80 ? '#F43F5E' : stress > 60 ? '#F59E0B' : '#10B981' }}>{stress}% Distress</span>
                    </div>
                    <div className="w-full h-1.5 lg:h-2 rounded bg-white/5">
                      <div className="h-full rounded" style={{ 
                        width: `${stress}%`, 
                        background: stress > 80 ? '#F43F5E' : stress > 60 ? '#F59E0B' : '#10B981',
                        boxShadow: `0 0 10px ${stress > 80 ? 'rgba(244, 63, 94, 0.4)' : 'rgba(16, 185, 129, 0.4)'}` 
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </TacticalCard>

          <TacticalCard>
            <div className="mb-4">
              <div className="font-mono font-bold text-sm mb-1 text-emerald-400">CENTRAL DISPATCH LOG & PARAMETERS</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:block lg:space-y-3">
              {[
                { label: 'HYPERTROPHY SCHEMES', value: '4 Splits Ready', color: '#10B981' },
                { label: 'STRENGTH THRESHOLD', value: 'Max Power Loaded', color: '#10B981' },
                { label: 'INJURY MONITORS', value: 'Sarah W. Critical', color: '#F43F5E' },
                { label: 'DELOAD COMMANDS', value: 'Automatic Schedule', color: '#F59E0B' },
                { label: 'DIETARY PLANS', value: '7 Unit Formulas Out', color: '#10B981' },
                { label: 'SYSTEM DIAGNOSTICS', value: 'Server Optimal', color: '#10B981' },
              ].map((protocol) => (
                <div key={protocol.label} className="p-3 rounded flex justify-between items-center bg-zinc-950/40 border border-white/5">
                  <div className="font-mono text-[10px] lg:text-xs text-white/50">{protocol.label}</div>
                  <div className="font-mono font-bold text-[10px] lg:text-xs px-2 py-0.5 rounded bg-white/5" style={{ color: protocol.color }}>{protocol.value}</div>
                </div>
              ))}
            </div>
          </TacticalCard>
        </div>

        {/* Coach Tactical Transmissions */}
        <TacticalCard glow>
          <div className="mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            <div className="font-mono font-bold text-sm text-emerald-400">COACH CENTRAL DIALOG & ROSTER TELEMETRY</div>
          </div>
          <div className="space-y-3">
            {[
              "ALERT: John Smith completed 1RM Squat validation at +8% power output.",
              "FATIGUE SIGNAL: Athlete Emily Davis logged high workout heart-rate variation. Advise deload routing.",
              "DIETARY DISPATCH: Custom recovery minerals assigned to leg performance squad successfully.",
            ].map((message, i) => (
              <div key={i} className="p-3 rounded font-mono text-xs bg-emerald-500/5 border border-emerald-500/30 text-emerald-400">
                {message}
              </div>
            ))}
          </div>
        </TacticalCard>
      </div>
    );
  }

  // --- STANDARD ATHLETE INTERFACE ---
  return (
    <div className="min-h-screen p-4 lg:p-8" style={{ background: '#08080c' }}>
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
            <Flame className="w-4 lg:w-5 h-4 lg:h-5 text-rose-500" />
            <span className="font-mono text-[10px] lg:text-xs text-white/50 uppercase">WEEKLY VOLUME</span>
          </div>
          <div className="font-mono font-bold text-2xl lg:text-3xl text-cyan-400">93.6K</div>
          <div className="font-mono text-[10px] mt-1 lg:text-xs text-white/40">lbs lifted</div>
        </TacticalCard>

        <TacticalCard>
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-4 lg:w-5 h-4 lg:h-5 text-amber-500" />
            <span className="font-mono text-[10px] lg:text-xs text-white/50 uppercase">MAX INTENSITY</span>
          </div>
          <div className="font-mono font-bold text-2xl lg:text-3xl text-amber-500">95%</div>
          <div className="font-mono text-[10px] mt-1 lg:text-xs text-white/40">Peak performance</div>
        </TacticalCard>

        <TacticalCard>
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-4 lg:w-5 h-4 lg:h-5 text-emerald-500" />
            <span className="font-mono text-[10px] lg:text-xs text-white/50 uppercase">RECOVERY SCORE</span>
          </div>
          <div className="font-mono font-bold text-2xl lg:text-3xl text-emerald-500">86%</div>
          <div className="font-mono text-[10px] mt-1 lg:text-xs text-white/40">Good condition</div>
        </TacticalCard>

        <TacticalCard>
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-4 lg:w-5 h-4 lg:h-5 text-blue-500" />
            <span className="font-mono text-[10px] lg:text-xs text-white/50 uppercase">GOAL PROGRESS</span>
          </div>
          <div className="font-mono font-bold text-2xl lg:text-3xl text-blue-500">78%</div>
          <div className="font-mono text-[10px] mt-1 lg:text-xs text-white/40">On track</div>
        </TacticalCard>
      </div>

      {/* Featured Workouts */}
      <div className="mb-4">
        <h2 className="font-mono font-bold text-sm text-cyan-400 mb-3 tracking-wider uppercase">FEATURED SPLITS</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <TacticalCard noPadding className="overflow-hidden cursor-pointer hover:scale-105 transition-all border border-white/5" onClick={() => navigate('/workouts/chest')}>
          <div className="relative h-48">
            <img
              src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"
              alt="Chest Workout"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="font-mono font-bold text-xl mb-1 text-rose-500">CHEST DAY</div>
              <div className="font-mono text-xs text-white/70">6 exercises • 75 min</div>
            </div>
          </div>
        </TacticalCard>

        <TacticalCard noPadding className="overflow-hidden cursor-pointer hover:scale-105 transition-all border border-white/5" onClick={() => navigate('/workouts/legs')}>
          <div className="relative h-48">
            <img
              src="https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&q=80"
              alt="Leg Workout"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="font-mono font-bold text-xl mb-1 text-emerald-400">LEG DAY</div>
              <div className="font-mono text-xs text-white/70">7 exercises • 80 min</div>
            </div>
          </div>
        </TacticalCard>

        <TacticalCard noPadding className="overflow-hidden cursor-pointer hover:scale-105 transition-all border border-white/5" onClick={() => navigate('/workouts/back')}>
          <div className="relative h-48">
            <img
              src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&q=80"
              alt="Back Workout"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="font-mono font-bold text-xl mb-1 text-cyan-400">BACK DAY</div>
              <div className="font-mono text-xs text-white/70">6 exercises • 70 min</div>
            </div>
          </div>
        </TacticalCard>
      </div>

      {/* Weekly Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TacticalCard>
          <div className="mb-4">
            <div className="font-mono font-bold text-sm mb-1 text-cyan-400">WEEKLY VOLUME TRACKING</div>
            <div className="font-mono text-[10px] lg:text-xs text-white/40">TOTAL LOAD PER SESSION</div>
          </div>
          <div className="space-y-4">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => {
              const volumes = [12500, 15200, 9800, 16500, 14200, 18900, 6500];
              const volume = volumes[i];
              const percent = (volume / 20000) * 100;
              return (
                <div key={day}>
                  <div className="flex justify-between mb-1">
                    <span className="font-mono text-[10px] lg:text-xs text-white/60">{day}</span>
                    <span className="font-mono text-[10px] lg:text-xs text-cyan-400 font-bold">{volume.toLocaleString()} lbs</span>
                  </div>
                  <div className="w-full h-1.5 lg:h-2 rounded bg-white/5">
                    <div className="h-full rounded bg-cyan-400" style={{ width: `${percent}%`, boxShadow: '0 0 10px rgba(6,182,212,0.4)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </TacticalCard>

        <TacticalCard>
          <div className="mb-4">
            <div className="font-mono font-bold text-sm mb-1 text-cyan-400">ACTIVE TRAINING PROTOCOLS</div>
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
              <div key={protocol.label} className="p-3 rounded flex justify-between items-center bg-zinc-950/40 border border-white/5">
                <div className="font-mono text-[10px] lg:text-xs text-white/50">{protocol.label}</div>
                <div className="font-mono font-bold text-[10px] lg:text-xs px-2 py-0.5 rounded bg-white/5" style={{ color: protocol.color }}>{protocol.value}</div>
              </div>
            ))}
          </div>
        </TacticalCard>
      </div>

      {/* AI Messages */}
      <TacticalCard glow>
        <div className="mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          <div className="font-mono font-bold text-sm text-cyan-400">NEURAL AI TRANSMISSION</div>
        </div>
        <div className="space-y-3">
          {[
            "System optimal. Recovery protocols engaged.",
            "Detected +12% volume increase. Monitor fatigue markers.",
            "Recommend deload in 4-6 days based on current trajectory.",
          ].map((message, i) => (
            <div key={i} className="p-3 rounded font-mono text-xs bg-cyan-950/10 border border-cyan-500/20 text-cyan-400">
              {message}
            </div>
          ))}
        </div>
      </TacticalCard>
    </div>
  );
}
