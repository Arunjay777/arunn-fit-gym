import React from 'react';

interface FitXLogoProps {
  className?: string;
  size?: number;
}

export default function FitXLogo({ className = 'w-9 h-9', size }: FitXLogoProps) {
  const finalSize = size ? `${size}px` : undefined;
  
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      style={finalSize ? { width: finalSize, height: finalSize } : undefined}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Core Vibrant Acid Green / Clean Mint Neon Gradient from the diagram example */}
        <linearGradient id="fitxVibrantGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10EB5B" />
          <stop offset="100%" stopColor="#00E676" />
        </linearGradient>

        {/* High-speed glowing filter overlay */}
        <filter id="neonGlowFitX" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Group wrapper applying the neon energy style */}
      <g filter="url(#neonGlowFitX)">
        
        {/* 1. INFINITY LOOP PATH */}
        {/* Centered, thick, continuous loop intersecting perfectly at (50, 50) */}
        <path
          d="M 30 50 C 13 32, 13 68, 30 50 C 47 32, 53 32, 70 50 C 87 68, 87 32, 70 50 C 53 68, 47 68, 30 50 Z"
          stroke="url(#fitxVibrantGreen)"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* 2. DUMBBELL PLATES: INTEGRATED WITH THE LOGO */}
        {/* Placed right through the center-left and center-right chambers to fuse both concepts */}
        
        {/* Left Side Dumbbell Plate Elements */}
        {/* Outer Left Plate - Small */}
        <rect 
          x="10" 
          y="42" 
          width="4" 
          height="16" 
          rx="2" 
          fill="url(#fitxVibrantGreen)" 
        />
        {/* Middle Left Plate - Medium */}
        <rect 
          x="16" 
          y="36" 
          width="4.5" 
          height="28" 
          rx="2.25" 
          fill="url(#fitxVibrantGreen)" 
        />

        {/* Right Side Dumbbell Plate Elements */}
        {/* Middle Right Plate - Medium */}
        <rect 
          x="79.5" 
          y="36" 
          width="4.5" 
          height="28" 
          rx="2.25" 
          fill="url(#fitxVibrantGreen)" 
        />
        {/* Outer Right Plate - Small */}
        <rect 
          x="86" 
          y="42" 
          width="4" 
          height="16" 
          rx="2" 
          fill="url(#fitxVibrantGreen)" 
        />

        {/* Center Knurled Handle accents */}
        {/* Highlights the crossover point of the infinity loop, bridging it to a solid steel dumbbell center shaft */}
        <line 
          x1="50" 
          y1="45" 
          x2="50" 
          y2="55" 
          stroke="url(#fitxVibrantGreen)" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          opacity="0.95"
        />

      </g>
    </svg>
  );
}
