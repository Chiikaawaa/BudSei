import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

interface CheckpointPanelProps {
  onCheckpoint: (mode: 'PASSIVE' | 'FULL' | 'RESTART' | 'TRUNCATE') => void;
  isWal: boolean;
}

export const CheckpointPanel = React.memo(function CheckpointPanel({
  onCheckpoint,
  isWal,
}: CheckpointPanelProps) {
  const modes = [
    { mode: 'PASSIVE', desc: 'Checkpoints without waiting for readers. Non-blocking.' },
    { mode: 'FULL', desc: 'Waits for readers up to commit point, then flushes frames.' },
    { mode: 'RESTART', desc: 'Blocks until all readers read exclusively from database file.' },
    { mode: 'TRUNCATE', desc: 'Syncs database file and truncates WAL to 0 bytes.' },
  ] as const;

  return (
    <Card title="WAL CHECKPOINT CONTROLLER" subtitle="Flow frames back into physical database pages">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
        {modes.map((item) => (
          <div
            key={item.mode}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              padding: '10px',
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {item.mode}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                {item.desc}
              </div>
            </div>
            <Button variant="outline" disabled={!isWal} onClick={() => onCheckpoint(item.mode)}>
              Run {item.mode} Checkpoint
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
});
