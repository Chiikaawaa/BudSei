import React from 'react';
import styles from './TheoryDrawer.module.css';

export type TheoryMode = 'intuitive' | 'invariants';

interface ModeToggleProps {
  mode: TheoryMode;
  onChange: (mode: TheoryMode) => void;
}

export const ModeToggle = React.memo(function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className={styles.toggleTrack}>
      <button
        type="button"
        className={`${styles.toggleBtn} ${mode === 'intuitive' ? styles.toggleActive : ''}`}
        onClick={() => onChange('intuitive')}
      >
        Intuitive
      </button>
      <button
        type="button"
        className={`${styles.toggleBtn} ${mode === 'invariants' ? styles.toggleActive : ''}`}
        onClick={() => onChange('invariants')}
      >
        C-Source Invariants
      </button>
    </div>
  );
});
