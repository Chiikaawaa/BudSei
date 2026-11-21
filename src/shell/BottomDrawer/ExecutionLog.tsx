import React from 'react';
import { useSnapshotStore, DbSnapshot } from '../../learn/history/snapshotStore';

export const ExecutionLog = React.memo(function ExecutionLog() {
  const { snapshots, activeSnapshotId, scrubTo } = useSnapshotStore();

  if (snapshots.length === 0) {
    return (
      <div style={{ padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
        No queries executed yet. Run queries from the SQL Console to record execution history.
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-dim)', textAlign: 'left', background: 'var(--bg-surface-active)' }}>
            <th style={{ width: '40px', padding: '4px 8px' }}>#</th>
            <th style={{ width: '70px', padding: '4px 8px' }}>Time</th>
            <th style={{ padding: '4px 8px' }}>Statement SQL</th>
            <th style={{ width: '60px', padding: '4px 8px' }}>Latency</th>
            <th style={{ width: '60px', padding: '4px 8px' }}>Changes</th>
            <th style={{ width: '50px', padding: '4px 8px' }}>Pages</th>
            <th style={{ width: '80px', padding: '4px 8px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {snapshots.map((snap: DbSnapshot) => {
            const isViewing = activeSnapshotId === snap.id;
            const timeStr = new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            return (
              <tr
                key={snap.id}
                style={{
                  borderBottom: '1px solid var(--border-muted)',
                  height: '24px',
                  background: isViewing ? 'var(--accent-tint)' : 'transparent',
                }}
              >
                <td style={{ color: 'var(--text-dim)', padding: '4px 8px' }}>#{snap.id}</td>
                <td style={{ color: 'var(--text-muted)', padding: '4px 8px' }}>{timeStr}</td>
                <td style={{ color: 'var(--text-primary)', padding: '4px 8px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {snap.sql}
                </td>
                <td style={{ color: 'var(--text-secondary)', padding: '4px 8px' }}>{snap.durationMs}ms</td>
                <td style={{ color: 'var(--text-secondary)', padding: '4px 8px' }}>{snap.changes}</td>
                <td style={{ color: 'var(--accent-color)', fontWeight: 600, padding: '4px 8px' }}>{snap.pageCount}P</td>
                <td style={{ padding: '4px 8px' }}>
                  <button
                    type="button"
                    onClick={() => scrubTo(isViewing ? null : snap.id)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: isViewing ? 'var(--accent-color)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    {isViewing ? '● Live' : 'Scrub'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
