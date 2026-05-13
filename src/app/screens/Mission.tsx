import React from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Target, TrendingUp, CheckCircle2 } from 'lucide-react';

const missions = [
  { id: 1, title: 'Bench Press 315lbs', category: 'STRENGTH', progress: 87, deadline: '2026-06-01', status: 'active' },
  { id: 2, title: 'Body Fat < 12%', category: 'COMPOSITION', progress: 65, deadline: '2026-07-15', status: 'active' },
  { id: 3, title: '10K Run < 45min', category: 'ENDURANCE', progress: 42, deadline: '2026-08-20', status: 'active' },
  { id: 4, title: 'Muscle Up x10', category: 'CALISTHENICS', progress: 90, deadline: '2026-05-25', status: 'critical' },
  { id: 5, title: 'Deadlift 500lbs', category: 'STRENGTH', progress: 78, deadline: '2026-09-10', status: 'active' },
  { id: 6, title: 'Complete Marathon', category: 'ENDURANCE', progress: 25, deadline: '2026-11-05', status: 'pending' },
];

export default function Mission() {
  return (
    <div className="min-h-screen p-8">
      <TacticalHeader title="MISSION OBJECTIVES" subtitle="PRIMARY GOALS & TACTICAL TARGETS" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <TacticalCard>
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5" style={{ color: '#00D4FF' }} />
            <span className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>ACTIVE MISSIONS</span>
          </div>
          <div className="font-mono font-bold text-3xl" style={{ color: '#00D4FF' }}>6</div>
          <div className="font-mono text-xs mt-1" style={{ color: 'rgba(0, 212, 255, 0.4)' }}>In progress</div>
        </TacticalCard>

        <TacticalCard>
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5" style={{ color: '#10B981' }} />
            <span className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>AVG PROGRESS</span>
          </div>
          <div className="font-mono font-bold text-3xl" style={{ color: '#10B981' }}>64%</div>
          <div className="font-mono text-xs mt-1" style={{ color: 'rgba(0, 212, 255, 0.4)' }}>On track</div>
        </TacticalCard>

        <TacticalCard>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5" style={{ color: '#F59E0B' }} />
            <span className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>COMPLETED</span>
          </div>
          <div className="font-mono font-bold text-3xl" style={{ color: '#F59E0B' }}>12</div>
          <div className="font-mono text-xs mt-1" style={{ color: 'rgba(0, 212, 255, 0.4)' }}>This year</div>
        </TacticalCard>
      </div>

      <div className="space-y-4">
        {missions.map((mission) => {
          const statusColor = mission.status === 'critical' ? '#F43F5E' : mission.status === 'active' ? '#00D4FF' : 'rgba(0, 212, 255, 0.5)';

          return (
            <TacticalCard key={mission.id}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-mono font-bold text-lg mb-1" style={{ color: '#00D4FF' }}>{mission.title}</div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: 'rgba(0, 212, 255, 0.2)', color: '#00D4FF' }}>
                      {mission.category}
                    </span>
                    <span className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>
                      Deadline: {mission.deadline}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-2xl mb-1" style={{ color: statusColor }}>{mission.progress}%</div>
                  <div className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>COMPLETE</div>
                </div>
              </div>

              <div className="w-full h-2 rounded" style={{ background: 'rgba(26, 26, 26, 0.6)' }}>
                <div className="h-full rounded transition-all" style={{ width: `${mission.progress}%`, background: statusColor }} />
              </div>
            </TacticalCard>
          );
        })}
      </div>
    </div>
  );
}
