import { Badge } from '../../ui/Badge';
import { Stat } from '../../ui/Stat';
import { useSessionStore } from '../../store/sessionStore';

export function StorageView() {
  const { pageSize, pageCount, freelistCount, journalMode } = useSessionStore();
  const totalFileSizeKb = ((pageSize * pageCount) / 1024).toFixed(1);
  const pageSizeKb = (pageSize / 1024).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Badge variant="accent">SUBSYSTEM // STORAGE ENGINE</Badge>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>
          STORAGE ENGINE
        </h2>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        Physical page allocation, 100-byte database header, slotted-page architectures, and decoded record payloads.
      </p>

      {/* 4 Stat Cards */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Stat value={`${pageSizeKb} KB`} label="PAGE SIZE" tooltip="Database page size in bytes" />
        <Stat value={pageCount} label="PAGE COUNT" tooltip="Total allocated pages in file" />
        <Stat value={`${totalFileSizeKb} KB`} label="TOTAL FILE SIZE" tooltip="Calculated as page_size * page_count" />
        <Stat value={freelistCount} label="FREELIST" tooltip="Number of unallocated free pages" />
      </div>

      {/* Single-width card */}
      <div style={{ width: '220px' }}>
        <Stat value={journalMode} label="JOURNAL MODE" tooltip="Active SQLite transaction journal mode" accentBorder={false} />
      </div>
    </div>
  );
}
