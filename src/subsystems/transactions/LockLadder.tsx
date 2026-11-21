import React from 'react';
import { Card } from '../../ui/Card';
import { LockLevel, LOCK_LEVELS } from '../../sim/lock-fsm';

interface LockLadderProps {
  connALock: LockLevel;
  connBLock: LockLevel;
}

export const LockLadder = React.memo(function LockLadder({ connALock, connBLock }: LockLadderProps) {
  const ladderDesc: Record<LockLevel, string> = {
    UNLOCKED: 'No locks held. Database is quiescent.',
    SHARED: 'Read-only lock. Multiple readers allowed simultaneously.',
    RESERVED: 'Intent to write. Exactly 1 writer allowed; readers continue.',
    PENDING: 'Escalation state: waiting for active readers to finish.',
    EXCLUSIVE: 'Write lock active. No other readers or writers permitted.',
  };

  return (
    <Card title="ACID LOCK-ESCALATION LADDER" subtitle="SQLite 5-State Concurrency Protocol">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[...LOCK_LEVELS].reverse().map((level) => {
          const hasA = connALock === level;
          const hasB = connBLock === level;
          const isHigh = level === 'EXCLUSIVE' || level === 'PENDING';

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
                borderLeft: `4px solid ${isHigh ? '#ef4444' : level === 'RESERVED' ? '#f59e0b' : '#10b981'}`,
                borderRadius: '2px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {level}
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-muted)' }}>
                  {ladderDesc[level]}
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
