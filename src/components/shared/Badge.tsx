import React from 'react';

interface BadgeProps {
  label: string;
  color?: 'green' | 'blue' | 'purple' | 'yellow' | 'red' | 'cyan' | 'pink';
  dot?: boolean;
}

const colorMap: Record<string, { bg: string; text: string; dot: string }> = {
  green: {
    bg: 'rgba(16, 185, 129, 0.12)',
    text: '#10b981',
    dot: '#10b981',
  },
  blue: {
    bg: 'rgba(59, 130, 246, 0.12)',
    text: '#3b82f6',
    dot: '#3b82f6',
  },
  purple: {
    bg: 'rgba(139, 92, 246, 0.12)',
    text: '#8b5cf6',
    dot: '#8b5cf6',
  },
  yellow: {
    bg: 'rgba(245, 158, 11, 0.12)',
    text: '#f59e0b',
    dot: '#f59e0b',
  },
  red: {
    bg: 'rgba(239, 68, 68, 0.12)',
    text: '#ef4444',
    dot: '#ef4444',
  },
  cyan: {
    bg: 'rgba(6, 182, 212, 0.12)',
    text: '#06b6d4',
    dot: '#06b6d4',
  },
  pink: {
    bg: 'rgba(236, 72, 153, 0.12)',
    text: '#ec4899',
    dot: '#ec4899',
  },
};

const Badge: React.FC<BadgeProps> = ({ label, color = 'blue', dot = false }) => {
  const scheme = colorMap[color] || colorMap.blue;

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '9999px',
    backgroundColor: scheme.bg,
    color: scheme.text,
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0.025em',
    whiteSpace: 'nowrap',
    border: `1px solid ${scheme.text}25`,
  };

  const dotStyle: React.CSSProperties = {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: scheme.dot,
    flexShrink: 0,
  };

  return (
    <span style={badgeStyle}>
      {dot && <span style={dotStyle} />}
      {label}
    </span>
  );
};

export default Badge;
