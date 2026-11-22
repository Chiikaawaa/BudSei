import { useEffect } from 'react';
import { Badge } from '../../ui/Badge';
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
      {/* Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Badge variant="real" title="REAL SQLITE: Physical bytes, 100-byte header, and cell arrays parsed from SQLite WASM database image">REAL SQLITE</Badge>
        <Badge variant="accent">SUBSYSTEM // STORAGE ENGINE</Badge>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>
          STORAGE ENGINE
        </h2>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
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
