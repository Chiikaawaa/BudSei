import { useEffect } from 'react';
import { StatCards } from './StatCards';
import { AllocationMap } from './AllocationMap';
import { PageDetail } from './PageDetail';
import { useStorageStore } from './storageStore';

export function StorageView() {
  const refreshStorage = useStorageStore((s) => s.refreshStorage);

  useEffect(() => {
    refreshStorage();
  }, [refreshStorage]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      {/* Title Header matching UI spec and screenshot */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--accent-color)',
          }}
        >
          SUBSYSTEM // STORAGE ENGINE
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '15px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
          }}
        >
          STORAGE ENGINE
        </h2>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '-8px' }}>
        Physical page allocation, 100-byte database header, slotted-page architectures, and decoded record payloads.
      </p>

      {/* 4 Stat Cards + Journal Mode */}
      <StatCards />

      {/* Physical Page Allocation Map */}
      <AllocationMap />

      {/* Selected Page Detail (ByteBar, Headers, Cells) */}
      <PageDetail />
    </div>
  );
}
