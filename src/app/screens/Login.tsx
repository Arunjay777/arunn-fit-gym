import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dumbbell, User, Lock, Eye, EyeOff, Loader2, Play, Check, Flame, Trophy,
  Clipboard, Users, Activity, Sparkles, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../components/ui/utils';

export default function Login() {
  const navigate = useNavigate();
  
  // State variables for credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState<'user' | 'admin'>('user');
  
  // Interaction and validation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Preset Credentials Helper & State Switcher
  const handleRoleSwitch = (role: 'user' | 'admin') => {
    setActiveRole(role);
    setLoginError(null);
    setUsername('');
    setPassword('');
  };

  const handleQuickFill = (role: 'user' | 'admin') => {
    setLoginError(null);
    if (role === 'user') {
      setUsername('operator_aj');
      setPassword('fitness2026');
      setActiveRole('user');
    } else {
      setUsername('commander_prime');
      setPassword('admin_power');
      setActiveRole('admin');
    }
  };

  // Submit flow
  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setLoginError('CREDENTIALS CANNOT BE EMPTY');
      return;
    }

    setLoginError(null);
    setIsSubmitting(true);

    // Dynamic professional validation delay
    await new Promise((resolve) => setTimeout(resolve, 1400));

    // Proper login validation logic
    if (activeRole === 'admin') {
      if (trimmedUsername !== 'commander_prime' || trimmedPassword !== 'admin_power') {
        setIsSubmitting(false);
        setLoginError('ACCESS DENIED: INVALID COACH CREDENTIALS');
        return;
      }
    } else {
      if (trimmedUsername !== 'operator_aj' || trimmedPassword !== 'fitness2026') {
        setIsSubmitting(false);
        setLoginError('ACCESS DENIED: INVALID ATHLETE CREDENTIALS');
        return;
      }
    }

    localStorage.setItem('userRole', activeRole);
    setIsSubmitting(false);
    navigate('/');
  };

  // Left side image mapping based on role
  const leftGymImg = activeRole === 'user' 
    ? "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80" // Gritty, powerful gym weight room
    : "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1200&auto=format&fit=crop&q=80"; // Clean, elite custom studio rack for program designers

  return (
    <div className="min-h-screen flex text-white select-none relative" style={{ background: '#08080c' }}>
      
      {/* 50/50 Layout: Left Side is a Beautiful Moody Gym Visual (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 border-r border-white/5 overflow-hidden">
        
        {/* Animated Cross-dissolve Left visual images */}
        <AnimatePresence mode="wait">
          <motion.img 
            key={activeRole}
            src={leftGymImg}
            alt={activeRole === 'user' ? "Athlete training" : "Coach programming setup"}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover scale-[1.01] brightness-[0.35] contrast-[1.15]"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6 }}
          />
        </AnimatePresence>

        {/* Grid Overlay for premium texture & scanning vibe */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/50 to-transparent z-10" />
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none z-10" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
            backgroundSize: '24px 24px' 
          }} 
        />

        {/* Dynamic Coach vs Athlete details on Left overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-12 z-20">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("h-[2px] w-6 rounded-full", activeRole === 'user' ? "bg-cyan-400" : "bg-emerald-400")} />
              <span className="font-mono text-xs text-white/40 tracking-widest uppercase">
                AJ-FIT CONSOLE TERMINAL
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {activeRole === 'user' ? (
                <motion.div 
                  key="user-quotes"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold tracking-widest uppercase">
                    <Trophy className="w-4 h-4" />
                    Athlete routine center
                  </div>
                  <h2 className="font-sans font-extrabold text-3xl xl:text-4xl text-white tracking-tight leading-tight uppercase">
                    REWRITE YOUR LIMITS.<br />
                    TRACK EVERY SINGLE REP.
                  </h2>
                  <p className="font-sans text-xs text-white/50 leading-relaxed max-w-md">
                    Unlock professional athletic tools. Log your workouts, review power & endurance metrics, adjust hydration status, and track your strict caloric intake.
                  </p>
                  
                  {/* Athlete Details list only */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                    <div className="space-y-1">
                      <div className="font-mono text-cyan-400 text-lg font-bold leading-none">WORKOUT BIOMETRICS</div>
                      <div className="font-sans text-[10px] text-white/40 uppercase">Real-time Volume Logs</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-mono text-cyan-400 text-lg font-bold leading-none">STREAKS & GOALS</div>
                      <div className="font-sans text-[10px] text-white/40 uppercase">Personal Records Tracker</div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="admin-quotes"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold tracking-widest uppercase">
                    <ShieldCheck className="w-4 h-4" />
                    Coach Program dispatcher
                  </div>
                  <h2 className="font-sans font-extrabold text-3xl xl:text-4xl text-white tracking-tight leading-tight uppercase">
                    DESIGN THE PROTOCOL.<br />
                    GUIDE ATHLETE SUCCESS.
                  </h2>
                  <p className="font-sans text-xs text-white/50 leading-relaxed max-w-md">
                    Unlock professional administration suites. Dispatch heavy injury logs, build structured custom protocols, review deload phases, and analyze roster fitness fatigue.
                  </p>

                  {/* Coach Details list only */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                    <div className="space-y-1">
                      <div className="font-mono text-emerald-400 text-lg font-bold leading-none">PROGRAM DESIGNER</div>
                      <div className="font-sans text-[10px] text-white/40 uppercase">Custom split presets</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-mono text-emerald-400 text-lg font-bold leading-none">ROSTER MONITOR</div>
                      <div className="font-sans text-[10px] text-white/40 uppercase">Active client diagnostics</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Side / Mobile Centered Minimalistic Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        
        {/* Background ambient lighting matches the active role colour */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ 
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '32px 32px' 
        }} />
        
        <AnimatePresence>
          {activeRole === 'user' ? (
            <motion.div 
              key="user-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-cyan-500/[0.04] blur-3xl pointer-events-none"
            />
          ) : (
            <motion.div 
              key="admin-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-emerald-500/[0.04] blur-3xl pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Login Body Anim */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-[420px] z-10"
        >
          {/* Brand/Logo Section: Gym Dumbbell or Dynamic Coach Clipboard Icon */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <AnimatePresence mode="wait">
                {activeRole === 'user' ? (
                  <motion.div 
                    key="athlete-logo"
                    initial={{ scale: 0.8, opacity: 0, rotate: -30 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.8, opacity: 0, rotate: 30 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)] text-cyan-400"
                  >
                    <Dumbbell className="w-8 h-8" />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="coach-logo"
                    initial={{ scale: 0.8, opacity: 0, rotate: -30 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.8, opacity: 0, rotate: 30 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)] text-emerald-400"
                  >
                    <Clipboard className="w-8 h-8" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <h1 className="font-sans font-black text-2xl tracking-tight text-white uppercase leading-none">
              AJ-FIT <span className={cn(activeRole === 'user' ? "text-cyan-400" : "text-emerald-400", "font-light")}>
                {activeRole === 'user' ? "ATHLETE" : "COACH"}
              </span>
            </h1>
            
            <p className="font-sans text-[10px] text-white/40 uppercase tracking-widest mt-1.5 font-medium">
              {activeRole === 'user' ? "HYBRID ENDURANCE & STRENGTH OPERATING CENTER" : "TACTICAL STRATEGY & CLIENT PROGRAM MANAGER"}
            </p>
          </div>

          {/* Clean Glassmorphic Card Panel */}
          <div className="bg-[#111218]/90 border border-white/5 backdrop-blur-2xl p-6 sm:p-8 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative">
            
            {/* Clearance Level / Role Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-white/5 rounded-xl border border-white/5 mb-6">
              <button
                type="button"
                onClick={() => handleRoleSwitch('user')}
                className={cn(
                  "py-2 font-sans text-xs font-semibold rounded-lg transition-all relative z-10 uppercase tracking-wide",
                  activeRole === 'user' ? "text-black" : "text-white/45 hover:text-white"
                )}
              >
                {activeRole === 'user' && (
                  <motion.div 
                    layoutId="activeRoleTab"
                    className="absolute inset-0 rounded-lg bg-cyan-400 font-bold"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <span className="relative z-20">ATHLETE ROUTINE</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleRoleSwitch('admin')}
                className={cn(
                  "py-2 font-sans text-xs font-semibold rounded-lg transition-all relative z-10 uppercase tracking-wide",
                  activeRole === 'admin' ? "text-black animate-duration-300" : "text-white/45 hover:text-white"
                )}
              >
                {activeRole === 'admin' && (
                  <motion.div 
                    layoutId="activeRoleTab"
                    className="absolute inset-0 rounded-lg bg-emerald-400 font-bold"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <span className="relative z-20">COACH DISPATCH</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isSubmitting ? (
                /* Sleek Loading Overlay */
                <motion.div
                  key="submitting"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-10 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="relative">
                    <Loader2 className={cn("w-12 h-12 animate-spin", activeRole === 'user' ? "text-cyan-400" : "text-emerald-400")} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-sans text-xs font-bold text-white uppercase tracking-wider">
                      {activeRole === 'user' ? "DECRYPTING ATHLETE RECORD ENGINE..." : "INITIALIZING COACH CONTROL CONSOLE..."}
                    </p>
                    <p className="font-mono text-[9px] text-white/40 uppercase">AUTHORIZING CLEARANCE VERIFICATION...</p>
                  </div>
                </motion.div>
              ) : (
                /* Compact Form Input Form */
                <motion.form
                  key="form"
                  onSubmit={handleFormLogin}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Dynamic username prompt label based on role */}
                  <div className="space-y-1">
                    <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                      {activeRole === 'user' ? "ATHLETE OPERATOR USERNAME" : "COACH STATION ID"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-white/30">
                        <User className="w-4 h-4" />
                      </span>
                      <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={activeRole === 'user' ? "e.g. operator_aj" : "e.g. commander_prime"}
                        className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 font-sans text-sm outline-none focus:border-cyan-400/50 focus:shadow-[0_0_12px_rgba(6,182,212,0.06)] placeholder:text-white/20 transition-all" 
                        required 
                      />
                    </div>
                  </div>

                  {/* Password Encryption Field */}
                  <div className="space-y-1">
                    <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                      {activeRole === 'user' ? "ATHLETE ENTRY PASSWORD" : "COACH TERMINAL PIN-CODE"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-white/30">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="•••••••••"
                        className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3 pl-11 pr-11 font-sans text-sm outline-none focus:border-cyan-400/50 focus:shadow-[0_0_12px_rgba(6,182,212,0.06)] placeholder:text-white/20 transition-all" 
                        required 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {activeRole === 'admin' ? (
                    /* Coach-only descriptive checklist block */
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-1.5 font-sans font-bold text-[9px] text-emerald-400 uppercase tracking-wide">
                        <Activity className="w-3.5 h-3.5" />
                        Coach Dispatch Parameters
                      </div>
                      <div className="font-sans text-[9.5px] text-white/50 leading-normal space-y-0.5">
                        <div>• Edit high-capacity hypertrophy splits</div>
                        <div>• Record injury indicators & recover cycles</div>
                        <div>• Allocate customized supplements formulas</div>
                      </div>
                    </div>
                  ) : (
                    /* Athlete-only details block */
                    <div className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-1.5 font-sans font-bold text-[9px] text-cyan-400 uppercase tracking-wide">
                        <Sparkles className="w-3.5 h-3.5" />
                        Athlete Performance Parameters
                      </div>
                      <div className="font-sans text-[9.5px] text-white/50 leading-normal space-y-0.5">
                        <div>• Access dynamic Chest, Shoulder & Back workouts</div>
                        <div>• Log calorie trackers & real-time intake details</div>
                        <div>• View custom milestones & unlocked medals</div>
                      </div>
                    </div>
                  )}

                  {/* Validation Errors representation */}
                  {loginError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-sans text-[11px] text-center uppercase tracking-wide">
                      ⚠️ {loginError}
                    </div>
                  )}

                  {/* Action submit button */}
                  <button 
                    type="submit" 
                    className={cn(
                      "w-full py-3.5 rounded-xl font-sans font-bold text-xs uppercase tracking-widest text-black hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden flex items-center justify-center gap-1.5 mt-2 cursor-pointer",
                      activeRole === 'admin' 
                        ? "bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:bg-emerald-300" 
                        : "bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:bg-cyan-300"
                    )}
                  >
                    <span>{activeRole === 'admin' ? "LAUNCH COACH DESPATCH" : "LAUNCH ATHLETE LOG"}</span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Quick-Access Badges */}
            <div className="mt-5 pt-4 border-t border-white/5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-sans text-[9px] text-white/30 uppercase tracking-widest font-bold">
                  {activeRole === 'user' ? "ATHLETE TEST ACCOUNT" : "COACH TEST ACCOUNT"}
                </span>
                <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", activeRole === 'user' ? "bg-cyan-400" : "bg-emerald-400")} />
              </div>
              
              <div className="grid grid-cols-1">
                {activeRole === 'user' ? (
                  <button
                    type="button"
                    onClick={() => handleQuickFill('user')}
                    className="p-2 bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-left transition-all active:scale-95 flex items-center justify-between cursor-pointer text-cyan-400"
                  >
                    <div className="min-w-0">
                      <span className="font-sans font-bold text-[9px] uppercase tracking-wider block">PREFILL ATHLETE</span>
                      <span className="font-mono text-[9px] opacity-70 block truncate">ID: operator_aj</span>
                    </div>
                    <Check className="w-4 h-4 text-cyan-400" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleQuickFill('admin')}
                    className="p-2 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-left transition-all active:scale-95 flex items-center justify-between cursor-pointer text-emerald-400"
                  >
                    <div className="min-w-0">
                      <span className="font-sans font-bold text-[9px] uppercase tracking-wider block">PREFILL COACH</span>
                      <span className="font-mono text-[9px] opacity-70 block truncate">ID: commander_prime</span>
                    </div>
                    <Check className="w-4 h-4 text-emerald-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
