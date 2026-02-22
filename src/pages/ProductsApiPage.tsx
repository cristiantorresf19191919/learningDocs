import React, { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

/* ---------- shared components ---------- */
import SectionHeader from '../components/shared/SectionHeader';
import Card from '../components/shared/Card';
import Badge from '../components/shared/Badge';
import CodeBlock from '../components/shared/CodeBlock';
import FlowTimeline from '../components/shared/FlowTimeline';
import DataTable from '../components/shared/DataTable';
import Callout from '../components/shared/Callout';
import HeroBanner from '../components/shared/HeroBanner';

/* ---------- diagram data ---------- */
import {
  nodes as archNodes,
  edges as archEdges,
} from '../diagrams/productsArchitecture';
import {
  nodes as liveNodes,
  edges as liveEdges,
  applyFlowFilter,
} from '../diagrams/productsLiveFlow';
import type { FlowName } from '../diagrams/productsLiveFlow';

/* ---------- lazy-loaded heavy components ---------- */
const ReactFlowDiagram = lazy(
  () => import('../components/diagrams/ReactFlowDiagram')
);
const MermaidViewer = lazy(
  () => import('../components/diagrams/MermaidViewer')
);
const PriceCalculator = lazy(
  () => import('../components/interactive/PriceCalculator')
);

/* ================================================================== */
/*  Design tokens                                                      */
/* ================================================================== */
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

/* ================================================================== */
/*  Shared animation presets                                           */
/* ================================================================== */
const fadeUp = {
  initial: { opacity: 0, y: 32 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, amount: 0.15 } as const,
  transition: { duration: 0.55, ease: 'easeOut' } as const,
};

/* ================================================================== */
/*  Shared styles                                                      */
/* ================================================================== */
const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  color: c.text,
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const sectionStyle: React.CSSProperties = {
  padding: '64px 32px',
  maxWidth: '1200px',
  marginLeft: 'auto',
  marginRight: 'auto',
};

const gridTwo: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
  gap: '20px',
};

const gridThree: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
  gap: '20px',
};

const gridFour: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
  gap: '16px',
};

const inlineCode: React.CSSProperties = {
  backgroundColor: 'rgba(59, 130, 246, 0.12)',
  color: c.cyan,
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '13px',
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
};

const textMuted: React.CSSProperties = {
  color: c.text2,
  fontSize: '14px',
  lineHeight: 1.7,
  margin: 0,
};

const loaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px',
  color: c.text3,
  fontSize: '14px',
};

const flowBtnBase: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: 'none',
};

const quoteStepBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
  flex: 1,
  textAlign: 'center',
};

