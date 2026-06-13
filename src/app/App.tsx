import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CommandSidebar from './components/CommandSidebar';

// Import all screens
import Landing from './screens/Landing';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import Mission from './screens/Mission';
import Vitals from './screens/Vitals';
import Training from './screens/Training';
import AI from './screens/AI';
import Analytics from './screens/Analytics';
import Recovery from './screens/Recovery';
import Progress from './screens/Progress';
import Schedule from './screens/Schedule';
import Achievements from './screens/Achievements';
import History from './screens/History';
import Exercises from './screens/Exercises';
import Audio from './screens/Audio';
import Profile from './screens/Profile';
import Settings from './screens/Settings';
import RepCounter from './screens/RepCounter';
import ChestWorkout from './screens/ChestWorkout';
import BackWorkout from './screens/BackWorkout';
import LegWorkout from './screens/LegWorkout';
import ShoulderWorkout from './screens/ShoulderWorkout';
import ArmWorkout from './screens/ArmWorkout';
import CoreWorkout from './screens/CoreWorkout';
import CardioWorkout from './screens/CardioWorkout';
import StrengthAnalytics from './screens/StrengthAnalytics';
import HypertrophyPlan from './screens/HypertrophyPlan';
import PowerTraining from './screens/PowerTraining';
import EnduranceMetrics from './screens/EnduranceMetrics';
import MobilityRoutines from './screens/MobilityRoutines';
import NutritionTracker from './screens/NutritionTracker';
import MacrosBreakdown from './screens/MacrosBreakdown';
import SupplementLog from './screens/SupplementLog';
import WaterIntake from './screens/WaterIntake';
import CalorieTracker from './screens/CalorieTracker';
import BodyMeasurements from './screens/BodyMeasurements';
import PhotoProgress from './screens/PhotoProgress';
import WeightLog from './screens/WeightLog';
import RepMaxCalculator from './screens/RepMaxCalculator';
import ExerciseLibrary from './screens/ExerciseLibrary';
import WorkoutBuilder from './screens/WorkoutBuilder';
import CustomProtocols from './screens/CustomProtocols';
import TrainingPhases from './screens/TrainingPhases';
import Deload from './screens/Deload';
import PeakWeek from './screens/PeakWeek';
import RestDay from './screens/RestDay';
import InjuryLog from './screens/InjuryLog';
import PersonalRecords from './screens/PersonalRecords';
import Milestones from './screens/Milestones';
import Challenges from './screens/Challenges';
import Leaderboard from './screens/Leaderboard';
import SocialFeed from './screens/SocialFeed';
import TrainingPartners from './screens/TrainingPartners';
import DietPlan from './screens/DietPlan';
import Admin from './screens/Admin';

