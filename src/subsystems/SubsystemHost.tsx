import React from 'react';
import { useSessionStore } from '../store/sessionStore';
import { StorageView } from './storage/StorageView';
import { IndexLabView } from './index-lab/IndexLabView';
import { QueryView } from './query/QueryView';
import { MemoryDiskView } from './memory-disk/MemoryDiskView';
import { TransactionsView } from './transactions/TransactionsView';
import { JournalWalView } from './journal-wal/JournalWalView';
import { SchemaView } from './schema/SchemaView';

export const SubsystemHost = React.memo(function SubsystemHost() {
  const { activeSubsystem } = useSessionStore();

  switch (activeSubsystem) {
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
});
