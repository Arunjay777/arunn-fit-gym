import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
  Dumbbell, Sparkles, Activity, Cpu, Zap, 
  ArrowRight, ShieldCheck, Trophy, Target,
  Flame, Utensils, Heart, History, Users, 
  Check, ChevronDown, HelpCircle, Eye, Play, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FitXLogo from '../components/FitXLogo';

// Real-time atmospheric gym/barbell background image
const landingBg = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1920';

export default function Landing() {
  const navigate = useNavigate();
  
  // States for interactive modules
  const [activeTab, setActiveTab] = useState<'all' | 'strength' | 'cardio' | 'mind'>('all');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Auto redirect if already authenticated
  const userRole = localStorage.getItem('userRole');
  if (userRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Programmes / Modules mapping (Les Mills style)
  const programmes = [
    {
      id: 'bodypump',
      title: 'BODY-STRENGTH: CHEST & ARMS',
      category: 'strength',
      duration: '45 MIN',
      intensity: 'HIGH INTENSITY',
      desc: 'The original barbell workout designed to shape, tone, and build high-fidelity muscle isolation across the chest, anterior delts, and arms.',
      color: 'from-rose-500 to-orange-500',
      tag: 'STRENGTH',
      path: '/workouts/chest',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'bodycombat',
      title: 'BODY-COMBAT: TACTICAL CARDIO',
      category: 'cardio',
      duration: '35 MIN',
      intensity: 'EXTREME POWER',
      desc: 'High-velocity martial arts-inspired cardio training. Burn calories and unlock peak conditioning without any compound weights.',
      color: 'from-cyan-500 to-blue-500',
      tag: 'CARDIO',
      path: '/workouts/cardio',
      image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'lesmillsgrit',
      title: 'CORE NEURAL HYPERTROPHY',
      category: 'strength',
      duration: '30 MIN',
      intensity: 'ATHLETIC ELITE',
      desc: 'A premium core compression and stability regimen utilizing biometric counter tracking for localized physical stabilization.',
      color: 'from-emerald-500 to-teal-500',
      tag: 'HIIT CORE',
      path: '/workouts/core',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'bodyflow',
      title: 'VITALITY FLOW: RECOVERY',
      category: 'mind',
      duration: '50 MIN',
      intensity: 'RESTORATIVE',
      desc: 'An ambient yoga and flexibility protocol mapped with neural diagnostics to speed up muscle repair, hydration levels and bio-stability.',
      color: 'from-purple-500 to-pink-500',
      tag: 'MINDFUL',
      path: '/vitals',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'gritathletic',
      title: 'LEGS & POSTERIOR POWER',
      category: 'strength',
      duration: '40 MIN',
      intensity: 'MAX VELOCITY',
      desc: 'Deep squat progressions and explosive plyometrics designed to optimize athletic burst, power output, and quad density.',
      color: 'from-amber-500 to-rose-600',
      tag: 'LEGS BUILD',
      path: '/workouts/legs',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'fuellean',
      title: 'DIET MACROS & FUEL HUB',
      category: 'mind',
      duration: 'DAILY',
      intensity: 'NUTRITIONAL Science',
      desc: 'Our precise metabolic planner that generates ideal caloric benchmarks, protein weights, and daily custom supplement recommendations.',
      color: 'from-violet-500 to-indigo-500',
      tag: 'FUEL LAB',
      path: '/diet-plan',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const filteredProgrammes = activeTab === 'all' 
    ? programmes 
    : programmes.filter(p => p.category === activeTab);

  // Instructors (Les Mills Master Trainers)
  const trainers = [
    {
      name: 'AJ OPERATOR',
      role: 'Head Athletic Director & Founder',
      specialty: 'High-Velocity Strength & Cardio Vitals',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
      accent: 'text-cyan-400'
    },
    {
      name: 'PRIME COMMANDER',
      role: 'Master Coach & Compliance Overseer',
      specialty: 'Core Compression & Administrative Roster Audits',
      image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=400',
      accent: 'text-emerald-400'
    },
    {
      name: 'SARAH CONNER',
      role: 'Bio-Diagnostic Specialist',
      specialty: 'Metabolic Nutrition & Hydration Metrics',
      image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=400',
      accent: 'text-rose-400'
    }
  ];

  // Frequently Asked Questions
  const faqs = [
    {
      q: 'What is SIMATS FitX On Demand and how does it mimic premium studios?',
      a: 'SIMATS FitX On Demand brings world-class scientific training programs—ranging from high-impact muscle isolation splits to neural diagnostics—straight to your laptop or tablet. Powered by localized offline persistence, it ensures your logs, sets, and progress metrics are recorded with extreme cryptographic precision.'
    },
    {
      q: 'How do the different security credentials function in the system?',
      a: 'The system runs on deep role-based access. Normal Athletes access customized training logs, core diets, and target reps. Elite Coaches and Administrators hold strict control keys (via commander credentials) giving them complete access to auditable workout charts, roster lists, and security clearance rosters.'
    },
    {
      q: 'Can I truly test-register a fresh account in real-time?',
      a: 'Absolutely! Our new live registration engine lets any brand-new user sign up as an Athlete or Coach instantly. The registry is deployed on the spot, allowing immediate log-ins with custom chosen safety passwords.'
    },
    {
      q: 'Are the physical workouts backed by sport science standards?',
      a: 'Yes. Every split (Legs, Back, Chest, Cardio) outlines direct targets, exact set constraints, and progress multipliers modeled on high-performance athletic regimens. Users can also configure injury thresholds and alert panels under our Vitals console.'
    }
  ];

  // Scroll anchor helper
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center overflow-x-hidden selection:bg-cyan-500/30 select-none pb-12" style={{ background: '#020202' }}>
      
      {/* Immersive Cybernetic Gym High-Contrast Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <img 
          src={landingBg} 
          alt="Immersive Cybernetic Gym" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-100 opacity-70 lg:opacity-75 filter contrast-110 saturate-110 brightness-95 transition-all duration-1000"
        />
        {/* Layered Gradient Veil for Ultimate Text Legibility (Deep space shadows) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/70 to-[#020202]/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020202]/30 via-transparent to-[#020202]/60" />
      </div>

      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{
             backgroundImage: 'radial-gradient(rgba(0, 212, 255, 0.3) 1px, transparent 1px), linear-gradient(rgba(0, 212, 255, 0.05) 1px, transparent 1px)',
             backgroundSize: '24px 24px',
           }} 
      />

      {/* Subtle Glowing Cyber Blobs */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 rounded-full bg-rose-500/5 blur-[120px] pointer-events-none z-0" />

      {/* FIXED LES MILLS HEADER BAR */}
      <header className="sticky top-0 w-full z-50 backdrop-blur-md bg-black/60 border-b border-white/[0.04] transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            {/* Project Brand Marks */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToId('hero')}>
              <FitXLogo className="w-10 h-10 filter drop-shadow-[0_0_10px_rgba(255,107,0,0.4)]" />
              <div>
                <span className="font-mono text-base font-black tracking-widest text-white">SIMATS FitX</span>
                <span className="block font-mono text-[7px] text-cyan-400 font-bold tracking-widest">TACTICAL DEMAND</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-[10px] font-mono tracking-widest text-white/50 uppercase font-semibold">
              <button onClick={() => scrollToId('programmes')} className="hover:text-white transition-colors cursor-pointer">PROGRAMMES</button>
              <button onClick={() => scrollToId('coaches')} className="hover:text-white transition-colors cursor-pointer">COACH STAFF</button>
              <button onClick={() => scrollToId('pricing')} className="hover:text-white transition-colors cursor-pointer">ACCESS PLANS</button>
              <button onClick={() => scrollToId('faqs')} className="hover:text-white transition-colors cursor-pointer">SUPPORT FAQs</button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/login', { state: { register: false } })}
              className="font-mono text-[10px] tracking-widest uppercase text-white/70 hover:text-white transition-all py-2 px-4 rounded-lg bg-white/[0.05] border border-white/10 hover:border-white/20"
            >
              LOG IN
            </button>
            <button 
              onClick={() => navigate('/login', { state: { register: true } })}
              className="font-mono text-[10px] tracking-widest uppercase px-4 py-2 rounded-lg bg-cyan-400 text-black hover:bg-cyan-300 transition-all font-black"
            >
              START FREE TRIAL
            </button>
          </div>
        </div>
      </header>

      {/* Main Core Section */}
      <main className="w-full relative z-10">

        {/* HERO CAROUSEL / HIGHLIGHT (ID: hero) */}
        <section id="hero" className="w-full max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-32 flex flex-col items-center justify-center text-center">
          
          {/* Status Indicator Pill */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/25 rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[8px] font-bold text-cyan-400 uppercase tracking-widest">STREAMING WORLDWIDE 24/7</span>
          </motion.div>

          {/* Majestic Bold Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-sans text-4xl sm:text-6xl lg:text-8xl font-black text-white leading-none tracking-tighter uppercase max-w-5xl"
          >
            SHAPING UNSHAKABLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-500">HUMANITY</span>. ANYTIME, ANYWHERE.
          </motion.h1>

          {/* Subtitle statement */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 font-sans text-sm sm:text-base text-white/60 max-w-3xl leading-relaxed font-light"
          >
            Stream the world’s elite muscle-isolation blueprints, target calorie macro planning systems, and biometric performance dashboards directly to your device. Set targets, log sets, and configure customized coaches dynamically.
          </motion.p>

          {/* Prominent Call to Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none"
          >
            <button
              onClick={() => navigate('/login', { state: { register: true } })}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4.5 rounded-xl bg-[#FA1E4E] text-white font-sans font-black text-xs uppercase tracking-widest hover:bg-[#D6153F] transition-all duration-300 shadow-[0_4px_30px_rgba(250,30,78,0.4)]"
            >
              <span>START YOUR 14-DAY FREE TRIAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollToId('programmes')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4.5 rounded-xl bg-black/40 border border-white/10 text-white font-sans font-bold text-xs uppercase tracking-widest hover:bg-white/[0.03] transition-all duration-300"
            >
              <span>EXPLORE PROGRAMMES</span>
            </button>
          </motion.div>

          {/* Trust/Metric Badges Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mt-20 w-full text-center border-t border-b border-white/[0.04] py-8">
            {[
              { value: '1,500+', label: 'BIOMETRIC WORKOUTS' },
              { value: '100% SECURE', label: 'COACH COMPLIANCE LOGS' },
              { value: 'Neural AI', label: 'COACHING POWERED BY GEMINI' },
              { value: 'ZERO-LATENCY', label: 'OFFLINE STATE STORE' }
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="font-mono text-xl md:text-2xl font-black text-white tracking-widest uppercase">{stat.value}</div>
                <div className="font-sans text-[8px] uppercase tracking-widest text-white/40 font-bold">{stat.label}</div>
              </div>
            ))}
          </div>

        </section>


        {/* INTERACTIVE PROGRAMME FILTER HUB (ID: programmes) */}
        <section id="programmes" className="w-full bg-[#070707] py-20 border-t border-b border-white/[0.03]">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div className="text-left">
                <span className="font-mono text-[9px] tracking-widest text-[#FA1E4E] font-black uppercase">CHOOSE YOUR VIBE</span>
                <h2 className="font-sans text-3xl md:text-4xl font-black text-white uppercase mt-1 tracking-tight">
                  WORLD-CLASS WORKOUT PROGRAMMES
                </h2>
                <p className="font-sans text-xs text-white/40 mt-2 max-w-xl">
                  Filter curated training schedules targeting distinct bodily disciplines. Try isolated hypertrophic splits, full cardio burnouts, or metabolic nutrition planners.
                </p>
              </div>

              {/* Filter Tabs Row */}
              <div className="flex flex-wrap gap-2 mt-6 md:mt-0 bg-black/40 p-1.5 border border-white/5 rounded-xl">
                {[
                  { key: 'all', label: 'ALL ACTIONS' },
                  { key: 'strength', label: 'STRENGTH PROGRESSIONS' },
                  { key: 'cardio', label: 'TACTICAL CARDIO & HIIT' },
                  { key: 'mind', label: 'BIO-METRICS & METABOLISM' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-4 py-2 rounded-lg font-mono text-[9px] tracking-wider uppercase font-black transition-all ${
                      activeTab === tab.key 
                        ? 'bg-[#FA1E4E] text-white shadow-lg' 
                        : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Program Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProgrammes.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c0c0c] flex flex-col justify-between group shadow-2xl hover:border-cyan-400/30 transition-all duration-300"
                    style={{ minHeight: '390px' }}
                  >
                    {/* Glowing Accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-50 group-hover:opacity-100 transition-opacity z-20" style={{ backgroundImage: `linear-gradient(to right, #FA1E4E, #3B82F6)` }} />
                    
                    {/* High-Contrast Dedicated Card Banner Image */}
                    {p.image && (
                      <div className="h-44 w-full overflow-hidden relative border-b border-white/[0.04]">
                        <img 
                          src={p.image} 
                          alt={p.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                          referrerPolicy="no-referrer"
                        />
                        {/* Soft ambient linear gradient masking */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-black/30" />
                        
                        {/* Floating Metadata indicators directly in image zone */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                          <span className="font-mono text-[8px] font-black uppercase text-white tracking-widest bg-[#FA1E4E] border border-[#FA1E4E] px-2.5 py-0.5 rounded shadow-lg">
                            {p.tag}
                          </span>
                          <div className="flex items-center gap-2 font-mono text-[8px] text-white bg-black/70 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded shadow-lg font-bold">
                            <span>{p.duration}</span>
                            <span>•</span>
                            <span className="text-cyan-400 font-extrabold">{p.intensity}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Content text description container below */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        {/* Title */}
                        <h3 className="font-sans text-base lg:text-lg font-black text-white uppercase leading-snug tracking-wide group-hover:text-cyan-400 transition-colors">
                          {p.title}
                        </h3>

                        {/* Desc */}
                        <p className="font-sans text-[11px] text-white/50 leading-relaxed font-light mt-3">
                          {p.desc}
                        </p>
                      </div>

                      {/* Footer Row action */}
                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
                          <span className="font-mono text-[9px] uppercase tracking-widest font-black text-white/70">
                            LOG-IN TO START
                          </span>
                        </div>
                        <button 
                          onClick={() => navigate('/login', { state: { register: false } })}
                          className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center border border-white/10 group-hover:bg-[#FA1E4E] group-hover:border-[#FA1E4E] group-hover:scale-105 transition-all"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>
        </section>


        {/* SCIENCE SPLIT GRID (FEATURE VALUE PROPOSITIONS) */}
        <section className="w-full max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="text-left space-y-6">
            <div>
              <span className="font-mono text-[9px] tracking-widest text-[#FA1E4E] font-black uppercase">THE SCIENCE OF PERFORMANCE</span>
              <h2 className="font-sans text-3xl md:text-5xl font-black text-white uppercase mt-1 tracking-tight">
                WHY SPORT SCIENCE GUIDES EVERY REP
              </h2>
            </div>
            
            <p className="font-sans text-xs sm:text-sm text-white/50 leading-relaxed font-light max-w-xl">
              We do not just construct simple workout spreadsheets. Our tactical engine merges localized biomechanical thresholds, real-time hydration logs, active injury bypass algorithms, and metabolic macro calculators.
            </p>

            <div className="space-y-4 pt-2">
              {[
                { title: 'DETERMINISTIC REVISION CONTROL', desc: 'Log individual dumbbell weights, daily reps, set metrics, and peak active metrics securely.' },
                { title: 'GEMINI AI WORKOUT CRITIQUE', desc: 'Ask our deep feedback model for active modifications if you face localized muscle strain or fatigue.' },
                { title: 'AUDITABLE COACH CONSENT LEDGER', desc: 'Ensure that only verified, highly accredited coaches modify regional master rosters or training instructions.' }
              ].map((feat, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-5 h-5 rounded-full border border-teal-400 bg-teal-400/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider">{feat.title}</h4>
                    <p className="font-sans text-[11px] text-white/40 mt-1 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Graphical Frame Box */}
          <div className="relative rounded-2xl border border-white/[0.04] bg-black/50 p-6 flex flex-col justify-between overflow-hidden group min-h-[380px]">
            {/* Ambient Graphic grid back */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                 style={{
                   backgroundImage: 'radial-gradient(#FA1E4E 1px, transparent 1px)',
                   backgroundSize: '16px 16px'
                 }} 
            />

            <div className="z-10 flex justify-between items-center pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FA1E4E] animate-ping" />
                <span className="font-mono text-[9px] uppercase tracking-widest font-black text-white/80">NEURAL KINETICS CONSOLE</span>
              </div>
              <span className="font-mono text-[8px] text-cyan-400 font-bold bg-cyan-400/10 px-2 py-0.5 rounded uppercase">SYSTEM MULTIPLIER READY</span>
            </div>

            {/* Mock Visual Metric Bars inside card */}
            <div className="z-10 my-6 space-y-3 flex-grow flex flex-col justify-center">
              {[
                { label: 'BODYPUMP SQUAT DENSITY', pct: '88%', col: 'bg-[#FA1E4E]' },
                { label: 'COACH COMPLIANCE SCORE', pct: '97%', col: 'bg-emerald-400' },
                { label: 'ATHLETE RECOVERY MULTIPLIER', pct: '74%', col: 'bg-cyan-400' },
              ].map((bar, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[9px] font-mono uppercase text-white/50">
                    <span>{bar.label}</span>
                    <span className="font-bold text-white">{bar.pct}</span>
                  </div>
                  <div className="w-full h-2 bg-white/[0.02] rounded-full overflow-hidden border border-white/5">
                    <div className={`h-full rounded-full ${bar.col}`} style={{ width: bar.pct }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="z-10 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#FA1E4E]" />
                <span className="font-sans text-[10px] text-white/50 uppercase">TARGET MASS DEVIATION RULINGS</span>
              </div>
              <span className="font-mono text-xs font-black text-teal-400">+12% VELOCITY</span>
            </div>

          </div>

        </section>


        {/* TRAIN WITH THE BEST - COACHES (ID: coaches) */}
        <section id="coaches" className="w-full bg-[#070707] py-20 border-t border-white/[0.03]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            
            <span className="font-mono text-[9px] tracking-widest text-[#FA1E4E] font-black uppercase">WORLD-CLASS EXPERTISE</span>
            <h2 className="font-sans text-3xl md:text-4xl font-black text-white uppercase mt-1 tracking-tight">
              MEET YOUR MASTER COACHES
            </h2>
            <p className="font-sans text-xs text-white/40 mt-2 max-w-xl mx-auto">
              Learn correct mechanical stances, nutritional targets, and system configuration directly from our elite athletic operations team.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 text-left">
              {trainers.map((tr, i) => (
                <div key={i} className="group relative rounded-2xl overflow-hidden border border-white/[0.04] bg-black/60 flex flex-col justify-between">
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={tr.image} 
                      alt={tr.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  </div>

                  <div className="p-6 space-y-2">
                    <span className="font-mono text-[8px] font-bold text-cyan-400 uppercase tracking-widest block">
                      {tr.specialty}
                    </span>
                    <h3 className="font-sans text-xl font-bold text-white uppercase tracking-wide">
                      {tr.name}
                    </h3>
                    <p className="font-sans text-xs text-white/40 leading-relaxed font-light">
                      {tr.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* INTERACTIVE PRICING SELECTOR (ID: pricing) */}
        <section id="pricing" className="w-full max-w-7xl mx-auto px-6 py-20 text-center">
          
          <span className="font-mono text-[9px] tracking-widest text-[#FA1E4E] font-black uppercase">CHOOSE YOUR COHORT ACCESS</span>
          <h2 className="font-sans text-3xl md:text-5xl font-black text-white uppercase mt-1 tracking-tight">
            SIMPLE, TRANSPARENT ACCESS PLANS
          </h2>
          <p className="font-sans text-xs text-white/40 mt-2 max-w-xl mx-auto">
            Choose standard athletic access or unlock complete coach commander consoles with full rosters. Switch billing cycles anytime.
          </p>

          {/* Toggle buttons billing */}
          <div className="flex items-center justify-center gap-3 mt-8 mb-12">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-lg font-mono text-[9px] tracking-wider uppercase font-black transition-all ${
                billingPeriod === 'monthly' ? 'bg-white text-black font-bold' : 'text-white/40 hover:text-white'
              }`}
            >
              BILL MONTHLY
            </button>
            <button
              onClick={() => setBillingPeriod('annually')}
              className={`px-4 py-2 rounded-lg font-mono text-[9px] tracking-wider uppercase font-black transition-all ${
                billingPeriod === 'annually' ? 'bg-white text-black font-bold' : 'text-white/40 hover:text-white'
              }`}
            >
              BILL ANNUALLY (SAVE 20%)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            
            {/* Standard Athlete access plan */}
            <div className="relative rounded-2xl border border-white/[0.04] bg-black/60 p-8 flex flex-col justify-between hover:border-cyan-400/40 transition-colors">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[8px] font-bold text-cyan-400 tracking-widest uppercase bg-cyan-400/10 px-2.5 py-0.5 rounded">MOST POPULAR</span>
                    <h3 className="font-sans text-2xl font-black text-white uppercase mt-2">ATHLETE RECORD PASS</h3>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-3xl font-black text-white">
                      {billingPeriod === 'monthly' ? '₹1,199' : '₹899'}
                    </span>
                    <span className="font-mono text-[9px] text-white/40 block">/ MONTH</span>
                  </div>
                </div>

                <p className="font-sans text-[11px] text-white/50 leading-relaxed font-light">
                  Complete access to custom target training splits (Chest, Legs, Core, Back), daily vitals trackers, metabolic nutrition planners and standard test operator credentials.
                </p>

                <div className="space-y-2 pt-2">
                  {[
                    'Instant access to 1500+ dynamic sport routines',
                    'Biometric tracking of hydration metrics & water weight',
                    'Active injury strain log checkers',
                    'Basic local leaderboard and 1-rep-max calculators',
                    'Save custom weights used per unique session'
                  ].map((inc, i) => (
                    <div key={i} className="flex gap-2.5 items-center text-[10px] font-sans text-white/70">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => navigate('/login', { state: { register: true } })}
                className="w-full py-4.5 rounded-xl border border-white/15 bg-white/[0.01] hover:bg-[#FA1E4E] hover:border-[#FA1E4E] text-white font-sans font-black text-xs uppercase tracking-widest transition-all mt-8"
              >
                START 14-DAY FREE TRIAL
              </button>
            </div>

            {/* Admin Commander coach pass */}
            <div className="relative rounded-2xl border border-white/[0.04] bg-[#0E0E0E]/80 p-8 flex flex-col justify-between hover:border-[#FA1E4E]/40 transition-colors">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[8px] font-bold text-[#FA1E4E] tracking-widest uppercase bg-[#FA1E4E]/10 px-2.5 py-0.5 rounded">ELITE OFFICE</span>
                    <h3 className="font-sans text-2xl font-black text-white uppercase mt-2">COACH COMMANDER</h3>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-3xl font-black text-white">
                      {billingPeriod === 'monthly' ? '₹3,299' : '₹2,599'}
                    </span>
                    <span className="font-mono text-[9px] text-white/40 block">/ MONTH</span>
                  </div>
                </div>

                <p className="font-sans text-[11px] text-white/50 leading-relaxed font-light">
                  Tailored specifically for fitness instructors, nutrition specialists, and administrators. Grants auditable workout ledgers, active coach credentials, security logs, and master roster management.
                </p>

                <div className="space-y-2 pt-2">
                  {[
                    'All features included in Athlete Record Pass',
                    'Comprehensive compliance ledger audit controls',
                    'Verify brand new registered accounts',
                    'Track average cohort metrics and hydration speeds',
                    'Override master program layouts and instructions'
                  ].map((inc, i) => (
                    <div key={i} className="flex gap-2.5 items-center text-[10px] font-sans text-white/70">
                      <Check className="w-3.5 h-3.5 text-[#FA1E4E] shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => navigate('/login', { state: { register: true } })}
                className="w-full py-4.5 rounded-xl bg-[#FA1E4E] text-white font-sans font-black text-xs uppercase tracking-widest hover:bg-[#D6153F] transition-all mt-8"
              >
                PROMOTION: ENLIST AS COACH
              </button>
            </div>

          </div>

        </section>


        {/* METICULOUS FREQUENTLY ASKED QUESTIONS (ID: faqs) */}
        <section id="faqs" className="w-full bg-[#070707] py-24 border-t border-b border-white/[0.03]">
          <div className="max-w-4xl mx-auto px-6">
            
            <div className="text-center mb-12">
              <span className="font-mono text-[9px] tracking-widest text-[#FA1E4E] font-black uppercase">GOT QUESTIONS?</span>
              <h2 className="font-sans text-3xl font-black text-white uppercase mt-1 tracking-tight">
                FREQUENTLY ASKED QUESTIONS
              </h2>
              <p className="font-sans text-xs text-white/40 mt-1">
                Everything you require to deploy your operational athlete routines and custom profiles.
              </p>
            </div>

            {/* Accordion container */}
            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-white/[0.04] bg-black/40 rounded-xl overflow-hidden transition-colors hover:border-white/10"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 flex items-center justify-between text-left cursor-pointer select-none"
                    >
                      <span className="font-sans text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2.5 pr-4">
                        <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                        {faq.q}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-white/45 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="px-5 pb-5 pt-1 text-[11px] font-sans text-white/50 leading-relaxed font-light border-t border-white/[0.02]">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-7xl mx-auto px-6 pt-12 border-t border-white/[0.03] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left text-[10px] font-mono text-white/30">
        <div>
          <span>© 2026 SIMATS FitX ATHLETICS PERFORMANCE SYSTEMS. ALL WORLD-CLASS CHOREOGRAPHY RIGHTS CONSERVED.</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span className="text-[#FA1E4E] font-bold">• SHAPING COMPLIANT & ATTAINABLE PERFORMANCE TACTICS</span>
          <span className="text-white/20">|</span>
          <span className="text-cyan-400 font-bold">100% PERSISTED REGISTER ENGINE</span>
        </div>
      </footer>

    </div>
  );
}
