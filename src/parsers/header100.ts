export interface HeaderField {
  offset: number;
  size: number;
  name: string;
  rawValue: string | number;
  description: string;
}

export interface SqliteHeader100 {
  magicString: string;
  pageSize: number;
  writeVersion: number;
  readVersion: number;
  reservedBytes: number;
  maxPayloadFraction: number;
  minPayloadFraction: number;
  leafPayloadFraction: number;
  fileChangeCounter: number;
  pageCount: number;
  freelistTrunkPage: number;
  freelistCount: number;
  schemaCookie: number;
  schemaFormat: number;
  defaultCacheSize: number;
  largestBtreePage: number;
  textEncoding: 'UTF-8' | 'UTF-16le' | 'UTF-16be' | 'UNKNOWN';
  userVersion: number;
  incrementalVacuum: number;
  applicationId: number;
  versionValidFor: number;
  sqliteVersionNumber: number;
  fields: HeaderField[];
}

export function parseHeader100(buffer: Uint8Array): SqliteHeader100 {
  if (buffer.length < 100) {
    throw new Error(`Buffer too small for SQLite 100-byte header: ${buffer.length} bytes`);
  }
  const view = new DataView(buffer.buffer, buffer.byteOffset, 100);

  // Magic string: 16 bytes
  const magicBytes = buffer.subarray(0, 16);
  const magicString = String.fromCharCode(...magicBytes);

  let rawPageSize = view.getUint16(16, false);
  const pageSize = rawPageSize === 1 ? 65536 : rawPageSize;

  const writeVersion = view.getUint8(18);
  const readVersion = view.getUint8(19);
  const reservedBytes = view.getUint8(20);
  const maxPayloadFraction = view.getUint8(21);
  const minPayloadFraction = view.getUint8(22);
  const leafPayloadFraction = view.getUint8(23);
  const fileChangeCounter = view.getUint32(24, false);
  const pageCount = view.getUint32(28, false);
  const freelistTrunkPage = view.getUint32(32, false);
  const freelistCount = view.getUint32(36, false);
  const schemaCookie = view.getUint32(40, false);
  const schemaFormat = view.getUint32(44, false);
  const defaultCacheSize = view.getUint32(48, false);
  const largestBtreePage = view.getUint32(52, false);

  const encodingCode = view.getUint32(56, false);
  const textEncoding =
    encodingCode === 1 ? 'UTF-8' : encodingCode === 2 ? 'UTF-16le' : encodingCode === 3 ? 'UTF-16be' : 'UNKNOWN';

  const userVersion = view.getUint32(60, false);
  const incrementalVacuum = view.getUint32(64, false);
  const applicationId = view.getUint32(68, false);
  const versionValidFor = view.getUint32(92, false);
  const sqliteVersionNumber = view.getUint32(96, false);

  const fields: HeaderField[] = [
    { offset: 0, size: 16, name: 'Magic Header String', rawValue: magicString.replace(/\0/g, ''), description: 'Must be "SQLite format 3\\0"' },
    { offset: 16, size: 2, name: 'Page Size', rawValue: `${pageSize} bytes`, description: 'Database page size (512 - 65536)' },
    { offset: 18, size: 1, name: 'File Format Write Version', rawValue: writeVersion, description: writeVersion === 2 ? 'WAL mode' : 'Legacy rollback journal' },
    { offset: 19, size: 1, name: 'File Format Read Version', rawValue: readVersion, description: readVersion === 2 ? 'WAL mode' : 'Legacy rollback journal' },
    { offset: 20, size: 1, name: 'Reserved Space', rawValue: `${reservedBytes} bytes`, description: 'Unused bytes per page reserved for extensions' },
    { offset: 24, size: 4, name: 'File Change Counter', rawValue: fileChangeCounter, description: 'Incremented on database writes' },
    { offset: 28, size: 4, name: 'Database Size (Pages)', rawValue: pageCount, description: 'Total number of pages in file' },
    { offset: 32, size: 4, name: 'Freelist Trunk Page', rawValue: freelistTrunkPage, description: 'First page of freelist trunk (0 if none)' },
    { offset: 36, size: 4, name: 'Total Freelist Pages', rawValue: freelistCount, description: 'Number of unused free pages' },
    { offset: 40, size: 4, name: 'Schema Cookie', rawValue: schemaCookie, description: 'Incremented whenever database schema changes' },
    { offset: 44, size: 4, name: 'Schema Format', rawValue: schemaFormat, description: 'Format 1-4 supported' },
    { offset: 48, size: 4, name: 'Default Cache Size', rawValue: defaultCacheSize, description: 'Suggested pager cache size' },
    { offset: 56, size: 4, name: 'Text Encoding', rawValue: textEncoding, description: 'Database text encoding (UTF-8 = 1)' },
    { offset: 60, size: 4, name: 'User Version', rawValue: userVersion, description: 'PRAGMA user_version' },
    { offset: 68, size: 4, name: 'Application ID', rawValue: applicationId, description: 'PRAGMA application_id' },
    { offset: 92, size: 4, name: 'Version-Valid-For', rawValue: versionValidFor, description: 'Matches change counter when valid' },
    { offset: 96, size: 4, name: 'SQLite Version Number', rawValue: sqliteVersionNumber, description: `Source version: ${Math.floor(sqliteVersionNumber / 1000000)}.${Math.floor((sqliteVersionNumber % 1000000) / 1000)}.${sqliteVersionNumber % 1000}` },
  ];

  return {
    magicString,
    pageSize,
    writeVersion,
    readVersion,
    reservedBytes,
    maxPayloadFraction,
    minPayloadFraction,
    leafPayloadFraction,
    fileChangeCounter,
    pageCount,
    freelistTrunkPage,
    freelistCount,
    schemaCookie,
    schemaFormat,
    defaultCacheSize,
    largestBtreePage,
    textEncoding,
    userVersion,
    incrementalVacuum,
    applicationId,
    versionValidFor,
    sqliteVersionNumber,
    fields,
  };
}
