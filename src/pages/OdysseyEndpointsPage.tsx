import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { useSidebar } from '../context/SidebarContext';
import SectionHeader from '../components/shared/SectionHeader';
import CodeBlock from '../components/shared/CodeBlock';
import Callout from '../components/shared/Callout';
import DataTable from '../components/shared/DataTable';
import MermaidViewer from '../components/diagrams/MermaidViewer';

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
  accent2: '#10b981',
  accent3: '#8b5cf6',
  orange: '#f59e0b',
  red: '#ef4444',
  pink: '#ec4899',
  cyan: '#06b6d4',
} as const;

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

/* ------------------------------------------------------------------ */
/*  TOC data                                                           */
/* ------------------------------------------------------------------ */
const tocItems = [
  { id: 'overview', label: 'API Overview' },
  { id: 'rest-endpoints', label: 'REST Endpoints' },
  { id: 'graphql-queries', label: 'GraphQL Queries' },
  { id: 'graphql-mutations', label: 'GraphQL Mutations' },
  { id: 'search-pipeline', label: 'Search Pipeline' },
  { id: 'third-party-apis', label: 'Third-Party Integrations' },
  { id: 'data-models', label: 'Data Models' },
  { id: 'database-collections', label: 'Database Collections' },
  { id: 'enums', label: 'Key Enums' },
  { id: 'vehicle-result', label: 'Vehicle Search Result' },
];

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
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
    'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.10) 40%, transparent 70%)',
  pointerEvents: 'none',
  zIndex: 0,
};

const heroContent: CSSProperties = {
  position: 'relative',
  zIndex: 1,
};

const heroTitle: CSSProperties = {
  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
  fontWeight: 800,
  lineHeight: 1.1,
  margin: '0 0 1.5rem',
  letterSpacing: '-0.03em',
  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
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

const statsRow: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1.5rem',
  marginTop: '2.5rem',
  flexWrap: 'wrap',
};

const statBox: CSSProperties = {
  textAlign: 'center',
  padding: '1rem 2rem',
  backgroundColor: c.surface,
  borderRadius: 12,
  border: `1px solid ${c.border}`,
  minWidth: 120,
  backdropFilter: 'blur(8px)',
};

const statVal: CSSProperties = {
  fontSize: '1.75rem',
  fontWeight: 800,
  color: c.accent,
};

const statLabel: CSSProperties = {
  fontSize: '0.75rem',
  color: c.text2,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginTop: 4,
};

const sectionSpacing: CSSProperties = {
  marginTop: '5rem',
};

const para: CSSProperties = {
  fontSize: '0.95rem',
  lineHeight: 1.8,
  color: c.text2,
  marginBottom: '1.25rem',
};

const subHeading: CSSProperties = {
  fontSize: '1.3rem',
  fontWeight: 700,
  color: c.text,
  marginTop: '2.5rem',
  marginBottom: '1rem',
};

const spacer: CSSProperties = { marginTop: '2rem' };

const cardGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1rem',
  marginTop: '1rem',
};

const infoCard: CSSProperties = {
  backgroundColor: c.surface,
  border: `1px solid ${c.border}`,
  borderRadius: 12,
  padding: '1.5rem',
  transition: 'all 0.2s ease',
};

const infoCardTitle: CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: c.text,
  marginBottom: '0.5rem',
};

const infoCardText: CSSProperties = {
  fontSize: '0.85rem',
  color: c.text2,
  lineHeight: 1.7,
};

const methodBadge = (method: string): CSSProperties => {
  const colors: Record<string, string> = {
    GET: c.accent2,
    POST: c.accent,
    DELETE: c.red,
    PUT: c.orange,
    PATCH: c.orange,
    QUERY: c.cyan,
    MUTATION: c.pink,
  };
  return {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: 6,
    fontSize: '0.7rem',
    fontWeight: 800,
    letterSpacing: '0.06em',
    color: '#000',
    backgroundColor: colors[method] || c.text3,
    marginRight: 8,
    verticalAlign: 'middle',
  };
};

const endpointPath: CSSProperties = {
  fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
  fontSize: '0.88rem',
  fontWeight: 600,
  color: c.text,
};

const endpointCard: CSSProperties = {
  backgroundColor: c.surface,
  border: `1px solid ${c.border}`,
  borderRadius: 12,
  padding: '1.5rem',
  marginBottom: '1.25rem',
  transition: 'all 0.2s ease',
};

const endpointDesc: CSSProperties = {
  fontSize: '0.85rem',
  color: c.text2,
  lineHeight: 1.7,
  marginTop: '0.75rem',
};

const detailList: CSSProperties = {
  margin: '0.75rem 0 0',
  paddingLeft: '1.2rem',
  fontSize: '0.83rem',
  color: c.text2,
  lineHeight: 1.8,
};

const sideBySide: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1rem',
  marginTop: '1rem',
};

const enumCard: CSSProperties = {
  backgroundColor: c.surface,
  border: `1px solid ${c.border}`,
  borderRadius: 12,
  padding: '1rem 1.25rem',
};

const enumTitle: CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 700,
  marginBottom: '0.5rem',
};

const enumList: CSSProperties = {
  margin: 0,
  paddingLeft: '1.2rem',
  fontSize: '0.82rem',
  color: c.text2,
  lineHeight: 1.7,
};

/* ------------------------------------------------------------------ */
/*  Mermaid diagram source strings                                     */
/* ------------------------------------------------------------------ */

const mermaidApiOverview = `graph TB
    subgraph External_Clients["External Clients"]
      A["Web App"]
      B["Mobile App"]
      C["Admin Portal"]
    end
    subgraph Odyssey_Api_Routes["Odyssey-Api Routes"]
      D["REST Endpoints<br/>/impel, /sink, /search"]
      E["GraphQL Mutations<br/>Availability, Categories, Features, Jobs"]
    end
    subgraph Odyssey_Search_GraphQL["Odyssey Search GraphQL"]
      F["GraphQL Queries<br/>search, facets, suggestions, vehicle lookup"]
    end
    A --> D
    A --> F
    B --> F
    C --> D
    C --> E
    D --> G[("MongoDB<br/>vehicleV3")]
    E --> G
    F --> G
    D --> H["Impel API"]
    D --> I["MaxDigital API"]
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style B fill:#1f6feb,stroke:#58a6ff,color:#fff
    style C fill:#1f6feb,stroke:#58a6ff,color:#fff
    style D fill:#238636,stroke:#3fb950,color:#fff
    style E fill:#6e40c9,stroke:#bc8cff,color:#fff
    style F fill:#6e40c9,stroke:#bc8cff,color:#fff
    style G fill:#d29922,stroke:#e3b341,color:#000
    style H fill:#da3633,stroke:#f85149,color:#fff
    style I fill:#da3633,stroke:#f85149,color:#fff`;

const mermaidRestRoutes = `graph LR
    subgraph ImpelNotificationRouter["ImpelNotificationRouter"]
      A["POST /impel/spin-notification"]
    end
    subgraph LeasingSinkRouter["LeasingSinkRouter"]
      B["GET /sink/leasing"]
    end
    subgraph SearchScoreWeightsRouter["SearchScoreWeightsRouter"]
      C["GET /search/score-weights"]
      D["GET /search/score-weights/templates"]
      E["POST /search/score-weights"]
      F["POST /search/score-weights/enable"]
      G["DELETE /search/score-weights"]
    end
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style B fill:#238636,stroke:#3fb950,color:#fff
    style C fill:#238636,stroke:#3fb950,color:#fff
    style D fill:#238636,stroke:#3fb950,color:#fff
    style E fill:#1f6feb,stroke:#58a6ff,color:#fff
    style F fill:#1f6feb,stroke:#58a6ff,color:#fff
    style G fill:#da3633,stroke:#f85149,color:#fff`;

const mermaidQueryArch = `graph TD
    subgraph Search_Module_Queries["Search Module Queries"]
      A["search"] --> B["VehicleResults"]
      C["getFacets"] --> D["FacetResults"]
      E["getSearchSuggestions"] --> F["VehicleSuggestionResults"]
      G["getVehicleByVin"] --> H["VehicleResult"]
      I["getVehicleById"] --> H
      J["getVehiclesById"] --> K["VehicleByIdResult array"]
      L["getVehiclesByVin"] --> K
      M["checkAvailabilityOfVin"] --> N["Boolean"]
      O["checkAvailabilityOfVehicleId"] --> N
    end
    subgraph Routes_Module_Queries["Routes Module Queries"]
      P["getManualSuppressions"] --> Q["AvailabilityResult"]
      R["getPurchasePendings"] --> Q
      S["getAllCategories"] --> T["CategoryResults"]
      U["getAllFeatures"] --> V["FeatureResults"]
      W["fetchSpinFor DEV ONLY"] --> X["String URL"]
    end
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style C fill:#1f6feb,stroke:#58a6ff,color:#fff
    style E fill:#1f6feb,stroke:#58a6ff,color:#fff
    style G fill:#6e40c9,stroke:#bc8cff,color:#fff
    style I fill:#6e40c9,stroke:#bc8cff,color:#fff
    style J fill:#6e40c9,stroke:#bc8cff,color:#fff
    style L fill:#6e40c9,stroke:#bc8cff,color:#fff
    style M fill:#238636,stroke:#3fb950,color:#fff
    style O fill:#238636,stroke:#3fb950,color:#fff
    style P fill:#d29922,stroke:#e3b341,color:#000
    style R fill:#d29922,stroke:#e3b341,color:#000
    style S fill:#d29922,stroke:#e3b341,color:#000
    style U fill:#d29922,stroke:#e3b341,color:#000
    style W fill:#da3633,stroke:#f85149,color:#fff`;

