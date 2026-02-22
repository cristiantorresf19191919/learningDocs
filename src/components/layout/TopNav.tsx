import { NavLink, useLocation } from 'react-router-dom';
import type { CSSProperties } from 'react';

/* ------------------------------------------------------------------ */
/*  Style objects                                                      */
/* ------------------------------------------------------------------ */

const navBar: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 2rem',
  background: 'rgba(10, 14, 23, 0.75)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  borderBottom: '1px solid var(--border)',
  zIndex: 1000,
};

const logoStyle: CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 800,
  background: 'linear-gradient(135deg, var(--accent), var(--accent3))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  letterSpacing: '-0.02em',
  userSelect: 'none',
};

const linksContainer: CSSProperties = {
  display: 'flex',
  gap: '0.25rem',
  alignItems: 'center',
};

const baseLinkStyle: CSSProperties = {
  padding: '0.4rem 0.85rem',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--text2)',
  textDecoration: 'none',
  transition: 'all 0.2s ease',
};

const activeLinkStyle: CSSProperties = {
  ...baseLinkStyle,
  color: 'var(--text)',
  background: 'var(--surface2)',
};

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
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TopNav() {
  const location = useLocation();

  return (
    <nav style={navBar}>
      <div style={logoStyle}>Driveway Docs</div>

      <div style={linksContainer}>
        {links.map(({ to, label }) => {
          const isActive =
            to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              style={({ isActive: _rrActive }) => {
                // Use our manual isActive check for more deterministic matching
                return isActive ? activeLinkStyle : baseLinkStyle;
              }}
              end={to === '/'}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.color = 'var(--text)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--surface)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
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
    </nav>
  );
}
