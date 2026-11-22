import React from 'react';
import { Card } from '../../ui/Card';
import { LockLevel, LOCK_LEVELS } from '../../sim/lock-fsm';

interface LockLadderProps {
  connALock: LockLevel;
  connBLock: LockLevel;
}

export const LockLadder = React.memo(function LockLadder({ connALock, connBLock }: LockLadderProps) {
  const ladderMeta: Record<LockLevel, { desc: string; step: number; icon: string; border: string }> = {
    UNLOCKED: { desc: 'No locks held. Database is quiescent.', step: 0, icon: '🔓', border: '#64748b' },
    SHARED: { desc: 'Read-only lock. Multiple readers allowed simultaneously.', step: 1, icon: '📖', border: '#10b981' },
    RESERVED: { desc: 'Intent to write. Exactly 1 writer allowed; readers continue.', step: 2, icon: '📝', border: '#0284c7' },
    PENDING: { desc: 'Escalation state: waiting for active readers to finish.', step: 3, icon: '⏳', border: '#f59e0b' },
    EXCLUSIVE: { desc: 'Write lock active. No other readers or writers permitted.', step: 4, icon: '🔒', border: '#8b5cf6' },
  };

  return (
    <Card title="ACID LOCK-ESCALATION LADDER" subtitle="SQLite 5-State Concurrency Protocol (Escalation Level 0 ➔ 4)">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {LOCK_LEVELS.map((level) => {
          const hasA = connALock === level;
          const hasB = connBLock === level;
          const meta = ladderMeta[level];

          return (
            <div
              key={level}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: hasA || hasB ? 'var(--accent-tint)' : 'var(--bg-surface)',
                border: `1px solid ${hasA || hasB ? 'var(--accent-color)' : 'var(--border-color)'}`,
                borderLeft: `4px solid ${meta.border}`,
                borderRadius: '2px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', background: 'var(--bg-surface-active)', padding: '1px 5px', borderRadius: '2px', border: '1px solid var(--border-color)' }}>
                    {meta.step}
                  </span>
                  <span style={{ fontSize: '12px' }}>{meta.icon}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {level}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '4px' }}>
                  {meta.desc}
                </div>
              </div>

              {/* Badges for Conn A / B */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {hasA && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '2px',
                      background: '#3b82f6',
                      color: '#ffffff',
                    }}
                  >
                    CONN A
                  </span>
                )}
                {hasB && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '2px',
                      background: '#ec4899',
                      color: '#ffffff',
                    }}
                  >
                    CONN B
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
});
