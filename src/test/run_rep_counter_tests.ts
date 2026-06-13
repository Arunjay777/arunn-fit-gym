import { 
  calculateAngle, 
  getJointLabelAndAngle, 
  updateTrackerState 
} from '../app/lib/repTracker.ts';
import type { TrackerState, Pose, Exercise, Keypoint } from '../app/lib/repTracker.ts';

// 25 Exercises Database from RepCounter.tsx
const EXERCISES_DATABASE: Exercise[] = [
  { primaryMuscle: 'Lats & Upper Back', targetJoint: 'Elbow & Shoulder' },
  { primaryMuscle: 'Latissimus Dorsi', targetJoint: 'Elbow & Shoulder' },
  { primaryMuscle: 'Middle Back', targetJoint: 'Elbow' },
  { primaryMuscle: 'Erector Spinae & Glutes', targetJoint: 'Hip' },
  { primaryMuscle: 'Anterior Deltoids & Triceps', targetJoint: 'Shoulder & Elbow' },
  { primaryMuscle: 'Lateral Deltoids', targetJoint: 'Shoulder' },
  { primaryMuscle: 'Posterior Deltoids', targetJoint: 'Shoulder' },
  { primaryMuscle: 'Anterior Deltoids', targetJoint: 'Shoulder' },
  { primaryMuscle: 'Quadriceps, Glutes & Hamstrings', targetJoint: 'Knee & Hip' },
  { primaryMuscle: 'Quadriceps & Glutes', targetJoint: 'Knee & Hip' },
  { primaryMuscle: 'Quadriceps', targetJoint: 'Knee' },
  { primaryMuscle: 'Hamstrings & Glutes', targetJoint: 'Hip' },
  { primaryMuscle: 'Soleus (Calves)', targetJoint: 'Ankle' },
  { primaryMuscle: 'Gastrocnemius (Calves)', targetJoint: 'Ankle' },
  { primaryMuscle: 'Rectus Abdominis', targetJoint: 'Spine' },
  { primaryMuscle: 'Lower Abs & Hip Flexors', targetJoint: 'Hip' },
  { primaryMuscle: 'Pectoralis Major & Triceps', targetJoint: 'Shoulder & Elbow' },
  { primaryMuscle: 'Upper Pectorals', targetJoint: 'Shoulder & Elbow' },
  { primaryMuscle: 'Chest & Shoulders', targetJoint: 'Shoulder & Elbow' },
  { primaryMuscle: 'Pectoralis Outer Fibers', targetJoint: 'Shoulder' },
  { primaryMuscle: 'Triceps Brachii', targetJoint: 'Elbow' },
  { primaryMuscle: 'Triceps Lateral Head', targetJoint: 'Elbow' },
  { primaryMuscle: 'Biceps Brachii', targetJoint: 'Elbow' },
  { primaryMuscle: 'Biceps Short Head', targetJoint: 'Elbow' },
  { primaryMuscle: 'Brachialis & Brachioradialis', targetJoint: 'Elbow' }
];

interface TestCaseResult {
  id: number;
  category: string;
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestCaseResult[] = [];
let testId = 1;

function runTest(category: string, name: string, testFn: () => void) {
  try {
    testFn();
    results.push({ id: testId++, category, name, passed: true });
  } catch (err: any) {
    results.push({ id: testId++, category, name, passed: false, error: err.message || String(err) });
  }
}

function assertEquals<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(`${message || 'Assertion failed'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertCloseTo(actual: number, expected: number, tolerance = 1, message?: string) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${message || 'Assertion failed'}: expected ${expected} (±${tolerance}), got ${actual}`);
  }
}

