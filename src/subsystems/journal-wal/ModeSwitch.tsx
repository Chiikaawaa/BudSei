import React from 'react';
import { Button } from '../../ui/Button';

interface ModeSwitchProps {
  currentMode: string;
  onSelectMode: (mode: 'MEMORY' | 'DELETE' | 'TRUNCATE' | 'WAL') => void;
}

export const ModeSwitch = React.memo(function ModeSwitch({ currentMode, onSelectMode }: ModeSwitchProps) {
  const modes = ['MEMORY', 'DELETE', 'TRUNCATE', 'WAL'] as const;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-card)',
        padding: '10px 14px',
        border: '1px solid var(--border-color)',
        borderRadius: '2px',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
          PRAGMA journal_mode:
        </span>
        {modes.map((mode) => {
          const isWal = mode === 'WAL';
          return (
            <Button
              key={mode}
              variant={currentMode.toUpperCase() === mode ? 'primary' : 'outline'}
              disabled={isWal}
              title={isWal ? 'WAL mode requires a disk-backed VFS and cannot be enabled for in-memory (:memory:) databases.' : undefined}
              onClick={() => onSelectMode(mode)}
            >
              {mode} {isWal && '(N/A in :memory:)'}
            </Button>
          );
        })}
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
        Active Mode: <span style={{ color: 'var(--accent-color)', fontWeight: 700 }}>{currentMode}</span>
      </div>
    </div>
  );
});
