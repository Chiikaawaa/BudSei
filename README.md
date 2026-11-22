# BUDSEI — SQLite Internals Laboratory

An interactive, browser-native database internals laboratory and diagnostic workbench powered by the official SQLite WebAssembly build (`@sqlite.org/sqlite-wasm`).

BUDSEI demystifies database internals by turning the database engine from an opaque black box into an observable, inspectable physical reality. It pairs a Zed-inspired minimalist IDE workbench—featuring a multi-statement SQL console powered by CodeMirror 6, custom themes, and virtualized result grids—with seven diagnostic visualization subsystems and a dedicated Web Worker execution engine.

---

## Key Subsystems

BUDSEI divides database engine mechanics into seven dedicated diagnostic panels:

1. **Storage Engine (`/storage`)**
   - Slotted-page allocation layout and binary page parsing.
   - 100-byte database file header decoder (page size, file change counter, reserved bytes, free page list).
   - Cell pointer array visualization and record payload decoding (varint serial types, header formats).
   - Hardware-accelerated **ByteBar** visualization with $O(\log N)$ binary search hit-testing.

2. **Index Laboratory (`/indexes`)**
   - B-Tree table b-trees and B+ Tree index interior routing keys.
   - Interactive logarithmic search path tracing down page hierarchies.
   - Page split, balancing, and interior overflow mechanics.

3. **Query Engine (`/query`)**
   - Virtual Database Engine (VDBE) bytecode disassembly generated from `EXPLAIN`.
   - Register bank state tracking, active cursors, and opcode stepping.
   - Hierarchical query plan visualizer derived from `EXPLAIN QUERY PLAN`.

4. **Memory ↔ Disk (`/memory`)**
   - Pager buffer pool model with page cache hit/miss tracking.
   - Clean vs. dirty page state transitions.
   - LRU eviction simulation with hot/cold page heat maps.

5. **Transactions (`/transactions`)**
   - ACID lock-escalation finite state machine (`UNLOCKED` ➔ `SHARED` ➔ `RESERVED` ➔ `PENDING` ➔ `EXCLUSIVE`).
   - Dual-connection concurrent conflict simulation reproducing `SQLITE_BUSY` contention.

6. **Journal & WAL (`/wal`)**
   - Rollback journal undo-logging vs. Write-Ahead Logging (WAL) frame strip inspection.
   - Frame header parsing, 32-bit checksums, and salt validation.
   - Interactive checkpoint flow controllers (`PASSIVE`, `FULL`, `RESTART`, `TRUNCATE`).

7. **Schema Catalog (`/schema`)**
   - Real-time `sqlite_schema` master catalog parsing.
   - Table and index column specifications, primary keys, and auto-increment indicators.
   - Foreign key dependency graph generator and direct navigation to table root pages.

---

## Truth Labeling & Pedagogy

BUDSEI adheres to strict pedagogical honesty. Every diagnostic panel clearly indicates its source of truth:

- **`REAL SQLITE`**: Raw bytes and outputs extracted directly from the SQLite WASM engine (exported database image, `EXPLAIN` bytecode, PRAGMA outputs, `SELECT sqlite_version()`).
- **`MODELED`**: Derived by BUDSEI's parsers directly from real engine bytes (e.g., B-tree hierarchy, buffer pool state).
- **`EMULATED`**: Faithfully simulated database behaviors that cannot be directly queried in a single-threaded WASM browser worker (e.g., dual-connection lock state machine, WAL checkpoint flow).

### Cross-Cutting Features

- **Predict-then-Reveal**: Pedagogical prediction engine that prompts users with hypotheses prior to query execution and tracks streak metrics.
- **Why // Database Theory Drawer**: Contextual drawer offering dual perspectives on internal mechanics—*Intuitive Explanations* alongside *C-Source Invariants* directly referencing SQLite source files (`btree.c`, `pager.c`, `vdbe.c`, `where.c`, `wal.c`).
- **Time-Travel Scrubber**: Copy-On-Write (COW) snapshot timeline with page deduplication, allowing instantaneous rewind and forward inspection across all subsystems.
- **Interactive Cat Mascot**: Cursor-following pink SVG doodle with lerp easing, idle bobbing, and zero runtime cost when disabled.
- **High-Contrast Themes**: Custom dark (`#0e0e10`) and light (`#f7f7f9`) surfaces with tailored syntax highlighting and typography (`Space Mono` + `Inter`).

---

## Architectural Rules & Verification

- **Strict File Size Ceiling**: 100% of source files are strictly under 200 lines of code (enforced hard ceiling of 300 LOC) to ensure extreme modularity and maintainability. Verified continuously via `scripts/check-loc.mjs`.
- **Worker Isolation**: SQLite WASM execution runs off-thread in a dedicated Web Worker using an asynchronous RPC protocol (`src/engine/worker.ts` and `src/engine/rpc.ts`), keeping the 60 FPS UI smooth during heavy database workloads.
- **Bundle Optimization**: Subsystem routes are code-split using `React.lazy()` and `Suspense`, achieving an ultra-light initial gzipped bundle footprint (~56 kB).

---

## Project Structure

```text
buddy/
├── docs/                 # UI specifications and architectural audit logs
├── scripts/              # CI and verification scripts (LOC enforcement)
├── src/
│   ├── app/              # Top-level shell layout & routing
│   ├── engine/           # SQLite WASM worker, dual-connection simulator & RPC
│   ├── learn/            # Predict-then-reveal engine & COW snapshot history
│   ├── mascot/           # Interactive SVG doodle mascot & easing hooks
│   ├── parsers/          # Binary decoders (100-byte header, B-Tree, records, varints, journal)
│   ├── shell/            # NavRail, TopBar, ConsolePane, ResultsPane, BottomDrawer
│   ├── sim/              # Pager buffer pool & transaction lock state machines
│   ├── store/            # Lightweight Zustand stores (session, console, settings)
│   ├── styles/           # CSS design tokens, custom themes, and resets
│   ├── subsystems/       # Seven diagnostic visualization views
│   └── ui/               # Reusable primitives (ByteBar, virtualized ResultTable, etc.)
├── index.html            # Entry HTML
├── package.json          # Dependencies and npm scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite build configuration
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

```bash
git clone https://github.com/Chiikaawaa/BudSei.git
cd BudSei
npm install
```

### Development

Start the local development server with Vite:

```bash
npm run dev
```

### Verification & Testing

Run the full verification suite—including TypeScript type checking, strict line-of-code ceiling verification, and Vitest test suites:

```bash
# Run full verification
npm run check

# Or run individual verification steps:
npm run typecheck    # TypeScript verification (tsc --noEmit)
npm run check:loc    # Enforce <200 LOC per file
npm run test         # Unit and integration tests (vitest run)
```

### Production Build

Compile TypeScript and build the optimized production distribution:

```bash
npm run build
npm run preview      # Preview the production build locally
```

---

## License

MIT
