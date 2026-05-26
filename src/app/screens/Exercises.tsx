import React, { useState } from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Search, Plus, Trash2, Edit2, PlayCircle } from 'lucide-react';
import { cn } from '../components/ui/utils';

interface Exercise {
  id: string;
  name: string;
  category: string;
  equipment: string;
  isCustom: boolean;
}

const initialExercises: Exercise[] = [
  { id: '1', name: 'Barbell Bench Press', category: 'Chest', equipment: 'Barbell', isCustom: false },
  { id: '2', name: 'Barbell Squat', category: 'Legs', equipment: 'Barbell', isCustom: false },
  { id: '3', name: 'Deadlift', category: 'Back', equipment: 'Barbell', isCustom: false },
  { id: '4', name: 'Overhead Press', category: 'Shoulders', equipment: 'Barbell', isCustom: false },
  { id: '5', name: 'Pull-ups', category: 'Back', equipment: 'Bodyweight', isCustom: false },
  { id: '6', name: 'Barbell Curls', category: 'Arms', equipment: 'Barbell', isCustom: false },
];

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    category: 'Chest',
    equipment: 'Dumbbell'
  });

  const filteredExercises = exercises.filter(ex => 
    ex.name.toLowerCase().includes(search.toLowerCase()) ||
    ex.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddExercise = () => {
    if (!newExercise.name) return;
    const exercise: Exercise = {
      id: Date.now().toString(),
      name: newExercise.name,
      category: newExercise.category,
      equipment: newExercise.equipment,
      isCustom: true
    };
    setExercises([exercise, ...exercises]);
    setShowAddModal(false);
    setNewExercise({ name: '', category: 'Chest', equipment: 'Dumbbell' });
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <TacticalHeader title="EXERCISE DATABASE" subtitle="CENTRAL INTELLIGENCE REPOSITORY" />

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/40" />
          <input 
            type="text"
            placeholder="Search exercises or muscle groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 font-mono text-sm text-cyan-400 outline-none focus:border-cyan-500/50 transition-all placeholder:text-white/20"
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 rounded-2xl bg-cyan-500 text-black font-mono font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.02] transition-transform"
        >
          <Plus className="w-5 h-5" />
          CREATE CUSTOM
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((ex) => (
          <TacticalCard key={ex.id} className="group relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 uppercase tracking-widest">
                {ex.category}
              </div>
              {ex.isCustom && (
                <div className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-widest">
                  CUSTOM
                </div>
              )}
            </div>
            
            <div className="font-mono font-bold text-lg text-white mb-2 group-hover:text-cyan-400 transition-colors">
              {ex.name}
            </div>
            
            <div className="font-mono text-[10px] text-white/40 mb-6 uppercase tracking-tighter">
              Equipment: {ex.equipment}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-[10px] text-cyan-400 hover:bg-cyan-400/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                <PlayCircle className="w-3 h-3" />
                HOW TO
              </button>
              {ex.isCustom && (
                <button 
                  onClick={() => handleDeleteExercise(ex.id)}
                  className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-black transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </TacticalCard>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md">
            <TacticalCard className="bg-[#050505] border-cyan-500/20">
              <div className="flex items-center justify-between mb-8">
                <div className="font-mono font-bold text-xl text-cyan-400">NEW EXERCISE PROTOTYPE</div>
                <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white">
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2 block">EXERCISE NAME</label>
                  <input 
                    type="text"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value.toUpperCase() })}
                    placeholder="E.G. BIONIC PUSHUPS"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-mono text-cyan-400 outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2 block">CATEGORY</label>
                    <select 
                      value={newExercise.category}
                      onChange={(e) => setNewExercise({ ...newExercise, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-mono text-xs text-white outline-none"
                    >
                      <option value="Chest">CHEST</option>
                      <option value="Back">BACK</option>
                      <option value="Legs">LEGS</option>
                      <option value="Shoulders">SHOULDERS</option>
                      <option value="Arms">ARMS</option>
                      <option value="Core">CORE</option>
                      <option value="Cardio">CARDIO</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2 block">EQUIPMENT</label>
                    <select 
                      value={newExercise.equipment}
                      onChange={(e) => setNewExercise({ ...newExercise, equipment: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-mono text-xs text-white outline-none"
                    >
                      <option value="Barbell">BARBELL</option>
                      <option value="Dumbbell">DUMBBELL</option>
                      <option value="Machine">MACHINE</option>
                      <option value="Bodyweight">BODYWEIGHT</option>
                      <option value="Cables">CABLES</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleAddExercise}
                  className="w-full py-4 rounded-2xl bg-cyan-500 text-black font-mono font-bold text-sm tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  SAVE TO REPOSITORY
                </button>
              </div>
            </TacticalCard>
          </div>
        </div>
      )}
    </div>
  );
}
