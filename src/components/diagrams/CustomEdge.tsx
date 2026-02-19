import React from 'react';
import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react';

export interface CustomEdgeData {
  label?: string;
  color?: string;
  animated?: boolean;
  dimmed?: boolean;
  [key: string]: unknown;
}

type CustomEdgeProps = EdgeProps & { data?: CustomEdgeData };

const CustomEdge: React.FC<CustomEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}) => {
  const {
    label,
    color = '#3b82f6',
    animated = true,
    dimmed = false,
  } = data ?? {};

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const edgeStyle: React.CSSProperties = {
    stroke: color,
    strokeWidth: 1.5,
    strokeDasharray: '6 4',
    opacity: dimmed ? 0.1 : 0.8,
    transition: 'opacity 0.3s ease',
  };

  const labelContainerStyle: React.CSSProperties = {
    position: 'absolute',
    transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
    pointerEvents: 'all' as const,
  };

  const labelStyle: React.CSSProperties = {
    background: '#1a2332',
    color: '#94a3b8',
    fontSize: '10px',
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: '4px',
    border: `1px solid ${color}44`,
    whiteSpace: 'nowrap' as const,
    opacity: dimmed ? 0.1 : 1,
    transition: 'opacity 0.3s ease',
  };

  // Unique keyframe name per edge for animation
  const animName = `dash-${id}`;

  return (
    <>
      {animated && !dimmed && (
        <style>
          {`@keyframes ${animName} { to { stroke-dashoffset: -20; } }`}
        </style>
      )}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...edgeStyle,
          animation:
            animated && !dimmed ? `${animName} 0.8s linear infinite` : 'none',
        }}
      />
      {label && !dimmed && (
        <div style={labelContainerStyle}>
          <div style={labelStyle}>{label}</div>
        </div>
      )}
    </>
  );
};

export default React.memo(CustomEdge);
