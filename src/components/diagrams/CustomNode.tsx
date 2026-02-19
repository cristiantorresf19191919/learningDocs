import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

export interface CustomNodeData {
  label: string;
  category?: string;
  color?: string;
  description?: string;
  dimmed?: boolean;
  [key: string]: unknown;
}

type CustomNodeProps = NodeProps & { data: CustomNodeData };

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  const {
    label,
    category,
    color = '#3b82f6',
    description,
    dimmed = false,
  } = data;

  const containerStyle: React.CSSProperties = {
    background: '#111827',
    border: '1px solid #2a3a52',
    borderRadius: '8px',
    minWidth: '180px',
    maxWidth: '260px',
    overflow: 'hidden',
    opacity: dimmed ? 0.15 : 1,
    transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
    boxShadow: dimmed
      ? 'none'
      : `0 0 12px ${color}22, 0 2px 8px rgba(0,0,0,0.4)`,
    fontSize: '12px',
  };

  const categoryBarStyle: React.CSSProperties = {
    background: color,
    padding: '4px 10px',
    fontSize: '10px',
    fontWeight: 600,
    color: '#0a0e17',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.6px',
  };

  const bodyStyle: React.CSSProperties = {
    padding: '10px 12px',
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 700,
    color: '#e2e8f0',
    fontSize: '13px',
    marginBottom: description ? '4px' : 0,
    lineHeight: 1.3,
  };

  const descriptionStyle: React.CSSProperties = {
    color: '#94a3b8',
    fontSize: '11px',
    lineHeight: 1.4,
  };

  const handleStyle: React.CSSProperties = {
    background: color,
    border: '2px solid #0a0e17',
    width: '8px',
    height: '8px',
  };

  return (
    <div style={containerStyle}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ ...handleStyle, top: '-4px' }}
      />
      {category && <div style={categoryBarStyle}>{category}</div>}
      <div style={bodyStyle}>
        <div style={labelStyle}>{label}</div>
        {description && <div style={descriptionStyle}>{description}</div>}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ ...handleStyle, bottom: '-4px' }}
      />
    </div>
  );
};

export default React.memo(CustomNode);
