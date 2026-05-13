import React, { ReactNode } from 'react';

interface TacticalCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  noPadding?: boolean;
  onClick?: () => void;
}

export default function TacticalCard({ children, className = '', glow = false, noPadding = false, onClick }: TacticalCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl lg:rounded-3xl ${noPadding ? '' : 'p-4 lg:p-6'} ${className} ${onClick ? 'cursor-pointer hover:border-cyan-500/30 transition-all' : ''}`}
      style={{
        background: 'rgba(26, 26, 26, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(40px)',
        boxShadow: glow ? '0 0 30px rgba(0, 212, 255, 0.1)' : 'none',
      }}
    >
      {children}
    </div>
  );
}
