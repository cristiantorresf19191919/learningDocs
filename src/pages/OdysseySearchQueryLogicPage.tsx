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

export default function OdysseySearchQueryLogicPage() {
  return (
    <div style={wrapperStyle}>
      <iframe
        title="Odyssey Search Query Logic - Deep Dive"
        src="/odyssey-search-query-logic.html"
        style={iframeStyle}
      />
    </div>
  );
}
