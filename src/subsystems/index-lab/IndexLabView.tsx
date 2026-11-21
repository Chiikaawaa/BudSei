import { Badge } from '../../ui/Badge';

export function IndexLabView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Badge variant="accent">SUBSYSTEM // INDEX LABORATORY</Badge>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>
          INDEX LABORATORY
        </h2>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        B-Tree / B+ Tree interior routing paths, page splits, balanced leaf chains, and search depth.
      </p>
    </div>
  );
}