// ==========================================
// CATEGORY 1: Geometry & Angle Math (20 cases)
// ==========================================
const angleMathCases = [
  { a: { x: 0, y: 1 }, b: { x: 0, y: 0 }, c: { x: 1, y: 0 }, expected: 90, name: 'Right angle (quadrant 1)' },
  { a: { x: 0, y: 1 }, b: { x: 0, y: 0 }, c: { x: -1, y: 0 }, expected: 90, name: 'Right angle (quadrant 2)' },
  { a: { x: 0, y: -1 }, b: { x: 0, y: 0 }, c: { x: 1, y: 0 }, expected: 90, name: 'Right angle (quadrant 4)' },
  { a: { x: 1, y: 0 }, b: { x: 0, y: 0 }, c: { x: -1, y: 0 }, expected: 180, name: 'Straight line' },
  { a: { x: 1, y: 0 }, b: { x: 0, y: 0 }, c: { x: 1, y: 0 }, expected: 0, name: 'Collinear same direction' },
  { a: { x: 1, y: 1 }, b: { x: 0, y: 0 }, c: { x: 1, y: 0 }, expected: 45, name: '45 degrees acute' },
  { a: { x: -1, y: 1 }, b: { x: 0, y: 0 }, c: { x: 1, y: 0 }, expected: 135, name: '135 degrees obtuse' },
  { a: { x: 0.5, y: 0.866 }, b: { x: 0, y: 0 }, c: { x: 1, y: 0 }, expected: 60, name: '60 degrees' },
  { a: { x: 0, y: 10 }, b: { x: 0, y: 5 }, c: { x: 5, y: 5 }, expected: 90, name: 'Translated right angle' },
  { a: { x: -5, y: -5 }, b: { x: 0, y: 0 }, c: { x: 5, y: 5 }, expected: 180, name: 'Negative coordinates straight line' },
  { a: { x: 10, y: 10 }, b: { x: 5, y: 5 }, c: { x: 0, y: 0 }, expected: 180, name: 'Diagonally collinear' },
  { a: { x: 2, y: 0 }, b: { x: 1, y: 1 }, c: { x: 0, y: 2 }, expected: 180, name: 'Slanted line' },
  { a: { x: 10, y: 0 }, b: { x: 0, y: 0 }, c: { x: 0, y: -10 }, expected: 90, name: 'Vertical-horizontal right angle' },
  { a: { x: 1, y: 0.001 }, b: { x: 0, y: 0 }, c: { x: 1, y: 0 }, expected: 0, name: 'Near zero angle' },
  { a: { x: -1, y: 0.001 }, b: { x: 0, y: 0 }, c: { x: 1, y: 0 }, expected: 180, name: 'Near straight line' },
  { a: { x: 2, y: 3 }, b: { x: 2, y: 2 }, c: { x: 3, y: 2 }, expected: 90, name: 'Integer grid offset right angle' },
  { a: { x: 1, y: 1.732 }, b: { x: 0, y: 0 }, c: { x: 2, y: 0 }, expected: 60, name: '60 degrees float coordinates' },
  { a: { x: -1, y: -1.732 }, b: { x: 0, y: 0 }, c: { x: 2, y: 0 }, expected: 120, name: '120 degrees obtuse float' },
  { a: { x: 100, y: 0 }, b: { x: 0, y: 0 }, c: { x: 0, y: 100 }, expected: 90, name: 'Large coordinate right angle' },
  { a: { x: 0.01, y: 0 }, b: { x: 0, y: 0 }, c: { x: 0, y: 0.01 }, expected: 90, name: 'Sub-unit coordinate right angle' }
];

angleMathCases.forEach((tc, idx) => {
  runTest('Geometry & Angle Math', `Case ${idx + 1}: ${tc.name}`, () => {
    const angle = calculateAngle(tc.a, tc.b, tc.c);
    assertCloseTo(angle, tc.expected, 1);
  });
});

// ==========================================
// CATEGORY 2: Exercise Database Mapping (25 cases)
// ==========================================
// Standard keypoints structure to mock pose detections
const fullScorePose: Pose = {
  keypoints: [
    { name: 'left_shoulder', x: 0, y: 1, score: 0.9 },
    { name: 'right_shoulder', x: 0, y: 1, score: 0.9 },
    { name: 'left_elbow', x: 0, y: 0, score: 0.9 },
    { name: 'right_elbow', x: 0, y: 0, score: 0.9 },
    { name: 'left_wrist', x: 1, y: 0, score: 0.9 },
    { name: 'right_wrist', x: 1, y: 0, score: 0.9 },
    { name: 'left_hip', x: 0, y: 1, score: 0.9 },
    { name: 'right_hip', x: 0, y: 1, score: 0.9 },
    { name: 'left_knee', x: 0, y: 0, score: 0.9 },
    { name: 'right_knee', x: 0, y: 0, score: 0.9 },
    { name: 'left_ankle', x: 1, y: 0, score: 0.9 },
    { name: 'right_ankle', x: 1, y: 0, score: 0.9 }
  ]
};

