import React from 'react';

export interface CatSpriteProps {
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

export const CatSprite = React.memo(function CatSprite({
  width = 48,
  height = 48,
  style,
}: CatSpriteProps = {}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        overflow: 'visible',
        filter:
          'drop-shadow(0 0 6px var(--cat-glow, rgba(255, 115, 165, 0.65))) drop-shadow(0 1px 3px rgba(0,0,0,0.18))',
        ...style,
      }}
    >
      {/* ── Tail (Striped kawaii tail on right) ── */}
      <path
        d="M 47 43 
           C 53 45, 59 42, 60 35 
           C 61 29, 56 25, 51 27 
           C 47 29, 46 34, 46 39 Z"
        fill="var(--bg-surface, #ffffff)"
        stroke="var(--cat-color, #ff73a5)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tail stripes */}
      <path
        d="M 52 28 C 55 31, 56 34, 53 36"
        stroke="var(--cat-color, #ff73a5)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M 55 32 C 58 35, 58 38, 55 41"
        stroke="var(--cat-color, #ff73a5)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* ── Outer Head & Body Contour ── */}
      <path
        d="M 23 18
           C 18 10, 14 6, 21 8
           C 26 10, 27 15, 32 15
           C 37 15, 38 10, 43 8
           C 50 6, 46 10, 41 18
           C 51 23, 53 33, 49 42
           C 46 48, 41 51, 32 51
           C 23 51, 18 48, 15 42
           C 11 33, 13 23, 23 18 Z"
        fill="var(--bg-surface, #ffffff)"
        stroke="var(--cat-color, #ff73a5)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── Inner Ears ── */}
      {/* Left inner ear */}
      <path
        d="M 20 15 C 18 11, 17 9, 21 10 C 23 11, 24 13, 24 16"
        stroke="var(--cat-color, #ff73a5)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="var(--accent-tint, rgba(255, 115, 165, 0.2))"
      />
      {/* Right inner ear */}
      <path
        d="M 44 15 C 46 11, 47 9, 43 10 C 41 11, 40 13, 40 16"
        stroke="var(--cat-color, #ff73a5)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="var(--accent-tint, rgba(255, 115, 165, 0.2))"
      />

      {/* ── Whiskers (2 on each side) ── */}
      {/* Left Whiskers */}
      <line x1="6" y1="33" x2="16" y2="34" stroke="var(--cat-color, #ff73a5)" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="5" y1="38" x2="15" y2="38" stroke="var(--cat-color, #ff73a5)" strokeWidth="2.4" strokeLinecap="round" />

      {/* Right Whiskers */}
      <line x1="48" y1="34" x2="58" y2="33" stroke="var(--cat-color, #ff73a5)" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="49" y1="38" x2="59" y2="38" stroke="var(--cat-color, #ff73a5)" strokeWidth="2.4" strokeLinecap="round" />

      {/* ── Cheek Blush ── */}
      <ellipse cx="17" cy="35" rx="3.5" ry="2.2" fill="var(--cat-color, #ff73a5)" opacity="0.38" />
      <ellipse cx="47" cy="35" rx="3.5" ry="2.2" fill="var(--cat-color, #ff73a5)" opacity="0.38" />

      {/* ── Eyes (Big sparkling anime kawaii eyes) ── */}
      {/* Left eye */}
      <ellipse cx="25" cy="29" rx="3.5" ry="4.5" fill="var(--cat-color, #ff73a5)" />
      {/* Right eye */}
      <ellipse cx="39" cy="29" rx="3.5" ry="4.5" fill="var(--cat-color, #ff73a5)" />

      {/* Primary Highlights (Large top-left) */}
      <circle cx="24" cy="27.5" r="1.6" fill="#ffffff" />
      <circle cx="38" cy="27.5" r="1.6" fill="#ffffff" />

      {/* Secondary Highlights (Small bottom-right) */}
      <circle cx="26.3" cy="31.2" r="0.8" fill="#ffffff" />
      <circle cx="40.3" cy="31.2" r="0.8" fill="#ffffff" />

      {/* ── Nose & Mouth (:3 kitty smile) ── */}
      <path
        d="M 32 32.5 L 32 34.5 M 28.5 35 C 29.5 37.8, 32 37.8, 32 35 C 32 37.8, 34.5 37.8, 35.5 35"
        stroke="var(--cat-color, #ff73a5)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Little Paws at bottom ── */}
      <path
        d="M 24 46 C 24 49, 28 49, 28 46"
        stroke="var(--cat-color, #ff73a5)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 36 46 C 36 49, 40 49, 40 46"
        stroke="var(--cat-color, #ff73a5)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
});
