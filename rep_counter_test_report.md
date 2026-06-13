# Biometric Rep-Counter Validation Report

This report presents the validation results for the biometric motion tracking and rep counting state machine, covering **110 total test cases** across five primary categories.

## Summary Table

| Test Category | Total Cases | Passed | Failed | Status |
|---|---|---|---|---|
| Geometry & Angle Math | 20 | 20 | 0 | ✅ PASSED |
| Exercise Mapping | 25 | 25 | 0 | ✅ PASSED |
| Rep Transitions: Elbow | 15 | 15 | 0 | ✅ PASSED |
| Rep Transitions: Knee | 15 | 15 | 0 | ✅ PASSED |
| Rep Transitions: Hip | 15 | 15 | 0 | ✅ PASSED |
| Low Confidence / Missing Keypoints | 10 | 10 | 0 | ✅ PASSED |
| Sets Tracking | 10 | 10 | 0 | ✅ PASSED |

## Test Run Details

<details>
<summary>Click to view all 110 verified test cases</summary>

| ID | Category | Case Description | Status |
|---|---|---|---|
| 1 | Geometry & Angle Math | Case 1: Right angle (quadrant 1) | ✅ Passed |
| 2 | Geometry & Angle Math | Case 2: Right angle (quadrant 2) | ✅ Passed |
| 3 | Geometry & Angle Math | Case 3: Right angle (quadrant 4) | ✅ Passed |
| 4 | Geometry & Angle Math | Case 4: Straight line | ✅ Passed |
| 5 | Geometry & Angle Math | Case 5: Collinear same direction | ✅ Passed |
| 6 | Geometry & Angle Math | Case 6: 45 degrees acute | ✅ Passed |
| 7 | Geometry & Angle Math | Case 7: 135 degrees obtuse | ✅ Passed |
| 8 | Geometry & Angle Math | Case 8: 60 degrees | ✅ Passed |
| 9 | Geometry & Angle Math | Case 9: Translated right angle | ✅ Passed |
| 10 | Geometry & Angle Math | Case 10: Negative coordinates straight line | ✅ Passed |
| 11 | Geometry & Angle Math | Case 11: Diagonally collinear | ✅ Passed |
| 12 | Geometry & Angle Math | Case 12: Slanted line | ✅ Passed |
| 13 | Geometry & Angle Math | Case 13: Vertical-horizontal right angle | ✅ Passed |
| 14 | Geometry & Angle Math | Case 14: Near zero angle | ✅ Passed |
| 15 | Geometry & Angle Math | Case 15: Near straight line | ✅ Passed |
| 16 | Geometry & Angle Math | Case 16: Integer grid offset right angle | ✅ Passed |
| 17 | Geometry & Angle Math | Case 17: 60 degrees float coordinates | ✅ Passed |
| 18 | Geometry & Angle Math | Case 18: 120 degrees obtuse float | ✅ Passed |
| 19 | Geometry & Angle Math | Case 19: Large coordinate right angle | ✅ Passed |
| 20 | Geometry & Angle Math | Case 20: Sub-unit coordinate right angle | ✅ Passed |
| 21 | Exercise Mapping | Case 21: Map Lats & Upper Back / Elbow & Shoulder | ✅ Passed |
| 22 | Exercise Mapping | Case 22: Map Latissimus Dorsi / Elbow & Shoulder | ✅ Passed |
| 23 | Exercise Mapping | Case 23: Map Middle Back / Elbow | ✅ Passed |
| 24 | Exercise Mapping | Case 24: Map Erector Spinae & Glutes / Hip | ✅ Passed |
| 25 | Exercise Mapping | Case 25: Map Anterior Deltoids & Triceps / Shoulder & Elbow | ✅ Passed |
| 26 | Exercise Mapping | Case 26: Map Lateral Deltoids / Shoulder | ✅ Passed |
| 27 | Exercise Mapping | Case 27: Map Posterior Deltoids / Shoulder | ✅ Passed |
| 28 | Exercise Mapping | Case 28: Map Anterior Deltoids / Shoulder | ✅ Passed |
| 29 | Exercise Mapping | Case 29: Map Quadriceps, Glutes & Hamstrings / Knee & Hip | ✅ Passed |
| 30 | Exercise Mapping | Case 30: Map Quadriceps & Glutes / Knee & Hip | ✅ Passed |
| 31 | Exercise Mapping | Case 31: Map Quadriceps / Knee | ✅ Passed |
| 32 | Exercise Mapping | Case 32: Map Hamstrings & Glutes / Hip | ✅ Passed |
| 33 | Exercise Mapping | Case 33: Map Soleus (Calves) / Ankle | ✅ Passed |
| 34 | Exercise Mapping | Case 34: Map Gastrocnemius (Calves) / Ankle | ✅ Passed |
| 35 | Exercise Mapping | Case 35: Map Rectus Abdominis / Spine | ✅ Passed |
| 36 | Exercise Mapping | Case 36: Map Lower Abs & Hip Flexors / Hip | ✅ Passed |
| 37 | Exercise Mapping | Case 37: Map Pectoralis Major & Triceps / Shoulder & Elbow | ✅ Passed |
| 38 | Exercise Mapping | Case 38: Map Upper Pectorals / Shoulder & Elbow | ✅ Passed |
| 39 | Exercise Mapping | Case 39: Map Chest & Shoulders / Shoulder & Elbow | ✅ Passed |
| 40 | Exercise Mapping | Case 40: Map Pectoralis Outer Fibers / Shoulder | ✅ Passed |
| 41 | Exercise Mapping | Case 41: Map Triceps Brachii / Elbow | ✅ Passed |
| 42 | Exercise Mapping | Case 42: Map Triceps Lateral Head / Elbow | ✅ Passed |
| 43 | Exercise Mapping | Case 43: Map Biceps Brachii / Elbow | ✅ Passed |
| 44 | Exercise Mapping | Case 44: Map Biceps Short Head / Elbow | ✅ Passed |
| 45 | Exercise Mapping | Case 45: Map Brachialis & Brachioradialis / Elbow | ✅ Passed |
| 46 | Rep Transitions: Elbow | Case 46: Elbow Standard complete rep | ✅ Passed |
| 47 | Rep Transitions: Elbow | Case 47: Elbow Incomplete concentric range | ✅ Passed |
| 48 | Rep Transitions: Elbow | Case 48: Elbow Incomplete eccentric range | ✅ Passed |
| 49 | Rep Transitions: Elbow | Case 49: Elbow Noise & jitter suppression | ✅ Passed |
| 50 | Rep Transitions: Elbow | Case 50: Elbow Multiple complete reps | ✅ Passed |
| 51 | Rep Transitions: Elbow | Case 51: Elbow Rapid alternate reps | ✅ Passed |
| 52 | Rep Transitions: Elbow | Case 52: Elbow Start session in down state | ✅ Passed |
| 53 | Rep Transitions: Elbow | Case 53: Elbow Stationary holding | ✅ Passed |
| 54 | Rep Transitions: Elbow | Case 54: Elbow Boundary exact down angle | ✅ Passed |
| 55 | Rep Transitions: Elbow | Case 55: Elbow Boundary outer down angle | ✅ Passed |
| 56 | Rep Transitions: Elbow | Case 56: Elbow Boundary exact up angle | ✅ Passed |
| 57 | Rep Transitions: Elbow | Case 57: Elbow Boundary outer up angle | ✅ Passed |
| 58 | Rep Transitions: Elbow | Case 58: Elbow Extremes overshoot angles | ✅ Passed |
| 59 | Rep Transitions: Elbow | Case 59: Elbow Continuous down progression | ✅ Passed |
| 60 | Rep Transitions: Elbow | Case 60: Elbow Up transition without down | ✅ Passed |
| 61 | Rep Transitions: Knee | Case 61: Knee Standard squat rep | ✅ Passed |
| 62 | Rep Transitions: Knee | Case 62: Knee Incomplete squat | ✅ Passed |
| 63 | Rep Transitions: Knee | Case 63: Knee Incomplete standup | ✅ Passed |
| 64 | Rep Transitions: Knee | Case 64: Knee Jittery squat | ✅ Passed |
| 65 | Rep Transitions: Knee | Case 65: Knee Triple squats | ✅ Passed |
| 66 | Rep Transitions: Knee | Case 66: Knee Start squat in hole | ✅ Passed |
| 67 | Rep Transitions: Knee | Case 67: Knee Isometric squat holding | ✅ Passed |
| 68 | Rep Transitions: Knee | Case 68: Knee Knee exact down boundary | ✅ Passed |
| 69 | Rep Transitions: Knee | Case 69: Knee Knee outer down boundary | ✅ Passed |
| 70 | Rep Transitions: Knee | Case 70: Knee Knee exact up boundary | ✅ Passed |
| 71 | Rep Transitions: Knee | Case 71: Knee Knee outer up boundary | ✅ Passed |
| 72 | Rep Transitions: Knee | Case 72: Knee Squat full lockout | ✅ Passed |
| 73 | Rep Transitions: Knee | Case 73: Knee Standing standing | ✅ Passed |
| 74 | Rep Transitions: Knee | Case 74: Knee Shallow knee bounces | ✅ Passed |
| 75 | Rep Transitions: Knee | Case 75: Knee Double squat validation | ✅ Passed |
| 76 | Rep Transitions: Hip | Case 76: Hip Standard crunch rep | ✅ Passed |
| 77 | Rep Transitions: Hip | Case 77: Hip Incomplete crunch | ✅ Passed |
| 78 | Rep Transitions: Hip | Case 78: Hip Incomplete release crunch | ✅ Passed |
| 79 | Rep Transitions: Hip | Case 79: Hip Jittery crunch | ✅ Passed |
| 80 | Rep Transitions: Hip | Case 80: Hip Double crunches | ✅ Passed |
| 81 | Rep Transitions: Hip | Case 81: Hip Start crunch flexed | ✅ Passed |
| 82 | Rep Transitions: Hip | Case 82: Hip Isometric crunch holding | ✅ Passed |
| 83 | Rep Transitions: Hip | Case 83: Hip Hip exact down boundary | ✅ Passed |
| 84 | Rep Transitions: Hip | Case 84: Hip Hip outer down boundary | ✅ Passed |
| 85 | Rep Transitions: Hip | Case 85: Hip Hip exact up boundary | ✅ Passed |
| 86 | Rep Transitions: Hip | Case 86: Hip Hip outer up boundary | ✅ Passed |
| 87 | Rep Transitions: Hip | Case 87: Hip Deep range crunch | ✅ Passed |
| 88 | Rep Transitions: Hip | Case 88: Hip Minimal hip movement | ✅ Passed |
| 89 | Rep Transitions: Hip | Case 89: Hip Flexed hip bounces | ✅ Passed |
| 90 | Rep Transitions: Hip | Case 90: Hip Triple hip flexions | ✅ Passed |
| 91 | Low Confidence / Missing Keypoints | Case 91: Missing elbow keypoints (both sides) for arm curl | ✅ Passed |
| 92 | Low Confidence / Missing Keypoints | Case 92: Low confidence elbow score | ✅ Passed |
| 93 | Low Confidence / Missing Keypoints | Case 93: Low confidence shoulder score | ✅ Passed |
| 94 | Low Confidence / Missing Keypoints | Case 94: Low confidence wrist score | ✅ Passed |
| 95 | Low Confidence / Missing Keypoints | Case 95: Missing hip keypoint for squats | ✅ Passed |
| 96 | Low Confidence / Missing Keypoints | Case 96: Missing knee keypoint for squats | ✅ Passed |
| 97 | Low Confidence / Missing Keypoints | Case 97: Low confidence ankle score | ✅ Passed |
| 98 | Low Confidence / Missing Keypoints | Case 98: Missing shoulder keypoint for crunches | ✅ Passed |
| 99 | Low Confidence / Missing Keypoints | Case 99: Low confidence hip score for crunches | ✅ Passed |
| 100 | Low Confidence / Missing Keypoints | Case 100: Empty pose keypoints | ✅ Passed |
| 101 | Sets Tracking | Case 101: 0 reps = 0 sets | ✅ Passed |
| 102 | Sets Tracking | Case 102: 9 reps = 0 sets | ✅ Passed |
| 103 | Sets Tracking | Case 103: 10 reps = 1 set | ✅ Passed |
| 104 | Sets Tracking | Case 104: 19 reps = 1 set | ✅ Passed |
| 105 | Sets Tracking | Case 105: 20 reps = 2 sets | ✅ Passed |
| 106 | Sets Tracking | Case 106: 50 reps = 5 sets | ✅ Passed |
| 107 | Sets Tracking | Case 107: State updates bypass when inactive | ✅ Passed |
| 108 | Sets Tracking | Case 108: Resets tracking state completely | ✅ Passed |
| 109 | Sets Tracking | Case 109: Knee Extension 10 reps = 1 set | ✅ Passed |
| 110 | Sets Tracking | Case 110: Hip Flexion 10 reps = 1 set | ✅ Passed |

</details>

## Key Biomechanical Thresholds Verified
- **Knee Extension (Legs/Squats)**: Down triggers at angle `< 115°`, Up/Rep triggers at angle `> 150°`.
- **Elbow Flexion (Arms/Curls/Rows)**: Down triggers at angle `< 95°`, Up/Rep triggers at angle `> 145°`.
- **Hip Flexion (Abs/Crunches)**: Down triggers at angle `< 120°`, Up/Rep triggers at angle `> 155°`.
- **Confidence Cutoff**: Keypoint scores below `0.40` are rejected from angle calculations to prevent false increments from noise.
