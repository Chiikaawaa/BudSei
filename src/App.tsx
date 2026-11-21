import './styles/global.css';
import { useSettingsStore } from './store/settingsStore';

export function App() {
  const { theme, toggleTheme } = useSettingsStore();

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="brand-text">BUDSEI</span>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
            / SQLITE LAB
          </span>
        </div>
        <button
          onClick={toggleTheme}
          style={{
            padding: '4px 10px',
            border: '1px solid var(--border-color)',
            borderRadius: '2px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            textTransform: 'uppercase',
          }}
        >
          Theme: {theme}
        </button>
      </header>

      <section style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span className="subsystem-tag" style={{ border: '1px solid var(--accent-border)', padding: '2px 6px', color: 'var(--accent-color)' }}>
          SUBSYSTEM // STORAGE ENGINE
        </span>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, letterSpacing: '0.08em' }}>
          STORAGE ENGINE
        </h2>
      </section>

      <section style={{ display: 'flex', gap: '16px' }}>
        <div style={{ border: '1px solid var(--border-color)', borderTop: '3px solid var(--accent-color)', padding: '12px 16px', minWidth: '140px', background: 'var(--bg-card)' }}>
          <div className="stat-value">8.0 KB</div>
          <div className="stat-label" style={{ marginTop: '4px' }}>PAGE SIZE</div>
        </div>
        <div style={{ border: '1px solid var(--border-color)', borderTop: '3px solid var(--accent-color)', padding: '12px 16px', minWidth: '140px', background: 'var(--bg-card)' }}>
          <div className="stat-value">0x0000</div>
          <div className="stat-label" style={{ marginTop: '4px' }}>ROOT OFFSET</div>
        </div>
      </section>
    </div>
  );
}
