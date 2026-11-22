import React from 'react';
import { CatSprite } from './catSprite.svg';
import { useCursorFollow } from './useCursorFollow';
import { useSettingsStore } from '../store/settingsStore';

/** Cat mascot that smoothly follows the cursor. Unmounts when disabled. */
export const Cat = React.memo(function Cat() {
  const mascotEnabled = useSettingsStore((s) => s.mascotEnabled);
  const catRef = useCursorFollow(mascotEnabled);

  if (!mascotEnabled) return null;

  return (
    <div
      ref={catRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '48px',
        height: '48px',
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform',
      }}
    >
      <CatSprite />
    </div>
  );
});
