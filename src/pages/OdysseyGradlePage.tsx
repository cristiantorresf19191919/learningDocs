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
  { id: 'overview', label: 'Project Overview' },
  { id: 'module-architecture', label: 'Module Architecture' },
  { id: 'gradle-config', label: 'Gradle Configuration' },
  { id: 'dependencies', label: 'Dependencies' },
  { id: 'version-catalog', label: 'Version Catalog' },
  { id: 'module-details', label: 'Module Build Files' },
  { id: 'tech-stack', label: 'Technology Stack' },
  { id: 'mongodb-collections', label: 'MongoDB Collections' },
  { id: 'atlas-search', label: 'Atlas Search Indexes' },
  { id: 'spring-profiles', label: 'Spring Profiles' },
  { id: 'code-quality', label: 'Code Quality' },
  { id: 'testing', label: 'Testing Strategy' },
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
const mermaidModuleArch = `graph TB
    subgraph Deployable Services
      ROUTES[routes<br/>REST + GraphQL Mutations<br/>artifact-conventions]
      SEARCH[search<br/>GraphQL Search Queries<br/>artifact-conventions]
      CRON[cron<br/>Scheduled Tasks<br/>artifact-conventions]
      CONSUMER[consumer<br/>Lease Consumer<br/>artifact-conventions]
      AVAIL[availability<br/>Cart Status<br/>artifact-conventions]
    end
    subgraph Libraries
      LIB[library<br/>Core: Models, DAOs, Clients<br/>library-conventions]
      GQL[graphql-shared<br/>Shared GraphQL Types<br/>library-conventions]
      UTIL[utilities<br/>Dev CLI Tools<br/>library-conventions]
      TESTS[tests<br/>Integration Tests<br/>library-conventions]
    end
    ROUTES --> LIB
    ROUTES --> GQL
    SEARCH --> LIB
    SEARCH --> GQL
    CRON --> LIB
    CONSUMER --> LIB
    AVAIL --> LIB
    GQL --> LIB
    style ROUTES fill:#1f6feb,stroke:#58a6ff,color:#fff
    style SEARCH fill:#1f6feb,stroke:#58a6ff,color:#fff
    style CRON fill:#238636,stroke:#3fb950,color:#fff
    style CONSUMER fill:#6e40c9,stroke:#bc8cff,color:#fff
    style AVAIL fill:#6e40c9,stroke:#bc8cff,color:#fff
    style LIB fill:#d29922,stroke:#e3b341,color:#000
    style GQL fill:#d29922,stroke:#e3b341,color:#000`;

const mermaidGradleBuildFlow = `graph TD
    A[settings.gradle.kts] --> B[Plugin Management]
    B --> C[driveway.top-level-conventions v2.1.0]
    B --> D[driveway.artifact-conventions v2.1.0]
    B --> E[driveway.library-conventions v2.1.0]
    B --> F[com.expediagroup.graphql v8.4.0]
    A --> G[Include 9 Subprojects]
    G --> H[build.gradle.kts per module]
    H --> I[./gradlew bootJar --parallel]
    I --> J[5 Spring Boot JARs]
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style C fill:#d29922,stroke:#e3b341,color:#000
    style D fill:#d29922,stroke:#e3b341,color:#000
    style E fill:#d29922,stroke:#e3b341,color:#000
    style F fill:#6e40c9,stroke:#bc8cff,color:#fff
    style I fill:#238636,stroke:#3fb950,color:#fff
    style J fill:#238636,stroke:#3fb950,color:#fff`;

const mermaidDependencyCategories = `graph TB
    subgraph Core Frameworks
      A[Spring Boot 3.4.3]
      B[Spring WebFlux]
      C[Kotlin 1.9.20]
      D[JDK 21 Eclipse Temurin]
    end
    subgraph Database
      E[KMongo Reactor 4.7.1]
      F[Spring Data MongoDB Reactive]
      G[MongoDB Atlas]
    end
    subgraph Reactive
      H[Project Reactor 3.5.9]
      I[Kotlinx Coroutines 1.7.3]
      J[BlockHound 1.0.11]
    end
    subgraph GraphQL
      K[Expedia GraphQL Server 7.0.2]
      L[Expedia GraphQL Client 7.0.2]
      M[GraphQL Kotlin Plugin 8.4.0]
    end
    subgraph Messaging
      N[Azure Service Bus 7.10.1]
      O[Lithia ASB 0.3.4]
    end
    subgraph Cloud
      P[Azure Blob Storage 12.22.1]
    end
    subgraph Observability
      Q[Micrometer Datadog 1.11.3]
      R[OpenTracing 0.33.0]
      S[Logstash Logback 7.2]
    end
    subgraph Testing
      T[JUnit 5]
      U[MockK 1.13.4]
      V[Kotest 5.4.2]
      W[Reactor Test 3.5.9]
    end
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style B fill:#1f6feb,stroke:#58a6ff,color:#fff
    style C fill:#1f6feb,stroke:#58a6ff,color:#fff
    style D fill:#1f6feb,stroke:#58a6ff,color:#fff
    style E fill:#d29922,stroke:#e3b341,color:#000
    style F fill:#d29922,stroke:#e3b341,color:#000
    style G fill:#d29922,stroke:#e3b341,color:#000
    style K fill:#6e40c9,stroke:#bc8cff,color:#fff
    style L fill:#6e40c9,stroke:#bc8cff,color:#fff
    style M fill:#6e40c9,stroke:#bc8cff,color:#fff`;

const mermaidTechStack = `graph LR
    subgraph Language and Runtime
      A[Kotlin 1.9.20]
      B[JDK 21]
      C[Gradle 8.5 Kotlin DSL]
    end
    subgraph Framework
      D[Spring Boot 3.4.3]
      E[Spring WebFlux]
      F[Project Reactor]
    end
    subgraph Data
      G[MongoDB Atlas]
      H[Azure Cosmos DB]
      I[KMongo Reactor]
    end
    subgraph API
      J[GraphQL Code-First]
      K[REST WebFlux]
      L[NDJSON Streaming]
    end
    subgraph Infrastructure
      M[Azure AKS]
      N[Azure Service Bus]
      O[Azure Blob Storage]
      P[Terraform]
      Q[Helm Charts]
      R[Docker]
    end
    subgraph Quality
      S[Kotlinter Linting]
      T[Detekt Analysis]
      U[Kover Coverage]
      V[BlockHound]
    end
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style B fill:#1f6feb,stroke:#58a6ff,color:#fff
    style C fill:#1f6feb,stroke:#58a6ff,color:#fff
    style D fill:#238636,stroke:#3fb950,color:#fff
    style E fill:#238636,stroke:#3fb950,color:#fff
    style F fill:#238636,stroke:#3fb950,color:#fff
    style G fill:#d29922,stroke:#e3b341,color:#000
    style H fill:#d29922,stroke:#e3b341,color:#000
    style I fill:#d29922,stroke:#e3b341,color:#000
    style M fill:#6e40c9,stroke:#bc8cff,color:#fff
    style N fill:#6e40c9,stroke:#bc8cff,color:#fff
    style O fill:#6e40c9,stroke:#bc8cff,color:#fff`;

const mermaidMongoCollections = `graph TB
    subgraph shopInventory Database
      V[(vehicleV3)]
      SS[(searchSuggestion)]
      SW[(searchScoreWeights)]
      IJ[(inventoryJobDetails)]
      CAT[(categories)]
      FEAT[(features)]
      PC[(postalCodeOemRegions)]
      TEMP[(temp_vehicleV3_*)]
      VT[(vehicleTest)]
      VSRT[(vehicleSearchRelevancyTest)]
    end
    TEMP -.->|merge| V
    CAT -->|referenced by| FEAT
    FEAT -->|used in| V
    V -->|indexed by| AS[shopSearch Atlas Index]
    SS -->|indexed by| ASS[shopSuggestions Atlas Index]
    SW -->|configures scoring for| AS
    IJ -->|tracks imports to| V
    PC -->|lease filtering for| V
    style V fill:#d29922,stroke:#e3b341,color:#000
    style SS fill:#d29922,stroke:#e3b341,color:#000
    style SW fill:#d29922,stroke:#e3b341,color:#000
    style AS fill:#1f6feb,stroke:#58a6ff,color:#fff
    style ASS fill:#1f6feb,stroke:#58a6ff,color:#fff`;

const mermaidAtlasSearch = `graph TB
    subgraph shopSearch Index - vehicleV3
      subgraph Searchable Fields
        A[make, model, trim - string]
        B[bodyStyle, driveType - string]
        C[vin, stockNumber - string]
      end
      subgraph Filterable Fields
        D[status - keyword]
        E[vehicleCondition - facet]
        F[price, msrp - number]
        G[year, mileage - number]
      end
      subgraph Nested Documents
        H[dealer.state, dealer.zip]
        I[leasing.canLease, regionalPrices]
        J[availability.purchasePending]
        K[image.spinUrl, heroUrl]
      end
      subgraph Autocomplete
        L[makeModel - autocomplete]
      end
    end
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style B fill:#1f6feb,stroke:#58a6ff,color:#fff
    style C fill:#1f6feb,stroke:#58a6ff,color:#fff
    style D fill:#238636,stroke:#3fb950,color:#fff
    style E fill:#238636,stroke:#3fb950,color:#fff
    style F fill:#238636,stroke:#3fb950,color:#fff
    style G fill:#238636,stroke:#3fb950,color:#fff
    style L fill:#6e40c9,stroke:#bc8cff,color:#fff`;

const mermaidSpringProfiles = `graph LR
    subgraph Profiles
      A[laptop<br/>Local dev]
      B[dev<br/>DEV environment]
      C[uat<br/>UAT environment]
      D[prod<br/>PROD environment]
    end
    A --> E[Docker MongoDB 27020<br/>Azurite blob/queue<br/>All crons disabled<br/>BlockHound disabled<br/>DataDog disabled]
    B --> F[MongoDB Atlas<br/>Azure Blob<br/>Service Bus<br/>All services active<br/>Impel: drivewaydev]
    D --> G[MongoDB Atlas<br/>Full production<br/>All monitoring<br/>Impel: driveway]
    style A fill:#238636,stroke:#3fb950,color:#fff
    style B fill:#1f6feb,stroke:#58a6ff,color:#fff
    style C fill:#d29922,stroke:#e3b341,color:#000
    style D fill:#da3633,stroke:#f85149,color:#fff`;

