export interface TheoryTopic {
  id: string;
  title: string;
  intuitive: string;
  invariants: string;
}

export const SUBSYSTEM_THEORY: Record<string, TheoryTopic[]> = {
  storage: [
    {
      id: 'hdr100',
      title: '100-Byte Database File Header',
      intuitive: 'The first 100 bytes of page 1 act as the master identity certificate for the entire database file, defining physical page size, format versions, and schema cookies.',
      invariants: 'Source: btree.c, os.h. Invariant: Magic string must equal "SQLite format 3\\0". Evaluated in sqlite3BtreeOpen(). Changes to file structure bump change counter at offset 24.',
    },
    {
      id: 'slotted',
      title: 'Slotted Page & Cell Pointer Array',
      intuitive: 'Pages fill from both directions: cell pointers grow forward from the header, while actual record payloads fill backward from the end of the page to avoid fragmentation.',
      invariants: 'Source: btree.c:btreeInitPage(). Invariant: unallocated gap = cellContentStart - (headerOffset + headerSize + 2 * cellCount). Must be >= 0.',
    },
    {
      id: 'varint',
      title: 'Variable-Length Integers (Varints)',
      intuitive: 'Numbers are encoded in 1 to 9 bytes: small numbers take only a single byte, saving massive space across millions of rows.',
      invariants: 'Source: util.c:sqlite3GetVarint(). Invariant: High bit 0x80 signals continuation; 9th byte uses all 8 bits to represent full 64-bit unsigned integers.',
    },
    {
      id: 'overflow',
      title: 'Overflow Page Chaining',
      intuitive: 'When a record payload exceeds page capacity, SQLite keeps a prefix locally and spills the remainder into a singly-linked chain of overflow pages.',
      invariants: 'Source: btree.c:btreeOverwriteCell(). Invariant: Local payload fraction is bounded between U - 35 and ((U - 12) * 64 / 255) - 23 bytes.',
    },
  ],
  'index-lab': [
    {
      id: 'btree_vs_bplus',
      title: 'B-Tree vs B+ Tree Organization',
      intuitive: 'Tables store data records inside leaf pages (B-Tree with rowids), whereas secondary indexes form balanced B+ search trees with rowid pointers.',
      invariants: 'Source: btree.c:btreeParseCell(). Invariant: Leaf table cells hold rowid + record payload; interior table cells hold only left-child page + key.',
    },
    {
      id: 'interior_routing',
      title: 'Interior Divider Keys & Routing',
      intuitive: 'Interior pages contain divider keys that direct logarithmic binary searches down into the correct child page.',
      invariants: 'Source: btree.c:balance_deeper(). Invariant: Right-most child page pointer in header stores pointers strictly greater than all cell keys on page.',
    },
    {
      id: 'page_splits',
      title: '50/50 Page Balancing & Splits',
      intuitive: 'When an insertion fills an 8KB page, SQLite allocates a new page, splits the cells evenly, and promotes the median key upward.',
      invariants: 'Source: btree.c:balance_nonroot(). Invariant: Sibling pages are balanced to maintain at least ~50-67% fill factor across b-tree nodes.',
    },
    {
      id: 'clustering',
      title: 'Clustered RowID Storage',
      intuitive: 'Every standard SQLite table is physically clustered by its 64-bit integer rowid primary key, providing instant O(1) single-row lookups.',
      invariants: 'Source: btree.c:sqlite3BtreeInsert(). Invariant: Rowids must be strictly unique monotonically increasing or user-specified signed 64-bit ints.',
    },
  ],
  query: [
    {
      id: 'vdbe_arch',
      title: 'VDBE Register Machine Architecture',
      intuitive: 'SQLite compiles declarative SQL queries into bytecode instructions executed by an internal register-based virtual machine.',
      invariants: 'Source: vdbe.c:sqlite3VdbeExec(). Invariant: Instructions operate on virtual registers r[1..N] and memory cursors referencing active b-tree pages.',
    },
    {
      id: 'cursor_mgmt',
      title: 'Cursor Lifecycles & Seek Operations',
      intuitive: 'Cursors represent iterators positioned on table or index pages that navigate forward (Next) or seek specific keys (SeekGE).',
      invariants: 'Source: vdbeaux.c:sqlite3VdbeCursor(). Invariant: Cursors hold pins to underlying pager frames until closed or stepped past EOF.',
    },
    {
      id: 'query_plan',
      title: 'Query Planner Cost Estimation',
      intuitive: 'The planner evaluates whether a full table scan or an index seek requires fewer page reads from disk.',
      invariants: 'Source: where.c:sqlite3WhereBegin(). Invariant: Index scans cost O(log N) page reads + index lookup cost vs O(N) linear sequential scans.',
    },
    {
      id: 'covering_index',
      title: 'Covering Index Optimization',
      intuitive: 'If an index contains all columns requested by a SELECT query, SQLite reads directly from the index without touching the table.',
      invariants: 'Source: where.c:whereScanInit(). Invariant: Table b-tree cursor allocation is bypassed when all projected columns reside in index payload.',
    },
  ],
  'memory-disk': [
    {
      id: 'lru_evict',
      title: 'LRU Buffer Pool Eviction',
      intuitive: 'The pager maintains recently accessed database pages in memory, evicting the least recently used clean pages when the cache fills.',
      invariants: 'Source: pager.c:pager_lookup(). Invariant: Pinned pages (with active references) cannot be evicted until unreferenced (refCount == 0).',
    },
    {
      id: 'dirty_spill',
      title: 'Dirty Write-Back & Journal Spilling',
      intuitive: 'Modified pages are marked dirty in memory and written back to disk or journal before they can be evicted.',
      invariants: 'Source: pager.c:sqlite3PagerWrite(). Invariant: A page cannot be modified in place until its original image is logged in the rollback journal.',
    },
    {
      id: 'fsync_barrier',
      title: 'Fsync Durability Barriers',
      intuitive: 'Hardware write barriers ensure that disk caches flush all journal entries before database file pages are updated.',
      invariants: 'Source: os.h:sqlite3OsSync(). Invariant: Synchronous writes block until the operating system confirms physical disk sector persistence.',
    },
    {
      id: 'pin_safety',
      title: 'Buffer Pin Count Safety',
      intuitive: 'Active queries increment a reference pin count on cached pages to prevent eviction while being read.',
      invariants: 'Source: pager.c:sqlite3PagerUnref(). Invariant: Buffer frame memory remains valid and immovable as long as refCount > 0.',
    },
  ],
  transactions: [
    {
      id: 'lock_ladder',
      title: '5-State Lock Escalation Ladder',
      intuitive: 'Transactions escalate locks from UNLOCKED to SHARED, RESERVED, PENDING, and EXCLUSIVE to coordinate readers and writers.',
      invariants: 'Source: pager.c:pagerLockDb(). Invariant: Multiple SHARED locks allowed; exactly one RESERVED; PENDING drains readers; EXCLUSIVE is isolated.',
    },
    {
      id: 'pending_drain',
      title: 'PENDING Reader Drain Phase',
      intuitive: 'When a writer wants to commit, it acquires a PENDING lock, preventing new readers while existing readers finish.',
      invariants: 'Source: os_win.c, os_unix.c:sqlite3OsLock(). Invariant: Starvation prevention ensures write transactions cannot be indefinitely delayed by readers.',
    },
    {
      id: 'busy_handler',
      title: 'SQLITE_BUSY & Concurrency Contention',
      intuitive: 'When two connections attempt conflicting locks, the second receives SQLITE_BUSY unless a busy handler timeout retries.',
      invariants: 'Source: main.c:sqlite3InvokeBusyHandler(). Invariant: Failed lock acquisitions invoke user-configured sleep/retry callbacks before erroring.',
    },
    {
      id: 'savepoint',
      title: 'Savepoints & Sub-Transaction Rollback',
      intuitive: 'Savepoints allow partial rollbacks within a transaction without aborting the entire atomic unit of work.',
      invariants: 'Source: vdbeaux.c:sqlite3Savepoint(). Invariant: Savepoints record snapshot states in the rollback journal or WAL index log.',
    },
  ],
  'journal-wal': [
    {
      id: 'wal_format',
      title: 'Write-Ahead Log (WAL) Architecture',
      intuitive: 'Instead of overwriting database pages, changes append to a separate WAL file, allowing readers and writers to operate concurrently.',
      invariants: 'Source: wal.c:walIndexWriteHdr(). Invariant: Readers read latest committed frame from WAL index shared memory; writers append without blocking readers.',
    },
    {
      id: 'checkpoint',
      title: 'WAL Checkpoint Scheduling',
      intuitive: 'Checkpointing moves committed pages from the WAL file back into the original database file and resets the log.',
      invariants: 'Source: wal.c:sqlite3WalCheckpoint(). Invariant: PASSIVE checkpoints commit frames without waiting; TRUNCATE syncs and resets WAL size to 0.',
    },
    {
      id: 'rollback_undo',
      title: 'Rollback Journal Undo-Logging',
      intuitive: 'In DELETE/TRUNCATE mode, original page images are copied to a journal file before any database page is modified.',
      invariants: 'Source: pager.c:sqlite3PagerCommitPhaseOne(). Invariant: Journal header + original pages are fsynced before main database file writes begin.',
    },
    {
      id: 'checksum_salt',
      title: 'WAL Salt & Checksum Validation',
      intuitive: 'Every 24-byte WAL frame header includes salt and checksum pairs to detect torn writes or crash corruption.',
      invariants: 'Source: wal.c:walChecksumBytes(). Invariant: Checksum mismatches or salt divergences signal the end of valid committed transactions upon recovery.',
    },
  ],
  schema: [
    {
      id: 'schema_table',
      title: 'sqlite_schema Catalog Architecture',
      intuitive: 'The sqlite_schema table holds metadata definitions for all tables, indexes, triggers, and views in the database.',
      invariants: 'Source: schema.c:sqlite3InitCallback(). Invariant: Rootpage of sqlite_schema is permanently fixed at physical page 1 (header offset 100).',
    },
    {
      id: 'cookie_bump',
      title: 'Schema Cookie Validation',
      intuitive: 'Every CREATE, ALTER, or DROP statement increments the schema cookie, signaling cached statements to recompile.',
      invariants: 'Source: build.c:sqlite3SchemaClear(). Invariant: VDBE VerifyCookie instructions check if cookie matches expected generation at query execution time.',
    },
    {
      id: 'fk_checks',
      title: 'Foreign Key Constraint Enforcement',
      intuitive: 'Foreign keys ensure relational consistency by preventing orphaned child rows or illegal parent deletions.',
      invariants: 'Source: fkey.c:sqlite3FkCheck(). Invariant: Enforced in VDBE via internal seek cursors verifying referenced parent primary keys exist.',
    },
    {
      id: 'view_rewrite',
      title: 'Views & Subquery Flattening',
      intuitive: 'Views are virtual tables whose SQL definitions are parsed and inlined directly into query plans at execution time.',
      invariants: 'Source: select.c:sqlite3ViewGetColumnNames(). Invariant: Views do not occupy physical pages (rootpage = 0) and carry no stored byte payload.',
    },
  ],
};
