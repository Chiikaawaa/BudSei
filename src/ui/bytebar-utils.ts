import { BtreeCell } from '../parsers/cells';

/**
 * Binary search to find which cell (if any) contains the given byte offset.
 * Cells are arranged at descending or ascending offsets.
 */
export function findCellAtOffset(cells: BtreeCell[], targetOffset: number): BtreeCell | null {
  if (cells.length === 0) return null;

  let low = 0;
  let high = cells.length - 1;

  while (low <= high) {
    const mid = (low + high) >> 1;
    const cell = cells[mid]!;
    const start = cell.offset;
    const end = cell.offset + cell.size;

    if (targetOffset >= start && targetOffset < end) {
      return cell;
    }

    if (targetOffset < start) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  // Linear check nearest neighborhood in case cells are non-monotonic
  for (let i = Math.max(0, low - 2); i < Math.min(cells.length, low + 3); i++) {
    const cell = cells[i]!;
    if (targetOffset >= cell.offset && targetOffset < cell.offset + cell.size) {
      return cell;
    }
  }

  return null;
}
