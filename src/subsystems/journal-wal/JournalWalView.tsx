import { Badge } from '../../ui/Badge';

export function JournalWalView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Badge variant="accent">SUBSYSTEM // JOURNAL & WAL</Badge>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>
          JOURNAL & WAL
        </h2>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        Rollback journal crash recovery, Write-Ahead Logging frames, salt validation, and checkpoint scheduling.
      </p>
    </div>
  );
}
