import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { useSidebar } from '../context/SidebarContext';
import SectionHeader from '../components/shared/SectionHeader';
import CodeBlock from '../components/shared/CodeBlock';
import Callout from '../components/shared/Callout';
import Card from '../components/shared/Card';
import Badge from '../components/shared/Badge';
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
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
  cyan: '#06b6d4',
  pink: '#ec4899',
  orange: '#f97316',
  purple: '#8b5cf6',
} as const;

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */
const fadeUp = {
  initial: { opacity: 0, y: 32 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, amount: 0.15 } as const,
  transition: { duration: 0.55, ease: 'easeOut' } as const,
};

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const page: CSSProperties = {
  padding: '0 0 4rem 0',
  color: c.text,
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const section: CSSProperties = { marginBottom: '4rem' };

const grid2: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1rem',
};

const grid3: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem',
};

const prose: CSSProperties = {
  fontSize: '0.9rem',
  lineHeight: 1.8,
  color: c.text2,
  margin: 0,
};

const operatorBadge = (color: string): CSSProperties => ({
  display: 'inline-block',
  fontFamily: "'SF Mono', 'Fira Code', monospace",
  fontSize: '0.82rem',
  fontWeight: 600,
  background: `${color}15`,
  color,
  padding: '3px 10px',
  borderRadius: 6,
  marginRight: 6,
});

const marbleDiagram: CSSProperties = {
  background: c.surface,
  border: `1px solid ${c.border}`,
  borderRadius: 12,
  padding: '1rem 1.25rem',
  fontFamily: "'SF Mono', 'Fira Code', monospace",
  fontSize: '0.82rem',
  lineHeight: 1.8,
  color: c.text2,
  whiteSpace: 'pre',
  overflowX: 'auto',
  marginTop: '0.75rem',
  marginBottom: '0.75rem',
};

/* ------------------------------------------------------------------ */
/*  Operator category data                                             */
/* ------------------------------------------------------------------ */

type CardVariant = 'blue' | 'green' | 'purple' | 'yellow' | 'cyan' | 'pink' | 'orange' | 'red';

interface OperatorCategory {
  id: string;
  label: string;
  color: string;
  variant: CardVariant;
  description: string;
  count: number;
}

const categories: OperatorCategory[] = [
  { id: 'creation', label: 'Creation', color: c.green, variant: 'green', description: 'Create Mono/Flux streams from values, collections, or nothing', count: 5 },
  { id: 'transformation', label: 'Transformation', color: c.accent, variant: 'blue', description: 'Transform elements flowing through the stream', count: 6 },
  { id: 'combining', label: 'Combining', color: c.purple, variant: 'purple', description: 'Merge, zip, or combine multiple reactive streams', count: 4 },
  { id: 'filtering', label: 'Filtering', color: c.cyan, variant: 'cyan', description: 'Select, filter, or pick elements from a stream', count: 3 },
  { id: 'error-handling', label: 'Error Handling', color: c.red, variant: 'red', description: 'Recover from errors, retry, or transform exceptions', count: 3 },
  { id: 'side-effects', label: 'Side Effects', color: c.yellow, variant: 'yellow', description: 'Perform actions without modifying the stream', count: 6 },
  { id: 'collection', label: 'Collection & Batching', color: c.orange, variant: 'orange', description: 'Collect elements into lists, maps, or batches', count: 3 },
  { id: 'flow-control', label: 'Flow Control', color: c.pink, variant: 'pink', description: 'Rate-limit, cache, timeout, or share streams', count: 5 },
  { id: 'terminal', label: 'Terminal', color: c.green, variant: 'green', description: 'Subscribe, block, or complete a reactive chain', count: 5 },
  { id: 'kotlin-ext', label: 'Kotlin Extensions', color: c.cyan, variant: 'cyan', description: 'Kotlin-specific extension functions for reactor interop', count: 2 },
];

/* ------------------------------------------------------------------ */
/*  Sidebar sections                                                   */
/* ------------------------------------------------------------------ */
const sidebarSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'marble-diagrams', label: 'Reading Marble Diagrams' },
  { id: 'creation', label: 'Creation Operators' },
  { id: 'transformation', label: 'Transformation Operators' },
  { id: 'combining', label: 'Combining Operators' },
  { id: 'filtering', label: 'Filtering Operators' },
  { id: 'error-handling', label: 'Error Handling' },
  { id: 'side-effects', label: 'Side Effects' },
  { id: 'collection', label: 'Collection & Batching' },
  { id: 'flow-control', label: 'Flow Control' },
  { id: 'terminal', label: 'Terminal Operators' },
  { id: 'kotlin-ext', label: 'Kotlin Extensions' },
  { id: 'patterns', label: 'Common Patterns' },
  { id: 'anti-patterns', label: 'Anti-Patterns' },
];

