import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Dumbbell, Play, Pause, Check, 
  Clock, Flame, Award, Plus, Info, 
  CheckCircle2, ChevronRight 
} from 'lucide-react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { cn } from '../components/ui/utils';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight: string;
  rest: number;
  target: string;
  tip: string;
  image: string;
}

const shoulderExercises: Exercise[] = [
  { 
    name: 'Overhead Barbell Press', 
    sets: 4, 
    reps: '6-8', 
    weight: '135 lbs', 
    rest: 90, 
    target: 'Anterior Deltoids & Triceps', 
    tip: 'Press the bar straight up while squeezing your glutes and core to stabilize your lower back.',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Dumbbell Lateral Raises', 
    sets: 4, 
    reps: '12-15', 
    weight: '25 lbs', 
    rest: 60, 
    target: 'Lateral Deltoids (Width)', 
    tip: 'Lead with your elbows and tilt the weight forward slightly at the top, like pouring water.',
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Rear Delt Dumbbell Flyes', 
    sets: 3, 
    reps: '12-15', 
    weight: '20 lbs', 
    rest: 60, 
    target: 'Posterior Deltoids', 
    tip: 'Hinge forward at the hips. Pull dumbbells out to the sides focusing on your back-shoulder muscles.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Dumbbell Front Raises', 
    sets: 3, 
    reps: '10-12', 
    weight: '30 lbs', 
    rest: 60, 
    target: 'Anterior Deltoid Isolation', 
    tip: 'Control the descent. Do not swing your torso forward or backward to lift the dumbbells.',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80'
  },
  { 
    name: 'Dumbbell Shrugs', 
    sets: 3, 
    reps: '12-15', 
    weight: '75 lbs', 
    rest: 60, 
    target: 'Upper Trapezius', 
    tip: 'Elevate your shoulders straight up toward your ears, hold for a split second, and lower slowly.',
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80'
  }
];

