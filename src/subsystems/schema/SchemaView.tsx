import { useState, useEffect, useCallback } from 'react';
import { Badge } from '../../ui/Badge';
import { Stat } from '../../ui/Stat';
import { ObjectTree, SchemaObject } from './ObjectTree';
import { SchemaDetail, ColumnInfo } from './SchemaDetail';
import { DependencyGraph } from './DependencyGraph';
import { sqliteRpc } from '../../engine/rpc';
import { registerExecutionListener } from '../../store/consoleStore';

export function SchemaView() {
  const [objects, setObjects] = useState<SchemaObject[]>([]);
  const [selectedName, setSelectedName] = useState<string>('sqlite_schema');
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [schemaCookie, setSchemaCookie] = useState<number>(1);

  const refreshCatalog = useCallback(async () => {
    try {
      // 1. Fetch all schema objects including system sqlite_schema table
      const schemaRes = await sqliteRpc.exec(
        "SELECT type, name, tbl_name, rootpage, sql FROM sqlite_schema UNION ALL SELECT 'table', 'sqlite_schema', 'sqlite_schema', 1, 'CREATE TABLE sqlite_schema(type text, name text, tbl_name text, rootpage integer, sql text)' ORDER BY type, name;"
      );
      const rows = schemaRes.results[0]?.rows || [];
      const objs: SchemaObject[] = rows.map((r) => ({
        type: String(r[0]) as any,
        name: String(r[1]),
        tbl_name: String(r[2]),
        rootpage: Number(r[3]),
        sql: String(r[4] ?? ''),
      }));
      setObjects(objs);

      // 2. Fetch schema cookie
      const cookieRes = await sqliteRpc.pragma('schema_version');
      setSchemaCookie(Number(cookieRes?.[0]?.[0] ?? 1));

      // 3. Select first object if current not found
      const activeObj = objs.find((o) => o.name === selectedName) || objs[0];
      if (activeObj) {
        setSelectedName(activeObj.name);
      }
    } catch (err) {
      console.error('Failed to load schema catalog:', err);
    }
  }, [selectedName]);

  // Synchronize column inspection whenever active selected relation changes
  useEffect(() => {
    if (!selectedName) return;
    const obj = objects.find((o) => o.name === selectedName);
    if (!obj || obj.type !== 'table') {
      setColumns([]);
      return;
    }
    sqliteRpc
      .pragma(`table_xinfo('${obj.name}')`)
      .then((colRes) => {
        const colRows = colRes || [];
        setColumns(
          colRows.map((c: any) => ({
            cid: Number(c[0]),
            name: String(c[1]),
            type: String(c[2] ?? 'TEXT'),
            notnull: Number(c[3]) === 1,
            dflt_value: c[4] !== null ? String(c[4]) : null,
            pk: Number(c[5]) > 0,
          }))
        );
      })
      .catch(() => setColumns([]));
  }, [selectedName, objects]);

  useEffect(() => {
    refreshCatalog();
    return registerExecutionListener(() => {
      refreshCatalog();
    });
  }, [refreshCatalog]);

  const activeObj = objects.find((o) => o.name === selectedName) || objects[0] || null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Badge variant="real" title="REAL SQLITE: Catalog definitions and pragmas extracted directly from sqlite_schema">REAL SQLITE</Badge>
        <Badge variant="accent">SUBSYSTEM // SCHEMA CATALOG</Badge>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>
          SCHEMA CATALOG
        </h2>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        Internal sqlite_schema catalog tables, rootpage pointers, foreign keys, and schema cookies.
      </p>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Stat value={objects.filter((o) => o.type === 'table' && !o.name.startsWith('sqlite_')).length} label="TABLES" tooltip="Total user tables (excludes internal sqlite_schema catalog)" />
        <Stat value={objects.filter((o) => o.type === 'index').length} label="INDEXES" tooltip="Secondary B-tree indexes" />
        <Stat value={objects.filter((o) => o.type === 'view').length} label="VIEWS" tooltip="Stored query views" />
        <Stat value={schemaCookie} label="SCHEMA COOKIE" tooltip="Incremented on every DDL table/index modification" />
      </div>

      {/* Schema Object Tree & Detail Inspector side-by-side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
        <ObjectTree
          objects={objects}
          selectedName={selectedName}
          onSelectObject={(obj) => {
            setSelectedName(obj.name);
          }}
        />
        <SchemaDetail object={activeObj} columns={columns} />
      </div>

      {/* Relational dependencies graph & foreign keys */}
      <DependencyGraph objects={objects} schemaCookie={schemaCookie} />
    </div>
  );
}
