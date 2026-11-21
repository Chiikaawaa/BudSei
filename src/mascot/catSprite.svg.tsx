export function CatSprite() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        overflow: 'visible',
        filter: 'drop-shadow(0 0 6px var(--accent-color)) drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
      }}
    >
      {/* Body & Head */}
      <path
        d="M18 48 C 18 36, 24 24, 38 24 C 50 24, 54 34, 54 48 C 54 54, 46 56, 36 56 C 24 56, 18 54, 18 48 Z"
        fill="var(--bg-card)"
        stroke="var(--accent-color)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Left Ear */}
      <polygon
        points="22,26 27,12 34,24"
        fill="var(--bg-card)"
        stroke="var(--accent-color)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Right Ear */}
      <polygon
        points="42,24 49,12 52,26"
        fill="var(--bg-card)"
        stroke="var(--accent-color)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Eyes */}
      <circle cx="31" cy="34" r="2.5" fill="var(--accent-color)" />
      <circle cx="43" cy="34" r="2.5" fill="var(--accent-color)" />

      {/* Nose */}
      <polygon points="36,39 38,39 37,41" fill="var(--accent-color)" />

      {/* Mouth */}
      <path
        d="M34 42 Q 37 45 40 42"
        stroke="var(--accent-color)"
        strokeWidth="1.75"
        strokeLinecap="round"
      />

      {/* Whiskers Left */}
      <line x1="16" y1="36" x2="26" y2="38" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="41" x2="26" y2="40" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Whiskers Right */}
      <line x1="48" y1="38" x2="58" y2="36" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="48" y1="40" x2="58" y2="41" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Tail */}
      <path
        d="M18 50 C 12 50, 8 42, 10 36 C 11 32, 14 34, 13 36 C 12 39, 14 44, 18 45"
        stroke="var(--accent-color)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
