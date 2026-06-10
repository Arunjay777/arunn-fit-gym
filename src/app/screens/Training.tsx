import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Dumbbell, Target, TrendingUp, Zap, Plus, Play, X, Check, Clock, Pause } from 'lucide-react';
import { cn } from '../components/ui/utils';

const workoutData = {
  1: {
    title: 'DAY 1: BACK & SHOULDERS WARFARE',
    exercises: [
      { name: 'Barbell Rows', sets: 4, reps: '8-10', weight: '185 lbs', rest: 90 },
      { name: 'Pull Downs', sets: 4, reps: '10-12', weight: '150 lbs', rest: 75 },
      { name: 'Dumbbell Rows', sets: 3, reps: '10-12', weight: '70 lbs', rest: 75 },
      { name: 'Hyperextensions', sets: 3, reps: '12-15', weight: 'Bodyweight', rest: 60 },
      { name: 'Barbell Overhead Presses', sets: 4, reps: '6-8', weight: '135 lbs', rest: 90 },
      { name: 'Side Raises', sets: 3, reps: '12-15', weight: '25 lbs', rest: 60 },
      { name: 'Bent Rear Side Raises', sets: 3, reps: '12-15', weight: '20 lbs', rest: 60 },
      { name: 'Forward Raises', sets: 3, reps: '12-15', weight: '20 lbs', rest: 60 },
    ]
  },
  2: {
    title: 'DAY 3: LEGS & ABS DEVASTATION',
    exercises: [
      { name: 'Barbell Squats', sets: 4, reps: '6-8', weight: '275 lbs', rest: 120 },
      { name: 'Leg Presses', sets: 3, reps: '10-12', weight: '450 lbs', rest: 90 },
      { name: 'Leg Extensions', sets: 3, reps: '12-15', weight: '150 lbs', rest: 60 },
      { name: 'Legged Dead Lifts', sets: 3, reps: '10-12', weight: '185 lbs', rest: 90 },
      { name: 'Seated Calf Raises', sets: 3, reps: '15-20', weight: '110 lbs', rest: 45 },
      { name: 'Standing Calf Raises', sets: 3, reps: '15-20', weight: '150 lbs', rest: 45 },
      { name: 'Abdominal Crunches', sets: 4, reps: '15-20', weight: 'Bodyweight', rest: 45 },
      { name: 'Leg Raises', sets: 3, reps: '12-15', weight: 'Bodyweight', rest: 60 },
    ]
  },
  3: {
    title: 'DAY 5: CHEST & ARMS ANNIHILATION',
    exercises: [
      { name: 'Bench Presses', sets: 4, reps: '8-10', weight: '225 lbs', rest: 90 },
      { name: 'Incline Bench Presses', sets: 3, reps: '8-10', weight: '185 lbs', rest: 90 },
      { name: 'Dumbbell Presses', sets: 3, reps: '10-12', weight: '75 lbs', rest: 75 },
      { name: 'Incline Dumbbell Flyes', sets: 3, reps: '12-15', weight: '40 lbs', rest: 60 },
      { name: 'Tricep Extensions', sets: 3, reps: '10-12', weight: '80 lbs', rest: 65 },
      { name: 'Triceps Pull Downs', sets: 3, reps: '12-15', weight: '65 lbs', rest: 60 },
      { name: 'Barbell Curls', sets: 3, reps: '10-12', weight: '95 lbs', rest: 65 },
      { name: 'Preacher Curls', sets: 3, reps: '10-12', weight: '75 lbs', rest: 65 },
      { name: 'Hammer Curls', sets: 3, reps: '10-12', weight: '35 lbs', rest: 60 },
    ]
  }
};

const workouts = [
  { id: 1, title: 'DAY 1: BACK & SHOULDERS', type: 'STRENGTH', duration: '80 min', exercises: 8, volume: '22.4K lbs', status: 'active', time: 'MON 06:00' },
  { id: 2, title: 'DAY 3: LEGS & ABS', type: 'POWER', duration: '85 min', exercises: 8, volume: '28.1K lbs', status: 'scheduled', time: 'WED 06:00' },
  { id: 3, title: 'DAY 5: CHEST & ARMS', type: 'HYPERTROPHY', duration: '90 min', exercises: 9, volume: '24.6K lbs', status: 'scheduled', time: 'FRI 06:00' },
];

