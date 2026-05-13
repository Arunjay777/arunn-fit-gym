import React, { useState } from 'react';
import { Bell, Search, User, X } from 'lucide-react';
import TacticalCard from './TacticalCard';

interface TacticalHeaderProps {
  title: string;
  subtitle?: string;
}

export default function TacticalHeader({ title, subtitle }: TacticalHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, text: 'New PR achieved: Bench Press 225lbs', time: '2 hours ago', type: 'success' },
    { id: 2, text: 'Workout streak: 12 days!', time: '5 hours ago', type: 'info' },
    { id: 3, text: 'Recovery score low - rest recommended', time: '1 day ago', type: 'warning' },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-4 lg:mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="flex-1 min-w-0">
          <h1 className="font-mono font-bold text-xl lg:text-2xl mb-1 truncate" style={{ color: '#00D4FF' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="font-mono text-[10px] lg:text-sm truncate" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 lg:gap-3 ml-4">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-1.5 lg:p-2 rounded transition-all hover:bg-[rgba(0,212,255,0.1)]"
            style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
          >
            <Search className="w-4 lg:w-5 h-4 lg:h-5" style={{ color: '#00D4FF' }} />
          </button>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 lg:p-2 rounded transition-all hover:bg-[rgba(0,212,255,0.1)]"
            style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
          >
            <Bell className="w-4 lg:w-5 h-4 lg:h-5" style={{ color: '#00D4FF' }} />
            <div className="absolute top-1 right-1 w-1.5 lg:w-2 h-1.5 lg:h-2 rounded-full"
                 style={{ background: '#F43F5E', boxShadow: '0 0 6px rgba(244, 63, 94, 0.8)' }} />
          </button>
        </div>
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20" onClick={() => setShowSearch(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(3, 3, 3, 0.9)' }} />
          <div className="relative w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 rounded" style={{ background: 'rgba(26, 26, 26, 0.98)', border: '1px solid rgba(0, 212, 255, 0.3)' }}>
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-5 h-5" style={{ color: '#00D4FF' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search workouts, exercises, nutrition..."
                  className="flex-1 bg-transparent font-mono text-lg outline-none"
                  style={{ color: '#00D4FF' }}
                  autoFocus
                />
                <button onClick={() => setShowSearch(false)}>
                  <X className="w-5 h-5" style={{ color: '#00D4FF' }} />
                </button>
              </div>
              <div className="space-y-2">
                {['Chest Workout', 'Diet Plan', 'Rep Counter', 'Analytics'].map((item) => (
                  <div key={item} className="p-3 rounded font-mono text-sm transition-all hover:bg-[rgba(0,212,255,0.1)] cursor-pointer"
                       style={{ border: '1px solid rgba(255, 255, 255, 0.05)', color: '#00D4FF' }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed top-20 right-4 lg:right-8 z-50 w-[calc(100vw-2rem)] sm:w-96">
          <TacticalCard className="p-4 rounded-2xl" glow>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
              <div className="font-mono font-bold text-cyan-400 tracking-widest text-sm">NOTIFICATIONS</div>
              <button onClick={() => setShowNotifications(false)} className="p-1.5 hover:bg-white/5 rounded-full">
                <X className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-hide">
              {notifications.map((notif) => {
                const colors = {
                  success: '#10B981',
                  info: '#00D4FF',
                  warning: '#F59E0B',
                };
                const color = colors[notif.type as keyof typeof colors];
                return (
                  <div key={notif.id} className="p-3 rounded-xl bg-white/5 border-l-2" style={{ borderColor: color }}>
                    <div className="font-mono text-xs lg:text-sm mb-1 leading-tight" style={{ color }}>{notif.text}</div>
                    <div className="font-mono text-[10px] text-white/40">{notif.time}</div>
                  </div>
                );
              })}
            </div>
          </TacticalCard>
        </div>
      )}
    </>
  );
}
