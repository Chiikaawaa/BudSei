import React from 'react';
import { Card } from '../../ui/Card';

export interface RegisterState {
  index: number;
  value: string | number | null;
  type: string;
}

export interface CursorState {
  cursorId: number;
  rootPage: number;
  tableName: string;
  status: 'Closed' | 'Open' | 'EOF';
}

interface RegisterViewProps {
  registers: RegisterState[];
  cursors: CursorState[];
}

export const RegisterView = React.memo(function RegisterView({ registers, cursors }: RegisterViewProps) {
  return (
    <Card title="VDBE REGISTERS & CURSORS" subtitle="Virtual Machine State">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Active Cursors */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Open Table Cursors
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {cursors.length > 0 ? (
              cursors.map((c) => (
                <div
                  key={c.cursorId}
                  style={{
                    padding: '4px 8px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                  }}
                >
                  <span style={{ color: 'var(--accent-color)', fontWeight: 700 }}>Cursor {c.cursorId}:</span>{' '}
                  <span style={{ color: 'var(--text-primary)' }}>{c.tableName}</span> (P{c.rootPage}) ·{' '}
                  <span style={{ color: '#10b981' }}>{c.status}</span>
                </div>
              ))
            ) : (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                No active cursors allocated.
              </span>
            )}
          </div>
        </div>

        {/* Register Bank */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Register Bank (r[1..N])
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {registers.length > 0 ? (
              registers.map((r) => (
                <div
                  key={r.index}
                  style={{
                    padding: '4px 8px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    minWidth: '70px',
                  }}
                >
                  <div style={{ color: 'var(--text-dim)', fontSize: '10px' }}>r[{r.index}]</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{String(r.value)}</div>
                </div>
              ))
            ) : (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                r[1] — r[4]: Ready
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
});
