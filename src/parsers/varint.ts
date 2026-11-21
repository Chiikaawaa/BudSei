/**
 * SQLite variable-length integer (varint) decoder.
 * High-performance implementation with 1-byte and 2-byte inline fast paths.
 */

export interface VarintResult {
  value: number;
  bytesRead: number;
}

export function readVarint(buffer: Uint8Array, offset: number): VarintResult {
  const b0 = buffer[offset];
  if (b0 === undefined) return { value: 0, bytesRead: 0 };

  // 1-byte fast path (~80% of all varints)
  if ((b0 & 0x80) === 0) {
    return { value: b0, bytesRead: 1 };
  }

  // 2-byte fast path (~15% of all varints)
  const b1 = buffer[offset + 1];
  if (b1 !== undefined && (b1 & 0x80) === 0) {
    return { value: ((b0 & 0x7f) << 7) | b1, bytesRead: 2 };
  }

  // Multi-byte fallback (3 to 9 bytes)
  let val = ((b0 & 0x7f) << 7) | ((b1 ?? 0) & 0x7f);
  for (let i = 2; i < 8; i++) {
    if (offset + i >= buffer.length) {
      return { value: val, bytesRead: i };
    }
    const byte = buffer[offset + i]!;
    val = (val << 7) | (byte & 0x7f);
    if ((byte & 0x80) === 0) {
      return { value: val, bytesRead: i + 1 };
    }
  }

  // 9th byte takes full 8 bits
  if (offset + 8 < buffer.length) {
    const byte9 = buffer[offset + 8]!;
    val = (val << 8) | byte9;
    return { value: val, bytesRead: 9 };
  }

  return { value: val, bytesRead: 8 };
}