export default function Training() {
  const navigate = useNavigate();
  const [selectedWorkout, setSelectedWorkout] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState<Record<number, { 
    notes: string, 
    sets: { weight: string, reps: string, type: 'Normal' | 'Warmup' | 'Drop' | 'Failure', completed: boolean }[] 
  }>>({});
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  const currentWorkoutData = selectedWorkout ? workoutData[selectedWorkout as keyof typeof workoutData] : null;
  const currentExercise = currentWorkoutData?.exercises[currentExerciseIndex];

  // Initialize logs when a workout starts
  useEffect(() => {
    if (currentWorkoutData && Object.keys(exerciseLogs).length === 0) {
      const initialLogs: typeof exerciseLogs = {};
      currentWorkoutData.exercises.forEach((ex, idx) => {
        initialLogs[idx] = {
          notes: '',
          sets: Array.from({ length: ex.sets }).map(() => ({
            weight: ex.weight.replace(' lbs', ''),
            reps: ex.reps.includes('-') ? ex.reps.split('-')[0] : ex.reps === 'To Failure' ? '12' : ex.reps,
            type: 'Normal',
            completed: false
          }))
        };
      });
      setExerciseLogs(initialLogs);
    }
  }, [currentWorkoutData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutActive && showModal) {
      interval = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, showModal]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTime > 0) {
      interval = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTime]);

  const handleStartWorkout = (workoutId: number) => {
    setSelectedWorkout(workoutId);
    setShowModal(true);
    setIsWorkoutActive(true);
    setCurrentExerciseIndex(0);
    setExerciseLogs({}); // Will be initialized by useEffect
    setWorkoutTime(0);
  };

  const handleCompleteSet = (setIndex: number) => {
    if (!exerciseLogs[currentExerciseIndex]) return;

    const newLogs = { ...exerciseLogs };
    const currentSets = [...newLogs[currentExerciseIndex].sets];
    currentSets[setIndex].completed = !currentSets[setIndex].completed;
    newLogs[currentExerciseIndex].sets = currentSets;
    setExerciseLogs(newLogs);

    if (currentSets[setIndex].completed) {
      // Check if there are more sets to complete for this exercise
      const incompleteIndex = currentSets.findIndex((s, i) => !s.completed && i > setIndex);
      if (incompleteIndex !== -1 && currentExercise) {
        setIsResting(true);
        setRestTime(currentExercise.rest);
      }
    }
  };

  const updateSetData = (setIndex: number, field: 'weight' | 'reps' | 'type', value: string) => {
    const newLogs = { ...exerciseLogs };
    const currentSets = [...newLogs[currentExerciseIndex].sets];
    (currentSets[setIndex] as any)[field] = value;
    newLogs[currentExerciseIndex].sets = currentSets;
    setExerciseLogs(newLogs);
  };

  const updateNotes = (notes: string) => {
    const newLogs = { ...exerciseLogs };
    newLogs[currentExerciseIndex].notes = notes;
    setExerciseLogs(newLogs);
  };

  const addSet = () => {
    const newLogs = { ...exerciseLogs };
    const currentSets = [...newLogs[currentExerciseIndex].sets];
    const lastSet = currentSets[currentSets.length - 1];
    currentSets.push({
      weight: lastSet?.weight || '0',
      reps: lastSet?.reps || '10',
      type: 'Normal',
      completed: false
    });
    newLogs[currentExerciseIndex].sets = currentSets;
    setExerciseLogs(newLogs);
  };

  const handleNextExercise = () => {
    if (currentWorkoutData && currentExerciseIndex < currentWorkoutData.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setIsResting(false);
      setRestTime(0);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setIsResting(false);
      setRestTime(0);
    }
  };

  const handleCompleteWorkout = () => {
    setShowModal(false);
    setIsWorkoutActive(false);
    alert(`Workout completed in ${Math.floor(workoutTime / 60)} minutes!`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSets = currentWorkoutData?.exercises.reduce((sum, ex) => sum + ex.sets, 0) || 0;
  const completedSetsCount = Object.values(exerciseLogs).reduce((sum, log) => 
    sum + log.sets.filter(s => s.completed).length, 0
  );
  const progress = totalSets > 0 ? Math.round((completedSetsCount / totalSets) * 100) : 0;
  const currentLogs = exerciseLogs[currentExerciseIndex];

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <TacticalHeader title="TRAINING PROTOCOLS" subtitle="TACTICAL WORKOUT MANAGEMENT SYSTEM" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <TacticalCard className="p-3 lg:p-6 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-3 mb-2">
            <Dumbbell className="w-4 lg:w-5 h-4 lg:h-5 text-cyan-400" />
            <span className="font-mono text-[10px] lg:text-xs text-cyan-400/60 uppercase tracking-widest">THIS WEEK</span>
          </div>
          <div className="font-mono font-bold text-2xl lg:text-3xl text-cyan-400">5</div>
          <div className="font-mono text-[10px] lg:text-xs mt-1 text-white/40">Sessions completed</div>
        </TacticalCard>

        <TacticalCard className="p-3 lg:p-6 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-3 mb-2">
            <Target className="w-4 lg:w-5 h-4 lg:h-5 text-emerald-400" />
            <span className="font-mono text-[10px] lg:text-xs text-emerald-400/60 uppercase tracking-widest">TOTAL VOLUME</span>
          </div>
          <div className="font-mono font-bold text-2xl lg:text-3xl text-emerald-400">76.9K</div>
          <div className="font-mono text-[10px] lg:text-xs mt-1 text-white/40">lbs lifted</div>
        </TacticalCard>

        <TacticalCard className="p-3 lg:p-6 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-3 mb-2">
            <TrendingUp className="w-4 lg:w-5 h-4 lg:h-5 text-amber-400" />
            <span className="font-mono text-[10px] lg:text-xs text-amber-400/60 uppercase tracking-widest">PRs HIT</span>
          </div>
          <div className="font-mono font-bold text-2xl lg:text-3xl text-amber-400">3</div>
          <div className="font-mono text-[10px] lg:text-xs mt-1 text-white/40">Personal records</div>
        </TacticalCard>

        <TacticalCard className="p-3 lg:p-6 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-3 mb-2">
            <Zap className="w-4 lg:w-5 h-4 lg:h-5 text-blue-400" />
            <span className="font-mono text-[10px] lg:text-xs text-blue-400/60 uppercase tracking-widest">AVG INTENSITY</span>
          </div>
          <div className="font-mono font-bold text-2xl lg:text-3xl text-blue-400">84%</div>
          <div className="font-mono text-[10px] lg:text-xs mt-1 text-white/40">Optimal zone</div>
        </TacticalCard>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="font-mono font-bold" style={{ color: '#00D4FF' }}>TODAY'S MISSIONS</div>
        <button
          onClick={() => navigate('/diet-plan')}
          className="flex items-center gap-2 px-4 py-2 rounded font-mono text-xs transition-all hover:bg-[rgba(0,255,136,0.2)]"
          style={{ border: '1px solid rgba(0, 255, 136, 0.3)', color: '#00FF88' }}
        >
          <Target className="w-4 h-4" />
          DIET PLAN
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workouts.map((workout) => {
          const isActive = workout.status === 'active';
          const statusColor = isActive ? '#00D4FF' : 'rgba(0, 212, 255, 0.5)';

          return (
            <TacticalCard key={workout.id} className="group hover:border-cyan-500/50 transition-all cursor-pointer" onClick={() => handleStartWorkout(workout.id)}>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-mono font-bold text-sm lg:text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">{workout.title}</div>
                  <div className="font-mono text-[10px] px-2 py-0.5 rounded border" style={{ background: 'rgba(26, 26, 26, 0.8)', borderColor: statusColor, color: statusColor }}>
                    {workout.time}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                    {workout.type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-6">
                <div className="p-2 rounded bg-white/5">
                  <div className="font-mono text-[8px] lg:text-[10px] mb-1 text-white/30 tracking-tighter uppercase">DURATION</div>
                  <div className="font-mono font-bold text-xs lg:text-sm text-cyan-400 whitespace-nowrap">{workout.duration}</div>
                </div>
                <div className="p-2 rounded bg-white/5">
                  <div className="font-mono text-[8px] lg:text-[10px] mb-1 text-white/30 tracking-tighter uppercase">EXERCISES</div>
                  <div className="font-mono font-bold text-xs lg:text-sm text-cyan-400">{workout.exercises}</div>
                </div>
                <div className="p-2 rounded bg-white/5">
                  <div className="font-mono text-[8px] lg:text-[10px] mb-1 text-white/30 tracking-tighter uppercase">VOLUME</div>
                  <div className="font-mono font-bold text-xs lg:text-sm text-cyan-400">{workout.volume}</div>
                </div>
              </div>

              <button
                className={cn(
                  "w-full py-3 rounded-xl font-mono text-xs lg:text-sm font-bold flex items-center justify-center gap-2 transition-all",
                  isActive ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "bg-white/5 text-cyan-400 border border-cyan-400/20 hover:bg-cyan-400/10"
                )}
              >
                <Play className={cn("w-4 h-4", isActive ? "fill-current" : "")} />
                {isActive ? 'CONTINUE MISSION' : 'ACTIVATE PROTOCOL'}
              </button>
            </TacticalCard>
          );
        })}
      </div>

      {/* Workout Session Modal */}
      {showModal && selectedWorkout && currentWorkoutData && currentExercise && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 lg:p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
          <div className="relative w-full max-w-4xl h-[95vh] lg:h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-white/10" style={{ background: '#050505' }}>
            {/* Header */}
            <div className="p-4 lg:p-6 border-b border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="min-w-0">
                  <div className="font-mono font-bold text-lg lg:text-2xl mb-0.5 lg:mb-1 text-cyan-400 truncate tracking-tight">
                    {currentWorkoutData.title}
                  </div>
                  <div className="font-mono text-[10px] lg:text-sm text-white/40 tracking-widest uppercase">
                    Exercise {currentExerciseIndex + 1} of {currentWorkoutData.exercises.length}
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 lg:p-3 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-5 h-5 lg:w-6 lg:h-6 text-white/60" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 lg:gap-4">
                <div className="p-2 lg:p-3 rounded-xl lg:rounded-2xl bg-white/5 border border-white/5 text-center">
                  <div className="font-mono text-[8px] lg:text-[10px] mb-1 text-white/30 tracking-tighter uppercase whitespace-nowrap">TIME</div>
                  <div className="font-mono font-bold text-sm lg:text-xl text-cyan-400">{formatTime(workoutTime)}</div>
                </div>
                <div className="p-2 lg:p-3 rounded-xl lg:rounded-2xl bg-white/5 border border-white/5 text-center">
                  <div className="font-mono text-[8px] lg:text-[10px] mb-1 text-white/30 tracking-tighter uppercase whitespace-nowrap">PROGRESS</div>
                  <div className="font-mono font-bold text-sm lg:text-xl text-emerald-400">{progress}%</div>
                </div>
                <div className="p-2 lg:p-3 rounded-xl lg:rounded-2xl bg-white/5 border border-white/5 text-center">
                  <div className="font-mono text-[8px] lg:text-[10px] mb-1 text-white/30 tracking-tighter uppercase whitespace-nowrap">SETS</div>
                  <div className="font-mono font-bold text-sm lg:text-xl text-amber-400">{completedSetsCount}/{totalSets}</div>
                </div>
              </div>
            </div>

            {/* Current Exercise */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-hide">
              <div className="mb-6 p-4 lg:p-8 rounded-[2rem] bg-cyan-400/5 border-2 border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <div className="font-mono font-bold text-xl lg:text-4xl text-cyan-400 tracking-tight leading-tight">
                    {currentExercise.name}
                  </div>
                </div>

                {/* Detailed Set Logging */}
                <div className="space-y-3 mb-6">
                  <div className="grid grid-cols-12 gap-2 text-center mb-1">
                    <div className="col-span-1 font-mono text-[8px] text-white/30 uppercase">SET</div>
                    <div className="col-span-3 font-mono text-[8px] text-white/30 uppercase">TYPE</div>
                    <div className="col-span-3 font-mono text-[8px] text-white/30 uppercase">WEIGHT (lbs)</div>
                    <div className="col-span-3 font-mono text-[8px] text-white/30 uppercase">REPS</div>
                    <div className="col-span-2 font-mono text-[8px] text-white/30 uppercase">STATUS</div>
                  </div>

                  {currentLogs?.sets.map((set, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "grid grid-cols-12 gap-2 items-center p-2 rounded-xl transition-all",
                        set.completed ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-white/5 border border-white/5"
                      )}
                    >
                      <div className="col-span-1 text-center font-mono text-xs font-bold text-white/40">{i + 1}</div>
                      <div className="col-span-3">
                        <select 
                          value={set.type}
                          onChange={(e) => updateSetData(i, 'type', e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-lg py-1 px-1 font-mono text-[10px] text-cyan-400 outline-none"
                        >
                          <option value="Normal">NORMAL</option>
                          <option value="Warmup">WARMUP</option>
                          <option value="Drop">DROP</option>
                          <option value="Failure">FAILURE</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <input 
                          type="number"
                          value={set.weight}
                          onChange={(e) => updateSetData(i, 'weight', e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-lg py-1 px-2 font-mono text-xs text-center text-white outline-none"
                        />
                      </div>
                      <div className="col-span-3">
                        <input 
                          type="number"
                          value={set.reps}
                          onChange={(e) => updateSetData(i, 'reps', e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-lg py-1 px-2 font-mono text-xs text-center text-white outline-none"
                        />
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <button 
                          onClick={() => handleCompleteSet(i)}
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                            set.completed ? "bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-white/10 text-white/40 hover:bg-white/20"
                          )}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={addSet}
                    className="flex-1 py-3 rounded-xl border border-dashed border-cyan-500/30 font-mono text-xs text-cyan-400 hover:bg-cyan-400/5 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    ADD SET
                  </button>
                  <div className="flex-1">
                    <textarea 
                      placeholder="Add exercise notes..."
                      value={currentLogs?.notes || ''}
                      onChange={(e) => updateNotes(e.target.value)}
                      className="w-full h-12 bg-black/40 border border-white/10 rounded-xl py-2 px-3 font-mono text-[10px] text-white/60 outline-none resize-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Rest Timer */}
              {isResting && (
                <div className="mb-6 p-4 lg:p-8 rounded-[2rem] text-center bg-amber-500/5 border-2 border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
                  <div className="flex items-center justify-center gap-2 mb-2 lg:mb-4">
                    <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500 animate-pulse" />
                    <div className="font-mono font-bold text-xs lg:text-sm text-amber-500 tracking-widest uppercase">NEURAL RECOVERY IN PROGRESS</div>
                  </div>
                  <div className="font-mono font-bold text-5xl lg:text-7xl mb-4 lg:mb-6 text-amber-500 tabular-nums">
                    {formatTime(restTime)}
                  </div>
                  <button
                    onClick={() => { setIsResting(false); setRestTime(0); }}
                    className="px-6 lg:px-8 py-2.5 lg:py-3 rounded-xl font-mono font-bold text-xs lg:text-sm bg-amber-500 text-black hover:scale-105 transition-transform"
                  >
                    SKIP RECOVERY
                  </button>
                </div>
              )}

              {/* All Exercises List */}
              <div className="space-y-2 mb-6">
                <div className="font-mono text-[10px] mb-3 text-white/30 tracking-widest uppercase">UPCOMING PROTOCOLS</div>
                {currentWorkoutData.exercises.map((exercise, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-3 rounded-xl lg:rounded-2xl flex items-center justify-between transition-all",
                      i === currentExerciseIndex 
                        ? "bg-cyan-400/10 border border-cyan-500/30" 
                        : "bg-white/5 border border-white/5 opacity-50"
                    )}
                  >
                    <div className={cn("font-mono text-xs lg:text-sm truncate mr-4", i === currentExerciseIndex ? "text-cyan-400" : "text-white/60")}>
                      {i + 1}. {exercise.name}
                    </div>
                    <div className="font-mono text-[10px] lg:text-xs text-white/40 whitespace-nowrap">
                      {exerciseLogs[i]?.sets.filter(s => s.completed).length || 0}/{exercise.sets} sets
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 lg:p-6 border-t border-white/5 bg-black/50 backdrop-blur-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={handlePreviousExercise}
                  disabled={currentExerciseIndex === 0}
                  className="hidden sm:block py-3 rounded-2xl font-mono font-bold text-xs lg:text-sm border border-cyan-500/20 text-cyan-400 hover:bg-cyan-400/5 disabled:opacity-20 transition-all uppercase tracking-widest"
                >
                  PREVIOUS
                </button>
                <button
                  onClick={() => {
                    const firstIncomplete = currentLogs.sets.findIndex(s => !s.completed);
                    if (firstIncomplete !== -1) handleCompleteSet(firstIncomplete);
                  }}
                  disabled={isResting || currentLogs?.sets.every(s => s.completed)}
                  className="py-3 lg:py-4 rounded-2xl font-mono text-xs lg:text-sm font-bold flex items-center justify-center gap-2 bg-emerald-500 text-black hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-widest"
                >
                  <Check className="w-4 h-4" />
                  COMPLETE NEXT SET
                </button>
                <div className="grid grid-cols-2 sm:block gap-2">
                  <button
                    onClick={handlePreviousExercise}
                    disabled={currentExerciseIndex === 0}
                    className="sm:hidden py-3 rounded-2xl font-mono font-bold text-[10px] border border-cyan-500/20 text-cyan-400 disabled:opacity-20 transition-all"
                  >
                    PREV
                  </button>
                  {currentExerciseIndex < currentWorkoutData.exercises.length - 1 ? (
                    <button
                      onClick={handleNextExercise}
                      className="py-3 lg:py-4 rounded-2xl font-mono text-xs lg:text-sm font-bold bg-cyan-500 text-black hover:scale-105 transition-transform uppercase tracking-widest"
                    >
                      NEXT
                    </button>
                  ) : (
                    <button
                      onClick={handleCompleteWorkout}
                      className="py-3 lg:py-4 rounded-2xl font-mono text-xs lg:text-sm font-bold bg-white text-black hover:scale-105 transition-transform uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                      FINISH
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
