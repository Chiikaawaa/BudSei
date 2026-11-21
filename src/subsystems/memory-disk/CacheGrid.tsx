import React from 'react';
import { Card } from '../../ui/Card';
import { CacheSlot } from '../../sim/pager-cache';

interface CacheGridProps {
  slots: CacheSlot[];
}

export const CacheGrid = React.memo(function CacheGrid({ slots }: CacheGridProps) {
  const maxAccess = Math.max(1, ...slots.map((s) => s.accessCount));

  return (
    <Card title="PAGER CACHE SLOTS" subtitle={`${slots.length} buffer pool slots in memory`}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
        {slots.map((slot) => {
          const isEmpty = slot.pageNo === null;
          const heatRatio = slot.accessCount / maxAccess;
          const borderColor =
            slot.state === 'pinned'
              ? '#8b5cf6'
              : slot.state === 'dirty'
              ? '#f59e0b'
              : slot.pageNo !== null
              ? '#10b981'
              : 'var(--border-color)';

          return (
            <div
              key={slot.slotId}
              style={{
                background: 'var(--bg-surface)',
                border: `1px solid ${borderColor}`,
                borderRadius: '2px',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)' }}>
                  Slot #{slot.slotId}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: borderColor,
                  }}
                >
                  {isEmpty ? 'EMPTY' : slot.state}
                </span>
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {isEmpty ? '—' : `Page P${slot.pageNo}`}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                <span>Accesses: {slot.accessCount}</span>
                <span>Heat: {Math.round(heatRatio * 100)}%</span>
              </div>

              {/* Heat bar */}
              <div style={{ height: '3px', background: 'var(--bg-surface-active)', borderRadius: '1px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${heatRatio * 100}%`, background: borderColor }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
});
