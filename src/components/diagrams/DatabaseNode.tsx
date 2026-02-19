import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

export interface DatabaseNodeData {
  label: string;
  description?: string;
  color?: string;
  dimmed?: boolean;
  [key: string]: unknown;
}

type DatabaseNodeProps = NodeProps & { data: DatabaseNodeData };

const CYLINDER_WIDTH = 180;
const CYLINDER_BODY_HEIGHT = 60;
const ELLIPSE_RY = 14;
const TOTAL_HEIGHT = CYLINDER_BODY_HEIGHT + ELLIPSE_RY * 2;

const DatabaseNode: React.FC<DatabaseNodeProps> = ({ data }) => {
  const {
    label,
    description,
    color = '#10b981',
    dimmed = false,
  } = data;

  const containerStyle: React.CSSProperties = {
    width: `${CYLINDER_WIDTH}px`,
    height: `${TOTAL_HEIGHT}px`,
    position: 'relative',
    opacity: dimmed ? 0.15 : 1,
    transition: 'opacity 0.3s ease',
    filter: dimmed ? 'none' : `drop-shadow(0 0 10px ${color}22)`,
  };

  const textContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${ELLIPSE_RY + 6}px`,
    left: 0,
    right: 0,
    bottom: `${ELLIPSE_RY + 4}px`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 12px',
    zIndex: 1,
  };

  const labelStyle: React.CSSProperties = {
    color: '#e2e8f0',
    fontWeight: 700,
    fontSize: '13px',
    textAlign: 'center' as const,
    lineHeight: 1.3,
  };

  const descStyle: React.CSSProperties = {
    color: '#94a3b8',
    fontSize: '10px',
    textAlign: 'center' as const,
    marginTop: '2px',
    lineHeight: 1.3,
  };

  const handleStyle: React.CSSProperties = {
    background: color,
    border: '2px solid #0a0e17',
    width: '8px',
    height: '8px',
  };

  const rx = CYLINDER_WIDTH / 2;
  const ry = ELLIPSE_RY;

  return (
    <div style={containerStyle}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ ...handleStyle, top: '-4px' }}
      />
      <svg
        width={CYLINDER_WIDTH}
        height={TOTAL_HEIGHT}
        viewBox={`0 0 ${CYLINDER_WIDTH} ${TOTAL_HEIGHT}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* Body rectangle */}
        <rect
          x="0"
          y={ry}
          width={CYLINDER_WIDTH}
          height={CYLINDER_BODY_HEIGHT}
          fill="#1a2332"
          stroke={color}
          strokeWidth="1.5"
        />
        {/* Bottom ellipse */}
        <ellipse
          cx={rx}
          cy={ry + CYLINDER_BODY_HEIGHT}
          rx={rx}
          ry={ry}
          fill="#1a2332"
          stroke={color}
          strokeWidth="1.5"
        />
        {/* Top ellipse (fills over the body top edge) */}
        <ellipse
          cx={rx}
          cy={ry}
          rx={rx}
          ry={ry}
          fill="#111827"
          stroke={color}
          strokeWidth="1.5"
        />
        {/* Side lines to cover rect stroke over ellipses */}
        <line
          x1="0"
          y1={ry}
          x2="0"
          y2={ry + CYLINDER_BODY_HEIGHT}
          stroke={color}
          strokeWidth="1.5"
        />
        <line
          x1={CYLINDER_WIDTH}
          y1={ry}
          x2={CYLINDER_WIDTH}
          y2={ry + CYLINDER_BODY_HEIGHT}
          stroke={color}
          strokeWidth="1.5"
        />
      </svg>
      <div style={textContainerStyle}>
        <div style={labelStyle}>{label}</div>
        {description && <div style={descStyle}>{description}</div>}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ ...handleStyle, bottom: '-4px' }}
      />
    </div>
  );
};

export default React.memo(DatabaseNode);
