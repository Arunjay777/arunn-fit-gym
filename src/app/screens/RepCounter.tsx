import React, { useState, useRef, useEffect, useCallback } from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import ExercisePostureDemo, { getExerciseSkeleton } from '../components/ExercisePostureDemo';
import { 
  Camera, Play, Pause, RotateCcw, Activity, Sparkles, 
  Layers, Flame, Trophy, CheckCircle, Smartphone 
} from 'lucide-react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 25 Exercises Database matching user visual list
const EXERCISES_DATABASE = [
  // DAY 1: BACK & SHOULDERS
  { id: 'barbell_rows', name: 'Barbell Rows', day: 'Day 1', group: 'Back', category: 'Pulling', primaryMuscle: 'Lats & Upper Back', targetJoint: 'Elbow & Shoulder' },
  { id: 'pull_downs', name: 'Pull Downs', day: 'Day 1', group: 'Back', category: 'Pulling', primaryMuscle: 'Latissimus Dorsi', targetJoint: 'Elbow & Shoulder' },
  { id: 'dumbbell_rows', name: 'Dumbbell Rows', day: 'Day 1', group: 'Back', category: 'Pulling', primaryMuscle: 'Middle Back', targetJoint: 'Elbow' },
  { id: 'hyperextensions', name: 'Hyperextensions', day: 'Day 1', group: 'Back', category: 'Posterior', primaryMuscle: 'Erector Spinae & Glutes', targetJoint: 'Hip' },
  { id: 'barbell_overhead_presses', name: 'Barbell Overhead Presses', day: 'Day 1', group: 'Shoulders', category: 'Overhead Press', primaryMuscle: 'Anterior Deltoids & Triceps', targetJoint: 'Shoulder & Elbow' },
  { id: 'side_raises', name: 'Side Raises', day: 'Day 1', group: 'Shoulders', category: 'Shoulder Abduction', primaryMuscle: 'Lateral Deltoids', targetJoint: 'Shoulder' },
  { id: 'bent_rear_side_raises', name: 'Bent Rear Side Raises', day: 'Day 1', group: 'Shoulders', category: 'Rear Delt Fly', primaryMuscle: 'Posterior Deltoids', targetJoint: 'Shoulder' },
  { id: 'forward_raises', name: 'Forward Raises', day: 'Day 1', group: 'Shoulders', category: 'Shoulder Flexion', primaryMuscle: 'Anterior Deltoids', targetJoint: 'Shoulder' },

  // DAY 3: LEGS & ABS
  { id: 'barbell_squats', name: 'Barbell Squats', day: 'Day 3', group: 'Legs', category: 'Squat', primaryMuscle: 'Quadriceps, Glutes & Hamstrings', targetJoint: 'Knee & Hip' },
  { id: 'leg_presses', name: 'Leg Presses', day: 'Day 3', group: 'Legs', category: 'Squat', primaryMuscle: 'Quadriceps & Glutes', targetJoint: 'Knee & Hip' },
  { id: 'leg_extensions', name: 'Leg Extensions', day: 'Day 3', group: 'Legs', category: 'Single Joint Leg', primaryMuscle: 'Quadriceps', targetJoint: 'Knee' },
  { id: 'legged_dead_lifts', name: 'Legged Dead Lifts', day: 'Day 3', group: 'Legs', category: 'Posterior', primaryMuscle: 'Hamstrings & Glutes', targetJoint: 'Hip' },
  { id: 'seated_calf_raises', name: 'Seated Calf Raises', day: 'Day 3', group: 'Legs', category: 'Calf Press', primaryMuscle: 'Soleus (Calves)', targetJoint: 'Ankle' },
  { id: 'standing_calf_raises', name: 'Standing Calf Raises', day: 'Day 3', group: 'Legs', category: 'Calf Press', primaryMuscle: 'Gastrocnemius (Calves)', targetJoint: 'Ankle' },
  { id: 'abdominal_crunches', name: 'Abdominal Crunches', day: 'Day 3', group: 'Abs', category: 'Flexion', primaryMuscle: 'Rectus Abdominis', targetJoint: 'Spine' },
  { id: 'leg_raises', name: 'Leg Raises', day: 'Day 3', group: 'Abs', category: 'Leg Raise', primaryMuscle: 'Lower Abs & Hip Flexors', targetJoint: 'Hip' },

  // DAY 5: CHEST & ARMS
  { id: 'bench_presses', name: 'Bench Presses', day: 'Day 5', group: 'Chest', category: 'Pressing', primaryMuscle: 'Pectoralis Major & Triceps', targetJoint: 'Shoulder & Elbow' },
  { id: 'incline_bench_presses', name: 'Incline Bench Presses', day: 'Day 5', group: 'Chest', category: 'Pressing', primaryMuscle: 'Upper Pectorals', targetJoint: 'Shoulder & Elbow' },
  { id: 'dumbbell_presses', name: 'Dumbbell Presses', day: 'Day 5', group: 'Chest', category: 'Pressing', primaryMuscle: 'Chest & Shoulders', targetJoint: 'Shoulder & Elbow' },
  { id: 'incline_dumbbell_flyes', name: 'Incline Dumbbell Flyes', day: 'Day 5', group: 'Chest', category: 'Chest Fly', primaryMuscle: 'Pectoralis Outer Fibers', targetJoint: 'Shoulder' },
  { id: 'tricep_extensions', name: 'Tricep Extensions', day: 'Day 5', group: 'Arms', category: 'Elbow Extension', primaryMuscle: 'Triceps Brachii', targetJoint: 'Elbow' },
  { id: 'triceps_pull_downs', name: 'Triceps Pull Downs', day: 'Day 5', group: 'Arms', category: 'Elbow Extension', primaryMuscle: 'Triceps Lateral Head', targetJoint: 'Elbow' },
  { id: 'barbell_curls', name: 'Barbell Curls', day: 'Day 5', group: 'Arms', category: 'Elbow Flexion', primaryMuscle: 'Biceps Brachii', targetJoint: 'Elbow' },
  { id: 'preacher_curls', name: 'Preacher Curls', day: 'Day 5', group: 'Arms', category: 'Elbow Flexion', primaryMuscle: 'Biceps Short Head', targetJoint: 'Elbow' },
  { id: 'hammer_curls', name: 'Hammer Curls', day: 'Day 5', group: 'Arms', category: 'Elbow Flexion', primaryMuscle: 'Brachialis & Brachioradialis', targetJoint: 'Elbow' }
];

