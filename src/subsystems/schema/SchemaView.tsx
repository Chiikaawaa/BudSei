import { Badge } from '../../ui/Badge';

export function SchemaView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Badge variant="accent">SUBSYSTEM // SCHEMA CATALOG</Badge>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>
          SCHEMA CATALOG
        </h2>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        Internal sqlite_schema catalog tables, rootpage pointers, foreign keys, and schema cookies.
      </p>
    </div>
  );
}