const mermaidMutationFlow = `graph TD
    A["updateManualSuppressions"] -->|"vins, suppress"| B[("vehicleV3")]
    C["updatePurchasePending"] -->|"vin, pending"| B
    D["updateCategories"] -->|"categories array"| E[("categories")]
    F["deleteCategoriesByName"] -->|"categoryNames"| E
    G["updateFeatures"] -->|"features array"| H[("features")]
    I["deleteFeaturesByName"] -->|"featureNames"| H
    J["killStalled"] -->|"kills RUNNING job"| K[("inventoryJobDetails")]
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style C fill:#1f6feb,stroke:#58a6ff,color:#fff
    style D fill:#238636,stroke:#3fb950,color:#fff
    style F fill:#da3633,stroke:#f85149,color:#fff
    style G fill:#238636,stroke:#3fb950,color:#fff
    style I fill:#da3633,stroke:#f85149,color:#fff
    style J fill:#d29922,stroke:#e3b341,color:#000
    style B fill:#d29922,stroke:#e3b341,color:#000
    style E fill:#d29922,stroke:#e3b341,color:#000
    style H fill:#d29922,stroke:#e3b341,color:#000
    style K fill:#d29922,stroke:#e3b341,color:#000`;

const mermaidSearchPipeline = `graph TD
    A["Search Request"] --> B["PipelineBuilder"]
    B --> C["SearchBlock - $search stage"]
    C --> D["CompoundBlock"]
    D --> E["FilterBuilder"]
    D --> F["TextBuilder"]
    D --> G["ScoreWeights"]
    E --> E1["status=ACTIVE"]
    E --> E2["manuallySuppressed=false"]
    E --> E3["Condition filter"]
    E --> E4["Make/Model/Trim"]
    E --> E5["Year/Mileage/Price ranges"]
    E --> E6["Color/Body/Fuel/Drive"]
    E --> E7["Leasing filter"]
    E --> E8["Free shipping filter"]
    F --> F1["Full-text on make,model,vin,bodyStyle"]
    F --> F2["Fuzzy matching max 1 edit"]
    F --> F3["Per-field boost scores"]
    G --> G1["Static factors"]
    G --> G2["Dynamic placeholders"]
    B --> H["PageBuilder - $skip + $limit"]
    B --> I["ShippingBuilder - $addFields"]
    B --> J["LeasingBuilder - $addFields"]
    B --> K["ProjectBuilder - $project"]
    B --> L["Parallel: SearchMetaBuilder - count + facets"]
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style B fill:#6e40c9,stroke:#bc8cff,color:#fff
    style C fill:#238636,stroke:#3fb950,color:#fff
    style D fill:#238636,stroke:#3fb950,color:#fff
    style E fill:#d29922,stroke:#e3b341,color:#000
    style F fill:#d29922,stroke:#e3b341,color:#000
    style G fill:#d29922,stroke:#e3b341,color:#000
    style H fill:#1f6feb,stroke:#58a6ff,color:#fff
    style I fill:#1f6feb,stroke:#58a6ff,color:#fff
    style J fill:#1f6feb,stroke:#58a6ff,color:#fff
    style K fill:#1f6feb,stroke:#58a6ff,color:#fff
    style L fill:#1f6feb,stroke:#58a6ff,color:#fff`;

const mermaidThirdParty = `graph LR
    subgraph Odyssey_Api["Odyssey-Api"]
      O["Core Service"]
    end
    subgraph MaxDigital["MaxDigital"]
      A["GraphQL API<br/>api.maxapps.io/graphql"]
      A1["GetGalleryImages query"]
    end
    subgraph Impel_SpinCar["Impel SpinCar"]
      B["REST API<br/>wa-detection-api.spincar.com"]
      B1["360-spin URLs"]
    end
    subgraph Libra["Libra"]
      CC["REST API<br/>admin-api/v5"]
      C1["GET /dealerships"]
      C2["GET /zones"]
    end
    subgraph Incentives["Incentives"]
      D["REST API<br/>incentives-api/v1"]
      D1["GET /regions"]
    end
    subgraph Tax_and_Fee["Tax and Fee"]
      E["REST API<br/>taxes-fees-api/v1"]
      E1["GET /shipping-config"]
    end
    O --> A
    O --> B
    O --> CC
    O --> D
    O --> E
    A --> A1
    B --> B1
    CC --> C1
    CC --> C2
    D --> D1
    E --> E1
    style O fill:#1f6feb,stroke:#58a6ff,color:#fff
    style A fill:#6e40c9,stroke:#bc8cff,color:#fff
    style B fill:#6e40c9,stroke:#bc8cff,color:#fff
    style CC fill:#238636,stroke:#3fb950,color:#fff
    style D fill:#238636,stroke:#3fb950,color:#fff
    style E fill:#238636,stroke:#3fb950,color:#fff`;

const mermaidVehicleModel = `classDiagram
    class Vehicle {
      +String vin
      +String vehicleId
      +InventoryStatus status
      +Ymmt ymmt
      +VehicleCondition vehicleCondition
      +Double price
      +Int priceInCents
      +Double msrp
      +Image image
      +Dealer dealer
      +Leasing leasing
      +Availability availability
      +List~CategoryFeatures~ categoryFeatures
      +Hints hints
    }
    class Ymmt {
      +Int year
      +String make
      +String model
      +String trim
    }
    class Leasing {
      +Boolean canLease
      +Int defaultPrice
      +List~RegionData~ regionalPrices
    }
    class Availability {
      +Boolean purchasePending
      +Boolean salesPending
      +Boolean salesBooked
      +Boolean inventoryInTransit
      +Boolean reconOrderOpen
      +Instant enqueuedTime
    }
    class Image {
      +String heroUrl
      +String spinUrl
      +Int count
    }
    class Dealer {
      +String id
      +String name
      +String state
      +String zip
      +Int region
    }
    class Hints {
      +Boolean freeShipping
      +Boolean greatDeal
      +Boolean newArrival
      +Boolean certified
    }
    Vehicle --> Ymmt
    Vehicle --> Leasing
    Vehicle --> Availability
    Vehicle --> Image
    Vehicle --> Dealer
    Vehicle --> Hints
    Leasing --> RegionData
    class RegionData {
      +Int regionId
      +Int amountInCents
      +String expiresOn
    }`;

