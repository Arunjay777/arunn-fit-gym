import React, { useState } from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Calendar, Dumbbell, Clock, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

export default function History() {
  const [expandedWorkout, setExpandedWorkout] = useState<number | null>(null);

  const workoutHistory = [
    {
      id: 1,
      date: 'May 12, 2026',
      type: 'CHEST DAY',
      duration: '68 min',
      volume: 18900,
      exercises: [
        { name: 'Barbell Bench Press', sets: 4, reps: [8, 8, 10, 12], weight: 225 },
        { name: 'Incline Dumbbell Press', sets: 4, reps: [10, 10, 12, 12], weight: 80 },
        { name: 'Cable Flyes', sets: 3, reps: [12, 15, 15], weight: 45 },
        { name: 'Dips', sets: 3, reps: [15, 12, 10], weight: 0 },
      ],
      color: '#FF3366'
    },
    {
      id: 2,
      date: 'May 11, 2026',
      type: 'LEG DAY',
      duration: '72 min',
      volume: 21500,
      exercises: [
        { name: 'Back Squat', sets: 5, reps: [8, 8, 10, 10, 12], weight: 315 },
        { name: 'Romanian Deadlift', sets: 4, reps: [10, 10, 12, 12], weight: 225 },
        { name: 'Leg Press', sets: 4, reps: [12, 12, 15, 15], weight: 450 },
        { name: 'Walking Lunges', sets: 3, reps: [12, 12, 15], weight: 50 },
      ],
      color: '#00FF88'
    },
    {
      id: 3,
      date: 'May 10, 2026',
      type: 'BACK DAY',
      duration: '65 min',
      volume: 16500,
      exercises: [
        { name: 'Deadlift', sets: 4, reps: [6, 8, 8, 10], weight: 405 },
        { name: 'Pull-ups', sets: 4, reps: [12, 10, 8, 8], weight: 0 },
        { name: 'Barbell Rows', sets: 4, reps: [10, 10, 12, 12], weight: 185 },
        { name: 'Face Pulls', sets: 3, reps: [15, 15, 20], weight: 30 },
      ],
      color: '#00D4FF'
    },
    {
      id: 4,
      date: 'May 9, 2026',
      type: 'SHOULDER DAY',
      duration: '58 min',
      volume: 14200,
      exercises: [
        { name: 'Military Press', sets: 4, reps: [8, 10, 10, 12], weight: 135 },
        { name: 'Lateral Raises', sets: 4, reps: [12, 12, 15, 15], weight: 30 },
        { name: 'Arnold Press', sets: 3, reps: [10, 12, 12], weight: 60 },
        { name: 'Rear Delt Flyes', sets: 3, reps: [15, 15, 20], weight: 25 },
      ],
      color: '#F59E0B'
    },
    {
      id: 5,
      date: 'May 8, 2026',
      type: 'ARM DAY',
      duration: '52 min',
      volume: 9800,
      exercises: [
        { name: 'Barbell Curls', sets: 4, reps: [10, 10, 12, 12], weight: 95 },
        { name: 'Skull Crushers', sets: 4, reps: [10, 10, 12, 12], weight: 85 },
        { name: 'Hammer Curls', sets: 3, reps: [12, 12, 15], weight: 40 },
        { name: 'Cable Pushdowns', sets: 3, reps: [15, 15, 20], weight: 60 },
      ],
      color: '#3B82F6'
    },
  ];

  const weeklyStats = [
    { label: 'Total Workouts', value: '5', color: '#00D4FF' },
    { label: 'Total Volume', value: '81K lbs', color: '#10B981' },
    { label: 'Avg Duration', value: '63 min', color: '#F59E0B' },
    { label: 'Total Time', value: '5.3 hrs', color: '#FF3366' },
  ];

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <TacticalHeader title="TRAINING HISTORY" subtitle="COMPLETE WORKOUT LOG" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {weeklyStats.map((stat) => (
          <TacticalCard key={stat.label} className="p-3 lg:p-6">
            <div className="font-mono text-[10px] lg:text-xs mb-1 lg:mb-2 text-cyan-400/60 uppercase tracking-widest">
              {stat.label}
            </div>
            <div className="font-mono font-bold text-xl lg:text-3xl" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </TacticalCard>
        ))}
      </div>

      <div className="space-y-4">
        {workoutHistory.map((workout) => {
          const isExpanded = expandedWorkout === workout.id;
          return (
            <TacticalCard key={workout.id}>
              <div
                className="cursor-pointer"
                onClick={() => setExpandedWorkout(isExpanded ? null : workout.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 lg:p-3 rounded-xl lg:rounded-2xl" style={{ background: `${workout.color}20` }}>
                      <Dumbbell className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: workout.color }} />
                    </div>
                    <div>
                      <div className="font-mono font-bold text-lg lg:text-xl" style={{ color: workout.color }}>
                        {workout.type}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] lg:text-sm text-cyan-400/60 transition-all">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                          <span>{workout.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                          <span>{workout.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                          <span>{workout.volume.toLocaleString()} lbs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-start gap-4">
                    <button className="p-2 rounded-xl transition-all bg-white/5 border border-white/5 sm:border-0 sm:bg-transparent">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 lg:w-6 lg:h-6 text-cyan-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 lg:w-6 lg:h-6 text-cyan-400" />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div className="space-y-3">
                      {workout.exercises.map((exercise, index) => (
                        <div
                          key={index}
                          className="p-4 rounded"
                          style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                        >
                          <div className="font-mono font-bold text-sm mb-3" style={{ color: '#00D4FF' }}>
                            {exercise.name}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="font-mono text-xs mb-1" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>
                                SETS × REPS
                              </div>
                              <div className="font-mono text-lg" style={{ color: '#FFFFFF' }}>
                                {exercise.sets} × {exercise.reps.join(', ')}
                              </div>
                            </div>
                            <div>
                              <div className="font-mono text-xs mb-1" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>
                                WEIGHT
                              </div>
                              <div className="font-mono text-lg" style={{ color: '#10B981' }}>
                                {exercise.weight > 0 ? `${exercise.weight} lbs` : 'Bodyweight'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TacticalCard>
          );
        })}
      </div>
    </div>
  );
}
