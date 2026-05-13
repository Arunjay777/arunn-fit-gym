import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Dumbbell, Target, TrendingUp, Zap, Plus, Play, X, Check, Clock, Pause } from 'lucide-react';
import { cn } from '../components/ui/utils';

const workoutData = {
  1: { // Chest
    title: 'CHEST ANNIHILATION',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '8-10', weight: '225 lbs', rest: 90 },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', weight: '80 lbs', rest: 75 },
      { name: 'Cable Flyes', sets: 3, reps: '12-15', weight: '40 lbs', rest: 60 },
      { name: 'Dips', sets: 3, reps: '10-12', weight: 'Bodyweight', rest: 75 },
      { name: 'Push-ups', sets: 3, reps: 'To Failure', weight: 'Bodyweight', rest: 45 },
    ]
  },
  2: { // Legs
    title: 'LEG DEVASTATION',
    exercises: [
      { name: 'Barbell Squat', sets: 5, reps: '5-8', weight: '315 lbs', rest: 120 },
      { name: 'Romanian Deadlift', sets: 4, reps: '8-10', weight: '225 lbs', rest: 90 },
      { name: 'Leg Press', sets: 4, reps: '12-15', weight: '450 lbs', rest: 75 },
      { name: 'Walking Lunges', sets: 3, reps: '12/leg', weight: '50 lbs', rest: 60 },
      { name: 'Leg Curls', sets: 3, reps: '12-15', weight: '90 lbs', rest: 60 },
      { name: 'Calf Raises', sets: 4, reps: '15-20', weight: '180 lbs', rest: 45 },
    ]
  },
  3: { // Back
    title: 'BACK WARFARE',
    exercises: [
      { name: 'Deadlift', sets: 4, reps: '5-8', weight: '405 lbs', rest: 120 },
      { name: 'Pull-ups', sets: 4, reps: '8-12', weight: 'Bodyweight', rest: 90 },
      { name: 'Barbell Rows', sets: 4, reps: '8-10', weight: '185 lbs', rest: 90 },
      { name: 'Lat Pulldowns', sets: 3, reps: '10-12', weight: '150 lbs', rest: 75 },
      { name: 'Cable Rows', sets: 3, reps: '12-15', weight: '140 lbs', rest: 60 },
      { name: 'Face Pulls', sets: 3, reps: '15-20', weight: '60 lbs', rest: 60 },
    ]
  },
  4: { // Arms
    title: 'ARM ASSAULT',
    exercises: [
      { name: 'Barbell Curls', sets: 4, reps: '8-10', weight: '95 lbs', rest: 60 },
      { name: 'Skull Crushers', sets: 4, reps: '8-10', weight: '75 lbs', rest: 60 },
      { name: 'Hammer Curls', sets: 3, reps: '10-12', weight: '40 lbs', rest: 60 },
      { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', weight: '70 lbs', rest: 60 },
      { name: 'Preacher Curls', sets: 3, reps: '10-12', weight: '60 lbs', rest: 60 },
      { name: 'Overhead Extensions', sets: 3, reps: '12-15', weight: '50 lbs', rest: 60 },
    ]
  },
};

const workouts = [
  { id: 1, title: 'CHEST ANNIHILATION', type: 'HYPERTROPHY', duration: '75 min', exercises: 8, volume: '18.2K lbs', status: 'scheduled', time: '06:00' },
  { id: 2, title: 'LEG DEVASTATION', type: 'STRENGTH', duration: '90 min', exercises: 6, volume: '24.8K lbs', status: 'active', time: 'NOW' },
  { id: 3, title: 'BACK WARFARE', type: 'POWER', duration: '80 min', exercises: 7, volume: '21.5K lbs', status: 'scheduled', time: '16:00' },
  { id: 4, title: 'ARM ASSAULT', type: 'HYPERTROPHY', duration: '60 min', exercises: 10, volume: '12.4K lbs', status: 'scheduled', time: '18:00' },
];

export default function Training() {
  const navigate = useNavigate();
  const [selectedWorkout, setSelectedWorkout] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<number, number>>({});
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  const currentWorkoutData = selectedWorkout ? workoutData[selectedWorkout as keyof typeof workoutData] : null;
  const currentExercise = currentWorkoutData?.exercises[currentExerciseIndex];

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
    setCompletedSets({});
    setWorkoutTime(0);
  };

  const handleCompleteSet = () => {
    const currentSets = completedSets[currentExerciseIndex] || 0;
    const newSets = currentSets + 1;
    setCompletedSets({ ...completedSets, [currentExerciseIndex]: newSets });

    if (currentExercise && newSets < currentExercise.sets) {
      // Start rest timer
      setIsResting(true);
      setRestTime(currentExercise.rest);
    }
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
  const completedSetsCount = Object.values(completedSets).reduce((sum, count) => sum + count, 0);
  const progress = totalSets > 0 ? Math.round((completedSetsCount / totalSets) * 100) : 0;

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
                <div className="font-mono font-bold text-xl lg:text-4xl mb-4 lg:mb-6 text-cyan-400 tracking-tight leading-tight">
                  {currentExercise.name}
                </div>
                <div className="grid grid-cols-3 gap-2 lg:gap-8 mb-6 lg:mb-8">
                  <div className="text-center">
                    <div className="font-mono text-[9px] lg:text-xs mb-1 text-cyan-400/40 tracking-widest uppercase">SETS</div>
                    <div className="font-mono font-bold text-lg lg:text-3xl text-white">{currentExercise.sets}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-[9px] lg:text-xs mb-1 text-cyan-400/40 tracking-widest uppercase">REPS</div>
                    <div className="font-mono font-bold text-lg lg:text-3xl text-white">{currentExercise.reps}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-[9px] lg:text-xs mb-1 text-cyan-400/40 tracking-widest uppercase">WEIGHT</div>
                    <div className="font-mono font-bold text-lg lg:text-3xl text-white">{currentExercise.weight}</div>
                  </div>
                </div>

                {/* Set Tracker */}
                <div className="grid grid-cols-4 sm:flex gap-2">
                  {Array.from({ length: currentExercise.sets }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex-1 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-mono text-[10px] lg:text-sm font-bold flex items-center justify-center gap-1 lg:gap-2 transition-all",
                        i < (completedSets[currentExerciseIndex] || 0) 
                          ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                          : "bg-black/40 text-cyan-400 border border-cyan-500/20"
                      )}
                    >
                      {i < (completedSets[currentExerciseIndex] || 0) && <Check className="w-3 h-3 lg:w-4 lg:h-4" />}
                      SET {i + 1}
                    </div>
                  ))}
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
                      {completedSets[i] || 0}/{exercise.sets} sets
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
                  onClick={handleCompleteSet}
                  disabled={isResting || (completedSets[currentExerciseIndex] || 0) >= currentExercise.sets}
                  className="py-3 lg:py-4 rounded-2xl font-mono text-xs lg:text-sm font-bold flex items-center justify-center gap-2 bg-emerald-500 text-black hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-widest"
                >
                  <Check className="w-4 h-4" />
                  COMPLETE SET
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