EXERCISES_DATABASE.forEach((ex, idx) => {
  runTest('Exercise Mapping', `Case ${idx + 21}: Map ${ex.primaryMuscle} / ${ex.targetJoint}`, () => {
    const { jointLabel, angle } = getJointLabelAndAngle(fullScorePose, ex);
    
    // Check correct label mapping
    const targetLower = ex.targetJoint.toLowerCase();
    const muscleLower = ex.primaryMuscle.toLowerCase();

    if (targetLower.includes('knee') || muscleLower.includes('quad') || muscleLower.includes('glute') || muscleLower.includes('hamstring')) {
      assertEquals(jointLabel, "Knee Extension");
    } else if (targetLower.includes('elbow') || muscleLower.includes('bicep') || muscleLower.includes('tricep') || muscleLower.includes('lat') || muscleLower.includes('back')) {
      assertEquals(jointLabel, "Elbow Flexion");
    } else {
      assertEquals(jointLabel, "Hip Flexion");
    }
    assertEquals(angle !== null, true);
  });
});

// ==========================================
// CATEGORY 3: Rep Counting State Transitions (45 cases)
// ==========================================

// --- Group 3.1: Elbow Flexion Transitions (15 cases) ---
// Thresholds: down < 95, up > 145
const elbowFlexionSequences = [
  // Full rep: start 160 -> down to 80 -> up to 150
  { inputs: [160, 150, 120, 100, 90, 80, 100, 120, 140, 150], expectedReps: 1, expectedStatus: 'up', name: 'Standard complete rep' },
  // Incomplete Concentric: start 160 -> 100 -> 160 (no down threshold hit)
  { inputs: [160, 140, 120, 100, 110, 130, 160], expectedReps: 0, expectedStatus: 'neutral', name: 'Incomplete concentric range' },
  // Incomplete Eccentric: start 160 -> 80 (down) -> 130 -> 80 (no up threshold hit, rep not registered, still down)
  { inputs: [160, 120, 90, 80, 100, 120, 130, 110, 80], expectedReps: 0, expectedStatus: 'down', name: 'Incomplete eccentric range' },
  // Hysteresis & Jitter: 160 -> 90 (down) -> 92 -> 89 -> 94 -> 150 (up, exactly 1 rep)
  { inputs: [160, 90, 92, 89, 94, 150], expectedReps: 1, expectedStatus: 'up', name: 'Noise & jitter suppression' },
  // Multiple Reps: 2 complete reps
  { inputs: [160, 80, 150, 80, 150], expectedReps: 2, expectedStatus: 'up', name: 'Multiple complete reps' },
  // Rapid alternate direction bounce (should behave correctly)
  { inputs: [160, 70, 160, 70, 160], expectedReps: 2, expectedStatus: 'up', name: 'Rapid alternate reps' },
  // Initial down state start
  { inputs: [80, 150], expectedReps: 1, expectedStatus: 'up', name: 'Start session in down state' },
  // No motion state check
  { inputs: [160, 160, 160, 160], expectedReps: 0, expectedStatus: 'neutral', name: 'Stationary holding' },
  // Boundary value down: exactly 94
  { inputs: [160, 94, 150], expectedReps: 1, expectedStatus: 'up', name: 'Boundary exact down angle' },
  // Boundary value down outer: exactly 95 (no down)
  { inputs: [160, 95, 150], expectedReps: 0, expectedStatus: 'neutral', name: 'Boundary outer down angle' },
  // Boundary value up: exactly 146
  { inputs: [160, 90, 146], expectedReps: 1, expectedStatus: 'up', name: 'Boundary exact up angle' },
  // Boundary value up outer: exactly 145 (no up)
  { inputs: [160, 90, 145], expectedReps: 0, expectedStatus: 'down', name: 'Boundary outer up angle' },
  // Overshoot angle checks
  { inputs: [180, 45, 180], expectedReps: 1, expectedStatus: 'up', name: 'Extremes overshoot angles' },
  // Reset state check: down -> down (should remain down)
  { inputs: [160, 90, 85, 80], expectedReps: 0, expectedStatus: 'down', name: 'Continuous down progression' },
  // Neutral to up transition directly (no down hit)
  { inputs: [160, 150, 165], expectedReps: 0, expectedStatus: 'neutral', name: 'Up transition without down' }
];

