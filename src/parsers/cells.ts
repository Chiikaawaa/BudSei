import { readVarint } from './varint';
import { decodeRecord, DecodedColumn } from './record';

export interface BtreeCell {
  offset: number;
  size: number;
  payloadSize: number;
  rowid?: number;
  leftChildPage?: number;
  overflowPage?: number;
  columns?: DecodedColumn[];
}

export function parseLeafTableCell(buffer: Uint8Array, offset: number): BtreeCell {
  let cursor = offset;
  const { value: payloadSize, bytesRead: pBytes } = readVarint(buffer, cursor);
  cursor += pBytes;

  const { value: rowid, bytesRead: rBytes } = readVarint(buffer, cursor);
  cursor += rBytes;

  const payloadOffset = cursor;
  const columns = decodeRecord(buffer, payloadOffset, payloadSize);
  const cellSize = pBytes + rBytes + payloadSize;

  return {
    offset,
    size: cellSize,
    payloadSize,
    rowid,
    columns,
  };
}

export function parseInteriorTableCell(buffer: Uint8Array, offset: number): BtreeCell {
  const view = new DataView(buffer.buffer, buffer.byteOffset + offset, 4);
  const leftChildPage = view.getUint32(0, false);
  const { value: rowid, bytesRead: rBytes } = readVarint(buffer, offset + 4);

  return {
    offset,
    size: 4 + rBytes,
    payloadSize: 0,
    leftChildPage,
    rowid,
  };
}

export function parseLeafIndexCell(buffer: Uint8Array, offset: number): BtreeCell {
  const { value: payloadSize, bytesRead: pBytes } = readVarint(buffer, offset);
  const payloadOffset = offset + pBytes;
  const columns = decodeRecord(buffer, payloadOffset, payloadSize);

  return {
    offset,
    size: pBytes + payloadSize,
    payloadSize,
    columns,
  };
}

export function parseInteriorIndexCell(buffer: Uint8Array, offset: number): BtreeCell {
  const view = new DataView(buffer.buffer, buffer.byteOffset + offset, 4);
  const leftChildPage = view.getUint32(0, false);
  const { value: payloadSize, bytesRead: pBytes } = readVarint(buffer, offset + 4);
  const payloadOffset = offset + 4 + pBytes;
  const columns = decodeRecord(buffer, payloadOffset, payloadSize);

  return {
    offset,
    size: 4 + pBytes + payloadSize,
    payloadSize,
    leftChildPage,
    columns,
  };
}
