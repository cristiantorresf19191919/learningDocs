import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { useSidebar } from '../context/SidebarContext';
import SectionHeader from '../components/shared/SectionHeader';
import Card from '../components/shared/Card';
import Callout from '../components/shared/Callout';
import MermaidViewer from '../components/diagrams/MermaidViewer';
import Badge from '../components/shared/Badge';

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
  purple: '#8b5cf6',
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
  { id: 'overview', label: 'Overview' },
  { id: 'component-diagram', label: 'Component Diagram' },
  { id: 'sequence-flow', label: 'Sequence Flow' },
  { id: 'modules', label: 'Modules' },
  { id: 'data-stores', label: 'Data Stores' },
  { id: 'external-services', label: 'External Services' },
  { id: 'key-takeaways', label: 'Key Takeaways' },
];

/* ------------------------------------------------------------------ */
/*  Mermaid diagrams                                                   */
/* ------------------------------------------------------------------ */
const componentDiagram = `graph TB
    subgraph External["External Sources"]
        EDS["EDS File Provider<br/>(Azure Blob Storage)"]
        ASB_IN["Azure Service Bus<br/>leasing-incentives-topic"]
        INCENTIVES["Incentives API"]
        TAXFEE["Tax & Fee API"]
    end

    subgraph Cron["odyssey-cron"]
        SCHED["Spring Scheduler<br/>@Scheduled"]
        EDS_IMPORT["EDS Vehicle Import<br/>(every 30 min)"]
        REGION_SYNC["Region Sync<br/>(4x daily)"]
        LEASE_EXPIRY["Lease Expiry<br/>(after import)"]
        DB_CLEANUP["DB Cleanup<br/>(hourly + nightly)"]
        SUGGESTIONS["Search Suggestions<br/>(after import)"]
    end

    subgraph Consumer["odyssey-consumer"]
        LEASE_RX["Lease Topic Receiver"]
        LEASE_HANDLER["Lease Handler"]
    end

    subgraph Search["odyssey-search-graphql"]
        GQL_SEARCH["GraphQL Search Queries"]
        PIPELINE["Pipeline Builder"]
        FILTER["Filter Builder"]
        SCORE["Score/Sort Engine"]
        SHIPPING["Shipping Calculator"]
        LEASING_CALC["Leasing Calculator"]
    end

    subgraph DataStores["Data Stores"]
        MONGO[("MongoDB Atlas<br/>vehicleV3")]
        SEARCH_IDX[("Atlas Search Index<br/>shopSearch")]
        SUGGEST_IDX[("Atlas Search Index<br/>shopSuggestions")]
    end

    subgraph Client["SRP Client"]
        SRP["Search Results Page"]
    end

    EDS --> EDS_IMPORT
    SCHED --> EDS_IMPORT
    SCHED --> REGION_SYNC
    SCHED --> DB_CLEANUP
    EDS_IMPORT --> LEASE_EXPIRY
    EDS_IMPORT --> SUGGESTIONS
    EDS_IMPORT -->|"upsert vehicles"| MONGO
    LEASE_EXPIRY -->|"update leasing"| MONGO
    SUGGESTIONS -->|"update suggestions"| SUGGEST_IDX
    REGION_SYNC -->|"sync regions"| MONGO
    DB_CLEANUP -->|"remove stale"| MONGO
    TAXFEE -.->|"shipping config"| EDS_IMPORT
    INCENTIVES -.->|"region data"| REGION_SYNC

    ASB_IN --> LEASE_RX
    LEASE_RX --> LEASE_HANDLER
    LEASE_HANDLER -->|"update leasing"| MONGO

    MONGO --> SEARCH_IDX
    SRP -->|"GraphQL query"| GQL_SEARCH
    GQL_SEARCH --> PIPELINE
    PIPELINE --> FILTER
    PIPELINE --> SCORE
    PIPELINE --> SHIPPING
    PIPELINE --> LEASING_CALC
    PIPELINE -->|"aggregation"| SEARCH_IDX
    SEARCH_IDX -->|"results"| GQL_SEARCH
    GQL_SEARCH -->|"VehicleResults"| SRP

    classDef cron fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0
    classDef consumer fill:#1a3d2e,stroke:#10b981,color:#e2e8f0
    classDef search fill:#2d1f4e,stroke:#8b5cf6,color:#e2e8f0
    classDef store fill:#3d2a1a,stroke:#f59e0b,color:#e2e8f0
    classDef external fill:#1a2332,stroke:#64748b,color:#94a3b8
    classDef client fill:#3d1a2e,stroke:#ec4899,color:#e2e8f0

    class EDS_IMPORT,REGION_SYNC,LEASE_EXPIRY,DB_CLEANUP,SUGGESTIONS,SCHED cron
    class LEASE_RX,LEASE_HANDLER consumer
    class GQL_SEARCH,PIPELINE,FILTER,SCORE,SHIPPING,LEASING_CALC search
    class MONGO,SEARCH_IDX,SUGGEST_IDX store
    class EDS,ASB_IN,INCENTIVES,TAXFEE external
    class SRP client`;

