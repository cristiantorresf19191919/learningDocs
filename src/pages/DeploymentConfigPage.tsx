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
  purple: '#8b5cf6',
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
  { id: 'kubernetes', label: 'Kubernetes Deployment' },
  { id: 'container-build', label: 'Container Build' },
  { id: 'helm-config', label: 'Helm Configuration' },
  { id: 'env-config', label: 'Environment Config Loading' },
  { id: 'spring-profiles', label: 'Spring Profiles Comparison' },
  { id: 'terraform-indexes', label: 'Terraform: Search Indexes' },
  { id: 'terraform-servicebus', label: 'Terraform: Service Bus' },
  { id: 'gradle-modules', label: 'Gradle Modules' },
  { id: 'pipelines', label: 'Pipeline Configuration' },
  { id: 'env-comparison', label: 'Environment Comparison' },
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
/*  Mermaid diagrams                                                   */
/* ------------------------------------------------------------------ */
const mermaidK8sArchitecture = `%%{init: {'theme': 'dark'}}%%
graph TB
    subgraph AKS["AKS Cluster (Azure Kubernetes Service)"]
        A["odyssey-cron<br/>Helm: cron<br/>1 replica | 4Gi prod"]
        B["odyssey-search-graphql<br/>Helm: api<br/>GraphQL Search"]
        C["odyssey-consumer<br/>Helm: headless<br/>Service Bus Consumer"]
        D["odyssey-api<br/>Helm: api<br/>REST endpoints"]
        E["odyssey-availability-sub<br/>Helm: headless<br/>Availability updates"]
    end
    F[("MongoDB Atlas")] --> A
    F --> B
    F --> C
    F --> D
    F --> E
    G["Azure Service Bus"] --> C
    G --> E
    H["Azure Blob Storage"] --> A
    I["Helm Charts"] --> AKS
    J["Terraform"] --> F
    J --> G
    style A fill:#238636,stroke:#3fb950,color:#fff
    style B fill:#1f6feb,stroke:#58a6ff,color:#fff
    style C fill:#6e40c9,stroke:#bc8cff,color:#fff
    style D fill:#1f6feb,stroke:#58a6ff,color:#fff
    style E fill:#6e40c9,stroke:#bc8cff,color:#fff
    style F fill:#d29922,stroke:#e3b341,color:#000
    style G fill:#d29922,stroke:#e3b341,color:#000
    style H fill:#d29922,stroke:#e3b341,color:#000
    style I fill:#da3633,stroke:#f85149,color:#fff
    style J fill:#da3633,stroke:#f85149,color:#fff`;

const mermaidDockerBuild = `%%{init: {'theme': 'dark'}}%%
graph LR
    A[gradle:jdk21] --> B[Copy All Modules]
    B --> C[./gradlew bootjar --parallel]
    C --> D[Download DD Agent]
    D --> E[eclipse-temurin:21-jre]
    E --> F[Copy JAR + Agent]
    F --> G[Expose 8080]
    G --> H{APM=true?}
    H -->|Yes| I[javaagent:dd-java-agent.jar<br/>-XX:MaxRAMPercentage=75.0]
    H -->|No| J[Plain Java -jar<br/>-XX:MaxRAMPercentage=75.0]
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style E fill:#238636,stroke:#3fb950,color:#fff
    style I fill:#d29922,stroke:#e3b341,color:#000
    style J fill:#6e40c9,stroke:#bc8cff,color:#fff`;

const mermaidHelmFlow = `%%{init: {'theme': 'dark'}}%%
graph TD
    A["Base values.yaml<br/>cpu: 1, memory: 4Gi"] --> D["Helm upgrade --install"]
    B["values-dev.yaml<br/>cpu: 50m, memory: 2Gi"] --> D
    C["values-prod.yaml<br/>replicas: 1, DD profiling"] --> D
    E["Azure Key Vault Secrets<br/>--set from pipeline"] --> D
    D --> F["AKS Pod Deployment"]
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style B fill:#238636,stroke:#3fb950,color:#fff
    style C fill:#da3633,stroke:#f85149,color:#fff
    style E fill:#6e40c9,stroke:#bc8cff,color:#fff
    style F fill:#d29922,stroke:#e3b341,color:#000`;

const mermaidSpringProfiles = `%%{init: {'theme': 'dark'}}%%
graph TD
    A["application.yml<br/>(shared config)"] --> B["SPRING_PROFILES_ACTIVE"]
    B --> C["application-laptop.yml"]
    B --> D["application-dev.yml"]
    B --> E["application-uat.yml"]
    B --> F["application-prod.yml"]
    C --> G["localhost:27020<br/>Azurite blob<br/>Cron disabled"]
    D --> H["Atlas cluster<br/>Azure Blob<br/>Cron enabled"]
    E --> I["Atlas cluster<br/>Introspection off<br/>Error redaction on"]
    F --> J["Atlas cluster<br/>DD profiling<br/>MaxDigital prod"]
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style C fill:#238636,stroke:#3fb950,color:#fff
    style D fill:#d29922,stroke:#e3b341,color:#000
    style E fill:#6e40c9,stroke:#bc8cff,color:#fff
    style F fill:#da3633,stroke:#f85149,color:#fff`;

const mermaidTerraformIndexes = `%%{init: {'theme': 'dark'}}%%
graph TB
    subgraph Terraform["terraform/infrastructure/{env}/mongo-indexes.tf"]
        A["shopSuggestions<br/>Collection: searchSuggestion<br/>autocomplete on value"]
        B["shopSearch<br/>Collection: vehicleV3<br/>50+ fields mapped"]
        C["shopSearch<br/>Collection: vehicleTest<br/>same mapping (testing)"]
    end
    D[("MongoDB Atlas")] --> A
    D --> B
    D --> C
    style A fill:#d29922,stroke:#e3b341,color:#000
    style B fill:#1f6feb,stroke:#58a6ff,color:#fff
    style C fill:#6e40c9,stroke:#bc8cff,color:#fff
    style D fill:#238636,stroke:#3fb950,color:#fff`;