/* ------------------------------------------------------------------ */
/*  Filter chip component                                              */
/* ------------------------------------------------------------------ */
function CategoryFilter({
  categories: cats,
  active,
  onToggle,
}: {
  categories: OperatorCategory[];
  active: Set<string>;
  onToggle: (id: string) => void;
}) {
  const chipBase: CSSProperties = {
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: `1px solid ${c.border}`,
    background: c.surface,
    color: c.text2,
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
      {cats.map((cat) => {
        const isActive = active.has(cat.id);
        return (
          <button
            key={cat.id}
            style={{
              ...chipBase,
              ...(isActive
                ? { background: `${cat.color}20`, borderColor: cat.color, color: cat.color }
                : {}),
            }}
            onClick={() => onToggle(cat.id)}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isActive ? cat.color : c.text3,
              }}
            />
            {cat.label}
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>({cat.count})</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */
export default function ReactorOperatorsPage() {
  const { setSidebar, clearSidebar } = useSidebar();
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSidebar('Reactor Operators', sidebarSections);
    return () => { clearSidebar(); };
  }, [setSidebar, clearSidebar]);

  const toggleCategory = (id: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isVisible = (id: string) => activeCategories.size === 0 || activeCategories.has(id);

  return (
    <div style={page}>
      {/* ============================================================ */}
      {/*  HERO / OVERVIEW                                              */}
      {/* ============================================================ */}
      <motion.section id="overview" style={section} {...fadeUp}>
        <SectionHeader
          label="Reactive Programming"
          title="Project Reactor Operators"
          description="A complete reference of every Reactor operator used in the Odyssey codebase, with real examples and clear explanations to help you master reactive programming."
        />

        <Callout type="info" title="What is Project Reactor?">
          Project Reactor is the reactive library that powers Spring WebFlux. It provides two core types:
          <strong style={{ color: c.green }}> Mono&lt;T&gt;</strong> (0 or 1 element) and
          <strong style={{ color: c.accent }}> Flux&lt;T&gt;</strong> (0 to N elements).
          Odyssey uses Reactor extensively for non-blocking database queries, HTTP calls, and message processing.
        </Callout>

        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: c.text }}>
            Operators by Category ({categories.reduce((s, cat) => s + cat.count, 0)} total used in Odyssey)
          </h3>
          <div style={grid3}>
            {categories.map((cat) => (
              <Card key={cat.id} variant={cat.variant}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: c.text2 }}>{cat.description}</span>
                  <Badge label={`${cat.count}`} color={cat.variant} />
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: c.text }}>Filter by Category</h3>
          <CategoryFilter categories={categories} active={activeCategories} onToggle={toggleCategory} />
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  MARBLE DIAGRAMS                                              */}
      {/* ============================================================ */}
      <motion.section id="marble-diagrams" style={section} {...fadeUp}>
        <SectionHeader
          label="Fundamentals"
          title="Reading Marble Diagrams"
          description="Marble diagrams are the standard way to visualize reactive streams. Here's how to read them."
        />

        <Card title="Anatomy of a Marble Diagram">
          <div style={marbleDiagram}>
{`Source:   ──●──●──●──|
              A    B    C    (complete)

Operator: .map(x -> x.toUpperCase())

Result:   ──●──●──●──|
              a    b    c    (complete)

Legend:
  ──  timeline (left to right)
  ●   emitted element
  |   onComplete signal
  ✕   onError signal
  ⇣   subscription point`}
          </div>
          <div style={{ ...prose, marginTop: '1rem' }}>
            <p><strong style={{ color: c.text }}>Mono</strong> emits at most 1 element then completes. Think of it as a reactive <code>Future</code> or <code>Optional</code>.</p>
            <p style={{ marginTop: '0.5rem' }}><strong style={{ color: c.text }}>Flux</strong> emits 0 to N elements then completes. Think of it as a reactive <code>Stream</code> or <code>List</code>.</p>
          </div>
        </Card>
      </motion.section>

      {/* ============================================================ */}
      {/*  CREATION OPERATORS                                           */}
      {/* ============================================================ */}
      {isVisible('creation') && (
        <motion.section id="creation" style={section} {...fadeUp}>
          <SectionHeader
            label="Creation"
            title="Creation Operators"
            description="Factory methods that create new Mono or Flux instances. These are your entry points into the reactive world."
          />

          {/* Mono.just() */}
          <Card title="Mono.just(value)">
            <p style={prose}>
              Creates a <code>Mono</code> that immediately emits a single value and completes.
              Use this when you already have a value and need to wrap it in a reactive type.
            </p>
            <div style={marbleDiagram}>
{`Mono.just("hello")

  ──●──|
   "hello"  (complete)`}
            </div>
            <Tabs tabs={[
              {
                label: 'Odyssey Example',
                content: (
                  <CodeBlock
                    code={`// DummyMessageSender.kt — wraps a value in Mono for the dummy sender
override fun sendMessage(messageContents: T): Mono<T> {
    log.info("Sending 1 message to dummy '\$topicId'")
    return Mono.just(messageContents)
}`}
                    language="kotlin"
                    filename="MessageSender.kt"
                  />
                ),
              },
              {
                label: 'Simple Example',
                content: (
                  <CodeBlock
                    code={`// Wrap a computed value in a Mono
val greeting: Mono<String> = Mono.just("Hello, Reactor!")

greeting.subscribe { println(it) }
// Output: Hello, Reactor!`}
                    language="kotlin"
                    filename="BasicExample.kt"
                  />
                ),
              },
            ]} />
            <Callout type="warning" title="Eagerly evaluated!">
              <code>Mono.just()</code> captures the value immediately at assembly time.
              If the value is expensive to compute, use <code>Mono.fromCallable</code> or <code>Mono.defer</code> instead.
            </Callout>
          </Card>

          {/* Mono.empty() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title="Mono.empty()">
              <p style={prose}>
                Creates a <code>Mono</code> that completes immediately without emitting any value.
                Equivalent to returning "nothing found" in reactive terms.
              </p>
              <div style={marbleDiagram}>
{`Mono.empty()

  ──|
    (complete, no value)`}
              </div>
              <CodeBlock
                code={`// ImpelSpinApi.kt — return empty when vehicle not found
.onErrorResume(WebClientResponseException::class.java) { e ->
    when (e.statusCode) {
        HttpStatus.NOT_FOUND -> {
            log.warn("Could not find spin for '\$vehicleId'")
            Mono.empty()  // Signal "no data" instead of throwing
        }
        else -> Mono.error(e)
    }
}`}
                language="kotlin"
                filename="ImpelSpinApi.kt"
              />
            </Card>
          </div>

          {/* Flux.fromIterable() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title="Flux.fromIterable(collection)">
              <p style={prose}>
                Creates a <code>Flux</code> that emits each element from an existing <code>Iterable</code> (List, Set, etc.).
                This is the bridge from imperative collections to the reactive world.
              </p>
              <div style={marbleDiagram}>
{`Flux.fromIterable(listOf("A", "B", "C"))

  ──●──●──●──|
   "A" "B" "C"  (complete)`}
              </div>
              <CodeBlock
                code={`// DummyMessageSender.kt — convert a list to a Flux for batch sending
override fun sendMessages(messageContents: Iterable<T>): Flux<T> {
    log.info("Sending \${messageContents.toList().size} messages to dummy '\$topicId'")
    return Flux.fromIterable(messageContents)
}`}
                language="kotlin"
                filename="MessageSender.kt"
              />
            </Card>
          </div>

          {/* Flux.just() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title="Flux.just(vararg values)">
              <p style={prose}>
                Creates a <code>Flux</code> that emits the specified elements and then completes.
                Useful for wrapping a small, known set of values.
              </p>
              <CodeBlock
                code={`// FeatureQueries.kt — wrap a single transformed result in a Flux
return featureFlux
    .concatMap { Flux.just(FeatureResult.fromFeature(it)) }
    .collectList()`}
                language="kotlin"
                filename="FeatureQueries.kt"
              />
            </Card>
          </div>

          {/* Flux.empty() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title="Flux.empty()">
              <p style={prose}>
                Creates a <code>Flux</code> that completes immediately without emitting any elements.
                Use this to represent an empty result set reactively.
              </p>
              <CodeBlock
                code={`// MongoVehicleDaoImpl.kt — skip DB call when input list is empty
override fun upsertVehicles(vehicles: List<Vehicle>): Flux<Vehicle> =
    if (vehicles.isEmpty()) {
        Flux.empty()  // No need to call MongoDB for an empty list
    } else {
        mongoCollection.bulkWrite(
            vehicles.map { replaceOne(Vehicle::vin eq it.vin, it, replaceUpsert()) },
            BulkWriteOptions().ordered(false)
        ).toMono().flatMapMany { vehicles.toFlux() }
    }`}
                language="kotlin"
                filename="MongoVehicleDaoImpl.kt"
              />
            </Card>
          </div>
        </motion.section>
      )}

      {/* ============================================================ */}
      {/*  TRANSFORMATION OPERATORS                                     */}
      {/* ============================================================ */}
      {isVisible('transformation') && (
        <motion.section id="transformation" style={section} {...fadeUp}>
          <SectionHeader
            label="Transformation"
            title="Transformation Operators"
            description="Operators that transform each element flowing through the stream into something new."
          />

          {/* .map() */}
          <Card title=".map(transform)">
            <p style={prose}>
              Applies a <strong>synchronous</strong> 1-to-1 transformation to each element.
              The transform function receives a value and returns a new value (not a Mono/Flux).
            </p>
            <div style={marbleDiagram}>
{`Source:  ──●────●────●──|
          "ab"  "cd"  "ef"

.map { it.uppercase() }

Result:  ──●────●────●──|
          "AB"  "CD"  "EF"`}
            </div>
            <CodeBlock
              code={`// MongoVehicleDaoImpl.kt — extract vehicleId from a document
override fun getVehicleIdForVin(vin: String): Mono<String> =
    mongoCollection
        .find(Vehicle::vin eq vin, Vehicle::status eq InventoryStatus.ACTIVE)
        .projection(Document(Vehicle::vehicleId.path(), 1))
        .toReactor()
        .first()
        .mapNotNull { it.vehicleId }  // Transform Vehicle -> String`}
              language="kotlin"
              filename="MongoVehicleDaoImpl.kt"
            />
            <Callout type="info" title="map vs flatMap">
              Use <code>.map()</code> for synchronous transforms (A → B).
              Use <code>.flatMap()</code> when the transform returns another Mono/Flux (A → Mono&lt;B&gt;).
            </Callout>
          </Card>

          {/* .flatMap() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title=".flatMap(asyncTransform)">
              <p style={prose}>
                Transforms each element into a <strong>new Publisher</strong> (Mono/Flux) and flattens the results.
                This is the most important operator for chaining async operations.
                Elements may interleave because inner publishers execute concurrently.
              </p>
              <div style={marbleDiagram}>
{`Source:     ──●──────●──────|
             A        B

.flatMap { lookupAsync(it) }

Inner A:    ──────●──|        (A1)
Inner B:       ──●──●──|     (B1, B2)

Result:     ──●──●──●──|     (B1, A1, B2 - interleaved!)
`}
              </div>
              <CodeBlock
                code={`// RecordPairOperations.kt — pair incoming vehicles with existing records
fun matchRecordsFor(
    incomingVehicles: Flux<Vehicle>,
    lookup: (Vehicle) -> Mono<Vehicle>
): Flux<Tuple2<Vehicle, Optional<Vehicle>>> =
    incomingVehicles.flatMap { incoming ->
        Mono.just(incoming)
            .zipWith(
                lookup(incoming)                       // async DB lookup
                    .map { Optional.of(it) }
                    .switchIfEmpty(Mono.just(Optional.empty()))
            )
    }`}
                language="kotlin"
                filename="RecordPairOperations.kt"
              />
            </Card>
          </div>

          {/* .flatMapMany() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title=".flatMapMany(asyncTransform)">
              <p style={prose}>
                Only available on <code>Mono</code>. Transforms a single Mono value into a <code>Flux</code>.
                This is how you go from Mono → Flux in a chain.
              </p>
              <div style={marbleDiagram}>
{`Mono:     ──●──|
            [A,B,C]

.flatMapMany { Flux.fromIterable(it) }

Flux:     ──●──●──●──|
            A    B    C`}
              </div>
              <CodeBlock
                code={`// MongoVehicleDaoImpl.kt — after bulk write, emit all vehicles as a Flux
mongoCollection.bulkWrite(
    vehicles.map { replaceOne(Vehicle::vin eq it.vin, it, replaceUpsert()) },
    BulkWriteOptions().ordered(false)
).toMono()
 .flatMapMany { vehicles.toFlux() }  // Mono<BulkWriteResult> → Flux<Vehicle>`}
                language="kotlin"
                filename="MongoVehicleDaoImpl.kt"
              />
            </Card>
          </div>

          {/* .concatMap() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title=".concatMap(asyncTransform)">
              <p style={prose}>
                Like <code>.flatMap()</code> but preserves <strong>order</strong>. Each inner publisher must complete
                before the next one starts. Use this when ordering matters or operations must be sequential.
              </p>
              <div style={marbleDiagram}>
{`Source:     ──●──────●──────|
             A        B

.concatMap { lookupAsync(it) }

Inner A:    ──────●──|          (A1)
Inner B:             ──●──●──|  (B1, B2) — waits for A

Result:     ──────●──●──●──|    (A1, B1, B2 — always ordered!)`}
              </div>
              <CodeBlock
                code={`// CategoryQueries.kt — transform categories in sorted order
return categoryDatabase.read()
    .sort(Comparator.comparing(Category::sortOrder))
    .concatMap { Flux.just(CategoryResult.fromCategory(it)) }
    .collectList()`}
                language="kotlin"
                filename="CategoryQueries.kt"
              />
              <Callout type="info" title="flatMap vs concatMap">
                <code>flatMap</code> = concurrent (faster, unordered). <code>concatMap</code> = sequential (slower, ordered).
                Choose based on whether order matters.
              </Callout>
            </Card>
          </div>

          {/* .mapNotNull() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title=".mapNotNull(transform)">
              <p style={prose}>
                Like <code>.map()</code> but automatically filters out <code>null</code> results.
                Combines mapping and null-checking in one step.
              </p>
              <CodeBlock
                code={`// MongoVehicleDaoImpl.kt — extract vehicleId, skip if null
.first()
.mapNotNull { it.vehicleId }  // if vehicleId is null, element is dropped`}
                language="kotlin"
                filename="MongoVehicleDaoImpl.kt"
              />
            </Card>
          </div>

          {/* .transform() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title=".transform(operator)">
              <p style={prose}>
                Applies a function that takes the entire publisher and returns a new publisher.
                Great for extracting reusable operator chains into separate functions.
              </p>
              <CodeBlock
                code={`// MongoVehicleDaoImpl.kt — compose operator chains via transform
.transform { recordsFlux ->
    recordPairOperations.matchRecordsFor(recordsFlux) { getByVin(it.vin) }
}
.transform(recordPairOperations::combineRecords)  // method reference`}
                language="kotlin"
                filename="MongoVehicleDaoImpl.kt"
              />
              <Callout type="success" title="Composition pattern">
                <code>.transform()</code> is powerful for building reusable pipeline segments.
                It applies at assembly time and composes cleanly with other operators.
              </Callout>
            </Card>
          </div>
        </motion.section>
      )}

      {/* ============================================================ */}
      {/*  COMBINING OPERATORS                                          */}
      {/* ============================================================ */}
      {isVisible('combining') && (
        <motion.section id="combining" style={section} {...fadeUp}>
          <SectionHeader
            label="Combining"
            title="Combining Operators"
            description="Operators that merge, zip, or combine multiple reactive streams into one."
          />

          {/* .zipWith() */}
          <Card title=".zipWith(other)">
            <p style={prose}>
              Combines elements from two publishers into pairs (Tuple2). Both publishers are subscribed to
              eagerly, and elements are paired 1-to-1. The resulting stream completes when either source completes.
            </p>
            <div style={marbleDiagram}>
{`Source A:  ──●────●────●──|
            1      2      3

Source B:  ────●────●──|
              "a"    "b"

A.zipWith(B)

Result:    ────●────●──|
           (1,"a") (2,"b")    ← 3 is dropped (B completed)`}
            </div>
            <CodeBlock
              code={`// RecordPairOperations.kt — pair an incoming vehicle with its DB lookup
Mono.just(incoming)
    .zipWith(
        lookup(incoming)
            .map { Optional.of(it) }
            .switchIfEmpty(Mono.just(Optional.empty()))
    )
// Result: Tuple2<Vehicle, Optional<Vehicle>>`}
              language="kotlin"
              filename="RecordPairOperations.kt"
            />
          </Card>

          {/* Flux.zip / zipWith on Flux */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title="Flux.zipWith(other, combinator)">
              <p style={prose}>
                A variant of <code>zipWith</code> that accepts a combinator function to produce a custom
                result type instead of Tuple2.
              </p>
              <CodeBlock
                code={`// FreeShippingZipProvider.kt — zip dealerships with zone lookup
return dealerships.zipWith(zoneRepeat) { dealership, zoneMap ->
    val activities = dealership.activities
        .filter { it.activity == libraFreeShippingActivity.toString() }

    dealership.dealershipId to activities.mapNotNull {
        zoneMap[it.zoneId.toInt()]
    }
}`}
                language="kotlin"
                filename="FreeShippingZipProvider.kt"
              />
            </Card>
          </div>

          {/* .switchIfEmpty() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title=".switchIfEmpty(fallback)">
              <p style={prose}>
                If the upstream Mono/Flux completes without emitting any elements, switches to the
                provided fallback publisher. This is the reactive equivalent of <code>if (result == null) return default</code>.
              </p>
              <div style={marbleDiagram}>
{`Source:    ──|                    (empty!)

.switchIfEmpty(Mono.just(false))

Result:    ──●──|
            false`}
              </div>
              <CodeBlock
                code={`// MongoVehicleDaoImpl.kt — return false if VIN not found
override fun vinExists(vin: String): Mono<Boolean> =
    mongoCollection
        .find(Vehicle::vin eq vin)
        .projection(Document(Vehicle::vin.path(), 1))
        .first()
        .toMono()
        .map { true }
        .switchIfEmpty { Mono.just(false) }  // No doc found → false`}
                language="kotlin"
                filename="MongoVehicleDaoImpl.kt"
              />
            </Card>
          </div>

          {/* .defaultIfEmpty() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title=".defaultIfEmpty(value)">
              <p style={prose}>
                Emits a default value if the upstream completes without any elements. Simpler than
                <code> switchIfEmpty</code> when the fallback is a plain value (not a publisher).
              </p>
              <CodeBlock
                code={`// MongoAggregationDao.kt — return empty list if aggregation yields nothing
mongoCollection
    .aggregate(pipeline, returnType.java)
    .toReactor()
    .collectList()
    .defaultIfEmpty(emptyList())  // Never return null, always a list
    .awaitFirst()`}
                language="kotlin"
                filename="MongoAggregationDao.kt"
              />
            </Card>
          </div>
        </motion.section>
      )}

      {/* ============================================================ */}
      {/*  FILTERING OPERATORS                                          */}
      {/* ============================================================ */}
      {isVisible('filtering') && (
        <motion.section id="filtering" style={section} {...fadeUp}>
          <SectionHeader
            label="Filtering"
            title="Filtering Operators"
            description="Operators that select, filter, or pick elements from a reactive stream."
          />

          {/* .filter() */}
          <Card title=".filter(predicate)">
            <p style={prose}>
              Evaluates a predicate for each element and only emits those that match.
              Elements that don't satisfy the predicate are silently dropped.
            </p>
            <div style={marbleDiagram}>
{`Source:  ──●──●──●──●──●──|
          1    2    3    4    5

.filter { it % 2 == 0 }

Result:  ─────●─────●─────|
              2        4`}
            </div>
            <CodeBlock
              code={`// ImpelSpinApi.kt — only retry on non-4xx errors
.retryWhen(
    Retry.backoff(5, Duration.ofMillis(500))
        .filter { exception ->
            when {
                exception is WebClientResponseException
                    && exception.statusCode.is4xxClientError -> false  // Don't retry 4xx
                else -> true  // Retry everything else
            }
        }
)`}
              language="kotlin"
              filename="ImpelSpinApi.kt"
            />
          </Card>

          {/* .first() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title=".first()">
              <p style={prose}>
                Emits only the first element from a Flux and cancels the subscription.
                Errors with <code>NoSuchElementException</code> if the Flux is empty.
              </p>
              <CodeBlock
                code={`// MongoVehicleDaoImpl.kt — get first matching vehicle document
override fun getByVin(vin: String): Mono<Vehicle> =
    mongoCollection
        .find(Vehicle::vin eq vin)
        .toReactor()
        .first()  // Take first match, cancel the rest`}
                language="kotlin"
                filename="MongoVehicleDaoImpl.kt"
              />
            </Card>
          </div>

          {/* .sort() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title=".sort(comparator)">
              <p style={prose}>
                Sorts all elements in a Flux using the given comparator. Note: this operator buffers the
                entire stream in memory before emitting, so only use it on bounded streams.
              </p>
              <CodeBlock
                code={`// CategoryQueries.kt — sort categories by their sortOrder field
return categoryDatabase.read()
    .sort(Comparator.comparing(Category::sortOrder))
    .concatMap { Flux.just(CategoryResult.fromCategory(it)) }
    .collectList()`}
                language="kotlin"
                filename="CategoryQueries.kt"
              />
              <Callout type="warning" title="Memory warning">
                <code>.sort()</code> collects all elements before sorting. On large datasets, consider
                sorting at the database level instead.
              </Callout>
            </Card>
          </div>
        </motion.section>
      )}

      {/* ============================================================ */}
      {/*  ERROR HANDLING                                                */}
      {/* ============================================================ */}
      {isVisible('error-handling') && (
        <motion.section id="error-handling" style={section} {...fadeUp}>
          <SectionHeader
            label="Error Handling"
            title="Error Handling Operators"
            description="Operators that catch errors, provide fallback values, or retry failed operations."
          />

          {/* .onErrorResume() */}
          <Card title=".onErrorResume(exceptionType) { fallback }">
            <p style={prose}>
              Catches errors matching the specified type and switches to a fallback publisher.
              This is the reactive equivalent of <code>try/catch</code>.
            </p>
            <div style={marbleDiagram}>
{`Source:  ──●──✕               (error!)

.onErrorResume { Mono.just(default) }

Result:  ──●──●──|
              default  (recovered!)`}
            </div>
            <CodeBlock
              code={`// ImpelSpinApi.kt — handle specific HTTP errors gracefully
.onErrorResume(WebClientResponseException::class.java) { e ->
    when (e.statusCode) {
        HttpStatus.NOT_FOUND -> {
            log.warn("Could not find spin for '\$vehicleId'")
            Mono.empty()
        }
        HttpStatus.FORBIDDEN -> {
            log.error("Impel API returned 403 for '\$vehicleId'")
            Mono.empty()
        }
        else -> Mono.error(e)  // Re-throw unexpected errors
    }
}`}
              language="kotlin"
              filename="ImpelSpinApi.kt"
            />
          </Card>

          {/* .onErrorMap() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title=".onErrorMap { transform }">
              <p style={prose}>
                Transforms an error into a different exception type without recovering.
                The error still propagates, but with a more meaningful type or message.
              </p>
              <CodeBlock
                code={`// MongoVehicleDaoImpl.kt — wrap low-level DB errors with context
updateVehicleField(it.vin, Vehicle::manuallySuppressed, suppress)
    .doOnNext { log.info("Completed Upserting Manually Suppressed vin \$vin") }
    .onErrorMap { e ->
        Exception("Failed upsertVehicle for vin \$vin to suppress \$suppress", e)
    }

// FeatureQueries.kt — convert to GraphQL-friendly exception
.onErrorMap { GraphQLException(it.message) }`}
                language="kotlin"
                filename="ErrorMapping.kt"
              />
            </Card>
          </div>

          {/* .retryWhen() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title=".retryWhen(retrySpec)">
              <p style={prose}>
                Retries the upstream publisher when an error occurs, using a configurable strategy
                (backoff, max attempts, jitter). This is crucial for resilient HTTP calls and DB operations.
              </p>
              <div style={marbleDiagram}>
{`Source:  ──●──✕                   (error on 1st try)
              ──●──●──|            (success on 2nd try!)

.retryWhen(Retry.backoff(3, 500ms))

Result:  ──●──[500ms wait]──●──●──|`}
              </div>
              <CodeBlock
                code={`// TaxAndFeeClient.kt — exponential backoff with logging
.retryWhen(
    Retry.backoff(
        taxAndFeeConfig.maxAttempts,               // e.g., 3
        Duration.ofMillis(taxAndFeeConfig.minBackoffMs)  // e.g., 200ms
    ).doBeforeRetry {
        val message = it.failure().message ?: "unknown error"
        log.warn(
            "Taxes & Fees call failed, will retry " +
            "(attempt #\${it.totalRetries()}): \$message",
            it.failure()
        )
    }
)`}
                language="kotlin"
                filename="TaxAndFeeClient.kt"
              />
              <Callout type="info" title="Retry.backoff explained">
                <code>Retry.backoff(maxAttempts, minBackoff)</code> uses exponential backoff:
                attempt 1 waits <code>minBackoff</code>, attempt 2 waits <code>minBackoff * 2</code>, etc.,
                with random jitter applied to prevent thundering herd.
              </Callout>
            </Card>
          </div>
        </motion.section>
      )}

      {/* ============================================================ */}
      {/*  SIDE EFFECTS                                                 */}
      {/* ============================================================ */}
      {isVisible('side-effects') && (
        <motion.section id="side-effects" style={section} {...fadeUp}>
          <SectionHeader
            label="Side Effects"
            title="Side Effect Operators"
            description="Operators that perform actions (logging, metrics, etc.) without modifying the stream itself."
          />

          <Callout type="warning" title="Side effects don't change the stream">
            All <code>doOn*</code> operators are "peek" operations. They observe signals but never modify
            the data flowing through. Use <code>.map()</code> or <code>.flatMap()</code> if you need to
            transform elements.
          </Callout>

          <div style={{ marginTop: '1.5rem', ...grid2 }}>
            <Card title=".doOnNext(action)" variant="yellow">
              <p style={prose}>Runs for <strong>each element</strong> emitted.</p>
              <CodeBlock
                code={`.doOnNext {
    log.info("Completed Upserting vin \$vin")
}`}
                language="kotlin"
                filename="doOnNext"
              />
            </Card>

            <Card title=".doOnError(action)" variant="red">
              <p style={prose}>Runs when an <strong>error</strong> signal arrives.</p>
              <CodeBlock
                code={`.doOnError {
    log.error("Merge error: \${it.message}", it)
}`}
                language="kotlin"
                filename="doOnError"
              />
            </Card>

            <Card title=".doOnSuccess(action)" variant="green">
              <p style={prose}>Runs on <strong>Mono completion</strong> (with or without a value).</p>
              <CodeBlock
                code={`mongoDatabase.getCollectionOfName<Vehicle>(name)
    .drop()
    .toMono()
    .doOnSuccess { log.info("Removed '\$name'") }`}
                language="kotlin"
                filename="doOnSuccess"
              />
            </Card>

            <Card title=".doOnSubscribe(action)" variant="blue">
              <p style={prose}>Runs when someone <strong>subscribes</strong> to the stream.</p>
              <CodeBlock
                code={`.doOnSubscribe {
    log.info("Deleting all leasing information!")
}`}
                language="kotlin"
                filename="doOnSubscribe"
              />
            </Card>

            <Card title=".doOnComplete(action)" variant="cyan">
              <p style={prose}>Runs on successful <strong>completion</strong> (Flux only).</p>
              <CodeBlock
                code={`.doOnComplete {
    log.info("Merge completed: \$merged vehicles")
}`}
                language="kotlin"
                filename="doOnComplete"
              />
            </Card>

            <Card title=".doFinally(action)" variant="purple">
              <p style={prose}>Runs on <strong>any termination</strong> (complete, error, or cancel).</p>
              <CodeBlock
                code={`.doFinally { signal ->
    when (signal) {
        SignalType.ON_COMPLETE ->
            log.info("Completed upserting vin \$vin")
        SignalType.ON_ERROR ->
            log.error("Error upserting vin \$vin")
        else -> {}
    }
}`}
                language="kotlin"
                filename="doFinally"
              />
            </Card>
          </div>
        </motion.section>
      )}

      {/* ============================================================ */}
      {/*  COLLECTION & BATCHING                                        */}
      {/* ============================================================ */}
      {isVisible('collection') && (
        <motion.section id="collection" style={section} {...fadeUp}>
          <SectionHeader
            label="Collection"
            title="Collection & Batching Operators"
            description="Operators that gather stream elements into collections or process them in batches."
          />

          {/* .collectList() */}
          <Card title=".collectList()">
            <p style={prose}>
              Collects <strong>all</strong> elements from a Flux into a single <code>Mono&lt;List&lt;T&gt;&gt;</code>.
              The Mono emits once the Flux completes. This bridges reactive back to imperative.
            </p>
            <div style={marbleDiagram}>
{`Flux:     ──●──●──●──|
            A    B    C

.collectList()

Mono:     ─────────────●──|
                     [A,B,C]`}
            </div>
            <CodeBlock
              code={`// FreeShippingZipProvider.kt — collect zones into a lookup map
val zoneLookup: Mono<Map<Int, Zone>> =
    zones
        .collectList()
        .map { allZones -> allZones.associateBy { it.id } }`}
              language="kotlin"
              filename="FreeShippingZipProvider.kt"
            />
          </Card>

          {/* .collectMap() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title=".collectMap(keyExtractor, valueExtractor)">
              <p style={prose}>
                Collects elements into a <code>Mono&lt;Map&lt;K, V&gt;&gt;</code> by extracting keys and values
                from each element. A reactive <code>associateBy</code>.
              </p>
              <CodeBlock
                code={`// FreeShippingZipProvider.kt — build dealerId → zip codes map
}.collectMap(
    { it.first },   // key: dealershipId
    { it.second }   // value: list of zip codes
)`}
                language="kotlin"
                filename="FreeShippingZipProvider.kt"
              />
            </Card>
          </div>

          {/* .buffer() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title=".buffer(size)">
              <p style={prose}>
                Groups elements into batches of the specified size. The stream becomes
                <code> Flux&lt;List&lt;T&gt;&gt;</code>. Useful for batch processing to reduce DB round-trips.
              </p>
              <div style={marbleDiagram}>
{`Source:  ──●──●──●──●──●──|
          1    2    3    4    5

.buffer(2)

Result:  ──────●──────●──●──|
           [1,2]    [3,4]  [5]`}
              </div>
              <CodeBlock
                code={`// DatabaseCleanup.kt — process deletions in batches of 100
.buffer(100)
.doOnNext { log.info("Removed leasing data for \${it.size} vehicles") }`}
                language="kotlin"
                filename="DatabaseCleanup.kt"
              />
            </Card>
          </div>
        </motion.section>
      )}

      {/* ============================================================ */}
      {/*  FLOW CONTROL                                                 */}
      {/* ============================================================ */}
      {isVisible('flow-control') && (
        <motion.section id="flow-control" style={section} {...fadeUp}>
          <SectionHeader
            label="Flow Control"
            title="Flow Control Operators"
            description="Operators that control timing, caching, backpressure, and subscription sharing."
          />

          {/* .limitRate() */}
          <Card title=".limitRate(prefetch)">
            <p style={prose}>
              Limits the number of elements requested from upstream at a time. This provides <strong>backpressure</strong>,
              preventing overwhelming slow consumers or large MongoDB cursors.
            </p>
            <CodeBlock
              code={`// MongoVehicleDaoImpl.kt — process large collection without OOM
collection
    .find()
    .projection(Document(Vehicle::vin.path(), 1))
    .toFlux()
    .limitRate(100)   // Only fetch 100 docs at a time from MongoDB
    .map { it.vin }`}
              language="kotlin"
              filename="MongoVehicleDaoImpl.kt"
            />
            <Callout type="success" title="Why limitRate matters">
              Without <code>limitRate</code>, the MongoDB driver might try to load millions of documents into memory.
              With <code>limitRate(100)</code>, it processes in chunks, keeping memory usage constant.
            </Callout>
          </Card>

          {/* .timeout() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title=".timeout(duration)">
              <p style={prose}>
                Cancels the subscription and throws <code>TimeoutException</code> if no element is emitted
                within the specified duration. Essential for preventing hung operations.
              </p>
              <CodeBlock
                code={`// ImpelNotificationHandler.kt — fail fast if DB is unresponsive
val exists = vehicleDao
    .vinExists(notification.vehicleId)
    .retryWhen(Retry.backoff(3, Duration.ofMillis(200)))
    .timeout(Duration.ofSeconds(2))  // Give up after 2 seconds total`}
                language="kotlin"
                filename="ImpelNotificationHandler.kt"
              />
            </Card>
          </div>

          {/* .cache() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title=".cache()">
              <p style={prose}>
                Caches the result of a Mono and replays it to all subsequent subscribers without
                re-executing the upstream. Perfect for expensive lookups that rarely change.
              </p>
              <div style={marbleDiagram}>
{`First subscribe:   DB query ──●──|
                              result

Second subscribe:  (from cache) ──●──|
                                 result   ← no DB call!`}
              </div>
              <CodeBlock
                code={`// FreeShippingZipProvider.kt — cache zone lookup to avoid re-querying
val zoneLookup: Mono<Map<Int, Zone>> =
    zones.collectList().map { allZones -> allZones.associateBy { it.id } }

val zoneRepeat = zoneLookup.cache().repeat()
//                          ^^^^^  result cached for all zips`}
                language="kotlin"
                filename="FreeShippingZipProvider.kt"
              />
            </Card>
          </div>

          {/* .share() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title=".share()">
              <p style={prose}>
                Shares a single subscription among multiple subscribers (hot source). Unlike <code>.cache()</code>,
                late subscribers only see <strong>new</strong> elements — they miss anything emitted before they subscribed.
              </p>
              <CodeBlock
                code={`// FeatureMutations.kt — share the subscription across callers
private fun getExistingFeatures(): Mono<List<Feature>> {
    return featureDatabase
        .read()
        .collectList()
        .share()  // Multiple callers share the same in-flight query
        .doOnError { log.error("Error reading features: \${it.message}", it) }
}`}
                language="kotlin"
                filename="FeatureMutations.kt"
              />
            </Card>
          </div>

          {/* .repeat() */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card title=".repeat()">
              <p style={prose}>
                Re-subscribes to the source when it completes, creating an infinite stream.
                Often combined with <code>.cache()</code> to replay a cached value infinitely
                (useful with <code>.zipWith()</code>).
              </p>
              <CodeBlock
                code={`// FreeShippingZipProvider.kt — repeat cached zone map for each dealership
val zoneRepeat = zoneLookup.cache().repeat()
// cache() = compute once, repeat() = emit that value forever
// So zoneRepeat is an infinite Flux emitting the same Map`}
                language="kotlin"
                filename="FreeShippingZipProvider.kt"
              />
            </Card>
          </div>
        </motion.section>
      )}

      {/* ============================================================ */}
      {/*  TERMINAL OPERATORS                                           */}
      {/* ============================================================ */}
      {isVisible('terminal') && (
        <motion.section id="terminal" style={section} {...fadeUp}>
          <SectionHeader
            label="Terminal"
            title="Terminal Operators"
            description="Operators that trigger subscription, extract values, or chain Mono completions."
          />

          <div style={grid2}>
            {/* .then() */}
            <Card title=".then()" variant="blue">
              <p style={prose}>
                Ignores the emitted element and replays only the <strong>completion/error signal</strong>.
                Returns <code>Mono&lt;Void&gt;</code>. Useful when you care about "done" not "what".
              </p>
              <CodeBlock
                code={`// Chain two updates — ignore first result
updateVehicleField(it.vin,
    Vehicle::availability / Availability::purchasePending,
    suppress
).then(
    updateVehicleField(it.vin,
        Vehicle::availability / Availability::enqueuedTime,
        enqueuedTime
    )
)`}
                language="kotlin"
                filename="MongoVehicleDaoImpl.kt"
              />
            </Card>

            {/* .thenReturn() */}
            <Card title=".thenReturn(value)" variant="green">
              <p style={prose}>
                Ignores the emitted element and emits a specified constant value on completion.
                Useful for returning the input after a void operation.
              </p>
              <CodeBlock
                code={`// MongoVehicleDaoImpl.kt
override fun upsertVehicle(vehicle: Vehicle): Mono<Vehicle> =
    mongoCollection
        .save(vehicle)
        .thenReturn(vehicle)  // save returns Void, we want the Vehicle back`}
                language="kotlin"
                filename="MongoVehicleDaoImpl.kt"
              />
            </Card>

            {/* .subscribe() */}
            <Card title=".subscribe()" variant="purple">
              <p style={prose}>
                Triggers the reactive chain. <strong>Nothing happens until you subscribe.</strong>
                This is the "go" button. Use for fire-and-forget operations.
              </p>
              <CodeBlock
                code={`// DatabaseCleanup.kt — fire and forget
.doOnSubscribe {
    log.info("Deleting all leasing info!")
}
.subscribe()  // Start the pipeline`}
                language="kotlin"
                filename="DatabaseCleanup.kt"
              />
              <Callout type="danger" title="Don't forget to subscribe!">
                A reactive chain without <code>.subscribe()</code> (or a framework doing it for you)
                will <strong>never execute</strong>. It's like writing a SQL query but never running it.
              </Callout>
            </Card>

            {/* .block() */}
            <Card title=".block()" variant="red">
              <p style={prose}>
                Blocks the current thread and waits for the Mono/Flux to complete. Returns the value.
                <strong> Only use in non-reactive contexts</strong> (tests, cron jobs, initialization).
              </p>
              <CodeBlock
                code={`// DatabaseCleanup.kt — cron context, blocking is OK
.doOnError {
    log.error("Error in cleanup on '\$name': \${it.message}", it)
}
.block()  // Wait for cleanup to finish before next step`}
                language="kotlin"
                filename="DatabaseCleanup.kt"
              />
              <Callout type="danger" title="Never block in a WebFlux handler!">
                Calling <code>.block()</code> inside a reactive handler (controller, filter) will
                deadlock. Spring WebFlux has a limited number of event loop threads — blocking one
                stalls the entire server. Use <code>.flatMap()</code> chains instead.
              </Callout>
            </Card>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <Card title=".awaitFirst() (Coroutines bridge)">
              <p style={prose}>
                Suspends the coroutine and returns the first element. This bridges Reactor into
                Kotlin coroutines. Unlike <code>.block()</code>, this is non-blocking.
              </p>
              <CodeBlock
                code={`// MongoAggregationDao.kt — suspend function using awaitFirst
mongoCollection
    .aggregate(pipeline, returnType.java)
    .toReactor()
    .collectList()
    .defaultIfEmpty(emptyList())
    .awaitFirst()  // Non-blocking suspension until result is ready`}
                language="kotlin"
                filename="MongoAggregationDao.kt"
              />
            </Card>
          </div>
        </motion.section>
      )}

      {/* ============================================================ */}
      {/*  KOTLIN EXTENSIONS                                            */}
      {/* ============================================================ */}
      {isVisible('kotlin-ext') && (
        <motion.section id="kotlin-ext" style={section} {...fadeUp}>
          <SectionHeader
            label="Kotlin"
            title="Kotlin Extension Functions"
            description="Extension functions from reactor-kotlin-extensions and KMongo that bridge MongoDB drivers to Reactor types."
          />

          <div style={grid2}>
            <Card title=".toFlux()" variant="cyan">
              <p style={prose}>
                Converts a MongoDB <code>FindPublisher</code>, coroutine <code>Flow</code>, or other reactive
                type into a Reactor <code>Flux</code>.
              </p>
              <CodeBlock
                code={`// MongoVehicleDaoImpl.kt — MongoDB cursor to Flux
override fun getSearchSuggestions(
    pipeline: Array<Bson>
): Flux<VehicleAutoCompleteResult> {
    return mongoCollection
        .aggregate<VehicleAutoCompleteResult>(*pipeline)
        .toFlux()  // MongoDB Publisher → Reactor Flux
}`}
                language="kotlin"
                filename="MongoVehicleDaoImpl.kt"
              />
            </Card>

            <Card title=".toMono()" variant="purple">
              <p style={prose}>
                Converts a MongoDB <code>Publisher</code> (single result) or other reactive type
                into a Reactor <code>Mono</code>.
              </p>
              <CodeBlock
                code={`// MongoVehicleDaoImpl.kt — single MongoDB result to Mono
override fun getCountOf(vararg pipeline: Bson): Mono<Long> =
    mongoCollection
        .aggregate<Document>(*pipeline,
            group("", BsonField("count", Document("\$sum", 1)))
        )
        .toMono()  // Publisher<Document> → Mono<Document>
        .map { it.get("count", 0L).toLong() }`}
                language="kotlin"
                filename="MongoVehicleDaoImpl.kt"
              />
            </Card>
          </div>
        </motion.section>
      )}

      {/* ============================================================ */}
      {/*  COMMON PATTERNS                                              */}
      {/* ============================================================ */}
      <motion.section id="patterns" style={section} {...fadeUp}>
        <SectionHeader
          label="Patterns"
          title="Common Reactor Patterns in Odyssey"
          description="Recurring operator combinations that solve real problems in the codebase."
        />

        <Tabs tabs={[
          {
            label: 'Async Lookup with Fallback',
            content: (
              <>
                <p style={prose}>
                  The most common pattern: look something up asynchronously and provide a fallback if not found.
                </p>
                <CodeBlock
                  code={`// Pattern: async lookup → map → fallback
vehicleDao.getByVin(vin)
    .map { Optional.of(it) }              // Wrap in Optional
    .switchIfEmpty(Mono.just(Optional.empty()))  // Not found → empty Optional
    // Never errors on "not found", always returns a value`}
                  language="kotlin"
                  filename="LookupWithFallback.kt"
                />
              </>
            ),
          },
          {
            label: 'Resilient HTTP Call',
            content: (
              <>
                <p style={prose}>
                  Combining retry, timeout, and error handling for robust external API calls.
                </p>
                <CodeBlock
                  code={`// Pattern: HTTP call → retry → timeout → error handling
webClient.get()
    .uri("/api/resource/\$id")
    .retrieve()
    .bodyToMono(Response::class.java)
    .retryWhen(
        Retry.backoff(3, Duration.ofMillis(200))
            .filter { it !is WebClientResponseException || !it.statusCode.is4xxClientError }
    )
    .timeout(Duration.ofSeconds(5))
    .onErrorResume { e ->
        log.error("Failed after retries: \${e.message}")
        Mono.empty()
    }`}
                  language="kotlin"
                  filename="ResilientHttpCall.kt"
                />
              </>
            ),
          },
          {
            label: 'Batch Processing Pipeline',
            content: (
              <>
                <p style={prose}>
                  Processing large datasets with backpressure, batching, and progress logging.
                </p>
                <CodeBlock
                  code={`// Pattern: stream → rate limit → batch → process → log
mongoCollection.find()
    .toFlux()
    .limitRate(100)                        // Backpressure: 100 at a time
    .buffer(50)                            // Group into batches of 50
    .flatMap { batch ->
        processBatch(batch)                // Async batch processing
            .doOnNext { log.info("Processed \${batch.size} items") }
    }
    .doOnComplete { log.info("All items processed") }
    .subscribe()`}
                  language="kotlin"
                  filename="BatchPipeline.kt"
                />
              </>
            ),
          },
          {
            label: 'Cache + Repeat for Joins',
            content: (
              <>
                <p style={prose}>
                  Using <code>.cache().repeat()</code> to simulate a join between two collections.
                </p>
                <CodeBlock
                  code={`// Pattern: cache a lookup, zip it with each element
val lookupMono: Mono<Map<Int, Zone>> = zones.collectList()
    .map { it.associateBy { z -> z.id } }

val lookupRepeated = lookupMono.cache().repeat()
// cache() = query DB once
// repeat() = emit that same map forever (infinite Flux)

dealerships.zipWith(lookupRepeated) { dealer, zoneMap ->
    // For each dealer, we have the full zone map available
    dealer to zoneMap[dealer.zoneId]
}`}
                  language="kotlin"
                  filename="CacheRepeatJoin.kt"
                />
              </>
            ),
          },
        ]} />
      </motion.section>

      {/* ============================================================ */}
      {/*  ANTI-PATTERNS                                                */}
      {/* ============================================================ */}
      <motion.section id="anti-patterns" style={section} {...fadeUp}>
        <SectionHeader
          label="Pitfalls"
          title="Anti-Patterns to Avoid"
          description="Common mistakes when working with Reactor. Learn what NOT to do."
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card title="Blocking inside a reactive chain" variant="red">
            <div style={grid2}>
              <div>
                <span style={operatorBadge(c.red)}>BAD</span>
                <CodeBlock
                  code={`// WRONG: blocks the event loop thread!
fun getVehicle(vin: String): Mono<Vehicle> {
    val vehicle = vehicleDao
        .getByVin(vin)
        .block()  // DEADLOCK RISK!
    return Mono.just(vehicle!!)
}`}
                  language="kotlin"
                  filename="Blocking.kt"
                />
              </div>
              <div>
                <span style={operatorBadge(c.green)}>GOOD</span>
                <CodeBlock
                  code={`// CORRECT: keep the chain reactive
fun getVehicle(vin: String): Mono<Vehicle> {
    return vehicleDao
        .getByVin(vin)
        // Just return the Mono — the framework subscribes
}`}
                  language="kotlin"
                  filename="Reactive.kt"
                />
              </div>
            </div>
          </Card>

          <Card title="Using .map() when you need .flatMap()" variant="red">
            <div style={grid2}>
              <div>
                <span style={operatorBadge(c.red)}>BAD</span>
                <CodeBlock
                  code={`// WRONG: results in Mono<Mono<Vehicle>>
vehicleDao.getByVin(vin)
    .map { vehicle ->
        enrichmentService.enrich(vehicle)
        // Returns Mono<Vehicle>, not Vehicle!
    }`}
                  language="kotlin"
                  filename="NestedMono.kt"
                />
              </div>
              <div>
                <span style={operatorBadge(c.green)}>GOOD</span>
                <CodeBlock
                  code={`// CORRECT: flatMap unwraps the inner Mono
vehicleDao.getByVin(vin)
    .flatMap { vehicle ->
        enrichmentService.enrich(vehicle)
        // flatMap flattens Mono<Mono<V>> → Mono<V>
    }`}
                  language="kotlin"
                  filename="FlatMap.kt"
                />
              </div>
            </div>
          </Card>

          <Card title="Forgetting that nothing happens until subscribe" variant="red">
            <div style={grid2}>
              <div>
                <span style={operatorBadge(c.red)}>BAD</span>
                <CodeBlock
                  code={`// WRONG: this pipeline never executes!
fun deleteVehicle(vin: String) {
    vehicleDao.delete(vin)
        .doOnSuccess { log.info("Deleted \$vin") }
    // Nobody subscribed → nothing happens
}`}
                  language="kotlin"
                  filename="NoSubscribe.kt"
                />
              </div>
              <div>
                <span style={operatorBadge(c.green)}>GOOD</span>
                <CodeBlock
                  code={`// CORRECT: return the Mono so the framework subscribes
fun deleteVehicle(vin: String): Mono<Void> {
    return vehicleDao.delete(vin)
        .doOnSuccess { log.info("Deleted \$vin") }
    // Spring WebFlux subscribes to the returned Mono
}`}
                  language="kotlin"
                  filename="ReturnMono.kt"
                />
              </div>
            </div>
          </Card>
        </div>
      </motion.section>
    </div>
  );
}