const detectorConfig = {
  runtime: 'tfjs' as const,
  modelType: 'full' as const,
};

export default function RepCounter() {
  const [isActive, setIsActive] = useState(false);
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(0);
  const [status, setStatus] = useState<'neutral' | 'down' | 'up'>('neutral');
  const [feedback, setFeedback] = useState<string[]>(["Neural link ready. Select drill target."]);
  
  // Exercise states
  const [selectedDay, setSelectedDay] = useState<'Day 1' | 'Day 3' | 'Day 5'>('Day 1');
  const [selectedExId, setSelectedExId] = useState<string>('barbell_rows');
  const activeEx = EXERCISES_DATABASE.find(ex => ex.id === selectedExId) || EXERCISES_DATABASE[0];

  // Dynamic animation values
  const [pacerProgress, setPacerProgress] = useState(0);
  const [tempoState, setTempoState] = useState<'concentric' | 'hold' | 'eccentric' | 'pause'>('pause');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef = useRef<poseDetection.PoseDetector | null>(null);
  const requestRef = useRef<number>(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);

  // Real-time joint diagnostic states
  const [liveJointAngle, setLiveJointAngle] = useState<number | null>(null);
  const [liveJointName, setLiveJointName] = useState<string>('');

  // Use refs in detection loop to avoid starting/stopping frame loops needlessly
  const statusRef = useRef<'neutral' | 'down' | 'up'>('neutral');
  const isActiveRef = useRef(false);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  // Initializing audio chirp synthesizer
  const triggerBeep = () => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.connect(gain);
      gain.connect(context.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, context.currentTime);
      gain.gain.setValueAtTime(0.06, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.15);
      
      osc.start();
      osc.stop(context.currentTime + 0.15);
    } catch (e) {
      console.log("Synthesizer audio bypassed:", e);
    }
  };

  const registerVerifiedRep = useCallback(() => {
    setReps(r => {
      const nextReps = r + 1;
      
      // Complete set alerts (10 reps per set)
      if (nextReps > 0 && nextReps % 10 === 0) {
        setSets(s => s + 1);
        setFeedback(prev => [`🎉 [CAMERA] SET COMPLETED! Break for 45s muscle rest.`, ...prev.slice(0, 4)]);
      } else {
        setFeedback(prev => [`[CAMERA] Verified rep ${nextReps} logged! Keep moving.`, ...prev.slice(0, 4)]);
      }

      triggerBeep();
      return nextReps;
    });
  }, []);

  // Initialize TensorFlow and pose estimator
  useEffect(() => {
    async function initAI() {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.BlazePose,
          detectorConfig
        );
        detectorRef.current = detector;
        setIsModelLoading(false);
        setFeedback(prev => ["TensorFlow BlazePose engine completed boot sync.", ...prev]);
      } catch (error) {
        console.error("AI Initialization failed:", error);
        setFeedback(prev => ["WebGL fault. Downgrading to static CPU backend...", ...prev]);
        try {
          await tf.setBackend('cpu');
          const detector = await poseDetection.createDetector(
            poseDetection.SupportedModels.BlazePose,
            detectorConfig
          );
          detectorRef.current = detector;
          setIsModelLoading(false);
        } catch (innerError) {
          setFeedback(prev => ["Core AI disabled. Manual override controls fully interactive.", ...prev]);
          setIsModelLoading(false);
        }
      }
    }
    initAI();
  }, []);

  const calculateAngle = (a: any, b: any, c: any) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
  };

  // Draw detected pose lines onto User Camera stream
  const drawPose = useCallback((poses: poseDetection.Pose[]) => {
    const canvas = canvasRef.current;
    if (!canvas || !videoRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    poses.forEach((pose) => {
      // Keypoints
      pose.keypoints.filter(kp => (kp.score ?? 0) > 0.45).forEach((kp) => {
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#00D4FF';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Bio skeletal rigs
      const connections = [
        ['left_shoulder', 'right_shoulder'],
        ['left_shoulder', 'left_elbow'],
        ['left_elbow', 'left_wrist'],
        ['right_shoulder', 'right_elbow'],
        ['right_elbow', 'right_wrist'],
        ['left_shoulder', 'left_hip'],
        ['right_shoulder', 'right_hip'],
        ['left_hip', 'right_hip'],
        ['left_hip', 'left_knee'],
        ['left_knee', 'left_ankle'],
        ['right_hip', 'right_knee'],
        ['right_knee', 'right_ankle'],
      ];

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.7)';
      
      connections.forEach(([s, e]) => {
        const start = pose.keypoints.find(kp => kp.name === s);
        const end = pose.keypoints.find(kp => kp.name === e);
        if (start && end && (start.score ?? 0) > 0.45 && (end.score ?? 0) > 0.45) {
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        }
      });
    });
  }, []);

  // Loop telemetry detections
  const detect = useCallback(async () => {
    if (!cameraActive) return;

    if (detectorRef.current && videoRef.current) {
      try {
        const poses = await detectorRef.current.estimatePoses(videoRef.current);
        drawPose(poses);
        
        if (poses.length > 0) {
          const pose = poses[0];
          let angle = 180;
          let jointLabel = "";

          // Select appropriate biometric coordinates based on the muscle group
          const muscleLower = activeEx.primaryMuscle.toLowerCase();
          const targetLower = activeEx.targetJoint.toLowerCase();

          if (targetLower.includes('knee') || muscleLower.includes('quad') || muscleLower.includes('glute') || muscleLower.includes('hamstring')) {
            const hip = pose.keypoints.find(k => k.name === 'left_hip' || k.name === 'right_hip');
            const knee = pose.keypoints.find(k => k.name === 'left_knee' || k.name === 'right_knee');
            const ankle = pose.keypoints.find(k => k.name === 'left_ankle' || k.name === 'right_ankle');
            if (hip && knee && ankle && (hip.score ?? 0) > 0.4 && (knee.score ?? 0) > 0.4 && (ankle.score ?? 0) > 0.4) {
              angle = calculateAngle(hip, knee, ankle);
              jointLabel = "Knee Extension";
            }
          } else if (targetLower.includes('elbow') || muscleLower.includes('bicep') || muscleLower.includes('tricep') || muscleLower.includes('lat') || muscleLower.includes('back')) {
            const shoulder = pose.keypoints.find(k => k.name === 'left_shoulder' || k.name === 'right_shoulder');
            const elbow = pose.keypoints.find(k => k.name === 'left_elbow' || k.name === 'right_elbow');
            const wrist = pose.keypoints.find(k => k.name === 'left_wrist' || k.name === 'right_wrist');
            if (shoulder && elbow && wrist && (shoulder.score ?? 0) > 0.4 && (elbow.score ?? 0) > 0.4 && (wrist.score ?? 0) > 0.4) {
              angle = calculateAngle(shoulder, elbow, wrist);
              jointLabel = "Elbow Flexion";
            }
          } else {
            // Standard Spine / Hip Core flexion
            const shoulder = pose.keypoints.find(k => k.name === 'left_shoulder' || k.name === 'right_shoulder');
            const hip = pose.keypoints.find(k => k.name === 'left_hip' || k.name === 'right_hip');
            const knee = pose.keypoints.find(k => k.name === 'left_knee' || k.name === 'right_knee');
            if (shoulder && hip && knee && (shoulder.score ?? 0) > 0.4 && (hip.score ?? 0) > 0.4 && (knee.score ?? 0) > 0.4) {
              angle = calculateAngle(shoulder, hip, knee);
              jointLabel = "Hip Flexion";
            }
          }

          if (jointLabel) {
            setLiveJointAngle(Math.round(angle));
            setLiveJointName(jointLabel);

            // Active tracking logic state machine (rep registered on transition)
            if (isActiveRef.current) {
              if (jointLabel === "Knee Extension") {
                if (angle < 115 && statusRef.current !== 'down') {
                  setStatus('down');
                } else if (angle > 150 && statusRef.current === 'down') {
                  setStatus('up');
                  registerVerifiedRep();
                }
              } else if (jointLabel === "Elbow Flexion") {
                if (angle < 95 && statusRef.current !== 'down') {
                  setStatus('down');
                } else if (angle > 145 && statusRef.current === 'down') {
                  setStatus('up');
                  registerVerifiedRep();
                }
              } else {
                if (angle < 120 && statusRef.current !== 'down') {
                  setStatus('down');
                } else if (angle > 155 && statusRef.current === 'down') {
                  setStatus('up');
                  registerVerifiedRep();
                }
              }
            }
          } else {
            setLiveJointAngle(null);
            setLiveJointName("");
          }
        } else {
          setLiveJointAngle(null);
          setLiveJointName("");
        }
      } catch (e) {
        console.error("TF frame dropped:", e);
      }
    }
    requestRef.current = requestAnimationFrame(detect);
  }, [cameraActive, activeEx, registerVerifiedRep, drawPose]);

  // Handle active video loop rendering
  useEffect(() => {
    if (cameraActive) {
      requestRef.current = requestAnimationFrame(detect);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [cameraActive, detect]);

  // Turn on camera feed
  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setFeedback(prev => ["Webcam stream not supported in this environment. Toggle manual logger below.", ...prev]);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current && canvasRef.current) {
            const width = videoRef.current.videoWidth;
            const height = videoRef.current.videoHeight;
            canvasRef.current.width = width;
            canvasRef.current.height = height;
            videoRef.current.width = width;
            videoRef.current.height = height;
          }
          setCameraActive(true);
          setFeedback(prev => ["Unified optic linkage logged. Bio-tracking is ready.", ...prev]);
        };
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      setFeedback(prev => ["Camera permission blocked or unavailable. Toggle manual input override.", ...prev]);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setLiveJointAngle(null);
    setLiveJointName("");
  };

  // Close camera on component leave
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Chronological pace loop for the posture demonstrator (COACH SHOWS FORM, DOES NOT INCREMENT AUTOMATIC REPS CORRECTS)
  useEffect(() => {
    if (!isActive) {
      return;
    }

    let startTime = Date.now();
    const repDuration = 4000; // 4 seconds per coaching guide rotation loop
    
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) % repDuration;
      
      // Posture moves: 0 to 1 back to 0
      let currentProgress = 0;
      let phase: 'concentric' | 'hold' | 'eccentric' | 'pause' = 'pause';

      if (elapsed < 1300) {
        currentProgress = elapsed / 1300;
        phase = 'concentric';
      } else if (elapsed < 1800) {
        currentProgress = 1;
        phase = 'hold';
      } else if (elapsed < 3700) {
        currentProgress = 1 - (elapsed - 1800) / 1900;
        phase = 'eccentric';
      } else {
        currentProgress = 0;
        phase = 'pause';
      }

      setPacerProgress(currentProgress);
      setTempoState(phase);
    }, 25);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleStartSession = async () => {
    if (isActive) {
      setIsActive(false);
    } else {
      setIsActive(true);
      // Let user start camera if not started yet
      if (!cameraActive) {
        await startCamera();
      }
    }
  };

  const handleReset = () => {
    setReps(0);
    setSets(0);
    setIsActive(false);
    setPacerProgress(0);
    setTempoState('pause');
    setLiveJointAngle(null);
    setLiveJointName("");
    setFeedback(["Session counters reset successfully."]);
  };

  const activeDayExercises = EXERCISES_DATABASE.filter(ex => ex.day === selectedDay);

  return (
    <div className="min-h-screen p-4 lg:p-8 bg-black text-white">
      <TacticalHeader title="NEURAL REP SYNC" subtitle="BIOMETRIC MOTION ANALYSIS v2.0" />

      {/* 25-EXERCISES DAY SEGMENTS SELECTION PANEL */}
      <div className="mb-6 p-4 bg-zinc-950/80 border border-white/5 rounded-2xl">
        <h3 className="font-mono text-xs text-white/40 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-bold">
          <Layers className="w-4 h-4 text-cyan-400" />
          CHOOSE ATHLETE DRILLED SYSTEM
        </h3>
        
        {/* Day Tabs */}
        <div className="flex gap-2 max-w-full overflow-x-auto pb-2 mb-4 border-b border-white/5">
          {(['Day 1', 'Day 3', 'Day 5'] as const).map(day => (
            <button
              key={day}
              type="button"
              onClick={() => {
                setSelectedDay(day);
                const firstEx = EXERCISES_DATABASE.find(e => e.day === day);
                if (firstEx) setSelectedExId(firstEx.id);
              }}
              className={cn(
                "px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 cursor-pointer",
                selectedDay === day 
                  ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" 
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              )}
            >
              {day === 'Day 1' && "📅 DAY 1: BACK & SHOULDERS"}
              {day === 'Day 3' && "📅 DAY 3: LEGS & ABS"}
              {day === 'Day 5' && "📅 DAY 5: CHEST & ARMS"}
            </button>
          ))}
        </div>

        {/* Exercises select grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {activeDayExercises.map(ex => (
            <button
              key={ex.id}
              type="button"
              onClick={() => {
                setSelectedExId(ex.id);
                setFeedback(prev => [`Target changed to: ${ex.name.toUpperCase()}`, ...prev.slice(0, 3)]);
              }}
              className={cn(
                "p-3 rounded-xl border font-mono text-[11px] font-medium leading-tight text-center transition-all cursor-pointer active:scale-95 flex flex-col justify-between min-h-[70px]",
                selectedExId === ex.id
                  ? "bg-cyan-500/15 border-cyan-400 text-cyan-400"
                  : "bg-zinc-900/40 border-white/5 text-white/55 hover:bg-zinc-900/80 hover:text-white"
              )}
            >
              <div className="text-left py-0.5 text-[8px] text-white/30 uppercase font-semibold">
                {ex.group}
              </div>
              <div className="text-center font-bold font-sans">
                {ex.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN VIEWPORT SPLIT SENSORS PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-6">
        
        {/* Left Side: LIVE CAMERA FEED / CORE Telemetry */}
        <div className="lg:col-span-6 space-y-4">
          <TacticalCard noPadding className="relative overflow-hidden group border-cyan-500/20 bg-[#050505]">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[360px] sm:h-[450px]">
              
              {/* Always rendered in DOM to guarantee ref presence */}
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className={cn(
                  "w-full h-full object-cover -scale-x-100 transition-opacity duration-300",
                  cameraActive ? "opacity-100" : "opacity-0 absolute"
                )} 
              />
              <canvas 
                ref={canvasRef} 
                className={cn(
                  "absolute inset-0 w-full h-full pointer-events-none object-cover -scale-x-100 transition-opacity duration-300",
                  cameraActive ? "opacity-100" : "opacity-0"
                )}
              />

              {!cameraActive ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/50 backdrop-blur-sm gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startCamera} 
                    disabled={isModelLoading}
                    className="flex flex-col items-center gap-4 lg:gap-6 p-8 lg:p-10 rounded-[30px] transition-all bg-black/40 border border-cyan-500/30 hover:border-cyan-400 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                      <Camera className="w-6 h-6 text-cyan-400" />
                    </div>
                    <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-400 text-center">
                      {isModelLoading ? 'INITIALIZING ENGINE...' : 'ACTIVATE BIOMETRIC CAMERA'}
                    </span>
                  </motion.button>
                  <span className="text-white/40 text-[10px] font-mono uppercase tracking-wide">
                    Or toggle manual registration keys below
                  </span>
                </div>
              ) : (
                <>
                  {/* Digital HUD Overlay */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden p-4">
                    <div className="absolute top-0 left-0 w-full h-full border-[10px] border-cyan-500/5" />
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2.5 bg-black/80 backdrop-blur-md border border-cyan-500/20 px-3.5 py-2 rounded-xl w-fit">
                        <Activity className="text-cyan-400 animate-pulse w-4 h-4" />
                        <div>
                          <div className="text-[8px] text-cyan-400/60 uppercase tracking-widest font-bold">BIOMETRIC TRACKING</div>
                          <div className="text-xs font-mono font-light tracking-tight">ACTIVE DEPTH MESH LINK</div>
                        </div>
                      </div>
                    </div>

                    {/* Camera Status label bottom */}
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-black/80 backdrop-blur-md border border-cyan-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-mono text-[9px] uppercase font-bold tracking-wider text-emerald-400">
                          BIOMETRIC TRANSMITTER LIVE
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </TacticalCard>
        </div>

        {/* Right Side: POSTURES DEMO MOVEMENT FRAME */}
        <div className="lg:col-span-6">
          <TacticalCard className="border-cyan-500/20 bg-zinc-950/80 h-full flex flex-col justify-between">
            <ExercisePostureDemo 
              exerciseId={activeEx.id}
              exerciseName={activeEx.name}
              progress={pacerProgress}
              tempoState={tempoState}
              reps={reps}
              sets={sets}
            />
          </TacticalCard>
        </div>

      </div>

      {/* METRIC CONTROLS PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Buttons Control Zone */}
        <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Start Session */}
          <button 
            type="button"
            onClick={handleStartSession} 
            className={cn(
              "p-3.5 rounded-xl font-mono text-xs font-extrabold flex flex-col items-center justify-center gap-2 transition-all text-center leading-tight active:scale-95 cursor-pointer min-h-[60px]",
              isActive 
                ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" 
                : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
            )}
          >
            {isActive ? <Pause size={14} /> : <Play size={14} />}
            <span>{isActive ? 'PAUSE COACH' : 'START TEMPO'}</span>
          </button>
          
          {/* Emergency Camera switch */}
          <button 
            type="button"
            onClick={() => {
              if (cameraActive) {
                stopCamera();
                setFeedback(prev => ["Optic camera link offline. Manual log activated.", ...prev.slice(0, 4)]);
              } else {
                startCamera();
              }
            }}
            className={cn(
              "p-3.5 rounded-xl font-mono text-xs font-extrabold flex flex-col items-center justify-center gap-2 transition-all text-center leading-tight active:scale-95 cursor-pointer min-h-[60px]",
              cameraActive 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20" 
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
            )}
          >
            <Camera size={14} />
            <span>{cameraActive ? 'CAMERA: ON' : 'CAMERA: OFF'}</span>
          </button>

          {/* +1 Manual rep log override */}
          <button 
            type="button"
            onClick={() => {
              setReps(r => {
                const nextReps = r + 1;
                if (nextReps > 0 && nextReps % 10 === 0) {
                  setSets(s => s + 1);
                  setFeedback(prev => [`🎉 [MANUAL] SET COMPLETED! break for 45s recovery.`, ...prev.slice(0, 4)]);
                } else {
                  setFeedback(prev => [`[MANUAL] Rep ${nextReps} logged manually.`, ...prev.slice(0, 4)]);
                }
                triggerBeep();
                return nextReps;
              });
            }}
            className="p-3.5 rounded-xl font-mono text-xs font-extrabold bg-[#FFD600]/15 hover:bg-[#FFD600]/25 text-[#FFD600] border border-[#FFD600]/30 transition-all text-center leading-tight active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[60px]"
          >
            <Sparkles size={14} className="text-[#FFD600] animate-bounce" />
            <span>+1 MANUAL REP</span>
          </button>

          {/* Hard reset tracker */}
          <button 
            type="button"
            onClick={handleReset} 
            className="p-3.5 rounded-xl font-mono text-xs font-extrabold border border-white/5 hover:border-rose-500/40 hover:text-rose-400 text-white/40 flex flex-col items-center justify-center gap-2 active:scale-95 cursor-pointer min-h-[60px] text-center"
          >
            <RotateCcw size={14} />
            <span>RESET DRILL</span>
          </button>
        </div>

        {/* Counter Displays */}
        <div className="md:col-span-4 bg-[#111111] border border-white/5 rounded-2xl py-3.5 flex items-center justify-around h-full">
          <div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold text-center">TOTAL REPS</div>
            <div className="text-3xl font-mono font-bold text-cyan-400 text-center">{reps}</div>
          </div>
          <div className="w-[1px] h-10 bg-white/5" />
          <div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold text-center">CURRENT SET</div>
            <div className="text-3xl font-mono font-bold text-green-400 text-center">{sets + 1}</div>
          </div>
        </div>

      </div>

      {/* FEEDBACK ENGINE & METRIC DIAGNOSTICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        
        {/* Left: Feed updates */}
        <div className="md:col-span-2">
          <TacticalCard className="bg-gradient-to-br from-zinc-900 to-black border-cyan-500/10 p-5 h-full">
            <h3 className="text-xs font-mono text-cyan-400 tracking-[0.2em] mb-4 flex items-center gap-2 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              AI FEEDBACK ENGINE
            </h3>
            <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1">
              {feedback.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={`${msg}-${i}`} 
                  className={cn(
                    "p-3 rounded-xl font-mono text-xs border border-white/5 flex items-start gap-3",
                    i === 0 ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "bg-white/5 text-white/30"
                  )}
                >
                  <span className="opacity-40">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                  <span>{msg}</span>
                </motion.div>
              ))}
            </div>
          </TacticalCard>
        </div>

        {/* Right: Technical diagnostics logs */}
        <div>
          <TacticalCard className="h-full">
            <h3 className="text-xs font-mono font-bold tracking-widest text-white/40 mb-3">BIO DIAGNOSTICS</h3>
            <div className="space-y-2.5 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60">Biometric Joint</span>
                <span className="text-[#00E676] font-bold">{liveJointName || "None Detected"}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60">Live Angle Stretch</span>
                <span className="text-cyan-400 font-bold">{liveJointAngle !== null ? `${liveJointAngle}°` : "---"}</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-[#00E676] transition-all duration-150" 
                  style={{ width: `${liveJointAngle ? Math.max(0, Math.min(100, (liveJointAngle / 180) * 100)) : 0}%` }} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <div className="text-[9px] text-white/40 uppercase font-bold mb-0.5">Frame Latency</div>
                  <div className="text-xs text-white">16ms</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <div className="text-[9px] text-white/40 uppercase font-bold mb-0.5">Focus Tracking</div>
                  <div className="text-xs text-white">{cameraActive ? "12 / 12 Key" : "0 Key"}</div>
                </div>
              </div>
            </div>
          </TacticalCard>
        </div>

      </div>

    </div>
  );
}