const mermaidTerraformServiceBus = `%%{init: {'theme': 'dark'}}%%
graph TB
    subgraph Topics["Service Bus Topics"]
        A["inventory-delta-topic<br/>Publisher | TTL: 14 days"]
        B["leasing-incentives-topic<br/>TTL: 2 days"]
        C["search-vehicle-data-topic"]
        D["cart-status-update-topic"]
    end
    subgraph Subs["Subscriptions"]
        E["lease-consumer-sub<br/>Lock: 5 min"]
        F["vehicle-topic-search-subscriber-sub"]
        G["vehicle-availability-subscriber-sub<br/>Lock: 1 min | Max delivery: 70"]
    end
    B --> E
    C --> F
    D --> G
    style A fill:#238636,stroke:#3fb950,color:#fff
    style B fill:#1f6feb,stroke:#58a6ff,color:#fff
    style C fill:#1f6feb,stroke:#58a6ff,color:#fff
    style D fill:#1f6feb,stroke:#58a6ff,color:#fff
    style E fill:#d29922,stroke:#e3b341,color:#000
    style F fill:#d29922,stroke:#e3b341,color:#000
    style G fill:#d29922,stroke:#e3b341,color:#000`;

const mermaidGradleModules = `%%{init: {'theme': 'dark'}}%%
graph TB
    subgraph settings["settings.gradle.kts (9 modules)"]
        A["cron"]
        B["search"]
        C["consumer"]
        D["library"]
        E["graphql-shared"]
        F["routes"]
        G["availability"]
        H["utilities"]
        I["tests"]
    end
    A --> D
    B --> D
    B --> E
    C --> D
    F --> D
    G --> D
    style A fill:#238636,stroke:#3fb950,color:#fff
    style B fill:#1f6feb,stroke:#58a6ff,color:#fff
    style C fill:#6e40c9,stroke:#bc8cff,color:#fff
    style D fill:#d29922,stroke:#e3b341,color:#000
    style E fill:#d29922,stroke:#e3b341,color:#000`;

