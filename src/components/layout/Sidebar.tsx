import { useState, useEffect, type CSSProperties } from 'react';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useSidebar } from '../../context/SidebarContext';
import { useWindowWidth } from '../../hooks/useWindowWidth';

const MOBILE_BP = 768;

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

/* Mobile off-canvas drawer styles */
const mobileAside: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  width: 280,
  overflowY: 'auto',
  padding: '1.25rem 1rem',
  background: 'var(--surface)',
  borderRight: '1px solid var(--border)',
  zIndex: 1001,
  transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
};

const mobileAsideClosed: CSSProperties = {
  ...mobileAside,
  transform: 'translateX(-100%)',
};

const mobileOverlay: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
  transition: 'opacity 0.3s ease',
};

const mobileDrawerHeader: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
  paddingBottom: '0.75rem',
  borderBottom: '1px solid var(--border)',
};

const mobileDrawerTitle: CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: 700,
  color: 'var(--accent)',
  letterSpacing: '0.04em',
};

const closeBtn: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  background: 'var(--surface2)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text2)',
  fontSize: '1.1rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const mobileIndexBtn: CSSProperties = {
  position: 'fixed',
  bottom: 20,
  left: 20,
  zIndex: 950,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '0.6rem 1rem',
  background: 'var(--accent)',
  color: '#fff',
  border: 'none',
  borderRadius: 'var(--radius)',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
  transition: 'all 0.2s ease',
};

/* Desktop toggle button */
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
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'var(--accent)',
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

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { sections, title } = useSidebar();
  const activeId = useActiveSection(sections.map((s) => s.id));
  const width = useWindowWidth();
  const mobile = width < MOBILE_BP;

  // Close mobile drawer when switching to desktop
  useEffect(() => {
    if (!mobile) setMobileOpen(false);
  }, [mobile]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [mobileOpen]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (mobile) setMobileOpen(false);
  };

  const sectionList = (
    <>
      {sections.length > 0 && (
        <>
          {title && <div style={heading}>{title}</div>}
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
        <p style={{ color: 'var(--text2)', fontSize: '0.85rem', padding: '0.5rem' }}>
          Select a page to view its sections.
        </p>
      )}
    </>
  );

  /* --- Mobile layout --- */
  if (mobile) {
    return (
      <>
        {/* Floating "Index" button - only show when there are sections */}
        {sections.length > 0 && !mobileOpen && (
          <button
            style={mobileIndexBtn}
            onClick={() => setMobileOpen(true)}
            aria-label="Open page index"
          >
            <span style={{ fontSize: '1rem' }}>{'\u2630'}</span>
            Index
          </button>
        )}

        {/* Overlay */}
        {mobileOpen && (
          <div
            style={mobileOverlay}
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
        )}

        {/* Drawer */}
        <aside style={mobileOpen ? mobileAside : mobileAsideClosed}>
          <div style={mobileDrawerHeader}>
            <span style={mobileDrawerTitle}>
              {title || 'Page Sections'}
            </span>
            <button
              style={closeBtn}
              onClick={() => setMobileOpen(false)}
              aria-label="Close index"
            >
              ✕
            </button>
          </div>
          {sectionList}
        </aside>
      </>
    );
  }

  /* --- Desktop layout --- */
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
        {sectionList}
      </aside>
    </>
  );
}
