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
  { id: 'pipeline-architecture', label: 'Pipeline Architecture' },
  { id: 'graphql-entry', label: 'GraphQL Entry Points' },
  { id: 'compound-block', label: 'CompoundBlock Structure' },
  { id: 'base-filters', label: 'Base Filters' },
  { id: 'text-search', label: 'Text Search & Fuzzy' },
  { id: 'filter-builder', label: 'Filter Builder' },
  { id: 'aggregation-dsl', label: 'Aggregation DSL' },
  { id: 'score-weights', label: 'Score Weights' },
  { id: 'sort-types', label: 'Sort Type Resolution' },
  { id: 'shipping-calc', label: 'Shipping Calculation' },
  { id: 'leasing-filter', label: 'Leasing Filter' },
  { id: 'facets', label: 'Facet Aggregation' },
  { id: 'autocomplete', label: 'Autocomplete' },
  { id: 'takeaways', label: 'Key Takeaways' },
];

/* ------------------------------------------------------------------ */
/*  Mermaid Diagrams                                                   */
/* ------------------------------------------------------------------ */
const pipelineFlowDiagram = `graph TD
    A[GraphQL Query: search] --> B[PipelineBuilder]
    B --> C[SearchBuilder]
    B --> D[SearchOperatorBuilder]
    B --> E[TextBuilder]
    B --> F[FilterBuilder]
    B --> G[ShippingBuilder]
    B --> H[LeasingBuilder]

    C --> I["SearchBlock (index: shopSearch)"]
    D --> J[CompoundBlock]
    E --> K[TextBlock + FuzzyBlock]
    F --> L["RangeBlock, QueryStringBlock, EqualsBlock"]
    G --> M["AddFieldsBlock ($switch)"]
    H --> N["EmbeddedDocument + IntRangeBlock"]

    J --> O["$search stage"]
    K --> O
    L --> O
    M --> P["$addFields stage"]
    N --> P

    O --> Q["Pipeline stages → MongoDB aggregation"]
    P --> Q
    Q --> R[vehicleV3 collection via Atlas Search]`;

