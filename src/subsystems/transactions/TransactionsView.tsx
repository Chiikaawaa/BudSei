import { useState, useCallback } from 'react';
import { Badge } from '../../ui/Badge';
import { LockLadder } from './LockLadder';
import { DualConsole } from './DualConsole';
import { ConflictLog } from './ConflictLog';
import { AcidCards } from './AcidCards';
import { dualConnSim } from '../../engine/dual-conn';

export function TransactionsView() {
  const [, setVersion] = useState(0);

  const forceUpdate = useCallback(() => setVersion((v) => v + 1), []);

  const handleAction = useCallback(
    (conn: 'A' | 'B', action: any) => {
      dualConnSim.executeAction(conn, action);
      forceUpdate();
    },
    [forceUpdate]
  );

  const handleReset = useCallback(() => {
    dualConnSim.reset();
    forceUpdate();
  }, [forceUpdate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Badge variant="emulated" title="EMULATED: Concurrency conflict and lock escalation modeled to demonstrate multi-connection invariants">EMULATED</Badge>
        <Badge variant="accent">SUBSYSTEM // TRANSACTIONS</Badge>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>
          TRANSACTIONS
        </h2>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        ACID lock-escalation state machine, isolation anomalies, busy timeouts, and dual-connection concurrency.
      </p>

      {/* Dual connection interactive triggers */}
      <DualConsole onAction={handleAction} onReset={handleReset} />

      {/* Vertical Lock Ladder */}
      <LockLadder
        connALock={dualConnSim.fsm.connALock}
        connBLock={dualConnSim.fsm.connBLock}
      />

      {/* Concurrency and SQLITE_BUSY conflict log */}
      <ConflictLog logs={dualConnSim.logs} />

      {/* ACID properties cards */}
      <AcidCards />
    </div>
  );
}