// Protected Route Component
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'user' | 'admin' }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsAuthenticated(!!userRole);
    if (requiredRole && userRole !== requiredRole) {
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
    setIsLoading(false);
  }, [requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-pulse" style={{ background: '#030303' }}>
        <div className="font-mono text-xl" style={{ color: '#00D4FF' }}>LOADING PROTOCOL...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Main Layout Component
function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isPublicPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className="min-h-screen dark bg-black" style={{ background: '#030303' }}>
      {!isPublicPage && <CommandSidebar />}
      <div className={isPublicPage ? '' : 'lg:ml-24 pb-20 lg:pb-0'}>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    // Intercept localStorage sets to automatically sync client workout completions to Firestore
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(...args: any[]) {
      originalSetItem.apply(localStorage, args as any);
      const key = args[0];
      const value = args[1];
      if (key === 'custom_workout_history') {
        try {
          const history = JSON.parse(value);
          if (history && history.length > 0) {
            const latestSession = history[0];
            // Log workout securely to Firestore in background
            import('./lib/firebaseHelper').then(({ logWorkoutRecord }) => {
              logWorkoutRecord(latestSession);
            }).catch(err => {
              console.error("Failed to load firebase sync helper:", err);
            });
          }
        } catch (e) {
          console.error("Local storage sync to Firebase failed:", e);
        }
      }
    };
    return () => {
      localStorage.setItem = originalSetItem;
    };
  }, []);

  return (
    <HashRouter>
      <MainLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/mission" element={<ProtectedRoute><Mission /></ProtectedRoute>} />
          <Route path="/rep-counter" element={<ProtectedRoute><RepCounter /></ProtectedRoute>} />
          <Route path="/vitals" element={<ProtectedRoute><Vitals /></ProtectedRoute>} />
          <Route path="/training" element={<ProtectedRoute><Training /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute><AI /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/recovery" element={<ProtectedRoute><Recovery /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
          <Route path="/exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
          <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/audio" element={<ProtectedRoute><Audio /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Workout Routes */}
          <Route path="/workouts/chest" element={<ProtectedRoute><ChestWorkout /></ProtectedRoute>} />
          <Route path="/workouts/back" element={<ProtectedRoute><BackWorkout /></ProtectedRoute>} />
          <Route path="/workouts/legs" element={<ProtectedRoute><LegWorkout /></ProtectedRoute>} />
          <Route path="/workouts/shoulders" element={<ProtectedRoute><ShoulderWorkout /></ProtectedRoute>} />
          <Route path="/workouts/arms" element={<ProtectedRoute><ArmWorkout /></ProtectedRoute>} />
          <Route path="/workouts/core" element={<ProtectedRoute><CoreWorkout /></ProtectedRoute>} />
          <Route path="/workouts/cardio" element={<ProtectedRoute><CardioWorkout /></ProtectedRoute>} />

          {/* Analytics & Training Routes */}
          <Route path="/analytics/strength" element={<ProtectedRoute><StrengthAnalytics /></ProtectedRoute>} />
          <Route path="/plan/hypertrophy" element={<ProtectedRoute><HypertrophyPlan /></ProtectedRoute>} />
          <Route path="/plan/power" element={<ProtectedRoute><PowerTraining /></ProtectedRoute>} />
          <Route path="/metrics/endurance" element={<ProtectedRoute><EnduranceMetrics /></ProtectedRoute>} />
          <Route path="/mobility" element={<ProtectedRoute><MobilityRoutines /></ProtectedRoute>} />

          {/* Nutrition Routes */}
          <Route path="/nutrition" element={<ProtectedRoute><NutritionTracker /></ProtectedRoute>} />
          <Route path="/nutrition/macros" element={<ProtectedRoute><MacrosBreakdown /></ProtectedRoute>} />
          <Route path="/nutrition/supplements" element={<ProtectedRoute><SupplementLog /></ProtectedRoute>} />
          <Route path="/nutrition/water" element={<ProtectedRoute><WaterIntake /></ProtectedRoute>} />
          <Route path="/nutrition/calories" element={<ProtectedRoute><CalorieTracker /></ProtectedRoute>} />

          {/* Body Tracking Routes */}
          <Route path="/body/measurements" element={<ProtectedRoute><BodyMeasurements /></ProtectedRoute>} />
          <Route path="/body/photos" element={<ProtectedRoute><PhotoProgress /></ProtectedRoute>} />
          <Route path="/body/weight" element={<ProtectedRoute><WeightLog /></ProtectedRoute>} />

          {/* Tools Routes */}
          <Route path="/tools/calculator" element={<ProtectedRoute><RepMaxCalculator /></ProtectedRoute>} />
          <Route path="/tools/library" element={<ProtectedRoute><ExerciseLibrary /></ProtectedRoute>} />
          <Route path="/tools/builder" element={<ProtectedRoute><WorkoutBuilder /></ProtectedRoute>} />
          <Route path="/tools/custom" element={<ProtectedRoute><CustomProtocols /></ProtectedRoute>} />

          {/* Phase & Recovery Routes */}
          <Route path="/phases" element={<ProtectedRoute><TrainingPhases /></ProtectedRoute>} />
          <Route path="/phases/deload" element={<ProtectedRoute><Deload /></ProtectedRoute>} />
          <Route path="/phases/peak" element={<ProtectedRoute><PeakWeek /></ProtectedRoute>} />
          <Route path="/phases/rest" element={<ProtectedRoute><RestDay /></ProtectedRoute>} />
          <Route path="/injury" element={<ProtectedRoute><InjuryLog /></ProtectedRoute>} />

          {/* Achievement & Social Routes */}
          <Route path="/records" element={<ProtectedRoute><PersonalRecords /></ProtectedRoute>} />
          <Route path="/milestones" element={<ProtectedRoute><Milestones /></ProtectedRoute>} />
          <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/social" element={<ProtectedRoute><SocialFeed /></ProtectedRoute>} />
          <Route path="/partners" element={<ProtectedRoute><TrainingPartners /></ProtectedRoute>} />
          <Route path="/diet-plan" element={<ProtectedRoute><DietPlan /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
}
