import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */
const c = {
  bg: '#0a0e17',
  surface: '#111827',
  surface2: '#1a2332',
  border: '#2a3a52',
  text: '#e2e8f0',
  text2: '#94a3b8',
  accent: '#3b82f6',
  accent3: '#8b5cf6',
  green: '#10b981',
  yellow: '#f59e0b',
  pink: '#ec4899',
  cyan: '#06b6d4',
} as const;

/* ------------------------------------------------------------------ */
/*  Shared animation presets                                           */
/* ------------------------------------------------------------------ */
const fadeUp = {
  initial: { opacity: 0, y: 32 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, amount: 0.2 } as const,
  transition: { duration: 0.55, ease: 'easeOut' } as const,
};

const stagger = (i: number) => ({
  ...fadeUp,
  transition: { ...fadeUp.transition, delay: i * 0.1 },
});

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const badges: { label: string; color: string }[] = [
  { label: 'Products-Api (Kotlin)', color: c.green },
  { label: 'UI (React/Next.js)', color: c.accent },
  { label: 'Taxes-And-Fees-API', color: c.accent3 },
  { label: 'Salesforce Integration', color: c.yellow },
];

const stats: { value: string; label: string; color: string }[] = [
  { value: '5', label: 'Pages', color: c.accent },
  { value: '9', label: 'Services', color: c.green },
  { value: '23+', label: 'Diagrams', color: c.accent3 },
  { value: '3', label: 'Interactive Demos', color: c.pink },
];

interface NavCard {
  title: string;
  to: string;
  description: string;
  color: string;
  icon: ReactNode;
}

const rocketIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 3 0 3 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-3 0-3" />
  </svg>
);

const archIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="6" height="6" rx="1" />
    <rect x="16" y="6" width="6" height="6" rx="1" />
    <rect x="9" y="14" width="6" height="6" rx="1" />
    <path d="M5 12v2a2 2 0 0 0 2 2h3" />
    <path d="M19 12v2a2 2 0 0 1-2 2h-3" />
  </svg>
);

const syncIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
);

const odysseyIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const navCards: NavCard[] = [
  {
    title: 'Products-Api Flow',
    to: '/products-api',
    description:
      'Complete pricing flow documentation. Architecture diagrams, endpoint deep dives, fi-rate cache strategy, and interactive price calculator.',
    color: c.accent,
    icon: rocketIcon,
  },
  {
    title: 'F&I Architecture',
    to: '/fi-architecture',
    description:
      'Products-API multi-module architecture. Module dependencies, data flow, caching strategy, cron jobs, Azure Service Bus, and pricing logic.',
    color: c.green,
    icon: archIcon,
  },
  {
    title: 'Sync Flows',
    to: '/sync-flows',
    description:
      'Cross-cutting sync diagrams. Full EDS\u2192Odyssey\u2192Products-Api pipeline, fi-rate decision tree, and DEV vs PROD comparison.',
    color: c.accent3,
    icon: syncIcon,
  },
  {
    title: 'Odyssey Deep Dive',
    to: '/odyssey-deep-dive',
    description:
      'Kotlin/Spring Boot reactive backend. EDS import pipeline, Project Reactor tutorial, MongoDB patterns, Azure integrations, and 13 Mermaid diagrams.',
    color: c.cyan,
    icon: odysseyIcon,
  },
];

interface FeatureHighlight {
  title: string;
  description: string;
  color: string;
  icon: ReactNode;
}

const diagramIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const mermaidIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const calculatorIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="8" y2="10.01" />
    <line x1="12" y1="10" x2="12" y2="10.01" />
    <line x1="16" y1="10" x2="16" y2="10.01" />
    <line x1="8" y1="14" x2="8" y2="14.01" />
    <line x1="12" y1="14" x2="12" y2="14.01" />
    <line x1="16" y1="14" x2="16" y2="14.01" />
    <line x1="8" y1="18" x2="8" y2="18.01" />
    <line x1="12" y1="18" x2="12" y2="18.01" />
    <line x1="16" y1="18" x2="16" y2="18.01" />
  </svg>
);

const features: FeatureHighlight[] = [
  {
    title: 'React Flow Diagrams',
    description: '10 interactive node/edge diagrams with zoom, pan, and flow filtering',
    color: c.cyan,
    icon: diagramIcon,
  },
  {
    title: 'Mermaid Sequences',
    description: '5 sequence and flowchart diagrams with source toggle and fullscreen',
    color: c.yellow,
    icon: mermaidIcon,
  },
  {
    title: 'Live Calculator',
    description: 'Simulate markup logic for VSC, VLP, and Tire & Wheel products',
    color: c.pink,
    icon: calculatorIcon,
  },
];

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const pageWrapper: CSSProperties = {
  padding: '0 0 4rem 0',
  color: c.text,
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const heroSection: CSSProperties = {
  position: 'relative',
  textAlign: 'center',
  padding: '4rem 0 3.5rem',
  overflow: 'hidden',
};

const heroGradientBg: CSSProperties = {
  position: 'absolute',
  top: '-40%',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '140%',
  height: '180%',
  background:
    'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)',
  pointerEvents: 'none',
  zIndex: 0,
};

const heroContent: CSSProperties = {
  position: 'relative',
  zIndex: 1,
};

const heroTitle: CSSProperties = {
  fontSize: '3.2rem',
  fontWeight: 800,
  lineHeight: 1.15,
  margin: '0 0 1.25rem',
  letterSpacing: '-0.03em',
  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const heroSubtitle: CSSProperties = {
  fontSize: '1.1rem',
  color: c.text2,
  maxWidth: 580,
  margin: '0 auto 2rem',
  lineHeight: 1.75,
};

const badgeRow: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.6rem',
  justifyContent: 'center',
};

const makeBadge = (_dotColor: string): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
  padding: '0.35rem 0.85rem',
  borderRadius: 999,
  border: `1px solid ${c.border}`,
  background: c.surface,
  fontSize: '0.82rem',
  color: c.text2,
  whiteSpace: 'nowrap',
});

