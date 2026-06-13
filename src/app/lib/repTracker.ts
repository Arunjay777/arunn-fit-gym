export interface TrackerState {
  status: 'neutral' | 'down' | 'up';
  reps: number;
  sets: number;
}

export interface Keypoint {
  name?: string;
  x: number;
  y: number;
  score?: number;
}

export interface Pose {
  keypoints: Keypoint[];
}

export interface Exercise {
  primaryMuscle: string;
  targetJoint: string;
}

/**
 * Calculates the angle between three 2D keypoints (a, b, c) with b as the vertex.
 */
export function calculateAngle(a: Keypoint, b: Keypoint, c: Keypoint): number {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) angle = 360 - angle;
  return angle;
}

/**
 * Maps the current exercise to its corresponding tracking joint and computes the joint's angle
 * if the required keypoints meet the minimum confidence score threshold.
 */
export function getJointLabelAndAngle(pose: Pose, exercise: Exercise): { jointLabel: string; angle: number | null } {
  const muscleLower = exercise.primaryMuscle.toLowerCase();
  const targetLower = exercise.targetJoint.toLowerCase();

  let angle: number | null = null;
  let jointLabel = "";

  // 1. Knee Extension (Legs, Squats, etc.)
  if (targetLower.includes('knee') || muscleLower.includes('quad') || muscleLower.includes('glute') || muscleLower.includes('hamstring')) {
    const hip = pose.keypoints.find(k => k.name === 'left_hip' || k.name === 'right_hip');
    const knee = pose.keypoints.find(k => k.name === 'left_knee' || k.name === 'right_knee');
    const ankle = pose.keypoints.find(k => k.name === 'left_ankle' || k.name === 'right_ankle');
    if (hip && knee && ankle && (hip.score ?? 0) > 0.4 && (knee.score ?? 0) > 0.4 && (ankle.score ?? 0) > 0.4) {
      angle = calculateAngle(hip, knee, ankle);
      jointLabel = "Knee Extension";
    }
  } 
  // 2. Elbow Flexion (Arms, Back, Rows, Curls, etc.)
  else if (targetLower.includes('elbow') || muscleLower.includes('bicep') || muscleLower.includes('tricep') || muscleLower.includes('lat') || muscleLower.includes('back')) {
    const shoulder = pose.keypoints.find(k => k.name === 'left_shoulder' || k.name === 'right_shoulder');
    const elbow = pose.keypoints.find(k => k.name === 'left_elbow' || k.name === 'right_elbow');
    const wrist = pose.keypoints.find(k => k.name === 'left_wrist' || k.name === 'right_wrist');
    if (shoulder && elbow && wrist && (shoulder.score ?? 0) > 0.4 && (elbow.score ?? 0) > 0.4 && (wrist.score ?? 0) > 0.4) {
      angle = calculateAngle(shoulder, elbow, wrist);
      jointLabel = "Elbow Flexion";
    }
  } 
  // 3. Hip Flexion (Abs, Crunches, etc.)
  else {
    const shoulder = pose.keypoints.find(k => k.name === 'left_shoulder' || k.name === 'right_shoulder');
    const hip = pose.keypoints.find(k => k.name === 'left_hip' || k.name === 'right_hip');
    const knee = pose.keypoints.find(k => k.name === 'left_knee' || k.name === 'right_knee');
    if (shoulder && hip && knee && (shoulder.score ?? 0) > 0.4 && (hip.score ?? 0) > 0.4 && (knee.score ?? 0) > 0.4) {
      angle = calculateAngle(shoulder, hip, knee);
      jointLabel = "Hip Flexion";
    }
  }

  return { jointLabel, angle: angle !== null ? Math.round(angle) : null };
}

/**
 * Updates the rep counter tracking state based on the current state, active joint label, and current angle.
 */
export function updateTrackerState(
  currentState: TrackerState,
  jointLabel: string,
  angle: number,
  isActive: boolean
): { nextState: TrackerState; repRegistered: boolean; setCompleted: boolean } {
  const nextState = { ...currentState };
  let repRegistered = false;
  let setCompleted = false;

  if (!isActive) {
    return { nextState, repRegistered, setCompleted };
  }

  if (jointLabel === "Knee Extension") {
    if (angle < 115 && currentState.status !== 'down') {
      nextState.status = 'down';
    } else if (angle > 150 && currentState.status === 'down') {
      nextState.status = 'up';
      repRegistered = true;
    }
  } else if (jointLabel === "Elbow Flexion") {
    if (angle < 95 && currentState.status !== 'down') {
      nextState.status = 'down';
    } else if (angle > 145 && currentState.status === 'down') {
      nextState.status = 'up';
      repRegistered = true;
    }
  } else if (jointLabel === "Hip Flexion") {
    if (angle < 120 && currentState.status !== 'down') {
      nextState.status = 'down';
    } else if (angle > 155 && currentState.status === 'down') {
      nextState.status = 'up';
      repRegistered = true;
    }
  }

  if (repRegistered) {
    nextState.reps += 1;
    if (nextState.reps > 0 && nextState.reps % 10 === 0) {
      nextState.sets += 1;
      setCompleted = true;
    }
  }

  return { nextState, repRegistered, setCompleted };
}
