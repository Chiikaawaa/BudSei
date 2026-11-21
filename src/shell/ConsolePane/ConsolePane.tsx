import React, { useCallback, Suspense, lazy } from 'react';
import styles from './ConsolePane.module.css';
import { Select } from '../../ui/Select';
import { Badge } from '../../ui/Badge';
import { PredictCard } from '../../learn/predict-reveal/PredictCard';
import { usePredictStore } from '../../learn/predict-reveal/predictStore';
import { selectQuestionForSql } from '../../learn/predict-reveal/questions';
import { useConsoleStore } from '../../store/consoleStore';
import { SQL_PRESETS } from '../../engine/presets';

const SqlEditor = lazy(() =>
  import('./SqlEditor').then((mod) => ({ default: mod.SqlEditor }))
);

export const ConsolePane = React.memo(function ConsolePane() {
  const { sql, status, setSql, loadPreset, execute } = useConsoleStore();
  const { enabled: predictEnabled, status: predictStatus, startPrediction, submitChoice } =
    usePredictStore();

  const handleExecuteWithPredict = useCallback(async () => {
    if (predictEnabled && predictStatus === 'idle') {
      const q = selectQuestionForSql(sql);
      if (q) {
        startPrediction(q);
        return;
      }
    }
    await execute();
  }, [predictEnabled, predictStatus, sql, startPrediction, execute]);

  const handleConfirmPrediction = useCallback(
    async (choice: string) => {
      await execute();
      const latestConsole = useConsoleStore.getState();
      submitChoice(choice, {}, latestConsole);
    },
    [execute, submitChoice]
  );

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
      <PredictCard onConfirmExecution={handleConfirmPrediction} />
      <div className={styles.editorArea}>
        <Suspense
          fallback={
            <div style={{ padding: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              Loading SQL Editor…
            </div>
          }
        >
          <SqlEditor value={sql} onChange={setSql} onExecute={handleExecuteWithPredict} />
        </Suspense>
      </div>
    </div>
  );
});
