import React from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';

export default function RestDay() {
  return (
    <div className="min-h-screen p-8">
      <TacticalHeader title="REST DAY" subtitle="TACTICAL FITNESS ECOSYSTEM" />
      <TacticalCard>
        <div className="font-mono text-center py-12" style={{ color: '#00D4FF' }}>
          REST DAY Module
        </div>
      </TacticalCard>
    </div>
  );
}
