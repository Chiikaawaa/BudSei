import React from 'react';
import { Button } from '../../ui/Button';
import { useSnapshotStore } from '../../learn/history/snapshotStore';

export const TimelineScrubber = React.memo(function TimelineScrubber() {
  const { snapshots, activeSnapshotId, scrubTo, restoreLive } = useSnapshotStore();

  if (snapshots.length === 0) {
    return (
      <div style={{ padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
        No historical snapshots available. Execute queries to populate the timeline.
      </div>
    );
  }

  const chronological = React.useMemo(() => [...snapshots].reverse(), [snapshots]);
  const activeIdx =
    activeSnapshotId !== null
      ? chronological.findIndex((s) => s.id === activeSnapshotId)
      : chronological.length - 1;
  const currentSnap = chronological[activeIdx] || snapshots[0]!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px 16px', height: '100%' }}>
      {/* Controls row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)', fontWeight: 700 }}>
            {activeSnapshotId ? `Viewing Snapshot #${currentSnap.id}` : 'Viewing Live Engine State'}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
            ({snapshots.length} snapshots recorded)
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {activeSnapshotId && (
            <Button variant="primary" onClick={() => restoreLive(currentSnap.id)}>
              Branch Live DB From Here 🌿
            </Button>
          )}
          <Button variant="outline" onClick={() => scrubTo(null)}>
            Return to Live
          </Button>
        </div>
      </div>

      {/* Horizontal Scrubber Track (Left: Oldest ➔ Right: Newest) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="range"
          min={0}
          max={chronological.length - 1}
          value={activeIdx}
          onChange={(e) => {
            const idx = Number(e.target.value);
            const target = chronological[idx];
            if (target) scrubTo(target.id);
          }}
          style={{ flex: 1, cursor: 'pointer' }}
        />
      </div>

      {/* Selected Snapshot Info Box */}
      <div style={{ display: 'flex', gap: '16px', background: 'var(--bg-surface)', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
        <div>
          <span style={{ color: 'var(--text-dim)' }}>Statement: </span>
          <span style={{ color: 'var(--text-primary)' }}>{currentSnap.sql}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-dim)' }}>Pages: </span>
          <span style={{ color: 'var(--accent-color)', fontWeight: 700 }}>{currentSnap.pageCount}P</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-dim)' }}>Changes: </span>
          <span style={{ color: 'var(--text-secondary)' }}>{currentSnap.changes}</span>
        </div>
      </div>
    </div>
  );
});
