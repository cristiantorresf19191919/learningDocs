import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { useSidebar } from '../context/SidebarContext';
import CodeBlock from '../components/shared/CodeBlock';
import Callout from '../components/shared/Callout';
import DataTable from '../components/shared/DataTable';
import SectionHeader from '../components/shared/SectionHeader';
import MermaidViewer from '../components/diagrams/MermaidViewer';
import MonoLifecycleDemo from '../components/interactive/MonoLifecycleDemo';
import ReactivePipelineDemo from '../components/interactive/ReactivePipelineDemo';
import EdsPipelineDemo from '../components/interactive/EdsPipelineDemo';
import StepByStepFlow, {
  edsImportSteps,
  searchQuerySteps,
  leasingConsumerSteps,
  cartAvailabilitySteps,
} from '../components/interactive/StepByStepFlow';
import DatabaseOperationViz from '../components/interactive/DatabaseOperationViz';

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
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'eds-import', label: 'EDS Import' },
  { id: 'inventory-deltas', label: 'Inventory Deltas' },
  { id: 'safety-check', label: 'Safety Check' },
  { id: 'lease-expiries', label: 'Lease Expiries' },
  { id: 'data-flows', label: 'Data Flows' },
  { id: 'tech-stack', label: 'Tech Stack' },
  { id: 'reactor-intro', label: 'Project Reactor' },
  { id: 'cron-overview', label: 'Cron Jobs' },
  { id: 'azure-blob', label: 'Azure Integrations' },
  { id: 'mongo-config', label: 'MongoDB' },
  { id: 'db-operations', label: 'DB Operations Map' },
  { id: 'testing-overview', label: 'Testing' },
  { id: 'api-endpoints', label: 'APIs' },
  { id: 'data-models', label: 'Data Models' },
  { id: 'deployment', label: 'Deployment' },
  { id: 'ext-integrations', label: 'External Integrations' },
  { id: 'spring-profiles', label: 'Configuration' },
  { id: 'quick-reference', label: 'Quick Reference' },
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

