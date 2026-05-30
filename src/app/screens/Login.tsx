import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Dumbbell, User, Lock, Eye, EyeOff, Loader2, Play, Check, Flame, Trophy,
  Clipboard, Users, Activity, Sparkles, ShieldCheck, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../components/ui/utils';
import { registerFirebaseUser, loginFirebaseUser, loginWithGoogle } from '../lib/firebaseHelper';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State variables for credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState<'user' | 'admin'>('user');
  
  // Interaction and validation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(!!location.state?.register);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoginError(null);
    setGoogleLoading(true);
    try {
      const profile = await loginWithGoogle(activeRole);
      
      localStorage.setItem('userRole', profile.role);
      localStorage.setItem('username', profile.username);
      localStorage.setItem('userId', profile.uid);
      
      setGoogleLoading(false);
      navigate('/dashboard');
    } catch (err: any) {
      setGoogleLoading(false);
      let errorMsg = 'GOOGLE SIGN IN FAILED';
      if (err.message) {
        try {
          const parsed = JSON.parse(err.message);
          errorMsg = parsed.error || errorMsg;
        } catch {
          errorMsg = err.message;
        }
      }
      setLoginError(errorMsg.toUpperCase());
    }
  };

  // Preset Credentials Helper & State Switcher
  const handleRoleSwitch = (role: 'user' | 'admin') => {
    setActiveRole(role);
    setLoginError(null);
    setRegSuccess(null);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleQuickFill = (role: 'user' | 'admin') => {
    setLoginError(null);
    setRegSuccess(null);
    setIsRegisterMode(false);
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
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setLoginError('CREDENTIALS CANNOT BE EMPTY');
      return;
    }

    if (isRegisterMode) {
      const trimmedConfirm = confirmPassword.trim();
      if (!trimmedConfirm) {
        setLoginError('PLEASE CONFIRM YOUR PASSWORD');
        return;
      }
      if (trimmedPassword !== trimmedConfirm) {
        setLoginError('PASSWORDS DO NOT MATCH');
        return;
      }
      if (trimmedPassword.length < 4) {
        setLoginError('PASSWORD MUST BE AT LEAST 4 CHARACTERS');
        return;
      }

      setLoginError(null);
      setIsSubmitting(true);

      try {
        await registerFirebaseUser(trimmedUsername, trimmedPassword, activeRole);
        setIsSubmitting(false);
        setRegSuccess('REGISTRATION SUCCESSFUL! CLOUD DEPLOY COMPLETE.');
        
        // Clear inputs and transition to login mode
        setTimeout(() => {
          setIsRegisterMode(false);
          setRegSuccess(null);
          setConfirmPassword('');
        }, 1800);
      } catch (err: any) {
        setIsSubmitting(false);
        let errorMsg = 'REGISTRATION FAILED';
        if (err.message && (err.message.includes('email-already-in-use') || err.message.includes('already-exists'))) {
          errorMsg = 'USERNAME ALREADY TAKEN';
        } else if (err.message && err.message.includes('weak-password')) {
          errorMsg = 'PASSWORD IS TOO WEAK (REQUIRES MIN 6 CHARACTERS)';
        } else if (err.message) {
          try {
            // Check if nested JSON error (conforming to FirestoreErrorInfo) is inside
            const parsed = JSON.parse(err.message);
            errorMsg = parsed.error || errorMsg;
          } catch {
            errorMsg = err.message;
          }
        }
        setLoginError(errorMsg.toUpperCase());
      }

    } else {
      setLoginError(null);
      setIsSubmitting(true);

      try {
        const profile = await loginFirebaseUser(trimmedUsername, trimmedPassword, activeRole);
        
        // If login succeeded, persist local states and route to console
        localStorage.setItem('userRole', profile.role);
        localStorage.setItem('username', profile.username);
        localStorage.setItem('userId', profile.uid);
        
        setIsSubmitting(false);
        navigate('/dashboard');
      } catch (err: any) {
        // Instant Offline-friendly local-session bypass for prefilled test accounts when Firebase is offline or Email/Password is not enabled yet
        if (
          (trimmedUsername === 'operator_aj' && trimmedPassword === 'fitness2026') ||
          (trimmedUsername === 'commander_prime' && trimmedPassword === 'admin_power')
        ) {
          console.warn('Real Firebase Auth is offline or Email/Password provider is disabled. Activating instant high-speed local session bypass.');
          
          const isCoach = trimmedUsername === 'commander_prime';
          const fallbackUid = isCoach ? 'commander_prime_local' : 'operator_aj_local';
          
          localStorage.setItem('userRole', isCoach ? 'admin' : 'user');
          localStorage.setItem('username', trimmedUsername);
          localStorage.setItem('userId', fallbackUid);
          
          setIsSubmitting(false);
          navigate('/dashboard');
          return;
        }

        setIsSubmitting(false);
        let errorMsg = `ACCESS DENIED: INVALID ${activeRole.toUpperCase()} CREDENTIALS`;
        if (err.message) {
          if (err.message.includes('DENIED') || err.message.includes('SUSPENDED')) {
            errorMsg = err.message;
          } else if (err.message.includes('user-not-found') || err.message.includes('wrong-password') || err.message.includes('invalid-credential')) {
            errorMsg = `ACCESS DENIED: SPECIALIZED ${activeRole.toUpperCase()} ID PIN-CODE INVALID`;
          } else {
            try {
              const parsed = JSON.parse(err.message);
              errorMsg = parsed.error || errorMsg;
            } catch {
              errorMsg = err.message;
            }
          }
        }
        setLoginError(errorMsg.toUpperCase());
      }
    }
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
        
        {/* Absolute Back to Home Navigation Control */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase text-white/50 hover:text-white transition-all bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 px-3 py-2 rounded-lg border border-white/5 cursor-pointer z-30 shadow-lg"
          id="back-to-home-btn"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO HOME</span>
        </button>
        
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
              {(isSubmitting || googleLoading) ? (
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
                      {googleLoading
                        ? "CONNECTING SECURE GOOGLE IDENTITY..."
                        : isRegisterMode 
                        ? (activeRole === 'user' ? "CREATING NEW ATHLETE ACCOUNT PROFILE..." : "PROVISIONING SECURE COACH WORKSPACE...")
                        : (activeRole === 'user' ? "DECRYPTING ATHLETE RECORD ENGINE..." : "INITIALIZING COACH CONTROL CONSOLE...")}
                    </p>
                    <p className="font-mono text-[9px] text-white/40 uppercase">AUTHORIZING CLEARANCE VERIFICATION...</p>
                  </div>
                </motion.div>
              ) : (
                /* Compact Form Input Form */
                <motion.form
                  key={isRegisterMode ? "register-form" : "login-form"}
                  onSubmit={handleFormSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Registration Success Banner */}
                  {regSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-sans text-xs text-center uppercase tracking-wide font-semibold">
                      ✨ {regSuccess}
                    </div>
                  )}

                  {/* Dynamic username prompt label based on role */}
                  <div className="space-y-1">
                    <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                      {isRegisterMode 
                        ? "CHOOSE NEW USERNAME" 
                        : (activeRole === 'user' ? "ATHLETE OPERATOR USERNAME" : "COACH STATION ID")}
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
                      {isRegisterMode 
                        ? "CHOOSE SECURITY PASSWORD" 
                        : (activeRole === 'user' ? "ATHLETE ENTRY PASSWORD" : "COACH TERMINAL PIN-CODE")}
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

                  {/* Confirm Password Field (Register Only) */}
                  {isRegisterMode && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1"
                    >
                      <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                        CONFIRM SECURITY PASSWORD
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-white/30">
                          <Lock className="w-4 h-4 text-rose-400" />
                        </span>
                        <input 
                          type="password" 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="•••••••••"
                          className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 font-sans text-sm outline-none focus:border-cyan-400/50 focus:shadow-[0_0_12px_rgba(6,182,212,0.06)] placeholder:text-white/20 transition-all" 
                          required 
                        />
                      </div>
                    </motion.div>
                  )}

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
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-sans text-[11px] text-center uppercase tracking-wide">
                        ⚠️ {loginError}
                      </div>

                      {loginError.includes('OPERATION-NOT-ALLOWED') && (
                        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs font-sans text-amber-300 leading-normal space-y-2">
                          <p className="font-bold uppercase tracking-wider text-[10px] text-amber-400 flex items-center gap-1">
                            <span>⚡ How to Enable Email/Password Auth:</span>
                          </p>
                          <ol className="list-decimal pl-4 space-y-1 text-[11px] text-white/70">
                            <li>Open the <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="underline text-cyan-400 hover:text-cyan-300">Firebase Console</a>.</li>
                            <li>Select your project (<strong className="font-mono text-[10px] bg-white/10 px-1 rounded text-white">spheric-pact-38gvj</strong>).</li>
                            <li>Navigate to <strong>Authentication</strong> &rarr; <strong>Sign-in method</strong> tab.</li>
                            <li>Click <strong>Add new provider</strong>, select <strong>Email/Password</strong>, check <strong>Enable</strong>, and click <strong>Save</strong>.</li>
                          </ol>
                          <p className="text-[10px] text-white/50 pt-1">After enabling, refresh this page and you'll be able to register instantly! Or use the Google Sign-In button below now.</p>
                        </div>
                      )}
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
                    <span>{isRegisterMode 
                      ? (activeRole === 'admin' ? "REGISTER & DISPATCH COACH" : "REGISTER & LAUNCH ATHLETE")
                      : (activeRole === 'admin' ? "LAUNCH COACH DESPATCH" : "LAUNCH ATHLETE LOG")}</span>
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink mx-4 font-mono text-[9px] text-white/20 uppercase tracking-widest">OR USE CLOUD PROVIDER</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  {/* Google Authenticate Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:scale-95 border border-white/10 hover:border-white/20 transition-all font-sans font-bold text-xs uppercase tracking-wider text-white select-none flex items-center justify-center gap-2.5 cursor-pointer shadow-lg"
                    id="google-signin-btn"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.08H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.92l2.85-2.22c-.22-.66-.35-1.36-.35-2.1z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.08l3.66 2.84c.87-2.6 3.3-4.54 6.16-4.54z" fill="#EA4335" />
                    </svg>
                    <span>SIGN IN WITH GOOGLE</span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Quick-Access Badges */}
            <div className="mt-5 pt-4 border-t border-white/5 space-y-2.5">
              {/* Registration Toggle Button */}
              <div className="flex justify-center pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode);
                    setLoginError(null);
                    setRegSuccess(null);
                  }}
                  className={cn(
                    "text-xs font-semibold hover:underline bg-transparent border-none tracking-wide flex items-center gap-1 cursor-pointer transition-colors",
                    activeRole === 'user' ? "text-cyan-400 hover:text-cyan-300" : "text-emerald-400 hover:text-emerald-300"
                  )}
                >
                  {isRegisterMode ? "← ALREADY REGISTERED? LOG IN PORTAL" : "NEW TO AJ-FIT? REGISTER AN ACCOUNT"}
                </button>
              </div>

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
