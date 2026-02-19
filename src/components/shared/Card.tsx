import React, { useState } from 'react';

interface CardProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'purple' | 'yellow' | 'cyan' | 'pink' | 'orange' | 'red';
  onClick?: () => void;
  style?: React.CSSProperties;
  borderLeftColor?: string;
}

const variantColors: Record<string, string> = {
  blue: '#3b82f6',
  green: '#10b981',
  purple: '#8b5cf6',
  yellow: '#f59e0b',
  cyan: '#06b6d4',
  pink: '#ec4899',
  orange: '#f97316',
  red: '#ef4444',
};

const Card: React.FC<CardProps> = ({
  title,
  icon,
  children,
  variant,
  onClick,
  style,
  borderLeftColor,
}) => {
  const [hovered, setHovered] = useState(false);

  const accentColor = variant ? variantColors[variant] : undefined;

  const containerStyle: React.CSSProperties = {
    backgroundColor: '#111827',
    border: '1px solid #2a3a52',
    borderRadius: '12px',
    padding: '0',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: hovered
      ? '0 8px 25px rgba(0, 0, 0, 0.3)'
      : '0 2px 8px rgba(0, 0, 0, 0.15)',
    borderLeft: borderLeftColor
      ? `3px solid ${borderLeftColor}`
      : undefined,
    overflow: 'hidden',
    ...style,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 20px',
    borderBottom: '1px solid #2a3a52',
  };

  const iconWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: accentColor
      ? `${accentColor}15`
      : 'rgba(59, 130, 246, 0.08)',
    color: accentColor || '#3b82f6',
    fontSize: '16px',
    flexShrink: 0,
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '15px',
    fontWeight: 600,
    color: '#e2e8f0',
    lineHeight: 1.4,
  };

  const bodyStyle: React.CSSProperties = {
    padding: '20px',
  };

  const hasHeader = title || icon;

  return (
    <div
      style={containerStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hasHeader && (
        <div style={headerStyle}>
          {icon && <div style={iconWrapperStyle}>{icon}</div>}
          {title && <h3 style={titleStyle}>{title}</h3>}
        </div>
      )}
      <div style={bodyStyle}>{children}</div>
    </div>
  );
};

export default Card;