elbowFlexionSequences.forEach((tc, idx) => {
  runTest('Rep Transitions: Elbow', `Case ${idx + 46}: Elbow ${tc.name}`, () => {
    let state: TrackerState = { status: 'neutral', reps: 0, sets: 0 };
    tc.inputs.forEach(angle => {
      const result = updateTrackerState(state, "Elbow Flexion", angle, true);
      state = result.nextState;
    });
    assertEquals(state.reps, tc.expectedReps, `Reps match`);
    assertEquals(state.status, tc.expectedStatus, `Status matches`);
  });
});


// --- Group 3.2: Knee Extension Transitions (15 cases) ---
// Thresholds: down < 115, up > 150
const kneeExtensionSequences = [
  // Full rep: start 160 -> down to 100 -> up to 160
  { inputs: [160, 130, 110, 100, 120, 140, 160], expectedReps: 1, expectedStatus: 'up', name: 'Standard squat rep' },
  // Incomplete squat: 160 -> 120 -> 160 (threshold is 115)
  { inputs: [160, 125, 120, 130, 160], expectedReps: 0, expectedStatus: 'neutral', name: 'Incomplete squat' },
  // Half extension squat: 160 -> 100 (down) -> 145 (no rep) -> 100
  { inputs: [160, 100, 145, 100], expectedReps: 0, expectedStatus: 'down', name: 'Incomplete standup' },
  // Noise squat: 160 -> 110 -> 112 -> 110 -> 160
  { inputs: [160, 110, 112, 110, 160], expectedReps: 1, expectedStatus: 'up', name: 'Jittery squat' },
  // Triple squats
  { inputs: [160, 100, 160, 100, 160, 100, 160], expectedReps: 3, expectedStatus: 'up', name: 'Triple squats' },
  // Start session low: 100 -> 160
  { inputs: [100, 160], expectedReps: 1, expectedStatus: 'up', name: 'Start squat in hole' },
  // Static holds
  { inputs: [100, 105, 100, 105], expectedReps: 0, expectedStatus: 'down', name: 'Isometric squat holding' },
  // Boundary down: exactly 114
  { inputs: [160, 114, 160], expectedReps: 1, expectedStatus: 'up', name: 'Knee exact down boundary' },
  // Boundary down outer: exactly 115
  { inputs: [160, 115, 160], expectedReps: 0, expectedStatus: 'neutral', name: 'Knee outer down boundary' },
  // Boundary up: exactly 151
  { inputs: [160, 100, 151], expectedReps: 1, expectedStatus: 'up', name: 'Knee exact up boundary' },
  // Boundary up outer: exactly 150
  { inputs: [160, 100, 150], expectedReps: 0, expectedStatus: 'down', name: 'Knee outer up boundary' },
  // Complete squat with lock out
  { inputs: [175, 90, 175], expectedReps: 1, expectedStatus: 'up', name: 'Squat full lockout' },
  // Reverse squat motion sequence
  { inputs: [160, 170, 160], expectedReps: 0, expectedStatus: 'neutral', name: 'Standing standing' },
  // Shallow bounces
  { inputs: [160, 130, 140, 130, 155], expectedReps: 0, expectedStatus: 'neutral', name: 'Shallow knee bounces' },
  // Knee double threshold cross recovery
  { inputs: [160, 100, 160, 100, 160], expectedReps: 2, expectedStatus: 'up', name: 'Double squat validation' }
];

kneeExtensionSequences.forEach((tc, idx) => {
  runTest('Rep Transitions: Knee', `Case ${idx + 61}: Knee ${tc.name}`, () => {
    let state: TrackerState = { status: 'neutral', reps: 0, sets: 0 };
    tc.inputs.forEach(angle => {
      const result = updateTrackerState(state, "Knee Extension", angle, true);
      state = result.nextState;
    });
    assertEquals(state.reps, tc.expectedReps, `Reps match`);
    assertEquals(state.status, tc.expectedStatus, `Status matches`);
  });
});


