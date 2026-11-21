import { ParsedBtreePage, parseBtreePage } from '../parsers/btree-page';

export interface BtreeNode {
  pageNo: number;
  type: string;
  isLeaf: boolean;
  keys: number[];
  children: BtreeNode[];
  fillPercentage: number;
  cellCount: number;
  freeSpaceBytes: number;
}

export interface BtreeTreeModel {
  rootPageNo: number;
  tableName: string;
  isIndex: boolean;
  rootNode: BtreeNode | null;
  depth: number;
  totalPages: number;
  avgFillFactor: number;
}

export function buildBtreeModel(
  image: Uint8Array,
  rootPageNo: number,
  pageSize: number,
  tableName: string,
  isIndex = false
): BtreeTreeModel {
  const visited = new Set<number>();
  let totalFill = 0;
  let pageCount = 0;

  function traverse(pageNo: number, currentDepth: number): { node: BtreeNode; maxDepth: number } {
    if (visited.has(pageNo) || pageNo <= 0 || (pageNo - 1) * pageSize >= image.length) {
      return {
        node: {
          pageNo,
          type: 'UNKNOWN',
          isLeaf: true,
          keys: [],
          children: [],
          fillPercentage: 0,
          cellCount: 0,
          freeSpaceBytes: 0,
        },
        maxDepth: currentDepth,
      };
    }

    visited.add(pageNo);
    const offset = (pageNo - 1) * pageSize;
    const pageBuf = image.subarray(offset, offset + pageSize);
    let parsed: ParsedBtreePage;
    try {
      parsed = parseBtreePage(pageBuf, pageNo, pageSize);
    } catch {
      return {
        node: {
          pageNo,
          type: 'ERROR',
          isLeaf: true,
          keys: [],
          children: [],
          fillPercentage: 0,
          cellCount: 0,
          freeSpaceBytes: 0,
        },
        maxDepth: currentDepth,
      };
    }

    totalFill += parsed.fillPercentage;
    pageCount++;

    const isLeaf = parsed.header.pageType.endsWith('_LEAF');
    const keys: number[] = [];
    const children: BtreeNode[] = [];
    let deepest = currentDepth;

    if (isLeaf) {
      for (const cell of parsed.cells) {
        if (cell.rowid !== undefined) {
          keys.push(cell.rowid);
        }
      }
    } else {
      // Interior page
      for (const cell of parsed.cells) {
        if (cell.leftChildPage) {
          const res = traverse(cell.leftChildPage, currentDepth + 1);
          children.push(res.node);
          deepest = Math.max(deepest, res.maxDepth);
        }
        if (cell.rowid !== undefined) {
          keys.push(cell.rowid);
        }
      }
      if (parsed.header.rightChildPage) {
        const res = traverse(parsed.header.rightChildPage, currentDepth + 1);
        children.push(res.node);
        deepest = Math.max(deepest, res.maxDepth);
      }
    }

    return {
      node: {
        pageNo,
        type: parsed.header.pageType,
        isLeaf,
        keys,
        children,
        fillPercentage: parsed.fillPercentage,
        cellCount: parsed.header.cellCount,
        freeSpaceBytes: parsed.freeSpaceBytes,
      },
      maxDepth: deepest,
    };
  }

  const { node: rootNode, maxDepth } = traverse(rootPageNo, 1);

  return {
    rootPageNo,
    tableName,
    isIndex,
    rootNode,
    depth: maxDepth,
    totalPages: pageCount,
    avgFillFactor: pageCount > 0 ? Math.round(totalFill / pageCount) : 0,
  };
}

export function findRoutingPath(root: BtreeNode | null, targetKey: number): number[] {
  if (!root) return [];
  const path: number[] = [root.pageNo];
  if (root.isLeaf) return path;

  // Interior routing: keys partition children
  let childIdx = 0;
  for (let i = 0; i < root.keys.length; i++) {
    if (targetKey <= root.keys[i]!) {
      childIdx = i;
      break;
    }
    childIdx = i + 1;
  }

  if (root.children[childIdx]) {
    path.push(...findRoutingPath(root.children[childIdx]!, targetKey));
  }

  return path;
}
