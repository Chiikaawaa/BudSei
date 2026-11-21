import React from 'react';
import { Card } from '../../ui/Card';
import { WalFrame } from '../../parsers/wal-frame';

interface FrameStripProps {
  frames: WalFrame[];
  isWalActive: boolean;
}

export const FrameStrip = React.memo(function FrameStrip({ frames, isWalActive }: FrameStripProps) {
  if (!isWalActive) {
    return (
      <Card title="WRITE-AHEAD LOG (WAL) FRAME STRIP" subtitle="Rollback Journal mode active">
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '16px' }}>
          Database is in rollback journal mode. Switch PRAGMA journal_mode = WAL above to inspect frame appends.
        </div>
      </Card>
    );
  }

  return (
    <Card title="WRITE-AHEAD LOG (WAL) FRAME STRIP" subtitle={`${frames.length} frames logged in WAL file`}>
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '6px 0', minHeight: '90px' }}>
        {frames.length > 0 ? (
          frames.map((f) => (
            <div
              key={f.frameNo}
              style={{
                width: '110px',
                minWidth: '110px',
                background: 'var(--bg-surface)',
                border: `1px solid ${f.isCommit ? '#10b981' : 'var(--border-color)'}`,
                borderRadius: '2px',
                padding: '6px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700 }}>
                  Frame #{f.frameNo}
                </span>
                {f.isCommit && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      fontWeight: 700,
                      color: '#10b981',
                      background: 'rgba(16, 185, 129, 0.12)',
                      padding: '1px 3px',
                      borderRadius: '1px',
                    }}
                  >
                    COMMIT
                  </span>
                )}
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--accent-color)' }}>
                Page P{f.pageNo}
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)' }}>
                Salt: 0x{f.salt1.toString(16).slice(0, 4)}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '12px' }}>
            WAL is currently empty (all frames checkpointed). Execute an INSERT or UPDATE to append frames.
          </div>
        )}
      </div>
    </Card>
  );
});
