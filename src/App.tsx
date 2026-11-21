import { AppLayout } from './app/layout/AppLayout';
import { Badge } from './ui/Badge';
import { Stat } from './ui/Stat';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Kbd } from './ui/Kbd';

export function App() {
  return (
    <AppLayout
      topBar={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', padding: '0 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-text">BUDSEI</span>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>/ SQLITE LAB</span>
            <div style={{ display: 'flex', gap: '4px', marginLeft: '6px' }}>
              <Badge variant="real">REAL SQLITE</Badge>
              <Badge variant="modeled">MODELED</Badge>
              <Badge variant="emulated">EMULATED</Badge>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--badge-real-text)', display: 'inline-block' }} />
            <span>PAGE: 8192B · 1P · :memory:</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button variant="primary">
              Execute <Kbd>⌘↵</Kbd>
            </Button>
            <Button variant="outline">Mode: Single</Button>
            <Button variant="outline">⌘K</Button>
            <Button variant="outline">Menu ▾</Button>
            <Button variant="outline" title="Why // Database Theory">📖</Button>
          </div>
        </div>
      }
      navRail={
        <div style={{ padding: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.12em', fontFamily: 'var(--font-mono)' }}>
            <span>NAVIGATION</span>
            <button style={{ color: 'inherit' }}>⇤</button>
          </div>
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ padding: '6px 8px', background: 'var(--accent-tint)', color: 'var(--accent-color)', borderLeft: '3px solid var(--accent-color)', fontSize: '12px', fontWeight: 600 }}>
              Storage Engine
            </div>
          </div>
        </div>
      }
      consolePane={
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>SQL CONSOLE</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Select options={[{ value: 'basic', label: 'Load Preset…' }]} />
              <Badge variant="real">Ready</Badge>
            </div>
          </div>
          <div style={{ padding: '12px', flex: 1, fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
            -- Enter SQLite statements (multi-statement supported)<br />
            SELECT sqlite_version();
          </div>
        </div>
      }
      resultsPane={
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>QUERY RESULTS</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>0 rows</span>
          </div>
          <div style={{ padding: '12px', flex: 1, fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
            -- SQLite 3.54 WASM In-Memory Database Ready --<br />
            Awaiting query execution. Select a laboratory preset above or enter…
          </div>
        </div>
      }
      subsystemPanel={
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Badge variant="accent">SUBSYSTEM // STORAGE ENGINE</Badge>
            <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>
              STORAGE ENGINE
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Physical page allocation, 100-byte database header, slotted-page architectures, and decoded record payloads.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Stat value="8.0 KB" label="PAGE SIZE" tooltip="Database page size in bytes" />
            <Stat value="1" label="PAGE COUNT" tooltip="Total allocated pages in file" />
            <Stat value="8.0 KB" label="TOTAL FILE SIZE" tooltip="Calculated as page_size * page_count" />
            <Stat value="0" label="FREELIST" tooltip="Number of unallocated free pages" />
          </div>
        </div>
      }
      footer={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>BUDSEI v0.2</span>
          <span>•</span>
          <span>SQLITE 3.54 WASM</span>
        </div>
      }
    />
  );
}
