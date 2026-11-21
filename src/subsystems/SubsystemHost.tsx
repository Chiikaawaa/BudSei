import React, { lazy, Suspense } from 'react';
import { useSessionStore } from '../store/sessionStore';

const StorageView = lazy(() => import('./storage/StorageView').then((m) => ({ default: m.StorageView })));
const IndexLabView = lazy(() => import('./index-lab/IndexLabView').then((m) => ({ default: m.IndexLabView })));
const QueryView = lazy(() => import('./query/QueryView').then((m) => ({ default: m.QueryView })));
const MemoryDiskView = lazy(() => import('./memory-disk/MemoryDiskView').then((m) => ({ default: m.MemoryDiskView })));
const TransactionsView = lazy(() => import('./transactions/TransactionsView').then((m) => ({ default: m.TransactionsView })));
const JournalWalView = lazy(() => import('./journal-wal/JournalWalView').then((m) => ({ default: m.JournalWalView })));
const SchemaView = lazy(() => import('./schema/SchemaView').then((m) => ({ default: m.SchemaView })));

function renderView(subsystem: string) {
  switch (subsystem) {
    case 'storage':
      return <StorageView />;
    case 'index-lab':
      return <IndexLabView />;
    case 'query':
      return <QueryView />;
    case 'memory-disk':
      return <MemoryDiskView />;
    case 'transactions':
      return <TransactionsView />;
    case 'journal-wal':
      return <JournalWalView />;
    case 'schema':
      return <SchemaView />;
    default:
      return <StorageView />;
  }
}

export const SubsystemHost = React.memo(function SubsystemHost() {
  const activeSubsystem = useSessionStore((s) => s.activeSubsystem);

  return (
    <Suspense
      fallback={
        <div style={{ padding: '24px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
          Loading subsystem {activeSubsystem}…
        </div>
      }
    >
      {renderView(activeSubsystem)}
    </Suspense>
  );
});
