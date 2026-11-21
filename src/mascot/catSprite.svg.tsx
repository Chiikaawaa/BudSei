import React from 'react';

export const CatSprite = React.memo(function CatSprite() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        overflow: 'visible',
        filter:
          'drop-shadow(0 0 6px var(--cat-glow, rgba(255, 115, 165, 0.65))) drop-shadow(0 1px 3px rgba(0,0,0,0.18))',
      }}
    >
      {/* Outer Head Contour & Ears */}
      <path
        d="M 17 25 
           C 15 16, 12 7, 20 11 
           C 25 14, 27 19, 32 19 
           C 37 19, 39 14, 44 11 
           C 52 7, 49 16, 47 25 
           C 55 31, 56 42, 51 50 
           C 45 58, 19 58, 13 50 
           C 8 42, 9 31, 17 25 Z"
        fill="var(--bg-surface, #ffffff)"
        stroke="var(--cat-color, #ff73a5)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Ear Left */}
      <path
        d="M 19 22 C 18 16, 17 12, 22 14 C 24 16, 25 19, 26 22"
        stroke="var(--cat-color, #ff73a5)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="var(--accent-tint, rgba(255, 115, 165, 0.2))"
      />

      {/* Inner Ear Right */}
      <path
        d="M 45 22 C 46 16, 47 12, 42 14 C 40 16, 39 19, 38 22"
        stroke="var(--cat-color, #ff73a5)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="var(--accent-tint, rgba(255, 115, 165, 0.2))"
      />

      {/* Left Eye */}
      <ellipse cx="24" cy="33" rx="2.5" ry="3.5" fill="var(--cat-color, #ff73a5)" />
      {/* Right Eye */}
      <ellipse cx="40" cy="33" rx="2.5" ry="3.5" fill="var(--cat-color, #ff73a5)" />

      {/* Eye catchlights */}
      <circle cx="23" cy="32" r="1.1" fill="#ffffff" />
      <circle cx="39" cy="32" r="1.1" fill="#ffffff" />

      {/* Nose */}
      <polygon points="31,38 33,38 32,40" fill="var(--cat-color, #ff73a5)" />

      {/* Mouth (:3 / w shape) */}
      <path
        d="M 28 41 C 29 44, 32 44, 32 41 C 32 44, 35 44, 36 41"
        stroke="var(--cat-color, #ff73a5)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Left Whiskers */}
      <line x1="10" y1="35" x2="19" y2="36" stroke="var(--cat-color, #ff73a5)" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="8" y1="41" x2="18" y2="40" stroke="var(--cat-color, #ff73a5)" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="11" y1="46" x2="19" y2="43" stroke="var(--cat-color, #ff73a5)" strokeWidth="2.2" strokeLinecap="round" />

      {/* Right Whiskers */}
      <line x1="45" y1="36" x2="54" y2="35" stroke="var(--cat-color, #ff73a5)" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="46" y1="40" x2="56" y2="41" stroke="var(--cat-color, #ff73a5)" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="45" y1="43" x2="53" y2="46" stroke="var(--cat-color, #ff73a5)" strokeWidth="2.2" strokeLinecap="round" />

      {/* Cheek Blush */}
      <circle cx="17" cy="39" r="3.5" fill="var(--cat-color, #ff73a5)" opacity="0.35" />
      <circle cx="47" cy="39" r="3.5" fill="var(--cat-color, #ff73a5)" opacity="0.35" />
    </svg>
  );
});
