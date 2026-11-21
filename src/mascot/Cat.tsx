import React from 'react';
import { CatSprite } from './catSprite.svg';
import { useCursorFollow } from './useCursorFollow';
import { useSettingsStore } from '../store/settingsStore';

export const Cat = React.memo(function Cat() {
  const mascotEnabled = useSettingsStore((s) => s.mascotEnabled);
  const catRef = useCursorFollow(mascotEnabled);

  // If disabled, completely unmount from DOM (zero cost, zero listeners)
  if (!mascotEnabled) {
    return null;
  }

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
