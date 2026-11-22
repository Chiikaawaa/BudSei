import { useState, useEffect, useCallback } from 'react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { BytecodeTable, VdbeInstruction } from './BytecodeTable';
import { RegisterView, RegisterState, CursorState } from './RegisterView';
import { PlanTree, PlanNode } from './PlanTree';
import { sqliteRpc } from '../../engine/rpc';
import { useConsoleStore } from '../../store/consoleStore';

// Hash-keyed memoization cache for EXPLAIN and EXPLAIN QUERY PLAN
const explainCache = new Map<string, { instructions: VdbeInstruction[]; planNodes: PlanNode[]; cursors: CursorState[] }>();

export function QueryView() {
  const consoleSql = useConsoleStore((s) => s.sql);
  const [queryInput, setQueryInput] = useState<string>('SELECT * FROM users WHERE id = 5;');
  const [instructions, setInstructions] = useState<VdbeInstruction[]>([]);
  const [planNodes, setPlanNodes] = useState<PlanNode[]>([]);
  const [currentAddr, setCurrentAddr] = useState<number>(0);
  const [registers, setRegisters] = useState<RegisterState[]>([]);
  const [cursors, setCursors] = useState<CursorState[]>([]);

  const analyzeQuery = useCallback(async (sqlToRun: string) => {
    const rawSql = sqlToRun.trim().replace(/^EXPLAIN\s+(QUERY\s+PLAN\s+)?/i, '');
    if (!rawSql) return;

    // Check memo cache first
    const cached = explainCache.get(rawSql);
    if (cached) {
      setInstructions(cached.instructions);
      setPlanNodes(cached.planNodes);
      setCursors(cached.cursors);
      setCurrentAddr(cached.instructions[0]?.addr ?? 0);
      return;
    }

    try {
      // 1. Run EXPLAIN
      const explainRes = await sqliteRpc.exec(`EXPLAIN ${rawSql}`);
      const rows = explainRes.results[0]?.rows || [];
      const insts: VdbeInstruction[] = rows.map((r) => ({
        addr: Number(r[0]),
        opcode: String(r[1]),
        p1: Number(r[2]),
        p2: Number(r[3]),
        p3: Number(r[4]),
        p4: String(r[5] ?? ''),
        p5: String(r[6] ?? ''),
        comment: String(r[7] ?? ''),
      }));
      setInstructions(insts);
      setCurrentAddr(insts[0]?.addr ?? 0);

      // Extract cursors from OpenRead/OpenWrite
      const parsedCursors: CursorState[] = [];
      for (const inst of insts) {
        if (inst.opcode === 'OpenRead' || inst.opcode === 'OpenWrite') {
          parsedCursors.push({
            cursorId: inst.p1,
            rootPage: inst.p2,
            tableName: inst.p4 || `Root ${inst.p2}`,
            status: 'Open',
          });
        }
      }
      setCursors(parsedCursors);

      // 2. Run EXPLAIN QUERY PLAN
      const eqpRes = await sqliteRpc.exec(`EXPLAIN QUERY PLAN ${rawSql}`);
      const eqpRows = eqpRes.results[0]?.rows || [];
      const nodes: PlanNode[] = eqpRows.map((r) => ({
        id: Number(r[0]),
        parent: Number(r[1]),
        detail: String(r[3] ?? r[2] ?? ''),
      }));
      setPlanNodes(nodes);

      // Cache result
      explainCache.set(rawSql, { instructions: insts, planNodes: nodes, cursors: parsedCursors });
    } catch (err) {
      console.error('Failed to explain query:', err);
    }
  }, []);

  useEffect(() => {
    analyzeQuery(queryInput);
  }, []);

  const handleStep = () => {
    if (instructions.length === 0) return;
    const currIdx = instructions.findIndex((i) => i.addr === currentAddr);
    const currInst = currIdx >= 0 ? instructions[currIdx]! : instructions[0]!;

    let nextAddr = (instructions[(currIdx + 1) % instructions.length]?.addr) ?? 0;

    // Follow SQLite VDBE branch instructions (Init, Goto, etc.)
    if ((currInst.opcode === 'Init' || currInst.opcode === 'Goto') && currInst.p2 >= 0) {
      const targetInst = instructions.find((i) => i.addr === currInst.p2);
      if (targetInst) {
        nextAddr = targetInst.addr;
      }
    }

    setCurrentAddr(nextAddr);

    // Update simulated registers based on opcode
    if (currInst.opcode === 'Integer') {
      setRegisters((prev) => [
        ...prev.filter((r) => r.index !== currInst.p2),
        { index: currInst.p2, value: currInst.p1, type: 'INTEGER' },
      ]);
    } else if (currInst.opcode === 'String8' || currInst.opcode === 'String') {
      setRegisters((prev) => [
        ...prev.filter((r) => r.index !== currInst.p2),
        { index: currInst.p2, value: currInst.p4 || '', type: 'TEXT' },
      ]);
    } else if (currInst.opcode === 'Real') {
      setRegisters((prev) => [
        ...prev.filter((r) => r.index !== currInst.p2),
        { index: currInst.p2, value: parseFloat(currInst.p4 || '0'), type: 'REAL' },
      ]);
    } else if (currInst.opcode === 'Null') {
      setRegisters((prev) => [
        ...prev.filter((r) => r.index !== currInst.p2),
        { index: currInst.p2, value: null, type: 'NULL' },
      ]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Badge variant="real" title="REAL SQLITE: EXPLAIN bytecode and query plans directly from SQLite WASM engine">REAL SQLITE</Badge>
          <Badge variant="modeled" title="MODELED: VDBE register states and cursor tracking modeled from opcodes">MODELED</Badge>
          <Badge variant="accent">SUBSYSTEM // QUERY ENGINE</Badge>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>
            QUERY ENGINE
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" onClick={() => { setQueryInput(consoleSql); analyzeQuery(consoleSql); }}>
            Load Console SQL
          </Button>
          <Button variant="primary" onClick={handleStep}>
            Step VDBE ⏭
          </Button>
          <Button variant="outline" onClick={() => { setCurrentAddr(instructions[0]?.addr ?? 0); setRegisters([]); }}>
            Reset
          </Button>
        </div>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        Virtual Database Engine (VDBE) bytecode disassembly, register state transitions, and explain query plans.
      </p>

      {/* Query input strip */}
      <div style={{ display: 'flex', gap: '10px', background: 'var(--bg-card)', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '2px' }}>
        <input
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder="Enter SQL statement to disassemble (e.g. SELECT * FROM users;)"
          style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '12px', padding: '4px 8px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '2px' }}
        />
        <Button variant="primary" onClick={() => analyzeQuery(queryInput)}>
          Analyze Bytecode
        </Button>
      </div>

      {/* Query Plan Tree */}
      <PlanTree nodes={planNodes} />

      {/* Bytecode Table & Register View side-by-side */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '12px' }}>
        <BytecodeTable
          instructions={instructions}
          currentAddr={currentAddr}
          onSelectInstruction={setCurrentAddr}
        />
        <RegisterView registers={registers} cursors={cursors} />
      </div>
    </div>
  );
}
