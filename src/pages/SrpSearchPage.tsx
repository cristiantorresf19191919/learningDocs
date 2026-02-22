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
/*  Animation presets                                                   */
/* ------------------------------------------------------------------ */
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
  { id: 'query-entry', label: 'Query Entry Point' },
  { id: 'input-structure', label: 'Input Structure' },
  { id: 'filter-parsing', label: 'Filter Parsing' },
  { id: 'make-model-trim', label: 'Make / Model / Trim' },
  { id: 'range-filters', label: 'Range Filters' },
  { id: 'string-filters', label: 'String Filters' },
  { id: 'leasing-filter', label: 'Leasing Filter' },
  { id: 'shipping-filter', label: 'Shipping Filter' },
  { id: 'sorting', label: 'Sorting & Ranking' },
  { id: 'scoring', label: 'Scoring Engine' },
  { id: 'pagination', label: 'Pagination' },
  { id: 'availability', label: 'Availability' },
  { id: 'indexes', label: 'Required Indexes' },
  { id: 'example-request', label: 'Example Request' },
  { id: 'takeaways', label: 'Key Takeaways' },
];

/* ------------------------------------------------------------------ */
/*  Mermaid Diagrams                                                   */
/* ------------------------------------------------------------------ */
const pipelineBuilderFlow = `flowchart TD
    A[GraphQL search query] --> B[SearchPageQueries.kt]
    B --> C{Validate commonInputs}
    C -->|Invalid| D[Return validation error]
    C -->|Valid| E[FilterBuilder.kt]
    E --> F[Base filters: status=ACTIVE, not suppressed]
    E --> G[User filters: condition, make/model, price, etc.]
    F --> H[SearchOperatorBuilder.kt]
    G --> H
    H --> I{Load SearchScoreWeights}
    I --> J[Build text search blocks with fuzzy]
    I --> K[Build score factors from weights]
    J --> L[CompoundBlock: must + should + filter]
    K --> L
    L --> M[ShippingBuilder.kt]
    M --> N[Free shipping boost]
    M --> O[Shipping fee calculation via addFields]
    L --> P[LeasingBuilder.kt]
    P --> Q[Region mapping via PostalCodeOemRegionCache]
    P --> R[Leasing price addFields]
    L --> S[PageBuilder.kt]
    S --> T[$skip + $limit]
    L --> U[Parallel: vehicle pipeline + count pipeline]
    U --> V[MongoDB Atlas Search aggregation]
    V --> W[VehicleResults response]
    style A fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0
    style B fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0
    style C fill:#3a2f1e,stroke:#f59e0b,color:#e2e8f0
    style D fill:#3b1515,stroke:#ef4444,color:#e2e8f0
    style E fill:#1e3a2f,stroke:#10b981,color:#e2e8f0
    style F fill:#2d1e3a,stroke:#8b5cf6,color:#e2e8f0
    style G fill:#2d1e3a,stroke:#8b5cf6,color:#e2e8f0
    style H fill:#1e3a5f,stroke:#06b6d4,color:#e2e8f0
    style I fill:#3a2f1e,stroke:#f59e0b,color:#e2e8f0
    style J fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0
    style K fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0
    style L fill:#2d1e3a,stroke:#ec4899,color:#e2e8f0
    style M fill:#1e3a2f,stroke:#10b981,color:#e2e8f0
    style N fill:#1e3a2f,stroke:#10b981,color:#e2e8f0
    style O fill:#1e3a2f,stroke:#10b981,color:#e2e8f0
    style P fill:#3a2f1e,stroke:#f59e0b,color:#e2e8f0
    style Q fill:#3a2f1e,stroke:#f59e0b,color:#e2e8f0
    style R fill:#3a2f1e,stroke:#f59e0b,color:#e2e8f0
    style S fill:#2d1e3a,stroke:#8b5cf6,color:#e2e8f0
    style T fill:#2d1e3a,stroke:#8b5cf6,color:#e2e8f0
    style U fill:#1e3a5f,stroke:#06b6d4,color:#e2e8f0
    style V fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0
    style W fill:#1e3a2f,stroke:#10b981,color:#e2e8f0`;

const makeModelTrimFlow = `flowchart TD
    A[MakeModelTrimFilter input] --> B{Has models?}
    B -->|No| C[TextBlock: make only]
    B -->|Yes| D{Has trims?}
    D -->|No| E[TextBlock: make + model]
    D -->|Yes| F[TextBlock: make + model + trim]
    C --> G[CompoundBlock with minimumShouldMatch: 1]
    E --> G
    F --> G
    G --> H[OR logic: any matching make/model/trim passes]
    style A fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0
    style B fill:#3a2f1e,stroke:#f59e0b,color:#e2e8f0
    style C fill:#1e3a2f,stroke:#10b981,color:#e2e8f0
    style D fill:#3a2f1e,stroke:#f59e0b,color:#e2e8f0
    style E fill:#2d1e3a,stroke:#8b5cf6,color:#e2e8f0
    style F fill:#2d1e3a,stroke:#ec4899,color:#e2e8f0
    style G fill:#1e3a5f,stroke:#06b6d4,color:#e2e8f0
    style H fill:#1e3a2f,stroke:#10b981,color:#e2e8f0`;

