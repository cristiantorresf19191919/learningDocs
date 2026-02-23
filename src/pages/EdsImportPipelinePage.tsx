import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { useSidebar } from '../context/SidebarContext';
import SectionHeader from '../components/shared/SectionHeader';
import Card from '../components/shared/Card';
import Callout from '../components/shared/Callout';
import DataTable from '../components/shared/DataTable';
import CodeBlock from '../components/shared/CodeBlock';
import MermaidViewer from '../components/diagrams/MermaidViewer';

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
  { id: 'orchestrator', label: 'Orchestrator' },
  { id: 'file-discovery', label: 'File Discovery' },
  { id: 'tsv-schema', label: 'TSV Schema' },
  { id: 'tsv-parsing', label: 'TSV Parsing' },
  { id: 'vehicle-conversion', label: 'Vehicle Conversion' },
  { id: 'business-rules', label: 'Business Rules' },
  { id: 'batch-import', label: 'Batch Import' },
  { id: 'safety-check', label: 'Safety Check' },
  { id: 'delta-computation', label: 'Delta Computation' },
  { id: 'merge-process', label: 'Merge Process' },
  { id: 'field-preservation', label: 'Field Preservation' },
  { id: 'search-suggestions', label: 'Search Suggestions' },
  { id: 'lease-expiry', label: 'Lease Expiry' },
  { id: 'takeaways', label: 'Key Takeaways' },
];

/* ------------------------------------------------------------------ */
/*  Mermaid Diagrams                                                   */
/* ------------------------------------------------------------------ */
const pipelineDiagram = `sequenceDiagram
    participant SCHED as ScheduledTasks
    participant TRACKER as CronJobTracker
    participant FILES as CronEdsFiles
    participant BLOB as Azure Blob
    participant IMPORTER as CronEdsVehicleImporter
    participant TEMP as temp_vehicleV3_*
    participant CHECK as CronDeleteCheck
    participant LIVE as vehicleV3
    participant ASB as Service Bus
    participant SUGGEST as CronSearchSuggestions

    SCHED->>TRACKER: startJob()
    alt Job already running
        TRACKER-->>SCHED: ALREADY_RUNNING
    else
        TRACKER-->>SCHED: RUNNING
    end

    SCHED->>FILES: findBestFile()
    FILES->>BLOB: scan inbound/CVP/Driveway-Merchandising-V2/
    BLOB-->>FILES: newest untagged GZIP TSV
    FILES->>FILES: isFileValid() (must start with "full")

    SCHED->>IMPORTER: coDoVehicleImport()
    Note over IMPORTER: Fetch configs: categories, features, shipping, free zones
    IMPORTER->>TEMP: createTempImport()

    loop Parse TSV (batches of 500, concurrency: 5)
        IMPORTER->>TEMP: batchInsert(vehicles)
    end

    IMPORTER->>CHECK: checkForLargeDelete()
    CHECK->>TEMP: count active documents
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
    IMPORTER->>TEMP: drop temp collection

    SCHED->>SUGGEST: updateSearchSuggestions()
    SCHED->>TRACKER: endJob()
    SCHED->>BLOB: markFileComplete()`;

const deltaComputationDiagram = `graph TD
    A[Load VINs from temp collection] --> B[Load VINs from live vehicleV3]
    B --> C{Set Operations}
    C -->|incoming - existing| D[ADD deltas]
    C -->|existing - incoming| E[DELETE deltas]
    C -->|incoming intersect existing| F[Check price & mileage]
    F -->|Changed| G[UPDATE deltas]
    F -->|No change| H[Skip]
    D --> I[Combine all deltas]
    E --> I
    G --> I
    I --> J[Publish to inventory-delta-topic in batches of 100]`;

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

const section: CSSProperties = { padding: '2rem 2rem 0' };

const prose: CSSProperties = {
  fontSize: '0.95rem',
  color: c.text2,
  lineHeight: 1.8,
  maxWidth: 900,
  marginBottom: '1.5rem',
};

const gridTwo: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '1rem',
  marginTop: '1.5rem',
};

const takeawayBox: CSSProperties = {
  background: c.surface,
  border: `1px solid ${c.border}`,
  borderRadius: 12,
  padding: '2rem',
};

const takeawayTitle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: '1.1rem',
  fontWeight: 700,
  marginBottom: '1rem',
};

const takeawayList: CSSProperties = {
  margin: 0,
  paddingLeft: '1.25rem',
  fontSize: '0.9rem',
  color: c.text2,
  lineHeight: 2,
};

