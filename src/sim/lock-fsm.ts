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

export class LockStateMachine {
  public connALock: LockLevel = 'UNLOCKED';
  public connBLock: LockLevel = 'UNLOCKED';

  public requestTransition(conn: 'A' | 'B', target: LockLevel): LockTransitionResult {
    const current = conn === 'A' ? this.connALock : this.connBLock;
    const other = conn === 'A' ? this.connBLock : this.connALock;

    // Release back to UNLOCKED is always allowed
    if (target === 'UNLOCKED') {
      if (conn === 'A') this.connALock = 'UNLOCKED';
      else this.connBLock = 'UNLOCKED';
      return { ok: true, newLevel: 'UNLOCKED' };
    }

    // Attempt to acquire SHARED (Read)
    if (target === 'SHARED') {
      if (other === 'EXCLUSIVE' || other === 'PENDING') {
        return {
          ok: false,
          newLevel: current,
          error: 'database is locked (other connection holds EXCLUSIVE/PENDING lock)',
          code: 'SQLITE_BUSY',
        };
      }
      if (conn === 'A') this.connALock = 'SHARED';
      else this.connBLock = 'SHARED';
      return { ok: true, newLevel: 'SHARED' };
    }

    // Attempt to acquire RESERVED (Intent to write)
    if (target === 'RESERVED') {
      if (other === 'RESERVED' || other === 'PENDING' || other === 'EXCLUSIVE') {
        return {
          ok: false,
          newLevel: current,
          error: 'database is locked: another writer holds RESERVED/EXCLUSIVE lock',
          code: 'SQLITE_BUSY',
        };
      }
      if (conn === 'A') this.connALock = 'RESERVED';
      else this.connBLock = 'RESERVED';
      return { ok: true, newLevel: 'RESERVED' };
    }

    // Attempt to escalate to PENDING
    if (target === 'PENDING') {
      if (other === 'EXCLUSIVE') {
        return { ok: false, newLevel: current, error: 'database is locked', code: 'SQLITE_BUSY' };
      }
      if (conn === 'A') this.connALock = 'PENDING';
      else this.connBLock = 'PENDING';
      return { ok: true, newLevel: 'PENDING' };
    }

    // Attempt to escalate to EXCLUSIVE (Full write lock)
    if (target === 'EXCLUSIVE') {
      if (other !== 'UNLOCKED') {
        return {
          ok: false,
          newLevel: current,
          error: 'database is locked: waiting for active readers to clear',
          code: 'SQLITE_BUSY',
        };
      }
      if (conn === 'A') this.connALock = 'EXCLUSIVE';
      else this.connBLock = 'EXCLUSIVE';
      return { ok: true, newLevel: 'EXCLUSIVE' };
    }

    return { ok: true, newLevel: target };
  }

  public reset() {
    this.connALock = 'UNLOCKED';
    this.connBLock = 'UNLOCKED';
  }
}