const scoringFlow = `sequenceDiagram
    participant GQL as GraphQL Query
    participant SOB as SearchOperatorBuilder
    participant Cache as SearchScoreWeights Cache
    participant FB as FilterBuilder
    participant SB as ShippingBuilder
    participant LB as LeasingBuilder
    participant Mongo as MongoDB Atlas Search

    GQL->>SOB: buildSearchOperator(commonInputs)
    SOB->>SOB: Map SortCriteria to SortType
    SOB->>Cache: getWeights(sortType, condition)
    Cache-->>SOB: SearchScoreWeights (versioned)
    SOB->>SOB: Build TextBlocks (fuzzy, per-field boost)
    SOB->>FB: buildFilters(filterInput)
    FB-->>SOB: List of SearchBlocks (base + user)
    SOB->>SB: buildShippingBoost(postalCode)
    SB-->>SOB: Free shipping boost block
    SOB->>LB: buildLeasingFilter(postalCode, priceRange)
    LB-->>SOB: Leasing region filter block
    SOB->>SOB: Assemble CompoundBlock
    Note over SOB: must: text search blocks
    Note over SOB: should: scoring factor blocks
    Note over SOB: filter: base + user filter blocks
    SOB->>Mongo: $search aggregation pipeline
    Mongo-->>GQL: Scored & filtered results`;

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
    'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)',
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
export default function SrpSearchPage() {
  const { setSidebar, clearSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('SRP Search', tocItems);
    return () => clearSidebar();
  }, []);

  return (
    <div style={page}>
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section style={heroSection}>
        <div style={heroGradientBg} />
        <motion.div style={heroContent} {...fadeUp}>
          <h1 style={heroTitle}>
            SRP Search
            <br />
            & Filtering Logic
          </h1>
          <p style={heroSubtitle}>
            Complete documentation of the MongoDB Atlas Search pipeline powering the Shop Results
            Page &mdash; 12+ filter types, configurable scoring, region-aware leasing/shipping
            calculations, and parallel aggregation pipelines.
          </p>
          <div style={badgeRow}>
            <Badge label="MongoDB Atlas Search" color="green" dot />
            <Badge label="GraphQL" color="blue" dot />
            <Badge label="12+ Filters" color="purple" dot />
            <Badge label="Configurable Scoring" color="cyan" dot />
            <Badge label="Region-Aware" color="pink" dot />
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  OVERVIEW                                                    */}
      {/* ============================================================ */}
      <motion.section id="overview" style={section} {...fadeUp}>
        <SectionHeader
          label="Architecture"
          title="Search System Overview"
          description="The SRP search system uses MongoDB Atlas Search with a custom ranking/scoring engine built inside the Odyssey-Api."
        />
        <p style={prose}>
          The GraphQL query <code>search()</code> defined in <code>SearchPageQueries.kt</code> builds
          MongoDB aggregation pipelines with 12+ filter types, configurable scoring weights, and
          region-aware leasing/shipping calculations. The pipeline is assembled by a chain of
          builders: <code>FilterBuilder</code>, <code>SearchOperatorBuilder</code>,{' '}
          <code>ShippingBuilder</code>, <code>LeasingBuilder</code>, and <code>PageBuilder</code>.
        </p>

        <div style={gridThree}>
          <Card title="FilterBuilder.kt" variant="green">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Parses user-submitted filter inputs into Atlas Search blocks. Applies base filters
              (status=ACTIVE, not suppressed) and combines with user filters via AND/OR logic.
            </p>
          </Card>
          <Card title="SearchOperatorBuilder.kt" variant="blue">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Maps <code>SortCriteria</code> to versioned <code>SearchScoreWeights</code>,
              builds text search blocks with fuzzy matching, and assembles the final CompoundBlock
              (must + should + filter).
            </p>
          </Card>
          <Card title="ShippingBuilder.kt" variant="purple">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Calculates shipping fees based on user postal code and dealer zone configuration.
              Adds free shipping boost and computes <code>shippingFee</code> via <code>$addFields</code>.
            </p>
          </Card>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <MermaidViewer
            title="Search Pipeline Builder Flow"
            tabs={[{ label: 'Pipeline Flow', source: pipelineBuilderFlow }]}
          />
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  QUERY ENTRY POINT                                           */}
      {/* ============================================================ */}
      <motion.section id="query-entry" style={section} {...fadeUp}>
        <SectionHeader
          label="Entry Point"
          title="GraphQL Query Entry Point"
          description="The search() query is the main entry point for all SRP vehicle searches."
        />

        <CodeBlock
          code={`# SearchPageQueries.kt - GraphQL schema
type Query {
  search(commonInputs: VehicleCommonInputs): VehicleResults
  getFacets(commonInputs: VehicleCommonInputs): FacetResults
  getSearchSuggestions(searchTerm: String!): [SearchSuggestion]
}

type VehicleResults {
  vehicles: [Vehicle]
  pageInfo: PageInfo
}`}
          language="graphql"
          filename="SearchPageQueries.kt - GraphQL Schema"
        />

        <div style={gridTwo}>
          <Card title="Input Validation" variant="yellow">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              <code>commonInputs.validate()</code> checks pagination bounds (skip max 2376,
              items max 500), validates location data, and sanitizes filter characters to prevent
              injection. Invalid inputs return a validation error before pipeline construction.
            </p>
          </Card>
          <Card title="Parallel Execution" variant="cyan">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Two pipelines run in parallel: the <strong>vehicle search pipeline</strong> (returns
              matched documents) and the <strong>count pipeline</strong> (uses <code>$searchMeta</code>
              to return totalItems). The count pipeline only runs when <code>totalItems</code> is
              requested in the GraphQL selection set.
            </p>
          </Card>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <Callout type="info" title="Supporting Queries">
            <code>getFacets()</code> returns aggregated filter counts (e.g., how many vehicles per
            make/model) for the sidebar. <code>getSearchSuggestions()</code> powers the autocomplete
            dropdown using the <code>searchSuggestion</code> collection with an autocomplete index
            on the <code>value</code> field.
          </Callout>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  INPUT STRUCTURE                                             */}
      {/* ============================================================ */}
      <motion.section id="input-structure" style={section} {...fadeUp}>
        <SectionHeader
          label="Inputs"
          title="Input Structure (VehicleCommonInputs)"
          description="The primary input type that drives search, filtering, sorting, and pagination."
        />

        <CodeBlock
          code={`input VehicleCommonInputs {
  sortCriteria: SortCriteria        # Sorting strategy
  filterInput: Filters              # 12+ filter types
  paginationInput: PaginationInput  # skip & items
  searchTerm: String                # Free-text search
  userLocation: UserLocation        # state, postalCode
}

enum SortCriteria {
  RELEVANCE
  PRICE_LOWEST
  PRICE_HIGHEST
  SHIPPING_FEE_LOWEST
  LEASING_LOWEST
  MILEAGE_LOWEST
  YEAR_NEWEST
  YEAR_OLDEST
  INVENTORY_NEWEST
}

input PaginationInput {
  skip: Int    # Default: 0, Max: 2376
  items: Int   # Default: 24, Max: 500
}

input UserLocation {
  state: String
  postalCode: String
}`}
          language="graphql"
          filename="VehicleCommonInputs Schema"
        />

        <div style={{ marginTop: '1.5rem' }}>
          <DataTable
            headers={['Field', 'Type', 'Default', 'Max', 'Description']}
            rows={[
              ['sortCriteria', 'SortCriteria', 'RELEVANCE', '--', 'Determines scoring weights and sort factors'],
              ['filterInput', 'Filters', 'null', '--', 'Object containing 12+ filter type fields'],
              ['paginationInput.skip', 'Int', '0', '2376', 'Offset for pagination (page * items)'],
              ['paginationInput.items', 'Int', '24', '500', 'Page size (number of vehicles per page)'],
              ['searchTerm', 'String', 'null', '--', 'Free-text search with fuzzy matching'],
              ['userLocation.state', 'String', 'null', '--', 'Two-letter state code for shipping'],
              ['userLocation.postalCode', 'String', 'null', '--', 'Zip code for leasing region & shipping'],
            ]}
          />
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  FILTER PARSING                                              */}
      {/* ============================================================ */}
      <motion.section id="filter-parsing" style={section} {...fadeUp}>
        <SectionHeader
          label="Filters"
          title="Filter Parsing (FilterBuilder.kt)"
          description="FilterBuilder.kt translates user filter inputs into MongoDB Atlas Search query blocks."
        />

        <Callout type="warning" title="Base Filters Always Applied">
          Every search query includes <code>status = ACTIVE</code> and{' '}
          <code>manuallySuppressed = false</code> as non-negotiable base filters. These cannot be
          overridden by user input.
        </Callout>

        <div style={{ marginTop: '1.5rem' }}>
          <DataTable
            headers={['Filter Type', 'Input Field', 'Atlas Search Block', 'Logic', 'Example']}
            rows={[
              ['Base: Status', '(always)', 'QueryStringBlock', 'AND', 'status:ACTIVE'],
              ['Base: Suppressed', '(always)', 'QueryStringBlock', 'AND', 'manuallySuppressed:false'],
              ['Condition', 'vehicleCondition', 'QueryStringBlock', 'OR', 'DEFAULT = [USED, CPO]'],
              ['Make/Model/Trim', 'makeModelTrims', 'CompoundBlock + TextBlocks', 'OR (min 1)', 'Toyota Camry XSE'],
              ['Price Range', 'priceRange', 'RangeBlock', 'AND (gte/lte)', '10000..50000'],
              ['Mileage Range', 'mileageRange', 'RangeBlock', 'AND (gte/lte)', '0..50000'],
              ['Year Range', 'yearRange', 'RangeBlock', 'AND (gte/lte)', '2020..2024'],
              ['MPG Highway', 'mpgHighwayRange', 'RangeBlock', 'AND (gte/lte)', '30..60'],
              ['Exterior Colors', 'exteriorColors', 'QueryStringBlock', 'OR', 'Black OR White OR Red'],
              ['Interior Colors', 'interiorColors', 'QueryStringBlock', 'OR', 'Black OR Brown'],
              ['Body Styles', 'bodyStyles', 'QueryStringBlock', 'OR', 'SUV OR Sedan OR Truck'],
              ['Fuel Types', 'fuelTypes', 'QueryStringBlock', 'OR', 'Gasoline OR Electric OR Hybrid'],
              ['Drive Types', 'driveTypes', 'QueryStringBlock', 'OR', 'AWD OR FWD OR RWD'],
              ['Transmissions', 'transmissions', 'QueryStringBlock', 'OR', 'Automatic OR Manual'],
              ['Engines', 'engines', 'QueryStringBlock', 'OR', '4-Cylinder OR V6'],
              ['Leasing', 'leasingFilter', 'CompoundBlock + RangeBlock', 'AND', 'regionId + price range'],
              ['Shipping', 'shippingFilter', 'QueryStringBlock + boost', 'AND', 'Free shipping zone match'],
            ]}
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <Callout type="info" title="Filter Combination Logic">
            Filters of different types are combined with <strong>AND</strong> logic (all must match).
            Values within the same filter type are combined with <strong>OR</strong> logic
            (any value can match). For example: <code>(bodyStyle:SUV OR bodyStyle:Sedan) AND
            (fuelType:Electric OR fuelType:Hybrid)</code>.
          </Callout>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  MAKE / MODEL / TRIM                                         */}
      {/* ============================================================ */}
      <motion.section id="make-model-trim" style={section} {...fadeUp}>
        <SectionHeader
          label="Hierarchical"
          title="Make / Model / Trim Filter"
          description="The most complex filter uses a hierarchical structure with nested models and trims."
        />

        <CodeBlock
          code={`input MakeModelTrimFilter {
  make: String!             # e.g. "Toyota"
  models: [ModelTrimFilter] # optional nested models
}

input ModelTrimFilter {
  model: String!            # e.g. "Camry"
  trims: [String]           # optional, e.g. ["XSE", "TRD"]
}

# Filter logic (FilterBuilder.kt):
# 1. If no models -> TextBlock(make, keyword analyzer)
# 2. If models but no trims -> TextBlock(make) + TextBlock(model)
# 3. If trims -> TextBlock(make) + TextBlock(model) + TextBlock(trim)
# All wrapped in CompoundBlock(minimumShouldMatch = 1) for OR logic`}
          language="graphql"
          filename="MakeModelTrimFilter Schema"
        />

        <div style={{ marginTop: '1.5rem' }}>
          <MermaidViewer
            title="Make/Model/Trim Filter Logic"
            tabs={[{ label: 'Decision Flow', source: makeModelTrimFlow }]}
          />
        </div>

        <div style={gridThree}>
          <Card title="Make Only" variant="blue">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              <code>make: "Toyota"</code> with no models. Generates a single{' '}
              <code>TextBlock</code> targeting the <code>make</code> field with the keyword
              analyzer.
            </p>
          </Card>
          <Card title="Make + Model" variant="green">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              <code>make: "Toyota", models: ["Camry"]</code>. Generates two{' '}
              <code>TextBlocks</code> in a CompoundBlock targeting both <code>make</code> and{' '}
              <code>model</code> fields.
            </p>
          </Card>
          <Card title="Make + Model + Trim" variant="purple">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              <code>make: "Toyota", models: [model: "Camry", trims: ["XSE"]]</code>. Three{' '}
              <code>TextBlocks</code> for make, model, and trim. Combined with{' '}
              <code>minimumShouldMatch: 1</code>.
            </p>
          </Card>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  RANGE FILTERS                                               */}
      {/* ============================================================ */}
      <motion.section id="range-filters" style={section} {...fadeUp}>
        <SectionHeader
          label="Numeric"
          title="Range Filters"
          description="Numeric range filters use RangeBlock with gte (greater than or equal) and lte (less than or equal) bounds."
        />

        <DataTable
          headers={['Filter', 'Field Path', 'Type', 'Min Default', 'Max Default', 'Notes']}
          rows={[
            ['Mileage', 'mileage', 'Int', '0', '--', 'Vehicle odometer reading in miles'],
            ['Year', 'year', 'Int', '--', '--', 'Model year (e.g. 2020..2024)'],
            ['MPG Highway', 'fuelEconomy.highway', 'Double', '--', '--', 'EPA highway fuel economy rating'],
            ['Price', 'price', 'Int', '--', '--', 'Listing price in whole dollars'],
          ]}
        />

        <div style={{ marginTop: '1rem' }}>
          <CodeBlock
            code={`// FilterBuilder.kt - Range filter construction
fun buildRangeFilter(field: String, min: Int?, max: Int?): RangeBlock {
    return RangeBlock(
        path = field,
        gte = min,   // null means no lower bound
        lte = max    // null means no upper bound
    )
}

// Example: mileage 0..50,000
// Generates: { range: { path: "mileage", gte: 0, lte: 50000 } }`}
            language="kotlin"
            filename="FilterBuilder.kt"
          />
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  STRING FILTERS                                              */}
      {/* ============================================================ */}
      <motion.section id="string-filters" style={section} {...fadeUp}>
        <SectionHeader
          label="Categorical"
          title="String Filters"
          description="String-based categorical filters use QueryStringBlock with OR logic within each filter type."
        />

        <p style={prose}>
          Each string filter generates a query in the format{' '}
          <code>field:(val1 OR val2 OR val3)</code>. Multiple filter types are joined with AND.
          Values containing whitespace are automatically quoted to prevent tokenization issues.
        </p>

        <DataTable
          headers={['Filter', 'Field Path', 'Example Values', 'Query String Generated']}
          rows={[
            ['Exterior Colors', 'exteriorColor', 'Black, White, Red', 'exteriorColor:(Black OR White OR Red)'],
            ['Interior Colors', 'interiorColor', 'Black, Brown', 'interiorColor:(Black OR Brown)'],
            ['Body Styles', 'bodyStyle', 'SUV, Sedan, Truck', 'bodyStyle:(SUV OR Sedan OR Truck)'],
            ['Fuel Types', 'fuelType', 'Gasoline, Electric', 'fuelType:(Gasoline OR Electric)'],
            ['Drive Types', 'driveType', 'AWD, FWD, 4WD', 'driveType:(AWD OR FWD OR 4WD)'],
            ['Transmissions', 'transmission', 'Automatic, Manual', 'transmission:(Automatic OR Manual)'],
            ['Engines', 'engine', '4-Cylinder, V6, V8', 'engine:("4-Cylinder" OR V6 OR V8)'],
          ]}
        />

        <div style={{ marginTop: '1rem' }}>
          <CodeBlock
            code={`// FilterBuilder.kt - String filter construction
fun buildStringFilter(field: String, values: List<String>): QueryStringBlock {
    val quoted = values.map { value ->
        if (value.contains(" ")) "\"$value\"" else value
    }
    val queryString = "$field:(${'${quoted.joinToString(" OR ")}'})"
    return QueryStringBlock(defaultPath = field, query = queryString)
}

// Multiple string filters combined with AND:
// exteriorColor:(Black OR White) AND bodyStyle:(SUV OR Sedan) AND fuelType:(Electric)`}
            language="kotlin"
            filename="FilterBuilder.kt"
          />
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  LEASING FILTER                                              */}
      {/* ============================================================ */}
      <motion.section id="leasing-filter" style={section} {...fadeUp}>
        <SectionHeader
          label="Leasing"
          title="Leasing Filter (LeasingBuilder.kt)"
          description="Leasing filters require postal code to determine the OEM region, then filter by region and optional price range."
        />

        <div style={gridTwo}>
          <Card title="Region Resolution" variant="yellow">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              <strong>PostalCodeOemRegionCache</strong> maps the user's postal code to an OEM region
              ID per make. This cache is populated by the Postal Code Region Sync cron job (4x daily).
              If no postal code is provided, the leasing filter is skipped entirely.
            </p>
          </Card>
          <Card title="Pipeline Stages" variant="cyan">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              1. Filter by <code>leasing.regionalPrices.regionId</code> matching user's region<br />
              2. Optional: RangeBlock on <code>leasing.defaultPrice</code> for price bounds<br />
              3. <code>$addFields</code> computes <code>leasing.defaultPrice</code> for the user's
              specific region from <code>regionalPrices</code> array
            </p>
          </Card>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <CodeBlock
            code={`// LeasingBuilder.kt - Leasing filter construction
fun buildLeasingFilter(postalCode: String?, priceRange: Range?): List<SearchBlock> {
    if (postalCode == null) return emptyList()

    val regionId = postalCodeOemRegionCache.getRegionId(postalCode)
        ?: return emptyList()

    val blocks = mutableListOf<SearchBlock>()

    // Filter: vehicle must have leasing for this region
    blocks += QueryStringBlock(
        defaultPath = "leasing.regionalPrices.regionId",
        query = regionId
    )

    // Optional: price range on leasing monthly payment
    if (priceRange != null) {
        blocks += RangeBlock(
            path = "leasing.defaultPrice",
            gte = priceRange.min,
            lte = priceRange.max
        )
    }

    return blocks
}

// $addFields stage: compute defaultPrice for user's region
// { $addFields: { "leasing.defaultPrice": {
//     $let: { vars: { regionPrice: { $first: { $filter: {
//         input: "$leasing.regionalPrices",
//         cond: { $eq: ["$$this.regionId", "<userRegionId>"] }
//     }}}},
//     in: "$$regionPrice.monthlyPayment" }
// }}}`}
            language="kotlin"
            filename="LeasingBuilder.kt"
          />
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  SHIPPING FILTER                                             */}
      {/* ============================================================ */}
      <motion.section id="shipping-filter" style={section} {...fadeUp}>
        <SectionHeader
          label="Shipping"
          title="Shipping Filter & Scoring (ShippingBuilder.kt)"
          description="Shipping logic checks if the user qualifies for free shipping and calculates shipping fees."
        />

        <div style={gridTwo}>
          <Card title="Free Shipping Check" variant="green">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Checks if the user's <code>postalCode</code> is in the dealer's{' '}
              <code>zoneZips</code> array. If yes, <code>shippingFee = 0</code> (free shipping).
              If no, <code>shippingFee = dealer.stateShippingMap[userState]</code> for the
              applicable state-based rate.
            </p>
          </Card>
          <Card title="Scoring Boost" variant="pink">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Free shipping vehicles receive a boost via <code>SearchBlockTemplate</code> in the
              should clause of the CompoundBlock. When sorting by <code>SHIPPING_FEE_LOWEST</code>,
              the base shipping boost uses an inverse relationship to the fee amount (lower fee =
              higher score).
            </p>
          </Card>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <CodeBlock
            code={`// ShippingBuilder.kt - Shipping fee calculation
// $addFields stage added to the aggregation pipeline:
{
  "$addFields": {
    "shippingFee": {
      "$cond": {
        "if": {
          "$in": ["<userPostalCode>", "$dealer.zoneZips"]
        },
        "then": 0,               // Free shipping
        "else": {
          "$ifNull": [
            "$dealer.stateShippingMap.<userState>",
            999                   // Default high fee if no state mapping
          ]
        }
      }
    }
  }
}

// Free shipping boost block (added to should clause):
SearchBlockTemplate(
  path = "dealer.zoneZips",
  query = "<userPostalCode>",
  score = { boost: { value: 5.0 } }
)`}
            language="json"
            filename="ShippingBuilder.kt"
          />
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  SORTING & RANKING                                           */}
      {/* ============================================================ */}
      <motion.section id="sorting" style={section} {...fadeUp}>
        <SectionHeader
          label="Sorting"
          title="Sorting & Ranking (SearchOperatorBuilder.kt)"
          description="SortCriteria maps to a SortType which loads versioned scoring weights from cache."
        />

        <DataTable
          headers={['SortCriteria', 'SortType (USED/CPO)', 'SortType (NEW)', 'Primary Factor']}
          rows={[
            ['RELEVANCE', 'RELEVANCE_USED', 'RELEVANCE_NEW', 'Text match score + boost factors'],
            ['PRICE_LOWEST', 'PRICE_LOWEST_USED', 'PRICE_LOWEST_NEW', 'price ASC'],
            ['PRICE_HIGHEST', 'PRICE_HIGHEST_USED', 'PRICE_HIGHEST_NEW', 'price DESC'],
            ['SHIPPING_FEE_LOWEST', 'SHIPPING_LOWEST', 'SHIPPING_LOWEST', 'shippingFee ASC'],
            ['LEASING_LOWEST', 'LEASING_LOWEST', 'LEASING_LOWEST', 'leasing.defaultPrice ASC'],
            ['MILEAGE_LOWEST', 'MILEAGE_LOWEST_USED', 'MILEAGE_LOWEST_NEW', 'mileage ASC'],
            ['YEAR_NEWEST', 'YEAR_NEWEST_USED', 'YEAR_NEWEST_NEW', 'year DESC'],
            ['YEAR_OLDEST', 'YEAR_OLDEST_USED', 'YEAR_OLDEST_NEW', 'year ASC'],
            ['INVENTORY_NEWEST', 'INVENTORY_NEWEST', 'INVENTORY_NEWEST', 'createdOn DESC'],
          ]}
          highlightColumn={0}
        />

        <div style={{ marginTop: '1rem' }}>
          <Callout type="info" title="Condition-Aware Sorting">
            The <code>SortCriteria</code> to <code>SortType</code> mapping is condition-aware.
            NEW vehicles use separate weight configurations from USED/CPO vehicles because pricing,
            mileage, and relevance factors differ significantly between new and pre-owned inventory.
          </Callout>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <CodeBlock
            code={`// SearchOperatorBuilder.kt - SortType resolution
fun resolveSortType(criteria: SortCriteria, condition: VehicleCondition): SortType {
    return when (criteria) {
        RELEVANCE -> if (condition == NEW) RELEVANCE_NEW else RELEVANCE_USED
        PRICE_LOWEST -> if (condition == NEW) PRICE_LOWEST_NEW else PRICE_LOWEST_USED
        PRICE_HIGHEST -> if (condition == NEW) PRICE_HIGHEST_NEW else PRICE_HIGHEST_USED
        MILEAGE_LOWEST -> if (condition == NEW) MILEAGE_LOWEST_NEW else MILEAGE_LOWEST_USED
        YEAR_NEWEST -> if (condition == NEW) YEAR_NEWEST_NEW else YEAR_NEWEST_USED
        YEAR_OLDEST -> if (condition == NEW) YEAR_OLDEST_NEW else YEAR_OLDEST_USED
        SHIPPING_FEE_LOWEST -> SHIPPING_LOWEST
        LEASING_LOWEST -> LEASING_LOWEST
        INVENTORY_NEWEST -> INVENTORY_NEWEST
    }
}`}
            language="kotlin"
            filename="SearchOperatorBuilder.kt"
          />
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  SCORING ENGINE                                              */}
      {/* ============================================================ */}
      <motion.section id="scoring" style={section} {...fadeUp}>
        <SectionHeader
          label="Scoring"
          title="Scoring Engine"
          description="Versioned SearchScoreWeights loaded from cache drive text search boosting and sort factor scoring."
        />

        <MermaidViewer
          title="Scoring Pipeline Sequence"
          tabs={[{ label: 'Scoring Flow', source: scoringFlow }]}
        />

        <div style={{ marginTop: '1.5rem' }}>
          <CodeBlock
            code={`// SearchScoreWeights (stored in MongoDB, cached in-memory)
data class SearchScoreWeights(
    val sortType: SortType,
    val version: Int,
    val textSearchWeights: Map<String, Double>,  // field -> boost value
    val sortFactors: List<SortFactor>             // static + placeholder factors
)

// Text search: per-field TextBlock with fuzzy matching
TextBlock(
    query = searchTerm,
    path = "make",
    fuzzy = FuzzyOptions(
        maxEdits = 1,           // Allow 1 character edit (typo tolerance)
        prefixLength = 0,       // No prefix required for fuzzy
        maxExpansions = 50      // Max term expansions for fuzzy
    ),
    score = { boost: { value: textSearchWeights["make"] ?: 1.0 } }
)

// CompoundBlock assembly:
CompoundBlock(
    must = listOf(textSearchBlocks),     // Text must match
    should = listOf(scoreFactorBlocks),  // Boost scoring factors
    filter = listOf(baseFilters + userFilters)  // Hard filters
)`}
            language="kotlin"
            filename="SearchScoreWeights & CompoundBlock"
          />
        </div>

        <div style={gridTwo}>
          <Card title="Text Search Weights" variant="blue">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Each searchable field (make, model, trim, year, etc.) has a configurable boost weight.
              Higher weights mean matches on that field contribute more to the relevance score.
              Weights are versioned and stored in the <code>searchScoreWeights</code> MongoDB
              collection.
            </p>
          </Card>
          <Card title="Sort Factors" variant="orange">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Sort factors are additional scoring signals beyond text relevance. They include
              static factors (e.g., photo count boost) and placeholder factors that are resolved
              at query time (e.g., shipping proximity, inventory freshness). These go in the{' '}
              <code>should</code> clause of the CompoundBlock.
            </p>
          </Card>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  PAGINATION                                                  */}
      {/* ============================================================ */}
      <motion.section id="pagination" style={section} {...fadeUp}>
        <SectionHeader
          label="Pages"
          title="Pagination (PageBuilder.kt)"
          description="Standard skip/limit pagination with parallel count pipeline."
        />

        <DataTable
          headers={['Parameter', 'Stage', 'Default', 'Max', 'Description']}
          rows={[
            ['skip', '$skip', '0', '2376', 'Number of documents to skip (offset)'],
            ['items', '$limit', '24', '500', 'Number of documents to return (page size)'],
            ['totalItems', '$searchMeta', '--', '--', 'Total matching count (parallel pipeline)'],
          ]}
        />

        <div style={{ marginTop: '1rem' }}>
          <CodeBlock
            code={`// PageBuilder.kt - Pagination pipeline stages
fun buildPaginationStages(pagination: PaginationInput): List<Bson> {
    val skip = (pagination.skip ?: 0).coerceIn(0, 2376)
    val limit = (pagination.items ?: 24).coerceIn(1, 500)

    return listOf(
        Aggregates.skip(skip),
        Aggregates.limit(limit)
    )
}

// Count pipeline (parallel via $searchMeta):
// Runs the same $search operator but only returns count
val countPipeline = listOf(
    Aggregates.searchMeta(searchOperator),  // Same filters, no docs
)
// Returns: { count: { total: 12345 } }

// Response:
data class PageInfo(
    val skip: Int,       // Current offset
    val items: Int,      // Current page size
    val totalItems: Int  // Total matching vehicles
)`}
            language="kotlin"
            filename="PageBuilder.kt"
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <Callout type="warning" title="Max Pagination Depth">
            The maximum <code>skip</code> value of 2376 with a page size of 24 means the deepest
            accessible page is page 100 (2376 / 24 = 99 zero-indexed). This is intentional to
            prevent expensive deep pagination queries on MongoDB Atlas Search.
          </Callout>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  AVAILABILITY                                                */}
      {/* ============================================================ */}
      <motion.section id="availability" style={section} {...fadeUp}>
        <SectionHeader
          label="Availability"
          title="Vehicle Availability"
          description="Availability checks prevent users from purchasing vehicles that are already claimed or in transit."
        />

        <CodeBlock
          code={`// Availability model on vehicleV3 document
data class Availability(
    val purchasePending: Boolean,    // Vehicle is in someone's cart
    val salesPending: Boolean,       // Sale in progress
    val salesBooked: Boolean,        // Sale completed
    val inventoryInTransit: Boolean, // Vehicle being transported
    val reconOrderOpen: Boolean      // Reconditioning order open
)

// Cart eligibility check:
fun isReadyForCart(): Boolean {
    return !(purchasePending || salesPending || salesBooked || inventoryInTransit)
    // NOTE: reconOrderOpen does NOT block cart addition
}`}
          language="kotlin"
          filename="Availability Model"
        />

        <div style={gridTwo}>
          <Card title="Blocks Cart" variant="red">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li><code>purchasePending = true</code> -- vehicle in another user's cart</li>
              <li><code>salesPending = true</code> -- sale being processed</li>
              <li><code>salesBooked = true</code> -- sale completed</li>
              <li><code>inventoryInTransit = true</code> -- vehicle being shipped</li>
            </ul>
          </Card>
          <Card title="Does NOT Block Cart" variant="green">
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: c.text2, lineHeight: 1.8 }}>
              <li><code>reconOrderOpen = true</code> -- reconditioning in progress</li>
              <li>Vehicles with open recon orders can still be added to cart and purchased</li>
            </ul>
          </Card>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <Callout type="info" title="Availability Query Endpoints">
            <code>checkAvailabilityOfVin(vin: String)</code> and{' '}
            <code>checkAvailabilityOfVehicleId(vehicleId: String)</code> are dedicated GraphQL
            queries that return the full availability state of a specific vehicle. These are called
            before adding a vehicle to cart.
          </Callout>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  REQUIRED INDEXES                                            */}
      {/* ============================================================ */}
      <motion.section id="indexes" style={section} {...fadeUp}>
        <SectionHeader
          label="Indexes"
          title="Required Indexes"
          description="MongoDB Atlas Search indexes and standard indexes required for the search pipeline."
        />

        <Tabs
          tabs={[
            {
              label: 'Atlas Search Indexes',
              content: (
                <div>
                  <DataTable
                    headers={['Index Name', 'Collection', 'Type', 'Key Fields', 'Notes']}
                    rows={[
                      [
                        <strong style={{ color: c.accent }}>shopSearch</strong>,
                        'vehicleV3',
                        'Atlas Search',
                        '50+ fields (make, model, trim, price, year, mileage, status, etc.)',
                        'Primary search index for SRP. Supports text, range, and facet queries.',
                      ],
                      [
                        <strong style={{ color: c.green }}>shopSuggestions</strong>,
                        'searchSuggestion',
                        'Atlas Search (autocomplete)',
                        'value (autocomplete)',
                        'Powers the search autocomplete dropdown. Indexed with autocomplete tokenization.',
                      ],
                    ]}
                  />
                </div>
              ),
            },
            {
              label: 'Standard Indexes',
              content: (
                <div>
                  <DataTable
                    headers={['Index Key(s)', 'Collection', 'Purpose']}
                    rows={[
                      ['{ vin: 1 }', 'vehicleV3', 'Unique VIN lookup (primary key)'],
                      ['{ vehicleId: 1 }', 'vehicleV3', 'Vehicle ID lookup for availability checks'],
                      ['{ status: 1 }', 'vehicleV3', 'Filter by vehicle status (ACTIVE, DELETED)'],
                      ['{ "dealer.dealerId": 1 }', 'vehicleV3', 'Filter/lookup by dealer'],
                      ['{ make: 1, model: 1 }', 'vehicleV3', 'Make/model compound lookups'],
                      ['{ price: 1 }', 'vehicleV3', 'Price sorting and range queries'],
                      ['{ year: -1 }', 'vehicleV3', 'Year sorting (newest first)'],
                      ['{ mileage: 1 }', 'vehicleV3', 'Mileage sorting and range queries'],
                      ['{ createdOn: -1 }', 'vehicleV3', 'Inventory newest sorting'],
                      ['{ "leasing.canLease": 1 }', 'vehicleV3', 'Leasable vehicle queries'],
                      ['{ "leasing.defaultPrice": 1 }', 'vehicleV3', 'Leasing price sorting'],
                      ['{ "availability.purchasePending": 1 }', 'vehicleV3', 'Cart availability checks'],
                      ['{ manuallySuppressed: 1 }', 'vehicleV3', 'Suppression filter'],
                      ['{ condition: 1 }', 'vehicleV3', 'NEW vs USED/CPO condition filter'],
                      ['{ exteriorColor: 1 }', 'vehicleV3', 'Color facet aggregation'],
                      ['{ bodyStyle: 1 }', 'vehicleV3', 'Body style facet aggregation'],
                      ['{ fuelType: 1 }', 'vehicleV3', 'Fuel type facet aggregation'],
                      ['{ driveType: 1 }', 'vehicleV3', 'Drive type facet aggregation'],
                      ['{ transmission: 1 }', 'vehicleV3', 'Transmission facet aggregation'],
                      ['{ "image.spinUrl": 1 }', 'vehicleV3', 'Spin photo metric aggregation'],
                      ['{ value: 1 }', 'searchSuggestion', 'Suggestion value lookup'],
                    ]}
                  />
                </div>
              ),
            },
          ]}
        />
      </motion.section>

      {/* ============================================================ */}
      {/*  EXAMPLE REQUEST                                             */}
      {/* ============================================================ */}
      <motion.section id="example-request" style={section} {...fadeUp}>
        <SectionHeader
          label="Example"
          title="Example Request, Pipeline & Response"
          description="A complete example showing a GraphQL request, the resulting MongoDB aggregation pipeline, and the GraphQL response."
        />

        <Tabs
          tabs={[
            {
              label: 'GraphQL Request',
              content: (
                <CodeBlock
                  code={`query SearchVehicles {
  search(commonInputs: {
    searchTerm: "Toyota Camry"
    sortCriteria: PRICE_LOWEST
    userLocation: {
      state: "OR"
      postalCode: "97034"
    }
    paginationInput: {
      skip: 0
      items: 24
    }
    filterInput: {
      vehicleCondition: DEFAULT          # USED + CPO
      makeModelTrims: [{
        make: "Toyota"
        models: [{
          model: "Camry"
          trims: ["XSE", "TRD"]
        }]
      }]
      priceRange: { min: 15000, max: 35000 }
      yearRange: { min: 2020, max: 2024 }
      mileageRange: { min: 0, max: 50000 }
      exteriorColors: ["Black", "White"]
      bodyStyles: ["Sedan"]
      fuelTypes: ["Gasoline"]
      transmissions: ["Automatic"]
    }
  }) {
    vehicles {
      vehicleId
      vin
      make
      model
      trim
      year
      price
      mileage
      exteriorColor
      shippingFee
      leasing {
        canLease
        defaultPrice
      }
      dealer {
        dealerName
        city
        state
      }
    }
    pageInfo {
      skip
      items
      totalItems
    }
  }
}`}
                  language="graphql"
                  filename="GraphQL Search Request"
                />
              ),
            },
            {
              label: 'MongoDB Pipeline',
              content: (
                <CodeBlock
                  code={`// Resulting MongoDB Aggregation Pipeline Stages:

// Stage 1: $search (Atlas Search)
{
  "$search": {
    "index": "shopSearch",
    "compound": {
      "must": [
        {
          "text": {
            "query": "Toyota Camry",
            "path": "make",
            "fuzzy": { "maxEdits": 1, "prefixLength": 0, "maxExpansions": 50 },
            "score": { "boost": { "value": 8.0 } }
          }
        },
        {
          "text": {
            "query": "Toyota Camry",
            "path": "model",
            "fuzzy": { "maxEdits": 1, "prefixLength": 0, "maxExpansions": 50 },
            "score": { "boost": { "value": 6.0 } }
          }
        }
      ],
      "should": [
        {
          "text": {
            "query": "97034",
            "path": "dealer.zoneZips",
            "score": { "boost": { "value": 5.0 } }
          }
        }
      ],
      "filter": [
        { "queryString": { "defaultPath": "status", "query": "ACTIVE" } },
        { "queryString": { "defaultPath": "manuallySuppressed", "query": "false" } },
        { "queryString": { "defaultPath": "condition", "query": "(USED OR CPO)" } },
        {
          "compound": {
            "must": [
              { "text": { "query": "Toyota", "path": "make" } },
              { "text": { "query": "Camry", "path": "model" } },
              {
                "compound": {
                  "minimumShouldMatch": 1,
                  "should": [
                    { "text": { "query": "XSE", "path": "trim" } },
                    { "text": { "query": "TRD", "path": "trim" } }
                  ]
                }
              }
            ]
          }
        },
        { "range": { "path": "price", "gte": 15000, "lte": 35000 } },
        { "range": { "path": "year", "gte": 2020, "lte": 2024 } },
        { "range": { "path": "mileage", "gte": 0, "lte": 50000 } },
        { "queryString": { "defaultPath": "exteriorColor", "query": "(Black OR White)" } },
        { "queryString": { "defaultPath": "bodyStyle", "query": "Sedan" } },
        { "queryString": { "defaultPath": "fuelType", "query": "Gasoline" } },
        { "queryString": { "defaultPath": "transmission", "query": "Automatic" } }
      ]
    },
    "sort": { "price": 1 }
  }
}

// Stage 2: $addFields (shipping fee calculation)
{
  "$addFields": {
    "shippingFee": {
      "$cond": {
        "if": { "$in": ["97034", "$dealer.zoneZips"] },
        "then": 0,
        "else": { "$ifNull": ["$dealer.stateShippingMap.OR", 999] }
      }
    }
  }
}

// Stage 3: $skip
{ "$skip": 0 }

// Stage 4: $limit
{ "$limit": 24 }

// Stage 5: $project (field selection)
{
  "$project": {
    "vehicleId": 1, "vin": 1, "make": 1, "model": 1, "trim": 1,
    "year": 1, "price": 1, "mileage": 1, "exteriorColor": 1,
    "shippingFee": 1, "leasing": 1, "dealer": 1
  }
}`}
                  language="json"
                  filename="MongoDB Aggregation Pipeline"
                />
              ),
            },
            {
              label: 'GraphQL Response',
              content: (
                <CodeBlock
                  code={`{
  "data": {
    "search": {
      "vehicles": [
        {
          "vehicleId": "V-12345678",
          "vin": "4T1G11AK5LU123456",
          "make": "Toyota",
          "model": "Camry",
          "trim": "XSE",
          "year": 2022,
          "price": 24990,
          "mileage": 18500,
          "exteriorColor": "Black",
          "shippingFee": 0,
          "leasing": {
            "canLease": false,
            "defaultPrice": null
          },
          "dealer": {
            "dealerName": "Driveway Portland",
            "city": "Portland",
            "state": "OR"
          }
        },
        {
          "vehicleId": "V-23456789",
          "vin": "4T1K61AK1MU234567",
          "make": "Toyota",
          "model": "Camry",
          "trim": "TRD",
          "year": 2021,
          "price": 27450,
          "mileage": 32100,
          "exteriorColor": "White",
          "shippingFee": 499,
          "leasing": {
            "canLease": false,
            "defaultPrice": null
          },
          "dealer": {
            "dealerName": "Lithia Toyota of Medford",
            "city": "Medford",
            "state": "OR"
          }
        }
      ],
      "pageInfo": {
        "skip": 0,
        "items": 24,
        "totalItems": 847
      }
    }
  }
}`}
                  language="json"
                  filename="GraphQL Response"
                />
              ),
            },
          ]}
        />
      </motion.section>

      {/* ============================================================ */}
      {/*  KEY TAKEAWAYS                                               */}
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
            <li>The SRP search pipeline is built by a chain of builders: <code>FilterBuilder</code>, <code>SearchOperatorBuilder</code>, <code>ShippingBuilder</code>, <code>LeasingBuilder</code>, and <code>PageBuilder</code>.</li>
            <li>Every query includes non-negotiable base filters: <code>status = ACTIVE</code> and <code>manuallySuppressed = false</code>.</li>
            <li>12+ filter types are supported, with inter-filter AND logic and intra-filter OR logic. Make/Model/Trim uses a hierarchical CompoundBlock with <code>minimumShouldMatch: 1</code>.</li>
            <li>Scoring is driven by versioned <code>SearchScoreWeights</code> loaded from MongoDB. Weights are condition-aware (NEW vs USED/CPO) and include per-field text boosts and sort factors.</li>
            <li>Text search uses fuzzy matching with <code>maxEdits=1</code>, <code>prefixLength=0</code>, and <code>maxExpansions=50</code> for typo tolerance.</li>
            <li>Leasing filters require a postal code for OEM region resolution via <code>PostalCodeOemRegionCache</code>. Without a postal code, leasing filters are skipped.</li>
            <li>Shipping fee is calculated via <code>$addFields</code>: free if the user's zip is in the dealer's <code>zoneZips</code>, otherwise the state-based rate from <code>stateShippingMap</code>.</li>
            <li>Pagination is capped at skip=2376 (100 pages of 24). The count pipeline uses <code>$searchMeta</code> and runs in parallel with the vehicle pipeline.</li>
            <li>Vehicle availability is checked via the <code>isReadyForCart()</code> function. <code>reconOrderOpen</code> does NOT block cart addition.</li>
            <li>The <code>shopSearch</code> Atlas Search index on <code>vehicleV3</code> indexes 50+ fields and is the backbone of all SRP queries. 20+ standard MongoDB indexes support facets and lookups.</li>
          </ul>
        </div>
      </motion.section>
    </div>
  );
}
