import { useState, type CSSProperties } from 'react';
import { useActiveSection } from '../../hooks/useActiveSection';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface SidebarSection {
  id: string;
  label: string;
}

interface SidebarProps {
  sections: SidebarSection[];
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const aside: CSSProperties = {
  position: 'fixed',
  top: 60,
  left: 0,
  bottom: 0,
  width: 260,
  overflowY: 'auto',
  padding: '1.5rem 1rem',
  borderRight: '1px solid var(--border)',
  background: 'var(--surface)',
  zIndex: 900,
  transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
};

const asideCollapsed: CSSProperties = {
  ...aside,
  transform: 'translateX(-260px)',
};

const toggleBtn: CSSProperties = {
  position: 'fixed',
  top: 72,
  left: 12,
  zIndex: 950,
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--surface2)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text2)',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'all 0.2s ease',
};

const toggleBtnOpen: CSSProperties = {
  ...toggleBtn,
  left: 268,
};

const heading: CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--text3)',
  marginBottom: '0.75rem',
  paddingLeft: '0.5rem',
};

const listStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};

const baseLinkStyle: CSSProperties = {
  display: 'block',
  padding: '0.4rem 0.75rem',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.835rem',
  fontWeight: 500,
  color: 'var(--text2)',
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  borderLeft: '2px solid transparent',
};

const activeLinkStyle: CSSProperties = {
  ...baseLinkStyle,
  color: 'var(--accent)',
  background: 'rgba(59, 130, 246, 0.08)',
  borderLeftColor: 'var(--accent)',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Sidebar({ sections }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const activeId = useActiveSection(sections.map((s) => s.id));

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        style={collapsed ? toggleBtn : toggleBtnOpen}
        onClick={() => setCollapsed((v) => !v)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '\u25B6' : '\u25C0'}
      </button>

      {/* Sidebar panel */}
      <aside style={collapsed ? asideCollapsed : aside}>
        {sections.length > 0 && (
          <>
            <div style={heading}>On this page</div>
            <ul style={listStyle}>
              {sections.map(({ id, label }) => (
                <li key={id}>
                  <div
                    role="button"
                    tabIndex={0}
                    style={activeId === id ? activeLinkStyle : baseLinkStyle}
                    onClick={() => handleClick(id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleClick(id);
                    }}
                    onMouseEnter={(e) => {
                      if (activeId !== id) {
                        (e.currentTarget as HTMLElement).style.color = 'var(--text)';
                        (e.currentTarget as HTMLElement).style.background = 'var(--surface2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeId !== id) {
                        (e.currentTarget as HTMLElement).style.color = 'var(--text2)';
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                      }
                    }}
                  >
                    {label}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {sections.length === 0 && (
          <p style={{ color: 'var(--text3)', fontSize: '0.8rem', padding: '0.5rem' }}>
            No sections on this page.
          </p>
        )}
      </aside>
    </>
  );
}
