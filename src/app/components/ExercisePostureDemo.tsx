import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Sparkles, AlertCircle, Dumbbell, Zap } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Equipment {
  type: 'barbell' | 'dumbbell' | 'cable' | 'bench' | 'none';
  parts: any[];
}

interface SkeletonData {
  head: Point;
  neck: Point;
  leftShoulder: Point;
  rightShoulder: Point;
  leftHip: Point;
  rightHip: Point;
  leftKnee: Point;
  rightKnee: Point;
  leftAnkle: Point;
  rightAnkle: Point;
  leftElbow: Point;
  rightElbow: Point;
  leftWrist: Point;
  rightWrist: Point;
  equipment: Equipment;
  targetMuscle: string;
  coachFocusTip: string;
}

interface ExercisePostureDemoProps {
  exerciseId: string;
  exerciseName: string;
  progress: number; // 0 to 1 back to 0
  tempoState: 'concentric' | 'hold' | 'eccentric' | 'pause';
  reps: number;
  sets: number;
}

export function getExerciseSkeleton(exId: string, progress: number): SkeletonData {
  // progress goes 0 to 1
  
  // Standard defaults (facing front standing)
  let head = { x: 120, y: 55 };
  let neck = { x: 120, y: 70 };
  let leftShoulder = { x: 95, y: 80 };
  let rightShoulder = { x: 145, y: 80 };
  let leftHip = { x: 105, y: 145 };
  let rightHip = { x: 135, y: 145 };
  let leftKnee = { x: 105, y: 185 };
  let rightKnee = { x: 135, y: 185 };
  let leftAnkle = { x: 105, y: 225 };
  let rightAnkle = { x: 135, y: 225 };
  let leftElbow = { x: 80, y: 110 };
  let rightElbow = { x: 160, y: 110 };
  let leftWrist = { x: 75, y: 135 };
  let rightWrist = { x: 165, y: 135 };
  
  let equipment: Equipment = { type: 'none', parts: [] };
  let targetMuscle = 'Full Body';
  let coachFocusTip = 'Maintain solid core tension & steady breathing rhythms.';

  switch (exId) {
    // === DAY 1: BACK & SHOULDERS ===
    case 'barbell_rows': {
      targetMuscle = 'Lats & Rhomboids (Back)';
      coachFocusTip = 'Hinge forward at 45°. Row barbell to chest, driving elbows high.';
      
      head = { x: 80, y: 100 };
      neck = { x: 95, y: 110 };
      leftShoulder = { x: 95, y: 110 };
      rightShoulder = { x: 95, y: 111 };
      leftHip = { x: 155, y: 135 };
      rightHip = { x: 155, y: 136 };
      leftKnee = { x: 140, y: 180 };
      rightKnee = { x: 140, y: 181 };
      leftAnkle = { x: 145, y: 225 };
      rightAnkle = { x: 145, y: 226 };
      
      // Pulling action: elbows lift high past spine
      const rowProgress = progress;
      leftElbow = { x: 110 - rowProgress * 15, y: 130 - rowProgress * 25 };
      rightElbow = { x: 110 - rowProgress * 15, y: 130 - rowProgress * 25 };
      
      const wristY = 175 - rowProgress * 60;
      const wristX = 100 - rowProgress * 5;
      leftWrist = { x: wristX, y: wristY };
      rightWrist = { x: wristX + 2, y: wristY };
      
      equipment = {
        type: 'barbell',
        parts: [{ x1: wristX - 40, y1: wristY, x2: wristX + 40, y2: wristY }]
      };
      break;
    }
    
    case 'pull_downs': {
      targetMuscle = 'Latissimus Dorsi (Lats)';
      coachFocusTip = 'Pull vertical handle down to upper clavicle. Do not swing back.';
      
      head = { x: 120, y: 90 };
      neck = { x: 120, y: 102 };
      leftShoulder = { x: 95, y: 110 };
      rightShoulder = { x: 145, y: 110 };
      leftHip = { x: 105, y: 170 };
      rightHip = { x: 135, y: 170 };
      leftKnee = { x: 90, y: 190 };
      rightKnee = { x: 150, y: 190 };
      leftAnkle = { x: 90, y: 225 };
      rightAnkle = { x: 150, y: 225 };
      
      // Lat bar goes from overhead (y=50) to chest height (y=115)
      const barY = 50 + progress * 60;
      leftWrist = { x: 80 + progress * 10, y: barY };
      rightWrist = { x: 160 - progress * 10, y: barY };
      
      leftElbow = { x: 75 + progress * 20, y: 85 + progress * 35 };
      rightElbow = { x: 165 - progress * 20, y: 85 + progress * 35 };
      
      equipment = {
        type: 'cable',
        parts: [
          { x1: leftWrist.x - 30, y1: barY, x2: rightWrist.x + 30, y2: barY },
          { x1: 120, y1: 30, x2: leftWrist.x, y2: barY },
          { x1: 120, y1: 30, x2: rightWrist.x, y2: barY }
        ]
      };
      break;
    }
    
    case 'dumbbell_rows': {
      targetMuscle = 'Middle Back & Lower Lats';
      coachFocusTip = 'Support torso with bench. Pull dumbbell directly to lower hip pocket.';
      
      head = { x: 75, y: 105 };
      neck = { x: 90, y: 110 };
      leftShoulder = { x: 100, y: 110 };
      rightShoulder = { x: 100, y: 110 };
      leftHip = { x: 160, y: 110 };
      rightHip = { x: 160, y: 110 };
      leftKnee = { x: 160, y: 165 }; // kneeling
      leftAnkle = { x: 160, y: 165 };
      rightKnee = { x: 170, y: 175 }; // foot down
      rightAnkle = { x: 175, y: 220 };
      
      leftElbow = { x: 100, y: 155 }; // hold base
      leftWrist = { x: 100, y: 165 };
      
      // Right arm row
      const rowY = 175 - progress * 65;
      rightWrist = { x: 112 + progress * 8, y: rowY };
      rightElbow = { x: 110 + progress * 20, y: 140 - progress * 40 };
      
      equipment = {
        type: 'bench',
        parts: [
          { x1: 85, y1: 165, x2: 200, y2: 165 }, // flat table
          { type: 'dumbbell_single', x: rightWrist.x, y: rowY }
        ]
      };
      break;
    }
    
    case 'hyperextensions': {
      targetMuscle = 'Spinal Erectors & Gluteal muscles';
      coachFocusTip = 'Control lowering depth. Flex glutes tightly at horizontal alignment.';
      
      leftHip = { x: 140, y: 150 };
      rightHip = { x: 140, y: 150 };
      leftKnee = { x: 170, y: 180 };
      rightKnee = { x: 170, y: 180 };
      leftAnkle = { x: 200, y: 210 };
      rightAnkle = { x: 200, y: 210 };
      
      // Hinge pivot: progress=0 (bent down), progress=1 (extended aligned straight)
      const angleRad = (195 - progress * 60) * Math.PI / 180;
      head = { x: 140 + Math.cos(angleRad) * 80, y: 150 + Math.sin(angleRad) * 80 };
      neck = { x: 140 + Math.cos(angleRad) * 65, y: 150 + Math.sin(angleRad) * 65 };
      leftShoulder = neck;
      rightShoulder = neck;
      
      leftElbow = { x: strokeAdjust(neck.x, -8), y: strokeAdjust(neck.y, -8) };
      rightElbow = { x: strokeAdjust(neck.x, 8), y: strokeAdjust(neck.y, -8) };
      leftWrist = neck;
      rightWrist = neck;
      
      equipment = {
        type: 'bench',
        parts: [
          { x1: 135, y1: 150, x2: 155, y2: 165 },
          { x1: 145, y1: 155, x2: 175, y2: 225 },
          { x1: 200, y1: 210, x2: 195, y2: 230 }
        ]
      };
      break;
    }
    
    case 'barbell_overhead_presses': {
      targetMuscle = 'Deltoids & Shoulder Girdle';
      coachFocusTip = 'Lock elbows out overhead. Keep lower abdomen and glutes active.';
      
      // Stand straight
      const barY = 95 - progress * 50;
      leftWrist = { x: 100, y: barY };
      rightWrist = { x: 140, y: barY };
      
      leftElbow = { x: 92 - progress * 4, y: 110 - progress * 24 };
      rightElbow = { x: 148 + progress * 4, y: 110 - progress * 24 };
      
      equipment = {
        type: 'barbell',
        parts: [{ x1: 80, y1: barY, x2: 160, y2: barY }]
      };
      break;
    }
    
    case 'side_raises': {
      targetMuscle = 'Lateral Deltoids (Side Shoulders)';
      coachFocusTip = 'Lead raising sequence with elbows. Pause at 90° shoulder height.';
      
      // Stand straight, arms lift out sideways
      const lift = progress * 45;
      const handY = 135 - progress * 55;
      leftWrist = { x: 95 - lift, y: handY };
      rightWrist = { x: 145 + lift, y: handY };
      
      leftElbow = { x: 95 - lift * 0.7, y: 110 - progress * 28 };
      rightElbow = { x: 145 + lift * 0.7, y: 110 - progress * 28 };
      
      equipment = {
        type: 'dumbbell',
        parts: [
          { type: 'dumbbell_single', x: leftWrist.x, y: handY },
          { type: 'dumbbell_single', x: rightWrist.x, y: handY }
        ]
      };
      break;
    }
    
    case 'bent_rear_side_raises': {
      targetMuscle = 'Posterior Delts (Rear Shoulders)';
      coachFocusTip = 'Bend over flat, lift weights out like wings to engage upper rear back.';
      
      head = { x: 90, y: 100 };
      neck = { x: 105, y: 110 };
      leftShoulder = { x: 105, y: 110 };
      rightShoulder = { x: 105, y: 110 };
      leftHip = { x: 155, y: 140 };
      rightHip = { x: 155, y: 140 };
      leftKnee = { x: 145, y: 180 };
      rightKnee = { x: 145, y: 180 };
      leftAnkle = { x: 150, y: 220 };
      rightAnkle = { x: 150, y: 220 };
      
      const armRiseY = 175 - progress * 62;
      const armRiseX = 105 - progress * 35;
      leftWrist = { x: armRiseX, y: armRiseY };
      rightWrist = { x: armRiseX, y: armRiseY };
      leftElbow = { x: 105 - progress * 20, y: 145 - progress * 32 };
      rightElbow = leftElbow;
      
      equipment = {
        type: 'dumbbell',
        parts: [{ type: 'dumbbell_single', x: leftWrist.x, y: armRiseY }]
      };
      break;
    }
    
    case 'forward_raises': {
      targetMuscle = 'Anterior Delts (Front Shoulders)';
      coachFocusTip = 'Raise dumbbell straight out in front. Complete block index control.';
      
      const frontX = 110 - progress * 55;
      const frontY = 135 - progress * 55;
      leftWrist = { x: frontX, y: frontY };
      rightWrist = { x: frontX + 2, y: frontY };
      leftElbow = { x: 110 - progress * 30, y: 110 - progress * 22 };
      rightElbow = leftElbow;
      
      equipment = {
        type: 'dumbbell',
        parts: [{ type: 'dumbbell_single', x: leftWrist.x, y: frontY }]
      };
      break;
    }

    // === DAY 3: LEGS & ABS ===
    case 'barbell_squats': {
      targetMuscle = 'Quadriceps, Glutes, Hamstrings';
      coachFocusTip = 'Lower hips backward. Keep heels anchored & chest proud.';
      
      const dispY = progress * 42;
      leftHip = { x: 105 - progress * 4, y: 145 + dispY };
      rightHip = { x: 135 + progress * 4, y: 145 + dispY };
      
      leftKnee = { x: 95 - progress * 12, y: 185 + dispY * 0.35 };
      rightKnee = { x: 145 + progress * 12, y: 185 + dispY * 0.35 };
      
      leftAnkle = { x: 105, y: 225 };
      rightAnkle = { x: 135, y: 225 };
      
      head = { x: 120, y: 55 + dispY };
      neck = { x: 120, y: 70 + dispY };
      leftShoulder = { x: 95, y: 80 + dispY };
      rightShoulder = { x: 145, y: 80 + dispY };
      
      leftWrist = leftShoulder;
      rightWrist = rightShoulder;
      
      equipment = {
        type: 'barbell',
        parts: [{ x1: 72, y1: 80 + dispY, x2: 168, y2: 80 + dispY }]
      };
      break;
    }
    
    case 'leg_presses': {
      targetMuscle = 'Quads & Glutes Primary Work';
      coachFocusTip = 'Ensure lower back remains pinned flat in seat protector.';
      
      head = { x: 145, y: 105 };
      neck = { x: 135, y: 115 };
      leftHip = { x: 100, y: 165 };
      rightHip = { x: 100, y: 165 };
      
      // Hinge footplate
      const pX = 140 + progress * 35;
      const pY = 125 - progress * 30;
      leftAnkle = { x: pX, y: pY };
      rightAnkle = { x: pX, y: pY };
      
      leftKnee = { x: 95 + progress * 35, y: 122 + progress * 10 };
      rightKnee = leftKnee;
      
      equipment = {
        type: 'bench',
        parts: [
          { x1: 90, y1: 175, x2: 120, y2: 175 }, // seat
          { x1: 90, y1: 175, x2: 155, y2: 110 }, // backrest
          { x1: pX - 15, y1: pY - 15, x2: pX + 15, y2: pY + 15 } // platform
        ]
      };
      break;
    }
    
    case 'leg_extensions': {
      targetMuscle = 'Quadriceps Isolation';
      coachFocusTip = 'Extend knees fully, squeeze hard. Point toes forward.';
      
      head = { x: 120, y: 100 };
      neck = { x: 120, y: 110 };
      leftHip = { x: 140, y: 165 };
      rightHip = { x: 140, y: 165 };
      leftKnee = { x: 180, y: 165 };
      rightKnee = { x: 180, y: 165 };
      
      const extensionAngle = (progress * 90) * Math.PI / 180;
      const extAnkX = 180 + Math.sin(extensionAngle) * 45;
      const extAnkY = 165 + Math.cos(extensionAngle) * 45;
      leftAnkle = { x: extAnkX, y: extAnkY };
      rightAnkle = { x: extAnkX, y: extAnkY };
      
      equipment = {
        type: 'bench',
        parts: [
          { x1: 100, y1: 120, x2: 100, y2: 165 },
          { x1: 100, y1: 165, x2: 180, y2: 165 },
          { x1: 180, y1: 165, x2: 180, y2: 190 },
          { type: 'roller', x: extAnkX, y: extAnkY }
        ]
      };
      break;
    }
    
    case 'legged_dead_lifts': {
      targetMuscle = 'Hamstrings & Posterior Chain';
      coachFocusTip = 'Hinge at the pelvic line. Keep barbell closely sliding down shins.';
      
      const liftShiftX = progress * 18;
      leftHip = { x: 130 + liftShiftX, y: 140 };
      rightHip = { x: 130 + liftShiftX, y: 140 };
      leftKnee = { x: 125, y: 185 };
      rightKnee = { x: 125, y: 185 };
      leftAnkle = { x: 125, y: 230 };
      rightAnkle = { x: 125, y: 230 };
      
      const hingeRad = (progress * 65) * Math.PI / 180;
      head = { x: (130 + liftShiftX) - Math.sin(hingeRad) * 80, y: 140 - Math.cos(hingeRad) * 80 };
      neck = { x: (130 + liftShiftX) - Math.sin(hingeRad) * 65, y: 140 - Math.cos(hingeRad) * 65 };
      leftShoulder = neck;
      rightShoulder = neck;
      
      const barY = 140 + progress * 40;
      const barX = (130 + liftShiftX) - Math.sin(hingeRad) * 65;
      leftWrist = { x: barX, y: barY };
      rightWrist = { x: barX, y: barY };
      
      equipment = {
        type: 'barbell',
        parts: [{ x1: barX - 35, y1: barY, x2: barX + 35, y2: barY }]
      };
      break;
    }
    
    case 'seated_calf_raises': {
      targetMuscle = 'Soleus Deep Calf Muscle';
      coachFocusTip = 'Drop heels low for full stretch extension before lifting upwards.';
      
      head = { x: 110, y: 90 };
      neck = { x: 110, y: 100 };
      leftHip = { x: 110, y: 155 };
      rightHip = { x: 110, y: 155 };
      leftKnee = { x: 165, y: 155 };
      rightKnee = { x: 165, y: 155 };
      
      // lift heel
      const heelY = 225 - progress * 14;
      leftAnkle = { x: 165, y: heelY };
      rightAnkle = { x: 165, y: heelY };
      
      equipment = {
        type: 'bench',
        parts: [
          { x1: 90, y1: 155, x2: 130, y2: 155 },
          { x1: 160, y1: 230, x2: 175, y2: 230 }, // toe step
          { x1: 150, y1: 145, x2: 180, y2: 145 } // knee loaded
        ]
      };
      break;
    }
    
    case 'standing_calf_raises': {
      targetMuscle = 'Gastrocnemius (Upper Calves)';
      coachFocusTip = 'Lock knees in extension, rise aggressively on balls of toes.';
      
      const shY = progress * 15;
      head = { x: 120, y: 55 - shY };
      neck = { x: 120, y: 70 - shY };
      leftShoulder = { x: 95, y: 80 - shY };
      rightShoulder = { x: 145, y: 80 - shY };
      leftHip = { x: 105, y: 145 - shY };
      rightHip = { x: 135, y: 145 - shY };
      leftKnee = { x: 105, y: 185 - shY };
      rightKnee = { x: 135, y: 185 - shY };
      
      leftAnkle = { x: 105, y: 225 - shY };
      rightAnkle = { x: 135, y: 225 - shY };
      
      equipment = {
        type: 'bench',
        parts: [{ x1: 90, y1: 230, x2: 150, y2: 230 }]
      };
      break;
    }
    
    case 'abdominal_crunches': {
      targetMuscle = 'Upper Abdominals (Rectus)';
      coachFocusTip = 'Exhale sharply as you segmentally peel shoulders off floor.';
      
      leftHip = { x: 140, y: 180 };
      rightHip = { x: 140, y: 180 };
      leftKnee = { x: 175, y: 150 };
      rightKnee = { x: 175, y: 150 };
      leftAnkle = { x: 200, y: 180 };
      rightAnkle = { x: 200, y: 180 };
      
      head = { x: 75 + progress * 24, y: 175 - progress * 32 };
      neck = { x: 90 + progress * 20, y: 175 - progress * 22 };
      leftShoulder = neck;
      rightShoulder = neck;
      leftWrist = head;
      rightWrist = head;
      
      equipment = {
        type: 'bench',
        parts: [{ x1: 50, y1: 180, x2: 170, y2: 180 }]
      };
      break;
    }
    
    case 'leg_raises': {
      targetMuscle = 'Lower Abs & Deep Pelvic Core';
      coachFocusTip = 'Force tailbone flat down. Do not swing legs with inertia.';
      
      head = { x: 70, y: 170 };
      neck = { x: 85, y: 175 };
      leftShoulder = { x: 85, y: 175 };
      rightShoulder = { x: 85, y: 175 };
      leftHip = { x: 140, y: 180 };
      rightHip = { x: 140, y: 180 };
      
      const raRad = (progress * 85) * Math.PI / 180;
      const toeX = 140 + Math.cos((90 - 85 * progress) * Math.PI / 180) * 60;
      const toeY = 180 - Math.sin((85 * progress) * Math.PI / 180) * 60;
      
      leftAnkle = { x: toeX, y: toeY };
      rightAnkle = { x: toeX, y: toeY };
      leftKnee = { x: 140 + (toeX - 140) * 0.5, y: 180 + (toeY - 180) * 0.5 };
      rightKnee = leftKnee;
      
      equipment = {
        type: 'bench',
        parts: [{ x1: 50, y1: 180, x2: 160, y2: 180 }]
      };
      break;
    }

    // === DAY 5: CHEST & ARMS ===
    case 'bench_presses': {
      targetMuscle = 'Pectorals & Triceps Push';
      coachFocusTip = 'Retract shoulder blades. Touch chest, press to complete lock.';
      
      leftHip = { x: 140, y: 150 };
      rightHip = { x: 140, y: 150 };
      leftShoulder = { x: 95, y: 150 };
      rightShoulder = { x: 95, y: 150 };
      head = { x: 75, y: 142 };
      neck = { x: 85, y: 150 };
      
      leftKnee = { x: 150, y: 195 };
      leftAnkle = { x: 150, y: 220 };
      rightKnee = leftKnee;
      rightAnkle = leftAnkle;
      
      const barY = 135 - progress * 40;
      leftWrist = { x: 95, y: barY };
      rightWrist = { x: 95, y: barY };
      leftElbow = { x: 95, y: 150 + (1 - progress) * 18 };
      rightElbow = leftElbow;
      
      equipment = {
        type: 'barbell',
        parts: [
          { x1: 52, y1: 150, x2: 165, y2: 150 }, // bench frame
          { x1: 95, y1: 150, x2: 95, y2: 215 },
          { x1: 55, y1: barY, x2: 135, y2: barY } // bar
        ]
      };
      break;
    }
    
    case 'incline_bench_presses': {
      targetMuscle = 'Upper Chest Fibers';
      coachFocusTip = 'Lock thumbs around bar. Keep elbows flared 45° to body.';
      
      leftHip = { x: 90, y: 170 };
      rightHip = { x: 90, y: 170 };
      leftShoulder = { x: 130, y: 130 };
      rightShoulder = { x: 130, y: 130 };
      head = { x: 140, y: 110 };
      neck = { x: 135, y: 120 };
      
      leftKnee = { x: 85, y: 200 };
      leftAnkle = { x: 85, y: 230 };
      rightKnee = leftKnee;
      rightAnkle = leftAnkle;
      
      const ext = 15 + progress * 35;
      const barX = 130 - ext * 0.7;
      const barY = 130 - ext * 0.7;
      leftWrist = { x: barX, y: barY };
      rightWrist = { x: barX, y: barY };
      leftElbow = { x: 130 - (1 - progress) * 15, y: 130 + (1 - progress) * 15 };
      rightElbow = leftElbow;
      
      equipment = {
        type: 'barbell',
        parts: [
          { x1: 80, y1: 180, x2: 150, y2: 110 },
          { x1: barX - 30, y1: barY - 15, x2: barX + 30, y2: barY + 15 }
        ]
      };
      break;
    }
    
    case 'dumbbell_presses': {
      targetMuscle = 'Chest Outer & Upper fibers';
      coachFocusTip = 'Dumbbells travel in a slight arch, meeting at peak lockout overhead.';
      
      leftHip = { x: 140, y: 150 };
      rightHip = { x: 140, y: 150 };
      leftShoulder = { x: 95, y: 150 };
      rightShoulder = { x: 95, y: 150 };
      head = { x: 75, y: 142 };
      neck = { x: 85, y: 150 };
      
      const dbY = 135 - progress * 40;
      leftWrist = { x: 95, y: dbY };
      rightWrist = { x: 95, y: dbY };
      leftElbow = { x: 95, y: 150 + (1 - progress) * 18 };
      rightElbow = leftElbow;
      
      equipment = {
        type: 'dumbbell',
        parts: [
          { x1: 52, y1: 150, x2: 165, y2: 150 },
          { type: 'dumbbell_single', x: leftWrist.x, y: dbY }
        ]
      };
      break;
    }
    
    case 'incline_dumbbell_flyes': {
      targetMuscle = 'Sternal & Clavicular margins';
      coachFocusTip = 'Wide expansive fly. Maintain fixed elbow unlock. Keep chest puffed.';
      
      leftHip = { x: 90, y: 170 };
      rightHip = { x: 90, y: 170 };
      leftShoulder = { x: 130, y: 130 };
      rightShoulder = { x: 130, y: 130 };
      head = { x: 140, y: 110 };
      neck = { x: 135, y: 120 };
      
      const flyX = 130 - (1 - progress) * 35;
      const flyY = 130 - progress * 45 - (1 - progress) * 15;
      leftWrist = { x: flyX, y: flyY };
      rightWrist = { x: flyX, y: flyY };
      leftElbow = { x: 130 - (1 - progress) * 20, y: 130 + (1 - progress) * 5 };
      rightElbow = leftElbow;
      
      equipment = {
        type: 'dumbbell',
        parts: [
          { x1: 80, y1: 180, x2: 150, y2: 110 },
          { type: 'dumbbell_single', x: flyX, y: flyY }
        ]
      };
      break;
    }
    
    case 'tricep_extensions': {
      targetMuscle = 'Triceps Long Head (Overhead)';
      coachFocusTip = 'Wrap fingers firmly around DB weight bell. Support base spine upright.';
      
      head = { x: 120, y: 95 };
      neck = { x: 120, y: 105 };
      leftShoulder = { x: 95, y: 115 };
      rightShoulder = { x: 145, y: 115 };
      leftHip = { x: 110, y: 175 };
      rightHip = { x: 130, y: 175 };
      
      leftElbow = { x: 100, y: 80 };
      rightElbow = { x: 140, y: 80 };
      
      const wrY = 110 - progress * 58;
      leftWrist = { x: 100, y: wrY };
      rightWrist = { x: 140, y: wrY };
      
      equipment = {
        type: 'dumbbell',
        parts: [
          { x1: 100, y1: 175, x2: 140, y2: 175 },
          { type: 'dumbbell_single', x: leftWrist.x, y: wrY }
        ]
      };
      break;
    }
    
    case 'triceps_pull_downs': {
      targetMuscle = 'Triceps Medial & Lateral Head';
      coachFocusTip = 'Drive attachments down, splitting rope handles at floor index.';
      
      head = { x: 105, y: 55 };
      neck = { x: 110, y: 70 };
      leftShoulder = { x: 110, y: 80 };
      rightShoulder = { x: 110, y: 80 };
      leftHip = { x: 110, y: 145 };
      rightHip = { x: 110, y: 145 };
      leftKnee = { x: 110, y: 185 };
      rightKnee = { x: 110, y: 185 };
      leftAnkle = { x: 110, y: 225 };
      rightAnkle = { x: 110, y: 225 };
      
      leftElbow = { x: 110, y: 110 };
      rightElbow = { x: 110, y: 110 };
      
      const wristEndY = 110 + progress * 30;
      const wristEndX = 125 + progress * 5;
      leftWrist = { x: wristEndX, y: wristEndY };
      rightWrist = { x: wristEndX + 1, y: wristEndY };
      
      equipment = {
        type: 'cable',
        parts: [{ x1: 135, y1: 40, x2: leftWrist.x, y2: leftWrist.y }]
      };
      break;
    }
    
    case 'barbell_curls': {
      targetMuscle = 'Biceps Brachii (Short Head)';
      coachFocusTip = 'Keep upper arm completely still. Do not drag shoulders up.';
      
      leftElbow = { x: 92, y: 112 };
      rightElbow = { x: 148, y: 112 };
      
      const wrLestY = 142 - progress * 40;
      const wrLestX = 92 - progress * 5;
      leftWrist = { x: wrLestX, y: wrLestY };
      
      const wrRestY = 142 - progress * 40;
      const wrRestX = 148 + progress * 5;
      rightWrist = { x: wrRestX, y: wrRestY };
      
      equipment = {
        type: 'barbell',
        parts: [{ x1: leftWrist.x - 15, y1: wrLestY, x2: rightWrist.x + 15, y2: wrRestY }]
      };
      break;
    }
    
    case 'preacher_curls': {
      targetMuscle = 'Elbow Flexor (Lower Bicep Core)';
      coachFocusTip = 'Align arm joints flat on preacher pad cushion. Do not lift hips.';
      
      head = { x: 110, y: 95 };
      neck = { x: 110, y: 105 };
      leftShoulder = { x: 110, y: 115 };
      rightShoulder = { x: 110, y: 115 };
      leftHip = { x: 90, y: 165 };
      rightHip = { x: 90, y: 165 };
      
      leftElbow = { x: 135, y: 135 };
      rightElbow = { x: 135, y: 135 };
      
      const targetArmX = 155 - progress * 35;
      const targetArmY = 155 - progress * 45;
      leftWrist = { x: targetArmX, y: targetArmY };
      rightWrist = { x: targetArmX, y: targetArmY };
      
      equipment = {
        type: 'barbell',
        parts: [
          { x1: 110, y1: 115, x2: 135, y2: 135 },
          { x1: 105, y1: 135, x2: 135, y2: 135 },
          { x1: 90, y1: 165, x2: 130, y2: 165 },
          { x1: targetArmX - 15, y1: targetArmY, x2: targetArmX + 15, y2: targetArmY }
        ]
      };
      break;
    }
    
    case 'hammer_curls': {
      targetMuscle = 'Brachioradialis (Outer Forearms)';
      coachFocusTip = 'Wrap fingers around handles. Neutral grips to isolate front arm.';
      
      leftElbow = { x: 92, y: 112 };
      rightElbow = { x: 148, y: 112 };
      
      const wrChL = 142 - progress * 42;
      const wrChX = 92 - progress * 4;
      leftWrist = { x: wrChX, y: wrChL };
      
      const wrChRY = 142 - progress * 42;
      const wrChRX = 148 + progress * 4;
      rightWrist = { x: wrChRX, y: wrChRY };
      
      equipment = {
        type: 'dumbbell',
        parts: [
          { type: 'dumbbell_single', x: leftWrist.x, y: wrChL },
          { type: 'dumbbell_single', x: rightWrist.x, y: wrChRY }
        ]
      };
      break;
    }
    
    default:
      break;
  }

  return {
    head,
    neck,
    leftShoulder,
    rightShoulder,
    leftHip,
    rightHip,
    leftKnee,
    rightKnee,
    leftAnkle,
    rightAnkle,
    leftElbow,
    rightElbow,
    leftWrist,
    rightWrist,
    equipment,
    targetMuscle,
    coachFocusTip
  };
}

