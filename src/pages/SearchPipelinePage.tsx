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
import Tabs from '../components/shared/Tabs';
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
  { id: 'graphql-entry', label: 'Step 1: GraphQL Entry' },
  { id: 'pipeline-construction', label: 'Step 2: Pipeline Construction' },
  { id: 'search-stage', label: 'Step 3: $search Stage' },
  { id: 'score-weights', label: 'Step 4: Score Weights' },
  { id: 'modify-scoring', label: 'Step 5: Modify Scoring' },
  { id: 'post-search', label: 'Step 6: Post-Search Stages' },
  { id: 'facets', label: 'Step 7: Facets' },
  { id: 'visual-summary', label: 'Visual Summary' },
];

/* ------------------------------------------------------------------ */
/*  Mermaid Diagrams                                                   */
/* ------------------------------------------------------------------ */
const pipelineOverview = `flowchart LR
    A["$search"] --> B["$skip"]
    B --> C["$limit"]
    C --> D["$addFields\\n(shipping)"]
    D --> E["$addFields\\n(leasing)"]
    E --> F["$project"]
    style A fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0
    style B fill:#2d1e3a,stroke:#8b5cf6,color:#e2e8f0
    style C fill:#2d1e3a,stroke:#8b5cf6,color:#e2e8f0
    style D fill:#1e3a2f,stroke:#10b981,color:#e2e8f0
    style E fill:#3a2f1e,stroke:#f59e0b,color:#e2e8f0
    style F fill:#1e3a5f,stroke:#06b6d4,color:#e2e8f0`;

const searchStageFlow = `flowchart TD
    A[SearchOperatorBuilder.kt] --> B[CompoundBlock]
    B --> C["filter\\n(hard constraints)"]
    B --> D["must\\n(required match + scoring)"]
    B --> E["should\\n(optional boosts)"]
    C --> F[FilterBuilder.kt]
    F --> F1["status = ACTIVE"]
    F --> F2["manuallySuppressed = false"]
    F --> F3["vehicleCondition"]
    F --> F4["Make/Model/Trim"]
    F --> F5["Price, mileage, year, MPG"]
    F --> F6["Colors, body style, fuel, etc."]
    F --> F7["Free shipping zone"]
    F --> F8["Leasable only"]
    D --> G[TextBuilder.kt]
    G --> G1["TextBlock per field"]
    G --> G2["Fuzzy: maxEdits=1"]
    G --> G3["Per-field boost weights"]
    E --> H[SearchScoreWeights]
    H --> H1["Static factors\\n(NearBlock, RangeBlock)"]
    H --> H2["Template factors\\n(FREE_SHIPPING, LEASING)"]
    style A fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0
    style B fill:#2d1e3a,stroke:#ec4899,color:#e2e8f0
    style C fill:#1e3a2f,stroke:#10b981,color:#e2e8f0
    style D fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0
    style E fill:#3a2f1e,stroke:#f59e0b,color:#e2e8f0
    style F fill:#1e3a2f,stroke:#10b981,color:#e2e8f0
    style F1 fill:#0d1117,stroke:#2a3a52,color:#94a3b8
    style F2 fill:#0d1117,stroke:#2a3a52,color:#94a3b8
    style F3 fill:#0d1117,stroke:#2a3a52,color:#94a3b8
    style F4 fill:#0d1117,stroke:#2a3a52,color:#94a3b8
    style F5 fill:#0d1117,stroke:#2a3a52,color:#94a3b8
    style F6 fill:#0d1117,stroke:#2a3a52,color:#94a3b8
    style F7 fill:#0d1117,stroke:#2a3a52,color:#94a3b8
    style F8 fill:#0d1117,stroke:#2a3a52,color:#94a3b8
    style G fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0
    style G1 fill:#0d1117,stroke:#2a3a52,color:#94a3b8
    style G2 fill:#0d1117,stroke:#2a3a52,color:#94a3b8
    style G3 fill:#0d1117,stroke:#2a3a52,color:#94a3b8
    style H fill:#3a2f1e,stroke:#f59e0b,color:#e2e8f0
    style H1 fill:#0d1117,stroke:#2a3a52,color:#94a3b8
    style H2 fill:#0d1117,stroke:#2a3a52,color:#94a3b8`;