export default function ShoulderWorkout() {
  const navigate = useNavigate();
  const [sessionActive, setSessionActive] = useState(false);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [exerciseLogs, setExerciseLogs] = useState<Record<number, {
    notes: string;
    sets: { weight: string; reps: string; completed: boolean; type: string }[];
  }>>({});

  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);

  const playBeep = (freq = 880, duration = 0.1) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Web Audio warning', e);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionActive && timerRunning) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive, timerRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimeLeft > 0) {
      interval = setInterval(() => {
        setRestTimeLeft(prev => {
          if (prev <= 1) {
            setIsResting(false);
            playBeep(1000, 0.3);
            return 0;
          }
          if (prev <= 4) {
            playBeep(500, 0.08);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimeLeft]);

  const handleStartWorkout = () => {
    playBeep(440, 0.1);
    setTimeout(() => playBeep(880, 0.15), 100);
    const initialLogs: typeof exerciseLogs = {};
    shoulderExercises.forEach((ex, idx) => {
      initialLogs[idx] = {
        notes: '',
        sets: Array.from({ length: ex.sets }).map(() => ({
          weight: ex.weight.replace(' lbs', ''),
          reps: ex.reps.includes('-') ? ex.reps.split('-')[0] : ex.reps,
          completed: false,
          type: 'Normal'
        }))
      };
    });
    setExerciseLogs(initialLogs);
    setWorkoutTimer(0);
    setSessionActive(true);
    setTimerRunning(true);
    setCurrentExerciseIdx(0);
    setIsResting(false);
  };

  const handleToggleSetCompletion = (setIdx: number) => {
    if (!exerciseLogs[currentExerciseIdx]) return;
    
    playBeep(700, 0.08);
    const newLogs = { ...exerciseLogs };
    const setList = [...newLogs[currentExerciseIdx].sets];
    const isNowCompleted = !setList[setIdx].completed;
    setList[setIdx].completed = isNowCompleted;
    newLogs[currentExerciseIdx].sets = setList;
    setExerciseLogs(newLogs);

    if (isNowCompleted) {
      const restSec = shoulderExercises[currentExerciseIdx].rest;
      setRestTimeLeft(restSec);
      setIsResting(true);
    } else {
      setIsResting(false);
    }
  };

  const updateSetValues = (setIdx: number, key: 'weight' | 'reps' | 'type', value: string) => {
    const newLogs = { ...exerciseLogs };
    const setList = [...newLogs[currentExerciseIdx].sets];
    (setList[setIdx] as any)[key] = value;
    newLogs[currentExerciseIdx].sets = setList;
    setExerciseLogs(newLogs);
  };

  const handleAddSet = () => {
    playBeep(500, 0.05);
    const newLogs = { ...exerciseLogs };
    const setList = [...newLogs[currentExerciseIdx].sets];
    const last = setList[setList.length - 1] || { weight: '100', reps: '10' };
    setList.push({
      weight: last.weight,
      reps: last.reps,
      completed: false,
      type: 'Normal'
    });
    newLogs[currentExerciseIdx].sets = setList;
    setExerciseLogs(newLogs);
  };

  const handleCompleteWorkout = () => {
    playBeep(880, 0.1);
    setTimeout(() => playBeep(1200, 0.2), 100);
    setTimerRunning(false);
    setIsResting(false);
    
    try {
      const savedHistoryStr = localStorage.getItem('custom_workout_history') || '[]';
      const history = JSON.parse(savedHistoryStr);
      
      let totalWeightLifted = 0;
      let loggedExercises: any[] = [];

      Object.entries(exerciseLogs).forEach(([exIdx, log]) => {
        const ex = shoulderExercises[parseInt(exIdx)];
        const completedSets = log.sets.filter(s => s.completed);
        if (completedSets.length > 0) {
          const completedReps = completedSets.map(s => parseInt(s.reps) || 0);
          const weightVal = parseInt(completedSets[0].weight) || 0;
          totalWeightLifted += completedSets.reduce((sum, s) => sum + ((parseInt(s.weight) || 0) * (parseInt(s.reps) || 0)), 0);
          
          loggedExercises.push({
            name: ex.name,
            sets: completedSets.length,
            reps: completedReps,
            weight: weightVal
          });
        }
      });

      const newSession = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: 'SHOULDER DAY',
        duration: `${Math.floor(workoutTimer / 60)} min`,
        volume: totalWeightLifted || 8500,
        exercises: loggedExercises.length > 0 ? loggedExercises : [
          { name: 'Overhead Barbell Press', sets: 4, reps: [8, 8, 6, 6], weight: 135 },
          { name: 'Dumbbell Lateral Raises', sets: 4, reps: [12, 12, 12, 12], weight: 25 }
        ],
        color: '#E11D48'
      };

      history.unshift(newSession);
      localStorage.setItem('custom_workout_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }

    setShowCompletionOverlay(true);
  };

  const formatTimerStr = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalPlannedSets = shoulderExercises.reduce((sum, ex) => sum + ex.sets, 0);
  const currentTotalCompletedSets = Object.values(exerciseLogs).reduce((acc, log) => 
    acc + log.sets.filter(s => s.completed).length, 0
  );
  
  const currentLiftedVolume = Object.values(exerciseLogs).reduce((total, log) => {
    return total + log.sets.reduce((subTotal, s) => {
      if (s.completed) {
        return subTotal + ((parseInt(s.weight) || 0) * (parseInt(s.reps) || 0));
      }
      return subTotal;
    }, 0);
  }, 0);

  const completionPercent = Math.min(100, Math.round((currentTotalCompletedSets / totalPlannedSets) * 100));

  return (
    <div className="min-h-screen p-4 lg:p-8 select-none relative pb-20">
      {/* Dynamic Overlay when user completes workout */}
      {showCompletionOverlay && (
        <div className="fixed inset-0 bg-[#030303]/95 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <TacticalCard glow className="max-w-md w-full p-8 border border-emerald-500/30 text-center relative overflow-hidden">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                <Award className="w-12 h-12" />
              </div>
            </div>
            
            <h2 className="font-mono text-xl font-bold text-white mb-2 tracking-tight">SHOULDER ACTION COMPLETE!</h2>
            <p className="font-mono text-xs text-emerald-400 mb-6 uppercase tracking-wider">Your exercises have been logged successfully</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                <div className="font-mono text-[9px] text-white/40 uppercase tracking-wider mb-1">DURATION</div>
                <div className="font-mono text-lg font-bold text-cyan-400">{formatTimerStr(workoutTimer)}</div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                <div className="font-mono text-[9px] text-white/40 uppercase tracking-wider mb-1">TOTAL LOAD</div>
                <div className="font-mono text-lg font-bold text-emerald-400">{(currentLiftedVolume || 8500).toLocaleString()} lbs</div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center col-span-2">
                <div className="font-mono text-[9px] text-white/40 uppercase tracking-wider mb-1">COMPLETED WORKOUT STATUS</div>
                <div className="font-mono text-sm font-bold text-white">
                  {currentTotalCompletedSets} sets / {shoulderExercises.length} Exercises Complete
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/history')}
              className="w-full py-4 rounded-xl font-mono text-xs font-bold text-black bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 transition-transform"
            >
              VIEW WORKOUT HISTORY
            </button>
          </TacticalCard>
        </div>
      )}

      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-1.5 font-mono text-xs text-cyan-400/70 hover:text-cyan-400 transition-colors uppercase tracking-wider mb-2 select-none"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <TacticalHeader title="SHOULDER WORKOUT" subtitle="SIMPLE EFFICIENCY • DELTOID ISOLATION & POWER" />
        </div>
        
        {sessionActive && (
          <div className="flex items-center gap-2">
            <div className="bg-[#0f172a] border border-cyan-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
              <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
              <div>
                <div className="font-mono text-[8px] text-white/40 uppercase leading-none mb-0.5">ELAPSED TIME</div>
                <div className="font-mono text-sm font-bold text-white tabular-nums leading-none">{formatTimerStr(workoutTimer)}</div>
              </div>
            </div>
            
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className={cn(
                "p-2.5 rounded-xl border transition-all",
                timerRunning ? "bg-amber-500/10 border-amber-500/30 text-amber-500" : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 animate-pulse"
              )}
            >
              {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
          </div>
        )}
      </div>

      {/* Landing Mode */}
      {!sessionActive ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TacticalCard glow className="relative overflow-hidden p-6 lg:p-8">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-cyan-400/10 rounded-2xl border border-cyan-400/20 text-cyan-400">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-mono text-lg font-bold text-white">SHOULDER TRAINING ROUTINE</h3>
                  <p className="font-mono text-xs text-cyan-400/60 uppercase tracking-widest">Target: Anterior, Lateral & posterior delts</p>
                </div>
              </div>
              
              <p className="font-mono text-sm text-white/70 mb-6 leading-relaxed">
                Sculpt broad, stable 3D shoulders. This program targets all three heads of the deltoid muscle dynamically while optimizing shoulder socket longevity and upper frame power.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center sm:text-left">
                  <div className="font-mono text-[8px] text-white/40 tracking-wider">EST. TIME</div>
                  <div className="font-mono text-sm font-bold text-cyan-400 mt-1">60 MIN</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center sm:text-left">
                  <div className="font-mono text-[8px] text-white/40 tracking-wider">TOTAL EXERCISES</div>
                  <div className="font-mono text-sm font-bold text-cyan-400 mt-1">5 LIFTS</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center sm:text-left">
                  <div className="font-mono text-[8px] text-white/40 tracking-wider">DIFFICULTY</div>
                  <div className="font-mono text-sm font-bold text-white mt-1">INTERMEDIATE</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center sm:text-left">
                  <div className="font-mono text-[8px] text-white/40 tracking-wider">FOCUS TYPE</div>
                  <div className="font-mono text-sm font-bold text-cyan-400 mt-1">STRENGTH & 3D WIDTH</div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <span className="font-mono text-xs text-white/50">Ready to begin logging your session?</span>
                <button
                  onClick={handleStartWorkout}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-mono text-xs font-bold text-black bg-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  START PRIVATE WORKOUT
                </button>
              </div>
            </TacticalCard>

            {/* List of Exercises with Beautiful Preview Images */}
            <div className="space-y-4">
              <h4 className="font-mono text-xs font-bold text-cyan-400 tracking-wider uppercase mb-2">ROUTINE EXERCISES</h4>
              {shoulderExercises.map((ex, i) => (
                <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 hover:border-cyan-500/30 transition-all overflow-hidden relative">
                  <img
                    src={ex.image}
                    alt={ex.name}
                    referrerPolicy="no-referrer"
                    className="w-full sm:w-20 h-28 sm:h-20 object-cover rounded-xl border border-white/10"
                  />
                  <div className="flex-1">
                    <div className="font-mono text-sm font-bold text-white leading-tight mb-1">{ex.name}</div>
                    <div className="font-mono text-[10px] text-white/40 flex flex-wrap gap-x-3 gap-y-1">
                      <span className="text-cyan-400">{ex.target}</span> • <span>Rest {ex.rest}s</span>
                    </div>
                    <p className="font-mono text-[11px] text-white/50 mt-1 italic max-w-xl">“{ex.tip}”</p>
                  </div>
                  <div className="text-right sm:border-l sm:border-white/5 sm:pl-4 min-w-[80px]">
                    <div className="font-mono text-xs font-bold text-cyan-400">{ex.sets} Sets</div>
                    <div className="font-mono text-[10px] text-white/40">{ex.reps} Reps</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <TacticalCard>
              <h4 className="font-mono text-xs font-bold text-cyan-400 tracking-wider uppercase mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                SAFETY & FORM COACHING
              </h4>
              <ul className="space-y-3">
                {[
                  { title: "No Spine Leaning", desc: "Keep glutes tightly squeezed during standing presses to shield your lower back." },
                  { title: "Slight Elbow Tilt", desc: "Angle your elbows in the scapular plane (15-30 degrees forward) during lateral raises." },
                  { title: "Control the Descent", desc: "Do not let weights bounce off your body; work the muscles slowly on the way down." }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="font-mono text-xs font-bold text-red-500/70" style={{ transform: "translateY(2px)" }}>•</span>
                    <div>
                      <div className="font-mono text-xs font-bold text-white/95">{item.title}</div>
                      <p className="font-mono text-[10px] text-white/40 leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </TacticalCard>
          </div>
        </div>
      ) : (
        /* Active Workout State */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Navigation Sidebar Panel */}
          <div className="space-y-3 lg:col-span-1">
            <h4 className="font-mono text-xs font-bold text-cyan-400/80 tracking-wider uppercase mb-1">SESSION PIPELINE</h4>
            <div className="space-y-2">
              {shoulderExercises.map((ex, idx) => {
                const isCurrent = idx === currentExerciseIdx;
                const completedCount = exerciseLogs[idx]?.sets.filter(s => s.completed).length || 0;
                const matchesTotal = completedCount === ex.sets;
                
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      playBeep(450, 0.05);
                      setCurrentExerciseIdx(idx);
                      setIsResting(false);
                    }}
                    className={cn(
                      "p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all border text-left",
                      isCurrent 
                        ? "bg-cyan-400/10 border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.1)] text-white" 
                        : "bg-white/5 border-white/5 hover:bg-white/10 text-white/60",
                      matchesTotal && "border-emerald-500/20 bg-emerald-500/5"
                    )}
                  >
                    <img
                      src={ex.image}
                      alt={ex.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-xs font-bold truncate flex items-center gap-1.5">
                        {matchesTotal && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                        <span>{idx + 1}. {ex.name}</span>
                      </div>
                      <div className="font-mono text-[9px] opacity-40 mt-0.5 truncate uppercase">
                        {ex.target}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-mono text-xs">
                        <span className="text-cyan-400 font-bold">{completedCount}</span>
                        <span className="opacity-40">/{ex.sets}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Stats Panel */}
            <TacticalCard className="mt-4 p-4 space-y-3">
              <div className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest font-bold">TOTAL TRIAL OUTPUT</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-2 rounded-lg border border-white/5 text-center">
                  <div className="font-mono text-[8px] text-white/40">EST. CALORIES</div>
                  <div className="font-mono text-xs font-bold text-rose-400">{Math.round(workoutTimer * 0.15)} kcal</div>
                </div>
                <div className="bg-white/5 p-2 rounded-lg border border-white/5 text-center">
                  <div className="font-mono text-[8px] text-white/40">SESSION VOLUME</div>
                  <div className="font-mono text-xs font-bold text-cyan-400">{currentLiftedVolume.toLocaleString()} lbs</div>
                </div>
              </div>
              
              <div className="relative pt-1">
                <div className="flex mb-1 items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-400 bg-emerald-500/10">
                      ROUTINE COMPLETION
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-semibold inline-block text-emerald-400">
                      {completionPercent}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-white/5">
                  <div style={{ width: `${completionPercent}%`, transition: 'width 0.5s ease-in-out' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 rounded" />
                </div>
              </div>
            </TacticalCard>
          </div>

          {/* Active Workout Focus Section with Beautiful Big Image (Simple!) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Rest Timer Banner */}
            {isResting && restTimeLeft > 0 && (
              <div className="p-4 lg:p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center animate-pulse">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span className="font-mono text-xs text-amber-500 uppercase tracking-widest font-bold">REST COOLDOWN EN ROUTE</span>
                </div>
                <div className="font-mono text-2xl font-bold text-amber-400 tabular-nums">
                  00:{restTimeLeft.toString().padStart(2, '0')} <span className="text-xs text-amber-500">SECONDS LEFT</span>
                </div>
                <button
                  onClick={() => {
                    playBeep(450, 0.05);
                    setIsResting(false);
                    setRestTimeLeft(0);
                  }}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-amber-500 text-black font-mono text-[10px] font-bold hover:scale-105 transition-transform"
                >
                  SKIP REST
                </button>
              </div>
            )}

            <TacticalCard className="p-6 relative overflow-hidden">
              {/* Splendid Big Image of Currently Selected exercise to guide form and feel */}
              <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden relative mb-6 border border-white/10">
                <img
                  src={shoulderExercises[currentExerciseIdx].image}
                  alt={shoulderExercises[currentExerciseIdx].name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest leading-none mb-1">CURRENT EXERCISE</p>
                  <h3 className="font-mono text-xl sm:text-2xl font-bold text-white uppercase">{shoulderExercises[currentExerciseIdx].name}</h3>
                  <p className="font-mono text-xs text-white/60 uppercase">{shoulderExercises[currentExerciseIdx].target}</p>
                </div>
              </div>

              {/* Tips banner */}
              <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 flex gap-3 text-white/70 mb-5 text-sm font-mono leading-relaxed">
                <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-cyan-400 font-bold uppercase tracking-wide">FORM TIP: </span>
                  {shoulderExercises[currentExerciseIdx].tip}
                </div>
              </div>

              {/* Set logging items */}
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-center text-white/40 font-mono text-[10px] uppercase tracking-wider mb-1">
                  <div className="col-span-2">SET</div>
                  <div className="col-span-4">LBS</div>
                  <div className="col-span-4">REPS</div>
                  <div className="col-span-2">DONE</div>
                </div>

                {exerciseLogs[currentExerciseIdx]?.sets.map((set, sIdx) => (
                  <div 
                    key={sIdx}
                    className={cn(
                      "grid grid-cols-12 gap-2 items-center p-2 rounded-xl transition-all border",
                      set.completed 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-white" 
                        : "bg-white/5 border-white/5"
                    )}
                  >
                    <div className="col-span-2 text-center font-mono text-xs font-bold text-white/50">{sIdx + 1}</div>
                    <div className="col-span-4 flex items-center justify-center">
                      <input 
                        type="number"
                        pattern="[0-9]*"
                        value={set.weight}
                        onChange={(e) => updateSetValues(sIdx, 'weight', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-1.5 px-2 font-mono text-xs sm:text-sm text-center text-white outline-none focus:border-cyan-500/50"
                        placeholder="Weight"
                      />
                    </div>
                    <div className="col-span-4 flex items-center justify-center">
                      <input 
                        type="number"
                        pattern="[0-9]*"
                        value={set.reps}
                        onChange={(e) => updateSetValues(sIdx, 'reps', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-1.5 px-2 font-mono text-xs sm:text-sm text-center text-white outline-none focus:border-cyan-500/50"
                        placeholder="Reps"
                      />
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <button
                        onClick={() => handleToggleSetCompletion(sIdx)}
                        className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                          set.completed 
                            ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]" 
                            : "bg-white/10 text-white/40 hover:bg-white/20 hover:text-white"
                        )}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Set controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <button
                  onClick={handleAddSet}
                  className="w-full py-3 rounded-xl border border-dashed border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold hover:bg-cyan-500/5 hover:border-cyan-500/60 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  ADD EXTRA SET
                </button>
                <div className="flex-1 bg-black/40 border border-white/5 rounded-xl py-1 px-3">
                  <textarea
                    value={exerciseLogs[currentExerciseIdx]?.notes || ''}
                    onChange={(e) => {
                      const newLogs = { ...exerciseLogs };
                      newLogs[currentExerciseIdx].notes = e.target.value;
                      setExerciseLogs(newLogs);
                    }}
                    placeholder="Enter exercise notes or feel limits..."
                    className="w-full h-11 py-1 font-mono text-[10px] text-white/70 bg-transparent outline-none resize-none"
                  />
                </div>
              </div>
            </TacticalCard>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between pt-4">
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  disabled={currentExerciseIdx === 0}
                  onClick={() => {
                    playBeep(450, 0.05);
                    setCurrentExerciseIdx(prev => prev - 1);
                    setIsResting(false);
                  }}
                  className="flex-1 sm:flex-none px-6 py-4 rounded-xl font-mono text-xs border border-white/10 text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent transition-all uppercase tracking-widest"
                >
                  PREV LIFT
                </button>
                
                {currentExerciseIdx < shoulderExercises.length - 1 ? (
                  <button
                    onClick={() => {
                      playBeep(450, 0.05);
                      setCurrentExerciseIdx(prev => prev + 1);
                      setIsResting(false);
                    }}
                    className="flex-1 sm:flex-none px-6 py-4 rounded-xl font-mono text-xs bg-cyan-500 text-black font-bold h-full hover:scale-105 transition-transform uppercase tracking-widest flex items-center justify-center gap-1"
                  >
                    <span>NEXT LIFT</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="flex-1 sm:flex-none" />
                )}
              </div>

              <button
                onClick={handleCompleteWorkout}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-mono text-xs font-bold text-black bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform uppercase tracking-widest"
              >
                FINISH SHOULDER DAY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
