import React from 'react';
import Badge from './Badge';

interface HeroBadge {
  label: string;
  color?: 'green' | 'blue' | 'purple' | 'yellow' | 'red' | 'cyan' | 'pink';
  dot?: boolean;
}

interface HeroBannerProps {
  title: React.ReactNode;
  subtitle?: string;
  badges?: HeroBadge[];
}

const HeroBanner: React.FC<HeroBannerProps> = ({ title, subtitle, badges }) => {
  const sectionStyle: React.CSSProperties = {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    padding: 'clamp(3rem, 8vw, 80px) clamp(1rem, 4vw, 24px) clamp(2.5rem, 6vw, 64px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    background:
      'radial-gradient(ellipse at 50% 0%, rgba(59, 130, 246, 0.12) 0%, rgba(99, 102, 241, 0.06) 40%, transparent 70%), #0a0e17',
  };

  const glowStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-120px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '400px',
    background:
      'radial-gradient(ellipse, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.04) 50%, transparent 80%)',
    pointerEvents: 'none',
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
    fontWeight: 800,
    color: '#e2e8f0',
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
    maxWidth: '800px',
  };

  const subtitleStyle: React.CSSProperties = {
    marginTop: '20px',
    marginBottom: 0,
    fontSize: 'clamp(0.9rem, 2.5vw, 1.125rem)',
    lineHeight: 1.7,
    color: '#94a3b8',
    maxWidth: '640px',
  };

  const badgesRowStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '32px',
  };

  return (
    <section style={sectionStyle}>
      <div style={glowStyle} />
      {badges && badges.length > 0 && (
        <div style={badgesRowStyle}>
          {badges.map((badge, i) => (
            <Badge
              key={i}
              label={badge.label}
              color={badge.color}
              dot={badge.dot}
            />
          ))}
        </div>
      )}
      <h1 style={titleStyle}>{title}</h1>
      {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
    </section>
  );
};

export default HeroBanner;