const compoundBlockDiagram = `graph TD
    A[CompoundBlock] --> B[must]
    A --> C[mustNot]
    A --> D[should]
    A --> E[filter]

    B --> F["TextBlock (text search)"]
    B --> G["QueryStringBlock (make/model)"]

    C --> H["EqualsBlock (manuallySuppressed=true)"]

    D --> I["NearBlock (geo proximity)"]
    D --> J["Free shipping boost"]

    E --> K["QueryStringBlock (status=ACTIVE)"]
    E --> L["RangeBlock (price, year, mileage)"]
    E --> M["EqualsBlock (vehicleCondition)"]`;

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
    'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(139,92,246,0.15) 0%, rgba(6,182,212,0.08) 40%, transparent 70%)',
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
  background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #10b981 100%)',
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
export default function SearchFlowDeepDivePage() {
  const { setSidebar, clearSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('Search Flow Deep Dive', tocItems);
    return () => clearSidebar();
  }, []);

  return (
    <div style={page}>
      {/* Hero */}
      <section style={heroSection}>
        <div style={heroGradientBg} />
        <div style={heroContent}>
          <motion.h1 style={heroTitle} {...fadeUp}>
            Search Flow Deep Dive
          </motion.h1>
          <motion.p style={heroSubtitle} {...fadeUp}>
            A comprehensive guide to how the Odyssey search module builds MongoDB Atlas Search
            aggregation pipelines &mdash; from GraphQL queries through the custom DSL, scoring
            engine, filters, shipping calculations, and leasing projections.
          </motion.p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PIPELINE ARCHITECTURE                                        */}
      {/* ============================================================ */}
      <motion.section id="pipeline-architecture" style={section} {...fadeUp}>
        <SectionHeader
          label="Architecture"
          title="Pipeline Architecture"
          description="Six specialized builders collaborate to construct a MongoDB aggregation pipeline that runs against the Atlas Search shopSearch index."
        />
        <p style={prose}>
          The search module uses a code-first GraphQL approach (Expedia&apos;s graphql-kotlin). When a
          <code>search()</code> query arrives, <code>PipelineBuilder</code> orchestrates six
          specialized builders to construct a MongoDB aggregation pipeline. The pipeline runs
          against the <code>shopSearch</code> Atlas Search index on the <code>vehicleV3</code>
          collection with 50+ mapped fields.
        </p>

        <MermaidViewer
          title="Search Pipeline Architecture"
          tabs={[{ label: 'Builder Flow', source: pipelineFlowDiagram }]}
        />

        <div style={gridTwo}>
          <Card title="Pipeline Builders" variant="purple">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li><strong>PipelineBuilder</strong> &mdash; Orchestrates all builders into a Pipeline&lt;Vehicle&gt;</li>
              <li><strong>SearchBuilder</strong> &mdash; Creates SearchBlock wrapping CompoundBlock</li>
              <li><strong>SearchOperatorBuilder</strong> &mdash; Assembles must/filter/should/mustNot clauses</li>
              <li><strong>TextBuilder</strong> &mdash; Free-text search with fuzzy matching</li>
              <li><strong>FilterBuilder</strong> &mdash; Price, year, mileage, color, body style, etc.</li>
              <li><strong>ShippingBuilder</strong> &mdash; Shipping fee calculation via $addFields</li>
              <li><strong>LeasingBuilder</strong> &mdash; Region-aware leasing filters and projections</li>
            </ul>
          </Card>
          <Card title="Key Files" variant="cyan">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li><code>search/builder/PipelineBuilder.kt</code></li>
              <li><code>search/builder/SearchBuilder.kt</code></li>
              <li><code>search/builder/SearchOperatorBuilder.kt</code></li>
              <li><code>search/builder/TextBuilder.kt</code></li>
              <li><code>search/builder/FilterBuilder.kt</code></li>
              <li><code>search/builder/ShippingBuilder.kt</code></li>
              <li><code>search/builder/LeasingBuilder.kt</code></li>
              <li><code>library/mongo/aggregation/</code> (DSL classes)</li>
            </ul>
          </Card>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  GRAPHQL ENTRY                                                */}
      {/* ============================================================ */}
      <motion.section id="graphql-entry" style={section} {...fadeUp}>
        <SectionHeader
          label="Entry Point"
          title="GraphQL Entry Points"
          description="The search module exposes queries via Expedia's graphql-kotlin-spring-server with code-first schema generation."
        />

        <CodeBlock
          code={`// SearchPageQueries.kt - GraphQL query entry points
@Component
class SearchPageQueries(
    val pipelineBuilder: PipelineBuilder,
    val searchAggregationDao: MongoAggregationDao
) : Query {

    suspend fun search(
        commonInputs: VehicleCommonInputs?,
        paginationInput: PaginationInput?,
        sortCriteria: SortCriteria?,
        searchTerm: String?,
        scoreWeightVersionOverride: Int? = null,
        dataFetchingEnvironment: DataFetchingEnvironment
    ): SearchResult {
        val pipeline = pipelineBuilder.buildSearchPipeline(
            commonInputs = commonInputs,
            paginationInput = paginationInput,
            sortCriteria = sortCriteria,
            searchTerm = searchTerm,
            scoreWeightVersionOverride = scoreWeightVersionOverride,
            dataFetchingEnvironment = dataFetchingEnvironment
        )
        return searchAggregationDao.runAggregation(pipeline)
    }

    suspend fun getFacets(commonInputs: VehicleCommonInputs?, searchTerm: String?): FacetResult
    suspend fun getSearchSuggestions(searchTerm: String): List<SearchSuggestion>
    suspend fun getVehicleByVin(vin: String): Vehicle?
    suspend fun getVehicleById(vehicleId: String): Vehicle?
}`}
          language="kotlin"
          filename="SearchPageQueries.kt"
        />

        <DataTable
          headers={['Query', 'Purpose', 'Index Used']}
          rows={[
            ['search()', 'Main SRP vehicle search with filters, sorting, pagination', 'shopSearch'],
            ['getFacets()', 'Aggregated filter counts for sidebar (body style, color, price, etc.)', 'shopSearch'],
            ['getSearchSuggestions()', 'Autocomplete dropdown suggestions', 'shopSuggestions'],
            ['getVehicleByVin()', 'Single vehicle lookup by VIN', 'Standard index'],
            ['getVehicleById()', 'Single vehicle lookup by inventory ID', 'Standard index'],
            ['getVehiclesByVin()', 'Batch vehicle lookup by VIN list', 'Standard index'],
          ]}
          highlightColumn={0}
        />
      </motion.section>

      {/* ============================================================ */}
      {/*  COMPOUND BLOCK                                               */}
      {/* ============================================================ */}
      <motion.section id="compound-block" style={section} {...fadeUp}>
        <SectionHeader
          label="Core"
          title="CompoundBlock: The Heart of Search"
          description="Every search query is built as a CompoundBlock with must, mustNot, should, and filter clauses."
        />
        <p style={prose}>
          The <code>CompoundBlock</code> is the central operator in every search query. It maps
          directly to MongoDB Atlas Search&apos;s <code>compound</code> operator. The four clause
          types control how documents are matched and scored.
        </p>

        <MermaidViewer
          title="CompoundBlock Structure"
          tabs={[{ label: 'Clause Types', source: compoundBlockDiagram }]}
        />

        <CodeBlock
          code={`// CompoundBlock.kt - Core search operator
data class CompoundBlock(
    val must: List<SearchOperatorBlock>? = null,      // ALL must match, affects score
    val mustNot: List<SearchOperatorBlock>? = null,    // NONE must match
    val should: List<SearchOperatorBlock>? = null,     // At least one should match, boosts score
    val filter: List<SearchOperatorBlock>? = null,     // ALL must match, does NOT affect score
    override val scoreBlock: ScoreBlock? = null
) : SearchOperatorBlock(scoreBlock) {

    override fun toMongoDocument(): Document {
        val compound = Document()
        must?.let { compound.append("must", it.map { b -> b.toMongoDocument() }) }
        mustNot?.let { compound.append("mustNot", it.map { b -> b.toMongoDocument() }) }
        should?.let { compound.append("should", it.map { b -> b.toMongoDocument() }) }
        filter?.let { compound.append("filter", it.map { b -> b.toMongoDocument() }) }
        return Document("compound", compound).withScoreBlock(scoreBlock)
    }
}`}
          language="kotlin"
          filename="CompoundBlock.kt"
        />

        <div style={gridTwo}>
          <Card title="must (Affects Score)" variant="green">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Documents <strong>must</strong> match all clauses. Each matching clause contributes to
              the document&apos;s relevance score. Used for text search terms where relevance matters.
            </p>
          </Card>
          <Card title="filter (No Score Impact)" variant="blue">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Documents <strong>must</strong> match all clauses, but matching does NOT affect the
              score. Used for exact filters like <code>status=ACTIVE</code>, price ranges, and
              vehicle condition.
            </p>
          </Card>
          <Card title="should (Score Boost)" variant="purple">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Documents that match get a <strong>score boost</strong>, but matching is not required.
              Used for boosting vehicles with free shipping, photos, or favorable attributes.
            </p>
          </Card>
          <Card title="mustNot (Exclusion)" variant="orange">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Documents matching any clause are <strong>excluded</strong>. Used to filter out
              manually suppressed vehicles (<code>manuallySuppressed = true</code>).
            </p>
          </Card>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  BASE FILTERS                                                 */}
      {/* ============================================================ */}
      <motion.section id="base-filters" style={section} {...fadeUp}>
        <SectionHeader
          label="Non-negotiable"
          title="Base Filters"
          description="Every search query includes two mandatory filters: status=ACTIVE and manuallySuppressed=false."
        />

        <CodeBlock
          code={`// SearchOperatorBuilder.kt - Base filters applied to every query
private fun buildBaseFilters(): List<SearchOperatorBlock> = listOf(
    // Only show ACTIVE vehicles (not INACTIVE or DELETED)
    QueryStringBlock(
        path = Vehicle::status,
        query = InventoryStatus.ACTIVE.name
    ),
)

private fun buildBaseMustNot(): List<SearchOperatorBlock> = listOf(
    // Exclude manually suppressed vehicles
    EqualsBlock(
        path = Vehicle::manuallySuppressed,
        value = true
    )
)

// These are always the first entries in the CompoundBlock:
CompoundBlock(
    filter = buildBaseFilters() + userFilters,  // status=ACTIVE first
    mustNot = buildBaseMustNot(),               // suppress=true excluded
    must = textSearchBlocks,
    should = boostBlocks
)`}
          language="kotlin"
          filename="SearchOperatorBuilder.kt"
        />

        <Callout type="warning" title="Always Active">
          These base filters cannot be overridden by user input. Every query &mdash; search,
          facets, vehicle lookup &mdash; includes <code>status = ACTIVE</code> and
          <code>manuallySuppressed != true</code> to ensure only merchandisable inventory
          is returned.
        </Callout>
      </motion.section>

      {/* ============================================================ */}
      {/*  TEXT SEARCH                                                   */}
      {/* ============================================================ */}
      <motion.section id="text-search" style={section} {...fadeUp}>
        <SectionHeader
          label="Text"
          title="Text Search & Fuzzy Matching"
          description="TextBuilder creates fuzzy text search blocks across multiple vehicle fields with configurable weights."
        />
        <p style={prose}>
          When the user types a search term (e.g., &ldquo;Toyota Camry&rdquo;), <code>TextBuilder</code>
          creates <code>TextBlock</code> operators for each searchable field configured in{' '}
          <code>SearchConfig</code>. Each field gets a different weight from{' '}
          <code>SearchScoreWeights.textSearchWeights</code>, and fuzzy matching provides typo tolerance.
        </p>

        <CodeBlock
          code={`// TextBuilder.kt - Fuzzy text search across multiple fields
fun buildTextBlocks(
    searchTerm: String,
    textSearchWeights: Map<String, Double>
): List<TextBlock> {
    val fuzzy = TextBlock.FuzzyConfig(
        maxEdits = 1,          // Allow 1 character error (typo tolerance)
        prefixLength = 0,      // No required prefix match
        maxExpansions = 50     // Max terms to expand to
    )

    return searchConfig.textOperators.map { fieldName ->
        val weight = textSearchWeights[fieldName] ?: 1.0
        TextBlock(
            query = searchTerm,
            path = fieldName,        // e.g., "ymmt.make", "ymmt.model", "vin", "bodyStyle"
            fuzzy = fuzzy,
            scoreBlock = BoostScoreBlock(value = weight)  // Per-field weight
        )
    }
}

// SearchConfig.kt - Searchable fields
@Configuration
class SearchConfig {
    val searchIndexName = "shopSearch"
    val suggestionIndexName = "shopSuggestions"
    val textOperators = listOf("ymmt.make", "ymmt.model", "vin", "bodyStyle")
}`}
          language="kotlin"
          filename="TextBuilder.kt"
        />

        <CodeBlock
          code={`// TextBlock.kt - Atlas Search text operator
data class TextBlock(
    val query: String,
    override val path: String,
    val fuzzy: FuzzyConfig? = null,
    override val scoreBlock: ScoreBlock? = null
) : PathedSearchOperatorBlock(path, scoreBlock) {

    data class FuzzyConfig(
        val maxEdits: Int = 1,
        val prefixLength: Int = 0,
        val maxExpansions: Int = 50
    )

    override fun toMongoDocument(): Document =
        Document("text", Document()
            .append("path", path)
            .append("query", query)
            .also { doc ->
                fuzzy?.let { f ->
                    doc.append("fuzzy", Document()
                        .append("maxEdits", f.maxEdits)
                        .append("prefixLength", f.prefixLength)
                        .append("maxExpansions", f.maxExpansions))
                }
            }
            .withScoreBlock(scoreBlock))
}`}
          language="kotlin"
          filename="TextBlock.kt"
        />
      </motion.section>

      {/* ============================================================ */}
      {/*  FILTER BUILDER                                               */}
      {/* ============================================================ */}
      <motion.section id="filter-builder" style={section} {...fadeUp}>
        <SectionHeader
          label="Filters"
          title="Filter Builder"
          description="FilterBuilder converts GraphQL filter inputs into Atlas Search operators for the filter clause."
        />

        <CodeBlock
          code={`// FilterBuilder.kt - Converts GraphQL Filters → SearchOperatorBlocks
@Component
class FilterBuilder {

    fun buildFilterBlocks(filters: Filters?): List<SearchOperatorBlock> {
        if (filters == null) return emptyList()

        return listOfNotNull(
            // Vehicle condition: NEW, USED, CPO
            filters.vehicleConditions?.let { conditions ->
                QueryStringBlock(
                    path = Vehicle::vehicleCondition,
                    query = conditions.joinToString(" OR ") { it.name }
                )
            },

            // Price range
            filters.priceRange?.toRangeBlock(Vehicle::price),

            // Year range
            filters.yearRange?.toRangeBlock(Vehicle::ymmt / Ymmt::year),

            // Mileage range
            filters.mileageRange?.toRangeBlock(Vehicle::mileage),

            // Body styles
            filters.bodyStyles?.let { styles ->
                QueryStringBlock(
                    path = Vehicle::bodyStyle,
                    query = styles.joinToString(" OR ")
                )
            },

            // Exterior colors
            filters.exteriorColors?.let { colors ->
                QueryStringBlock(
                    path = Vehicle::exteriorColor / Color::name,
                    query = colors.joinToString(" OR ")
                )
            },

            // Make-Model-Trim combinations
            filters.makeModelTrims?.let { buildMakeModelTrimFilter(it) },

            // Fuel types, drive types, transmission, doors, etc.
            // ... additional filter blocks
        )
    }
}`}
          language="kotlin"
          filename="FilterBuilder.kt"
        />

        <DataTable
          headers={['Filter', 'Operator', 'Field Path', 'Example']}
          rows={[
            ['vehicleConditions', 'QueryStringBlock', 'vehicleCondition', '"NEW OR CPO"'],
            ['priceRange', 'RangeBlock', 'price', 'gte: 10000, lte: 50000'],
            ['yearRange', 'RangeBlock', 'ymmt.year', 'gte: 2020, lte: 2025'],
            ['mileageRange', 'RangeBlock', 'mileage', 'gte: 0, lte: 50000'],
            ['bodyStyles', 'QueryStringBlock', 'bodyStyle', '"SUV OR Sedan OR Truck"'],
            ['exteriorColors', 'QueryStringBlock', 'exteriorColor.name', '"Black OR White"'],
            ['makeModelTrims', 'CompoundBlock (nested)', 'ymmt.make, ymmt.model', 'Toyota Camry'],
            ['fuelTypes', 'QueryStringBlock', 'fuel', '"Gasoline OR Electric"'],
            ['driveTypes', 'QueryStringBlock', 'driveType', '"AWD OR FWD"'],
          ]}
          highlightColumn={1}
        />
      </motion.section>

      {/* ============================================================ */}
      {/*  AGGREGATION DSL                                              */}
      {/* ============================================================ */}
      <motion.section id="aggregation-dsl" style={section} {...fadeUp}>
        <SectionHeader
          label="DSL"
          title="Custom Aggregation DSL"
          description="Type-safe Kotlin classes that serialize to MongoDB BSON documents. All operators extend the abstract Block class."
        />

        <CodeBlock
          code={`// Pipeline.kt - Type-safe pipeline builder
class Pipeline<T> {
    private val stages = mutableListOf<Block>()

    fun addStage(block: Block): Pipeline<T> { stages.add(block); return this }

    fun toMongoQuery(): List<Bson> = stages.map { it.toMongoDocument() }
}

// Block.kt - Abstract base for all aggregation operators
abstract class Block {
    abstract fun toMongoDocument(): Document
}

// SearchBlock.kt - $search stage wrapper
data class SearchBlock(
    val index: String = "shopSearch",
    val operatorCollector: SearchOperatorBlock
) : Block() {
    override fun toMongoDocument(): Document =
        Document("\\$search", Document()
            .append("index", index)
            .append(/* operator type */, operatorCollector.toMongoDocument()))
}

// SearchBuilder.kt - Creates the $search stage
@Component
class SearchBuilder(val searchConfig: SearchConfig) {
    fun buildSearch(compoundBlock: CompoundBlock): SearchBlock =
        SearchBlock(
            index = searchConfig.searchIndexName,  // "shopSearch"
            operatorCollector = compoundBlock
        )
}`}
          language="kotlin"
          filename="Pipeline.kt / SearchBuilder.kt"
        />

        <DataTable
          headers={['DSL Class', 'Purpose', 'MongoDB Equivalent']}
          rows={[
            ['SearchBlock', 'Wraps the $search aggregation stage', '{ $search: { index, compound } }'],
            ['CompoundBlock', 'Boolean logic: must/mustNot/should/filter', '{ compound: { must, filter, ... } }'],
            ['TextBlock', 'Full-text search with optional fuzzy', '{ text: { query, path, fuzzy } }'],
            ['QueryStringBlock', 'Lucene query string syntax', '{ queryString: { query, defaultPath } }'],
            ['RangeBlock', 'Numeric/date range constraints', '{ range: { path, gte, lte } }'],
            ['EqualsBlock', 'Exact value match', '{ equals: { path, value } }'],
            ['ExistsBlock', 'Field existence check', '{ exists: { path } }'],
            ['NearBlock', 'Proximity scoring (geo, numeric)', '{ near: { path, origin, pivot } }'],
            ['AutocompleteBlock', 'Prefix matching for suggestions', '{ autocomplete: { query, path } }'],
            ['EmbeddedDocument', 'Search within nested arrays', '{ embeddedDocument: { path, operator } }'],
            ['AddFieldsBlock', 'Computed fields ($addFields)', '{ $addFields: { field: expression } }'],
            ['LimitBlock', 'Pagination limit', '{ $limit: N }'],
            ['SkipBlock', 'Pagination offset', '{ $skip: N }'],
          ]}
          highlightColumn={0}
        />
      </motion.section>

      {/* ============================================================ */}
      {/*  SCORE WEIGHTS                                                */}
      {/* ============================================================ */}
      <motion.section id="score-weights" style={section} {...fadeUp}>
        <SectionHeader
          label="Scoring"
          title="Versioned Score Weights"
          description="SearchScoreWeights are versioned configurations stored in MongoDB that control how vehicles are ranked per SortType."
        />
        <p style={prose}>
          Each <code>SortType</code> has a versioned <code>SearchScoreWeights</code> configuration
          stored in the <code>searchScoreWeights</code> collection. Only one version per SortType
          can be <code>enabled</code> at a time. The configuration defines per-field text search
          weights, static scoring factors, and dynamic placeholder templates.
        </p>

        <CodeBlock
          code={`// SearchScoreWeights.kt - Versioned scoring configuration
data class SearchScoreWeights(
    @BsonId val id: ObjectId? = null,
    val version: Int = 1,
    val description: String? = null,
    val createdTimestamp: Instant = Instant.now(),
    val enabled: Boolean = false,
    val sortType: SortType,

    // Per-field text search weights (e.g., "ymmt.make" → 10.0, "ymmt.model" → 8.0)
    val textSearchWeights: Map<String, Double>,

    // Scoring factors applied to the CompoundBlock
    val sortFactors: SortFactors
) {
    data class SortFactors(
        val staticFactors: List<SearchOperatorBlock> = listOf(),
        val placeholders: List<SearchBlockTemplate.Request> = listOf()
    )
}

enum class SortType {
    HIGH_PRICE_NEW_CAR, HIGH_PRICE_USED_CAR,
    LOW_PRICE_NEW_CAR, LOW_PRICE_USED_CAR,
    SHIPPING_FEE_LOWEST, INVENTORY_NEWEST,
    RECOMMENDED, LOWEST_MILEAGE,
    NEWEST_YEAR, OLDEST_YEAR,
    LEASING_LOWEST
}`}
          language="kotlin"
          filename="SearchScoreWeights.kt"
        />

        <div style={gridTwo}>
          <Card title="textSearchWeights" variant="green">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              A map of field path to weight multiplier. For example,{' '}
              <code>{`{ "ymmt.make": 10.0, "ymmt.model": 8.0, "vin": 15.0, "bodyStyle": 3.0 }`}</code>.
              These weights are applied as <code>BoostScoreBlock</code> values to each{' '}
              <code>TextBlock</code> in the search query.
            </p>
          </Card>
          <Card title="sortFactors" variant="purple">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Contains <strong>staticFactors</strong> (pre-configured SearchOperatorBlocks stored as
              JSON in MongoDB, deserialized via reflection) and <strong>placeholders</strong> (dynamic
              templates resolved at query time based on user context like postal code).
            </p>
          </Card>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <Callout type="info" title="Score Weight Management">
            Score weights are managed via REST endpoints in the routes module: GET/POST/DELETE at{' '}
            <code>/search/score-weights</code>. Product teams can create new versions, A/B test
            different scoring strategies, and enable the best-performing version.
          </Callout>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  SORT TYPE RESOLUTION                                         */}
      {/* ============================================================ */}
      <motion.section id="sort-types" style={section} {...fadeUp}>
        <SectionHeader
          label="Sorting"
          title="Sort Type Resolution"
          description="GraphQL SortCriteria is mapped to a SortType which determines which SearchScoreWeights to load."
        />

        <CodeBlock
          code={`// SearchOperatorBuilder.kt - SortCriteria → SortType mapping
private suspend fun getSearchScoreWeights(
    sortCriteria: SortCriteria?,
    filters: Filters?
): SearchScoreWeights {
    val sortType = when (sortCriteria) {
        SortCriteria.PRICE_LOWEST -> getNewOrUsedLowPriceSortType(filters)
        SortCriteria.PRICE_HIGHEST -> getNewOrUsedHighPriceSortType(filters)
        SortCriteria.SHIPPING_FEE_LOWEST -> SortType.SHIPPING_FEE_LOWEST
        SortCriteria.INVENTORY_NEWEST -> SortType.INVENTORY_NEWEST
        SortCriteria.RELEVANCE -> SortType.RECOMMENDED
        SortCriteria.MILEAGE_LOWEST -> SortType.LOWEST_MILEAGE
        SortCriteria.YEAR_NEWEST -> SortType.NEWEST_YEAR
        SortCriteria.YEAR_OLDEST -> SortType.OLDEST_YEAR
        SortCriteria.LEASING_LOWEST -> SortType.LEASING_LOWEST
        null -> SortType.RECOMMENDED
    }

    return searchScoreWeightsCache.getEnabled(sortType)
        ?: throw GraphQLException("No enabled sort for sortType: $sortType")
}

// Condition-aware resolution for price sorting
private fun getNewOrUsedLowPriceSortType(filters: Filters?): SortType =
    if (filters?.vehicleConditions?.contains(VehicleCondition.NEW) == true)
        SortType.LOW_PRICE_NEW_CAR
    else SortType.LOW_PRICE_USED_CAR`}
          language="kotlin"
          filename="SearchOperatorBuilder.kt"
        />

        <DataTable
          headers={['SortCriteria (GraphQL)', 'SortType (Used/CPO)', 'SortType (New)', 'Primary Factor']}
          rows={[
            ['RELEVANCE', 'RECOMMENDED', 'RECOMMENDED', 'Text match + boost factors'],
            ['PRICE_LOWEST', 'LOW_PRICE_USED_CAR', 'LOW_PRICE_NEW_CAR', 'price ASC'],
            ['PRICE_HIGHEST', 'HIGH_PRICE_USED_CAR', 'HIGH_PRICE_NEW_CAR', 'price DESC'],
            ['SHIPPING_FEE_LOWEST', 'SHIPPING_FEE_LOWEST', 'SHIPPING_FEE_LOWEST', 'shippingFee ASC'],
            ['LEASING_LOWEST', 'LEASING_LOWEST', 'LEASING_LOWEST', 'leasing.defaultPrice ASC'],
            ['MILEAGE_LOWEST', 'LOWEST_MILEAGE', 'LOWEST_MILEAGE', 'mileage ASC'],
            ['YEAR_NEWEST', 'NEWEST_YEAR', 'NEWEST_YEAR', 'year DESC'],
            ['YEAR_OLDEST', 'OLDEST_YEAR', 'OLDEST_YEAR', 'year ASC'],
            ['INVENTORY_NEWEST', 'INVENTORY_NEWEST', 'INVENTORY_NEWEST', 'inventoryDate DESC'],
          ]}
          highlightColumn={0}
        />

        <Callout type="info" title="Condition-Aware Sorting">
          Only <code>PRICE_LOWEST</code> and <code>PRICE_HIGHEST</code> are condition-aware,
          loading different weight configurations for NEW vs USED/CPO vehicles. All other sort
          types use a single configuration regardless of vehicle condition.
        </Callout>
      </motion.section>

      {/* ============================================================ */}
      {/*  SHIPPING CALCULATION                                         */}
      {/* ============================================================ */}
      <motion.section id="shipping-calc" style={section} {...fadeUp}>
        <SectionHeader
          label="Shipping"
          title="Shipping Fee Calculation"
          description="ShippingBuilder computes the shipping fee via $addFields with a $switch expression and provides scoring boosts."
        />

        <CodeBlock
          code={`// ShippingBuilder.kt - Shipping fee via $addFields with $switch
fun buildShippingBlock(userLocation: UserLocation?): Block? =
    userLocation?.run {
        AddFieldsBlock(
            Vehicle::shippingFee,
            SwitchBlock(
                // Branch 1: user's zip in dealer's free shipping zone → $0
                SwitchBlock.BranchBlock(
                    Document("\\$in", listOf(postalCode, dealerZoneZipsPath)),
                    then = 0L  // Free shipping
                ),
                // Default: state-based shipping matrix
                default = userStateMatrixPath  // e.g. "$dealer.stateShippingMap.OR"
            )
        )
    }

// Free shipping scoring boost
fun freeShippingBuilder(
    scoreBlock: ScoreBlock?,
    userLocation: UserLocation?
): SearchOperatorBlock? =
    userLocation?.postalCode?.takeIf { it.isNotBlank() }?.let { safePostalCode ->
        TextBlock(
            query = safePostalCode,
            path = Vehicle::dealer / Dealer::zoneZips,
            scoreBlock = scoreBlock  // Boost from SearchScoreWeights
        )
    }

// Base shipping lowest: boost vehicles with state shipping (but NOT free shipping)
fun baseShippingLowestBuilder(
    scoreBlock: ScoreBlock?,
    userLocation: UserLocation?
): SearchOperatorBlock? =
    if (state != null && postalCode != null) {
        CompoundBlock(
            must = listOf(ExistsBlock(path = "dealer.stateShippingMap.\${state}")),
            mustNot = listOf(TextBlock(query = postalCode, path = Vehicle::dealer / Dealer::zoneZips)),
            scoreBlock = scoreBlock
        )
    } else null`}
          language="kotlin"
          filename="ShippingBuilder.kt"
        />

        <div style={gridTwo}>
          <Card title="Free Shipping Check" variant="green">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Uses <code>$in</code> to check if the user&apos;s postal code exists in the
              dealer&apos;s <code>zoneZips</code> array. If found, <code>shippingFee = 0</code>.
            </p>
          </Card>
          <Card title="State-Based Fallback" variant="orange">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              If not in a free zone, the fee comes from{' '}
              <code>dealer.stateShippingMap.&lt;userState&gt;</code>, a map of state-to-state
              rates populated from the Tax & Fee API during EDS imports.
            </p>
          </Card>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  LEASING FILTER                                               */}
      {/* ============================================================ */}
      <motion.section id="leasing-filter" style={section} {...fadeUp}>
        <SectionHeader
          label="Leasing"
          title="Leasing Filter & Pricing"
          description="LeasingBuilder handles region-aware leasing filters, price projection, and LEASING_LOWEST scoring."
        />
        <p style={prose}>
          Leasing is region-dependent: each OEM defines pricing regions mapped to postal codes. The{' '}
          <code>PostalCodeOemRegionCache</code> resolves a user&apos;s postal code to a map of{' '}
          <code>make &rarr; regionId</code>. This enables per-make regional pricing using{' '}
          <code>EmbeddedDocument</code> operators within Atlas Search.
        </p>

        <CodeBlock
          code={`// LeasingBuilder.kt - Region-aware leasing filter
suspend fun buildLeasableFilter(
    postalCode: String?,
    selectedMakes: List<String>?,
    leaseRange: Range<Int>?
): CompoundBlock? {
    val makeRegions = postalCodeOemRegionCache.get(postalCode)?.makeRegions
    val regionalPricesPath = Vehicle::leasing / Leasing::regionalPrices

    return if (makeRegions != null) {
        CompoundBlock(
            should = makeRegions
                .filter { (make, _) -> selectedMakes.isNullOrEmpty() || selectedMakes.contains(make) }
                .mapNotNull { (make, regionId) ->
                    CompoundBlock(
                        filter = listOf(
                            QueryStringBlock(path = Vehicle::ymmt / Ymmt::make, query = make),
                            EmbeddedDocument(
                                path = regionalPricesPath,
                                operator = CompoundBlock(
                                    filter = listOfNotNull(
                                        IntRangeBlock(
                                            path = regionalPricesPath / RegionData::regionId,
                                            value = regionId
                                        ),
                                        leaseRange?.toRangeBlock(regionalPricesPath / RegionData::amountInCents)
                                    )
                                )
                            )
                        )
                    )
                }
        )
    } else null
}`}
          language="kotlin"
          filename="LeasingBuilder.kt"
        />

        <div style={gridTwo}>
          <Card title="Price Projection" variant="cyan">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Two <code>$addFields</code> stages: first, <code>$filter</code> the{' '}
              <code>regionalPrices</code> array to the user&apos;s region. Then, <code>$last</code>{' '}
              extracts <code>amountInCents</code> and sets it as <code>leasing.defaultPrice</code>.
            </p>
          </Card>
          <Card title="LEASING_LOWEST Scoring" variant="purple">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Uses <code>FunctionScoreBlock</code> + <code>PathBlock</code> to set the Atlas Search
              score to the regional price. <code>EmbeddedScoreBlock(aggregate = MAX)</code> selects
              the score.
            </p>
          </Card>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  FACETS                                                       */}
      {/* ============================================================ */}
      <motion.section id="facets" style={section} {...fadeUp}>
        <SectionHeader
          label="Facets"
          title="Facet Aggregation"
          description="getFacets() uses $searchMeta with facet definitions to return aggregated filter counts for the SRP sidebar."
        />

        <CodeBlock
          code={`// SearchMetaFacetBlock.kt - Facet aggregation
data class SearchMetaFacetBlock(val index: String, val facet: Facet) : Block() {
    override fun toMongoDocument(): Document =
        Document("\\$searchMeta", Document()
            .append("index", index)
            .append("facet", facet.toMongoDocument()))

    data class Facet(
        val operator: SearchOperatorBlock,
        val facetDefinitions: List<FacetDefinition>
    ) : Block()

    // String facet: body style, color, fuel type
    data class StringFacetDefinition(
        override val name: String,
        override val path: String,
        val numBuckets: Int
    ) : FacetDefinition(name, FacetType.STRING, path)

    // Number facet: price ranges
    data class NumberFacetDefinition<T : Number>(
        override val name: String,
        override val path: String,
        val boundaries: List<T>
    ) : FacetDefinition(name, FacetType.NUMBER, path)
}

// Example output:
// { "$searchMeta": { "index": "shopSearch", "facet": {
//     "operator": { /* same CompoundBlock, no scoring */ },
//     "facets": {
//       "bodyStyleFacet": { "type": "string", "path": "bodyStyle", "numBuckets": 20 },
//       "priceFacet": { "type": "number", "path": "price",
//                       "boundaries": [0, 10000, 20000, 30000, 50000, 75000, 100000] }
//     }
// }}}`}
          language="kotlin"
          filename="SearchMetaFacetBlock.kt"
        />

        <Callout type="info" title="Facet Operator Reuse">
          The facet operator uses the same <code>CompoundBlock</code> as the search query but{' '}
          <strong>without scoring</strong>. Text search blocks are moved to the <code>filter</code>{' '}
          clause instead of <code>must</code> since scoring is irrelevant for counting.
        </Callout>
      </motion.section>

      {/* ============================================================ */}
      {/*  AUTOCOMPLETE                                                 */}
      {/* ============================================================ */}
      <motion.section id="autocomplete" style={section} {...fadeUp}>
        <SectionHeader
          label="Autocomplete"
          title="Autocomplete Suggestions"
          description="getSearchSuggestions() powers the search dropdown using the shopSuggestions Atlas Search index."
        />

        <CodeBlock
          code={`// SearchSuggestionsBuilder.kt - Autocomplete pipeline
@Component
class SearchSuggestionsBuilder(
    val searchConfig: SearchConfig,
    val autocompleteBuilder: AutocompleteBuilder
) {
    suspend fun buildSearchSuggestions(searchTerm: String): SearchBlock =
        SearchBlock(
            index = searchConfig.suggestionIndexName,  // "shopSuggestions"
            operatorCollector = autocompleteBuilder.buildSuggestionAutocomplete(searchTerm)
        )
}

// AutocompleteBlock.kt - Atlas Search autocomplete operator
data class AutocompleteBlock(
    val query: String,
    override val path: String,
    override val scoreBlock: ScoreBlock?
) : PathedSearchOperatorBlock(path, scoreBlock) {
    override fun toMongoDocument(): Document =
        Document("autocomplete", Document()
            .append("path", path)
            .append("query", query)
            .withScoreBlock(scoreBlock))
}

// PipelineBuilder chains it with a limit:
suspend fun buildAutocompletePipeline(searchTerm: String): Pipeline<SearchSuggestion> =
    Pipeline<SearchSuggestion>()
        .addStage(searchSuggestionsBuilder.buildSearchSuggestions(searchTerm))
        .addStage(LimitBlock(4))  // Max 4 suggestions`}
          language="kotlin"
          filename="SearchSuggestionsBuilder.kt"
        />

        <div style={gridTwo}>
          <Card title="searchSuggestion Collection" variant="green">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Populated by the EDS import cron job from unique make+model combinations. Each
              document has a <code>value</code> field (e.g., &ldquo;Toyota Camry&rdquo;) indexed with
              autocomplete tokenization.
            </p>
          </Card>
          <Card title="shopSuggestions Index" variant="purple">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Atlas Search index with autocomplete mapping on <code>value</code>. Supports prefix
              matching so typing &ldquo;Toy&rdquo; returns &ldquo;Toyota Camry&rdquo;, &ldquo;Toyota
              Corolla&rdquo;, etc. Limited to 4 results.
            </p>
          </Card>
        </div>
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
              The search pipeline is assembled by <code>PipelineBuilder</code> which coordinates
              6 specialized builders: SearchBuilder, SearchOperatorBuilder, TextBuilder,
              FilterBuilder, ShippingBuilder, and LeasingBuilder.
            </li>
            <li>
              Every query includes non-negotiable base filters: <code>status = ACTIVE</code> and{' '}
              <code>manuallySuppressed = false</code>. These are always in the filter clause.
            </li>
            <li>
              The custom aggregation DSL provides type-safe Kotlin classes (TextBlock,
              QueryStringBlock, RangeBlock, CompoundBlock, etc.) that serialize to BSON via{' '}
              <code>toMongoDocument()</code>.
            </li>
            <li>
              Scoring is driven by versioned <code>SearchScoreWeights</code> stored in MongoDB.
              Weights are condition-aware (NEW vs USED/CPO) and include per-field text boosts and
              dynamic placeholder templates.
            </li>
            <li>
              Text search uses fuzzy matching with <code>maxEdits=1</code> for typo tolerance across
              searchable fields (make, model, VIN, bodyStyle).
            </li>
            <li>
              Shipping fee is calculated via <code>$addFields</code> with a <code>$switch</code>:
              free if the user&apos;s zip is in the dealer&apos;s <code>zoneZips</code>, otherwise
              the state-based rate from <code>stateShippingMap</code>.
            </li>
            <li>
              Leasing requires postal code to OEM region resolution. Uses{' '}
              <code>EmbeddedDocument</code> operators with <code>IntRangeBlock</code> for per-make
              regional pricing within Atlas Search.
            </li>
            <li>
              Facets reuse the same CompoundBlock as search but without scoring. Autocomplete uses
              the <code>shopSuggestions</code> index limited to 4 results.
            </li>
          </ul>
        </div>
      </motion.section>
    </div>
  );
}
