import React, { useCallback, Suspense, lazy } from 'react';
import styles from './ConsolePane.module.css';
import { Select } from '../../ui/Select';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { PredictCard } from '../../learn/predict-reveal/PredictCard';
import { usePredictStore } from '../../learn/predict-reveal/predictStore';
import { selectQuestionForSql } from '../../learn/predict-reveal/questions';
import { useConsoleStore } from '../../store/consoleStore';
import { sqliteRpc } from '../../engine/rpc';
import { useSessionStore } from '../../store/sessionStore';
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
      const preSession = useSessionStore.getState();
      let explainPlan = '';
      try {
        const eqp = await sqliteRpc.exec(`EXPLAIN QUERY PLAN ${sql.trim()}`);
        explainPlan = JSON.stringify(eqp.results[0]?.rows ?? '');
      } catch {
        // Ignore if EXPLAIN QUERY PLAN is not applicable
      }

      await execute();
      const latestConsole = useConsoleStore.getState();
      const postSession = useSessionStore.getState();
      submitChoice(
        choice,
        {
          ...preSession,
          pageStats: {
            pageCount: preSession.pageCount,
            pageSize: preSession.pageSize,
            freelistCount: preSession.freelistCount,
          },
        },
        {
          ...latestConsole,
          explainPlan,
          pageStats: {
            pageCount: postSession.pageCount,
            pageSize: postSession.pageSize,
            freelistCount: postSession.freelistCount,
          },
        }
      );
    },
    [sql, execute, submitChoice]
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

  const handleLoadDemo = useCallback(async () => {
    const demo = [
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, role TEXT DEFAULT \'user\', score INTEGER DEFAULT 0);',
      'CREATE INDEX IF NOT EXISTS idx_users_score ON users(score);',
      'INSERT OR IGNORE INTO users (id, name, role, score) VALUES (1,\'Alice\',\'admin\',95),(2,\'Bob\',\'user\',82),(3,\'Charlie\',\'user\',76),(4,\'Diana\',\'manager\',89),(5,\'Evan\',\'user\',64),(6,\'Fiona\',\'user\',91),(7,\'George\',\'dev\',84),(8,\'Hannah\',\'design\',88),(9,\'Ian\',\'user\',72),(10,\'Julia\',\'lead\',98),(11,\'Kevin\',\'user\',69),(12,\'Laura\',\'support\',79),(13,\'Marcus\',\'dev\',85),(14,\'Nora\',\'analyst\',93),(15,\'Oscar\',\'user\',71),(16,\'Penny\',\'manager\',87),(17,\'Quinn\',\'user\',75),(18,\'Rachel\',\'design\',90),(19,\'Sam\',\'dev\',83),(20,\'Tina\',\'user\',77);',
      'SELECT * FROM users WHERE score > 80 ORDER BY score DESC;',
    ].join('\n');
    loadPreset(demo);
    setTimeout(() => {
      useConsoleStore.getState().execute();
    }, 50);
  }, [loadPreset]);

  const presetOptions = [
    { value: '', label: 'Load Preset…' },
    ...SQL_PRESETS.map((p) => ({ value: p.id, label: p.label })),
  ];

  return (
    <div className={styles.consoleContainer}>
      <div className={styles.headerRow}>
        <span className={styles.headerTitle}>SQL CONSOLE</span>
        <div className={styles.headerControls}>
          <Button variant="outline" onClick={handleLoadDemo} title="Auto-populate SQLite with demo table, 20 rows, and B-tree index">
            Load Demo 🚀
          </Button>
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
