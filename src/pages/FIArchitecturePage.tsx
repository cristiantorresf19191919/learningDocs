import { useState } from 'react';
import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import ReactFlowDiagram from '../components/diagrams/ReactFlowDiagram';
import SectionHeader from '../components/shared/SectionHeader';
import CodeBlock from '../components/shared/CodeBlock';
import Tabs from '../components/shared/Tabs';
import DataTable from '../components/shared/DataTable';
import Callout from '../components/shared/Callout';
import Card from '../components/shared/Card';
import Badge from '../components/shared/Badge';
import FlowTimeline from '../components/shared/FlowTimeline';
import {
  nodes as fiModuleNodes,
  edges as fiModuleEdges,
} from '../diagrams/fiArchitectureModules';

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */
const c = {
  bg: '#0a0e17',
  surface: '#111827',
  surface2: '#1a2332',
  surface3: '#1f2b3d',
  border: '#2a3a52',
  text: '#e2e8f0',
  text2: '#94a3b8',
  text3: '#64748b',
  accent: '#3b82f6',
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
  cyan: '#06b6d4',
  pink: '#ec4899',
  orange: '#f97316',
  purple: '#8b5cf6',
} as const;

/* ------------------------------------------------------------------ */
/*  Animation presets                                                   */
/* ------------------------------------------------------------------ */
const fadeUp = {
  initial: { opacity: 0, y: 32 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, amount: 0.15 } as const,
  transition: { duration: 0.55, ease: 'easeOut' } as const,
};

const stagger = (i: number) => ({
  ...fadeUp,
  transition: { ...fadeUp.transition, delay: i * 0.08 },
});

