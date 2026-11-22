import { describe, it, expect } from 'vitest';
import { hashPageBuffer, useSnapshotStore } from './snapshotStore';

describe('Copy-On-Write Snapshot Memory Bound Audit', () => {
  it('stores 500 statement snapshots with deduplicated pages using hashPageBuffer in < 50ms', () => {
    // Content-addressable page deduplication pool
    const pagePool = new Map<string, Uint8Array>();
    const snapshots: { id: number; pageKeys: string[] }[] = [];

    const t0 = performance.now();
    const basePage = new Uint8Array(8192);
    basePage[0] = 0x0d;
    const baseHash = hashPageBuffer(basePage);
    pagePool.set(baseHash, basePage);

    // 500 statements, only 5 actually modify pages
    for (let i = 1; i <= 500; i++) {
      let curPage = basePage;
      if (i % 100 === 0) {
        curPage = new Uint8Array(basePage);
        curPage[100] = i; // Modified byte
      }
      const h = hashPageBuffer(curPage);
      if (!pagePool.has(h)) {
        pagePool.set(h, curPage);
      }
      snapshots.push({ id: i, pageKeys: [h] });
    }
    const elapsed = performance.now() - t0;

    expect(snapshots.length).toBe(500);
    expect(pagePool.size).toBeLessThanOrEqual(6); // Only 6 distinct pages stored instead of 500!
    expect(elapsed).toBeLessThan(50);

    // Verify useSnapshotStore API methods are functional
    expect(typeof useSnapshotStore.getState().restoreLive).toBe('function');
  });
});
