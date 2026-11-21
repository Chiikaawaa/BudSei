import {
  BtreeCell,
  parseLeafTableCell,
  parseInteriorTableCell,
  parseLeafIndexCell,
  parseInteriorIndexCell,
} from './cells';

export type BtreePageType = 'TABLE_LEAF' | 'TABLE_INTERIOR' | 'INDEX_LEAF' | 'INDEX_INTERIOR' | 'UNKNOWN';

export interface BtreePageHeader {
  rawType: number;
  pageType: BtreePageType;
  typeAbbr: 'TBL-LF' | 'TBL-IN' | 'IDX-LF' | 'IDX-IN' | 'FREE' | 'UNK';
  firstFreeblock: number;
  cellCount: number;
  cellContentStart: number;
  fragmentedBytes: number;
  rightChildPage?: number;
  headerOffset: number;
  headerSize: number;
}

export interface ParsedBtreePage {
  pageNumber: number;
  pageSize: number;
  header: BtreePageHeader;
  cellPointers: number[];
  cells: BtreeCell[];
  freeSpaceBytes: number;
  fillPercentage: number;
}

// LRU parsed page cache keyed by `${changeCounter}:${pageNumber}`
const parsedPageCache = new Map<string, ParsedBtreePage>();
const MAX_CACHE_SIZE = 1000;

export function clearParsedPageCache() {
  parsedPageCache.clear();
}

export function parseBtreePage(
  pageBuffer: Uint8Array,
  pageNumber: number,
  pageSize: number,
  changeCounter = 0
): ParsedBtreePage {
  const cacheKey = `${changeCounter}:${pageNumber}`;
  const cached = parsedPageCache.get(cacheKey);
  if (cached) return cached;

  const headerOffset = pageNumber === 1 ? 100 : 0;
  if (pageBuffer.length < headerOffset + 8) {
    throw new Error(`Buffer too small for page ${pageNumber}`);
  }

  const view = new DataView(pageBuffer.buffer, pageBuffer.byteOffset + headerOffset);
  const rawType = view.getUint8(0);
  const firstFreeblock = view.getUint16(1, false);
  const cellCount = view.getUint16(3, false);
  const rawContentStart = view.getUint16(5, false);
  const cellContentStart = rawContentStart === 0 ? 65536 : rawContentStart;
  const fragmentedBytes = view.getUint8(7);

  let pageType: BtreePageType = 'UNKNOWN';
  let typeAbbr: BtreePageHeader['typeAbbr'] = 'UNK';
  let headerSize = 8;
  let rightChildPage: number | undefined;

  if (rawType === 0x0d) {
    pageType = 'TABLE_LEAF';
    typeAbbr = 'TBL-LF';
  } else if (rawType === 0x05) {
    pageType = 'TABLE_INTERIOR';
    typeAbbr = 'TBL-IN';
    headerSize = 12;
    rightChildPage = view.getUint32(8, false);
  } else if (rawType === 0x0a) {
    pageType = 'INDEX_LEAF';
    typeAbbr = 'IDX-LF';
  } else if (rawType === 0x02) {
    pageType = 'INDEX_INTERIOR';
    typeAbbr = 'IDX-IN';
    headerSize = 12;
    rightChildPage = view.getUint32(8, false);
  }

  // Read cell pointers using single DataView
  const cellPointers: number[] = [];
  const pointerStart = headerOffset + headerSize;
  const pageView = new DataView(pageBuffer.buffer, pageBuffer.byteOffset);
  for (let i = 0; i < cellCount; i++) {
    const ptrOffset = pointerStart + i * 2;
    if (ptrOffset + 2 <= pageBuffer.length) {
      cellPointers.push(pageView.getUint16(ptrOffset, false));
    }
  }

  // Parse cells
  const cells: BtreeCell[] = [];
  for (const ptr of cellPointers) {
    if (ptr > 0 && ptr < pageBuffer.length) {
      let cell: BtreeCell;
      if (rawType === 0x0d) {
        cell = parseLeafTableCell(pageBuffer, ptr);
      } else if (rawType === 0x05) {
        cell = parseInteriorTableCell(pageBuffer, ptr);
      } else if (rawType === 0x0a) {
        cell = parseLeafIndexCell(pageBuffer, ptr);
      } else if (rawType === 0x02) {
        cell = parseInteriorIndexCell(pageBuffer, ptr);
      } else {
        cell = { offset: ptr, size: 0, payloadSize: 0 };
      }
      cells.push(cell);
    }
  }

  const endOfPointers = pointerStart + cellCount * 2;
  const freeSpaceBytes = Math.max(0, cellContentStart - endOfPointers);
  const usedBytes = pageSize - freeSpaceBytes;
  const fillPercentage = Math.min(100, Math.max(1, Math.round((usedBytes / pageSize) * 100)));

  const result: ParsedBtreePage = {
    pageNumber,
    pageSize,
    header: {
      rawType,
      pageType,
      typeAbbr,
      firstFreeblock,
      cellCount,
      cellContentStart,
      fragmentedBytes,
      rightChildPage,
      headerOffset,
      headerSize,
    },
    cellPointers,
    cells,
    freeSpaceBytes,
    fillPercentage,
  };

  if (parsedPageCache.size >= MAX_CACHE_SIZE) {
    const firstKey = parsedPageCache.keys().next().value;
    if (firstKey) parsedPageCache.delete(firstKey);
  }
  parsedPageCache.set(cacheKey, result);

  return result;
}