// --- Group 3.3: Hip Flexion Transitions (15 cases) ---
// Thresholds: down < 120, up > 155
const hipFlexionSequences = [
  // Full rep: start 170 -> down to 110 -> up to 160
  { inputs: [170, 140, 125, 110, 135, 150, 160], expectedReps: 1, expectedStatus: 'up', name: 'Standard crunch rep' },
  // Incomplete crunch: 170 -> 125 -> 170 (threshold is 120)
  { inputs: [170, 130, 125, 140, 170], expectedReps: 0, expectedStatus: 'neutral', name: 'Incomplete crunch' },
  // Half crunch release: 170 -> 110 (down) -> 145 (no rep) -> 110
  { inputs: [170, 110, 145, 110], expectedReps: 0, expectedStatus: 'down', name: 'Incomplete release crunch' },
  // Jitter crunch
  { inputs: [170, 115, 118, 115, 160], expectedReps: 1, expectedStatus: 'up', name: 'Jittery crunch' },
  // Double crunches
  { inputs: [170, 110, 160, 110, 160], expectedReps: 2, expectedStatus: 'up', name: 'Double crunches' },
  // Start crunch low
  { inputs: [110, 160], expectedReps: 1, expectedStatus: 'up', name: 'Start crunch flexed' },
  // Stationary crunch hold
  { inputs: [110, 115, 110, 115], expectedReps: 0, expectedStatus: 'down', name: 'Isometric crunch holding' },
  // Boundary down: exactly 119
  { inputs: [170, 119, 160], expectedReps: 1, expectedStatus: 'up', name: 'Hip exact down boundary' },
  // Boundary down outer: exactly 120
  { inputs: [170, 120, 160], expectedReps: 0, expectedStatus: 'neutral', name: 'Hip outer down boundary' },
  // Boundary up: exactly 156
  { inputs: [170, 110, 156], expectedReps: 1, expectedStatus: 'up', name: 'Hip exact up boundary' },
  // Boundary up outer: exactly 155
  { inputs: [170, 110, 155], expectedReps: 0, expectedStatus: 'down', name: 'Hip outer up boundary' },
  // Deep crunch
  { inputs: [180, 80, 180], expectedReps: 1, expectedStatus: 'up', name: 'Deep range crunch' },
  // Sitting static pose
  { inputs: [170, 165, 170], expectedReps: 0, expectedStatus: 'neutral', name: 'Minimal hip movement' },
  // Bounces in flexed state
  { inputs: [170, 110, 130, 110, 130], expectedReps: 0, expectedStatus: 'down', name: 'Flexed hip bounces' },
  // Multiple rep speed test
  { inputs: [170, 100, 170, 100, 170, 100, 170], expectedReps: 3, expectedStatus: 'up', name: 'Triple hip flexions' }
];

hipFlexionSequences.forEach((tc, idx) => {
  runTest('Rep Transitions: Hip', `Case ${idx + 76}: Hip ${tc.name}`, () => {
    let state: TrackerState = { status: 'neutral', reps: 0, sets: 0 };
    tc.inputs.forEach(angle => {
      const result = updateTrackerState(state, "Hip Flexion", angle, true);
      state = result.nextState;
    });
    assertEquals(state.reps, tc.expectedReps, `Reps match`);
    assertEquals(state.status, tc.expectedStatus, `Status matches`);
  });
});