/* ------------------------------------------------------------------ */
/*  Shared inline styles                                               */
/* ------------------------------------------------------------------ */
const pageStyle: CSSProperties = {
  padding: '0 0 4rem 0',
  color: c.text,
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const sectionStyle: CSSProperties = {
  marginBottom: '4rem',
};

const gridCols = (cols: number, gap = '1rem'): CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${cols}, 1fr)`,
  gap,
});

const statCardStyle = (_color: string): CSSProperties => ({
  background: c.surface,
  border: `1px solid ${c.border}`,
  borderRadius: 14,
  padding: '1.5rem 1rem',
  textAlign: 'center',
  transition: 'border-color 0.25s, box-shadow 0.25s',
});

const statValue = (color: string): CSSProperties => ({
  fontSize: '2rem',
  fontWeight: 800,
  lineHeight: 1,
  marginBottom: '0.35rem',
  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

const statLabel: CSSProperties = {
  fontSize: '0.82rem',
  color: c.text2,
  fontWeight: 500,
};

const inlineCode: CSSProperties = {
  fontFamily: "'SF Mono', 'Fira Code', monospace",
  fontSize: '0.82rem',
  background: `${c.accent}15`,
  color: c.accent,
  padding: '2px 7px',
  borderRadius: 5,
};

const paragraph: CSSProperties = {
  fontSize: '0.92rem',
  lineHeight: 1.75,
  color: c.text2,
  margin: '0 0 1rem 0',
};

const subheading: CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 700,
  color: c.text,
  margin: '0 0 0.75rem 0',
};

const legendDot = (color: string): CSSProperties => ({
  display: 'inline-block',
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: color,
  marginRight: 6,
  boxShadow: `0 0 6px ${color}66`,
});

const tagStyle = (color: string): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 12px',
  borderRadius: 9999,
  background: `${color}15`,
  color,
  fontSize: '0.78rem',
  fontWeight: 600,
  border: `1px solid ${color}30`,
});

/* helper for product cards */
const productCardStyle: CSSProperties = {
  background: c.surface,
  border: `1px solid ${c.border}`,
  borderRadius: 14,
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

/* helper for module cards */
const moduleCardStyle = (borderColor: string): CSSProperties => ({
  background: c.surface,
  border: `1px solid ${c.border}`,
  borderLeft: `4px solid ${borderColor}`,
  borderRadius: 12,
  padding: '1.25rem 1.5rem',
});

/* check / cross marks */
const check = <span style={{ color: c.green, fontWeight: 700 }}>&#10003;</span>;
const cross = <span style={{ color: c.red, fontWeight: 700 }}>&#10007;</span>;

/* collapsible section arrow */
const chevron = (open: boolean): CSSProperties => ({
  display: 'inline-block',
  transition: 'transform 0.25s',
  transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
  marginRight: 8,
});

/* ------------------------------------------------------------------ */
/*  Hero Section                                                       */
/* ------------------------------------------------------------------ */
const heroSection: CSSProperties = {
  position: 'relative',
  textAlign: 'center',
  padding: '4rem 0 3rem',
  overflow: 'hidden',
};

const heroGlow: CSSProperties = {
  position: 'absolute',
  top: '-40%',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '140%',
  height: '180%',
  background:
    'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(16,185,129,0.1) 0%, rgba(59,130,246,0.06) 40%, transparent 70%)',
  pointerEvents: 'none',
  zIndex: 0,
};

const heroTitle: CSSProperties = {
  fontSize: 'clamp(1.75rem, 5vw, 2.8rem)',
  fontWeight: 800,
  lineHeight: 1.15,
  margin: '0 0 1rem',
  letterSpacing: '-0.03em',
  background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const heroSubtitle: CSSProperties = {
  fontSize: '1.05rem',
  color: c.text2,
  maxWidth: 640,
  margin: '0 auto',
  lineHeight: 1.75,
};

/* flow diagram visual */
const flowBoxStyle = (color: string): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 16px',
  borderRadius: 10,
  background: `${color}12`,
  border: `1px solid ${color}40`,
  color,
  fontSize: '0.82rem',
  fontWeight: 600,
  whiteSpace: 'nowrap',
});

const flowArrow: CSSProperties = {
  color: c.text3,
  fontSize: '1.2rem',
  margin: '0 4px',
  userSelect: 'none',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function FIArchitecturePage() {
  const [expandedPricing, setExpandedPricing] = useState<Record<string, boolean>>({});

  const togglePricing = (key: string) => {
    setExpandedPricing((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={pageStyle}>
      {/* ============================================================ */}
      {/*  1. HERO                                                      */}
      {/* ============================================================ */}
      <section style={heroSection}>
        <div style={heroGlow} />
        <motion.div style={{ position: 'relative', zIndex: 1 }} {...fadeUp}>
          <h1 style={heroTitle}>F&amp;I Products Architecture</h1>
          <p style={heroSubtitle}>
            Finance &amp; Insurance Products Flow Documentation | Lithia/Driveway
          </p>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  2. OVERVIEW                                                  */}
      {/* ============================================================ */}
      <section id="overview" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Overview"
            title="System Overview"
            description="How Finance & Insurance products are served to Driveway customers through the Products-API."
          />
        </motion.div>

        {/* Stats grid */}
        <motion.div style={gridCols(4)} {...fadeUp}>
          {[
            { value: '5', label: 'F&I Products', color: c.accent },
            { value: '2', label: 'Product Sources', color: c.green },
            { value: '5 min', label: 'Cron Interval', color: c.pink },
            { value: '60 days', label: 'Cache Refresh', color: c.yellow },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              style={statCardStyle(s.color)}
              {...stagger(i)}
              whileHover={{
                borderColor: s.color,
                boxShadow: `0 0 20px ${s.color}22`,
              }}
            >
              <div style={statValue(s.color)}>{s.value}</div>
              <div style={statLabel}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* What is F&I */}
        <motion.div style={{ marginTop: '2rem' }} {...fadeUp}>
          <Card title="What is F&I?" variant="blue">
            <p style={paragraph}>
              <strong style={{ color: c.text }}>Finance &amp; Insurance (F&amp;I)</strong> products
              are optional add-on coverages offered to customers during the vehicle purchase flow.
              They include service contracts, loss protection, tire &amp; wheel coverage, and
              Lithia-exclusive products like lifetime oil changes and valet service.
            </p>
            <p style={paragraph}>
              The Products-API serves these products to the UI based on vehicle details, dealer
              information, and customer payment type. Products come from two distinct sources:
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <div style={tagStyle(c.green)}>
                <span style={legendDot(c.green)} />
                LITHIA products - static pricing from MongoDB
              </div>
              <div style={tagStyle(c.purple)}>
                <span style={legendDot(c.purple)} />
                PEN/ASSURANCE products - dynamic pricing via SOAP API
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Legend */}
        <motion.div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: '1.5rem',
            padding: '1rem 1.25rem',
            background: c.surface,
            borderRadius: 12,
            border: `1px solid ${c.border}`,
          }}
          {...fadeUp}
        >
          {[
            { label: 'UI', color: c.green },
            { label: 'Products API', color: c.accent },
            { label: 'MongoDB', color: c.yellow },
            { label: 'PEN/Assurance', color: c.purple },
            { label: 'Azure Service Bus', color: c.cyan },
            { label: 'Cron Jobs', color: c.pink },
          ].map((item) => (
            <span
              key={item.label}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: c.text2 }}
            >
              <span style={legendDot(item.color)} />
              {item.label}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  3. PRODUCTS                                                  */}
      {/* ============================================================ */}
      <section id="products" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Products"
            title="The 5 F&I Products"
            description="Each product has unique sourcing, pricing rules, and availability constraints."
          />
        </motion.div>

        {/* Product cards grid - 5 columns on large, wrapping */}
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
          {...fadeUp}
        >
          {/* Lifetime Oil & Filter */}
          <motion.div style={productCardStyle} {...stagger(0)} whileHover={{ borderColor: c.green, boxShadow: `0 0 16px ${c.green}18` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: c.text }}>Lifetime Oil &amp; Filter</h4>
              <Badge label="LITHIA" color="green" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: c.green }}>$799</div>
            <p style={{ ...paragraph, margin: 0, fontSize: '0.82rem' }}>
              Static MongoDB pricing. Available for most makes/models. Excludes EVs and certain fuel types.
            </p>
          </motion.div>

          {/* Driveway Valet Service */}
          <motion.div style={productCardStyle} {...stagger(1)} whileHover={{ borderColor: c.green, boxShadow: `0 0 16px ${c.green}18` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: c.text }}>Driveway Valet Service</h4>
              <Badge label="LITHIA" color="green" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: c.green }}>$599</div>
            <p style={{ ...paragraph, margin: 0, fontSize: '0.82rem' }}>
              Static MongoDB pricing. Requires zip code validation for service area eligibility.
            </p>
          </motion.div>

          {/* Vehicle Service Contract */}
          <motion.div style={productCardStyle} {...stagger(2)} whileHover={{ borderColor: c.purple, boxShadow: `0 0 16px ${c.purple}18` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: c.text }}>Vehicle Service Contract</h4>
              <Badge label="PEN" color="purple" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: c.purple }}>Price on request</div>
            <p style={{ ...paragraph, margin: 0, fontSize: '0.82rem' }}>
              Non-FL: <span style={inlineCode}>dealerCost + $1500</span><br />
              FL: <span style={inlineCode}>retailPrice</span> (from PEN)
            </p>
          </motion.div>

          {/* Tire & Wheel Coverage */}
          <motion.div style={productCardStyle} {...stagger(3)} whileHover={{ borderColor: c.purple, boxShadow: `0 0 16px ${c.purple}18` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: c.text }}>Tire &amp; Wheel Coverage</h4>
              <Badge label="PEN" color="purple" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: c.purple }}>Price on request</div>
            <p style={{ ...paragraph, margin: 0, fontSize: '0.82rem' }}>
              Non-FL: <span style={inlineCode}>dealerCost x 2.2</span><br />
              FL: <span style={inlineCode}>retailPrice</span> (from PEN)
            </p>
          </motion.div>

          {/* Vehicle Loss Protection */}
          <motion.div style={productCardStyle} {...stagger(4)} whileHover={{ borderColor: c.purple, boxShadow: `0 0 16px ${c.purple}18` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: c.text }}>Vehicle Loss Protection</h4>
              <Badge label="PEN" color="purple" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: c.orange }}>$1,095 fixed</div>
            <p style={{ ...paragraph, margin: 0, fontSize: '0.82rem' }}>
              PEN prices fetched but overridden with a fixed amount. Availability still depends on PEN response.
            </p>
          </motion.div>
        </motion.div>

        {/* Product availability table */}
        <motion.div {...fadeUp}>
          <h3 style={subheading}>Product Availability by Payment Type</h3>
          <DataTable
            headers={['Product', 'CASH', 'FINANCE', 'LEASE', 'Not Selected']}
            rows={[
              ['Lifetime Oil & Filter', check, check, check, check],
              ['Driveway Valet Service', check, check, check, check],
              ['Vehicle Service Contract', cross, check, cross, check],
              ['Tire & Wheel Coverage', check, check, check, check],
              ['Vehicle Loss Protection', cross, check, cross, check],
            ]}
          />
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  4. ARCHITECTURE                                              */}
      {/* ============================================================ */}
      <section id="architecture" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Architecture"
            title="Products-API Architecture"
            description="Multi-module Kotlin/Spring Boot application with reactive streams and MongoDB persistence."
          />
        </motion.div>

        {/* Tech badges */}
        <motion.div
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center' }}
          {...fadeUp}
        >
          {[
            { label: 'Kotlin', color: 'purple' as const },
            { label: 'Spring Boot', color: 'green' as const },
            { label: 'Project Reactor', color: 'cyan' as const },
            { label: 'MongoDB', color: 'yellow' as const },
            { label: 'Azure Service Bus', color: 'blue' as const },
          ].map((b) => (
            <Badge key={b.label} label={b.label} color={b.color} dot />
          ))}
        </motion.div>

        {/* Module cards */}
        <motion.div style={gridCols(2, '1rem')} {...fadeUp}>
          {/* Routes Module */}
          <motion.div style={moduleCardStyle(c.accent)} {...stagger(0)}>
            <h4 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700, color: c.accent }}>
              Routes Module
            </h4>
            <p style={{ ...paragraph, margin: '0 0 0.5rem' }}>
              HTTP endpoint definitions. Receives requests and delegates to the Library module.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={inlineCode}>FIRoutes.kt</span>
              <span style={inlineCode}>FIHandler.kt</span>
            </div>
          </motion.div>

          {/* Cron Module */}
          <motion.div style={moduleCardStyle(c.pink)} {...stagger(1)}>
            <h4 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700, color: c.pink }}>
              Cron Module
            </h4>
            <p style={{ ...paragraph, margin: '0 0 0.5rem' }}>
              Scheduled background jobs for refreshing stale PEN rate data.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={inlineCode}>FIRateRefresh.kt</span>
              <span style={inlineCode}>FIRateService.kt</span>
            </div>
          </motion.div>

          {/* Inventory Delta Receiver */}
          <motion.div style={moduleCardStyle(c.cyan)} {...stagger(2)}>
            <h4 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700, color: c.cyan }}>
              Inventory Delta Receiver
            </h4>
            <p style={{ ...paragraph, margin: '0 0 0.5rem' }}>
              Azure Service Bus consumer. Processes inventory add/update/delete events.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={inlineCode}>VehicleInventoryTopicReceiver.kt</span>
            </div>
          </motion.div>

          {/* Library Module */}
          <motion.div style={moduleCardStyle(c.green)} {...stagger(3)}>
            <h4 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700, color: c.green }}>
              Library Module
            </h4>
            <p style={{ ...paragraph, margin: '0 0 0.5rem' }}>
              Shared business logic used by all other modules. Core F&amp;I service and PEN integration.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={inlineCode}>FIService.kt</span>
              <span style={inlineCode}>PenMediator.kt</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Module dependency ReactFlow diagram */}
        <motion.div style={{ marginTop: '2rem' }} {...fadeUp}>
          <ReactFlowDiagram
            nodes={fiModuleNodes}
            edges={fiModuleEdges}
            title="Module Dependency Graph"
            height="480px"
          />
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  5. DATA FLOW                                                 */}
      {/* ============================================================ */}
      <section id="data-flow" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Data Flow"
            title="Complete Data Flow"
            description="How an F&I product request travels through the system from UI to response."
          />
        </motion.div>

        {/* Visual flow diagram */}
        <motion.div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '2rem',
            background: c.surface,
            borderRadius: 14,
            border: `1px solid ${c.border}`,
            marginBottom: '1.5rem',
          }}
          {...fadeUp}
        >
          <span style={flowBoxStyle(c.green)}>UI</span>
          <span style={flowArrow}>&rarr;</span>
          <span style={flowBoxStyle(c.accent)}>GET /estimator/fi-products</span>
          <span style={flowArrow}>&rarr;</span>
          <span style={flowBoxStyle(c.accent)}>FIHandler</span>
          <span style={flowArrow}>&rarr;</span>
          <span style={flowBoxStyle(c.green)}>FIService</span>
          <span style={flowArrow}>&rarr;</span>
          <span style={{ ...flowBoxStyle(c.text3), flexDirection: 'column', padding: '8px 14px', gap: 2 }}>
            <span style={{ color: c.green, fontWeight: 600 }}>getLithiaProducts()</span>
            <span style={{ color: c.text3, fontSize: '0.72rem' }}>+</span>
            <span style={{ color: c.purple, fontWeight: 600 }}>getPenProducts()</span>
          </span>
          <span style={flowArrow}>&rarr;</span>
          <span style={flowBoxStyle(c.yellow)}>MongoDB Collections</span>
          <span style={flowArrow}>&rarr;</span>
          <span style={flowBoxStyle(c.green)}>Response</span>
        </motion.div>

        {/* Warning callout */}
        <motion.div {...fadeUp}>
          <Callout type="warning" title="Cache Miss on Estimator Path">
            When a cache miss occurs on the <strong>estimator</strong> path, the system returns
            only LITHIA products (synchronously available). PEN products are NOT fetched in
            real-time for the estimator -- they require a prior cache entry. The checkout path
            behaves differently and will fetch PEN rates on demand if the cache is empty.
          </Callout>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  6. CACHING                                                   */}
      {/* ============================================================ */}
      <section id="caching" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Caching"
            title="Caching Strategy"
            description="MongoDB-backed cache with time-based expiry and multi-source write paths."
          />
        </motion.div>

        <motion.div {...fadeUp}>
          <Tabs
            tabs={[
              {
                label: 'Cache Structure',
                content: (
                  <div>
                    <p style={paragraph}>
                      Each cached document is stored in the <span style={inlineCode}>fi-rate</span> collection
                      with the following structure:
                    </p>
                    <CodeBlock
                      language="typescript"
                      filename="CachedFIProducts.ts"
                      code={`interface CachedFIProducts {
  _id: ObjectId;
  vin: string;
  dealerId: string;
  penDealerId: string;
  storeId: string;
  state: string;
  make: string;
  model: string;
  year: number;
  fuelType: string;
  mileage: number;
  zipCode: string;

  // PEN rate data
  vscRates: PenRate[];
  tireAndWheelRates: PenRate[];
  vlpRates: PenRate[];

  // Cache metadata
  effectiveDate: ISODate;      // when rates were fetched
  nextRefreshDate: ISODate;    // when cron should re-fetch
  createdOn: ISODate;          // TTL index (365 days)
}`}
                    />
                  </div>
                ),
              },
              {
                label: 'Read Path',
                content: (
                  <div>
                    <FlowTimeline
                      steps={[
                        {
                          number: 1,
                          title: 'Lookup by VIN',
                          description: 'FIService queries fi-rate collection using the vehicle VIN as the primary lookup key.',
                          color: c.accent,
                        },
                        {
                          number: 2,
                          title: 'Check Cache Hit',
                          description: 'If a document exists and effectiveDate is within 60 days, it is a cache hit. The cached PEN rates are used directly.',
                          color: c.green,
                        },
                        {
                          number: 3,
                          title: 'Cache Hit',
                          description: 'Return cached LITHIA + PEN products with pre-computed pricing. This is the fast path.',
                          color: c.green,
                        },
                        {
                          number: 4,
                          title: 'Cache Miss (Estimator)',
                          description: 'On the estimator path, return only LITHIA products. PEN products are omitted -- no real-time SOAP call is made.',
                          color: c.yellow,
                        },
                        {
                          number: 5,
                          title: 'Cache Miss (Checkout)',
                          description: 'On the checkout path, trigger a real-time PEN SOAP call, compute pricing, cache the result, then return all products.',
                          color: c.orange,
                        },
                      ]}
                    />
                  </div>
                ),
              },
              {
                label: 'Write Path',
                content: (
                  <div>
                    <p style={paragraph}>Cache entries are written from two sources:</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={moduleCardStyle(c.cyan)}>
                        <h4 style={{ margin: '0 0 0.5rem', color: c.cyan, fontWeight: 700, fontSize: '0.95rem' }}>
                          Inventory-Delta-Receiver
                        </h4>
                        <p style={{ ...paragraph, margin: 0 }}>
                          When Odyssey publishes an ADD or UPDATE event via Azure Service Bus,
                          the delta receiver resolves the PEN dealer, fetches rates via SOAP,
                          and upserts the fi-rate document.
                        </p>
                      </div>
                      <div style={moduleCardStyle(c.pink)}>
                        <h4 style={{ margin: '0 0 0.5rem', color: c.pink, fontWeight: 700, fontSize: '0.95rem' }}>
                          FI Rate Refresh Cron
                        </h4>
                        <p style={{ ...paragraph, margin: 0 }}>
                          Every 5 minutes, the cron job queries for documents where{' '}
                          <span style={inlineCode}>nextRefreshDate &lt;= now</span>, re-fetches
                          PEN rates, and updates the cache.
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                label: 'Expiry Logic',
                content: (
                  <div>
                    <p style={paragraph}>
                      Three date fields control cache lifecycle:
                    </p>
                    <DataTable
                      headers={['Field', 'Duration', 'Purpose']}
                      rows={[
                        [
                          <span style={inlineCode}>effectiveDate</span>,
                          '60 days',
                          'Determines cache validity. If older than 60 days, treated as stale.',
                        ],
                        [
                          <span style={inlineCode}>nextRefreshDate</span>,
                          '60 days',
                          'Cron scheduling. The cron job picks up documents where this date has passed.',
                        ],
                        [
                          <span style={inlineCode}>createdOn</span>,
                          '365 days (TTL)',
                          'MongoDB TTL index. Documents are automatically deleted after 1 year.',
                        ],
                      ]}
                    />
                  </div>
                ),
              },
            ]}
          />
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  7. CRON JOBS                                                 */}
      {/* ============================================================ */}
      <section id="cron" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Cron"
            title="Cron Jobs"
            description="Background scheduled jobs that keep the fi-rate cache fresh."
          />
        </motion.div>

        {/* Cron stats */}
        <motion.div style={gridCols(4)} {...fadeUp}>
          {[
            { value: '5 min', label: 'Interval', color: c.pink },
            { value: '100', label: 'Batch Size', color: c.accent },
            { value: '500ms', label: 'Delay', color: c.cyan },
            { value: '60 days', label: 'Refresh', color: c.yellow },
          ].map((s, i) => (
            <motion.div key={s.label} style={statCardStyle(s.color)} {...stagger(i)}>
              <div style={statValue(s.color)}>{s.value}</div>
              <div style={statLabel}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* 6-step timeline */}
        <motion.div style={{ marginTop: '2rem' }} {...fadeUp}>
          <FlowTimeline
            steps={[
              {
                number: 1,
                title: 'Scheduled Trigger',
                description: 'FIRateRefresh runs on a fixed 5-minute schedule via Spring @Scheduled annotation.',
                color: c.pink,
              },
              {
                number: 2,
                title: 'Query Stale Documents',
                description: 'Queries MongoDB for fi-rate documents where nextRefreshDate <= now. Returns up to 100 documents per batch.',
                color: c.yellow,
              },
              {
                number: 3,
                title: 'Create Processing Channel',
                description: 'Creates a Reactor Sinks.Many channel and feeds stale documents into it for concurrent processing.',
                color: c.accent,
              },
              {
                number: 4,
                title: 'BulkRefreshChannelReceiver Consumes',
                description: 'Processes each document: resolves PEN dealer, calls SOAP getASBRates, computes new rates. Uses 500ms delay between calls to avoid rate limiting.',
                color: c.cyan,
              },
              {
                number: 5,
                title: 'Update nextRefreshDate',
                description: 'After successful refresh, sets nextRefreshDate to now + 60 days. Updates effectiveDate to current timestamp.',
                color: c.green,
              },
              {
                number: 6,
                title: 'Handle Failures',
                description: 'On failure, logs the error and moves to the next document. The failed document will be retried on the next cron cycle since nextRefreshDate was not updated.',
                color: c.red,
              },
            ]}
          />
        </motion.div>

        {/* Config code block */}
        <motion.div style={{ marginTop: '2rem' }} {...fadeUp}>
          <CodeBlock
            language="yaml"
            filename="application.yml"
            code={`fi-rate-refresh:
  enabled: true
  cron: "0 */5 * * * *"    # every 5 minutes
  batch-size: 100
  delay-ms: 500
  refresh-days: 60
  
  channel:
    buffer-size: 200
    concurrency: 1`}
          />
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  8. AZURE SERVICE BUS                                         */}
      {/* ============================================================ */}
      <section id="azure" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Azure"
            title="Azure Service Bus Integration"
            description="Inventory delta events from Odyssey trigger cache creation and invalidation."
          />
        </motion.div>

        <motion.div {...fadeUp}>
          <Card title="Inventory Delta Receiver" variant="cyan">
            <p style={paragraph}>
              The <span style={inlineCode}>VehicleInventoryTopicReceiver</span> subscribes to the
              Azure Service Bus inventory topic. When Odyssey publishes inventory changes, the
              receiver processes them to keep the fi-rate cache in sync.
            </p>
          </Card>
        </motion.div>

        {/* Message actions table */}
        <motion.div style={{ marginTop: '1.5rem' }} {...fadeUp}>
          <DataTable
            headers={['Action', 'Trigger Condition', 'Cache Operation']}
            rows={[
              [
                <Badge label="ADD" color="green" />,
                'New vehicle added to inventory',
                'Resolve PEN dealer, fetch rates via SOAP, create fi-rate document',
              ],
              [
                <Badge label="UPDATE" color="blue" />,
                'Vehicle details changed (price, mileage, etc.)',
                'Re-fetch PEN rates with updated vehicle data, upsert fi-rate document',
              ],
              [
                <Badge label="DELETE" color="red" />,
                'Vehicle removed from inventory',
                'Delete the corresponding fi-rate document from MongoDB',
              ],
            ]}
          />
        </motion.div>

        {/* Code blocks */}
        <motion.div style={{ marginTop: '1.5rem' }} {...fadeUp}>
          <CodeBlock
            language="json"
            filename="InventoryVehicle (ASB Message)"
            code={`{
  "action": "ADD",
  "vehicle": {
    "vin": "1HGCG5655WA041389",
    "dealerId": "12345",
    "storeId": "678",
    "make": "Honda",
    "model": "Accord",
    "year": 2023,
    "mileage": 15000,
    "fuelType": "GASOLINE",
    "state": "OR",
    "zipCode": "97201",
    "listPrice": 3200000
  }
}`}
          />
        </motion.div>

        <motion.div style={{ marginTop: '1.5rem' }} {...fadeUp}>
          <CodeBlock
            language="yaml"
            filename="Azure Service Bus Config"
            code={`spring:
  cloud:
    azure:
      servicebus:
        connection-string: \${AZURE_SERVICEBUS_CONNECTION_STRING}
        