const quoteStepCircle = (color: string): React.CSSProperties => ({
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  backgroundColor: `${color}15`,
  border: `2px solid ${color}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '22px',
  color,
});

const arrowSep: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  color: c.text3,
  fontSize: '20px',
  paddingTop: '8px',
};

/* ================================================================== */
/*  Mermaid diagram source strings                                     */
/* ================================================================== */

const MERMAID_PRICE_RETRIEVAL = `sequenceDiagram
    participant U as UI (React)
    participant BFF as API Gateway/BFF
    participant PA as Products-Api
    participant DB as MongoDB (fi-rate)
    participant PEN as PEN/Assurant
    participant TF as Taxes-Fees-API
    U->>BFF: GET /estimator/fi-products?vehicleId=X&userZip=Y
    BFF->>PA: Forward request
    PA->>PA: FIHandler → FIService.getEstimatedFIProducts()
    PA->>PA: Determine product types by paymentSelection
    PA->>DB: CachedPenProductRepository.findByVin(vin)
    alt Cache Hit (not expired)
        DB-->>PA: Return cached products (with markup applied)
        PA-->>BFF: Return EstimatedFIProductDto[]
    else Cache Miss (estimator path)
        PA-->>BFF: Return only Lithia products (LOF, Valet)
        Note over PA,PEN: Estimator does NOT call PEN on miss
    end
    BFF-->>U: Product list with prices
    Note over U,TF: Later, at checkout...
    U->>TF: POST /taxes-fees/v1 (products + totalInCents)
    TF-->>U: Tax line items by group`;

const MERMAID_VSC_PRICING = `flowchart TD
    A[PEN SOAP API getASBRates] -->|Returns| B{rateExist?}
    B -->|No| C[Product not available]
    B -->|Yes| D{Dealer State?}
    D -->|Florida| E[totalInCents = retailPriceInCents]
    D -->|All Other States| F[totalInCents = dealerCostInCents + $1,500]
    E --> G[Return VSC Product]
    F --> G
    G --> H[Cached in MongoDB fi-rate]
    H --> I[Served to UI on next request]
    style A fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0
    style B fill:#1e3a2f,stroke:#10b981,color:#e2e8f0
    style C fill:#3b1515,stroke:#ef4444,color:#e2e8f0
    style D fill:#3a2f1e,stroke:#f59e0b,color:#e2e8f0
    style E fill:#2d1e3a,stroke:#8b5cf6,color:#e2e8f0
    style F fill:#2d1e3a,stroke:#ec4899,color:#e2e8f0
    style G fill:#1e3a2f,stroke:#10b981,color:#e2e8f0
    style H fill:#3a2f1e,stroke:#f59e0b,color:#e2e8f0
    style I fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0`;

const MERMAID_QUOTE = `sequenceDiagram
    participant User as User
    participant Modal as GetQuoteWrapper
    participant Lead as useLeadServices
    participant API as Dealer Lead API
    participant SF as Salesforce
    User->>Modal: Click "Get Quote" on C&P page
    Modal->>Modal: Show ProductInfoModal
    User->>Modal: Select vehicle
    Modal->>Modal: Show ServiceCenterStep
    User->>Modal: Pick dealership
    Modal->>Modal: Show QuoteForm
    User->>Modal: Fill form (name, email, phone, address)
    Modal->>Modal: Show SubmitQuote review
    User->>Modal: Confirm submission
    Modal->>Lead: sendCreateLead(leadData)
    Lead->>API: POST /fni-leads
    Note over Lead,API: Payload: customer info + vehicle + dealershipId + productType[]
    API-->>Lead: { message: "success" }
    Lead-->>Modal: Success
    Modal->>User: Toast "Success" + close modal
    Note over API,SF: Separately, cart-service sends Salesforce intents`;

const MERMAID_CACHE = `flowchart LR
    subgraph Cache Population
        A[Vehicle Add/Update Event] -->|Azure Service Bus| B[inventory-delta-receiver]
        C[Cron Job every 5 min] --> D[FI Rate Refresh]
        B --> E[Call PEN API]
        D --> E
        E --> F[Apply Markup]
        F -->|VSC: cost + $1500| G[(MongoDB fi-rate)]
        F -->|VLP: fixed $1095| G
        F -->|T&W: cost x 2.2| G
    end
    subgraph Cache Read
        H[GET /estimator/fi-products] --> I{Cache Hit?}
        I -->|Yes and not expired| J[Return cached products]
        I -->|Miss or expired| K{isEstimate?}
        K -->|Yes| L[Return empty - no PEN call]
        K -->|No| M[Call PEN live]
    end
    G -.->|60-day expiry| I
    style A fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0
    style B fill:#3a2f1e,stroke:#f59e0b,color:#e2e8f0
    style C fill:#3a2f1e,stroke:#f59e0b,color:#e2e8f0
    style E fill:#1e3a5f,stroke:#06b6d4,color:#e2e8f0
    style F fill:#2d1e3a,stroke:#ec4899,color:#e2e8f0
    style G fill:#3a2f1e,stroke:#f59e0b,color:#e2e8f0
    style H fill:#1e3a2f,stroke:#10b981,color:#e2e8f0
    style J fill:#1e3a2f,stroke:#10b981,color:#e2e8f0
    style L fill:#3b1515,stroke:#ef4444,color:#e2e8f0
    style M fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0`;

const MERMAID_MYDRIVEWAY = `sequenceDiagram
    participant User as User (Logged In)
    participant UI as My Driveway UI
    participant Modal as GetQuoteWrapper
    participant Lead as useLeadServices.ts
    participant API as Dealer Lead API
    Note over User,UI: Page Load - NO pricing API calls
    User->>UI: Navigate to Care & Protection
    UI->>UI: Render static product list
    Note over UI: LOF: $799, Valet: $599, VSC/Appearance/PPM: Price on request
    User->>UI: Click product (e.g. VSC)
    UI->>Modal: Open ProductInfoModal
    User->>Modal: Click Get a Quote
    Modal->>Modal: Steps: mileage, contact, service center, review
    User->>Modal: Submit Request
    Modal->>Lead: sendCreateLead(leadData)
    Lead->>API: POST /fni-leads
    API-->>Lead: { message: success }
    Lead-->>Modal: Success
    Modal->>User: Toast Success
    Note over User,API: No calls to fi-products, fi-rate, PEN, or Taxes API`;

/* ================================================================== */
/*  Loader fallback                                                    */
/* ================================================================== */
const Loader: React.FC = () => (
  <div style={loaderStyle}>Loading component...</div>
);

/* ================================================================== */
/*  MAIN PAGE COMPONENT                                                */
/* ================================================================== */
const ProductsApiPage: React.FC = () => {
  /* --- Live Flow state --- */
  const [activeFlow, setActiveFlow] = useState<FlowName | null>(null);
  const { nodes: filteredNodes, edges: filteredEdges } = applyFlowFilter(
    liveNodes,
    liveEdges,
    activeFlow,
  );

  const flowButtons: { label: string; flow: FlowName | null; color: string }[] = [
    { label: 'All Flows', flow: null, color: c.accent },
    { label: 'Pricing Flow', flow: 'pricing', color: c.accent },
    { label: 'Tax Flow', flow: 'tax', color: c.green },
    { label: 'Quote Flow', flow: 'quote', color: c.purple },
    { label: 'Cache Strategy', flow: 'cache', color: c.yellow },
    { label: 'Salesforce', flow: 'salesforce', color: c.pink },
  ];

  return (
    <div style={pageStyle}>
      {/* ============================================================ */}
      {/*  1. HERO                                                      */}
      {/* ============================================================ */}
      <HeroBanner
        title="Care & Protection Products Pricing Flow"
        subtitle="Complete documentation of the multi-repo platform powering F&I product pricing, inventory sync, tax calculation, quote submission, and Salesforce integration."
        badges={[
          { label: 'Products-Api', color: 'blue', dot: true },
          { label: 'UI', color: 'green', dot: true },
          { label: 'Taxes-And-Fees-API', color: 'purple', dot: true },
          { label: 'Salesforce', color: 'pink', dot: true },
        ]}
      />

      {/* ============================================================ */}
      {/*  2. ARCHITECTURE                                              */}
      {/* ============================================================ */}
      <motion.section id="architecture" style={sectionStyle} {...fadeUp}>
        <SectionHeader
          label="Architecture"
          title="How Everything Connects"
          description="The Care & Protection pricing platform spans multiple repositories and services. This diagram shows how the UI, Products-Api, Taxes-And-Fees-API, Cart Service, and external providers (PEN/Assurant, Salesforce) interact."
        />
        <Suspense fallback={<Loader />}>
          <ReactFlowDiagram
            nodes={archNodes}
            edges={archEdges}
            title="Products-Api System Architecture"
            height="520px"
          />
        </Suspense>
        <div style={{ marginTop: '24px' }}>
          <Callout type="info" title="Multi-Repo Platform">
            This system is distributed across 4+ repositories. The UI sends requests to Products-Api
            for pricing, Taxes-And-Fees-API for tax calculations, and Dealer Lead API for quote
            submissions. Cart-service manages Salesforce intent forwarding.
          </Callout>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  3. LIVE FLOW EXPLORER                                        */}
      {/* ============================================================ */}
      <motion.section
        id="live-flow"
        style={{ ...sectionStyle, backgroundColor: c.surface }}
        {...fadeUp}
      >
        <SectionHeader
          label="Live Flow"
          title="Interactive System Flow"
          description="Click any flow button to highlight only the nodes and edges involved in that particular flow. All elements not in the selected flow are dimmed."
        />

        {/* Flow filter buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          {flowButtons.map((btn) => (
            <button
              key={btn.label}
              style={{
                ...flowBtnBase,
                backgroundColor:
                  activeFlow === btn.flow
                    ? `${btn.color}22`
                    : 'transparent',
                color: activeFlow === btn.flow ? btn.color : c.text3,
                border: `1px solid ${
                  activeFlow === btn.flow ? btn.color : c.border
                }`,
              }}
              onClick={() => setActiveFlow(btn.flow)}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <Suspense fallback={<Loader />}>
          <ReactFlowDiagram
            nodes={filteredNodes}
            edges={filteredEdges}
            title="Products-Api Live Flow Explorer"
            height="520px"
          />
        </Suspense>
      </motion.section>

      {/* ============================================================ */}
      {/*  4. ENDPOINT DEEP DIVE                                        */}
      {/* ============================================================ */}
      <motion.section id="endpoint-deep-dive" style={sectionStyle} {...fadeUp}>
        <SectionHeader
          label="Endpoint"
          title="GET /estimator/fi-products - Complete Internal Flow"
          description="This is the primary endpoint the UI calls to retrieve estimated F&I product prices for a given vehicle."
        />

        <div style={{ marginBottom: '32px' }}>
          <CodeBlock
            code={`GET /estimator/fi-products
  ?vehicleId=12345
  &vin=1HGCM82633A004352
  &userZip=97034
  &paymentSelection=CASH
  &isEstimate=true
  &dealerState=OR`}
            language="http"
            filename="Request Format"
          />
        </div>

        <FlowTimeline
          steps={[
            {
              number: 1,
              title: 'FIHandler receives the request',
              description:
                'The FIHandler controller method receives the GET request and extracts all query parameters (vehicleId, vin, userZip, paymentSelection, isEstimate, dealerState). It delegates to FIService.',
              color: c.accent,
              code: {
                filename: 'FIHandler.kt',
                language: 'kotlin',
                content: `@GetMapping("/estimator/fi-products")
fun getEstimatedFIProducts(
    @RequestParam vehicleId: String,
    @RequestParam vin: String,
    @RequestParam userZip: String,
    @RequestParam paymentSelection: String?,
    @RequestParam isEstimate: Boolean,
    @RequestParam dealerState: String?
): ResponseEntity<List<EstimatedFIProductDto>>`,
              },
            },
            {
              number: 2,
              title: 'FIService determines product types',
              description:
                'Based on paymentSelection (CASH, FINANCE, LEASE, or null), FIService selects which product types to return. CASH gets all products; FINANCE/null gets VSC + GAP + LOF + Valet; LEASE gets VLP + LOF + Valet.',
              color: c.green,
            },
            {
              number: 3,
              title: 'GraphQLVehicleInventoryService calls Odyssey',
              description:
                'To enrich the response with vehicle details (make, model, year, mileage), Products-Api calls the Odyssey inventory service via GraphQL. This data is needed for PEN rate lookups.',
              color: c.cyan,
            },
            {
              number: 4,
              title: 'FIService merges Lithia-owned products',
              description:
                'LOF ($799 flat) and Valet ($599 flat) are Lithia-owned products with hardcoded pricing. These are always included regardless of cache state.',
              color: c.purple,
            },
            {
              number: 5,
              title: 'getPenProducts: Cache Lookup',
              description:
                'FIService calls CachedPenProductRepository.findByVin(vin) to look up pre-cached PEN product rates from the MongoDB fi-rate collection. The cache is populated by background cron jobs and inventory delta events.',
              color: c.yellow,
              code: {
                filename: 'CachedPenProductRepository.kt',
                language: 'kotlin',
                content: `fun findByVin(vin: String): List<CachedPenProduct>?
// Returns cached products if VIN exists and doc not expired (60-day TTL)`,
              },
            },
            {
              number: 6,
              title: 'Cache Hit / Miss Decision',
              description:
                'Three possible outcomes determine what products are returned to the UI.',
              color: c.orange,
            },
            {
              number: 7,
              title: 'Response assembled and returned',
              description:
                'The final EstimatedFIProductDto[] is returned with all available products, each containing productType, totalInCents, provider, and description.',
              color: c.green,
              code: {
                filename: 'EstimatedFIProductDto.kt',
                language: 'kotlin',
                content: `data class EstimatedFIProductDto(
    val productType: String,      // "VSC", "VLP", "LOF", etc.
    val totalInCents: Long,       // e.g. 329500
    val provider: String,         // "PEN" | "Lithia"
    val description: String,
    val isAvailable: Boolean
)`,
              },
            },
          ]}
        />

        {/* Cache outcome cards */}
        <div style={{ ...gridThree, marginTop: '32px' }}>
          <Card title="Cache Hit (not expired)" variant="green">
            <p style={textMuted}>
              Cached products are returned directly from MongoDB. The markup was already applied when
              the cache was populated. PEN is <strong>not</strong> called.
            </p>
          </Card>
          <Card title="Cache Miss + isEstimate=true" variant="yellow">
            <p style={textMuted}>
              On the estimator path, Products-Api does <strong>NOT</strong> call PEN on a miss. Only
              Lithia-owned products (LOF, Valet) are returned.
            </p>
          </Card>
          <Card title="Cache Miss + isEstimate=false" variant="red">
            <p style={textMuted}>
              On the non-estimate path (e.g., VDP detail), Products-Api calls PEN live via SOAP
              getASBRates, applies markup, caches the result, and returns it.
            </p>
          </Card>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  5. INVENTORY SYNC                                            */}
      {/* ============================================================ */}
      <motion.section
        id="inventory-sync"
        style={{ ...sectionStyle, backgroundColor: c.surface }}
        {...fadeUp}
      >
        <SectionHeader
          label="Inventory Sync"
          title="How Odyssey Inventory Syncs with Products-Api (fi-rate)"
          description="Two separate pipelines feed the fi-rate cache: the Shop/SRP pipeline and the fi-rate cache population pipeline."
        />

        {/* Two pipeline cards */}
        <div style={{ ...gridTwo, marginBottom: '32px' }}>
          <Card title="Pipeline 1 -- Shop / SRP" variant="blue">
            <p style={textMuted}>
              When a user visits Shop or SRP, the UI calls{' '}
              <span style={inlineCode}>GET /estimator/fi-products</span>. Products-Api looks up the
              VIN in the fi-rate cache. If found, returns cached products. If not, the estimator path
              returns only Lithia products (no PEN call).
            </p>
          </Card>
          <Card title="Pipeline 2 -- fi-rate Cache" variant="yellow">
            <p style={textMuted}>
              The fi-rate cache is populated by two mechanisms: (1) Azure Service Bus
              inventory-delta-receiver events when vehicles are added/updated, and (2) a cron job
              running every 5 minutes that refreshes expiring rates.
            </p>
          </Card>
        </div>

        {/* 6-step sync pipeline */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ color: c.text, fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
            Sync Pipeline Steps
          </h3>
          <FlowTimeline
            steps={[
              {
                number: 1,
                title: 'EDS publishes vehicle event',
                description:
                  'Enterprise Data Service (EDS) publishes an add/update event to Azure Service Bus whenever a vehicle is added or modified in the dealer inventory system.',
                color: c.accent,
              },
              {
                number: 2,
                title: 'Odyssey consumes the event',
                description:
                  'Odyssey (inventory service) processes the ASB message, updates its own database, and publishes a downstream event for Products-Api.',
                color: c.green,
              },
              {
                number: 3,
                title: 'inventory-delta-receiver picks up the message',
                description:
                  'Products-Api\'s inventory-delta-receiver listener consumes the vehicle event from the service bus topic.',
                color: c.cyan,
              },
              {
                number: 4,
                title: 'Products-Api calls PEN SOAP API',
                description:
                  'For each eligible vehicle, Products-Api calls PEN/Assurant\'s getASBRates SOAP endpoint to retrieve dealer cost and retail price for VSC, VLP, T&W, etc.',
                color: c.purple,
              },
              {
                number: 5,
                title: 'Markup is applied',
                description:
                  'Products-Api applies the configured markup: VSC = dealerCost + $1,500 (or retailPrice for FL), VLP = fixed $1,095, T&W = dealerCost x 2.2 (or retailPrice for FL).',
                color: c.pink,
              },
              {
                number: 6,
                title: 'Result cached in MongoDB fi-rate',
                description:
                  'The marked-up product rates are stored in the fi-rate MongoDB collection with a 60-day TTL. Subsequent GET /estimator/fi-products calls read from this cache.',
                color: c.yellow,
              },
            ]}
          />
        </div>

        {/* Why DEV Has Gaps */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ color: c.text, fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
            Why DEV Has Gaps
          </h3>
          <div style={gridFour}>
            <Card title="A - ASB never arrives" variant="red">
              <p style={textMuted}>
                In DEV, the Azure Service Bus topic may not have all dealer inventory events. Many
                vehicles exist in Odyssey DEV but never triggered an ASB event.
              </p>
            </Card>
            <Card title="B - Message skipped" variant="yellow">
              <p style={textMuted}>
                The inventory-delta-receiver may skip messages due to filtering rules (e.g., vehicle
                type not eligible for F&I products).
              </p>
            </Card>
            <Card title="C - PEN fails" variant="orange">
              <p style={textMuted}>
                PEN DEV environment is unreliable. SOAP calls may timeout, return empty rates, or
                reject the VIN/dealer combination.
              </p>
            </Card>
            <Card title="D - Document unusable" variant="purple">
              <p style={textMuted}>
                Even if cached, the fi-rate document may have expired (60-day TTL) or contain
                incomplete data from a partial PEN response.
              </p>
            </Card>
          </div>
        </div>

        {/* DEV vs PROD comparison table */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ color: c.text, fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
            DEV vs PROD Comparison
          </h3>
          <DataTable
            headers={['Aspect', 'DEV', 'PROD']}
            rows={[
              ['ASB Events', 'Sparse, many dealers missing', 'Full dealer coverage'],
              ['PEN Availability', 'Unreliable, frequent timeouts', 'Stable, SLA-backed'],
              ['fi-rate Coverage', '~10-20% of inventory', '~95%+ of eligible inventory'],
              ['Cron Job', 'Runs but low hit rate', 'Refreshes thousands of VINs'],
              ['Odyssey Data', 'Partial, stale in some areas', 'Real-time, complete'],
              ['Test Vehicles', 'Manually seeded VINs only', 'All dealer inventory'],
            ]}
          />
        </div>

        {/* How To Test in DEV */}
        <h3 style={{ color: c.text, fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
          How To Test in DEV
        </h3>
        <div style={gridThree}>
          <Card title="Option 1: Seed fi-rate manually" variant="blue">
            <p style={textMuted}>
              Insert a document directly into the MongoDB fi-rate collection with a known VIN and
              markup values. Use the same schema as production documents.
            </p>
          </Card>
          <Card title="Option 2: Trigger ASB event" variant="green">
            <p style={textMuted}>
              Publish a test vehicle event to the Azure Service Bus DEV topic. The
              inventory-delta-receiver will pick it up and attempt a PEN call.
            </p>
          </Card>
          <Card title="Option 3: Use isEstimate=false" variant="purple">
            <p style={textMuted}>
              Call the endpoint with <span style={inlineCode}>isEstimate=false</span> to force a live
              PEN call. This bypasses the cache entirely but requires PEN DEV to be available.
            </p>
          </Card>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  6. PRICING ENGINE                                            */}
      {/* ============================================================ */}
      <motion.section id="pricing-engine" style={sectionStyle} {...fadeUp}>
        <SectionHeader
          label="Pricing"
          title="Product Pricing at a Glance"
          description="Summary of all C&P product pricing strategies, including the recent price increase and Florida overrides."
        />

        <DataTable
          headers={[
            'Product',
            'Pricing Strategy',
            'Previous Price',
            'Current Price',
            'Increase',
            'FL Override',
            'Config Key',
          ]}
          highlightColumn={3}
          rows={[
            [
              'VSC',
              'dealerCost + markup',
              '$1,000 markup',
              '$1,500 markup',
              '+$500',
              'retailPrice',
              'vsc.markup.cents',
            ],
            [
              'VLP',
              'Fixed flat rate',
              '$995',
              '$1,095',
              '+$100',
              'N/A (flat)',
              'vlp.flat.price.cents',
            ],
            [
              'T&W',
              'dealerCost x multiplier',
              '2.0x',
              '2.2x',
              '+0.2x',
              'retailPrice',
              'tw.multiplier',
            ],
            [
              'LOF',
              'Hardcoded (Lithia)',
              '$799',
              '$799',
              'No change',
              'N/A',
              'N/A',
            ],
            [
              'Valet',
              'Hardcoded (Lithia)',
              '$599',
              '$599',
              'No change',
              'N/A',
              'N/A',
            ],
            [
              'GAP',
              'PEN rate (no markup)',
              'PEN rate',
              'PEN rate',
              'No change',
              'N/A',
              'N/A',
            ],
            [
              'Appearance',
              'PEN rate + markup',
              'TBD',
              'TBD',
              'TBD',
              'retailPrice',
              'appearance.markup',
            ],
          ]}
        />

        {/* Payment type availability cards */}
        <div style={{ ...gridThree, marginTop: '32px' }}>
          <Card title="CASH" variant="green">
            <p style={textMuted}>
              All products available: VSC, VLP, T&W, GAP, LOF, Valet, Appearance, PPM.
            </p>
          </Card>
          <Card title="FINANCE / null" variant="blue">
            <p style={textMuted}>
              VSC, GAP, LOF, Valet. VLP and Appearance are excluded for finance payment type.
            </p>
          </Card>
          <Card title="LEASE" variant="purple">
            <p style={textMuted}>
              VLP, LOF, Valet only. VSC, GAP, T&W, and Appearance are not offered for lease.
            </p>
          </Card>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  7. VSC FLOW                                                  */}
      {/* ============================================================ */}
      <motion.section
        id="vsc-flow"
        style={{ ...sectionStyle, backgroundColor: c.surface }}
        {...fadeUp}
      >
        <SectionHeader
          label="VSC"
          title="VSC Pricing Flow -- Step by Step"
          description="Vehicle Service Contract pricing involves a PEN SOAP call, dealer-state-aware markup, and MongoDB caching."
        />
        <FlowTimeline
          steps={[
            {
              number: 1,
              title: 'UI requests product prices',
              description:
                'The UI calls GET /estimator/fi-products with vehicleId, vin, userZip, and paymentSelection.',
              color: c.accent,
            },
            {
              number: 2,
              title: 'FIHandler delegates to FIService',
              description:
                'FIHandler extracts params and calls FIService.getEstimatedFIProducts().',
              color: c.green,
            },
            {
              number: 3,
              title: 'FIService checks fi-rate cache',
              description:
                'CachedPenProductRepository.findByVin(vin) is called. If a non-expired document exists, the cached VSC price is returned directly.',
              color: c.yellow,
            },
            {
              number: 4,
              title: 'Cache miss: PEN SOAP call',
              description:
                'If cache miss on a non-estimate path, Products-Api calls PEN\'s getASBRates SOAP endpoint with VIN, dealer ID, and vehicle details.',
              color: c.cyan,
            },
            {
              number: 5,
              title: 'Markup applied: $1,500 over dealer cost',
              description:
                'For non-Florida states: totalInCents = dealerCostInCents + 150000. For Florida: totalInCents = retailPriceInCents (FL regulatory override).',
              color: c.pink,
              code: {
                filename: 'VSC Markup Logic',
                language: 'kotlin',
                content: `// VSC pricing logic
val totalInCents = if (dealerState == "FL") {
    retailPriceInCents  // Florida override
} else {
    dealerCostInCents + 150_000  // $1,500 markup
}`,
              },
            },
            {
              number: 6,
              title: 'Result cached in MongoDB',
              description:
                'The computed VSC product with marked-up price is stored in the fi-rate collection with a 60-day TTL for future requests.',
              color: c.orange,
            },
            {
              number: 7,
              title: 'Config-driven via application properties',
              description:
                'The $1,500 markup value is configurable via the vsc.markup.cents application property, allowing changes without code deployment.',
              color: c.purple,
            },
          ]}
        />
      </motion.section>

      {/* ============================================================ */}
      {/*  8. VLP FLOW                                                  */}
      {/* ============================================================ */}
      <motion.section id="vlp-flow" style={sectionStyle} {...fadeUp}>
        <SectionHeader
          label="VLP"
          title="VLP Pricing Flow -- Hardcoded"
          description="Vehicle Lease Protection uses a simple flat-rate pricing strategy."
        />
        <FlowTimeline
          steps={[
            {
              number: 1,
              title: 'UI requests products for LEASE payment type',
              description:
                'When paymentSelection is LEASE (or CASH), VLP is included in the product type list.',
              color: c.accent,
            },
            {
              number: 2,
              title: 'FIService returns fixed price',
              description:
                'VLP does not require a PEN call. The price is a hardcoded flat rate stored in application configuration.',
              color: c.green,
            },
            {
              number: 3,
              title: 'Fixed $1,095 returned',
              description:
                'totalInCents = 109500. This is the same for all states, all vehicles, all dealers. No PEN lookup, no cache dependency.',
              color: c.yellow,
            },
          ]}
        />
        <div style={{ marginTop: '24px' }}>
          <CodeBlock
            code={`// VLP Pricing - hardcoded flat rate
val vlpProduct = EstimatedFIProductDto(
    productType = "VLP",
    totalInCents = 109500,  // $1,095.00 fixed
    provider = "PEN",
    description = "Vehicle Lease Protection",
    isAvailable = true
)

// Config key: vlp.flat.price.cents=109500
// Previous value: 99500 ($995.00)
// Increase: +$100`}
            language="kotlin"
            filename="VLP Pricing Logic"
          />
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  9. TAXES & FEES                                              */}
      {/* ============================================================ */}
      <motion.section
        id="taxes-fees"
        style={{ ...sectionStyle, backgroundColor: c.surface }}
        {...fadeUp}
      >
        <SectionHeader
          label="Taxes"
          title="Tax Calculation Flow"
          description="After the UI retrieves product prices, tax calculations are handled by a separate Taxes-And-Fees-API service at checkout."
        />

        <CodeBlock
          code={`// Tax request and response types

interface TaxRequest {
  products: {
    productType: string;       // "VSC", "VLP", etc.
    totalInCents: number;      // product price in cents
  }[];
  vehiclePrice: number;        // vehicle sale price in cents
  userZip: string;             // buyer's ZIP code
  dealerZip: string;           // dealer ZIP code
  dealerState: string;         // two-letter state code
}

interface TaxResponse {
  taxLineItems: {
    group: string;             // "STATE" | "COUNTY" | "CITY" | "DISTRICT"
    description: string;       // e.g. "Oregon State Tax"
    ratePercent: number;       // e.g. 0.0
    amountInCents: number;     // computed tax amount
  }[];
  totalTaxInCents: number;     // sum of all line items
}

// POST /taxes-fees/v1
// Called by UI at checkout, NOT by Products-Api`}
          language="typescript"
          filename="Taxes-And-Fees-API Types"
        />

        <div style={{ ...gridTwo, marginTop: '24px' }}>
          <Card title="Key Point" variant="cyan">
            <p style={textMuted}>
              Products-Api does <strong>NOT</strong> call Taxes-And-Fees-API. The UI calls it
              separately at checkout time. Products-Api only provides pre-tax product prices.
            </p>
          </Card>
          <Card title="Response Groups" variant="yellow">
            <p style={textMuted}>
              Tax line items are grouped by jurisdiction: STATE, COUNTY, CITY, DISTRICT. Some states
              (e.g., Oregon) have 0% sales tax, so totalTaxInCents may be 0.
            </p>
          </Card>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  10. QUOTE FLOW                                               */}
      {/* ============================================================ */}
      <motion.section id="quote-flow" style={sectionStyle} {...fadeUp}>
        <SectionHeader
          label="Quotes"
          title="Get Quote -- UI Flow"
          description="The Get Quote modal walks the user through a multi-step wizard before submitting a lead to the Dealer Lead API."
        />

        {/* 5-step visual */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: '0',
            marginBottom: '32px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { label: 'Product Info', icon: '1', color: c.accent },
            { label: 'Pick Vehicle', icon: '2', color: c.green },
            { label: 'Service Center', icon: '3', color: c.cyan },
            { label: 'Quote Form', icon: '4', color: c.purple },
            { label: 'Submit Quote', icon: '5', color: c.pink },
          ].map((step, i, arr) => (
            <React.Fragment key={step.label}>
              <div style={quoteStepBox}>
                <div style={quoteStepCircle(step.color)}>{step.icon}</div>
                <span style={{ color: c.text, fontSize: '13px', fontWeight: 600 }}>
                  {step.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div style={arrowSep}>&#8594;</div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <CodeBlock
            code={`// useLeadServices.ts — sendCreateLead function
export async function sendCreateLead(leadData: LeadsData): Promise<void> {
  const response = await fetch('/api/fni-leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData),
  });

  if (!response.ok) {
    throw new Error('Failed to submit lead');
  }

  return response.json();
}`}
            language="typescript"
            filename="useLeadServices.ts"
          />
        </div>

        <CodeBlock
          code={`// LeadsData type
interface LeadsData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  vehicleId: string;
  vin: string;
  dealershipId: string;
  productType: string[];       // e.g. ["VSC", "VLP"]
  preferredContactMethod: string;
  comments?: string;
}`}
          language="typescript"
          filename="LeadsData Interface"
        />
      </motion.section>

      {/* ============================================================ */}
      {/*  11. MY DRIVEWAY                                              */}
      {/* ============================================================ */}
      <motion.section
        id="mydriveway-cp"
        style={{ ...sectionStyle, backgroundColor: c.surface }}
        {...fadeUp}
      >
        <SectionHeader
          label="My Driveway"
          title="My Driveway -- Care & Protection Plans"
          description="The My Driveway C&P page operates differently from Shop/SRP. It shows static product info and never calls Products-Api for pricing."
        />

        <div style={{ marginBottom: '24px' }}>
          <Callout type="success" title="Not affected by price increase">
            The My Driveway Care & Protection page does NOT call Products-Api, fi-rate cache, PEN, or
            Taxes-And-Fees-API. Product prices shown are static. The recent pricing increase does
            not impact this page.
          </Callout>
        </div>

        {/* Products table */}
        <div style={{ marginBottom: '32px' }}>
          <DataTable
            headers={[
              'Product',
              'Price Display',
              'Source',
              'Affected by Migration',
            ]}
            rows={[
              ['LOF (Lube, Oil, Filter)', '$799', 'Hardcoded in UI', 'No'],
              ['Valet', '$599', 'Hardcoded in UI', 'No'],
              ['VSC (Vehicle Service Contract)', 'Price on request', 'Quote flow only', 'No'],
              ['Appearance Package', 'Price on request', 'Quote flow only', 'No'],
              ['PPM (Pre-Paid Maintenance)', 'Price on request', 'Quote flow only', 'No'],
            ]}
          />
        </div>

        {/* Shopping vs My Driveway comparison */}
        <h3 style={{ color: c.text, fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
          Shopping vs My Driveway Comparison
        </h3>
        <DataTable
          headers={['Aspect', 'Shopping (SRP/VDP)', 'My Driveway C&P']}
          rows={[
            [
              'Products-Api call',
              'Yes - GET /estimator/fi-products',
              'No - never called',
            ],
            [
              'PEN rates',
              'Used for VSC, T&W, GAP pricing',
              'Not used',
            ],
            [
              'Tax calculation',
              'Yes - POST /taxes-fees/v1 at checkout',
              'No - no checkout flow',
            ],
            [
              'Price display',
              'Dynamic prices from fi-rate cache',
              'Static: $799, $599, or "Price on request"',
            ],
            [
              'Quote submission',
              'Yes - POST /fni-leads',
              'Yes - POST /fni-leads (same flow)',
            ],
            [
              'Affected by price increase',
              'Yes - VSC, VLP, T&W markups changed',
              'No - static prices unchanged',
            ],
          ]}
        />
      </motion.section>

      {/* ============================================================ */}
      {/*  12. SALESFORCE                                               */}
      {/* ============================================================ */}
      <motion.section id="salesforce" style={sectionStyle} {...fadeUp}>
        <SectionHeader
          label="Salesforce"
          title="Salesforce Intents"
          description="Cart-service sends structured intent objects to Salesforce when users interact with C&P products in the shopping flow."
        />

        <div style={{ ...gridTwo, marginBottom: '24px' }}>
          <Card title="Shop Intent" variant="blue">
            <p style={textMuted}>
              Fired when a user views or adds a C&P product from the Shop/SRP page. Contains:
              dealerId, vehicleId, productType, paymentSelection, and timestamp.
            </p>
            <div style={{ marginTop: '12px' }}>
              <Badge label="cart-service" color="blue" />
            </div>
          </Card>
          <Card title="Finance Intent" variant="purple">
            <p style={textMuted}>
              Fired when a user proceeds with a finance or lease option that includes C&P products.
              Contains: all Shop Intent fields plus financeTermMonths, apr, and monthlyPayment.
            </p>
            <div style={{ marginTop: '12px' }}>
              <Badge label="cart-service" color="purple" />
            </div>
          </Card>
        </div>

        <CodeBlock
          code={`// SalesforceIntentService — sends intents to Salesforce CRM

class SalesforceIntentService {
  async sendShopIntent(data: ShopIntentData): Promise<void> {
    // Payload structure:
    // {
    //   intentType: "SHOP",
    //   dealerId: string,
    //   vehicleId: string,
    //   vin: string,
    //   productTypes: string[],     // ["VSC", "VLP"]
    //   paymentSelection: string,   // "CASH" | "FINANCE" | "LEASE"
    //   timestamp: ISO8601 string
    // }
  }

  async sendFinanceIntent(data: FinanceIntentData): Promise<void> {
    // Extends ShopIntentData with:
    // {
    //   ...shopIntentFields,
    //   intentType: "FINANCE",
    //   financeTermMonths: number,  // 36 | 48 | 60 | 72
    //   apr: number,                // e.g. 4.99
    //   monthlyPayment: number,     // in cents
    //   downPayment: number         // in cents
    // }
  }
}`}
          language="typescript"
          filename="SalesforceIntentService.ts"
        />
      </motion.section>

      {/* ============================================================ */}
      {/*  13. MERMAID DIAGRAMS                                         */}
      {/* ============================================================ */}
      <motion.section
        id="mermaid-diagrams"
        style={{ ...sectionStyle, backgroundColor: c.surface }}
        {...fadeUp}
      >
        <SectionHeader
          label="Diagrams"
          title="Mermaid Flow Viewer"
          description="Interactive Mermaid diagrams for key system flows. Toggle source code view, zoom, and fullscreen."
        />
        <Suspense fallback={<Loader />}>
          <MermaidViewer
            title="C&P System Flow Diagrams"
            tabs={[
              { label: 'Price Retrieval', source: MERMAID_PRICE_RETRIEVAL },
              { label: 'VSC Pricing', source: MERMAID_VSC_PRICING },
              { label: 'Quote Submission', source: MERMAID_QUOTE },
              { label: 'Cache Strategy', source: MERMAID_CACHE },
              { label: 'My Driveway C&P', source: MERMAID_MYDRIVEWAY },
            ]}
          />
        </Suspense>
      </motion.section>

      {/* ============================================================ */}
      {/*  14. CALCULATOR                                               */}
      {/* ============================================================ */}
      <motion.section id="calculator" style={sectionStyle} {...fadeUp}>
        <SectionHeader
          label="Interactive"
          title="Price Calculation Simulator"
          description="Experiment with the markup logic used by Products-Api. Adjust dealer cost, retail price, product type, and state to see how the final price is calculated."
        />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Suspense fallback={<Loader />}>
            <PriceCalculator />
          </Suspense>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  15. REPOSITORIES                                             */}
      {/* ============================================================ */}
      <motion.section
        id="repositories"
        style={{ ...sectionStyle, backgroundColor: c.surface }}
        {...fadeUp}
      >
        <SectionHeader
          label="Codebase"
          title="Codebase Structure"
          description="Key files and directories across the four main repositories that power the Care & Protection platform."
        />
        <div style={gridTwo}>
          <Card title="Products-Api" variant="blue">
            <CodeBlock
              code={`products-api/
  src/main/kotlin/.../
    handler/
      FIHandler.kt              # REST controller
    service/
      FIService.kt              # Core pricing logic
      PenProductService.kt      # PEN SOAP integration
    repository/
      CachedPenProductRepository.kt  # MongoDB fi-rate
    model/
      EstimatedFIProductDto.kt  # Response DTO
      CachedPenProduct.kt       # Cache document
    config/
      FIProductConfig.kt        # Markup values
    scheduler/
      FIRateRefreshScheduler.kt # Cron job (5 min)
    listener/
      InventoryDeltaReceiver.kt # ASB consumer`}
              language="text"
              filename="products-api"
            />
          </Card>
          <Card title="UI (React / Next.js)" variant="green">
            <CodeBlock
              code={`ui/
  src/
    features/care-protection/
      CareProtectionPage.tsx    # Main C&P page
      components/
        ProductCard.tsx          # Product display card
        GetQuoteWrapper.tsx      # Quote modal wizard
        ProductInfoModal.tsx     # Product detail modal
        ServiceCenterStep.tsx    # Dealer picker step
        QuoteForm.tsx            # Contact info form
        SubmitQuote.tsx          # Review & submit
    services/
      useLeadServices.ts        # sendCreateLead()
      useFIProducts.ts          # GET /estimator/fi-products
    hooks/
      useTaxCalculation.ts      # POST /taxes-fees/v1`}
              language="text"
              filename="ui"
            />
          </Card>
          <Card title="cart-service" variant="purple">
            <CodeBlock
              code={`cart-service/
  src/
    services/
      SalesforceIntentService.ts  # SF intent sender
      CartService.ts              # Cart state management
    models/
      ShopIntent.ts               # Shop intent type
      FinanceIntent.ts            # Finance intent type
    handlers/
      IntentHandler.ts            # Intent routing`}
              language="text"
              filename="cart-service"
            />
          </Card>
          <Card title="Taxes-And-Fees-API" variant="yellow">
            <CodeBlock
              code={`taxes-and-fees-api/
  src/main/kotlin/.../
    handler/
      TaxHandler.kt              # POST /taxes-fees/v1
    service/
      TaxCalculationService.kt   # Tax computation
    model/
      TaxRequest.kt              # Input model
      TaxResponse.kt             # Output model
      TaxLineItem.kt             # Per-jurisdiction tax
    config/
      TaxRateConfig.kt           # Rate tables by state`}
              language="text"
              filename="taxes-and-fees-api"
            />
          </Card>
        </div>
      </motion.section>
    </div>
  );
};

export default ProductsApiPage;
