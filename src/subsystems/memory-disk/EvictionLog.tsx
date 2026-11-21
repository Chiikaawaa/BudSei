import React from 'react';
import { Card } from '../../ui/Card';
import { CacheEvent } from '../../sim/pager-cache';

interface EvictionLogProps {
  events: CacheEvent[];
}

export const EvictionLog = React.memo(function EvictionLog({ events }: EvictionLogProps) {
  return (
    <Card title="PAGER ACCESS & EVICTION LOG" subtitle="Recent buffer pool transitions">
      <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {events.length > 0 ? (
          events.map((ev) => {
            const badgeColor =
              ev.type === 'HIT'
                ? '#10b981'
                : ev.type === 'MISS'
                ? '#3b82f6'
                : ev.type === 'EVICT'
                ? '#ef4444'
                : '#f59e0b';

            return (
              <div
                key={ev.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 8px',
                  background: 'var(--bg-surface)',
                  borderLeft: `2px solid ${badgeColor}`,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                }}
              >
                <span style={{ color: badgeColor, fontWeight: 700, width: '45px' }}>
                  [{ev.type}]
                </span>
                <span style={{ color: 'var(--text-primary)' }}>{ev.detail}</span>
              </div>
            );
          })
        ) : (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', padding: '10px' }}>
            No pager cache events recorded. Run queries or simulate page accesses.
          </div>
        )}
      </div>
    </Card>
  );
});
