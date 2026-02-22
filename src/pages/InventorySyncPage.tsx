import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { useSidebar } from '../context/SidebarContext';
import SectionHeader from '../components/shared/SectionHeader';
import Card from '../components/shared/Card';
import Callout from '../components/shared/Callout';
import DataTable from '../components/shared/DataTable';
import CodeBlock from '../components/shared/CodeBlock';
import Badge from '../components/shared/Badge';
import MermaidViewer from '../components/diagrams/MermaidViewer';
import FlowTimeline from '../components/shared/FlowTimeline';

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
  { id: 'overview', label: 'Overview' },
  { id: 'upstream-source', label: 'Upstream Source' },
  { id: 'eds-parsing', label: 'EDS Parsing' },
  { id: 'transformation', label: 'Transformation' },
  { id: 'temp-import', label: 'Temp Import' },
  { id: 'delete-check', label: 'Delete Check' },
  { id: 'delta-publish', label: 'Delta Publishing' },
  { id: 'merge-live', label: 'Merge to Live' },
  { id: 'mark-sweep', label: 'Mark & Sweep' },
  { id: 'deleted-vehicles', label: 'Deleted Vehicles' },
  { id: 'happy-path', label: 'Happy Path' },
  { id: 'failure-path', label: 'Failure Path' },
  { id: 'leasing-consumer', label: 'Leasing Consumer' },
  { id: 'takeaways', label: 'Key Takeaways' },
];

/* ------------------------------------------------------------------ */
/*  Mermaid Diagrams                                                   */
/* ------------------------------------------------------------------ */
const happyPathDiagram = `sequenceDiagram
    participant SCHED as Scheduler
    participant BLOB as Azure Blob
    participant TEMP as Temp Collection
    participant CHECK as Delete Check
    participant ASB as Service Bus
    participant LIVE as vehicleV3
    participant SUGGEST as Search Suggestions

    Note over SCHED: Cron fires every 30 min
    SCHED->>BLOB: scanFiles(inbound/CVP/Driveway-Merchandising-V2/)
    BLOB-->>SCHED: newest untagged TSV file
    SCHED->>SCHED: validateFile(must start with "full")

    rect rgb(16, 185, 129, 0.1)
        Note over SCHED,TEMP: Stage 1: Data Initialization
        SCHED->>SCHED: fetch categoryDatabase
        SCHED->>SCHED: fetch featureDatabase
        SCHED->>SCHED: fetch shipping config (Tax & Fee API)
        SCHED->>SCHED: fetch freeShippingZipProvider
    end

    rect rgb(139, 92, 246, 0.1)
        Note over SCHED,TEMP: Stage 2: Temp Collection Import
        SCHED->>TEMP: create temp_vehicleV3_<timestamp>
        loop Parse TSV (batches of 500, concurrency: 5)
            SCHED->>TEMP: batchInsert(vehicles)
        end
    end

    rect rgb(245, 158, 11, 0.1)
        Note over TEMP,CHECK: Stage 3: Safety Check
        CHECK->>TEMP: countDocuments()
        CHECK->>LIVE: countSearchableVehicles()
        CHECK-->>SCHED: delta < 15,000 -> OK
    end

    rect rgb(236, 72, 153, 0.1)
        Note over TEMP,ASB: Stage 4: Delta Publishing
        SCHED->>TEMP: getInventoryDeltas(ADD/UPDATE/DELETE)
        loop Batches of 100
            SCHED->>ASB: publish to inventory-delta-topic
        end
    end

    rect rgb(59, 130, 246, 0.1)
        Note over SCHED,LIVE: Stage 5: Merge & Sweep
        SCHED->>LIVE: mergeToVehicles(preserving protected fields)
        SCHED->>LIVE: markMissingRowsDeleted()
    end

    SCHED->>SUGGEST: updateSearchSuggestions()
    SCHED->>BLOB: tagFileComplete()
    Note over SCHED: Job SUCCEEDED`;

const failurePathDiagram = `sequenceDiagram
    participant SCHED as Scheduler
    participant TRACKER as CronJobTracker
    participant BLOB as Azure Blob
    participant INIT as Data Init
    participant TEMP as Temp Collection
    participant CHECK as Delete Check

    Note over SCHED,TRACKER: Failure 1: Duplicate Job
    SCHED->>TRACKER: startJob()
    TRACKER-->>SCHED: ALREADY_RUNNING (LOW severity)
    Note over SCHED: Exit immediately, retry next cycle

    Note over SCHED,BLOB: Failure 2: No File Found
    SCHED->>BLOB: scanFiles()
    BLOB-->>SCHED: no untagged files
    Note over SCHED: NO_DOCUMENT_FOUND (LOW severity)
    Note over SCHED: Retry next cycle

    Note over SCHED,BLOB: Failure 3: Invalid File
    SCHED->>BLOB: scanFiles()
    BLOB-->>SCHED: file "partial_2024.tsv"
    SCHED->>SCHED: isFileValid() -> false (not "full")
    Note over SCHED: INVALID_DOCUMENT (MEDIUM severity)
    SCHED->>BLOB: tagFileSkipped()

    Note over SCHED,INIT: Failure 4: Config Fetch Failure
    SCHED->>INIT: fetch categoryDatabase
    INIT-->>SCHED: ERROR (API timeout)
    Note over SCHED: CANCELLED (HIGH severity)
    Note over SCHED: Entire import aborted, retry next cycle

    Note over SCHED,TEMP: Failure 5: Duplicate Key
    SCHED->>TEMP: batchInsert(vehicles)
    TEMP-->>SCHED: WriteError 11000 (duplicate VIN)
    Note over SCHED: INVALID_DOCUMENT, skip batch

    Note over SCHED,CHECK: Failure 6: Suspicious File
    CHECK->>TEMP: count = 50,000
    CHECK->>SCHED: liveCount = 70,000
    Note over CHECK: delta = 20,000 >= 15,000
    CHECK-->>SCHED: SUSPICIOUS_FILE (HIGH severity)
    SCHED->>BLOB: tagFileSkipped()
    Note over SCHED: Abort to prevent mass deletion`;

