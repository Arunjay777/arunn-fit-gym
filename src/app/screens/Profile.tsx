import React, { useState, useRef } from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { User, Mail, Calendar, MapPin, Award, TrendingUp, Dumbbell, Target, Camera, Edit, Save, X } from 'lucide-react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex@simatsfitx.com',
    age: '28 years old',
    location: 'San Francisco, CA',
  });
  const stats = [
    { icon: Dumbbell, label: 'Workouts Completed', value: '247', color: '#00D4FF' },
    { icon: Award, label: 'Achievements', value: '42', color: '#F59E0B' },
    { icon: TrendingUp, label: 'Current Streak', value: '12 days', color: '#10B981' },
    { icon: Target, label: 'Goals Achieved', value: '8/12', color: '#3B82F6' },
  ];

  const achievements = [
    { name: 'First Workout', date: 'Jan 2024', icon: '🎯' },
    { name: '100 Workouts', date: 'Mar 2024', icon: '💯' },
    { name: 'Bench Press 225lbs', date: 'Apr 2024', icon: '💪' },
    { name: '30 Day Streak', date: 'May 2024', icon: '🔥' },
  ];

  const personalRecords = [
    { exercise: 'Bench Press', weight: '225 lbs', date: 'Apr 15, 2024' },
    { exercise: 'Squat', weight: '315 lbs', date: 'May 1, 2024' },
    { exercise: 'Deadlift', weight: '405 lbs', date: 'May 10, 2024' },
    { exercise: 'Pull-ups', weight: '20 reps', date: 'May 8, 2024' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 gap-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div>
          <h1 className="font-mono font-bold text-xl lg:text-2xl mb-1" style={{ color: '#00D4FF' }}>
            USER PROFILE
          </h1>
          <p className="font-mono text-[10px] lg:text-sm" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>
            PERSONAL PERFORMANCE DATA
          </p>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="px-4 lg:px-6 py-2.5 lg:py-3 rounded-[20px] lg:rounded-2xl font-mono font-bold transition-all hover:opacity-90 flex items-center justify-center gap-2 text-sm lg:text-base"
          style={{ background: isEditing ? '#10B981' : '#00D4FF', color: '#030303' }}
        >
          {isEditing ? (
            <>
              <Save className="w-5 h-5" />
              SAVE PROFILE
            </>
          ) : (
            <>
              <Edit className="w-5 h-5" />
              EDIT PROFILE
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <TacticalCard className="h-fit">
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden" style={{ background: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)' }}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-20 h-20 text-[#030303]" />
                  </div>
                )}
              </div>
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: '#00D4FF', border: '3px solid #030303' }}
                >
                  <Camera className="w-5 h-5 text-[#030303]" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            {isEditing ? (
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full font-mono font-bold text-2xl mb-1 text-center bg-transparent outline-none p-2 rounded"
                style={{ color: '#00D4FF', border: '1px solid rgba(0, 212, 255, 0.3)' }}
              />
            ) : (
              <div className="font-mono font-bold text-2xl mb-1" style={{ color: '#00D4FF' }}>{profileData.name}</div>
            )}
            <div className="font-mono text-sm" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>Elite Member</div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4" style={{ color: 'rgba(0, 212, 255, 0.6)' }} />
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="flex-1 font-mono text-sm bg-transparent outline-none p-1 rounded"
                  style={{ color: '#00D4FF', border: '1px solid rgba(0, 212, 255, 0.3)' }}
                />
              ) : (
                <span className="font-mono text-sm" style={{ color: '#00D4FF' }}>{profileData.email}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4" style={{ color: 'rgba(0, 212, 255, 0.6)' }} />
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.age}
                  onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                  className="flex-1 font-mono text-sm bg-transparent outline-none p-1 rounded"
                  style={{ color: '#00D4FF', border: '1px solid rgba(0, 212, 255, 0.3)' }}
                />
              ) : (
                <span className="font-mono text-sm" style={{ color: '#00D4FF' }}>{profileData.age}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4" style={{ color: 'rgba(0, 212, 255, 0.6)' }} />
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="flex-1 font-mono text-sm bg-transparent outline-none p-1 rounded"
                  style={{ color: '#00D4FF', border: '1px solid rgba(0, 212, 255, 0.3)' }}
                />
              ) : (
                <span className="font-mono text-sm" style={{ color: '#00D4FF' }}>{profileData.location}</span>
              )}
            </div>
          </div>
        </TacticalCard>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <TacticalCard key={stat.label} className="p-4 lg:p-6 text-center lg:text-left">
                  <div className="flex flex-col lg:flex-row items-center gap-3 mb-2">
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    <span className="font-mono text-[10px] lg:text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>{stat.label}</span>
                  </div>
                  <div className="font-mono font-bold text-2xl lg:text-3xl" style={{ color: stat.color }}>{stat.value}</div>
                </TacticalCard>
              );
            })}
          </div>

          <TacticalCard>
            <div className="mb-4">
              <div className="font-mono font-bold text-sm mb-1 text-cyan-400 tracking-widest uppercase">Recent Achievements</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <div key={achievement.name} className="p-3 lg:p-4 rounded-2xl flex items-center gap-3 bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all">
                  <div className="text-2xl lg:text-3xl">{achievement.icon}</div>
                  <div className="min-w-0">
                    <div className="font-mono font-bold text-xs lg:text-sm mb-0.5 lg:mb-1 text-white truncate">{achievement.name}</div>
                    <div className="font-mono text-[10px] lg:text-xs text-white/40">{achievement.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </TacticalCard>

          <TacticalCard>
            <div className="mb-4">
              <div className="font-mono font-bold text-sm mb-1" style={{ color: '#00D4FF' }}>PERSONAL RECORDS</div>
            </div>
            <div className="space-y-2">
              {personalRecords.map((pr) => (
                <div key={pr.exercise} className="flex items-center justify-between p-3 rounded" style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div>
                    <div className="font-mono font-bold text-sm" style={{ color: '#00D4FF' }}>{pr.exercise}</div>
                    <div className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>{pr.date}</div>
                  </div>
                  <div className="font-mono font-bold text-xl" style={{ color: '#10B981' }}>{pr.weight}</div>
                </div>
              ))}
            </div>
          </TacticalCard>
        </div>
      </div>
    </div>
  );
}