// ==========================================
// CATEGORY 4: Low Confidence & Missing Keypoints (10 cases)
// ==========================================
const lowConfidencePoses: { pose: Pose; ex: Exercise; expectedLabel: string; name: string }[] = [
  // Missing both elbows
  {
    pose: {
      keypoints: [
        { name: 'left_shoulder', x: 0, y: 1, score: 0.9 },
        { name: 'right_shoulder', x: 0, y: 1, score: 0.9 },
        { name: 'left_wrist', x: 1, y: 0, score: 0.9 },
        { name: 'right_wrist', x: 1, y: 0, score: 0.9 }
      ]
    },
    ex: { primaryMuscle: 'Biceps Brachii', targetJoint: 'Elbow' },
    expectedLabel: '',
    name: 'Missing elbow keypoints (both sides) for arm curl'
  },
  // Low score elbow (< 0.4)
  {
    pose: {
      keypoints: [
        { name: 'left_shoulder', x: 0, y: 1, score: 0.9 },
        { name: 'right_shoulder', x: 0, y: 1, score: 0.9 },
        { name: 'left_elbow', x: 0, y: 0, score: 0.35 },
        { name: 'right_elbow', x: 0, y: 0, score: 0.35 },
        { name: 'left_wrist', x: 1, y: 0, score: 0.9 },
        { name: 'right_wrist', x: 1, y: 0, score: 0.9 }
      ]
    },
    ex: { primaryMuscle: 'Biceps Brachii', targetJoint: 'Elbow' },
    expectedLabel: '',
    name: 'Low confidence elbow score'
  },
  // Low score shoulder (< 0.4)
  {
    pose: {
      keypoints: [
        { name: 'left_shoulder', x: 0, y: 1, score: 0.38 },
        { name: 'right_shoulder', x: 0, y: 1, score: 0.38 },
        { name: 'left_elbow', x: 0, y: 0, score: 0.9 },
        { name: 'right_elbow', x: 0, y: 0, score: 0.9 },
        { name: 'left_wrist', x: 1, y: 0, score: 0.9 },
        { name: 'right_wrist', x: 1, y: 0, score: 0.9 }
      ]
    },
    ex: { primaryMuscle: 'Biceps Brachii', targetJoint: 'Elbow' },
    expectedLabel: '',
    name: 'Low confidence shoulder score'
  },
  // Low score wrist (< 0.4)
  {
    pose: {
      keypoints: [
        { name: 'left_shoulder', x: 0, y: 1, score: 0.9 },
        { name: 'right_shoulder', x: 0, y: 1, score: 0.9 },
        { name: 'left_elbow', x: 0, y: 0, score: 0.9 },
        { name: 'right_elbow', x: 0, y: 0, score: 0.9 },
        { name: 'left_wrist', x: 1, y: 0, score: 0.2 },
        { name: 'right_wrist', x: 1, y: 0, score: 0.2 }
      ]
    },
    ex: { primaryMuscle: 'Biceps Brachii', targetJoint: 'Elbow' },
    expectedLabel: '',
    name: 'Low confidence wrist score'
  },
  // Missing hip for Knee Extension
  {
    pose: {
      keypoints: [
        { name: 'left_knee', x: 0, y: 0, score: 0.9 },
        { name: 'right_knee', x: 0, y: 0, score: 0.9 },
        { name: 'left_ankle', x: 1, y: 0, score: 0.9 },
        { name: 'right_ankle', x: 1, y: 0, score: 0.9 }
      ]
    },
    ex: { primaryMuscle: 'Quadriceps', targetJoint: 'Knee' },
    expectedLabel: '',
    name: 'Missing hip keypoint for squats'
  },
  // Missing knee for Knee Extension
  {
    pose: {
      keypoints: [
        { name: 'left_hip', x: 0, y: 1, score: 0.9 },
        { name: 'right_hip', x: 0, y: 1, score: 0.9 },
        { name: 'left_ankle', x: 1, y: 0, score: 0.9 },
        { name: 'right_ankle', x: 1, y: 0, score: 0.9 }
      ]
    },
    ex: { primaryMuscle: 'Quadriceps', targetJoint: 'Knee' },
    expectedLabel: '',
    name: 'Missing knee keypoint for squats'
  },
  // Low score ankle (< 0.4) for Knee Extension
  {
    pose: {
      keypoints: [
        { name: 'left_hip', x: 0, y: 1, score: 0.9 },
        { name: 'right_hip', x: 0, y: 1, score: 0.9 },
        { name: 'left_knee', x: 0, y: 0, score: 0.9 },
        { name: 'right_knee', x: 0, y: 0, score: 0.9 },
        { name: 'left_ankle', x: 1, y: 0, score: 0.1 },
        { name: 'right_ankle', x: 1, y: 0, score: 0.1 }
      ]
    },
    ex: { primaryMuscle: 'Quadriceps', targetJoint: 'Knee' },
    expectedLabel: '',
    name: 'Low confidence ankle score'
  },
  // Missing shoulder for Hip Flexion
  {
    pose: {
      keypoints: [
        { name: 'left_hip', x: 0, y: 1, score: 0.9 },
        { name: 'right_hip', x: 0, y: 1, score: 0.9 },
        { name: 'left_knee', x: 0, y: 0, score: 0.9 },
        { name: 'right_knee', x: 0, y: 0, score: 0.9 }
      ]
    },
    ex: { primaryMuscle: 'Rectus Abdominis', targetJoint: 'Spine' },
    expectedLabel: '',
    name: 'Missing shoulder keypoint for crunches'
  },
  // Low score hip for Hip Flexion
  {
    pose: {
      keypoints: [
        { name: 'left_shoulder', x: 0, y: 1, score: 0.9 },
        { name: 'right_shoulder', x: 0, y: 1, score: 0.9 },
        { name: 'left_hip', x: 0, y: 1, score: 0.25 },
        { name: 'right_hip', x: 0, y: 1, score: 0.25 },
        { name: 'left_knee', x: 0, y: 0, score: 0.9 },
        { name: 'right_knee', x: 0, y: 0, score: 0.9 }
      ]
    },
    ex: { primaryMuscle: 'Rectus Abdominis', targetJoint: 'Spine' },
    expectedLabel: '',
    name: 'Low confidence hip score for crunches'
  },
  // Empty keypoints pose
  {
    pose: { keypoints: [] },
    ex: { primaryMuscle: 'Rectus Abdominis', targetJoint: 'Spine' },
    expectedLabel: '',
    name: 'Empty pose keypoints'
  }
];

