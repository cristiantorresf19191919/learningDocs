import React, { useState, useEffect, useRef, useCallback } from 'react';
import mermaid from 'mermaid';

// ---- Types ----
export interface MermaidTab {
  label: string;
  source: string;
}

export interface MermaidViewerProps {
  tabs: MermaidTab[];
  title: string;
}

// ---- Colors ----
const C = {
  bg: '#0a0e17',
  surface: '#111827',
  surface2: '#1a2332',
  border: '#2a3a52',
  text: '#e2e8f0',
  text2: '#94a3b8',
  accent: '#3b82f6',
};

// ---- Mermaid init (once) ----
let mermaidInitialized = false;
function ensureMermaidInit() {
  if (mermaidInitialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
      darkMode: true,
      background: C.bg,
      primaryColor: C.surface2,
      primaryBorderColor: C.border,
      primaryTextColor: C.text,
      secondaryColor: '#1e293b',
      tertiaryColor: '#1a2332',
      lineColor: C.accent,
      textColor: C.text,
      mainBkg: C.surface2,
      nodeBorder: C.border,
      clusterBkg: '#0f172a',
      clusterBorder: C.border,
      edgeLabelBackground: C.surface2,
      fontSize: '14px',
    },
    securityLevel: 'loose',
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  });
  mermaidInitialized = true;
}

// ---- Styles ----
const wrapperStyle: React.CSSProperties = {
  background: C.bg,
  borderRadius: '12px',
  border: `1px solid ${C.border}`,
  overflow: 'hidden',
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 16px',
  background: C.surface,
  borderBottom: `1px solid ${C.border}`,
  flexWrap: 'wrap',
  gap: '8px',
};

const titleStyle: React.CSSProperties = {
  color: C.text,
  fontSize: '14px',
  fontWeight: 700,
  letterSpacing: '0.3px',
};

const tabBarStyle: React.CSSProperties = {
  display: 'flex',
  gap: '4px',
  padding: '8px 16px 0',
  background: C.surface,
  borderBottom: `1px solid ${C.border}`,
  overflowX: 'auto',
};

const controlBarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const iconBtnStyle: React.CSSProperties = {
  width: '30px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '6px',
  border: `1px solid ${C.border}`,
  background: 'transparent',
  color: C.text2,
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'all 0.15s ease',
};

const textBtnStyle: React.CSSProperties = {
  padding: '4px 12px',
  fontSize: '11px',
  fontWeight: 600,
  borderRadius: '6px',
  border: `1px solid ${C.border}`,
  background: 'transparent',
  color: C.text2,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  whiteSpace: 'nowrap',
};

function tabStyle(isActive: boolean): React.CSSProperties {
  return {
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: 600,
    color: isActive ? C.accent : C.text2,
    background: isActive ? C.surface2 : 'transparent',
    border: 'none',
    borderBottom: isActive ? `2px solid ${C.accent}` : '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    borderRadius: '6px 6px 0 0',
    whiteSpace: 'nowrap',
  };
}

const svgContainerStyle: React.CSSProperties = {
  padding: '24px',
  overflow: 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  minHeight: '300px',
  background: C.bg,
  position: 'relative',
};

const sourceContainerStyle: React.CSSProperties = {
  background: C.surface2,
  border: `1px solid ${C.border}`,
  borderRadius: '8px',
  margin: '0 16px 16px',
  overflow: 'auto',
  maxHeight: '300px',
};

const sourcePreStyle: React.CSSProperties = {
  margin: 0,
  padding: '16px',
  color: C.text2,
  fontSize: '12px',
  lineHeight: 1.6,
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};

const fullscreenOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9999,
  background: C.bg,
  display: 'flex',
  flexDirection: 'column',
};

const fullscreenHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 20px',
  background: C.surface,
  borderBottom: `1px solid ${C.border}`,
};

const fullscreenBodyStyle: React.CSSProperties = {
  flex: 1,
  overflow: 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '24px',
};

