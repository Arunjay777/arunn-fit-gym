import React from 'react';
import { Shield, Target, Activity, Zap, TrendingUp, User, Settings, Brain, Headphones, Dumbbell, Heart, BarChart3, Calendar, Award, Clock, Camera, LogOut, Utensils, Lock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  category?: string;
}

const navItems: NavItem[] = [
  { icon: Shield, label: 'Command', path: '/', category: 'core' },
  { icon: Target, label: 'Mission', path: '/mission' },
  { icon: Camera, label: 'Rep Counter', path: '/rep-counter' },
  { icon: Activity, label: 'Vitals', path: '/vitals' },
  { icon: Dumbbell, label: 'Training', path: '/training' },
  { icon: Utensils, label: 'Diet Plan', path: '/diet-plan' },
  { icon: Brain, label: 'Neural AI', path: '/ai' },
  { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
  { icon: Heart, label: 'Recovery', path: '/recovery' },
  { icon: BarChart3, label: 'Progress', path: '/progress' },
  { icon: Calendar, label: 'Schedule', path: '/schedule' },
  { icon: Award, label: 'Achievements', path: '/achievements' },
  { icon: Clock, label: 'History', path: '/history' },
  { icon: Headphones, label: 'Audio', path: '/audio' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Lock, label: 'Admin', path: '/admin' },
  { icon: Settings, label: 'Config', path: '/settings' },
];

export default function CommandSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="fixed bottom-0 left-0 w-full lg:left-0 lg:top-0 lg:h-full lg:w-24 flex flex-row lg:flex-col items-center py-2 lg:py-6 gap-2 lg:gap-6 z-50"
         style={{
           background: 'rgba(26, 26, 26, 0.9)',
           borderRight: '1px solid rgba(0, 212, 255, 0.15)',
           borderTop: '1px solid rgba(0, 212, 255, 0.15)',
           backdropFilter: 'blur(40px)',
         }}>
      {/* Logo - Hidden on mobile */}
      <div className="hidden lg:block mb-4">
        <div className="w-12 h-12 flex items-center justify-center rounded"
             style={{
               background: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)',
               boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
             }}>
          <Shield className="w-7 h-7 text-[#030303]" />
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex flex-row lg:flex-col gap-1 lg:gap-2 flex-1 overflow-x-auto lg:overflow-y-auto overflow-y-hidden px-4 lg:px-0 scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="group relative min-w-[4.5rem] lg:w-20 h-16 lg:h-20 flex flex-col items-center justify-center rounded transition-all duration-200 gap-1 lg:gap-1.5 px-1"
              style={{
                background: isActive ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(0, 212, 255, 0.3)' : '1px solid transparent',
              }}
            >
              <Icon
                className="w-5 h-5 lg:w-6 lg:h-6 transition-all duration-200"
                style={{
                  color: isActive ? '#00D4FF' : 'rgba(0, 212, 255, 0.5)',
                  filter: isActive ? 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.6))' : 'none',
                }}
              />
              <span className="font-mono text-[8px] lg:text-[9px] text-center uppercase tracking-tighter leading-tight" 
                    style={{ color: isActive ? '#00D4FF' : 'rgba(0, 212, 255, 0.4)' }}>
                {item.label}
              </span>

              {/* Tooltip - Desktop only */}
              <div className="hidden lg:group-hover:block absolute left-full ml-4 px-3 py-2 rounded opacity-0 lg:group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
                   style={{
                     background: 'rgba(26, 26, 26, 0.95)',
                     border: '1px solid rgba(0, 212, 255, 0.3)',
                     backdropFilter: 'blur(20px)',
                   }}>
                <span className="font-mono text-xs" style={{ color: '#00D4FF' }}>{item.label}</span>
              </div>

              {/* Active Indicator - Side on Desktop, Bottom on Mobile */}
              {isActive && (
                <>
                  <div className="hidden lg:block absolute left-0 w-1 h-8 rounded-r"
                       style={{
                         background: '#00D4FF',
                         boxShadow: '0 0 10px rgba(0, 212, 255, 0.8)',
                       }} />
                  <div className="lg:hidden absolute bottom-0 w-8 h-1 rounded-t"
                       style={{
                         background: '#00D4FF',
                         boxShadow: '0 0 10px rgba(0, 212, 255, 0.8)',
                       }} />
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="lg:mt-auto border-l lg:border-l-0 lg:border-t border-white/10 pl-2 lg:pl-0 lg:pt-4 mr-2 lg:mr-0">
        <button
          onClick={handleLogout}
          className="group relative w-14 h-14 lg:w-20 lg:h-20 flex flex-col items-center justify-center rounded transition-all duration-200 hover:bg-[rgba(255,51,102,0.1)] gap-1 px-1"
          style={{
            border: '1px solid rgba(255, 51, 102, 0.3)',
          }}
        >
          <LogOut
            className="w-5 h-5 lg:w-6 lg:h-6 transition-all duration-200"
            style={{
              color: '#FF3366',
            }}
          />
          <span className="font-mono text-[8px] lg:text-[9px] uppercase tracking-tighter" style={{ color: 'rgba(255, 51, 102, 0.6)' }}>
            Logout
          </span>
          {/* Tooltip - Desktop only */}
          <div className="hidden lg:group-hover:block absolute left-full ml-4 px-3 py-2 rounded opacity-0 lg:group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
               style={{
                 background: 'rgba(26, 26, 26, 0.95)',
                 border: '1px solid rgba(255, 51, 102, 0.3)',
                 backdropFilter: 'blur(20px)',
               }}>
            <span className="font-mono text-xs" style={{ color: '#FF3366' }}>Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
}