const mermaidPipelineFlow = `%%{init: {'theme': 'dark'}}%%
graph TD
    A["dev.yml<br/>Auto on main"] --> B["Build"]
    B --> C["Test + Coverage"]
    C --> D["Docker Build & Push"]
    D --> E["Terraform Apply"]
    E --> F["Helm Deploy (all 5)"]
    F --> G["Smoke Tests"]
    H["odyssey-cron-dev.yml<br/>Manual trigger"] --> I["Build cron only"]
    I --> J["Deploy cron only"]
    K["odyssey-cron-prod-mesh.yaml<br/>Tag v* trigger"] --> L["Build cron"]
    L --> M["Deploy cron to PROD"]
    N["prod.yaml<br/>Manual + CR"] --> O["Build all"]
    O --> P["Deploy all to PROD"]
    style A fill:#238636,stroke:#3fb950,color:#fff
    style H fill:#d29922,stroke:#e3b341,color:#000
    style K fill:#6e40c9,stroke:#bc8cff,color:#fff
    style N fill:#da3633,stroke:#f85149,color:#fff`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function DeploymentConfigPage() {
  const { setSidebar, clearSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('Deployment & Configuration', tocItems);
    return () => clearSidebar();
  }, [setSidebar, clearSidebar]);

  return (
    <>
      {/* ============ HERO ============ */}
      <section style={heroSection}>
        <div style={heroGradientBg} />
        <motion.div style={heroContent} {...fadeUp}>
          <h1 style={heroTitle}>Deployment & Configuration</h1>
          <p style={heroSubtitle}>
            Complete deployment, infrastructure, and configuration reference for the cron, search, and
            sync flows. Covers Kubernetes, Helm, Terraform, Spring profiles, Gradle modules, and CI/CD
            pipelines across all environments.
          </p>
          <div style={statsRow}>
            {[
              { val: '5', label: 'Microservices' },
              { val: '4', label: 'Environments' },
              { val: '9', label: 'Gradle Modules' },
              { val: '4', label: 'Pipelines' },
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
          description="How the cron, search, and sync services are deployed, configured, and managed in production"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The Odyssey platform deploys <strong>5 microservices</strong> on Azure Kubernetes Service (AKS)
            via Helm charts. The cron service runs as a Kubernetes <code style={{ color: c.accent }}>CronJob</code> type,
            while search and consumer services run as standard API or headless deployments. All infrastructure
            (MongoDB Atlas search indexes, Azure Service Bus topics and subscriptions) is managed declaratively
            through Terraform, ensuring consistency across all environments.
          </p>
          <p style={para}>
            The deployment pipeline follows a progressive promotion model: code merges to{' '}
            <code style={{ color: c.accent }}>main</code> trigger automatic DEV deployment, then get
            manually promoted to UAT and finally to PROD with a formal Change Request. Each environment has
            its own AKS cluster, container registry, Key Vault, and Terraform state.
          </p>
          <div style={cardGrid}>
            <Card variant="blue" title="AKS on Azure">
              <p style={infoCardText}>
                All 5 microservices are deployed to Azure Kubernetes Service clusters. Each environment
                (dev, uat, prod) has a dedicated AKS cluster with its own container registry and
                network policies. Services use Spring Boot with JDK 21.
              </p>
            </Card>
            <Card variant="green" title="Helm Charts">
              <p style={infoCardText}>
                Deployment is orchestrated through Helm charts with three chart types:{' '}
                <strong>api</strong> (HTTP services), <strong>headless</strong> (message consumers), and{' '}
                <strong>cron</strong> (scheduled jobs). Environment-specific values files override
                base configuration.
              </p>
            </Card>
            <Card variant="purple" title="Terraform IaC">
              <p style={infoCardText}>
                All cloud infrastructure is defined as code in Terraform. MongoDB Atlas search indexes,
                Azure Service Bus topics/subscriptions, and monitoring alerts are provisioned and
                updated as part of the CI/CD pipeline.
              </p>
            </Card>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Deployment Architecture Overview"
            tabs={[
              { label: 'Architecture', source: mermaidK8sArchitecture },
            ]}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 2: KUBERNETES DEPLOYMENT ============ */}
      <section id="kubernetes" style={sectionSpacing}>
        <SectionHeader
          label="Kubernetes"
          title="Kubernetes Deployment"
          description="Service topology on AKS including chart types, replica counts, and resource allocation"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            Each microservice is deployed as a separate Kubernetes workload with its own Helm release.
            The cron service uses the <code style={{ color: c.accent }}>cron</code> chart type (Kubernetes CronJob),
            always running as a single replica with elevated memory to handle large EDS imports. Search and API
            services use the <code style={{ color: c.accent }}>api</code> chart with ingress and auto-scaling.
            Consumer services use the <code style={{ color: c.accent }}>headless</code> chart without ingress.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <DataTable
            headers={['Service', 'Helm Chart Type', 'Replicas', 'Memory (prod)', 'Memory (dev)', 'Runtime']}
            rows={[
              [
                <strong style={{ color: c.green }}>odyssey-cron</strong>,
                <><Badge label="cron" color="pink" dot /> CronJob</>,
                '1',
                <strong style={{ color: c.red }}>4Gi</strong>,
                '2Gi',
                'Spring Boot + JDK 21',
              ],
              [
                <strong style={{ color: c.accent }}>odyssey-search-graphql</strong>,
                <><Badge label="api" color="blue" dot /> API service</>,
                '3 (prod)',
                '4Gi',
                '2Gi',
                'Spring Boot + JDK 21',
              ],
              [
                <strong style={{ color: c.purple }}>odyssey-consumer</strong>,
                <><Badge label="headless" color="yellow" dot /> SB consumer</>,
                '3 (prod)',
                '4Gi',
                '2Gi',
                'Spring Boot + JDK 21',
              ],
              [
                <strong style={{ color: c.accent }}>odyssey-api</strong>,
                <><Badge label="api" color="blue" dot /> REST API</>,
                '3 (prod)',
                '4Gi',
                '2Gi',
                'Spring Boot + JDK 21',
              ],
              [
                <strong style={{ color: c.purple }}>odyssey-availability-sub</strong>,
                <><Badge label="headless" color="yellow" dot /> SB consumer</>,
                '3 (prod)',
                '4Gi',
                '2Gi',
                'Spring Boot + JDK 21',
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="info" title="Cron is a Single Replica">
            The <code>odyssey-cron</code> service always runs as a single replica to prevent duplicate
            scheduled job executions. It requires 4Gi memory in production to handle large EDS TSV file
            imports that can contain hundreds of thousands of vehicle records.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 3: CONTAINER BUILD ============ */}
      <section id="container-build" style={sectionSpacing}>
        <SectionHeader
          label="Docker"
          title="Container Build"
          description="Multi-stage Docker build with DataDog APM integration and JDK 21 runtime"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The Dockerfile uses a two-stage build strategy. The first stage uses{' '}
            <code style={{ color: c.accent }}>gradle:jdk21</code> to compile all 9 Gradle modules with{' '}
            <code style={{ color: c.accent }}>./gradlew bootjar --parallel</code>. The second stage
            switches to the lightweight <code style={{ color: c.accent }}>eclipse-temurin:21-jre</code> runtime,
            copying only the compiled JAR and the DataDog Java agent. The{' '}
            <code style={{ color: c.accent }}>ENABLE_DATADOG_APM</code> environment variable conditionally
            includes <code style={{ color: c.orange }}>dd-java-agent.jar</code> at startup.
          </p>
          <p style={para}>
            All services share the same Dockerfile, differentiated by the <code style={{ color: c.accent }}>MODULE_NAME</code>{' '}
            build argument. The JVM is configured with{' '}
            <code style={{ color: c.green }}>-XX:MaxRAMPercentage=75.0</code> to respect Kubernetes memory limits.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Multi-Stage Docker Build"
            tabs={[
              { label: 'Build Flow', source: mermaidDockerBuild },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CodeBlock
            language="dockerfile"
            filename="Dockerfile"
            showLineNumbers
            code={`# ---- Stage 1: Build ----
FROM gradle:8.5-jdk21 AS builder
WORKDIR /app
COPY build.gradle.kts settings.gradle.kts gradle.properties ./
COPY gradle/ gradle/
COPY routes/ routes/
COPY search/ search/
COPY cron/ cron/
COPY consumer/ consumer/
COPY availability/ availability/
COPY library/ library/
COPY graphql-shared/ graphql-shared/
COPY utilities/ utilities/
COPY tests/ tests/
RUN ./gradlew bootjar --parallel --no-daemon

# Download Datadog Java Agent
ADD https://dtdg.co/latest-java-tracer /app/dd-java-agent.jar

# ---- Stage 2: Runtime ----
FROM eclipse-temurin:21-jre
WORKDIR /app
ARG MODULE_NAME
COPY --from=builder /app/\${MODULE_NAME}/build/libs/*.jar app.jar
COPY --from=builder /app/dd-java-agent.jar dd-java-agent.jar
EXPOSE 8080

# Entrypoint with optional Datadog APM
ENV ENABLE_DATADOG_APM=false
CMD if [ "$ENABLE_DATADOG_APM" = "true" ]; then \\
      java -javaagent:dd-java-agent.jar \\
           -XX:MaxRAMPercentage=75.0 \\
           -Ddd.profiling.enabled=true \\
           -Ddd.logs.injection=true \\
           -jar app.jar; \\
    else \\
      java -XX:MaxRAMPercentage=75.0 -jar app.jar; \\
    fi`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Local Development: docker-compose.yml</h3>
          <p style={para}>
            For local development, Docker Compose provides MongoDB and Azure Blob Storage emulation. MongoDB
            runs on a non-standard port (<strong>27020</strong>) to avoid conflicts. Azurite provides Blob
            Storage emulation on port <strong>10010</strong>.
          </p>
          <CodeBlock
            language="yaml"
            filename="docker-compose.yml"
            code={`version: '3.8'
services:
  mongodb:
    image: mongo:4.4
    ports:
      - "27020:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: shopInventory

  azurite:
    image: mcr.microsoft.com/azure-storage/azurite:3.26.0
    ports:
      - "10010:10000"  # Blob service
      - "10011:10001"  # Queue service
    command: "azurite --blobHost 0.0.0.0 --queueHost 0.0.0.0"

volumes:
  mongodb_data:`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.orange }}>MongoDB 4.4</div>
              <p style={infoCardText}>
                Port <strong>27020</strong> (mapped from 27017). Database: <code>shopInventory</code>.
                Used by all services locally. Persistent volume at <code>/data/db</code>.
              </p>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.cyan }}>Azurite 3.26.0</div>
              <p style={infoCardText}>
                Blob service on port <strong>10010</strong>. Emulates Azure Blob Storage for testing
                EDS TSV file downloads locally without needing cloud access.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 4: HELM CONFIGURATION ============ */}
      <section id="helm-config" style={sectionSpacing}>
        <SectionHeader
          label="Helm"
          title="Helm Configuration"
          description="Base and environment-specific Helm values for the cron, search, and consumer services"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            Helm values follow a layered override pattern. The base{' '}
            <code style={{ color: c.accent }}>values.yaml</code> defines defaults (cpu: 1, memory: 4Gi, replicas: 1),
            while environment-specific files (<code style={{ color: c.green }}>values-dev.yaml</code>,{' '}
            <code style={{ color: c.red }}>values-prod.yaml</code>) override resources and features.
            Secrets are injected at deploy time via <code style={{ color: c.purple }}>--set</code> flags
            populated from Azure Key Vault.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Helm Values Override Flow"
            tabs={[
              { label: 'Override Chain', source: mermaidHelmFlow },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <DataTable
            headers={['Values File', 'CPU', 'Memory', 'Replicas', 'DataDog Profiling', 'Notes']}
            rows={[
              [
                <code style={{ color: c.accent, fontWeight: 700 }}>values.yaml (base)</code>,
                '1',
                '4Gi',
                '1',
                <span style={{ color: c.text3 }}>Not set</span>,
                'Base defaults for odyssey-cron',
              ],
              [
                <code style={{ color: c.green, fontWeight: 700 }}>values-dev.yaml</code>,
                <strong style={{ color: c.green }}>50m</strong>,
                <strong style={{ color: c.green }}>2Gi</strong>,
                '1',
                <span style={{ color: c.text3 }}>Disabled</span>,
                'Reduced resources for dev cluster',
              ],
              [
                <code style={{ color: c.red, fontWeight: 700 }}>values-prod.yaml</code>,
                '1',
                '4Gi',
                '1',
                <Badge label="Enabled" color="green" dot />,
                'DD profiling enabled for production',
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Cron Helm Values (Base)</h3>
          <CodeBlock
            language="yaml"
            filename="odyssey-cron/values.yaml"
            showLineNumbers
            code={`# Base Helm values for odyssey-cron
replicaCount: 1

image:
  repository: drivewaydevcontainerregistry.azurecr.io/odyssey-cron
  tag: "latest"
  pullPolicy: Always

resources:
  requests:
    cpu: 1
    memory: 4Gi
  limits:
    cpu: 2
    memory: 4Gi

env:
  SPRING_PROFILES_ACTIVE: dev
  ENABLE_DATADOG_APM: "false"
  JAVA_TOOL_OPTIONS: "-XX:MaxRAMPercentage=75.0"

livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 60
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 5`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="warning" title="Secrets via --set from Key Vault">
            Secrets like <code>MONGO_CONNECTION_STRING</code>, <code>AZURE_BLOB_CONNECTION_STRING</code>,
            and <code>MESSAGING_INVENTORY_DELTA_TOPIC_CONNECTION_STRING</code> are never stored in values
            files. They are injected at deploy time through <code>--set secrets.*</code> flags, sourced
            from Azure Key Vault by the pipeline.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 5: ENVIRONMENT CONFIG LOADING ============ */}
      <section id="env-config" style={sectionSpacing}>
        <SectionHeader
          label="Spring Boot"
          title="Environment Configuration Loading"
          description="How Spring Boot profiles control configuration across laptop, dev, uat, and prod"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            Spring Boot profiles determine which configuration is active at runtime. The profile is activated
            via the <code style={{ color: c.accent }}>SPRING_PROFILES_ACTIVE</code> environment variable,
            set in the Helm values for each environment. Four profiles are defined:{' '}
            <Badge label="laptop" color="green" />{' '}
            <Badge label="dev" color="yellow" />{' '}
            <Badge label="uat" color="purple" />{' '}
            <Badge label="prod" color="red" />.
          </p>
          <p style={para}>
            The base <code style={{ color: c.accent }}>application.yml</code> contains shared configuration
            including cron timing expressions, cache TTLs, blob storage container names, messaging topic
            names, and external API base URLs. Profile-specific files{' '}
            <code style={{ color: c.accent }}>application-{'{profile}'}.yml</code> override connection
            strings, feature flags, and environment-specific endpoints.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Spring Profile Resolution"
            tabs={[
              { label: 'Profile Chain', source: mermaidSpringProfiles },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CodeBlock
            language="yaml"
            filename="application.yml (shared base - excerpts)"
            showLineNumbers
            code={`# Shared cron timing (overridden per profile)
cron:
  eds-import:
    schedule: "0 0 */4 * * *"    # Every 4 hours
  inventory-sync:
    schedule: "0 30 * * * *"      # Every 30 minutes
  search-suggestion:
    schedule: "0 0 6 * * *"       # Daily at 6 AM

# Cache configuration
spring:
  cache:
    type: caffeine
    caffeine:
      spec: maximumSize=10000,expireAfterWrite=300s

# Azure Blob Storage
azure:
  blob:
    container-name: eds-files

# Messaging
messaging:
  inventory-delta:
    topic-name: inventory-delta-topic

# External APIs
external:
  max-digital:
    base-url: \${MAX_DIGITAL_BASE_URL}
  driveway:
    base-url: \${DRIVEWAY_API_BASE_URL}`}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 6: SPRING PROFILES COMPARISON ============ */}
      <section id="spring-profiles" style={sectionSpacing}>
        <SectionHeader
          label="Profiles"
          title="Spring Profiles Comparison"
          description="Side-by-side comparison of configuration across all four Spring Boot profiles"
        />
        <motion.div {...fadeUp}>
          <DataTable
            headers={['Configuration', 'laptop', 'dev', 'uat', 'prod']}
            rows={[
              [
                <strong style={{ color: c.text }}>MongoDB</strong>,
                <code style={{ color: c.green, fontSize: '0.8rem' }}>localhost:27020</code>,
                <span style={{ color: c.orange }}>Atlas cluster</span>,
                <span style={{ color: c.purple }}>Atlas cluster</span>,
                <span style={{ color: c.red }}>Atlas cluster</span>,
              ],
              [
                <strong style={{ color: c.text }}>Cron Jobs</strong>,
                <span style={{ color: c.text3 }}>Disabled</span>,
                <Badge label="Enabled" color="green" dot />,
                <Badge label="Enabled" color="green" dot />,
                <Badge label="Enabled" color="green" dot />,
              ],
              [
                <strong style={{ color: c.text }}>Blob Storage</strong>,
                <code style={{ color: c.green, fontSize: '0.8rem' }}>Azurite (local)</code>,
                <span style={{ color: c.accent }}>Azure Blob</span>,
                <span style={{ color: c.accent }}>Azure Blob</span>,
                <span style={{ color: c.accent }}>Azure Blob</span>,
              ],
              [
                <strong style={{ color: c.text }}>Service Bus</strong>,
                <span style={{ color: c.text3 }}>Dummy (no-op)</span>,
                <span style={{ color: c.accent }}>Real Service Bus</span>,
                <span style={{ color: c.accent }}>Real Service Bus</span>,
                <span style={{ color: c.accent }}>Real Service Bus</span>,
              ],
              [
                <strong style={{ color: c.text }}>DataDog APM</strong>,
                <span style={{ color: c.text3 }}>Disabled</span>,
                <Badge label="Enabled" color="green" dot />,
                <Badge label="Enabled" color="green" dot />,
                <Badge label="Enabled" color="green" dot />,
              ],
              [
                <strong style={{ color: c.text }}>DataDog Profiling</strong>,
                <span style={{ color: c.text3 }}>Disabled</span>,
                <span style={{ color: c.text3 }}>Disabled</span>,
                <span style={{ color: c.text3 }}>Disabled</span>,
                <Badge label="Enabled" color="green" dot />,
              ],
              [
                <strong style={{ color: c.text }}>GraphQL Introspection</strong>,
                <Badge label="Enabled" color="green" dot />,
                <Badge label="Enabled" color="green" dot />,
                <span style={{ color: c.red }}>Disabled</span>,
                <span style={{ color: c.red }}>Disabled</span>,
              ],
              [
                <strong style={{ color: c.text }}>Error Redaction</strong>,
                <span style={{ color: c.text3 }}>Disabled</span>,
                <span style={{ color: c.text3 }}>Disabled</span>,
                <Badge label="Enabled" color="red" dot />,
                <Badge label="Enabled" color="red" dot />,
              ],
              [
                <strong style={{ color: c.text }}>MaxDigital Endpoint</strong>,
                <span style={{ color: c.text3 }}>Mock / N/A</span>,
                <span style={{ color: c.orange }}>Dev endpoint</span>,
                <span style={{ color: c.purple }}>UAT endpoint</span>,
                <strong style={{ color: c.red }}>Prod endpoint</strong>,
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="info" title="Profile Activation">
            Profiles are activated via the <code>SPRING_PROFILES_ACTIVE</code> environment variable set in
            Helm values. Developers use <code>laptop</code> locally. The{' '}
            <code>laptop</code> profile disables cron scheduling and uses local MongoDB + Azurite,
            enabling fully offline development without cloud dependencies.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 7: TERRAFORM INDEXES ============ */}
      <section id="terraform-indexes" style={sectionSpacing}>
        <SectionHeader
          label="Terraform"
          title="MongoDB Atlas Search Indexes"
          description="Terraform-managed search indexes on MongoDB Atlas powering search and autocomplete"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            Search indexes are defined in Terraform under{' '}
            <code style={{ color: c.accent }}>terraform/infrastructure/{'{env}'}/mongo-indexes.tf</code>.
            They are provisioned as part of the CI/CD pipeline, ensuring indexes stay in sync with the
            application version being deployed. Three primary indexes power the search and autocomplete
            features.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Terraform Search Index Definitions"
            tabs={[
              { label: 'Index Map', source: mermaidTerraformIndexes },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <DataTable
            headers={['Index Name', 'Collection', 'Key Fields', 'Purpose']}
            rows={[
              [
                <strong style={{ color: c.orange }}>shopSuggestions</strong>,
                <code style={{ color: c.text }}>searchSuggestion</code>,
                <span>Autocomplete on <code style={{ color: c.cyan }}>value</code> field</span>,
                'Powers typeahead search suggestions on Driveway.com',
              ],
              [
                <strong style={{ color: c.accent }}>shopSearch</strong>,
                <code style={{ color: c.text }}>vehicleV3</code>,
                <span><strong>50+ fields</strong> mapped (text, facets, geo, autocomplete)</span>,
                'Primary search index for all shop-graphql queries with full faceting',
              ],
              [
                <strong style={{ color: c.purple }}>shopSearch (test)</strong>,
                <code style={{ color: c.text }}>vehicleTest</code>,
                <span>Same mapping as vehicleV3</span>,
                'Mirror index for integration tests without affecting production data',
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CodeBlock
            language="hcl"
            filename="terraform/infrastructure/dev/mongo-indexes.tf (excerpt)"
            showLineNumbers
            code={`resource "mongodbatlas_search_index" "shop_suggestions" {
  project_id  = var.atlas_project_id
  cluster_name = var.atlas_cluster_name
  collection_name = "searchSuggestion"
  database    = "shopInventory"
  name        = "shopSuggestions"
  type        = "search"

  mappings_dynamic = false
  mappings_fields = jsonencode({
    "value" = {
      type         = "autocomplete"
      analyzer     = "lucene.standard"
      tokenization = "edgeGram"
      minGrams     = 2
      maxGrams     = 15
    }
  })
}

resource "mongodbatlas_search_index" "shop_search" {
  project_id  = var.atlas_project_id
  cluster_name = var.atlas_cluster_name
  collection_name = "vehicleV3"
  database    = "shopInventory"
  name        = "shopSearch"
  type        = "search"

  # 50+ field mappings for text, facets, geo, autocomplete
  mappings_dynamic = false
  mappings_fields  = file("shop-search-mappings.json")
}`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="warning" title="Index Updates Require Rebuild">
            Modifying a search index mapping in Terraform triggers an index rebuild on MongoDB Atlas.
            For the <code>shopSearch</code> index with 50+ fields, this can take several minutes. During
            the rebuild, search queries may return incomplete results. Plan index changes during low-traffic
            windows.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 8: TERRAFORM SERVICE BUS ============ */}
      <section id="terraform-servicebus" style={sectionSpacing}>
        <SectionHeader
          label="Terraform"
          title="Service Bus Topics & Subscriptions"
          description="Terraform-managed Azure Service Bus resources for cron/search/sync message flows"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            Azure Service Bus topics and subscriptions are provisioned through Terraform, ensuring consistent
            configuration across all environments. The cron service publishes inventory deltas, while the
            consumer and search services subscribe to various topics for real-time data updates.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Service Bus Topic & Subscription Map"
            tabs={[
              { label: 'Topic Map', source: mermaidTerraformServiceBus },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <DataTable
            headers={['Topic', 'Role', 'TTL', 'Subscription', 'Lock Duration', 'Max Delivery']}
            rows={[
              [
                <code style={{ color: c.accent, fontWeight: 700 }}>inventory-delta-topic</code>,
                <Badge label="Publisher" color="green" dot />,
                <strong>14 days</strong>,
                <span style={{ color: c.text3 }}>N/A (publishes only)</span>,
                <span style={{ color: c.text3 }}>N/A</span>,
                <span style={{ color: c.text3 }}>N/A</span>,
              ],
              [
                <code style={{ color: c.accent, fontWeight: 700 }}>leasing-incentives-topic</code>,
                <Badge label="Subscriber" color="purple" dot />,
                <strong>2 days</strong>,
                <code style={{ color: c.cyan }}>lease-consumer-sub</code>,
                <strong>5 min</strong>,
                '10',
              ],
              [
                <code style={{ color: c.accent, fontWeight: 700 }}>search-vehicle-data-topic</code>,
                <Badge label="Subscriber" color="purple" dot />,
                <strong>15 min</strong>,
                <code style={{ color: c.cyan }}>vehicle-topic-search-subscriber-sub</code>,
                '30 sec',
                '10',
              ],
              [
                <code style={{ color: c.accent, fontWeight: 700 }}>cart-status-update-topic</code>,
                <Badge label="Subscriber" color="purple" dot />,
                <strong>30 days</strong>,
                <code style={{ color: c.cyan }}>vehicle-availability-subscriber-sub</code>,
                <strong>1 min</strong>,
                <strong style={{ color: c.orange }}>70</strong>,
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="danger" title="Max Delivery Count: 70 on Availability">
            The <code>cart-status-update-topic</code> subscription has a max delivery count of{' '}
            <strong>70</strong>, significantly higher than the default of 10. This is intentional because
            availability updates are critical for cart accuracy. Messages that fail processing are retried
            aggressively before being dead-lettered.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 9: GRADLE MODULES ============ */}
      <section id="gradle-modules" style={sectionSpacing}>
        <SectionHeader
          label="Build System"
          title="Gradle Modules"
          description="Gradle module structure and dependencies for cron, search, and consumer services"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The project uses a multi-module Gradle build defined in{' '}
            <code style={{ color: c.accent }}>settings.gradle.kts</code> with 9 modules total.
            The cron, search, and consumer modules each depend on the shared{' '}
            <code style={{ color: c.orange }}>:library</code> module. The search module additionally
            depends on <code style={{ color: c.orange }}>:graphql-shared</code> and uses the Expedia
            GraphQL server library. The GraphQL Kotlin plugin version is{' '}
            <strong>8.4.0</strong>.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Gradle Module Dependency Graph"
            tabs={[
              { label: 'Module Graph', source: mermaidGradleModules },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>cron/build.gradle.kts</h3>
          <CodeBlock
            language="kotlin"
            filename="cron/build.gradle.kts"
            showLineNumbers
            code={`plugins {
    id("driveway.artifact-conventions")
}

dependencies {
    implementation(project(":library"))
}`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>search/build.gradle.kts</h3>
          <CodeBlock
            language="kotlin"
            filename="search/build.gradle.kts"
            showLineNumbers
            code={`plugins {
    id("driveway.artifact-conventions")
    id("com.expediagroup.graphql") version "7.0.2"
}

dependencies {
    implementation(project(":library"))
    implementation(project(":graphql-shared"))
    implementation("com.expediagroup:graphql-kotlin-spring-server")
}`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>consumer/build.gradle.kts</h3>
          <CodeBlock
            language="kotlin"
            filename="consumer/build.gradle.kts"
            showLineNumbers
            code={`plugins {
    id("driveway.artifact-conventions")
}

dependencies {
    implementation(project(":library"))
    implementation(libs.lithiaAsb)  // Lithia Azure Service Bus client
}`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>settings.gradle.kts</h3>
          <CodeBlock
            language="kotlin"
            filename="settings.gradle.kts (modules)"
            showLineNumbers
            code={`pluginManagement {
    plugins {
        id("com.expediagroup.graphql") version "8.4.0"
    }
}

rootProject.name = "odyssey-api"

include(
    ":routes",
    ":search",
    ":cron",
    ":consumer",
    ":availability",
    ":library",
    ":graphql-shared",
    ":utilities",
    ":tests"
)`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <DataTable
            headers={['Module', 'Plugin', 'Dependencies', 'Purpose']}
            rows={[
              [
                <strong style={{ color: c.green }}>cron</strong>,
                'driveway.artifact-conventions',
                <code style={{ color: c.orange }}>:library</code>,
                'Scheduled EDS import, sync, and suggestion-rebuild jobs',
              ],
              [
                <strong style={{ color: c.accent }}>search</strong>,
                'artifact-conventions + graphql 7.0.2',
                <><code style={{ color: c.orange }}>:library</code>, <code style={{ color: c.orange }}>:graphql-shared</code></>,
                'GraphQL search API powered by Atlas Search',
              ],
              [
                <strong style={{ color: c.purple }}>consumer</strong>,
                'driveway.artifact-conventions',
                <><code style={{ color: c.orange }}>:library</code>, <code style={{ color: c.cyan }}>lithiaAsb</code></>,
                'Service Bus message consumer for leasing incentives',
              ],
            ]}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 10: PIPELINE CONFIGURATION ============ */}
      <section id="pipelines" style={sectionSpacing}>
        <SectionHeader
          label="CI/CD"
          title="Pipeline Configuration"
          description="Azure DevOps pipeline definitions for dev, cron-only, and prod deployments"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            Four key pipeline files govern the deployment of cron, search, and sync services. The main{' '}
            <code style={{ color: c.accent }}>dev.yml</code> pipeline is automatically triggered on every
            merge to <code style={{ color: c.accent }}>main</code> and deploys all 5 services. The cron-only
            pipelines enable independent hotfix deployments of the cron service without affecting other services.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Pipeline Topology"
            tabs={[
              { label: 'Pipeline Flow', source: mermaidPipelineFlow },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <DataTable
            headers={['Pipeline File', 'Trigger', 'Scope', 'Stages', 'Services Deployed']}
            rows={[
              [
                <code style={{ color: c.green, fontWeight: 700 }}>dev.yml</code>,
                <Badge label="Auto on main" color="green" dot />,
                'Full DEV deployment',
                'Build > Test > Coverage > Docker > Terraform > Helm deploy > Smoke tests',
                'All 5 services',
              ],
              [
                <code style={{ color: c.orange, fontWeight: 700 }}>odyssey-cron-dev.yml</code>,
                <Badge label="Manual" color="yellow" dot />,
                'DEV cron hotfix',
                'Build cron > Docker > Helm deploy cron',
                'odyssey-cron only',
              ],
              [
                <code style={{ color: c.purple, fontWeight: 700 }}>odyssey-cron-prod-mesh.yaml</code>,
                <><Badge label="Tag v*" color="purple" dot /></>,
                'PROD cron release',
                'Build cron > Docker > Helm deploy cron to PROD',
                'odyssey-cron only',
              ],
              [
                <code style={{ color: c.red, fontWeight: 700 }}>prod.yaml</code>,
                <Badge label="Manual + CR" color="red" dot />,
                'Full PROD deployment',
                'Build > Docker > Terraform > Helm deploy > CR approval',
                'All 5 services',
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>dev.yml Pipeline Stages</h3>
          <CodeBlock
            language="yaml"
            filename="dev.yml (stage overview)"
            showLineNumbers
            code={`trigger:
  branches:
    include:
      - main

pool:
  name: 'driveway-pipeline-agents'

stages:
  - stage: Build
    jobs:
      - job: GradleBuild
        steps:
          - script: ./gradlew bootjar --parallel --no-daemon

  - stage: Test
    dependsOn: Build
    jobs:
      - job: UnitTests
        steps:
          - script: ./gradlew test
      - job: Coverage
        steps:
          - script: ./gradlew jacocoTestReport

  - stage: Docker
    dependsOn: Test
    jobs:
      - job: BuildImages
        steps:
          - task: Docker@2
            inputs:
              command: buildAndPush
              # Builds 5 images with MODULE_NAME arg

  - stage: Infrastructure
    dependsOn: Docker
    jobs:
      - job: TerraformApply
        steps:
          - script: terraform init && terraform plan && terraform apply -auto-approve

  - stage: Deploy
    dependsOn: Infrastructure
    jobs:
      - job: HelmDeploy
        steps:
          - script: |
              helm upgrade odyssey-api ./charts/api --install --atomic
              helm upgrade odyssey-consumer ./charts/headless --install --atomic
              helm upgrade odyssey-search-graphql ./charts/api --install --atomic
              helm upgrade odyssey-availability-sub ./charts/headless --install --atomic
              helm upgrade odyssey-cron ./charts/cron --install --atomic

  - stage: Validate
    dependsOn: Deploy
    jobs:
      - job: SmokeTests
        steps:
          - script: ./run-smoke-tests.sh`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="info" title="Cron-Only Pipeline: Tag-Triggered Production">
            The <code>odyssey-cron-prod-mesh.yaml</code> pipeline is uniquely triggered by Git tags matching
            the <code>v*</code> pattern. This enables versioned cron releases independently from the main
            deployment train. Create a tag like <code>v1.2.3-cron</code> to trigger a production cron deployment.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 11: ENVIRONMENT COMPARISON ============ */}
      <section id="env-comparison" style={sectionSpacing}>
        <SectionHeader
          label="Environments"
          title="Environment Comparison"
          description="Side-by-side comparison of all environment configurations for cron, search, and sync"
        />
        <motion.div {...fadeUp}>
          <DataTable
            headers={['Aspect', 'laptop', 'dev', 'uat', 'prod']}
            highlightColumn={4}
            rows={[
              [
                <strong style={{ color: c.text }}>Deployment</strong>,
                <span style={{ color: c.text3 }}>Local JVM</span>,
                'AKS (auto on main)',
                'AKS (manual)',
                <strong style={{ color: c.red }}>AKS (manual + CR)</strong>,
              ],
              [
                <strong style={{ color: c.text }}>MongoDB</strong>,
                <code style={{ color: c.green, fontSize: '0.8rem' }}>localhost:27020</code>,
                'Atlas DEV cluster',
                'Atlas UAT cluster',
                'Atlas PROD cluster',
              ],
              [
                <strong style={{ color: c.text }}>Cron Scheduling</strong>,
                <span style={{ color: c.red }}>Disabled</span>,
                <Badge label="Active" color="green" dot />,
                <Badge label="Active" color="green" dot />,
                <Badge label="Active" color="green" dot />,
              ],
              [
                <strong style={{ color: c.text }}>Blob Storage</strong>,
                'Azurite (:10010)',
                'Azure Blob (dev)',
                'Azure Blob (uat)',
                'Azure Blob (prod)',
              ],
              [
                <strong style={{ color: c.text }}>Service Bus</strong>,
                <span style={{ color: c.text3 }}>Dummy no-op</span>,
                'Real SB namespace',
                'Real SB namespace',
                'Real SB namespace',
              ],
              [
                <strong style={{ color: c.text }}>Cron Memory</strong>,
                'N/A (JVM default)',
                '2Gi',
                '4Gi',
                <strong style={{ color: c.red }}>4Gi</strong>,
              ],
              [
                <strong style={{ color: c.text }}>Cron CPU</strong>,
                'N/A',
                '50m',
                '1',
                '1',
              ],
              [
                <strong style={{ color: c.text }}>DataDog APM</strong>,
                <span style={{ color: c.text3 }}>Off</span>,
                <Badge label="On" color="green" dot />,
                <Badge label="On" color="green" dot />,
                <Badge label="On" color="green" dot />,
              ],
              [
                <strong style={{ color: c.text }}>DataDog Profiling</strong>,
                <span style={{ color: c.text3 }}>Off</span>,
                <span style={{ color: c.text3 }}>Off</span>,
                <span style={{ color: c.text3 }}>Off</span>,
                <Badge label="On" color="green" dot />,
              ],
              [
                <strong style={{ color: c.text }}>Terraform</strong>,
                <span style={{ color: c.text3 }}>N/A</span>,
                'Auto-applied',
                'Auto-applied',
                'Auto-applied',
              ],
              [
                <strong style={{ color: c.text }}>Search Indexes</strong>,
                <span style={{ color: c.text3 }}>N/A (local Mongo)</span>,
                'Terraform-managed',
                'Terraform-managed',
                'Terraform-managed',
              ],
              [
                <strong style={{ color: c.text }}>MaxDigital</strong>,
                <span style={{ color: c.text3 }}>Mock</span>,
                'Dev endpoint',
                'UAT endpoint',
                <strong style={{ color: c.red }}>Prod endpoint</strong>,
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="info" title="Laptop Profile: Fully Offline">
            The <code>laptop</code> profile requires zero cloud dependencies. MongoDB runs locally via
            Docker Compose on port 27020, Azure Blob Storage is emulated by Azurite on port 10010, and
            Service Bus is replaced with a dummy no-op implementation. Cron scheduling is disabled to
            prevent accidental data imports during local development.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 12: KEY TAKEAWAYS ============ */}
      <section id="takeaways" style={sectionSpacing}>
        <SectionHeader
          label="Summary"
          title="Key Takeaways"
          description="Essential deployment and configuration knowledge for the cron, search, and sync flows"
        />
        <motion.div {...fadeUp}>
          <div style={cardGrid}>
            <Card variant="blue" title="AKS + Helm">
              <p style={infoCardText}>
                All 5 microservices deploy to Azure Kubernetes Service via Helm charts. The cron service
                uses the <strong>cron</strong> chart type with a single replica and 4Gi memory in
                production. API services auto-scale 3-12 pods at 70% CPU.
              </p>
            </Card>
            <Card variant="green" title="Multi-Stage Docker">
              <p style={infoCardText}>
                A single Dockerfile serves all services. The <code>MODULE_NAME</code> build arg selects
                the target module. DataDog APM is conditionally included. JVM uses{' '}
                <code>-XX:MaxRAMPercentage=75.0</code> to respect container limits.
              </p>
            </Card>
            <Card variant="purple" title="Terraform IaC">
              <p style={infoCardText}>
                MongoDB Atlas search indexes (including the 50+ field <code>shopSearch</code> index) and
                Service Bus topics/subscriptions are provisioned through Terraform. Infrastructure changes
                are applied atomically with every deployment.
              </p>
            </Card>
            <Card variant="yellow" title="Spring Profiles">
              <p style={infoCardText}>
                Four profiles (laptop, dev, uat, prod) control all environment-specific behavior.
                The <code>laptop</code> profile enables fully offline development with Docker Compose
                providing MongoDB and Azurite.
              </p>
            </Card>
            <Card variant="cyan" title="9 Gradle Modules">
              <p style={infoCardText}>
                The monorepo contains 9 modules built in parallel. The cron, search, and consumer modules
                share the <code>:library</code> module. Search uses Expedia GraphQL Kotlin 7.0.2 with
                the plugin at version 8.4.0.
              </p>
            </Card>
            <Card variant="red" title="Pipeline Safety">
              <p style={infoCardText}>
                DEV deploys automatically on merge to main. PROD requires manual trigger plus an approved
                Change Request. Cron can be deployed independently via tag-triggered pipelines for
                emergency hotfixes.
              </p>
            </Card>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={{ ...spacer, marginBottom: '4rem' }}>
          <div style={keyTakeaway}>
            <p style={{ ...para, marginBottom: 0, color: c.text }}>
              <strong>Summary:</strong> The deployment infrastructure for cron, search, and sync flows is fully
              automated and declarative. Helm charts orchestrate Kubernetes deployments, Terraform manages cloud
              infrastructure, Spring profiles control environment-specific behavior, and CI/CD pipelines ensure
              safe, traceable promotion from development through production. Every component from search indexes
              to Service Bus subscriptions is versioned and reproducible.
            </p>
          </div>
        </motion.div>
      </section>
    </>
  );
}
