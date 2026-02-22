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
  { id: 'overview', label: 'Services Overview' },
  { id: 'eds-import', label: 'EDS Vehicle Import' },
  { id: 'cron-postal', label: 'Postal Code Region Sync' },
  { id: 'cron-cleanup', label: 'Cleanup Jobs' },
  { id: 'consumer-leasing', label: 'Leasing Consumer' },
  { id: 'consumer-availability', label: 'Availability Subscriber' },
  { id: 'search-engine', label: 'Search Engine' },
  { id: 'service-bus', label: 'Service Bus Topics' },
  { id: 'data-flow', label: 'Complete Data Flow' },
  { id: 'configuration', label: 'Configuration' },
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

const cardGrid3: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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

/* ------------------------------------------------------------------ */
/*  Mermaid diagrams                                                   */
/* ------------------------------------------------------------------ */

const mermaidOverviewArch = `graph TB
    subgraph Cron_Module["Cron Module"]
        C1["EDS Vehicle Import<br/>Every 30 min"]
        C2["Postal Code Region Sync<br/>4x daily"]
        C3["Stale Records Cleanup<br/>Hourly"]
        C4["Temp Collections Cleanup<br/>Daily"]
        C5["Spin Count Metrics<br/>Every 5 min"]
    end
    subgraph Consumer_Module["Consumer Module"]
        CO1["Leasing Consumer<br/>leasing-incentives-topic"]
        CO2["Incentives Handler<br/>No-op placeholder"]
    end
    subgraph Availability_Module["Availability Module"]
        AV1["Cart Status Subscriber<br/>cart-status-update-topic"]
    end
    C1 --> DB[("MongoDB vehicleV3")]
    C1 --> BLOB["Azure Blob Storage"]
    C1 --> SB["Service Bus<br/>inventory-delta-topic"]
    CO1 --> DB
    AV1 --> DB
    C2 --> INC["Incentives API"]
    C2 --> DB2[("postalCodeOemRegions")]
    style C1 fill:#238636,stroke:#3fb950,color:#fff
    style C2 fill:#238636,stroke:#3fb950,color:#fff
    style C3 fill:#238636,stroke:#3fb950,color:#fff
    style C4 fill:#238636,stroke:#3fb950,color:#fff
    style C5 fill:#238636,stroke:#3fb950,color:#fff
    style CO1 fill:#6e40c9,stroke:#bc8cff,color:#fff
    style CO2 fill:#6e40c9,stroke:#bc8cff,color:#fff
    style AV1 fill:#d29922,stroke:#e3b341,color:#000
    style DB fill:#1f6feb,stroke:#58a6ff,color:#fff
    style DB2 fill:#1f6feb,stroke:#58a6ff,color:#fff`;

const mermaidEdsPipeline = `graph TD
    A["Azure Blob Storage<br/>inbound/CVP/Driveway-Merchandising-V2/"] --> B["File Discovery & Validation"]
    B --> C{"File starts with 'full'?"}
    C -->|No| D["Skip File"]
    C -->|Yes| E["Fetch Shipping Config<br/>Tax & Fee API"]
    E --> F["Fetch Free Zones<br/>Libra API"]
    F --> G["Load Categories & Features<br/>from MongoDB"]
    G --> H["Create temp_vehicleV3_timestamp"]
    H --> I["Parse GZIP TSV<br/>76 fields per row"]
    I --> J["Convert to Vehicle Objects<br/>ExtractedRowToVehicleConverter"]
    J --> K["Batch Upload 500 vehicles<br/>5 concurrent semaphore"]
    K --> L{"Safety Check<br/>Delta > 15,000?"}
    L -->|Yes| M["SUSPICIOUS_FILE - Abort"]
    L -->|No| N["Calculate Deltas<br/>NEW / UPDATE / DELETE"]
    N --> O["Publish to inventory-delta-topic<br/>Batches of 100"]
    O --> P["Merge temp to vehicleV3<br/>Preserve: leasing, suppression, availability"]
    P --> Q["Mark Missing as DELETED"]
    Q --> R["Apply Lease Expiries<br/>Filter expired regionalPrices"]
    R --> S["Update Search Suggestions<br/>Unique make+model combos"]
    S --> T["Update InventoryJobDetails<br/>SUCCEEDED / FAILED"]
    T --> U["Mark Blob as COMPLETE"]
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style M fill:#da3633,stroke:#f85149,color:#fff
    style U fill:#238636,stroke:#3fb950,color:#fff
    style H fill:#d29922,stroke:#e3b341,color:#000
    style N fill:#6e40c9,stroke:#bc8cff,color:#fff`;

const mermaidEdsSequence = `sequenceDiagram
    participant Cron as Cron Scheduler
    participant Blob as Azure Blob
    participant TaxFee as Tax & Fee API
    participant Libra as Libra API
    participant Mongo as MongoDB
    participant SBus as Service Bus
    Cron->>Blob: List blobs in inbound/CVP/
    Blob-->>Cron: File list
    Cron->>Cron: Validate file prefix 'full'
    Cron->>TaxFee: GET /shipping-config
    TaxFee-->>Cron: ShippingConfigResponse
    Cron->>Libra: GET /zones
    Libra-->>Cron: Free shipping zones
    Cron->>Mongo: Read categories & features
    Cron->>Mongo: Create temp_vehicleV3_ts
    loop For each TSV row (batches of 500)
        Cron->>Cron: Parse 76 EDS fields
        Cron->>Cron: Convert to Vehicle
        Cron->>Mongo: BulkWrite to temp collection
    end
    Cron->>Mongo: Compare temp vs live counts
    alt Delta > 15,000
        Cron->>Cron: Abort - SUSPICIOUS_FILE
    else Safe
        Cron->>Mongo: Calculate inventory deltas
        Cron->>SBus: Publish deltas (batches of 100)
        Cron->>Mongo: Merge temp to vehicleV3
        Cron->>Mongo: Mark missing as DELETED
    end
    Cron->>Mongo: Update job status
    Cron->>Blob: Mark blob as COMPLETE`;

const mermaidPostalCodeSync = `graph TD
    A["Cron: 0 45 0,6,12,18 * * *"] --> B["Call Incentives API"]
    B --> C["GET /regions"]
    C --> D["Invert structure<br/>OEM regions to postal-make-region"]
    D --> E["Merge by postal code"]
    E --> F["Upsert to postalCodeOemRegions"]
    F --> G["Prune stale records"]
    style A fill:#238636,stroke:#3fb950,color:#fff
    style F fill:#1f6feb,stroke:#58a6ff,color:#fff
    style G fill:#d29922,stroke:#e3b341,color:#000`;

const mermaidLeasingConsumer = `graph TD
    A["Azure Service Bus<br/>leasing-incentives-topic"] --> B["LeaseTopicReceiver"]
    B --> C["Deserialize JSON to JsonNode"]
    C --> D["LeasingIncentivesMessageProcessor"]
    D --> E{"Message Type?"}
    E -->|LEASING| F["LeaseHandler"]
    E -->|INCENTIVE| G["IncentivesHandler<br/>No-op"]
    E -->|Unknown| H["DLQ - UnknownMessageTypeException"]
    F --> I["Fetch Vehicle by VIN"]
    I --> J{"Vehicle Condition?"}
    J -->|NEW| K["Process Lease Data"]
    J -->|USED/CPO/UNKNOWN| L["Set canLease=false"]
    K --> M{"Empty Data?"}
    M -->|Yes| N["Leasing canLease=false"]
    M -->|No| O["Convert to RegionData<br/>Sort by regionId<br/>Default price from region 1"]
    O --> P["Update vehicle.leasing in MongoDB"]
    N --> P
    L --> P
    style A fill:#6e40c9,stroke:#bc8cff,color:#fff
    style H fill:#da3633,stroke:#f85149,color:#fff
    style F fill:#238636,stroke:#3fb950,color:#fff
    style G fill:#d29922,stroke:#e3b341,color:#000
    style P fill:#1f6feb,stroke:#58a6ff,color:#fff`;

const mermaidAvailabilitySubscriber = `graph TD
    A["Cart Service"] --> B["Azure Service Bus<br/>cart-status-update-topic"]
    B --> C["CartTopicConsumerStarter"]
    C --> D["Extract enqueuedTime from header"]
    D --> E["AvailabilityRequestHandler"]
    E --> F["Fetch Vehicle by VIN"]
    F --> G{"Vehicle Found?"}
    G -->|No| H["Success - Silent skip"]
    G -->|Yes| I{"Stale Message?<br/>Compare enqueuedTime"}
    I -->|Stale| J["Discard - Success"]
    I -->|Newer| K["AvailabilityProcessor"]
    K --> L["Upsert purchasePending<br/>+ enqueuedTime to vehicleV3"]
    style A fill:#238636,stroke:#3fb950,color:#fff
    style B fill:#6e40c9,stroke:#bc8cff,color:#fff
    style H fill:#d29922,stroke:#e3b341,color:#000
    style J fill:#d29922,stroke:#e3b341,color:#000
    style L fill:#1f6feb,stroke:#58a6ff,color:#fff`;

