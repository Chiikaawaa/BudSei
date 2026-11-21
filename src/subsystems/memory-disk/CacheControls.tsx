import React from 'react';
import { Button } from '../../ui/Button';

interface CacheControlsProps {
  capacity: number;
  onSetCapacity: (cap: number) => void;
  onAccessPages: (pages: number[], isWrite?: boolean) => void;
  onFlush: () => void;
  onReset: () => void;
}

export const CacheControls = React.memo(function CacheControls({
  capacity,
  onSetCapacity,
  onAccessPages,
  onFlush,
  onReset,
}: CacheControlsProps) {
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
          Cache Size:
        </span>
        {[2, 4, 8, 16].map((cap) => (
          <Button
            key={cap}
            variant={capacity === cap ? 'primary' : 'outline'}
            onClick={() => onSetCapacity(cap)}
          >
            {cap} Pages
          </Button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Button variant="outline" onClick={() => onAccessPages([1, 2, 3, 4, 5])}>
          Simulate Sequential Scan (P1–P5)
        </Button>
        <Button variant="outline" onClick={() => onAccessPages([1, 1, 2, 1, 3])}>
          Hot Page Reuse (P1, P2)
        </Button>
        <Button variant="outline" onClick={() => onAccessPages([2], true)}>
          Dirty Write (P2)
        </Button>
        <Button variant="outline" onClick={onFlush}>
          Flush Dirty
        </Button>
        <Button variant="outline" onClick={onReset}>
          Reset Cache
        </Button>
      </div>
    </div>
  );
});
