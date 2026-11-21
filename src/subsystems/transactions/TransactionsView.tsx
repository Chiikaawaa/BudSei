import { Badge } from '../../ui/Badge';

export function TransactionsView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Badge variant="accent">SUBSYSTEM // TRANSACTIONS</Badge>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>
          TRANSACTIONS
        </h2>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        ACID lock-escalation state machine, isolation anomalies, busy timeouts, and dual-connection concurrency.
      </p>
    </div>
  );
}
