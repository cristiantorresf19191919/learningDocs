import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { useSidebar } from '../context/SidebarContext';
import SectionHeader from '../components/shared/SectionHeader';
import Badge from '../components/shared/Badge';

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
  text3: '#64748b',
  accent: '#3b82f6',
  green: '#10b981',
  purple: '#8b5cf6',
  orange: '#f59e0b',
  red: '#ef4444',
  pink: '#ec4899',
  cyan: '#06b6d4',
} as const;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

/* ------------------------------------------------------------------ */
/*  TOC                                                                */
/* ------------------------------------------------------------------ */
const tocItems = [
  { id: 'general-terms', label: 'General Terms' },
  { id: 'technical-terms', label: 'Technical Terms' },
  { id: 'data-terms', label: 'Data Terms' },
  { id: 'infrastructure-terms', label: 'Infrastructure Terms' },
];

/* ------------------------------------------------------------------ */
/*  Glossary Data                                                      */
/* ------------------------------------------------------------------ */
interface GlossaryTerm {
  term: string;
  abbreviation?: string;
  definition: string;
  category: 'general' | 'technical' | 'data' | 'infrastructure';
}

const glossaryTerms: GlossaryTerm[] = [
  // General Terms
  { term: 'Search Results Page', abbreviation: 'SRP', definition: 'The vehicle listing page where customers browse, search, and filter available inventory. Powered by MongoDB Atlas Search via GraphQL.', category: 'general' },
  { term: 'Vehicle Details Page', abbreviation: 'VDP', definition: 'Individual vehicle detail view showing full specs, pricing, images, and purchase options for a specific vehicle.', category: 'general' },
  { term: 'Enterprise Data Services', abbreviation: 'EDS', definition: 'Upstream provider of vehicle inventory data delivered as TSV (tab-separated values) files to Azure Blob Storage. The primary source of truth for vehicle inventory.', category: 'general' },
  { term: 'Finance & Insurance', abbreviation: 'F&I', definition: 'Finance and insurance products offered during the vehicle purchase process, including VSC, VLP, Tire & Wheel, and GAP coverage.', category: 'general' },
  { term: 'Certified Pre-Owned', abbreviation: 'CPO', definition: 'Manufacturer-certified used vehicles that have passed a rigorous inspection and come with an extended warranty. Treated as a distinct vehicle condition alongside NEW and USED.', category: 'general' },
  { term: 'Original Equipment Manufacturer', abbreviation: 'OEM', definition: 'Vehicle manufacturer (e.g., Toyota, Honda, Ford). OEM regions determine leasing pricing based on postal code mappings.', category: 'general' },
  { term: 'Vehicle Identification Number', abbreviation: 'VIN', definition: 'Unique 17-character identifier for each vehicle. Used as the primary key (@BsonId) in the vehicleV3 MongoDB collection.', category: 'general' },
  { term: 'Year Make Model Trim', abbreviation: 'YMMT', definition: 'The four key attributes that identify a vehicle configuration: year (e.g., 2024), make (Toyota), model (Camry), and trim (XSE).', category: 'general' },
  { term: 'Lead Time', definition: 'The time between when a vehicle is listed and when it becomes available for customer interaction. Affected by import frequency (30 min), sync delays, and index propagation.', category: 'general' },

  // Technical Terms
  { term: 'Idempotency', definition: 'Property where running an operation multiple times produces the same result as running it once. Vehicle upserts by VIN are idempotent \u2014 importing the same data twice yields identical results.', category: 'technical' },
  { term: 'Mark & Sweep', definition: 'Two-phase deletion strategy: Phase 1 (mark) sets status=DELETED for vehicles missing from the new import. Phase 2 (sweep) permanently removes DELETED records hourly.', category: 'technical' },
  { term: 'Delta Publishing', definition: 'Detecting and publishing only the changes (ADD, UPDATE, DELETE) between old and new datasets. The EDS import publishes deltas to Azure Service Bus in batches of 100.', category: 'technical' },
  { term: 'Temp Collection', definition: 'Staging area in MongoDB (temp_vehicleV3_<timestamp>) used during imports. Data is first written here, validated, then merged to the live collection. Cleaned up after 28 days.', category: 'technical' },
  { term: 'Atlas Search', definition: 'MongoDB\'s built-in full-text search engine that automatically indexes documents based on defined mappings. Powers the SRP with the shopSearch index on vehicleV3.', category: 'technical' },
  { term: 'Aggregation Pipeline', definition: 'MongoDB\'s framework for data processing through a sequence of stages ($search, $skip, $limit, $addFields, $project). The GraphQL search layer builds these dynamically.', category: 'technical' },
  { term: 'Faceted Navigation', definition: 'Search UI pattern showing count-based filters (e.g., "Toyota (45)", "Honda (32)"). Implemented via MongoDB $searchMeta with facet operators.', category: 'technical' },
  { term: 'Compound Block', definition: 'MongoDB Atlas Search operator combining must (required matches), should (optional boosts), and filter (required, no score impact) clauses.', category: 'technical' },
  { term: 'Score Weights', definition: 'Configurable boosts applied to search results for ranking. Versioned by SortType (e.g., LOW_PRICE_USED_CAR, RECOMMENDED). Loaded from SearchScoreWeightsCache.', category: 'technical' },
  { term: 'Fuzzy Matching', definition: 'Text search that tolerates typos with maxEdits=1 and prefixLength=0. Matches "Toyata" to "Toyota" with up to 50 expansions per term.', category: 'technical' },
  { term: 'Backpressure', definition: 'Reactive Streams concept where consumers signal producers to slow down when overwhelmed. Managed by Project Reactor in the async pipeline.', category: 'technical' },
  { term: 'Project Reactor', definition: 'Reactive programming library for non-blocking async operations. Core types: Mono<T> (0-1 elements) and Flux<T> (0-N elements). Used throughout Odyssey-Api.', category: 'technical' },
  { term: 'Reactor Checkpoint', definition: 'Debug marker in reactive chains that provides meaningful stack traces. Used in cron jobs to label each pipeline stage (e.g., "Stage 1: Check if job is already running").', category: 'technical' },
  { term: 'Suspicious Delta Threshold', definition: 'Safety mechanism that aborts an import if the new file would delete more than 15,000 vehicles compared to the live collection. Configurable via CronConfig.', category: 'technical' },

  // Data Terms
  { term: 'vehicleV3', definition: 'The primary MongoDB collection storing all vehicle inventory data. Contains 40+ fields per document including pricing, specs, leasing, dealer info, images, and availability. Keyed by VIN.', category: 'data' },
  { term: 'searchSuggestion', definition: 'MongoDB collection storing autocomplete suggestions as unique make+model combinations. Updated after each EDS import. Indexed by the shopSuggestions Atlas Search index.', category: 'data' },
  { term: 'postalCodeOemRegions', definition: 'Collection mapping postal codes to OEM region IDs for leasing price calculations. Synced 4x daily from the Incentives API. Used by LeasingBuilder in the search pipeline.', category: 'data' },
  { term: 'inventoryJobDetails', definition: 'Collection tracking cron import job status and metadata (runId, status, counts, timing). Used to prevent duplicate concurrent imports and for observability.', category: 'data' },
  { term: 'Regional Pricing', definition: 'Leasing prices that vary by OEM region. Each vehicle can have multiple regionalPrices entries. Region 1 (defaultRegionId=1) is the default. Managed by the consumer module.', category: 'data' },
  { term: 'Free Shipping Zone', definition: 'Postal codes within a dealer\'s delivery zone where shipping fee is $0. Stored as dealer.zoneZips on each vehicle. Used by ShippingBuilder for search scoring.', category: 'data' },
  { term: 'State Shipping Map', definition: 'Per-state shipping fee lookup (dealer.stateShippingMap) used when the buyer\'s postal code is outside the dealer\'s free shipping zone.', category: 'data' },
  { term: 'Inventory Status', definition: 'Enum with three values: ACTIVE (available for sale and searchable), INACTIVE (not searchable), DELETED (removed from inventory, pending cleanup).', category: 'data' },
  { term: 'Availability', definition: 'Vehicle availability model with flags: purchasePending (cart reservation), salesPending (dealership hold), salesBooked (dealership sold), inventoryInTransit (in shipping), reconOrderOpen (reconditioning).', category: 'data' },
  { term: 'Protected Fields', definition: 'Fields preserved during EDS import merge: leasing, manuallySuppressed, availability.purchasePending, image.spinUrl. These are managed by separate services.', category: 'data' },

  // Infrastructure Terms
  { term: 'Azure Kubernetes Service', abbreviation: 'AKS', definition: 'Managed Kubernetes cluster where all five Odyssey-Api microservices are deployed. Uses Helm charts for configuration.', category: 'infrastructure' },
  { term: 'Azure Service Bus', abbreviation: 'ASB', definition: 'Message broker for async event-driven communication. Topics: inventory-delta-topic, leasing-incentives-topic, cart-status-update-topic.', category: 'infrastructure' },
  { term: 'Helm Chart', definition: 'Kubernetes package manager template defining deployment configuration. The cron module uses chart type "cron" (Kubernetes CronJob), while API services use standard deployments.', category: 'infrastructure' },
  { term: 'Terraform', definition: 'Infrastructure-as-code tool managing MongoDB Atlas Search indexes and Azure Service Bus topics/subscriptions. Defined per environment in terraform/infrastructure/{env}/.', category: 'infrastructure' },
  { term: 'DataDog APM', definition: 'Application Performance Monitoring via distributed tracing. Uses dd-java-agent.jar injected at runtime. Enabled in dev/uat/prod profiles. Profiling enabled in prod only.', category: 'infrastructure' },
  { term: 'Micrometer', definition: 'Metrics facade for JVM applications that exports counters and gauges to DataDog. Common tags: env (profile), service (module name). Used for job status tracking.', category: 'infrastructure' },
  { term: 'OpenTracing', definition: 'Distributed tracing standard used for cross-service request correlation. Creates spans with baggage items (service, jobId) that propagate through the pipeline.', category: 'infrastructure' },
  { term: 'Azurite', definition: 'Local Azure Storage emulator used in development (laptop profile). Runs on port 10010 via docker-compose. Replaces real Azure Blob Storage for EDS file testing.', category: 'infrastructure' },
  { term: 'Azure Blob Storage', definition: 'Cloud object storage hosting EDS TSV files in the "inbound" container. Files are tagged (complete/skipped) after processing to prevent re-processing.', category: 'infrastructure' },
  { term: 'Spring Profiles', definition: 'Environment-specific configuration: laptop (local dev, cron disabled), dev (Azure services, cron enabled), uat (error redaction), prod (full monitoring). Activated via SPRING_PROFILES_ACTIVE.', category: 'infrastructure' },
];

