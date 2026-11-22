import type { RpcRequest, RpcResponse, RpcPayload, ExecResponse, InitResponse, PageStats } from './types';

export class SQLiteRpc {
  private worker: Worker | null = null;
  private nextId = 1;
  private pending = new Map<number, { resolve: (val: any) => void; reject: (err: any) => void }>();

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    if (typeof window === 'undefined') return;
    this.worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    this.worker.onmessage = (e: MessageEvent<RpcResponse>) => {
      const msg = e.data;
      const resolver = this.pending.get(msg.id);
      if (!resolver) return;
      this.pending.delete(msg.id);
      if (msg.ok) {
        resolver.resolve(msg.data);
      } else {
        const err = new Error(msg.error);
        (err as any).code = msg.code;
        resolver.reject(err);
      }
    };
  }

  private send<T>(payload: RpcPayload, transfer: Transferable[] = []): Promise<T> {
    if (!this.worker) {
      return Promise.reject(new Error('Worker not initialized'));
    }
    const id = this.nextId++;
    return new Promise<T>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      const req: RpcRequest = { ...payload, id };
      this.worker!.postMessage(req, transfer);
    });
  }

  public init(): Promise<InitResponse> {
    return this.send<InitResponse>({ type: 'INIT' });
  }

  public exec(sql: string): Promise<ExecResponse> {
    return this.send<ExecResponse>({ type: 'EXEC', sql });
  }

  public export(): Promise<Uint8Array> {
    return this.send<Uint8Array>({ type: 'EXPORT' });
  }

  public restore(buffer: Uint8Array): Promise<{ pageStats: PageStats }> {
    return this.send<{ pageStats: PageStats }>({ type: 'RESTORE', buffer });
  }

  public pragma(name: string, value?: string | number): Promise<any> {
    return this.send<any>({ type: 'PRAGMA', name, value });
  }

  public reset(): Promise<boolean> {
    return this.send<boolean>({ type: 'RESET' });
  }

  public destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

export const sqliteRpc = new SQLiteRpc();
