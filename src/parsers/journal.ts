export interface RollbackJournalHeader {
  magic: string;
  pageCount: number;
  initialRandomNumber: number;
  sectorSize: number;
  pageSize: number;
}

export interface JournalPageRecord {
  pageNo: number;
  originalPageBytes: Uint8Array;
}

export function parseJournalHeader(buffer: Uint8Array): RollbackJournalHeader | null {
  if (buffer.length < 28) return null;
  const view = new DataView(buffer.buffer, buffer.byteOffset, 28);
  const m1 = view.getUint32(0, false);
  const m2 = view.getUint32(4, false);

  // SQLite journal magic: 0xd9d505f9 0x20a163d7
  const magic = `0x${m1.toString(16)}${m2.toString(16)}`;

  return {
    magic,
    pageCount: view.getUint32(8, false),
    initialRandomNumber: view.getUint32(12, false),
    sectorSize: view.getUint32(16, false),
    pageSize: view.getUint32(20, false),
  };
}
