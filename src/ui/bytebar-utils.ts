import { BtreeCell } from '../parsers/cells';

/**
 * Binary search to find which cell (if any) contains the given byte offset.
 * Cells are arranged at descending or ascending offsets.
 */
export function findCellAtOffset(cells: BtreeCell[], targetOffset: number): BtreeCell | null {
  const len = cells.length;
  if (len === 0) return null;

  const isAsc = cells[0]!.offset <= cells[len - 1]!.offset;
  let low = 0;
  let high = len - 1;

  while (low <= high) {
    const mid = (low + high) >> 1;
    const cell = cells[mid]!;
    if (targetOffset >= cell.offset && targetOffset < cell.offset + cell.size) {
      return cell;
    }

    if (isAsc) {
      if (targetOffset < cell.offset) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    } else {
      // Descending order (SQLite cell content grows from end towards start)
      if (targetOffset < cell.offset) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  }

  // Linear fallback in case cells are non-monotonic (ordered by key instead of offset)
  for (let i = 0; i < len; i++) {
    const cell = cells[i]!;
    if (targetOffset >= cell.offset && targetOffset < cell.offset + cell.size) {
      return cell;
    }
  }

  return null;
}
