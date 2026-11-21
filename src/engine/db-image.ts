import { sqliteRpc } from './rpc';
import { parseHeader100, SqliteHeader100 } from '../parsers/header100';

let currentImage: Uint8Array | null = null;
let currentHeader: SqliteHeader100 | null = null;

export async function refreshDbImage(): Promise<{ image: Uint8Array; header: SqliteHeader100 }> {
  const image = await sqliteRpc.export();
  const header = parseHeader100(image);
  currentImage = image;
  currentHeader = header;
  return { image, header };
}

export function getCachedDbImage(): Uint8Array | null {
  return currentImage;
}

export function getCachedHeader(): SqliteHeader100 | null {
  return currentHeader;
}
