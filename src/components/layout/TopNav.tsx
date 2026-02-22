import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect, type CSSProperties } from 'react';
import { useWindowWidth } from '../../hooks/useWindowWidth';

interface TopNavProps {
  onOpenSearch?: () => void;
}

const MOBILE_BP = 768;
const TABLET_BP = 1080;

/* ------------------------------------------------------------------ */
/*  Nav links data                                                     */
/* ------------------------------------------------------------------ */

const links = [
  { to: '/', label: 'Home' },
  { to: '/backend-services', label: 'Backend Services' },
  { to: '/products-api', label: 'Products-Api' },
  { to: '/fi-architecture', label: 'F&I Architecture' },
  { to: '/sync-flows', label: 'Sync Flows' },
  { to: '/odyssey-deep-dive', label: 'Odyssey Deep Dive' },
  { to: '/odyssey-pipelines', label: 'Pipelines' },
  { to: '/odyssey-endpoints', label: 'Endpoints' },
  { to: '/odyssey-services', label: 'Services' },
  { to: '/odyssey-gradle', label: 'Gradle' },
  { to: '/ownership-landing', label: 'Ownership Landing' },
  { to: '/reactor-operators', label: 'Reactor Operators' },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TopNav({ onOpenSearch }: TopNavProps) {
  const location = useLocation();
  const width = useWindowWidth();
  const mobile = width < MOBILE_BP;
  const compact = width < TABLET_BP;
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [drawerOpen]);

  const isLinkActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  /* --- Desktop horizontal links --- */
  const desktopLinks = !compact && (
    <div style={styles.linksContainer}>
      {links.map(({ to, label }) => {
        const active = isLinkActive(to);
        return (
          <NavLink
            key={to}
            to={to}
            style={() => (active ? styles.activeLink : styles.baseLink)}
            end={to === '/'}
            onMouseEnter={(e) => {
              if (!active) {
                (e.currentTarget as HTMLElement).style.color = 'var(--text)';
                (e.currentTarget as HTMLElement).style.background = 'var(--surface)';
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                (e.currentTarget as HTMLElement).style.color = 'var(--text2)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }
            }}
          >
            {label}
          </NavLink>
        );
      })}
    </div>
  );

  /* --- Hamburger button (mobile + tablet) --- */
  const hamburger = compact && (
    <button
      style={styles.hamburgerBtn}
      onClick={() => setDrawerOpen(true)}
      aria-label="Open navigation menu"
    >
      <span style={styles.hamburgerLine} />
      <span style={styles.hamburgerLine} />
      <span style={styles.hamburgerLine} />
    </button>
  );

  return (
    <>
      <nav style={{
        ...styles.navBar,
        padding: mobile ? '0 1rem' : '0 1.5rem',
      }}>
        <div style={styles.navLeft}>
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <div style={styles.logo}>Driveway Docs</div>
          </NavLink>
          <button
            style={styles.searchTrigger}
            onClick={onOpenSearch}
            aria-label="Search documentation"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span style={styles.searchText}>Search...</span>
            <kbd style={styles.searchKbd}>{navigator.platform?.includes('Mac') ? '\u2318' : 'Ctrl'}K</kbd>
          </button>
        </div>
        {desktopLinks}
        {hamburger}
      </nav>

      {/* Slide-over drawer (mobile + tablet) */}
      {compact && (
        <>
          {/* Overlay */}
          {drawerOpen && (
            <div
              style={styles.overlay}
              onClick={() => setDrawerOpen(false)}
              aria-hidden
            />
          )}

          {/* Drawer panel */}
          <div style={{
            ...styles.drawer,
            transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
            width: mobile ? '85vw' : 320,
            maxWidth: 360,
          }}>
            {/* Drawer header */}
            <div style={styles.drawerHeader}>
              <span style={styles.drawerTitle}>Navigation</span>
              <button
                style={styles.closeBtn}
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation menu"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Links list */}
            <div style={styles.drawerLinks}>
              {links.map(({ to, label }) => {
                const active = isLinkActive(to);
                return (
                  <NavLink
                    key={to}
                    to={to}
                    style={() => (active ? styles.drawerActiveLink : styles.drawerLink)}
                    end={to === '/'}
                    onClick={() => setDrawerOpen(false)}
                  >
                    {active && <span style={styles.activeDot} />}
                    {label}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Style objects                                                      */
/* ------------------------------------------------------------------ */

const styles = {
  navBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(10, 14, 23, 0.8)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border)',
    zIndex: 1000,
  } satisfies CSSProperties,

  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    minWidth: 0,
  } satisfies CSSProperties,

  logo: {
    fontSize: '1.2rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, var(--accent), var(--accent3))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.02em',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  } satisfies CSSProperties,

  searchTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text3)',
    fontSize: '0.82rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    minWidth: 0,
  } satisfies CSSProperties,

  searchText: {
    color: 'var(--text3)',
    fontSize: '0.82rem',
    fontWeight: 400,
  } satisfies CSSProperties,

  searchKbd: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '1px 5px',
    borderRadius: 4,
    border: '1px solid var(--border)',
    background: 'rgba(100, 116, 139, 0.1)',
    color: 'var(--text3)',
    fontSize: '0.68rem',
    fontWeight: 600,
    fontFamily: 'inherit',
    letterSpacing: '0.02em',
    marginLeft: 4,
  } satisfies CSSProperties,

  linksContainer: {
    display: 'flex',
    gap: '0.15rem',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  } satisfies CSSProperties,

  baseLink: {
    padding: '0.35rem 0.7rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.82rem',
    fontWeight: 500,
    color: 'var(--text2)',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  } satisfies CSSProperties,

  activeLink: {
    padding: '0.35rem 0.7rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.82rem',
    fontWeight: 500,
    color: 'var(--text)',
    background: 'var(--surface2)',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  } satisfies CSSProperties,

  /* Hamburger */
  hamburgerBtn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    width: 40,
    height: 40,
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    padding: 8,
    transition: 'all 0.2s ease',
  } satisfies CSSProperties,

  hamburgerLine: {
    display: 'block',
    width: 18,
    height: 2,
    borderRadius: 2,
    background: 'var(--text2)',
    transition: 'all 0.3s ease',
  } satisfies CSSProperties,

  /* Overlay */
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1099,
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  } satisfies CSSProperties,

  /* Drawer */
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    background: 'var(--surface)',
    borderLeft: '1px solid var(--border)',
    zIndex: 1100,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  } satisfies CSSProperties,

  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.25rem 1rem',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
  } satisfies CSSProperties,

  drawerTitle: {
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--text3)',
  } satisfies CSSProperties,

  closeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text2)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } satisfies CSSProperties,

  drawerLinks: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0.75rem',
    gap: 2,
    flex: 1,
  } satisfies CSSProperties,

  drawerLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.7rem 0.85rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.92rem',
    fontWeight: 500,
    color: 'var(--text2)',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
  } satisfies CSSProperties,

  drawerActiveLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.7rem 0.85rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.92rem',
    fontWeight: 600,
    color: 'var(--accent)',
    background: 'rgba(59, 130, 246, 0.08)',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
  } satisfies CSSProperties,

  activeDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent)',
    flexShrink: 0,
  } satisfies CSSProperties,
};
