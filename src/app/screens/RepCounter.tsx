import React, { useState, useRef, useEffect, useCallback } from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Camera, Play, Pause, RotateCcw, Activity } from 'lucide-react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import { motion } from "motion/react";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Configure the detector
const detectorConfig = {
  runtime: 'tfjs' as const,
  modelType: 'full' as const,
};

export default function RepCounter() {
  const [isActive, setIsActive] = useState(false);
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(0);
  const [status, setStatus] = useState<'neutral' | 'down' | 'up'>('neutral');
  const [feedback, setFeedback] = useState<string[]>(["Waiting for camera..."]);
  const [exercise, setExercise] = useState<'squat' | 'curl'>('squat');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef = useRef<poseDetection.PoseDetector | null>(null);
  const requestRef = useRef<number>(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [useSimulator, setUseSimulator] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);

  // Initialize TF and Model
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
        setFeedback(["Sync link established. Optimizing neural mesh..."]);
      } catch (error) {
        console.error("AI Initialization failed:", error);
        setFeedback(["Hardware acceleration error. Reverting to CPU mode..."]);
        try {
          await tf.setBackend('cpu');
          const detector = await poseDetection.createDetector(
            poseDetection.SupportedModels.BlazePose,
            detectorConfig
          );
          detectorRef.current = detector;
          setIsModelLoading(false);
        } catch (innerError) {
          setFeedback(["Critical Error: Neural Core failed to initialize."]);
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

  const drawPose = useCallback((poses: poseDetection.Pose[]) => {
    const canvas = canvasRef.current;
    if (!canvas || !videoRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    poses.forEach((pose) => {
      // Draw keypoints
      pose.keypoints.filter(kp => (kp.score ?? 0) > 0.5).forEach((kp) => {
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#00D4FF';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.stroke();
      });

      // Simple skeleton drawing
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

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
      
      connections.forEach(([s, e]) => {
        const start = pose.keypoints.find(kp => kp.name === s);
        const end = pose.keypoints.find(kp => kp.name === e);
        if (start && end && (start.score ?? 0) > 0.5 && (end.score ?? 0) > 0.5) {
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        }
      });

      // Counting Logic
      if (isActive) {
        if (exercise === 'squat') {
          const hip = pose.keypoints.find(k => k.name === 'left_hip');
          const knee = pose.keypoints.find(k => k.name === 'left_knee');
          const ankle = pose.keypoints.find(k => k.name === 'left_ankle');

          if (hip && knee && ankle && (hip.score ?? 0) > 0.5 && (knee.score ?? 0) > 0.5 && (ankle.score ?? 0) > 0.5) {
            const angle = calculateAngle(hip, knee, ankle);
            if (angle > 160) {
              if (status === 'down') {
                setReps(r => r + 1);
                setFeedback(prev => ["Squat: Good rep!", ...prev.slice(0, 2)]);
              }
              setStatus('up');
            } else if (angle < 90) {
              setStatus('down');
            }
          }
        } else if (exercise === 'curl') {
          const shoulder = pose.keypoints.find(k => k.name === 'left_shoulder');
          const elbow = pose.keypoints.find(k => k.name === 'left_elbow');
          const wrist = pose.keypoints.find(k => k.name === 'left_wrist');

          if (shoulder && elbow && wrist && (shoulder.score ?? 0) > 0.5 && (elbow.score ?? 0) > 0.5 && (wrist.score ?? 0) > 0.5) {
            const angle = calculateAngle(shoulder, elbow, wrist);
            if (angle < 45) {
              if (status === 'down') {
                setReps(r => r + 1);
                setFeedback(prev => ["Curl: Good rep!", ...prev.slice(0, 2)]);
              }
              setStatus('up');
            } else if (angle > 160) {
              setStatus('down');
            }
          }
        }
      }
    });
  }, [isActive, status, exercise]);

  const startSimulation = () => {
    setUseSimulator(true);
    setCameraActive(true);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 640;
      canvas.height = 480;
    }
    setFeedback(["Simulation node activated. Streaming artificial telemetry..."]);
  };

  const detect = useCallback(async () => {
    if (useSimulator && cameraActive) {
      const t = Date.now() / 1000;
      const motionPercent = (Math.sin(t * 1.5) + 1) / 2; // oscillates 0 to 1
      
      let keypoints: poseDetection.Keypoint[] = [];
      if (exercise === 'squat') {
        const hipX = 150 - motionPercent * 20;
        const hipY = 220 + motionPercent * 70;
        const kneeX = 150 + motionPercent * 25;
        const kneeY = 300 + motionPercent * 40;
        const ankleX = 150;
        const ankleY = 380;
        
        keypoints = [
          { name: 'left_shoulder', x: 150, y: 140, score: 0.9 },
          { name: 'right_shoulder', x: 230, y: 140, score: 0.9 },
          { name: 'left_hip', x: hipX, y: hipY, score: 0.9 },
          { name: 'left_knee', x: kneeX, y: kneeY, score: 0.9 },
          { name: 'left_ankle', x: ankleX, y: ankleY, score: 0.9 },
        ];
      } else {
        const wristX = 150 + motionPercent * 25;
        const wristY = 320 - motionPercent * 150;
        const elbowX = 150;
        const elbowY = 240;
        
        keypoints = [
          { name: 'left_shoulder', x: 150, y: 160, score: 0.9 },
          { name: 'left_elbow', x: elbowX, y: elbowY, score: 0.9 },
          { name: 'left_wrist', x: wristX, y: wristY, score: 0.9 },
        ];
      }
      
      const simPose: poseDetection.Pose = {
        keypoints,
        score: 0.95
      };
      
      const canvas = canvasRef.current;
      if (canvas) {
        const scaleX = canvas.width / 300;
        const scaleY = canvas.height / 400;
        simPose.keypoints.forEach(kp => {
          kp.x = kp.x * scaleX;
          kp.y = kp.y * scaleY;
        });
      }
      
      drawPose([simPose]);
    } else if (detectorRef.current && videoRef.current && cameraActive) {
      const poses = await detectorRef.current.estimatePoses(videoRef.current);
      drawPose(poses);
    }
    requestRef.current = requestAnimationFrame(detect);
  }, [cameraActive, useSimulator, exercise, drawPose]);

  useEffect(() => {
    if (cameraActive) {
      requestRef.current = requestAnimationFrame(detect);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [cameraActive, detect]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setFeedback(["Error: Camera API not supported. Activating Simulation mode..."]);
      startSimulation();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
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
          setUseSimulator(false);
        };
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      setFeedback(["Error: Camera access denied. Activating Simulation mode..."]);
      startSimulation();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
    setUseSimulator(false);
  };

  const handleReset = () => {
    setReps(0);
    setSets(0);
    setIsActive(false);
    setFeedback(["Session reset."]);
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 bg-black text-white">
      <TacticalHeader title="NEURAL REP SYNC" subtitle="BIOMETRIC MOTION ANALYSIS v2.0" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          <TacticalCard noPadding className="relative overflow-hidden group border-cyan-500/20">
            <div className="relative bg-[#050505] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl h-[400px] sm:h-[500px] lg:h-[540px]">
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
                    className="flex flex-col items-center gap-4 lg:gap-6 p-8 lg:p-12 rounded-[30px] lg:rounded-[40px] transition-all bg-black/40 border border-cyan-500/30 hover:border-cyan-400 group"
                  >
                    <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                      <Camera className="w-6 h-6 lg:w-10 lg:h-10 text-cyan-400" />
                    </div>
                    <span className="font-mono text-[10px] lg:text-sm tracking-[0.2em] lg:tracking-[0.3em] text-cyan-400 text-center">
                      {isModelLoading ? 'INITIALIZING NEURAL NET...' : 'ACTIVATE OPTIC SENSORS'}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startSimulation}
                    className="px-6 py-3 rounded-xl border border-teal-500/30 font-mono text-[10px] sm:text-xs text-teal-400 bg-teal-500/5 hover:bg-teal-500/20 transition-all uppercase tracking-widest cursor-pointer flex items-center gap-2"
                  >
                    <span>⚡ ACTIVATE SIMULATOR FALLBACK</span>
                  </motion.button>
                </div>
              ) : (
                <>
                  {/* Digital HUD Overlay */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden p-4 lg:p-8">
                    <div className="absolute top-0 left-0 w-full h-full border-[10px] lg:border-[20px] border-cyan-500/5" />
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md border border-cyan-500/20 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl w-fit">
                        <Activity className="text-cyan-400 animate-pulse w-5 h-5 lg:w-6 lg:h-6" />
                        <div>
                          <div className="text-[10px] lg:text-xs text-cyan-400/60 uppercase tracking-widest font-bold">Current Exercise</div>
                          <div className="text-base lg:text-xl font-light tracking-tight">{exercise === 'squat' ? 'SQUAT PROTOCOL' : 'BICEP CURL PROTOCOL'}</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setExercise('squat')}
                          className={cn(
                            "pointer-events-auto px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg lg:rounded-xl font-mono text-[10px] lg:text-xs tracking-widest transition-all",
                            exercise === 'squat' ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "bg-black/60 text-cyan-400 border border-cyan-500/20"
                          )}
                        >
                          SQUAT
                        </button>
                        <button 
                          onClick={() => setExercise('curl')}
                          className={cn(
                            "pointer-events-auto px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg lg:rounded-xl font-mono text-[10px] lg:text-xs tracking-widest transition-all",
                            exercise === 'curl' ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "bg-black/60 text-cyan-400 border border-cyan-500/20"
                          )}
                        >
                          CURL
                        </button>
                      </div>
                    </div>

                    <div className="absolute bottom-4 lg:bottom-8 right-4 lg:right-8">
                      <div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 px-6 lg:px-10 py-4 lg:py-6 rounded-2xl lg:rounded-3xl text-center min-w-[120px] lg:min-w-[160px]">
                        <div className="text-[10px] lg:text-xs text-cyan-400/60 uppercase tracking-widest font-bold mb-1">Status</div>
                        <div className={cn(
                          "text-xl lg:text-2xl font-mono font-bold uppercase tracking-tighter",
                          status === 'down' ? "text-orange-400" : "text-green-400"
                        )}>
                          {status}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </TacticalCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            <button 
              onClick={() => setIsActive(!isActive)} 
              disabled={!cameraActive}
              className={cn(
                "py-4 lg:py-5 rounded-2xl lg:rounded-3xl font-mono font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-30",
                isActive ? "bg-white/10 text-white border border-white/10" : "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:bg-cyan-400"
              )}
            >
              {isActive ? <Pause size={18} /> : <Play size={18} />}
              {isActive ? 'PAUSE MONITORING' : 'START SESSION'}
            </button>
            <button 
              onClick={handleReset} 
              className="py-4 lg:py-5 rounded-2xl lg:rounded-3xl font-mono font-bold border border-white/10 hover:border-rose-500/50 hover:text-rose-400 transition-all text-white/40 flex items-center justify-center gap-3"
            >
              <RotateCcw size={18} />
              HARD RESET
            </button>
            <div className="bg-[#111] border border-white/5 rounded-2xl lg:rounded-3xl flex items-center justify-around px-4 py-3 sm:py-0 sm:col-span-2 lg:col-span-1">
               <div>
                 <div className="text-[8px] lg:text-[9px] text-white/30 uppercase tracking-widest font-bold">Total Reps</div>
                 <div className="text-xl lg:text-2xl font-mono text-cyan-400">{reps}</div>
               </div>
               <div className="w-[1px] h-8 bg-white/5" />
               <div>
                 <div className="text-[8px] lg:text-[9px] text-white/30 uppercase tracking-widest font-bold">Total Sets</div>
                 <div className="text-xl lg:text-2xl font-mono text-green-400">{sets}</div>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <TacticalCard className="bg-gradient-to-br from-zinc-900 to-black border-cyan-500/10">
            <h3 className="text-sm font-mono text-cyan-400 tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              AI FEEDBACK ENGINE
            </h3>
            <div className="space-y-3">
              {feedback.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={`${msg}-${i}`} 
                  className={cn(
                    "p-4 rounded-2xl font-mono text-xs border border-white/5 flex items-start gap-3",
                    i === 0 ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "bg-white/5 text-white/30"
                  )}
                >
                  <span className="opacity-40">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                  <span>{msg}</span>
                </motion.div>
              ))}
            </div>
          </TacticalCard>

          <TacticalCard>
            <h3 className="text-sm font-mono font-bold tracking-widest text-white/40 mb-4">SENSOR CONFIG</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60">Model Confidence</span>
                <span className="font-mono text-cyan-400">98.4%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 w-[98.4%]" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <div className="text-[9px] text-white/40 uppercase font-bold mb-1">Latency</div>
                  <div className="text-sm font-mono text-white">24ms</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <div className="text-[9px] text-white/40 uppercase font-bold mb-1">Points</div>
                  <div className="text-sm font-mono text-white">33/33</div>
                </div>
              </div>
            </div>
          </TacticalCard>
        </div>
      </div>
    </div>
  );
}
