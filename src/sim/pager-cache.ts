export type PageCacheState = 'clean' | 'dirty' | 'pinned';

export interface CacheSlot {
  slotId: number;
  pageNo: number | null;
  state: PageCacheState;
  accessCount: number;
  lastAccessTime: number;
}

export interface CacheEvent {
  id: number;
  timestamp: number;
  type: 'HIT' | 'MISS' | 'EVICT' | 'FLUSH' | 'PIN';
  pageNo: number;
  detail: string;
}

export class PagerCacheModel {
  public capacity: number;
  public slots: CacheSlot[];
  public events: CacheEvent[] = [];
  public hits = 0;
  public misses = 0;
  public evictions = 0;
  private nextEventId = 1;

  constructor(capacity = 5) {
    this.capacity = capacity;
    this.slots = Array.from({ length: capacity }, (_, i) => ({
      slotId: i,
      pageNo: null,
      state: 'clean',
      accessCount: 0,
      lastAccessTime: 0,
    }));
  }

  public setCapacity(newCapacity: number) {
    const safeCap = Math.max(2, Math.min(32, newCapacity));
    this.capacity = safeCap;
    while (this.slots.length < safeCap) {
      this.slots.push({
        slotId: this.slots.length,
        pageNo: null,
        state: 'clean',
        accessCount: 0,
        lastAccessTime: 0,
      });
    }
    if (this.slots.length > safeCap) {
      this.slots = this.slots.slice(0, safeCap);
    }
  }

  public accessPage(pageNo: number, isWrite = false, isPinned = false): boolean {
    const existing = this.slots.find((s) => s.pageNo === pageNo);
    const now = Date.now();

    if (existing) {
      this.hits++;
      existing.accessCount++;
      existing.lastAccessTime = now;
      if (isPinned) existing.state = 'pinned';
      else if (isWrite) existing.state = 'dirty';

      this.addEvent('HIT', pageNo, `Cache Hit: Page ${pageNo} (${existing.state})`);
      return true;
    }

    // Cache Miss
    this.misses++;
    let targetSlot = this.slots.find((s) => s.pageNo === null);

    if (!targetSlot) {
      // Find LRU among unpinned slots
      let lruSlot: CacheSlot | null = null;
      let oldest = Infinity;
      for (const slot of this.slots) {
        if (slot.state !== 'pinned' && slot.lastAccessTime < oldest) {
          oldest = slot.lastAccessTime;
          lruSlot = slot;
        }
      }
      targetSlot = lruSlot || this.slots[0]!;

      if (targetSlot.pageNo !== null) {
        this.evictions++;
        const evictedPage = targetSlot.pageNo;
        const wasDirty = targetSlot.state === 'dirty';
        this.addEvent(
          'EVICT',
          evictedPage,
          wasDirty
            ? `Evicted Page ${evictedPage} (Flushed dirty write-back to storage)`
            : `Evicted clean Page ${evictedPage}`
        );
      }
    }

    targetSlot.pageNo = pageNo;
    targetSlot.state = isPinned ? 'pinned' : isWrite ? 'dirty' : 'clean';
    targetSlot.accessCount = 1;
    targetSlot.lastAccessTime = now;

    this.addEvent('MISS', pageNo, `Cache Miss: Loaded Page ${pageNo} from storage`);
    return false;
  }

  public flush() {
    let flushedCount = 0;
    for (const slot of this.slots) {
      if (slot.state === 'dirty' && slot.pageNo !== null) {
        slot.state = 'clean';
        flushedCount++;
      }
    }
    this.addEvent('FLUSH', 0, `Sync: Flushed ${flushedCount} dirty pages to storage`);
  }

  public reset() {
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
    this.events = [];
    for (const s of this.slots) {
      s.pageNo = null;
      s.state = 'clean';
      s.accessCount = 0;
      s.lastAccessTime = 0;
    }
  }

  private addEvent(type: CacheEvent['type'], pageNo: number, detail: string) {
    this.events.unshift({
      id: this.nextEventId++,
      timestamp: Date.now(),
      type,
      pageNo,
      detail,
    });
    if (this.events.length > 50) this.events.pop();
  }
}
