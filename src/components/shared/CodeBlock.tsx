import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

const CopyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ExpandIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const lineCount = code.trim().split('\n').length;

  // Escape key closes fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFullscreen]);

  // Lock body scroll while fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isFullscreen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silently fail
    }
  };

  /* ---- Shared elements ---- */

  const dots = (
    <div style={s.dots}>
      <span style={{ ...s.dot, backgroundColor: '#ef4444' }} />
      <span style={{ ...s.dot, backgroundColor: '#f59e0b' }} />
      <span style={{ ...s.dot, backgroundColor: '#10b981' }} />
    </div>
  );

  const copyBtn = (
    <button style={{ ...s.copyBtn, color: copied ? '#10b981' : '#64748b' }} onClick={handleCopy}>
      {copied ? <><CheckIcon /> Copied</> : <><CopyIcon /> Copy</>}
    </button>
  );

  /* ---- Inline (normal) view ---- */

  const inlineView = (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.headerLeft}>
          {dots}
          {filename && <span style={s.filename}>{filename}</span>}
        </div>
        <div style={s.headerRight}>
          {language && <span style={s.langTag}>{language}</span>}
          <button
            style={s.iconBtn}
            onClick={() => setIsFullscreen(true)}
            aria-label="Expand code to fullscreen"
            title="Expand"
          >
            <ExpandIcon />
          </button>
          {copyBtn}
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        showLineNumbers={showLineNumbers}
        customStyle={s.code}
        lineNumberStyle={s.lineNums}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );

  /* ---- Fullscreen overlay (via portal) ---- */

  const fullscreenView = isFullscreen && createPortal(
    <div style={fs.overlay}>
      {/* Header */}
      <div style={fs.header}>
        <div style={fs.headerLeft}>
          {dots}
          {filename && <span style={fs.filename}>{filename}</span>}
          {!filename && language && (
            <span style={fs.filename}>{language} snippet</span>
          )}
        </div>
        <div style={fs.headerRight}>
          {language && <span style={s.langTag}>{language}</span>}
          <span style={fs.lineCount}>{lineCount} lines</span>
          {copyBtn}
          <button
            style={fs.closeBtn}
            onClick={() => setIsFullscreen(false)}
            aria-label="Close fullscreen view"
            title="Close (Esc)"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* Code body */}
      <div style={fs.body}>
        <SyntaxHighlighter
          language={language}
          style={atomDark}
          showLineNumbers
          customStyle={fs.code}
          lineNumberStyle={fs.lineNums}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>,
    document.body,
  );

  return (
    <>
      {inlineView}
      {fullscreenView}
    </>
  );
};

export default CodeBlock;

/* ------------------------------------------------------------------ */
/*  Inline styles                                                      */
/* ------------------------------------------------------------------ */

const s = {
  container: {
    borderRadius: 'clamp(8px, 2vw, 12px)',
    overflow: 'hidden',
    border: '1px solid #2a3a52',
    backgroundColor: '#0d1117',
    fontSize: 'clamp(11px, 1.8vw, 13px)',
    lineHeight: 1.6,
  } satisfies React.CSSProperties,

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px clamp(10px, 2vw, 16px)',
    backgroundColor: '#161b22',
    borderBottom: '1px solid #2a3a52',
    gap: '8px',
  } satisfies React.CSSProperties,

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: 0,
  } satisfies React.CSSProperties,

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexShrink: 0,
  } satisfies React.CSSProperties,

  dots: {
    display: 'flex',
    gap: '6px',
    flexShrink: 0,
  } satisfies React.CSSProperties,

  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
  } satisfies React.CSSProperties,

  filename: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#94a3b8',
    fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  } satisfies React.CSSProperties,

  langTag: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    whiteSpace: 'nowrap',
  } satisfies React.CSSProperties,

  iconBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    background: 'none',
    border: '1px solid #2a3a52',
    borderRadius: '6px',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'color 0.2s ease, border-color 0.2s ease',
  } satisfies React.CSSProperties,

  copyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: '1px solid #2a3a52',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } satisfies React.CSSProperties,

  code: {
    margin: 0,
    padding: 'clamp(10px, 2vw, 16px)',
    backgroundColor: '#0d1117',
    fontSize: 'clamp(11px, 1.8vw, 13px)',
    lineHeight: 1.6,
    overflowX: 'auto',
  } satisfies React.CSSProperties,

  lineNums: {
    color: '#64748b',
    fontSize: '12px',
    paddingRight: '16px',
    minWidth: '2.5em',
    userSelect: 'none' as const,
  } satisfies React.CSSProperties,
};

/* ------------------------------------------------------------------ */
/*  Fullscreen styles                                                  */
/* ------------------------------------------------------------------ */

const fs = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: '#0a0e17',
    display: 'flex',
    flexDirection: 'column',
  } satisfies React.CSSProperties,

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    backgroundColor: '#111827',
    borderBottom: '1px solid #2a3a52',
    flexShrink: 0,
    gap: '12px',
    flexWrap: 'wrap',
  } satisfies React.CSSProperties,

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: 0,
  } satisfies React.CSSProperties,

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  } satisfies React.CSSProperties,

  filename: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#e2e8f0',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  } satisfies React.CSSProperties,

  lineCount: {
    fontSize: '11px',
    fontWeight: 500,
    color: '#64748b',
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    whiteSpace: 'nowrap',
  } satisfies React.CSSProperties,

  closeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#ef4444',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } satisfies React.CSSProperties,

  body: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: '#0d1117',
  } satisfies React.CSSProperties,

  code: {
    margin: 0,
    padding: '20px 24px',
    backgroundColor: '#0d1117',
    fontSize: '14px',
    lineHeight: 1.7,
    minHeight: '100%',
  } satisfies React.CSSProperties,

  lineNums: {
    color: '#4a5568',
    fontSize: '13px',
    paddingRight: '20px',
    minWidth: '3em',
    userSelect: 'none' as const,
    borderRight: '1px solid #1e293b',
    marginRight: '16px',
  } satisfies React.CSSProperties,
};