const scoringWorkflow = `sequenceDiagram
    participant Dev as Developer
    participant API as REST API
    participant DB as MongoDB
    participant Cache as ScoreWeightsCache
    participant GQL as GraphQL

    Dev->>API: GET /search/score-weights?sortType=RECOMMENDED
    API->>DB: Read current config
    DB-->>API: SearchScoreWeights v3 (enabled)
    API-->>Dev: Current weights config

    Dev->>API: POST /search/score-weights
    Note over Dev,API: New version with modified weights
    API->>DB: Insert version v4
    DB-->>API: Created v4

    Dev->>GQL: Test query + Override-Score-Weight-Version: 4
    Note over GQL: Uses v4 only for this request
    GQL-->>Dev: Results with new scoring

    Dev->>API: POST /search/score-weights/enable?sortType=RECOMMENDED&version=4
    API->>DB: Set v4 as enabled
    Note over Cache: Next cache refresh picks up v4
    Cache-->>GQL: v4 now active for all queries`;

const postSearchFlow = `flowchart TD
    A["$search results\\n(ranked)"] --> B["ShippingBuilder.kt"]
    B --> C{"User zip in\\ndealer.zoneZips?"}
    C -->|Yes| D["shippingFee = 0"]
    C -->|No| E["shippingFee =\\nstateShippingMap[userState]"]
    D --> F["LeasingBuilder.kt"]
    E --> F
    F --> G["Filter regionalPrices\\nto user's OEM region"]
    G --> H["Extract defaultPrice"]
    H --> I["ProjectBuilder.kt"]
    I --> J["Return only\\nrequested fields"]
    style A fill:#1e3a5f,stroke:#3b82f6,color:#e2e8f0
    style B fill:#1e3a2f,stroke:#10b981,color:#e2e8f0
    style C fill:#3a2f1e,stroke:#f59e0b,color:#e2e8f0
    style D fill:#1e3a2f,stroke:#10b981,color:#e2e8f0
    style E fill:#3a2f1e,stroke:#f59e0b,color:#e2e8f0
    style F fill:#2d1e3a,stroke:#8b5cf6,color:#e2e8f0
    style G fill:#2d1e3a,stroke:#8b5cf6,color:#e2e8f0
    style H fill:#2d1e3a,stroke:#8b5cf6,color:#e2e8f0
    style I fill:#1e3a5f,stroke:#06b6d4,color:#e2e8f0
    style J fill:#1e3a5f,stroke:#06b6d4,color:#e2e8f0`;

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