const categoryConfig: Record<string, { label: string; color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'cyan' | 'pink'; sectionId: string; title: string; description: string }> = {
  general: { label: 'General', color: 'blue', sectionId: 'general-terms', title: 'General Terms', description: 'Business and domain terminology used across the Odyssey-Api platform.' },
  technical: { label: 'Technical', color: 'purple', sectionId: 'technical-terms', title: 'Technical Terms', description: 'Engineering concepts and patterns used in the implementation.' },
  data: { label: 'Data', color: 'green', sectionId: 'data-terms', title: 'Data Terms', description: 'Database collections, fields, and data structures.' },
  infrastructure: { label: 'Infrastructure', color: 'cyan', sectionId: 'infrastructure-terms', title: 'Infrastructure Terms', description: 'Deployment, monitoring, and cloud service terminology.' },
};

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const page: CSSProperties = {
  padding: '0 0 4rem',
  color: c.text,
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const heroSection: CSSProperties = {
  position: 'relative',
  textAlign: 'center',
  padding: '5rem 0 4rem',
  overflow: 'hidden',
};

const heroGradientBg: CSSProperties = {
  position: 'absolute',
  top: '-40%',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '160%',
  height: '200%',
  background:
    'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.08) 40%, transparent 70%)',
  pointerEvents: 'none',
  zIndex: 0,
};

const heroContent: CSSProperties = { position: 'relative', zIndex: 1 };

const heroTitle: CSSProperties = {
  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
  fontWeight: 800,
  lineHeight: 1.1,
  margin: '0 0 1.5rem',
  letterSpacing: '-0.03em',
  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #06b6d4 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const heroSubtitle: CSSProperties = {
  fontSize: '1.1rem',
  color: c.text2,
  maxWidth: 700,
  margin: '0 auto',
  lineHeight: 1.8,
};

const section: CSSProperties = { marginTop: '4rem' };

const searchBox: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  maxWidth: 500,
  margin: '0 auto 2rem',
  padding: '0.75rem 1.25rem',
  background: c.surface,
  border: `1px solid ${c.border}`,
  borderRadius: 12,
};