const mermaidCollections = `graph TB
    subgraph shopInventory_Database["shopInventory Database"]
      A[("vehicleV3<br/>Live Inventory<br/>22+ indexes")]
      B[("searchSuggestion<br/>Autocomplete")]
      C[("searchScoreWeights<br/>Ranking Configs")]
      D[("inventoryJobDetails<br/>Job History")]
      E[("categories<br/>Feature Categories")]
      F[("features<br/>Vehicle Features")]
      G[("postalCodeOemRegions<br/>ZIP to Region")]
      H[("temp_vehicleV3_*<br/>Staging")]
    end
    subgraph Atlas_Search_Indexes["Atlas Search Indexes"]
      I["shopSearch - vehicleV3"]
      J["shopSuggestions - searchSuggestion"]
    end
    A --> I
    B --> J
    H -.->|"merge"| A
    style A fill:#d29922,stroke:#e3b341,color:#000
    style B fill:#d29922,stroke:#e3b341,color:#000
    style C fill:#d29922,stroke:#e3b341,color:#000
    style D fill:#d29922,stroke:#e3b341,color:#000
    style E fill:#d29922,stroke:#e3b341,color:#000
    style F fill:#d29922,stroke:#e3b341,color:#000
    style G fill:#d29922,stroke:#e3b341,color:#000
    style H fill:#6e40c9,stroke:#bc8cff,color:#fff
    style I fill:#1f6feb,stroke:#58a6ff,color:#fff
    style J fill:#1f6feb,stroke:#58a6ff,color:#fff`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function OdysseyEndpointsPage() {
  const { setSidebar, clearSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('Endpoints & APIs', tocItems);
    return () => clearSidebar();
  }, [setSidebar, clearSidebar]);

  return (
    <>
      {/* ============ HERO ============ */}
      <section style={heroSection}>
        <div style={heroGradientBg} />
        <motion.div style={heroContent} {...fadeUp}>
          <h1 style={heroTitle}>Odyssey-Api Endpoints &amp; GraphQL</h1>
          <p style={heroSubtitle}>
            Complete reference for every REST endpoint, GraphQL query and mutation,
            third-party integration, and database interaction in the Odyssey-Api project.
          </p>
          <div style={statsRow}>
            {[
              { val: '7', label: 'REST Endpoints' },
              { val: '15+', label: 'GraphQL Operations' },
              { val: '5', label: 'Third-Party APIs' },
              { val: '10', label: 'Collections' },
            ].map((s) => (
              <div key={s.label} style={statBox}>
                <div style={statVal}>{s.val}</div>
                <div style={statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 1: API OVERVIEW ============ */}
      <section id="overview" style={sectionSpacing}>
        <SectionHeader
          label="Architecture"
          title="API Overview"
          description="How external clients communicate with Odyssey-Api through REST endpoints and GraphQL operations"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            Odyssey-Api exposes two primary API surfaces. The <strong>REST endpoints</strong> (served by the
            <code style={{ color: c.accent }}> odyssey-api</code> routes module at <code style={{ color: c.accent }}>/shop/</code>)
            handle webhook notifications from Impel/SpinCar, provide leasing data sinks, and manage search score weight configurations.
            The <strong>GraphQL layer</strong> is split between the routes module (mutations for admin operations) and the
            <code style={{ color: c.accent }}> odyssey-search-graphql</code> module (queries for search, facets, vehicle lookups, and suggestions
            served at <code style={{ color: c.accent }}>/shop-graphql/</code>).
          </p>
          <p style={para}>
            All services connect to a shared <strong>MongoDB Atlas</strong> cluster housing the
            <code style={{ color: c.orange }}> shopInventory</code> database. Third-party integrations include MaxDigital for vehicle gallery
            images, Impel/SpinCar for 360-degree spin URLs, Libra for dealership data, Incentives API for OEM region mapping, and the
            Tax &amp; Fee API for shipping configuration.
          </p>
          <Callout type="info" title="Two GraphQL Endpoints">
            Mutations live in <strong>odyssey-api</strong> (routes module) at <code>/shop/graphql</code>.
            Queries live in <strong>odyssey-search-graphql</strong> (search module) at <code>/shop-graphql/graphql</code>.
            Both share type definitions from the <code>graphql-shared</code> library module.
          </Callout>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Overall API Architecture"
            tabs={[{ label: 'API Architecture', source: mermaidApiOverview }]}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 2: REST ENDPOINTS ============ */}
      <section id="rest-endpoints" style={sectionSpacing}>
        <SectionHeader
          label="HTTP Routes"
          title="REST Endpoints"
          description="All 7 REST endpoints exposed by the odyssey-api routes module"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The REST endpoints are organized into three routers: <strong>ImpelNotificationRouter</strong> for processing 360-degree
            spin notifications, <strong>LeasingSinkRouter</strong> for streaming new vehicle data for leasing, and
            <strong> SearchScoreWeightsRouter</strong> for managing the search ranking configuration. All routes are prefixed
            with <code style={{ color: c.accent }}>/shop</code> in production.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="REST Route Map"
            tabs={[{ label: 'All REST Routes', source: mermaidRestRoutes }]}
          />
        </motion.div>

        {/* POST /impel/spin-notification */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Impel Notification Router</h3>
          <div style={endpointCard}>
            <div>
              <span style={methodBadge('POST')}>POST</span>
              <span style={endpointPath}>/impel/spin-notification</span>
            </div>
            <p style={endpointDesc}>
              Processes 360-degree spin notifications from Impel (formerly SpinCar). When a vehicle spin is created, updated,
              or deleted, Impel sends a webhook to this endpoint. The handler validates the notification structure, payload
              integrity, client ID, and event type before fetching the spin URL and updating the vehicle record.
            </p>
            <ul style={detailList}>
              <li><strong>Validates:</strong> notification structure, payload presence, client ID match, event type (spin.created, spin.updated, spin.deleted)</li>
              <li><strong>Concurrency:</strong> Fetches spin URLs with up to 10 concurrent HTTP requests to the Impel detection API</li>
              <li><strong>Database:</strong> Updates <code>vehicle.image.spinUrl</code> in the <code>vehicleV3</code> collection</li>
              <li><strong>Error handling:</strong> Returns 200 OK even on validation failure (webhook pattern) - errors are logged</li>
              <li><strong>Event types:</strong> <code>spin.created</code> / <code>spin.updated</code> trigger URL fetch; <code>spin.deleted</code> clears the spinUrl</li>
            </ul>
          </div>

          <CodeBlock
            language="json"
            filename="POST /impel/spin-notification - Request Body"
            code={`{
  "event": "spin.created",
  "clientId": "driveway-client-id",
  "payload": {
    "vin": "1HGBH41JXMN109186",
    "spinId": "abc-123-def",
    "walkaroundUrl": "https://cdn.spincar.com/swipetospin/...",
    "interiorUrl": "https://cdn.spincar.com/swipetospin/.../interior"
  }
}`}
          />

          <div style={{ marginTop: '1rem' }}>
            <CodeBlock
              language="json"
              filename="POST /impel/spin-notification - Response 200 OK"
              code={`{
  "status": "processed",
  "vin": "1HGBH41JXMN109186",
  "spinUrl": "https://cdn.spincar.com/swipetospin/..."
}`}
            />
          </div>
        </motion.div>

        {/* GET /sink/leasing */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Leasing Sink Router</h3>
          <div style={endpointCard}>
            <div>
              <span style={methodBadge('GET')}>GET</span>
              <span style={endpointPath}>/sink/leasing</span>
            </div>
            <p style={endpointDesc}>
              Streams new vehicles for leasing in NDJSON (Newline-Delimited JSON) format. This endpoint is consumed by
              external leasing services that need a feed of vehicles eligible for lease pricing. Each line is a complete
              JSON object. The response uses OpenTracing for performance metrics.
            </p>
            <ul style={detailList}>
              <li><strong>Content-Type:</strong> <code>application/x-ndjson</code></li>
              <li><strong>Fields returned:</strong> year, vin, make, hints, msrp, priceInCents, dealer</li>
              <li><strong>Filtering:</strong> Only vehicles with <code>status = ACTIVE</code> and valid pricing</li>
              <li><strong>Tracing:</strong> Uses OpenTracing spans for latency monitoring</li>
              <li><strong>Streaming:</strong> Reactive stream (Flux) - does not buffer all vehicles in memory</li>
            </ul>
          </div>

          <CodeBlock
            language="json"
            filename="GET /sink/leasing - Response (NDJSON stream)"
            code={`{"year":2024,"vin":"1HGBH41JXMN109186","make":"Honda","hints":{"freeShipping":true},"msrp":32500.00,"priceInCents":3095000,"dealer":{"id":"D001","name":"Honda of Portland","state":"OR","zip":"97201","region":1}}
{"year":2025,"vin":"5YJSA1E26MF123456","make":"Tesla","hints":{"greatDeal":true},"msrp":44990.00,"priceInCents":4299000,"dealer":{"id":"D042","name":"Tesla Direct","state":"CA","zip":"94025","region":5}}`}
          />
        </motion.div>

        {/* SearchScoreWeightsRouter */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Search Score Weights Router</h3>

          {/* GET /search/score-weights */}
          <div style={endpointCard}>
            <div>
              <span style={methodBadge('GET')}>GET</span>
              <span style={endpointPath}>/search/score-weights</span>
            </div>
            <p style={endpointDesc}>
              Retrieves search score weight configurations. Optionally filtered by <code>sortType</code> query parameter.
              Returns versioned <code>SearchScoreWeights</code> documents with all weight factors used in Atlas Search scoring.
            </p>
            <ul style={detailList}>
              <li><strong>Query params:</strong> <code>sortType</code> (optional) - filter by a specific SortType enum value</li>
              <li><strong>Returns:</strong> Array of <code>SearchScoreWeights</code> objects, each with version number, enabled flag, and weight map</li>
              <li><strong>Collection:</strong> <code>searchScoreWeights</code></li>
            </ul>
          </div>

          {/* GET /search/score-weights/templates */}
          <div style={{ ...endpointCard, marginTop: '1rem' }}>
            <div>
              <span style={methodBadge('GET')}>GET</span>
              <span style={endpointPath}>/search/score-weights/templates</span>
            </div>
            <p style={endpointDesc}>
              Lists all available <code>SearchBlockTemplate</code> enum values. These templates define the structure of
              score weight blocks that can be configured for each sort type. Used by admin tools to show available
              configuration options.
            </p>
            <ul style={detailList}>
              <li><strong>Returns:</strong> Array of template names (strings matching the SearchBlockTemplate enum)</li>
              <li><strong>No parameters required</strong></li>
            </ul>
          </div>

          {/* POST /search/score-weights */}
          <div style={{ ...endpointCard, marginTop: '1rem' }}>
            <div>
              <span style={methodBadge('POST')}>POST</span>
              <span style={endpointPath}>/search/score-weights</span>
            </div>
            <p style={endpointDesc}>
              Creates a new versioned search score weight configuration. The version number is automatically incremented
              per SortType. All weight values must be greater than zero. New configs are created in a disabled state.
            </p>
            <ul style={detailList}>
              <li><strong>Validation:</strong> All weight values must be &gt; 0</li>
              <li><strong>Versioning:</strong> Auto-increments version per SortType (e.g., HIGH_PRICE_NEW_CAR v1, v2, v3...)</li>
              <li><strong>Default state:</strong> Created as <code>enabled = false</code></li>
              <li><strong>Collection:</strong> Inserts into <code>searchScoreWeights</code></li>
            </ul>
          </div>

          <CodeBlock
            language="json"
            filename="POST /search/score-weights - Request Body"
            code={`{
  "sortType": "HIGH_PRICE_NEW_CAR",
  "weights": {
    "priceWeight": 1.5,
    "mileageWeight": 0.8,
    "yearWeight": 1.2,
    "dealerDistanceWeight": 0.5,
    "photoCountWeight": 0.3,
    "daysOnLotWeight": 0.7
  }
}`}
          />

          {/* POST /search/score-weights/enable */}
          <div style={{ ...endpointCard, marginTop: '1.25rem' }}>
            <div>
              <span style={methodBadge('POST')}>POST</span>
              <span style={endpointPath}>/search/score-weights/enable</span>
            </div>
            <p style={endpointDesc}>
              Enables a specific version of a SortType configuration. Only one version per SortType can be active at any
              given time. Enabling a new version automatically disables the previously enabled version.
            </p>
            <ul style={detailList}>
              <li><strong>Constraint:</strong> Only one version per SortType can be enabled</li>
              <li><strong>Side effect:</strong> Disables the previously active version for the same SortType</li>
              <li><strong>Required params:</strong> <code>sortType</code> and <code>version</code></li>
            </ul>
          </div>

          {/* DELETE /search/score-weights */}
          <div style={{ ...endpointCard, marginTop: '1.25rem' }}>
            <div>
              <span style={methodBadge('DELETE')}>DELETE</span>
              <span style={endpointPath}>/search/score-weights</span>
            </div>
            <p style={endpointDesc}>
              Deletes a non-enabled version of a score weight configuration. Cannot delete the currently enabled version
              to prevent accidental removal of active scoring rules.
            </p>
            <ul style={detailList}>
              <li><strong>Guard:</strong> Cannot delete a version where <code>enabled = true</code></li>
              <li><strong>Required params:</strong> <code>sortType</code> and <code>version</code></li>
              <li><strong>Error:</strong> Returns 400 Bad Request if attempting to delete an enabled version</li>
            </ul>
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 3: GRAPHQL QUERIES ============ */}
      <section id="graphql-queries" style={sectionSpacing}>
        <SectionHeader
          label="GraphQL"
          title="GraphQL Queries"
          description="All read operations exposed via the GraphQL API across search and routes modules"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            GraphQL queries are split between the <strong>search module</strong> (odyssey-search-graphql) and the
            <strong> routes module</strong> (odyssey-api). The search module handles all vehicle search, facet retrieval,
            suggestion/autocomplete, and vehicle lookup queries. The routes module exposes admin queries for
            manual suppressions, purchase pendings, categories, and features.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="GraphQL Query Architecture"
            tabs={[{ label: 'Query Map', source: mermaidQueryArch }]}
          />
        </motion.div>

        {/* Search module queries */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Search Module Queries</h3>

          <div style={endpointCard}>
            <div>
              <span style={methodBadge('QUERY')}>QUERY</span>
              <span style={endpointPath}>search(filters, sort, pagination)</span>
            </div>
            <p style={endpointDesc}>
              The primary vehicle search query. Builds a MongoDB Atlas Search aggregation pipeline with compound filters,
              text matching, scoring, pagination, and parallel facet counting. Returns paginated vehicle results with
              total count and facet breakdowns.
            </p>
            <ul style={detailList}>
              <li><strong>Parameters:</strong> SearchInput (text, filters, sortType, page, pageSize, postalCode)</li>
              <li><strong>Returns:</strong> VehicleResults (vehicles, totalCount, facets)</li>
              <li><strong>Collection:</strong> <code>vehicleV3</code> via Atlas Search index <code>shopSearch</code></li>
              <li><strong>Pipeline stages:</strong> $search, $skip, $limit, $addFields (shipping, leasing), $project</li>
            </ul>
          </div>

          <div style={{ ...endpointCard, marginTop: '1rem' }}>
            <div>
              <span style={methodBadge('QUERY')}>QUERY</span>
              <span style={endpointPath}>getFacets(filters)</span>
            </div>
            <p style={endpointDesc}>
              Retrieves facet counts for the current filter set. Returns counts for make, model, body style, fuel type,
              drivetrain, color, year range, price range, and mileage range. Used to populate filter sidebar counts.
            </p>
            <ul style={detailList}>
              <li><strong>Parameters:</strong> SearchInput (same filters as search, without pagination)</li>
              <li><strong>Returns:</strong> FacetResults (facet name, values with counts)</li>
              <li><strong>Implementation:</strong> Uses $searchMeta with facet collector in parallel with search</li>
            </ul>
          </div>

          <div style={{ ...endpointCard, marginTop: '1rem' }}>
            <div>
              <span style={methodBadge('QUERY')}>QUERY</span>
              <span style={endpointPath}>getSearchSuggestions(text)</span>
            </div>
            <p style={endpointDesc}>
              Powers the autocomplete search bar. Queries the <code>searchSuggestion</code> collection using the
              Atlas Search <code>shopSuggestions</code> index with autocomplete operator.
            </p>
            <ul style={detailList}>
              <li><strong>Parameters:</strong> text (String) - partial search input from user</li>
              <li><strong>Returns:</strong> VehicleSuggestionResults (label, count, type)</li>
              <li><strong>Collection:</strong> <code>searchSuggestion</code> via Atlas Search index <code>shopSuggestions</code></li>
            </ul>
          </div>

          <div style={{ ...endpointCard, marginTop: '1rem' }}>
            <div>
              <span style={methodBadge('QUERY')}>QUERY</span>
              <span style={endpointPath}>getVehicleByVin(vin) / getVehicleById(id)</span>
            </div>
            <p style={endpointDesc}>
              Single vehicle lookup queries. Return a full <code>VehicleResult</code> with all ~35 fields for the
              Vehicle Detail Page (VDP). Both query the <code>vehicleV3</code> collection directly (no Atlas Search).
            </p>
            <ul style={detailList}>
              <li><strong>Parameters:</strong> vin (String) or vehicleId (String)</li>
              <li><strong>Returns:</strong> VehicleResult (single vehicle with all fields)</li>
              <li><strong>Collection:</strong> <code>vehicleV3</code> (direct MongoDB query)</li>
            </ul>
          </div>

          <div style={{ ...endpointCard, marginTop: '1rem' }}>
            <div>
              <span style={methodBadge('QUERY')}>QUERY</span>
              <span style={endpointPath}>getVehiclesById(ids) / getVehiclesByVin(vins)</span>
            </div>
            <p style={endpointDesc}>
              Batch vehicle lookup queries. Return arrays of <code>VehicleByIdResult</code> objects. Used when
              the frontend needs to load multiple vehicles simultaneously (e.g., comparison view, saved vehicles).
            </p>
            <ul style={detailList}>
              <li><strong>Parameters:</strong> ids (String array) or vins (String array)</li>
              <li><strong>Returns:</strong> Array of VehicleByIdResult</li>
              <li><strong>Collection:</strong> <code>vehicleV3</code> (direct MongoDB query with $in)</li>
            </ul>
          </div>

          <div style={{ ...endpointCard, marginTop: '1rem' }}>
            <div>
              <span style={methodBadge('QUERY')}>QUERY</span>
              <span style={endpointPath}>checkAvailabilityOfVin(vin) / checkAvailabilityOfVehicleId(id)</span>
            </div>
            <p style={endpointDesc}>
              Quick availability checks. Returns a boolean indicating whether a vehicle is currently available
              (not purchase-pending, not manually suppressed, status is ACTIVE). Used by cart service before checkout.
            </p>
            <ul style={detailList}>
              <li><strong>Parameters:</strong> vin (String) or vehicleId (String)</li>
              <li><strong>Returns:</strong> Boolean</li>
              <li><strong>Logic:</strong> <code>status == ACTIVE && !manuallySuppressed && !purchasePending</code></li>
            </ul>
          </div>

          <CodeBlock
            language="graphql"
            filename="Example: search query"
            code={`query SearchVehicles($input: SearchInput!) {
  search(input: $input) {
    totalCount
    vehicles {
      vin
      vehicleId
      year
      make
      model
      trim
      price
      mileage
      bodyStyle
      vehicleCondition
      image {
        heroUrl
        spinUrl
        count
      }
      dealer {
        name
        state
        zip
      }
      leasing {
        canLease
        defaultPrice
      }
      hints {
        freeShipping
        greatDeal
      }
    }
    facets {
      name
      values {
        value
        count
      }
    }
  }
}`}
          />
        </motion.div>

        {/* Routes module queries */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Routes Module Queries (Admin)</h3>

          <div style={endpointCard}>
            <div>
              <span style={methodBadge('QUERY')}>QUERY</span>
              <span style={endpointPath}>getManualSuppressions / getPurchasePendings</span>
            </div>
            <p style={endpointDesc}>
              Admin queries that return lists of vehicles with specific availability flags. <code>getManualSuppressions</code> returns
              all vehicles where <code>manuallySuppressed = true</code>. <code>getPurchasePendings</code> returns vehicles where
              <code> availability.purchasePending = true</code>.
            </p>
            <ul style={detailList}>
              <li><strong>Returns:</strong> AvailabilityResult (array of vehicle summaries with VIN, vehicleId, status)</li>
              <li><strong>Collection:</strong> <code>vehicleV3</code></li>
              <li><strong>Access:</strong> Admin portal only</li>
            </ul>
          </div>

          <div style={{ ...endpointCard, marginTop: '1rem' }}>
            <div>
              <span style={methodBadge('QUERY')}>QUERY</span>
              <span style={endpointPath}>getAllCategories / getAllFeatures</span>
            </div>
            <p style={endpointDesc}>
              Retrieve all category or feature definitions. Categories group vehicle features (e.g., "Safety", "Comfort").
              Features are individual vehicle attributes (e.g., "Blind Spot Monitor", "Heated Seats").
            </p>
            <ul style={detailList}>
              <li><strong>getAllCategories returns:</strong> CategoryResults (name, displayName, features list)</li>
              <li><strong>getAllFeatures returns:</strong> FeatureResults (name, displayName, category)</li>
              <li><strong>Collections:</strong> <code>categories</code> and <code>features</code></li>
            </ul>
          </div>

          <div style={{ ...endpointCard, marginTop: '1rem' }}>
            <div>
              <span style={methodBadge('QUERY')}>QUERY</span>
              <span style={endpointPath}>fetchSpinFor(vin) - DEV ONLY</span>
            </div>
            <p style={endpointDesc}>
              Development-only query that manually triggers the Impel/SpinCar spin URL fetch for a given VIN.
              Useful for testing the Impel integration without waiting for a webhook notification.
            </p>
            <ul style={detailList}>
              <li><strong>Parameters:</strong> vin (String)</li>
              <li><strong>Returns:</strong> String (the spin URL or null)</li>
              <li><strong>Environment:</strong> Only available on DEV and LAPTOP profiles</li>
            </ul>
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 4: GRAPHQL MUTATIONS ============ */}
      <section id="graphql-mutations" style={sectionSpacing}>
        <SectionHeader
          label="GraphQL"
          title="GraphQL Mutations"
          description="All write operations exposed via GraphQL for admin and system operations"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            GraphQL mutations live exclusively in the <strong>routes module</strong> (odyssey-api). They handle
            administrative operations like manual vehicle suppression, purchase pending updates, category/feature
            management, and job control. Several test-only mutations exist on DEV/LAPTOP profiles.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Mutation Data Flow"
            tabs={[{ label: 'Mutation Flow', source: mermaidMutationFlow }]}
          />
        </motion.div>

        {/* Production mutations */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Production Mutations</h3>

          <div style={endpointCard}>
            <div>
              <span style={methodBadge('MUTATION')}>MUTATION</span>
              <span style={endpointPath}>updateManualSuppressions(vins, suppress)</span>
            </div>
            <p style={endpointDesc}>
              Manually suppress or unsuppress vehicles by VIN. Suppressed vehicles are excluded from search results
              and availability checks. Used by admin portal to hide problematic vehicles.
            </p>
            <ul style={detailList}>
              <li><strong>Parameters:</strong> vins (String array), suppress (Boolean)</li>
              <li><strong>Returns:</strong> AvailabilityResult (updated vehicle summaries)</li>
              <li><strong>Collection:</strong> <code>vehicleV3</code> - sets <code>manuallySuppressed</code> field</li>
              <li><strong>Search impact:</strong> Suppressed vehicles are filtered out by <code>FilterBuilder</code> (<code>manuallySuppressed = false</code>)</li>
            </ul>
          </div>

          <div style={{ ...endpointCard, marginTop: '1rem' }}>
            <div>
              <span style={methodBadge('MUTATION')}>MUTATION</span>
              <span style={endpointPath}>updatePurchasePending(vin, pending)</span>
            </div>
            <p style={endpointDesc}>
              Updates the purchase pending status for a vehicle. Normally set automatically by the cart availability
              subscriber, but this mutation allows manual override by administrators.
            </p>
            <ul style={detailList}>
              <li><strong>Parameters:</strong> vin (String), pending (Boolean)</li>
              <li><strong>Returns:</strong> AvailabilityResult</li>
              <li><strong>Collection:</strong> <code>vehicleV3</code> - updates <code>availability.purchasePending</code></li>
            </ul>
          </div>

          <div style={{ ...endpointCard, marginTop: '1rem' }}>
            <div>
              <span style={methodBadge('MUTATION')}>MUTATION</span>
              <span style={endpointPath}>updateCategories(categories)</span>
            </div>
            <p style={endpointDesc}>
              Upserts category definitions. Categories organize vehicle features into groups displayed on the search
              results page and vehicle detail page. Uses upsert semantics - creates new or updates existing by name.
            </p>
            <ul style={detailList}>
              <li><strong>Parameters:</strong> categories (Array of CategoryInput: name, displayName, features)</li>
              <li><strong>Returns:</strong> CategoryResults</li>
              <li><strong>Collection:</strong> <code>categories</code></li>
              <li><strong>Semantics:</strong> Upsert by category name</li>
            </ul>
          </div>

          <div style={{ ...endpointCard, marginTop: '1rem' }}>
            <div>
              <span style={methodBadge('MUTATION')}>MUTATION</span>
              <span style={endpointPath}>deleteCategoriesByName(categoryNames)</span>
            </div>
            <p style={endpointDesc}>
              Deletes categories by their names. Removes the category documents from the collection entirely.
            </p>
            <ul style={detailList}>
              <li><strong>Parameters:</strong> categoryNames (String array)</li>
              <li><strong>Returns:</strong> CategoryResults (remaining categories)</li>
              <li><strong>Collection:</strong> <code>categories</code></li>
            </ul>
          </div>

          <div style={{ ...endpointCard, marginTop: '1rem' }}>
            <div>
              <span style={methodBadge('MUTATION')}>MUTATION</span>
              <span style={endpointPath}>updateFeatures(features)</span>
            </div>
            <p style={endpointDesc}>
              Upserts feature definitions. Features are individual vehicle attributes like "Blind Spot Monitor" or
              "Apple CarPlay". Each feature belongs to a category.
            </p>
            <ul style={detailList}>
              <li><strong>Parameters:</strong> features (Array of FeatureInput: name, displayName, category)</li>
              <li><strong>Returns:</strong> FeatureResults</li>
              <li><strong>Collection:</strong> <code>features</code></li>
            </ul>
          </div>

          <div style={{ ...endpointCard, marginTop: '1rem' }}>
            <div>
              <span style={methodBadge('MUTATION')}>MUTATION</span>
              <span style={endpointPath}>deleteFeaturesByName(featureNames)</span>
            </div>
            <p style={endpointDesc}>
              Deletes features by their names. Removes feature documents from the collection.
            </p>
            <ul style={detailList}>
              <li><strong>Parameters:</strong> featureNames (String array)</li>
              <li><strong>Returns:</strong> FeatureResults (remaining features)</li>
              <li><strong>Collection:</strong> <code>features</code></li>
            </ul>
          </div>

          <div style={{ ...endpointCard, marginTop: '1rem' }}>
            <div>
              <span style={methodBadge('MUTATION')}>MUTATION</span>
              <span style={endpointPath}>killStalled</span>
            </div>
            <p style={endpointDesc}>
              Emergency mutation to kill a stalled inventory import job. Finds any job with <code>status = RUNNING</code>
              in the <code>inventoryJobDetails</code> collection and sets it to <code>FAILED</code>. This unblocks
              the next scheduled import from starting.
            </p>
            <ul style={detailList}>
              <li><strong>Parameters:</strong> none</li>
              <li><strong>Returns:</strong> Boolean (true if a job was killed)</li>
              <li><strong>Collection:</strong> <code>inventoryJobDetails</code></li>
              <li><strong>Use case:</strong> When a cron job hangs and prevents subsequent imports</li>
            </ul>
          </div>

          <CodeBlock
            language="graphql"
            filename="Example: updateManualSuppressions mutation"
            code={`mutation SuppressVehicles($vins: [String!]!, $suppress: Boolean!) {
  updateManualSuppressions(vins: $vins, suppress: $suppress) {
    vehicles {
      vin
      vehicleId
      manuallySuppressed
      status
    }
  }
}

# Variables:
# {
#   "vins": ["1HGBH41JXMN109186", "5YJSA1E26MF123456"],
#   "suppress": true
# }`}
          />
        </motion.div>

        {/* Test-only mutations */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Test-Only Mutations (DEV / LAPTOP)</h3>
          <Callout type="warning" title="Development Profiles Only">
            These mutations are only available when running with <code>spring.profiles.active</code> set to
            <code> dev</code> or <code>laptop</code>. They are not deployed to staging or production.
          </Callout>

          <div style={{ ...cardGrid, marginTop: '1.25rem' }}>
            <div style={infoCard}>
              <div style={infoCardTitle}>inputTestVehicle</div>
              <div style={infoCardText}>
                Inserts a vehicle directly into <code>vehicleV3</code> from a raw JSON input. Bypasses the entire
                EDS import pipeline. Used for integration testing.
              </div>
            </div>
            <div style={infoCard}>
              <div style={infoCardTitle}>createTestVehicle</div>
              <div style={infoCardText}>
                Creates a vehicle with auto-generated test data. Generates a random VIN, dealer, and pricing. Faster
                than <code>inputTestVehicle</code> for basic tests.
              </div>
            </div>
            <div style={infoCard}>
              <div style={infoCardTitle}>deleteTestVehicle</div>
              <div style={infoCardText}>
                Deletes a specific test vehicle by VIN. Used for cleanup after integration tests complete.
              </div>
            </div>
            <div style={infoCard}>
              <div style={infoCardTitle}>dumpTestVehicleCollection</div>
              <div style={infoCardText}>
                Drops the entire <code>vehicleV3</code> collection and recreates it empty. Nuclear option for
                resetting test state. Guarded by profile check.
              </div>
            </div>
            <div style={infoCard}>
              <div style={infoCardTitle}>testSearch / testGetFacets</div>
              <div style={infoCardText}>
                Mirror versions of <code>search</code> and <code>getFacets</code> queries that run against a
                test-specific Atlas Search index. Allows testing search changes without affecting production index.
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 5: SEARCH PIPELINE ============ */}
      <section id="search-pipeline" style={sectionSpacing}>
        <SectionHeader
          label="Deep Dive"
          title="Search Pipeline"
          description="How the MongoDB Atlas Search aggregation pipeline is built and scored"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The search pipeline is the most complex piece of the Odyssey-Api. When a <code>search</code> query arrives,
            the <strong>PipelineBuilder</strong> assembles a multi-stage MongoDB aggregation pipeline. The pipeline starts
            with a <code>$search</code> stage (powered by Atlas Search), followed by pagination, computed fields for
            shipping and leasing, and a projection stage. A parallel pipeline runs <code>$searchMeta</code> for facet
            counts and total result count.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Search Pipeline Architecture"
            tabs={[{ label: 'Pipeline Stages', source: mermaidSearchPipeline }]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Sort Types</h3>
          <p style={para}>
            Each sort type corresponds to a different set of score weights that influence how vehicles are ranked in
            search results. The <code>SearchScoreWeights</code> system allows multiple versioned configurations per
            sort type, with only one version enabled at a time.
          </p>
          <DataTable
            headers={['SortType', 'Description', 'Primary Scoring Factor']}
            rows={[
              ['HIGH_PRICE_NEW_CAR', 'New cars sorted by highest price first', 'Price descending + year boost'],
              ['LOW_PRICE_NEW_CAR', 'New cars sorted by lowest price first', 'Price ascending + year boost'],
              ['HIGH_PRICE_USED_CAR', 'Used cars sorted by highest price first', 'Price descending + mileage factor'],
              ['LOW_PRICE_USED_CAR', 'Used cars sorted by lowest price first', 'Price ascending + mileage factor'],
              ['LOW_MILEAGE', 'Sorted by lowest mileage', 'Mileage ascending + year boost'],
              ['HIGH_MILEAGE', 'Sorted by highest mileage', 'Mileage descending'],
              ['NEWEST_YEAR', 'Sorted by newest model year', 'Year descending + days-on-lot penalty'],
              ['OLDEST_YEAR', 'Sorted by oldest model year', 'Year ascending'],
              ['BEST_MATCH', 'Default relevance ranking', 'Text relevance + photo count + dealer distance'],
              ['NEWEST_INVENTORY', 'Sorted by most recently added', 'Days-on-lot ascending (newest first)'],
              ['LEASE_LOW_PRICE', 'Lease-eligible vehicles by price', 'Lease price ascending + canLease filter'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>SearchScoreWeights System</h3>
          <p style={para}>
            Score weights control how Atlas Search ranks documents. Each weight config contains <strong>static factors</strong>
            (fixed multipliers like priceWeight, yearWeight) and <strong>dynamic placeholders</strong> that are resolved at
            query time (e.g., the user&apos;s postal code for dealer distance calculation). Weights are stored in the
            <code style={{ color: c.orange }}> searchScoreWeights</code> collection and managed via the REST API.
          </p>

          <CodeBlock
            language="kotlin"
            filename="SearchScoreWeights model"
            code={`data class SearchScoreWeights(
    val id: ObjectId? = null,
    val sortType: SortType,
    val version: Int,
    val enabled: Boolean = false,
    val weights: Map<String, Double>,  // e.g., "priceWeight" -> 1.5
    val createdAt: Instant = Instant.now(),
    val updatedAt: Instant = Instant.now()
)

// Weights are injected into the Atlas Search compound score:
// score = function(
//   priceWeight * priceScore +
//   mileageWeight * mileageScore +
//   yearWeight * yearScore +
//   photoCountWeight * photoScore +
//   dealerDistanceWeight * distanceScore +
//   daysOnLotWeight * daysOnLotScore
// )`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Autocomplete Search Pipeline</h3>
          <p style={para}>
            The autocomplete pipeline is separate from the main search. It queries the <code>searchSuggestion</code>
            collection through the <code>shopSuggestions</code> Atlas Search index using the <code>autocomplete</code>
            operator. Suggestions include make, model, body style, and popular search terms.
          </p>
          <CodeBlock
            language="json"
            filename="Autocomplete aggregation pipeline"
            code={`[
  {
    "$search": {
      "index": "shopSuggestions",
      "autocomplete": {
        "query": "hon",
        "path": "label",
        "tokenOrder": "sequential",
        "fuzzy": { "maxEdits": 1 }
      }
    }
  },
  { "$limit": 10 },
  {
    "$project": {
      "label": 1,
      "count": 1,
      "type": 1,
      "score": { "$meta": "searchScore" }
    }
  }
]`}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 6: THIRD-PARTY INTEGRATIONS ============ */}
      <section id="third-party-apis" style={sectionSpacing}>
        <SectionHeader
          label="External"
          title="Third-Party Integrations"
          description="All external API integrations consumed by Odyssey-Api services"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            Odyssey-Api integrates with five external services: <strong>MaxDigital</strong> for vehicle gallery images,
            <strong> Impel/SpinCar</strong> for 360-degree spin URLs, <strong>Libra</strong> for dealership and zone data,
            <strong> Incentives API</strong> for OEM region mapping, and <strong>Tax &amp; Fee API</strong> for shipping configuration.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Third-Party Integration Map"
            tabs={[{ label: 'Integrations', source: mermaidThirdParty }]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>MaxDigital (Vehicle Images)</h3>
          <div style={endpointCard}>
            <div style={infoCardTitle}>GraphQL API - api.maxapps.io/graphql</div>
            <p style={endpointDesc}>
              MaxDigital provides high-resolution vehicle gallery images in 6 different sizes per photo. The
              <code> GetGalleryImages</code> query is called from the search module when a user views a vehicle detail page.
            </p>
            <ul style={detailList}>
              <li><strong>Authentication:</strong> API key passed as <code>x-api-key</code> header</li>
              <li><strong>Query:</strong> <code>GetGalleryImages(vin: String!)</code></li>
              <li><strong>Response:</strong> Array of image objects, each with 6 size URLs (thumbnail through full-size)</li>
              <li><strong>Retry logic:</strong> 3 attempts with exponential backoff</li>
              <li><strong>Timeout:</strong> 5 seconds per request</li>
              <li><strong>Called by:</strong> odyssey-search-graphql (search module)</li>
            </ul>
          </div>

          <CodeBlock
            language="graphql"
            filename="MaxDigital GetGalleryImages query"
            code={`query GetGalleryImages($vin: String!) {
  getGalleryImages(vin: $vin) {
    images {
      thumbnailUrl    # 100px
      smallUrl        # 300px
      mediumUrl       # 640px
      largeUrl        # 1024px
      extraLargeUrl   # 1600px
      originalUrl     # Full resolution
    }
  }
}`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Impel / SpinCar (360-Degree Spins)</h3>
          <div style={endpointCard}>
            <div style={infoCardTitle}>REST API - wa-detection-api.spincar.com</div>
            <p style={endpointDesc}>
              Impel (formerly SpinCar) provides interactive 360-degree spin experiences for vehicles. The integration
              works in two ways: (1) Impel sends webhook notifications to <code>/impel/spin-notification</code> when
              spins are created/updated/deleted, and (2) Odyssey-Api proactively fetches spin URLs from the detection API.
            </p>
            <ul style={detailList}>
              <li><strong>Authentication:</strong> Client ID + Secret in request headers</li>
              <li><strong>Endpoint:</strong> <code>GET /api/v1/walkaround/&#123;vin&#125;</code></li>
              <li><strong>Concurrency:</strong> Up to 10 concurrent requests when processing webhooks</li>
              <li><strong>Response:</strong> JSON with walkaround URL and interior URL</li>
              <li><strong>Called by:</strong> odyssey-api (routes module) - ImpelNotificationRouter</li>
            </ul>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Libra (Dealership Data)</h3>
          <div style={endpointCard}>
            <div style={infoCardTitle}>REST API - admin-api/v5</div>
            <p style={endpointDesc}>
              Libra is the internal dealership management API. Odyssey-Api consumes it during the EDS import to enrich
              vehicle records with dealership metadata like shipping zones and region assignments.
            </p>
            <ul style={detailList}>
              <li><strong>Authentication:</strong> Internal service-to-service token</li>
              <li><strong>Endpoints:</strong>
                <ul>
                  <li><code>GET /dealerships</code> - All dealerships with addresses, regions, and capabilities</li>
                  <li><code>GET /zones</code> - Shipping zone definitions and pricing tiers</li>
                </ul>
              </li>
              <li><strong>Caching:</strong> Responses cached for 30 minutes (aligned with EDS import cycle)</li>
              <li><strong>Called by:</strong> odyssey-cron (cron module) during EDS import</li>
            </ul>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Incentives API (OEM Regions)</h3>
          <div style={endpointCard}>
            <div style={infoCardTitle}>REST API - incentives-api/v1</div>
            <p style={endpointDesc}>
              Maps postal codes to OEM incentive regions. Used during leasing price calculations to determine which
              regional pricing applies to a given customer location.
            </p>
            <ul style={detailList}>
              <li><strong>Authentication:</strong> Internal service-to-service token</li>
              <li><strong>Endpoint:</strong> <code>GET /regions?postalCode=&#123;zip&#125;</code></li>
              <li><strong>Response:</strong> Region ID, region name, applicable OEM programs</li>
              <li><strong>Called by:</strong> odyssey-cron (populates <code>postalCodeOemRegions</code> collection)</li>
            </ul>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Tax &amp; Fee API (Shipping Config)</h3>
          <div style={endpointCard}>
            <div style={infoCardTitle}>REST API - taxes-fees-api/v1</div>
            <p style={endpointDesc}>
              Provides shipping cost configuration based on dealer zones. Used by the search pipeline&apos;s
              ShippingBuilder to calculate shipping costs displayed in search results.
            </p>
            <ul style={detailList}>
              <li><strong>Authentication:</strong> Internal service-to-service token</li>
              <li><strong>Endpoint:</strong> <code>GET /shipping-config</code></li>
              <li><strong>Response:</strong> Zone-to-cost mapping, free shipping thresholds, dealer-specific overrides</li>
              <li><strong>Called by:</strong> odyssey-cron (caches config), odyssey-search-graphql (runtime lookups)</li>
            </ul>
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 7: DATA MODELS ============ */}
      <section id="data-models" style={sectionSpacing}>
        <SectionHeader
          label="Schema"
          title="Data Models"
          description="Core data models used across the Odyssey-Api codebase"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The primary data model is the <strong>Vehicle</strong> document stored in the <code>vehicleV3</code>
            collection. It contains ~35 fields visible through GraphQL and additional internal fields used for
            search scoring and pipeline processing. Supporting models include InventoryDelta, SearchScoreWeights,
            Category, Feature, SearchSuggestion, InventoryJobDetails, and EdsExtractedInventoryRow.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Vehicle Data Model"
            tabs={[{ label: 'Class Diagram', source: mermaidVehicleModel }]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Vehicle Fields (~35 GraphQL-visible)</h3>
          <DataTable
            headers={['Field', 'Type', 'Description']}
            rows={[
              ['vin', 'String', 'Vehicle Identification Number (17 chars, unique)'],
              ['vehicleId', 'String', 'Internal Lithia vehicle ID'],
              ['status', 'InventoryStatus', 'ACTIVE, DELETED, or PENDING'],
              ['manuallySuppressed', 'Boolean', 'Admin suppression flag (hidden from search)'],
              ['vehicleCondition', 'VehicleCondition', 'NEW or USED'],
              ['price', 'Double', 'Current sale price in dollars'],
              ['priceInCents', 'Int', 'Price in cents for precision calculations'],
              ['msrp', 'Double', 'Manufacturer suggested retail price'],
              ['mileage', 'Int', 'Current odometer reading'],
              ['bodyStyle', 'String', 'e.g., Sedan, SUV, Truck, Coupe'],
              ['exteriorColor', 'String', 'Exterior color name'],
              ['interiorColor', 'String', 'Interior color name'],
              ['fuelType', 'String', 'Gas, Diesel, Electric, Hybrid, Plug-in Hybrid'],
              ['drivetrain', 'String', 'FWD, RWD, AWD, 4WD'],
              ['transmission', 'String', 'Automatic, Manual, CVT'],
              ['engine', 'String', 'Engine description (e.g., 2.0L Turbo 4-Cylinder)'],
              ['stockNumber', 'String', 'Dealer stock number'],
              ['ymmt.year', 'Int', 'Model year'],
              ['ymmt.make', 'String', 'Manufacturer (e.g., Honda, Toyota)'],
              ['ymmt.model', 'String', 'Model name (e.g., Civic, Camry)'],
              ['ymmt.trim', 'String', 'Trim level (e.g., EX-L, XSE)'],
              ['image.heroUrl', 'String', 'Primary listing image URL'],
              ['image.spinUrl', 'String', '360-degree spin URL from Impel'],
              ['image.count', 'Int', 'Total number of photos'],
              ['dealer.id', 'String', 'Dealership identifier'],
              ['dealer.name', 'String', 'Dealership name'],
              ['dealer.state', 'String', 'Dealership state code'],
              ['dealer.zip', 'String', 'Dealership postal code'],
              ['dealer.region', 'Int', 'Dealership region number'],
              ['leasing.canLease', 'Boolean', 'Whether vehicle is lease-eligible'],
              ['leasing.defaultPrice', 'Int', 'Default monthly lease price in cents'],
              ['leasing.regionalPrices', 'List<RegionData>', 'Region-specific lease pricing'],
              ['availability.purchasePending', 'Boolean', 'Currently in shopping cart'],
              ['availability.salesPending', 'Boolean', 'Sale in progress'],
              ['availability.salesBooked', 'Boolean', 'Sale completed/booked'],
              ['availability.inventoryInTransit', 'Boolean', 'Vehicle in transit to dealer'],
              ['availability.reconOrderOpen', 'Boolean', 'Reconditioning order open'],
              ['availability.enqueuedTime', 'Instant', 'Timestamp of last availability update'],
              ['categoryFeatures', 'List<CategoryFeatures>', 'Vehicle features grouped by category'],
              ['hints.freeShipping', 'Boolean', 'Eligible for free shipping'],
              ['hints.greatDeal', 'Boolean', 'Price is significantly below market'],
              ['hints.newArrival', 'Boolean', 'Recently added to inventory'],
              ['hints.certified', 'Boolean', 'Certified pre-owned'],
              ['bookValue.kbbRetail', 'Double', 'KBB retail value'],
              ['bookValue.kbbFairPurchase', 'Double', 'KBB fair purchase price'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Supporting Models</h3>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={infoCardTitle}>InventoryDelta</div>
              <div style={infoCardText}>
                Published to Service Bus when vehicles are added, updated, or deleted during EDS import.
                Contains vin, vehicleId, dealerId, type (ADD/UPDATE/DELETE), price, mileage, YMMT data,
                condition, bodyStyle, and timestamp.
              </div>
            </div>
            <div style={infoCard}>
              <div style={infoCardTitle}>SearchScoreWeights</div>
              <div style={infoCardText}>
                Versioned scoring configuration per SortType. Stores a map of weight names to double values.
                Only one version per SortType can be enabled at a time. Managed via REST API.
              </div>
            </div>
            <div style={infoCard}>
              <div style={infoCardTitle}>Category</div>
              <div style={infoCardText}>
                Groups related vehicle features under a display name. For example, "Safety" category contains
                features like "Blind Spot Monitor", "Lane Departure Warning". Stored in the <code>categories</code> collection.
              </div>
            </div>
            <div style={infoCard}>
              <div style={infoCardTitle}>Feature</div>
              <div style={infoCardText}>
                Individual vehicle attribute with a name, display name, and parent category reference.
                Stored in the <code>features</code> collection. Matched against vehicle data during EDS import.
              </div>
            </div>
            <div style={infoCard}>
              <div style={infoCardTitle}>SearchSuggestion</div>
              <div style={infoCardText}>
                Autocomplete suggestion entry with a label, count, and type (make, model, bodyStyle).
                Stored in the <code>searchSuggestion</code> collection, indexed by the <code>shopSuggestions</code> Atlas Search index.
              </div>
            </div>
            <div style={infoCard}>
              <div style={infoCardTitle}>InventoryJobDetails</div>
              <div style={infoCardText}>
                Tracks each EDS import job execution. Records start time, end time, status (RUNNING/SUCCESS/FAILED),
                vehicle counts, delta counts, and error messages. Used by <code>killStalled</code> mutation.
              </div>
            </div>
            <div style={infoCard}>
              <div style={infoCardTitle}>EdsExtractedInventoryRow</div>
              <div style={infoCardText}>
                Intermediate model representing a single row parsed from the EDS TSV file. Contains raw fields
                that are mapped to the Vehicle model during the staging phase of the import pipeline.
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 8: DATABASE COLLECTIONS ============ */}
      <section id="database-collections" style={sectionSpacing}>
        <SectionHeader
          label="Data Layer"
          title="Database Collections"
          description="All MongoDB collections in the shopInventory database and their Atlas Search indexes"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The Odyssey-Api uses a single MongoDB Atlas database called <strong>shopInventory</strong> containing
            8 collections (plus dynamically-created temp staging collections). Two Atlas Search indexes power the
            full-text search and autocomplete features. The primary <code>vehicleV3</code> collection has 22+
            indexes optimized for the various query patterns used across all five services.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Database Collections & Indexes"
            tabs={[{ label: 'Collections', source: mermaidCollections }]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Collection Details</h3>
          <DataTable
            headers={['Collection', 'Purpose', 'Key Fields', 'Accessed By']}
            rows={[
              ['vehicleV3', 'Live vehicle inventory (~100K+ docs)', 'vin, vehicleId, status, ymmt, price, mileage, dealer', 'All 5 services'],
              ['searchSuggestion', 'Autocomplete suggestions', 'label, count, type', 'search module (queries)'],
              ['searchScoreWeights', 'Search ranking configurations', 'sortType, version, enabled, weights', 'routes module (REST API)'],
              ['inventoryJobDetails', 'EDS import job history', 'status, startTime, endTime, vehicleCount, deltaCount', 'cron module, routes module (killStalled)'],
              ['categories', 'Feature category definitions', 'name, displayName, features', 'routes module (mutations/queries)'],
              ['features', 'Vehicle feature definitions', 'name, displayName, category', 'routes module (mutations/queries)'],
              ['postalCodeOemRegions', 'ZIP to OEM region mapping', 'postalCode, regionId, regionName', 'cron module (populated from Incentives API)'],
              ['temp_vehicleV3_*', 'Staging collections (ephemeral)', 'Same schema as vehicleV3', 'cron module (created/dropped per import)'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>vehicleV3 Indexes (22+)</h3>
          <p style={para}>
            The <code>vehicleV3</code> collection has the most indexes of any collection, supporting a wide variety of
            query patterns across all services. These include compound indexes for search filtering, single-field indexes
            for direct lookups, and Atlas Search indexes for full-text search.
          </p>
          <DataTable
            headers={['Index Name', 'Fields', 'Purpose']}
            rows={[
              ['_id_', '_id', 'Default primary key index'],
              ['vin_1', 'vin (ascending)', 'VIN lookups (unique)'],
              ['vehicleId_1', 'vehicleId (ascending)', 'Vehicle ID lookups (unique)'],
              ['status_1', 'status (ascending)', 'Filter by inventory status'],
              ['status_1_manuallySuppressed_1', 'status + manuallySuppressed', 'Active non-suppressed vehicle queries'],
              ['dealer.id_1', 'dealer.id (ascending)', 'Dealer-specific queries'],
              ['dealer.id_1_status_1', 'dealer.id + status', 'Active vehicles per dealer'],
              ['ymmt.make_1_ymmt.model_1', 'make + model', 'Make/model facet queries'],
              ['vehicleCondition_1_status_1', 'condition + status', 'New vs used vehicle queries'],
              ['leasing.canLease_1', 'leasing.canLease', 'Lease-eligible vehicle queries'],
              ['availability.purchasePending_1', 'availability.purchasePending', 'Cart availability checks'],
              ['manuallySuppressed_1', 'manuallySuppressed', 'Suppressed vehicle admin queries'],
              ['price_1', 'price (ascending)', 'Price range queries'],
              ['mileage_1', 'mileage (ascending)', 'Mileage range queries'],
              ['ymmt.year_1', 'ymmt.year (ascending)', 'Year range queries'],
              ['bodyStyle_1', 'bodyStyle', 'Body style filter queries'],
              ['fuelType_1', 'fuelType', 'Fuel type filter queries'],
              ['drivetrain_1', 'drivetrain', 'Drivetrain filter queries'],
              ['exteriorColor_1', 'exteriorColor', 'Color filter queries'],
              ['image.spinUrl_1', 'image.spinUrl', 'Impel spin URL presence checks'],
              ['hints.freeShipping_1', 'hints.freeShipping', 'Free shipping filter'],
              ['availability.enqueuedTime_1', 'availability.enqueuedTime', 'Staleness checks for availability updates'],
              ['shopSearch (Atlas)', 'Full-text on make, model, vin, bodyStyle + facets', 'Primary search index'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Atlas Search Index: shopSearch</h3>
          <p style={para}>
            The <code>shopSearch</code> Atlas Search index on <code>vehicleV3</code> is the backbone of the search experience.
            It defines mappings for full-text fields (make, model, vin, bodyStyle), filterable fields (status, condition, price ranges),
            and facet fields (make, model, bodyStyle, fuelType, drivetrain, color, year).
          </p>
          <CodeBlock
            language="json"
            filename="shopSearch Atlas Search Index Definition (simplified)"
            code={`{
  "name": "shopSearch",
  "analyzer": "lucene.standard",
  "searchAnalyzer": "lucene.standard",
  "mappings": {
    "dynamic": false,
    "fields": {
      "ymmt": {
        "type": "document",
        "fields": {
          "make": { "type": "string", "analyzer": "lucene.standard" },
          "model": { "type": "string", "analyzer": "lucene.standard" },
          "year": { "type": "number" }
        }
      },
      "vin": { "type": "string", "analyzer": "lucene.keyword" },
      "bodyStyle": { "type": "string", "analyzer": "lucene.standard" },
      "status": { "type": "string", "analyzer": "lucene.keyword" },
      "vehicleCondition": { "type": "string", "analyzer": "lucene.keyword" },
      "price": { "type": "number" },
      "mileage": { "type": "number" },
      "manuallySuppressed": { "type": "boolean" },
      "leasing.canLease": { "type": "boolean" },
      "hints.freeShipping": { "type": "boolean" }
    }
  }
}`}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 9: KEY ENUMS ============ */}
      <section id="enums" style={sectionSpacing}>
        <SectionHeader
          label="Reference"
          title="Key Enums"
          description="All enum types used across the Odyssey-Api codebase"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The following enums define the constrained value sets used throughout the codebase. They appear in
            database documents, GraphQL types, REST request/response bodies, and internal service logic.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <div style={sideBySide}>
            <div style={enumCard}>
              <div style={{ ...enumTitle, color: c.accent }}>VehicleCondition</div>
              <ul style={enumList}>
                <li><strong>NEW</strong> - Brand new vehicle, never titled</li>
                <li><strong>USED</strong> - Pre-owned vehicle</li>
              </ul>
            </div>
            <div style={enumCard}>
              <div style={{ ...enumTitle, color: c.accent2 }}>InventoryStatus</div>
              <ul style={enumList}>
                <li><strong>ACTIVE</strong> - Available for sale/search</li>
                <li><strong>DELETED</strong> - Removed from inventory</li>
                <li><strong>PENDING</strong> - Awaiting activation</li>
              </ul>
            </div>
            <div style={enumCard}>
              <div style={{ ...enumTitle, color: c.accent3 }}>SortType</div>
              <ul style={enumList}>
                <li><strong>BEST_MATCH</strong> - Default relevance</li>
                <li><strong>HIGH_PRICE_NEW_CAR</strong></li>
                <li><strong>LOW_PRICE_NEW_CAR</strong></li>
                <li><strong>HIGH_PRICE_USED_CAR</strong></li>
                <li><strong>LOW_PRICE_USED_CAR</strong></li>
                <li><strong>LOW_MILEAGE</strong></li>
                <li><strong>HIGH_MILEAGE</strong></li>
                <li><strong>NEWEST_YEAR</strong></li>
                <li><strong>OLDEST_YEAR</strong></li>
                <li><strong>NEWEST_INVENTORY</strong></li>
                <li><strong>LEASE_LOW_PRICE</strong></li>
              </ul>
            </div>
            <div style={enumCard}>
              <div style={{ ...enumTitle, color: c.orange }}>InventoryDeltaAction</div>
              <ul style={enumList}>
                <li><strong>ADD</strong> - New vehicle added</li>
                <li><strong>UPDATE</strong> - Price or mileage changed</li>
                <li><strong>DELETE</strong> - Vehicle removed</li>
              </ul>
            </div>
            <div style={enumCard}>
              <div style={{ ...enumTitle, color: c.cyan }}>JobStatus</div>
              <ul style={enumList}>
                <li><strong>RUNNING</strong> - Import in progress</li>
                <li><strong>SUCCESS</strong> - Completed successfully</li>
                <li><strong>FAILED</strong> - Completed with errors</li>
                <li><strong>SAFETY_CHECK_FAIL</strong> - Aborted by safety check</li>
              </ul>
            </div>
            <div style={enumCard}>
              <div style={{ ...enumTitle, color: c.pink }}>ImportType</div>
              <ul style={enumList}>
                <li><strong>EDS_FULL</strong> - Full inventory file import</li>
                <li><strong>EDS_DELTA</strong> - Incremental changes only</li>
                <li><strong>MANUAL</strong> - Admin-triggered import</li>
              </ul>
            </div>
            <div style={enumCard}>
              <div style={{ ...enumTitle, color: c.red }}>ImportRunner</div>
              <ul style={enumList}>
                <li><strong>CRON</strong> - Scheduled job execution</li>
                <li><strong>ADMIN</strong> - Manual admin trigger</li>
                <li><strong>TEST</strong> - Integration test execution</li>
              </ul>
            </div>
            <div style={enumCard}>
              <div style={{ ...enumTitle, color: c.accent }}>FacetField</div>
              <ul style={enumList}>
                <li><strong>MAKE</strong></li>
                <li><strong>MODEL</strong></li>
                <li><strong>BODY_STYLE</strong></li>
                <li><strong>FUEL_TYPE</strong></li>
                <li><strong>DRIVETRAIN</strong></li>
                <li><strong>EXTERIOR_COLOR</strong></li>
                <li><strong>YEAR</strong> (range)</li>
                <li><strong>PRICE</strong> (range)</li>
                <li><strong>MILEAGE</strong> (range)</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 10: VEHICLE SEARCH RESULT ============ */}
      <section id="vehicle-result" style={sectionSpacing}>
        <SectionHeader
          label="GraphQL Type"
          title="Vehicle Search Result"
          description="Complete breakdown of the VehicleResult GraphQL type returned by search queries"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The <code>VehicleResult</code> type is the primary return type for search queries and vehicle lookups.
            It exposes approximately 35 fields organized into logical groups: Pricing, Identity, YMMT, Specs,
            Media, Colors, Dealer, Status, Book Value, and Metadata. This is the shape of data that the
            Driveway.com frontend consumes for search results pages and vehicle detail pages.
          </p>
        </motion.div>

        {/* Pricing group */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Pricing Fields</h3>
          <DataTable
            headers={['Field', 'GraphQL Type', 'Description', 'Example']}
            rows={[
              ['price', 'Float', 'Current sale price in dollars', '32,500.00'],
              ['priceInCents', 'Int', 'Price in cents for precision', '3,250,000'],
              ['msrp', 'Float', 'Manufacturer suggested retail price', '35,200.00'],
              ['leasing', 'Leasing', 'Lease pricing object (canLease, defaultPrice, regionalPrices)', '{ canLease: true, defaultPrice: 32900 }'],
            ]}
          />
        </motion.div>

        {/* Identity group */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Identity Fields</h3>
          <DataTable
            headers={['Field', 'GraphQL Type', 'Description', 'Example']}
            rows={[
              ['vin', 'String!', 'Vehicle Identification Number', '1HGBH41JXMN109186'],
              ['vehicleId', 'String!', 'Internal Lithia vehicle identifier', 'VH-123456'],
              ['stockNumber', 'String', 'Dealer stock number', 'STK-9876'],
            ]}
          />
        </motion.div>

        {/* YMMT group */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>YMMT Fields</h3>
          <DataTable
            headers={['Field', 'GraphQL Type', 'Description', 'Example']}
            rows={[
              ['year', 'Int!', 'Model year', '2024'],
              ['make', 'String!', 'Manufacturer name', 'Honda'],
              ['model', 'String!', 'Model name', 'Civic'],
              ['trim', 'String', 'Trim level', 'EX-L'],
            ]}
          />
        </motion.div>

        {/* Specs group */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Specs Fields</h3>
          <DataTable
            headers={['Field', 'GraphQL Type', 'Description', 'Example']}
            rows={[
              ['mileage', 'Int', 'Odometer reading', '15,432'],
              ['bodyStyle', 'String', 'Body type', 'Sedan'],
              ['fuelType', 'String', 'Fuel type', 'Gas'],
              ['drivetrain', 'String', 'Drive configuration', 'FWD'],
              ['transmission', 'String', 'Transmission type', 'Automatic'],
              ['engine', 'String', 'Engine description', '2.0L Turbo 4-Cylinder'],
              ['vehicleCondition', 'VehicleCondition!', 'NEW or USED', 'NEW'],
            ]}
          />
        </motion.div>

        {/* Media group */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Media Fields</h3>
          <DataTable
            headers={['Field', 'GraphQL Type', 'Description', 'Example']}
            rows={[
              ['image.heroUrl', 'String', 'Primary listing image', 'https://cdn.example.com/hero.jpg'],
              ['image.spinUrl', 'String', '360-degree spin URL', 'https://cdn.spincar.com/spin/...'],
              ['image.count', 'Int', 'Total photo count', '24'],
            ]}
          />
        </motion.div>

        {/* Colors group */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Color Fields</h3>
          <DataTable
            headers={['Field', 'GraphQL Type', 'Description', 'Example']}
            rows={[
              ['exteriorColor', 'String', 'Exterior color name', 'Crystal Black Pearl'],
              ['interiorColor', 'String', 'Interior color name', 'Black Leather'],
            ]}
          />
        </motion.div>

        {/* Dealer group */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Dealer Fields</h3>
          <DataTable
            headers={['Field', 'GraphQL Type', 'Description', 'Example']}
            rows={[
              ['dealer.id', 'String!', 'Dealership identifier', 'D001'],
              ['dealer.name', 'String!', 'Dealership name', 'Honda of Portland'],
              ['dealer.state', 'String!', 'State code', 'OR'],
              ['dealer.zip', 'String!', 'ZIP code', '97201'],
              ['dealer.region', 'Int!', 'Region number', '1'],
            ]}
          />
        </motion.div>

        {/* Status group */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Status Fields</h3>
          <DataTable
            headers={['Field', 'GraphQL Type', 'Description', 'Example']}
            rows={[
              ['status', 'InventoryStatus!', 'Inventory status', 'ACTIVE'],
              ['manuallySuppressed', 'Boolean!', 'Admin suppression flag', 'false'],
              ['availability.purchasePending', 'Boolean!', 'In shopping cart', 'false'],
              ['availability.salesPending', 'Boolean!', 'Sale in progress', 'false'],
              ['availability.salesBooked', 'Boolean!', 'Sale completed', 'false'],
              ['availability.inventoryInTransit', 'Boolean!', 'In transit', 'false'],
              ['availability.reconOrderOpen', 'Boolean!', 'Recon order open', 'false'],
              ['availability.enqueuedTime', 'String', 'Last availability update ISO timestamp', '2024-01-15T10:30:00Z'],
            ]}
          />
        </motion.div>

        {/* Book Value group */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Book Value Fields</h3>
          <DataTable
            headers={['Field', 'GraphQL Type', 'Description', 'Example']}
            rows={[
              ['bookValue.kbbRetail', 'Float', 'KBB retail book value', '34,500.00'],
              ['bookValue.kbbFairPurchase', 'Float', 'KBB fair purchase price', '31,200.00'],
            ]}
          />
        </motion.div>

        {/* Metadata group */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Metadata Fields</h3>
          <DataTable
            headers={['Field', 'GraphQL Type', 'Description', 'Example']}
            rows={[
              ['hints.freeShipping', 'Boolean', 'Eligible for free shipping', 'true'],
              ['hints.greatDeal', 'Boolean', 'Price significantly below market', 'false'],
              ['hints.newArrival', 'Boolean', 'Recently added to inventory', 'true'],
              ['hints.certified', 'Boolean', 'Certified pre-owned', 'false'],
              ['categoryFeatures', '[CategoryFeatures]', 'Features grouped by category', '[{ category: "Safety", features: ["BSM", "LDW"] }]'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CodeBlock
            language="graphql"
            filename="VehicleResult GraphQL Type Definition"
            code={`type VehicleResult {
  vin: String!
  vehicleId: String!
  status: InventoryStatus!
  manuallySuppressed: Boolean!
  vehicleCondition: VehicleCondition!
  year: Int!
  make: String!
  model: String!
  trim: String
  price: Float
  priceInCents: Int
  msrp: Float
  mileage: Int
  bodyStyle: String
  exteriorColor: String
  interiorColor: String
  fuelType: String
  drivetrain: String
  transmission: String
  engine: String
  stockNumber: String
  image: Image
  dealer: Dealer!
  leasing: Leasing
  availability: Availability!
  categoryFeatures: [CategoryFeatures]
  hints: Hints
  bookValue: BookValue
}

type Image {
  heroUrl: String
  spinUrl: String
  count: Int
}

type Dealer {
  id: String!
  name: String!
  state: String!
  zip: String!
  region: Int!
}

type Leasing {
  canLease: Boolean!
  defaultPrice: Int
  regionalPrices: [RegionData]
}

type RegionData {
  regionId: Int!
  amountInCents: Int!
  expiresOn: String
}

type Availability {
  purchasePending: Boolean!
  salesPending: Boolean!
  salesBooked: Boolean!
  inventoryInTransit: Boolean!
  reconOrderOpen: Boolean!
  enqueuedTime: String
}

type Hints {
  freeShipping: Boolean
  greatDeal: Boolean
  newArrival: Boolean
  certified: Boolean
}

type BookValue {
  kbbRetail: Float
  kbbFairPurchase: Float
}

type CategoryFeatures {
  category: String!
  features: [String!]!
}`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="success" title="Complete Reference">
            This page covers every REST endpoint, GraphQL operation, third-party integration, database collection,
            and data model in the Odyssey-Api project. For information about the EDS import pipeline, cron jobs,
            Service Bus consumers, and deployment infrastructure, see the companion documentation pages.
          </Callout>
        </motion.div>
      </section>
    </>
  );
}
