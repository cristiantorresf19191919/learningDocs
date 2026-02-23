import { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Search index — all navigable pages with keywords                   */
/* ------------------------------------------------------------------ */

interface SearchItem {
  title: string;
  to: string;
  description: string;
  category: string;
  keywords: string[];
  icon: string;
}

const searchIndex: SearchItem[] = [
  {
    title: 'Home',
    to: '/',
    description: 'Landing page with overview and navigation',
    category: 'General',
    keywords: ['home', 'start', 'overview', 'dashboard', 'landing'],
    icon: '\u2302',
  },
  {
    title: 'Backend Services Architecture',
    to: '/backend-services',
    description: '13+ microservices ecosystem, service explorer, Azure Service Bus',
    category: 'Architecture',
    keywords: ['backend', 'services', 'microservices', 'azure', 'service bus', 'architecture', 'infrastructure'],
    icon: '\u2630',
  },
  {
    title: 'Products-Api Flow',
    to: '/products-api',
    description: 'Pricing flow, endpoint deep dives, fi-rate cache, price calculator',
    category: 'Core Systems',
    keywords: ['products', 'api', 'pricing', 'flow', 'kotlin', 'endpoints', 'cache', 'calculator'],
    icon: '\u26A1',
  },
  {
    title: 'F&I Architecture',
    to: '/fi-architecture',
    description: 'Multi-module architecture, caching strategy, cron jobs, pricing logic',
    category: 'Architecture',
    keywords: ['fi', 'finance', 'insurance', 'architecture', 'modules', 'caching', 'pricing'],
    icon: '\u2692',
  },
  {
    title: 'Sync Flows',
    to: '/sync-flows',
    description: 'EDS\u2192Odyssey\u2192Products-Api pipeline, fi-rate decision tree',
    category: 'Data Flows',
    keywords: ['sync', 'flows', 'eds', 'pipeline', 'decision', 'tree', 'dev', 'prod'],
    icon: '\u21C4',
  },
  {
    title: 'Odyssey Deep Dive',
    to: '/odyssey-deep-dive',
    description: 'Kotlin/Spring Boot reactive backend, EDS import, Project Reactor',
    category: 'Odyssey',
    keywords: ['odyssey', 'deep dive', 'kotlin', 'spring', 'reactive', 'reactor', 'mongodb', 'eds'],
    icon: '\u2609',
  },
  {
    title: 'Odyssey Pipelines',
    to: '/odyssey-pipelines',
    description: 'CI/CD pipelines, Docker builds, Terraform, Helm, secrets',
    category: 'Odyssey',
    keywords: ['pipelines', 'cicd', 'docker', 'terraform', 'helm', 'secrets', 'deployment'],
    icon: '\u2699',
  },
  {
    title: 'Odyssey Endpoints',
    to: '/odyssey-endpoints',
    description: 'REST endpoints, GraphQL operations, search pipeline, data models',
    category: 'Odyssey',
    keywords: ['endpoints', 'rest', 'graphql', 'search', 'queries', 'mutations', 'api'],
    icon: '\u2197',
  },
  {
    title: 'Odyssey Services & Workers',
    to: '/odyssey-services',
    description: 'Background services, cron jobs, consumers, subscribers',
    category: 'Odyssey',
    keywords: ['services', 'workers', 'cron', 'consumer', 'subscriber', 'background', 'leasing'],
    icon: '\u2699',
  },
  {
    title: 'Gradle & Architecture',
    to: '/odyssey-gradle',
    description: '9-module project, 30+ dependencies, MongoDB, Atlas Search, Spring profiles',
    category: 'Odyssey',
    keywords: ['gradle', 'build', 'modules', 'dependencies', 'mongodb', 'atlas', 'spring', 'testing'],
    icon: '\u2692',
  },
  {
    title: 'System Overview',
    to: '/system-overview',
    description: 'End-to-end architecture, component diagrams, sequence flows',
    category: 'Odyssey',
    keywords: ['system', 'overview', 'architecture', 'component', 'sequence', 'diagram'],
    icon: '\u2637',
  },
  {
    title: 'Cron Jobs Deep Dive',
    to: '/cron-deep-dive',
    description: 'EDS import, lease expiry, region sync, DB cleanup, metrics',
    category: 'Operations',
    keywords: ['cron', 'jobs', 'scheduled', 'eds', 'lease', 'cleanup', 'metrics', 'retry'],
    icon: '\u23F0',
  },
  {
    title: 'Inventory Sync Pipeline',
    to: '/inventory-sync',
    description: 'EDS file ingestion, temp imports, safety checks, delta publishing',
    category: 'Data Flows',
    keywords: ['inventory', 'sync', 'pipeline', 'eds', 'import', 'mongodb', 'delta', 'publishing'],
    icon: '\u21BB',
  },
  {
    title: 'SRP Search & Filtering',
    to: '/srp-search',
    description: 'MongoDB Atlas Search, 12+ filter types, scoring, pagination',
    category: 'Search',
    keywords: ['srp', 'search', 'filter', 'atlas', 'mongodb', 'scoring', 'pagination', 'availability'],
    icon: '\u2315',
  },
  {
    title: 'GraphQL Exposure',
    to: '/graphql-exposure',
    description: 'SRP/inventory queries, resolvers, DTOs, input validation',
    category: 'API',
    keywords: ['graphql', 'queries', 'mutations', 'resolvers', 'dto', 'validation', 'schema'],
    icon: '\u25C7',
  },
  {
    title: 'Deployment & Config',
    to: '/deployment-config',
    description: 'Kubernetes, Helm, Terraform, Docker, Spring profiles, CI/CD',
    category: 'Operations',
    keywords: ['deployment', 'config', 'kubernetes', 'k8s', 'helm', 'terraform', 'docker', 'spring'],
    icon: '\u2601',
  },
  {
    title: 'Glossary',
    to: '/glossary',
    description: '40+ terms: SRP, EDS, Atlas Search, idempotency, mark & sweep',
    category: 'Reference',
    keywords: ['glossary', 'terms', 'definitions', 'srp', 'eds', 'atlas', 'idempotency'],
    icon: '\u2623',
  },
  {
    title: 'Ownership Landing',
    to: '/ownership-landing',
    description: 'Team ownership and service responsibilities',
    category: 'General',
    keywords: ['ownership', 'team', 'landing', 'responsibilities'],
    icon: '\u2691',
  },
  {
    title: 'Reactor Operators',
    to: '/reactor-operators',
    description: 'Project Reactor patterns with real Odyssey examples',
    category: 'Learning',
    keywords: ['reactor', 'operators', 'mono', 'flux', 'reactive', 'patterns', 'webflux'],
    icon: '\u269B',
  },
  {
    title: 'Odyssey Documentation',
    to: '/odyssey-documentation',
    description: 'Complete Odyssey API architecture, modules, APIs, deployment',
    category: 'Odyssey',
    keywords: ['odyssey', 'documentation', 'architecture', 'modules', 'api', 'deployment', 'overview'],
    icon: '\u2139',
  },
  {
    title: 'Odyssey Search Query Logic',
    to: '/odyssey-search-query-logic',
    description: 'Search pipeline from GraphQL to MongoDB Atlas Search',
    category: 'Odyssey',
    keywords: ['search', 'query', 'logic', 'graphql', 'atlas', 'mongodb', 'pipeline', 'filter', 'scoring'],
    icon: '\u2315',
  },
  {
    title: 'Odyssey Technical Guide',
    to: '/odyssey-technical-guide',
    description: 'Technical deep dive: Reactor, cron, Azure, MongoDB, testing',
    category: 'Odyssey',
    keywords: ['technical', 'guide', 'reactor', 'cron', 'azure', 'mongodb', 'testing', 'mermaid'],
    icon: '\u2609',
  },
];

/* ------------------------------------------------------------------ */
/*  Fuzzy search                                                       */
/* ------------------------------------------------------------------ */

function fuzzyMatch(query: string, item: SearchItem): number {
  const q = query.toLowerCase();
  const titleLower = item.title.toLowerCase();
  const descLower = item.description.toLowerCase();
  const catLower = item.category.toLowerCase();

  // Exact title match
  if (titleLower === q) return 100;
  // Title starts with query
  if (titleLower.startsWith(q)) return 90;
  // Title contains query
  if (titleLower.includes(q)) return 80;
  // Category match
  if (catLower.includes(q)) return 70;
  // Keyword exact match
  if (item.keywords.some((k) => k === q)) return 75;
  // Keyword starts with
  if (item.keywords.some((k) => k.startsWith(q))) return 65;
  // Keyword contains
  if (item.keywords.some((k) => k.includes(q))) return 55;
  // Description contains
  if (descLower.includes(q)) return 40;

  // Fuzzy: check if all query chars appear in order in the title
  let ti = 0;
  for (let qi = 0; qi < q.length; qi++) {
    const found = titleLower.indexOf(q[qi], ti);
    if (found === -1) return 0;
    ti = found + 1;
  }
  return 20;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Filter and sort results
  const results = query.trim()
    ? searchIndex
        .map((item) => ({ item, score: fuzzyMatch(query, item) }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((r) => r.item)
    : searchIndex;

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Scroll selected into view
  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll('[data-palette-item]');
    items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const handleSelect = useCallback(
    (to: string) => {
      navigate(to);
      onClose();
    },
    [navigate, onClose],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) handleSelect(results[selectedIndex].to);
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [results, selectedIndex, handleSelect, onClose],
  );

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // toggle handled by parent
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Group results by category
  const grouped = results.reduce<Record<string, SearchItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            style={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            style={styles.palette}
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div style={styles.inputWrapper}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search pages, topics, keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={styles.input}
                autoComplete="off"
                spellCheck={false}
              />
              <kbd style={styles.kbd}>ESC</kbd>
            </div>

            {/* Results */}
            <div ref={listRef} style={styles.resultsList}>
              {results.length === 0 && (
                <div style={styles.noResults}>
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}

              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <div style={styles.categoryLabel}>{category}</div>
                  {items.map((item) => {
                    flatIndex++;
                    const idx = flatIndex;
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={item.to}
                        data-palette-item
                        style={{
                          ...styles.resultItem,
                          ...(isSelected ? styles.resultItemActive : {}),
                        }}
                        onClick={() => handleSelect(item.to)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <span style={styles.resultIcon}>{item.icon}</span>
                        <div style={styles.resultText}>
                          <div style={styles.resultTitle}>{item.title}</div>
                          <div style={styles.resultDesc}>{item.description}</div>
                        </div>
                        {isSelected && (
                          <span style={styles.enterHint}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 10 4 15 9 20" />
                              <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                            </svg>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={styles.footer}>
              <span style={styles.footerHint}>
                <kbd style={styles.kbdSmall}>&uarr;</kbd>
                <kbd style={styles.kbdSmall}>&darr;</kbd>
                navigate
              </span>
              <span style={styles.footerHint}>
                <kbd style={styles.kbdSmall}>&crarr;</kbd>
                open
              </span>
              <span style={styles.footerHint}>
                <kbd style={styles.kbdSmall}>esc</kbd>
                close
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 9990,
  } satisfies CSSProperties,

  palette: {
    position: 'fixed',
    top: '15%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'min(95vw, 620px)',
    maxHeight: '70vh',
    background: '#111827',
    border: '1px solid #2a3a52',
    borderRadius: 16,
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 9991,
  } satisfies CSSProperties,

  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 18px',
    borderBottom: '1px solid #2a3a52',
  } satisfies CSSProperties,

  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    color: '#e2e8f0',
    fontFamily: 'inherit',
    fontWeight: 500,
  } satisfies CSSProperties,

  kbd: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: 6,
    border: '1px solid #2a3a52',
    background: '#1a2332',
    color: '#64748b',
    fontSize: '0.7rem',
    fontWeight: 600,
    fontFamily: 'inherit',
    letterSpacing: '0.04em',
    flexShrink: 0,
  } satisfies CSSProperties,

  resultsList: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px',
  } satisfies CSSProperties,

  noResults: {
    padding: '2rem',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '0.9rem',
  } satisfies CSSProperties,

  categoryLabel: {
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#4a5568',
    padding: '10px 10px 6px',
  } satisfies CSSProperties,

  resultItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 12px',
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'background 0.1s ease',
  } satisfies CSSProperties,

  resultItemActive: {
    background: 'rgba(59, 130, 246, 0.1)',
    outline: '1px solid rgba(59, 130, 246, 0.2)',
  } satisfies CSSProperties,

  resultIcon: {
    fontSize: '1.2rem',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    background: '#1a2332',
    flexShrink: 0,
  } satisfies CSSProperties,

  resultText: {
    flex: 1,
    minWidth: 0,
  } satisfies CSSProperties,

  resultTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#e2e8f0',
    marginBottom: 2,
  } satisfies CSSProperties,

  resultDesc: {
    fontSize: '0.78rem',
    color: '#64748b',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  } satisfies CSSProperties,

  enterHint: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 6,
    background: 'rgba(59, 130, 246, 0.15)',
    color: '#3b82f6',
    flexShrink: 0,
  } satisfies CSSProperties,

  footer: {
    display: 'flex',
    gap: 16,
    padding: '10px 18px',
    borderTop: '1px solid #2a3a52',
    background: '#0d1117',
  } satisfies CSSProperties,

  footerHint: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.72rem',
    color: '#4a5568',
    fontWeight: 500,
  } satisfies CSSProperties,

  kbdSmall: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 20,
    height: 20,
    padding: '0 4px',
    borderRadius: 4,
    border: '1px solid #2a3a52',
    background: '#1a2332',
    color: '#64748b',
    fontSize: '0.65rem',
    fontWeight: 600,
    fontFamily: 'inherit',
  } satisfies CSSProperties,
};
