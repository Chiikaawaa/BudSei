import React, { useCallback, Suspense, lazy } from 'react';
import styles from './ConsolePane.module.css';
import { Select } from '../../ui/Select';
import { Badge } from '../../ui/Badge';
import { useConsoleStore } from '../../store/consoleStore';
import { SQL_PRESETS } from '../../engine/presets';

const SqlEditor = lazy(() =>
  import('./SqlEditor').then((mod) => ({ default: mod.SqlEditor }))
);

export const ConsolePane = React.memo(function ConsolePane() {
  const { sql, status, setSql, loadPreset, execute } = useConsoleStore();

  const handlePresetSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (!val) return;
      const found = SQL_PRESETS.find((p) => p.id === val);
      if (found) {
        loadPreset(found.sql);
      }
      e.target.value = '';
    },
    [loadPreset]
  );

  const presetOptions = [
    { value: '', label: 'Load Preset…' },
    ...SQL_PRESETS.map((p) => ({ value: p.id, label: p.label })),
  ];

  return (
    <div className={styles.consoleContainer}>
      <div className={styles.headerRow}>
        <span className={styles.headerTitle}>SQL CONSOLE</span>
        <div className={styles.headerControls}>
          <Select options={presetOptions} onChange={handlePresetSelect} />
          {status === 'ready' && <Badge variant="real">Ready</Badge>}
          {status === 'running' && <Badge variant="modeled">Running…</Badge>}
          {status === 'error' && <Badge variant="error">Error</Badge>}
        </div>
      </div>
      <div className={styles.editorArea}>
        <Suspense
          fallback={
            <div style={{ padding: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              Loading SQL Editor…
            </div>
          }
        >
          <SqlEditor value={sql} onChange={setSql} onExecute={execute} />
        </Suspense>
      </div>
    </div>
  );
});