/* ================================================================== */
/*  Page Component                                                     */
/* ================================================================== */
export default function EdsImportPipelinePage() {
  const { setSidebar, clearSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('EDS Import Pipeline', tocItems);
    return () => clearSidebar();
  }, []);

  return (
    <div style={page}>
      {/* Hero */}
      <section style={heroSection}>
        <div style={heroGradientBg} />
        <div style={heroContent}>
          <motion.h1 style={heroTitle} {...fadeUp}>
            EDS Import Pipeline
          </motion.h1>
          <motion.p style={heroSubtitle} {...fadeUp}>
            A deep dive into the Electronic Dealer Service import pipeline that runs every 30
            minutes, transforming GZIP-compressed TSV files from Azure Blob Storage into the
            live <code>vehicleV3</code> MongoDB collection powering Driveway.com.
          </motion.p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  OVERVIEW                                                     */}
      {/* ============================================================ */}
      <motion.section id="overview" style={section} {...fadeUp}>
        <SectionHeader
          label="Architecture"
          title="Pipeline Overview"
          description="The EDS import is a 9-stage reactive pipeline orchestrated by EdsVehicleReaderV2, triggered on a cron schedule."
        />
        <p style={prose}>
          Every 30 minutes (<code>0 0,30 * * * *</code>), the <code>ScheduledTasks</code> class
          triggers the EDS import pipeline. The pipeline reads GZIP-compressed TSV files from
          Azure Blob Storage, parses 76-column vehicle records, applies business rules, stages
          them in a temporary MongoDB collection, computes inventory deltas, merges to the live
          collection, and updates search suggestions.
        </p>

        <MermaidViewer
          title="EDS Import Pipeline"
          tabs={[{ label: 'Full Flow', source: pipelineDiagram }]}
        />

        <div style={gridTwo}>
          <Card title="Key Components" variant="blue">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li><strong>EdsVehicleReaderV2</strong> &mdash; Orchestrator that chains all stages via Reactor Mono</li>
              <li><strong>CronEdsFiles</strong> &mdash; Azure Blob file discovery and validation</li>
              <li><strong>CronEdsVehicleImporter</strong> &mdash; Core import: parse, batch insert, merge</li>
              <li><strong>CronDeleteCheck</strong> &mdash; Safety threshold validation (15K limit)</li>
              <li><strong>CronSearchSuggestions</strong> &mdash; Autocomplete data refresh</li>
              <li><strong>CronJobTracker</strong> &mdash; Job lifecycle management and idempotency</li>
            </ul>
          </Card>
          <Card title="Data Flow" variant="green">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li><strong>Source:</strong> Azure Blob container <code>inbound</code>, prefix <code>CVP/Driveway-Merchandising-V2/</code></li>
              <li><strong>Format:</strong> GZIP-compressed TSV (tab-separated values), 76 columns</li>
              <li><strong>Staging:</strong> Temporary collection <code>temp_vehicleV3_&lt;timestamp&gt;</code></li>
              <li><strong>Destination:</strong> Live <code>vehicleV3</code> collection in MongoDB Atlas</li>
              <li><strong>Notifications:</strong> Inventory deltas to <code>inventory-delta-topic</code> on Service Bus</li>
            </ul>
          </Card>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  ORCHESTRATOR                                                 */}
      {/* ============================================================ */}
      <motion.section id="orchestrator" style={section} {...fadeUp}>
        <SectionHeader
          label="Stage 1"
          title="Orchestrator: EdsVehicleReaderV2"
          description="The main orchestrator chains all import stages via a reactive Mono pipeline with the isStillRunning guard."
        />
        <p style={prose}>
          <code>EdsVehicleReaderV2.getReadVehiclesFlow()</code> returns a <code>Mono&lt;InventoryJobDetails&gt;</code> that
          chains every stage with <code>.flatMap</code>. Each stage transition uses the <code>isStillRunning</code> infix
          function to verify the job is still in <code>RUNNING</code> status before proceeding. If any stage
          emits a <code>Mono.error(JobException)</code>, the pipeline short-circuits to the error handler.
        </p>

        <CodeBlock
          code={`// EdsVehicleReaderV2.kt - Main orchestration chain
fun getReadVehiclesFlow(): Mono<InventoryJobDetails> {
    val initialJobDetails = cronJobTracker.createInitialJobDetails(Instant.now())

    return Mono.defer { Mono.just(initialJobDetails) }
        .flatMap { job -> job isStillRunning { cronJobTracker.startJob(job) } }
        .doOnNext { job -> meterRegistry.incrementEdsReaderStatus(job) }
        .checkpoint("Stage 1: Check if job is already running")
        .flatMap { job -> job isStillRunning { cronEdsFiles.findBestFile(job) } }
        .flatMap { job -> job isStillRunning { cronEdsFiles.isFileValid(job) } }
        .doOnNext { log.info("Found file \${it.fileName}") }
        .checkpoint("Stage 2: Find best & valid file")
        .flatMap { job -> job isStillRunning { cronEdsVehicleImporter.doVehicleImport(job) } }
        .checkpoint("Stage 3: Perform the temp import")
        .flatMap { job -> job isStillRunning { cronEdsVehicleImporter.markAndSweep(job) } }
        .flatMap { job -> job isStillRunning { mono { cronSearchSuggestions.updateSearchSuggestions(job) } } }
        .checkpoint("Stage 4: Post job tasks")
        .flatMap { job ->
            val successfulJob = job.copy(status = JobStatus.SUCCEEDED)
            meterRegistry.incrementEdsReaderStatus(successfulJob)
            cronJobTracker.endJob(successfulJob)
        }
        .onErrorResume(JobException::class.java) { e ->
            val failedJob = e.relatedJob.completeWithJobException(e)
            meterRegistry.incrementEdsReaderStatus(failedJob)
            cronJobTracker.endJob(failedJob)
        }
}`}
          language="kotlin"
          filename="EdsVehicleReaderV2.kt"
        />

        <div style={{ marginTop: '1rem' }}>
          <CodeBlock
            code={`// isStillRunning infix function - Guards each stage transition
infix fun InventoryJobDetails.isStillRunning(
    codeToRun: () -> Mono<InventoryJobDetails>
): Mono<InventoryJobDetails> =
    when (this.status) {
        JobStatus.RUNNING -> {
            try {
                codeToRun()
            } catch (e: JobException) {
                log.warn("Warning: Did you actually mean to throw a JobException?")
                Mono.error(e)
            } catch (e: Exception) {
                log.error("EDS Cron encountered an unhandled exception.", e)
                Mono.error(JobException(this, JobStatus.FAILED, e.message ?: "<null>"))
            }
        }
        else -> {
            log.error("Unexpected job status '\$status' expected RUNNING")
            Mono.error(JobException(this, status, this.statusDesc ?: "<null>"))
        }
    }`}
            language="kotlin"
            filename="EdsVehicleReaderV2.kt"
          />
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  FILE DISCOVERY                                               */}
      {/* ============================================================ */}
      <motion.section id="file-discovery" style={section} {...fadeUp}>
        <SectionHeader
          label="Stage 2"
          title="Azure Blob File Discovery"
          description="CronEdsFiles scans Azure Blob Storage for the newest unprocessed GZIP TSV file."
        />
        <p style={prose}>
          The file discovery stage scans the Azure Blob container <code>inbound</code> under the
          prefix <code>CVP/Driveway-Merchandising-V2/</code>. It looks for the newest file that
          hasn&apos;t been tagged as &ldquo;complete&rdquo; or &ldquo;skipped&rdquo;. The file must
          start with <code>full</code> to be valid (partial/delta files are skipped). Once found,
          <code>AzureEdsFileStorage</code> downloads and decompresses the GZIP content using
          <code>java.util.zip.GZIPInputStream</code>.
        </p>

        <CodeBlock
          code={`// AzureEdsFileStorage.kt - GZIP decompression
class AzureEdsFileStorage : FileStorage<EdsExtractedInventoryRow> {

    override fun createImportFileWrapper(filePath: String): ImportFileWrapper {
        // Download GZIP file from Azure Blob to temp file
        val tempFile = File.createTempFile("eds-import", ".tsv.gz")
        blobClient.downloadToFile(tempFile.absolutePath)

        // Decompress GZIP → BufferedReader
        val tempFileInputStream = FileInputStream(tempFile)
        val tempFileReader = GZIPInputStream(tempFileInputStream).bufferedReader()
        //                   ^^^^^^^^^^^^^^^^
        //  java.util.zip.GZIPInputStream decompresses the .gz file on the fly
        //  producing the raw TSV text that gets passed to CsvToExtractedRowConverter

        return ImportFileWrapper(tempFile, tempFileReader)
    }
}`}
          language="kotlin"
          filename="AzureEdsFileStorage.kt"
        />

        <div style={{ marginTop: '1rem' }}>
          <Callout type="info" title="What is GZIP?">
            GZIP is a compression format that reduces file size for efficient storage and transfer.
            The EDS files are stored as <code>.tsv.gz</code> in Azure Blob. When the cron job reads
            them, <code>GZIPInputStream</code> transparently decompresses the bytes back into the
            original tab-separated text, which is then fed to the CSV parser.
          </Callout>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  TSV SCHEMA                                                   */}
      {/* ============================================================ */}
      <motion.section id="tsv-schema" style={section} {...fadeUp}>
        <SectionHeader
          label="Data Model"
          title="TSV Schema: 76-Column EDS Format"
          description="EdsExtractedInventoryRow is the 76-field data class that represents one row from the TSV file."
        />
        <p style={prose}>
          Each TSV file contains one row per vehicle with 76 tab-separated columns. The schema
          is defined by the <code>EdsExtractedInventoryRow</code> data class in the library module.
          The column-to-field mapping is maintained in <code>CsvToExtractedRowConverter.rowNameToTsvName</code>.
        </p>

        <DataTable
          headers={['Category', 'Fields', 'TSV Columns']}
          rows={[
            ['Identity', 'inventoryId, vin, dealerStock', 'INVENTORY_ID, VIN, DEALER_STOCK'],
            ['Vehicle Info', 'vehicleModelYear, make, model, series, vehicleTrim', 'VEHICLE_MODEL_YEAR, MAKE, MODEL, SERIES, VEHICLE_TRIM'],
            ['Body', 'doors, bodyStyle, simplifiedBodyStyle, cabStyle, bedStyle', 'DOORS, BODY_STYLE, ODYSSEY_BODY_STYLE, CABSTYLE, BEDSTYLE'],
            ['Engine', 'engine, engineDescription, cylinders, engineDisplacement, fuelType', 'ENGINE, ENGINE_DESCRIPTION, CYLINDERS, ENGINE_DISPLACEMENT, FUEL_TYPE'],
            ['Drivetrain', 'drivetrain, transmission, transmissionDetails', 'DRIVETRAIN, TRANSMISSION, TRANSMISSION_DETAILS'],
            ['Condition', 'vehicleCondition, certified, certifiedProgram', 'VEHICLE_CONDITION, CERTIFIED, CERTIFIED_PROGRAM'],
            ['Pricing', 'askingPrice, drivewayPrice, msrp, unlockPrice, dealerDiscount, accessoryPrice, dealerInvoicePrice', 'ASKINGPRICE, DRIVEWAY_PRICE, MSRP, UNLOCK_PRICE, DEALER_DISCOUNT, ACCESSORY_PRICE, DEALER_INVOICE_PRICE'],
            ['Book Values', 'primaryBookValue, primaryBookName, blackbookUvc', 'PRIMARYBOOKVALUE, PRIMARYBOOKNAME, BLACKBOOK_UVC'],
            ['Colors', 'extcolorBase, extcolorOEM, intcolorBase, intcolorOEM, interiorDescription', 'EXTCOLOR_BASE, EXTCLOR_OEM, INTCOLOR_BASE, INTCOLOROEM, INTERIOR_DESCRIPTION'],
            ['Fuel Economy', 'mpgeCity, mpgeHighway, mpgeCombined', 'MPGE_CITY, MPGE_HIGHWAY, MPGE_COMBINED'],
            ['Media', 'photoCount, imageUrls, vehicleStockPhotos, monroneyStickerUrl', 'PHOTOCOUNT, IMAGEURLS, VEHICLE_STOCK_PHOTOS, MONRONEY_STICKER_URL'],
            ['Dealer', 'syndicationId, dealerName, dealerAddress, dealerCity, dealerState, dealerZip, dealerEmail', 'MAXDIGITAL_SYNDICATION_ID, DEALERNAME, DEALER_ADDRESS, DEALER_CITY, DEALER_STATE, DEALER_ZIP, DEALER_EMAIL'],
            ['Location', 'latitude, longitude', 'LATITUDE, LONGITUDE'],
            ['Availability', 'salesPending, salesBooked, inventoryInTransit, reconOrderOpen', 'SALES_STATUS_PENDING, SALES_STATUS_BOOKED, INVENTORY_STATUS_INTRANSIT, RECONDITIONING_ORDER_OPEN'],
            ['Hints (15 fields)', 'modelCodeHints, doorsHints, cylindersHints, engineDisplacementHints, ...', 'MODELCODE_HINTS, DOORS_HINTS, CYLINDERS_HINTS, ...'],
            ['Misc', 'age, mileage, oneOwner, details, lifestyleTags, financeable, rimSize', 'AGE, MILEAGE, ONE_OWNER, DETAILS, LIFESTYLE_TAGS, FINANCIABLE, RIM_SIZE'],
          ]}
          highlightColumn={0}
        />
      </motion.section>

      {/* ============================================================ */}
      {/*  TSV PARSING                                                  */}
      {/* ============================================================ */}
      <motion.section id="tsv-parsing" style={section} {...fadeUp}>
        <SectionHeader
          label="Stage 3a"
          title="TSV Parsing: CsvToExtractedRowConverter"
          description="Reflection-based parsing maps TSV headers to Kotlin data class fields with type conversion."
        />
        <p style={prose}>
          The <code>CsvToExtractedRowConverter</code> uses Apache Commons CSV to parse the
          tab-separated file. It then uses Kotlin reflection to map each TSV column value
          to the corresponding <code>EdsExtractedInventoryRow</code> constructor parameter,
          applying type conversions for <code>Double?</code>, <code>Int?</code>, and
          <code>Boolean</code> (where <code>&quot;Y&quot;</code> = true).
        </p>

        <CodeBlock
          code={`// CsvToExtractedRowConverter.kt - Reflection-based TSV parsing
@Component
class CsvToExtractedRowConverter {

    fun parseToRows(reader: Reader): Iterable<EdsExtractedInventoryRow> =
        CSVFormat.TDF.builder()          // Tab-Delimited Format
            .setHeader().setSkipHeaderRecord(true)
            .build()
            .parse(reader.buffered())
            .asIterable()
            .map { fromTsvMap(it.toMap()) }

    private fun fromTsvMap(input: Map<String, String?>): EdsExtractedInventoryRow {
        val c = EdsExtractedInventoryRow::class.primaryConstructor
            ?: throw RuntimeException("Expected a primary constructor")

        val params: Array<Any?> = c.parameters.map { p ->
            val stringVal = input[rowNameToTsvName[p.name]]
            when {
                stringVal == "null" -> null
                p.type == Double::class.createType(nullable = true) -> stringVal?.toDoubleOrNull()
                p.type == Int::class.createType(nullable = true) -> stringVal?.toIntOrNull()
                p.type == Boolean::class.createType() -> stringVal == "Y"
                else -> stringVal
            }
        }.toTypedArray()

        return c.call(*params)  // Construct via reflection
    }

    // Column mapping: Kotlin field name → TSV header name
    val rowNameToTsvName = listOf(
        EdsExtractedInventoryRow::inventoryId to "INVENTORY_ID",
        EdsExtractedInventoryRow::vin to "VIN",
        EdsExtractedInventoryRow::vehicleModelYear to "VEHICLE_MODEL_YEAR",
        EdsExtractedInventoryRow::make to "MAKE",
        EdsExtractedInventoryRow::model to "MODEL",
        EdsExtractedInventoryRow::askingPrice to "ASKINGPRICE",
        EdsExtractedInventoryRow::drivewayPrice to "DRIVEWAY_PRICE",
        // ... 76 total mappings
    ).associate { (k, v) -> k.name to v }
}`}
          language="kotlin"
          filename="CsvToExtractedRowConverter.kt"
        />
      </motion.section>

      {/* ============================================================ */}
      {/*  VEHICLE CONVERSION                                           */}
      {/* ============================================================ */}
      <motion.section id="vehicle-conversion" style={section} {...fadeUp}>
        <SectionHeader
          label="Stage 3b"
          title="Vehicle Conversion: ExtractedRowToVehicleConverter"
          description="Transforms raw TSV rows into Vehicle domain objects with business logic for pricing, status, and dealer mapping."
        />
        <p style={prose}>
          The <code>ExtractedRowToVehicleConverter</code> is a Spring <code>@Component</code> that
          takes each <code>EdsExtractedInventoryRow</code> and builds a full <code>Vehicle</code>
          domain object. Key business logic includes price calculation, inventory status
          determination, dealer region mapping, and category/feature assignment.
        </p>

        <CodeBlock
          code={`// ExtractedRowToVehicleConverter.kt - Core conversion logic
fun convertToVehicle(
    tsvCar: EdsExtractedInventoryRow,
    job: InventoryJobDetails,
    categoriesFeaturesInfo: CategoriesFeaturesInfo,
    shippingConfig: ShippingConfigResponse,
    freeZoneZipProvider: (Long) -> Collection<String>
): Vehicle {
    return with(tsvCar) {
        // Price calculation: drivewayPrice takes precedence over askingPrice
        val calculatedPrice = drivewayPrice ?: (askingPrice ?: 0.0)

        Vehicle(
            vin = vin,
            vehicleId = inventoryId,
            status = meetsBusinessRequirements(shippingConfig.stateToRegionMap),
            lastSeenJobId = job.runId,
            price = calculatedPrice,
            priceInCents = (calculatedPrice * 100).toInt(),
            msrp = msrp,
            // Don't populate if drivewayPrice is present (car sold for arbitrary amount)
            accessoryPrice = if (drivewayPrice != null && drivewayPrice > 0.0) null else accessoryPrice,
            askingPrice = if (drivewayPrice != null && drivewayPrice > 0.0) null else askingPrice,
            drivewayPrice = drivewayPrice,
            mileage = mileage,
            ymmt = Ymmt(vehicleModelYear ?: 0, make ?: "", model ?: "", series),
            bodyStyle = simplifiedBodyStyle.valueOrNull(),
            vehicleCondition = VehicleCondition.fromConditionAndCertification(vehicleCondition, certified),
            dealer = buildDealer(this, shippingConfig, freeZoneZipProvider),
            image = Image(heroUrl, heroUrl, count = photoCount ?: 0),
            categoryFeatures = categoriesFeaturesInfo.mapDetailsToFeatureCategories(details ?: ""),
            vehicleLocation = if (longitude == null || latitude == null) null
                else GeoPoint(longitude, latitude),
            updateTimestamp = Instant.ofEpochMilli(job.startTime),
            // ... ~40 more fields
        )
    }
}`}
          language="kotlin"
          filename="ExtractedRowToVehicleConverter.kt"
        />
      </motion.section>

      {/* ============================================================ */}
      {/*  BUSINESS RULES                                               */}
      {/* ============================================================ */}
      <motion.section id="business-rules" style={section} {...fadeUp}>
        <SectionHeader
          label="Logic"
          title="Business Rules: meetsBusinessRequirements()"
          description="Determines whether a vehicle is ACTIVE or INACTIVE based on six validation rules."
        />

        <CodeBlock
          code={`// ExtractedRowToVehicleConverter.kt - Business rules
fun EdsExtractedInventoryRow.meetsBusinessRequirements(
    stateToRegionMap: Map<String, Int>
): InventoryStatus =
    when {
        // Rule 1: Dealer state must be in a valid shipping region
        !stateToRegionMap.containsKey(dealerState) -> InventoryStatus.INACTIVE

        // Rule 2: Must have a non-zero asking price
        null == askingPrice || askingPrice == 0.0 -> InventoryStatus.INACTIVE

        // Rule 3: Must have valid year (>= 1900), make, and model
        (vehicleModelYear ?: 0) < 1900 || make.isNullOrEmpty() || model.isNullOrEmpty() ->
            InventoryStatus.INACTIVE

        // Rule 4: Used cars need at least 10 photos
        ((photoCount ?: 0) < 10) && !this.isNewCar() -> InventoryStatus.INACTIVE

        // Rule 5: New cars must have at least one image URL
        this.isNewCar() && (imageUrls ?: "").isBlank() -> InventoryStatus.INACTIVE

        // Rule 6: Used/CPO cars must use Driveway CDN image URL prefix
        !this.isNewCar() && !(imageUrls ?: "").startsWith(
            "https://vehicle-images.driveway.com/t_dw_iso/"
        ) -> InventoryStatus.INACTIVE

        // All rules pass
        else -> InventoryStatus.ACTIVE
    }

fun EdsExtractedInventoryRow.isNewCar(): Boolean =
    this.vehicleCondition.equals("New", ignoreCase = true)`}
          language="kotlin"
          filename="ExtractedRowToVehicleConverter.kt"
        />

        <div style={{ marginTop: '1.5rem' }}>
          <DataTable
            headers={['Rule #', 'Check', 'Fails To', 'Reason']}
            rows={[
              ['1', 'dealerState in stateToRegionMap', 'INACTIVE', 'Cannot calculate shipping without a valid region'],
              ['2', 'askingPrice != null && != 0.0', 'INACTIVE', 'Cannot sell a vehicle with no price'],
              ['3', 'year >= 1900, make & model not empty', 'INACTIVE', 'Minimum data quality for listing'],
              ['4', 'photoCount >= 10 (used cars only)', 'INACTIVE', 'Used cars need adequate photos for buyer confidence'],
              ['5', 'imageUrls not blank (new cars)', 'INACTIVE', 'New cars need at least a hero image'],
              ['6', 'imageUrls starts with Driveway CDN prefix (used/CPO)', 'INACTIVE', 'Used car images must be on Driveway CDN'],
            ]}
            highlightColumn={1}
          />
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  BATCH IMPORT                                                 */}
      {/* ============================================================ */}
      <motion.section id="batch-import" style={section} {...fadeUp}>
        <SectionHeader
          label="Stage 3c"
          title="Batch Import to Temp Collection"
          description="Vehicles are parsed and batch-inserted into a temporary MongoDB collection with concurrency-controlled parallelism."
        />
        <p style={prose}>
          Before touching the live <code>vehicleV3</code> collection, all vehicles from the TSV file
          are first staged in a temporary collection named <code>temp_vehicleV3_&lt;timestamp&gt;</code>.
          The import uses chunks of 500 vehicles with a <code>Semaphore(5)</code> for concurrency
          control, allowing up to 2,500 in-flight documents at once.
        </p>

        <CodeBlock
          code={`// CronEdsVehicleImporter.kt - Batch import with semaphore
suspend fun coDoVehicleImport(jobDetails: InventoryJobDetails): InventoryJobDetails {
    // Fetch prerequisite configs
    val categoryList = categoryDatabase.read().collectList().block().orEmpty()
    val featureList = featureDatabase.read().collectList().block().orEmpty()
    val categoryFeaturesInfo = CategoriesFeaturesInfo(categoryList, featureList)
    val shippingConfigResponse = taxAndFeeClient.getShippingConfig()
    val freeShippingLookup = freeShippingZipProvider.getFreeShippingMap().block()!!

    val tempImport = vehicleDao.createTempImport()

    val tempImportWork = mono {
        val csvSemaphore = Semaphore(permits = 5)  // Max 5 concurrent batches
        var recordCount = 0

        fileStorage.createImportFileWrapper(jobDetails.filePath!!).use { importFileWrapper ->
            val rows = csvToExtractedRowConverter.parseToRows(
                importFileWrapper.downloadAndGetReader()
            )

            rows
                .map { row ->
                    extractedRowToVehicleConverter.convertToVehicle(
                        tsvCar = row,
                        job = jobDetails,
                        categoriesFeaturesInfo = categoryFeaturesInfo,
                        shippingConfig = shippingConfigResponse,
                        freeZoneZipProvider = { dealershipId ->
                            freeShippingLookup[dealershipId] ?: listOf()
                        }
                    )
                }
                .chunked(500)  // Batch size: 500 vehicles
                .map { chunk ->
                    async {
                        csvSemaphore.withPermit {
                            tempImport.addVehicles(chunk).collectList()
                                .doOnNext {
                                    recordCount += it.size
                                    log.info("Added batch of \${it.size}, total $recordCount")
                                }
                                .awaitFirst()
                        }
                    }
                }
                .awaitAll()

            log.info("Completed uploading $recordCount vehicles to temp collection.")
        }
    }
    // ... continues with safety checks, deltas, merge
}`}
          language="kotlin"
          filename="CronEdsVehicleImporter.kt"
        />

        <div style={gridTwo}>
          <Card title="Concurrency Model" variant="purple">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li><strong>Batch size:</strong> 500 vehicles per chunk</li>
              <li><strong>Semaphore permits:</strong> 5 concurrent batches</li>
              <li><strong>Max in-flight:</strong> 2,500 documents</li>
              <li>Uses <code>kotlinx.coroutines.async</code> + <code>awaitAll()</code></li>
            </ul>
          </Card>
          <Card title="Error Handling" variant="orange">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li><strong>Duplicate VINs</strong> (mongo error 11000): INVALID_DOCUMENT status</li>
              <li><strong>Bulk write errors</strong>: FAILED status</li>
              <li><strong>CSV parse errors</strong>: INVALID_DOCUMENT status</li>
              <li>All errors are HIGH severity JobExceptions</li>
            </ul>
          </Card>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  SAFETY CHECK                                                 */}
      {/* ============================================================ */}
      <motion.section id="safety-check" style={section} {...fadeUp}>
        <SectionHeader
          label="Stage 4"
          title="Safety Check (15K Threshold)"
          description="CronDeleteCheck prevents accidental wholesale deletion from incomplete or corrupt EDS files."
        />
        <p style={prose}>
          After the temp collection is fully populated, the safety check compares the number of
          active vehicles in the temp collection against the number of searchable vehicles in the
          live <code>vehicleV3</code> collection. If the delta (live minus incoming) is greater than
          or equal to 15,000, the import is aborted with <code>SUSPICIOUS_FILE</code> status.
        </p>

        <CodeBlock
          code={`// CronDeleteCheck.kt - Safety threshold validation
@Component
class CronDeleteCheck(cronConfig: CronConfig) {
    val suspiciousThreshold = cronConfig.suspiciousDeltaThreshold // 15,000

    fun checkForLargeDelete(
        tempImport: VehicleDao.TempImport,
        vehicleDao: VehicleDao
    ): Mono<Void> {
        val tempImportCounts = tempImport.getCounts()
            .map { it.numActive.toLong() }
            .switchIfEmpty(Mono.just(0L))
            .retryWhen(Retry.backoff(5, Duration.ofMillis(500)))

        val liveInventoryCounts = vehicleDao
            .getCountOfSearchableVehicles()
            .switchIfEmpty(Mono.just(0L))
            .retryWhen(Retry.backoff(5, Duration.ofMillis(500)))

        return Mono.zip(tempImportCounts, liveInventoryCounts)
            .flatMap<Void> { (tempCount, liveCount) ->
                val delta = liveCount - tempCount
                log.info("Inventory delta, live:$liveCount minus incoming:$tempCount = delta:$delta")

                if (delta >= suspiciousThreshold) {
                    throw DeleteCheckFailureException(
                        "Delta is greater than '$suspiciousThreshold' " +
                        "($liveCount - $tempCount = $delta)"
                    )
                }
                Mono.empty()
            }
    }
}`}
          language="kotlin"
          filename="CronDeleteCheck.kt"
        />

        <Callout type="danger" title="Why 15,000?">
          A delta of 15,000+ vehicles typically indicates a truncated or corrupt EDS file rather
          than legitimate inventory changes. When triggered, the file is marked as{' '}
          <code>SKIPPED</code> in Azure Blob metadata so it will not be retried.
        </Callout>
      </motion.section>

      {/* ============================================================ */}
      {/*  DELTA COMPUTATION                                            */}
      {/* ============================================================ */}
      <motion.section id="delta-computation" style={section} {...fadeUp}>
        <SectionHeader
          label="Stage 5"
          title="Delta Computation (ADD / UPDATE / DELETE)"
          description="Inventory deltas are computed using set operations on VINs between temp and live collections."
        />
        <p style={prose}>
          The delta computation loads all VINs from both the temp and live collections, then uses
          Kotlin set operations to determine which vehicles were added, deleted, or updated. UPDATE
          deltas are only generated when <strong>price</strong> or <strong>mileage</strong> has
          changed. Overlapping VINs are processed in batches of 500 with a <code>Semaphore(10)</code>.
        </p>

        <CodeBlock
          code={`// MongoVehicleDaoImpl.kt - Delta computation via set operations
override suspend fun getInventoryDeltas(): List<InventoryDelta> {
    val incomingVins = getVins(tempCollection)
    val existingVins = getVins(mongoCollection)

    // ADD: VINs in incoming but not in existing
    val adds = oneSidedDelta(
        incomingVins - existingVins, tempCollection, InventoryDeltaAction.ADD
    )

    // DELETE: VINs in existing but not in incoming
    val deletes = oneSidedDelta(
        existingVins - incomingVins, mongoCollection, InventoryDeltaAction.DELETE
    )

    // UPDATE: VINs in both, but with price or mileage changes
    val overlappingVins = incomingVins intersect existingVins
    val updates = coroutineScope {
        val deltaSemaphore = Semaphore(permits = 10)
        overlappingVins.chunked(500).map { vins ->
            async {
                deltaSemaphore.withPermit {
                    vins.mapNotNull { vin ->
                        val incoming = tempCollection.find(Vehicle::vin eq vin).awaitFirst()
                        val existing = mongoCollection.find(Vehicle::vin eq vin).awaitFirst()
                        when {
                            incoming.price != existing.price -> incoming.toDelta(UPDATE)
                            incoming.mileage != existing.mileage -> incoming.toDelta(UPDATE)
                            else -> null  // No meaningful change
                        }
                    }
                }
            }
        }.awaitAll().flatten()
    }

    return adds + deletes + updates
}`}
          language="kotlin"
          filename="MongoVehicleDaoImpl.kt"
        />

        <MermaidViewer
          title="Delta Computation Flow"
          tabs={[{ label: 'Set Operations', source: deltaComputationDiagram }]}
        />

        <Callout type="info" title="Delta Publishing">
          Deltas are published to <code>inventory-delta-topic</code> on Azure Service Bus in
          batches of 100 messages. Publishing can be disabled via config (
          <code>vehicleReaderConfig.eds.enableTopicPublishing</code>).
        </Callout>
      </motion.section>

      {/* ============================================================ */}
      {/*  MERGE PROCESS                                                */}
      {/* ============================================================ */}
      <motion.section id="merge-process" style={section} {...fadeUp}>
        <SectionHeader
          label="Stage 6"
          title="Merge to Live Collection"
          description="Staged execution merges temp vehicles into vehicleV3 with field preservation and mark-and-sweep."
        />
        <p style={prose}>
          The merge reads every vehicle from the temp collection, pairs it with the existing
          record (if any), combines them with field preservation, and upserts the result. It uses{' '}
          <code>limitRate(100)</code> for backpressure and <code>Retry.backoff(5, 5s)</code> for
          resilience. After the merge, <code>markAndSweep</code> marks vehicles not in the
          latest import as <code>DELETED</code>.
        </p>

        <CodeBlock
          code={`// MongoVehicleDaoImpl.kt - Merge with backpressure and retry
override fun mergeToVehicles(): Mono<Void> {
    var merged = 0
    return tempCollection.find()
        .sort(Document(Vehicle::vin.path(), 1))
        .toFlux()
        .limitRate(100)  // Backpressure: 100 records at a time
        .transform { recordsFlux ->
            recordPairOperations.matchRecordsFor(recordsFlux) { getByVin(it.vin) }
        }
        .transform(recordPairOperations::combineRecords)  // Field preservation
        .flatMap(::upsertVehicle)
        .retryWhen(Retry.backoff(5, Duration.ofSeconds(5)))
        .doOnNext {
            merged++
            if (merged % 500 == 0) log.info("Merged 500 vehicles. Total: $merged")
        }
        .doOnComplete { log.info("Merge completed with total of $merged vehicles") }
        .then()
}`}
          language="kotlin"
          filename="MongoVehicleDaoImpl.kt"
        />

        <div style={{ marginTop: '1rem' }}>
          <CodeBlock
            code={`// CronEdsVehicleImporter.kt - Mark and Sweep
fun markAndSweep(jobDetails: InventoryJobDetails): Mono<InventoryJobDetails> {
    return Mono.defer { vehicleDao.markMissingRowsDeleted(jobDetails) }
        .map { it.modifiedCount }
        .switchIfEmpty(Mono.just(0))
        .map { modifiedCount ->
            log.info("Completed mark and sweep of \${modifiedCount.toInt()} records")
            jobDetails.copy(counts = jobDetails.counts?.plus(
                InventoryJobCounts(numDeleted = modifiedCount.toInt())
            ))
        }
}`}
            language="kotlin"
            filename="CronEdsVehicleImporter.kt"
          />
        </div>

        <CodeBlock
          code={`// CronEdsVehicleImporter.kt - Staged execution chain
return tempImportWork
    .then(safetyChecks)
    .then(publishDeltasWork)
    .then(mergeVehiclesToLiveCollection)
    .then(getTempImportCountsWork)
    .flatMap { mono {
        withTimeout(5.minutes) {
            tempImport.getClosingWork().awaitSingleOrNull()  // Drop temp collection
        }
        it
    }}`}
          language="kotlin"
          filename="CronEdsVehicleImporter.kt"
        />
      </motion.section>

      {/* ============================================================ */}
      {/*  FIELD PRESERVATION                                           */}
      {/* ============================================================ */}
      <motion.section id="field-preservation" style={section} {...fadeUp}>
        <SectionHeader
          label="Critical"
          title="Field Preservation Rules"
          description="During the merge, four fields are preserved from existing documents because they are managed by separate services."
        />
        <p style={prose}>
          The <code>RecordPairOperations.combineRecords()</code> function is the heart of field
          preservation. For each incoming vehicle, it looks up the existing record by VIN. If an
          existing record is found, four fields are preserved while everything else is
          overwritten with the new import data.
        </p>

        <CodeBlock
          code={`// RecordPairOperations.kt - Field preservation during merge
fun combineRecords(
    recordPairs: Flux<Tuple2<Vehicle, Optional<Vehicle>>>
): Flux<Vehicle> =
    recordPairs.map { (incoming, existingOpt) ->
        when {
            // No existing record → use incoming as-is
            existingOpt.isEmpty -> incoming
            // Existing record found → preserve 4 fields
            else -> {
                val existing = existingOpt.get()
                incoming.copy(
                    availability = incoming.availability?.copy(
                        purchasePending = existing.availability?.purchasePending ?: false
                    ),
                    manuallySuppressed = existing.manuallySuppressed,
                    leasing = existing.leasing,
                    image = incoming.image?.copy(
                        spinUrl = existing.image?.spinUrl
                    ) ?: existing.image
                )
            }
        }
    }`}
          language="kotlin"
          filename="RecordPairOperations.kt"
        />

        <div style={{ marginTop: '1.5rem' }}>
          <DataTable
            headers={['Field', 'Source', 'Managed By', 'Reason']}
            rows={[
              ['availability.purchasePending', 'Existing', 'Availability subscriber (Service Bus)', 'Cart status from cart-status-update-topic'],
              ['manuallySuppressed', 'Existing', 'Routes module (REST API)', 'Manual suppression via updateManualSuppressions mutation'],
              ['leasing (entire object)', 'Existing', 'Consumer module (Service Bus)', 'Leasing data from leasing-incentives-topic'],
              ['image.spinUrl', 'Existing', 'Impel notifications (REST)', '360-degree spin URL from POST /impel/spin-notification'],
              ['All other fields (~40+)', 'New import', 'EDS Import', 'Overwritten with latest EDS data every 30 minutes'],
            ]}
            highlightColumn={1}
          />
        </div>

        <Callout type="warning" title="Why These Fields Are Protected">
          If they were overwritten during the merge, leasing prices would vanish, cart holds would
          be lost, manual suppressions would be undone, and 360-degree spin URLs would disappear
          every 30 minutes when the next import runs.
        </Callout>
      </motion.section>

      {/* ============================================================ */}
      {/*  SEARCH SUGGESTIONS                                           */}
      {/* ============================================================ */}
      <motion.section id="search-suggestions" style={section} {...fadeUp}>
        <SectionHeader
          label="Post-Import"
          title="Search Suggestions Update"
          description="CronSearchSuggestions updates the autocomplete suggestions collection after each import."
        />

        <CodeBlock
          code={`// CronSearchSuggestions.kt - Suggestion update flow
suspend fun updateSearchSuggestions(jobDetails: InventoryJobDetails): InventoryJobDetails {
    val existingSuggestions = searchSuggestionDao.getAllSuggestions()
    val incomingSuggestionValues = vehicleDao.getUniqueMakeModels().collectList().awaitSingle()

    // Regenerate: new suggestions + updated suggestions (with current jobId)
    searchSuggestionDao.updateSuggestions(
        regenerateSearchSuggestions(existingSuggestions, incomingSuggestionValues, jobDetails)
    )

    // Prune stale suggestions not seen in this job
    val deleteResult = searchSuggestionDao.deleteStaleSuggestions(jobDetails)
    log.info("Deleted \${deleteResult?.deletedCount} stale search suggestions")
    return jobDetails
}

private fun regenerateSearchSuggestions(...): List<SearchSuggestion> {
    val existingSuggestionValues = existingSuggestions.map { it.value }
    val newSuggestions = incomingSuggestionValues
        .filter { !existingSuggestionValues.contains(it) }
        .map { SearchSuggestion(value = it, lastSeenJobId = jobDetails.runId) }
    val updatedSuggestions = existingSuggestions
        .filter { incomingSuggestionValues.contains(it.value) }
        .map { it.copy(lastSeenJobId = jobDetails.runId) }
    return newSuggestions + updatedSuggestions
}`}
          language="kotlin"
          filename="CronSearchSuggestions.kt"
        />
      </motion.section>

      {/* ============================================================ */}
      {/*  LEASE EXPIRY                                                 */}
      {/* ============================================================ */}
      <motion.section id="lease-expiry" style={section} {...fadeUp}>
        <SectionHeader
          label="Post-Import"
          title="Lease Expiry Processing"
          description="CronLeasing.applyLeaseExpiries() removes expired regional leasing prices after each import."
        />

        <CodeBlock
          code={`// CronLeasing.kt - Lease expiry processing
fun applyLeaseExpiries(): Mono<Long> =
    vehicleDao.getLeasableVehicles()
        .buffer(100)
        .flatMapIterable { it }
        .transformDeferred { transformLeasingFlow(it, Instant.now()) }
        .buffer(100)
        .doOnNext { log.info("Upserting batch of \${it.size} vehicles with stale leasing...") }
        .flatMap { updatedVehicles -> vehicleDao.upsertVehicles(updatedVehicles) }
        .count()

private fun transformLeasingFlow(vehicleFlux: Flux<Vehicle>, now: Instant): Flux<Vehicle> =
    vehicleFlux
        .filter { vehicle ->
            vehicle.leasing?.regionalPrices?.any {
                politeInstantParse { Instant.parse(it.expiresOn).isBefore(now) }
            } ?: false
        }
        .map { vehicle ->
            val onlyActivePrograms = vehicle.leasing?.regionalPrices?.filter { entry ->
                politeInstantParse { Instant.parse(entry.expiresOn).isAfter(now) }
            }
            val canLease = !onlyActivePrograms.isNullOrEmpty()
            val defaultPrice = onlyActivePrograms
                ?.firstOrNull { it.regionId == RegionData.defaultRegionId }?.amountInCents
            vehicle.copy(leasing = vehicle.leasing?.copy(
                canLease = canLease, defaultPrice = defaultPrice,
                regionalPrices = onlyActivePrograms
            ))
        }`}
          language="kotlin"
          filename="CronLeasing.kt"
        />
      </motion.section>

      {/* ============================================================ */}
      {/*  KEY TAKEAWAYS                                                */}
      {/* ============================================================ */}
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
            <li>
              The EDS import is a 9-stage reactive pipeline orchestrated by{' '}
              <code>EdsVehicleReaderV2</code>, running every 30 minutes with the{' '}
              <code>isStillRunning</code> infix function guarding each stage transition.
            </li>
            <li>
              Data flows through three transformation layers:{' '}
              <code>AzureEdsFileStorage</code> (GZIP download) &rarr;{' '}
              <code>CsvToExtractedRowConverter</code> (76-column TSV parsing via reflection) &rarr;{' '}
              <code>ExtractedRowToVehicleConverter</code> (business rules + Vehicle creation).
            </li>
            <li>
              <code>meetsBusinessRequirements()</code> determines ACTIVE vs INACTIVE based on six
              rules: valid shipping region, non-zero price, valid year/make/model, sufficient
              photos, and correct Driveway CDN image URL prefix.
            </li>
            <li>
              Batch import uses <code>Semaphore(5)</code> with chunks of 500 vehicles. Duplicate
              VINs (mongo error 11000) trigger <code>INVALID_DOCUMENT</code> status.
            </li>
            <li>
              The 15,000-vehicle safety check in <code>CronDeleteCheck</code> prevents wholesale
              deletion from corrupt or truncated EDS files.
            </li>
            <li>
              Delta computation uses set operations: <code>incoming - existing</code> for ADDs,{' '}
              <code>existing - incoming</code> for DELETEs, and price/mileage comparison on the
              intersection for UPDATEs. Deltas are published in batches of 100 to Service Bus.
            </li>
            <li>
              Four fields are preserved during merge via <code>RecordPairOperations</code>:{' '}
              <code>purchasePending</code>, <code>manuallySuppressed</code>, <code>leasing</code>,
              and <code>image.spinUrl</code>.
            </li>
            <li>
              Lease expiry processing filters out expired regional prices, and search suggestions
              are regenerated from unique make+model combinations.
            </li>
          </ul>
        </div>
      </motion.section>
    </div>
  );
}
