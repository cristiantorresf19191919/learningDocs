import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

export interface DecisionNodeData {
  label: string;
  color?: string;
  dimmed?: boolean;
  [key: string]: unknown;
}

type DecisionNodeProps = NodeProps & { data: DecisionNodeData };

const DecisionNode: React.FC<DecisionNodeProps> = ({ data }) => {
  const { label, color = '#f59e0b', dimmed = false } = data;

  const outerStyle: React.CSSProperties = {
    width: '100px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: dimmed ? 0.15 : 1,
    transition: 'opacity 0.3s ease',
  };

  const diamondStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    transform: 'rotate(45deg)',
    background: '#1a2332',
    border: `2px solid ${color}`,
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: dimmed ? 'none' : `0 0 16px ${color}33, 0 2px 8px rgba(0,0,0,0.4)`,
  };

  const textStyle: React.CSSProperties = {
    transform: 'rotate(-45deg)',
    color: '#e2e8f0',
    fontSize: '11px',
    fontWeight: 700,
    textAlign: 'center' as const,
    lineHeight: 1.3,
    padding: '4px',
    maxWidth: '80px',
    wordBreak: 'break-word' as const,
  };

  const handleBase: React.CSSProperties = {
    background: color,
    border: '2px solid #0a0e17',
    width: '8px',
    height: '8px',
  };

  return (
    <div style={outerStyle}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ ...handleBase, top: '-4px' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        style={{ ...handleBase, left: '-4px' }}
      />
      <div style={diamondStyle}>
        <div style={textStyle}>{label}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ ...handleBase, bottom: '-4px' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={{ ...handleBase, right: '-4px' }}
      />
    </div>
  );
};

export default React.memo(DecisionNode);
