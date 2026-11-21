import p1 from './01-create-table.json';
import p2 from './02-bulk-insert.json';
import p3 from './03-create-index.json';
import p4 from './04-explain-query-plan.json';
import p5 from './05-vdbe-explain.json';
import p6 from './06-join-query.json';
import p7 from './07-transaction-savepoint.json';
import p8 from './08-wal-toggle.json';

export interface SqlPreset {
  id: string;
  label: string;
  sql: string;
}

export const SQL_PRESETS: SqlPreset[] = [p1, p2, p3, p4, p5, p6, p7, p8];
