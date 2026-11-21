# BUDSEI — SQLite Internals Laboratory

BUDSEI is a high-fidelity, interactive browser-only SQLite internals laboratory powered by the official official SQLite WebAssembly build (`@sqlite.org/sqlite-wasm`).

BUDSEI demystifies database internals by turning the database engine from a black box into observable physical reality. It couples a Zed-inspired minimalist IDE workbench (multi-statement SQL console with CodeMirror 6, custom dark/light IDE themes, virtualized results) with seven diagnostic visualization subsystems:

1. **Storage Engine**: Slotted-page allocation, 100-byte database file header parsing, cell pointer arrays, record payload decoding, and hardware-accelerated ByteBar visualization with $O(\log N)$ binary search hit-testing.
2. **Index Laboratory**: B-Tree and B+ Tree interior routing keys, logarithmic search path tracing, and page split / balancing mechanics.
3. **Query Engine**: Virtual Database Engine (VDBE) bytecode disassembly (`EXPLAIN`), register banks, active cursors, and query plan trees (`EXPLAIN QUERY PLAN`).
4. **Memory ↔ Disk**: Pager buffer pool model, clean/dirty page states, and LRU eviction simulation with hot/cold heat coloring.
5. **Transactions**: ACID lock-escalation finite state machine (`UNLOCKED` ➔ `SHARED` ➔ `RESERVED` ➔ `PENDING` ➔ `EXCLUSIVE`) and dual-connection concurrency conflict (`SQLITE_BUSY`) reproduction.
6. **Journal & WAL**: Rollback journal undo-logging vs Write-Ahead Logging (WAL) frame strip, salt validation, and checkpoint controllers (`PASSIVE`, `FULL`, `RESTART`, `TRUNCATE`).
7. **Schema Catalog**: Internal `sqlite_schema` catalog inspection, table and index column specifications, foreign key dependency graphs, and direct navigation to rootpages.

---

## Truth Labeling & Pedagogy

BUDSEI labels every diagnostic panel honestly according to the source of truth:
- **`REAL SQLITE`**: Bytes and execution outputs extracted directly from the SQLite WASM engine (exported database image, `EXPLAIN` bytecode, pragmas, `SELECT sqlite_version()`).
- **`MODELED`**: Derived by BUDSEI's parsers from real engine bytes (B-tree node hierarchy, pager cache buffer pool).
- **`EMULATED`**: Behavior modeled by BUDSEI's simulators that cannot be directly exposed in single-threaded WASM workers (multi-connection lock state machine, WAL checkpoint flow).

### Cross-Cutting Features
- **Predict-then-Reveal**: Pedagogical prediction engine asking hypotheses prior to execution with streak tracking.
- **Why // Database Theory Drawer**: Contextual drawer toggling between *Intuitive explanations* and *C-source invariants* (referencing `btree.c`, `pager.c`, `vdbe.c`, `where.c`, `wal.c`).
- **Time-Travel Scrubber**: Copy-On-Write snapshot timeline with page deduplication, allowing instantaneous rewinds across all subsystems.
- **Cat Mascot**: Cursor-following pink SVG doodle with lerp easing, idle bobbing, and zero-cost complete unmounting when disabled.

---

## Architectural Rules & Guardrails
- **File Size Ceiling**: 100% of source files are under 200 lines (hard ceiling: 300). Verified continuously via `scripts/check-loc.mjs`.
- **Exclusions**: Strictly no Curriculum, Guided Lessons, or Challenge placeholders.
- **Bundle Optimization**: Code-split subsystem routes via `React.lazy()` and `Suspense`, achieving an initial gzipped bundle of ~56 kB.

---

## Development & Verification

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run full verification suite (TypeScript + LOC check + Vitest)
npm run check

# Build production bundle
npm run build
```
