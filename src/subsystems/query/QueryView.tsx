import { Badge } from '../../ui/Badge';

export function QueryView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Badge variant="accent">SUBSYSTEM // QUERY ENGINE</Badge>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>
          QUERY ENGINE
        </h2>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        Virtual Database Engine (VDBE) bytecode disassembly, register state transitions, and explain query plans.
      </p>
    </div>
  );
}