const mermaidSearchArchitecture = `graph TB
    subgraph Search_GraphQL_Module["Search GraphQL Module"]
        A["search query"]
        B["getFacets query"]
        C_node["getSearchSuggestions query"]
        D_node["getVehicleByVin query"]
        E_node["getVehicleById query"]
        F_node["getVehiclesById query"]
        G_node["getVehiclesByVin query"]
        H_node["checkAvailabilityOfVin query"]
        I_node["checkAvailabilityOfVehicleId query"]
    end
    A --> J["PipelineBuilder"]
    J --> K["MongoDB Atlas Search<br/>$search aggregation"]
    K --> L[("vehicleV3<br/>shopSearch index")]
    B --> M["SearchMetaBuilder"]
    M --> N["$searchMeta with facets"]
    C_node --> O["AutocompleteBuilder"]
    O --> P[("searchSuggestion<br/>shopSuggestions index")]
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style B fill:#1f6feb,stroke:#58a6ff,color:#fff
    style C_node fill:#1f6feb,stroke:#58a6ff,color:#fff
    style J fill:#238636,stroke:#3fb950,color:#fff
    style K fill:#d29922,stroke:#e3b341,color:#000
    style L fill:#d29922,stroke:#e3b341,color:#000
    style P fill:#d29922,stroke:#e3b341,color:#000`;

const mermaidSearchPipeline = `graph TD
    A["Incoming Search Request"] --> B["PipelineBuilder.build()"]
    B --> C["FilterBuilder<br/>status, condition, suppression"]
    C --> D["TextBuilder<br/>keyword search with fuzzy"]
    D --> E["SearchOperatorBuilder<br/>compound must/should/filter"]
    E --> F["ScoringBuilder<br/>boost by price, mileage, photos"]
    F --> G["PostSearchBuilder<br/>sort, skip, limit"]
    G --> H["CountBuilder<br/>$count for totalResults"]
    H --> I["FacetBuilder<br/>make, model, year, condition"]
    I --> J["Final Aggregation Pipeline"]
    J --> K["MongoDB Atlas $search"]
    style A fill:#238636,stroke:#3fb950,color:#fff
    style C fill:#1f6feb,stroke:#58a6ff,color:#fff
    style D fill:#1f6feb,stroke:#58a6ff,color:#fff
    style F fill:#6e40c9,stroke:#bc8cff,color:#fff
    style K fill:#d29922,stroke:#e3b341,color:#000`;

const mermaidServiceBusTopics = `graph LR
    subgraph Publishers
        A["EDS Cron"]
        B["Incentives System"]
        C_pub["Cart Service"]
        D_pub["External Publisher"]
    end
    subgraph Azure_Service_Bus["Azure Service Bus"]
        E_topic["inventory-delta-topic<br/>TTL: 14 days"]
        F_topic["leasing-incentives-topic<br/>TTL: 2 days"]
        G_topic["cart-status-update-topic<br/>TTL: 30 days"]
        H_topic["vehicle-data-topic<br/>TTL: 15 min"]
    end
    subgraph Subscribers
        I_sub["External Systems"]
        J_sub["lease-consumer-sub<br/>Max retries: 5"]
        K_sub["vehicle-availability-subscriber-sub<br/>Max retries: 60"]
        L_sub["vehicle-topic-search-subscriber-sub<br/>Max retries: 5"]
    end
    A --> E_topic
    B --> F_topic
    C_pub --> G_topic
    D_pub --> H_topic
    E_topic --> I_sub
    F_topic --> J_sub
    G_topic --> K_sub
    H_topic --> L_sub
    style E_topic fill:#d29922,stroke:#e3b341,color:#000
    style F_topic fill:#d29922,stroke:#e3b341,color:#000
    style G_topic fill:#d29922,stroke:#e3b341,color:#000
    style H_topic fill:#d29922,stroke:#e3b341,color:#000
    style A fill:#238636,stroke:#3fb950,color:#fff
    style J_sub fill:#6e40c9,stroke:#bc8cff,color:#fff
    style K_sub fill:#6e40c9,stroke:#bc8cff,color:#fff
    style L_sub fill:#6e40c9,stroke:#bc8cff,color:#fff`;

