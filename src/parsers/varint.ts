/**
 * SQLite variable-length integer (varint) decoder and encoder.
 * Varints in SQLite are 1 to 9 bytes long.
 * First 8 bytes: 7 bits of payload, high bit indicates if more bytes follow.
 * 9th byte: all 8 bits are payload.
 */

export interface VarintResult {
  value: number;
  bytesRead: number;
}

export function readVarint(buffer: Uint8Array, offset: number): VarintResult {
  let val = 0;
  for (let i = 0; i < 8; i++) {
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
