import React from 'react';
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

import ReactFlowDiagram from '../components/diagrams/ReactFlowDiagram';
import SectionHeader from '../components/shared/SectionHeader';
import Card from '../components/shared/Card';
import DataTable from '../components/shared/DataTable';
import Callout from '../components/shared/Callout';
import CodeBlock from '../components/shared/CodeBlock';

import {
  nodes as fullSyncNodes,
  edges as fullSyncEdges,
} from '../diagrams/fullSyncFlow';
import {
  nodes as decisionTreeNodes,
  edges as decisionTreeEdges,
} from '../diagrams/fiRateDecisionTree';
import {
  nodes as syncPipelineNodes,
  edges as syncPipelineEdges,
} from '../diagrams/inventorySyncPipeline';

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
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const pageWrapper: CSSProperties = {
  padding: '0 0 4rem 0',
  color: c.text,
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
    'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.08) 40%, transparent 70%)',
  pointerEvents: 'none',
  zIndex: 0,
};

const heroContent: CSSProperties = {
  position: 'relative',
  zIndex: 1,
};

const heroTitle: CSSProperties = {
  fontSize: 'clamp(1.75rem, 5vw, 3.2rem)',
  fontWeight: 800,
  lineHeight: 1.15,
  margin: '0 0 1.25rem',
  letterSpacing: '-0.03em',
  background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const heroSubtitle: CSSProperties = {
  fontSize: '1.1rem',
  color: c.text2,
  maxWidth: 640,
  margin: '0 auto',
  lineHeight: 1.75,
};

const sectionSpacing: CSSProperties = {
  marginTop: '4rem',
};

const cardGrid2: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
  gap: '1.25rem',
};

const cardGrid3: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
  gap: '1.25rem',
};

const cardGrid4: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
  gap: '1.25rem',
};

const stageCardGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
  gap: '1rem',
  marginTop: '2rem',
};

const stepNumber: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: '50%',
  fontSize: '0.8rem',
  fontWeight: 700,
  marginBottom: '0.5rem',
  flexShrink: 0,
};

const itemText: CSSProperties = {
  fontSize: '0.88rem',
  color: c.text2,
  lineHeight: 1.65,
};

const itemTitle: CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 600,
  color: c.text,
  marginBottom: '0.35rem',
};

const bulletList: CSSProperties = {
  margin: '0.5rem 0 0 0',
  paddingLeft: '1.2rem',
  fontSize: '0.88rem',
  color: c.text2,
  lineHeight: 1.75,
};

/* ------------------------------------------------------------------ */
/*  Stage data for the full sync explanation                           */
/* ------------------------------------------------------------------ */
const fullSyncStages = [
  {
    num: 1,
    title: 'EDS Import',
    color: c.orange,
    text: 'External Data Source feeds raw dealer inventory into Odyssey via scheduled import batches.',
  },
  {
    num: 2,
    title: 'Odyssey Inventory',
    color: c.cyan,
    text: 'Odyssey normalises the feed, stores canonical vehicle records, and indexes data for search.',
  },
  {
    num: 3,
    title: 'Azure Service Bus',
    color: c.accent,
    text: 'Odyssey publishes ADD / UPDATE / DELETE delta events to an ASB topic for downstream consumers.',
  },
  {
    num: 4,
    title: 'Delta Receiver',
    color: c.accent,
    text: 'inventory-delta-receiver subscribes to ASB, deserialises the event, and triggers the rate pipeline.',
  },
  {
    num: 5,
    title: 'PEN / fi-rate Cache',
    color: c.purple,
    text: 'The receiver calls PEN/Assurant SOAP for rate coverages and upserts a fi-rate document in MongoDB.',
  },
  {
    num: 6,
    title: 'UI Layer',
    color: c.green,
    text: 'Shop/SRP and VDP pages call Products-Api which reads from the fi-rate cache to return product estimates.',
  },
];

/* ------------------------------------------------------------------ */
/*  Decision tree explanations                                         */
/* ------------------------------------------------------------------ */
const decisionPoints = [
  {
    num: 1,
    title: 'Publishes to ASB?',
    color: c.yellow,
    text: 'If Odyssey does not publish the event (misconfigured topic, DEV environment), the vehicle never enters the pipeline.',
  },
  {
    num: 2,
    title: 'Delta Receiver Gets Message?',
    color: c.yellow,
    text: 'The message could be lost due to deserialization errors, dead-letter queue overflow, or subscription filter mismatch.',
  },
  {
    num: 3,
    title: 'VIN in UPDATE_ERROR?',
    color: c.red,
    text: 'If the VIN has been marked UPDATE_ERROR after 3 consecutive failures, the receiver permanently skips it.',
  },
  {
    num: 4,
    title: 'PENDealer Exists?',
    color: c.purple,
    text: 'The receiver must resolve a PENDealerId for the vehicle\'s state. If no mapping exists, all rates are set to null.',
  },
  {
    num: 5,
    title: 'Valid Coverages?',
    color: c.green,
    text: 'PEN must return at least one non-empty coverage. Otherwise, the document is saved with rateExist = false.',
  },
];