const asciiBox: CSSProperties = {
  background: c.surface,
  border: `1px solid ${c.border}`,
  borderRadius: 12,
  padding: '2rem',
  marginTop: '1.5rem',
  fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
  fontSize: '0.78rem',
  lineHeight: 1.7,
  color: c.text2,
  overflowX: 'auto',
  whiteSpace: 'pre',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function SearchPipelinePage() {
  const { setSidebar, clearSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('Search Pipeline', tocItems);
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
            Search Pipeline
            <br />
            Deep Dive
          </h1>
          <p style={heroSubtitle}>
            End-to-end walkthrough of the MongoDB Atlas Search pipeline &mdash; from
            the GraphQL entry point through pipeline construction, scoring, post-search
            enrichment, and facets.
          </p>
          <div style={badgeRow}>
            <Badge label="7-Step Pipeline" color="blue" dot />
            <Badge label="Configurable Scoring" color="purple" dot />
            <Badge label="REST Admin API" color="green" dot />
            <Badge label="Versioned Weights" color="cyan" dot />
            <Badge label="Facets" color="pink" dot />
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  OVERVIEW                                                    */}
      {/* ============================================================ */}
      <motion.section id="overview" style={section} {...fadeUp}>
        <SectionHeader
          label="Architecture"
          title="Pipeline Overview"
          description="The search pipeline transforms a user query into a ranked set of vehicle results through 7 distinct stages."
        />

        <div style={{ marginTop: '1.5rem' }}>
          <MermaidViewer
            title="Aggregation Pipeline Stages"
            tabs={[{ label: 'Pipeline Flow', source: pipelineOverview }]}
          />
        </div>

        <div style={gridThree}>
          <Card title="PipelineBuilder.kt" variant="blue">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Orchestrates the full pipeline by delegating to specialized builders for each stage.
              Assembles the stages in order and returns the complete aggregation pipeline.
            </p>
          </Card>
          <Card title="SearchOperatorBuilder.kt" variant="purple">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Builds the core <code>$search</code> stage with a <code>CompoundBlock</code> containing
              filter, must, and should sections for filtering, matching, and scoring.
            </p>
          </Card>
          <Card title="SearchScoreWeights" variant="cyan">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Versioned scoring configurations stored in MongoDB and cached in memory. Each sort type
              has its own set of text weights and scoring factors.
            </p>
          </Card>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  STEP 1: GRAPHQL ENTRY                                       */}
      {/* ============================================================ */}
      <motion.section id="graphql-entry" style={section} {...fadeUp}>
        <SectionHeader
          label="Step 1"
          title="User Query Enters via GraphQL"
          description="The entry point is search() in SearchPageQueries.kt. It accepts a VehicleCommonInputs object."
        />

        <DataTable
          headers={['Parameter', 'Purpose']}
          rows={[
            [<strong style={{ color: c.accent }}>searchTerm</strong>, 'Free-text query (e.g. "Honda Civic")'],
            [<strong style={{ color: c.accent }}>sortCriteria</strong>, 'RELEVANCE, PRICE_LOWEST, PRICE_HIGHEST, SHIPPING_FEE_LOWEST, YEAR_NEWEST, etc.'],
            [<strong style={{ color: c.accent }}>filterInput</strong>, 'Structured filters (make/model, price range, mileage, body style, colors, etc.)'],
            [<strong style={{ color: c.accent }}>paginationInput</strong>, 'skip and items (default 24, max 500)'],
            [<strong style={{ color: c.accent }}>userLocation</strong>, 'State + postal code (needed for shipping/leasing calculations)'],
          ]}
          highlightColumn={0}
        />

        <div style={{ marginTop: '1rem' }}>
          <Callout type="info" title="Input Validation">
            <code>commonInputs.validate()</code> checks pagination bounds, validates location data,
            and sanitizes filter characters before pipeline construction begins.
          </Callout>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  STEP 2: PIPELINE CONSTRUCTION                               */}
      {/* ============================================================ */}
      <motion.section id="pipeline-construction" style={section} {...fadeUp}>
        <SectionHeader
          label="Step 2"
          title="Pipeline Construction"
          description="PipelineBuilder.kt orchestrates building a MongoDB aggregation pipeline by delegating to specialized builders."
        />

        <CodeBlock
          code={`// PipelineBuilder.kt — Pipeline assembly order:

$search  →  $skip  →  $limit  →  $addFields (shipping)  →  $addFields (leasing)  →  $project

// Each stage built by a dedicated builder:
// 1. SearchOperatorBuilder.kt  →  $search (CompoundBlock)
// 2. PageBuilder.kt            →  $skip + $limit
// 3. ShippingBuilder.kt        →  $addFields (shipping fee)
// 4. LeasingBuilder.kt         →  $addFields (leasing price)
// 5. ProjectBuilder.kt         →  $project (field selection)`}
          language="kotlin"
          filename="PipelineBuilder.kt"
        />

        <div style={gridTwo}>
          <Card title="Builder Pattern" variant="green">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Each builder is responsible for a single pipeline stage, making the system modular
              and testable. Builders receive the user inputs and return <code>Bson</code> stages.
            </p>
          </Card>
          <Card title="Stage Ordering" variant="orange">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              <code>$search</code> must come first (Atlas Search requirement). <code>$skip/$limit</code>
              happen before <code>$addFields</code> to minimize computation on documents that won't be
              returned.
            </p>
          </Card>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  STEP 3: THE $search STAGE                                   */}
      {/* ============================================================ */}
      <motion.section id="search-stage" style={section} {...fadeUp}>
        <SectionHeader
          label="Step 3"
          title="The $search Stage — Filters + Scoring"
          description="The core stage built by SearchOperatorBuilder.kt. Creates a CompoundBlock with three sections."
        />

        <div style={{ marginTop: '1.5rem' }}>
          <MermaidViewer
            title="$search Stage Architecture"
            tabs={[{ label: 'CompoundBlock Structure', source: searchStageFlow }]}
          />
        </div>

        <Tabs
          tabs={[
            {
              label: 'filter (hard constraints)',
              content: (
                <div>
                  <p style={prose}>
                    Built by <strong>FilterBuilder.kt</strong>. Hard constraints that must match but
                    don't affect scoring.
                  </p>
                  <DataTable
                    headers={['Filter', 'Details', 'Block Type']}
                    rows={[
                      [<strong style={{ color: c.red }}>Always applied</strong>, 'status = ACTIVE, manuallySuppressed = false', 'QueryStringBlock'],
                      ['vehicleCondition', 'Defaults to USED + CPO', 'QueryStringBlock'],
                      ['Make/Model/Trim', 'Hierarchical TextBlock with keyword analyzer', 'CompoundBlock'],
                      ['Price, mileage, year, MPG', 'Numeric ranges (gte/lte)', 'RangeBlock'],
                      ['Colors, body style, fuel, etc.', 'Categorical filters with OR logic', 'QueryStringBlock'],
                      ['Free shipping', 'Checks user zip against dealer.zoneZips', 'QueryStringBlock'],
                      ['Leasable only', 'Matches user\'s OEM region via PostalCodeOemRegionCache', 'CompoundBlock'],
                    ]}
                  />
                </div>
              ),
            },
            {
              label: 'must (text search)',
              content: (
                <div>
                  <p style={prose}>
                    Built by <strong>TextBuilder.kt</strong>. When <code>searchTerm</code> is provided,
                    creates one <code>TextBlock</code> per weighted field.
                  </p>
                  <CodeBlock
                    code={`// TextBuilder.kt — One TextBlock per weighted field
TextBlock(
    query = searchTerm,       // e.g. "Honda Civic"
    path = "make",            // or "model", "trim", etc.
    fuzzy = FuzzyOptions(
        maxEdits = 1,         // Typo tolerance (1 character edit)
        maxExpansions = 50    // Max term expansions
    ),
    score = { boost: { value: textSearchWeights["make"] } }
    //                        ↑ Per-field boost from SearchScoreWeights
)`}
                    language="kotlin"
                    filename="TextBuilder.kt"
                  />
                </div>
              ),
            },
            {
              label: 'should (scoring boosts)',
              content: (
                <div>
                  <p style={prose}>
                    Optional boosts from <strong>SearchScoreWeights.sortFactors</strong>.
                    This is where ranking happens.
                  </p>
                  <div style={gridTwo}>
                    <Card title="Static Factors" variant="blue">
                      <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
                        Pre-built scoring operators stored in MongoDB: <code>NearBlock</code> for year
                        proximity, <code>RangeBlock</code> for price scoring with{' '}
                        <code>FunctionScoreBlock</code>, <code>BoostScoreBlock</code> for constant boosts.
                      </p>
                    </Card>
                    <Card title="Template/Dynamic Factors" variant="orange">
                      <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
                        Resolved at query time by <strong>SearchBlockTemplateBuilder.kt</strong>:
                        <br /><code>FREE_SHIPPING</code> — boosts vehicles with free shipping to user's zip
                        <br /><code>BASE_SHIPPING_LOWEST</code> — boosts lowest shipping cost
                        <br /><code>LEASING_LOWEST</code> — boosts lowest lease payment
                      </p>
                    </Card>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </motion.section>

      {/* ============================================================ */}
      {/*  STEP 4: SCORE WEIGHTS                                       */}
      {/* ============================================================ */}
      <motion.section id="score-weights" style={section} {...fadeUp}>
        <SectionHeader
          label="Step 4"
          title="Score Weights — The Ranking Rules"
          description="Versioned scoring configurations stored in the searchScoreWeights MongoDB collection."
        />

        <CodeBlock
          code={`data class SearchScoreWeights(
    val version: Int,                            // Auto-incremented
    val enabled: Boolean,                        // Only one enabled per sortType
    val sortType: SortType,                      // RECOMMENDED, LOW_PRICE_NEW_CAR, etc.
    val textSearchWeights: Map<String, Double>,  // Field → boost (e.g. "make" → 2.5)
    val sortFactors: SortFactors                 // Static + template scoring blocks
)`}
          language="kotlin"
          filename="SearchScoreWeights.kt"
        />

        <div style={{ marginTop: '1.5rem' }}>
          <SectionHeader
            title="11 Sort Types"
            description="Each has its own scoring config. Only one version per SortType is active at a time."
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: '0.75rem',
            marginTop: '1rem',
          }}>
            {[
              { name: 'RECOMMENDED', color: c.accent },
              { name: 'HIGH_PRICE_NEW_CAR', color: c.green },
              { name: 'HIGH_PRICE_USED_CAR', color: c.green },
              { name: 'LOW_PRICE_NEW_CAR', color: c.purple },
              { name: 'LOW_PRICE_USED_CAR', color: c.purple },
              { name: 'SHIPPING_FEE_LOWEST', color: c.cyan },
              { name: 'INVENTORY_NEWEST', color: c.orange },
              { name: 'LOWEST_MILEAGE', color: c.pink },
              { name: 'NEWEST_YEAR', color: c.red },
              { name: 'OLDEST_YEAR', color: c.red },
              { name: 'LEASING_LOWEST', color: c.orange },
            ].map(({ name, color }) => (
              <div key={name} style={{
                background: c.surface,
                border: `1px solid ${c.border}`,
                borderLeft: `3px solid ${color}`,
                borderRadius: 8,
                padding: '0.6rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                fontFamily: '"JetBrains Mono", monospace',
                color: c.text,
              }}>
                {name}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <DataTable
            headers={['SortCriteria', 'Maps To', 'Condition Logic']}
            rows={[
              [<strong style={{ color: c.accent }}>RELEVANCE or null</strong>, 'RECOMMENDED', 'Default sort type'],
              [<strong style={{ color: c.accent }}>PRICE_LOWEST</strong>, 'LOW_PRICE_NEW_CAR / LOW_PRICE_USED_CAR', 'Depends on condition filter'],
              [<strong style={{ color: c.accent }}>PRICE_HIGHEST</strong>, 'HIGH_PRICE_NEW_CAR / HIGH_PRICE_USED_CAR', 'Depends on condition filter'],
              [<strong style={{ color: c.accent }}>Others</strong>, '1:1 mapping', 'Direct mapping to SortType'],
            ]}
            highlightColumn={0}
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <Callout type="info" title="Versioning">
            Score weights are versioned — only one version per SortType is active at a time.
            This allows safe experimentation with new scoring configs before going live.
          </Callout>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  STEP 5: MODIFY SCORING                                      */}
      {/* ============================================================ */}
      <motion.section id="modify-scoring" style={section} {...fadeUp}>
        <SectionHeader
          label="Step 5"
          title="How to Modify Search Scoring Rules"
          description="REST endpoints for managing scoring configurations with safe testing workflow."
        />

        <DataTable
          headers={['Method', 'Path', 'Action']}
          rows={[
            [<Badge label="GET" color="green" />, '/search/score-weights', 'List current configs (all or by sortType)'],
            [<Badge label="GET" color="green" />, '/search/score-weights/templates', 'List available dynamic templates'],
            [<Badge label="POST" color="blue" />, '/search/score-weights', 'Create a new version (auto-increments)'],
            [<Badge label="POST" color="blue" />, '/search/score-weights/enable', 'Enable a specific version (?sortType=X&version=N)'],
            [<Badge label="DELETE" color="red" />, '/search/score-weights', 'Delete a version (can\'t delete the enabled one)'],
          ]}
          highlightColumn={0}
        />

        <div style={{ marginTop: '1.5rem' }}>
          <MermaidViewer
            title="Scoring Modification Workflow"
            tabs={[{ label: 'Workflow', source: scoringWorkflow }]}
          />
        </div>

        <Tabs
          tabs={[
            {
              label: 'Workflow Steps',
              content: (
                <div>
                  <div style={gridTwo}>
                    <Card title="1. View Current Config" variant="green">
                      <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
                        <code>GET /search/score-weights?sortType=RECOMMENDED</code>
                        <br />See the current enabled config for any sort type.
                      </p>
                    </Card>
                    <Card title="2. Create New Version" variant="blue">
                      <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
                        <code>POST /search/score-weights</code>
                        <br />Create a new version with modified textSearchWeights and/or sortFactors.
                      </p>
                    </Card>
                    <Card title="3. Test Safely" variant="purple">
                      <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
                        Send the header <code>Override-Score-Weight-Version: N</code> on GraphQL requests.
                        No production impact.
                      </p>
                    </Card>
                    <Card title="4. Enable in Production" variant="orange">
                      <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
                        <code>POST /search/score-weights/enable?sortType=RECOMMENDED&version=N</code>
                        <br />Activate it for all users.
                      </p>
                    </Card>
                  </div>
                </div>
              ),
            },
            {
              label: 'What You Can Change',
              content: (
                <div>
                  <div style={gridThree}>
                    <Card title="textSearchWeights" variant="blue">
                      <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
                        Change which fields matter for text search and by how much. Example: boost{' '}
                        <code>"ymmt.make"</code> from 2.0 to 5.0 to prioritize make matches.
                      </p>
                    </Card>
                    <Card title="staticFactors" variant="green">
                      <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
                        Add/modify scoring blocks: <code>NearBlock</code> (year proximity),{' '}
                        <code>RangeBlock</code> (price scoring), <code>BoostScoreBlock</code> (constant boost).
                      </p>
                    </Card>
                    <Card title="placeholders" variant="purple">
                      <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
                        Enable/disable dynamic templates: <code>FREE_SHIPPING</code>,{' '}
                        <code>BASE_SHIPPING_LOWEST</code>, <code>LEASING_LOWEST</code> — each with
                        custom score blocks.
                      </p>
                    </Card>
                  </div>
                </div>
              ),
            },
          ]}
        />

        <div style={{ marginTop: '1rem' }}>
          <Callout type="warning" title="Caching">
            Score weights are cached in memory by <code>SearchScoreWeightsCache.kt</code> and refreshed
            on a schedule. After enabling a new version, it takes effect after the next cache refresh.
          </Callout>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  STEP 6: POST-SEARCH STAGES                                  */}
      {/* ============================================================ */}
      <motion.section id="post-search" style={section} {...fadeUp}>
        <SectionHeader
          label="Step 6"
          title="Post-Search Stages"
          description="After $search ranks results, three additional stages enrich and project the data."
        />

        <div style={{ marginTop: '1.5rem' }}>
          <MermaidViewer
            title="Post-Search Pipeline"
            tabs={[{ label: 'Enrichment Flow', source: postSearchFlow }]}
          />
        </div>

        <div style={gridThree}>
          <Card title="ShippingBuilder.kt" variant="green">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              <code>$addFields</code> with a <code>$switch</code>: if user's zip is in dealer's
              free-shipping zones, fee is 0. Otherwise, lookup from <code>stateShippingMap</code>.
            </p>
          </Card>
          <Card title="LeasingBuilder.kt" variant="purple">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              <code>$addFields</code> that filters the <code>regionalPrices</code> array to the
              user's OEM region and extracts <code>defaultPrice</code>.
            </p>
          </Card>
          <Card title="ProjectBuilder.kt" variant="cyan">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Only returns the fields that the GraphQL query actually requested. Minimizes data
              transfer between MongoDB and the application.
            </p>
          </Card>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <CodeBlock
            code={`// ShippingBuilder.kt — $addFields stage
{
  "$addFields": {
    "shippingFee": {
      "$cond": {
        "if": { "$in": ["<userPostalCode>", "$dealer.zoneZips"] },
        "then": 0,
        "else": { "$ifNull": ["$dealer.stateShippingMap.<userState>", 999] }
      }
    }
  }
}

// LeasingBuilder.kt — $addFields stage
{
  "$addFields": {
    "leasing.defaultPrice": {
      "$let": {
        "vars": {
          "regionPrice": {
            "$first": {
              "$filter": {
                "input": "$leasing.regionalPrices",
                "cond": { "$eq": ["$$this.regionId", "<userRegionId>"] }
              }
            }
          }
        },
        "in": "$$regionPrice.monthlyPayment"
      }
    }
  }
}`}
            language="json"
            filename="Post-Search Stages"
          />
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  STEP 7: FACETS                                              */}
      {/* ============================================================ */}
      <motion.section id="facets" style={section} {...fadeUp}>
        <SectionHeader
          label="Step 7"
          title="Facets (Filter Counts)"
          description="The getFacets() query uses $searchMeta (not $search) — same filters but no scoring."
        />

        <p style={prose}>
          Facets return bucket counts for filter sidebar items. For example:
          "Toyota (1,500), Honda (1,200)..." This powers the filter UI showing how many vehicles
          match each filter option.
        </p>

        <div style={gridTwo}>
          <Card title="$searchMeta" variant="blue">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Uses the same filter constraints as <code>$search</code> but returns aggregate counts
              instead of documents. No scoring is performed — only filtering and bucketing.
            </p>
          </Card>
          <Card title="Bucket Limits" variant="orange">
            <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.7, margin: 0 }}>
              Max <strong>100 buckets per facet</strong>. Facets are generated for:
              make, model, trim, vehicleCondition, and bodyStyle.
            </p>
          </Card>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <CodeBlock
            code={`// getFacets() — $searchMeta aggregation
{
  "$searchMeta": {
    "index": "shopSearch",
    "facet": {
      "operator": {
        "compound": {
          "filter": [
            // Same filters as $search (status, condition, etc.)
          ]
        }
      },
      "facets": {
        "makeFacet":      { "type": "string", "path": "make",             "numBuckets": 100 },
        "modelFacet":     { "type": "string", "path": "model",            "numBuckets": 100 },
        "trimFacet":      { "type": "string", "path": "trim",             "numBuckets": 100 },
        "conditionFacet": { "type": "string", "path": "vehicleCondition", "numBuckets": 100 },
        "bodyStyleFacet": { "type": "string", "path": "bodyStyle",        "numBuckets": 100 }
      }
    }
  }
}

// Response example:
// { makeFacet: { buckets: [{ _id: "Toyota", count: 1500 }, { _id: "Honda", count: 1200 }, ...] } }`}
            language="json"
            filename="Facets Query"
          />
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  VISUAL SUMMARY                                              */}
      {/* ============================================================ */}
      <motion.section id="visual-summary" style={section} {...fadeUp}>
        <SectionHeader
          label="Summary"
          title="Visual Summary"
          description="The complete search pipeline at a glance."
        />

        <div style={asciiBox}>{`User Search Request
       │
       ▼
  VehicleCommonInputs (searchTerm, sort, filters, location, pagination)
       │
       ▼
  SearchOperatorBuilder
       │
       ├──► FilterBuilder ──► Hard constraints (status, condition, make, price, etc.)
       ├──► TextBuilder ──► Fuzzy text search with field-specific boosts
       └──► SearchScoreWeights (from DB/cache per SortType)
              ├──► textSearchWeights: { "make": 2.5, "model": 1.5, ... }
              ├──► staticFactors: [NearBlock, RangeBlock, BoostBlock, ...]
              └──► templates: [FREE_SHIPPING, BASE_SHIPPING_LOWEST, LEASING_LOWEST]
                          │
                          ▼
                   CompoundBlock($search)
                          │
                          ▼
              $skip → $limit → $addFields(shipping) → $addFields(leasing) → $project
                          │
                          ▼
                   Ranked Vehicle Results`}</div>

        <div style={takeawayBox}>
          <div style={takeawayTitle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Key Takeaway
          </div>
          <p style={{ ...prose, maxWidth: 'none', margin: 0 }}>
            To change how vehicles are ranked for a specific sort type, modify the{' '}
            <code>SearchScoreWeights</code> for that <code>SortType</code> via the REST API at{' '}
            <code>/search/score-weights</code>. Test safely with the{' '}
            <code>Override-Score-Weight-Version</code> header before enabling in production.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