inventory-delta:
  topic-name: vehicle-inventory-delta
  subscription-name: products-api-sub
  max-concurrent-calls: 5
  auto-complete: false`}
          />
        </motion.div>

        <motion.div style={{ marginTop: '1.5rem' }} {...fadeUp}>
          <Callout type="danger" title="Dead Letter Queue">
            Messages that fail processing after maximum retry attempts are moved to the
            dead letter queue. Monitor the DLQ for persistent failures -- these typically
            indicate PEN API outages or invalid vehicle data that cannot be resolved.
          </Callout>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  9. PRICING LOGIC                                             */}
      {/* ============================================================ */}
      <section id="pricing" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Pricing"
            title="Pricing Logic"
            description="Each product has unique pricing rules based on source, state, and configuration."
          />
        </motion.div>

        {/* Collapsible sections */}
        {[
          {
            key: 'lof',
            title: 'Lifetime Oil & Filter (LOF)',
            color: c.green,
            content: (
              <div>
                <p style={paragraph}>
                  <strong style={{ color: c.text }}>Source:</strong> MongoDB static pricing from{' '}
                  <span style={inlineCode}>fi-product-v2</span> collection.
                </p>
                <p style={paragraph}>
                  <strong style={{ color: c.text }}>Pricing:</strong> Fixed price stored in MongoDB. Currently <strong style={{ color: c.green }}>$799</strong>.
                </p>
                <p style={paragraph}>
                  <strong style={{ color: c.text }}>Availability Filters:</strong>
                </p>
                <ul style={{ ...paragraph, paddingLeft: '1.5rem' }}>
                  <li>State must be in allowed states list</li>
                  <li>Make must not be in excluded makes list</li>
                  <li>Fuel type must not be ELECTRIC or HYDROGEN</li>
                </ul>
              </div>
            ),
          },
          {
            key: 'valet',
            title: 'Driveway Valet Service',
            color: c.green,
            content: (
              <div>
                <p style={paragraph}>
                  <strong style={{ color: c.text }}>Source:</strong> MongoDB static pricing from{' '}
                  <span style={inlineCode}>fi-product-v2</span> collection.
                </p>
                <p style={paragraph}>
                  <strong style={{ color: c.text }}>Pricing:</strong> Fixed price stored in MongoDB. Currently <strong style={{ color: c.green }}>$599</strong>.
                </p>
                <p style={paragraph}>
                  <strong style={{ color: c.text }}>Availability Filters:</strong> Requires zip code validation.
                  The customer's zip code must be within the Driveway valet service coverage area.
                </p>
              </div>
            ),
          },
          {
            key: 'vsc',
            title: 'Vehicle Service Contract (VSC)',
            color: c.purple,
            content: (
              <div>
                <p style={paragraph}>
                  <strong style={{ color: c.text }}>Source:</strong> PEN/Assurant SOAP API via{' '}
                  <span style={inlineCode}>getASBRates</span>.
                </p>
                <p style={paragraph}>
                  <strong style={{ color: c.text }}>Pricing Formula:</strong>
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ ...moduleCardStyle(c.accent), padding: '1rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: c.accent, marginBottom: '0.5rem' }}>Non-Florida</div>
                    <code style={{ fontSize: '0.9rem', color: c.text }}>dealerCost + 150000</code>
                    <p style={{ ...paragraph, margin: '0.5rem 0 0', fontSize: '0.78rem' }}>
                      (amounts in cents -- $1,500 markup)
                    </p>
                  </div>
                  <div style={{ ...moduleCardStyle(c.orange), padding: '1rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: c.orange, marginBottom: '0.5rem' }}>Florida</div>
                    <code style={{ fontSize: '0.9rem', color: c.text }}>retailPrice</code>
                    <p style={{ ...paragraph, margin: '0.5rem 0 0', fontSize: '0.78rem' }}>
                      Uses PEN's retail price directly (regulatory requirement)
                    </p>
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: 'tw',
            title: 'Tire & Wheel Coverage (T&W)',
            color: c.purple,
            content: (
              <div>
                <p style={paragraph}>
                  <strong style={{ color: c.text }}>Source:</strong> PEN/Assurant SOAP API via{' '}
                  <span style={inlineCode}>getASBRates</span>.
                </p>
                <p style={paragraph}>
                  <strong style={{ color: c.text }}>Pricing Formula:</strong>
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ ...moduleCardStyle(c.accent), padding: '1rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: c.accent, marginBottom: '0.5rem' }}>Non-Florida</div>
                    <code style={{ fontSize: '0.9rem', color: c.text }}>dealerCost x 2.2</code>
                    <p style={{ ...paragraph, margin: '0.5rem 0 0', fontSize: '0.78rem' }}>
                      2.2x multiplier on PEN dealer cost
                    </p>
                  </div>
                  <div style={{ ...moduleCardStyle(c.orange), padding: '1rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: c.orange, marginBottom: '0.5rem' }}>Florida</div>
                    <code style={{ fontSize: '0.9rem', color: c.text }}>retailPrice</code>
                    <p style={{ ...paragraph, margin: '0.5rem 0 0', fontSize: '0.78rem' }}>
                      Uses PEN's retail price directly (regulatory requirement)
                    </p>
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: 'vlp',
            title: 'Vehicle Loss Protection (VLP)',
            color: c.orange,
            content: (
              <div>
                <p style={paragraph}>
                  <strong style={{ color: c.text }}>Source:</strong> PEN/Assurant SOAP API (for availability check),
                  but price is <strong style={{ color: c.orange }}>overridden</strong>.
                </p>
                <p style={paragraph}>
                  <strong style={{ color: c.text }}>Pricing:</strong> Fixed at{' '}
                  <strong style={{ color: c.orange }}>$1,095</strong> (109500 cents) regardless of PEN response.
                  The SOAP call is still made to verify product availability for the vehicle, but the returned
                  price is discarded.
                </p>
              </div>
            ),
          },
        ].map((item, idx) => (
          <motion.div key={item.key} style={{ marginBottom: '0.75rem' }} {...stagger(idx)}>
            <div
              onClick={() => togglePricing(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem 1.25rem',
                background: c.surface,
                border: `1px solid ${c.border}`,
                borderRadius: expandedPricing[item.key] ? '12px 12px 0 0' : 12,
                cursor: 'pointer',
                transition: 'border-color 0.25s',
                borderLeft: `4px solid ${item.color}`,
              }}
            >
              <span style={chevron(!!expandedPricing[item.key])}>&#9654;</span>
              <span style={{ fontWeight: 700, color: c.text, fontSize: '0.95rem' }}>
                {item.title}
              </span>
            </div>
            {expandedPricing[item.key] && (
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  background: c.surface2,
                  border: `1px solid ${c.border}`,
                  borderTop: 'none',
                  borderRadius: '0 0 12px 12px',
                  borderLeft: `4px solid ${item.color}`,
                }}
              >
                {item.content}
              </div>
            )}
          </motion.div>
        ))}
      </section>

      {/* ============================================================ */}
      {/*  10. ADMIN ENDPOINTS                                          */}
      {/* ============================================================ */}
      <section id="admin" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Admin"
            title="Admin / Test Endpoints"
            description="Endpoints for manual cache operations and debugging."
          />
        </motion.div>

        <motion.div {...fadeUp}>
          <Card title="Force Refresh Endpoint" variant="yellow">
            <div style={{ marginBottom: '1rem' }}>
              <span style={tagStyle(c.yellow)}>GET</span>
              <code style={{ marginLeft: '0.75rem', fontSize: '0.9rem', color: c.text }}>
                /test/fi-Rate/update-cached-markup
              </code>
            </div>
            <p style={paragraph}>
              Triggers a forced refresh of cached F&amp;I markup data. Use this endpoint when:
            </p>
            <ul style={{ ...paragraph, paddingLeft: '1.5rem' }}>
              <li>Markup configuration has been changed in <span style={inlineCode}>application.yml</span></li>
              <li>PEN rate data appears stale or incorrect</li>
              <li>Debugging pricing discrepancies between environments</li>
              <li>After a deployment that changes pricing logic</li>
            </ul>
            <Callout type="info" title="Note">
              This endpoint is for development and testing. In production, cache refresh is
              handled automatically by the cron job and inventory delta receiver.
            </Callout>
          </Card>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  11. DATABASE                                                 */}
      {/* ============================================================ */}
      <section id="database" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Database"
            title="Database Collections"
            description="MongoDB collections that support the F&I products system."
          />
        </motion.div>

        <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} {...fadeUp}>
          <Card title="fi-rate" variant="yellow">
            <p style={paragraph}>
              Primary cache collection. Stores PEN rate data keyed by VIN. Each document contains
              the full set of VSC, Tire &amp; Wheel, and VLP rates returned from PEN, along with
              vehicle metadata and cache timestamps.
            </p>
            <p style={{ ...paragraph, margin: 0 }}>
              <strong style={{ color: c.text }}>Indexes:</strong>{' '}
              <span style={inlineCode}>vin</span> (unique),{' '}
              <span style={inlineCode}>nextRefreshDate</span> (for cron queries),{' '}
              <span style={inlineCode}>createdOn</span> (TTL: 365 days)
            </p>
          </Card>

          <Card title="fi-product-v2" variant="green">
            <p style={paragraph}>
              LITHIA product definitions. Stores static product configurations including
              pricing, availability rules (allowed states, excluded makes, fuel type filters),
              and product metadata. These are manually managed -- not synced from an external source.
            </p>
          </Card>

          <Card title="pen-dealer-v2" variant="purple">
            <p style={paragraph}>
              PEN dealer mapping collection. Maps Lithia dealer IDs to PEN dealer IDs. Required
              for making SOAP calls to PEN, as their API uses their own dealer identifier.
              Populated during onboarding and updated as dealer relationships change.
            </p>
          </Card>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  12. CONFIGURATION                                            */}
      {/* ============================================================ */}
      <section id="config" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Config"
            title="Configuration"
            description="Key application.yml settings that control F&I product pricing."
          />
        </motion.div>

        <motion.div {...fadeUp}>
          <CodeBlock
            language="yaml"
            filename="application.yml - Markup Configuration"
            showLineNumbers
            code={`products:
  cost:
    vehicle-service-contract:
      # Added to dealerCost for non-FL states (in cents)
      markup-amount: 150000          # $1,500.00

    vehicle-loss-protection:
      # Fixed retail price override (in cents)
      fixed-amount: 109500           # $1,095.00

    tire-and-wheel:
      # Multiplied by dealerCost for non-FL states
      markup-multiplier: 2.2         # 2.2x dealer cost`}
          />
        </motion.div>

        <motion.div style={{ marginTop: '1.5rem' }} {...fadeUp}>
          <Callout type="info" title="All amounts in cents">
            PEN returns prices in cents (integer). The markup-amount of 150000 equals $1,500.00.
            The fixed-amount of 109500 equals $1,095.00. The UI divides by 100 for display.
          </Callout>
        </motion.div>
      </section>
    </div>
  );
}
