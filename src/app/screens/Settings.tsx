import React, { useState } from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { 
  User, 
  Shield, 
  Bell, 
  Zap, 
  Cpu, 
  Eye, 
  Smartphone, 
  LogOut,
  ChevronRight,
  ToggleLeft as Toggle,
  Settings as SettingsIcon,
  Activity
} from 'lucide-react';
import { cn } from '../components/ui/utils';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [neuralSync, setNeuralSync] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [lowPowerMode, setLowPowerMode] = useState(false);

  const sections = [
    {
      title: 'NEURAL LINK CONFIG',
      icon: Cpu,
      items: [
        { label: 'Neural Synchronization', value: neuralSync, type: 'toggle', action: () => setNeuralSync(!neuralSync) },
        { label: 'Biometric Feedback Loop', value: 'ACTIVE', type: 'status', color: '#10B981' },
        { label: 'Latency Calibration', value: '14ms', type: 'text' },
      ]
    },
    {
      title: 'TACTICAL INTERFACE',
      icon: Eye,
      items: [
        { label: 'AR Oversight Mode', value: 'OVERLAY', type: 'text' },
        { label: 'Haptic Feedback', value: hapticFeedback, type: 'toggle', action: () => setHapticFeedback(!hapticFeedback) },
        { label: 'HUD Glow Intensity', value: 'HIGHEST', type: 'text' },
      ]
    },
    {
      title: 'SECURITY PROTOCOLS',
      icon: Shield,
      items: [
        { label: 'Encrypted Data Stream', value: 'ENABLED', type: 'status', color: '#00D4FF' },
        { label: 'Tactical Masking', value: 'ACTIVE', type: 'status', color: '#10B981' },
        { label: 'Reset DNA Signature', value: 'PROTOCOL-0', type: 'text' },
      ]
    }
  ];

  return (
    <div className="min-h-screen p-4 lg:p-8 space-y-6">
      <TacticalHeader title="SYSTEM SETTINGS" subtitle="NEURAL-SYNC HARDWARE CONFIGURATION" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Quick Stats */}
        <div className="space-y-6">
          <TacticalCard className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full border-2 border-cyan-500/30 p-1">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-900 to-cyan-500 flex items-center justify-center">
                  <User className="w-12 h-12 text-black" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#030303] border border-cyan-500/30 flex items-center justify-center">
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <h2 className="font-mono font-bold text-xl text-white tracking-tight uppercase">Alex Johnson</h2>
            <p className="font-mono text-[10px] text-cyan-400/50 tracking-[0.3em] uppercase mb-6">ELITE OPERATIVE // RANK 42</p>
            
            <div className="space-y-2">
              <button className="w-full py-3 rounded-xl border border-white/5 bg-white/5 font-mono text-xs text-white hover:bg-white/10 transition-all flex items-center justify-between px-4">
                <span>VIEW DOSSIER</span>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </button>
              <button className="w-full py-3 rounded-xl border border-red-500/20 bg-red-500/5 font-mono text-xs text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-between px-4">
                <span>TERMINATE SESSION</span>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </TacticalCard>

          <TacticalCard>
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-cyan-400" />
              <h3 className="font-mono font-bold text-sm text-cyan-400 tracking-widest uppercase">Alert Protocols</h3>
            </div>
            <div className="space-y-4">
              {[
                { id: 'training', label: 'Combat Alerts', desc: 'Real-time training notifications' },
                { id: 'diet', label: 'Nutritional Sync', desc: 'Macro balance reminders' },
                { id: 'social', label: 'Link Request', desc: 'Neural connection requests' }
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between group">
                  <div>
                    <div className="font-mono text-sm text-white">{item.label}</div>
                    <div className="font-mono text-[10px] text-white/30">{item.desc}</div>
                  </div>
                  <button 
                    onClick={() => setNotifications(!notifications)}
                    className={cn(
                      "w-10 h-5 rounded-full transition-all relative",
                      notifications ? "bg-cyan-500" : "bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-3 h-3 rounded-full bg-black transition-all",
                      notifications ? "left-6" : "left-1"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </TacticalCard>
        </div>

        {/* Right Column: Main Config */}
        <div className="lg:col-span-2 space-y-6">
          {sections.map(section => (
            <TacticalCard key={section.title}>
              <div className="flex items-center gap-3 mb-6">
                <section.icon className="w-5 h-5 text-cyan-400" />
                <h3 className="font-mono font-bold text-sm text-cyan-400 tracking-widest uppercase">{section.title}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/20 transition-all flex items-center justify-between">
                    <div>
                      <div className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1">{item.label}</div>
                      {item.type !== 'toggle' && (
                        <div className="font-mono font-bold text-sm" style={{ color: item.color || '#FFFFFF' }}>{item.value}</div>
                      )}
                    </div>
                    
                    {item.type === 'toggle' ? (
                      <button 
                        onClick={item.action}
                        className={cn(
                          "w-12 h-6 rounded-full transition-all relative",
                          item.value ? "bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]" : "bg-white/10"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-black transition-all",
                          item.value ? "left-7" : "left-1"
                        )} />
                      </button>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-white/10" />
                    )}
                  </div>
                ))}
              </div>
            </TacticalCard>
          ))}

          {/* Hardware Specs Panel */}
          <TacticalCard glow className="border-cyan-500/20 bg-cyan-500/5">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="font-mono font-bold text-sm text-amber-400 tracking-widest uppercase">System Optimization</h3>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="58" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle cx="64" cy="64" r="58" fill="transparent" stroke="#F59E0B" strokeWidth="8" strokeDasharray="364.4" strokeDashoffset="54.6" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-mono font-bold text-3xl text-amber-400">85%</div>
                  <div className="font-mono text-[8px] text-white/30 uppercase">Neural Load</div>
                </div>
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-mono text-[10px] text-amber-400/80 font-bold uppercase tracking-widest">Efficiency Level</div>
                    <div className="font-mono text-xs text-amber-400">OPTIMAL</div>
                  </div>
                  <p className="font-mono text-[10px] text-white/40 leading-relaxed">
                    System sub-routines are currently running at peak metabolic synchronization. Intelligence gathering indicates zero hardware failures.
                  </p>
                </div>
                <button className="w-full py-3 rounded-xl bg-amber-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform">
                  RUN DEEP CALIBRATION
                </button>
              </div>
            </div>
          </TacticalCard>
        </div>
      </div>
    </div>
  );
}
