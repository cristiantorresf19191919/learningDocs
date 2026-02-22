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
import Tabs from '../components/shared/Tabs';

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
  { id: 'queries-list', label: 'Queries List' },
  { id: 'search-query', label: 'search() Deep-Dive' },
  { id: 'facets-query', label: 'getFacets()' },
  { id: 'suggestions-query', label: 'getSearchSuggestions()' },
  { id: 'vehicle-by-vin', label: 'getVehicleByVin()' },
  { id: 'vehicle-by-id', label: 'getVehicleById()' },
  { id: 'batch-queries', label: 'Batch Queries' },
  { id: 'availability-queries', label: 'Availability Queries' },
  { id: 'vehicle-result-dto', label: 'VehicleResult DTO' },
  { id: 'resolver-flow', label: 'Resolver Flow' },
  { id: 'example-srp-search', label: 'Example: SRP Search' },
  { id: 'example-vehicle-detail', label: 'Example: Vehicle Detail' },
  { id: 'error-handling', label: 'Error Handling' },
  { id: 'takeaways', label: 'Key Takeaways' },
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

const keyTakeaway: CSSProperties = {
  backgroundColor: 'rgba(59,130,246,0.06)',
  border: '1px solid rgba(59,130,246,0.2)',
  borderRadius: 12,
  padding: '1.25rem 1.5rem',
  marginTop: '1.5rem',
};

/* ------------------------------------------------------------------ */
/*  Mermaid diagram source strings                                     */
/* ------------------------------------------------------------------ */
const mermaidResolverFlow = `%%{init: {'theme': 'dark'}}%%
graph LR
    A["GraphQL Query"] --> B["Validation<br/>commonInputs.validate()"]
    B --> C["PipelineBuilder<br/>buildVehicleSearchPipeline()"]
    C --> D["SearchBuilder"]
    D --> E["FilterBuilder"]
    D --> F["TextBuilder"]
    D --> G["ScoreBuilder"]
    E --> H["MongoDB<br/>Atlas Search"]
    F --> H
    G --> H
    H --> I["Vehicle.toGql()"]
    I --> J["VehicleResult"]
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style B fill:#d29922,stroke:#e3b341,color:#000
    style C fill:#6e40c9,stroke:#bc8cff,color:#fff
    style D fill:#6e40c9,stroke:#bc8cff,color:#fff
    style E fill:#238636,stroke:#3fb950,color:#fff
    style F fill:#238636,stroke:#3fb950,color:#fff
    style G fill:#238636,stroke:#3fb950,color:#fff
    style H fill:#d29922,stroke:#e3b341,color:#000
    style I fill:#1f6feb,stroke:#58a6ff,color:#fff
    style J fill:#238636,stroke:#3fb950,color:#fff`;

