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
  { id: 'cron-overview', label: 'Overview' },
  { id: 'schedule-table', label: 'Schedule Table' },
  { id: 'eds-import', label: 'EDS Vehicle Import' },
  { id: 'lease-expiry', label: 'Lease Expiry' },
  { id: 'region-sync', label: 'Region Sync' },
  { id: 'db-cleanup', label: 'DB Cleanup' },
  { id: 'metric-updater', label: 'Metric Updater' },
  { id: 'retry-idempotency', label: 'Retry & Idempotency' },
  { id: 'failure-modes', label: 'Failure Modes' },
  { id: 'metrics-tracing', label: 'Metrics & Tracing' },
  { id: 'collections', label: 'Collections Map' },
  { id: 'cron-takeaways', label: 'Key Takeaways' },
];

/* ------------------------------------------------------------------ */
/*  Mermaid Diagrams                                                   */
/* ------------------------------------------------------------------ */
const edsImportFlow = `sequenceDiagram
    participant SCHED as ScheduledTasks
    participant TRACKER as CronJobTracker
    participant FILES as CronEdsFiles
    participant BLOB as Azure Blob
    participant IMPORTER as CronEdsVehicleImporter
    participant TEMP as Temp Collection
    participant CHECK as CronDeleteCheck
    participant LIVE as vehicleV3
    participant ASB as Service Bus
    participant SUGGEST as CronSearchSuggestions
    participant LEASE as CronLeasing

    SCHED->>TRACKER: startJob()
    alt Job already running
        TRACKER-->>SCHED: ALREADY_RUNNING
    else
        TRACKER-->>SCHED: OK
    end

    SCHED->>FILES: findBestFile()
    FILES->>BLOB: scan inbound/CVP/Driveway-Merchandising-V2/
    BLOB-->>FILES: newest untagged file
    FILES->>FILES: isFileValid() (must start with "full")

    SCHED->>IMPORTER: coDoVehicleImport()
    Note over IMPORTER: Fetch configs: categories, features, shipping, free zones
    IMPORTER->>TEMP: createTempImport()

    loop Parse TSV (batches of 500, concurrency: 5)
        IMPORTER->>TEMP: batchInsert(vehicles)
    end

    IMPORTER->>CHECK: checkForLargeDelete()
    CHECK->>TEMP: count documents
    CHECK->>LIVE: count searchable vehicles
    alt delta >= 15,000
        CHECK-->>IMPORTER: SUSPICIOUS_FILE
    else
        CHECK-->>IMPORTER: OK
    end

    IMPORTER->>TEMP: getInventoryDeltas()
    IMPORTER->>ASB: publish deltas (batches of 100)
    IMPORTER->>LIVE: mergeToVehicles()
    IMPORTER->>LIVE: markMissingRowsDeleted()
    IMPORTER->>TEMP: close temp collection

    SCHED->>SUGGEST: updateSearchSuggestions()
    SCHED->>LEASE: applyLeaseExpiries()
    SCHED->>TRACKER: endJob()
    SCHED->>BLOB: markFileComplete()`;

