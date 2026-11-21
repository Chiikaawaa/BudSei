export interface WalHeader {
  magic: number;
  formatVersion: number;
  pageSize: number;
  checkpointSequence: number;
  salt1: number;
  salt2: number;
  checksum1: number;
  checksum2: number;
}

export interface WalFrame {
  frameNo: number;
  pageNo: number;
  commitSize: number;
  isCommit: boolean;
  salt1: number;
  salt2: number;
  checksum1: number;
  checksum2: number;
}

export function parseWalHeader(buffer: Uint8Array): WalHeader {
  if (buffer.length < 32) throw new Error('Buffer too small for WAL header');
  const view = new DataView(buffer.buffer, buffer.byteOffset, 32);

  return {
    magic: view.getUint32(0, false),
    formatVersion: view.getUint32(4, false),
    pageSize: view.getUint32(8, false),
    checkpointSequence: view.getUint32(12, false),
    salt1: view.getUint32(16, false),
    salt2: view.getUint32(20, false),
    checksum1: view.getUint32(24, false),
    checksum2: view.getUint32(28, false),
  };
}

export function parseWalFrames(buffer: Uint8Array, pageSize: number): WalFrame[] {
  const frames: WalFrame[] = [];
  const frameTotalSize = 24 + pageSize;
  let cursor = 32; // Skip 32-byte WAL header
  let frameIndex = 1;

  while (cursor + 24 <= buffer.length) {
    const view = new DataView(buffer.buffer, buffer.byteOffset + cursor, 24);
    const pageNo = view.getUint32(0, false);
    const commitSize = view.getUint32(4, false);
    const salt1 = view.getUint32(8, false);
    const salt2 = view.getUint32(12, false);
    const checksum1 = view.getUint32(16, false);
    const checksum2 = view.getUint32(20, false);

    frames.push({
      frameNo: frameIndex++,
      pageNo,
      commitSize,
      isCommit: commitSize > 0,
      salt1,
      salt2,
      checksum1,
      checksum2,
    });

    cursor += frameTotalSize;
  }

  return frames;
}
