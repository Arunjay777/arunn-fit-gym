import React, { useState } from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Award, Trophy, Target, Star, Medal, Crown, Zap, Lock } from 'lucide-react';

export default function Achievements() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'ALL', count: 42 },
    { id: 'strength', name: 'STRENGTH', count: 12 },
    { id: 'endurance', name: 'ENDURANCE', count: 8 },
    { id: 'consistency', name: 'CONSISTENCY', count: 15 },
    { id: 'milestones', name: 'MILESTONES', count: 7 },
  ];

  const achievements = [
    {
      id: 1,
      title: 'FIRST BLOOD',
      description: 'Complete your first workout',
      icon: '🎯',
      unlocked: true,
      date: 'Jan 15, 2024',
      xp: 100,
      category: 'milestones',
      rarity: 'common'
    },
    {
      id: 2,
      title: 'CENTURY CLUB',
      description: 'Complete 100 workouts',
      icon: '💯',
      unlocked: true,
      date: 'Mar 22, 2024',
      xp: 1000,
      category: 'consistency',
      rarity: 'rare'
    },
    {
      id: 3,
      title: 'IRON WARRIOR',
      description: 'Bench press 225 lbs',
      icon: '💪',
      unlocked: true,
      date: 'Apr 8, 2024',
      xp: 500,
      category: 'strength',
      rarity: 'epic'
    },
    {
      id: 4,
      title: 'FIRE STREAK',
      description: 'Train for 30 consecutive days',
      icon: '🔥',
      unlocked: true,
      date: 'May 1, 2024',
      xp: 800,
      category: 'consistency',
      rarity: 'epic'
    },
    {
      id: 5,
      title: 'DEAD LIFT KING',
      description: 'Deadlift 405 lbs',
      icon: '👑',
      unlocked: true,
      date: 'May 10, 2024',
      xp: 750,
      category: 'strength',
      rarity: 'legendary'
    },
    {
      id: 6,
      title: 'SPEED DEMON',
      description: 'Run 5K under 20 minutes',
      icon: '⚡',
      unlocked: true,
      date: 'Apr 20, 2024',
      xp: 600,
      category: 'endurance',
      rarity: 'rare'
    },
    {
      id: 7,
      title: 'EARLY BIRD',
      description: 'Complete 10 morning workouts',
      icon: '🌅',
      unlocked: true,
      date: 'Feb 14, 2024',
      xp: 300,
      category: 'consistency',
      rarity: 'common'
    },
    {
      id: 8,
      title: 'VOLUME MASTER',
      description: 'Lift 100K lbs in one week',
      icon: '📈',
      unlocked: true,
      date: 'May 5, 2024',
      xp: 900,
      category: 'strength',
      rarity: 'epic'
    },
    {
      id: 9,
      title: 'LEGENDARY STATUS',
      description: 'Reach level 50',
      icon: '🏆',
      unlocked: false,
      date: null,
      xp: 2000,
      category: 'milestones',
      rarity: 'legendary',
      progress: 78
    },
    {
      id: 10,
      title: 'CARDIO MACHINE',
      description: 'Complete 50 cardio sessions',
      icon: '❤️',
      unlocked: false,
      date: null,
      xp: 700,
      category: 'endurance',
      progress: 62
    },
    {
      id: 11,
      title: 'SQUAT CHAMPION',
      description: 'Squat 405 lbs',
      icon: '🦵',
      unlocked: false,
      date: null,
      xp: 800,
      category: 'strength',
      progress: 85
    },
    {
      id: 12,
      title: 'YEAR OF IRON',
      description: 'Train for 365 consecutive days',
      icon: '📅',
      unlocked: false,
      date: null,
      xp: 5000,
      category: 'consistency',
      progress: 12
    },
  ];

  const rarityColors = {
    common: '#888888',
    rare: '#3B82F6',
    epic: '#A855F7',
    legendary: '#F59E0B'
  };

  const stats = [
    { label: 'Total Unlocked', value: '42/68', icon: Trophy, color: '#00D4FF' },
    { label: 'Total XP', value: '18.5K', icon: Star, color: '#F59E0B' },
    { label: 'Rare+', value: '24', icon: Medal, color: '#A855F7' },
    { label: 'Current Level', value: '38', icon: Crown, color: '#10B981' },
  ];

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen p-8">
      <TacticalHeader title="ACHIEVEMENTS" subtitle="UNLOCK YOUR POTENTIAL" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <TacticalCard key={stat.label}>
              <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5" style={{ color: stat.color }} />
                <span className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>
                  {stat.label}
                </span>
              </div>
              <div className="font-mono font-bold text-3xl" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </TacticalCard>
          );
        })}
      </div>

      <div className="mb-6 flex gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 font-mono text-sm transition-all ${
              selectedCategory === category.id ? '' : 'hover:bg-[rgba(0,212,255,0.05)]'
            }`}
            style={{
              background: selectedCategory === category.id ? '#00D4FF' : 'transparent',
              color: selectedCategory === category.id ? '#030303' : '#00D4FF',
              border: `1px solid ${selectedCategory === category.id ? '#00D4FF' : 'rgba(0, 212, 255, 0.3)'}`,
            }}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => {
          const rarityColor = rarityColors[achievement.rarity as keyof typeof rarityColors];
          return (
            <TacticalCard key={achievement.id}>
              <div className={`${!achievement.unlocked ? 'opacity-50' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{achievement.unlocked ? achievement.icon : '🔒'}</div>
                  <div
                    className="px-2 py-1 rounded font-mono text-xs uppercase"
                    style={{
                      background: `${rarityColor}20`,
                      color: rarityColor,
                      border: `1px solid ${rarityColor}40`
                    }}
                  >
                    {achievement.rarity}
                  </div>
                </div>

                <div className="font-mono font-bold text-lg mb-2" style={{ color: achievement.unlocked ? '#00D4FF' : '#888888' }}>
                  {achievement.title}
                </div>
                <div className="font-mono text-sm mb-3" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>
                  {achievement.description}
                </div>

                {achievement.unlocked ? (
                  <div className="flex items-center justify-between font-mono text-xs">
                    <div style={{ color: '#10B981' }}>
                      ✓ Unlocked {achievement.date}
                    </div>
                    <div style={{ color: '#F59E0B' }}>
                      +{achievement.xp} XP
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2 font-mono text-xs">
                      <span style={{ color: 'rgba(0, 212, 255, 0.6)' }}>Progress</span>
                      <span style={{ color: '#00D4FF' }}>{achievement.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded" style={{ background: 'rgba(26, 26, 26, 0.6)' }}>
                      <div
                        className="h-full rounded"
                        style={{ width: `${achievement.progress}%`, background: rarityColor }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </TacticalCard>
          );
        })}
      </div>
    </div>
  );
}