const mermaidQueryOverview = `%%{init: {'theme': 'dark'}}%%
graph TB
    subgraph Client["Client Layer"]
        A["SRP Frontend"]
        B["VDP Frontend"]
        C["Cart Service"]
        D["Admin Tools"]
    end
    subgraph GraphQL["odyssey-search-graphql"]
        E["search()"]
        F["getFacets()"]
        G["getSearchSuggestions()"]
        H["getVehicleByVin()"]
        I["getVehicleById()"]
        J["getVehiclesById()"]
        K["getVehiclesByVin()"]
        L["checkAvailabilityOfVin()"]
        M["checkAvailabilityOfVehicleId()"]
    end
    subgraph Data["Data Layer"]
        N[("MongoDB Atlas<br/>vehicleV3")]
        O[("MongoDB Atlas<br/>searchSuggestion")]
    end
    A --> E
    A --> F
    A --> G
    B --> H
    B --> I
    C --> L
    C --> M
    D --> J
    D --> K
    E --> N
    F --> N
    G --> O
    H --> N
    I --> N
    J --> N
    K --> N
    L --> N
    M --> N
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style B fill:#1f6feb,stroke:#58a6ff,color:#fff
    style C fill:#6e40c9,stroke:#bc8cff,color:#fff
    style D fill:#d29922,stroke:#e3b341,color:#000
    style E fill:#238636,stroke:#3fb950,color:#fff
    style F fill:#238636,stroke:#3fb950,color:#fff
    style G fill:#238636,stroke:#3fb950,color:#fff
    style H fill:#238636,stroke:#3fb950,color:#fff
    style I fill:#238636,stroke:#3fb950,color:#fff
    style J fill:#238636,stroke:#3fb950,color:#fff
    style K fill:#238636,stroke:#3fb950,color:#fff
    style L fill:#da3633,stroke:#f85149,color:#fff
    style M fill:#da3633,stroke:#f85149,color:#fff
    style N fill:#d29922,stroke:#e3b341,color:#000
    style O fill:#d29922,stroke:#e3b341,color:#000`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function GraphqlExposurePage() {
  const { setSidebar, clearSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('GraphQL Exposure', tocItems);
    return () => clearSidebar();
  }, [setSidebar, clearSidebar]);

  return (
    <>
      {/* ============ HERO ============ */}
      <section style={heroSection}>
        <div style={heroGradientBg} />
        <motion.div style={heroContent} {...fadeUp}>
          <h1 style={heroTitle}>GraphQL Exposure Layer</h1>
          <p style={heroSubtitle}>
            Complete documentation of the odyssey-search-graphql module that exposes GraphQL queries
            for SRP search, faceted navigation, autocomplete suggestions, and vehicle detail lookups.
            Built with Expedia's graphql-kotlin-spring-server (v7.0.2).
          </p>
          <div style={statsRow}>
            {[
              { val: '11', label: 'Queries' },
              { val: '5', label: 'Facet Fields' },
              { val: '18', label: 'Validation Rules' },
              { val: '30+', label: 'DTO Fields' },
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
        <SectionHeader
          label="Introduction"
          title="Overview"
          description="How the odyssey-search-graphql module exposes vehicle inventory through GraphQL"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The <code style={{ color: c.accent }}>odyssey-search-graphql</code> module is the primary GraphQL
            gateway for all vehicle search and retrieval operations on Driveway.com. It exposes 11 GraphQL queries
            that power the Search Results Page (SRP), Vehicle Detail Page (VDP), autocomplete suggestions, cart
            availability checks, and admin batch lookups. The module is built on Expedia's{' '}
            <code style={{ color: c.accent }}>graphql-kotlin-spring-server</code> version 7.0.2, which
            automatically generates the GraphQL schema from Kotlin classes at startup.
          </p>
          <p style={para}>
            Every query follows a consistent pattern: validate inputs, build a MongoDB Atlas Search aggregation
            pipeline via the pipeline builder chain, execute against the <code style={{ color: c.accent }}>vehicleV3</code>{' '}
            collection (or <code style={{ color: c.accent }}>searchSuggestion</code> for autocomplete), and map
            domain objects to GraphQL DTOs through <code style={{ color: c.cyan }}>Vehicle.toGql()</code>.
          </p>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>SRP Search</div>
              <p style={infoCardText}>
                Full-text search with filters, sorting, pagination, and geo-distance scoring. Powers the main
                vehicle search experience with configurable relevancy weights.
              </p>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>Faceted Navigation</div>
              <p style={infoCardText}>
                Server-side facet counts for MAKE, MODEL, TRIM, CONDITION, and BODY_STYLE fields using
                MongoDB's <code style={{ color: c.cyan }}>$searchMeta</code> aggregation stage.
              </p>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent3 }}>Vehicle Lookups</div>
              <p style={infoCardText}>
                Single and batch vehicle retrieval by VIN or vehicleId. Used by VDP, cart, and admin
                tools for direct inventory access without full-text search overhead.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="GraphQL Query Architecture"
            tabs={[
              { label: 'Query Overview', source: mermaidQueryOverview },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="info" title="graphql-kotlin-spring-server v7.0.2">
            The schema is generated at startup by introspecting Kotlin data classes annotated with GraphQL
            directives. There is no hand-written <code>.graphqls</code> schema file. Every query class that
            implements <code>com.expediagroup.graphql.server.operations.Query</code> is automatically
            registered as a top-level query field.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 2: QUERIES LIST ============ */}
      <section id="queries-list" style={sectionSpacing}>
        <SectionHeader
          label="API Surface"
          title="Queries List"
          description="All 11 GraphQL queries exposed by the odyssey-search-graphql module"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The module exposes 11 top-level queries organized into four categories: search operations,
            single vehicle lookups, batch lookups, and availability checks. Each query is implemented as
            a Kotlin class with a <code style={{ color: c.accent }}>suspend</code> function that returns
            the appropriate DTO.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <DataTable
            headers={['Query', 'Input', 'Return Type', 'Category', 'Description']}
            rows={[
              [
                <code style={{ color: c.accent, fontWeight: 700 }}>search</code>,
                'commonInputs',
                <code style={{ color: c.accent2 }}>VehicleResults</code>,
                <Badge label="Search" color="blue" />,
                'Main SRP search with filters, sorting, and pagination',
              ],
              [
                <code style={{ color: c.accent, fontWeight: 700 }}>getFacets</code>,
                'facetFields, commonInputs',
                <code style={{ color: c.accent2 }}>FacetResults</code>,
                <Badge label="Search" color="blue" />,
                'Faceted navigation counts for filter sidebar',
              ],
              [
                <code style={{ color: c.accent, fontWeight: 700 }}>getSearchSuggestions</code>,
                'queryString',
                <code style={{ color: c.accent2 }}>VehicleSuggestionResults</code>,
                <Badge label="Search" color="blue" />,
                'Autocomplete suggestions for make+model combos',
              ],
              [
                <code style={{ color: c.accent3, fontWeight: 700 }}>getVehicleByVin</code>,
                'vin, userLocation',
                <code style={{ color: c.accent2 }}>VehicleResult</code>,
                <Badge label="Lookup" color="purple" />,
                'Single vehicle by VIN',
              ],
              [
                <code style={{ color: c.accent3, fontWeight: 700 }}>getVehicleById</code>,
                'id, userLocation',
                <code style={{ color: c.accent2 }}>VehicleResult</code>,
                <Badge label="Lookup" color="purple" />,
                'Single vehicle by vehicleId',
              ],
              [
                <code style={{ color: c.accent3, fontWeight: 700 }}>getVehiclesById</code>,
                'ids, userLocation',
                <code style={{ color: c.accent2 }}>List&lt;VehicleByIdResult&gt;</code>,
                <Badge label="Batch" color="cyan" />,
                'Batch lookup by multiple vehicleIds',
              ],
              [
                <code style={{ color: c.accent3, fontWeight: 700 }}>getVehiclesByVin</code>,
                'vins, userLocation',
                <code style={{ color: c.accent2 }}>List&lt;VehicleByIdResult&gt;</code>,
                <Badge label="Batch" color="cyan" />,
                'Batch lookup by multiple VINs',
              ],
              [
                <code style={{ color: c.red, fontWeight: 700 }}>checkAvailabilityOfVin</code>,
                'vin',
                <code style={{ color: c.accent2 }}>Boolean</code>,
                <Badge label="Availability" color="red" />,
                'Cart readiness check by VIN',
              ],
              [
                <code style={{ color: c.red, fontWeight: 700 }}>checkAvailabilityOfVehicleId</code>,
                'vehicleId',
                <code style={{ color: c.accent2 }}>Boolean</code>,
                <Badge label="Availability" color="red" />,
                'Cart readiness check by vehicleId',
              ],
              [
                <code style={{ color: c.orange, fontWeight: 700 }}>getManualSuppressions</code>,
                '(none)',
                <code style={{ color: c.accent2 }}>AvailabilityResult</code>,
                <Badge label="Admin" color="yellow" />,
                'List of VINs manually suppressed from active inventory',
              ],
              [
                <code style={{ color: c.orange, fontWeight: 700 }}>getPurchasePendings</code>,
                '(none)',
                <code style={{ color: c.accent2 }}>AvailabilityResult</code>,
                <Badge label="Admin" color="yellow" />,
                'List of VINs with purchasePending=true',
              ],
            ]}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 3: SEARCH QUERY ============ */}
      <section id="search-query" style={sectionSpacing}>
        <SectionHeader
          label="Core Query"
          title="search() Query Deep-Dive"
          description="The primary SRP search query: input validation, pipeline construction, parallel execution, and response assembly"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The <code style={{ color: c.accent }}>search()</code> query is the most complex resolver in the module.
            It accepts a <code style={{ color: c.cyan }}>VehicleCommonInputs</code> object containing sort criteria,
            filter parameters, pagination offsets, an optional search term, and the user's geo-location. Before
            any database work begins, the inputs are validated through{' '}
            <code style={{ color: c.cyan }}>commonInputs.validate()</code>, which enforces 18 distinct validation
            rules covering price ranges, year ranges, mileage bounds, pagination limits, and filter combinations.
          </p>
          <p style={para}>
            After validation, the resolver builds two pipelines in parallel within a{' '}
            <code style={{ color: c.accent }}>coroutineScope</code>: one for the vehicle search results
            (<code style={{ color: c.cyan }}>buildVehicleSearchPipeline()</code>) and one for the total count
            (<code style={{ color: c.cyan }}>buildVehicleSearchCountPipeline()</code>). Both pipelines are
            dispatched simultaneously against MongoDB Atlas Search and the results are merged into the final
            <code style={{ color: c.accent2 }}> VehicleResults</code> response.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>VehicleCommonInputs</h3>
          <DataTable
            headers={['Field', 'Type', 'Description']}
            rows={[
              [
                <code style={{ color: c.accent }}>sortCriteria</code>,
                'SortCriteria',
                'Sort field and direction (e.g., PRICE_ASC, DISTANCE_ASC, RELEVANCE)',
              ],
              [
                <code style={{ color: c.accent }}>filters</code>,
                'VehicleFilters',
                'All filter parameters: makeModelTrims, priceRange, yearRange, mileageRange, conditions, bodyStyles, etc.',
              ],
              [
                <code style={{ color: c.accent }}>pagination</code>,
                'Pagination',
                'Offset and limit for result windowing (max limit: 100)',
              ],
              [
                <code style={{ color: c.accent }}>searchTerm</code>,
                'String?',
                'Optional free-text search term for Atlas Search text queries',
              ],
              [
                <code style={{ color: c.accent }}>userLocation</code>,
                'UserLocation?',
                'Latitude/longitude for geo-distance sorting and shipping fee calculation',
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Validation Rules (18 Types)</h3>
          <p style={para}>
            The <code style={{ color: c.cyan }}>commonInputs.validate()</code> method runs 18 distinct checks
            before the query proceeds. Any validation failure throws an <code style={{ color: c.red }}>InvalidInput</code>{' '}
            exception that is surfaced as a GraphQL error.
          </p>
          <div style={cardGrid}>
            <Card variant="blue" title="Range Validations">
              <p style={infoCardText}>
                priceRange (min &le; max), yearRange (min &le; max), mileageRange (min &le; max),
                price bounds (&ge; 0), year bounds (1900-2030), mileage bounds (&ge; 0).
              </p>
            </Card>
            <Card variant="green" title="Pagination Validations">
              <p style={infoCardText}>
                Offset &ge; 0, limit &gt; 0, limit &le; 100. Prevents excessive result windows
                that could strain Atlas Search.
              </p>
            </Card>
            <Card variant="purple" title="Filter Validations">
              <p style={infoCardText}>
                makeModelTrims format, valid vehicle conditions (NEW, USED, CPO),
                valid body styles, valid fuel types, valid drive types.
              </p>
            </Card>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Pipeline Construction</h3>
          <CodeBlock
            language="kotlin"
            filename="SearchQuery.kt (simplified)"
            showLineNumbers
            code={`class SearchQuery(
    private val pipelineBuilder: PipelineBuilder,
    private val vehicleRepository: VehicleRepository,
) : Query {

    suspend fun search(commonInputs: VehicleCommonInputs): VehicleResults {
        // 1. Validate all inputs (18 rules)
        commonInputs.validate()

        // 2. Build pipelines in parallel
        return coroutineScope {
            val vehiclesDeferred = async {
                val pipeline = pipelineBuilder.buildVehicleSearchPipeline(commonInputs)
                vehicleRepository.aggregate(pipeline)
            }
            val countDeferred = async {
                val countPipeline = pipelineBuilder.buildVehicleSearchCountPipeline(commonInputs)
                vehicleRepository.count(countPipeline)
            }

            // 3. Await both and assemble response
            val vehicles = vehiclesDeferred.await()
            val totalCount = countDeferred.await()

            VehicleResults(
                vehicleResults = vehicles.map { it.toGql(commonInputs.userLocation) },
                pageInfo = PageInfo(
                    totalCount = totalCount,
                    offset = commonInputs.pagination.offset,
                    limit = commonInputs.pagination.limit,
                    hasNextPage = commonInputs.pagination.offset + commonInputs.pagination.limit < totalCount
                )
            )
        }
    }
}`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="info" title="Parallel Execution">
            Both the vehicle results query and the count query run concurrently inside{' '}
            <code>coroutineScope</code>. This cuts latency nearly in half compared to sequential execution,
            since each pipeline independently hits MongoDB Atlas Search. The count pipeline omits the
            <code> $skip</code>, <code>$limit</code>, and <code>$project</code> stages, using only{' '}
            <code>$searchMeta</code> with a <code>count</code> collector.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 4: FACETS QUERY ============ */}
      <section id="facets-query" style={sectionSpacing}>
        <SectionHeader
          label="Navigation"
          title="getFacets() Query"
          description="Server-side facet counts using MongoDB's $searchMeta aggregation stage for the filter sidebar"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The <code style={{ color: c.accent }}>getFacets()</code> query powers the filter sidebar on the SRP.
            It accepts a list of <code style={{ color: c.cyan }}>facetFields</code> (an enum of MAKE, MODEL,
            TRIM, CONDITION, BODY_STYLE) along with the same{' '}
            <code style={{ color: c.cyan }}>VehicleCommonInputs</code> used by search. This allows the facet
            counts to reflect the currently applied filters, giving users accurate counts for each filter option.
          </p>
          <p style={para}>
            Under the hood, the query uses the <code style={{ color: c.accent }}>$searchMeta</code> stage with
            facet operators rather than the full <code style={{ color: c.accent }}>$search</code> stage. This
            is a MongoDB Atlas Search optimization that returns only metadata (field counts) without fetching
            any documents, making it significantly faster than aggregating over full results.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CodeBlock
            language="kotlin"
            filename="FacetQuery.kt (simplified)"
            showLineNumbers
            code={`class FacetQuery(
    private val pipelineBuilder: PipelineBuilder,
    private val vehicleRepository: VehicleRepository,
) : Query {

    suspend fun getFacets(
        facetFields: List<FacetField>,  // MAKE, MODEL, TRIM, CONDITION, BODY_STYLE
        commonInputs: VehicleCommonInputs,
    ): FacetResults {
        commonInputs.validate()
        val pipeline = pipelineBuilder.buildFacetPipeline(facetFields, commonInputs)
        val rawFacets = vehicleRepository.aggregateMeta(pipeline)
        return FacetResults(
            facets = rawFacets.map { (field, buckets) ->
                Facet(
                    field = field,
                    buckets = buckets.map { Bucket(value = it.key, count = it.count) }
                )
            }
        )
    }
}`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Facet Response Structure</h3>
          <DataTable
            headers={['Field', 'Type', 'Description']}
            rows={[
              [
                <code style={{ color: c.accent }}>facets</code>,
                <code style={{ color: c.accent2 }}>List&lt;Facet&gt;</code>,
                'Top-level list of facets, one per requested facetField',
              ],
              [
                <code style={{ color: c.accent }}>facet.field</code>,
                'FacetField',
                'The enum value: MAKE, MODEL, TRIM, CONDITION, or BODY_STYLE',
              ],
              [
                <code style={{ color: c.accent }}>facet.buckets</code>,
                <code style={{ color: c.accent2 }}>List&lt;Bucket&gt;</code>,
                'List of value-count pairs for this field',
              ],
              [
                <code style={{ color: c.accent }}>bucket.value</code>,
                'String',
                'The facet value (e.g., "Toyota", "Sedan", "NEW")',
              ],
              [
                <code style={{ color: c.accent }}>bucket.count</code>,
                'Int',
                'Number of matching vehicles for this value given current filters',
              ],
            ]}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 5: SUGGESTIONS QUERY ============ */}
      <section id="suggestions-query" style={sectionSpacing}>
        <SectionHeader
          label="Autocomplete"
          title="getSearchSuggestions() Query"
          description="Typeahead autocomplete searching the searchSuggestion collection via the shopSuggestions Atlas Search index"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The <code style={{ color: c.accent }}>getSearchSuggestions()</code> query powers the search bar
            autocomplete on Driveway.com. It takes a single <code style={{ color: c.cyan }}>queryString</code>{' '}
            parameter containing the user's partially typed text and returns matching make+model combinations
            ranked by relevance.
          </p>
          <p style={para}>
            Unlike the other queries that hit the <code style={{ color: c.accent }}>vehicleV3</code> collection,
            suggestions are served from a dedicated <code style={{ color: c.accent }}>searchSuggestion</code>{' '}
            collection with its own <code style={{ color: c.cyan }}>shopSuggestions</code> Atlas Search index.
            This collection is pre-computed and contains deduplicated make+model entries, keeping the autocomplete
            index small and responses fast (typically under 50ms).
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CodeBlock
            language="kotlin"
            filename="SuggestionQuery.kt (simplified)"
            showLineNumbers
            code={`class SuggestionQuery(
    private val suggestionRepository: SuggestionRepository,
) : Query {

    suspend fun getSearchSuggestions(
        queryString: String,
    ): VehicleSuggestionResults {
        val suggestions = suggestionRepository.searchSuggestions(
            queryString = queryString,
            indexName = "shopSuggestions",
        )
        return VehicleSuggestionResults(
            suggestions = suggestions.map { it.toSuggestionDto() }
        )
    }
}`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="success" title="Performance">
            The searchSuggestion collection uses an autocomplete analyzer with edge-ngram tokenization,
            delivering sub-50ms responses. The collection is refreshed by the cron module whenever
            new inventory is imported, ensuring suggestions stay current with available inventory.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 6: VEHICLE BY VIN ============ */}
      <section id="vehicle-by-vin" style={sectionSpacing}>
        <SectionHeader
          label="Single Lookup"
          title="getVehicleByVin()"
          description="Retrieve a single vehicle document by its VIN using FilterBuilder and LimitBlock(1)"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The <code style={{ color: c.accent }}>getVehicleByVin()</code> query retrieves a single vehicle
            by its VIN. Internally it builds a minimal search pipeline: a{' '}
            <code style={{ color: c.cyan }}>SearchBlock</code> constructed via{' '}
            <code style={{ color: c.cyan }}>FilterBuilder</code> that matches on the exact VIN field, followed
            by a <code style={{ color: c.cyan }}>LimitBlock(1)</code> to short-circuit after the first match.
          </p>
          <p style={para}>
            If no vehicle is found for the given VIN, the resolver throws a{' '}
            <code style={{ color: c.red }}>NotFound</code> exception that is surfaced as a GraphQL error
            with a user-friendly message. The optional <code style={{ color: c.cyan }}>userLocation</code>{' '}
            parameter is used to calculate shipping fees and distance in the response DTO.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CodeBlock
            language="kotlin"
            filename="VehicleByVinQuery.kt (simplified)"
            showLineNumbers
            code={`class VehicleByVinQuery(
    private val pipelineBuilder: PipelineBuilder,
    private val vehicleRepository: VehicleRepository,
) : Query {

    suspend fun getVehicleByVin(
        vin: String,
        userLocation: UserLocation?,
    ): VehicleResult {
        val pipeline = pipelineBuilder.buildSingleVehiclePipeline(
            filterBuilder = FilterBuilder().vinEquals(vin),
            limit = LimitBlock(1),
        )
        val vehicle = vehicleRepository.aggregate(pipeline).firstOrNull()
            ?: throw NotFound("Vehicle not found for VIN: \$vin")

        return vehicle.toGql(userLocation)
    }
}`}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 7: VEHICLE BY ID ============ */}
      <section id="vehicle-by-id" style={sectionSpacing}>
        <SectionHeader
          label="Single Lookup"
          title="getVehicleById()"
          description="Retrieve a single vehicle document by its vehicleId, identical pattern to VIN lookup"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The <code style={{ color: c.accent }}>getVehicleById()</code> query is structurally identical to
            <code style={{ color: c.accent }}> getVehicleByVin()</code> but filters on the{' '}
            <code style={{ color: c.cyan }}>vehicleId</code> field instead of VIN. It uses the same
            pipeline builder pattern with <code style={{ color: c.cyan }}>FilterBuilder().vehicleIdEquals(id)</code>{' '}
            and <code style={{ color: c.cyan }}>LimitBlock(1)</code>.
          </p>
          <p style={para}>
            The <code style={{ color: c.cyan }}>vehicleId</code> is an internal identifier that differs from
            VIN. While VINs are industry-standard 17-character identifiers, vehicleIds are system-generated
            unique keys. Both fields are indexed in MongoDB and Atlas Search for fast lookups.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CodeBlock
            language="kotlin"
            filename="VehicleByIdQuery.kt (simplified)"
            showLineNumbers
            code={`class VehicleByIdQuery(
    private val pipelineBuilder: PipelineBuilder,
    private val vehicleRepository: VehicleRepository,
) : Query {

    suspend fun getVehicleById(
        id: String,
        userLocation: UserLocation?,
    ): VehicleResult {
        val pipeline = pipelineBuilder.buildSingleVehiclePipeline(
            filterBuilder = FilterBuilder().vehicleIdEquals(id),
            limit = LimitBlock(1),
        )
        val vehicle = vehicleRepository.aggregate(pipeline).firstOrNull()
            ?: throw NotFound("Vehicle not found for id: \$id")

        return vehicle.toGql(userLocation)
    }
}`}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 8: BATCH QUERIES ============ */}
      <section id="batch-queries" style={sectionSpacing}>
        <SectionHeader
          label="Batch Lookups"
          title="Batch Queries"
          description="getVehiclesById and getVehiclesByVin for multi-vehicle retrieval with per-item status tracking"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The batch queries <code style={{ color: c.accent }}>getVehiclesById()</code> and{' '}
            <code style={{ color: c.accent }}>getVehiclesByVin()</code> accept a list of IDs or VINs and
            return a <code style={{ color: c.accent2 }}>List&lt;VehicleByIdResult&gt;</code>. Each result
            includes the original identifier, the vehicle data (if found), and a status enum indicating
            whether the vehicle was <code style={{ color: c.accent2 }}>FOUND</code> or{' '}
            <code style={{ color: c.red }}>NOT_FOUND</code>.
          </p>
          <p style={para}>
            Unlike the single-lookup queries that throw <code style={{ color: c.red }}>NotFound</code> on
            a miss, batch queries never throw. Instead, missing vehicles are returned with{' '}
            <code style={{ color: c.red }}>status: NOT_FOUND</code> and a null{' '}
            <code style={{ color: c.cyan }}>vehicleResult</code>. This allows callers to handle partial
            results gracefully without the entire batch failing due to a single missing vehicle.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>VehicleByIdResult Structure</h3>
          <DataTable
            headers={['Field', 'Type', 'Description']}
            rows={[
              [
                <code style={{ color: c.accent }}>id</code>,
                'String',
                'The original VIN or vehicleId that was requested',
              ],
              [
                <code style={{ color: c.accent }}>vehicleResult</code>,
                <code style={{ color: c.accent2 }}>VehicleResult?</code>,
                'The full vehicle DTO if found, null otherwise',
              ],
              [
                <code style={{ color: c.accent }}>status</code>,
                <code style={{ color: c.accent2 }}>VehicleByIdStatus</code>,
                <span>
                  <Badge label="FOUND" color="green" /> or <Badge label="NOT_FOUND" color="red" />
                </span>,
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CodeBlock
            language="kotlin"
            filename="BatchVehicleQuery.kt (simplified)"
            showLineNumbers
            code={`class BatchVehicleQuery(
    private val pipelineBuilder: PipelineBuilder,
    private val vehicleRepository: VehicleRepository,
) : Query {

    suspend fun getVehiclesById(
        ids: List<String>,
        userLocation: UserLocation?,
    ): List<VehicleByIdResult> {
        val vehicles = vehicleRepository.findByVehicleIds(ids)
        val vehicleMap = vehicles.associateBy { it.vehicleId }
        return ids.map { id ->
            val vehicle = vehicleMap[id]
            VehicleByIdResult(
                id = id,
                vehicleResult = vehicle?.toGql(userLocation),
                status = if (vehicle != null) FOUND else NOT_FOUND,
            )
        }
    }

    suspend fun getVehiclesByVin(
        vins: List<String>,
        userLocation: UserLocation?,
    ): List<VehicleByIdResult> {
        val vehicles = vehicleRepository.findByVins(vins)
        val vehicleMap = vehicles.associateBy { it.vin }
        return vins.map { vin ->
            val vehicle = vehicleMap[vin]
            VehicleByIdResult(
                id = vin,
                vehicleResult = vehicle?.toGql(userLocation),
                status = if (vehicle != null) FOUND else NOT_FOUND,
            )
        }
    }
}`}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 9: AVAILABILITY QUERIES ============ */}
      <section id="availability-queries" style={sectionSpacing}>
        <SectionHeader
          label="Cart Integration"
          title="Availability Queries"
          description="Cart readiness checks and admin suppression/pending queries for inventory availability"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The availability queries serve two purposes: <strong>cart readiness checks</strong> and{' '}
            <strong>admin inventory inspection</strong>.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <div style={cardGrid}>
            <div style={{ ...infoCard, borderLeftColor: c.red, borderLeftWidth: 3 }}>
              <div style={{ ...infoCardTitle, color: c.red }}>checkAvailabilityOfVin / checkAvailabilityOfVehicleId</div>
              <p style={infoCardText}>
                Returns a simple <code style={{ color: c.accent2 }}>Boolean</code> indicating whether a
                vehicle is available for purchase. Used by the cart service before allowing a user to proceed
                to checkout. A vehicle is unavailable if it has been manually suppressed, has{' '}
                <code>purchasePending=true</code>, or its <code>availability</code> status is not{' '}
                <code>ACTIVE</code>.
              </p>
            </div>
            <div style={{ ...infoCard, borderLeftColor: c.orange, borderLeftWidth: 3 }}>
              <div style={{ ...infoCardTitle, color: c.orange }}>getManualSuppressions</div>
              <p style={infoCardText}>
                Returns an <code style={{ color: c.accent2 }}>AvailabilityResult</code> containing the
                list of VINs that have been manually suppressed from active inventory. These vehicles exist
                in the system but are hidden from search results and blocked from cart operations.
              </p>
            </div>
            <div style={{ ...infoCard, borderLeftColor: c.accent3, borderLeftWidth: 3 }}>
              <div style={{ ...infoCardTitle, color: c.accent3 }}>getPurchasePendings</div>
              <p style={infoCardText}>
                Returns an <code style={{ color: c.accent2 }}>AvailabilityResult</code> containing the
                list of VINs with <code>purchasePending=true</code>. These are vehicles currently in an
                active purchase flow by another user, temporarily reserved from other buyers.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="warning" title="Availability vs. Search Visibility">
            A vehicle being "available" (returns <code>true</code> from checkAvailability) does not
            guarantee it appears in search results. Search visibility also depends on{' '}
            <code>status=ACTIVE</code>, passing quality filters, and having valid pricing.
            Availability queries only check whether a vehicle can proceed to cart.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 10: VEHICLE RESULT DTO ============ */}
      <section id="vehicle-result-dto" style={sectionSpacing}>
        <SectionHeader
          label="Data Transfer Object"
          title="VehicleResult DTO"
          description="Complete field reference for the VehicleResult GraphQL type returned by all vehicle queries"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The <code style={{ color: c.accent }}>VehicleResult</code> DTO is the primary return type for
            all vehicle queries. It is produced by the{' '}
            <code style={{ color: c.cyan }}>Vehicle.toGql(userLocation)</code> extension function which maps
            the MongoDB domain object to the GraphQL-safe representation. The DTO exposes over 30 fields
            organized into logical groups.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Tabs
            tabs={[
              {
                label: 'Identity & Pricing',
                content: (
                  <DataTable
                    headers={['Field', 'Type', 'Description']}
                    rows={[
                      [
                        <code style={{ color: c.accent }}>vin</code>,
                        'String',
                        'Vehicle Identification Number (17 characters)',
                      ],
                      [
                        <code style={{ color: c.accent }}>vehicleId</code>,
                        'String',
                        'Internal system-generated unique identifier',
                      ],
                      [
                        <code style={{ color: c.accent }}>price</code>,
                        'Double',
                        'Sale price in dollars',
                      ],
                      [
                        <code style={{ color: c.accent }}>priceInCents</code>,
                        'Long',
                        'Sale price in cents for precision-safe calculations',
                      ],
                      [
                        <code style={{ color: c.accent }}>msrp</code>,
                        'Double',
                        "Manufacturer's Suggested Retail Price in dollars",
                      ],
                      [
                        <code style={{ color: c.accent }}>msrpInCents</code>,
                        'Long',
                        'MSRP in cents for precision-safe calculations',
                      ],
                      [
                        <code style={{ color: c.accent }}>dealerInvoicePrice</code>,
                        'Double?',
                        'Dealer invoice price when available',
                      ],
                    ]}
                  />
                ),
              },
              {
                label: 'Leasing & Shipping',
                content: (
                  <DataTable
                    headers={['Field', 'Type', 'Description']}
                    rows={[
                      [
                        <code style={{ color: c.accent }}>leasing</code>,
                        'LeasingInfo?',
                        'Leasing object: canLease (Boolean) and priceInCents (Long)',
                      ],
                      [
                        <code style={{ color: c.accent }}>leasing.canLease</code>,
                        'Boolean',
                        'Whether the vehicle is eligible for leasing',
                      ],
                      [
                        <code style={{ color: c.accent }}>leasing.priceInCents</code>,
                        'Long?',
                        'Monthly lease price in cents',
                      ],
                      [
                        <code style={{ color: c.accent }}>shippingFee</code>,
                        'Double?',
                        'Calculated shipping fee in dollars based on user distance',
                      ],
                      [
                        <code style={{ color: c.accent }}>shippingFeeInCents</code>,
                        'Long?',
                        'Shipping fee in cents',
                      ],
                    ]}
                  />
                ),
              },
              {
                label: 'Inventory & Specs',
                content: (
                  <DataTable
                    headers={['Field', 'Type', 'Description']}
                    rows={[
                      [
                        <code style={{ color: c.accent }}>oneOwner</code>,
                        'Boolean',
                        'Whether the vehicle has had only one previous owner',
                      ],
                      [
                        <code style={{ color: c.accent }}>inventoryDate</code>,
                        'String',
                        'Date the vehicle was added to inventory',
                      ],
                      [
                        <code style={{ color: c.accent }}>mileage</code>,
                        'Int',
                        'Current odometer reading',
                      ],
                      [
                        <code style={{ color: c.accent }}>stockNumber</code>,
                        'String?',
                        'Dealer stock number',
                      ],
                      [
                        <code style={{ color: c.accent }}>ymmt</code>,
                        'Ymmt',
                        'Year, Make, Model, Trim nested object',
                      ],
                      [
                        <code style={{ color: c.accent }}>bodyStyle</code>,
                        'String',
                        'Body style (Sedan, SUV, Truck, etc.)',
                      ],
                      [
                        <code style={{ color: c.accent }}>condition</code>,
                        'String',
                        'Vehicle condition: NEW, USED, or CPO',
                      ],
                      [
                        <code style={{ color: c.accent }}>engine</code>,
                        'String?',
                        'Engine description',
                      ],
                      [
                        <code style={{ color: c.accent }}>fuel</code>,
                        'String?',
                        'Fuel type (Gasoline, Diesel, Electric, Hybrid, etc.)',
                      ],
                      [
                        <code style={{ color: c.accent }}>transmission</code>,
                        'String?',
                        'Transmission type (Automatic, Manual, CVT)',
                      ],
                      [
                        <code style={{ color: c.accent }}>driveType</code>,
                        'String?',
                        'Drive type (FWD, RWD, AWD, 4WD)',
                      ],
                      [
                        <code style={{ color: c.accent }}>doors</code>,
                        'Int?',
                        'Number of doors',
                      ],
                      [
                        <code style={{ color: c.accent }}>cabStyle</code>,
                        'String?',
                        'Cab style for trucks (Regular, Extended, Crew)',
                      ],
                      [
                        <code style={{ color: c.accent }}>bedStyle</code>,
                        'String?',
                        'Bed style for trucks (Short, Standard, Long)',
                      ],
                      [
                        <code style={{ color: c.accent }}>rimSize</code>,
                        'String?',
                        'Rim size in inches',
                      ],
                    ]}
                  />
                ),
              },
              {
                label: 'Colors & Media',
                content: (
                  <DataTable
                    headers={['Field', 'Type', 'Description']}
                    rows={[
                      [
                        <code style={{ color: c.accent }}>exteriorColor</code>,
                        'String?',
                        'Exterior color name',
                      ],
                      [
                        <code style={{ color: c.accent }}>interiorColor</code>,
                        'String?',
                        'Interior color name',
                      ],
                      [
                        <code style={{ color: c.accent }}>image</code>,
                        'VehicleImage?',
                        'Image container: heroUrl, spinUrl, count',
                      ],
                      [
                        <code style={{ color: c.accent }}>image.heroUrl</code>,
                        'String?',
                        'URL of the primary hero image',
                      ],
                      [
                        <code style={{ color: c.accent }}>image.spinUrl</code>,
                        'String?',
                        'URL for 360-degree spin viewer',
                      ],
                      [
                        <code style={{ color: c.accent }}>image.count</code>,
                        'Int',
                        'Total number of available images',
                      ],
                    ]}
                  />
                ),
              },
              {
                label: 'Features & Dealer',
                content: (
                  <DataTable
                    headers={['Field', 'Type', 'Description']}
                    rows={[
                      [
                        <code style={{ color: c.accent }}>categoryFeatures</code>,
                        'List<CategoryFeature>?',
                        'Vehicle features grouped by category (Safety, Comfort, Technology, etc.)',
                      ],
                      [
                        <code style={{ color: c.accent }}>lifestyleTags</code>,
                        'List<String>?',
                        'Marketing tags (Family-Friendly, Off-Road, Luxury, etc.)',
                      ],
                      [
                        <code style={{ color: c.accent }}>vehiclePackage</code>,
                        'String?',
                        'Factory package name if applicable',
                      ],
                      [
                        <code style={{ color: c.accent }}>dealership</code>,
                        'DealershipInfo',
                        'Dealer nested object with full address',
                      ],
                      [
                        <code style={{ color: c.accent }}>dealership.id</code>,
                        'String',
                        'Dealer identifier',
                      ],
                      [
                        <code style={{ color: c.accent }}>dealership.name</code>,
                        'String',
                        'Dealer display name',
                      ],
                      [
                        <code style={{ color: c.accent }}>dealership.address</code>,
                        'String',
                        'Street address',
                      ],
                      [
                        <code style={{ color: c.accent }}>dealership.city</code>,
                        'String',
                        'City',
                      ],
                      [
                        <code style={{ color: c.accent }}>dealership.zip</code>,
                        'String',
                        'ZIP code',
                      ],
                      [
                        <code style={{ color: c.accent }}>dealership.state</code>,
                        'String',
                        'State abbreviation',
                      ],
                      [
                        <code style={{ color: c.accent }}>dealership.region</code>,
                        'String?',
                        'Geographic region',
                      ],
                    ]}
                  />
                ),
              },
              {
                label: 'Valuation & Search',
                content: (
                  <DataTable
                    headers={['Field', 'Type', 'Description']}
                    rows={[
                      [
                        <code style={{ color: c.accent }}>primaryBookValue</code>,
                        'Double?',
                        'Primary book value (KBB, NADA, etc.) in dollars',
                      ],
                      [
                        <code style={{ color: c.accent }}>primaryBookValueInCents</code>,
                        'Long?',
                        'Primary book value in cents',
                      ],
                      [
                        <code style={{ color: c.accent }}>primaryBookName</code>,
                        'String?',
                        'Source of the book value (e.g., "KBB", "NADA")',
                      ],
                      [
                        <code style={{ color: c.accent }}>financeable</code>,
                        'Boolean',
                        'Whether the vehicle is eligible for financing',
                      ],
                      [
                        <code style={{ color: c.accent }}>score</code>,
                        'Double?',
                        'Atlas Search relevancy score (only present in search results)',
                      ],
                      [
                        <code style={{ color: c.accent }}>availability</code>,
                        'String',
                        'Availability status: ACTIVE, SOLD, PENDING, SUPPRESSED',
                      ],
                      [
                        <code style={{ color: c.accent }}>hints</code>,
                        'List<String>?',
                        'UI hints for display (e.g., "Great Deal", "Price Drop")',
                      ],
                      [
                        <code style={{ color: c.accent }}>monroneyStickerUrl</code>,
                        'String?',
                        'URL to the Monroney sticker PDF for new vehicles',
                      ],
                    ]}
                  />
                ),
              },
            ]}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 11: RESOLVER FLOW ============ */}
      <section id="resolver-flow" style={sectionSpacing}>
        <SectionHeader
          label="Architecture"
          title="Resolver Flow"
          description="End-to-end data flow from GraphQL query to VehicleResult response"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            Every GraphQL query follows the same architectural flow through the resolver chain. The
            graphql-kotlin framework dispatches the incoming query to the appropriate resolver class,
            which validates inputs, delegates to the pipeline builder, executes against MongoDB Atlas
            Search, and maps the domain model to the GraphQL DTO.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Resolver Data Flow"
            tabs={[
              { label: 'Resolver Chain', source: mermaidResolverFlow },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Flow Steps</h3>
          <div style={cardGrid}>
            <div style={{ ...infoCard, borderLeftColor: c.accent, borderLeftWidth: 3 }}>
              <div style={{ ...infoCardTitle, color: c.accent }}>1. GraphQL Query</div>
              <p style={infoCardText}>
                The client sends a GraphQL query over HTTP POST to{' '}
                <code>/shop-graphql/graphql</code>. The graphql-kotlin engine parses and validates
                the query against the auto-generated schema.
              </p>
            </div>
            <div style={{ ...infoCard, borderLeftColor: c.orange, borderLeftWidth: 3 }}>
              <div style={{ ...infoCardTitle, color: c.orange }}>2. Input Validation</div>
              <p style={infoCardText}>
                The resolver calls <code>commonInputs.validate()</code> which enforces 18 rules.
                Invalid inputs produce immediate GraphQL errors without touching the database.
              </p>
            </div>
            <div style={{ ...infoCard, borderLeftColor: c.accent3, borderLeftWidth: 3 }}>
              <div style={{ ...infoCardTitle, color: c.accent3 }}>3. Pipeline Construction</div>
              <p style={infoCardText}>
                The <code>PipelineBuilder</code> orchestrates <code>SearchBuilder</code>,{' '}
                <code>FilterBuilder</code>, <code>TextBuilder</code>, and <code>ScoreBuilder</code>{' '}
                to produce a MongoDB aggregation pipeline.
              </p>
            </div>
            <div style={{ ...infoCard, borderLeftColor: c.accent2, borderLeftWidth: 3 }}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>4. Atlas Search Execution</div>
              <p style={infoCardText}>
                The pipeline is executed against MongoDB Atlas Search using the{' '}
                <code>shopSearch</code> index on the <code>vehicleV3</code> collection.
                Results are returned as domain objects.
              </p>
            </div>
            <div style={{ ...infoCard, borderLeftColor: c.cyan, borderLeftWidth: 3 }}>
              <div style={{ ...infoCardTitle, color: c.cyan }}>5. DTO Mapping</div>
              <p style={infoCardText}>
                Each <code>Vehicle</code> domain object is mapped to a <code>VehicleResult</code>{' '}
                DTO via <code>Vehicle.toGql(userLocation)</code>. Shipping fees and distance
                are calculated during this step.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 12: EXAMPLE SRP SEARCH ============ */}
      <section id="example-srp-search" style={sectionSpacing}>
        <SectionHeader
          label="Example"
          title="SRP Search with Filters + Pagination"
          description="A complete end-to-end example showing GraphQL request, MongoDB pipeline, and response"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            This example demonstrates a typical SRP search query with make/model filters, a price range,
            vehicle condition filter, sort by price ascending, pagination, and a user location for shipping
            fee calculation. The three tabs show the GraphQL request, the MongoDB aggregation pipeline that
            gets built, and the GraphQL response.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Tabs
            tabs={[
              {
                label: 'GraphQL Request',
                content: (
                  <CodeBlock
                    language="graphql"
                    filename="SRP Search Query"
                    showLineNumbers
                    code={`query SRPSearch {
  search(commonInputs: {
    filters: {
      makeModelTrims: [
        { make: "Toyota", model: "Camry" },
        { make: "Honda", model: "Accord" }
      ]
      priceRange: { min: 15000, max: 35000 }
      vehicleConditions: [USED, CPO]
      bodyStyles: [SEDAN]
    }
    sortCriteria: { field: PRICE, direction: ASC }
    pagination: { offset: 0, limit: 24 }
    userLocation: {
      latitude: 33.749
      longitude: -84.388
    }
  }) {
    vehicleResults {
      vin
      vehicleId
      price
      priceInCents
      mileage
      ymmt { year make model trim }
      condition
      exteriorColor
      image { heroUrl count }
      shippingFee
      dealership { name city state }
      score
    }
    pageInfo {
      totalCount
      offset
      limit
      hasNextPage
    }
  }
}`}
                  />
                ),
              },
              {
                label: 'MongoDB Pipeline',
                content: (
                  <CodeBlock
                    language="json"
                    filename="Generated Aggregation Pipeline"
                    showLineNumbers
                    code={`[
  {
    "$search": {
      "index": "shopSearch",
      "compound": {
        "filter": [
          {
            "compound": {
              "should": [
                {
                  "compound": {
                    "must": [
                      { "text": { "path": "make", "query": "Toyota" } },
                      { "text": { "path": "model", "query": "Camry" } }
                    ]
                  }
                },
                {
                  "compound": {
                    "must": [
                      { "text": { "path": "make", "query": "Honda" } },
                      { "text": { "path": "model", "query": "Accord" } }
                    ]
                  }
                }
              ],
              "minimumShouldMatch": 1
            }
          },
          {
            "range": {
              "path": "price",
              "gte": 15000,
              "lte": 35000
            }
          },
          {
            "compound": {
              "should": [
                { "text": { "path": "condition", "query": "USED" } },
                { "text": { "path": "condition", "query": "CPO" } }
              ],
              "minimumShouldMatch": 1
            }
          },
          {
            "text": { "path": "bodyStyle", "query": "Sedan" }
          },
          {
            "equals": { "path": "status", "value": "ACTIVE" }
          }
        ]
      },
      "sort": { "price": 1 },
      "count": { "type": "total" }
    }
  },
  { "$skip": 0 },
  { "$limit": 24 },
  {
    "$project": {
      "vin": 1, "vehicleId": 1, "price": 1,
      "mileage": 1, "ymmt": 1, "condition": 1,
      "exteriorColor": 1, "image": 1,
      "dealership": 1, "score": { "$meta": "searchScore" }
    }
  }
]`}
                  />
                ),
              },
              {
                label: 'GraphQL Response',
                content: (
                  <CodeBlock
                    language="json"
                    filename="Response (abbreviated)"
                    showLineNumbers
                    code={`{
  "data": {
    "search": {
      "vehicleResults": [
        {
          "vin": "4T1BF1FK5HU123456",
          "vehicleId": "veh-abc-123",
          "price": 18500.00,
          "priceInCents": 1850000,
          "mileage": 42350,
          "ymmt": {
            "year": 2022,
            "make": "Toyota",
            "model": "Camry",
            "trim": "SE"
          },
          "condition": "USED",
          "exteriorColor": "Midnight Black",
          "image": {
            "heroUrl": "https://images.driveway.com/veh-abc-123/hero.jpg",
            "count": 24
          },
          "shippingFee": 499.00,
          "dealership": {
            "name": "AutoNation Toyota",
            "city": "Atlanta",
            "state": "GA"
          },
          "score": 8.42
        },
        {
          "vin": "1HGCV1F34LA098765",
          "vehicleId": "veh-def-456",
          "price": 21200.00,
          "priceInCents": 2120000,
          "mileage": 28100,
          "ymmt": {
            "year": 2023,
            "make": "Honda",
            "model": "Accord",
            "trim": "Sport"
          },
          "condition": "CPO",
          "exteriorColor": "Platinum White",
          "image": {
            "heroUrl": "https://images.driveway.com/veh-def-456/hero.jpg",
            "count": 18
          },
          "shippingFee": 349.00,
          "dealership": {
            "name": "Hendrick Honda",
            "city": "Marietta",
            "state": "GA"
          },
          "score": 7.95
        }
      ],
      "pageInfo": {
        "totalCount": 847,
        "offset": 0,
        "limit": 24,
        "hasNextPage": true
      }
    }
  }
}`}
                  />
                ),
              },
            ]}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 13: EXAMPLE VEHICLE DETAIL ============ */}
      <section id="example-vehicle-detail" style={sectionSpacing}>
        <SectionHeader
          label="Example"
          title="Vehicle Detail Lookup"
          description="End-to-end example of fetching a single vehicle by VIN for the Vehicle Detail Page"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            This example shows a typical VDP request using <code style={{ color: c.accent }}>getVehicleByVin</code>.
            The query fetches all fields needed to render the Vehicle Detail Page including pricing, specs,
            features, dealer info, and images.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Tabs
            tabs={[
              {
                label: 'GraphQL Request',
                content: (
                  <CodeBlock
                    language="graphql"
                    filename="Vehicle Detail Query"
                    showLineNumbers
                    code={`query VehicleDetail {
  getVehicleByVin(
    vin: "4T1BF1FK5HU123456"
    userLocation: {
      latitude: 33.749
      longitude: -84.388
    }
  ) {
    vin
    vehicleId
    price
    priceInCents
    msrp
    msrpInCents
    leasing { canLease priceInCents }
    shippingFee
    shippingFeeInCents
    oneOwner
    inventoryDate
    mileage
    stockNumber
    ymmt { year make model trim }
    bodyStyle
    condition
    engine
    fuel
    transmission
    driveType
    doors
    exteriorColor
    interiorColor
    image { heroUrl spinUrl count }
    categoryFeatures { category features }
    lifestyleTags
    dealership { id name address city zip state region }
    primaryBookValue
    primaryBookName
    financeable
    availability
    hints
    monroneyStickerUrl
  }
}`}
                  />
                ),
              },
              {
                label: 'Pipeline Built',
                content: (
                  <CodeBlock
                    language="json"
                    filename="Generated Pipeline (VIN lookup)"
                    showLineNumbers
                    code={`[
  {
    "$search": {
      "index": "shopSearch",
      "compound": {
        "filter": [
          {
            "equals": {
              "path": "vin",
              "value": "4T1BF1FK5HU123456"
            }
          },
          {
            "equals": {
              "path": "status",
              "value": "ACTIVE"
            }
          }
        ]
      }
    }
  },
  { "$limit": 1 },
  {
    "$project": {
      "_id": 0,
      "__all_fields__": 1,
      "score": { "$meta": "searchScore" }
    }
  }
]`}
                  />
                ),
              },
              {
                label: 'GraphQL Response',
                content: (
                  <CodeBlock
                    language="json"
                    filename="Response"
                    showLineNumbers
                    code={`{
  "data": {
    "getVehicleByVin": {
      "vin": "4T1BF1FK5HU123456",
      "vehicleId": "veh-abc-123",
      "price": 18500.00,
      "priceInCents": 1850000,
      "msrp": 26500.00,
      "msrpInCents": 2650000,
      "leasing": {
        "canLease": true,
        "priceInCents": 29900
      },
      "shippingFee": 499.00,
      "shippingFeeInCents": 49900,
      "oneOwner": true,
      "inventoryDate": "2024-11-15",
      "mileage": 42350,
      "stockNumber": "ATN-78542",
      "ymmt": {
        "year": 2022,
        "make": "Toyota",
        "model": "Camry",
        "trim": "SE"
      },
      "bodyStyle": "Sedan",
      "condition": "USED",
      "engine": "2.5L 4-Cylinder",
      "fuel": "Gasoline",
      "transmission": "Automatic",
      "driveType": "FWD",
      "doors": 4,
      "exteriorColor": "Midnight Black",
      "interiorColor": "Ash Gray",
      "image": {
        "heroUrl": "https://images.driveway.com/veh-abc-123/hero.jpg",
        "spinUrl": "https://images.driveway.com/veh-abc-123/spin/",
        "count": 24
      },
      "categoryFeatures": [
        {
          "category": "Safety",
          "features": ["Blind Spot Monitor", "Lane Departure Alert", "Pre-Collision System"]
        },
        {
          "category": "Technology",
          "features": ["Apple CarPlay", "Android Auto", "Wireless Charging"]
        }
      ],
      "lifestyleTags": ["Commuter", "Family-Friendly"],
      "dealership": {
        "id": "dlr-atn-001",
        "name": "AutoNation Toyota",
        "address": "5585 Peachtree Industrial Blvd",
        "city": "Atlanta",
        "zip": "30341",
        "state": "GA",
        "region": "Southeast"
      },
      "primaryBookValue": 19200.00,
      "primaryBookName": "KBB",
      "financeable": true,
      "availability": "ACTIVE",
      "hints": ["Great Deal", "One Owner"],
      "monroneyStickerUrl": null
    }
  }
}`}
                  />
                ),
              },
            ]}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 14: ERROR HANDLING ============ */}
      <section id="error-handling" style={sectionSpacing}>
        <SectionHeader
          label="Reliability"
          title="Error Handling"
          description="How GraphQL errors are classified, surfaced, and redacted across environments"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The GraphQL layer implements a layered error handling strategy that balances developer
            debuggability with production security. Errors are classified into two categories:
            <strong> client errors</strong> (invalid input, not found) that are always surfaced, and
            <strong> server errors</strong> (internal failures) that are redacted in production to prevent
            information leakage.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <DataTable
            headers={['Error Type', 'HTTP Status', 'GraphQL Behavior', 'Environments']}
            rows={[
              [
                <strong style={{ color: c.orange }}>InvalidInput</strong>,
                '200 (GraphQL error)',
                'Validation error with descriptive message exposed to client. 18 distinct error types covering all input validation rules.',
                <Badge label="All" color="blue" />,
              ],
              [
                <strong style={{ color: c.red }}>NotFound</strong>,
                '200 (GraphQL error)',
                'Not found error with resource identifier exposed. Thrown by single-lookup queries when VIN or ID does not match.',
                <Badge label="All" color="blue" />,
              ],
              [
                <strong style={{ color: c.accent3 }}>GraphQLException</strong>,
                '200 (GraphQL error)',
                'Custom exceptions extending GraphQLException are surfaced with their message intact through PublicApiSafeGqlExceptionHandler.',
                <Badge label="All" color="blue" />,
              ],
              [
                <strong style={{ color: c.red }}>Internal Error</strong>,
                '200 (GraphQL error)',
                'Unexpected exceptions are caught by the global handler. Full details in dev, redacted message in uat/prod.',
                <Badge label="UAT/PROD" color="red" dot />,
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>PublicApiSafeGqlExceptionHandler</h3>
          <p style={para}>
            The <code style={{ color: c.accent }}>PublicApiSafeGqlExceptionHandler</code> is a custom
            graphql-kotlin exception handler that acts as a firewall between internal errors and the
            GraphQL response. It inspects the exception type: if it extends{' '}
            <code style={{ color: c.cyan }}>GraphQLException</code> (which includes{' '}
            <code style={{ color: c.cyan }}>InvalidInput</code> and{' '}
            <code style={{ color: c.cyan }}>NotFound</code>), the message is passed through to the
            client. For all other exception types, the handler returns a generic "Internal server error"
            message in UAT and PROD environments, while DEV exposes the full stack trace for debugging.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CodeBlock
            language="kotlin"
            filename="PublicApiSafeGqlExceptionHandler.kt (simplified)"
            showLineNumbers
            code={`class PublicApiSafeGqlExceptionHandler(
    private val environment: String,
) : GraphQLExceptionHandler {

    override fun onException(exception: Throwable): GraphQLError {
        return when (exception) {
            is GraphQLException -> {
                // Client-safe errors: expose message
                GraphQLError.newError()
                    .message(exception.message)
                    .extensions(mapOf("classification" to exception.javaClass.simpleName))
                    .build()
            }
            else -> {
                // Internal errors: redact in uat/prod
                logger.error("Unhandled GraphQL exception", exception)
                if (environment == "dev") {
                    GraphQLError.newError()
                        .message(exception.message)
                        .extensions(mapOf("stackTrace" to exception.stackTraceToString()))
                        .build()
                } else {
                    GraphQLError.newError()
                        .message("Internal server error")
                        .extensions(mapOf("classification" to "INTERNAL_ERROR"))
                        .build()
                }
            }
        }
    }
}`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="danger" title="Error Redaction in Production">
            Global error redaction is enabled in UAT and PROD environments. Internal exception messages,
            stack traces, and MongoDB query details are never exposed to clients. All internal errors are
            logged to Application Insights with full context for debugging, but the GraphQL response
            contains only a generic "Internal server error" message.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 15: KEY TAKEAWAYS ============ */}
      <section id="takeaways" style={sectionSpacing}>
        <SectionHeader
          label="Summary"
          title="Key Takeaways"
          description="Essential points about the GraphQL exposure layer for SRP and inventory"
        />
        <motion.div {...fadeUp}>
          <div style={cardGrid}>
            <Card variant="blue" title="11 Focused Queries">
              <p style={infoCardText}>
                The module exposes exactly 11 queries across four categories: search, single lookups,
                batch lookups, and availability checks. Each query has a single responsibility and
                follows the same validation-pipeline-execution-mapping pattern.
              </p>
            </Card>
            <Card variant="green" title="Parallel Execution">
              <p style={infoCardText}>
                The search query runs vehicle results and count queries concurrently using Kotlin
                coroutines, cutting response latency nearly in half compared to sequential execution.
              </p>
            </Card>
            <Card variant="purple" title="18 Validation Rules">
              <p style={infoCardText}>
                Every search and facet query passes through 18 input validation rules before touching
                the database. This prevents invalid queries from consuming Atlas Search resources
                and provides clear error messages to clients.
              </p>
            </Card>
            <Card variant="cyan" title="Auto-Generated Schema">
              <p style={infoCardText}>
                The GraphQL schema is auto-generated from Kotlin data classes by graphql-kotlin v7.0.2.
                There are no hand-written <code>.graphqls</code> files to keep in sync, reducing the
                risk of schema drift.
              </p>
            </Card>
            <Card variant="yellow" title="Layered Error Handling">
              <p style={infoCardText}>
                Client errors (InvalidInput, NotFound) are always surfaced with descriptive messages.
                Internal errors are redacted in production to prevent information leakage, while full
                details are logged to Application Insights.
              </p>
            </Card>
            <Card variant="red" title="Batch-Safe Design">
              <p style={infoCardText}>
                Batch queries return per-item FOUND/NOT_FOUND status instead of throwing on the first
                miss, allowing callers to handle partial results gracefully without the entire batch
                failing.
              </p>
            </Card>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={{ ...spacer, marginBottom: '4rem' }}>
          <div style={keyTakeaway}>
            <p style={{ ...para, marginBottom: 0, color: c.text }}>
              <strong>Summary:</strong> The odyssey-search-graphql module provides a complete, type-safe
              GraphQL API for vehicle search and retrieval. With 11 queries, 18 validation rules, parallel
              pipeline execution, and layered error handling, it serves as the primary data gateway for the
              SRP, VDP, cart service, and admin tools. The auto-generated schema from Kotlin classes ensures
              the API contract stays in sync with the implementation.
            </p>
          </div>
        </motion.div>
      </section>
    </>
  );
}
