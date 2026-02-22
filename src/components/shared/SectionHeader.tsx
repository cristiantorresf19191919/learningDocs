import React from 'react';

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  id?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  description,
  id,
}) => {
  const containerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: 'clamp(1.5rem, 4vw, 3rem)',
    maxWidth: '720px',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const labelRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '16px',
  };

  const labelLineStyle: React.CSSProperties = {
    width: '24px',
    height: '2px',
    backgroundColor: '#3b82f6',
    borderRadius: '1px',
  };

  const labelTextStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#3b82f6',
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 'clamp(1.35rem, 4vw, 2rem)',
    fontWeight: 800,
    color: '#e2e8f0',
    lineHeight: 1.2,
    letterSpacing: '-0.025em',
  };

  const descriptionStyle: React.CSSProperties = {
    marginTop: '16px',
    marginBottom: 0,
    fontSize: '16px',
    lineHeight: 1.7,
    color: '#94a3b8',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  return (
    <div style={containerStyle} id={id}>
      {label && (
        <div style={labelRowStyle}>
          <span style={labelLineStyle} />
          <span style={labelTextStyle}>{label}</span>
        </div>
      )}
      <h2 style={titleStyle}>{title}</h2>
      {description && <p style={descriptionStyle}>{description}</p>}
    </div>
  );
};

export default SectionHeader;
