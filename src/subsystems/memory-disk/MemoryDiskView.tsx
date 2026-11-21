import { Badge } from '../../ui/Badge';

export function MemoryDiskView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Badge variant="accent">SUBSYSTEM // MEMORY ↔ DISK</Badge>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>
          MEMORY ↔ DISK
        </h2>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        Pager architecture, dirty/clean page caches, LRU replacement policies, and disk flush boundaries.
      </p>
    </div>
  );
}
