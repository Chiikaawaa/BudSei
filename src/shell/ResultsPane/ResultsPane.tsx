import React from 'react';
import styles from './ResultsPane.module.css';
import { ResultTable } from '../../ui/ResultTable';
import { useConsoleStore } from '../../store/consoleStore';
import { useSessionStore } from '../../store/sessionStore';

export const ResultsPane = React.memo(function ResultsPane() {
  const { results, status, errorMessage, lastDurationMs, lastTotalChanges } = useConsoleStore();
  const { sqliteVersion } = useSessionStore();

  const totalRowCount = results.reduce(
    (acc, curr) => acc + (curr.rows.length > 0 ? curr.rows.length : (curr.columnsData?.[0]?.length ?? 0)),
    0
  );

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.headerRow}>
        <span className={styles.headerTitle}>QUERY RESULTS</span>
        <div className={styles.headerRight}>
          {lastDurationMs !== null && (
            <span className={styles.timingBadge}>{lastDurationMs}ms</span>
          )}
          <span className={styles.rowCountBadge}>{totalRowCount} rows</span>
        </div>
      </div>

      <div className={styles.contentArea}>
        {status === 'error' && errorMessage ? (
          <div className={styles.errorContainer}>
            <div className={styles.errorTitle}>SQL Execution Error</div>
            <pre className={styles.errorMessage}>{errorMessage}</pre>
          </div>
        ) : results.length > 0 ? (
          <div className={styles.resultsStack}>
            {results.map((res, idx) => {
              const rowCount = res.rows.length > 0 ? res.rows.length : (res.columnsData?.[0]?.length ?? 0);
              return (
                <div key={idx} className={styles.singleResultBlock}>
                  {results.length > 1 && (
                    <div className={styles.stmtHeader}>
                      Statement {idx + 1} ({rowCount} rows)
                    </div>
                  )}
                  <div className={styles.tableWrapper}>
                    <ResultTable columns={res.columns} rows={res.rows} columnsData={res.columnsData} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : lastDurationMs !== null ? (
          <div className={styles.emptyState}>
            <p>Query executed successfully with 0 rows returned.</p>
            <p className={styles.subtext}>
              Duration: {lastDurationMs}ms · Changes: {lastTotalChanges}
            </p>
          </div>
        ) : (
          <div className={styles.emptyStateText}>
            -- SQLite {sqliteVersion} WASM In-Memory Database Ready --
            <br />
            Awaiting query execution. Select a laboratory preset above or enter…
          </div>
        )}
      </div>
    </div>
  );
});