const mermaidCompleteDataFlow = `graph TB
    EDS["EDS TSV Files"] -->|"GZIP Blob"| BLOB["Azure Blob Storage"]
    BLOB -->|"Every 30 min"| CRON["Cron Module"]
    CRON -->|"Parse & Convert"| TEMP[("temp_vehicleV3")]
    TEMP -->|Merge| LIVE[("vehicleV3")]
    CRON -->|"Publish Deltas"| DELTA["inventory-delta-topic"]
    DELTA -->|External| EXT["External Systems"]
    LEASE["Incentives System"] -->|"Lease Data"| LT["leasing-incentives-topic"]
    LT -->|Consumer| CONS["Consumer Module"]
    CONS -->|"Update leasing"| LIVE
    CART["Cart Service"] -->|"Cart Status"| CT["cart-status-update-topic"]
    CT -->|Subscriber| AVAIL["Availability Module"]
    AVAIL -->|"Update purchasePending"| LIVE
    LIVE -->|"Atlas Search"| SEARCH["Search Module"]
    SEARCH -->|GraphQL| CLIENT["Web/Mobile Clients"]
    INC["Incentives API"] -->|Regions| POSTAL[("postalCodeOemRegions")]
    POSTAL -->|"Lease filtering"| SEARCH
    IMPEL["Impel SpinCar"] -->|Notifications| API["Routes Module"]
    API -->|"Update spinUrl"| LIVE
    TAX["Tax & Fee API"] -->|"Shipping Config"| CRON
    LIBRA["Libra API"] -->|"Free Zones"| CRON
    style CRON fill:#238636,stroke:#3fb950,color:#fff
    style CONS fill:#6e40c9,stroke:#bc8cff,color:#fff
    style AVAIL fill:#6e40c9,stroke:#bc8cff,color:#fff
    style LIVE fill:#d29922,stroke:#e3b341,color:#000
    style SEARCH fill:#1f6feb,stroke:#58a6ff,color:#fff
    style CLIENT fill:#1f6feb,stroke:#58a6ff,color:#fff
    style DELTA fill:#d29922,stroke:#e3b341,color:#000
    style LT fill:#d29922,stroke:#e3b341,color:#000
    style CT fill:#d29922,stroke:#e3b341,color:#000`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function OdysseyServicesPage() {
  const { setSidebar, clearSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('Services & Workers', tocItems);
    return () => clearSidebar();
  }, [setSidebar, clearSidebar]);

  return (
    <>
      {/* ============================================================= */}
      {/*  HERO                                                          */}
      {/* ============================================================= */}
      <section style={heroSection}>
        <div style={heroGradientBg} />
        <motion.div style={heroContent} {...fadeUp}>
          <h1 style={heroTitle}>Odyssey-Api Services & Background Workers</h1>
          <p style={heroSubtitle}>
            A complete reference for every cron job, message consumer, availability subscriber,
            and search component that powers the Driveway.com Shop inventory pipeline.
          </p>
          <div style={statsRow}>
            {[
              { val: '5', label: 'Cron Jobs', color: c.accent2 },
              { val: '2', label: 'Consumers', color: c.accent3 },
              { val: '1', label: 'Availability Sub', color: c.orange },
              { val: '4', label: 'Service Bus Topics', color: c.cyan },
            ].map((s) => (
              <div key={s.label} style={statBox}>
                <div style={{ ...statVal, color: s.color }}>{s.val}</div>
                <div style={statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============================================================= */}
      {/*  1. SERVICES OVERVIEW                                          */}
      {/* ============================================================= */}
      <section id="overview" style={sectionSpacing}>
        <SectionHeader
          label="Architecture"
          title="Services Overview"
          description="All background workers, consumers, and subscribers that keep Odyssey's vehicle inventory fresh and accurate."
        />

        <motion.div {...fadeUp}>
          <p style={para}>
            The Odyssey-Api backend consists of several background services that continuously process data from external
            sources, message queues, and internal schedules. These services work together to maintain an up-to-date inventory
            of over 100,000 vehicles across hundreds of dealerships. Each service has a specific responsibility and operates
            independently, communicating through MongoDB and Azure Service Bus.
          </p>
          <p style={para}>
            The <strong>Cron Module</strong> runs five scheduled jobs: the primary EDS Vehicle Import (every 30 minutes),
            Postal Code Region Sync (4 times daily), Stale Records Cleanup (hourly), Temp Collections Cleanup (daily), and
            Spin Count Metrics (every 5 minutes). The <strong>Consumer Module</strong> handles lease pricing updates from
            the leasing-incentives-topic. The <strong>Availability Module</strong> processes cart status events to track
            which vehicles have pending purchases.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>Cron Module (5 Jobs)</div>
              <div style={infoCardText}>
                Scheduled background tasks that import vehicle data from Azure Blob Storage, sync postal code region
                mappings from the Incentives API, clean up stale records, drop old temp collections, and track spin
                image metrics. The heaviest job is the EDS import running every 30 minutes.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent3 }}>Consumer Module (2 Handlers)</div>
              <div style={infoCardText}>
                Listens to the <code style={{ color: c.cyan }}>leasing-incentives-topic</code> Azure Service Bus topic.
                The LeaseHandler processes LEASING messages to update vehicle lease pricing with region-specific data.
                The IncentivesHandler is a no-op placeholder for future INCENTIVE message processing.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.orange }}>Availability Module (1 Subscriber)</div>
              <div style={infoCardText}>
                Subscribes to <code style={{ color: c.cyan }}>cart-status-update-topic</code> to receive cart
                events. Updates the <code style={{ color: c.cyan }}>purchasePending</code> flag on vehicles in
                MongoDB, with stale message detection based on enqueued timestamps.
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Services Architecture"
            tabs={[{ label: 'Overview', source: mermaidOverviewArch }]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="info" title="How Services Communicate">
            All background services share the same MongoDB database (<code>shopInventory</code>) and the same
            <code> vehicleV3</code> collection. The Cron Module publishes inventory deltas to Azure Service Bus for
            downstream consumers (like the F&I system). The Consumer and Availability modules consume messages from
            their respective topics and write updates directly to MongoDB. There is no direct HTTP communication
            between these background services.
          </Callout>
        </motion.div>
      </section>

      {/* ============================================================= */}
      {/*  2. EDS VEHICLE IMPORT (THE MOST DETAILED SECTION)             */}
      {/* ============================================================= */}
      <section id="eds-import" style={sectionSpacing}>
        <SectionHeader
          label="Data Ingestion"
          title="EDS Vehicle Import"
          description="The most critical cron job: an 8-stage pipeline that ingests 100K+ vehicles from GZIP TSV files every 30 minutes."
        />

        <motion.div {...fadeUp}>
          <p style={para}>
            The EDS (External Data Source) Vehicle Import is the primary data ingestion pipeline for the entire Odyssey
            inventory system. It runs every 30 minutes via a cron schedule and processes GZIP-compressed TSV files from
            Azure Blob Storage. Each file contains the complete vehicle inventory from EDS, with 76 tab-separated fields
            per row including VIN, pricing, dealer information, vehicle specifications, and merchandising data.
          </p>
          <p style={para}>
            The import follows an 8-stage pipeline designed for safety and reliability. It first discovers new files in
            Azure Blob Storage, validates file naming conventions, fetches shipping configuration from the Tax & Fee API,
            retrieves free shipping zones from the Libra API, and loads category/feature mappings from MongoDB. Only then
            does it begin parsing the TSV data and staging vehicles in a temporary collection before performing a safety
            check and merging into the live collection.
          </p>
          <p style={para}>
            This pipeline processes approximately 100,000 to 150,000 vehicles per run. The entire operation typically
            completes in 5 to 15 minutes depending on file size and system load. The temporary collection approach ensures
            that the live <code style={{ color: c.cyan }}>vehicleV3</code> collection is never in an inconsistent state
            during the import process.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Complete 8-Stage Pipeline</h3>
          <p style={para}>
            The following diagram shows every stage of the EDS import pipeline, from file discovery in Azure Blob Storage
            through final status updates. Notice the safety check at stage 8 -- if the delta between the incoming file
            and the live collection exceeds 15,000 vehicles, the import is immediately aborted with a SUSPICIOUS_FILE
            status to prevent catastrophic data loss from corrupted or incomplete files.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="EDS Import Pipeline"
            tabs={[
              { label: 'Pipeline Flow', source: mermaidEdsPipeline },
              { label: 'Sequence Diagram', source: mermaidEdsSequence },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Pipeline Stage Breakdown</h3>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>Stage 1: File Discovery</div>
              <div style={infoCardText}>
                The cron scheduler invokes <code style={{ color: c.cyan }}>EdsVehicleReaderV2.runVehicleReaderImport()</code>.
                It lists all blobs in the <code style={{ color: c.cyan }}>inbound/CVP/Driveway-Merchandising-V2/</code> container.
                Only files with a prefix of <code style={{ color: c.cyan }}>'full'</code> are considered valid inventory files.
                Files with other prefixes (like 'delta' or 'partial') are silently skipped.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>Stage 2: External Data Fetch</div>
              <div style={infoCardText}>
                Before parsing any vehicles, the system fetches two critical datasets:
                (1) <strong>Shipping Config</strong> from the Tax & Fee API -- determines shipping costs and tax calculations per state;
                (2) <strong>Free Zones</strong> from the Libra API -- identifies which dealer zones qualify for free shipping.
                These are needed during vehicle conversion to calculate proper pricing.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>Stage 3: Category & Feature Load</div>
              <div style={infoCardText}>
                Reads vehicle categories and feature mappings from MongoDB. These are reference data collections used during
                the TSV-to-Vehicle conversion to map raw EDS category codes to human-readable categories, body styles,
                and feature lists. This data is cached in memory for the duration of the import.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.orange }}>Stage 4: Temp Collection Creation</div>
              <div style={infoCardText}>
                Creates a new temporary collection named <code style={{ color: c.cyan }}>temp_vehicleV3_{'<timestamp>'}</code>.
                This collection receives all parsed vehicles before any comparison with the live data. Using a temp collection
                ensures the live <code style={{ color: c.cyan }}>vehicleV3</code> collection remains consistent throughout the import.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent3 }}>Stage 5: TSV Parsing & Conversion</div>
              <div style={infoCardText}>
                The GZIP TSV file is streamed and parsed row by row. Each row contains 76 tab-separated fields including VIN,
                stock number, price, mileage, dealer code, year/make/model/trim, colors, options, and more. The
                <code style={{ color: c.cyan }}> ExtractedRowToVehicleConverter</code> transforms each row into a typed Vehicle
                object with proper data validation and normalization.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.cyan }}>Stage 6: Batch Upload</div>
              <div style={infoCardText}>
                Vehicles are uploaded to the temp collection in batches of 500 using MongoDB BulkWrite operations.
                A semaphore with 5 permits controls concurrency, allowing up to 5 batch writes to execute in parallel.
                This provides a good balance between throughput and database connection pressure.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.red }}>Stage 7: Safety Check & Deltas</div>
              <div style={infoCardText}>
                Compares the vehicle count in the temp collection against the live collection. If the absolute difference
                exceeds <strong>15,000 vehicles</strong>, the import is aborted with SUSPICIOUS_FILE status. For safe deltas,
                the system calculates NEW (added), UPDATE (changed), and DELETE (removed) vehicle sets using VIN-based
                set operations, then publishes them to <code style={{ color: c.cyan }}>inventory-delta-topic</code> in batches of 100.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>Stage 8: Merge & Finalize</div>
              <div style={infoCardText}>
                The temp collection is merged into the live <code style={{ color: c.cyan }}>vehicleV3</code> collection.
                Critical fields are preserved during merge: <code style={{ color: c.cyan }}>leasing</code>,
                <code style={{ color: c.cyan }}> manuallySuppressed</code>, <code style={{ color: c.cyan }}>availability</code>.
                Vehicles not present in the incoming file are marked as <code style={{ color: c.cyan }}>DELETED</code>.
                Lease expiries are then applied and search suggestions are updated.
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="warning" title="Suspicious Delta Threshold: 15,000 Vehicles">
            If the difference between the incoming file's vehicle count and the current live collection exceeds 15,000 vehicles
            in either direction, the import is immediately aborted. This safety mechanism prevents catastrophic data loss from
            corrupted files, partial uploads, or EDS system failures. The job status is set to SUSPICIOUS_FILE and the temp
            collection is preserved for manual inspection. An operator must investigate before the next import can proceed.
          </Callout>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Cron Schedule</h3>
          <p style={para}>
            The EDS import runs every 30 minutes on the hour and half-hour. The cron expression below uses the standard
            Spring 6-field format (second, minute, hour, day, month, weekday):
          </p>
          <CodeBlock
            language="yaml"
            filename="application.yml"
            code={`# EDS Vehicle Import - runs at :00 and :30 every hour
cron:
  eds-import:
    schedule: "0 0,30 * * * *"
    # Translates to: second=0, minute=0 and 30, every hour, every day
    # Runs at 00:00, 00:30, 01:00, 01:30, ... 23:00, 23:30 UTC`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Key Configuration Parameters</h3>
          <DataTable
            headers={['Parameter', 'Value', 'Description']}
            rows={[
              ['Batch Size', '500', 'Number of vehicles per BulkWrite operation'],
              ['Concurrency', '5', 'Semaphore permits for parallel batch uploads'],
              ['Delta Batch Size', '100', 'Number of inventory deltas per Service Bus message'],
              ['Safety Threshold', '15,000', 'Max vehicle count difference before abort'],
              ['Blob Path', 'inbound/CVP/Driveway-Merchandising-V2/', 'Azure Blob container path'],
              ['File Prefix', 'full', 'Required prefix for valid inventory files'],
              ['TSV Fields', '76', 'Number of tab-separated fields per vehicle row'],
              ['Temp Collection TTL', '28 days', 'Days before temp collections are cleaned up'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Preserved Fields During Merge</h3>
          <p style={para}>
            When the temp collection is merged into the live <code style={{ color: c.cyan }}>vehicleV3</code> collection,
            certain fields are explicitly preserved from the existing live document. These fields are populated by other
            services (consumers, subscribers, admin APIs) and would be lost if overwritten by the EDS data:
          </p>
          <DataTable
            headers={['Field', 'Source', 'Reason']}
            rows={[
              ['leasing', 'Leasing Consumer', 'Regional lease pricing from leasing-incentives-topic'],
              ['manuallySuppressed', 'Admin API', 'Manual suppression flags set by dealership admins'],
              ['availability', 'Availability Subscriber', 'Cart status (purchasePending) from cart events'],
              ['spinUrl', 'Impel/SpinCar webhook', '360-degree spin image URLs from Impel notifications'],
              ['scoreWeights', 'Admin API', 'Custom search ranking weights per vehicle'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Inventory Delta Types</h3>
          <p style={para}>
            After the safety check passes, the system calculates three types of inventory deltas by comparing VIN sets
            between the temp and live collections:
          </p>
          <div style={cardGrid3}>
            <div style={{ ...infoCard, borderLeft: `3px solid ${c.accent2}` }}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>ADD</div>
              <div style={infoCardText}>
                VINs present in the incoming file but not in the live collection. These are brand new vehicles
                entering the inventory for the first time.
              </div>
            </div>
            <div style={{ ...infoCard, borderLeft: `3px solid ${c.orange}` }}>
              <div style={{ ...infoCardTitle, color: c.orange }}>UPDATE</div>
              <div style={infoCardText}>
                VINs present in both collections where price or mileage has changed. Vehicles with no data changes
                are silently skipped to reduce Service Bus message volume.
              </div>
            </div>
            <div style={{ ...infoCard, borderLeft: `3px solid ${c.red}` }}>
              <div style={{ ...infoCardTitle, color: c.red }}>DELETE</div>
              <div style={infoCardText}>
                VINs present in the live collection but not in the incoming file. These vehicles are no longer
                in the dealer inventory and are marked with status=DELETED.
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============================================================= */}
      {/*  3. POSTAL CODE REGION SYNC                                    */}
      {/* ============================================================= */}
      <section id="cron-postal" style={sectionSpacing}>
        <SectionHeader
          label="Scheduled Job"
          title="Postal Code Region Sync"
          description="Maps postal codes to OEM leasing regions by querying the Incentives API four times daily."
        />

        <motion.div {...fadeUp}>
          <p style={para}>
            The Postal Code Region Sync job maintains a mapping between US postal codes and OEM-specific leasing regions.
            This mapping is critical for the search module, which uses it to determine which lease prices to show
            users based on their location. The job runs four times daily (at 00:45, 06:45, 12:45, and 18:45 UTC) to keep
            the mapping current with the latest OEM region definitions.
          </p>
          <p style={para}>
            The job calls the Incentives API's <code style={{ color: c.cyan }}>GET /regions</code> endpoint, which returns
            a structure organized by OEM region. The sync process inverts this structure -- transforming from
            region-centric to postal-code-centric -- so that lookups by postal code are efficient. The inverted data maps
            each postal code to a set of makes and their corresponding region IDs. This is then upserted into the
            <code style={{ color: c.cyan }}> postalCodeOemRegions</code> MongoDB collection with a merge-by-postal-code
            strategy. Finally, stale records that were not updated during this sync cycle are pruned.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Postal Code Region Sync Flow"
            tabs={[{ label: 'Sync Flow', source: mermaidPostalCodeSync }]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CodeBlock
            language="yaml"
            filename="application.yml"
            code={`# Postal Code Region Sync - runs 4x daily
cron:
  postal-code-sync:
    schedule: "0 45 0,6,12,18 * * *"
    # Runs at 00:45, 06:45, 12:45, 18:45 UTC
    # Ensures region mappings are refreshed before peak traffic hours`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Data Transformation</h3>
          <p style={para}>
            The Incentives API returns data in an OEM-region-centric format. The sync job inverts this to a
            postal-code-centric format for efficient querying:
          </p>
          <CodeBlock
            language="kotlin"
            filename="PostalCodeRegionSync.kt (conceptual)"
            code={`// Input from Incentives API (region-centric):
// Region 1 -> [postalCodes: 10001, 10002, ...], make: "Toyota"
// Region 2 -> [postalCodes: 20001, 20002, ...], make: "Toyota"
// Region 3 -> [postalCodes: 10001, 30001, ...], make: "Honda"

// Output to MongoDB (postal-code-centric):
// { postalCode: "10001", makes: { "Toyota": regionId=1, "Honda": regionId=3 } }
// { postalCode: "10002", makes: { "Toyota": regionId=1 } }
// { postalCode: "20001", makes: { "Toyota": regionId=2 } }
// { postalCode: "30001", makes: { "Honda": regionId=3 } }

// This allows efficient O(1) lookup:
// "What region is postal code 10001 in for Toyota?" -> Region 1`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="info" title="Why 4 Times Daily?">
            OEM leasing regions change infrequently (typically monthly), but the 4x daily schedule ensures that any
            region boundary changes are picked up within 6 hours. The sync is lightweight (typically under 30 seconds)
            because the Incentives API response is cached and the MongoDB upserts are batched.
          </Callout>
        </motion.div>
      </section>

      {/* ============================================================= */}
      {/*  4. CLEANUP JOBS                                               */}
      {/* ============================================================= */}
      <section id="cron-cleanup" style={sectionSpacing}>
        <SectionHeader
          label="Maintenance"
          title="Cleanup Jobs"
          description="Three housekeeping cron jobs that maintain database health: stale record cleanup, temp collection drops, and spin count metrics."
        />

        <motion.div {...fadeUp}>
          <p style={para}>
            Beyond the primary EDS import and postal code sync, the Cron Module runs three additional maintenance jobs
            that keep the database clean and provide operational metrics. These jobs are designed to be lightweight and
            non-disruptive, running during off-peak hours or at short intervals with minimal database impact.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Stale Records Cleanup</h3>
          <p style={para}>
            Runs hourly at minute :15 to permanently delete vehicles that have been marked with
            <code style={{ color: c.cyan }}> status=DELETED</code> by the EDS import process. When the EDS import detects
            that a VIN is no longer present in the incoming file, it marks the vehicle as DELETED rather than immediately
            removing it. This provides a grace period where the vehicle is hidden from search results but can still be
            looked up by VIN for in-progress transactions. The cleanup job permanently removes these records after they've
            been in DELETED status for a configurable period.
          </p>
          <CodeBlock
            language="yaml"
            filename="application.yml"
            code={`# Stale Records Cleanup - runs hourly at :15
cron:
  stale-cleanup:
    schedule: "0 15 * * * *"
    # Deletes vehicles with status=DELETED
    # Grace period allows in-progress transactions to complete`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Temp Collections Cleanup</h3>
          <p style={para}>
            Runs daily at 08:10 UTC to drop temporary collections (<code style={{ color: c.cyan }}>temp_vehicleV3_*</code>)
            that are older than 28 days. During the EDS import, each run creates a new temporary collection named with a
            timestamp suffix. After a successful merge, the temp collection is normally dropped immediately. However,
            failed imports (especially SUSPICIOUS_FILE aborts) leave their temp collections intact for debugging.
            This cleanup job ensures these orphaned collections don't accumulate and waste storage.
          </p>
          <CodeBlock
            language="yaml"
            filename="application.yml"
            code={`# Temp Collections Cleanup - daily at 08:10 UTC
cron:
  temp-cleanup:
    schedule: "0 10 8 * * *"
    retention-days: 28
    # Drops temp_vehicleV3_* collections older than 28 days
    # Preserves recent temp collections for debugging failed imports`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Spin Count Metrics</h3>
          <p style={para}>
            Runs every 5 minutes to count the number of vehicles in the live collection that have a non-null
            <code style={{ color: c.cyan }}> spinUrl</code> field. This metric is published to a Prometheus gauge for
            monitoring dashboards. SpinCar/Impel 360-degree photos are a premium feature, and tracking the percentage
            of inventory with spin images helps the merchandising team measure coverage and identify gaps.
          </p>
          <CodeBlock
            language="yaml"
            filename="application.yml"
            code={`# Spin Count Metrics - every 5 minutes
cron:
  spin-count:
    schedule: "0 */5 * * * *"
    # Counts vehicles where spinUrl != null
    # Updates Prometheus gauge: odyssey_spin_vehicle_count`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>All Cron Schedules Summary</h3>
          <DataTable
            headers={['Job Name', 'Schedule (Cron)', 'Frequency', 'Description', 'Impact']}
            rows={[
              ['EDS Vehicle Import', '0 0,30 * * * *', 'Every 30 min', 'Import vehicles from GZIP TSV files', 'High - writes 100K+ vehicles'],
              ['Postal Code Region Sync', '0 45 0,6,12,18 * * *', '4x daily', 'Sync OEM region-to-postal-code mappings', 'Low - upserts ~40K postal codes'],
              ['Stale Records Cleanup', '0 15 * * * *', 'Hourly', 'Delete vehicles with status=DELETED', 'Medium - removes stale records'],
              ['Temp Collections Cleanup', '0 10 8 * * *', 'Daily', 'Drop temp_vehicleV3_* older than 28 days', 'Low - drops orphaned collections'],
              ['Spin Count Metrics', '0 */5 * * * *', 'Every 5 min', 'Count vehicles with spin images', 'Minimal - read-only count query'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="success" title="Idempotent by Design">
            All cleanup jobs are designed to be idempotent. Running them multiple times produces the same result as
            running them once. If a job fails mid-execution, it can safely be retried without any risk of data
            corruption or double-deletion. The stale records cleanup uses a query filter on status=DELETED, so
            vehicles that have already been cleaned up are simply not found on retry.
          </Callout>
        </motion.div>
      </section>

      {/* ============================================================= */}
      {/*  5. LEASING CONSUMER                                           */}
      {/* ============================================================= */}
      <section id="consumer-leasing" style={sectionSpacing}>
        <SectionHeader
          label="Message Consumer"
          title="Leasing Consumer"
          description="Processes lease pricing messages from the leasing-incentives-topic to update vehicle lease data in real-time."
        />

        <motion.div {...fadeUp}>
          <p style={para}>
            The Leasing Consumer is an Azure Service Bus message consumer that listens to the
            <code style={{ color: c.cyan }}> leasing-incentives-topic</code> via the
            <code style={{ color: c.cyan }}> lease-consumer-sub</code> subscription. It processes two types of messages:
            LEASING (active) and INCENTIVE (no-op placeholder). When a LEASING message arrives, the consumer fetches
            the target vehicle by VIN, converts the incoming lease data into region-specific pricing, and updates the
            vehicle's <code style={{ color: c.cyan }}>leasing</code> field in MongoDB.
          </p>
          <p style={para}>
            The processing logic has several important branches. Only vehicles with a condition of NEW are eligible
            for lease pricing. Used, CPO, and Unknown condition vehicles have their
            <code style={{ color: c.cyan }}> canLease</code> flag set to false immediately. For new vehicles with
            valid lease data, the consumer converts the incoming region data into sorted
            <code style={{ color: c.cyan }}> RegionData</code> objects and uses region 1 as the default price
            (if present). Empty lease data results in canLease=false.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Leasing Consumer Message Flow"
            tabs={[{ label: 'Processing Flow', source: mermaidLeasingConsumer }]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Message Model</h3>
          <CodeBlock
            language="kotlin"
            filename="LeaseIncentivesMessage.kt"
            code={`data class LeaseIncentivesMessage(
    val type: MessageType,          // LEASING or INCENTIVE
    val vin: String,                // Vehicle Identification Number
    val make: String,               // e.g. "Toyota", "Honda"
    val regions: List<RegionInfo>   // Region-specific lease pricing
)

enum class MessageType {
    LEASING,    // Active handler - updates vehicle.leasing
    INCENTIVE   // No-op placeholder for future use
}

data class RegionInfo(
    val regionId: Int,              // OEM region identifier (1-based)
    val amountInCents: Int,         // Monthly lease payment in cents
    val expiresOn: String           // ISO date when this pricing expires
)

// After processing, the vehicle document is updated:
data class Leasing(
    val canLease: Boolean,          // true if any active regions exist
    val defaultPrice: Int?,         // amountInCents from region 1 (or null)
    val regionalPrices: List<RegionData>  // sorted by regionId
)`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Processing Rules</h3>
          <DataTable
            headers={['Condition', 'Vehicle Status', 'Action']}
            rows={[
              ['NEW vehicle + valid regions', 'condition=NEW', 'Convert regions to RegionData, sort by regionId, set defaultPrice from region 1, canLease=true'],
              ['NEW vehicle + empty data', 'condition=NEW', 'Set canLease=false, clear regionalPrices, defaultPrice=null'],
              ['USED vehicle', 'condition=USED', 'Set canLease=false immediately (leasing not available for used vehicles)'],
              ['CPO vehicle', 'condition=CPO', 'Set canLease=false immediately (leasing not available for CPO vehicles)'],
              ['UNKNOWN condition', 'condition=UNKNOWN', 'Set canLease=false as a safety default'],
              ['Vehicle not found', 'N/A', 'Log warning and acknowledge message (no retry needed)'],
              ['Unknown message type', 'N/A', 'Throw UnknownMessageTypeException, message sent to DLQ'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="info" title="Subscription Configuration">
            <strong>Topic:</strong> leasing-incentives-topic | <strong>Subscription:</strong> lease-consumer-sub |
            <strong> Max Delivery Count:</strong> 5 | <strong>Lock Duration:</strong> 5 minutes |
            <strong> TTL:</strong> 2 days. After 5 failed delivery attempts, messages are moved to the dead-letter
            queue (DLQ) for manual investigation. The 5-minute lock duration gives the consumer ample time to
            process each message, including the MongoDB read and write operations.
          </Callout>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Error Handling</h3>
          <p style={para}>
            The consumer implements a robust error handling strategy. Transient errors (network timeouts, MongoDB connection
            issues) result in the message being redelivered up to 5 times. The lock duration of 5 minutes ensures that
            failed messages are not immediately redelivered, providing natural back-off behavior. Permanent errors
            (such as an unknown message type) throw a specific exception that routes the message directly to the
            dead-letter queue without retry.
          </p>
          <div style={cardGrid}>
            <div style={{ ...infoCard, borderLeft: `3px solid ${c.accent2}` }}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>Transient Errors</div>
              <div style={infoCardText}>
                MongoDB connection timeouts, network glitches, and temporary API failures cause the message to be
                abandoned (lock released) and redelivered after the lock duration expires. Up to 5 retries.
              </div>
            </div>
            <div style={{ ...infoCard, borderLeft: `3px solid ${c.red}` }}>
              <div style={{ ...infoCardTitle, color: c.red }}>Permanent Errors</div>
              <div style={infoCardText}>
                Unknown message types, malformed JSON, or missing required fields throw specific exceptions that
                cause the message to be dead-lettered immediately without exhausting all retry attempts.
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============================================================= */}
      {/*  6. AVAILABILITY SUBSCRIBER                                    */}
      {/* ============================================================= */}
      <section id="consumer-availability" style={sectionSpacing}>
        <SectionHeader
          label="Event Subscriber"
          title="Availability Subscriber"
          description="Tracks vehicle purchase status by consuming cart events with intelligent stale message detection."
        />

        <motion.div {...fadeUp}>
          <p style={para}>
            The Availability Subscriber listens to the <code style={{ color: c.cyan }}>cart-status-update-topic</code> via
            the <code style={{ color: c.cyan }}>vehicle-availability-subscriber-sub</code> subscription. When a customer
            adds a vehicle to their cart or completes/abandons a purchase, the Cart Service publishes a status update
            message. The subscriber processes these events to update the
            <code style={{ color: c.cyan }}> purchasePending</code> flag on the corresponding vehicle in MongoDB, which
            controls whether the vehicle appears as "available" or "purchase pending" in search results.
          </p>
          <p style={para}>
            A critical feature of this subscriber is its <strong>stale message detection</strong> mechanism. Because
            messages can be redelivered out of order (especially with a high retry count of 60), the subscriber
            compares the <code style={{ color: c.cyan }}>enqueuedTime</code> from the message header against the
            <code style={{ color: c.cyan }}> enqueuedTime</code> stored on the vehicle document. If the incoming message
            is older than the last processed message, it is silently discarded as stale. This prevents a scenario where
            an older "available" message overwrites a newer "purchase pending" status.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Availability Subscriber Flow"
            tabs={[{ label: 'Processing Flow', source: mermaidAvailabilitySubscriber }]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Message Model</h3>
          <CodeBlock
            language="kotlin"
            filename="CartStatusUpdateNotificationMessage.kt"
            code={`data class CartStatusUpdateNotificationMessage(
    val vin: String,                    // Vehicle Identification Number
    val purchasePending: Boolean,       // true = in cart, false = released
    val salesPending: Boolean?,         // Optional: sale in progress
    val salesBooked: Boolean?,          // Optional: sale completed
    val inventoryInTransit: Boolean?,   // Optional: vehicle being transported
    val reconOrderOpen: Boolean?        // Optional: reconditioning in progress
)

// Message headers (extracted by CartTopicConsumerStarter):
// - enqueuedTime: Instant  (from ServiceBusReceivedMessage header)
//   Used for stale message detection

// The vehicle document is updated with:
data class Availability(
    val purchasePending: Boolean,
    val salesPending: Boolean?,
    val salesBooked: Boolean?,
    val inventoryInTransit: Boolean?,
    val reconOrderOpen: Boolean?,
    val enqueuedTime: Instant           // Stored for staleness comparison
)`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Stale Message Detection</h3>
          <p style={para}>
            The stale message detection logic is essential for maintaining data consistency given the subscriber's
            aggressive retry configuration (60 max retries, 1-minute lock duration = up to 1 hour of retries).
            Here is how it works:
          </p>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>Step 1: Extract Enqueued Time</div>
              <div style={infoCardText}>
                The <code style={{ color: c.cyan }}>CartTopicConsumerStarter</code> extracts the
                <code style={{ color: c.cyan }}> enqueuedTime</code> from the Service Bus message header. This is the
                timestamp when the message was originally published by the Cart Service, not when it was received.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>Step 2: Fetch Current Vehicle</div>
              <div style={infoCardText}>
                The handler fetches the vehicle document from MongoDB by VIN. If the vehicle is not found (perhaps
                deleted between message publish and delivery), the message is acknowledged as a success without any
                update. No retry is needed for missing vehicles.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>Step 3: Compare Timestamps</div>
              <div style={infoCardText}>
                The handler compares the incoming message's <code style={{ color: c.cyan }}>enqueuedTime</code> with the
                vehicle's stored <code style={{ color: c.cyan }}>availability.enqueuedTime</code>. If the incoming
                message is older (i.e., enqueued before the last successfully processed message), it is discarded.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>Step 4: Upsert or Discard</div>
              <div style={infoCardText}>
                If the message is newer, the <code style={{ color: c.cyan }}>AvailabilityProcessor</code> upserts the
                <code style={{ color: c.cyan }}> purchasePending</code> flag along with the new
                <code style={{ color: c.cyan }}> enqueuedTime</code>. Stale messages return success to prevent
                unnecessary retries.
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="warning" title="Aggressive Retry Configuration">
            The availability subscriber has <strong>60 max retries</strong> with a <strong>1-minute lock duration</strong>,
            meaning a single message can be retried for up to <strong>1 hour</strong> before being dead-lettered. This
            aggressive configuration ensures cart status updates are eventually processed even during extended MongoDB
            outages. However, it also means messages can arrive significantly out of order, which is why the stale
            message detection is critical for data correctness.
          </Callout>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <DataTable
            headers={['Configuration', 'Value', 'Notes']}
            rows={[
              ['Topic', 'cart-status-update-topic', 'Published by Cart Service'],
              ['Subscription', 'vehicle-availability-subscriber-sub', 'Dedicated subscription for Odyssey'],
              ['Max Delivery Count', '60', 'Very aggressive - 1 hour max retry window'],
              ['Lock Duration', '1 minute', 'Short lock for fast redelivery on failure'],
              ['TTL', '30 days', 'Messages expire after 30 days if undelivered'],
              ['Effective Retry Window', '~1 hour', '60 retries * 1 min lock = 60 min max'],
            ]}
          />
        </motion.div>
      </section>

      {/* ============================================================= */}
      {/*  7. SEARCH ENGINE                                              */}
      {/* ============================================================= */}
      <section id="search-engine" style={sectionSpacing}>
        <SectionHeader
          label="Query Layer"
          title="Search Engine"
          description="MongoDB Atlas Search-powered search with a modular pipeline builder architecture supporting facets, autocomplete, and scored results."
        />

        <motion.div {...fadeUp}>
          <p style={para}>
            The Odyssey Search Engine is the query layer that powers Driveway.com's vehicle search experience. It is
            built on MongoDB Atlas Search, which provides full-text search, faceted navigation, and autocomplete
            capabilities through the <code style={{ color: c.cyan }}>$search</code> and
            <code style={{ color: c.cyan }}> $searchMeta</code> aggregation pipeline stages. The search module exposes
            a GraphQL API with multiple queries optimized for different use cases: general search, facet retrieval,
            autocomplete suggestions, and individual vehicle lookups.
          </p>
          <p style={para}>
            The architecture uses a <strong>modular pipeline builder pattern</strong> where each aspect of the search
            (filtering, text matching, scoring, pagination) is handled by a dedicated builder class. These builders
            compose together to create a MongoDB aggregation pipeline that is then executed against the
            <code style={{ color: c.cyan }}> vehicleV3</code> collection's
            <code style={{ color: c.cyan }}> shopSearch</code> Atlas Search index. This separation of concerns makes the
            search logic highly testable and extensible.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Search Architecture"
            tabs={[
              { label: 'Module Overview', source: mermaidSearchArchitecture },
              { label: 'Pipeline Layers', source: mermaidSearchPipeline },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>GraphQL Queries</h3>
          <p style={para}>
            The search module exposes the following GraphQL queries, each optimized for a specific frontend use case:
          </p>
          <DataTable
            headers={['Query', 'Use Case', 'Backend Builder', 'Index']}
            rows={[
              ['search', 'Main SRP (Search Results Page)', 'PipelineBuilder', 'shopSearch'],
              ['getFacets', 'Filter sidebar counts', 'SearchMetaBuilder', 'shopSearch'],
              ['getSearchSuggestions', 'Autocomplete dropdown', 'AutocompleteBuilder', 'shopSuggestions'],
              ['getVehicleByVin', 'VDP (Vehicle Detail Page)', 'Direct MongoDB query', 'N/A (by VIN)'],
              ['getVehicleById', 'VDP by internal ID', 'Direct MongoDB query', 'N/A (by _id)'],
              ['getVehiclesById', 'Batch vehicle fetch', 'Direct MongoDB query', 'N/A (by _id list)'],
              ['getVehiclesByVin', 'Batch VIN lookup', 'Direct MongoDB query', 'N/A (by VIN list)'],
              ['checkAvailabilityOfVin', 'Cart availability check', 'Direct MongoDB query', 'N/A (by VIN)'],
              ['checkAvailabilityOfVehicleId', 'Cart availability check', 'Direct MongoDB query', 'N/A (by _id)'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Pipeline Builder Components</h3>
          <p style={para}>
            The main <code style={{ color: c.cyan }}>search</code> query delegates to the
            <code style={{ color: c.cyan }}> PipelineBuilder</code>, which orchestrates multiple specialized builders to
            construct the final MongoDB aggregation pipeline. Each builder is responsible for one logical layer:
          </p>
          <DataTable
            headers={['Builder', 'Responsibility', 'Pipeline Stage(s)']}
            rows={[
              ['PipelineBuilder', 'Orchestrates all builders, produces final pipeline', '$search + post-processing stages'],
              ['SearchBuilder', 'Constructs the $search stage with compound operators', '$search'],
              ['SearchOperatorBuilder', 'Builds compound must/should/filter clauses', 'Nested in $search'],
              ['FilterBuilder', 'Applies non-text filters (status, condition, suppression, price range, etc.)', 'filter clause in compound'],
              ['TextBuilder', 'Handles keyword search with fuzzy matching and boosting', 'must/should clause in compound'],
              ['ScoringBuilder', 'Applies custom scoring functions (boost by photo count, recency, price)', 'score in $search'],
              ['PostSearchBuilder', 'Adds $sort, $skip, $limit stages after $search', '$sort, $skip, $limit'],
              ['CountBuilder', 'Adds $count stage for total result count', '$count'],
              ['FacetBuilder', 'Builds $searchMeta facet definitions for getFacets query', '$searchMeta'],
              ['AutocompleteBuilder', 'Constructs autocomplete pipeline for suggestions', '$search with autocomplete operator'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Search Index Configuration</h3>
          <p style={para}>
            The search module relies on two MongoDB Atlas Search indexes. The primary
            <code style={{ color: c.cyan }}> shopSearch</code> index covers the
            <code style={{ color: c.cyan }}> vehicleV3</code> collection and supports full-text search, facets, and
            filtering. The secondary <code style={{ color: c.cyan }}>shopSuggestions</code> index covers the
            <code style={{ color: c.cyan }}> searchSuggestion</code> collection (populated by the EDS import) and
            powers the autocomplete dropdown.
          </p>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>shopSearch Index</div>
              <div style={infoCardText}>
                <strong>Collection:</strong> vehicleV3<br />
                <strong>Fields:</strong> vin, ymmt.make, ymmt.model, ymmt.trim, ymmt.year, bodyStyle, dealer.name,
                dealer.state, dealer.zip, price, mileage, vehicleCondition, status, manuallySuppressed, image.count,
                leasing.canLease, and more.<br />
                <strong>Analyzers:</strong> Standard, keyword, autocomplete
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>shopSuggestions Index</div>
              <div style={infoCardText}>
                <strong>Collection:</strong> searchSuggestion<br />
                <strong>Fields:</strong> text (autocomplete analyzer), make, model<br />
                <strong>Purpose:</strong> Powers the autocomplete dropdown with unique make+model combinations extracted
                during EDS import. Updated at the end of each successful import cycle.
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="info" title="Default Filters Always Applied">
            Every search query automatically applies two mandatory filters: <code>status != DELETED</code> and
            <code> manuallySuppressed != true</code>. These ensure that removed vehicles and manually suppressed vehicles
            never appear in search results, regardless of what the client requests. These filters are injected at the
            FilterBuilder level and cannot be overridden by query parameters.
          </Callout>
        </motion.div>
      </section>

      {/* ============================================================= */}
      {/*  8. SERVICE BUS TOPICS                                         */}
      {/* ============================================================= */}
      <section id="service-bus" style={sectionSpacing}>
        <SectionHeader
          label="Messaging"
          title="Service Bus Topics"
          description="Four Azure Service Bus topics that connect Odyssey to external systems, lease providers, cart services, and search subscribers."
        />

        <motion.div {...fadeUp}>
          <p style={para}>
            Azure Service Bus is the messaging backbone that connects the Odyssey system to external services and
            enables asynchronous communication between internal modules. The system uses four topics, each with one
            or more subscriptions. Topics provide a publish-subscribe pattern where publishers don't need to know
            about subscribers, enabling loose coupling between services.
          </p>
          <p style={para}>
            Each topic has specific TTL (Time To Live), lock duration, and max delivery count settings tuned for its
            particular use case. For example, the inventory-delta-topic has a 14-day TTL because downstream systems
            may process deltas in large batches, while the vehicle-data-topic has a 15-minute TTL because its
            notifications are only useful in near-real-time.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Service Bus Topic Topology"
            tabs={[{ label: 'Topic Architecture', source: mermaidServiceBusTopics }]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Topic Configuration</h3>
          <DataTable
            headers={['Topic', 'Publisher', 'TTL', 'Purpose']}
            rows={[
              ['inventory-delta-topic', 'EDS Cron', '14 days', 'Vehicle inventory changes (ADD/UPDATE/DELETE) for downstream F&I systems'],
              ['leasing-incentives-topic', 'Incentives System', '2 days', 'Lease pricing updates with regional data for vehicle leasing'],
              ['cart-status-update-topic', 'Cart Service', '30 days', 'Cart status events (purchase pending, released, etc.)'],
              ['vehicle-data-topic', 'External Publisher', '15 min', 'Real-time vehicle data notifications for search index updates'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Subscription Configuration</h3>
          <DataTable
            headers={['Subscription', 'Topic', 'Max Delivery', 'Lock Duration', 'Consumer Service']}
            rows={[
              ['(external subscribers)', 'inventory-delta-topic', 'Varies', 'Varies', 'External F&I systems'],
              ['lease-consumer-sub', 'leasing-incentives-topic', '5', '5 minutes', 'odyssey-consumer'],
              ['vehicle-availability-subscriber-sub', 'cart-status-update-topic', '60', '1 minute', 'odyssey-availability-sub'],
              ['vehicle-topic-search-subscriber-sub', 'vehicle-data-topic', '5', '5 minutes', 'odyssey-search-graphql'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Topic Details</h3>
          <div style={cardGrid}>
            <div style={{ ...infoCard, borderLeft: `3px solid ${c.accent2}` }}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>inventory-delta-topic</div>
              <div style={infoCardText}>
                Published by the EDS cron job after each successful import. Contains inventory deltas in batches of 100
                with types ADD, UPDATE, or DELETE. External F&I (Finance & Insurance) systems subscribe to these deltas
                to keep their own vehicle databases in sync. The 14-day TTL accommodates batch processing schedules.
              </div>
            </div>
            <div style={{ ...infoCard, borderLeft: `3px solid ${c.accent3}` }}>
              <div style={{ ...infoCardTitle, color: c.accent3 }}>leasing-incentives-topic</div>
              <div style={infoCardText}>
                Published by the external Incentives/Leasing system when lease pricing changes for specific vehicles.
                Messages contain VIN, make, and a list of region-specific lease amounts with expiration dates. The
                lease-consumer-sub subscription delivers these to the odyssey-consumer service with 5 retries and
                5-minute lock duration.
              </div>
            </div>
            <div style={{ ...infoCard, borderLeft: `3px solid ${c.orange}` }}>
              <div style={{ ...infoCardTitle, color: c.orange }}>cart-status-update-topic</div>
              <div style={infoCardText}>
                Published by the Cart Service whenever a vehicle's purchase status changes (added to cart, removed
                from cart, sale pending, sale booked, etc.). The vehicle-availability-subscriber-sub subscription
                has 60 retries with 1-minute lock, giving up to 1 hour of retry window. The 30-day TTL is the longest
                of all topics.
              </div>
            </div>
            <div style={{ ...infoCard, borderLeft: `3px solid ${c.cyan}` }}>
              <div style={{ ...infoCardTitle, color: c.cyan }}>vehicle-data-topic</div>
              <div style={infoCardText}>
                A lightweight notification topic with only 15-minute TTL. Used for real-time notifications that
                trigger the search module to re-index specific vehicles. The vehicle-topic-search-subscriber-sub
                processes these quickly to keep search results current with the latest vehicle data changes.
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="warning" title="Dead Letter Queues (DLQ)">
            Every subscription has a dead-letter queue that receives messages after the max delivery count is exceeded.
            DLQ messages require manual investigation. Common DLQ causes include: malformed JSON, unknown message types,
            vehicles deleted between publish and delivery, and extended MongoDB outages beyond the retry window.
            Monitor DLQ depth in Azure Portal and set up alerts for non-zero DLQ counts.
          </Callout>
        </motion.div>
      </section>

      {/* ============================================================= */}
      {/*  9. COMPLETE DATA FLOW                                         */}
      {/* ============================================================= */}
      <section id="data-flow" style={sectionSpacing}>
        <SectionHeader
          label="Integration"
          title="Complete Data Flow"
          description="The grand unified view showing how all services, topics, databases, and external APIs connect together."
        />

        <motion.div {...fadeUp}>
          <p style={para}>
            This section provides a holistic view of every data flow in the Odyssey ecosystem. Data enters the system
            from four primary sources: (1) EDS TSV files via Azure Blob Storage, (2) lease pricing from the
            Incentives System via leasing-incentives-topic, (3) cart status events from the Cart Service via
            cart-status-update-topic, and (4) Impel/SpinCar spin image notifications via the Routes Module REST API.
          </p>
          <p style={para}>
            All data ultimately converges on the <code style={{ color: c.cyan }}>vehicleV3</code> MongoDB collection,
            which serves as the single source of truth. The Search Module queries this collection through MongoDB
            Atlas Search indexes to power the GraphQL API consumed by Driveway.com's frontend applications. Supporting
            data flows include the Tax & Fee API and Libra API (which feed into the EDS cron), the Incentives API
            (which feeds into the Postal Code Region Sync cron), and the inventory-delta-topic (which publishes
            changes to external systems).
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Complete System Data Flow"
            tabs={[{ label: 'Unified Data Flow', source: mermaidCompleteDataFlow }]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Data Source Summary</h3>
          <DataTable
            headers={['Source', 'Protocol', 'Destination', 'Frequency', 'Data Type']}
            rows={[
              ['EDS (Azure Blob)', 'GZIP TSV files', 'vehicleV3 via temp collection', 'Every 30 min', 'Full vehicle inventory (100K+ vehicles)'],
              ['Incentives System', 'Service Bus (leasing-incentives-topic)', 'vehicleV3.leasing', 'Event-driven', 'Regional lease pricing per VIN'],
              ['Cart Service', 'Service Bus (cart-status-update-topic)', 'vehicleV3.availability', 'Event-driven', 'Purchase pending status per VIN'],
              ['Impel/SpinCar', 'REST webhook', 'vehicleV3.image.spinUrl', 'Event-driven', '360-degree spin image URLs'],
              ['Tax & Fee API', 'REST (GET /shipping-config)', 'In-memory (EDS import)', 'Per EDS import', 'Shipping cost configuration'],
              ['Libra API', 'REST (GET /zones)', 'In-memory (EDS import)', 'Per EDS import', 'Free shipping zone definitions'],
              ['Incentives API', 'REST (GET /regions)', 'postalCodeOemRegions', '4x daily', 'OEM region-to-postal-code mappings'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Data Consumers</h3>
          <DataTable
            headers={['Consumer', 'Protocol', 'Source', 'Purpose']}
            rows={[
              ['Driveway.com Frontend', 'GraphQL (search, getFacets, etc.)', 'vehicleV3 via Atlas Search', 'Vehicle search, filtering, and display'],
              ['F&I System', 'Service Bus (inventory-delta-topic)', 'Inventory deltas from EDS cron', 'Keep F&I product catalog in sync'],
              ['External Systems', 'Service Bus (inventory-delta-topic)', 'Inventory deltas from EDS cron', 'Various downstream consumers'],
              ['Admin Tools', 'REST API (/shop/)', 'vehicleV3 via Routes Module', 'Vehicle suppression, score weights, manual updates'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="success" title="Single Source of Truth">
            The <code>vehicleV3</code> collection in MongoDB is the single source of truth for all vehicle data.
            Every background service (cron, consumer, availability subscriber) writes to this collection, and the
            search module reads from it exclusively. This centralized data model eliminates consistency issues that
            would arise from maintaining separate data stores for different aspects of vehicle data.
          </Callout>
        </motion.div>
      </section>

      {/* ============================================================= */}
      {/*  10. CONFIGURATION                                             */}
      {/* ============================================================= */}
      <section id="configuration" style={sectionSpacing}>
        <SectionHeader
          label="Settings"
          title="Configuration"
          description="Application settings, environment variables, Spring profiles, and operational configuration for all services."
        />

        <motion.div {...fadeUp}>
          <p style={para}>
            All Odyssey services share a common configuration structure defined in <code style={{ color: c.cyan }}>application.yml</code> with
            environment-specific overrides per Spring profile. The configuration covers cron schedules, Service Bus
            connection strings, MongoDB connection settings, cache TTLs, and external API base URLs. Sensitive
            configuration (passwords, connection strings, API keys) are stored in Azure Key Vault and injected as
            environment variables at deployment time.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Key Application Settings</h3>
          <CodeBlock
            language="yaml"
            filename="application.yml"
            code={`# ─── Cron Schedules ─────────────────────────────────────────
cron:
  eds-import:
    schedule: "0 0,30 * * * *"          # Every 30 minutes
    batch-size: 500                      # Vehicles per bulk write
    concurrency: 5                       # Parallel upload semaphore
    safety-threshold: 15000              # Max delta before abort
  postal-code-sync:
    schedule: "0 45 0,6,12,18 * * *"    # 4x daily
  stale-cleanup:
    schedule: "0 15 * * * *"            # Hourly at :15
  temp-cleanup:
    schedule: "0 10 8 * * *"            # Daily at 08:10
    retention-days: 28                   # Keep temp collections 28 days
  spin-count:
    schedule: "0 */5 * * * *"           # Every 5 minutes

# ─── Azure Service Bus ─────────────────────────────────────
azure:
  servicebus:
    connection-string: \${AZURE_SERVICEBUS_CONNECTION_STRING}
    topics:
      inventory-delta:
        name: inventory-delta-topic
        ttl: P14D                        # 14 days
      leasing-incentives:
        name: leasing-incentives-topic
        ttl: P2D                         # 2 days
        subscription: lease-consumer-sub
        max-delivery-count: 5
        lock-duration: PT5M              # 5 minutes
      cart-status:
        name: cart-status-update-topic
        ttl: P30D                        # 30 days
        subscription: vehicle-availability-subscriber-sub
        max-delivery-count: 60
        lock-duration: PT1M              # 1 minute
      vehicle-data:
        name: vehicle-data-topic
        ttl: PT15M                       # 15 minutes
        subscription: vehicle-topic-search-subscriber-sub
        max-delivery-count: 5
        lock-duration: PT5M              # 5 minutes

# ─── Azure Blob Storage ────────────────────────────────────
azure:
  blob:
    connection-string: \${AZURE_BLOB_CONNECTION_STRING}
    container: inbound
    path-prefix: CVP/Driveway-Merchandising-V2/

# ─── MongoDB ───────────────────────────────────────────────
spring:
  data:
    mongodb:
      uri: \${MONGODB_URI}
      database: shopInventory

# ─── External APIs ─────────────────────────────────────────
external:
  tax-fee-api:
    base-url: \${TAX_FEE_API_URL}
    timeout: 10s
  libra-api:
    base-url: \${LIBRA_API_URL}
    timeout: 10s
  incentives-api:
    base-url: \${INCENTIVES_API_URL}
    timeout: 15s

# ─── Cache Configuration ──────────────────────────────────
cache:
  shipping-config:
    ttl: 30m                             # Cache shipping config for 30 min
  free-zones:
    ttl: 30m                             # Cache free zones for 30 min
  categories:
    ttl: 1h                              # Cache categories for 1 hour`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Environment Variables</h3>
          <DataTable
            headers={['Variable', 'Service(s)', 'Description']}
            rows={[
              ['AZURE_SERVICEBUS_CONNECTION_STRING', 'All consumers + cron', 'Azure Service Bus namespace connection string'],
              ['AZURE_BLOB_CONNECTION_STRING', 'Cron', 'Azure Blob Storage account connection string'],
              ['MONGODB_URI', 'All services', 'MongoDB Atlas connection string with credentials'],
              ['TAX_FEE_API_URL', 'Cron', 'Base URL for the Tax & Fee API (shipping config)'],
              ['LIBRA_API_URL', 'Cron', 'Base URL for the Libra API (dealerships, zones)'],
              ['INCENTIVES_API_URL', 'Cron', 'Base URL for the Incentives API (OEM regions)'],
              ['SPRING_PROFILES_ACTIVE', 'All services', 'Active Spring profile (laptop, dev, uat, prod)'],
              ['MAX_DIGITAL_API_URL', 'Search', 'Base URL for MaxDigital vehicle image API'],
              ['MAX_DIGITAL_API_KEY', 'Search', 'API key for MaxDigital authentication'],
              ['APPLICATIONINSIGHTS_CONNECTION_STRING', 'All services', 'Azure Application Insights telemetry'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Spring Profiles</h3>
          <p style={para}>
            The application supports four Spring profiles that control environment-specific behavior. Each profile
            overrides default settings in <code style={{ color: c.cyan }}>application.yml</code> with values appropriate
            for that environment. The active profile is set via the <code style={{ color: c.cyan }}>SPRING_PROFILES_ACTIVE</code>
            environment variable.
          </p>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>laptop</div>
              <div style={infoCardText}>
                Local development profile. Connects to a local MongoDB instance or dev Atlas cluster. Disables all
                Service Bus consumers (no message processing). Cron jobs are disabled or set to very long intervals.
                External API calls may be mocked or pointed to dev environments.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>dev</div>
              <div style={infoCardText}>
                Development environment on AKS. All services run with dev Azure resources. Cron jobs run on normal
                schedules but process a smaller dataset. Service Bus topics are dev-specific. Useful for integration
                testing with real Azure infrastructure.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.orange }}>uat</div>
              <div style={infoCardText}>
                User Acceptance Testing environment. Mirrors production configuration with production-like data
                volumes. Used for final validation before production deployments. All services, cron jobs, and
                consumers are fully operational.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.red }}>prod</div>
              <div style={infoCardText}>
                Production environment. Full vehicle inventory (100K+ vehicles), all cron jobs on their normal
                schedules, all consumers and subscribers active. Connected to production Azure resources, MongoDB Atlas
                production cluster, and production Service Bus namespace.
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="danger" title="Production Safety">
            Never run the EDS import cron against production MongoDB from a local machine. The safety threshold of
            15,000 vehicles is designed for the production data volume. Running against a local/dev MongoDB with
            fewer vehicles would not trigger the safety check, potentially causing mass DELETE deltas to be published
            to the production inventory-delta-topic. Always verify <code>SPRING_PROFILES_ACTIVE</code> before
            starting any service locally.
          </Callout>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Monitoring & Observability</h3>
          <p style={para}>
            All services emit metrics, traces, and logs to Azure Application Insights via the
            <code style={{ color: c.cyan }}> applicationinsights-agent</code> Java agent. Key metrics to monitor include:
          </p>
          <DataTable
            headers={['Metric', 'Type', 'Service', 'Alert Threshold']}
            rows={[
              ['odyssey_eds_import_duration', 'Timer', 'Cron', '> 20 minutes'],
              ['odyssey_eds_import_vehicle_count', 'Gauge', 'Cron', '< 80,000 or > 200,000'],
              ['odyssey_eds_import_status', 'Counter', 'Cron', 'Any SUSPICIOUS_FILE or FAILED'],
              ['odyssey_spin_vehicle_count', 'Gauge', 'Cron', '< 50% of total inventory'],
              ['odyssey_leasing_consumer_processed', 'Counter', 'Consumer', 'Zero for > 1 hour'],
              ['odyssey_availability_processed', 'Counter', 'Availability', 'Zero for > 1 hour'],
              ['odyssey_search_latency_p99', 'Timer', 'Search', '> 500ms'],
              ['servicebus_dlq_depth', 'Gauge', 'All consumers', '> 0'],
            ]}
          />
        </motion.div>
      </section>
    </>
  );
}
