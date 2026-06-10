import React, { useState, useEffect, useRef } from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import FitXLogo from '../components/FitXLogo';
import { 
  Zap, Flame, Dumbbell, Clock, Plus, Trash2, Edit2, Check,
  ArrowUp, ArrowDown, Sparkles, Activity, Shield, Info, Heart,
  Save, RefreshCw, Play, Square, Gauge, ChevronRight, RotateCcw,
  CheckCircle, PlusCircle, HelpCircle, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../lib/firebase';
import { collection, doc, setDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';

// Define core type interfaces for custom metrics
interface ExerciseItem {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  rest: number; // rest time in seconds
}

interface TrainingProtocol {
  id: string;
  name: string;
  category: 'Strength' | 'Hypertrophy' | 'Neural' | 'Endurance' | 'Recovery';
  intensity: number; // 40-100%
  rpe: number; // RPE level 1-10
  tempo: string; // e.g. "4-0-1-0" (Eccentric - Bottom pause - Concentric - Top hold)
  exercises: ExerciseItem[];
  equipment: string[];
  notes?: string;
  isCustom?: boolean;
}

// Highly stylized pre-configured FitX Preset Protocols
const PRESET_PROTOCOLS: TrainingProtocol[] = [
  {
    id: 'preset-alpha-strike',
    name: 'ALPHA STRIKE NEURAL SPLIT',
    category: 'Strength',
    intensity: 90,
    rpe: 9,
    tempo: '3-1-1-0',
    exercises: [
      { id: 'ex-1', name: 'Barbell Back Squats', sets: 4, reps: '5', weight: '275 lbs', rest: 120 },
      { id: 'ex-2', name: 'Raw Flat Bench Press', sets: 4, reps: '6', weight: '185 lbs', rest: 90 },
      { id: 'ex-3', name: 'Weighted Tactical Chin-ups', sets: 3, reps: '8', weight: '25 lbs', rest: 90 }
    ],
    equipment: ['Barbell', 'Rack', 'Weight Belt'],
    notes: 'Prioritizes maximum motor unit recruitment. Focus on rapid concentric phase and absolute core stability.'
  },
  {
    id: 'preset-hyper-sync',
    name: 'NEURAL CONCENTRIC STACK',
    category: 'Hypertrophy',
    intensity: 80,
    rpe: 8,
    tempo: '4-0-1-0',
    exercises: [
      { id: 'ex-4', name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', weight: '70 lbs', rest: 75 },
      { id: 'ex-5', name: 'Decline Cable Flyes', sets: 3, reps: '12-15', weight: '40 lbs', rest: 60 },
      { id: 'ex-6', name: 'Barbell Skull Crushers', sets: 3, reps: '12', weight: '75 lbs', rest: 60 }
    ],
    equipment: ['Dumbbells', 'Incline Bench', 'Cable Machine'],
    notes: 'Maximizes sarcoplasmic hypertrophy using micro-damage tempo cycles. Control the 4-second eccentric load.'
  },
  {
    id: 'preset-oxygen-shield',
    name: 'APEX CONDITIONING MATRIX',
    category: 'Endurance',
    intensity: 75,
    rpe: 7,
    tempo: '2-0-2-2',
    exercises: [
      { id: 'ex-7', name: 'Explosive Box Jumps', sets: 4, reps: '20', weight: 'Bodyweight', rest: 45 },
      { id: 'ex-8', name: 'Heavy Kettlebell Swings', sets: 4, reps: '20', weight: '53 lbs', rest: 45 },
      { id: 'ex-9', name: 'Double Battle Rope Alternating', sets: 3, reps: '45 sec', weight: 'Medium', rest: 60 }
    ],
    equipment: ['Plyo Box', 'Kettlebell', 'Battle Ropes'],
    notes: 'Enhances high-threshold anaerobic resilience. Perfect breathing rhythm lock avoids respiratory fatigue.'
  }
];

export default function CustomProtocols() {
  const [protocols, setProtocols] = useState<TrainingProtocol[]>([]);
  const [activeProtocol, setActiveProtocol] = useState<TrainingProtocol | null>(null);
  const [activeTab, setActiveTab] = useState<'All' | 'Strength' | 'Hypertrophy' | 'Neural' | 'Endurance' | 'Recovery'>('All');
  
  // Custom builder form states
  const [isBuildingNew, setIsBuildingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState('CUSTOM INTEGRATED SYSTEM v1');
  const [formCategory, setFormCategory] = useState<'Strength' | 'Hypertrophy' | 'Neural' | 'Endurance' | 'Recovery'>('Strength');
  const [formIntensity, setFormIntensity] = useState(80);
  const [formRpe, setFormRpe] = useState(8);
  const [formTempo, setFormTempo] = useState('4-0-1-0');
  const [formNotes, setFormNotes] = useState('');
  const [formEquipment, setFormEquipment] = useState<string>('Barbell, Dumbbells');
  const [formExercises, setFormExercises] = useState<ExerciseItem[]>([
    { id: 'initial-1', name: 'Warmup Lateral Raises', sets: 3, reps: '15', weight: '20 lbs', rest: 45 }
  ]);

  // Temporary item for adding new exercises to form list
  const [tempExName, setTempExName] = useState('');
  const [tempExSets, setTempExSets] = useState(4);
  const [tempExReps, setTempExReps] = useState('10');
  const [tempExWeight, setTempExWeight] = useState('100 lbs');
  const [tempExRest, setTempExRest] = useState(60);

  // Firestore & Cloud database sync markers
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // --- PACING SIMULATOR ENGINE STATE ---
  const [isSimulating, setIsSimulating] = useState(false);
  const [simExerciseIndex, setSimExerciseIndex] = useState(0);
  const [simSetNumber, setSimSetNumber] = useState(1);
  const [pacingPhase, setPacingPhase] = useState<'ECCENTRIC (LOWER)' | 'PAUSE' | 'CONCENTRIC (PUSH)' | 'HOLD'>('ECCENTRIC (LOWER)');
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const [heartRate, setHeartRate] = useState(72);
  const [showSyncSuccessMsg, setShowSyncSuccessMsg] = useState(false);

  // Parse tempo beats from format "4-0-1-0"
  const parseTempo = (tempoStr: string) => {
    const parts = tempoStr.split('-').map(Number);
    return {
      eccentric: isNaN(parts[0]) ? 3 : parts[0],
      pause: isNaN(parts[1]) ? 0 : parts[1],
      concentric: isNaN(parts[2]) ? 1 : parts[2],
      hold: isNaN(parts[3]) ? 0 : parts[3]
    };
  };

  // Timer Ref for execution simulator loop
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and merge storage data
  useEffect(() => {
    // 1. Check local storage
    const loadedLocals = localStorage.getItem('fitx_custom_protocols');
    let mergedList = [...PRESET_PROTOCOLS];
    
    if (loadedLocals) {
      try {
        const parsed = JSON.parse(loadedLocals) as TrainingProtocol[];
        // Filter out duplicate IDs or override preset duplicates
        const filteredLocals = parsed.filter(item => !PRESET_PROTOCOLS.some(p => p.id === item.id));
        mergedList = [...PRESET_PROTOCOLS, ...filteredLocals];
      } catch (e) {
        console.error("Failed to parse custom local protocols", e);
      }
    }
    
    setProtocols(mergedList);
    setActiveProtocol(mergedList[0]);

    // 2. Check current firebase auth state
    const localUid = localStorage.getItem('userId');
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        setCurrentUserId(user.uid);
        // Fetch custom firestore records dynamically if not a local bypass user
        if (user.uid && !user.uid.endsWith('_local')) {
          fetchFirestoreProtocols(user.uid, mergedList);
        } else {
          setSyncStatus('synced');
        }
      } else if (localUid) {
        setIsAuthenticated(true);
        setCurrentUserId(localUid);
        setSyncStatus('synced');
      } else {
        setIsAuthenticated(false);
        setCurrentUserId(null);
      }
    });

    return () => {
      unsubscribe();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Fetch from Google Firestore database
  const fetchFirestoreProtocols = async (uid: string, currentList: TrainingProtocol[]) => {
    setSyncStatus('syncing');
    try {
      const colRef = collection(db, 'custom_protocols');
      const q = query(colRef, where('uid', '==', uid));
      const querySnap = await getDocs(q);
      
      const firebaseItems: TrainingProtocol[] = [];
      querySnap.forEach((doc) => {
        const data = doc.data();
        firebaseItems.push({
          id: doc.id,
          name: data.name,
          category: data.category,
          intensity: data.intensity,
          rpe: data.rpe,
          tempo: data.tempo,
          exercises: data.exercises,
          equipment: data.equipment || [],
          notes: data.notes || '',
          isCustom: true
        });
      });

      if (firebaseItems.length > 0) {
        // Merge firebase items into the existing list, replacing local custom ones with the same IDs
        const untouchedPresets = currentList.filter(item => !item.isCustom);
        const uniqueCustoms = firebaseItems.filter(item => !untouchedPresets.some(p => p.id === item.id));
        const updatedList = [...untouchedPresets, ...uniqueCustoms];
        
        setProtocols(updatedList);
        setActiveProtocol(updatedList[0] || null);
        localStorage.setItem('fitx_custom_protocols', JSON.stringify(uniqueCustoms));
      }
      setSyncStatus('synced');
    } catch (e) {
      console.error("Firestore loading error, keeping local models intact", e);
      setSyncStatus('error');
    }
  };

  // Push user custom protocols list to cloud database
  const syncWithCloudFirestore = async () => {
    if (!isAuthenticated || !currentUserId) {
      alert("Authenticating system... Please ensure you are logged in to save directly to your cloud profile.");
      return;
    }

    setSyncStatus('syncing');
    try {
      const customs = protocols.filter(p => p.isCustom);
      const colRef = collection(db, 'custom_protocols');

      // Upload each custom protocol to Firestore using its ID
      for (const item of customs) {
        const docRef = doc(colRef, item.id);
        await setDoc(docRef, {
          uid: currentUserId,
          name: item.name,
          category: item.category,
          intensity: item.intensity,
          rpe: item.rpe,
          tempo: item.tempo,
          exercises: item.exercises,
          equipment: item.equipment,
          notes: item.notes || '',
          updatedAt: new Date().toISOString()
        });
      }

      setSyncStatus('synced');
      setShowSyncSuccessMsg(true);
      setTimeout(() => setShowSyncSuccessMsg(false), 3000);
    } catch (e) {
      console.error("Failed syncing protocols to cloud", e);
      setSyncStatus('error');
    }
  };

  // Safe save routine
  const saveProtocol = (newProtocol: TrainingProtocol) => {
    const updatedProtocols = protocols.filter(p => p.id !== newProtocol.id);
    const finalProtocols = [...updatedProtocols, newProtocol];
    
    setProtocols(finalProtocols);
    setActiveProtocol(newProtocol);
    
    // Filter only user-created custom protocols for local state persistence
    const customs = finalProtocols.filter(p => p.isCustom);
    localStorage.setItem('fitx_custom_protocols', JSON.stringify(customs));

    // Proactively upload to firestore if logged in and not local test bypass
    if (isAuthenticated && currentUserId && !currentUserId.endsWith('_local')) {
      const docRef = doc(db, 'custom_protocols', newProtocol.id);
      setDoc(docRef, {
        uid: currentUserId,
        name: newProtocol.name,
        category: newProtocol.category,
        intensity: newProtocol.intensity,
        rpe: newProtocol.rpe,
        tempo: newProtocol.tempo,
        exercises: newProtocol.exercises,
        equipment: newProtocol.equipment,
        notes: newProtocol.notes || '',
        updatedAt: new Date().toISOString()
      }).then(() => {
        setSyncStatus('synced');
      }).catch(() => {
        setSyncStatus('error');
      });
    } else if (currentUserId && currentUserId.endsWith('_local')) {
      setSyncStatus('synced');
    }
  };

  const deleteProtocol = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Prevent deleting preset core templates
    if (!id.startsWith('preset-')) {
      const updated = protocols.filter(p => p.id !== id);
      setProtocols(updated);
      
      const customs = updated.filter(p => p.isCustom);
      localStorage.setItem('fitx_custom_protocols', JSON.stringify(customs));

      if (activeProtocol?.id === id) {
        setActiveProtocol(updated[0] || null);
      }

      // Sync delete with firestore
      if (isAuthenticated && currentUserId && !currentUserId.endsWith('_local')) {
        try {
          await deleteDoc(doc(db, 'custom_protocols', id));
        } catch (err) {
          console.error("Error deleting from cloud instance", err);
        }
      }
    }
  };

  // Form manipulation actions
  const handleAddNewExercise = () => {
    if (!tempExName.trim()) return;
    const newItem: ExerciseItem = {
      id: `ex-id-${Date.now()}`,
      name: tempExName,
      sets: tempExSets,
      reps: tempExReps,
      weight: tempExWeight,
      rest: tempExRest
    };
    setFormExercises([...formExercises, newItem]);
    setTempExName('');
  };

  const handleRemoveExerciseFromForm = (exId: string) => {
    setFormExercises(formExercises.filter(ex => ex.id !== exId));
  };

  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formExercises.length - 1) return;

    const newList = [...formExercises];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    setFormExercises(newList);
  };

  const initBuildNew = () => {
    setIsBuildingNew(true);
    setIsEditing(false);
    setFormName('TACTICAL SPLIT DELTA v1');
    setFormCategory('Strength');
    setFormIntensity(85);
    setFormRpe(9);
    setFormTempo('3-0-1-1');
    setFormNotes('Aggressive concentric pacing with 3s eccentric negative focus.');
    setFormEquipment('Barbell, Kettlebell');
    setFormExercises([
      { id: 'ex-def-1', name: 'Barbell Deadlifts', sets: 4, reps: '5', weight: '315 lbs', rest: 120 },
      { id: 'ex-def-2', name: 'Standing Overhead Press', sets: 3, reps: '8', weight: '135 lbs', rest: 90 }
    ]);
  };

  const initEditCurrent = (protocol: TrainingProtocol) => {
    setIsEditing(true);
    setIsBuildingNew(false);
    setFormName(protocol.name);
    setFormCategory(protocol.category);
    setFormIntensity(protocol.intensity);
    setFormRpe(protocol.rpe);
    setFormTempo(protocol.tempo);
    setFormNotes(protocol.notes || '');
    setFormEquipment(protocol.equipment.join(', '));
    setFormExercises([...protocol.exercises]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formExercises.length === 0) {
      alert("Please provide a protocol name and add at least 1 exercise before locking the sequence.");
      return;
    }

    const newProtocol: TrainingProtocol = {
      id: isEditing && activeProtocol ? activeProtocol.id : `fitx-protocol-${Date.now()}`,
      name: formName.trim().toUpperCase(),
      category: formCategory,
      intensity: formIntensity,
      rpe: formRpe,
      tempo: formTempo,
      exercises: formExercises,
      equipment: formEquipment.split(',').map(eq => eq.trim()).filter(Boolean),
      notes: formNotes,
      isCustom: true
    };

    saveProtocol(newProtocol);
    setIsBuildingNew(false);
    setIsEditing(false);
  };

  // --- BIO-SYNC PACER CYCLE EXECUTION SIMULATOR ---
  const launchSimTimer = (tempoStr: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const cycle = parseTempo(tempoStr);
    let stepCount = 0;
    
    // Sequence order: Eccentric, Pause, Concentric, Hold
    const sequence: { phase: typeof pacingPhase; duration: number }[] = [];
    if (cycle.eccentric > 0) sequence.push({ phase: 'ECCENTRIC (LOWER)', duration: cycle.eccentric });
    if (cycle.pause > 0) sequence.push({ phase: 'PAUSE', duration: cycle.pause });
    if (cycle.concentric > 0) sequence.push({ phase: 'CONCENTRIC (PUSH)', duration: cycle.concentric });
    if (cycle.hold > 0) sequence.push({ phase: 'HOLD', duration: cycle.hold });

    // Fallback if tempo string resolves empty
    if (sequence.length === 0) {
      sequence.push({ phase: 'ECCENTRIC (LOWER)', duration: 3 });
      sequence.push({ phase: 'CONCENTRIC (PUSH)', duration: 1 });
    }

    let seqIndex = 0;
    setPacingPhase(sequence[0].phase);
    setSecondsRemaining(sequence[0].duration);

    timerRef.current = setInterval(() => {
      // Periodic simulated small variations in athlete heart rate
      setHeartRate(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const currentTarget = isSimulating ? 120 + Math.random() * 20 : 72;
        const speed = 0.15;
        const next = prev + (currentTarget - prev) * speed + delta;
        return Math.floor(Math.max(60, Math.min(185, next)));
      });

      setSecondsRemaining(prev => {
        if (prev <= 1) {
          // Advance to next phase
          seqIndex = (seqIndex + 1) % sequence.length;
          setPacingPhase(sequence[seqIndex].phase);
          return sequence[seqIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startSimulator = () => {
    if (!activeProtocol || activeProtocol.exercises.length === 0) return;
    setIsSimulating(true);
    setSimExerciseIndex(0);
    setSimSetNumber(1);
    setHeartRate(95);
    launchSimTimer(activeProtocol.tempo);
  };

  const stopSimulator = () => {
    setIsSimulating(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setHeartRate(72);
  };

  const nextSimSet = () => {
    if (!activeProtocol) return;
    const currentEx = activeProtocol.exercises[simExerciseIndex];
    if (simSetNumber < currentEx.sets) {
      setSimSetNumber(prev => prev + 1);
    } else if (simExerciseIndex < activeProtocol.exercises.length - 1) {
      setSimExerciseIndex(prev => prev + 1);
      setSimSetNumber(1);
    } else {
      // Completed full protocol!
      alert(`CONGRATULATIONS! You completed ${activeProtocol.name}! Synced feedback uploaded back to athlete profile.`);
      stopSimulator();
    }
  };

  const filteredProtocols = protocols.filter(p => 
    activeTab === 'All' ? true : p.category.toLowerCase() === activeTab.toLowerCase()
  );

  // Compute calculated loads
  const calculateTotalWorkload = (p: TrainingProtocol) => {
    return p.exercises.reduce((total, ex) => {
      const parsedWeight = parseFloat(ex.weight) || 10;
      return total + (ex.sets * (parseInt(ex.reps) || 10) * parsedWeight);
    }, 0);
  };

  return (
    <div className="min-h-screen p-4 lg:p-8" style={{ background: '#08080c' }}>
      <TacticalHeader 
        title="CUSTOM PROTOCOLS" 
        subtitle="NEURAL CONFIGURATION & BIOMETRIC PACING ENGINE" 
      />

      {/* Hero Module presenting SIMATS FitX System design parameters */}
      <div className="mb-6 relative rounded-3xl overflow-hidden h-[180px] border border-cyan-400/20 shadow-[0_0_20px_rgba(16,235,91,0.05)]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/85 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&q=80&w=1000"
          alt="Athlete Training Ground"
          className="absolute inset-0 w-full h-full object-cover filter brightness-50"
        />
        <div className="absolute inset-0 flex items-center p-6 lg:p-8 z-20">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[#00E676] tracking-[0.25em]">
              <FitXLogo className="w-5 h-5 filter drop-shadow-[0_0_6px_rgba(24,240,111,0.5)]" />
              BIOMETRIC PROTOCOL CENTER
            </div>
            <h2 className="font-mono text-2xl lg:text-3xl font-black text-white leading-tight uppercase tracking-tight">
              NEURAL-TIMED PACING TUNER
            </h2>
            <p className="font-mono text-[10px] lg:text-xs text-white/50 mt-1 max-w-lg leading-relaxed">
              Create customizable workout programs engineered directly with rhythmic pacing tempos. Experience bio-feedback instructions timed to the decimal second.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Divide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* --- LEFT HAND SECTION: BUILDING FORM OR LIVE PROTOCOL DETAIL VIEW --- */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {isBuildingNew || isEditing ? (
            <TacticalCard className="border border-cyan-400/20" glow>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2 font-mono text-sm text-cyan-400 font-bold tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#00E676]" />
                    {isEditing ? "EDIT BIOMETRIC PROTOCOL" : "DECLARE NEW CUSTOM PROTOCOL"}
                  </div>
                  <button 
                    type="button"
                    onClick={() => { setIsBuildingNew(false); setIsEditing(false); }}
                    className="font-mono text-xs px-2.5 py-1 rounded bg-white/5 text-white/60 hover:bg-white/10"
                  >
                    CANCEL
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-white/40 tracking-wider mb-1 uppercase">Protocol Name</label>
                    <input
                      type="text"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 font-mono text-xs text-white outline-none focus:border-[#00E676] transition-all"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-white/40 tracking-wider mb-1 uppercase">Training Discipline</label>
                    <select
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 font-mono text-xs text-white outline-none focus:border-[#00E676] transition-all"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                    >
                      <option value="Strength">Strength Training</option>
                      <option value="Hypertrophy">Hypertrophy (Mass Cycle)</option>
                      <option value="Neural">Neural Rep Sync</option>
                      <option value="Endurance">Endurance Conditioning</option>
                      <option value="Recovery">Deload Recovery Flow</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-white/40 tracking-wider mb-1 uppercase">Target Intensity ({formIntensity}%)</label>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      step="5"
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00E676]"
                      value={formIntensity}
                      onChange={(e) => setFormIntensity(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-white/40 tracking-wider mb-1 uppercase">Target RPE (Level {formRpe})</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      value={formRpe}
                      onChange={(e) => setFormRpe(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-white/40 tracking-wider mb-1 uppercase">Pacing Tempo (e.g. 4-0-1-0)</label>
                    <input
                      type="text"
                      placeholder="Ecc-Pause-Con-Hold"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 font-mono text-xs text-white outline-none focus:border-[#00E676]"
                      value={formTempo}
                      onChange={(e) => setFormTempo(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-white/40 tracking-wider mb-1 uppercase">Equipment Directives (separated by commas)</label>
                  <input
                    type="text"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 font-mono text-xs text-white outline-none focus:border-[#00E676]"
                    value={formEquipment}
                    onChange={(e) => setFormEquipment(e.target.value)}
                  />
                </div>

                {/* Exercises Stack List */}
                <div className="space-y-2">
                  <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Exercise Sequence Map</div>
                  
                  {formExercises.length === 0 ? (
                    <div className="border border-dashed border-white/10 p-4 rounded-xl text-center font-mono text-xs text-white/40">
                      No activities added yet. Declare exercises below.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {formExercises.map((ex, idx) => (
                        <div key={ex.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-[#00E676] bg-[#00E676]/10 px-1.5 py-0.5 rounded">#{idx + 1}</span>
                            <div>
                              <div className="font-mono text-xs font-bold text-white">{ex.name}</div>
                              <div className="font-mono text-[10px] text-white/40 mt-0.5">
                                {ex.sets} Sets • {ex.reps} Reps • {ex.weight} • Rest {ex.rest}s
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleMoveExercise(idx, 'up')}
                              className="p-1 hover:bg-white/10 rounded text-cyan-400 disabled:opacity-30"
                              disabled={idx === 0}
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveExercise(idx, 'down')}
                              className="p-1 hover:bg-white/10 rounded text-cyan-400 disabled:opacity-30"
                              disabled={idx === formExercises.length - 1}
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveExerciseFromForm(ex.id)}
                              className="p-1 hover:bg-rose-500/20 rounded text-rose-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Row Panel */}
                  <div className="p-3 bg-black border border-white/5 rounded-xl space-y-2 mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Exercise description..."
                        className="bg-white/5 border border-white/10 rounded px-2.5 py-1.5 font-mono text-xs text-white"
                        value={tempExName}
                        onChange={(e) => setTempExName(e.target.value)}
                      />
                      <div className="grid grid-cols-3 gap-1">
                        <input
                          type="number"
                          placeholder="Sets"
                          title="Sets"
                          className="bg-white/5 border border-white/10 rounded px-1.5 py-1 text-center font-mono text-xs text-white"
                          value={tempExSets}
                          onChange={(e) => setTempExSets(Number(e.target.value))}
                        />
                        <input
                          type="text"
                          placeholder="Reps"
                          title="Reps"
                          className="bg-white/5 border border-white/10 rounded px-1.5 py-1 text-center font-mono text-xs text-white"
                          value={tempExReps}
                          onChange={(e) => setTempExReps(e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Weight"
                          title="Weight / Resistance"
                          className="bg-white/5 border border-white/10 rounded px-1.5 py-1 text-center font-mono text-xs text-white"
                          value={tempExWeight}
                          onChange={(e) => setTempExWeight(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] text-white/40 uppercase">Rest Delay (sec):</span>
                        <input
                          type="number"
                          className="bg-white/5 border border-white/10 rounded px-2 py-1 text-center font-mono text-xs text-white w-14"
                          value={tempExRest}
                          onChange={(e) => setTempExRest(Number(e.target.value))}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddNewExercise}
                        className="px-3 py-1 bg-cyan-400 text-black font-mono text-[10px] font-bold rounded hover:bg-cyan-300 flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> ADD SEQUENCE STEP
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-white/40 tracking-wider mb-1 uppercase">Coach Strategy Directives</label>
                  <textarea
                    placeholder="Provide performance feedback triggers..."
                    className="w-full h-16 bg-black border border-white/10 rounded-xl px-4 py-2 font-mono text-xs text-white outline-none focus:border-[#00E676] resize-none"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#00E676] hover:bg-[#00c860] active:scale-95 transition-all text-black font-mono font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(24,240,111,0.25)]"
                  >
                    <Save className="w-4 h-4" /> LOCK BIOMETRIC CODE
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsBuildingNew(false); setIsEditing(false); }}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-mono text-xs rounded-xl"
                  >
                    DISMISS
                  </button>
                </div>
              </form>
            </TacticalCard>
          ) : activeProtocol ? (
            /* Selected Protocol Information Screen */
            <TacticalCard className="border border-white/10 relative overflow-hidden" glow>
              <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-[#00E676] tracking-widest bg-white/5 rounded-bl-xl border-l border-b border-white/5">
                LOADED: ACTIVE SYNC
              </div>

              <div className="mb-4">
                <span className="px-2 py-0.5 rounded font-mono text-[9px] text-black font-bold uppercase" style={{ background: activeProtocol.category === 'Strength' ? '#FF1E4E' : activeProtocol.category === 'Hypertrophy' ? '#00D4FF' : '#00E676' }}>
                  {activeProtocol.category}
                </span>
                <h3 className="font-mono text-2xl font-black text-white uppercase tracking-tight mt-2 leading-none">
                  {activeProtocol.name}
                </h3>
                {activeProtocol.notes && (
                  <p className="font-mono text-xs text-white/50 mt-2 italic leading-relaxed">
                    "{activeProtocol.notes}"
                  </p>
                )}
              </div>

              {/* Bio Metric Bars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-black/45 p-4 rounded-2xl border border-white/5 mb-6">
                <div>
                  <div className="font-mono text-[9px] text-white/40 uppercase">System Intensity</div>
                  <div className="font-mono text-lg font-bold text-[#00E676]">{activeProtocol.intensity}%</div>
                  <div className="w-full bg-white/10 h-1 rounded overflow-hidden mt-1">
                    <div className="bg-[#00E676] h-full" style={{ width: `${activeProtocol.intensity}%` }} />
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[9px] text-white/40 uppercase">Subjective RPE</div>
                  <div className="font-mono text-lg font-bold text-cyan-400">RPE {activeProtocol.rpe} / 10</div>
                  <div className="w-full bg-white/10 h-1 rounded overflow-hidden mt-1">
                    <div className="bg-cyan-400 h-full" style={{ width: `${activeProtocol.rpe * 10}%` }} />
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[9px] text-white/40 uppercase">Tuning Tempo</div>
                  <div className="font-mono text-lg font-bold text-amber-400">{activeProtocol.tempo}</div>
                  <div className="font-mono text-[9px] text-white/30 mt-1">Ecc-Hold-Con-Lock</div>
                </div>
              </div>

              <div className="font-mono text-xs text-white/70 tracking-wider mb-2 uppercase flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-cyan-400" /> EXERCISE STEPS IN REGISTRY
              </div>

              <div className="space-y-2 mb-6">
                {activeProtocol.exercises.map((ex, idx) => (
                  <div key={ex.id} className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-xs font-bold text-white flex items-center gap-2">
                        <span className="text-cyan-400">0{idx + 1}</span>
                        {ex.name}
                      </div>
                      <div className="font-mono text-[10px] text-white/40 mt-0.5">
                        {ex.sets} Working Sets • {ex.reps} Target Reps • {ex.weight}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs text-white font-bold flex items-center gap-1.5 justify-end">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        {ex.rest}s
                      </div>
                      <span className="font-mono text-[8px] text-white/30 uppercase">Recovery delay</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-white/40">EQUIPMENT REQUIRED:</span>
                  {activeProtocol.equipment.map(eq => (
                    <span key={eq} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[9px] text-white/70">
                      {eq}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-4 md:mt-0 w-full sm:w-auto">
                  <button
                    onClick={() => initEditCurrent(activeProtocol)}
                    className="flex-1 sm:flex-initial px-4 py-2 border border-cyan-400/20 hover:border-cyan-400/40 font-mono text-xs text-cyan-400 font-bold rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> EDIT CODE
                  </button>
                  
                  {!isSimulating ? (
                    <button
                      onClick={startSimulator}
                      className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#00E676] hover:bg-[#00c860] text-black font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(24,240,111,0.2)]"
                    >
                      <Play className="w-4 h-4 fill-current" /> LAUNCH BIO-SYNC
                    </button>
                  ) : (
                    <button
                      onClick={stopSimulator}
                      className="flex-1 sm:flex-initial px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                    >
                      <Square className="w-4 h-4 fill-current" /> KILL SYNC
                    </button>
                  )}
                </div>
              </div>
            </TacticalCard>
          ) : (
            <div className="border border-dashed border-white/10 p-12 text-center rounded-3xl">
              <Info className="w-8 h-8 text-white/30 mx-auto mb-2" />
              <div className="font-mono text-sm text-white/50">Select a protocol from the system grid database</div>
            </div>
          )}

          {/* --- LIVE BIOMETRIC PACER ENGAGEMENT RUNTIME CARD --- */}
          {isSimulating && activeProtocol && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <TacticalCard className="border border-[#00E676]/30 bg-black/90 p-5" glow>
                <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00E676] animate-pulse" />
                    <span className="font-mono text-xs text-[#00E676] font-bold tracking-[0.2em] uppercase">BIO-SYNC EXECUTION SYSTEM</span>
                  </div>
                  <div className="font-mono text-xs flex items-center gap-3 text-white/40">
                    <span className="flex items-center gap-1 text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full">
                      <Heart className="w-3.5 h-3.5 fill-current animate-bounce" />
                      {heartRate} BPM
                    </span>
                    <span>SESSION CODE: ACTIVE</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Left Column: Visual Breathe Circle */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center py-4">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      
                      {/* Paced Ripple animation inside ring */}
                      <motion.div 
                        className="absolute inset-0 rounded-full border border-dashed border-[#00E676]/35"
                        animate={{
                          rotate: 360,
                          scale: pacingPhase.includes('ECCENTRIC') ? [1, 1.15, 1] : 1
                        }}
                        transition={{
                          rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
                          scale: { duration: 2, repeat: Infinity }
                        }}
                      />

                      {/* Main Breath Ring Circle */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={pacingPhase}
                          initial={{ scale: 0.7, opacity: 0.8 }}
                          animate={{ 
                            scale: pacingPhase.includes('ECCENTRIC') ? 1.3 : pacingPhase.includes('HOLD') ? 1.1 : pacingPhase.includes('CONCENTRIC') ? 0.95 : 0.85, 
                            opacity: 1 
                          }}
                          exit={{ opacity: 0.5 }}
                          transition={{ duration: secondsRemaining, ease: "easeInOut" }}
                          className="w-28 h-28 rounded-full flex flex-col items-center justify-center text-center p-3"
                          style={{
                            background: pacingPhase.includes('ECCENTRIC') 
                              ? 'radial-gradient(circle, rgba(16,235,91,0.2) 0%, rgba(0,0,0,0.6) 80%)' 
                              : 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(0,0,0,0.7) 100%)',
                            border: `3px solid ${pacingPhase.includes('CONCENTRIC') ? '#00D4FF' : '#00E676'}`
                          }}
                        >
                          <div className="font-mono text-3xl font-black text-white leading-none">
                            {secondsRemaining}s
                          </div>
                          <span className="font-mono text-[7px] text-white/50 tracking-widest mt-1 uppercase">REMAINING STRETCH</span>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="font-mono text-xs font-bold text-center mt-3" style={{ color: pacingPhase.includes('CONCENTRIC') ? '#00D4FF' : '#00E676' }}>
                      {pacingPhase}
                    </div>
                  </div>

                  {/* Right Column: Steps & Sync actions */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="space-y-1">
                      <div className="font-mono text-[9px] text-white/40 uppercase">Active Activity Profile</div>
                      <div className="font-mono text-base font-bold text-white uppercase leading-none">
                        {activeProtocol.exercises[simExerciseIndex]?.name}
                      </div>
                      <p className="font-mono text-[9px] text-white/40 mt-1">
                        Use the pacing circles. Keep target resistance at {activeProtocol.exercises[simExerciseIndex]?.weight || "Bodyweight"}.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="font-mono text-[8px] text-white/40">ACTIVE PROGRESSION</div>
                        <div className="font-mono text-sm font-black text-white mt-0.5">
                          Set {simSetNumber} of {activeProtocol.exercises[simExerciseIndex]?.sets}
                        </div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="font-mono text-[8px] text-white/40">REST DECREED</div>
                        <div className="font-mono text-sm font-black text-[#00E676] mt-0.5">
                          {activeProtocol.exercises[simExerciseIndex]?.rest} Seconds
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={nextSimSet}
                        className="flex-1 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold font-mono text-xs uppercase rounded-xl flex items-center justify-center gap-1"
                      >
                        CHECK OFF SET & ADVANCE <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={stopSimulator}
                        className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase rounded-xl"
                      >
                        RESET
                      </button>
                    </div>
                  </div>
                </div>
              </TacticalCard>
            </motion.div>
          )}

        </div>

        {/* --- RIGHT HAND SECTION: SECTOR SCHEDULERS & SAVED REGISTERED PROTOCOLS --- */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Active Database Sync Sector */}
          <TacticalCard className="border border-white/5" noPadding>
            <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <div>
                <h4 className="font-mono text-xs font-black text-white tracking-widest uppercase flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" /> SYNC PROTOCOL GATEWAY
                </h4>
                <p className="font-mono text-[8px] text-white/30 mt-0.5 uppercase">
                  Cloud backup synchronization terminal
                </p>
              </div>

              {isAuthenticated ? (
                <button
                  onClick={syncWithCloudFirestore}
                  className="px-2.5 py-1 hover:bg-[#00E676]/15 text-[#00E676] hover:text-[#00c860] border border-[#00E676]/20 rounded font-mono text-[10px] font-bold flex items-center gap-1 transition-all"
                >
                  <RefreshCw className="w-3 h-3 animate-spin" /> BACK UP CLOUD
                </button>
              ) : (
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 font-mono text-[9px] text-white/40">
                  OFFLINE WORKSPACE
                </span>
              )}
            </div>

            <div className="p-4 space-y-3">
              {showSyncSuccessMsg && (
                <div className="p-3 bg-[#00E676]/10 border border-[#00E676]/20 rounded-xl font-mono text-[11px] text-[#00E676]">
                  ✔ Sync success. Cloud collections updated.
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-400/5 text-cyan-400 border border-cyan-400/10">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono text-[11px] font-bold text-white uppercase">Neural Grid Status</div>
                  <p className="font-mono text-[9px] text-white/40 leading-relaxed mt-0.5">
                    {isAuthenticated 
                      ? `AUTOSYNC ACTIVE // Authenticated as FitX Athlete. ${syncStatus === 'synced' ? "Data fully buffered." : "Sync pending changes."}`
                      : "Using local sandboxed data. Synchronized progress logging runs locally. Sign in to link cloud storage."
                    }
                  </p>
                </div>
              </div>
            </div>
          </TacticalCard>

          {/* Catalog Selection & Filter panel */}
          <TacticalCard className="border border-white/5 flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <div>
                <h4 className="font-mono text-xs font-black text-white tracking-widest uppercase">
                  ACTIVE REGISTRY
                </h4>
                <p className="font-mono text-[8px] text-white/30 truncate uppercase">
                  SIMATS SYSTEM SPLITS & BIO-SYNCS
                </p>
              </div>
              <button
                onClick={initBuildNew}
                className="px-2.5 py-1 bg-[#00E676]/10 border border-[#00E676]/20 rounded text-[#00E676] hover:bg-[#00E676]/20 font-mono text-[10px] font-bold flex items-center gap-1 transition-all"
              >
                <Plus className="w-3 h-3" /> DECLARE CODE
              </button>
            </div>

            {/* Program Filters */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {['All', 'Strength', 'Hypertrophy', 'Neural', 'Endurance', 'Recovery'].map((tab) => (
                <button
                  key={tab}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[9px] font-bold uppercase transition-all border ${
                    activeTab === tab
                      ? 'bg-cyan-400 border-cyan-400 text-black shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                      : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                  }`}
                  onClick={() => setActiveTab(tab as any)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Scrollable Protocols List */}
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {filteredProtocols.map((protocol) => {
                const isActive = activeProtocol?.id === protocol.id;
                const totalLoad = calculateTotalWorkload(protocol);

                return (
                  <div
                    key={protocol.id}
                    onClick={() => {
                      setActiveProtocol(protocol);
                      if (isSimulating) stopSimulator();
                    }}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all border text-left hover:scale-[1.01] ${
                      isActive
                        ? 'border-[#00E676] bg-[#00E676]/5 shadow-[0_0_15px_rgba(24,240,111,0.06)]'
                        : 'border-white/5 bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[8px] px-1.5 py-0.5 rounded text-white bg-white/10 uppercase tracking-widest leading-none">
                        {protocol.category}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[8px] text-white/40 uppercase">
                          {protocol.isCustom ? 'Custom System' : 'Core Preset'}
                        </span>
                        {protocol.isCustom && (
                          <button
                            onClick={(e) => deleteProtocol(protocol.id, e)}
                            className="p-1 hover:bg-rose-500/20 rounded text-rose-400 transition-all"
                            title="Delete custom protocol"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <h5 className="font-mono text-xs font-bold text-white tracking-wide uppercase line-clamp-1">
                      {protocol.name}
                    </h5>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/5">
                      <div className="flex items-center gap-3 font-mono text-[9px] text-white/40">
                        <span>{protocol.exercises.length} STEPS</span>
                        <span>•</span>
                        <span>TEMPO {protocol.tempo}</span>
                      </div>
                      
                      <div className="font-mono text-[9px] text-[#00E676] font-bold">
                        LOAD: {totalLoad > 0 ? `${totalLoad.toLocaleString()} lbs` : 'SPEED'}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredProtocols.length === 0 && (
                <div className="text-center py-10 font-mono text-xs text-white/40 border border-dashed border-white/5 rounded-2xl">
                  No matching configurations found.
                </div>
              )}
            </div>
          </TacticalCard>

        </div>

      </div>
    </div>
  );
}
