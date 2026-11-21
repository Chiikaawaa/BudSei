import React from 'react';
import { Card } from '../../ui/Card';
import { ConnActionLog } from '../../engine/dual-conn';

interface ConflictLogProps {
  logs: ConnActionLog[];
}

export const ConflictLog = React.memo(function ConflictLog({ logs }: ConflictLogProps) {
  return (
    <Card title="CONCURRENCY & CONFLICT EVENT LOG" subtitle="Recent transaction transitions">
      <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {logs.length > 0 ? (
          logs.map((log) => {
            const isError = log.result === 'SQLITE_BUSY';
            return (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 8px',
                  background: isError ? 'var(--badge-error-bg)' : 'var(--bg-surface)',
                  borderLeft: `3px solid ${isError ? '#ef4444' : '#10b981'}`,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                }}
              >
                <span
                  style={{
                    color: log.conn === 'A' ? '#3b82f6' : '#ec4899',
                    fontWeight: 700,
                  }}
                >
                  CONN {log.conn}:
                </span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{log.action}</span>
                <span style={{ color: isError ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                  [{log.result}]
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>{log.detail}</span>
              </div>
            );
          })
        ) : (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', padding: '10px' }}>
            No transaction operations executed yet. Click actions above to simulate concurrency.
          </div>
        )}
      </div>
    </Card>
  );
});
