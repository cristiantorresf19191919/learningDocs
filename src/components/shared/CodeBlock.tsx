import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silently fail
    }
  };

  const containerStyle: React.CSSProperties = {
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #2a3a52',
    backgroundColor: '#0d1117',
    fontSize: '13px',
    lineHeight: 1.6,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    backgroundColor: '#161b22',
    borderBottom: '1px solid #2a3a52',
  };

  const headerLeftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const dotsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '6px',
  };

  const dotBase: React.CSSProperties = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  };

  const filenameStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 500,
    color: '#94a3b8',
    fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
  };

  const languageTagStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
  };

  const copyButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: '1px solid #2a3a52',
    borderRadius: '6px',
    padding: '4px 10px',
    color: copied ? '#10b981' : '#64748b',
    fontSize: '11px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const customStyle: React.CSSProperties = {
    margin: 0,
    padding: '16px',
    backgroundColor: '#0d1117',
    fontSize: '13px',
    lineHeight: 1.6,
  };

  return (
    <div style={containerStyle}>
      {(filename || language) && (
        <div style={headerStyle}>
          <div style={headerLeftStyle}>
            <div style={dotsStyle}>
              <span style={{ ...dotBase, backgroundColor: '#ef4444' }} />
              <span style={{ ...dotBase, backgroundColor: '#f59e0b' }} />
              <span style={{ ...dotBase, backgroundColor: '#10b981' }} />
            </div>
            {filename && <span style={filenameStyle}>{filename}</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {language && <span style={languageTagStyle}>{language}</span>}
            <button style={copyButtonStyle} onClick={handleCopy}>
              {copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        showLineNumbers={showLineNumbers}
        customStyle={customStyle}
        lineNumberStyle={{
          color: '#64748b',
          fontSize: '12px',
          paddingRight: '16px',
          minWidth: '2.5em',
          userSelect: 'none',
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