const searchInput: CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: c.text,
  fontSize: '0.95rem',
  fontFamily: 'inherit',
};

const termGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
  gap: '1rem',
  marginTop: '1.5rem',
};

const termCard: CSSProperties = {
  background: c.surface,
  border: `1px solid ${c.border}`,
  borderRadius: 12,
  padding: '1.25rem',
  transition: 'border-color 0.25s, box-shadow 0.25s',
};

const termName: CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: c.text,
  marginBottom: '0.25rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  flexWrap: 'wrap',
};

const termAbbr: CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: c.accent,
  background: `${c.accent}15`,
  padding: '0.15rem 0.5rem',
  borderRadius: 6,
};

const termDef: CSSProperties = {
  fontSize: '0.85rem',
  lineHeight: 1.7,
  color: c.text2,
  margin: '0.5rem 0 0',
};

const countBadge: CSSProperties = {
  fontSize: '0.8rem',
  color: c.text3,
  marginLeft: '0.5rem',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function GlossaryPage() {
  const { setSidebar, clearSidebar } = useSidebar();
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSidebar('Glossary', tocItems);
    return () => clearSidebar();
  }, []);

  const filtered = search.trim()
    ? glossaryTerms.filter(
        (t) =>
          t.term.toLowerCase().includes(search.toLowerCase()) ||
          (t.abbreviation && t.abbreviation.toLowerCase().includes(search.toLowerCase())) ||
          t.definition.toLowerCase().includes(search.toLowerCase())
      )
    : glossaryTerms;

  const renderCategory = (cat: string) => {
    const config = categoryConfig[cat];
    const terms = filtered.filter((t) => t.category === cat);
    if (terms.length === 0) return null;

    return (
      <motion.section id={config.sectionId} style={section} {...fadeUp} key={cat}>
        <SectionHeader
          label="Glossary"
          title={config.title}
          description={config.description}
        />
        <div style={termGrid}>
          {terms.map((t) => (
            <motion.div
              key={t.term}
              style={termCard}
              whileHover={{ borderColor: c.accent, boxShadow: `0 2px 16px ${c.accent}15` }}
            >
              <div style={termName}>
                {t.term}
                {t.abbreviation && <span style={termAbbr}>{t.abbreviation}</span>}
                <Badge label={config.label} color={config.color} />
              </div>
              <p style={termDef}>{t.definition}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    );
  };

  return (
    <div style={page}>
      {/* Hero */}
      <section style={heroSection}>
        <div style={heroGradientBg} />
        <motion.div style={heroContent} {...fadeUp}>
          <h1 style={heroTitle}>Glossary</h1>
          <p style={heroSubtitle}>
            Terminology and definitions used across the Odyssey-Api inventory sync,
            search, cron, and GraphQL documentation.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <Badge label={`${glossaryTerms.length} Terms`} color="purple" dot />
            <Badge label="4 Categories" color="cyan" dot />
          </div>
        </motion.div>
      </section>

      {/* Search */}
      <motion.div {...fadeUp}>
        <div style={searchBox}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.text3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            style={searchInput}
            placeholder="Search terms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <span style={countBadge}>{filtered.length} results</span>
          )}
        </div>
      </motion.div>

      {/* Categories */}
      {['general', 'technical', 'data', 'infrastructure'].map(renderCategory)}

      {filtered.length === 0 && (
        <motion.div {...fadeUp} style={{ textAlign: 'center', padding: '3rem 0', color: c.text3 }}>
          <p style={{ fontSize: '1.1rem' }}>No terms match "{search}"</p>
        </motion.div>
      )}
    </div>
  );
}
