import React, { useState } from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Calendar, Clock, Dumbbell, ChevronLeft, ChevronRight, Plus, X, Edit } from 'lucide-react';
import { cn } from '../components/ui/utils';

interface Workout {
  time: string;
  title: string;
  duration: string;
  type: string;
  color: string;
}

export default function Schedule() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<{ dayIndex: number; workoutIndex: number } | null>(null);
  const [scheduleData, setScheduleData] = useState([
    {
      day: 0,
      workouts: [
        { time: '06:00', title: 'CHEST & TRICEPS', duration: '75 min', type: 'strength', color: '#FF3366' },
        { time: '18:00', title: 'CARDIO SESSION', duration: '30 min', type: 'cardio', color: '#00D4FF' },
      ]
    },
    {
      day: 1,
      workouts: [
        { time: '06:00', title: 'BACK & BICEPS', duration: '70 min', type: 'strength', color: '#00FF88' },
      ]
    },
    {
      day: 2,
      workouts: [
        { time: '06:00', title: 'LEGS', duration: '80 min', type: 'strength', color: '#F59E0B' },
        { time: '12:00', title: 'MOBILITY WORK', duration: '20 min', type: 'mobility', color: '#10B981' },
      ]
    },
    {
      day: 3,
      workouts: [
        { time: '06:00', title: 'SHOULDERS', duration: '60 min', type: 'strength', color: '#3B82F6' },
      ]
    },
    {
      day: 4,
      workouts: [
        { time: '06:00', title: 'FULL BODY', duration: '65 min', type: 'strength', color: '#A855F7' },
        { time: '18:00', title: 'HIIT TRAINING', duration: '25 min', type: 'cardio', color: '#00D4FF' },
      ]
    },
    {
      day: 5,
      workouts: [
        { time: '08:00', title: 'ACTIVE RECOVERY', duration: '45 min', type: 'recovery', color: '#10B981' },
      ]
    },
    {
      day: 6,
      workouts: [
        { time: '10:00', title: 'REST DAY', duration: '-', type: 'rest', color: '#888888' },
      ]
    },
  ]);

  const [newWorkout, setNewWorkout] = useState({
    time: '06:00',
    title: '',
    duration: '',
    type: 'strength',
    color: '#FF3366'
  });

  const workoutTypes = [
    { type: 'strength', color: '#FF3366' },
    { type: 'cardio', color: '#00D4FF' },
    { type: 'mobility', color: '#10B981' },
    { type: 'recovery', color: '#F59E0B' },
    { type: 'rest', color: '#888888' },
  ];

  const addWorkout = () => {
    if (selectedDay === null || !newWorkout.title || !newWorkout.duration) return;

    const updatedSchedule = [...scheduleData];
    updatedSchedule[selectedDay].workouts.push({ ...newWorkout });
    setScheduleData(updatedSchedule);
    setShowAddModal(false);
    setNewWorkout({ time: '06:00', title: '', duration: '', type: 'strength', color: '#FF3366' });
    setSelectedDay(null);
  };

  const deleteWorkout = (dayIndex: number, workoutIndex: number) => {
    const updatedSchedule = [...scheduleData];
    updatedSchedule[dayIndex].workouts.splice(workoutIndex, 1);
    setScheduleData(updatedSchedule);
  };

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const dates = ['May 12', 'May 13', 'May 14', 'May 15', 'May 16', 'May 17', 'May 18'];

  const schedule = [
    {
      day: 0,
      workouts: [
        { time: '06:00', title: 'CHEST & TRICEPS', duration: '75 min', type: 'strength', color: '#FF3366' },
        { time: '18:00', title: 'CARDIO SESSION', duration: '30 min', type: 'cardio', color: '#00D4FF' },
      ]
    },
    {
      day: 1,
      workouts: [
        { time: '06:00', title: 'BACK & BICEPS', duration: '70 min', type: 'strength', color: '#00FF88' },
      ]
    },
    {
      day: 2,
      workouts: [
        { time: '06:00', title: 'LEGS', duration: '80 min', type: 'strength', color: '#F59E0B' },
        { time: '12:00', title: 'MOBILITY WORK', duration: '20 min', type: 'mobility', color: '#10B981' },
      ]
    },
    {
      day: 3,
      workouts: [
        { time: '06:00', title: 'SHOULDERS', duration: '60 min', type: 'strength', color: '#3B82F6' },
      ]
    },
    {
      day: 4,
      workouts: [
        { time: '06:00', title: 'FULL BODY', duration: '65 min', type: 'strength', color: '#A855F7' },
        { time: '18:00', title: 'HIIT TRAINING', duration: '25 min', type: 'cardio', color: '#00D4FF' },
      ]
    },
    {
      day: 5,
      workouts: [
        { time: '08:00', title: 'ACTIVE RECOVERY', duration: '45 min', type: 'recovery', color: '#10B981' },
      ]
    },
    {
      day: 6,
      workouts: [
        { time: '10:00', title: 'REST DAY', duration: '-', type: 'rest', color: '#888888' },
      ]
    },
  ];

  const upcomingWorkouts = [
    { date: 'Today', time: '18:00', title: 'CARDIO SESSION', duration: '30 min', color: '#00D4FF' },
    { date: 'Tomorrow', time: '06:00', title: 'BACK & BICEPS', duration: '70 min', color: '#00FF88' },
    { date: 'May 14', time: '06:00', title: 'LEGS', duration: '80 min', color: '#F59E0B' },
    { date: 'May 15', time: '06:00', title: 'SHOULDERS', duration: '60 min', color: '#3B82F6' },
  ];

  const weeklyStats = [
    { label: 'Scheduled', value: '11', color: '#00D4FF' },
    { label: 'Completed', value: '4', color: '#10B981' },
    { label: 'Hours', value: '9.5', color: '#F59E0B' },
    { label: 'Rest Days', value: '1', color: '#888888' },
  ];

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <TacticalHeader title="TRAINING SCHEDULE" subtitle="WEEKLY WORKOUT PLANNER" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {weeklyStats.map((stat) => (
          <TacticalCard key={stat.label} className="p-3 lg:p-6 text-center lg:text-left">
            <div className="font-mono text-[10px] lg:text-xs mb-1 lg:mb-2 text-cyan-400/60 uppercase tracking-widest">
              {stat.label}
            </div>
            <div className="font-mono font-bold text-xl lg:text-3xl" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </TacticalCard>
        ))}
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TacticalCard>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-cyan-400" />
                <div className="font-mono font-bold text-base lg:text-lg text-cyan-400 tracking-tight">
                  WEEK SCHEDULE
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <button
                  onClick={() => setCurrentWeek(currentWeek - 1)}
                  className="p-2 rounded-xl transition-all bg-white/5 border border-white/5 hover:border-cyan-500/30"
                >
                  <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-400" />
                </button>
                <div className="font-mono text-xs lg:text-sm px-4 text-cyan-400 font-bold">
                  WEEK {currentWeek + 1}
                </div>
                <button
                  onClick={() => setCurrentWeek(currentWeek + 1)}
                  className="p-2 rounded-xl transition-all bg-white/5 border border-white/5 hover:border-cyan-500/30"
                >
                  <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-400" />
                </button>
              </div>
            </div>

            <div className="flex lg:grid lg:grid-cols-7 gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide snap-x">
              {weekDays.map((day, index) => {
                const daySchedule = schedule[index];
                return (
                  <div key={day} className="min-w-[140px] lg:min-w-0 snap-start">
                    <div className="text-center mb-3 p-2 rounded-xl bg-white/5 lg:bg-transparent border border-white/5 lg:border-0">
                      <div className="font-mono font-bold text-xs lg:text-sm mb-0.5 lg:mb-1 text-cyan-400">
                        {day}
                      </div>
                      <div className="font-mono text-[10px] text-white/40 uppercase tracking-tighter">
                        {dates[index]}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {daySchedule.workouts.map((workout, wIndex) => (
                        <div
                          key={wIndex}
                          className="p-2.5 rounded-xl group relative transition-all hover:scale-[1.02]"
                          style={{
                            background: `${workout.color}15`,
                            border: `1px solid ${workout.color}30`
                          }}
                        >
                          <button
                            onClick={() => deleteWorkout(index, wIndex)}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all flex items-center justify-center bg-red-500 shadow-lg"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                          <div className="font-mono text-[9px] mb-1 font-bold tracking-widest opacity-80" style={{ color: workout.color }}>
                            {workout.time}
                          </div>
                          <div className="font-mono font-bold text-[10px] lg:text-xs mb-1 leading-tight" style={{ color: workout.color }}>
                            {workout.title}
                          </div>
                          <div className="font-mono text-[9px] text-white/40">
                            {workout.duration}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setSelectedDay(index);
                          setShowAddModal(true);
                        }}
                        className="w-full p-3 rounded-xl transition-all bg-white/5 border border-dashed border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 group"
                      >
                        <Plus className="w-4 h-4 mx-auto text-white/20 group-hover:text-cyan-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </TacticalCard>

          <TacticalCard>
            <div className="flex items-center gap-3 mb-6">
              <Dumbbell className="w-5 h-5 text-cyan-400" />
              <div className="font-mono font-bold text-sm text-cyan-400 tracking-widest uppercase">
                Workout Templates
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'CHEST DAY', color: '#FF3366', exercises: 6 },
                { name: 'LEG DAY', color: '#00FF88', exercises: 7 },
                { name: 'BACK DAY', color: '#00D4FF', exercises: 6 },
                { name: 'SHOULDER DAY', color: '#F59E0B', exercises: 5 },
                { name: 'ARM DAY', color: '#3B82F6', exercises: 6 },
                { name: 'FULL BODY', color: '#A855F7', exercises: 8 },
              ].map((template) => (
                <button
                  key={template.name}
                  className="p-4 rounded-2xl text-left transition-all hover:scale-[1.02] bg-white/5 border border-white/5 hover:border-cyan-500/30 group"
                >
                  <div className="font-mono font-bold text-xs lg:text-sm mb-1 group-hover:text-cyan-400 transition-colors" style={{ color: template.color }}>
                    {template.name}
                  </div>
                  <div className="font-mono text-[10px] text-white/40 uppercase tracking-tighter">
                    {template.exercises} exercises
                  </div>
                </button>
              ))}
            </div>
          </TacticalCard>
        </div>

        <div className="space-y-6">
          <TacticalCard>
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-cyan-400" />
              <div className="font-mono font-bold text-sm text-cyan-400 tracking-widest uppercase">
                Upcoming Workouts
              </div>
            </div>
            <div className="space-y-3">
              {upcomingWorkouts.map((workout, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                      {workout.date}
                    </div>
                    <div className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border bg-white/5" style={{ borderColor: `${workout.color}40`, color: workout.color }}>
                      {workout.time}
                    </div>
                  </div>
                  <div className="font-mono font-bold text-sm mb-1 text-white group-hover:text-cyan-400 transition-colors">
                    {workout.title}
                  </div>
                  <div className="font-mono text-[10px] text-white/30 uppercase tracking-tighter">
                    {workout.duration}
                  </div>
                </div>
              ))}
            </div>
          </TacticalCard>

          <TacticalCard glow className="bg-cyan-500/5 border-cyan-500/20">
            <div className="mb-4">
              <div className="font-mono font-bold text-sm mb-1 text-cyan-400 tracking-widest uppercase">
                Current Priority
              </div>
            </div>
            <div className="p-4 lg:p-6 rounded-2xl bg-black/40 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <div className="font-mono text-xl lg:text-2xl font-bold mb-2 text-white">
                CARDIO SESSION
              </div>
              <div className="font-mono text-xs lg:text-sm mb-6 text-cyan-400/60 uppercase tracking-widest">
                18:00 • 30 minutes
              </div>
              <button
                className="w-full py-4 rounded-xl font-mono font-bold text-xs lg:text-sm transition-all bg-cyan-500 text-black hover:scale-105 shadow-[0_0_15px_rgba(6,182,212,0.4)] uppercase tracking-[0.2em]"
              >
                Start Protocol
              </button>
            </div>
          </TacticalCard>
        </div>
      </div>

      {/* Add Workout Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowAddModal(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(3, 3, 3, 0.9)' }} />
          <div className="relative w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <TacticalCard className="rounded-[32px] border-cyan-500/20 bg-black/80 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8">
                <div className="font-mono font-bold text-lg lg:text-xl text-cyan-400 tracking-tight">
                  ADD NEW PROTOCOL
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-5 h-5 lg:w-6 lg:h-6 text-white/40" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="font-mono text-[10px] mb-2 block text-white/30 tracking-widest uppercase">
                    Protocol Title
                  </label>
                  <input
                    type="text"
                    value={newWorkout.title}
                    onChange={(e) => setNewWorkout({ ...newWorkout, title: e.target.value.toUpperCase() })}
                    placeholder="e.g. SQUAT OVERLOAD"
                    className="w-full p-4 rounded-2xl font-mono text-sm outline-none bg-white/5 border border-white/5 focus:border-cyan-500/50 transition-all text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] mb-2 block text-white/30 tracking-widest uppercase">
                      Execution Time
                    </label>
                    <input
                      type="time"
                      value={newWorkout.time}
                      onChange={(e) => setNewWorkout({ ...newWorkout, time: e.target.value })}
                      className="w-full p-4 rounded-2xl font-mono text-sm outline-none bg-white/5 border border-white/5 focus:border-cyan-500/50 transition-all text-white"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] mb-2 block text-white/30 tracking-widest uppercase">
                      Est. Duration
                    </label>
                    <input
                      type="text"
                      value={newWorkout.duration}
                      onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
                      placeholder="75 min"
                      className="w-full p-4 rounded-2xl font-mono text-sm outline-none bg-white/5 border border-white/5 focus:border-cyan-500/50 transition-all text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[10px] mb-2 block text-white/30 tracking-widest uppercase">
                    Protocol Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {workoutTypes.map((type) => (
                      <button
                        key={type.type}
                        onClick={() => setNewWorkout({ ...newWorkout, type: type.type, color: type.color })}
                        className={cn(
                          "p-2.5 rounded-xl font-mono text-[10px] uppercase transition-all tracking-tighter",
                          newWorkout.type === type.type ? 'scale-105 opacity-100' : 'opacity-30 hover:opacity-60'
                        )}
                        style={{
                          background: `${type.color}20`,
                          border: `2px solid ${newWorkout.type === type.type ? type.color : 'transparent'}`,
                          color: type.color
                        }}
                      >
                        {type.type}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={addWorkout}
                  disabled={!newWorkout.title || !newWorkout.duration}
                  className="w-full py-4 rounded-2xl font-mono font-bold text-sm transition-all bg-cyan-500 text-black hover:scale-[1.02] disabled:opacity-20 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(6,182,212,0.3)] tracking-widest"
                >
                  INITIALIZE PROTOCOL
                </button>
              </div>
            </TacticalCard>
          </div>
        </div>
      )}
    </div>
  );
}
