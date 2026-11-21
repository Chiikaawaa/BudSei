import { describe, it, expect } from 'vitest';
import { findCellAtOffset } from '../../ui/bytebar-utils';
import { BtreeCell } from '../../parsers/cells';

describe('ByteBar 5k Cell Render & Binary Search Audit', () => {
  it('searches across 5,000 cells in under 1ms', () => {
    const cells: BtreeCell[] = [];
    let curOffset = 8192;
    for (let i = 0; i < 5000; i++) {
      curOffset -= 12;
      cells.push({
        offset: curOffset,
        size: 12,
        payloadSize: 8,
        rowid: i + 1,
      });
    }

    const t0 = performance.now();
    for (let i = 0; i < 1000; i++) {
      findCellAtOffset(cells, 4000);
    }
    const elapsed = performance.now() - t0;

    expect(elapsed).toBeLessThan(16);
  });
});