// ---- Component ----
const MermaidViewer: React.FC<MermaidViewerProps> = ({ tabs, title }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSource, setShowSource] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [svgContent, setSvgContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const renderIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentTab = tabs[activeTab] ?? tabs[0];

  // Render mermaid diagram
  useEffect(() => {
    ensureMermaidInit();
    let cancelled = false;
    const id = `mermaid-${++renderIdRef.current}`;

    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render(id, currentTab.source);
        if (!cancelled) {
          setSvgContent(svg);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to render diagram'
          );
          setSvgContent('');
        }
        // Clean up any orphaned render element
        const orphan = document.getElementById(`d${id}`);
        if (orphan) orphan.remove();
      }
    };

    renderDiagram();
    return () => {
      cancelled = true;
    };
  }, [currentTab.source]);

  // Reset zoom when switching tabs
  useEffect(() => {
    setZoom(1);
  }, [activeTab]);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(z + 0.2, 3)), []);
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(z - 0.2, 0.3)),
    []
  );
  const zoomReset = useCallback(() => setZoom(1), []);

  const toggleFullscreen = useCallback(() => setFullscreen((f) => !f), []);

  // Keyboard escape for fullscreen
  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fullscreen]);

  const diagramHtml = (
    <div
      ref={containerRef}
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: 'center center',
        transition: 'transform 0.15s ease',
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );

  const errorDisplay = error && (
    <div
      style={{
        color: '#ef4444',
        background: '#1a0a0a',
        border: '1px solid #7f1d1d',
        borderRadius: '8px',
        padding: '16px',
        fontSize: '12px',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        margin: '16px',
      }}
    >
      {error}
    </div>
  );

  // ---- Fullscreen overlay ----
  if (fullscreen) {
    return (
      <div style={fullscreenOverlayStyle}>
        <div style={fullscreenHeaderStyle}>
          <span style={titleStyle}>{title}</span>
          <div style={controlBarStyle}>
            <button style={iconBtnStyle} onClick={zoomOut} title="Zoom Out">
              -
            </button>
            <span
              style={{ color: C.text2, fontSize: '11px', minWidth: '40px', textAlign: 'center' }}
            >
              {Math.round(zoom * 100)}%
            </span>
            <button style={iconBtnStyle} onClick={zoomIn} title="Zoom In">
              +
            </button>
            <button style={iconBtnStyle} onClick={zoomReset} title="Reset Zoom">
              1:1
            </button>
            <button
              style={{ ...textBtnStyle, color: '#ef4444', borderColor: '#7f1d1d' }}
              onClick={toggleFullscreen}
            >
              Exit Fullscreen
            </button>
          </div>
        </div>
        <div style={fullscreenBodyStyle}>
          {error ? errorDisplay : diagramHtml}
        </div>
      </div>
    );
  }

  // ---- Normal view ----
  return (
    <div style={wrapperStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <span style={titleStyle}>{title}</span>
        <div style={controlBarStyle}>
          <button style={iconBtnStyle} onClick={zoomOut} title="Zoom Out">
            -
          </button>
          <span
            style={{ color: C.text2, fontSize: '11px', minWidth: '40px', textAlign: 'center' }}
          >
            {Math.round(zoom * 100)}%
          </span>
          <button style={iconBtnStyle} onClick={zoomIn} title="Zoom In">
            +
          </button>
          <button style={iconBtnStyle} onClick={zoomReset} title="Reset Zoom">
            1:1
          </button>
          <button
            style={iconBtnStyle}
            onClick={toggleFullscreen}
            title="Fullscreen"
          >
            &#x26F6;
          </button>
          <button
            style={{
              ...textBtnStyle,
              ...(showSource
                ? { borderColor: C.accent, color: C.accent, background: `${C.accent}15` }
                : {}),
            }}
            onClick={() => setShowSource((s) => !s)}
          >
            {showSource ? 'Hide Source' : 'Show Source'}
          </button>
        </div>
      </div>

      {/* Tab bar (only if multiple tabs) */}
      {tabs.length > 1 && (
        <div style={tabBarStyle}>
          {tabs.map((tab, i) => (
            <button
              key={i}
              style={tabStyle(activeTab === i)}
              onClick={() => setActiveTab(i)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Diagram area */}
      <div style={svgContainerStyle}>
        {error ? errorDisplay : diagramHtml}
      </div>

      {/* Source panel */}
      {showSource && (
        <div style={sourceContainerStyle}>
          <pre style={sourcePreStyle}>{currentTab.source}</pre>
        </div>
      )}
    </div>
  );
};

export default React.memo(MermaidViewer);
