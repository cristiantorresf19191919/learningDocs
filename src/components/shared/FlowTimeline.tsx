import React from 'react';
import CodeBlock from './CodeBlock';

interface TimelineStep {
  number: number;
  title: string;
  description: string;
  color: string;
  code?: {
    filename: string;
    language: string;
    content: string;
  };
}

interface FlowTimelineProps {
  steps: TimelineStep[];
}

const FlowTimeline: React.FC<FlowTimelineProps> = ({ steps }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    position: 'relative',
  };

  return (
    <div style={containerStyle}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        const rowStyle: React.CSSProperties = {
          display: 'flex',
          gap: 'clamp(12px, 3vw, 24px)',
          position: 'relative',
          minHeight: '80px',
          paddingBottom: isLast ? 0 : 'clamp(16px, 3vw, 32px)',
        };

        const markerColumnStyle: React.CSSProperties = {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
          width: 'clamp(32px, 6vw, 48px)',
          position: 'relative',
        };

        const markerStyle: React.CSSProperties = {
          width: 'clamp(28px, 5vw, 40px)',
          height: 'clamp(28px, 5vw, 40px)',
          borderRadius: '50%',
          backgroundColor: `${step.color}18`,
          border: `2px solid ${step.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(11px, 2vw, 14px)',
          fontWeight: 700,
          color: step.color,
          flexShrink: 0,
          position: 'relative',
          zIndex: 2,
        };

        const connectorStyle: React.CSSProperties = {
          width: '2px',
          flexGrow: 1,
          background: isLast
            ? 'transparent'
            : `linear-gradient(to bottom, ${step.color}60, ${steps[index + 1]?.color || step.color}60)`,
          marginTop: '4px',
        };

        const cardStyle: React.CSSProperties = {
          flex: 1,
          minWidth: 0,
          backgroundColor: '#111827',
          border: '1px solid #2a3a52',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          padding: 'clamp(12px, 2.5vw, 20px) clamp(12px, 3vw, 24px)',
          borderLeft: `3px solid ${step.color}`,
        };

        const titleStyle: React.CSSProperties = {
          margin: 0,
          fontSize: '16px',
          fontWeight: 700,
          color: '#e2e8f0',
          marginBottom: '8px',
        };

        const descriptionStyle: React.CSSProperties = {
          margin: 0,
          fontSize: '14px',
          lineHeight: 1.7,
          color: '#94a3b8',
          marginBottom: step.code ? '16px' : 0,
        };

        return (
          <div key={index} style={rowStyle}>
            <div style={markerColumnStyle}>
              <div style={markerStyle}>{step.number}</div>
              <div style={connectorStyle} />
            </div>
            <div style={cardStyle}>
              <h4 style={titleStyle}>{step.title}</h4>
              <p style={descriptionStyle}>{step.description}</p>
              {step.code && (
                <CodeBlock
                  code={step.code.content}
                  language={step.code.language}
                  filename={step.code.filename}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FlowTimeline;