/* ------------------------------------------------------------------ */
/*  Pipeline Steps                                                     */
/* ------------------------------------------------------------------ */
const pipelineSteps = [
  {
    number: 1,
    title: 'File Discovery & Validation',
    description:
      'Scans Azure Blob container "inbound" under CVP/Driveway-Merchandising-V2/ for the newest untagged TSV file. Filename must start with "full" to qualify as a FULL import type. Invalid files are tagged as skipped.',
    color: c.cyan,
    code: {
      filename: 'CronEdsFiles.kt',
      language: 'kotlin',
      content: `// Scan for newest untagged file
val file = cronEdsFiles.findBestFile() // container: "inbound"
val isValid = cronEdsFiles.isFileValid() // must start with "full"
// Invalid file -> INVALID_DOCUMENT, file tagged "skipped"`,
    },
  },
  {
    number: 2,
    title: 'Data Initialization',
    description:
      'Fetches all reference data required for transformation: category database, feature database, shipping config from Tax & Fee API, and free shipping zone zip codes. Any single failure here cancels the entire import with HIGH severity.',
    color: c.green,
    code: {
      filename: 'CronEdsVehicleImporter.kt',
      language: 'kotlin',
      content: `// All four must succeed or entire import is CANCELLED
val categories = categoryDatabase.getAll()
val features = featureDatabase.getAll()
val shippingConfig = taxFeeApi.getShippingConfig()
val freeZones = freeShippingZipProvider.getZips()`,
    },
  },
  {
    number: 3,
    title: 'TSV Parsing & Vehicle Conversion',
    description:
      'Downloads the TSV file from Azure Blob, parses rows via CSV reader into EdsExtractedInventoryRow objects (76 fields each), then converts to Vehicle objects with category/feature mappings, shipping cost calculations, free zone zip detection, and dealer info enrichment.',
    color: c.accent,
  },
  {
    number: 4,
    title: 'Temp Collection Import',
    description:
      'Creates a staging collection named temp_vehicleV3_<timestamp>. Batch inserts vehicles in chunks of 500 with a Semaphore of 5 concurrent permits. Duplicate key errors (11000) are logged as INVALID_DOCUMENT; other write errors mark the batch as FAILED.',
    color: c.purple,
    code: {
      filename: 'CronEdsVehicleImporter.kt',
      language: 'kotlin',
      content: `// Batch Size: 500 vehicles, Concurrency: Semaphore(5)
val tempImport = vehicleDao.createTempImport()
// On WriteError 11000 -> INVALID_DOCUMENT (duplicate VIN)
// On other WriteError -> FAILED`,
    },
  },
  {
    number: 5,
    title: 'Delete Safety Check',
    description:
      'Compares the temp collection document count against live vehicleV3 searchable count. If the delta is >= 15,000 vehicles (configurable via CronConfig), the import aborts with SUSPICIOUS_FILE status to prevent mass accidental deletion.',
    color: c.orange,
    code: {
      filename: 'CronDeleteCheck.kt',
      language: 'kotlin',
      content: `// Uses Retry.backoff(5, 500ms) for count queries
val delta = liveInventoryCount - tempInventoryCount
if (delta >= suspiciousDeltaThreshold) { // 15,000
    throw DeleteCheckFailureException()
    // Result: SUSPICIOUS_FILE, file tagged "skipped"
}`,
    },
  },
  {
    number: 6,
    title: 'Delta Publishing',
    description:
      'Detects ADD, UPDATE, and DELETE changes between the temp collection and live vehicleV3. Publishes change events in batches of 100 to the inventory-delta-topic on Azure Service Bus. Gated by config flag: vehicle-reader.eds.enable-topic-publishing.',
    color: c.pink,
    code: {
      filename: 'CronEdsVehicleImporter.kt',
      language: 'kotlin',
      content: `// Gated by: vehicle-reader.eds.enable-topic-publishing
val deltas = tempImport.getInventoryDeltas() // ADD, UPDATE, DELETE
// Publish in batches of 100 to inventory-delta-topic (ASB)`,
    },
  },
  {
    number: 7,
    title: 'Merge to Live Collection',
    description:
      'Merges temp collection into vehicleV3 using MongoDB atomic upsert operations. Preserves protected fields (leasing, manuallySuppressed, availability.purchasePending, image.spinUrl) from existing documents while overwriting all other fields.',
    color: c.accent,
  },
  {
    number: 8,
    title: 'Mark & Sweep',
    description:
      'Calls markMissingRowsDeleted() to set status=DELETED for all vehicles in vehicleV3 that are not present in the new import file. Sets deletedJobId to the current job. Hourly cleanup job later permanently removes these records.',
    color: c.red,
  },
  {
    number: 9,
    title: 'Post-Import & File Tagging',
    description:
      'Updates search suggestions from unique make+model combinations in vehicleV3. Tags the processed EDS file as "complete" in Azure Blob Storage so it is not re-processed on the next cycle.',
    color: c.green,
  },
];

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
    'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(59,130,246,0.15) 0%, rgba(16,185,129,0.08) 40%, transparent 70%)',
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
  background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 50%, #06b6d4 100%)',
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
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.25rem',
  marginTop: '1.5rem',
};

