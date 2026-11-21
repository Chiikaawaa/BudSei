import { LockStateMachine, LockLevel } from '../sim/lock-fsm';

export interface ConnActionLog {
  id: number;
  timestamp: number;
  conn: 'A' | 'B';
  action: string;
  result: 'OK' | 'SQLITE_BUSY';
  detail: string;
}

export class DualConnectionSimulator {
  public fsm = new LockStateMachine();
  public logs: ConnActionLog[] = [];
  private nextId = 1;

  public executeAction(conn: 'A' | 'B', action: 'BEGIN_DEFERRED' | 'BEGIN_IMMEDIATE' | 'SELECT' | 'UPDATE' | 'COMMIT' | 'ROLLBACK') {
    let targetLock: LockLevel = 'UNLOCKED';

    switch (action) {
      case 'BEGIN_DEFERRED':
        targetLock = 'UNLOCKED'; // Deferred waits until first statement
        break;
      case 'BEGIN_IMMEDIATE':
        targetLock = 'RESERVED';
        break;
      case 'SELECT':
        targetLock = 'SHARED';
        break;
      case 'UPDATE':
        targetLock = 'EXCLUSIVE';
        break;
      case 'COMMIT':
      case 'ROLLBACK':
        targetLock = 'UNLOCKED';
        break;
    }

    const res = this.fsm.requestTransition(conn, targetLock);
    const logItem: ConnActionLog = {
      id: this.nextId++,
      timestamp: Date.now(),
      conn,
      action: action.replace('_', ' '),
      result: res.ok ? 'OK' : 'SQLITE_BUSY',
      detail: res.ok
        ? `Transitioned lock to ${res.newLevel}`
        : `${res.code}: ${res.error}`,
    };

    this.logs.unshift(logItem);
    if (this.logs.length > 50) this.logs.pop();
    return res;
  }

  public reset() {
    this.fsm.reset();
    this.logs = [];
  }
}

export const dualConnSim = new DualConnectionSimulator();
