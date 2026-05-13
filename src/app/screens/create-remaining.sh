#!/bin/bash

# Create Analytics & Metrics screens
for screen in StrengthAnalytics HypertrophyPlan PowerTraining EnduranceMetrics; do
cat > ${screen}.tsx << 'EOF'
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function SCREEN_NAME() {
  return (
    <div className="min-h-screen p-8">
      <TacticalHeader title="ANALYTICS MODULE" subtitle="PERFORMANCE DATA INTELLIGENCE" />
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <TacticalCard key={i}>
            <BarChart3 className="w-8 h-8 mb-2" style={{ color: '#CCFF00' }} />
            <div className="font-mono font-bold text-2xl" style={{ color: '#CCFF00' }}>Data {i}</div>
          </TacticalCard>
        ))}
      </div>
    </div>
  );
}
EOF
done

# Create Nutrition screens
for screen in MobilityRoutines NutritionTracker MacrosBreakdown SupplementLog WaterIntake CalorieTracker; do
cat > ${screen}.tsx << 'EOF'
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Apple, Droplet } from 'lucide-react';

export default function SCREEN_NAME() {
  return (
    <div className="min-h-screen p-8">
      <TacticalHeader title="NUTRITION COMMAND" subtitle="FUEL & RECOVERY OPTIMIZATION" />
      <div className="grid grid-cols-3 gap-6">
        <TacticalCard>
          <Apple className="w-12 h-12 mb-4" style={{ color: '#10B981' }} />
          <div className="font-mono font-bold text-xl" style={{ color: '#CCFF00' }}>Nutrition Protocol</div>
        </TacticalCard>
        <TacticalCard>
          <div className="font-mono text-xs mb-2" style={{ color: 'rgba(204, 255, 0, 0.6)' }}>CALORIES</div>
          <div className="font-mono font-bold text-3xl" style={{ color: '#10B981' }}>2850</div>
        </TacticalCard>
        <TacticalCard>
          <div className="font-mono text-xs mb-2" style={{ color: 'rgba(204, 255, 0, 0.6)' }}>PROTEIN</div>
          <div className="font-mono font-bold text-3xl" style={{ color: '#CCFF00' }}>195g</div>
        </TacticalCard>
      </div>
    </div>
  );
}
EOF
done

# Create Body Tracking screens
for screen in BodyMeasurements PhotoProgress WeightLog; do
cat > ${screen}.tsx << 'EOF'
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Camera, Scale } from 'lucide-react';

export default function SCREEN_NAME() {
  return (
    <div className="min-h-screen p-8">
      <TacticalHeader title="BODY METRICS" subtitle="PHYSICAL TRANSFORMATION TRACKING" />
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'WEIGHT', value: '195 lbs' },
          { label: 'BODY FAT', value: '12.4%' },
          { label: 'MUSCLE', value: '176 lbs' },
          { label: 'CHANGE', value: '+8 lbs' }
        ].map(stat => (
          <TacticalCard key={stat.label}>
            <div className="font-mono text-xs mb-2" style={{ color: 'rgba(204, 255, 0, 0.6)' }}>{stat.label}</div>
            <div className="font-mono font-bold text-2xl" style={{ color: '#CCFF00' }}>{stat.value}</div>
          </TacticalCard>
        ))}
      </div>
    </div>
  );
}
EOF
done

# Create Tools screens
for screen in RepMaxCalculator ExerciseLibrary WorkoutBuilder CustomProtocols; do
cat > ${screen}.tsx << 'EOF'
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Calculator, BookOpen, Settings } from 'lucide-react';

export default function SCREEN_NAME() {
  return (
    <div className="min-h-screen p-8">
      <TacticalHeader title="TRAINING TOOLS" subtitle="TACTICAL UTILITIES & CALCULATORS" />
      <div className="grid grid-cols-2 gap-6">
        <TacticalCard>
          <Calculator className="w-16 h-16 mb-4" style={{ color: '#CCFF00' }} />
          <div className="font-mono font-bold text-xl mb-2" style={{ color: '#CCFF00' }}>Tool Module</div>
          <div className="font-mono text-sm" style={{ color: 'rgba(204, 255, 0, 0.6)' }}>Advanced calculations</div>
        </TacticalCard>
        <TacticalCard>
          <BookOpen className="w-16 h-16 mb-4" style={{ color: '#10B981' }} />
          <div className="font-mono font-bold text-xl mb-2" style={{ color: '#CCFF00' }}>Database</div>
          <div className="font-mono text-sm" style={{ color: 'rgba(204, 255, 0, 0.6)' }}>Reference library</div>
        </TacticalCard>
      </div>
    </div>
  );
}
EOF
done

# Create Phase & Recovery screens
for screen in TrainingPhases Deload PeakWeek RestDay InjuryLog FormCheck; do
cat > ${screen}.tsx << 'EOF'
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Activity, Heart, Shield } from 'lucide-react';

export default function SCREEN_NAME() {
  return (
    <div className="min-h-screen p-8">
      <TacticalHeader title="RECOVERY MODULE" subtitle="PHASE & ADAPTATION PROTOCOLS" />
      <div className="grid grid-cols-3 gap-6">
        <TacticalCard>
          <Heart className="w-12 h-12 mb-4" style={{ color: '#10B981' }} />
          <div className="font-mono font-bold text-xl" style={{ color: '#CCFF00' }}>Recovery Phase</div>
        </TacticalCard>
        <TacticalCard>
          <div className="font-mono text-xs mb-2" style={{ color: 'rgba(204, 255, 0, 0.6)' }}>STATUS</div>
          <div className="font-mono font-bold text-3xl" style={{ color: '#10B981' }}>ACTIVE</div>
        </TacticalCard>
        <TacticalCard>
          <div className="font-mono text-xs mb-2" style={{ color: 'rgba(204, 255, 0, 0.6)' }}>DAYS</div>
          <div className="font-mono font-bold text-3xl" style={{ color: '#CCFF00' }}>3/7</div>
        </TacticalCard>
      </div>
    </div>
  );
}
EOF
done

# Create Achievement & Social screens
for screen in PersonalRecords Milestones Challenges Leaderboard SocialFeed TrainingPartners; do
cat > ${screen}.tsx << 'EOF'
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Award, Trophy, Users, Target } from 'lucide-react';

export default function SCREEN_NAME() {
  return (
    <div className="min-h-screen p-8">
      <TacticalHeader title="SOCIAL COMMAND" subtitle="ACHIEVEMENTS & COMMUNITY" />
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { icon: Trophy, label: 'RECORDS', value: '127' },
          { icon: Award, label: 'ACHIEVEMENTS', value: '45' },
          { icon: Target, label: 'GOALS', value: '8/12' },
          { icon: Users, label: 'PARTNERS', value: '24' }
        ].map(stat => (
          <TacticalCard key={stat.label}>
            <stat.icon className="w-8 h-8 mb-2" style={{ color: '#CCFF00' }} />
            <div className="font-mono text-xs mb-1" style={{ color: 'rgba(204, 255, 0, 0.6)' }}>{stat.label}</div>
            <div className="font-mono font-bold text-2xl" style={{ color: '#CCFF00' }}>{stat.value}</div>
          </TacticalCard>
        ))}
      </div>
    </div>
  );
}
EOF
done

echo "All screens created successfully!"
