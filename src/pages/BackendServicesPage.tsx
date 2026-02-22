import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { useSidebar } from '../context/SidebarContext';
import ReactFlowDiagram from '../components/diagrams/ReactFlowDiagram';
import MermaidViewer from '../components/diagrams/MermaidViewer';
import SectionHeader from '../components/shared/SectionHeader';
import CodeBlock from '../components/shared/CodeBlock';
import DataTable from '../components/shared/DataTable';
import Callout from '../components/shared/Callout';
import Card from '../components/shared/Card';
import Badge from '../components/shared/Badge';
import FlowTimeline from '../components/shared/FlowTimeline';
import Tabs from '../components/shared/Tabs';
import ServiceExplorer from '../components/interactive/ServiceExplorer';
import {
  ecosystemNodes,
  ecosystemEdges,
} from '../diagrams/ecosystemArchitecture';

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

const sectionStyle: CSSProperties = { marginBottom: '4rem' };

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

const paragraph: CSSProperties = {
  fontSize: '0.92rem',
  lineHeight: 1.75,
  color: c.text2,
  margin: '0 0 1rem 0',
};

const inlineCode: CSSProperties = {
  fontFamily: "'SF Mono', 'Fira Code', monospace",
  fontSize: '0.82rem',
  background: `${c.accent}15`,
  color: c.accent,
  padding: '2px 7px',
  borderRadius: 5,
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
/*  Hero                                                                */
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
    'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)',
  pointerEvents: 'none',
  zIndex: 0,
};