const dot = (color: string): CSSProperties => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: color,
  flexShrink: 0,
  boxShadow: `0 0 6px ${color}88`,
});

/* --- Stats --- */
const statsRow: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '1rem',
  margin: '0 0 3rem',
};

const makeStatCard = (_accentColor: string): CSSProperties => ({
  background: c.surface,
  border: `1px solid ${c.border}`,
  borderRadius: 14,
  padding: '1.5rem 1rem',
  textAlign: 'center',
  transition: 'border-color 0.25s, box-shadow 0.25s',
});

const makeStatValue = (accentColor: string): CSSProperties => ({
  fontSize: '2.4rem',
  fontWeight: 800,
  lineHeight: 1,
  marginBottom: '0.35rem',
  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

const statLabel: CSSProperties = {
  fontSize: '0.85rem',
  color: c.text2,
  fontWeight: 500,
};

/* --- Nav cards --- */
const navGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1.25rem',
  marginBottom: '3rem',
};

const makeNavCard = (_accentColor: string): CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  background: c.surface,
  border: `1px solid ${c.border}`,
  borderRadius: 16,
  padding: '1.75rem 1.5rem',
  textDecoration: 'none',
  color: c.text,
  transition: 'border-color 0.25s, box-shadow 0.3s, transform 0.25s',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
});

const makeIconWrap = (accentColor: string): CSSProperties => ({
  width: 48,
  height: 48,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `${accentColor}18`,
  color: accentColor,
  marginBottom: '1rem',
  flexShrink: 0,
});

const navCardTitle: CSSProperties = {
  fontSize: '1.15rem',
  fontWeight: 700,
  marginBottom: '0.55rem',
};

const navCardDesc: CSSProperties = {
  fontSize: '0.88rem',
  color: c.text2,
  lineHeight: 1.65,
  flex: 1,
};

const makeArrowPill = (accentColor: string): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  marginTop: '1.1rem',
  fontSize: '0.82rem',
  fontWeight: 600,
  color: accentColor,
});

/* --- Feature highlights --- */
const featureGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem',
};

const makeFeatureCard = (_accentColor: string): CSSProperties => ({
  background: c.surface2,
  border: `1px solid ${c.border}`,
  borderRadius: 12,
  padding: '1.25rem 1.15rem',
  transition: 'border-color 0.25s, box-shadow 0.3s',
});

const makeFeatureIcon = (accentColor: string): CSSProperties => ({
  width: 38,
  height: 38,
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `${accentColor}15`,
  color: accentColor,
  marginBottom: '0.75rem',
});

const featureTitle: CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 700,
  marginBottom: '0.35rem',
  color: c.text,
};

const featureDesc: CSSProperties = {
  fontSize: '0.82rem',
  color: c.text2,
  lineHeight: 1.6,
};

const sectionHeading: CSSProperties = {
  fontSize: '1.4rem',
  fontWeight: 700,
  marginBottom: '1.25rem',
  color: c.text,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  return (
    <div style={pageWrapper}>
      {/* ---- Hero Section ---- */}
      <section style={heroSection}>
        <div style={heroGradientBg} />
        <motion.div style={heroContent} {...fadeUp}>
          <h1 style={heroTitle}>
            Driveway Engineering
            <br />
            Documentation
          </h1>
          <p style={heroSubtitle}>
            Interactive architecture documentation for the Driveway F&amp;I platform.
            Explore system flows, pricing logic, and service integrations.
          </p>
          <div style={badgeRow}>
            {badges.map((b) => (
              <span key={b.label} style={makeBadge(b.color)}>
                <span style={dot(b.color)} />
                {b.label}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ---- Quick Stats ---- */}
      <motion.div style={statsRow} {...fadeUp}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            style={makeStatCard(s.color)}
            {...stagger(i)}
            whileHover={{
              borderColor: s.color,
              boxShadow: `0 0 20px ${s.color}22`,
            }}
          >
            <div style={makeStatValue(s.color)}>{s.value}</div>
            <div style={statLabel}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ---- Navigation Cards ---- */}
      <motion.div {...fadeUp}>
        <h2 style={sectionHeading}>Explore Documentation</h2>
        <div style={navGrid}>
          {navCards.map((card, i) => (
            <motion.div
              key={card.to}
              {...stagger(i)}
              whileHover={{
                borderColor: card.color,
                boxShadow: `0 4px 24px ${card.color}20`,
                y: -3,
              }}
              style={makeNavCard(card.color)}
            >
              <Link
                to={card.to}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div style={makeIconWrap(card.color)}>{card.icon}</div>
                <div style={navCardTitle}>{card.title}</div>
                <div style={navCardDesc}>{card.description}</div>
                <div style={makeArrowPill(card.color)}>
                  Explore
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ---- Feature Highlights ---- */}
      <motion.div {...fadeUp}>
        <h2 style={sectionHeading}>Feature Highlights</h2>
        <div style={featureGrid}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              style={makeFeatureCard(f.color)}
              {...stagger(i)}
              whileHover={{
                borderColor: f.color,
                boxShadow: `0 2px 16px ${f.color}18`,
              }}
            >
              <div style={makeFeatureIcon(f.color)}>{f.icon}</div>
              <div style={featureTitle}>{f.title}</div>
              <div style={featureDesc}>{f.description}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