// Helpers for slight anatomy displacements
function strokeAdjust(base: number, offset: number): number {
  return base + offset;
}

export default function ExercisePostureDemo({
  exerciseId,
  exerciseName,
  progress,
  tempoState,
  reps,
  sets
}: ExercisePostureDemoProps) {
  
  const skeleton = getExerciseSkeleton(exerciseId, progress);
  
  // Choose highlighted visual focus coordinates to draw muscular glow halos
  const getMuscularFocusOverlay = () => {
    const s = skeleton;
    let cx = 120, cy = 110, rx = 20, ry = 22;
    
    // Highlight specific body compartments according to exercise targets
    if (exerciseId.includes('curl') || exerciseId.includes('extension') || exerciseId.includes('pull_downs') || exerciseId.includes('rows')) {
      // Arms / Back
      cx = (s.leftShoulder.x + s.leftElbow.x) / 2;
      cy = (s.leftShoulder.y + s.leftElbow.y) / 2;
      rx = 18;
      ry = 18;
    } else if (exerciseId.includes('squat') || exerciseId.includes('press') || exerciseId.includes('dead')) {
      // Quads / Leg compartment
      cx = (s.leftHip.x + s.leftKnee.x) / 2;
      cy = (s.leftHip.y + s.leftKnee.y) / 2;
      rx = 14;
      ry = 28;
    } else if (exerciseId.includes('crunch') || exerciseId.includes('raise')) {
      // Abdominal belt Core
      cx = (s.leftShoulder.x + s.leftHip.x) / 2;
      cy = (s.leftShoulder.y + s.leftHip.y) / 2;
      rx = 22;
      ry = 22;
    }
    return { cx, cy, rx, ry };
  };

  const muscleHighlight = getMuscularFocusOverlay();

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Visual active header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-[10px] tracking-widest text-[#FFD600] font-bold uppercase">
            POSTURE MONITOR SENSOR
          </span>
        </div>
        <div className="px-2 py-0.5 rounded bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/20 font-mono text-[9px] uppercase font-bold tracking-wider">
          {tempoState} PHASE
        </div>
      </div>

      {/* Primary SVG Athlete container */}
      <div className="relative bg-black/60 rounded-xl border border-white/5 p-4 flex items-center justify-center min-h-[250px] overflow-hidden group">
        
        {/* Background futuristic tech grids */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]" />
        
        {/* Neon SVG */}
        <svg className="w-[200px] h-[200px] transform drop-shadow-[0_0_12px_rgba(255,255,255,0.05)]" viewBox="0 0 240 240">
          <defs>
            <radialGradient id="muscularGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00E676" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00E676" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="jointGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00D4FF" stopOpacity="1" />
              <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Render target muscle glowing overlay halo */}
          <ellipse 
            cx={muscleHighlight.cx} 
            cy={muscleHighlight.cy} 
            rx={muscleHighlight.rx + 10} 
            ry={muscleHighlight.ry + 10} 
            fill="url(#muscularGlow)" 
            className="animate-pulse"
          />

          {/* Rest Body structures underneath */}
          <g opacity="0.3">
            {/* Spine reference skeleton background */}
            <line x1={120} y1={50} x2={120} y2={230} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3,3" />
          </g>

          {/* Render Equipment support bench/structures FIRST */}
          {skeleton.equipment.type === 'bench' && skeleton.equipment.parts.map((p, idx) => (
            <line 
              key={`bench-${idx}`}
              x1={p.x1} 
              y1={p.y1} 
              x2={p.x2} 
              y2={p.y2} 
              stroke="#27272a" 
              strokeWidth="7" 
              strokeLinecap="round" 
            />
          ))}

          {/* Athlete Bones (Joint to Joint) */}
          {/* Shoulder bridge */}
          <line 
            x1={skeleton.leftShoulder.x} 
            y1={skeleton.leftShoulder.y} 
            x2={skeleton.rightShoulder.x} 
            y2={skeleton.rightShoulder.y} 
            stroke="#00D4FF" 
            strokeWidth="5.5" 
            strokeLinecap="round" 
          />
          
          {/* Spine link: neck to hips */}
          <line 
            x1={skeleton.neck.x} 
            y1={skeleton.neck.y} 
            x2={(skeleton.leftHip.x + skeleton.rightHip.x) / 2} 
            y2={(skeleton.leftHip.y + skeleton.rightHip.y) / 2} 
            stroke="#00D4FF" 
            strokeWidth="6" 
            strokeLinecap="round" 
          />

          {/* Pelvis bridge */}
          <line 
            x1={skeleton.leftHip.x} 
            y1={skeleton.leftHip.y} 
            x2={skeleton.rightHip.x} 
            y2={skeleton.rightHip.y} 
            stroke="#00D4FF" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />

          {/* Left Arm limbs */}
          <line 
            x1={skeleton.leftShoulder.x} 
            y1={skeleton.leftShoulder.y} 
            x2={skeleton.leftElbow.x} 
            y2={skeleton.leftElbow.y} 
            stroke="#00D4FF" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />
          <line 
            x1={skeleton.leftElbow.x} 
            y1={skeleton.leftElbow.y} 
            x2={skeleton.leftWrist.x} 
            y2={skeleton.leftWrist.y} 
            stroke="#00D4FF" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />

          {/* Right Arm limbs */}
          <line 
            x1={skeleton.rightShoulder.x} 
            y1={skeleton.rightShoulder.y} 
            x2={skeleton.rightElbow.x} 
            y2={skeleton.rightElbow.y} 
            stroke="#00D4FF" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />
          <line 
            x1={skeleton.rightElbow.x} 
            y1={skeleton.rightElbow.y} 
            x2={skeleton.rightWrist.x} 
            y2={skeleton.rightWrist.y} 
            stroke="#00D4FF" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />

          {/* Left Leg thighs & calves */}
          <line 
            x1={skeleton.leftHip.x} 
            y1={skeleton.leftHip.y} 
            x2={skeleton.leftKnee.x} 
            y2={skeleton.leftKnee.y} 
            stroke="#00D4FF" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />
          <line 
            x1={skeleton.leftKnee.x} 
            y1={skeleton.leftKnee.y} 
            x2={skeleton.leftAnkle.x} 
            y2={skeleton.leftAnkle.y} 
            stroke="#00D4FF" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />

          {/* Right Leg thighs & calves */}
          <line 
            x1={skeleton.rightHip.x} 
            y1={skeleton.rightHip.y} 
            x2={skeleton.rightKnee.x} 
            y2={skeleton.rightKnee.y} 
            stroke="#00D4FF" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />
          <line 
            x1={skeleton.rightKnee.x} 
            y1={skeleton.rightKnee.y} 
            x2={skeleton.rightAnkle.x} 
            y2={skeleton.rightAnkle.y} 
            stroke="#00D4FF" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />

          {/* Head dome circle */}
          <circle 
            cx={skeleton.head.x} 
            cy={skeleton.head.y} 
            r="11" 
            fill="none" 
            stroke="#00D4FF" 
            strokeWidth="3.5" 
            className="drop-shadow-[0_0_6px_rgba(0,212,255,0.8)]"
          />

          {/* Render active weights, cables, or dumbbells overlays */}
          {skeleton.equipment.type === 'barbell' && skeleton.equipment.parts.map((item, id) => (
            <g key={`bb-part-${id}`}>
              {/* Long bar linking wrists */}
              <line 
                x1={item.x1} 
                y1={item.y1} 
                x2={item.x2} 
                y2={item.y2} 
                stroke="#FFD600" 
                strokeWidth="4.5" 
                strokeLinecap="round" 
                className="drop-shadow-[0_0_8px_rgba(255,214,0,0.8)]"
              />
              {/* Left Plate loaders */}
              <rect x={item.x1 - 4} y={item.y1 - 12} width={8} height={24} rx={1} fill="#FFD600" />
              <rect x={item.x1 - 10} y={item.y1 - 9} width={5} height={18} rx={1} fill="#eab308" />
              {/* Right Plate loaders */}
              <rect x={item.x2 - 4} y={item.y2 - 12} width={8} height={24} rx={1} fill="#FFD600" />
              <rect x={item.x2 + 5} y={item.y2 - 9} width={5} height={18} rx={1} fill="#eab308" />
            </g>
          ))}

          {skeleton.equipment.type === 'cable' && skeleton.equipment.parts.map((item, id) => (
            <g key={`cable-part-${id}`}>
              <line 
                x1={item.x1} 
                y1={item.y1} 
                x2={item.x2} 
                y2={item.y2} 
                stroke="#00E5FF" 
                strokeWidth="1.5" 
                strokeDasharray="4,3" 
              />
              <circle cx={item.x2} cy={item.y2} r="3" fill="#00E5FF" />
            </g>
          ))}

          {skeleton.equipment.type === 'dumbbell' && skeleton.equipment.parts.map((part, id) => (
            part.type === 'dumbbell_single' && (
              <g key={`db-${id}`}>
                <line 
                  x1={part.x - 12} 
                  y1={part.y} 
                  x2={part.x + 12} 
                  y2={part.y} 
                  stroke="#FFD600" 
                  strokeWidth="4" 
                />
                <rect x={part.x - 15} y={part.y - 7} width={4} height={14} rx={1} fill="#FFD600" />
                <rect x={part.x + 11} y={part.y - 7} width={4} height={14} rx={1} fill="#FFD600" />
              </g>
            )
          ))}

          {skeleton.equipment.parts.map((p, idx) => (
            p.type === 'dumbbell_single' && (
              <g key={`db-single-${idx}`}>
                <line x1={p.x - 10} y1={p.y} x2={p.x + 10} y2={p.y} stroke="#FFD600" strokeWidth="4" />
                <rect x={p.x - 13} y={p.y - 6} width={4} height={12} rx={1} fill="#FFD600" />
                <rect x={p.x + 9} y={p.y - 6} width={4} height={12} rx={1} fill="#FFD600" />
              </g>
            )
          ))}

          {/* Joint highlight tracking coordinate points */}
          <circle cx={skeleton.leftShoulder.x} cy={skeleton.leftShoulder.y} r="4.5" fill="#00D4FF" />
          <circle cx={skeleton.rightShoulder.x} cy={skeleton.rightShoulder.y} r="4.5" fill="#00D4FF" />
          <circle cx={skeleton.leftElbow.x} cy={skeleton.leftElbow.y} r="4" fill="#00D4FF" stroke="#fff" strokeWidth={0.5} />
          <circle cx={skeleton.rightElbow.x} cy={skeleton.rightElbow.y} r="4" fill="#00D4FF" stroke="#fff" strokeWidth={0.5} />
          <circle cx={skeleton.leftKnee.x} cy={skeleton.leftKnee.y} r="4" fill="#00E676" />
          <circle cx={skeleton.rightKnee.x} cy={skeleton.rightKnee.y} r="4" fill="#00E676" />
        </svg>

        {/* Real-time Bio-completion percentage circle in corner */}
        <div className="absolute bottom-3 left-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/5 font-mono text-[9px] text-[#00E676] flex items-center gap-1.5 uppercase">
          <Zap className="w-3.5 h-3.5 text-[#00E676]" />
          <span>FORM SYNC {(progress * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Target Muscular Stats info card */}
      <div className="space-y-2 mt-3">
        <div className="p-3 bg-zinc-950/80 border border-white/5 rounded-xl">
          <span className="font-mono text-[8px] text-white/30 uppercase block">ACTIVE TARGET ZONE</span>
          <span className="font-mono text-xs font-bold text-[#00E676] tracking-wide block">
            {skeleton.targetMuscle}
          </span>
        </div>

        {/* Coach tip box */}
        <div className="p-3 bg-[#FFD600]/5 border border-[#FFD600]/10 rounded-xl flex gap-2">
          <AlertCircle className="w-4 h-4 text-[#FFD600] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-mono text-[8px] text-white/30 uppercase block">POSTURE OPTIMIZATION</span>
            <p className="font-mono text-xs text-white/80 leading-normal">
              {skeleton.coachFocusTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
