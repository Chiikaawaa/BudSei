export type SubsystemId =
  | 'storage'
  | 'index-lab'
  | 'query'
  | 'memory-disk'
  | 'transactions'
  | 'journal-wal'
  | 'schema';

export interface SubsystemRoute {
  id: SubsystemId;
  label: string;
  tag: string;
  description: string;
}

export const SUBSYSTEM_ROUTES: SubsystemRoute[] = [
  {
    id: 'storage',
    label: 'Storage Engine',
    tag: 'SUBSYSTEM // STORAGE ENGINE',
    description: 'Physical page allocation, 100-byte database header, slotted-page architectures, and decoded record payloads.',
  },
  {
    id: 'index-lab',
    label: 'Index Laboratory',
    tag: 'SUBSYSTEM // INDEX LABORATORY',
    description: 'B-Tree / B+ Tree interior routing paths, page splits, balanced leaf chains, and search depth.',
  },
  {
    id: 'query',
    label: 'Query Engine',
    tag: 'SUBSYSTEM // QUERY ENGINE',
    description: 'Virtual Database Engine (VDBE) bytecode disassembly, register state transitions, and explain query plans.',
  },
  {
    id: 'memory-disk',
    label: 'Memory ↔ Disk',
    tag: 'SUBSYSTEM // MEMORY ↔ DISK',
    description: 'Pager architecture, dirty/clean page caches, LRU replacement policies, and disk flush boundaries.',
  },
  {
    id: 'transactions',
    label: 'Transactions',
    tag: 'SUBSYSTEM // TRANSACTIONS',
    description: 'ACID lock-escalation state machine, isolation anomalies, busy timeouts, and dual-connection concurrency.',
  },
  {
    id: 'journal-wal',
    label: 'Journal & WAL',
    tag: 'SUBSYSTEM // JOURNAL & WAL',
    description: 'Rollback journal crash recovery, Write-Ahead Logging frames, salt validation, and checkpoint scheduling.',
  },
  {
    id: 'schema',
    label: 'Schema Catalog',
    tag: 'SUBSYSTEM // SCHEMA CATALOG',
    description: 'Internal sqlite_schema catalog tables, rootpage pointers, foreign keys, and schema cookies.',
  },
];