const mermaidTestingStrategy = `graph TB
    subgraph Test Types
      A[Unit Tests<br/>90 Kotlin files<br/>JUnit 5 + MockK]
      B[Integration Tests<br/>OkHttp3 + Spring Boot Test]
      C[Functional Tests<br/>Postman/Newman collections]
      D[Performance Tests<br/>K6 load testing]
      E[Search Relevancy<br/>Jupyter notebooks]
    end
    A --> F[./gradlew test]
    B --> G[./gradlew :tests:test]
    C --> H[Newman CLI in pipeline]
    D --> I[K6 container in AKS]
    E --> J[Docker Jupyter notebook]
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style B fill:#1f6feb,stroke:#58a6ff,color:#fff
    style C fill:#238636,stroke:#3fb950,color:#fff
    style D fill:#6e40c9,stroke:#bc8cff,color:#fff
    style E fill:#d29922,stroke:#e3b341,color:#000`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function OdysseyGradlePage() {
  const { setSidebar, clearSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('Gradle & Architecture', tocItems);
    return () => clearSidebar();
  }, [setSidebar, clearSidebar]);

  return (
    <>
      {/* ============ HERO ============ */}
      <section style={heroSection}>
        <div style={heroGradientBg} />
        <motion.div style={heroContent} {...fadeUp}>
          <h1 style={heroTitle}>Odyssey-Api Gradle & Architecture</h1>
          <p style={heroSubtitle}>
            Complete documentation of the Kotlin/Spring Boot 3 multi-module Gradle project powering
            Driveway.com Shop -- covering build configuration, dependency management, MongoDB/Cosmos
            setup, Atlas Search indexes, and the full technology stack.
          </p>
          <div style={statsRow}>
            {[
              { val: '9', label: 'Modules' },
              { val: '5', label: 'Deployable' },
              { val: '30+', label: 'Dependencies' },
              { val: '8.5', label: 'Gradle' },
            ].map((s) => (
              <div key={s.label} style={statBox}>
                <div style={statVal}>{s.val}</div>
                <div style={statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 1: PROJECT OVERVIEW ============ */}
      <section id="overview" style={sectionSpacing}>
        <SectionHeader
          label="Introduction"
          title="Project Overview"
          description="A Kotlin/Spring Boot 3 reactive monorepo managing 100K+ vehicles across hundreds of dealerships"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            Odyssey-Api is a Kotlin/Spring Boot 3 multi-module Gradle project that powers the entire
            Driveway.com Shop experience. The monorepo contains 9 Gradle subprojects -- 5 independently
            deployable Spring Boot services and 4 shared libraries. Built on Gradle 8.5 with the Kotlin DSL,
            it leverages custom Driveway convention plugins for consistent build configuration, artifact
            packaging, and deployment standards across all modules.
          </p>
          <p style={para}>
            The project uses JDK 21 (Eclipse Temurin), Spring WebFlux for fully non-blocking reactive HTTP
            handling, KMongo Reactor for reactive MongoDB access, and Expedia GraphQL for code-first GraphQL
            schema generation. All services are containerized with Docker and deployed to Azure Kubernetes
            Service (AKS) via Helm charts, with infrastructure managed by Terraform.
          </p>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={infoCardTitle}>Build System</div>
              <div style={infoCardText}>
                Gradle 8.5 with Kotlin DSL, custom Driveway convention plugins (top-level, artifact, library),
                parallel build support, and version catalogs for dependency management.
              </div>
            </div>
            <div style={infoCard}>
              <div style={infoCardTitle}>Language & Runtime</div>
              <div style={infoCardText}>
                Kotlin 1.9.20 on JDK 21 Eclipse Temurin. Full null safety, coroutines for async operations,
                data classes for immutable models, and extension functions for clean APIs.
              </div>
            </div>
            <div style={infoCard}>
              <div style={infoCardTitle}>Framework Stack</div>
              <div style={infoCardText}>
                Spring Boot 3.4.3, Spring WebFlux (Netty), Project Reactor for reactive streams,
                Spring Data MongoDB Reactive, and Expedia GraphQL Kotlin for code-first schemas.
              </div>
            </div>
            <div style={infoCard}>
              <div style={infoCardTitle}>Data Layer</div>
              <div style={infoCardText}>
                MongoDB Atlas with Atlas Search indexes, KMongo Reactor 4.7.1 for reactive driver access,
                Azure Blob Storage for file ingestion, Azure Service Bus for messaging.
              </div>
            </div>
          </div>
          <Callout type="info" title="Convention Plugins">
            Driveway convention plugins (v2.1.0) enforce standardized build settings across all modules.
            <strong> artifact-conventions</strong> is applied to deployable services (produces bootJar),
            while <strong>library-conventions</strong> is applied to shared libraries (produces plain JAR).
            The <strong>top-level-conventions</strong> plugin configures the root project with shared
            repositories, dependency management, and code quality tooling.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 2: MODULE ARCHITECTURE ============ */}
      <section id="module-architecture" style={sectionSpacing}>
        <SectionHeader
          label="Architecture"
          title="Module Architecture"
          description="9 Gradle subprojects organized as deployable services and shared libraries"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The monorepo is organized into two categories: 5 deployable services that each produce a
            Spring Boot fat JAR (via the artifact-conventions plugin), and 4 shared libraries consumed
            as project dependencies. The library module is the cornerstone -- it contains all data models,
            DAO classes, external API clients, and shared configuration used by every service.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Module Dependency Graph"
            tabs={[{ label: 'Module Dependencies', source: mermaidModuleArch }]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>All 9 Modules</h3>
          <DataTable
            headers={['Module', 'Type', 'Convention Plugin', 'Main Class', 'Purpose']}
            rows={[
              [
                'routes',
                'Deployable Service',
                'artifact-conventions',
                'OdysseyApplicationKt',
                'REST API endpoints + GraphQL Mutations for vehicle CRUD, suppressions, score weights, and admin operations. Serves /shop/ path prefix.',
              ],
              [
                'search',
                'Deployable Service',
                'artifact-conventions',
                'OdysseySearchApplicationKt',
                'GraphQL Query server for full-text search, faceted filtering, autocomplete suggestions, and vehicle lookups. Serves /shop-graphql/ path prefix.',
              ],
              [
                'cron',
                'Deployable Service',
                'artifact-conventions',
                'OdysseyCronApplicationKt',
                'Scheduled tasks: EDS import (every 30 min), lease expiry cleanup, inventory delta publishing, dealer zone syncing, and blob file maintenance.',
              ],
              [
                'consumer',
                'Deployable Service',
                'artifact-conventions',
                'OdysseyConsumerApplicationKt',
                'Azure Service Bus listener for leasing-incentives-topic. Processes lease pricing messages and updates vehicle leasing data in MongoDB.',
              ],
              [
                'availability',
                'Deployable Service',
                'artifact-conventions',
                'OdysseyAvailSubApplicationKt',
                'Azure Service Bus listener for cart-status-update-topic. Processes cart events and updates vehicle purchasePending/salesPending flags.',
              ],
              [
                'library',
                'Shared Library',
                'library-conventions',
                'N/A',
                'Core module containing all data models (Vehicle, Dealer, Leasing), DAO classes, MongoDB configuration, external API clients (MaxDigital, Libra, Impel), and shared utilities.',
              ],
              [
                'graphql-shared',
                'Shared Library',
                'library-conventions',
                'N/A',
                'Shared GraphQL types, custom scalars, error handling, and common query/mutation argument classes used by both routes and search modules.',
              ],
              [
                'utilities',
                'Shared Library',
                'library-conventions',
                'N/A',
                'Developer CLI tools for local development tasks such as data seeding, index management, and ad-hoc database operations.',
              ],
              [
                'tests',
                'Shared Library',
                'library-conventions',
                'N/A',
                'Integration test suite using OkHttp3 and Spring Boot Test. Runs post-deployment against live environments to validate API contracts and data integrity.',
              ],
            ]}
            highlightColumn={0}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="warning" title="Module Dependency Rules">
            Deployable services may depend on library and graphql-shared but never on each other.
            The graphql-shared module depends on library for shared model types. The utilities and tests
            modules depend on library for data access. This ensures clean separation and independent
            deployability of each service.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 3: GRADLE CONFIGURATION ============ */}
      <section id="gradle-config" style={sectionSpacing}>
        <SectionHeader
          label="Build System"
          title="Gradle Configuration"
          description="Root build.gradle.kts, settings.gradle.kts, and the convention plugin setup"
        />
        <motion.div {...fadeUp}>
          <h3 style={subHeading}>Root build.gradle.kts</h3>
          <p style={para}>
            The root build file applies the top-level-conventions plugin and configures shared settings
            that apply to all 9 subprojects, including code coverage exclusions and common dependencies.
          </p>
          <CodeBlock
            language="kotlin"
            filename="build.gradle.kts"
            showLineNumbers
            code={`plugins {
    id("driveway.top-level-conventions") version "2.1.0"
}

group = "com.lithia"
version = "0.0.1-SNAPSHOT"

// Kover coverage configuration
kover {
    reports {
        filters {
            excludes {
                classes(
                    "com.lithia.odyssey.models.*",
                    "com.lithia.odyssey.generated.*",
                    "com.lithia.odyssey.config.*",
                    "com.lithia.odyssey.*ApplicationKt",
                    "com.lithia.odyssey.graphql.types.*",
                    "com.lithia.odyssey.graphql.inputs.*"
                )
            }
        }
    }
}

// Dependencies shared across all subprojects
subprojects {
    dependencies {
        // Logging
        implementation("net.logstash.logback:logstash-logback-encoder:7.2")
        implementation("io.opentracing:opentracing-api:0.33.0")

        // Testing (all subprojects)
        testImplementation("io.projectreactor:reactor-test")
        testImplementation("io.mockk:mockk:1.13.4")
        testImplementation("io.kotest:kotest-assertions-core:5.4.2")
    }
}`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>settings.gradle.kts</h3>
          <p style={para}>
            The settings file configures plugin management repositories, includes all 9 subprojects,
            and defines the version catalog for shared dependency versions.
          </p>
          <CodeBlock
            language="kotlin"
            filename="settings.gradle.kts"
            showLineNumbers
            code={`pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
        maven {
            name = "AzureDevOpsArtifacts"
            url = uri("https://pkgs.dev.azure.com/lithia/_packaging/...")
            credentials {
                username = "ado"
                password = System.getenv("ADO_ARTIFACTS_TOKEN")
                    ?: providers.gradleProperty("adoArtifactsToken").orNull
                    ?: ""
            }
        }
    }
}

plugins {
    id("driveway.top-level-conventions") version "2.1.0"
}

rootProject.name = "odyssey-api"

// All 9 subprojects
include("library")
include("graphql-shared")
include("routes")
include("search")
include("cron")
include("consumer")
include("availability")
include("utilities")
include("tests")

// Version catalog
dependencyResolutionManagement {
    versionCatalogs {
        create("libs") {
            version("reactorTest", "3.5.9")
            version("apacheCommonLang", "3.12.0")
            version("micrometerDatadog", "1.11.3")
            version("lithiaAsb", "0.3.4")
            version("azureServiceBus", "7.10.1")
            version("apacheCommonCsv", "1.9.0")
            version("graphqlServer", "7.0.2")
            version("graphqlClient", "7.0.2")
        }
    }
}`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Gradle Build Flow"
            tabs={[{ label: 'Build Flow', source: mermaidGradleBuildFlow }]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="danger" title="ADO_ARTIFACTS_TOKEN Required">
            The build requires an Azure DevOps Artifacts token to resolve Driveway convention plugins
            and internal dependencies. Set the <code>ADO_ARTIFACTS_TOKEN</code> environment variable or
            add <code>adoArtifactsToken</code> to your <code>~/.gradle/gradle.properties</code> file.
            Without this token, the build will fail during plugin resolution.
          </Callout>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Key Gradle Commands</h3>
          <DataTable
            headers={['Command', 'Description', 'When to Use']}
            rows={[
              ['./gradlew clean build', 'Full clean build with tests and linting', 'Before opening a PR'],
              ['./gradlew bootJar --parallel', 'Build all 5 Spring Boot JARs in parallel', 'Docker image builds'],
              ['./gradlew test', 'Run all unit tests across all modules', 'During development'],
              ['./gradlew :routes:bootRun', 'Start the routes service locally', 'Local REST/Mutation dev'],
              ['./gradlew :search:bootRun', 'Start the search service locally', 'Local GraphQL query dev'],
              ['./gradlew koverHtmlReport', 'Generate HTML coverage report', 'Coverage analysis'],
              ['./gradlew formatKotlin', 'Auto-format all Kotlin files', 'Before committing'],
              ['./gradlew lintKotlin', 'Check Kotlin formatting without fixing', 'CI lint check'],
              ['./gradlew detekt', 'Run static code analysis', 'Code quality audit'],
              ['./gradlew dependencies', 'Print dependency tree for the root project', 'Debugging version conflicts'],
              ['./gradlew :library:graphqlGenerateClient', 'Generate MaxDigital GraphQL client code', 'After schema changes'],
            ]}
            highlightColumn={0}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 4: DEPENDENCIES ============ */}
      <section id="dependencies" style={sectionSpacing}>
        <SectionHeader
          label="Dependency Management"
          title="Dependencies"
          description="30+ dependencies organized by category across core frameworks, data, GraphQL, messaging, and testing"
        />
        <motion.div {...fadeUp}>
          <MermaidViewer
            title="Dependency Categories"
            tabs={[{ label: 'All Categories', source: mermaidDependencyCategories }]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Core Frameworks</h3>
          <DataTable
            headers={['Dependency', 'Version', 'Module(s)', 'Purpose']}
            rows={[
              ['Spring Boot Starter WebFlux', '3.4.3', 'routes, search', 'Non-blocking HTTP server on Netty with reactive WebFlux framework'],
              ['Spring Boot Starter Data MongoDB Reactive', '3.4.3', 'library', 'Reactive MongoDB driver integration with Spring Data repositories'],
              ['Kotlin stdlib + reflect', '1.9.20', 'All', 'Kotlin standard library and reflection support for Spring DI'],
              ['Kotlinx Coroutines Reactor', '1.7.3', 'All', 'Bridge between Kotlin coroutines and Project Reactor Mono/Flux types'],
              ['Jackson Module Kotlin', '2.15.x', 'All', 'Kotlin-aware JSON serialization/deserialization with data class support'],
              ['Project Reactor Core', '3.5.9', 'All', 'Foundation reactive streams library -- Mono and Flux types'],
              ['Reactor Kotlin Extensions', '1.2.2', 'cron', 'Kotlin extension functions for Reactor (awaitSingle, toMono, etc.)'],
            ]}
            highlightColumn={0}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Database & Data Access</h3>
          <DataTable
            headers={['Dependency', 'Version', 'Module(s)', 'Purpose']}
            rows={[
              ['KMongo Reactor Core', '4.7.1', 'library', 'Kotlin-friendly MongoDB driver with reactive support (Reactor Mono/Flux)'],
              ['KMongo Reactor ID', '4.7.1', 'library', 'ID generation support for KMongo with ObjectId handling'],
              ['MongoDB Driver Reactivestreams', '4.9.x', 'library', 'Low-level reactive MongoDB driver used by KMongo'],
              ['Apache Commons CSV', '1.9.0', 'library', 'CSV/TSV parsing for EDS vehicle data import files'],
              ['Apache Commons Lang3', '3.12.0', 'library', 'String utilities, number utils, and general Java helpers'],
            ]}
            highlightColumn={0}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>GraphQL</h3>
          <DataTable
            headers={['Dependency', 'Version', 'Module(s)', 'Purpose']}
            rows={[
              ['Expedia GraphQL Kotlin Server', '7.0.2', 'routes, search', 'Code-first GraphQL schema generation from Kotlin classes'],
              ['Expedia GraphQL Kotlin Client', '7.0.2', 'library', 'Type-safe GraphQL client for calling external GraphQL APIs (MaxDigital)'],
              ['Expedia GraphQL Kotlin Plugin', '8.4.0', 'library (codegen)', 'Gradle plugin for generating GraphQL client code from .graphql schema files'],
              ['Expedia GraphQL Kotlin Spring Server', '7.0.2', 'routes, search', 'Spring Boot auto-configuration for GraphQL Kotlin server endpoints'],
            ]}
            highlightColumn={0}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Messaging & Cloud</h3>
          <DataTable
            headers={['Dependency', 'Version', 'Module(s)', 'Purpose']}
            rows={[
              ['Azure Service Bus', '7.10.1', 'consumer, availability, library', 'Azure Service Bus client for topic/subscription messaging'],
              ['Lithia ASB (lithia-asb)', '0.3.4', 'consumer, availability', 'Internal Lithia wrapper around Azure Service Bus with retry/dead-letter support'],
              ['Azure Blob Storage', '12.22.1', 'library', 'Azure Blob Storage client for reading/writing EDS TSV files and CSV exports'],
              ['Azure Identity', '1.9.x', 'library', 'Managed identity authentication for Azure services in AKS'],
            ]}
            highlightColumn={0}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Observability & Logging</h3>
          <DataTable
            headers={['Dependency', 'Version', 'Module(s)', 'Purpose']}
            rows={[
              ['Micrometer Registry Datadog', '1.11.3', 'graphql-shared, routes, search', 'Exports metrics to Datadog for monitoring dashboards and alerting'],
              ['OpenTracing API', '0.33.0', 'All', 'Distributed tracing headers propagation across services'],
              ['Logstash Logback Encoder', '7.2', 'All', 'Structured JSON logging output for ELK/Datadog log ingestion'],
              ['Spring Boot Actuator', '3.4.3', 'routes, search', 'Health checks, metrics endpoints, and runtime info for Kubernetes probes'],
            ]}
            highlightColumn={0}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Testing</h3>
          <DataTable
            headers={['Dependency', 'Version', 'Module(s)', 'Purpose']}
            rows={[
              ['JUnit Jupiter (JUnit 5)', '5.10.x', 'All', 'Test framework foundation -- annotations, assertions, lifecycle management'],
              ['MockK', '1.13.4', 'All', 'Kotlin-native mocking library -- coEvery, every, verify, slot'],
              ['Kotest Assertions Core', '5.4.2', 'All', 'Expressive Kotlin assertion library -- shouldBe, shouldContain, shouldThrow'],
              ['Reactor Test', '3.5.9', 'All', 'StepVerifier for testing reactive Mono/Flux pipelines step-by-step'],
              ['Spring Boot Test', '3.4.3', 'All', 'Spring testing context, @WebFluxTest, @SpringBootTest, WebTestClient'],
              ['OkHttp3 MockWebServer', '4.11.x', 'tests', 'Mock HTTP server for integration testing external API clients'],
              ['BlockHound', '1.0.11', 'library', 'Detects blocking calls in reactive threads during tests (and optionally at runtime)'],
            ]}
            highlightColumn={0}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 5: VERSION CATALOG ============ */}
      <section id="version-catalog" style={sectionSpacing}>
        <SectionHeader
          label="Dependency Versions"
          title="Version Catalog"
          description="Centralized version management through Gradle version catalogs and repository configuration"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The project uses Gradle version catalogs defined in <code>settings.gradle.kts</code> to centralize
            dependency version management. This ensures all modules use consistent versions and makes upgrades
            a single-line change. Modules reference versions using the <code>libs.versions</code> accessor.
          </p>
          <CodeBlock
            language="kotlin"
            filename="settings.gradle.kts (version catalog)"
            showLineNumbers
            code={`dependencyResolutionManagement {
    versionCatalogs {
        create("libs") {
            // Reactive testing
            version("reactorTest", "3.5.9")

            // Apache utilities
            version("apacheCommonLang", "3.12.0")
            version("apacheCommonCsv", "1.9.0")

            // Metrics & monitoring
            version("micrometerDatadog", "1.11.3")

            // Azure messaging
            version("lithiaAsb", "0.3.4")
            version("azureServiceBus", "7.10.1")

            // GraphQL
            version("graphqlServer", "7.0.2")
            version("graphqlClient", "7.0.2")
        }
    }
}

// Usage in module build.gradle.kts:
// implementation("io.projectreactor:reactor-test:\${libs.versions.reactorTest.get()}")
// implementation("com.lithia:lithia-asb:\${libs.versions.lithiaAsb.get()}")`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Repository Configuration</h3>
          <p style={para}>
            The project resolves dependencies from three repositories, configured through the
            top-level-conventions plugin. Azure DevOps Artifacts hosts internal Lithia packages
            including the convention plugins and lithia-asb.
          </p>
          <DataTable
            headers={['Repository', 'URL', 'Provides']}
            rows={[
              ['Gradle Plugin Portal', 'https://plugins.gradle.org/m2/', 'Gradle plugins (Kotlinter, Detekt, Kover, GraphQL Kotlin Plugin)'],
              ['Maven Central', 'https://repo.maven.apache.org/maven2/', 'Open-source dependencies (Spring Boot, KMongo, MockK, etc.)'],
              ['Azure DevOps Artifacts', 'https://pkgs.dev.azure.com/lithia/_packaging/...', 'Internal: driveway convention plugins, lithia-asb, shared libraries'],
            ]}
            highlightColumn={0}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="danger" title="ADO_ARTIFACTS_TOKEN">
            The Azure DevOps Artifacts repository requires authentication. You must have the
            <code> ADO_ARTIFACTS_TOKEN</code> environment variable set or configure
            <code> adoArtifactsToken</code> in your <code>~/.gradle/gradle.properties</code>.
            This token is automatically injected in CI/CD pipelines via Azure DevOps service connections.
            For local development, generate a Personal Access Token (PAT) with Packaging read scope.
          </Callout>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Plugin Versions</h3>
          <DataTable
            headers={['Plugin', 'Version', 'Applied To', 'Purpose']}
            rows={[
              ['driveway.top-level-conventions', '2.1.0', 'Root project', 'Shared build settings, repos, dependency management, code quality baseline'],
              ['driveway.artifact-conventions', '2.1.0', 'Deployable services', 'Spring Boot bootJar packaging, Docker image config, health check endpoints'],
              ['driveway.library-conventions', '2.1.0', 'Shared libraries', 'Plain JAR packaging, no bootJar, publishable to internal Maven repo'],
              ['com.expediagroup.graphql', '8.4.0', 'library (codegen)', 'GraphQL client code generation from .graphql schema files'],
              ['org.jmailen.kotlinter', 'managed', 'All (via convention)', 'Kotlin code formatting and linting (ktlint wrapper)'],
              ['io.gitlab.arturbosch.detekt', 'managed', 'All (via convention)', 'Static code analysis for Kotlin with configurable rules'],
              ['org.jetbrains.kotlinx.kover', 'managed', 'Root project', 'Code coverage reporting for Kotlin with JaCoCo-compatible output'],
            ]}
            highlightColumn={0}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 6: MODULE DETAILS ============ */}
      <section id="module-details" style={sectionSpacing}>
        <SectionHeader
          label="Build Files"
          title="Module Build Files"
          description="Key build.gradle.kts configuration for each of the 9 subprojects"
        />

        {/* library */}
        <motion.div {...fadeUp}>
          <h3 style={subHeading}>library/build.gradle.kts</h3>
          <p style={para}>
            The library module is the foundation of the entire project. It contains all data models, DAO
            classes, MongoDB configuration, external API clients, and shared utilities. It uses the
            GraphQL Kotlin plugin for client code generation against the MaxDigital schema, and includes
            the widest range of dependencies.
          </p>
          <CodeBlock
            language="kotlin"
            filename="library/build.gradle.kts"
            showLineNumbers
            code={`plugins {
    id("driveway.library-conventions")
    id("com.expediagroup.graphql") version "8.4.0"
}

dependencies {
    // Spring Boot starters
    implementation("org.springframework.boot:spring-boot-starter-data-mongodb-reactive")
    implementation("org.springframework.boot:spring-boot-starter-webflux")

    // KMongo reactive driver
    implementation("org.litote.kmongo:kmongo-reactor-core:4.7.1")
    implementation("org.litote.kmongo:kmongo-id:4.7.1")

    // Azure cloud services
    implementation("com.azure:azure-storage-blob:12.22.1")
    implementation("com.azure.resourcemanager:azure-resourcemanager-cosmosdb:2.19.0")
    implementation("com.microsoft.azure:azure-servicebus:3.6.7")

    // GraphQL client (for MaxDigital API)
    implementation("com.expediagroup:graphql-kotlin-spring-client:${"$"}{libs.versions.graphqlClient.get()}")

    // Data parsing
    implementation("org.apache.commons:commons-csv:${"$"}{libs.versions.apacheCommonCsv.get()}")
    implementation("org.apache.commons:commons-lang3:${"$"}{libs.versions.apacheCommonLang.get()}")

    // Reactive blocking call detection
    implementation("io.projectreactor.tools:blockhound:1.0.11")
}

// GraphQL client code generation (MaxDigital vehicle images API)
graphql {
    client {
        schemaFile = file("${"$"}projectDir/src/main/resources/graphql/maxdigital-schema.graphql")
        queryFileDirectory = "${"$"}projectDir/src/main/resources/graphql/queries"
        packageName = "com.lithia.odyssey.generated.maxdigital"
    }
}`}
          />
        </motion.div>

        {/* routes */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>routes/build.gradle.kts</h3>
          <p style={para}>
            The routes module is a deployable service providing REST endpoints and GraphQL mutations.
            It depends on both library (for data access) and graphql-shared (for shared GraphQL types).
          </p>
          <CodeBlock
            language="kotlin"
            filename="routes/build.gradle.kts"
            showLineNumbers
            code={`plugins {
    id("driveway.artifact-conventions")
}

dependencies {
    implementation(project(":library"))
    implementation(project(":graphql-shared"))

    // GraphQL server
    implementation("com.expediagroup:graphql-kotlin-spring-server:${"$"}{libs.versions.graphqlServer.get()}")

    // Spring Boot web
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    // Metrics
    implementation("io.micrometer:micrometer-registry-datadog:${"$"}{libs.versions.micrometerDatadog.get()}")
}

springBoot {
    mainClass.set("com.lithia.odyssey.OdysseyApplicationKt")
}`}
          />
        </motion.div>

        {/* search */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>search/build.gradle.kts</h3>
          <p style={para}>
            The search module handles all GraphQL queries -- full-text search, faceted filtering,
            autocomplete, and vehicle lookups via Atlas Search aggregation pipelines.
          </p>
          <CodeBlock
            language="kotlin"
            filename="search/build.gradle.kts"
            showLineNumbers
            code={`plugins {
    id("driveway.artifact-conventions")
}

dependencies {
    implementation(project(":library"))
    implementation(project(":graphql-shared"))

    // GraphQL server
    implementation("com.expediagroup:graphql-kotlin-spring-server:${"$"}{libs.versions.graphqlServer.get()}")

    // Spring Boot web
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    // Metrics
    implementation("io.micrometer:micrometer-registry-datadog:${"$"}{libs.versions.micrometerDatadog.get()}")
}

springBoot {
    mainClass.set("com.lithia.odyssey.OdysseySearchApplicationKt")
}`}
          />
        </motion.div>

        {/* cron */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>cron/build.gradle.kts</h3>
          <p style={para}>
            The cron module runs scheduled tasks including the EDS vehicle import (every 30 minutes),
            lease expiry cleanup, and inventory delta publishing.
          </p>
          <CodeBlock
            language="kotlin"
            filename="cron/build.gradle.kts"
            showLineNumbers
            code={`plugins {
    id("driveway.artifact-conventions")
}

dependencies {
    implementation(project(":library"))

    // Reactor Kotlin extensions for coroutine bridging
    implementation("io.projectreactor.kotlin:reactor-kotlin-extensions:1.2.2")

    // Spring scheduling support
    implementation("org.springframework.boot:spring-boot-starter-webflux")
}

springBoot {
    mainClass.set("com.lithia.odyssey.OdysseyCronApplicationKt")
}`}
          />
        </motion.div>

        {/* consumer */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>consumer/build.gradle.kts</h3>
          <p style={para}>
            The consumer module listens to the leasing-incentives-topic on Azure Service Bus and
            processes lease pricing updates for vehicles in MongoDB.
          </p>
          <CodeBlock
            language="kotlin"
            filename="consumer/build.gradle.kts"
            showLineNumbers
            code={`plugins {
    id("driveway.artifact-conventions")
}

dependencies {
    implementation(project(":library"))

    // Azure Service Bus
    implementation("com.lithia:lithia-asb:${"$"}{libs.versions.lithiaAsb.get()}")
    implementation("com.azure:azure-messaging-servicebus:${"$"}{libs.versions.azureServiceBus.get()}")

    // Spring Boot
    implementation("org.springframework.boot:spring-boot-starter-webflux")
}

springBoot {
    mainClass.set("com.lithia.odyssey.OdysseyConsumerApplicationKt")
}`}
          />
        </motion.div>

        {/* availability */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>availability/build.gradle.kts</h3>
          <p style={para}>
            The availability module listens to the cart-status-update-topic and processes cart events
            to update vehicle availability flags (purchasePending, salesPending).
          </p>
          <CodeBlock
            language="kotlin"
            filename="availability/build.gradle.kts"
            showLineNumbers
            code={`plugins {
    id("driveway.artifact-conventions")
}

dependencies {
    implementation(project(":library"))

    // Azure Service Bus
    implementation("com.lithia:lithia-asb:${"$"}{libs.versions.lithiaAsb.get()}")
    implementation("com.azure:azure-messaging-servicebus:${"$"}{libs.versions.azureServiceBus.get()}")

    // Spring Boot
    implementation("org.springframework.boot:spring-boot-starter-webflux")
}

springBoot {
    mainClass.set("com.lithia.odyssey.OdysseyAvailSubApplicationKt")
}`}
          />
        </motion.div>

        {/* graphql-shared */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>graphql-shared/build.gradle.kts</h3>
          <p style={para}>
            The graphql-shared module contains shared GraphQL types, custom scalars, error handling
            utilities, and common argument classes used by both routes and search.
          </p>
          <CodeBlock
            language="kotlin"
            filename="graphql-shared/build.gradle.kts"
            showLineNumbers
            code={`plugins {
    id("driveway.library-conventions")
}

dependencies {
    implementation(project(":library"))

    // GraphQL server types
    implementation("com.expediagroup:graphql-kotlin-spring-server:${"$"}{libs.versions.graphqlServer.get()}")

    // Metrics (shared DataDog configuration)
    implementation("io.micrometer:micrometer-registry-datadog:${"$"}{libs.versions.micrometerDatadog.get()}")
}`}
          />
        </motion.div>

        {/* utilities */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>utilities/build.gradle.kts</h3>
          <p style={para}>
            Developer CLI tools for local development, data seeding, and ad-hoc database operations.
          </p>
          <CodeBlock
            language="kotlin"
            filename="utilities/build.gradle.kts"
            showLineNumbers
            code={`plugins {
    id("driveway.library-conventions")
}

dependencies {
    implementation(project(":library"))

    // Spring Boot for app context
    implementation("org.springframework.boot:spring-boot-starter-webflux")
}`}
          />
        </motion.div>

        {/* tests */}
        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>tests/build.gradle.kts</h3>
          <p style={para}>
            Integration test suite that runs post-deployment against live environments. Uses OkHttp3
            for HTTP client operations and Spring Boot Test for application context.
          </p>
          <CodeBlock
            language="kotlin"
            filename="tests/build.gradle.kts"
            showLineNumbers
            code={`plugins {
    id("driveway.library-conventions")
}

dependencies {
    implementation(project(":library"))

    // HTTP client for integration tests
    testImplementation("com.squareup.okhttp3:okhttp:4.11.0")
    testImplementation("com.squareup.okhttp3:mockwebserver:4.11.0")

    // Spring Boot Test
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-starter-webflux")

    // Reactor testing
    testImplementation("io.projectreactor:reactor-test:${"$"}{libs.versions.reactorTest.get()}")
}`}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 7: TECHNOLOGY STACK ============ */}
      <section id="tech-stack" style={sectionSpacing}>
        <SectionHeader
          label="Tech Stack"
          title="Technology Stack"
          description="Complete technology overview across language, framework, data, API, infrastructure, and quality layers"
        />
        <motion.div {...fadeUp}>
          <MermaidViewer
            title="Technology Stack Overview"
            tabs={[{ label: 'Full Stack', source: mermaidTechStack }]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Stack Summary</h3>
          <DataTable
            headers={['Layer', 'Technology', 'Version', 'Role']}
            rows={[
              ['Language', 'Kotlin', '1.9.20', 'Primary language -- null safety, data classes, coroutines, extension functions'],
              ['Runtime', 'JDK 21 (Eclipse Temurin)', '21 LTS', 'Java runtime with virtual threads support, ZGC garbage collector'],
              ['Build', 'Gradle (Kotlin DSL)', '8.5', 'Build automation, dependency management, parallel builds, task caching'],
              ['Framework', 'Spring Boot', '3.4.3', 'Application framework with auto-configuration, DI, and production features'],
              ['HTTP', 'Spring WebFlux + Netty', '6.1.x', 'Non-blocking reactive HTTP server, no servlet container required'],
              ['Reactive', 'Project Reactor', '3.5.9', 'Reactive Streams implementation -- Mono (0..1) and Flux (0..N) types'],
              ['Database', 'MongoDB Atlas', '6.x', 'Document database with Atlas Search for full-text indexing'],
              ['DB Driver', 'KMongo Reactor', '4.7.1', 'Kotlin-friendly reactive MongoDB driver built on the official driver'],
              ['API', 'Expedia GraphQL Kotlin', '7.0.2', 'Code-first GraphQL schema from Kotlin classes (server + client)'],
              ['Messaging', 'Azure Service Bus', '7.10.1', 'Topics and subscriptions for async event-driven communication'],
              ['Storage', 'Azure Blob Storage', '12.22.1', 'Object storage for EDS TSV files, CSV exports, and static assets'],
              ['Container', 'Docker', 'latest', 'Multi-stage builds with Eclipse Temurin base image for minimal image size'],
              ['Orchestration', 'Azure AKS', 'managed', 'Kubernetes cluster hosting all 5 services with autoscaling and rolling deploys'],
              ['IaC', 'Terraform', '1.5.x', 'Infrastructure as code for MongoDB indexes, AKS config, Service Bus topics'],
              ['Deploy', 'Helm Charts', '3.x', 'Kubernetes deployment manifests with per-service values and rollback support'],
              ['Metrics', 'Micrometer + Datadog', '1.11.3', 'Application metrics exported to Datadog for dashboards and alerting'],
              ['Logging', 'Logstash + Logback', '7.2', 'Structured JSON logging for ELK stack / Datadog log management'],
              ['Tracing', 'OpenTracing', '0.33.0', 'Distributed tracing header propagation across service boundaries'],
              ['Lint', 'Kotlinter (ktlint)', 'managed', 'Kotlin code formatting enforcement based on official Kotlin style guide'],
              ['Analysis', 'Detekt', 'managed', 'Static code analysis with configurable rules for code smells and complexity'],
              ['Coverage', 'Kover', 'managed', 'Kotlin-native code coverage with JaCoCo-compatible reports for CI gates'],
              ['Blocking Detection', 'BlockHound', '1.0.11', 'Runtime detection of blocking calls on reactive (non-blocking) threads'],
            ]}
            highlightColumn={1}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={infoCardTitle}>Why Kotlin?</div>
              <div style={infoCardText}>
                Kotlin provides null safety at the type system level, concise data classes for immutable
                models, extension functions for clean APIs, and first-class coroutine support for bridging
                reactive and imperative code. It compiles to JVM bytecode with full Java interoperability.
              </div>
            </div>
            <div style={infoCard}>
              <div style={infoCardTitle}>Why Reactive (WebFlux)?</div>
              <div style={infoCardText}>
                Spring WebFlux with Netty handles thousands of concurrent connections on a small thread pool.
                This is critical for the search service which receives high-throughput GraphQL queries,
                and for Service Bus consumers that must process messages without blocking.
              </div>
            </div>
            <div style={infoCard}>
              <div style={infoCardTitle}>Why MongoDB Atlas?</div>
              <div style={infoCardText}>
                MongoDB's flexible document model perfectly fits the nested vehicle data structure.
                Atlas Search provides Lucene-based full-text search, faceting, and autocomplete without
                needing a separate Elasticsearch cluster. Atlas manages scaling, backups, and replication.
              </div>
            </div>
            <div style={infoCard}>
              <div style={infoCardTitle}>Why GraphQL?</div>
              <div style={infoCardText}>
                The Driveway.com frontend needs flexible querying of vehicle data with varying field
                requirements per page. GraphQL allows the frontend to request exactly the fields needed,
                reducing over-fetching. Code-first generation from Kotlin classes eliminates schema drift.
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 8: MONGODB COLLECTIONS ============ */}
      <section id="mongodb-collections" style={sectionSpacing}>
        <SectionHeader
          label="Database"
          title="MongoDB Collections"
          description="The shopInventory database with 10 collections, 22+ indexes, and Atlas Search integration"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The Odyssey-Api uses a single MongoDB database called <code>shopInventory</code> hosted on
            MongoDB Atlas. The primary collection <code>vehicleV3</code> contains all vehicle inventory
            data and is the target of Atlas Search indexes for full-text search. Supporting collections
            handle search suggestions, score weights, import tracking, and reference data.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Collection Relationships"
            tabs={[{ label: 'shopInventory DB', source: mermaidMongoCollections }]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Collection Details</h3>
          <DataTable
            headers={['Collection', 'Purpose', 'Key Fields', 'Indexes']}
            rows={[
              [
                'vehicleV3',
                'Primary vehicle inventory -- 100K+ documents with full vehicle data including pricing, leasing, availability, dealer info, and images',
                'vin, vehicleId, status, ymmt.*, price, mileage, dealer.*, leasing.*, availability.*, image.*, bodyStyle, driveType',
                '22+ indexes including compound indexes on vin, vehicleId, dealer.id+status, status+vehicleCondition, and Atlas Search (shopSearch)',
              ],
              [
                'searchSuggestion',
                'Autocomplete suggestions for the search bar -- pre-computed make/model combinations with popularity scores',
                'suggestion, make, model, count, rank',
                'Atlas Search index (shopSuggestions) with autocomplete mapping on suggestion field',
              ],
              [
                'searchScoreWeights',
                'Configurable search relevancy scoring weights used by the Atlas Search aggregation pipeline',
                'field, weight, boost, category',
                'Unique index on field name',
              ],
              [
                'inventoryJobDetails',
                'Tracks EDS import job execution history -- start/end times, counts, errors, and delta statistics',
                'jobId, startTime, endTime, status, vehicleCount, deltaCount, errors',
                'Index on startTime for recent job lookup',
              ],
              [
                'categories',
                'Vehicle categories reference data (body styles, vehicle types) used for faceted search filtering',
                'name, displayName, type, sortOrder',
                'Unique index on name',
              ],
              [
                'features',
                'Vehicle features reference data linked to categories, used for feature-based filtering in search',
                'name, category, displayName, searchable',
                'Compound index on category+name',
              ],
              [
                'postalCodeOemRegions',
                'ZIP code to OEM region mapping used for regional lease pricing calculations',
                'postalCode, regionId, oemCode, state',
                'Unique index on postalCode, index on regionId',
              ],
              [
                'temp_vehicleV3_*',
                'Temporary staging collections created during EDS import -- dropped after merge into vehicleV3',
                'Same schema as vehicleV3',
                'Minimal indexes (vin only) -- temporary collection dropped after import',
              ],
              [
                'vehicleTest',
                'Test vehicle data used by integration tests and Jupyter relevancy notebooks',
                'Same schema as vehicleV3',
                'Mirrors vehicleV3 indexes for test fidelity',
              ],
              [
                'vehicleSearchRelevancyTest',
                'Test data for search relevancy scoring validation with known expected rankings',
                'query, expectedResults, actualResults, score',
                'Index on query for test lookups',
              ],
            ]}
            highlightColumn={0}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>vehicleV3 Indexes (22+)</h3>
          <p style={para}>
            The vehicleV3 collection has 22+ indexes to support the variety of query patterns across
            all 5 services. These include simple single-field indexes, compound indexes for common
            query combinations, and the Atlas Search index for full-text search.
          </p>
          <DataTable
            headers={['Index Name', 'Fields', 'Type', 'Used By']}
            rows={[
              ['_id_', '_id', 'Default', 'All services'],
              ['vin_1', 'vin', 'Single', 'Consumer, Availability, Cron (delta computation)'],
              ['vehicleId_1', 'vehicleId', 'Single', 'Routes (getById), Search (getVehicleById)'],
              ['dealer.id_1_status_1', 'dealer.id, status', 'Compound', 'Routes (getByDealer), Search (dealer filtering)'],
              ['status_1_vehicleCondition_1', 'status, vehicleCondition', 'Compound', 'Search (active vehicle filtering)'],
              ['status_1_dealer.id_1_vin_1', 'status, dealer.id, vin', 'Compound', 'Cron (dealer inventory lookups)'],
              ['leasing.canLease_1', 'leasing.canLease', 'Single', 'Cron (lease expiry processing)'],
              ['availability.purchasePending_1', 'availability.purchasePending', 'Single', 'Search (availability filtering)'],
              ['manuallySuppressed_1', 'manuallySuppressed', 'Single', 'Routes (suppression management)'],
              ['ymmt.make_1_ymmt.model_1', 'ymmt.make, ymmt.model', 'Compound', 'Search (make/model filtering)'],
              ['price_1', 'price', 'Single', 'Search (price range sorting)'],
              ['mileage_1', 'mileage', 'Single', 'Search (mileage range sorting)'],
              ['ymmt.year_1', 'ymmt.year', 'Single', 'Search (year range filtering)'],
              ['dealer.state_1', 'dealer.state', 'Single', 'Search (state-based filtering)'],
              ['dealer.zip_1', 'dealer.zip', 'Single', 'Search (geo proximity)'],
              ['stockNumber_1', 'stockNumber', 'Single', 'Routes (stock number lookup)'],
              ['bodyStyle_1', 'bodyStyle', 'Single', 'Search (body style faceting)'],
              ['driveType_1', 'driveType', 'Single', 'Search (drive type faceting)'],
              ['updatedAt_1', 'updatedAt', 'Single', 'Cron (recent changes query)'],
              ['createdAt_1', 'createdAt', 'Single', 'Cron (new vehicle tracking)'],
              ['image.heroUrl_1', 'image.heroUrl', 'Single', 'Search (image availability filtering)'],
              ['shopSearch', '50+ field mappings', 'Atlas Search', 'Search service (full-text, facets, autocomplete)'],
              ['shopSuggestions', 'suggestion (autocomplete)', 'Atlas Search', 'Search service (search bar autocomplete)'],
            ]}
            highlightColumn={0}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="info" title="MongoDB Connection Configuration">
            MongoDB connection strings are configured per Spring profile in <code>application-&#123;profile&#125;.yml</code>.
            The <code>laptop</code> profile connects to a local Docker MongoDB instance on port 27020.
            The <code>dev</code>, <code>uat</code>, and <code>prod</code> profiles connect to MongoDB Atlas
            clusters with appropriate read/write concern levels and connection pool settings.
          </Callout>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="warning" title="Cosmos DB Compatibility">
            While the project references Azure Cosmos DB (via <code>azure-resourcemanager-cosmosdb</code>),
            the primary database is MongoDB Atlas. Cosmos DB with the MongoDB API is available as a
            fallback option and is used in some environments for specific collections. The KMongo driver
            abstracts the differences, but Atlas Search features are only available on MongoDB Atlas.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 9: ATLAS SEARCH INDEXES ============ */}
      <section id="atlas-search" style={sectionSpacing}>
        <SectionHeader
          label="Search"
          title="Atlas Search Indexes"
          description="The shopSearch index with 50+ field mappings and the shopSuggestions autocomplete index"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            Atlas Search provides Lucene-based full-text search directly within MongoDB, eliminating the
            need for a separate Elasticsearch cluster. The Odyssey search service uses two Atlas Search
            indexes: <code>shopSearch</code> on the vehicleV3 collection for all search queries, and
            <code> shopSuggestions</code> on the searchSuggestion collection for autocomplete.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="shopSearch Index Structure"
            tabs={[{ label: 'Index Structure', source: mermaidAtlasSearch }]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>shopSearch Field Mappings (50+ fields)</h3>
          <DataTable
            headers={['Field Path', 'Index Type', 'Analyzer', 'Purpose']}
            rows={[
              ['ymmt.make', 'string', 'lucene.standard', 'Make text search and faceting'],
              ['ymmt.model', 'string', 'lucene.standard', 'Model text search and faceting'],
              ['ymmt.trim', 'string', 'lucene.standard', 'Trim text search'],
              ['ymmt.year', 'number', 'N/A', 'Year range filtering (min/max)'],
              ['vin', 'string', 'lucene.keyword', 'Exact VIN lookup'],
              ['vehicleId', 'string', 'lucene.keyword', 'Exact vehicle ID lookup'],
              ['stockNumber', 'string', 'lucene.keyword', 'Exact stock number lookup'],
              ['status', 'string', 'lucene.keyword', 'Status filtering (ACTIVE, DELETED, etc.)'],
              ['vehicleCondition', 'string', 'lucene.keyword', 'Condition faceting (NEW, USED, CPO)'],
              ['bodyStyle', 'string', 'lucene.standard', 'Body style text search and faceting'],
              ['driveType', 'string', 'lucene.standard', 'Drive type text search and faceting'],
              ['fuelType', 'string', 'lucene.standard', 'Fuel type filtering'],
              ['exteriorColor', 'string', 'lucene.standard', 'Color faceting'],
              ['interiorColor', 'string', 'lucene.standard', 'Color faceting'],
              ['transmission', 'string', 'lucene.standard', 'Transmission type filtering'],
              ['engineDescription', 'string', 'lucene.standard', 'Engine text search'],
              ['price', 'number', 'N/A', 'Price range filtering and sorting'],
              ['priceInCents', 'number', 'N/A', 'Precise price calculations'],
              ['msrp', 'number', 'N/A', 'MSRP range filtering'],
              ['mileage', 'number', 'N/A', 'Mileage range filtering and sorting'],
              ['dealer.id', 'string', 'lucene.keyword', 'Dealer filtering'],
              ['dealer.name', 'string', 'lucene.standard', 'Dealer name search'],
              ['dealer.state', 'string', 'lucene.keyword', 'State-based filtering'],
              ['dealer.zip', 'string', 'lucene.keyword', 'ZIP code proximity filtering'],
              ['dealer.region', 'number', 'N/A', 'Region-based filtering'],
              ['dealer.city', 'string', 'lucene.standard', 'City text search'],
              ['leasing.canLease', 'boolean', 'N/A', 'Lease availability filtering'],
              ['leasing.defaultPrice', 'number', 'N/A', 'Lease price sorting'],
              ['leasing.regionalPrices.regionId', 'number', 'N/A', 'Region-specific lease filtering'],
              ['leasing.regionalPrices.amountInCents', 'number', 'N/A', 'Regional lease price sorting'],
              ['availability.purchasePending', 'boolean', 'N/A', 'Cart availability filtering'],
              ['availability.salesPending', 'boolean', 'N/A', 'Sales status filtering'],
              ['availability.salesBooked', 'boolean', 'N/A', 'Booked status filtering'],
              ['availability.inventoryInTransit', 'boolean', 'N/A', 'In-transit filtering'],
              ['image.heroUrl', 'string', 'lucene.keyword', 'Image availability filtering'],
              ['image.spinUrl', 'string', 'lucene.keyword', 'Spin image availability'],
              ['image.count', 'number', 'N/A', 'Image count filtering/sorting'],
              ['manuallySuppressed', 'boolean', 'N/A', 'Suppression filtering'],
              ['hints.greatDeal', 'boolean', 'N/A', 'Deal badge filtering'],
              ['hints.priceReduced', 'boolean', 'N/A', 'Price drop filtering'],
              ['makeModel', 'autocomplete', 'lucene.standard', 'Search bar autocomplete'],
              ['features', 'string', 'lucene.standard', 'Feature text search'],
              ['cylinders', 'number', 'N/A', 'Engine cylinder filtering'],
              ['doors', 'number', 'N/A', 'Door count filtering'],
              ['mpgCity', 'number', 'N/A', 'MPG city filtering'],
              ['mpgHighway', 'number', 'N/A', 'MPG highway filtering'],
              ['daysOnLot', 'number', 'N/A', 'Days on lot sorting'],
              ['certified', 'boolean', 'N/A', 'CPO certification filtering'],
              ['cabType', 'string', 'lucene.standard', 'Truck cab type filtering'],
              ['bedLength', 'string', 'lucene.standard', 'Truck bed length filtering'],
            ]}
            highlightColumn={0}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>shopSuggestions Index</h3>
          <p style={para}>
            The <code>shopSuggestions</code> index on the <code>searchSuggestion</code> collection provides
            autocomplete functionality for the search bar. It uses the <code>autocomplete</code> field type
            with edge n-gram tokenization to match partial queries as users type.
          </p>
          <DataTable
            headers={['Field', 'Type', 'Tokenization', 'Min/Max Grams', 'Purpose']}
            rows={[
              ['suggestion', 'autocomplete', 'edgeGram', '2 / 15', 'Primary autocomplete field -- matches partial make/model input'],
              ['make', 'string', 'lucene.keyword', 'N/A', 'Exact make filtering in suggestions'],
              ['model', 'string', 'lucene.keyword', 'N/A', 'Exact model filtering in suggestions'],
              ['count', 'number', 'N/A', 'N/A', 'Popularity ranking for suggestion ordering'],
            ]}
            highlightColumn={0}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="info" title="Atlas Search vs Regular Indexes">
            Atlas Search indexes and regular MongoDB indexes serve different purposes. Regular indexes
            (B-tree) are used for exact match queries, range filters, and sorting in standard find/aggregate
            operations. Atlas Search indexes (Lucene-based) are used exclusively within <code>$search</code>
            aggregation stages for full-text search, fuzzy matching, autocomplete, and faceted search.
            Both types of indexes exist on vehicleV3 and are used by different query paths.
          </Callout>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CodeBlock
            language="kotlin"
            filename="Atlas Search aggregation pipeline example"
            code={`// Building a search pipeline in the search module
val pipeline = listOf(
    // Stage 1: Atlas Search with compound query
    Document("\$search", Document().apply {
        append("index", "shopSearch")
        append("compound", Document().apply {
            append("must", listOf(
                Document("text", Document()
                    .append("query", "Toyota Camry")
                    .append("path", listOf("ymmt.make", "ymmt.model", "ymmt.trim"))
                )
            ))
            append("filter", listOf(
                Document("equals", Document()
                    .append("path", "status")
                    .append("value", "ACTIVE")
                ),
                Document("range", Document()
                    .append("path", "price")
                    .append("gte", 20000)
                    .append("lte", 40000)
                )
            ))
        })
        append("count", Document("type", "total"))
    }),
    // Stage 2: Project with search score
    Document("\$project", Document()
        .append("score", Document("\$meta", "searchScore"))
        .append("vin", 1).append("ymmt", 1).append("price", 1)
    ),
    // Stage 3: Pagination
    Document("\$skip", 0),
    Document("\$limit", 24)
)`}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 10: SPRING PROFILES ============ */}
      <section id="spring-profiles" style={sectionSpacing}>
        <SectionHeader
          label="Configuration"
          title="Spring Profiles"
          description="Environment-specific configuration for laptop, dev, uat, and prod"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            Spring profiles control environment-specific configuration across all 5 services. Each service
            has an <code>application.yml</code> with shared defaults and profile-specific overrides in
            <code> application-laptop.yml</code>, <code>application-dev.yml</code>, <code>application-uat.yml</code>,
            and <code>application-prod.yml</code> files.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Spring Profiles"
            tabs={[{ label: 'Profiles', source: mermaidSpringProfiles }]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Profile Comparison</h3>
          <DataTable
            headers={['Setting', 'laptop', 'dev', 'uat', 'prod']}
            rows={[
              ['MongoDB', 'Docker localhost:27020', 'Atlas DEV cluster', 'Atlas UAT cluster', 'Atlas PROD cluster'],
              ['MongoDB Database', 'shopInventory', 'shopInventory', 'shopInventory', 'shopInventory'],
              ['Azure Blob Storage', 'Azurite (local emulator)', 'Azure DEV account', 'Azure UAT account', 'Azure PROD account'],
              ['Azure Service Bus', 'Disabled / mock', 'DEV namespace', 'UAT namespace', 'PROD namespace'],
              ['EDS Cron Schedule', 'Disabled', 'Every 30 min', 'Every 30 min', 'Every 30 min'],
              ['Lease Expiry Cron', 'Disabled', 'Hourly', 'Hourly', 'Hourly'],
              ['Impel/SpinCar Host', 'N/A', 'drivewaydev', 'drivewayuat', 'driveway'],
              ['DataDog Metrics', 'Disabled', 'Enabled', 'Enabled', 'Enabled (full)'],
              ['BlockHound', 'Disabled', 'Disabled', 'Disabled', 'Disabled'],
              ['Log Level', 'DEBUG', 'INFO', 'INFO', 'WARN'],
              ['Server Port', '8080', '8080', '8080', '8080'],
              ['Max Connections (MongoDB)', '10', '50', '50', '100'],
            ]}
            highlightColumn={0}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Key Configuration Values</h3>
          <CodeBlock
            language="yaml"
            filename="application-laptop.yml (example)"
            showLineNumbers
            code={`spring:
  data:
    mongodb:
      uri: mongodb://localhost:27020/shopInventory
      database: shopInventory

  profiles:
    active: laptop

server:
  port: 8080

odyssey:
  eds:
    enabled: false
    blob-container: eds-vehicle-data
    blob-connection-string: UseDevelopmentStorage=true
  leasing:
    expiry-cron-enabled: false
  service-bus:
    enabled: false
  impel:
    host: ""
  search:
    index-name: shopSearch
    suggestion-index: shopSuggestions
  blockhound:
    enabled: false

management:
  metrics:
    export:
      datadog:
        enabled: false
  endpoints:
    web:
      exposure:
        include: health,info,metrics`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CodeBlock
            language="yaml"
            filename="application-prod.yml (example)"
            showLineNumbers
            code={`spring:
  data:
    mongodb:
      uri: \${MONGODB_URI}
      database: shopInventory

odyssey:
  eds:
    enabled: true
    cron: "0 */30 * * * *"
    blob-container: eds-vehicle-data
    safety-check-threshold: 15000
  leasing:
    expiry-cron-enabled: true
    expiry-cron: "0 0 * * * *"
  service-bus:
    enabled: true
    connection-string: \${SERVICE_BUS_CONNECTION_STRING}
    lease-topic: leasing-incentives-topic
    cart-topic: cart-status-update-topic
    delta-topic: inventory-delta-topic
  impel:
    host: driveway
  blockhound:
    enabled: false

management:
  metrics:
    export:
      datadog:
        enabled: true
        api-key: \${DATADOG_API_KEY}
        step: 30s`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="warning" title="Local Development Setup">
            For the <code>laptop</code> profile, you need Docker running with a MongoDB instance on port
            27020 and Azurite (Azure Storage emulator) for blob operations. Run
            <code> docker-compose up -d</code> from the project root to start the local infrastructure.
            The EDS cron and Service Bus listeners are disabled locally to avoid unintended data operations.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 11: CODE QUALITY ============ */}
      <section id="code-quality" style={sectionSpacing}>
        <SectionHeader
          label="Quality"
          title="Code Quality"
          description="Kotlinter linting, Detekt analysis, Kover coverage, EditorConfig, and BlockHound"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            Code quality is enforced through multiple automated tools integrated into the Gradle build
            pipeline. These tools run in CI and can be executed locally before committing changes.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>Kotlinter (ktlint)</div>
              <div style={infoCardText}>
                Enforces the official Kotlin coding style guide. Auto-formats code with
                <code> ./gradlew formatKotlin</code> and checks formatting with
                <code> ./gradlew lintKotlin</code>. Runs automatically in CI as part of the build.
                Follows the standard ktlint ruleset with no custom overrides.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent3 }}>Detekt Static Analysis</div>
              <div style={infoCardText}>
                Static code analysis for Kotlin. Detects code smells, complexity issues, and
                potential bugs. Configured with two disabled rules: <code>SpreadOperator</code> (allowed
                for varargs) and <code>WildcardImport</code> (allowed for cleaner imports).
                All other rules follow Detekt defaults.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>Kover Coverage</div>
              <div style={infoCardText}>
                Kotlin-native code coverage tool producing JaCoCo-compatible reports. Configured with
                exclusions for generated code (models, GraphQL types, config classes, Application main
                classes). Reports are generated with <code>./gradlew koverHtmlReport</code> and uploaded
                to CI for coverage gate enforcement.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.orange }}>BlockHound</div>
              <div style={infoCardText}>
                Detects blocking calls (Thread.sleep, synchronized, blocking I/O) on reactive scheduler
                threads at runtime. Installed as a Java agent in the library module. Disabled in production
                and laptop profiles but can be enabled for targeted debugging. Critical for ensuring
                the WebFlux non-blocking contract is maintained.
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Detekt Configuration</h3>
          <CodeBlock
            language="yaml"
            filename="detekt.yml"
            showLineNumbers
            code={`# Detekt configuration for Odyssey-Api
style:
  SpreadOperator:
    active: false          # Allow spread operator (*array) for varargs
  WildcardImport:
    active: false          # Allow wildcard imports for cleaner code

complexity:
  LongMethod:
    threshold: 60          # Methods up to 60 lines allowed
  LongParameterList:
    functionThreshold: 8   # Functions with up to 8 params allowed
    constructorThreshold: 12

# All other rules: Detekt defaults`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Kover Coverage Exclusions</h3>
          <CodeBlock
            language="kotlin"
            filename="build.gradle.kts (Kover config)"
            code={`kover {
    reports {
        filters {
            excludes {
                classes(
                    "com.lithia.odyssey.models.*",           // Data models (no logic)
                    "com.lithia.odyssey.generated.*",         // Generated GraphQL client code
                    "com.lithia.odyssey.config.*",            // Spring configuration classes
                    "com.lithia.odyssey.*ApplicationKt",      // Main application entry points
                    "com.lithia.odyssey.graphql.types.*",     // GraphQL type definitions
                    "com.lithia.odyssey.graphql.inputs.*"     // GraphQL input types
                )
            }
        }
    }
}`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>EditorConfig</h3>
          <CodeBlock
            language="ini"
            filename=".editorconfig"
            showLineNumbers
            code={`root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 4
insert_final_newline = true
trim_trailing_whitespace = true
max_line_length = 120

[*.{kt,kts}]
ktlint_code_style = official
ij_kotlin_allow_trailing_comma = false
ij_kotlin_allow_trailing_comma_on_call_site = false

[*.{yml,yaml}]
indent_size = 2

[*.md]
trim_trailing_whitespace = false`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Quality Tool Summary</h3>
          <DataTable
            headers={['Tool', 'Command', 'CI Stage', 'Fails Build?', 'Auto-Fix?']}
            rows={[
              ['Kotlinter (lint)', './gradlew lintKotlin', 'Build', 'Yes', 'No (check only)'],
              ['Kotlinter (format)', './gradlew formatKotlin', 'Local only', 'N/A', 'Yes (auto-format)'],
              ['Detekt', './gradlew detekt', 'Build', 'Yes (on errors)', 'No'],
              ['Kover', './gradlew koverHtmlReport', 'Build', 'Yes (below threshold)', 'No'],
              ['BlockHound', 'Runtime agent', 'Test', 'Yes (throws exception)', 'No'],
              ['JUnit 5', './gradlew test', 'Test', 'Yes', 'No'],
              ['EditorConfig', 'IDE integration', 'N/A (enforced by ktlint)', 'Indirectly', 'IDE auto-format'],
            ]}
            highlightColumn={0}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="danger" title="BlockHound in Tests">
            BlockHound is installed as a JVM agent and will throw <code>BlockingOperationError</code> if
            any blocking call is detected on a Reactor scheduler thread. This can cause test failures
            that are hard to debug if you are new to reactive programming. Common culprits include
            <code> .block()</code> calls, <code>Thread.sleep()</code>, and synchronous I/O operations.
            Use <code>Schedulers.boundedElastic()</code> to offload necessary blocking operations.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 12: TESTING STRATEGY ============ */}
      <section id="testing" style={sectionSpacing}>
        <SectionHeader
          label="Testing"
          title="Testing Strategy"
          description="Multi-layered testing approach with unit, integration, functional, performance, and relevancy tests"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The Odyssey-Api project employs a comprehensive multi-layered testing strategy. Unit tests
            form the foundation with 90+ Kotlin test files using JUnit 5, MockK for mocking, and Kotest
            for expressive assertions. Integration tests validate service interactions post-deployment.
            Functional tests use Postman/Newman collections in CI pipelines, while performance testing
            leverages K6 containers in AKS.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Testing Strategy"
            tabs={[{ label: 'Test Types', source: mermaidTestingStrategy }]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Test Frameworks</h3>
          <DataTable
            headers={['Framework', 'Version', 'Purpose', 'Key APIs']}
            rows={[
              ['JUnit 5 (Jupiter)', '5.10.x', 'Test lifecycle, annotations, assertions', '@Test, @BeforeEach, @Nested, assertThrows, assertEquals'],
              ['MockK', '1.13.4', 'Kotlin-native mocking for classes and coroutines', 'mockk(), every {}, coEvery {}, verify {}, slot(), answers {}'],
              ['Kotest Assertions', '5.4.2', 'Expressive assertion DSL for Kotlin', 'shouldBe, shouldContain, shouldThrow, shouldBeNull, shouldHaveSize'],
              ['Reactor Test', '3.5.9', 'Step-by-step verification of Mono/Flux pipelines', 'StepVerifier.create(), expectNext(), expectComplete(), verifyComplete()'],
              ['Spring Boot Test', '3.4.3', 'Spring context loading and WebFlux test utilities', '@SpringBootTest, @WebFluxTest, WebTestClient, @MockBean'],
              ['OkHttp3 MockWebServer', '4.11.x', 'Mock HTTP server for external API client testing', 'MockWebServer(), enqueue(), takeRequest()'],
            ]}
            highlightColumn={0}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Test File Distribution</h3>
          <DataTable
            headers={['Module', 'Test Files', 'Key Test Areas', 'Runner']}
            rows={[
              ['library', '~40 files', 'DAO tests, client tests, model serialization, utility functions, EDS parser', './gradlew :library:test'],
              ['routes', '~15 files', 'REST endpoint tests, GraphQL mutation tests, controller tests', './gradlew :routes:test'],
              ['search', '~15 files', 'Search query tests, pipeline builder tests, facet tests, suggestion tests', './gradlew :search:test'],
              ['cron', '~8 files', 'Scheduled task tests, EDS import tests, delta computation tests', './gradlew :cron:test'],
              ['consumer', '~5 files', 'Lease message handler tests, Service Bus processing tests', './gradlew :consumer:test'],
              ['availability', '~4 files', 'Cart status handler tests, availability update tests', './gradlew :availability:test'],
              ['graphql-shared', '~3 files', 'Shared type tests, custom scalar tests, error handling tests', './gradlew :graphql-shared:test'],
              ['tests', '~10 files', 'Integration tests: full API contract validation against live services', './gradlew :tests:test (post-deploy)'],
            ]}
            highlightColumn={0}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Key Testing Patterns</h3>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>StepVerifier (Reactive)</div>
              <div style={infoCardText}>
                Used to test Mono and Flux reactive pipelines step-by-step. Verifies emitted elements,
                completion signals, and error signals without subscribing manually. Essential for testing
                DAO methods that return reactive types.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>runBlocking (Coroutines)</div>
              <div style={infoCardText}>
                Bridges coroutine code in tests by running suspend functions in a blocking context.
                Used when test functions need to call suspend functions that interact with reactive
                streams via the coroutine-reactor bridge.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent3 }}>coEvery / every (MockK)</div>
              <div style={infoCardText}>
                <code>every &#123;&#125;</code> mocks regular function calls while
                <code> coEvery &#123;&#125;</code> mocks suspend function calls. Combined with
                <code> returns</code>, <code>answers</code>, and <code>throws</code> for complete
                behavior specification.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.orange }}>@WebFluxTest</div>
              <div style={infoCardText}>
                Spring test slice that loads only the WebFlux layer (controllers, filters, handlers)
                without the full application context. Provides <code>WebTestClient</code> for making
                HTTP requests and asserting responses with a fluent API.
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Example Test Patterns</h3>
          <CodeBlock
            language="kotlin"
            filename="StepVerifier example"
            showLineNumbers
            code={`@Test
fun \`should find vehicle by VIN\`() {
    // Given
    val expectedVehicle = Vehicle(vin = "1HGBH41JXMN109186", /* ... */)
    every { vehicleDao.getByVin("1HGBH41JXMN109186") } returns Mono.just(expectedVehicle)

    // When & Then
    StepVerifier.create(vehicleService.findByVin("1HGBH41JXMN109186"))
        .expectNext(expectedVehicle)
        .verifyComplete()

    verify(exactly = 1) { vehicleDao.getByVin("1HGBH41JXMN109186") }
}`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CodeBlock
            language="kotlin"
            filename="MockK coEvery example"
            showLineNumbers
            code={`@Test
fun \`should process lease message and update vehicle\`() = runBlocking {
    // Given
    val message = LeaseIncentivesMessage(
        vin = "1HGBH41JXMN109186",
        type = MessageType.LEASING,
        regions = listOf(RegionData(regionId = 1, amountInCents = 29900, expiresOn = "2025-12-31"))
    )
    val existingVehicle = Vehicle(vin = "1HGBH41JXMN109186", /* ... */)

    coEvery { vehicleDao.getByVin("1HGBH41JXMN109186") } returns Mono.just(existingVehicle)
    coEvery { vehicleDao.updateVehicleField(any(), any(), any()) } returns Mono.empty()

    // When
    leaseHandler.handle(message)

    // Then
    coVerify(exactly = 1) {
        vehicleDao.updateVehicleField(
            "1HGBH41JXMN109186",
            "leasing",
            match { it is Leasing && it.canLease && it.regionalPrices.size == 1 }
        )
    }
}`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CodeBlock
            language="kotlin"
            filename="WebFluxTest example"
            showLineNumbers
            code={`@WebFluxTest(VehicleController::class)
class VehicleControllerTest {

    @Autowired
    private lateinit var webTestClient: WebTestClient

    @MockBean
    private lateinit var vehicleService: VehicleService

    @Test
    fun \`GET shop vehicles by vin returns 200\`() {
        val vehicle = Vehicle(vin = "ABC123", /* ... */)
        every { vehicleService.findByVin("ABC123") } returns Mono.just(vehicle)

        webTestClient.get()
            .uri("/shop/vehicles/vin/ABC123")
            .exchange()
            .expectStatus().isOk
            .expectBody()
            .jsonPath("$.vin").isEqualTo("ABC123")

        verify { vehicleService.findByVin("ABC123") }
    }
}`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Test Execution Summary</h3>
          <DataTable
            headers={['Test Type', 'When', 'Command', 'Duration', 'Failure Action']}
            rows={[
              ['Unit Tests', 'Every PR, every build', './gradlew test', '~2-4 minutes', 'Block merge, fix required'],
              ['Integration Tests', 'Post-deploy to DEV/UAT', './gradlew :tests:test', '~5-10 minutes', 'Alert team, potential rollback'],
              ['Postman/Newman', 'Post-deploy (CI stage)', 'newman run collection.json', '~2-3 minutes', 'Alert team, review failures'],
              ['K6 Performance', 'Weekly or on-demand', 'k6 run loadtest.js', '~15-30 minutes', 'Performance review, capacity planning'],
              ['Jupyter Relevancy', 'On-demand', 'docker run jupyter', 'Variable', 'Manual search tuning review'],
            ]}
            highlightColumn={0}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <div style={cardGrid3}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>CI Gate</div>
              <div style={infoCardText}>
                All unit tests must pass and code coverage must meet the configured threshold before
                a PR can be merged. Kotlinter and Detekt checks are also enforced.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>Test Isolation</div>
              <div style={infoCardText}>
                Unit tests use MockK to mock all external dependencies (MongoDB, Service Bus, HTTP clients).
                No real infrastructure is needed for unit test execution.
              </div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent3 }}>Reactive Testing</div>
              <div style={infoCardText}>
                All reactive pipelines are tested with StepVerifier to validate the full reactive chain
                including error handling, retry logic, and backpressure behavior.
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ FOOTER SPACER ============ */}
      <div style={{ height: '6rem' }} />
    </>
  );
}
