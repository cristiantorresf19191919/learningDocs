import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CustomNode from './CustomNode';
import DecisionNode from './DecisionNode';
import DatabaseNode from './DatabaseNode';
import CustomEdge from './CustomEdge';

// ---- Node & edge type maps registered OUTSIDE component to prevent re-renders ----
const nodeTypes = {
  custom: CustomNode,
  decision: DecisionNode,
  database: DatabaseNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

// ---- Types ----
export interface FlowFilterButton {
  label: string;
  flow: string;
  color: string;
}

export interface ReactFlowDiagramProps {
  nodes: Node[];
  edges: Edge[];
  title: string;
  height?: string;
  flowFilterButtons?: FlowFilterButton[];
  onFlowFilter?: (flow: string) => void;
  activeFlow?: string;
}

// ---- Styles ----
const COLORS = {
  bg: '#0a0e17',
  surface: '#111827',
  surface2: '#1a2332',
  border: '#2a3a52',
  text: '#e2e8f0',
  text2: '#94a3b8',
  accent: '#3b82f6',
};

const wrapperStyle: React.CSSProperties = {
  background: COLORS.bg,
  borderRadius: '12px',
  border: `1px solid ${COLORS.border}`,
  overflow: 'hidden',
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const toolbarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 16px',
  background: COLORS.surface,
  borderBottom: `1px solid ${COLORS.border}`,
  flexWrap: 'wrap',
  gap: '8px',
};

const titleStyle: React.CSSProperties = {
  color: COLORS.text,
  fontSize: '14px',
  fontWeight: 700,
  letterSpacing: '0.3px',
};

const filterGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '6px',
  flexWrap: 'wrap',
};

const legendBarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  padding: '8px 16px',
  background: COLORS.surface,
  borderTop: `1px solid ${COLORS.border}`,
  flexWrap: 'wrap',
};

const legendItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '11px',
  color: COLORS.text2,
};

// ---- Helpers ----
function buildFilterBtnStyle(
  color: string,
  isActive: boolean
): React.CSSProperties {
  return {
    padding: '4px 12px',
    fontSize: '11px',
    fontWeight: 600,
    borderRadius: '6px',
    border: `1px solid ${isActive ? color : COLORS.border}`,
    background: isActive ? `${color}22` : 'transparent',
    color: isActive ? color : COLORS.text2,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };
}

/** Gather unique legend entries from nodes. */
function collectLegend(nodes: Node[]): { category: string; color: string }[] {
  const seen = new Map<string, string>();
  for (const n of nodes) {
    const d = n.data as Record<string, unknown> | undefined;
    if (d?.category && d?.color && !seen.has(d.category as string)) {
      seen.set(d.category as string, d.color as string);
    }
  }
  return Array.from(seen.entries()).map(([category, color]) => ({
    category,
    color,
  }));
}

// ---- Component ----
const ReactFlowDiagram: React.FC<ReactFlowDiagramProps> = ({
  nodes: initialNodes,
  edges: initialEdges,
  title,
  height = '520px',
  flowFilterButtons,
  onFlowFilter,
  activeFlow,
}) => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onInit = useCallback((instance: { fitView: () => void }) => {
    // Small delay to let layout settle then fit view
    setTimeout(() => instance.fitView(), 50);
  }, []);

  const legend = useMemo(() => collectLegend(initialNodes), [initialNodes]);

  return (
    <div style={wrapperStyle}>
      {/* Toolbar */}
      <div style={toolbarStyle}>
        <span style={titleStyle}>{title}</span>
        {flowFilterButtons && flowFilterButtons.length > 0 && (
          <div style={filterGroupStyle}>
            <button
              style={buildFilterBtnStyle(COLORS.accent, !activeFlow)}
              onClick={() => onFlowFilter?.('')}
            >
              All
            </button>
            {flowFilterButtons.map((btn) => (
              <button
                key={btn.flow}
                style={buildFilterBtnStyle(btn.color, activeFlow === btn.flow)}
                onClick={() => onFlowFilter?.(btn.flow)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* React Flow canvas */}
      <div style={{ height, background: COLORS.bg }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onInit={onInit}
          fitView
          proOptions={{ hideAttribution: true }}
          minZoom={0.2}
          maxZoom={2}
          defaultEdgeOptions={{
            type: 'custom',
            animated: true,
          }}
          style={{ background: COLORS.bg }}
        >
          <Controls
            showInteractive={false}
            style={{
              background: COLORS.surface2,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          />
          <MiniMap
            nodeColor={(node) => {
              const d = node.data as Record<string, unknown> | undefined;
              return (d?.color as string) || COLORS.accent;
            }}
            maskColor="rgba(10, 14, 23, 0.85)"
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          />
          <Background color={COLORS.border} gap={20} size={1} />
        </ReactFlow>
      </div>

      {/* Legend bar */}
      {legend.length > 0 && (
        <div style={legendBarStyle}>
          {legend.map((item) => (
            <div key={item.category} style={legendItemStyle}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '3px',
                  background: item.color,
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <span>{item.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(ReactFlowDiagram);