const regionSyncFlow = `sequenceDiagram
    participant SCHED as ScheduledTasks
    participant SYNC as PostalCodeOemRegionSync
    participant API as Incentives API
    participant DB as postalCodeOemRegions

    SCHED->>SYNC: updateRegionData()
    SYNC->>API: getRegions()
    API-->>SYNC: List<BaseIncentiveRegion>
    Note over SYNC: Transform: region-centric → postal-code-centric
    Note over SYNC: Group by postalCode, merge makeRegions
    Note over SYNC: Validate: no overlapping regions per make/zip
    SYNC->>DB: upsertAll(mergedRegions)
    SYNC->>DB: pruneOldRecords(currentTimestamp)
    Note over DB: Delete records where lastSeenAt != current`;

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
  gridTemplateColumns: 'repeat(2, 1fr)',
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
/*  EDS Import Steps                                                   */
/* ------------------------------------------------------------------ */
const edsImportSteps = [
  {
    number: 1,
    title: 'Job Initialization & Duplicate Prevention',
    description:
      'Creates InventoryJobDetails with unique runId. Checks CronJobTracker for already-running jobs. If duplicate detected, returns ALREADY_RUNNING immediately.',
    color: c.accent,
    code: {
      filename: 'EdsVehicleReaderV2.kt',
      language: 'kotlin',
      content: `// Stage 1: Check if job is already running
val initialJobDetails = InventoryJobDetails(runId = Instant.now().toString())
cronJobTracker.startJob() // returns JobStatus.ALREADY_RUNNING if duplicate`,
    },
  },
  {
    number: 2,
    title: 'File Discovery & Validation',
    description:
      'Scans Azure Blob container for newest untagged file under CVP/Driveway-Merchandising-V2/. Validates filename starts with "full" for FULL import type.',
    color: c.cyan,
    code: {
      filename: 'CronEdsFiles.kt',
      language: 'kotlin',
      content: `// Find newest untagged file
val file = cronEdsFiles.findBestFile() // scans "inbound" container
val isValid = cronEdsFiles.isFileValid() // must start with "full"`,
    },
  },
  {
    number: 3,
    title: 'Data Initialization',
    description:
      'Fetches category database, feature database, shipping config from Tax & Fee API, and free shipping zone lookup. Any failure here cancels the entire import with HIGH severity.',
    color: c.green,
  },
  {
    number: 4,
    title: 'Temp Collection Import',
    description:
      'Creates temporary staging collection (temp_vehicleV3_<timestamp>). Parses EDS TSV file, converts rows to Vehicle objects, and batch-inserts in chunks of 500 with 5 concurrent permits.',
    color: c.purple,
    code: {
      filename: 'CronEdsVehicleImporter.kt',
      language: 'kotlin',
      content: `// Batch Size: 500 vehicles, Concurrency: 5 permits
val tempImport = vehicleDao.createTempImport()
// Parse TSV → EdsExtractedInventoryRow → Vehicle objects
// Insert in batches with Semaphore(5)`,
    },
  },
  {
    number: 5,
    title: 'Delete Safety Check',
    description:
      'Compares temp collection count vs live vehicleV3. If delta >= 15,000 vehicles, aborts with SUSPICIOUS_FILE status to prevent accidental wholesale deletion from incomplete files.',
    color: c.orange,
    code: {
      filename: 'CronDeleteCheck.kt',
      language: 'kotlin',
      content: `val delta = liveInventoryCount - tempInventoryCount
if (delta >= suspiciousDeltaThreshold) { // 15,000
    throw DeleteCheckFailureException()
}
// Uses Retry.backoff(5, 500ms) for count queries`,
    },
  },
  {
    number: 6,
    title: 'Delta Publishing',
    description:
      'Detects ADD/UPDATE/DELETE changes between temp and live collections. Publishes deltas in batches of 100 to inventory-delta-topic on Azure Service Bus.',
    color: c.pink,
  },
  {
    number: 7,
    title: 'Merge to Live Collection',
    description:
      'Merges temp collection into vehicleV3. Preserves protected fields (leasing, manuallySuppressed, availability) from existing documents while overwriting everything else.',
    color: c.accent,
  },
  {
    number: 8,
    title: 'Mark & Sweep',
    description:
      'Sets status=DELETED for vehicles in live collection that are missing from the new import file. These are cleaned up later by the hourly stale records cleanup job.',
    color: c.red,
  },
  {
    number: 9,
    title: 'Post-Import Tasks',
    description:
      'Updates search suggestions from unique make+model combinations. Then applies lease expiry processing to remove expired regional leasing prices.',
    color: c.green,
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function CronDeepDivePage() {
  const { setSidebar, clearSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('Cron Deep-Dive', tocItems);
    return () => clearSidebar();
  }, []);

  return (
    <div style={page}>
      {/* Hero */}
      <section style={heroSection}>
        <div style={heroGradientBg} />
        <motion.div style={heroContent} {...fadeUp}>
          <h1 style={heroTitle}>
            Cron Jobs
            <br />
            Deep Dive
          </h1>
          <p style={heroSubtitle}>
            Complete documentation of all scheduled jobs in the Odyssey-Api cron module &mdash;
            schedules, inputs/outputs, retry strategies, failure modes, and observability.
          </p>
          <div style={badgeRow}>
            <Badge label="Spring @Scheduled" color="green" dot />
            <Badge label="5 Cron Jobs" color="blue" dot />
            <Badge label="Every 30 min" color="purple" dot />
            <Badge label="OpenTracing" color="cyan" dot />
          </div>
        </motion.div>
      </section>

      {/* Overview */}
      <motion.section id="cron-overview" style={section} {...fadeUp}>
        <SectionHeader
          label="Module"
          title="Cron Module Overview"
          description="The odyssey-cron microservice runs as a single Kubernetes replica with Spring's @EnableScheduling."
        />
        <p style={prose}>
          All cron jobs are orchestrated by the <code>ScheduledTasks</code> component in
          <code> cron/src/main/kotlin/.../schedulers/ScheduledTasks.kt</code>. Each job uses
          Spring's <code>@Scheduled(cron = "...")</code> annotation with externalized cron expressions
          from <code>application.yml</code>. On local (laptop) profile, all schedules are set to
          impossible dates to prevent disruption during development.
        </p>
        <Callout type="info" title="Ownership">
          The cron module is part of the Odyssey-Api monorepo and deploys as a dedicated Kubernetes
          CronJob (<code>odyssey-cron</code>). It can be deployed independently ahead of API deployments
          via the <code>odyssey-cron-dev.yml</code> pipeline.
        </Callout>
      </motion.section>

      {/* Schedule Table */}
      <motion.section id="schedule-table" style={section} {...fadeUp}>
        <SectionHeader
          label="Schedule"
          title="Cron Schedule Table"
          description="All five scheduled jobs with their cron expressions and frequencies."
        />
        <DataTable
          headers={['Job Name', 'Cron Expression', 'Frequency', 'Config Key']}
          rows={[
            ['EDS Vehicle Import', '0 0,30 * * * *', 'Every 30 minutes', 'cron.vehicleReader.cronTiming'],
            ['Postal Code Region Sync', '0 45 0,6,12,18 * * *', '4x daily (00:45, 06:45, 12:45, 18:45 UTC)', 'cron.regionSync.cronTiming'],
            ['Stale Records Cleanup', '0 15 * * * *', 'Hourly at :15', 'cron.databaseCleanup.staleRecords.cronTiming'],
            ['Temp Collections Cleanup', '0 10 8 * * *', 'Daily at 08:10 UTC', 'cron.databaseCleanup.staleTempCollections.cronTiming'],
            ['Spin Count Metric', '30 */5 * * * *', 'Every 5 minutes', 'cron.metricUpdate.cronTiming'],
          ]}
          highlightColumn={1}
        />
        <div style={{ marginTop: '1rem' }}>
          <Callout type="warning" title="Local Development">
            On the <code>laptop</code> profile, all cron jobs are disabled by setting schedules to impossible
            dates (e.g., <code>0 0 0 30 11 *</code>). This prevents accidental data modifications during development.
          </Callout>
        </div>
      </motion.section>

      {/* EDS Vehicle Import */}
      <motion.section id="eds-import" style={section} {...fadeUp}>
        <SectionHeader
          label="Primary Job"
          title="EDS Vehicle Import"
          description="The core cron job that imports vehicle inventory from EDS TSV files every 30 minutes."
        />
        <div style={gridTwo}>
          <Card title="Inputs" variant="blue">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li>EDS TSV file from Azure Blob (<code>CVP/Driveway-Merchandising-V2/</code>)</li>
              <li>Category database (vehicle categories)</li>
              <li>Feature database (vehicle features)</li>
              <li>Shipping config from Tax & Fee API</li>
              <li>Free shipping zone zip codes</li>
            </ul>
          </Card>
          <Card title="Outputs & Side Effects" variant="green">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li>Upserted vehicles in <code>vehicleV3</code> collection</li>
              <li>Vehicles marked <code>status=DELETED</code> (mark & sweep)</li>
              <li>Updated <code>searchSuggestion</code> collection</li>
              <li>Published deltas to <code>inventory-delta-topic</code> (ASB)</li>
              <li>Updated lease expiries on vehicles</li>
              <li>EDS file tagged as complete/skipped in Blob</li>
            </ul>
          </Card>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Import Pipeline (9 Stages)</h3>
          <FlowTimeline steps={edsImportSteps} />
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Sequence Diagram</h3>
          <MermaidViewer title="EDS Import Flow" tabs={[{ label: 'Import Flow', source: edsImportFlow }]} />
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Field Preservation During Merge</h3>
          <Callout type="info" title="Protected Fields">
            When merging the temp collection into <code>vehicleV3</code>, these fields are preserved from
            existing documents (not overwritten by the new import):
          </Callout>
          <DataTable
            headers={['Field', 'Source', 'Reason']}
            rows={[
              ['leasing', 'Existing document', 'Managed by consumer module (Service Bus)'],
              ['manuallySuppressed', 'Existing document', 'Managed via REST API'],
              ['availability.purchasePending', 'Existing document', 'Managed by availability subscriber'],
              ['availability.enqueuedTime', 'Existing document', 'Stale message detection'],
              ['image.spinUrl', 'Existing document', 'Managed separately from EDS data'],
              ['All other fields (~40+)', 'New import file', 'Overwritten with latest EDS data'],
            ]}
            highlightColumn={1}
          />
        </div>
      </motion.section>

      {/* Lease Expiry */}
      <motion.section id="lease-expiry" style={section} {...fadeUp}>
        <SectionHeader
          label="Chained Job"
          title="Lease Expiry Processing"
          description="Runs immediately after EDS import to remove expired regional leasing prices."
        />
        <p style={prose}>
          After the EDS import completes, <code>CronLeasing.applyLeaseExpiries()</code> is chained
          via <code>.then()</code>. It queries all leasable vehicles, checks each regional price's
          <code> expiresOn</code> timestamp, filters out expired prices, and recalculates <code>canLease</code>
          and <code>defaultPrice</code>.
        </p>
        <div style={gridTwo}>
          <Card title="Process" variant="purple">
            <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li>Query all leasable vehicles (buffered in 100-vehicle chunks)</li>
              <li>For each vehicle, check if any <code>regionalPrices[].expiresOn</code> is before now</li>
              <li>Filter out expired regional prices</li>
              <li>Recalculate <code>canLease</code> (true if any active price remains)</li>
              <li>Recalculate <code>defaultPrice</code> (region 1 amount, or null)</li>
              <li>Batch upsert updated vehicles (100 per batch)</li>
            </ol>
          </Card>
          <Card title="Error Handling" variant="yellow">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li>Gracefully handles <code>DateTimeParseException</code> on invalid expiry dates</li>
              <li>Logs error and skips individual vehicle (continues processing)</li>
              <li>Only modifies <code>leasing</code> field &mdash; all other data unchanged</li>
              <li>Reactor checkpoint: "Find and update any vehicles where leasing data isn't accurate."</li>
            </ul>
          </Card>
        </div>
      </motion.section>

      {/* Region Sync */}
      <motion.section id="region-sync" style={section} {...fadeUp}>
        <SectionHeader
          label="Sync Job"
          title="Postal Code Region Sync"
          description="Syncs OEM-to-postal-code region mappings from the Incentives API, 4 times daily."
        />
        <div style={gridTwo}>
          <Card title="Inputs / Outputs" variant="green">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: '0 0 0.5rem' }}>
              <strong>Input:</strong> Incentives API <code>getRegions()</code> &mdash; returns region IDs,
              postal codes, and OEM makes.
            </p>
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: '0 0 0.5rem' }}>
              <strong>Output:</strong> Upserted <code>postalCodeOemRegions</code> collection with postal-code-centric
              region mappings.
            </p>
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              <strong>Cleanup:</strong> Old records pruned by <code>lastSeenAt</code> timestamp.
            </p>
          </Card>
          <Card title="Validation" variant="red">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li>Transforms from region-centric to postal-code-centric structure</li>
              <li>Groups by postal code and merges make-region mappings</li>
              <li>Throws if same make maps to multiple regions in one zip code</li>
              <li>On API failure: logs error and returns empty (job continues)</li>
            </ul>
          </Card>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <MermaidViewer title="Region Sync Flow" tabs={[{ label: 'Region Sync', source: regionSyncFlow }]} />
        </div>
      </motion.section>

      {/* DB Cleanup */}
      <motion.section id="db-cleanup" style={section} {...fadeUp}>
        <SectionHeader
          label="Cleanup Jobs"
          title="Database Cleanup"
          description="Two cleanup jobs maintain database hygiene: stale record removal and temp collection cleanup."
        />
        <div style={gridTwo}>
          <Card title="Stale Records Cleanup (hourly)" variant="orange">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li>Runs hourly at :15</li>
              <li>Iterates through all alternate vehicle collections</li>
              <li>Deletes documents where <code>status == DELETED</code></li>
              <li>Logs deleted count per collection</li>
              <li>Blocking operation (synchronous)</li>
            </ul>
          </Card>
          <Card title="Temp Collections Cleanup (nightly)" variant="cyan">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li>Runs daily at 08:10 UTC</li>
              <li>Finds all collections starting with <code>temp_vehicle</code></li>
              <li>Extracts timestamp from collection name suffix</li>
              <li>Drops collections older than 28 days (configurable)</li>
              <li>Serial execution via Semaphore(1), 60s timeout per drop</li>
            </ul>
          </Card>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Callout type="info" title="Stalled Job Recovery">
            On application startup (<code>@PostConstruct</code>), the cleanup service checks for any
            running jobs and marks them as <code>KILLED</code>. This recovers from crashes where a
            previous import job was interrupted.
          </Callout>
        </div>
      </motion.section>

      {/* Metric Updater */}
      <motion.section id="metric-updater" style={section} {...fadeUp}>
        <SectionHeader
          label="Metrics"
          title="Spin Count Metric Updater"
          description="Updates a Micrometer gauge for 360-degree spin photo counts every 5 minutes."
        />
        <Card title="photos.360.count" variant="pink">
          <p style={{ fontSize: '0.88rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
            Counts vehicles where <code>image.spinUrl != null</code> using a MongoDB aggregation pipeline.
            Result is stored in an atomic gauge (<code>spinCountGauge.set(count)</code>) and exported to
            DataDog via Micrometer. Returns 0 with a warning log if count is null.
          </p>
        </Card>
        <CodeBlock
          code={`// MetricUpdater.kt
val pipeline = listOf(
    match(Vehicle::image / Image::spinUrl ne null),
    project(Vehicle::vin to 1)
)
val count = vehicleDao.runAggregation(pipeline).count()
spinCountGauge?.set(count)`}
          language="kotlin"
          filename="MetricUpdater.kt"
        />
      </motion.section>

      {/* Retry & Idempotency */}
      <motion.section id="retry-idempotency" style={section} {...fadeUp}>
        <SectionHeader
          label="Resilience"
          title="Retry & Idempotency Strategies"
          description="How each cron job handles retries and ensures safe re-execution."
        />
        <DataTable
          headers={['Strategy', 'Where Used', 'Details']}
          rows={[
            ['Retry.backoff(5, 500ms)', 'CronDeleteCheck count queries', 'Exponential backoff: 5 attempts starting at 500ms'],
            ['File tagging', 'EDS Import', 'Processed files tagged in Blob (complete/skipped) so they are not re-processed'],
            ['Job tracker', 'EDS Import', 'Checks for already-running jobs before starting; prevents concurrent imports'],
            ['VIN-based upsert', 'Vehicle import & leasing', 'MongoDB upsert by VIN (@BsonId) is idempotent; same data produces same result'],
            ['Timestamp-based prune', 'Region Sync', 'Upserts all regions then prunes by lastSeenAt; re-running produces same state'],
            ['Service Bus retry', 'Delta publishing', 'Azure Service Bus client SDK handles internal retries with backoff'],
            ['Stalled job kill', '@PostConstruct', 'On startup, marks any RUNNING jobs as KILLED to recover from crashes'],
          ]}
        />
      </motion.section>

      {/* Failure Modes */}
      <motion.section id="failure-modes" style={section} {...fadeUp}>
        <SectionHeader
          label="Errors"
          title="Failure Modes & Status Codes"
          description="All possible job outcomes and their recovery behavior."
        />
        <DataTable
          headers={['Status', 'Severity', 'Trigger', 'File Marked', 'Recoverable?']}
          rows={[
            ['SUCCEEDED', '—', 'All stages pass', 'Complete', '—'],
            ['ALREADY_RUNNING', 'LOW', 'Duplicate job execution', 'No (retry next cycle)', 'Yes'],
            ['NO_DOCUMENT_FOUND', 'LOW', 'No EDS file in Blob', 'No (retry next cycle)', 'Yes'],
            ['INVALID_DOCUMENT', 'MEDIUM/HIGH', 'CSV parse error, bad filename, duplicate keys', 'Skipped (won\'t retry)', 'No'],
            ['SUSPICIOUS_FILE', 'HIGH', 'Delta >= 15,000 vehicles', 'Skipped (won\'t retry)', 'No'],
            ['CANCELLED', 'HIGH', 'Config fetch failure (categories, fees, etc.)', 'No (retry next cycle)', 'Yes'],
            ['FAILED', 'HIGH', 'Unexpected exception', 'No (retry next cycle)', 'Yes'],
            ['KILLED', 'HIGH', 'Stalled job cleanup on startup', 'Skipped', 'Manual'],
          ]}
          highlightColumn={0}
        />
        <div style={{ marginTop: '1rem' }}>
          <Callout type="danger" title="Severity-Based Logging">
            <strong>HIGH</strong> severity logs as ERROR, <strong>MEDIUM</strong> logs as WARN,
            <strong> LOW</strong> logs as INFO. All failures increment corresponding Micrometer counters
            (e.g., <code>cron.eds_read_vehicles.job.failed</code>).
          </Callout>
        </div>
      </motion.section>

      {/* Metrics & Tracing */}
      <motion.section id="metrics-tracing" style={section} {...fadeUp}>
        <SectionHeader
          label="Observability"
          title="Metrics & Distributed Tracing"
          description="How cron jobs are monitored via Micrometer, OpenTracing, and DataDog."
        />
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Micrometer Counters</h3>
        <DataTable
          headers={['Metric', 'Type', 'When Incremented']}
          rows={[
            ['cron.eds_read_vehicles.job.running', 'Counter', 'Job starts (Stage 1)'],
            ['cron.eds_read_vehicles.job.succeeded', 'Counter', 'Import completes successfully'],
            ['cron.eds_read_vehicles.job.failed', 'Counter', 'Unexpected exception'],
            ['cron.eds_read_vehicles.job.cancelled', 'Counter', 'Config fetch fails'],
            ['cron.eds_read_vehicles.job.killed', 'Counter', 'Stalled job cleanup'],
            ['cron.eds_read_vehicles.job.already_running', 'Counter', 'Duplicate execution prevented'],
            ['cron.eds_read_vehicles.job.no_document_found', 'Counter', 'No EDS file available'],
            ['cron.eds_read_vehicles.job.suspicious_file', 'Counter', 'Delete check threshold exceeded'],
            ['cron.eds_read_vehicles.job.invalid_document', 'Counter', 'CSV parse error / bad filename'],
            ['photos.360.count', 'Gauge', 'Every 5 minutes (spin metric job)'],
          ]}
          highlightColumn={0}
        />

        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>OpenTracing Span</h3>
          <Card title="readEdsVehicles Span" variant="cyan">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Created at the start of each EDS import. Tagged with <code>service: "odyssey-cron"</code>.
              Baggage items include <code>parentService</code> and <code>jobDetails.runId</code> for
              cross-service correlation. Span is finished in the cleanup phase and scope is closed.
              DataDog APM agent (<code>dd-java-agent.jar</code>) is injected at runtime in prod.
            </p>
          </Card>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Common Metric Tags</h3>
          <CodeBlock
            code={`// OdysseyCronApplication.kt
registry.config().commonTags(listOf(
    Tag.of("env", applicationHelpers.getActiveProfile()),
    Tag.of("service", "odyssey-cron")
))`}
            language="kotlin"
            filename="OdysseyCronApplication.kt"
          />
        </div>
      </motion.section>

      {/* Collections Map */}
      <motion.section id="collections" style={section} {...fadeUp}>
        <SectionHeader
          label="Data"
          title="Collections Read/Write Map"
          description="Which MongoDB collections each cron job reads from and writes to."
        />
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Write Operations</h3>
        <DataTable
          headers={['Collection', 'Job', 'Operation', 'Fields Modified']}
          rows={[
            ['temp_vehicleV3_*', 'EDS Import', 'Insert (batch)', 'All vehicle fields'],
            ['vehicleV3', 'EDS Import', 'Upsert + Merge', 'All except leasing, suppression, availability'],
            ['vehicleV3', 'Lease Expiry', 'Update', 'leasing.canLease, defaultPrice, regionalPrices'],
            ['vehicleV3', 'Stale Records', 'Delete', 'Rows where status == DELETED'],
            ['searchSuggestion', 'EDS Import', 'Upsert / Delete', 'value, lastSeenJobId'],
            ['postalCodeOemRegions', 'Region Sync', 'Upsert / Delete', 'postalCode, makeRegions, lastSeenAt'],
            ['inventoryJobDetails', 'EDS Import', 'Upsert', 'runId, status, counts, timing'],
          ]}
        />

        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '1rem' }}>Read Operations</h3>
        <DataTable
          headers={['Collection', 'Job', 'Query Purpose']}
          rows={[
            ['vehicleV3', 'EDS Import', 'Searchable count (for delete safety check)'],
            ['vehicleV3', 'Lease Expiry', 'All leasable vehicles'],
            ['vehicleV3', 'Spin Metric', 'Count vehicles with image.spinUrl != null'],
            ['vehicleV3', 'Search Suggestions', 'Unique make+model combinations'],
            ['searchSuggestion', 'Search Suggestions', 'All existing suggestions'],
            ['inventoryJobDetails', 'EDS Import', 'Running job check (duplicate prevention)'],
          ]}
        />
      </motion.section>

      {/* Key Takeaways */}
      <motion.section id="cron-takeaways" style={section} {...fadeUp}>
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
            <li>The EDS Vehicle Import is the primary cron job &mdash; runs every 30 minutes with a 9-stage pipeline including safety checks, delta publishing, and field preservation.</li>
            <li>Duplicate prevention: <code>CronJobTracker</code> prevents concurrent import jobs. Stalled jobs are killed on startup via <code>@PostConstruct</code>.</li>
            <li>The delete safety check (threshold: 15,000) prevents accidental wholesale deletion from incomplete EDS files.</li>
            <li>Protected fields (leasing, manuallySuppressed, availability) survive import merges because they're managed by separate services.</li>
            <li>Region Sync runs 4x daily to keep postal-code-to-OEM-region mappings current for leasing price calculations.</li>
            <li>Temp collections are cleaned up after 28 days. Deleted vehicle records are purged hourly.</li>
            <li>All jobs emit Micrometer counters and OpenTracing spans for DataDog monitoring.</li>
          </ul>
        </div>
      </motion.section>
    </div>
  );
}
