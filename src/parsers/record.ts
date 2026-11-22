import { readVarint } from './varint';

export interface DecodedColumn {
  serialType: number;
  value: string | number | null | Uint8Array;
  typeLabel: string;
}

export function decodeRecord(buffer: Uint8Array, offset: number, payloadLength: number): DecodedColumn[] {
  if (payloadLength <= 0 || offset + payloadLength > buffer.length) {
    return [];
  }

  // Record header starts with header size varint
  const { value: headerSize, bytesRead: headerSizeBytes } = readVarint(buffer, offset);
  const headerEnd = offset + headerSize;
  let cursor = offset + headerSizeBytes;

  const serialTypes: number[] = [];
  while (cursor < headerEnd && cursor < buffer.length) {
    const { value: st, bytesRead } = readVarint(buffer, cursor);
    serialTypes.push(st);
    cursor += bytesRead;
  }

  // Now read column body
  let bodyCursor = headerEnd;
  const columns: DecodedColumn[] = [];

  for (const st of serialTypes) {
    if (bodyCursor > buffer.length) break;

    if (st === 0) {
      columns.push({ serialType: 0, value: null, typeLabel: 'NULL' });
    } else if (st === 1) {
      if (bodyCursor >= buffer.length) break;
      const val = (buffer[bodyCursor]! << 24) >> 24;
      bodyCursor += 1;
      columns.push({ serialType: 1, value: val, typeLabel: 'INT8' });
    } else if (st === 2) {
      if (bodyCursor + 2 > buffer.length) break;
      const view = new DataView(buffer.buffer, buffer.byteOffset + bodyCursor, 2);
      const val = view.getInt16(0, false);
      bodyCursor += 2;
      columns.push({ serialType: 2, value: val, typeLabel: 'INT16' });
    } else if (st === 3) {
      if (bodyCursor + 3 > buffer.length) break;
      const b0 = buffer[bodyCursor]!;
      const b1 = buffer[bodyCursor + 1]!;
      const b2 = buffer[bodyCursor + 2]!;
      let val = (b0 << 16) | (b1 << 8) | b2;
      if (val & 0x800000) val |= 0xff000000;
      bodyCursor += 3;
      columns.push({ serialType: 3, value: val, typeLabel: 'INT24' });
    } else if (st === 4) {
      if (bodyCursor + 4 > buffer.length) break;
      const view = new DataView(buffer.buffer, buffer.byteOffset + bodyCursor, 4);
      const val = view.getInt32(0, false);
      bodyCursor += 4;
      columns.push({ serialType: 4, value: val, typeLabel: 'INT32' });
    } else if (st === 5) {
      if (bodyCursor + 6 > buffer.length) break;
      // 6-byte signed integer (big-endian 48-bit)
      const b0 = buffer[bodyCursor]!;
      const b1 = buffer[bodyCursor + 1]!;
      const b2 = buffer[bodyCursor + 2]!;
      const b3 = buffer[bodyCursor + 3]!;
      const b4 = buffer[bodyCursor + 4]!;
      const b5 = buffer[bodyCursor + 5]!;
      let hi = (b0 << 8) | b1;
      if (hi & 0x8000) hi = hi - 0x10000;
      const lo = (b2 * 0x1000000) + (b3 << 16) + (b4 << 8) + b5;
      const val = (hi * 0x100000000) + lo;
      bodyCursor += 6;
      columns.push({ serialType: 5, value: val, typeLabel: 'INT48' });
    } else if (st === 6) {
      if (bodyCursor + 8 > buffer.length) break;
      const view = new DataView(buffer.buffer, buffer.byteOffset + bodyCursor, 8);
      const val = Number(view.getBigInt64(0, false));
      bodyCursor += 8;
      columns.push({ serialType: 6, value: val, typeLabel: 'INT64' });
    } else if (st === 7) {
      if (bodyCursor + 8 > buffer.length) break;
      const view = new DataView(buffer.buffer, buffer.byteOffset + bodyCursor, 8);
      const val = view.getFloat64(0, false);
      bodyCursor += 8;
      columns.push({ serialType: 7, value: val, typeLabel: 'FLOAT' });
    } else if (st === 8) {
      columns.push({ serialType: 8, value: 0, typeLabel: 'INT0' });
    } else if (st === 9) {
      columns.push({ serialType: 9, value: 1, typeLabel: 'INT1' });
    } else if (st >= 12 && st % 2 === 0) {
      const len = (st - 12) / 2;
      const safeLen = Math.max(0, Math.min(len, buffer.length - bodyCursor));
      const blob = buffer.subarray(bodyCursor, bodyCursor + safeLen);
      bodyCursor += safeLen;
      columns.push({ serialType: st, value: blob, typeLabel: `BLOB(${len})` });
    } else if (st >= 13 && st % 2 === 1) {
      const len = (st - 13) / 2;
      const safeLen = Math.max(0, Math.min(len, buffer.length - bodyCursor));
      const strBytes = buffer.subarray(bodyCursor, bodyCursor + safeLen);
      bodyCursor += safeLen;
      const text = new TextDecoder('utf-8').decode(strBytes);
      columns.push({ serialType: st, value: text, typeLabel: `TEXT(${len})` });
    } else {
      columns.push({ serialType: st, value: null, typeLabel: 'UNKNOWN' });
    }
  }

  return columns;
}
