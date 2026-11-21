import React from 'react';
import styles from './TopBar.module.css';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Kbd } from '../../ui/Kbd';
import { useSessionStore } from '../../store/sessionStore';
import { useUiStore } from '../../store/uiStore';
import { useSettingsStore } from '../../store/settingsStore';

export const TopBar = React.memo(function TopBar() {
  const { pageSize, pageCount, dbName, connectionMode, toggleConnectionMode, isExecuting } =
    useSessionStore();
  const { toggleTheoryDrawer, setCommandPaletteOpen } = useUiStore();
  const { toggleTheme } = useSettingsStore();

  return (
    <div className={styles.topBar}>
      {/* Left brand & truth badges */}
      <div className={styles.leftGroup}>
        <div className={styles.brandGroup}>
          <span className="brand-text">BUDSEI</span>
          <span className={styles.brandSlash}>/</span>
          <span className={styles.brandSub}>SQLITE LAB</span>
        </div>

        <div className={styles.badgeGroup}>
          <Badge variant="real" title="Real SQLite WASM engine execution">
            REAL SQLITE
          </Badge>
          <Badge variant="modeled" title="Derived by BUDSEI's parsers from real bytes">
            MODELED
          </Badge>
          <Badge variant="emulated" title="Behavior modeled by BUDSEI simulators">
            EMULATED
          </Badge>
        </div>
      </div>

      {/* Center live engine pill */}
      <div className={styles.centerPill}>
        <span className={styles.greenDot} />
        <span>
          PAGE: {pageSize}B · {pageCount}P · {dbName}
        </span>
      </div>

      {/* Right control cluster */}
      <div className={styles.rightCluster}>
        <Button
          variant="primary"
          className={styles.execBtn}
          title="Execute SQL query (Cmd+Enter)"
          disabled={isExecuting}
        >
          <span>Execute</span>
          <Kbd>⌘↵</Kbd>
        </Button>

        <Button
          variant="outline"
          onClick={toggleConnectionMode}
          title="Toggle Single / Dual Connection Concurrency Mode"
        >
          Mode: {connectionMode}
        </Button>

        <Button
          variant="outline"
          onClick={() => setCommandPaletteOpen(true)}
          title="Open Command Palette (Cmd+K)"
        >
          ⌘K
        </Button>

        <Button
          variant="outline"
          onClick={toggleTheme}
          title="Menu / Settings (Toggle Dark/Light Theme)"
        >
          Menu ▾
        </Button>

        <Button
          variant="outline"
          className={styles.iconBtn}
          onClick={toggleTheoryDrawer}
          title="Why // Database Theory"
        >
          📖
        </Button>
      </div>
    </div>
  );
});
