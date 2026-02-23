import type { CSSProperties } from 'react';

const wrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 'calc(100vh - 60px)',
  width: '100%',
  padding: 0,
};

const iframeStyle: CSSProperties = {
  width: '100%',
  flex: 1,
  minHeight: 'calc(100vh - 60px)',
  border: 'none',
  display: 'block',
};

export default function OdysseyDocumentationPage() {
  return (
    <div style={wrapperStyle}>
      <iframe
        title="Odyssey API - Complete Architecture Documentation"
        src="/odyssey-documentation.html"
        style={iframeStyle}
      />
    </div>
  );
}
