import { useState, useMemo, useCallback } from 'react';
import { Badge } from '../../ui/Badge';
import { Stat } from '../../ui/Stat';
import { CacheGrid } from './CacheGrid';
import { EvictionLog } from './EvictionLog';
import { CacheControls } from './CacheControls';
import { PagerCacheModel } from '../../sim/pager-cache';

export function MemoryDiskView() {
  const [cacheModel] = useState(() => new PagerCacheModel(4));
  const [version, setVersion] = useState(0);

  const forceUpdate = useCallback(() => setVersion((v) => v + 1), []);

  const totalAccesses = cacheModel.hits + cacheModel.misses;
  const hitRate = useMemo(
    () => (totalAccesses > 0 ? Math.round((cacheModel.hits / totalAccesses) * 100) : 0),
    [totalAccesses, cacheModel.hits, version]
  );

  const handleSetCapacity = useCallback(
    (cap: number) => {
      cacheModel.setCapacity(cap);
      forceUpdate();
    },
    [cacheModel, forceUpdate]
  );

  const handleAccessPages = useCallback(
    (pages: number[], isWrite = false) => {
      for (const p of pages) {
        cacheModel.accessPage(p, isWrite);
      }
      forceUpdate();
    },
    [cacheModel, forceUpdate]
  );

  const handleFlush = useCallback(() => {
    cacheModel.flush();
    forceUpdate();
  }, [cacheModel, forceUpdate]);

  const handleReset = useCallback(() => {
    cacheModel.reset();
    forceUpdate();
  }, [cacheModel, forceUpdate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Badge variant="modeled" title="MODELED: Pager buffer pool and LRU eviction simulation derived from access patterns">MODELED</Badge>
        <Badge variant="accent">SUBSYSTEM // MEMORY ↔ DISK</Badge>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>
          MEMORY ↔ DISK
        </h2>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        Pager architecture, dirty/clean page caches, LRU replacement policies, and disk flush boundaries.
      </p>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Stat value={`${cacheModel.capacity} Pages`} label="CACHE CAPACITY" tooltip="Configured PRAGMA cache_size" />
        <Stat value={totalAccesses > 0 ? `${hitRate}%` : 'n/a'} label="HIT RATIO" tooltip="Ratio of cache hits over total page accesses (n/a before first access)" />
        <Stat value={totalAccesses > 0 ? cacheModel.hits : 'n/a'} label="CACHE HITS" tooltip="Accesses served from memory buffer pool" />
        <Stat value={totalAccesses > 0 ? cacheModel.evictions : 'n/a'} label="EVICTIONS" tooltip="Pages evicted to free buffer pool frames (n/a before first access)" />
      </div>

      {/* Cache Interactive Controls */}
      <CacheControls
        capacity={cacheModel.capacity}
        onSetCapacity={handleSetCapacity}
        onAccessPages={handleAccessPages}
        onFlush={handleFlush}
        onReset={handleReset}
      />

      {/* Buffer Pool Cache Grid */}
      <CacheGrid slots={cacheModel.slots} />

      {/* Eviction Event Log */}
      <EvictionLog events={cacheModel.events} />
    </div>
  );
}
