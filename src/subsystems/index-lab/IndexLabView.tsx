import { useState, useEffect, useMemo, useCallback } from 'react';
import { Badge } from '../../ui/Badge';
import { Stat } from '../../ui/Stat';
import { Select } from '../../ui/Select';
import { TreeCanvas } from './TreeCanvas';
import { NodeInspector } from './NodeInspector';
import { SplitTimeline } from './SplitTimeline';
import { sqliteRpc } from '../../engine/rpc';
import { useSessionStore } from '../../store/sessionStore';
import { registerExecutionListener } from '../../store/consoleStore';
import { buildBtreeModel, findRoutingPath, BtreeNode } from '../../sim/btree-model';

interface SchemaItem {
  type: string;
  name: string;
  rootpage: number;
}

export function IndexLabView() {
  const [schemaItems, setSchemaItems] = useState<SchemaItem[]>([]);
  const [selectedRoot, setSelectedRoot] = useState<number>(1);
  const [rawImage, setRawImage] = useState<Uint8Array | null>(null);
  const [searchKey, setSearchKey] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<BtreeNode | null>(null);

  const loadData = useCallback(async () => {
    try {
      const img = await sqliteRpc.export();
      setRawImage(img);

      const res = await sqliteRpc.exec(
        "SELECT type, name, rootpage FROM sqlite_schema WHERE rootpage > 0 UNION SELECT 'table', 'sqlite_schema', 1;"
      );
      const rows = res.results[0]?.rows || [];
      const items: SchemaItem[] = rows.map((r) => ({
        type: String(r[0]),
        name: String(r[1]),
        rootpage: Number(r[2]),
      }));
      setSchemaItems(items);
      if (items.length > 0 && !items.some((it) => it.rootpage === selectedRoot)) {
        setSelectedRoot(items[0]!.rootpage);
      }
    } catch (err) {
      console.error('Failed to load Index Lab data:', err);
    }
  }, [selectedRoot]);

  useEffect(() => {
    loadData();
    return registerExecutionListener(() => {
      loadData();
    });
  }, [loadData]);

  const activeItem = schemaItems.find((s) => s.rootpage === selectedRoot) || {
    type: 'table',
    name: 'sqlite_schema',
    rootpage: 1,
  };

  const pageSize = useSessionStore((s) => s.pageSize) || 8192;

  const model = useMemo(() => {
    if (!rawImage || rawImage.length < pageSize) return null;
    return buildBtreeModel(
      rawImage,
      selectedRoot,
      pageSize,
      activeItem.name,
      activeItem.type === 'index'
    );
  }, [rawImage, selectedRoot, activeItem, pageSize]);

  const highlightedPath = useMemo(() => {
    const raw = searchKey.trim();
    if (!raw || !model?.rootNode) return [];
    const clean = raw.replace(/^['"]|['"]$/g, '');
    const num = Number(clean);
    return findRoutingPath(model.rootNode, isNaN(num) ? clean : num);
  }, [model, searchKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Badge variant="modeled" title="MODELED: B-tree hierarchy derived by BUDSEI's parsers from real SQLite disk pages">MODELED</Badge>
          <Badge variant="accent">SUBSYSTEM // INDEX LABORATORY</Badge>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>
            INDEX LABORATORY
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
            Tree Root:
          </span>
          <Select
            options={
              schemaItems.length > 0
                ? schemaItems.map((s) => ({
                    value: String(s.rootpage),
                    label: `${s.type === 'index' ? 'IDX' : 'TBL'}: ${s.name} (P${s.rootpage})`,
                  }))
                : [{ value: '1', label: 'TBL: sqlite_schema (P1)' }]
            }
            value={String(selectedRoot)}
            onChange={(e) => {
              setSelectedRoot(Number(e.target.value));
              setSelectedNode(null);
            }}
          />
        </div>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        B-Tree / B+ Tree interior routing paths, page splits, balanced leaf chains, and search depth.
      </p>

      {/* Model Stats */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Stat value={model?.depth ?? 1} label="TREE DEPTH" tooltip="Number of levels from root to leaf" />
        <Stat value={model?.totalPages ?? 1} label="TOTAL NODES" tooltip="Allocated B-tree pages for this relation" />
        <Stat
          value={model && model.rootNode && (model.rootNode.cellCount > 0 || model.rootNode.keys.length > 0) ? `${model.avgFillFactor}%` : '–'}
          label="AVG FILL FACTOR"
          tooltip="Average page capacity utilized (– when empty)"
        />
        <Stat value={`P${selectedRoot}`} label="ROOTPAGE" tooltip="Physical root page in database file" />
      </div>

      {/* Interactive Lookup Box */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card)', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '2px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
          Trace Interior Seek Path:
        </span>
        <input
          type="text"
          placeholder="RowID or key (e.g. 5, 'alice')"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          style={{ padding: '4px 8px', width: '320px', fontFamily: 'var(--font-mono)', fontSize: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '2px' }}
        />
        {highlightedPath.length > 0 && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#10b981' }}>
            Routing path: {highlightedPath.map((p) => `P${p}`).join(' ➔ ')}
          </span>
        )}
      </div>

      {/* Tree Canvas */}
      <TreeCanvas
        root={model?.rootNode ?? null}
        highlightedPath={highlightedPath}
        selectedPageNo={selectedNode?.pageNo ?? null}
        onSelectNode={setSelectedNode}
      />

      {/* Node Inspector & Split Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <NodeInspector node={selectedNode} />
        <SplitTimeline />
      </div>
    </div>
  );
}