const prose: CSSProperties = {
  fontSize: '0.92rem',
  lineHeight: 1.75,
  color: c.text2,
  maxWidth: 800,
  margin: '0 auto 1.5rem',
};

const badgeRow: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  justifyContent: 'center',
  marginTop: '1.5rem',
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
export default function InventorySyncPage() {
  const { setSidebar, clearSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('Inventory Sync Pipeline', tocItems);
    return () => clearSidebar();
  }, []);

  return (
    <div style={page}>
      {/* Hero */}
      <section style={heroSection}>
        <div style={heroGradientBg} />
        <motion.div style={heroContent} {...fadeUp}>
          <h1 style={heroTitle}>
            Inventory Sync
            <br />
            Pipeline
          </h1>
          <p style={heroSubtitle}>
            Complete documentation of the EDS vehicle inventory sync pipeline &mdash; from Azure Blob
            TSV ingestion through transformation, safety checks, delta publishing, and live collection
            merge in the Odyssey-Api cron module.
          </p>
          <div style={badgeRow}>
            <Badge label="Azure Blob Storage" color="blue" dot />
            <Badge label="MongoDB" color="green" dot />
            <Badge label="76-Field TSV" color="purple" dot />
            <Badge label="Every 30 min" color="cyan" dot />
            <Badge label="Azure Service Bus" color="yellow" dot />
          </div>
        </motion.div>
      </section>

      {/* ============ Overview ============ */}
      <motion.section id="overview" style={section} {...fadeUp}>
        <SectionHeader
          label="Pipeline"
          title="Overview"
          description="The inventory sync pipeline ingests vehicle data from EDS TSV files on Azure Blob Storage every 30 minutes."
        />
        <p style={prose}>
          The cron module runs on a fixed 30-minute schedule, scanning for new TSV files published by
          Enterprise Data Services (EDS). Each file contains the complete vehicle inventory as
          tab-separated rows with 76 fields per <code>EdsExtractedInventoryRow</code>. The pipeline
          parses the file, validates the data, stages it in a temporary MongoDB collection, performs
          safety checks, publishes change deltas to Azure Service Bus, and merges the results into
          the live <code>vehicleV3</code> MongoDB collection.
        </p>
        <div style={gridThree}>
          <Card title="Input" variant="blue">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li>EDS TSV file from Azure Blob Storage</li>
              <li>76 fields per row (<code>EdsExtractedInventoryRow</code>)</li>
              <li>Category & feature databases</li>
              <li>Shipping config from Tax & Fee API</li>
              <li>Free shipping zone zip codes</li>
            </ul>
          </Card>
          <Card title="Process" variant="purple">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li>Parse TSV &rarr; Vehicle objects</li>
              <li>Batch insert into temp collection</li>
              <li>Delete safety check (15k threshold)</li>
              <li>Delta detection & publishing</li>
              <li>Atomic merge to live collection</li>
            </ul>
          </Card>
          <Card title="Output" variant="green">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li>Upserted vehicles in <code>vehicleV3</code></li>
              <li>Vehicles marked <code>status=DELETED</code></li>
              <li>Deltas published to <code>inventory-delta-topic</code></li>
              <li>Updated search suggestions</li>
              <li>EDS file tagged as complete</li>
            </ul>
          </Card>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <Callout type="info" title="Execution Model">
            The pipeline is orchestrated by <code>ScheduledTasks.kt</code> using Spring's{' '}
            <code>@Scheduled(cron = "0 0,30 * * * *")</code>. Only one import job can run at a time,
            enforced by <code>CronJobTracker</code>. Duplicate executions return{' '}
            <code>ALREADY_RUNNING</code> immediately.
          </Callout>
        </div>
      </motion.section>

      {/* ============ Upstream Source ============ */}
      <motion.section id="upstream-source" style={section} {...fadeUp}>
        <SectionHeader
          label="Data Source"
          title="Upstream Source: Azure Blob Storage"
          description="EDS publishes full vehicle inventory as TSV files to an Azure Blob Storage container."
        />
        <DataTable
          headers={['Property', 'Value', 'Description']}
          rows={[
            ['Container', 'inbound', 'Azure Blob Storage container for incoming files'],
            ['Path Prefix', 'CVP/Driveway-Merchandising-V2/', 'Directory path within the container'],
            ['File Format', 'TSV (Tab-Separated Values)', '76 fields per EdsExtractedInventoryRow'],
            ['File Naming', 'Must start with "full"', 'Required for FULL import type validation'],
            ['Scan Behavior', 'Newest untagged file', 'Only processes untagged files, picks the most recent'],
          ]}
          highlightColumn={1}
        />
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>File Lifecycle</h3>
          <DataTable
            headers={['Stage', 'Tag/State', 'Description']}
            rows={[
              ['Scanned', 'Untagged', 'File discovered during blob scan, not yet processed'],
              ['Validated', 'Untagged', 'Filename validated (starts with "full"), ready for import'],
              ['Processed', 'Untagged', 'Import pipeline has completed using this file'],
              ['Tagged (complete)', 'complete', 'Import succeeded; file will not be re-processed'],
              ['Tagged (skipped)', 'skipped', 'File was invalid or caused a safety check failure; will not be retried'],
            ]}
            highlightColumn={1}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Callout type="warning" title="File Naming Requirement">
            Files that do not start with <code>"full"</code> are rejected as <code>INVALID_DOCUMENT</code>{' '}
            and tagged as <code>skipped</code>. Partial or incremental import files are not supported by
            this pipeline.
          </Callout>
        </div>
      </motion.section>

      {/* ============ EDS Parsing ============ */}
      <motion.section id="eds-parsing" style={section} {...fadeUp}>
        <SectionHeader
          label="Parsing"
          title="EDS TSV Parsing"
          description="The TSV file is downloaded from Azure Blob and parsed into structured inventory row objects."
        />
        <p style={prose}>
          The pipeline downloads the TSV file from Azure Blob Storage and uses a CSV reader configured
          for tab delimiters. Each row is parsed into an <code>EdsExtractedInventoryRow</code> object
          containing 76 fields covering VIN, pricing, mileage, dealer information, vehicle specifications,
          colors, images, and more. These raw rows are then converted to <code>Vehicle</code> domain
          objects through a series of enrichment steps.
        </p>
        <div style={gridTwo}>
          <Card title="Parse Pipeline" variant="cyan">
            <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li>Download TSV from Azure Blob Storage</li>
              <li>Configure CSV reader for tab delimiters</li>
              <li>Parse each row to <code>EdsExtractedInventoryRow</code> (76 fields)</li>
              <li>Convert to <code>Vehicle</code> domain objects</li>
              <li>Apply category &amp; feature mappings</li>
              <li>Calculate shipping costs</li>
              <li>Detect free shipping zone eligibility</li>
              <li>Enrich with dealer information</li>
            </ol>
          </Card>
          <Card title="Key Fields (76 total)" variant="blue">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li><strong>Identity:</strong> VIN, stockNumber, dealerId</li>
              <li><strong>Pricing:</strong> listPrice, msrp, internetPrice</li>
              <li><strong>Specs:</strong> year, make, model, trim, bodyStyle</li>
              <li><strong>Condition:</strong> mileage, condition (NEW/USED/CPO)</li>
              <li><strong>Colors:</strong> exteriorColor, interiorColor</li>
              <li><strong>Images:</strong> imageUrls, photoCount</li>
              <li><strong>Dealer:</strong> dealerName, dealerCity, dealerState, dealerZip</li>
              <li><strong>Features:</strong> options, equipment, packages</li>
            </ul>
          </Card>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <CodeBlock
            code={`// EdsExtractedInventoryRow.kt - 76 fields per row
data class EdsExtractedInventoryRow(
    val vin: String,
    val stockNumber: String,
    val dealerId: String,
    val listPrice: BigDecimal?,
    val year: Int,
    val make: String,
    val model: String,
    val trim: String?,
    val bodyStyle: String?,
    val mileage: Int?,
    val exteriorColor: String?,
    val interiorColor: String?,
    // ... 64 more fields
)`}
            language="kotlin"
            filename="EdsExtractedInventoryRow.kt"
          />
        </div>
      </motion.section>

      {/* ============ Transformation ============ */}
      <motion.section id="transformation" style={section} {...fadeUp}>
        <SectionHeader
          label="Enrichment"
          title="Transformation & Validation"
          description="Raw EDS rows are enriched with category mappings, feature mappings, shipping costs, and dealer data."
        />
        <DataTable
          headers={['Data Source', 'Provider', 'Purpose', 'Failure Impact']}
          rows={[
            ['Category mappings', 'categoryDatabase', 'Maps raw bodyStyle/type to standardized vehicle categories', 'CANCELLED (HIGH)'],
            ['Feature mappings', 'featureDatabase', 'Maps raw options/equipment to standardized feature list', 'CANCELLED (HIGH)'],
            ['Shipping config', 'Tax & Fee API', 'Provides shipping cost calculation rules per region', 'CANCELLED (HIGH)'],
            ['Free shipping zones', 'freeShippingZipProvider', 'Identifies zip codes eligible for free shipping', 'CANCELLED (HIGH)'],
          ]}
          highlightColumn={3}
        />
        <div style={{ marginTop: '1.5rem' }}>
          <Callout type="danger" title="All-or-Nothing Initialization">
            If <strong>any</strong> of the four data sources fails to load, the entire import is cancelled
            with <code>HIGH</code> severity. This is a deliberate design choice to prevent importing
            vehicles with missing category mappings, incorrect shipping costs, or incomplete feature data.
            The job will retry on the next 30-minute cycle.
          </Callout>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <CodeBlock
            code={`// Data initialization - ALL must succeed
val categories = categoryDatabase.getAll()       // vehicle categories
val features = featureDatabase.getAll()           // vehicle features
val shippingConfig = taxFeeApi.getShippingConfig() // shipping rules
val freeZones = freeShippingZipProvider.getZips()  // free shipping zips

// If ANY fails -> CANCELLED status, HIGH severity
// Entire import aborted, retry next cycle`}
            language="kotlin"
            filename="CronEdsVehicleImporter.kt"
          />
        </div>
      </motion.section>

      {/* ============ Temp Import ============ */}
      <motion.section id="temp-import" style={section} {...fadeUp}>
        <SectionHeader
          label="Staging"
          title="Temp Collection Import"
          description="Vehicles are staged in a temporary MongoDB collection before being merged to live."
        />
        <p style={prose}>
          The pipeline creates a temporary MongoDB collection named{' '}
          <code>temp_vehicleV3_&lt;timestamp&gt;</code> to stage all parsed vehicles before merging
          to the live collection. This staging approach enables atomic comparison, delta detection, and
          safe rollback if the import fails. Vehicles are inserted in batches of 500 with a concurrency
          limiter of 5 permits to balance throughput and MongoDB connection pressure.
        </p>
        <DataTable
          headers={['Parameter', 'Value', 'Description']}
          rows={[
            ['Collection Name', 'temp_vehicleV3_<timestamp>', 'Unique per import run, cleaned up after 28 days'],
            ['Batch Size', '500 vehicles', 'Number of vehicles inserted per bulk write operation'],
            ['Concurrency', 'Semaphore(5)', '5 concurrent batch insert operations allowed'],
            ['Duplicate Key (11000)', 'INVALID_DOCUMENT', 'Logged as warning, batch continues with remaining vehicles'],
            ['Other Write Errors', 'FAILED', 'Import marked as failed, error logged with HIGH severity'],
          ]}
          highlightColumn={1}
        />
        <div style={{ marginTop: '1.5rem' }}>
          <CodeBlock
            code={`// Temp collection creation and batch insert
val tempImport = vehicleDao.createTempImport()
// Collection: temp_vehicleV3_<Instant.now()>

// Parse and insert in parallel batches
vehicles.chunked(500).forEach { batch ->
    semaphore.acquire() // max 5 concurrent
    try {
        tempImport.batchInsert(batch)
    } catch (e: MongoWriteException) {
        when (e.code) {
            11000 -> log.warn("Duplicate key: \${e.message}") // INVALID_DOCUMENT
            else  -> throw e // FAILED
        }
    } finally {
        semaphore.release()
    }
}`}
            language="kotlin"
            filename="CronEdsVehicleImporter.kt"
          />
        </div>
      </motion.section>

      {/* ============ Delete Check ============ */}
      <motion.section id="delete-check" style={section} {...fadeUp}>
        <SectionHeader
          label="Safety"
          title="Delete Safety Check"
          description="Prevents accidental mass deletion by comparing temp and live collection counts."
        />
        <p style={prose}>
          Before merging to the live collection, the pipeline compares the document count in the temp
          collection against the searchable vehicle count in <code>vehicleV3</code>. If the difference
          (delta) is greater than or equal to 15,000 vehicles, the import is aborted with a{' '}
          <code>SUSPICIOUS_FILE</code> status. This threshold is configurable via <code>CronConfig</code>{' '}
          and protects against scenarios where EDS publishes an incomplete or truncated file.
        </p>
        <div style={gridTwo}>
          <Card title="Check Logic" variant="orange">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li>Count documents in temp collection</li>
              <li>Count searchable vehicles in live <code>vehicleV3</code></li>
              <li>Calculate delta: <code>liveCount - tempCount</code></li>
              <li>If delta &gt;= 15,000 &rarr; <strong>SUSPICIOUS_FILE</strong></li>
              <li>If delta &lt; 15,000 &rarr; proceed with merge</li>
            </ul>
          </Card>
          <Card title="Retry Strategy" variant="cyan">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li><code>Retry.backoff(5, 500ms)</code> for count queries</li>
              <li>Exponential backoff: 500ms, 1s, 2s, 4s, 8s</li>
              <li>Handles transient MongoDB timeouts</li>
              <li>Threshold configurable via <code>CronConfig</code></li>
              <li>Default: 15,000 vehicles</li>
            </ul>
          </Card>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Callout type="warning" title="Why 15,000?">
            The threshold of 15,000 was chosen to be large enough to accommodate normal daily fluctuations
            in inventory (vehicles sold, new arrivals) while small enough to catch obviously truncated or
            corrupt files. If EDS typically publishes ~65,000 vehicles and a file arrives with only 40,000,
            the delta of 25,000 would trigger the safety check and prevent those 25,000 vehicles from
            being incorrectly marked as deleted.
          </Callout>
        </div>
      </motion.section>

      {/* ============ Delta Publish ============ */}
      <motion.section id="delta-publish" style={section} {...fadeUp}>
        <SectionHeader
          label="Events"
          title="Delta Publishing"
          description="Change events (ADD/UPDATE/DELETE) are published to Azure Service Bus for downstream consumers."
        />
        <p style={prose}>
          After the safety check passes, the pipeline detects changes between the temp collection and
          the live <code>vehicleV3</code> collection. Three types of deltas are detected: <strong>ADD</strong>{' '}
          (vehicle exists in temp but not in live), <strong>UPDATE</strong> (vehicle exists in both with
          differences), and <strong>DELETE</strong> (vehicle exists in live but not in temp). These deltas
          are published in batches of 100 to the <code>inventory-delta-topic</code> on Azure Service Bus.
        </p>
        <DataTable
          headers={['Delta Type', 'Condition', 'Downstream Impact']}
          rows={[
            ['ADD', 'VIN in temp but not in live', 'New vehicle available for search and purchase'],
            ['UPDATE', 'VIN in both collections, fields differ', 'Vehicle data refreshed (price, mileage, images, etc.)'],
            ['DELETE', 'VIN in live but not in temp', 'Vehicle removed from search, marked for cleanup'],
          ]}
          highlightColumn={0}
        />
        <div style={{ marginTop: '1.5rem' }}>
          <Callout type="info" title="Feature Flag">
            Delta publishing is gated by the configuration flag{' '}
            <code>vehicle-reader.eds.enable-topic-publishing</code>. When disabled, the pipeline still
            performs the merge but skips event publishing. This allows disabling delta events during
            maintenance windows without affecting the core import flow.
          </Callout>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <CodeBlock
            code={`// Delta detection and publishing
val deltas = tempImport.getInventoryDeltas() // ADD, UPDATE, DELETE

if (config.enableTopicPublishing) {
    deltas.chunked(100).forEach { batch ->
        serviceBus.publish("inventory-delta-topic", batch)
    }
}`}
            language="kotlin"
            filename="CronEdsVehicleImporter.kt"
          />
        </div>
      </motion.section>

      {/* ============ Merge to Live ============ */}
      <motion.section id="merge-live" style={section} {...fadeUp}>
        <SectionHeader
          label="Merge"
          title="Merge to Live Collection"
          description="The temp collection is merged into vehicleV3 with field preservation for protected data."
        />
        <p style={prose}>
          The merge operation uses MongoDB atomic upsert operations to update existing vehicles and
          insert new ones. The critical aspect of the merge is <strong>field preservation</strong>:
          certain fields managed by other services are never overwritten by the EDS import. This ensures
          that leasing data, manual suppression flags, availability status, and spin URLs survive
          each import cycle.
        </p>
        <DataTable
          headers={['Field', 'Behavior', 'Source', 'Reason']}
          rows={[
            ['leasing', 'PRESERVED', 'Consumer module (Service Bus)', 'Managed by LeaseTopicReceiver, persists across imports'],
            ['manuallySuppressed', 'PRESERVED', 'REST API', 'Manually set by operations team via admin endpoints'],
            ['availability.purchasePending', 'PRESERVED', 'Availability subscriber', 'Managed by cart-status-update-topic consumer'],
            ['image.spinUrl', 'PRESERVED', 'Separate service', 'Managed independently from EDS data pipeline'],
            ['price, mileage, specs', 'OVERWRITTEN', 'New import file', 'Latest EDS data always takes precedence'],
            ['colors, images, dealer', 'OVERWRITTEN', 'New import file', 'Refreshed with every import cycle'],
            ['features, categories', 'OVERWRITTEN', 'New import file', 'Re-mapped from latest category/feature databases'],
          ]}
          highlightColumn={1}
        />
        <div style={{ marginTop: '1rem' }}>
          <Callout type="danger" title="Why Field Preservation Matters">
            Without field preservation, every 30-minute import would wipe out leasing data (set by the
            consumer module), manual suppression flags (set by operations), and purchase-pending states
            (set by the availability subscriber). These fields are managed by separate services via their
            own Azure Service Bus topics and must survive the EDS import cycle.
          </Callout>
        </div>
      </motion.section>

      {/* ============ Mark & Sweep ============ */}
      <motion.section id="mark-sweep" style={section} {...fadeUp}>
        <SectionHeader
          label="Cleanup"
          title="Mark & Sweep"
          description="Vehicles missing from the new import file are marked as DELETED in the live collection."
        />
        <p style={prose}>
          After the merge completes, <code>markMissingRowsDeleted()</code> identifies all vehicles in
          the live <code>vehicleV3</code> collection that were <strong>not</strong> present in the new
          import file. These vehicles have their <code>status</code> set to <code>DELETED</code> and
          their <code>deletedJobId</code> set to the current import job ID. The actual permanent removal
          of these records is handled by a separate hourly cleanup job.
        </p>
        <div style={gridTwo}>
          <Card title="Mark Phase" variant="red">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li>Compare VINs in live vs new import</li>
              <li>Vehicles not in new file &rarr; <code>status = DELETED</code></li>
              <li>Set <code>deletedJobId = currentJob.runId</code></li>
              <li>Vehicle still exists in collection (soft delete)</li>
            </ul>
          </Card>
          <Card title="Sweep Phase (Hourly)" variant="orange">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li>Separate cron job runs hourly at :15</li>
              <li>Queries all <code>status == DELETED</code> documents</li>
              <li>Permanently removes from <code>vehicleV3</code></li>
              <li>Logs deleted count per collection</li>
            </ul>
          </Card>
        </div>
      </motion.section>

      {/* ============ Deleted Vehicles ============ */}
      <motion.section id="deleted-vehicles" style={section} {...fadeUp}>
        <SectionHeader
          label="Status"
          title="How Deleted/Sold/Unavailable Vehicles Are Handled"
          description="Understanding the InventoryStatus enum and how different vehicle states are managed."
        />
        <DataTable
          headers={['Status', 'Set By', 'Trigger', 'Permanent Removal']}
          rows={[
            ['ACTIVE', 'EDS Import', 'Vehicle present in import file with valid data', 'N/A (vehicle is live)'],
            ['INACTIVE', 'Various', 'Vehicle flagged for temporary removal from search results', 'Not auto-removed'],
            ['DELETED', 'Mark & Sweep', 'Vehicle missing from latest EDS import file', 'Hourly cleanup job'],
          ]}
          highlightColumn={0}
        />
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Availability vs Status</h3>
          <Callout type="info" title="Availability Is Separate from Import">
            The <code>availability</code> sub-document (containing <code>purchasePending</code>,{' '}
            <code>salesPending</code>, <code>salesBooked</code>, and <code>inventoryInTransit</code>) is
            managed exclusively by the <strong>availability subscriber</strong> via the{' '}
            <code>cart-status-update-topic</code> on Azure Service Bus. The EDS import pipeline does{' '}
            <strong>not</strong> modify availability fields &mdash; they are protected during merge.
          </Callout>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <DataTable
            headers={['Availability Field', 'Managed By', 'Topic', 'Impact']}
            rows={[
              ['purchasePending', 'Availability subscriber', 'cart-status-update-topic', 'Vehicle hidden from search results'],
              ['salesPending', 'Availability subscriber', 'cart-status-update-topic', 'Vehicle in sales pipeline'],
              ['salesBooked', 'Availability subscriber', 'cart-status-update-topic', 'Vehicle sale confirmed'],
              ['inventoryInTransit', 'Availability subscriber', 'cart-status-update-topic', 'Vehicle being transported'],
            ]}
          />
        </div>
      </motion.section>

      {/* ============ Happy Path ============ */}
      <motion.section id="happy-path" style={section} {...fadeUp}>
        <SectionHeader
          label="Sequence"
          title="Happy Path: Successful Import"
          description="End-to-end sequence diagram showing a successful inventory sync from file discovery to completion."
        />
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Full Pipeline Sequence</h3>
          <FlowTimeline steps={pipelineSteps} />
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Sequence Diagram</h3>
          <MermaidViewer
            title="Happy Path: Inventory Sync Pipeline"
            tabs={[
              { label: 'Happy Path', source: happyPathDiagram },
            ]}
          />
        </div>
      </motion.section>

      {/* ============ Failure Path ============ */}
      <motion.section id="failure-path" style={section} {...fadeUp}>
        <SectionHeader
          label="Error Handling"
          title="Failure & Retry Paths"
          description="How the pipeline handles various failure scenarios and which are recoverable."
        />
        <div style={{ marginTop: '1.5rem' }}>
          <MermaidViewer
            title="Failure Scenarios & Recovery"
            tabs={[
              { label: 'Failure Paths', source: failurePathDiagram },
            ]}
          />
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Failure Modes Summary</h3>
          <DataTable
            headers={['Status', 'Severity', 'Trigger', 'File Action', 'Recoverable?']}
            rows={[
              ['SUCCEEDED', '\u2014', 'All stages pass', 'Tagged: complete', '\u2014'],
              ['ALREADY_RUNNING', 'LOW', 'Duplicate job execution', 'No action (retry next cycle)', 'Yes'],
              ['NO_DOCUMENT_FOUND', 'LOW', 'No untagged EDS file in Blob', 'No action (retry next cycle)', 'Yes'],
              ['INVALID_DOCUMENT', 'MEDIUM/HIGH', 'Bad filename, CSV parse error, duplicate keys', 'Tagged: skipped', 'No'],
              ['SUSPICIOUS_FILE', 'HIGH', 'Delta >= 15,000 vehicles', 'Tagged: skipped', 'No'],
              ['CANCELLED', 'HIGH', 'Config fetch failure (categories, fees, etc.)', 'No action (retry next cycle)', 'Yes'],
              ['FAILED', 'HIGH', 'Unexpected exception', 'No action (retry next cycle)', 'Yes'],
              ['KILLED', 'HIGH', 'Stalled job recovery on app startup', 'Tagged: skipped', 'Manual'],
            ]}
            highlightColumn={0}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Callout type="danger" title="Non-Recoverable Failures">
            Files tagged as <code>skipped</code> will <strong>never</strong> be retried. If a file is
            marked <code>SUSPICIOUS_FILE</code> or <code>INVALID_DOCUMENT</code>, manual investigation
            is required. EDS must publish a corrected file for the next import cycle to succeed.
          </Callout>
        </div>
      </motion.section>

      {/* ============ Leasing Consumer ============ */}
      <motion.section id="leasing-consumer" style={section} {...fadeUp}>
        <SectionHeader
          label="Consumer"
          title="Leasing Consumer Pipeline"
          description="A separate Azure Service Bus consumer that enriches vehicles with leasing incentive data."
        />
        <p style={prose}>
          The leasing consumer operates independently of the cron import pipeline. It listens to the{' '}
          <code>leasing-incentives-topic</code> on Azure Service Bus and processes{' '}
          <code>LeaseIncentivesMessage</code> payloads containing VIN-specific leasing data with regional
          pricing. The consumer validates vehicle condition, sorts regional data, calculates default
          pricing, and atomically updates the <code>leasing</code> field on the vehicle document.
        </p>
        <div style={gridTwo}>
          <Card title="Message Flow" variant="purple">
            <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li><code>LeaseTopicReceiver</code> listens to topic</li>
              <li><code>LeasingIncentivesMessageProcessor</code> deserializes</li>
              <li><code>LeaseHandler</code> validates &amp; transforms</li>
              <li>MongoDB atomic update via <code>$set</code> on <code>Vehicle::leasing</code></li>
            </ol>
          </Card>
          <Card title="Validation Rules" variant="red">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li>Only <strong>NEW</strong> vehicles can have <code>canLease = true</code></li>
              <li>Non-NEW vehicles &rarr; <code>canLease = false</code> + warning log</li>
              <li>Region data sorted by <code>regionId</code> ascending</li>
              <li>Default price from region 1 (<code>defaultRegionId = 1</code>)</li>
            </ul>
          </Card>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <DataTable
            headers={['Property', 'Value', 'Description']}
            rows={[
              ['Topic', 'leasing-incentives-topic', 'Azure Service Bus topic for lease messages'],
              ['Subscription', 'lease-consumer-sub', 'Dedicated subscription for odyssey-consumer'],
              ['Message Type', 'LeaseIncentivesMessage', 'Contains vin, type, and data: Map<Int, RegionData>'],
              ['Default Region', 'regionId = 1', 'Default price is sourced from region 1 (defaultRegionId = 1)'],
              ['Update Strategy', 'Atomic $set', 'Uses MongoDB $set on Vehicle::leasing field'],
              ['Persistence', 'Survives EDS imports', 'Leasing field is protected during merge (never overwritten)'],
            ]}
            highlightColumn={1}
          />
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <CodeBlock
            code={`// LeaseHandler.kt - Process lease incentive message
fun handleLeaseMessage(message: LeaseIncentivesMessage) {
    val vehicle = vehicleDao.findByVin(message.vin) ?: return

    // Only NEW vehicles can be marked as leasable
    val canLease = if (vehicle.condition == Condition.NEW) {
        message.data.isNotEmpty()
    } else {
        log.warn("Non-NEW vehicle \${message.vin} received lease data")
        false
    }

    // Sort regional prices by regionId ascending
    val regionalPrices = message.data.entries
        .sortedBy { it.key }  // regionId ascending
        .map { toRegionalPrice(it) }

    // Default price from region 1
    val defaultPrice = regionalPrices
        .firstOrNull { it.regionId == DEFAULT_REGION_ID } // 1
        ?.monthlyPayment

    // Atomic update - leasing field is PROTECTED during EDS merge
    vehicleDao.updateLeasing(message.vin, Leasing(
        canLease = canLease,
        defaultPrice = defaultPrice,
        regionalPrices = regionalPrices
    ))
}`}
            language="kotlin"
            filename="LeaseHandler.kt"
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Callout type="info" title="Leasing Data Persistence">
            Because the <code>leasing</code> field is a <strong>protected field</strong> during the EDS
            merge, leasing data set by the consumer module persists across all subsequent EDS imports.
            This means leasing incentives only need to be published once per vehicle and will remain
            until explicitly updated or the vehicle is deleted from inventory.
          </Callout>
        </div>
      </motion.section>

      {/* ============ Key Takeaways ============ */}
      <motion.section id="takeaways" style={section} {...fadeUp}>
        <SectionHeader label="Summary" title="Key Takeaways" />
        <div style={takeawayBox}>
          <div style={takeawayTitle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Key Takeaways
          </div>
          <ul style={takeawayList}>
            <li>The EDS inventory sync pipeline runs every 30 minutes, ingesting full vehicle inventory from TSV files on Azure Blob Storage into the <code>vehicleV3</code> MongoDB collection.</li>
            <li>Each TSV file contains 76 fields per row (<code>EdsExtractedInventoryRow</code>) covering all vehicle data from VIN to dealer info to pricing.</li>
            <li>The pipeline uses a <strong>temp collection staging pattern</strong>: parse &rarr; temp insert &rarr; safety check &rarr; delta detect &rarr; merge to live. This enables safe rollback and atomic comparison.</li>
            <li>The <strong>delete safety check</strong> (threshold: 15,000 vehicles) prevents mass accidental deletion from incomplete or truncated EDS files.</li>
            <li><strong>Protected fields</strong> (leasing, manuallySuppressed, availability.purchasePending, image.spinUrl) survive every import merge because they are managed by separate services.</li>
            <li>Delta events (ADD/UPDATE/DELETE) are published to <code>inventory-delta-topic</code> on Azure Service Bus for downstream consumers like F&I.</li>
            <li>The <strong>leasing consumer</strong> operates independently via <code>leasing-incentives-topic</code>, enriching vehicles with regional lease pricing. Only NEW vehicles can be marked as leasable.</li>
            <li>Vehicles missing from a new import are <strong>soft-deleted</strong> (status=DELETED) during mark &amp; sweep, then <strong>permanently removed</strong> by the hourly cleanup job.</li>
            <li>All-or-nothing data initialization: if any reference data source (categories, features, shipping, free zones) fails, the entire import is cancelled to prevent corrupt data.</li>
            <li>Availability fields (purchasePending, salesPending, salesBooked, inventoryInTransit) are managed exclusively by the availability subscriber and are never touched by the EDS import.</li>
          </ul>
        </div>
      </motion.section>
    </div>
  );
}
