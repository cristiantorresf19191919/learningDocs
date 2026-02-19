import React from 'react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'danger' | 'success';
  title?: string;
  children: React.ReactNode;
}

const typeConfig: Record<
  string,
  { color: string; bg: string; icon: React.ReactNode }
> = {
  info: {
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.06)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  warning: {
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.06)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  danger: {
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.06)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
  success: {
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.06)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
};

const Callout: React.FC<CalloutProps> = ({
  type = 'info',
  title,
  children,
}) => {
  const config = typeConfig[type] || typeConfig.info;

  const containerStyle: React.CSSProperties = {
    backgroundColor: config.bg,
    borderLeft: `3px solid ${config.color}`,
    borderRadius: '0 10px 10px 0',
    padding: '16px 20px',
    border: `1px solid ${config.color}25`,
    borderLeftWidth: '3px',
    borderLeftColor: config.color,
    borderLeftStyle: 'solid',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: title ? '10px' : 0,
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '14px',
    fontWeight: 700,
    color: config.color,
  };

  const bodyStyle: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: 1.7,
    color: '#94a3b8',
    margin: 0,
  };

  return (
    <div style={containerStyle}>
      {(title || config.icon) && (
        <div style={headerStyle}>
          {config.icon}
          {title && <h4 style={titleStyle}>{title}</h4>}
        </div>
      )}
      <div style={bodyStyle}>{children}</div>
    </div>
  );
};

export default Callout;