/* ------------------------------------------------------------------ */
/*  Sync pipeline step explanations                                    */
/* ------------------------------------------------------------------ */
const pipelineSteps = [
  {
    num: 1,
    title: 'Odyssey Publishes to ASB',
    color: c.cyan,
    text: 'When inventory is added or updated in Odyssey, a delta message is pushed to the Azure Service Bus topic.',
  },
  {
    num: 2,
    title: 'Delta Receiver Picks Up',
    color: c.accent,
    text: 'The inventory-delta-receiver service subscribes to the ASB subscription and deserialises the incoming message.',
  },
  {
    num: 3,
    title: 'PEN Dealer Lookup',
    color: c.purple,
    text: 'The receiver resolves the PENDealerId by matching the vehicle\'s dealer state against the PENDealer collection.',
  },
  {
    num: 4,
    title: 'PEN/Assurant SOAP Call',
    color: c.cyan,
    text: 'A SOAP getASBRates request is sent to PEN/Assurant for VSC, VLP, and Tire & Wheel coverages.',
  },
  {
    num: 5,
    title: 'fi-rate Document Created',
    color: c.green,
    text: 'The rate response is normalised and upserted into the fi-rate MongoDB collection with status ACTIVE.',
  },
  {
    num: 6,
    title: 'Cron Refreshes',
    color: c.yellow,
    text: 'Every 5 minutes, a cron job queries for stale fi-rate documents and re-fetches rates from PEN to keep them fresh.',
  },
];

/* ------------------------------------------------------------------ */
/*  DEV vs PROD table data                                             */
/* ------------------------------------------------------------------ */
const devVsProdHeaders = ['Factor', 'PROD', 'DEV', 'Impact'];

