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
  // Guard against overflow pages where local payload is smaller than total payloadSize
  const maxLocalPayload = Math.max(0, buffer.length - payloadOffset);
  const localPayloadSize = Math.min(payloadSize, maxLocalPayload);
  const columns = decodeRecord(buffer, payloadOffset, localPayloadSize);
  
  let overflowPage: number | undefined;
  if (payloadSize > localPayloadSize && buffer.length >= payloadOffset + localPayloadSize + 4) {
    const view = new DataView(buffer.buffer, buffer.byteOffset + payloadOffset + localPayloadSize, 4);
    overflowPage = view.getUint32(0, false);
  }

  const cellSize = Math.min(
    buffer.length - offset,
    pBytes + rBytes + localPayloadSize + (overflowPage !== undefined ? 4 : 0)
  );

  return {
    offset,
    size: cellSize,
    payloadSize,
    rowid,
    columns,
    overflowPage,
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
  const maxLocalPayload = Math.max(0, buffer.length - payloadOffset);
  const localPayloadSize = Math.min(payloadSize, maxLocalPayload);
  const columns = decodeRecord(buffer, payloadOffset, localPayloadSize);

  return {
    offset,
    size: pBytes + localPayloadSize,
    payloadSize,
    columns,
  };
}

export function parseInteriorIndexCell(buffer: Uint8Array, offset: number): BtreeCell {
  const view = new DataView(buffer.buffer, buffer.byteOffset + offset, 4);
  const leftChildPage = view.getUint32(0, false);
  const { value: payloadSize, bytesRead: pBytes } = readVarint(buffer, offset + 4);
  const payloadOffset = offset + 4 + pBytes;
  const maxLocalPayload = Math.max(0, buffer.length - payloadOffset);
  const localPayloadSize = Math.min(payloadSize, maxLocalPayload);
  const columns = decodeRecord(buffer, payloadOffset, localPayloadSize);

  return {
    offset,
    size: 4 + pBytes + localPayloadSize,
    payloadSize,
    leftChildPage,
    columns,
  };
}
