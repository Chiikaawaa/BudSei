export type LockLevel = 'UNLOCKED' | 'SHARED' | 'RESERVED' | 'PENDING' | 'EXCLUSIVE';

export const LOCK_LEVELS: LockLevel[] = [
  'UNLOCKED',
  'SHARED',
  'RESERVED',
  'PENDING',
  'EXCLUSIVE',
];

export interface LockTransitionResult {
  ok: boolean;
  newLevel: LockLevel;
  error?: string;
  code?: 'SQLITE_BUSY' | 'SQLITE_LOCKED';
}

/**
 * Fast O(1) Matrix Lookup Table for Concurrency Rule Transitions.
 * Keyed by other connection's current lock -> set of permitted target locks.
 */
const PERMITTED_TARGETS_WHEN_OTHER_HAS: Record<LockLevel, Set<LockLevel>> = {
  UNLOCKED: new Set(['UNLOCKED', 'SHARED', 'RESERVED', 'PENDING', 'EXCLUSIVE']),
  SHARED: new Set(['UNLOCKED', 'SHARED', 'RESERVED', 'PENDING']), // Cannot acquire EXCLUSIVE while reader exists
  RESERVED: new Set(['UNLOCKED', 'SHARED', 'PENDING']), // Another connection cannot acquire RESERVED or EXCLUSIVE
  PENDING: new Set(['UNLOCKED']), // No new readers or writers allowed
  EXCLUSIVE: new Set(['UNLOCKED']), // Total exclusivity
};

export class LockStateMachine {
  public connALock: LockLevel = 'UNLOCKED';
  public connBLock: LockLevel = 'UNLOCKED';

  public requestTransition(conn: 'A' | 'B', target: LockLevel): LockTransitionResult {
    const current = conn === 'A' ? this.connALock : this.connBLock;
    const other = conn === 'A' ? this.connBLock : this.connALock;

    // Release to UNLOCKED is unconditionally valid
    if (target === 'UNLOCKED') {
      if (conn === 'A') this.connALock = 'UNLOCKED';
      else this.connBLock = 'UNLOCKED';
      return { ok: true, newLevel: 'UNLOCKED' };
    }

    const permitted = PERMITTED_TARGETS_WHEN_OTHER_HAS[other];
    if (permitted && permitted.has(target)) {
      if (conn === 'A') this.connALock = target;
      else this.connBLock = target;
      return { ok: true, newLevel: target };
    }

    return {
      ok: false,
      newLevel: current,
      error: `database is locked: cannot escalate to ${target} while other connection holds ${other}`,
      code: 'SQLITE_BUSY',
    };
  }

  public reset() {
    this.connALock = 'UNLOCKED';
    this.connBLock = 'UNLOCKED';
  }
}