const devVsProdRows: (string | React.ReactNode)[][] = [
  [
    'ASB Topic',
    <span style={{ color: c.green }}>Production publishes actively</span>,
    <span style={{ color: c.red }}>DEV may not publish</span>,
    'Delta receiver never fires',
  ],
  [
    'PEN API',
    <span style={{ color: c.green }}>Production endpoint</span>,
    <span style={{ color: c.yellow }}>PEN Staging</span>,
    'Fewer dealers configured',
  ],
  [
    'Rate Limiter',
    <span style={{ color: c.green }}>1 call / 50ms</span>,
    <span style={{ color: c.yellow }}>1 call / 100ms</span>,
    'More timeouts',
  ],
  [
    'Cron Receiver Delay',
    <span style={{ color: c.green }}>500ms</span>,
    <span style={{ color: c.yellow }}>1000ms</span>,
    'Twice as long',
  ],
  [
    'fi-rate Collection Size',
    <span style={{ color: c.green }}>~467K docs</span>,
    <span style={{ color: c.red }}>Much smaller</span>,
    'Fewer vehicles processed',
  ],
  [
    'Inventory Freshness',
    <span style={{ color: c.green }}>Real-time deltas</span>,
    <span style={{ color: c.red }}>Stale or missing</span>,
    'SRP shows unknown cars',
  ],
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function SyncFlowsPage() {
  return (
    <div style={pageWrapper}>
      {/* ============================================================ */}
      {/*  1. HERO                                                      */}
      {/* ============================================================ */}
      <section style={heroSection}>
        <div style={heroGradientBg} />
        <motion.div style={heroContent} {...fadeUp}>
          <h1 style={heroTitle}>System Sync Flows</h1>
          <p style={heroSubtitle}>
            Cross-cutting diagrams showing how data flows between Odyssey,
            Products-Api, and the UI layer.
          </p>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  2. FULL SYSTEM SYNC                                          */}
      {/* ============================================================ */}
      <motion.section id="full-sync" style={sectionSpacing} {...fadeUp}>
        <SectionHeader
          label="Centerpiece"
          title="Full System Sync — EDS to UI"
          description="The complete data pipeline from EDS import through Odyssey inventory, Azure Service Bus, Products-Api fi-rate cache, and finally to the UI."
        />

        <ReactFlowDiagram
          nodes={fullSyncNodes}
          edges={fullSyncEdges}
          title="Full System Sync — EDS to UI"
          height="700px"
        />

        <div style={stageCardGrid}>
          {fullSyncStages.map((stage, i) => (
            <motion.div key={stage.num} {...stagger(i)}>
              <Card title={stage.title}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      ...stepNumber,
                      background: `${stage.color}20`,
                      color: stage.color,
                      border: `1px solid ${stage.color}40`,
                    }}
                  >
                    {stage.num}
                  </div>
                  <p style={itemText}>{stage.text}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  3. TWO SEPARATE PIPELINES                                    */}
      {/* ============================================================ */}
      <motion.section id="two-pipelines" style={sectionSpacing} {...fadeUp}>
        <SectionHeader
          label="Architecture"
          title="Two Separate Worlds"
          description="The shop pipeline and the fi-rate pipeline are completely independent systems that happen to share inventory data."
        />

        <div style={cardGrid2}>
          <motion.div {...stagger(0)}>
            <Card
              title="Pipeline 1 — Shop / SRP"
              variant="cyan"
              borderLeftColor={c.cyan}
            >
              <p style={itemText}>
                Odyssey powers the SRP via{' '}
                <strong style={{ color: c.text }}>
                  odyssey-search-graphql
                </strong>
                . When a user browses used cars, the UI queries the GraphQL
                gateway which reads directly from Odyssey&apos;s indexed
                inventory. Products-Api has{' '}
                <strong style={{ color: c.cyan }}>zero involvement</strong>{' '}
                here.
              </p>
            </Card>
          </motion.div>

          <motion.div {...stagger(1)}>
            <Card
              title="Pipeline 2 — fi-rate Cache"
              variant="green"
              borderLeftColor={c.green}
            >
              <p style={itemText}>
                Products-Api builds the fi-rate cache independently. This
                requires three things to succeed:
              </p>
              <ul style={bulletList}>
                <li>
                  <strong style={{ color: c.text }}>ASB message</strong> from
                  Odyssey
                </li>
                <li>
                  <strong style={{ color: c.text }}>
                    inventory-delta-receiver
                  </strong>{' '}
                  to process it
                </li>
                <li>
                  <strong style={{ color: c.text }}>PEN rates</strong> returned
                  successfully
                </li>
              </ul>
              <p style={{ ...itemText, marginTop: '0.5rem' }}>
                All three must succeed for a vehicle to have fi-rate products.
              </p>
            </Card>
          </motion.div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <Callout type="warning" title="Key Insight">
            A vehicle can show on the shop page regardless of whether
            Products-Api has ever seen it. The SRP is powered entirely by
            Odyssey. A vehicle with no fi-rate entry will simply render without
            F&amp;I product estimates.
          </Callout>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  4. FI-RATE DECISION TREE                                     */}
      {/* ============================================================ */}
      <motion.section id="decision-tree" style={sectionSpacing} {...fadeUp}>
        <SectionHeader
          label="Decision Flow"
          title="Will a Vehicle Get fi-rate Products?"
          description="Each vehicle must pass through five checkpoints before a usable fi-rate document exists in the cache."
        />

        <ReactFlowDiagram
          nodes={decisionTreeNodes}
          edges={decisionTreeEdges}
          title="fi-rate Decision Tree"
          height="620px"
        />

        <div style={{ ...stageCardGrid, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))' }}>
          {decisionPoints.map((dp, i) => (
            <motion.div key={dp.num} {...stagger(i)}>
              <Card>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      ...stepNumber,
                      background: `${dp.color}20`,
                      color: dp.color,
                      border: `1px solid ${dp.color}40`,
                    }}
                  >
                    {dp.num}
                  </div>
                  <div>
                    <div style={itemTitle}>{dp.title}</div>
                    <p style={itemText}>{dp.text}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  5. UPDATE_ERROR DEEP DIVE                                    */}
      {/* ============================================================ */}
      <motion.section id="update-error" style={sectionSpacing} {...fadeUp}>
        <SectionHeader
          label="Danger Zone"
          title="The UPDATE_ERROR Death Spiral"
          description="Once a VIN is marked UPDATE_ERROR, it is permanently excluded from the fi-rate pipeline unless manually fixed."
        />

        <Callout type="danger" title="Permanent Exclusion">
          When a VIN accumulates 3 consecutive processing failures, its status
          is set to <strong>UPDATE_ERROR</strong>. This is a terminal state:
          the VIN will be skipped by all future pipeline runs. No automatic
          recovery mechanism exists.
        </Callout>

        <div
          style={{
            ...cardGrid3,
            marginTop: '1.5rem',
          }}
        >
          <motion.div {...stagger(0)}>
            <Card
              title="How It Happens"
              variant="red"
              borderLeftColor={c.red}
            >
              <p style={itemText}>
                Each time a PEN SOAP call fails for a VIN, a failure counter
                increments. After{' '}
                <strong style={{ color: c.red }}>3 consecutive failures</strong>
                , the status flips to UPDATE_ERROR.
              </p>
              <p style={{ ...itemText, marginTop: '0.5rem' }}>
                Common causes: PEN timeout, invalid vehicle data, missing
                PENDealer mapping, or malformed SOAP response.
              </p>
            </Card>
          </motion.div>

          <motion.div {...stagger(1)}>
            <Card
              title="What Gets Excluded"
              variant="orange"
              borderLeftColor={c.orange}
            >
              <ul style={bulletList}>
                <li>
                  <strong style={{ color: c.text }}>Cron job</strong> skips the
                  VIN entirely
                </li>
                <li>
                  <strong style={{ color: c.text }}>Future ADD events</strong>{' '}
                  from ASB are ignored
                </li>
                <li>
                  <strong style={{ color: c.text }}>UPDATE events</strong>{' '}
                  without material change are ignored
                </li>
              </ul>
            </Card>
          </motion.div>

          <motion.div {...stagger(2)}>
            <Card
              title="The Only Fix"
              variant="green"
              borderLeftColor={c.green}
            >
              <p style={itemText}>
                There is no self-healing mechanism. To recover a VIN:
              </p>
              <ul style={bulletList}>
                <li>
                  Manually update the MongoDB document to reset{' '}
                  <code style={{ color: c.cyan }}>status</code> and{' '}
                  <code style={{ color: c.cyan }}>failureCount</code>
                </li>
                <li>
                  Use the admin endpoint to force a re-process
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  6. DEV VS PROD                                               */}
      {/* ============================================================ */}
      <motion.section id="dev-vs-prod" style={sectionSpacing} {...fadeUp}>
        <SectionHeader
          label="Environment Comparison"
          title="DEV vs PROD — Why the Gap Is Wider in DEV"
          description="Multiple configuration differences compound to create a much smaller and staler fi-rate collection in development."
        />

        <DataTable
          headers={devVsProdHeaders}
          rows={devVsProdRows}
          highlightColumn={3}
        />
      </motion.section>

      {/* ============================================================ */}
      {/*  7. HOW TO TEST                                               */}
      {/* ============================================================ */}
      <motion.section id="how-to-test" style={sectionSpacing} {...fadeUp}>
        <SectionHeader
          label="Workarounds"
          title="How To Test in DEV (Workaround)"
          description="Three practical approaches to validate fi-rate behaviour when the DEV pipeline has gaps."
        />

        <div style={cardGrid3}>
          <motion.div {...stagger(0)}>
            <Card
              title="Option 1: Start from SRP"
              variant="cyan"
              borderLeftColor={c.cyan}
            >
              <p style={itemText}>
                Browse used cars on the DEV SRP. Click into a VDP and watch the
                Network tab for the{' '}
                <code style={{ color: c.cyan }}>fi-products</code> request.
              </p>
              <p style={{ ...itemText, marginTop: '0.5rem' }}>
                If the vehicle has a fi-rate entry, you will see product
                estimates in the response. If not, the response will indicate no
                products available.
              </p>
            </Card>
          </motion.div>

          <motion.div {...stagger(1)}>
            <Card
              title="Option 2: Query fi-rate First"
              variant="green"
              borderLeftColor={c.green}
            >
              <p style={itemText}>
                Use MongoDB Compass to find a vehicle that has rates:
              </p>
              <div style={{ marginTop: '0.75rem' }}>
                <CodeBlock
                  code={`db.getCollection("fi-rate").findOne({
  status: "ACTIVE",
  "vscProduct.rateExist": true
})`}
                  language="javascript"
                  filename="MongoDB Compass"
                />
              </div>
              <p style={{ ...itemText, marginTop: '0.75rem' }}>
                Copy the VIN from the result and search for it on the SRP to
                validate the full end-to-end flow.
              </p>
            </Card>
          </motion.div>

          <motion.div {...stagger(2)}>
            <Card
              title="Option 3: Force via Admin Endpoint"
              variant="purple"
              borderLeftColor={c.purple}
            >
              <p style={itemText}>
                Trigger a manual PEN call using the admin test endpoint:
              </p>
              <div style={{ marginTop: '0.75rem' }}>
                <CodeBlock
                  code="GET /test/fi-Rate/update-cached-markup"
                  language="http"
                  filename="Admin Endpoint"
                />
              </div>
              <p style={{ ...itemText, marginTop: '0.75rem' }}>
                This bypasses the ASB pipeline and forces Products-Api to call
                PEN directly for the specified vehicle, updating the fi-rate
                cache.
              </p>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  8. INVENTORY SYNC PIPELINE                                   */}
      {/* ============================================================ */}
      <motion.section id="sync-pipeline" style={sectionSpacing} {...fadeUp}>
        <SectionHeader
          label="Step by Step"
          title="The Sync Pipeline — Step by Step"
          description="A linear view of how a single inventory event flows from Odyssey into the fi-rate cache."
        />

        <ReactFlowDiagram
          nodes={syncPipelineNodes}
          edges={syncPipelineEdges}
          title="Inventory Sync Pipeline"
          height="580px"
        />

        <div style={stageCardGrid}>
          {pipelineSteps.map((step, i) => (
            <motion.div key={step.num} {...stagger(i)}>
              <Card>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      ...stepNumber,
                      background: `${step.color}20`,
                      color: step.color,
                      border: `1px solid ${step.color}40`,
                    }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <div style={itemTitle}>{step.title}</div>
                    <p style={itemText}>{step.text}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  9. WHY DEV HAS GAPS                                          */}
      {/* ============================================================ */}
      <motion.section id="dev-gaps" style={sectionSpacing} {...fadeUp}>
        <SectionHeader
          label="Root Causes"
          title="Root Causes for Missing fi-rate Entries"
          description="Four categories of failure explain why a vehicle may not have a usable fi-rate document in DEV."
        />

        <div style={cardGrid4}>
          <motion.div {...stagger(0)}>
            <Card
              title="A — ASB Message Never Arrives"
              variant="red"
              borderLeftColor={c.red}
            >
              <ul style={bulletList}>
                <li>
                  <strong style={{ color: c.text }}>A1</strong> — Odyssey
                  doesn&apos;t publish to ASB in this environment
                </li>
                <li>
                  <strong style={{ color: c.text }}>A2</strong> — ASB topic or
                  subscription is misconfigured
                </li>
                <li>
                  <strong style={{ color: c.text }}>A3</strong> —
                  Deserialization fails (schema mismatch, corrupt payload)
                </li>
              </ul>
            </Card>
          </motion.div>

          <motion.div {...stagger(1)}>
            <Card
              title="B — Message Arrives but Vehicle Skipped"
              variant="orange"
              borderLeftColor={c.orange}
            >
              <ul style={bulletList}>
                <li>
                  <strong style={{ color: c.text }}>B1</strong> — VIN already
                  has status ACTIVE (duplicate ADD)
                </li>
                <li>
                  <strong style={{ color: c.text }}>B2</strong> — VIN is in
                  UPDATE_ERROR status (permanently skipped)
                </li>
                <li>
                  <strong style={{ color: c.text }}>B3</strong> — UPDATE event
                  with no material change (no-op)
                </li>
              </ul>
            </Card>
          </motion.div>

          <motion.div {...stagger(2)}>
            <Card
              title="C — PEN API Call Fails"
              variant="yellow"
              borderLeftColor={c.yellow}
            >
              <ul style={bulletList}>
                <li>
                  <strong style={{ color: c.text }}>C1</strong> — No PENDealer
                  mapping for the vehicle&apos;s state
                </li>
                <li>
                  <strong style={{ color: c.text }}>C2</strong> — PEN staging
                  endpoint returns errors
                </li>
                <li>
                  <strong style={{ color: c.text }}>C3</strong> — SOAP call
                  times out (rate limiter, network)
                </li>
                <li>
                  <strong style={{ color: c.text }}>C4</strong> — PEN returns
                  empty coverages for the vehicle
                </li>
                <li>
                  <strong style={{ color: c.text }}>C5</strong> — All attempts
                  fail, leading to UPDATE_ERROR
                </li>
              </ul>
            </Card>
          </motion.div>

          <motion.div {...stagger(3)}>
            <Card
              title="D — Document Exists but Unusable"
              variant="purple"
              borderLeftColor={c.purple}
            >
              <ul style={bulletList}>
                <li>
                  <strong style={{ color: c.text }}>D1</strong> —{' '}
                  <code style={{ color: c.purple }}>effectiveDate</code> has
                  expired (stale rates)
                </li>
                <li>
                  <strong style={{ color: c.text }}>D2</strong> — Status is
                  DELETED (vehicle removed from inventory)
                </li>
                <li>
                  <strong style={{ color: c.text }}>D3</strong> — All{' '}
                  <code style={{ color: c.purple }}>rateExist</code> fields are{' '}
                  <code style={{ color: c.red }}>false</code> (PEN returned no
                  valid coverages)
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