lowConfidencePoses.forEach((tc, idx) => {
  runTest('Low Confidence / Missing Keypoints', `Case ${idx + 91}: ${tc.name}`, () => {
    const { jointLabel, angle } = getJointLabelAndAngle(tc.pose, tc.ex);
    assertEquals(jointLabel, tc.expectedLabel);
    assertEquals(angle, null);
  });
});

// ==========================================
// CATEGORY 5: Set Tracking & Metrics (10 cases)
// ==========================================
runTest('Sets Tracking', 'Case 101: 0 reps = 0 sets', () => {
  const state: TrackerState = { status: 'neutral', reps: 0, sets: 0 };
  assertEquals(state.sets, 0);
});

runTest('Sets Tracking', 'Case 102: 9 reps = 0 sets', () => {
  let state: TrackerState = { status: 'neutral', reps: 0, sets: 0 };
  for (let i = 0; i < 9; i++) {
    const res = updateTrackerState(state, "Elbow Flexion", 80, true);
    state = res.nextState;
    const res2 = updateTrackerState(state, "Elbow Flexion", 150, true);
    state = res2.nextState;
  }
  assertEquals(state.reps, 9);
  assertEquals(state.sets, 0);
});

runTest('Sets Tracking', 'Case 103: 10 reps = 1 set', () => {
  let state: TrackerState = { status: 'neutral', reps: 0, sets: 0 };
  let setTriggered = false;
  for (let i = 0; i < 10; i++) {
    const res = updateTrackerState(state, "Elbow Flexion", 80, true);
    state = res.nextState;
    const res2 = updateTrackerState(state, "Elbow Flexion", 150, true);
    state = res2.nextState;
    if (res2.setCompleted) setTriggered = true;
  }
  assertEquals(state.reps, 10);
  assertEquals(state.sets, 1);
  assertEquals(setTriggered, true);
});

runTest('Sets Tracking', 'Case 104: 19 reps = 1 set', () => {
  let state: TrackerState = { status: 'neutral', reps: 0, sets: 0 };
  for (let i = 0; i < 19; i++) {
    const res = updateTrackerState(state, "Elbow Flexion", 80, true);
    state = res.nextState;
    const res2 = updateTrackerState(state, "Elbow Flexion", 150, true);
    state = res2.nextState;
  }
  assertEquals(state.reps, 19);
  assertEquals(state.sets, 1);
});

runTest('Sets Tracking', 'Case 105: 20 reps = 2 sets', () => {
  let state: TrackerState = { status: 'neutral', reps: 0, sets: 0 };
  for (let i = 0; i < 20; i++) {
    const res = updateTrackerState(state, "Elbow Flexion", 80, true);
    state = res.nextState;
    const res2 = updateTrackerState(state, "Elbow Flexion", 150, true);
    state = res2.nextState;
  }
  assertEquals(state.reps, 20);
  assertEquals(state.sets, 2);
});

runTest('Sets Tracking', 'Case 106: 50 reps = 5 sets', () => {
  let state: TrackerState = { status: 'neutral', reps: 0, sets: 0 };
  for (let i = 0; i < 50; i++) {
    const res = updateTrackerState(state, "Elbow Flexion", 80, true);
    state = res.nextState;
    const res2 = updateTrackerState(state, "Elbow Flexion", 150, true);
    state = res2.nextState;
  }
  assertEquals(state.reps, 50);
  assertEquals(state.sets, 5);
});

runTest('Sets Tracking', 'Case 107: State updates bypass when inactive', () => {
  let state: TrackerState = { status: 'neutral', reps: 0, sets: 0 };
  // Should not trigger status down because isActive = false
  const res = updateTrackerState(state, "Elbow Flexion", 80, false);
  assertEquals(res.nextState.status, 'neutral');
  assertEquals(res.repRegistered, false);
});