const sequenceDiagram = `sequenceDiagram
    participant SCHED as Spring Scheduler
    participant EDS as EDS Import
    participant BLOB as Azure Blob
    participant TEMP as Temp Collection
    participant LIVE as vehicleV3
    participant ASB as Service Bus
    participant SUGGEST as searchSuggestion
    participant ATLAS as Atlas Search Index
    participant GQL as GraphQL
    participant SRP as SRP Client

    Note over SCHED: Every 30 minutes
    SCHED->>EDS: runVehicleReaderImport()
    EDS->>BLOB: findBestFile()
    BLOB-->>EDS: CVP/Driveway-Merchandising-V2/*.tsv
    EDS->>EDS: validateFile()

    rect rgb(30, 58, 95)
        Note over EDS,TEMP: Stage 3: Temp Import
        EDS->>TEMP: createTempImport()
        loop Parse TSV in batches of 500
            EDS->>TEMP: batchInsert(vehicles)
        end
        EDS->>EDS: checkForLargeDelete(threshold: 15k)
    end

    rect rgb(26, 61, 46)
        Note over EDS,ASB: Delta Publishing
        EDS->>TEMP: getInventoryDeltas()
        TEMP-->>EDS: ADD/UPDATE/DELETE deltas
        EDS->>ASB: publish(inventory-delta-topic)
    end

    rect rgb(45, 31, 78)
        Note over EDS,LIVE: Merge & Sweep
        EDS->>LIVE: mergeToVehicles()
        Note right of LIVE: Preserves: leasing,<br/>suppression, availability
        EDS->>LIVE: markMissingRowsDeleted()
    end

    EDS->>SUGGEST: updateSearchSuggestions()
    SUGGEST-->>ATLAS: Auto-indexed by Atlas

    Note over SCHED: Then chain
    SCHED->>LIVE: applyLeaseExpiries()

    Note over SRP,GQL: User searches SRP
    SRP->>GQL: search(filters, sort, pagination)
    GQL->>ATLAS: $search aggregation pipeline
    ATLAS-->>GQL: scored + filtered vehicles
    GQL-->>SRP: VehicleResults + PageInfo`;

const dataFlowDiagram = `graph LR
    subgraph Ingest["Data Ingestion"]
        A["EDS TSV File"] -->|"parse"| B["Vehicle Objects"]
        C["Leasing Messages"] -->|"ASB"| D["Lease Updates"]
        E["Incentives API"] -->|"HTTP"| F["Region Mappings"]
    end

    subgraph Process["Processing"]
        B -->|"batch 500"| G["Temp Collection"]
        G -->|"safety check"| H{{"Delta > 15k?"}}
        H -->|"No"| I["Merge to Live"]
        H -->|"Yes"| J["ABORT"]
        D -->|"validate"| K["Update Leasing"]
        F -->|"transform"| L["Upsert Regions"]
    end

    subgraph Store["Storage"]
        I --> M[("vehicleV3")]
        K --> M
        L --> N[("postalCodeOemRegions")]
        M --> O[("shopSearch Index")]
    end

    subgraph Serve["GraphQL Layer"]
        O --> P["Pipeline Builder"]
        P --> Q["Filter + Score + Page"]
        Q --> R["VehicleResults"]
    end

    style A fill:#1a2332,stroke:#3b82f6,color:#e2e8f0
    style C fill:#1a2332,stroke:#10b981,color:#e2e8f0
    style E fill:#1a2332,stroke:#8b5cf6,color:#e2e8f0
    style J fill:#3d1a1a,stroke:#ef4444,color:#ef4444
    style M fill:#3d2a1a,stroke:#f59e0b,color:#e2e8f0
    style N fill:#3d2a1a,stroke:#f59e0b,color:#e2e8f0
    style O fill:#3d2a1a,stroke:#f59e0b,color:#e2e8f0
    style R fill:#3d1a2e,stroke:#ec4899,color:#e2e8f0`;

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
    'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.10) 40%, transparent 70%)',
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

