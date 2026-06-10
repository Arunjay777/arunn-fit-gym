import React from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { 
  Flame, Zap, Heart, Target, Dumbbell, TrendingUp, Activity, Play, Camera, 
  Users, AlertCircle, ShieldAlert, Clipboard, Utensils, Star, Award, Shield, ArrowRight,
  Plus, RotateCcw, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'user';

  // Check if onboarding is completed for standard athlete
  const activeUserId = localStorage.getItem('userId') || 'local_user';
  const activeUsername = localStorage.getItem('username') || 'Athlete';
  
  const [onboardingData, setOnboardingData] = React.useState({
    name: activeUsername,
    age: '',
    location: '',
    height: '',
    weight: '',
    goal: 'Build Muscle',
    focus: 'Chest & Arms',
  });

  const [needsOnboarding, setNeedsOnboarding] = React.useState(() => {
    if (userRole !== 'user') return false;
    const saved = localStorage.getItem(`fitx_profile_${activeUserId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return !parsed.completed;
      } catch (e) {
        return true;
      }
    }
    return true;
  });

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProfile = {
      ...onboardingData,
      email: activeUsername.includes('@') ? activeUsername : `${activeUsername}@simatsfitx.com`,
      completed: true,
    };
    localStorage.setItem(`fitx_profile_${activeUserId}`, JSON.stringify(finalProfile));
    
    // Sync with Firebase User Document
    import('../lib/firebaseHelper').then(({ updateTacticalUser }) => {
      updateTacticalUser(activeUserId, {
        username: onboardingData.name,
        focusWorkout: onboardingData.focus,
      });
    }).catch(err => console.warn(err));

    setNeedsOnboarding(false);
  };

  // Persistent Daily Trackers State
  const [protein, setProtein] = React.useState(() => Number(localStorage.getItem('fitx_dash_protein') || '135'));
  const [carbs, setCarbs] = React.useState(() => Number(localStorage.getItem('fitx_dash_carbs') || '180'));
  const [fats, setFats] = React.useState(() => Number(localStorage.getItem('fitx_dash_fats') || '55'));
  const [water, setWater] = React.useState(() => Number(localStorage.getItem('fitx_dash_water') || '2.2'));
  const [activeTime, setActiveTime] = React.useState(() => Number(localStorage.getItem('fitx_dash_activetime') || '40'));

  // Custom targets state for customization
  const [proteinGoal, setProteinGoal] = React.useState(() => Number(localStorage.getItem('fitx_dash_protein_goal') || '180'));
  const [carbsGoal, setCarbsGoal] = React.useState(() => Number(localStorage.getItem('fitx_dash_carbs_goal') || '250'));
  const [fatsGoal, setFatsGoal] = React.useState(() => Number(localStorage.getItem('fitx_dash_fats_goal') || '75'));
  const [waterGoal, setWaterGoal] = React.useState(() => Number(localStorage.getItem('fitx_dash_water_goal') || '4.0'));
  const [activeTimeGoal, setActiveTimeGoal] = React.useState(() => Number(localStorage.getItem('fitx_dash_active_goal') || '60'));

  const [isCustomizing, setIsCustomizing] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem('fitx_dash_protein', protein.toString());
    localStorage.setItem('fitx_dash_carbs', carbs.toString());
    localStorage.setItem('fitx_dash_fats', fats.toString());
    localStorage.setItem('fitx_dash_water', water.toString());
    localStorage.setItem('fitx_dash_activetime', activeTime.toString());
  }, [protein, carbs, fats, water, activeTime]);

  React.useEffect(() => {
    localStorage.setItem('fitx_dash_protein_goal', proteinGoal.toString());
    localStorage.setItem('fitx_dash_carbs_goal', carbsGoal.toString());
    localStorage.setItem('fitx_dash_fats_goal', fatsGoal.toString());
    localStorage.setItem('fitx_dash_water_goal', waterGoal.toString());
    localStorage.setItem('fitx_dash_active_goal', activeTimeGoal.toString());
  }, [proteinGoal, carbsGoal, fatsGoal, waterGoal, activeTimeGoal]);

  const currentCalories = Math.round(protein * 4 + carbs * 4 + fats * 9);
  const targetCalories = Math.round(proteinGoal * 4 + carbsGoal * 4 + fatsGoal * 9);

  // Overall progress bar calculated as the average completion of all 5 targets
  const proteinPercent = Math.min(100, Math.round((protein / proteinGoal) * 100));
  const carbsPercent = Math.min(100, Math.round((carbs / carbsGoal) * 100));
  const fatsPercent = Math.min(100, Math.round((fats / fatsGoal) * 100));
  const waterPercent = Math.min(100, Math.round((water / waterGoal) * 100));
  const activePercent = Math.min(100, Math.round((activeTime / activeTimeGoal) * 100));

  const averageCompletion = Math.round((proteinPercent + carbsPercent + fatsPercent + waterPercent + activePercent) / 5);
  const totalCaloriesPercent = Math.min(100, Math.round((currentCalories / targetCalories) * 100));

  if (userRole === 'admin') {
    // --- COACH / ADMIN DESIGNATED INTERFACE ---
    return (
      <div className="min-h-screen p-4 lg:p-8" style={{ background: '#08080c' }}>
        <TacticalHeader 
          title="SIMATS FitX COACH STATION" 
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
                  <Zap className="w-5 h-5 fill-current" />
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

  if (needsOnboarding && userRole === 'user') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 overflow-y-auto">
        <div className="w-full max-w-2xl p-6 lg:p-8 rounded-3xl bg-[#08080c] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] my-8">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-full bg-cyan-500/10 text-cyan-400 mb-4 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="font-mono font-bold text-2xl lg:text-3xl text-white tracking-widest uppercase">
              ATHLETE ONBOARDING
            </h2>
            <p className="font-mono text-xs text-cyan-500/60 uppercase mt-1 tracking-wider">
              Neural-Sync Initialization Protocol
            </p>
            <p className="font-mono text-xs text-white/50 mt-4 max-w-md mx-auto">
              Welcome to SIMATS FitX, athlete. Before accessing the neural command center, you must initialize your tactical athletic profile.
            </p>
          </div>

          <form onSubmit={handleCompleteOnboarding} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] text-cyan-400/70 uppercase tracking-widest mb-1.5">
                  Athlete Display Name
                </label>
                <input
                  type="text"
                  required
                  value={onboardingData.name}
                  onChange={(e) => setOnboardingData({ ...onboardingData, name: e.target.value })}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 font-mono text-sm text-white focus:outline-none focus:border-cyan-400/60"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-cyan-400/70 uppercase tracking-widest mb-1.5">
                  Age / Birth Year
                </label>
                <input
                  type="text"
                  required
                  value={onboardingData.age}
                  onChange={(e) => setOnboardingData({ ...onboardingData, age: e.target.value })}
                  placeholder="e.g. 28 years old"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 font-mono text-sm text-white focus:outline-none focus:border-cyan-400/60"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-cyan-400/70 uppercase tracking-widest mb-1.5">
                  HQ Location
                </label>
                <input
                  type="text"
                  required
                  value={onboardingData.location}
                  onChange={(e) => setOnboardingData({ ...onboardingData, location: e.target.value })}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 font-mono text-sm text-white focus:outline-none focus:border-cyan-400/60"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-cyan-400/70 uppercase tracking-widest mb-1.5">
                  Height (cm)
                </label>
                <input
                  type="text"
                  required
                  value={onboardingData.height}
                  onChange={(e) => setOnboardingData({ ...onboardingData, height: e.target.value })}
                  placeholder="e.g. 182 cm"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 font-mono text-sm text-white focus:outline-none focus:border-cyan-400/60"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-cyan-400/70 uppercase tracking-widest mb-1.5">
                  Target Weight (lbs / kg)
                </label>
                <input
                  type="text"
                  required
                  value={onboardingData.weight}
                  onChange={(e) => setOnboardingData({ ...onboardingData, weight: e.target.value })}
                  placeholder="e.g. 185 lbs"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 font-mono text-sm text-white focus:outline-none focus:border-cyan-400/60"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-cyan-400/70 uppercase tracking-widest mb-1.5">
                  Primary Fitness Goal
                </label>
                <select
                  value={onboardingData.goal}
                  onChange={(e) => setOnboardingData({ ...onboardingData, goal: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-2xl p-3 font-mono text-sm text-white focus:outline-none focus:border-cyan-400/60"
                >
                  <option value="Build Muscle">Build Muscle / Hypertrophy</option>
                  <option value="Increase Strength">Increase Max Strength</option>
                  <option value="Improve Endurance">Conditioning & Endurance</option>
                  <option value="Fat Loss">Body Recomposition / Fat Loss</option>
                  <option value="Athletic Power">Explosive Athletic Power</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="block font-mono text-[10px] text-cyan-400/70 uppercase tracking-widest mb-1.5">
                Target Workout Routine Focus
              </label>
              <select
                value={onboardingData.focus}
                onChange={(e) => setOnboardingData({ ...onboardingData, focus: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-2xl p-3 font-mono text-sm text-white focus:outline-none focus:border-cyan-400/60"
              >
                <option value="Back & Shoulders">Day 1: Back & Shoulders Focus</option>
                <option value="Legs & Abs">Day 3: Legs & Abs Focus</option>
                <option value="Chest & Arms">Day 5: Chest & Arms Focus</option>
                <option value="Full Body Conditioning">Full Body Conditioning Focus</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-6 px-6 py-4 rounded-2xl font-mono font-bold transition-all bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:scale-[1.01]"
            >
              FINALIZE ATHLETE INITIALIZATION
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- STANDARD ATHLETE INTERFACE ---
  return (
    <div className="min-h-screen p-4 lg:p-8" style={{ background: '#08080c' }}>
      <TacticalHeader title="SIMATS FitX COMMAND CENTER" subtitle="NEURAL-SYNC FITNESS ECOSYSTEM" />

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
          <div className="font-mono font-bold text-2xl lg:text-3xl text-blue-500">{averageCompletion}%</div>
          <div className="font-mono text-[10px] mt-1 lg:text-xs text-white/40">Aggregated performance</div>
        </TacticalCard>
      </div>

      {/* DAILY MACRO & FITNESS GOAL TRACKER */}
      <div className="mb-6">
        <TacticalCard glow className="border border-cyan-500/20 bg-zinc-950/85">
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/5 mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                <h2 className="font-mono font-bold text-sm text-cyan-400 tracking-wider uppercase flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-400" />
                  DAILY PERFORMANCE FUEL & FITNESS GOAL PORTAL
                </h2>
              </div>
              <p className="font-mono text-[10px] text-white/40 uppercase">
                Optimize nutrient partitions & physiological output thresholds in real-time
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCustomizing(!isCustomizing)}
                className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 font-mono text-xs text-white hover:bg-white/10 active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                {isCustomizing ? "LOCK GOALS" : "ADJUST TARGETS"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setProtein(135);
                  setCarbs(180);
                  setFats(55);
                  setWater(2.2);
                  setActiveTime(40);
                }}
                className="px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/5 font-mono text-xs text-rose-400 hover:bg-rose-500/10 active:scale-95 transition-all flex items-center gap-1.5"
                title="Reset Intake Progress to baseline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                RESET PROGRESS
              </button>
            </div>
          </div>

          {/* Goal adjuster forms (only shown if isCustomizing is true) */}
          {isCustomizing && (
            <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl mb-6 grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block font-mono text-[10px] text-white/40 uppercase mb-1">Protein Goal (g)</label>
                <input
                  type="number"
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-1.5 font-mono text-xs text-white outline-none focus:border-cyan-400"
                  value={proteinGoal}
                  onChange={(e) => setProteinGoal(Math.max(1, Number(e.target.value)))}
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-white/40 uppercase mb-1">Carbs Goal (g)</label>
                <input
                  type="number"
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-1.5 font-mono text-xs text-white outline-none focus:border-cyan-400"
                  value={carbsGoal}
                  onChange={(e) => setCarbsGoal(Math.max(1, Number(e.target.value)))}
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-white/40 uppercase mb-1">Fats Goal (g)</label>
                <input
                  type="number"
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-1.5 font-mono text-xs text-white outline-none focus:border-cyan-400"
                  value={fatsGoal}
                  onChange={(e) => setFatsGoal(Math.max(1, Number(e.target.value)))}
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-white/40 uppercase mb-1">Water Goal (L)</label>
                <input
                  type="number"
                  step="0.5"
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-1.5 font-mono text-xs text-white outline-none focus:border-cyan-400"
                  value={waterGoal}
                  onChange={(e) => setWaterGoal(Math.max(0.5, Number(e.target.value)))}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block font-mono text-[10px] text-white/40 uppercase mb-1">Active Time Goal (m)</label>
                <input
                  type="number"
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-1.5 font-mono text-xs text-white outline-none focus:border-cyan-400"
                  value={activeTimeGoal}
                  onChange={(e) => setActiveTimeGoal(Math.max(1, Number(e.target.value)))}
                />
              </div>
            </div>
          )}

          {/* Master Grid Split: Visual Completion ring on the left, horizontal details with rapid logging buttons on the right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left side: Overall Score Indicator */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-zinc-900/30 rounded-2xl border border-white/5 text-center">
              <div className="relative w-32 h-32 flex items-center justify-center mb-3">
                {/* Visual completion ring using SVG */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Underlay Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Progress Glow Background */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#00E676"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * averageCompletion) / 100}
                    className="transition-all duration-700 ease-out opacity-20 filter blur-sm"
                  />
                  {/* Active Progress Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#00E676"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * averageCompletion) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                {/* Numeric Overlays */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-3xl font-black text-white leading-none">
                    {averageCompletion}%
                  </span>
                  <span className="font-mono text-[8px] text-[#00E676] tracking-wider mt-1 uppercase font-bold">
                    AGGREGATE GOAL
                  </span>
                </div>
              </div>
              
              <div className="space-y-1 w-full">
                <div className="font-mono text-[11px] font-bold text-white uppercase flex items-center gap-1.5 justify-center">
                  ENERGY QUOTA: {currentCalories} / {targetCalories} KCAL
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2 max-w-[180px] mx-auto">
                  <div 
                    className="h-full bg-[#00E676] rounded-full transition-all duration-500" 
                    style={{ width: `${totalCaloriesPercent}%` }} 
                  />
                </div>
                <p className="font-mono text-[9px] text-white/40 mt-1 uppercase">
                  {totalCaloriesPercent}% Energy Quota Achieved
                </p>
              </div>
            </div>

            {/* Right side: Detailed macro and goal horizontal tracker cards with quick log buttons */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Protein Tracker */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-emerald-400" />
                    <span className="font-mono text-xs font-bold text-white uppercase">PROTEIN SYSTEM</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {protein}g / {proteinGoal}g ({proteinPercent}%)
                  </span>
                </div>
                
                {/* Visual completion bar with shadow */}
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-2 relative">
                  <div 
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${proteinPercent}%` }}
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="font-mono text-[8px] text-white/30 uppercase mr-1.5">Quick Fuel Log:</span>
                  <button 
                    type="button"
                    onClick={() => setProtein(p => Math.min(proteinGoal + 100, p + 10))}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-[10px] font-mono rounded text-white"
                  >
                    +10g
                  </button>
                  <button 
                    type="button"
                    onClick={() => setProtein(p => Math.min(proteinGoal + 100, p + 25))}
                    className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 transition-all text-emerald-400 text-[10px] font-mono border border-emerald-500/20 rounded"
                  >
                    +25g (Whey Scoop)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setProtein(p => Math.min(proteinGoal + 100, p + 45))}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-[10px] font-mono rounded text-white"
                  >
                    +45g (Chicken/Beef)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setProtein(0)}
                    className="ml-auto px-1.5 py-1 text-[9px] font-mono text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 rounded uppercase"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Carbohydrates Tracker */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-amber-400" />
                    <span className="font-mono text-xs font-bold text-white uppercase">CARBOHYDRATES</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {carbs}g / {carbsGoal}g ({carbsPercent}%)
                  </span>
                </div>

                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-2 relative">
                  <div 
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${carbsPercent}%` }}
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="font-mono text-[8px] text-white/30 uppercase mr-1.5">Quick Fuel Log:</span>
                  <button 
                    type="button"
                    onClick={() => setCarbs(c => Math.min(carbsGoal + 150, c + 15))}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-[10px] font-mono rounded text-white"
                  >
                    +15g
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCarbs(c => Math.min(carbsGoal + 150, c + 40))}
                    className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 transition-all text-amber-400 text-[10px] font-mono border border-amber-500/20 rounded"
                  >
                    +40g (Rice/Oats)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCarbs(c => Math.min(carbsGoal + 150, c + 75))}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-[10px] font-mono rounded text-white"
                  >
                    +75g (Pre-Workout Stack)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCarbs(0)}
                    className="ml-auto px-1.5 py-1 text-[9px] font-mono text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 rounded uppercase"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Fats Tracker */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-indigo-400" />
                    <span className="font-mono text-xs font-bold text-white uppercase">HEALTHY FATS</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-indigo-400">
                    {fats}g / {fatsGoal}g ({fatsPercent}%)
                  </span>
                </div>

                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-2 relative">
                  <div 
                    className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${fatsPercent}%` }}
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="font-mono text-[8px] text-white/30 uppercase mr-1.5">Quick Fuel Log:</span>
                  <button 
                    type="button"
                    onClick={() => setFats(f => Math.min(fatsGoal + 50, f + 5))}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-[10px] font-mono rounded text-white"
                  >
                    +5g
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFats(f => Math.min(fatsGoal + 50, f + 14))}
                    className="px-2 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 active:scale-95 transition-all text-indigo-400 text-[10px] font-mono border border-indigo-500/20 rounded"
                  >
                    +14g (Olive oil)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFats(f => Math.min(fatsGoal + 50, f + 22))}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-[10px] font-mono rounded text-white"
                  >
                    +22g (Avocado)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFats(0)}
                    className="ml-auto px-1.5 py-1 text-[9px] font-mono text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 rounded uppercase"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Hydration & Workload Row Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Water Intake Card */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-white uppercase flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      HYDRATION INDEX
                    </span>
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {water.toFixed(1)}L / {waterGoal.toFixed(1)}L
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2 relative">
                    <div 
                      className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${waterPercent}%` }}
                    />
                  </div>

                  <div className="flex gap-1.5 items-center">
                    <button 
                      type="button"
                      onClick={() => setWater(w => Math.min(waterGoal + 2, w + 0.25))}
                      className="px-2 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/15 text-[10px] uppercase font-mono rounded hover:bg-cyan-500/20"
                    >
                      +250ml Glass
                    </button>
                    <button 
                      type="button"
                      onClick={() => setWater(w => Math.min(waterGoal + 2, w + 0.5))}
                      className="px-2 py-1 bg-white/5 text-white hover:bg-white/10 text-[10px] uppercase font-mono rounded"
                    >
                      +500ml Shaker
                    </button>
                  </div>
                </div>

                {/* Exertion Active Timer Card */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-white uppercase flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      ACTIVE DRILL EXERTION
                    </span>
                    <span className="font-mono text-xs font-bold text-rose-400">
                      {activeTime}m / {activeTimeGoal}m
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2 relative">
                    <div 
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${activePercent}%` }}
                    />
                  </div>

                  <div className="flex gap-1.5 items-center">
                    <button 
                      type="button"
                      onClick={() => setActiveTime(t => Math.min(activeTimeGoal + 120, t + 10))}
                      className="px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/15 text-[10px] uppercase font-mono rounded hover:bg-rose-500/20"
                    >
                      +10 Min
                    </button>
                    <button 
                      type="button"
                      onClick={() => setActiveTime(t => Math.min(activeTimeGoal + 120, t + 30))}
                      className="px-2 py-1 bg-white/5 text-white hover:bg-white/10 text-[10px] uppercase font-mono rounded"
                    >
                      +30 Min
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
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
