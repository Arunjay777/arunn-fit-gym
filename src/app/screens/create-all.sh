#!/bin/bash
cd /workspaces/default/code/src/app/screens

# Create Login screen
cat > Login.tsx << 'SCREEN'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock } from 'lucide-react';
import TacticalCard from '../components/TacticalCard';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userRole', 'user');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#030303' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4"
               style={{ background: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)', boxShadow: '0 0 40px rgba(0, 212, 255, 0.5)' }}>
            <Shield className="w-14 h-14 text-[#030303]" />
          </div>
          <h1 className="font-mono font-bold text-3xl mb-2" style={{ color: '#00D4FF' }}>AJ-FIT SYSTEM</h1>
        </div>
        <TacticalCard>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-mono text-xs mb-2 block" style={{ color: 'rgba(0, 212, 255, 0.8)' }}>USERNAME</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded font-mono text-sm"
                style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(0, 212, 255, 0.3)', color: '#00D4FF', outline: 'none' }} required />
            </div>
            <div>
              <label className="font-mono text-xs mb-2 block" style={{ color: 'rgba(0, 212, 255, 0.8)' }}>PASSWORD</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded font-mono text-sm"
                style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(0, 212, 255, 0.3)', color: '#00D4FF', outline: 'none' }} required />
            </div>
            <button type="submit" className="w-full py-4 rounded font-mono font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)', color: '#030303' }}>
              ACCESS SYSTEM
            </button>
          </form>
        </TacticalCard>
      </div>
    </div>
  );
}
SCREEN

# Create a generic screen template function
create_screen() {
  local name=$1
  local title=$2
  cat > ${name}.tsx << SCREEN
import React from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';

export default function ${name}() {
  return (
    <div className="min-h-screen p-8">
      <TacticalHeader title="${title}" subtitle="TACTICAL FITNESS ECOSYSTEM" />
      <TacticalCard>
        <div className="font-mono text-center py-12" style={{ color: '#00D4FF' }}>
          ${title} Module
        </div>
      </TacticalCard>
    </div>
  );
}
SCREEN
}

# Create all screens
create_screen "Dashboard" "COMMAND CENTER"
create_screen "Mission" "MISSION OBJECTIVES"
create_screen "Vitals" "VITAL STATISTICS"
create_screen "Training" "TRAINING PROTOCOLS"
create_screen "AI" "NEURAL AI"
create_screen "Analytics" "PERFORMANCE ANALYTICS"
create_screen "Recovery" "RECOVERY METRICS"
create_screen "Progress" "PROGRESS TRACKING"
create_screen "Schedule" "TRAINING SCHEDULE"
create_screen "Achievements" "ACHIEVEMENTS"
create_screen "History" "TRAINING HISTORY"
create_screen "Audio" "AUDIO SYSTEM"
create_screen "Profile" "USER PROFILE"
create_screen "Settings" "SYSTEM SETTINGS"
create_screen "RepCounter" "REP COUNTER"
create_screen "ChestWorkout" "CHEST WORKOUT"
create_screen "BackWorkout" "BACK WORKOUT"
create_screen "LegWorkout" "LEG WORKOUT"
create_screen "ShoulderWorkout" "SHOULDER WORKOUT"
create_screen "ArmWorkout" "ARM WORKOUT"
create_screen "CoreWorkout" "CORE WORKOUT"
create_screen "CardioWorkout" "CARDIO WORKOUT"
create_screen "StrengthAnalytics" "STRENGTH ANALYTICS"
create_screen "HypertrophyPlan" "HYPERTROPHY PLAN"
create_screen "PowerTraining" "POWER TRAINING"
create_screen "EnduranceMetrics" "ENDURANCE METRICS"
create_screen "MobilityRoutines" "MOBILITY ROUTINES"
create_screen "NutritionTracker" "NUTRITION TRACKER"
create_screen "MacrosBreakdown" "MACROS BREAKDOWN"
create_screen "SupplementLog" "SUPPLEMENT LOG"
create_screen "WaterIntake" "WATER INTAKE"
create_screen "CalorieTracker" "CALORIE TRACKER"
create_screen "BodyMeasurements" "BODY MEASUREMENTS"
create_screen "PhotoProgress" "PHOTO PROGRESS"
create_screen "WeightLog" "WEIGHT LOG"
create_screen "RepMaxCalculator" "REP MAX CALCULATOR"
create_screen "ExerciseLibrary" "EXERCISE LIBRARY"
create_screen "WorkoutBuilder" "WORKOUT BUILDER"
create_screen "CustomProtocols" "CUSTOM PROTOCOLS"
create_screen "TrainingPhases" "TRAINING PHASES"
create_screen "Deload" "DELOAD WEEK"
create_screen "PeakWeek" "PEAK WEEK"
create_screen "RestDay" "REST DAY"
create_screen "InjuryLog" "INJURY LOG"
create_screen "FormCheck" "FORM CHECK"
create_screen "PersonalRecords" "PERSONAL RECORDS"
create_screen "Milestones" "MILESTONES"
create_screen "Challenges" "CHALLENGES"
create_screen "Leaderboard" "LEADERBOARD"
create_screen "SocialFeed" "SOCIAL FEED"
create_screen "TrainingPartners" "TRAINING PARTNERS"

echo "All screens created!"
