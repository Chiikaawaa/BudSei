import { AppLayout } from './app/layout/AppLayout';
import { TopBar } from './shell/TopBar/TopBar';
import { NavRail } from './shell/NavRail/NavRail';
import { SubsystemHost } from './subsystems/SubsystemHost';
import { Badge } from './ui/Badge';
import { Select } from './ui/Select';
import { useSessionStore } from './store/sessionStore';

export function App() {
  const { sqliteVersion } = useSessionStore();

  return (
    <AppLayout
      topBar={<TopBar />}
      navRail={<NavRail />}
      consolePane={
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 10px',
              borderBottom: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
              }}
            >
              SQL CONSOLE
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Select options={[{ value: 'basic', label: 'Load Preset…' }]} />
              <Badge variant="real">Ready</Badge>
            </div>
          </div>
          <div
            style={{
              padding: '12px',
              flex: 1,
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}
          >
            -- Enter SQLite statements (multi-statement supported)
            <br />
            SELECT sqlite_version();
          </div>
        </div>
      }
      resultsPane={
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 10px',
              borderBottom: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
              }}
            >
              QUERY RESULTS
            </span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              0 rows
            </span>
          </div>
          <div
            style={{
              padding: '12px',
              flex: 1,
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}
          >
            -- SQLite {sqliteVersion} WASM In-Memory Database Ready --
            <br />
            Awaiting query execution. Select a laboratory preset above or enter…
          </div>
        </div>
      }
      subsystemPanel={<SubsystemHost />}
      footer={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>BUDSEI v0.2</span>
          <span>•</span>
          <span>SQLITE {sqliteVersion} WASM</span>
        </div>
      }
    />
  );
}
