import React from 'react';
import styles from './TopBar.module.css';
import { Button } from '../../ui/Button';
import { Kbd } from '../../ui/Kbd';
import { useSessionStore } from '../../store/sessionStore';
import { useUiStore } from '../../store/uiStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useConsoleStore } from '../../store/consoleStore';

export const TopBar = React.memo(function TopBar() {
  const isMac = typeof navigator !== 'undefined' && /Mac|iP[hone|ad]/.test(navigator.platform || '');
  const { pageSize, pageCount, dbName, connectionMode, toggleConnectionMode, isExecuting } =
    useSessionStore();
  const { toggleTheoryDrawer, setCommandPaletteOpen } = useUiStore();
  const { menuOpen, toggleMenu } = useSettingsStore();
  const execute = useConsoleStore((s) => s.execute);

  return (
    <div className={styles.topBar}>
      {/* Left: 3 circles (red, yellow, green) + brand */}
      <div className={styles.leftGroup}>
        <div className={styles.trafficLights} aria-label="Window controls">
          <span className={`${styles.circle} ${styles.circleRed}`} title="Red" />
          <span className={`${styles.circle} ${styles.circleYellow}`} title="Yellow" />
          <span className={`${styles.circle} ${styles.circleGreen}`} title="Green" />
        </div>

        <div className={styles.brandGroup}>
          <span className="brand-text">BUDSEI</span>
          <span className={styles.brandSlash}>/</span>
          <span className={styles.brandSub}>SQLITE LAB</span>
        </div>
      </div>

      {/* Center: live engine pill */}
      <div className={styles.centerPill}>
        <span className={styles.greenDot} />
        <span>PAGE: {pageSize}B · {pageCount}P · {dbName}</span>
      </div>

      {/* Right: controls */}
      <div className={styles.rightCluster}>
        <Button
          variant="primary"
          className={styles.execBtn}
          title={`Execute SQL query (${isMac ? 'Cmd+Enter' : 'Ctrl+Enter'})`}
          disabled={isExecuting}
          onClick={execute}
        >
          <span>Execute</span>
          <Kbd>{isMac ? '⌘↵' : 'Ctrl+↵'}</Kbd>
        </Button>

        <Button
          variant="outline"
          onClick={toggleConnectionMode}
          title={`Active Mode: ${connectionMode}. Click to toggle Single Connection vs Dual Concurrent Connections (Conn A & Conn B) for concurrency & lock simulation.`}
        >
          Mode: {connectionMode}
        </Button>

        <Button
          variant="outline"
          onClick={() => setCommandPaletteOpen(true)}
          title={`Open Command Palette (${isMac ? 'Cmd+K' : 'Ctrl+K'})`}
        >
          <span>🔍 {isMac ? '⌘K' : 'Ctrl+K'}</span>
        </Button>

        <Button
          variant={menuOpen ? 'primary' : 'outline'}
          onClick={toggleMenu}
          title="Open Theme & Mascot Settings Menu"
          aria-expanded={menuOpen}
        >
          ≡ Settings ▾
        </Button>

        <Button
          variant="outline"
          className={styles.iconBtn}
          onClick={toggleTheoryDrawer}
          title="Why // Database Theory: C-source invariants (btree.c, pager.c, vdbe.c) and architecture theory"
        >
          ◨ Theory
        </Button>
      </div>
    </div>
  );
});