const keyTakeaway: CSSProperties = {
  backgroundColor: 'rgba(59,130,246,0.06)',
  border: `1px solid rgba(59,130,246,0.2)`,
  borderRadius: 12,
  padding: '1.25rem 1.5rem',
  marginTop: '1.5rem',
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
/*  Collapsible section helper                                         */
/* ------------------------------------------------------------------ */
function CollapsibleCode({ title, language, code }: { title: string; language: string; code: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: '1rem' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: c.surface,
          border: `1px solid ${c.border}`,
          borderRadius: 10,
          padding: '10px 18px',
          color: c.accent,
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.2s',
        }}
      >
        <span>{title}</span>
        <span style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          &#9660;
        </span>
      </button>
      {open && (
        <div style={{ marginTop: '0.5rem' }}>
          <CodeBlock language={language} code={code} />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mermaid diagram source strings                                     */
/* ------------------------------------------------------------------ */

const mermaidFullArch = `graph TB
    subgraph External["External Data Sources"]
        EDS["EDS TSV Files<br/>(Azure Blob)"]
        CART["Shopping Cart<br/>Service"]
        LEASE["Leasing &<br/>Incentives Service"]
        FI["F&I System<br/>(Finance & Insurance)"]
    end
    subgraph AKS["AKS Cluster (5 Services)"]
        CRON["odyssey-cron<br/>Scheduled Jobs"]
        ROUTES["odyssey-api<br/>REST + GraphQL Mutations<br/>/shop/"]
        SEARCH["odyssey-search-graphql<br/>GraphQL Queries<br/>/shop-graphql/"]
        CONSUMER["odyssey-consumer<br/>Leasing Messages"]
        AVAIL["odyssey-availability-sub<br/>Cart Status"]
    end
    subgraph Azure["Azure Service Bus Topics"]
        DELTA["inventory-delta-topic"]
        LEASETOPIC["leasing-incentives-topic"]
        CARTTOPIC["cart-status-update-topic"]
    end
    subgraph Data["Data Layer"]
        MONGO[("MongoDB Atlas<br/>shopInventory<br/>vehicleV3")]
        ATLAS["Atlas Search<br/>shopSearch Index"]
    end
    subgraph Clients["Consumers"]
        WEB["Driveway.com<br/>Frontend"]
        ADMIN["Admin Tools"]
    end
    EDS -->|"GZIP TSV every 30min"| CRON
    CRON -->|"Parse, Stage, Merge"| MONGO
    CRON -->|"Publish ADD/UPDATE/DELETE"| DELTA
    DELTA -->|"Inventory changes"| FI
    LEASE -->|"Regional pricing"| LEASETOPIC
    LEASETOPIC --> CONSUMER
    CONSUMER -->|"Update vehicle.leasing"| MONGO
    CART -->|"Cart events"| CARTTOPIC
    CARTTOPIC --> AVAIL
    AVAIL -->|"Update purchasePending"| MONGO
    MONGO --- ATLAS
    ATLAS -->|"Full-text search"| SEARCH
    MONGO -->|"Direct queries"| SEARCH
    MONGO -->|"CRUD operations"| ROUTES
    WEB -->|"GraphQL queries"| SEARCH
    WEB -->|"REST + mutations"| ROUTES
    ADMIN -->|"Score weights, suppressions"| ROUTES
    style CRON fill:#238636,stroke:#3fb950,color:#fff
    style ROUTES fill:#1f6feb,stroke:#58a6ff,color:#fff
    style SEARCH fill:#1f6feb,stroke:#58a6ff,color:#fff
    style CONSUMER fill:#6e40c9,stroke:#bc8cff,color:#fff
    style AVAIL fill:#6e40c9,stroke:#bc8cff,color:#fff
    style MONGO fill:#d29922,stroke:#e3b341,color:#000
    style ATLAS fill:#d29922,stroke:#e3b341,color:#000`;

const mermaidModuleDeps = `graph LR
    subgraph Deployed["Deployable Services"]
        routes["routes<br/>(REST + Mutations)"]
        search["search<br/>(GraphQL Queries)"]
        cron["cron<br/>(Scheduled Jobs)"]
        consumer["consumer<br/>(Leasing Messages)"]
        availability["availability<br/>(Cart Status)"]
    end
    subgraph Shared["Shared Libraries"]
        library["library<br/>(Models, DAOs, Clients, Config)"]
        graphql["graphql-shared<br/>(GraphQL Types)"]
    end
    subgraph Dev["Dev/Test"]
        utilities["utilities<br/>(CLI Tools)"]
        tests["tests<br/>(Integration Tests)"]
    end
    routes --> library
    routes --> graphql
    search --> library
    search --> graphql
    cron --> library
    consumer --> library
    availability --> library
    utilities --> library
    tests --> library
    style library fill:#d29922,stroke:#e3b341,color:#000
    style graphql fill:#d29922,stroke:#e3b341,color:#000
    style routes fill:#1f6feb,stroke:#58a6ff,color:#fff
    style search fill:#1f6feb,stroke:#58a6ff,color:#fff
    style cron fill:#238636,stroke:#3fb950,color:#fff
    style consumer fill:#6e40c9,stroke:#bc8cff,color:#fff
    style availability fill:#6e40c9,stroke:#bc8cff,color:#fff`;

const mermaidServiceBusTopology = `graph LR
    subgraph Publishers["Publishers"]
        CRON["odyssey-cron"]
        LEASING_SVC["Leasing Service<br/>(external)"]
        CART_SVC["Cart Service<br/>(external)"]
    end
    subgraph Topics["Service Bus Topics"]
        T1["inventory-delta-topic<br/>TTL: 14 days"]
        T2["leasing-incentives-topic<br/>TTL: 2 days"]
        T3["cart-status-update-topic"]
        T4["vehicle-data-topic<br/>TTL: 15 min"]
    end
    subgraph Subscribers["Subscribers"]
        FI["F&I System<br/>(external)"]
        CONSUMER["odyssey-consumer<br/>lease-consumer-sub"]
        AVAIL["odyssey-availability-sub<br/>vehicle-availability-subscriber-sub"]
    end
    CRON -->|"InventoryDelta JSON<br/>batches of 100"| T1
    T1 --> FI
    LEASING_SVC -->|"LeaseIncentivesMessage<br/>LEASING or INCENTIVE type"| T2
    T2 -->|"Lock: 5min, Retries: 5"| CONSUMER
    CART_SVC -->|"CartStatusUpdateMessage"| T3
    T3 -->|"Max retries: 60"| AVAIL
    style CRON fill:#238636,stroke:#3fb950,color:#fff
    style CONSUMER fill:#6e40c9,stroke:#bc8cff,color:#fff
    style AVAIL fill:#6e40c9,stroke:#bc8cff,color:#fff
    style T1 fill:#d29922,stroke:#e3b341,color:#000
    style T2 fill:#d29922,stroke:#e3b341,color:#000
    style T3 fill:#d29922,stroke:#e3b341,color:#000
    style T4 fill:#d29922,stroke:#e3b341,color:#000`;

const mermaidEdsSequence = `sequenceDiagram
    participant Scheduler as ScheduledTasks
    participant Reader as EdsVehicleReaderV2
    participant Blob as Azure Blob Storage
    participant Temp as temp_vehicleV3_*
    participant Live as vehicleV3
    participant SB as Service Bus
    participant FI as F&I System
    participant Leasing as CronLeasing
    Scheduler->>Reader: runVehicleReaderImport()
    Reader->>Blob: Find newest TSV file
    Blob-->>Reader: GZIP TSV file
    rect rgb(35, 134, 54, 0.2)
        Note over Reader,Temp: Stage: Parse & Upload
        Reader->>Reader: Parse TSV to Vehicle objects
        Reader->>Temp: Batch insert (500/batch, 5 concurrent)
    end
    rect rgb(210, 153, 34, 0.2)
        Note over Temp,Live: Stage: Safety Check
        Reader->>Temp: Count incoming vehicles
        Reader->>Live: Count live vehicles
        Reader->>Reader: Assert delta < 15,000
    end
    rect rgb(31, 111, 235, 0.2)
        Note over Temp,FI: Stage: Compute & Publish Deltas
        Reader->>Temp: Get incoming VINs
        Reader->>Live: Get existing VINs
        Reader->>Reader: Set operations ADD/UPDATE/DELETE
        Reader->>SB: Publish deltas (batches of 100)
        SB->>FI: InventoryDelta messages
    end
    rect rgb(110, 64, 201, 0.2)
        Note over Temp,Live: Stage: Merge & Cleanup
        Reader->>Live: Merge (preserve leasing, availability, suppressions)
        Reader->>Live: Mark missing vehicles as DELETED
        Reader->>Temp: Drop temp collection
    end
    Scheduler->>Leasing: applyLeaseExpiries()
    Leasing->>Live: Filter expired regional prices
    Leasing->>Live: Upsert updated vehicles`;

const mermaidDeltaFlowchart = `flowchart TD
    START["getInventoryDeltas()"] --> VINS1["Get VINs from<br/>temp collection"]
    START --> VINS2["Get VINs from<br/>live vehicleV3"]
    VINS1 --> ADD["incoming - existing<br/>= NEW VINs"]
    VINS2 --> ADD
    ADD --> ADD_DELTA["Create ADD deltas<br/>from temp collection"]
    VINS1 --> DEL["existing - incoming<br/>= REMOVED VINs"]
    VINS2 --> DEL
    DEL --> DEL_DELTA["Create DELETE deltas<br/>from live collection"]
    VINS1 --> OVERLAP["incoming intersect existing<br/>= OVERLAPPING VINs"]
    VINS2 --> OVERLAP
    OVERLAP --> BATCH["Process in batches of 500<br/>(10 concurrent semaphores)"]
    BATCH --> CHECK{"price changed?<br/>OR<br/>mileage changed?"}
    CHECK -->|Yes| UPD_DELTA["Create UPDATE delta"]
    CHECK -->|No| SKIP["Skip (no change)"]
    ADD_DELTA --> COMBINE["Combine all deltas"]
    DEL_DELTA --> COMBINE
    UPD_DELTA --> COMBINE
    COMBINE --> PUBLISH["Publish in batches of 100<br/>to inventory-delta-topic"]
    style ADD_DELTA fill:#238636,stroke:#3fb950,color:#fff
    style DEL_DELTA fill:#da3633,stroke:#f85149,color:#fff
    style UPD_DELTA fill:#d29922,stroke:#e3b341,color:#000
    style PUBLISH fill:#1f6feb,stroke:#58a6ff,color:#fff`;

const mermaidLeaseExpiry = `flowchart TD
    START["Fetch vehicles where<br/>leasing.canLease == true"] --> LOOP["For each vehicle"]
    LOOP --> CHECK["Check each entry in<br/>regionalPrices"]
    CHECK --> EXPIRED{"expiresOn<br/>before now?"}
    EXPIRED -->|Yes| REMOVE["Remove expired entry"]
    EXPIRED -->|No| KEEP["Keep active entry"]
    REMOVE --> REMAINING{"Any active<br/>entries left?"}
    KEEP --> REMAINING
    REMAINING -->|Yes| UPDLEASE["canLease = true<br/>defaultPrice = region 1 price<br/>(if region 1 still active)"]
    REMAINING -->|No| NOLEASE["canLease = false<br/>defaultPrice = null<br/>regionalPrices = empty"]
    UPDLEASE --> UPSERT["Upsert to vehicleV3<br/>(batches of 100)"]
    NOLEASE --> UPSERT
    style REMOVE fill:#da3633,stroke:#f85149,color:#fff
    style KEEP fill:#238636,stroke:#3fb950,color:#fff
    style NOLEASE fill:#da3633,stroke:#f85149,color:#fff
    style UPDLEASE fill:#238636,stroke:#3fb950,color:#fff`;

const mermaidLeasingSequence = `sequenceDiagram
    participant Finance as Leasing Service
    participant SB as leasing-incentives-topic
    participant Consumer as odyssey-consumer
    participant Handler as LeaseHandler
    participant DB as MongoDB vehicleV3
    Finance->>SB: Publish LeaseIncentivesMessage<br/>(type: LEASING, vin, regions)
    SB->>Consumer: Deliver message<br/>(lock: 5min, retries: 5)
    Consumer->>Consumer: Route by message type
    alt type == LEASING
        Consumer->>Handler: handle(message)
        Handler->>DB: getByVin(vin)
        DB-->>Handler: Vehicle
        Handler->>Handler: Build Leasing object
        Handler->>DB: updateVehicleField(vin, leasing, newLeasing)
        Handler-->>Consumer: Success
    else type == INCENTIVE
        Consumer->>Consumer: Log warning (no-op)
    end
    Consumer->>SB: Acknowledge message`;

const mermaidCartSequence = `sequenceDiagram
    participant Cart as Shopping Cart Service
    participant SB as cart-status-update-topic
    participant Avail as odyssey-availability-sub
    participant Handler as AvailabilityRequestHandler
    participant DB as MongoDB vehicleV3
    Cart->>SB: Publish CartStatusUpdateMessage<br/>(vin, purchasePending: true/false)
    SB->>Avail: Deliver message (max retries: 60)
    Avail->>Handler: process(message)
    Handler->>DB: getByVin(vin)
    DB-->>Handler: Vehicle
    alt Vehicle not found
        Handler-->>Avail: Success (no retry needed)
    else Vehicle found
        Handler->>Handler: Check message freshness
        alt Stale message
            Handler-->>Avail: Acknowledge (skip stale)
        else Fresh message
            Handler->>DB: upsertPurchasePending(vin, pending, enqueuedTime)
            Handler-->>Avail: Success
        end
    end
    Avail->>SB: Acknowledge message`;

const mermaidSearchSequence = `sequenceDiagram
    participant User as Driveway.com Frontend
    participant GQL as odyssey-search-graphql
    participant Builder as PipelineBuilder
    participant Atlas as MongoDB Atlas Search
    participant DB as MongoDB vehicleV3
    participant Max as MaxDigital API
    User->>GQL: GraphQL query: search(filters, sort, pagination)
    GQL->>Builder: Build aggregation pipeline
    Builder->>Builder: SearchBlock + CompoundBlock + TextBlock
    Builder-->>GQL: Pipeline Vehicle
    GQL->>Atlas: Run aggregation pipeline
    Atlas-->>GQL: Scored + filtered vehicles
    GQL->>GQL: Apply post-search transforms
    GQL-->>User: SearchResult vehicles, totalCount, facets
    Note over User,Max: Image queries are separate
    User->>GQL: getVehicleImagesById(id)
    GQL->>Max: GraphQL: GetGalleryImages
    Max-->>GQL: 6 image sizes per photo
    GQL-->>User: ImageGallery`;

const mermaidGraphqlSurface = `graph LR
    subgraph Frontend["Driveway.com Frontend"]
        SRP["Search Results Page"]
        VDP["Vehicle Detail Page"]
        AUTO["Autocomplete Bar"]
    end
    subgraph Search["odyssey-search-graphql (/shop-graphql/)"]
        Q1["search()"]
        Q2["getFacets()"]
        Q3["getSearchSuggestions()"]
        Q4["getVehicleByVin()"]
        Q5["getVehicleById()"]
        Q6["getVehiclesById()"]
        Q7["getVehiclesByVin()"]
        Q8["checkAvailabilityOfVin()"]
        Q9["getVehicleImagesById()"]
        Q10["getDirectionForId()"]
    end
    SRP --> Q1
    SRP --> Q2
    AUTO --> Q3
    VDP --> Q4
    VDP --> Q5
    VDP --> Q9
    VDP --> Q10
    SRP --> Q6
    style Q1 fill:#1f6feb,stroke:#58a6ff,color:#fff
    style Q2 fill:#1f6feb,stroke:#58a6ff,color:#fff
    style Q3 fill:#1f6feb,stroke:#58a6ff,color:#fff
    style Q9 fill:#6e40c9,stroke:#bc8cff,color:#fff`;

const mermaidVehicleModel = `classDiagram
    class Vehicle {
        +String vin
        +String vehicleId
        +InventoryStatus status
        +Boolean manuallySuppressed
        +Ymmt ymmt
        +VehicleCondition vehicleCondition
        +Double price
        +Int priceInCents
        +Leasing leasing
        +Availability availability
        +Int mileage
        +String bodyStyle
        +Image image
        +Dealer dealer
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
        +List regionalPrices
    }
    class RegionData {
        +Int regionId
        +Int amountInCents
        +String expiresOn
    }
    class Availability {
        +Boolean purchasePending
        +Boolean salesPending
        +Boolean salesBooked
        +Boolean inventoryInTransit
        +Boolean reconOrderOpen
        +Instant enqueuedTime
    }
    class Dealer {
        +String id
        +String name
        +String state
        +String zip
        +Int region
    }
    class Image {
        +String heroUrl
        +String spinUrl
        +Int count
    }
    Vehicle --> Ymmt
    Vehicle --> Leasing
    Vehicle --> Availability
    Vehicle --> Dealer
    Vehicle --> Image
    Leasing --> RegionData`;

const mermaidCiCd = `graph LR
    BUILD["1. Build<br/>Gradle clean build"] --> TEST["2. Test<br/>JUnit 5 + MockK"]
    TEST --> COVER["3. Coverage<br/>Kover report"]
    COVER --> LINT["4. Lint<br/>Kotlinter check"]
    LINT --> DOCKER["5. Docker<br/>Multi-stage build"]
    DOCKER --> TF["6. Terraform<br/>MongoDB indexes"]
    TF --> HELM["7. Helm Deploy<br/>5 services to AKS"]
    HELM --> SMOKE["8. Smoke Tests"]
    SMOKE --> POSTMAN["9. Postman Tests"]
    style BUILD fill:#1f6feb,stroke:#58a6ff,color:#fff
    style TEST fill:#1f6feb,stroke:#58a6ff,color:#fff
    style COVER fill:#1f6feb,stroke:#58a6ff,color:#fff
    style LINT fill:#1f6feb,stroke:#58a6ff,color:#fff
    style DOCKER fill:#6e40c9,stroke:#bc8cff,color:#fff
    style TF fill:#d29922,stroke:#e3b341,color:#000
    style HELM fill:#238636,stroke:#3fb950,color:#fff
    style SMOKE fill:#238636,stroke:#3fb950,color:#fff
    style POSTMAN fill:#238636,stroke:#3fb950,color:#fff`;

const mermaidExtIntegrations = `graph TB
    subgraph Odyssey["Odyssey Services"]
        CRON["odyssey-cron"]
        SEARCH["odyssey-search-graphql"]
        ROUTES["odyssey-api"]
        CONSUMER["odyssey-consumer"]
        AVAIL["odyssey-availability-sub"]
    end
    subgraph External["Third-Party APIs"]
        MAXD["MaxDigital<br/>(Vehicle Photos)"]
        IMPEL["Impel/SpinCar<br/>(360 Spins)"]
    end
    subgraph Internal["Internal Lithia Services"]
        LIBRA["Libra API<br/>(Dealerships, Zones)"]
        INCENT["Incentives API<br/>(OEM Regions)"]
        TAXFEE["Tax & Fee API<br/>(Shipping Costs)"]
    end
    subgraph AzureCloud["Azure Cloud"]
        BLOB["Azure Blob Storage"]
        SB["Azure Service Bus"]
        KV["Azure Key Vault"]
    end
    SEARCH --> MAXD
    ROUTES --> IMPEL
    CRON --> LIBRA
    CRON --> INCENT
    CRON --> TAXFEE
    CRON --> BLOB
    CRON --> SB
    CONSUMER --> SB
    AVAIL --> SB
    style MAXD fill:#6e40c9,stroke:#bc8cff,color:#fff
    style IMPEL fill:#6e40c9,stroke:#bc8cff,color:#fff
    style LIBRA fill:#1f6feb,stroke:#58a6ff,color:#fff
    style INCENT fill:#1f6feb,stroke:#58a6ff,color:#fff
    style TAXFEE fill:#1f6feb,stroke:#58a6ff,color:#fff`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function OdysseyDeepDivePage() {
  const { setSidebar, clearSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('Odyssey Deep Dive', tocItems);
    return () => clearSidebar();
  }, [setSidebar, clearSidebar]);

  return (
    <>
      {/* ============ HERO ============ */}
      <section style={heroSection}>
        <div style={heroGradientBg} />
        <motion.div style={heroContent} {...fadeUp}>
          <h1 style={heroTitle}>Odyssey-Api Technical Deep Dive</h1>
          <p style={heroSubtitle}>
            A comprehensive guide for JavaScript developers joining the Kotlin/Spring Boot
            reactive backend
          </p>
          <div style={statsRow}>
            {[
              { val: '5', label: 'Services' },
              { val: '9', label: 'Modules' },
              { val: '15', label: 'Diagrams' },
              { val: '100K+', label: 'Vehicles' },
            ].map((s) => (
              <div key={s.label} style={statBox}>
                <div style={statVal}>{s.val}</div>
                <div style={statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 1: OVERVIEW ============ */}
      <section id="overview" style={sectionSpacing}>
        <SectionHeader label="Introduction" title="Overview" description="What is Odyssey-Api and how does it power the Driveway.com Shop experience?" />
        <motion.div {...fadeUp}>
          <p style={para}>
            Odyssey-Api is the backend powering the Driveway.com Shop experience. It manages over 100,000 vehicles across hundreds of dealerships,
            handling everything from inventory ingestion to real-time search, leasing updates, and cart availability. The system is built as a
            Kotlin/Spring Boot reactive monorepo deployed as 5 independent services on Azure Kubernetes Service (AKS).
          </p>
          <Callout type="info" title="For JavaScript Developers">
            <strong>Spring Boot</strong> = Express on steroids (dependency injection, auto-config, production-ready monitoring).
            <strong> Kotlin</strong> = TypeScript for the JVM (null safety, data classes, extension functions).
            <strong> Mono/Flux</strong> = Promise/Observable (reactive streams for non-blocking I/O).
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 2: ARCHITECTURE ============ */}
      <section id="architecture" style={sectionSpacing}>
        <SectionHeader label="System Design" title="Architecture & Modules" description="A monorepo with 9 Gradle subprojects deployed as 5 services" />
        <motion.div {...fadeUp}>
          <p style={para}>
            The codebase is organized as a Gradle monorepo containing 9 subprojects. Five of these are independently deployable services
            (each running in its own AKS pod), and four are shared libraries consumed by the services.
          </p>
          <CodeBlock language="text" code={`Deployed Services (5 pods on AKS):
 [routes] ── REST API + GraphQL Mutations ── Port 8080 (/shop/)
 [search] ── GraphQL Queries ──────────── Port 8080 (/shop-graphql/)
 [cron] ──── Scheduled Jobs ──────────── No HTTP
 [consumer] ── Service Bus Listener ────── No HTTP
 [availability] Service Bus Listener ────── No HTTP

Shared Libraries (not deployed):
 [library] ── Models, DAOs, Clients, Config (used by ALL services)
 [graphql-shared] GraphQL types (used by routes + search)
 [utilities] ── Developer CLI tools
 [tests] ──── Integration tests (run post-deploy)`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer title="Full System Architecture" tabs={[{ label: 'System Architecture', source: mermaidFullArch }]} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer title="Module Dependencies" tabs={[{ label: 'Module Dependencies', source: mermaidModuleDeps }]} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer title="Service Bus Topic Topology" tabs={[{ label: 'Topic Topology', source: mermaidServiceBusTopology }]} />
        </motion.div>
      </section>

      {/* ============ SECTION 3: EDS IMPORT ============ */}
      <section id="eds-import" style={sectionSpacing}>
        <SectionHeader label="Data Ingestion" title="EDS Import Pipeline" description="The 30-minute import cycle that keeps 100K+ vehicles in sync" />
        <motion.div {...fadeUp}>
          <p style={para}>
            Every 30 minutes, the EDS (Electronic Dealer Services) import pipeline downloads a fresh GZIP TSV file containing the entire
            inventory from Azure Blob Storage. It parses, validates, and merges this data into MongoDB through a carefully orchestrated
            10-stage process designed for safety and consistency.
          </p>
        </motion.div>

        <motion.div {...fadeUp}>
          <StepByStepFlow title="EDS Import Pipeline - Step by Step" steps={edsImportSteps} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer title="EDS Import Sequence Diagram" tabs={[{ label: 'Import Sequence', source: mermaidEdsSequence }]} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Interactive Pipeline Demo</h3>
          <EdsPipelineDemo />
        </motion.div>
      </section>

      {/* ============ SECTION 4: INVENTORY DELTAS ============ */}
      <section id="inventory-deltas" style={sectionSpacing}>
        <SectionHeader label="Event Publishing" title="Inventory Deltas" description="How ADD, UPDATE, and DELETE events are computed and published" />
        <motion.div {...fadeUp}>
          <DataTable
            headers={['Delta Type', 'How Detected', 'Purpose']}
            rows={[
              ['ADD', 'VIN in incoming but NOT in live collection', 'Notify downstream systems of new inventory'],
              ['UPDATE', 'VIN in both, but price OR mileage changed', 'Trigger re-calculation of F&I rates'],
              ['DELETE', 'VIN in live but NOT in incoming', 'Remove from F&I cache, update search index'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CodeBlock language="kotlin" code={`data class InventoryDelta(
    val vin: String,
    val vehicleId: String,
    val dealerId: String,
    val type: DeltaType,         // ADD, UPDATE, DELETE
    val price: Double?,
    val mileage: Int?,
    val year: Int?,
    val make: String?,
    val model: String?,
    val trim: String?,
    val condition: String?,      // NEW or USED
    val bodyStyle: String?,
    val timestamp: Instant = Instant.now()
)

enum class DeltaType { ADD, UPDATE, DELETE }`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Delta Computation Algorithm</h3>
          <CodeBlock language="kotlin" code={`// Pseudocode for delta computation
fun getInventoryDeltas(tempCollection: String, liveCollection: String): List<InventoryDelta> {
    val incomingVins = tempDao.getAllVins(tempCollection).toSet()
    val existingVins = vehicleDao.getAllVins(liveCollection).toSet()

    // Set operations
    val addedVins = incomingVins - existingVins          // NEW vehicles
    val deletedVins = existingVins - incomingVins        // REMOVED vehicles
    val overlappingVins = incomingVins intersect existingVins  // CHECK for updates

    val addDeltas = tempDao.getByVins(addedVins).map { it.toDelta(DeltaType.ADD) }
    val deleteDeltas = vehicleDao.getByVins(deletedVins).map { it.toDelta(DeltaType.DELETE) }

    // For overlapping VINs, check if price or mileage changed
    val updateDeltas = overlappingVins
        .chunked(500)                              // Process in batches
        .flatMapMerge(concurrency = 10) { batch -> // 10 concurrent semaphores
            val incoming = tempDao.getByVins(batch)
            val existing = vehicleDao.getByVins(batch)
            incoming.zip(existing)
                .filter { (inc, ext) -> inc.price != ext.price || inc.mileage != ext.mileage }
                .map { (inc, _) -> inc.toDelta(DeltaType.UPDATE) }
        }

    return (addDeltas + deleteDeltas + updateDeltas)
}`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer title="Delta Computation Flowchart" tabs={[{ label: 'Delta Flowchart', source: mermaidDeltaFlowchart }]} />
        </motion.div>
      </section>

      {/* ============ SECTION 5: SAFETY CHECK ============ */}
      <section id="safety-check" style={sectionSpacing}>
        <SectionHeader label="Guard Rails" title="Safety Check" description="The 15K delta threshold that prevents catastrophic data loss" />
        <motion.div {...fadeUp}>
          <p style={para}>
            Before merging incoming data to the live collection, the pipeline performs a critical safety check.
            If the difference between the live vehicle count and the incoming count exceeds 15,000, the entire
            import is aborted. This prevents scenarios where a corrupted or truncated EDS file could wipe out
            a large portion of the inventory.
          </p>
          <Callout type="warning" title="Why 15,000?">
            The threshold was chosen based on historical data. Normal daily fluctuations rarely exceed a few thousand
            vehicles. A drop of 15,000+ almost always indicates a data feed issue rather than legitimate inventory changes.
          </Callout>
          <div style={spacer}>
            <DataTable
              headers={['Scenario', 'Live Count', 'Incoming Count', 'Delta', 'Result']}
              rows={[
                ['Normal import', '105,000', '104,200', '800', 'PROCEED'],
                ['Large dealer onboarding', '105,000', '112,000', '-7,000', 'PROCEED (growth)'],
                ['Truncated file', '105,000', '85,000', '20,000', 'ABORT'],
                ['Empty file', '105,000', '0', '105,000', 'ABORT'],
              ]}
            />
          </div>
          <div style={spacer}>
            <CodeBlock language="kotlin" code={`// Safety check implementation
val liveCount = vehicleDao.countActive()
val incomingCount = tempDao.count(tempCollectionName)
val delta = liveCount - incomingCount

if (delta >= 15_000) {
    logger.error("ABORTING IMPORT: live=$liveCount incoming=$incomingCount delta=$delta")
    tempDao.dropCollection(tempCollectionName)
    throw EdsImportAbortedException("Delta $delta exceeds safety threshold of 15,000")
}`} />
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 6: LEASE EXPIRIES ============ */}
      <section id="lease-expiries" style={sectionSpacing}>
        <SectionHeader label="Leasing" title="Lease Expiries" description="How expired regional lease prices are cleaned up after each import" />
        <motion.div {...fadeUp}>
          <CodeBlock language="kotlin" code={`data class Leasing(
    val canLease: Boolean,
    val defaultPrice: Int?,             // Monthly price for region 1
    val regionalPrices: List<RegionData>
)

data class RegionData(
    val regionId: Int,
    val amountInCents: Int,
    val expiresOn: String               // ISO date string
)`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Before / After Example</h3>
          <div style={sideBySide}>
            <div>
              <div style={{ ...infoCardTitle, color: c.orange }}>Before (2 regions, 1 expired)</div>
              <CodeBlock language="kotlin" code={`Leasing(
  canLease = true,
  defaultPrice = 29900,
  regionalPrices = listOf(
    RegionData(1, 29900, "2024-01-15"), // EXPIRED
    RegionData(3, 31500, "2025-06-30")  // Active
  )
)`} />
            </div>
            <div>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>After (expired removed)</div>
              <CodeBlock language="kotlin" code={`Leasing(
  canLease = true,
  defaultPrice = null,  // region 1 expired
  regionalPrices = listOf(
    RegionData(3, 31500, "2025-06-30")  // Active
  )
)`} />
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer title="Lease Expiry Decision Flow" tabs={[{ label: 'Expiry Flow', source: mermaidLeaseExpiry }]} />
        </motion.div>
      </section>

      {/* ============ SECTION 7: DATA FLOWS ============ */}
      <section id="data-flows" style={sectionSpacing}>
        <SectionHeader label="Step-by-Step Flows" title="Data Flow Deep Dives" description="Interactive walkthroughs of every major data flow in the system" />

        <motion.div {...fadeUp}>
          <StepByStepFlow title="Search Query Flow - Step by Step" steps={searchQuerySteps} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <StepByStepFlow title="Leasing Consumer Flow - Step by Step" steps={leasingConsumerSteps} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <StepByStepFlow title="Cart Availability Flow - Step by Step" steps={cartAvailabilitySteps} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Sequence Diagrams</h3>
          <MermaidViewer title="Leasing Message Processing" tabs={[{ label: 'Leasing Sequence', source: mermaidLeasingSequence }]} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer title="Cart Status Update" tabs={[{ label: 'Cart Sequence', source: mermaidCartSequence }]} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer title="Search Request Processing" tabs={[{ label: 'Search Sequence', source: mermaidSearchSequence }]} />
        </motion.div>
      </section>

      {/* ============ SECTION 8: TECH STACK ============ */}
      <section id="tech-stack" style={sectionSpacing}>
        <SectionHeader label="Technologies" title="Technology Stack" description="Core technologies and their JavaScript equivalents" />
        <motion.div {...fadeUp}>
          <DataTable
            headers={['Technology', 'Version', 'JS Equivalent', 'Purpose']}
            rows={[
              ['Kotlin', '1.9.20', 'TypeScript', 'Primary language with null safety, data classes, coroutines'],
              ['JDK', '21', 'Node.js 20+', 'Runtime with virtual threads, ZGC garbage collector'],
              ['Gradle', '8.5', 'npm/yarn', 'Build tool, dependency management, task runner'],
              ['Spring Boot', '3.4.3', 'Express/NestJS', 'Framework for REST, DI, config, monitoring'],
              ['Spring WebFlux', '6.1', 'Koa/Fastify', 'Non-blocking HTTP server (Netty under the hood)'],
              ['Project Reactor', '3.6', 'RxJS', 'Reactive streams: Mono (Promise) + Flux (Observable)'],
              ['KMongo', '4.7.1', 'Mongoose', 'MongoDB reactive driver with Kotlin DSL'],
              ['GraphQL Kotlin', '7.0.2', 'Apollo Server', 'Schema-first GraphQL with coroutine resolvers'],
              ['Azure Service Bus', '7.10.1', 'BullMQ/SQS SDK', 'Message broker client for pub/sub topics'],
              ['MockK', '1.13.4', 'Jest/Sinon', 'Kotlin-first mocking library for unit tests'],
              ['BlockHound', '1.0.11', 'N/A', 'Detects blocking calls on non-blocking threads'],
              ['Kotlinx Coroutines', '1.7.3', 'async/await', 'Structured concurrency, suspend functions'],
            ]}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 9: PROJECT REACTOR ============ */}
      <section id="reactor-intro" style={sectionSpacing}>
        <SectionHeader label="Reactive Programming" title="Project Reactor" description="Understanding Mono, Flux, and reactive chains for JavaScript developers" />

        <motion.div {...fadeUp}>
          <Callout type="info" title="JavaScript Analogy">
            <strong>Mono&lt;T&gt;</strong> = <code>Promise&lt;T&gt;</code> -- emits 0 or 1 value, then completes.{' '}
            <strong>Flux&lt;T&gt;</strong> = <code>Observable&lt;T&gt;</code> -- emits 0 to N values over time.
            Both are lazy (nothing happens until you subscribe) and support operators like map, flatMap, filter.
          </Callout>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Mono vs Flux</h3>
          <div style={sideBySide}>
            <div>
              <div style={{ ...infoCardTitle, color: c.accent }}>Mono -- Single Value</div>
              <CodeBlock language="kotlin" code={`// Like: fetch('/api/vehicle/123').then(r => r.json())
fun getVehicle(vin: String): Mono<Vehicle> =
    vehicleDao.getByVin(vin)
        .map { it.toResponse() }
        .switchIfEmpty(Mono.error(NotFoundException("$vin not found")))

// Subscribe to trigger execution
getVehicle("ABC123")
    .subscribe(
        { vehicle -> println("Got: \${vehicle.vin}") },
        { error -> println("Error: \${error.message}") }
    )`} />
            </div>
            <div>
              <div style={{ ...infoCardTitle, color: c.accent3 }}>Flux -- Multiple Values</div>
              <CodeBlock language="kotlin" code={`// Like: new Observable(subscriber => { ... })
fun searchVehicles(query: String): Flux<Vehicle> =
    vehicleDao.search(query)
        .filter { it.status == InventoryStatus.ACTIVE }
        .take(20)

// Subscribe to consume the stream
searchVehicles("Toyota Camry")
    .subscribe(
        { vehicle -> println("Found: \${vehicle.vin}") },
        { error -> println("Error: \${error.message}") },
        { println("Search complete") }
    )`} />
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Key Differences: Promise vs Mono</h3>
          <DataTable
            headers={['Aspect', 'JavaScript Promise', 'Project Reactor Mono']}
            rows={[
              ['Eagerness', 'Eager -- executes immediately on creation', 'Lazy -- nothing happens until subscribe()'],
              ['Retry', 'Manual retry logic needed', 'Built-in: .retry(3), .retryWhen(backoff)'],
              ['Cancellation', 'AbortController (manual)', 'Built-in: Disposable.dispose()'],
              ['Backpressure', 'Not supported', 'Built-in: request(n) protocol'],
              ['Multiple values', 'No (use AsyncIterator)', 'Use Flux<T> for streams'],
              ['Error handling', '.catch() at end of chain', '.onErrorResume(), .onErrorReturn(), .doOnError()'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Interactive: Mono Subscribe Lifecycle</h3>
          <MonoLifecycleDemo />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Blocking vs Non-Blocking</h3>
          <div style={sideBySide}>
            <div style={{ ...infoCard, borderColor: c.red }}>
              <div style={{ ...infoCardTitle, color: c.red }}>Blocking (Traditional)</div>
              <div style={infoCardText}>
                Thread 1: [--- DB Query ---][--- HTTP Call ---][--- Response ---]<br />
                Thread 2: [--- waiting... ---][--- DB Query ---][--- Response ---]<br />
                Thread 3: [--- waiting... ---][--- waiting... ---][--- DB Query ---]<br /><br />
                Each request holds a thread for its entire duration. With 200 threads, you can handle 200 concurrent requests max.
              </div>
            </div>
            <div style={{ ...infoCard, borderColor: c.accent2 }}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>Non-Blocking (Reactive)</div>
              <div style={infoCardText}>
                Thread 1: [DB Q1][HTTP C2][DB Q3][Resp1][HTTP C4]...<br />
                Thread 2: [HTTP C1][DB Q2][Resp2][DB Q4][Resp3]...<br /><br />
                Threads are released during I/O waits. A small pool (2-4 threads) can handle thousands of concurrent requests. This is how Node.js event loop works too!
              </div>
            </div>
          </div>
          <div style={keyTakeaway}>
            <strong style={{ color: c.accent }}>Key Takeaway:</strong>{' '}
            <span style={{ color: c.text2 }}>
              Never block a reactive thread. Use .flatMap() for async operations, not .map() with .block().
              BlockHound will catch violations at test time.
            </span>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Building Reactive Chains</h3>
          <CodeBlock language="kotlin" code={`// Pattern 1: Sequential operations (like Promise.then chains)
fun processVehicle(vin: String): Mono<VehicleResponse> =
    vehicleDao.getByVin(vin)                         // Mono<Vehicle>
        .flatMap { vehicle ->                         // async step
            enrichWithLeasing(vehicle)                // Mono<Vehicle>
        }
        .flatMap { vehicle ->                         // another async step
            enrichWithImages(vehicle)                 // Mono<Vehicle>
        }
        .map { it.toResponse() }                     // sync transform
        .switchIfEmpty(Mono.error(NotFoundException("Not found")))`} />
          <div style={spacer}>
            <CodeBlock language="kotlin" code={`// Pattern 2: Parallel operations (like Promise.all)
fun getVehicleWithDetails(vin: String): Mono<VehicleDetail> =
    Mono.zip(
        vehicleDao.getByVin(vin),                    // runs in parallel
        leasingClient.getLeasing(vin),               // runs in parallel
        imageClient.getImages(vin)                   // runs in parallel
    ) { vehicle, leasing, images ->
        VehicleDetail(vehicle, leasing, images)      // combine results
    }`} />
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="warning" title=".map() vs .flatMap()">
            Use <code>.map()</code> for synchronous transforms (like JS .map on arrays).
            Use <code>.flatMap()</code> when the transform itself returns a Mono/Flux (like .then() returning a Promise).
            Using .map() with an async call will nest Mono&lt;Mono&lt;T&gt;&gt; instead of unwrapping.
          </Callout>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Key Operators Reference</h3>
          <DataTable
            headers={['Operator', 'Type', 'What it Does', 'JS Equivalent']}
            rows={[
              ['.map()', 'Transform', 'Sync transform of emitted value', '.then(x => transform(x))'],
              ['.flatMap()', 'Transform', 'Async transform returning Mono/Flux', '.then(x => fetchMore(x))'],
              ['.filter()', 'Filter', 'Emit only values matching predicate', '.filter()'],
              ['.switchIfEmpty()', 'Fallback', 'Provide alternative if source is empty', '?? defaultValue'],
              ['.defaultIfEmpty()', 'Fallback', 'Emit default value if source is empty', '|| defaultValue'],
              ['.onErrorResume()', 'Error', 'Catch error, return fallback Mono', '.catch(e => fallback)'],
              ['.onErrorReturn()', 'Error', 'Catch error, return static value', '.catch(() => value)'],
              ['.doOnError()', 'Side Effect', 'Log/observe errors without catching', 'N/A (tap in RxJS)'],
              ['.doOnNext()', 'Side Effect', 'Observe values without modifying', 'tap() in RxJS'],
              ['.retry(n)', 'Resilience', 'Retry n times on error', 'Manual retry loop'],
              ['.retryWhen()', 'Resilience', 'Retry with custom backoff strategy', 'Manual retry with delay'],
              ['.timeout()', 'Resilience', 'Error if no value within duration', 'Promise.race with timeout'],
              ['.cache()', 'Caching', 'Cache the result for replay', 'Memoization'],
              ['.zip()', 'Combine', 'Combine multiple Monos in parallel', 'Promise.all()'],
              ['.merge()', 'Combine', 'Interleave multiple Flux emissions', 'merge() in RxJS'],
              ['.concat()', 'Combine', 'Sequential concatenation of Flux', 'concat() in RxJS'],
              ['.take(n)', 'Limit', 'Take first n emissions', '.slice(0, n)'],
              ['.skip(n)', 'Limit', 'Skip first n emissions', '.slice(n)'],
              ['.distinct()', 'Filter', 'Remove duplicate emissions', '[...new Set(arr)]'],
              ['.buffer(n)', 'Batch', 'Collect n items into a list', 'chunk(arr, n)'],
              ['.delayElements()', 'Timing', 'Add delay between emissions', 'setTimeout in loop'],
              ['.subscribeOn()', 'Threading', 'Switch upstream scheduler', 'Worker thread'],
              ['.publishOn()', 'Threading', 'Switch downstream scheduler', 'Worker thread'],
              ['.block()', 'Blocking', 'Block and get value (AVOID in reactive)', 'await'],
              ['.collectList()', 'Collect', 'Flux to Mono<List>', 'toArray()'],
              ['.flatMapMany()', 'Transform', 'Mono to Flux (one-to-many)', 'flatMap returning array'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Interactive: Reactive Pipeline Demo</h3>
          <ReactivePipelineDemo />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Reactive DAOs</h3>
          <CodeBlock language="kotlin" code={`// VehicleDao interface -- all methods return Mono/Flux
interface VehicleDao {
    fun getByVin(vin: String): Mono<Vehicle>
    fun getByVins(vins: Collection<String>): Flux<Vehicle>
    fun getAllVins(): Flux<String>
    fun countActive(): Mono<Long>
    fun upsert(vehicle: Vehicle): Mono<Vehicle>
    fun upsertMany(vehicles: List<Vehicle>): Mono<BulkWriteResult>
    fun updateField(vin: String, field: String, value: Any?): Mono<UpdateResult>
    fun search(pipeline: List<Bson>): Flux<Vehicle>
    fun dropCollection(name: String): Mono<Void>
}`} />
          <CollapsibleCode title="VehicleDao MongoDB Implementation" language="kotlin" code={`class VehicleDaoImpl(
    private val database: MongoDatabase
) : VehicleDao {

    private val collection = database.getCollection<Vehicle>("vehicleV3")

    override fun getByVin(vin: String): Mono<Vehicle> =
        collection.findOne(Vehicle::vin eq vin).toMono()

    override fun getByVins(vins: Collection<String>): Flux<Vehicle> =
        collection.find(Vehicle::vin \`in\` vins).toFlux()

    override fun countActive(): Mono<Long> =
        collection.countDocuments(Vehicle::status eq InventoryStatus.ACTIVE).toMono()

    override fun upsertMany(vehicles: List<Vehicle>): Mono<BulkWriteResult> {
        val ops = vehicles.map { vehicle ->
            ReplaceOneModel(
                Filters.eq("vin", vehicle.vin),
                vehicle,
                ReplaceOptions().upsert(true)
            )
        }
        return collection.bulkWrite(ops, BulkWriteOptions().ordered(false)).toMono()
    }
}`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Error Handling Patterns</h3>
          <CodeBlock language="kotlin" code={`// Pattern 1: Fallback value
fun getPrice(vin: String): Mono<Double> =
    vehicleDao.getByVin(vin)
        .map { it.price }
        .onErrorReturn(0.0)

// Pattern 2: Fallback Mono
fun getVehicle(vin: String): Mono<Vehicle> =
    primaryDao.getByVin(vin)
        .onErrorResume { error ->
            logger.warn("Primary failed: \${error.message}, trying secondary")
            secondaryDao.getByVin(vin)
        }

// Pattern 3: Retry with exponential backoff
fun fetchExternalData(id: String): Mono<Data> =
    externalClient.fetch(id)
        .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
            .maxBackoff(Duration.ofSeconds(10))
            .filter { it is WebClientResponseException.ServiceUnavailable })

// Pattern 4: Timeout with fallback
fun getWithTimeout(vin: String): Mono<Vehicle> =
    vehicleDao.getByVin(vin)
        .timeout(Duration.ofSeconds(5))
        .onErrorResume(TimeoutException::class.java) {
            Mono.error(ServiceUnavailableException("Database timeout"))
        }`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>BlockHound</h3>
          <p style={para}>
            BlockHound is a Java agent that detects blocking calls on non-blocking threads at runtime.
            It is installed in tests to ensure no accidental blocking occurs in reactive pipelines.
          </p>
          <CodeBlock language="kotlin" code={`// Install BlockHound in test setup
@BeforeAll
fun installBlockHound() {
    BlockHound.install(
        BlockHoundIntegration {
            // Allow specific known-safe blocking calls
            it.allowBlockingCallsInside("com.mongodb.internal", "getResult")
            it.allowBlockingCallsInside("io.netty.util", "deadlineNanos")
        }
    )
}

// BlockHound will throw an error if this runs on a reactive thread:
// reactor.core.Exceptions.ReactorBlockingException:
//   Blocking call! java.lang.Thread.sleep in reactor-http-nio-2`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Coroutines + Reactor Bridge</h3>
          <CodeBlock language="kotlin" code={`// Bridge Pattern 1: Mono to suspend function
suspend fun getVehicleSuspend(vin: String): Vehicle? =
    vehicleDao.getByVin(vin).awaitFirstOrNull()

// Bridge Pattern 2: suspend function to Mono
fun getVehicleMono(vin: String): Mono<Vehicle> =
    mono { getVehicleSuspend(vin) ?: throw NotFoundException("Not found") }

// Bridge Pattern 3: Flow to Flux
fun searchVehiclesFlux(query: String): Flux<Vehicle> =
    flow {
        val results = searchService.search(query)
        results.forEach { emit(it) }
    }.asFlux()`} />
        </motion.div>
      </section>

      {/* ============ SECTION 10: CRON JOBS ============ */}
      <section id="cron-overview" style={sectionSpacing}>
        <SectionHeader label="Scheduled Tasks" title="Cron Jobs" description="The 5 scheduled jobs that run on the odyssey-cron service" />
        <motion.div {...fadeUp}>
          <DataTable
            headers={['Job', 'Schedule', 'What It Does', 'Key Class']}
            rows={[
              ['EDS Import', 'Every 30 minutes', 'Download, parse, merge vehicle inventory from EDS', 'EdsVehicleReaderV2'],
              ['Region Sync', 'Every 6 hours', 'Sync postal code to OEM region mappings from Incentives API', 'PostalCodeOemRegionSync'],
              ['Stale Cleanup', 'Daily at 2 AM', 'Remove vehicles marked DELETED for > 7 days', 'DatabaseCleanup'],
              ['Temp Cleanup', 'Every hour', 'Drop orphaned temp_vehicleV3_* collections', 'DatabaseCleanup'],
              ['Spin Metric', 'Every 30 minutes', 'Count vehicles with 360 spin URLs', 'SpinMetricJob'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="warning" title="Laptop Profile">
            When running locally with the <code>laptop</code> Spring profile, ALL cron jobs are disabled.
            This prevents your local machine from downloading 100K+ vehicles or publishing to Service Bus.
          </Callout>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CollapsibleCode title="ScheduledTasks.kt -- Main Cron Entry Point" language="kotlin" code={`@Component
@Profile("!laptop")
class ScheduledTasks(
    private val edsVehicleReader: EdsVehicleReaderV2,
    private val cronLeasing: CronLeasing,
    private val regionSync: PostalCodeOemRegionSync,
    private val dbCleanup: DatabaseCleanup,
    private val spinMetric: SpinMetricJob
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    @Scheduled(cron = "0 */30 * * * *")  // Every 30 minutes
    fun runVehicleReaderImport() {
        logger.info("Starting EDS vehicle import")
        edsVehicleReader.importVehicles().block()  // .block() is OK here -- cron thread
        cronLeasing.applyLeaseExpiries().block()
        logger.info("EDS import + lease expiry complete")
    }

    @Scheduled(cron = "0 0 */6 * * *")  // Every 6 hours
    fun runRegionSync() {
        regionSync.syncRegions().block()
    }

    @Scheduled(cron = "0 0 2 * * *")  // Daily at 2 AM
    fun runStaleCleanup() {
        dbCleanup.removeStaleDeletedVehicles().block()
    }

    @Scheduled(cron = "0 0 * * * *")  // Every hour
    fun runTempCleanup() {
        dbCleanup.dropOrphanedTempCollections().block()
    }

    @Scheduled(cron = "0 */30 * * * *")
    fun runSpinMetric() {
        spinMetric.countSpins().block()
    }
}`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="info" title="Why .block() in Cron Jobs?">
            Cron jobs run on a dedicated scheduler thread (not a reactive Netty thread), so .block() is safe here.
            The scheduler needs to wait for completion before marking the job as done. Think of it like using
            <code> await</code> in a Node.js script -- you need the result before proceeding.
          </Callout>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CollapsibleCode title="CronLeasing.kt -- Lease Expiry Logic" language="kotlin" code={`@Component
class CronLeasing(private val vehicleDao: VehicleDao) {

    fun applyLeaseExpiries(): Mono<Void> {
        val now = LocalDate.now().toString()
        return vehicleDao.getVehiclesWithActiveLeases()
            .filter { vehicle ->
                vehicle.leasing?.regionalPrices?.any { it.expiresOn < now } == true
            }
            .map { vehicle ->
                val activeRegions = vehicle.leasing!!.regionalPrices
                    .filter { it.expiresOn >= now }
                val newLeasing = if (activeRegions.isEmpty()) {
                    Leasing(canLease = false, defaultPrice = null, regionalPrices = emptyList())
                } else {
                    val defaultPrice = activeRegions.find { it.regionId == 1 }?.amountInCents
                    Leasing(canLease = true, defaultPrice = defaultPrice, regionalPrices = activeRegions)
                }
                vehicle.copy(leasing = newLeasing)
            }
            .buffer(100)
            .flatMap { batch -> vehicleDao.upsertMany(batch) }
            .then()
    }
}`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CollapsibleCode title="PostalCodeOemRegionSync.kt" language="kotlin" code={`@Component
class PostalCodeOemRegionSync(
    private val incentivesClient: IncentivesApiClient,
    private val regionDao: PostalCodeRegionDao
) {
    fun syncRegions(): Mono<Void> =
        incentivesClient.getAllRegionMappings()
            .collectList()
            .flatMap { mappings ->
                regionDao.replaceAll(mappings)
            }
            .then()
}`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CollapsibleCode title="DatabaseCleanup.kt" language="kotlin" code={`@Component
class DatabaseCleanup(private val vehicleDao: VehicleDao) {

    fun removeStaleDeletedVehicles(): Mono<DeleteResult> {
        val cutoff = Instant.now().minus(7, ChronoUnit.DAYS)
        return vehicleDao.deleteWhere(
            and(
                Vehicle::status eq InventoryStatus.DELETED,
                Vehicle::updatedAt lt cutoff
            )
        )
    }

    fun dropOrphanedTempCollections(): Mono<Void> {
        val cutoff = Instant.now().minus(2, ChronoUnit.HOURS)
        return vehicleDao.listCollections()
            .filter { it.startsWith("temp_vehicleV3_") }
            .filter { name ->
                val timestamp = name.substringAfterLast("_").toLongOrNull()
                timestamp != null && Instant.ofEpochMilli(timestamp).isBefore(cutoff)
            }
            .flatMap { vehicleDao.dropCollection(it) }
            .then()
    }
}`} />
        </motion.div>
      </section>

      {/* ============ SECTION 11: AZURE ============ */}
      <section id="azure-blob" style={sectionSpacing}>
        <SectionHeader label="Cloud Services" title="Azure Integrations" description="Blob Storage, Service Bus, and Key Vault" />

        <motion.div {...fadeUp}>
          <h3 style={subHeading}>Azure Blob Storage</h3>
          <p style={para}>
            EDS files are stored as GZIP-compressed TSV files in Azure Blob Storage. The cron job finds the newest file
            matching the expected path pattern, validates it, and downloads it for processing.
          </p>
          <CollapsibleCode title="AzureEdsFileStorage.kt" language="kotlin" code={`@Component
class AzureEdsFileStorage(
    private val blobServiceClient: BlobServiceAsyncClient,
    @Value("\\\${azure.storage.container}") private val container: String
) {
    private val prefix = "CVP/Driveway-Merchandising-V2/"

    fun findNewestFile(): Mono<BlobItem> =
        blobServiceClient.getBlobContainerAsyncClient(container)
            .listBlobsByHierarchy(prefix)
            .filter { it.name.endsWith(".gz") }
            .sort(compareByDescending { it.properties.lastModified })
            .next()

    fun downloadFile(blobName: String): Flux<ByteBuffer> =
        blobServiceClient.getBlobContainerAsyncClient(container)
            .getBlobAsyncClient(blobName)
            .downloadStream()
}`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Azure Service Bus</h3>
          <DataTable
            headers={['Topic', 'Subscription', 'TTL', 'Publisher', 'Consumer']}
            rows={[
              ['inventory-delta-topic', 'fi-subscription', '14 days', 'odyssey-cron', 'F&I System'],
              ['leasing-incentives-topic', 'lease-consumer-sub', '2 days', 'Leasing Service', 'odyssey-consumer'],
              ['cart-status-update-topic', 'vehicle-availability-subscriber-sub', 'Default', 'Cart Service', 'odyssey-availability-sub'],
              ['vehicle-data-topic', 'vehicle-data-sub', '15 min', 'odyssey-api', 'External consumers'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CollapsibleCode title="ServiceBusMessageSender.kt" language="kotlin" code={`@Component
class ServiceBusMessageSender(
    private val senderClient: ServiceBusSenderAsyncClient
) {
    fun <T> publishBatch(topic: String, items: List<T>, batchSize: Int = 100): Mono<Void> =
        Flux.fromIterable(items.chunked(batchSize))
            .flatMap { batch ->
                val messages = batch.map { item ->
                    ServiceBusMessage(objectMapper.writeValueAsString(item))
                        .setContentType("application/json")
                }
                senderClient.sendMessages(messages)
            }
            .then()
}`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Consumer Module</h3>
          <CollapsibleCode title="LeaseTopicReceiver.kt + LeaseHandler.kt" language="kotlin" code={`// LeaseTopicReceiver.kt
@Component
@Profile("!laptop")
class LeaseTopicReceiver(
    private val processorClient: ServiceBusProcessorClient,
    private val leaseHandler: LeaseHandler
) {
    @PostConstruct
    fun start() { processorClient.start() }

    @PreDestroy
    fun stop() { processorClient.close() }

    fun processMessage(context: ServiceBusReceivedMessageContext) {
        val message = context.message
        val body = objectMapper.readValue<LeaseIncentivesMessage>(message.body.toString())
        when (body.type) {
            MessageType.LEASING -> leaseHandler.handle(body).block()
            MessageType.INCENTIVE -> logger.warn("Incentive messages not yet supported")
        }
        context.complete()
    }
}

// LeaseHandler.kt
@Component
class LeaseHandler(private val vehicleDao: VehicleDao) {

    fun handle(message: LeaseIncentivesMessage): Mono<UpdateResult> {
        val leasing = Leasing(
            canLease = true,
            defaultPrice = message.regions.find { it.regionId == 1 }?.amountInCents,
            regionalPrices = message.regions.map { region ->
                RegionData(
                    regionId = region.regionId,
                    amountInCents = region.amountInCents,
                    expiresOn = region.expiresOn
                )
            }
        )
        return vehicleDao.updateField(message.vin, "leasing", leasing)
    }
}`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Availability Module</h3>
          <CollapsibleCode title="AvailabilityRequestHandler.kt" language="kotlin" code={`@Component
class AvailabilityRequestHandler(
    private val vehicleDao: VehicleDao
) {
    fun process(message: CartStatusUpdateMessage): Mono<Void> =
        vehicleDao.getByVin(message.vin)
            .flatMap { vehicle ->
                // Stale message detection
                val existingTime = vehicle.availability?.enqueuedTime
                val messageTime = message.enqueuedTime
                if (existingTime != null && messageTime.isBefore(existingTime)) {
                    logger.info("Skipping stale message for \${message.vin}")
                    return@flatMap Mono.empty<Void>()
                }
                vehicleDao.upsertPurchasePending(
                    vin = message.vin,
                    purchasePending = message.purchasePending,
                    enqueuedTime = messageTime
                ).then()
            }
            .switchIfEmpty(Mono.defer {
                logger.info("Vehicle \${message.vin} not found, skipping")
                Mono.empty()
            })
}`} />
          <div style={spacer}>
            <Callout type="info" title="Stale Message Detection">
              Cart status messages can arrive out of order. Each message carries an <code>enqueuedTime</code> timestamp.
              If the vehicle already has a newer <code>enqueuedTime</code>, the message is skipped as stale. This ensures
              eventual consistency without requiring ordered delivery.
            </Callout>
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 12: MONGODB ============ */}
      <section id="mongo-config" style={sectionSpacing}>
        <SectionHeader label="Database" title="MongoDB" description="KMongo reactive driver, DAOs, and aggregation pipelines" />

        <motion.div {...fadeUp}>
          <h3 style={subHeading}>KMongo Reactive Config</h3>
          <CodeBlock language="kotlin" code={`@Configuration
class MongoConfig(
    @Value("\\\${spring.data.mongodb.uri}") private val uri: String
) {
    @Bean
    fun mongoClient(): MongoClient = KMongo.createClient(uri).coroutine

    @Bean
    fun mongoDatabase(client: MongoClient): MongoDatabase =
        client.getDatabase("shopInventory")
}`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>VehicleDao Pattern</h3>
          <CodeBlock language="kotlin" code={`// Reactive MongoDB operations return Mono/Flux
fun getByVin(vin: String): Mono<Vehicle> =
    collection.findOne(Vehicle::vin eq vin).toMono()

fun upsertMany(vehicles: List<Vehicle>): Mono<BulkWriteResult> {
    val ops = vehicles.map {
        replaceOne(
            filter = Filters.eq("vin", it.vin),
            replacement = it,
            options = ReplaceOptions().upsert(true)
        )
    }
    return collection.bulkWrite(ops, BulkWriteOptions().ordered(false)).toMono()
}`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Temp Import Strategy</h3>
          <CodeBlock language="kotlin" code={`// Stage to temporary collection, then merge to live
val tempName = "temp_vehicleV3_\${System.currentTimeMillis()}"

// 1. Batch insert to temp (500/batch, 5 concurrent)
Flux.fromIterable(vehicles.chunked(500))
    .flatMap({ batch ->
        tempDao.insertMany(tempName, batch)
    }, 5)  // concurrency = 5
    .then()

// 2. After safety check + deltas, merge to live
// 3. Drop temp collection
tempDao.dropCollection(tempName)`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Aggregation Pipeline DSL</h3>
          <CodeBlock language="kotlin" code={`// Atlas Search aggregation pipeline for vehicle search
fun buildSearchPipeline(request: SearchRequest): List<Bson> = buildList {
    // Stage 1: Atlas Search with compound query
    add(Aggregates.search(
        SearchOperator.compound()
            .must(listOf(
                SearchOperator.text(request.query, "searchField"),
                SearchOperator.equals("status", "ACTIVE")
            ))
            .filter(buildFilters(request))
            .score(buildScoreFunction(request))
    ))

    // Stage 2: Facets for sidebar filters
    if (request.includeFacets) {
        add(Aggregates.facet(
            Facet("makes", Aggregates.sortByCount("\\$ymmt.make")),
            Facet("bodyStyles", Aggregates.sortByCount("\\$bodyStyle")),
            Facet("conditions", Aggregates.sortByCount("\\$vehicleCondition"))
        ))
    }

    // Stage 3: Pagination
    add(Aggregates.skip(request.offset))
    add(Aggregates.limit(request.limit))
}`} />
        </motion.div>
      </section>

      {/* ============ SECTION 12.5: DB OPERATIONS MAP ============ */}
      <section id="db-operations" style={sectionSpacing}>
        <SectionHeader label="Database Deep Dive" title="MongoDB Operations Map" description="Every database operation across all 5 services, filterable by collection, operation type, and module" />

        <motion.div {...fadeUp}>
          <p style={para}>
            This interactive visualization maps every MongoDB operation performed by Odyssey's 5 services.
            Filter by collection, operation type, or module to understand exactly how data flows through the database layer.
          </p>
          <DatabaseOperationViz />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Index Strategy</h3>
          <p style={para}>
            MongoIndexCreator automatically manages 22+ compound indexes on startup. It creates missing indexes
            and prunes stale ones, ensuring consistency across deployments without manual intervention.
          </p>
          <DataTable
            headers={['Index', 'Collection', 'Fields', 'Purpose']}
            rows={[
              ['vin_1 (unique)', 'vehicleV3', 'vin', 'Primary key lookup (O(1))'],
              ['vehicleId_1', 'vehicleV3', 'vehicleId', 'Internal ID lookup'],
              ['dealer.id_1', 'vehicleV3', 'dealer.id', 'Dealership inventory queries'],
              ['status_1', 'vehicleV3', 'status', 'Active/deleted filtering'],
              ['status_1_dealer.id_1', 'vehicleV3', 'status + dealer.id', 'Active vehicles per dealer'],
              ['leasing.canLease_1', 'vehicleV3', 'leasing.canLease', 'Leasable vehicle queries'],
              ['lastSeenJobId_1', 'vehicleV3', 'lastSeenJobId', 'Mark-and-sweep during imports'],
              ['shopSearch (Atlas)', 'vehicleV3', '50+ fields', 'Full-text search with scoring'],
              ['shopSuggestions', 'searchSuggestion', 'value (autocomplete)', 'Search typeahead'],
              ['postalCode_1', 'postalCodeOemRegions', 'postalCode', 'OEM region lookups'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Collections Overview</h3>
          <DataTable
            headers={['Collection', 'Size', 'Primary Key', 'Write Pattern', 'Read Pattern']}
            rows={[
              ['vehicleV3', '~105K docs', 'vin', 'Bulk upsert (30min), field updates (continuous)', 'Atlas Search, findOne, aggregate'],
              ['temp_vehicleV3_*', 'Ephemeral', 'vin', 'Bulk insert (30min)', 'Scan for delta computation'],
              ['searchSuggestion', '~5K docs', 'value', 'Replace all (30min)', 'Autocomplete queries'],
              ['postalCodeOemRegions', '~42K docs', 'postalCode', 'Replace all (6hr)', 'Lookup by postal code'],
              ['searchScoreWeights', '~10 docs', 'sortType+version', 'Admin writes (rare)', 'Read per search query'],
              ['inventoryJobDetails', '~1K docs', 'runId', 'Insert (30min)', 'Status checks'],
            ]}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 13: TESTING ============ */}
      <section id="testing-overview" style={sectionSpacing}>
        <SectionHeader label="Quality" title="Testing" description="StepVerifier, MockK, and reactive test patterns" />

        <motion.div {...fadeUp}>
          <DataTable
            headers={['Framework', 'Purpose', 'JS Equivalent']}
            rows={[
              ['JUnit 5', 'Test runner and assertions', 'Jest/Mocha'],
              ['MockK', 'Mocking library for Kotlin', 'Jest mocks / Sinon'],
              ['StepVerifier', 'Verify reactive streams step by step', 'Custom Promise test helpers'],
              ['BlockHound', 'Detect blocking calls on reactive threads', 'N/A'],
              ['Testcontainers', 'Spin up MongoDB in Docker for integration tests', 'Testcontainers for Node'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>StepVerifier Patterns</h3>
          <CodeBlock language="kotlin" code={`// Pattern 1: Verify single value (Mono)
StepVerifier.create(vehicleDao.getByVin("ABC123"))
    .assertNext { vehicle ->
        assertThat(vehicle.vin).isEqualTo("ABC123")
        assertThat(vehicle.status).isEqualTo(InventoryStatus.ACTIVE)
    }
    .verifyComplete()

// Pattern 2: Verify multiple values (Flux)
StepVerifier.create(vehicleDao.getByVins(listOf("A", "B", "C")))
    .expectNextCount(3)
    .verifyComplete()

// Pattern 3: Verify error
StepVerifier.create(vehicleDao.getByVin("NONEXISTENT"))
    .verifyError(NotFoundException::class.java)

// Pattern 4: Verify empty
StepVerifier.create(vehicleDao.getByVin("UNKNOWN"))
    .verifyComplete()  // completes with no emissions`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>MockK Patterns</h3>
          <CodeBlock language="kotlin" code={`// Create mocks
private val vehicleDao = mockk<VehicleDao>()
private val messageSender = mockk<ServiceBusMessageSender>()

// Setup mock behavior
every { vehicleDao.getByVin("ABC123") } returns Mono.just(testVehicle)
every { vehicleDao.getByVin("UNKNOWN") } returns Mono.empty()
every { messageSender.publishBatch(any(), any(), any()) } returns Mono.empty()

// Verify interactions
verify(exactly = 1) { vehicleDao.getByVin("ABC123") }
verify { messageSender.publishBatch("inventory-delta-topic", any(), 100) }`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CollapsibleCode title="Full Test Example: CronLeasingTest.kt" language="kotlin" code={`class CronLeasingTest {
    private val vehicleDao = mockk<VehicleDao>()
    private val cronLeasing = CronLeasing(vehicleDao)

    @Test
    fun \`should remove expired regional prices\`() {
        // Given: Vehicle with one expired and one active region
        val vehicle = Vehicle(
            vin = "TEST123",
            leasing = Leasing(
                canLease = true,
                defaultPrice = 29900,
                regionalPrices = listOf(
                    RegionData(1, 29900, "2023-01-15"),  // Expired
                    RegionData(3, 31500, "2025-06-30")   // Active
                )
            )
        )
        every { vehicleDao.getVehiclesWithActiveLeases() } returns Flux.just(vehicle)
        every { vehicleDao.upsertMany(any()) } returns Mono.just(mockk())

        // When
        StepVerifier.create(cronLeasing.applyLeaseExpiries())
            .verifyComplete()

        // Then
        verify {
            vehicleDao.upsertMany(match { batch ->
                val updated = batch.first()
                updated.leasing!!.canLease == true &&
                updated.leasing!!.defaultPrice == null &&
                updated.leasing!!.regionalPrices.size == 1 &&
                updated.leasing!!.regionalPrices[0].regionId == 3
            })
        }
    }

    @Test
    fun \`should set canLease false when all regions expired\`() {
        val vehicle = Vehicle(
            vin = "TEST456",
            leasing = Leasing(
                canLease = true,
                defaultPrice = 29900,
                regionalPrices = listOf(
                    RegionData(1, 29900, "2023-01-15")  // Expired
                )
            )
        )
        every { vehicleDao.getVehiclesWithActiveLeases() } returns Flux.just(vehicle)
        every { vehicleDao.upsertMany(any()) } returns Mono.just(mockk())

        StepVerifier.create(cronLeasing.applyLeaseExpiries())
            .verifyComplete()

        verify {
            vehicleDao.upsertMany(match { batch ->
                val updated = batch.first()
                updated.leasing!!.canLease == false &&
                updated.leasing!!.defaultPrice == null &&
                updated.leasing!!.regionalPrices.isEmpty()
            })
        }
    }
}`} />
        </motion.div>
      </section>

      {/* ============ SECTION 14: APIs ============ */}
      <section id="api-endpoints" style={sectionSpacing}>
        <SectionHeader label="Endpoints" title="APIs" description="GraphQL queries, REST endpoints, and mutations" />

        <motion.div {...fadeUp}>
          <MermaidViewer title="GraphQL Query Surface" tabs={[{ label: 'Query Surface', source: mermaidGraphqlSurface }]} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>GraphQL Queries (odyssey-search-graphql)</h3>
          <DataTable
            headers={['Query', 'Arguments', 'Returns', 'Description']}
            rows={[
              ['search()', 'filters, sort, pagination', 'SearchResult', 'Full-text search with facets and scoring'],
              ['getFacets()', 'filters', 'FacetResult', 'Sidebar filter counts without vehicles'],
              ['getSearchSuggestions()', 'query', '[Suggestion]', 'Typeahead autocomplete suggestions'],
              ['getVehicleByVin()', 'vin', 'Vehicle', 'Single vehicle lookup by VIN'],
              ['getVehicleById()', 'id', 'Vehicle', 'Single vehicle lookup by internal ID'],
              ['getVehiclesById()', 'ids', '[Vehicle]', 'Batch vehicle lookup by IDs'],
              ['getVehiclesByVin()', 'vins', '[Vehicle]', 'Batch vehicle lookup by VINs'],
              ['checkAvailabilityOfVin()', 'vin', 'Availability', 'Check purchase/sales pending status'],
              ['getVehicleImagesById()', 'id', 'ImageGallery', 'Fetch photos from MaxDigital'],
              ['getDirectionForId()', 'id, userZip', 'Direction', 'Driving distance/time to dealership'],
              ['getSimilarVehicles()', 'vin, limit', '[Vehicle]', 'Find similar vehicles by attributes'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>REST Endpoints (odyssey-api /shop/)</h3>
          <DataTable
            headers={['Method', 'Path', 'Description']}
            rows={[
              ['GET', '/shop/health', 'Health check endpoint'],
              ['GET', '/shop/vehicles/{vin}', 'Get vehicle by VIN (REST)'],
              ['POST', '/shop/vehicles/suppress', 'Manually suppress a vehicle from search'],
              ['DELETE', '/shop/vehicles/suppress/{vin}', 'Remove manual suppression'],
              ['GET', '/shop/score-weights', 'Get current search score weights'],
              ['PUT', '/shop/score-weights', 'Update search score weights'],
              ['POST', '/shop/admin/reindex', 'Trigger Atlas Search reindex'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>GraphQL Mutations</h3>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>Vehicle Mutations</div>
              <div style={infoCardText}>
                <strong>suppressVehicle(vin)</strong> -- Mark vehicle as manually suppressed<br />
                <strong>unsuppressVehicle(vin)</strong> -- Remove manual suppression
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>Score Mutations</div>
              <div style={infoCardText}>
                <strong>updateScoreWeights(weights)</strong> -- Adjust search ranking factors<br />
                <strong>resetScoreWeights()</strong> -- Reset to default weights
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent3 }}>Admin Mutations</div>
              <div style={infoCardText}>
                <strong>triggerReindex()</strong> -- Force Atlas Search index rebuild<br />
                <strong>publishVehicleData(vin)</strong> -- Push vehicle to vehicle-data-topic
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.orange }}>Image Mutations</div>
              <div style={infoCardText}>
                <strong>refreshImages(vin)</strong> -- Re-fetch images from MaxDigital<br />
                <strong>setHeroImage(vin, url)</strong> -- Override the hero image URL
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Search Scoring</h3>
          <DataTable
            headers={['Factor', 'Weight', 'Description']}
            rows={[
              ['Text relevance', '1.0', 'Atlas Search text score from query match'],
              ['Photo count', '0.3', 'Vehicles with more photos rank higher'],
              ['Has spin', '0.2', 'Vehicles with 360 spins get a boost'],
              ['Price competitiveness', '0.15', 'Lower price relative to market average'],
              ['Mileage', '0.1', 'Lower mileage ranks higher'],
              ['Dealer proximity', '0.25', 'Closer dealers rank higher (if user zip provided)'],
            ]}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 15: DATA MODELS ============ */}
      <section id="data-models" style={sectionSpacing}>
        <SectionHeader label="Schema" title="Data Models" description="Vehicle model, MongoDB collections, and Atlas Search indexes" />

        <motion.div {...fadeUp}>
          <MermaidViewer title="Vehicle Model Structure" tabs={[{ label: 'Class Diagram', source: mermaidVehicleModel }]} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>MongoDB Collections</h3>
          <DataTable
            headers={['Collection', 'Database', 'Purpose', 'Approx Size']}
            rows={[
              ['vehicleV3', 'shopInventory', 'Live vehicle inventory', '~105K documents'],
              ['temp_vehicleV3_*', 'shopInventory', 'Temporary staging during EDS import', 'Ephemeral'],
              ['postalCodeRegions', 'shopInventory', 'Postal code to OEM region mappings', '~42K documents'],
              ['scoreWeights', 'shopInventory', 'Search scoring configuration', '1 document'],
              ['suppressions', 'shopInventory', 'Manually suppressed VINs', '~50 documents'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Atlas Search Indexes</h3>
          <DataTable
            headers={['Index Name', 'Collection', 'Type', 'Key Fields']}
            rows={[
              ['shopSearch', 'vehicleV3', 'Atlas Search', 'ymmt.*, bodyStyle, dealer.state, price, mileage'],
              ['vin_1', 'vehicleV3', 'Standard', 'vin (unique)'],
              ['vehicleId_1', 'vehicleV3', 'Standard', 'vehicleId (unique)'],
              ['dealer.id_1', 'vehicleV3', 'Standard', 'dealer.id'],
              ['status_1', 'vehicleV3', 'Standard', 'status'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Key Enums</h3>
          <div style={cardGrid3}>
            <div style={enumCard}>
              <div style={{ ...enumTitle, color: c.accent }}>InventoryStatus</div>
              <ul style={enumList}>
                <li>ACTIVE</li>
                <li>DELETED</li>
                <li>SUPPRESSED</li>
              </ul>
            </div>
            <div style={enumCard}>
              <div style={{ ...enumTitle, color: c.accent2 }}>VehicleCondition</div>
              <ul style={enumList}>
                <li>NEW</li>
                <li>USED</li>
                <li>CERTIFIED</li>
              </ul>
            </div>
            <div style={enumCard}>
              <div style={{ ...enumTitle, color: c.accent3 }}>DeltaType</div>
              <ul style={enumList}>
                <li>ADD</li>
                <li>UPDATE</li>
                <li>DELETE</li>
              </ul>
            </div>
            <div style={enumCard}>
              <div style={{ ...enumTitle, color: c.orange }}>MessageType</div>
              <ul style={enumList}>
                <li>LEASING</li>
                <li>INCENTIVE</li>
              </ul>
            </div>
            <div style={enumCard}>
              <div style={{ ...enumTitle, color: c.pink }}>SortField</div>
              <ul style={enumList}>
                <li>RELEVANCE</li>
                <li>PRICE_ASC</li>
                <li>PRICE_DESC</li>
                <li>MILEAGE_ASC</li>
                <li>YEAR_DESC</li>
                <li>DISTANCE</li>
              </ul>
            </div>
            <div style={enumCard}>
              <div style={{ ...enumTitle, color: c.cyan }}>BodyStyle</div>
              <ul style={enumList}>
                <li>SEDAN</li>
                <li>SUV</li>
                <li>TRUCK</li>
                <li>COUPE</li>
                <li>CONVERTIBLE</li>
                <li>VAN</li>
                <li>WAGON</li>
                <li>HATCHBACK</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 16: DEPLOYMENT ============ */}
      <section id="deployment" style={sectionSpacing}>
        <SectionHeader label="Infrastructure" title="Deployment" description="CI/CD pipeline, Docker, Helm, and AKS" />

        <motion.div {...fadeUp}>
          <h3 style={subHeading}>Environments</h3>
          <DataTable
            headers={['Environment', 'URL Pattern', 'Purpose', 'Deploys']}
            rows={[
              ['DEV', 'dev-shop.driveway.com', 'Active development', 'On every PR merge'],
              ['QA', 'qa-shop.driveway.com', 'QA testing', 'Nightly or manual'],
              ['STAGING', 'staging-shop.driveway.com', 'Pre-production validation', 'Release candidates'],
              ['PROD', 'shop.driveway.com', 'Production', 'Manual approval required'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer title="CI/CD Pipeline" tabs={[{ label: 'Pipeline', source: mermaidCiCd }]} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Deployed Services</h3>
          <DataTable
            headers={['Service', 'Pod Name', 'Replicas', 'CPU/Memory', 'Port']}
            rows={[
              ['odyssey-api (routes)', 'odyssey-api-*', '3', '500m / 1Gi', '8080'],
              ['odyssey-search-graphql', 'odyssey-search-*', '3', '1000m / 2Gi', '8080'],
              ['odyssey-cron', 'odyssey-cron-*', '1', '500m / 1Gi', 'None'],
              ['odyssey-consumer', 'odyssey-consumer-*', '2', '250m / 512Mi', 'None'],
              ['odyssey-availability-sub', 'odyssey-avail-*', '2', '250m / 512Mi', 'None'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Docker Multi-Stage Build</h3>
          <CodeBlock language="bash" code={`# Dockerfile (multi-stage)
FROM gradle:8.5-jdk21 AS builder
WORKDIR /app
COPY build.gradle.kts settings.gradle.kts ./
COPY gradle ./gradle
# Cache dependencies
RUN gradle dependencies --no-daemon
COPY . .
RUN gradle :routes:bootJar --no-daemon

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/routes/build/libs/routes.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Infrastructure as Code</h3>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>Terraform</div>
              <div style={infoCardText}>
                Manages MongoDB Atlas indexes, Azure Service Bus topics/subscriptions,
                and Azure Blob Storage containers. State is stored in Azure Storage backend.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>Helm Charts</div>
              <div style={infoCardText}>
                Each service has a Helm chart defining deployments, services, configmaps,
                and HPA (Horizontal Pod Autoscaler) rules. Values vary per environment.
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 17: EXTERNAL INTEGRATIONS ============ */}
      <section id="ext-integrations" style={sectionSpacing}>
        <SectionHeader label="Integrations" title="External Integrations" description="Third-party APIs and internal Lithia services" />

        <motion.div {...fadeUp}>
          <MermaidViewer title="External Integration Map" tabs={[{ label: 'Integration Map', source: mermaidExtIntegrations }]} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Internal Lithia Services</h3>
          <div style={cardGrid3}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>Libra API</div>
              <div style={infoCardText}>
                Provides dealership information including name, address, phone, and zone assignments.
                Called by cron to keep dealer data current.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>Incentives API</div>
              <div style={infoCardText}>
                Provides OEM region mappings (postal code to region ID). Used to determine which
                lease pricing applies to which geographic areas.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.orange }}>Tax & Fee API</div>
              <div style={infoCardText}>
                Calculates shipping costs and tax estimates based on vehicle location and destination.
                Called on-demand for VDP price breakdowns.
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Third-Party Services</h3>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent3 }}>MaxDigital</div>
              <div style={infoCardText}>
                Vehicle photo provider. Called via GraphQL to fetch gallery images for VDP pages.
                Returns 6 different image sizes per photo (thumbnail, small, medium, large, xlarge, original).
                Responses are cached with a 1-hour TTL.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.pink }}>Impel / SpinCar</div>
              <div style={infoCardText}>
                Provides 360-degree vehicle spin URLs. The spin URL is stored on the Vehicle.image.spinUrl field.
                A cron job periodically counts how many vehicles have spins for monitoring dashboards.
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 18: CONFIGURATION ============ */}
      <section id="spring-profiles" style={sectionSpacing}>
        <SectionHeader label="Config" title="Configuration" description="Spring profiles, environment-specific settings, and config classes" />

        <motion.div {...fadeUp}>
          <h3 style={subHeading}>Spring Profiles</h3>
          <DataTable
            headers={['Profile', 'Activated By', 'Purpose', 'Key Differences']}
            rows={[
              ['default', 'No profile specified', 'Production defaults', 'All features enabled'],
              ['laptop', 'SPRING_PROFILES_ACTIVE=laptop', 'Local development', 'Cron disabled, local MongoDB, mock Service Bus'],
              ['dev', 'Kubernetes env var', 'Development cluster', 'Debug logging, relaxed timeouts'],
              ['qa', 'Kubernetes env var', 'QA testing', 'Test data seeding, additional logging'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Config Classes</h3>
          <CodeBlock language="kotlin" code={`// application.yml equivalent as Kotlin config
@ConfigurationProperties(prefix = "odyssey")
data class OdysseyProperties(
    val eds: EdsProperties = EdsProperties(),
    val serviceBus: ServiceBusProperties = ServiceBusProperties(),
    val search: SearchProperties = SearchProperties()
)

data class EdsProperties(
    val blobContainer: String = "inbound",
    val blobPrefix: String = "CVP/Driveway-Merchandising-V2/",
    val batchSize: Int = 500,
    val concurrency: Int = 5,
    val safetyThreshold: Int = 15000
)

data class ServiceBusProperties(
    val deltaTopic: String = "inventory-delta-topic",
    val deltaBatchSize: Int = 100,
    val leaseTopic: String = "leasing-incentives-topic",
    val cartTopic: String = "cart-status-update-topic"
)

data class SearchProperties(
    val defaultLimit: Int = 24,
    val maxLimit: Int = 100,
    val suggestionLimit: Int = 10
)`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CollapsibleCode title="application-laptop.yml" language="bash" code={`# Local development overrides
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/shopInventory

odyssey:
  eds:
    enabled: false
  service-bus:
    enabled: false
  search:
    default-limit: 10

logging:
  level:
    com.lithia.odyssey: DEBUG
    org.springframework.web: DEBUG`} />
        </motion.div>
      </section>

      {/* ============ SECTION 19: QUICK REFERENCE ============ */}
      <section id="quick-reference" style={sectionSpacing}>
        <SectionHeader label="Getting Started" title="Quick Reference" description="Common commands for local development" />

        <motion.div {...fadeUp}>
          <CodeBlock language="bash" code={`# Clone and setup
git clone git@github.com:lithia/odyssey-api.git
cd odyssey-api

# Start local MongoDB (Docker)
docker run -d --name mongo -p 27017:27017 mongo:7

# Run all tests
./gradlew clean test

# Run specific module tests
./gradlew :library:test
./gradlew :routes:test

# Run routes service locally (laptop profile)
SPRING_PROFILES_ACTIVE=laptop ./gradlew :routes:bootRun

# Run search service locally
SPRING_PROFILES_ACTIVE=laptop ./gradlew :search:bootRun

# Check code style
./gradlew lintKotlin

# Fix code style
./gradlew formatKotlin

# Generate test coverage report
./gradlew koverHtmlReport
# Open: build/reports/kover/html/index.html

# Build Docker image (routes example)
docker build -t odyssey-routes --build-arg MODULE=routes .

# Run built JAR directly
java -jar routes/build/libs/routes.jar --spring.profiles.active=laptop

# Useful Gradle tasks
./gradlew dependencies              # List all dependencies
./gradlew :routes:bootJar           # Build executable JAR
./gradlew clean build -x test       # Build without tests`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="success" title="You made it!">
            This deep dive covers the major systems in Odyssey-Api. For questions or to suggest improvements,
            reach out on the #odyssey-dev Slack channel. Happy coding!
          </Callout>
        </motion.div>
      </section>
    </>
  );
}