const heroTitle: CSSProperties = {
  fontSize: '2.8rem',
  fontWeight: 800,
  lineHeight: 1.15,
  margin: '0 0 1rem',
  letterSpacing: '-0.03em',
  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const heroSubtitle: CSSProperties = {
  fontSize: '1.05rem',
  color: c.text2,
  maxWidth: 680,
  margin: '0 auto',
  lineHeight: 1.75,
};

/* ------------------------------------------------------------------ */
/*  Mermaid diagram sources                                             */
/* ------------------------------------------------------------------ */
const mermaidShoppingFlow = `sequenceDiagram
    participant User as Customer
    participant UI as Driveway UI
    participant GW as API Gateway
    participant Ody as Odyssey API
    participant Max as MaxDigital
    participant Cart as Cart Service
    participant Prod as Products API
    participant Tax as Taxes & Fees
    participant PreQ as Prequalification
    participant Inc as Incentives API
    participant SF as Salesforce

    User->>UI: Browse vehicles
    UI->>GW: GraphQL search query
    GW->>Ody: /shop/gql/v5/graphql
    Ody->>Ody: Query MongoDB (vehicleV3)
    Ody->>Max: Fetch photo gallery
    Max-->>Ody: Vehicle images (6 sizes)
    Ody-->>GW: Search results
    GW-->>UI: Vehicle listings

    User->>UI: Add to cart
    UI->>GW: Cart mutation
    GW->>Cart: /cart/v1 (GraphQL)
    Cart->>Ody: Verify vehicle availability
    Cart->>Cart: Reserve vehicle
    Cart->>Prod: GET /estimator/fi-products
    Prod-->>Cart: F&I product options
    Cart->>Tax: GET /taxes-fees
    Tax-->>Cart: Tax estimate
    Cart->>Inc: GET incentives
    Inc-->>Cart: Incentive data
    Cart-->>GW: Cart with pricing
    GW-->>UI: Full cart display

    User->>UI: Prequalify for financing
    UI->>GW: POST prequal
    GW->>PreQ: /prequalification/v1
    PreQ->>PreQ: Equifax credit check
    PreQ->>PreQ: DFC eligibility
    PreQ->>SF: Create lead
    PreQ-->>GW: Prequal result
    GW-->>UI: Financing options`;

const mermaidInventoryPipeline = `sequenceDiagram
    participant Blob as Azure Blob Storage
    participant Cron as Odyssey Cron
    participant Mongo as MongoDB Atlas
    participant ASB as Azure Service Bus
    participant ProdDR as Products Delta Receiver
    participant IncDR as Incentives Delta Receiver
    participant PEN as PEN/Assurant
    participant Cox as Cox AIS

    Note over Blob,Cox: Every 30 minutes

    Blob->>Cron: Fetch GZIP TSV files
    Note right of Cron: Parse 76 fields per row
    Cron->>Mongo: Write to temp_vehicleV3_<ts>
    Cron->>Cron: Validate delta < 15,000 vehicles
    Cron->>Mongo: Merge to vehicleV3 (live)
    Cron->>Mongo: Mark missing as DELETED

    Cron->>ASB: Publish inventory-delta-topic

    ASB->>ProdDR: ADD/UPDATE/DELETE events
    ProdDR->>PEN: SOAP getASBRates (rate-limited)
    PEN-->>ProdDR: VSC, T&W, VLP rates
    ProdDR->>Mongo: Upsert fi-rate cache

    ASB->>IncDR: ADD/UPDATE events
    IncDR->>Cox: Fetch incentive data
    Cox-->>IncDR: Incentives & leasing
    IncDR->>IncDR: Cache in PostgreSQL`;

const mermaidCartStatusFlow = `sequenceDiagram
    participant UI as Driveway UI
    participant Cart as Cart Service
    participant ASB as Azure Service Bus
    participant Avail as Odyssey Availability
    participant Mongo as MongoDB (vehicleV3)

    UI->>Cart: Add vehicle to cart
    Cart->>Cart: Set purchasePending = true
    Cart->>ASB: Publish cart-status-update-topic
    ASB->>Avail: Cart status message
    Avail->>Mongo: Update vehicleV3.availability
    Note right of Mongo: purchasePending = true

    UI->>Cart: Remove from cart / timeout
    Cart->>Cart: Set purchasePending = false
    Cart->>ASB: Publish cart-status-update-topic
    ASB->>Avail: Cart status release
    Avail->>Mongo: Update vehicleV3.availability
    Note right of Mongo: purchasePending = false`;

const mermaidLeasingFlow = `sequenceDiagram
    participant Cox as Cox AIS API
    participant RegSync as Incentives (region-sync)
    participant IncSync as Incentives (incentives-sync)
    participant PG as PostgreSQL
    participant Pub as Incentives (publisher)
    participant ASB as Azure Service Bus
    participant Consumer as Odyssey Consumer
    participant Mongo as MongoDB (vehicleV3)

    Note over Cox,Mongo: Cron-driven pipeline

    Cox->>RegSync: Fetch region data (4x daily)
    RegSync->>PG: Store cox_regions

    Cox->>IncSync: Fetch incentives/leasing
    IncSync->>PG: Store incentives & leasing_data

    Pub->>PG: Read cached data
    Pub->>ASB: Publish to leasing-incentives-topic

    ASB->>Consumer: Leasing/Incentive messages
    Consumer->>Consumer: Route to LeaseHandler
    Consumer->>Mongo: Update vehicleV3.leasing
    Note right of Mongo: canLease, monthlyPrice, etc.`;

const mermaidAuthFlow = `flowchart LR
    subgraph Customer["Customer Facing"]
        DUI[Driveway UI]
        Auth0[Auth0 OAuth2]
    end

    subgraph Internal["Internal"]
        FUI[Freeway UI]
        AAD[Azure AD + MSAL]
    end

    subgraph Gateway["API Gateway"]
        APIM[Azure APIM]
    end

    subgraph BFF["BFF Layer"]
        Next[Next.js API Routes]
    end

    DUI -->|Login| Auth0
    Auth0 -->|Bearer Token| DUI
    DUI -->|Token + API Key| APIM
    DUI -->|BFF calls| Next
    Next -->|Internal calls| APIM

    FUI -->|Login| AAD
    AAD -->|MSAL Token| FUI
    FUI -->|App Roles RBAC| APIM

    style Auth0 fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style AAD fill:#3b82f6,stroke:#2563eb,color:#fff
    style APIM fill:#ec4899,stroke:#db2777,color:#fff
    style Next fill:#10b981,stroke:#059669,color:#fff`;

const mermaidDbArchitecture = `flowchart TB
    subgraph MongoDB["MongoDB Atlas"]
        shopInv[(shopInventory)]
        products[(products)]
        cart[(cart)]
        prequal[(prequalification)]
        backpack[(backpack)]
    end

    subgraph PostgreSQL["PostgreSQL"]
        accCenter[(account_center)]
        admin[(admin)]
        incentives[(incentives)]
        vehicles[(vehicles)]
    end

    subgraph Services["Backend Services"]
        Ody[Odyssey]
        Prod[Products API]
        CartSvc[Cart Service]
        PreQ[Prequalification]
        Back[Backpack]
        Acc[Account Center]
        Adm[Admin API]
        Inc[Incentives API]
        Veh[Vehicle Service]
    end

    Ody -->|vehicleV3, searchSuggestion| shopInv
    Prod -->|fi-rate, fi-product-v2| products
    CartSvc -->|cart, checkout| cart
    PreQ -->|prequalifications| prequal
    Back -->|inspection, savedOffers| backpack

    Acc -->|users, saved_searches, favorites| accCenter
    Adm -->|dealerships, zones, regions| admin
    Inc -->|incentives, leasing_data| incentives
    Veh -->|vehicle_details| vehicles

    style MongoDB fill:#1a2332,stroke:#f59e0b,color:#e2e8f0
    style PostgreSQL fill:#1a2332,stroke:#06b6d4,color:#e2e8f0
    style Services fill:#1a2332,stroke:#3b82f6,color:#e2e8f0`;

/* ------------------------------------------------------------------ */
/*  Sidebar config                                                      */
/* ------------------------------------------------------------------ */
const sidebarSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'ecosystem-diagram', label: 'Ecosystem Diagram' },
  { id: 'service-explorer', label: 'Service Explorer' },
  { id: 'shopping-flow', label: 'Shopping Flow' },
  { id: 'inventory-pipeline', label: 'Inventory Pipeline' },
  { id: 'cart-availability', label: 'Cart & Availability' },
  { id: 'leasing-flow', label: 'Leasing Data Flow' },
  { id: 'service-bus', label: 'Azure Service Bus' },
  { id: 'database-architecture', label: 'Database Architecture' },
  { id: 'api-gateway', label: 'API Gateway' },
  { id: 'auth', label: 'Authentication' },
  { id: 'external-vendors', label: 'External Vendors' },
  { id: 'frontend-apps', label: 'Frontend Applications' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'repositories', label: 'Repository Guide' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function BackendServicesPage() {
  const { setSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('Backend Services', sidebarSections);
  }, [setSidebar]);

  return (
    <div style={pageStyle}>
      {/* ============================================================ */}
      {/*  1. HERO                                                      */}
      {/* ============================================================ */}
      <section style={heroSection}>
        <div style={heroGlow} />
        <motion.div style={{ position: 'relative', zIndex: 1 }} {...fadeUp}>
          <h1 style={heroTitle}>
            Backend Services
            <br />
            Architecture
          </h1>
          <p style={heroSubtitle}>
            Complete documentation of the Driveway/Lithia microservices ecosystem.
            13+ backend services, 3 frontend applications, event-driven architecture,
            and multi-cloud infrastructure powering driveway.com.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <Badge label="Kotlin/Spring Boot" color="green" dot />
            <Badge label="MongoDB Atlas" color="yellow" dot />
            <Badge label="PostgreSQL" color="cyan" dot />
            <Badge label="Azure Service Bus" color="blue" dot />
            <Badge label="Azure AKS" color="purple" dot />
            <Badge label="Next.js / React" color="pink" dot />
          </div>
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
            description="The Driveway platform is a sophisticated microservices architecture serving B2C vehicle marketplace and B2B dealership management."
          />
        </motion.div>

        {/* Stats grid */}
        <motion.div style={gridCols(4)} {...fadeUp}>
          {[
            { value: '13+', label: 'Backend Services', color: c.accent },
            { value: '3', label: 'Frontend Apps', color: c.green },
            { value: '5', label: 'MongoDB Databases', color: c.yellow },
            { value: '4', label: 'PostgreSQL DBs', color: c.cyan },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              style={statCardStyle(s.color)}
              {...stagger(i)}
              whileHover={{ borderColor: s.color, boxShadow: `0 0 20px ${s.color}22` }}
            >
              <div style={statValue(s.color)}>{s.value}</div>
              <div style={statLabel}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Platform summary */}
        <motion.div style={{ marginTop: '2rem' }} {...fadeUp}>
          <Card title="Driveway Platform Architecture" variant="blue">
            <p style={paragraph}>
              The <strong style={{ color: c.text }}>Driveway</strong> platform powers the B2C online vehicle marketplace
              at <span style={inlineCode}>driveway.com</span> and the internal <strong style={{ color: c.text }}>FreewayCRM</strong> dealership
              management platform at <span style={inlineCode}>freeway.driveway.com</span>. All services are built with
              <strong style={{ color: c.text }}> Kotlin + Spring Boot</strong>, deployed on <strong style={{ color: c.text }}>Azure AKS</strong> (Kubernetes),
              and communicate via REST, GraphQL, and Azure Service Bus messaging.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <div style={tagStyle(c.green)}>
                <span style={legendDot(c.green)} />
                All services: Kotlin + JDK 21
              </div>
              <div style={tagStyle(c.accent)}>
                <span style={legendDot(c.accent)} />
                Deployment: Azure AKS (westus2)
              </div>
              <div style={tagStyle(c.purple)}>
                <span style={legendDot(c.purple)} />
                Observability: DataDog APM
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
            { label: 'Frontend', color: c.green },
            { label: 'Backend Service', color: c.accent },
            { label: 'Database', color: c.yellow },
            { label: 'Messaging', color: c.cyan },
            { label: 'External Vendor', color: c.purple },
            { label: 'API Gateway', color: c.pink },
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
      {/*  3. ECOSYSTEM DIAGRAM                                         */}
      {/* ============================================================ */}
      <section id="ecosystem-diagram" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Architecture"
            title="Full Ecosystem Diagram"
            description="Interactive diagram showing all services, databases, messaging, and external integrations. Zoom, pan, and explore."
          />
        </motion.div>

        <motion.div {...fadeUp}>
          <ReactFlowDiagram
            nodes={ecosystemNodes}
            edges={ecosystemEdges}
            title="Driveway Backend Ecosystem"
            height="700px"
          />
        </motion.div>

        <motion.div style={{ marginTop: '1rem' }} {...fadeUp}>
          <Callout type="info" title="Interactive Diagram">
            Use the controls to zoom and pan. The minimap shows your current viewport.
            Each node represents a service, database, or external integration in the ecosystem.
          </Callout>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  4. SERVICE EXPLORER                                          */}
      {/* ============================================================ */}
      <section id="service-explorer" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Services"
            title="Backend Service Explorer"
            description="Click any service to expand its full details. Filter by category or database type."
          />
        </motion.div>

        <motion.div {...fadeUp}>
          <ServiceExplorer />
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  5. SHOPPING FLOW                                             */}
      {/* ============================================================ */}
      <section id="shopping-flow" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Flow"
            title="Complete Shopping Flow"
            description="End-to-end sequence from browsing vehicles to completing a purchase with F&I products and financing."
          />
        </motion.div>

        {/* Visual flow summary */}
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
          <span style={flowBoxStyle(c.green)}>Customer</span>
          <span style={flowArrow}>&rarr;</span>
          <span style={flowBoxStyle(c.green)}>Driveway UI</span>
          <span style={flowArrow}>&rarr;</span>
          <span style={flowBoxStyle(c.pink)}>API Gateway</span>
          <span style={flowArrow}>&rarr;</span>
          <span style={flowBoxStyle(c.accent)}>Odyssey (Search)</span>
          <span style={flowArrow}>&rarr;</span>
          <span style={flowBoxStyle(c.accent)}>Cart Service</span>
          <span style={flowArrow}>&rarr;</span>
          <span style={flowBoxStyle(c.accent)}>Products API</span>
          <span style={flowArrow}>&rarr;</span>
          <span style={flowBoxStyle(c.yellow)}>Taxes & Fees</span>
          <span style={flowArrow}>&rarr;</span>
          <span style={flowBoxStyle(c.purple)}>Prequalification</span>
        </motion.div>

        <motion.div {...fadeUp}>
          <MermaidViewer
            title="Shopping Flow - Service Interaction Sequence"
            tabs={[{ label: 'Full Shopping Flow', source: mermaidShoppingFlow }]}
          />
        </motion.div>

        <motion.div style={{ marginTop: '1.5rem' }} {...fadeUp}>
          <FlowTimeline
            steps={[
              {
                number: 1,
                title: 'Vehicle Search (Odyssey)',
                description: 'Customer searches via Driveway UI. GraphQL query routes through API Gateway to Odyssey, which queries MongoDB Atlas (vehicleV3 collection) and enriches with MaxDigital photos.',
                color: c.accent,
              },
              {
                number: 2,
                title: 'Add to Cart (Cart Service)',
                description: 'Cart Service reserves the vehicle, fetches F&I products from Products API, tax estimates from Taxes & Fees, and incentive data from Incentives API. Publishes cart-status-update to Azure Service Bus.',
                color: c.pink,
              },
              {
                number: 3,
                title: 'F&I Products (Products API)',
                description: 'Returns 5 F&I products: LOF ($799), Valet ($599), VSC (dealerCost + $1500), T&W (dealerCost x 2.2), VLP (fixed $1095). Reads from MongoDB fi-rate cache.',
                color: c.green,
              },
              {
                number: 4,
                title: 'Tax Calculation (Taxes & Fees)',
                description: 'Vitu integration calculates state, county, city, and local taxes. Returns estimate for cart display. Detailed transactions processed later for Freeway CRM.',
                color: c.yellow,
              },
              {
                number: 5,
                title: 'Loan Prequalification (Prequalification API)',
                description: 'Equifax credit score check, DFC eligibility determination, FinCo data collection. Creates Salesforce lead for follow-up. Returns financing options.',
                color: c.purple,
              },
              {
                number: 6,
                title: 'Checkout & Salesforce (Cart + Salesforce Integration)',
                description: 'Cart Service finalizes the purchase, creates intents in Salesforce for dealer follow-up. Vehicle availability updated in Odyssey via Azure Service Bus.',
                color: c.orange,
              },
            ]}
          />
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  6. INVENTORY PIPELINE                                        */}
      {/* ============================================================ */}
      <section id="inventory-pipeline" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Pipeline"
            title="Vehicle Inventory Pipeline"
            description="How vehicle data flows from EDS through Odyssey to downstream services every 30 minutes."
          />
        </motion.div>

        <motion.div {...fadeUp}>
          <MermaidViewer
            title="EDS Inventory Import Pipeline"
            tabs={[{ label: 'Inventory Pipeline', source: mermaidInventoryPipeline }]}
          />
        </motion.div>

        <motion.div style={{ marginTop: '1.5rem' }} {...fadeUp}>
          <Card title="EDS Import Process (Odyssey Cron)" variant="blue">
            <p style={paragraph}>
              Every <strong style={{ color: c.text }}>30 minutes</strong>, the Odyssey cron module fetches GZIP-compressed TSV files
              from Azure Blob Storage at <span style={inlineCode}>inbound/CVP/Driveway-Merchandising-V2/*.gz</span>.
              Each row contains <strong style={{ color: c.text }}>76 fields</strong> per vehicle.
            </p>
          </Card>
        </motion.div>

        <motion.div style={{ marginTop: '1rem' }} {...fadeUp}>
          <FlowTimeline
            steps={[
              {
                number: 1,
                title: 'Fetch EDS Files',
                description: 'Odyssey cron (EdsVehicleReaderV2) reads GZIP TSV files from Azure Blob Storage. Each file contains the full vehicle catalog with 76 fields per row.',
                color: c.accent,
              },
              {
                number: 2,
                title: 'Stage in Temp Collection',
                description: 'Parsed vehicles written to temp_vehicleV3_<timestamp> collection in MongoDB for safe staging before live merge.',
                color: c.cyan,
              },
              {
                number: 3,
                title: 'Validate Delta',
                description: 'Compare staged data with live collection. If delta exceeds 15,000 vehicles, abort to prevent data corruption.',
                color: c.yellow,
              },
              {
                number: 4,
                title: 'Merge to Live',
                description: 'Upsert staged vehicles into live vehicleV3 collection. Mark vehicles not in the new file as DELETED status.',
                color: c.green,
              },
              {
                number: 5,
                title: 'Publish Deltas',
                description: 'Publish ADD/UPDATE/DELETE events to Azure Service Bus inventory-delta-topic. Consumed by Products API and Incentives API.',
                color: c.pink,
              },
              {
                number: 6,
                title: 'Cleanup',
                description: 'Hourly job deletes vehicles with DELETED status. Daily job at 08:10 drops temp collections older than 28 days.',
                color: c.red,
              },
            ]}
          />
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  7. CART & AVAILABILITY                                       */}
      {/* ============================================================ */}
      <section id="cart-availability" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Cart"
            title="Cart & Vehicle Availability"
            description="How the Cart Service coordinates with Odyssey via Azure Service Bus to manage vehicle availability."
          />
        </motion.div>

        <motion.div {...fadeUp}>
          <MermaidViewer
            title="Cart Status & Vehicle Availability"
            tabs={[{ label: 'Cart Status Flow', source: mermaidCartStatusFlow }]}
          />
        </motion.div>

        <motion.div style={{ marginTop: '1.5rem' }} {...fadeUp}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Card title="Cart Service Responsibilities" variant="pink">
              <p style={paragraph}>
                The Cart Service uses <strong style={{ color: c.text }}>Spring WebFlux</strong> with{' '}
                <strong style={{ color: c.text }}>Netflix DGS</strong> (GraphQL). It orchestrates the entire checkout
                flow by coordinating with 8+ backend services.
              </p>
              <p style={{ ...paragraph, margin: 0 }}>
                <strong style={{ color: c.text }}>Design Pattern:</strong> Spring application events for side
                effects keep core logic clean and testable.
              </p>
            </Card>
            <Card title="Vehicle Availability (Odyssey)" variant="cyan">
              <p style={paragraph}>
                The <strong style={{ color: c.text }}>Odyssey availability module</strong> subscribes to{' '}
                <span style={inlineCode}>cart-status-update-topic</span> on Azure Service Bus.
              </p>
              <p style={{ ...paragraph, margin: 0 }}>
                When a vehicle is added to cart, its <span style={inlineCode}>purchasePending</span> flag is set
                to <span style={inlineCode}>true</span>, preventing other users from purchasing the same vehicle.
              </p>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  8. LEASING DATA FLOW                                         */}
      {/* ============================================================ */}
      <section id="leasing-flow" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Leasing"
            title="Leasing & Incentives Data Flow"
            description="How Cox AIS data flows through the Incentives API pipeline to Odyssey vehicle records."
          />
        </motion.div>

        <motion.div {...fadeUp}>
          <MermaidViewer
            title="Leasing Data Pipeline"
            tabs={[{ label: 'Leasing Flow', source: mermaidLeasingFlow }]}
          />
        </motion.div>

        <motion.div style={{ marginTop: '1.5rem' }} {...fadeUp}>
          <Card title="Incentives API - 5 Internal Services" variant="orange">
            <p style={paragraph}>
              The Incentives API is actually <strong style={{ color: c.text }}>5 separate services</strong> within one repository,
              each handling a different part of the incentives pipeline:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {[
                { name: 'routes', desc: 'API endpoints for frontend & services', color: c.accent },
                { name: 'inventory-delta-receiver', desc: 'ASB listener for inventory updates', color: c.cyan },
                { name: 'region-sync', desc: 'Cron: Cox region data to PostgreSQL', color: c.green },
                { name: 'incentives-sync', desc: 'Cron: Cox incentives/leasing to PostgreSQL', color: c.yellow },
                { name: 'incentives-publisher', desc: 'Cron: Publish cached data to ASB', color: c.pink },
              ].map((svc, i) => (
                <motion.div
                  key={svc.name}
                  style={{
                    background: c.surface2,
                    border: `1px solid ${c.border}`,
                    borderLeft: `3px solid ${svc.color}`,
                    borderRadius: 8,
                    padding: '0.75rem',
                  }}
                  {...stagger(i)}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: svc.color }}>{svc.name}</div>
                  <div style={{ fontSize: '0.75rem', color: c.text2, marginTop: 4 }}>{svc.desc}</div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  9. AZURE SERVICE BUS                                         */}
      {/* ============================================================ */}
      <section id="service-bus" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Messaging"
            title="Azure Service Bus Topics"
            description="Event-driven communication between services using Azure Service Bus topics and subscriptions."
          />
        </motion.div>

        <motion.div {...fadeUp}>
          <DataTable
            headers={['Topic', 'Publisher', 'Subscribers', 'Purpose', 'Trigger']}
            rows={[
              [
                <span style={inlineCode}>inventory-delta-topic</span>,
                <Badge label="Odyssey" color="blue" />,
                'Products API, Incentives API',
                'Vehicle ADD/UPDATE/DELETE events',
                'EDS import cron (every 30 min)',
              ],
              [
                <span style={inlineCode}>leasing-incentives-topic</span>,
                <Badge label="Incentives" color="orange" />,
                'Odyssey Consumer',
                'Leasing & incentive data updates',
                'Incentives publisher cron',
              ],
              [
                <span style={inlineCode}>cart-status-update-topic</span>,
                <Badge label="Cart" color="pink" />,
                'Odyssey Availability',
                'Vehicle purchase-pending flag',
                'Cart add/remove/timeout',
              ],
            ]}
          />
        </motion.div>

        <motion.div style={{ marginTop: '1.5rem' }} {...fadeUp}>
          <CodeBlock
            language="yaml"
            filename="Azure Service Bus Configuration"
            code={`spring:
  cloud:
    azure:
      servicebus:
        connection-string: \${AZURE_SERVICEBUS_CONNECTION_STRING}

# Topic configurations per service
inventory-delta:
  topic-name: vehicle-inventory-delta
  subscription-name: products-api-sub
  max-concurrent-calls: 5
  auto-complete: false

leasing-incentives:
  topic-name: leasing-incentives-topic
  subscription-name: odyssey-consumer-sub

cart-status:
  topic-name: cart-status-update-topic
  subscription-name: odyssey-availability-sub`}
          />
        </motion.div>

        <motion.div style={{ marginTop: '1rem' }} {...fadeUp}>
          <Callout type="warning" title="Dead Letter Queue Monitoring">
            Messages that fail processing after maximum retry attempts are moved to the Dead Letter Queue (DLQ).
            Monitor the DLQ in Azure Portal for persistent failures -- these typically indicate API outages
            or invalid data that cannot be resolved automatically.
          </Callout>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  10. DATABASE ARCHITECTURE                                    */}
      {/* ============================================================ */}
      <section id="database-architecture" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Databases"
            title="Database Architecture"
            description="Two primary database engines: MongoDB Atlas for document-oriented data and PostgreSQL for relational data."
          />
        </motion.div>

        <motion.div {...fadeUp}>
          <MermaidViewer
            title="Database Architecture Overview"
            tabs={[{ label: 'DB Architecture', source: mermaidDbArchitecture }]}
          />
        </motion.div>

        <motion.div style={{ marginTop: '1.5rem' }} {...fadeUp}>
          <Tabs
            tabs={[
              {
                label: 'MongoDB Atlas',
                content: (
                  <div>
                    <h3 style={subheading}>MongoDB Collections by Service</h3>
                    <DataTable
                      headers={['Service', 'Database', 'Key Collections', 'Indexes']}
                      rows={[
                        [
                          <Badge label="Odyssey" color="blue" />,
                          'shopInventory',
                          'vehicleV3, searchSuggestion, postalCodeOemRegions, searchScoreWeights, inventoryJobDetails',
                          '22+ indexes (status, price, year, make/model, VIN, dealer, leasing)',
                        ],
                        [
                          <Badge label="Products API" color="green" />,
                          'products',
                          'fi-rate, fi-product-v2, pen-dealer-v2',
                          'vin (unique), nextRefreshDate, createdOn (TTL: 365d)',
                        ],
                        [
                          <Badge label="Cart Service" color="pink" />,
                          'cart',
                          'cart, checkout',
                          'userId, vehicleId, status',
                        ],
                        [
                          <Badge label="Prequalification" color="purple" />,
                          'prequalification',
                          'prequalifications',
                          'userId, email, vehicleId',
                        ],
                        [
                          <Badge label="Backpack" color="cyan" />,
                          'backpack-{env}',
                          'inspection, inspectionIntegration, savedOffers, ymmt',
                          'vin, userId, status',
                        ],
                      ]}
                    />
                  </div>
                ),
              },
              {
                label: 'PostgreSQL',
                content: (
                  <div>
                    <h3 style={subheading}>PostgreSQL Tables by Service</h3>
                    <DataTable
                      headers={['Service', 'Database', 'Key Tables', 'Migration Tool']}
                      rows={[
                        [
                          <Badge label="Account Center" color="cyan" />,
                          'account_center',
                          'users, saved_searches, favorites, addresses',
                          'Liquibase',
                        ],
                        [
                          <Badge label="Admin (Libra)" color="red" />,
                          'admin',
                          'dealerships, zones, regions, free_shipping_zones',
                          'Liquibase',
                        ],
                        [
                          <Badge label="Incentives" color="orange" />,
                          'incentives',
                          'incentives, leasing_data, cox_regions, vehicles',
                          'Spring Data JPA',
                        ],
                        [
                          <Badge label="Vehicle Service" color="purple" />,
                          'vehicles',
                          'vehicle_details',
                          'Spring Data JPA',
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
      {/*  11. API GATEWAY                                              */}
      {/* ============================================================ */}
      <section id="api-gateway" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Gateway"
            title="API Gateway Routing"
            description="Azure API Management (APIM) routes all external traffic to backend services."
          />
        </motion.div>

        <motion.div {...fadeUp}>
          <Card title="API Gateway Base URL" variant="pink">
            <p style={paragraph}>
              <span style={inlineCode}>https://api-gateway.{'{'} env {'}'}.driveway.cloud/</span>
            </p>
            <p style={{ ...paragraph, margin: 0 }}>
              All frontend applications communicate through this gateway. Each service is registered at a specific path prefix.
            </p>
          </Card>
        </motion.div>

        <motion.div style={{ marginTop: '1.5rem' }} {...fadeUp}>
          <DataTable
            headers={['Path', 'Service', 'Protocol', 'Description']}
            rows={[
              [<span style={inlineCode}>/shop/gql/v5/graphql</span>, 'Odyssey (Search)', 'GraphQL', 'Vehicle search & inventory queries'],
              [<span style={inlineCode}>/cart/v1</span>, 'Cart Service', 'GraphQL', 'Shopping cart mutations'],
              [<span style={inlineCode}>/account-center/v3</span>, 'Account Center', 'REST', 'User profiles, favorites, saved searches'],
              [<span style={inlineCode}>/products/v4</span>, 'Products API', 'REST', 'F&I product pricing'],
              [<span style={inlineCode}>/incentives/v1</span>, 'Incentives API', 'REST', 'Vehicle incentives & leasing'],
              [<span style={inlineCode}>/taxes-fees/v1</span>, 'Taxes & Fees', 'REST', 'Tax & fee calculations'],
              [<span style={inlineCode}>/prequalification/v1</span>, 'Prequalification', 'REST', 'Loan prequalification'],
              [<span style={inlineCode}>/sell/v10</span>, 'Backpack (Sell)', 'REST', 'Trade-in/sell flow'],
              [<span style={inlineCode}>/admin/v5</span>, 'Admin API', 'REST', 'Dealership configuration'],
              [<span style={inlineCode}>/salesforce/v2</span>, 'Salesforce Integration', 'REST', 'CRM gateway'],
            ]}
          />
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  12. AUTHENTICATION                                           */}
      {/* ============================================================ */}
      <section id="auth" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Auth"
            title="Authentication & Authorization"
            description="Two authentication strategies: Auth0 for customers, Azure AD for internal users."
          />
        </motion.div>

        <motion.div {...fadeUp}>
          <MermaidViewer
            title="Authentication Architecture"
            tabs={[{ label: 'Auth Flow', source: mermaidAuthFlow }]}
          />
        </motion.div>

        <motion.div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} {...fadeUp}>
          <Card title="Customer-Facing (Driveway UI)" variant="purple">
            <p style={paragraph}>
              <strong style={{ color: c.text }}>Auth0 (OAuth2)</strong> handles customer login. Bearer tokens
              are passed in the <span style={inlineCode}>Authorization</span> header. Optional API keys
              via <span style={inlineCode}>?key=</span> query parameter for public endpoints.
            </p>
            <p style={{ ...paragraph, margin: 0 }}>
              <strong style={{ color: c.text }}>BFF Pattern:</strong> Next.js API routes proxy backend calls,
              hiding internal service URLs from the client.
            </p>
          </Card>
          <Card title="Internal (Freeway UI)" variant="blue">
            <p style={paragraph}>
              <strong style={{ color: c.text }}>Azure AD</strong> with MSAL library. App Roles provide RBAC
              (e.g., <span style={inlineCode}>Inventory.Suppression.User</span>,{' '}
              <span style={inlineCode}>FeatureFlag.Administrator</span>).
            </p>
            <p style={{ ...paragraph, margin: 0 }}>
              AAD Groups map users to roles for fine-grained access control within the CRM.
            </p>
          </Card>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  13. EXTERNAL VENDORS                                         */}
      {/* ============================================================ */}
      <section id="external-vendors" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Vendors"
            title="External Vendor Integrations"
            description="Third-party services that power critical platform capabilities."
          />
        </motion.div>

        <motion.div {...fadeUp}>
          <DataTable
            headers={['Vendor', 'API Type', 'Purpose', 'Consuming Service']}
            rows={[
              ['Auth0', 'OAuth2 / REST', 'User identity & authentication', 'Account Center, Driveway UI'],
              ['PEN / Assurant', 'SOAP/XML', 'F&I product rates (VSC, T&W, VLP)', 'Products API'],
              ['MaxDigital', 'GraphQL', 'Vehicle photo galleries (6 sizes)', 'Odyssey'],
              ['Impel / SpinCar', 'REST', '360-degree vehicle spin photos', 'Odyssey'],
              ['Cox AIS', 'REST', 'Vehicle incentives & leasing data', 'Incentives API'],
              ['Vitu', 'REST', 'Tax/fee/registration calculation', 'Taxes & Fees API'],
              ['Equifax', 'REST', 'Credit score for prequalification', 'Prequalification API'],
              ['DFC (Ally)', 'REST', 'Financing eligibility determination', 'Prequalification API'],
              ['Salesforce', 'REST', 'CRM lead creation & management', 'Multiple services'],
              ['Google', 'REST', 'Recaptcha bot protection', 'Prequalification API'],
              ['Optimizely', 'REST', 'Feature flags & A/B testing', 'Multiple services'],
              ['Emailable', 'REST', 'Email verification', 'Account Center'],
              ['Contentful', 'GraphQL', 'CMS content & templates', 'Driveway UI'],
              ['TimeTap', 'REST', 'Appointment booking', 'Backpack (Sell)'],
            ]}
          />
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  14. FRONTEND APPLICATIONS                                    */}
      {/* ============================================================ */}
      <section id="frontend-apps" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Frontends"
            title="Frontend Applications"
            description="Three frontend applications serving different user personas."
          />
        </motion.div>

        <motion.div style={gridCols(3, '1rem')} {...fadeUp}>
          {[
            {
              name: 'Driveway UI',
              repo: 'UI',
              framework: 'Next.js 14 + React 18',
              auth: 'Auth0 (OAuth2)',
              url: 'driveway.com',
              description: 'B2C vehicle marketplace. Vehicle browsing, shopping cart, checkout with F&I, account management.',
              color: c.green,
              envs: ['dev.driveway.cloud', 'uat.driveway.cloud', 'canary.driveway.com', 'www.driveway.com'],
            },
            {
              name: 'Freeway UI',
              repo: 'Freeway-UI',
              framework: 'Create React App + TypeScript',
              auth: 'Azure AD (MSAL)',
              url: 'freeway.driveway.com',
              description: 'Internal CRM for dealership agents. Case management, inventory tools, agent workflows.',
              color: c.accent,
              envs: ['freeway.dev.driveway.cloud', 'freeway.uat.driveway.cloud', 'canary.freeway.driveway.com', 'freeway.driveway.com'],
            },
            {
              name: 'Dealerships Admin UI',
              repo: 'Dealerships-Admin-UI',
              framework: 'React + TypeScript',
              auth: 'Azure AD',
              url: 'dealerships-admin.dev.driveway.cloud',
              description: 'Dealership configuration management. Zone, region, and dealer settings.',
              color: c.purple,
              envs: ['dealerships-admin.dev.driveway.cloud'],
            },
          ].map((app, i) => (
            <motion.div
              key={app.name}
              style={{
                background: c.surface,
                border: `1px solid ${c.border}`,
                borderTop: `3px solid ${app.color}`,
                borderRadius: 14,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
              {...stagger(i)}
              whileHover={{ borderColor: app.color, boxShadow: `0 4px 24px ${app.color}15` }}
            >
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: app.color }}>{app.name}</h3>
              <p style={{ ...paragraph, margin: 0, fontSize: '0.84rem' }}>{app.description}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: '0.78rem', color: c.text2 }}>
                  <strong style={{ color: c.text }}>Framework:</strong> {app.framework}
                </div>
                <div style={{ fontSize: '0.78rem', color: c.text2 }}>
                  <strong style={{ color: c.text }}>Auth:</strong> {app.auth}
                </div>
                <div style={{ fontSize: '0.78rem', color: c.text2 }}>
                  <strong style={{ color: c.text }}>Repo:</strong> <span style={inlineCode}>{app.repo}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: c.text3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Environments
                </div>
                {app.envs.map((env) => (
                  <code key={env} style={{ fontSize: '0.72rem', color: c.text2, fontFamily: "'SF Mono', monospace" }}>
                    {env}
                  </code>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div style={{ marginTop: '1.5rem' }} {...fadeUp}>
          <Card title="Shared Component Library: Sequoia Design System" variant="orange">
            <p style={paragraph}>
              The <span style={inlineCode}>@driveway/react</span> package (distributed via Azure Artifacts) provides:
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['US States data', 'Custom Hooks', 'Providers', 'Driveway Theme (MUI)', 'Shared Components'].map((item) => (
                <span key={item} style={tagStyle(c.orange)}>
                  {item}
                </span>
              ))}
            </div>
          </Card>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  15. INFRASTRUCTURE                                           */}
      {/* ============================================================ */}
      <section id="infrastructure" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Infra"
            title="Infrastructure & Deployment"
            description="Azure-based infrastructure with Kubernetes orchestration and trunk-based development."
          />
        </motion.div>

        <motion.div style={gridCols(3, '1rem')} {...fadeUp}>
          {[
            {
              title: 'Compute',
              items: ['Azure AKS (Kubernetes)', 'Region: westus2', 'Dev: 1 replica', 'UAT: 3 replicas (3-12 scaling)', 'Prod: 3 replicas (3-12 scaling)'],
              color: c.accent,
            },
            {
              title: 'Observability',
              items: ['DataDog APM (tracing)', 'DataDog Metrics', 'DataDog Logging', 'Custom service metrics'],
              color: c.green,
            },
            {
              title: 'CI/CD',
              items: ['Azure DevOps Pipelines', 'Shared pipeline-templates repo', 'Azure Artifacts (Maven/npm)', 'GitVersion (semantic versioning)', 'Helm Charts per service'],
              color: c.pink,
            },
          ].map((section, i) => (
            <motion.div
              key={section.title}
              style={{
                background: c.surface,
                border: `1px solid ${c.border}`,
                borderRadius: 14,
                padding: '1.5rem',
                borderTop: `3px solid ${section.color}`,
              }}
              {...stagger(i)}
            >
              <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 700, color: section.color }}>{section.title}</h3>
              {section.items.map((item, j) => (
                <div key={j} style={{ fontSize: '0.84rem', color: c.text2, padding: '3px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: section.color, fontWeight: 700 }}>&#10003;</span>
                  {item}
                </div>
              ))}
            </motion.div>
          ))}
        </motion.div>

        <motion.div style={{ marginTop: '1.5rem' }} {...fadeUp}>
          <Tabs
            tabs={[
              {
                label: 'Docker Build',
                content: (
                  <div>
                    <CodeBlock
                      language="dockerfile"
                      filename="Dockerfile (typical service)"
                      code={`# Multi-stage build for Kotlin/Spring Boot services
FROM gradle:8.5-jdk21 AS builder
WORKDIR /app
COPY . .
RUN gradle bootJar --no-daemon

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

# DataDog agent
ADD https://dtdg.co/latest-java-tracer dd-java-agent.jar

ENTRYPOINT ["java", "-javaagent:dd-java-agent.jar", "-jar", "app.jar"]`}
                    />
                  </div>
                ),
              },
              {
                label: 'Spring Profiles',
                content: (
                  <div>
                    <p style={paragraph}>Each service uses Spring profiles for environment-specific configuration:</p>
                    <DataTable
                      headers={['Profile', 'Usage', 'Key Differences']}
                      rows={[
                        ['local', 'Developer machine', 'Localhost URLs, mock services, no auth'],
                        ['laptop', 'Dev without cron/ASB', 'Like local but cron jobs and ASB disabled'],
                        ['dev', 'Development AKS', 'Dev environment URLs, full integrations'],
                        ['uat', 'UAT AKS', 'UAT environment URLs, production-like'],
                        ['prod', 'Production AKS', 'Production URLs, full security, scaling'],
                        ['test', 'Unit/integration tests', 'In-memory DBs, mocked external APIs'],
                      ]}
                    />
                  </div>
                ),
              },
              {
                label: 'Environments',
                content: (
                  <div>
                    <p style={paragraph}>Four deployment environments with progressive promotion:</p>
                    <FlowTimeline
                      steps={[
                        { number: 1, title: 'Development (dev)', description: 'Auto-deployed on merge to main/develop. 1 replica. Full integration testing.', color: c.accent },
                        { number: 2, title: 'UAT', description: 'Auto-promoted from dev. 3 replicas with 3-12 auto-scaling. QA validation.', color: c.yellow },
                        { number: 3, title: 'Canary', description: 'Subset of prod traffic. Smoke testing with real users.', color: c.orange },
                        { number: 4, title: 'Production (prod)', description: 'Manual promotion after GO-NO-GO meeting. 3 replicas, 3-12 scaling.', color: c.green },
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
      {/*  16. REPOSITORIES                                             */}
      {/* ============================================================ */}
      <section id="repositories" style={sectionStyle}>
        <motion.div {...fadeUp}>
          <SectionHeader
            label="Repos"
            title="Repository Guide"
            description="All repositories in the Driveway/Lithia ecosystem with their roles and tech stacks."
          />
        </motion.div>

        <motion.div {...fadeUp}>
          <DataTable
            headers={['Repository', 'Type', 'Language', 'Database', 'Role']}
            rows={[
              [<strong style={{ color: c.accent }}>Odyssey-Api</strong>, <Badge label="Backend" color="blue" />, 'Kotlin', 'MongoDB', 'Vehicle inventory & search (5 modules)'],
              [<strong style={{ color: c.green }}>Products-Api</strong>, <Badge label="Backend" color="blue" />, 'Kotlin', 'MongoDB', 'F&I product pricing (3 modules)'],
              [<strong style={{ color: c.pink }}>cart-service</strong>, <Badge label="Backend" color="blue" />, 'Kotlin', 'MongoDB', 'Shopping cart orchestration (GraphQL)'],
              [<strong style={{ color: c.cyan }}>Account-Center-API</strong>, <Badge label="Backend" color="blue" />, 'Kotlin', 'PostgreSQL', 'User auth & profile management'],
              [<strong style={{ color: c.orange }}>Incentives-API</strong>, <Badge label="Backend" color="blue" />, 'Kotlin', 'PostgreSQL', 'Incentives & leasing pipeline (5 services)'],
              [<strong style={{ color: c.yellow }}>Taxes-And-Fees-API</strong>, <Badge label="Backend" color="blue" />, 'Kotlin', 'Vitu', 'Tax/fee calculations'],
              [<strong style={{ color: c.purple }}>Prequalification-API</strong>, <Badge label="Backend" color="blue" />, 'Kotlin', 'MongoDB', 'Loan prequalification'],
              [<strong style={{ color: c.red }}>Admin-API</strong>, <Badge label="Backend" color="blue" />, 'Kotlin', 'PostgreSQL', 'Dealership configuration (Libra)'],
              ['BackPack', <Badge label="Backend" color="blue" />, 'Kotlin', 'MongoDB', 'Sell/trade-in flow'],
              ['vehicle-service', <Badge label="Backend" color="blue" />, 'Kotlin', 'PostgreSQL', 'Vehicle domain (EDS data)'],
              ['Salesforce-Integration-API', <Badge label="Backend" color="blue" />, 'Kotlin', '-', 'Salesforce CRM gateway'],
              ['offer-api', <Badge label="Backend" color="blue" />, 'Kotlin', 'MongoDB', 'Consolidated offer management'],
              [<strong style={{ color: c.green }}>UI</strong>, <Badge label="Frontend" color="green" />, 'TypeScript', '-', 'Driveway.com (Next.js 14)'],
              ['Freeway-UI', <Badge label="Frontend" color="green" />, 'TypeScript', '-', 'Freeway CRM (CRA)'],
              ['Dealerships-Admin-UI', <Badge label="Frontend" color="green" />, 'TypeScript', '-', 'Admin dashboard'],
              ['Lib', <Badge label="Library" color="orange" />, 'TypeScript', '-', 'Sequoia Design System (@driveway/react)'],
              ['Salesforce-Integration-Library', <Badge label="Library" color="orange" />, 'Kotlin', '-', 'Shared Salesforce code'],
              ['BackendSpec', <Badge label="Spec" color="purple" />, 'YAML', '-', 'OpenAPI specs & data dictionary (Trillium)'],
            ]}
          />
        </motion.div>

        <motion.div style={{ marginTop: '1.5rem' }} {...fadeUp}>
          <Card title="Trillium Spec Viewer" variant="purple">
            <p style={paragraph}>
              The <span style={inlineCode}>BackendSpec</span> repo hosts all OpenAPI specifications and is viewable
              at <span style={inlineCode}>trillium.dev.driveway.cloud</span> (basic auth: roam-user).
              It includes Swagger UI for browsing APIs and Prism-based mock servers at{' '}
              <span style={inlineCode}>mocks.dev.driveway.cloud</span> for frontend development.
            </p>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