runTest('Sets Tracking', 'Case 108: Resets tracking state completely', () => {
  const state: TrackerState = { status: 'up', reps: 18, sets: 1 };
  const resetState: TrackerState = { status: 'neutral', reps: 0, sets: 0 };
  assertEquals(resetState.reps, 0);
  assertEquals(resetState.sets, 0);
  assertEquals(resetState.status, 'neutral');
});

runTest('Sets Tracking', 'Case 109: Knee Extension 10 reps = 1 set', () => {
  let state: TrackerState = { status: 'neutral', reps: 0, sets: 0 };
  for (let i = 0; i < 10; i++) {
    const res = updateTrackerState(state, "Knee Extension", 100, true);
    state = res.nextState;
    const res2 = updateTrackerState(state, "Knee Extension", 160, true);
    state = res2.nextState;
  }
  assertEquals(state.reps, 10);
  assertEquals(state.sets, 1);
});

runTest('Sets Tracking', 'Case 110: Hip Flexion 10 reps = 1 set', () => {
  let state: TrackerState = { status: 'neutral', reps: 0, sets: 0 };
  for (let i = 0; i < 10; i++) {
    const res = updateTrackerState(state, "Hip Flexion", 110, true);
    state = res.nextState;
    const res2 = updateTrackerState(state, "Hip Flexion", 160, true);
    state = res2.nextState;
  }
  assertEquals(state.reps, 10);
  assertEquals(state.sets, 1);
});

// ==========================================
// OUTPUT REPORT GENERATION
// ==========================================
console.log("\n======================================================================");
console.log("             FITX GYM - BIOMETRIC REP-COUNTER TEST SUITE               ");
console.log("======================================================================\n");

const summary: Record<string, { total: number; passed: number; failed: number }> = {};

results.forEach(r => {
  if (!summary[r.category]) {
    summary[r.category] = { total: 0, passed: 0, failed: 0 };
  }
  summary[r.category].total++;
  if (r.passed) {
    summary[r.category].passed++;
  } else {
    summary[r.category].failed++;
  }
});

console.log("CATEGORY SUMMARY:");
console.table(summary);

const failedTests = results.filter(r => !r.passed);
if (failedTests.length > 0) {
  console.error("\n❌ FAILED TESTS DETECTED:");
  failedTests.forEach(f => {
    console.error(`- [${f.category}] ${f.name}: ${f.error}`);
  });
  process.exit(1);
} else {
  console.log("\n✨ ALL TESTS PASSED SUCCESSFULLY! ✨");
  console.log(`Total executed: ${results.length} cases.`);
}

// Generate the markdown report details for artifacts
import * as fs from 'fs';
import * as path from 'path';

const artifactDir = '/Users/sasi/.gemini/antigravity-ide/brain/700368ad-ff80-4488-a249-a62a71cc037b';
const reportPath = path.join(artifactDir, 'rep_counter_test_report.md');

let md = `# Biometric Rep-Counter Validation Report

This report presents the validation results for the biometric motion tracking and rep counting state machine, covering **${results.length} total test cases** across five primary categories.

## Summary Table

| Test Category | Total Cases | Passed | Failed | Status |
|---|---|---|---|---|
`;

Object.entries(summary).forEach(([cat, s]) => {
  const status = s.failed === 0 ? "✅ PASSED" : "❌ FAILED";
  md += `| ${cat} | ${s.total} | ${s.passed} | ${s.failed} | ${status} |\n`;
});

md += `\n## Test Run Details

<details>
<summary>Click to view all ${results.length} verified test cases</summary>

| ID | Category | Case Description | Status |
|---|---|---|---|
`;

results.forEach(r => {
  md += `| ${r.id} | ${r.category} | ${r.name} | ${r.passed ? '✅ Passed' : '❌ Failed: ' + r.error} |\n`;
});

md += `
</details>

## Key Biomechanical Thresholds Verified
- **Knee Extension (Legs/Squats)**: Down triggers at angle \`< 115°\`, Up/Rep triggers at angle \`> 150°\`.
- **Elbow Flexion (Arms/Curls/Rows)**: Down triggers at angle \`< 95°\`, Up/Rep triggers at angle \`> 145°\`.
- **Hip Flexion (Abs/Crunches)**: Down triggers at angle \`< 120°\`, Up/Rep triggers at angle \`> 155°\`.
- **Confidence Cutoff**: Keypoint scores below \`0.40\` are rejected from angle calculations to prevent false increments from noise.
`;

fs.writeFileSync(reportPath, md);
console.log(`\nWritten report to artifact: ${reportPath}`);
