import React from 'react';
import { Stat } from '../../ui/Stat';
import { useSessionStore } from '../../store/sessionStore';
import { useStorageStore } from './storageStore';

export const StatCards = React.memo(function StatCards() {
  const { pageSize, pageCount, freelistCount, journalMode } = useSessionStore();
  const header = useStorageStore((s) => s.header);

  const effPageSize = header ? header.pageSize : pageSize;
  const effPageCount = header ? header.pageCount : pageCount;
  const effFreelist = header ? header.freelistCount : freelistCount;

  const pageSizeKb = (effPageSize / 1024).toFixed(1);
  const totalFileSizeKb = ((effPageSize * effPageCount) / 1024).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Stat value={`${pageSizeKb} KB`} label="PAGE SIZE" tooltip="Database page size in bytes" accentBorder={true} />
        <Stat value={effPageCount} label="PAGE COUNT" tooltip="Total allocated pages in file" accentBorder={false} />
        <Stat value={`${totalFileSizeKb} KB`} label="TOTAL FILE SIZE" tooltip="Calculated as page_size * page_count" accentBorder={false} />
        <Stat value={effFreelist} label="FREELIST" tooltip="Number of unallocated free pages" accentBorder={false} />
      </div>

      <div style={{ width: '220px' }}>
        <Stat value={journalMode} label="JOURNAL MODE" tooltip="Active SQLite transaction journal mode" accentBorder={true} />
      </div>
    </div>
  );
});
