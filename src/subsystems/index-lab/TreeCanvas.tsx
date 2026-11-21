import React from 'react';
import styles from './TreeCanvas.module.css';
import { BtreeNode } from '../../sim/btree-model';

interface TreeCanvasProps {
  root: BtreeNode | null;
  highlightedPath: number[];
  selectedPageNo: number | null;
  onSelectNode: (node: BtreeNode) => void;
}

export const TreeCanvas = React.memo(function TreeCanvas({
  root,
  highlightedPath,
  selectedPageNo,
  onSelectNode,
}: TreeCanvasProps) {
  if (!root) {
    return <div className={styles.emptyPrompt}>No B-Tree data available. Create a table or index.</div>;
  }

  const pathSet = new Set(highlightedPath);

  function renderNode(node: BtreeNode, depth: number): React.ReactNode {
    const isHighlighted = pathSet.has(node.pageNo);
    const isSelected = selectedPageNo === node.pageNo;

    return (
      <div key={node.pageNo} className={styles.treeBranch}>
        <div
          className={`${styles.treeNode} ${isHighlighted ? styles.highlighted : ''} ${
            isSelected ? styles.selected : ''
          }`}
          onClick={() => onSelectNode(node)}
          title={`Page ${node.pageNo} (${node.type}) - ${node.cellCount} cells, ${node.fillPercentage}% filled`}
        >
          <div className={styles.nodeHeader}>
            <span className={styles.nodePage}>P{node.pageNo}</span>
            <span className={styles.nodeBadge}>{node.isLeaf ? 'LEAF' : 'INTERIOR'}</span>
          </div>
          <div className={styles.nodeKeys}>
            {node.keys.length > 0 ? (
              <span>
                Keys: {node.keys.slice(0, 3).join(', ')}
                {node.keys.length > 3 ? '…' : ''}
              </span>
            ) : (
              <span>(0 keys)</span>
            )}
          </div>
          <div className={styles.nodeFillBar}>
            <div className={styles.nodeFill} style={{ width: `${node.fillPercentage}%` }} />
          </div>
        </div>

        {node.children.length > 0 && (
          <div className={styles.childrenContainer}>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  }

  return <div className={styles.canvasContainer}>{renderNode(root, 0)}</div>;
});