const section: CSSProperties = { marginTop: '4rem' };

const gridTwo: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
  gap: '1.25rem',
  marginTop: '1.5rem',
};

const gridThree: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
  gap: '1.25rem',
  marginTop: '1.5rem',
};

const badgeRow: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  justifyContent: 'center',
  marginTop: '1.5rem',
};

const prose: CSSProperties = {
  fontSize: '0.92rem',
  lineHeight: 1.75,
  color: c.text2,
  maxWidth: 800,
  margin: '0 auto 1.5rem',
};

const takeawayBox: CSSProperties = {
  background: c.surface,
  border: `1px solid ${c.border}`,
  borderRadius: 12,
  padding: '1.5rem',
  marginTop: '2rem',
};

const takeawayTitle: CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: c.green,
  marginBottom: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const takeawayList: CSSProperties = {
  margin: 0,
  paddingLeft: '1.25rem',
  fontSize: '0.88rem',
  lineHeight: 1.8,
  color: c.text2,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function OdysseySystemOverviewPage() {
  const { setSidebar, clearSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('System Overview', tocItems);
    return () => clearSidebar();
  }, []);

  return (
    <div style={page}>
      {/* Hero */}
      <section style={heroSection}>
        <div style={heroGradientBg} />
        <motion.div style={heroContent} {...fadeUp}>
          <h1 style={heroTitle}>
            Odyssey-Api
            <br />
            System Overview
          </h1>
          <p style={heroSubtitle}>
            End-to-end architecture of the inventory sync pipeline, search engine,
            and GraphQL layer that powers the Search Results Page (SRP).
          </p>
          <div style={badgeRow}>
            <Badge label="Kotlin/Spring Boot" color="purple" dot />
            <Badge label="MongoDB Atlas" color="green" dot />
            <Badge label="Azure Service Bus" color="blue" dot />
            <Badge label="GraphQL" color="pink" dot />
            <Badge label="Kubernetes" color="cyan" dot />
          </div>
        </motion.div>
      </section>

      {/* Overview */}
      <motion.section id="overview" style={section} {...fadeUp}>
        <SectionHeader
          label="Architecture"
          title="System Overview"
          description="How vehicle inventory flows from upstream providers to the SRP client through cron jobs, sync pipelines, search indexes, and GraphQL."
        />
        <p style={prose}>
          The Odyssey-Api platform ingests vehicle inventory data from EDS (Enterprise Data Services) files
          hosted on Azure Blob Storage. A cron job runs every 30 minutes to parse, validate, and merge this
          data into the live MongoDB collection. Leasing and incentive data arrives asynchronously via Azure
          Service Bus. The merged data is automatically indexed by MongoDB Atlas Search, which powers the
          GraphQL search layer consumed by the SRP client.
        </p>
        <p style={prose}>
          Five microservices collaborate to deliver this pipeline:
          <strong> odyssey-cron</strong> (scheduled imports),
          <strong> odyssey-consumer</strong> (leasing message processing),
          <strong> odyssey-search-graphql</strong> (search queries),
          <strong> odyssey-api</strong> (REST endpoints), and
          <strong> odyssey-availability-sub</strong> (cart status).
        </p>
      </motion.section>

      {/* Component Diagram */}
      <motion.section id="component-diagram" style={section} {...fadeUp}>
        <SectionHeader
          label="Architecture"
          title="Component Diagram"
          description="All services, data stores, and external integrations involved in the inventory-to-SRP pipeline."
        />
        <MermaidViewer title="Component Diagram" tabs={[{ label: 'Components', source: componentDiagram }]} />
      </motion.section>

      {/* Sequence Flow */}
      <motion.section id="sequence-flow" style={section} {...fadeUp}>
        <SectionHeader
          label="Flow"
          title="End-to-End Sequence"
          description="The complete lifecycle from EDS file ingestion to a user searching on the SRP."
        />
        <MermaidViewer title="End-to-End Sequence" tabs={[{ label: 'Sequence', source: sequenceDiagram }]} />

        <div style={{ marginTop: '2rem' }}>
          <SectionHeader
            label="Flow"
            title="Data Flow Diagram"
            description="Simplified view of data ingestion, processing, storage, and serving."
          />
          <MermaidViewer title="Data Flow Diagram" tabs={[{ label: 'Data Flow', source: dataFlowDiagram }]} />
        </div>
      </motion.section>

      {/* Modules */}
      <motion.section id="modules" style={section} {...fadeUp}>
        <SectionHeader
          label="Services"
          title="Microservice Modules"
          description="The five Odyssey-Api modules involved in inventory sync, search, and SRP delivery."
        />
        <div style={gridTwo}>
          <Card title="odyssey-cron" variant="blue">
            <p style={{ fontSize: '0.88rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Spring Boot app with <code>@EnableScheduling</code>. Runs 5 scheduled jobs including EDS vehicle
              import (every 30 min), postal code region sync (4x daily), lease expiry processing, stale record
              cleanup, and metrics updates. Single replica in Kubernetes.
            </p>
          </Card>
          <Card title="odyssey-consumer" variant="green">
            <p style={{ fontSize: '0.88rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Azure Service Bus consumer subscribed to <code>leasing-incentives-topic</code>. Processes
              LEASING messages to update vehicle lease pricing. Routes by message type, validates vehicle
              condition (only NEW cars can lease), and performs atomic MongoDB updates.
            </p>
          </Card>
          <Card title="odyssey-search-graphql" variant="purple">
            <p style={{ fontSize: '0.88rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              GraphQL server exposing <code>search()</code>, <code>getFacets()</code>, and
              <code> getSearchSuggestions()</code> queries. Builds MongoDB Atlas Search aggregation pipelines
              with 12+ filter types, configurable scoring, and region-aware leasing/shipping calculations.
            </p>
          </Card>
          <Card title="odyssey-availability-sub" variant="cyan">
            <p style={{ fontSize: '0.88rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Subscribes to <code>cart-status-update-topic</code> to track vehicle availability. Updates
              <code> purchasePending</code>, <code>salesPending</code>, and <code>salesBooked</code> flags
              that determine if a vehicle can be added to cart.
            </p>
          </Card>
          <Card title="library (shared)" variant="yellow">
            <p style={{ fontSize: '0.88rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Shared Kotlin module containing: Vehicle data models, MongoDB DAO interfaces and implementations,
              configuration classes, Azure Blob/Service Bus clients, and all cross-cutting concerns. Every
              microservice depends on this module.
            </p>
          </Card>
          <Card title="graphql-shared" variant="pink">
            <p style={{ fontSize: '0.88rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Shared GraphQL types and converters. Contains <code>VehicleResult</code> DTOs,
              <code> VehicleCommonInputs</code>, pagination models, range types, and the
              <code> Vehicle.toGql()</code> converter functions used by both search and routes modules.
            </p>
          </Card>
        </div>
      </motion.section>

      {/* Data Stores */}
      <motion.section id="data-stores" style={section} {...fadeUp}>
        <SectionHeader
          label="Storage"
          title="Data Stores & Indexes"
          description="MongoDB collections and Atlas Search indexes that back the inventory and search systems."
        />
        <div style={gridThree}>
          <Card title="vehicleV3" variant="yellow">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: '0 0 0.5rem' }}>
              Primary vehicle inventory collection. ~40+ fields per document including pricing, specs,
              leasing, dealer info, images, and availability.
            </p>
            <Badge label="Primary Key: VIN" color="yellow" />
          </Card>
          <Card title="shopSearch Index" variant="purple">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: '0 0 0.5rem' }}>
              Atlas Search index on vehicleV3 with 50+ mapped fields. Supports full-text search, faceted
              navigation, range queries, and compound scoring.
            </p>
            <Badge label="Atlas Search" color="purple" />
          </Card>
          <Card title="searchSuggestion" variant="cyan">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: '0 0 0.5rem' }}>
              Autocomplete suggestions collection. Updated after each EDS import with unique make+model
              combinations. Indexed by <code>shopSuggestions</code> Atlas Search index.
            </p>
            <Badge label="Autocomplete" color="cyan" />
          </Card>
          <Card title="postalCodeOemRegions" variant="green">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: '0 0 0.5rem' }}>
              OEM region mappings by postal code. Used for region-aware leasing price calculations
              in the search pipeline.
            </p>
            <Badge label="Region Lookup" color="green" />
          </Card>
          <Card title="inventoryJobDetails" variant="blue">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: '0 0 0.5rem' }}>
              Job tracking collection. Records each import run with status, counts, timing,
              and file metadata. Prevents duplicate concurrent imports.
            </p>
            <Badge label="Job Tracker" color="blue" />
          </Card>
          <Card title="Azure Blob Storage" variant="pink">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: '0 0 0.5rem' }}>
              Stores EDS TSV inventory files in the <code>inbound</code> container under
              <code> CVP/Driveway-Merchandising-V2/</code>. Files tagged after processing.
            </p>
            <Badge label="File Storage" color="pink" />
          </Card>
        </div>
      </motion.section>

      {/* External Services */}
      <motion.section id="external-services" style={section} {...fadeUp}>
        <SectionHeader
          label="Integrations"
          title="External Services"
          description="Third-party and internal services consumed by the inventory/search pipeline."
        />
        <div style={gridTwo}>
          <Card title="Tax & Fee API" variant="green">
            <p style={{ fontSize: '0.88rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Provides shipping cost configuration (state-to-state fee matrix) and free shipping zone
              zip codes. Called during EDS import to calculate <code>shippingFee</code> and
              <code> zoneZips</code> per vehicle.
            </p>
          </Card>
          <Card title="Incentives API" variant="purple">
            <p style={{ fontSize: '0.88rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Provides OEM-to-postal-code region mappings. Called 4x daily by the Region Sync cron job.
              Returns region IDs, postal codes, and OEM makes used to compute regional leasing prices.
            </p>
          </Card>
          <Card title="Azure Service Bus" variant="blue">
            <p style={{ fontSize: '0.88rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Three topics involved: <code>leasing-incentives-topic</code> (inbound leasing data),
              <code> inventory-delta-topic</code> (outbound deltas from cron), and
              <code> cart-status-update-topic</code> (availability updates).
            </p>
          </Card>
          <Card title="DataDog APM" variant="yellow">
            <p style={{ fontSize: '0.88rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Distributed tracing via OpenTracing with DataDog Java agent. Metrics exported via
              Micrometer (counters for job status, gauges for 360 photo counts). Enabled in
              dev/uat/prod profiles.
            </p>
          </Card>
        </div>

        <Callout type="info" title="Service Bus Message Flow">
          Cron publishes inventory deltas to <code>inventory-delta-topic</code> after each import.
          The consumer subscribes to <code>leasing-incentives-topic</code> for lease pricing updates.
          The availability subscriber listens on <code>cart-status-update-topic</code> for cart status changes.
          All topics use Azure Service Bus with configurable retry policies (max 5 retries).
        </Callout>
      </motion.section>

      {/* Key Takeaways */}
      <motion.section id="key-takeaways" style={section} {...fadeUp}>
        <SectionHeader
          label="Summary"
          title="Key Takeaways"
        />
        <div style={takeawayBox}>
          <div style={takeawayTitle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Key Takeaways
          </div>
          <ul style={takeawayList}>
            <li>The EDS vehicle import runs every 30 minutes, parsing TSV files from Azure Blob into a temp MongoDB collection, then merging to the live <code>vehicleV3</code> collection.</li>
            <li>Leasing data is preserved across imports &mdash; the merge process explicitly protects <code>leasing</code>, <code>manuallySuppressed</code>, and <code>availability</code> fields.</li>
            <li>MongoDB Atlas Search automatically indexes the <code>vehicleV3</code> collection. No application-level indexing code is needed.</li>
            <li>The GraphQL search pipeline builds MongoDB aggregation queries with 12+ filter types, configurable scoring weights, and region-aware pricing.</li>
            <li>Five microservices collaborate: <strong>cron</strong> (import), <strong>consumer</strong> (leasing), <strong>search</strong> (GraphQL), <strong>availability</strong> (cart status), and <strong>api</strong> (REST).</li>
            <li>A safety check prevents catastrophic data loss: if the import would delete more than 15,000 vehicles, the job aborts with <code>SUSPICIOUS_FILE</code> status.</li>
          </ul>
        </div>
      </motion.section>
    </div>
  );
}
