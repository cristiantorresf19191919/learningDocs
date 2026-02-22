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
  { id: 'overview', label: 'Pipeline Overview' },
  { id: 'deployment-flow', label: 'Deployment Flow' },
  { id: 'pipeline-details', label: 'Pipeline Files' },
  { id: 'docker-build', label: 'Docker Build' },
  { id: 'services-deployed', label: 'Deployed Services' },
  { id: 'terraform', label: 'Terraform Infrastructure' },
  { id: 'monitoring', label: 'Monitoring & Alerts' },
  { id: 'helm-config', label: 'Helm Configuration' },
  { id: 'secrets', label: 'Secrets & Key Vaults' },
  { id: 'pr-pipeline', label: 'PR Validation' },
  { id: 'performance', label: 'Performance Testing' },
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

const mermaidDeploymentFlow = `%%{init: {'theme': 'dark'}}%%
graph TD
    A[Code Commit to Main] --> B[dev.yml Auto-Triggered]
    B --> C[Build Stage]
    C --> D[Compile 9 Gradle Modules]
    D --> E[Multi-stage Docker Build]
    E --> F[Push to DEV ACR]
    F --> G[Terraform Apply dev]
    G --> H[Helm Deploy to AKS]
    H --> I[Smoke Tests]
    I --> J{Manual Trigger}
    J --> K[uat.yml]
    K --> L[Build & Push UAT]
    L --> M[Terraform Apply uat]
    M --> N[Helm Deploy UAT]
    N --> O[Smoke Tests]
    O --> P{Manual + CR}
    P --> Q[prod.yaml]
    Q --> R[Build & Push PROD ACR]
    R --> S[Terraform Apply prod]
    S --> T[Helm Deploy PROD]
    T --> U[Change Request Approved]
    style A fill:#238636,stroke:#3fb950,color:#fff
    style B fill:#1f6feb,stroke:#58a6ff,color:#fff
    style K fill:#d29922,stroke:#e3b341,color:#000
    style Q fill:#da3633,stroke:#f85149,color:#fff
    style U fill:#238636,stroke:#3fb950,color:#fff
    style J fill:#6e40c9,stroke:#bc8cff,color:#fff
    style P fill:#6e40c9,stroke:#bc8cff,color:#fff`;

const mermaidDevPipelineSequence = `%%{init: {'theme': 'dark'}}%%
sequenceDiagram
    participant Dev as Developer
    participant ADO as Azure DevOps
    participant ACR as DEV ACR
    participant TF as Terraform
    participant AKS as AKS Cluster
    participant Tests as Smoke Tests
    Dev->>ADO: Push to main branch
    ADO->>ADO: Trigger dev.yml pipeline
    rect rgb(31, 111, 235, 0.2)
        Note over ADO,ACR: Build Stage
        ADO->>ADO: ./gradlew bootjar --parallel (9 modules)
        ADO->>ADO: docker build (multi-stage)
        ADO->>ACR: docker push (5 service images)
    end
    rect rgb(210, 153, 34, 0.2)
        Note over ADO,AKS: Infrastructure Stage
        ADO->>TF: terraform init + plan + apply
        TF->>TF: MongoDB Atlas indexes
        TF->>TF: Service Bus topics & subscriptions
        TF->>TF: Azure Monitor alerts
    end
    rect rgb(35, 134, 54, 0.2)
        Note over ADO,AKS: Deploy Stage (x5 services)
        ADO->>AKS: helm upgrade odyssey-api
        ADO->>AKS: helm upgrade odyssey-consumer
        ADO->>AKS: helm upgrade odyssey-search-graphql
        ADO->>AKS: helm upgrade odyssey-availability-sub
        ADO->>AKS: helm upgrade odyssey-cron
    end
    rect rgb(110, 64, 201, 0.2)
        Note over ADO,Tests: Validation Stage
        ADO->>Tests: Run smoke test suite
        Tests-->>ADO: Pass / Fail
    end`;

const mermaidDockerBuild = `%%{init: {'theme': 'dark'}}%%
graph LR
    A[gradle:jdk21] --> B[Copy Source]
    B --> C[./gradlew bootjar --parallel]
    C --> D[Download DD Agent]
    D --> E[eclipse-temurin-21]
    E --> F[Copy JAR + Agent]
    F --> G[Expose 8080]
    G --> H{APM=true?}
    H -->|Yes| I[javaagent:dd-java-agent.jar]
    H -->|No| J[Plain Java -jar]
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style E fill:#238636,stroke:#3fb950,color:#fff
    style I fill:#d29922,stroke:#e3b341,color:#000
    style J fill:#6e40c9,stroke:#bc8cff,color:#fff`;

const mermaidServicesArchitecture = `%%{init: {'theme': 'dark'}}%%
graph TB
    subgraph AKS["AKS Cluster"]
        A["odyssey-api<br/>routes module<br/>Helm: api v5"]
        B["odyssey-consumer<br/>consumer module<br/>Helm: headless v5"]
        C["odyssey-search-graphql<br/>search module<br/>Helm: api v5"]
        D["odyssey-availability-sub<br/>availability module<br/>Helm: headless v5"]
        E["odyssey-cron<br/>cron module<br/>Helm: cron v5"]
    end
    F[("MongoDB Atlas")] --> A
    F --> B
    F --> C
    F --> D
    F --> E
    G["Azure Service Bus"] --> B
    G --> D
    H["Azure Blob Storage"] --> E
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style B fill:#6e40c9,stroke:#bc8cff,color:#fff
    style C fill:#1f6feb,stroke:#58a6ff,color:#fff
    style D fill:#6e40c9,stroke:#bc8cff,color:#fff
    style E fill:#238636,stroke:#3fb950,color:#fff
    style F fill:#d29922,stroke:#e3b341,color:#000
    style G fill:#d29922,stroke:#e3b341,color:#000
    style H fill:#d29922,stroke:#e3b341,color:#000`;

const mermaidTerraformResources = `%%{init: {'theme': 'dark'}}%%
graph TB
    subgraph Terraform["Terraform Resources"]
        subgraph MongoAtlas["MongoDB Atlas"]
            A["shopSearch Index<br/>vehicleV3 - 50+ fields"]
            B["shopSuggestions Index<br/>searchSuggestion"]
            C["shopSearch Test Index<br/>vehicleTest"]
            D["shopSearch Relevancy Index<br/>vehicleSearchRelevancyTest"]
        end
        subgraph ServiceBus["Azure Service Bus"]
            E["inventory-delta-topic<br/>TTL: 14 days"]
            F["leasing-incentives-topic<br/>TTL: 2 days"]
            G["cart-status-update-topic<br/>TTL: 30 days"]
            H["vehicle-data-topic<br/>TTL: 15 min"]
        end
        subgraph Subs["Subscriptions"]
            I["lease-consumer-sub"]
            J["vehicle-availability-subscriber-sub"]
            K["vehicle-topic-search-subscriber-sub"]
        end
    end
    F --> I
    G --> J
    H --> K
    style A fill:#d29922,stroke:#e3b341,color:#000
    style B fill:#d29922,stroke:#e3b341,color:#000
    style C fill:#d29922,stroke:#e3b341,color:#000
    style D fill:#d29922,stroke:#e3b341,color:#000
    style E fill:#1f6feb,stroke:#58a6ff,color:#fff
    style F fill:#1f6feb,stroke:#58a6ff,color:#fff
    style G fill:#1f6feb,stroke:#58a6ff,color:#fff
    style H fill:#1f6feb,stroke:#58a6ff,color:#fff
    style I fill:#238636,stroke:#3fb950,color:#fff
    style J fill:#238636,stroke:#3fb950,color:#fff
    style K fill:#238636,stroke:#3fb950,color:#fff`;

const mermaidAlertFlow = `%%{init: {'theme': 'dark'}}%%
graph LR
    A["Application Insights"] --> B["Scheduled Query Rules"]
    B --> C{"Alert Triggered?"}
    C -->|"No Imports 8h"| D["Email Team"]
    C -->|"Job > 1h"| D
    C -->|"2/3 Failed"| D
    C -->|"Count Mismatch"| D
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style B fill:#d29922,stroke:#e3b341,color:#000
    style C fill:#6e40c9,stroke:#bc8cff,color:#fff
    style D fill:#da3633,stroke:#f85149,color:#fff`;

const mermaidSecretInjection = `%%{init: {'theme': 'dark'}}%%
graph LR
    subgraph KeyVaults["Key Vaults"]
        A["odyssey-cr-p-kv"]
        B["dwmerchandis-kv"]
        C["lease-cons-s-kv"]
        D["vehicle-search-s-kv"]
        E["vehicle-avail-s-kv"]
    end
    A --> F["MESSAGING_INVENTORY_DELTA_TOPIC_CONNECTION_STRING"]
    C --> G["FINANCE_SERVICE_BUS_CONNECTION_STRING"]
    E --> H["VEHICLE_AVAILABILITY_SUBSCRIBER_CONNECTION_STRING"]
    B --> I2["MONGO_CONNECTION_STRING"]
    D --> I3["SEARCH_SERVICE_BUS_CONNECTION_STRING"]
    F --> I["Helm --set secrets"]
    G --> I
    H --> I
    I2 --> I
    I3 --> I
    I --> J["AKS Pod Environment"]
    style A fill:#6e40c9,stroke:#bc8cff,color:#fff
    style B fill:#6e40c9,stroke:#bc8cff,color:#fff
    style C fill:#6e40c9,stroke:#bc8cff,color:#fff
    style D fill:#6e40c9,stroke:#bc8cff,color:#fff
    style E fill:#6e40c9,stroke:#bc8cff,color:#fff
    style I fill:#d29922,stroke:#e3b341,color:#000
    style J fill:#238636,stroke:#3fb950,color:#fff`;

const mermaidPrPipeline = `%%{init: {'theme': 'dark'}}%%
graph TD
    A["PR Created"] --> B["pull-request-check.yml"]
    B --> C["Build"]
    C --> D["Test + Lint"]
    D --> E["Terraform Apply ALL envs"]
    E --> F["Deploy Ephemeral"]
    F --> G["pr-N.api-dev.driveway.com"]
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style B fill:#d29922,stroke:#e3b341,color:#000
    style E fill:#6e40c9,stroke:#bc8cff,color:#fff
    style G fill:#238636,stroke:#3fb950,color:#fff`;

const mermaidPerformancePipeline = `%%{init: {'theme': 'dark'}}%%
graph TD
    A["Manual Trigger"] --> B["performance.yaml"]
    B --> C["Select TARGET_ENV"]
    C --> D["Configure K6 Parameters"]
    D --> E["Ramp Up Phase"]
    E --> F["Maintain Load Phase"]
    F --> G["Ramp Down Phase"]
    G --> H["Collect Metrics"]
    H --> I["Generate Report"]
    I --> J{"Thresholds Met?"}
    J -->|Yes| K["Pass"]
    J -->|No| L["Fail + Alert"]
    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style B fill:#d29922,stroke:#e3b341,color:#000
    style E fill:#238636,stroke:#3fb950,color:#fff
    style F fill:#238636,stroke:#3fb950,color:#fff
    style G fill:#238636,stroke:#3fb950,color:#fff
    style K fill:#238636,stroke:#3fb950,color:#fff
    style L fill:#da3633,stroke:#f85149,color:#fff`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function OdysseyPipelinePage() {
  const { setSidebar, clearSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('Pipelines & Deployment', tocItems);
    return () => clearSidebar();
  }, [setSidebar, clearSidebar]);

  return (
    <>
      {/* ============ HERO ============ */}
      <section style={heroSection}>
        <div style={heroGradientBg} />
        <motion.div style={heroContent} {...fadeUp}>
          <h1 style={heroTitle}>Odyssey-Api Pipelines & Deployment</h1>
          <p style={heroSubtitle}>
            Complete CI/CD pipeline documentation covering build, test, deploy, infrastructure-as-code,
            and monitoring for all environments from development through production.
          </p>
          <div style={statsRow}>
            {[
              { val: '8', label: 'Pipelines' },
              { val: '5', label: 'Services' },
              { val: '3', label: 'Environments' },
              { val: '5', label: 'Key Vaults' },
            ].map((s) => (
              <div key={s.label} style={statBox}>
                <div style={statVal}>{s.val}</div>
                <div style={statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 1: PIPELINE OVERVIEW ============ */}
      <section id="overview" style={sectionSpacing}>
        <SectionHeader
          label="Introduction"
          title="Pipeline Overview"
          description="A high-level look at the CI/CD infrastructure powering Odyssey-Api across all environments"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The Odyssey-Api project uses Azure DevOps Pipelines to manage the full lifecycle of code from commit
            to production deployment. The pipeline infrastructure consists of 8 distinct YAML pipeline definitions,
            each serving a specific purpose in the software delivery process. The architecture follows a progressive
            promotion model: changes land in DEV automatically on every merge to <code style={{ color: c.accent }}>main</code>,
            then get manually promoted to UAT and finally to PROD with a formal Change Request approval.
          </p>
          <p style={para}>
            Every pipeline stage is fully automated and declarative. Terraform manages all cloud infrastructure
            (MongoDB Atlas search indexes, Azure Service Bus topics/subscriptions, monitoring alerts), Docker
            multi-stage builds produce optimized JDK 21 images, and Helm charts orchestrate the Kubernetes
            deployments across three AKS clusters. Self-hosted agent pools (<code style={{ color: c.accent }}>driveway-pipeline-agents</code>)
            ensure network-level access to internal registries and clusters.
          </p>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>Progressive Promotion</div>
              <p style={infoCardText}>
                Code flows DEV &rarr; UAT &rarr; PROD. Each environment has its own pipeline file, ACR registry,
                AKS cluster, and Key Vault secrets. UAT and PROD require manual triggers; PROD additionally
                requires an approved Change Request.
              </p>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>Infrastructure as Code</div>
              <p style={infoCardText}>
                All environment infrastructure is defined in Terraform. MongoDB Atlas search indexes, Azure
                Service Bus topics and subscriptions, and Azure Monitor alert rules are all provisioned and
                updated as part of the pipeline, ensuring environments stay in sync.
              </p>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent3 }}>Self-Hosted Agents</div>
              <p style={infoCardText}>
                Pipelines run on self-hosted Azure DevOps agent pools (<code style={{ color: c.cyan }}>driveway-pipeline-agents</code>)
                that have network access to internal ACR registries, AKS clusters, and Key Vaults. This ensures
                secure, fast builds without public internet exposure.
              </p>
            </div>
          </div>
          <Callout type="info" title="Pipeline Naming Convention">
            DEV and UAT pipeline files use the <code>.yml</code> extension while PROD files use <code>.yaml</code>.
            This is an intentional convention to visually distinguish production-bound configurations.
            Cron pipelines follow the same pattern: <code>odyssey-cron-dev.yml</code> vs <code>odyssey-cron-prod-mesh.yaml</code>.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 2: DEPLOYMENT FLOW ============ */}
      <section id="deployment-flow" style={sectionSpacing}>
        <SectionHeader
          label="CI/CD Flow"
          title="Deployment Flow"
          description="The complete journey from code commit to production deployment across all environments"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The deployment flow follows a strict progression through three environments. When a developer merges
            code to the <code style={{ color: c.accent }}>main</code> branch, the DEV pipeline is automatically triggered.
            It compiles all 9 Gradle modules in parallel, builds a multi-stage Docker image for each of the 5 services,
            pushes them to the DEV Azure Container Registry, runs Terraform to sync infrastructure, deploys via Helm
            to the DEV AKS cluster, and validates with smoke tests.
          </p>
          <p style={para}>
            Once DEV is validated, a team member can manually trigger the UAT pipeline, which repeats the build-push-deploy
            cycle against the UAT environment. After UAT testing is complete, the PROD pipeline requires both a manual
            trigger and an approved Change Request before executing the final deployment to production.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Complete Deployment Flow: DEV → UAT → PROD"
            tabs={[
              { label: 'Deployment Flow', source: mermaidDeploymentFlow },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <div style={keyTakeaway}>
            <p style={{ ...para, marginBottom: 0, color: c.text }}>
              <strong>Key takeaway:</strong> The entire flow from commit to production is fully traceable.
              Every Docker image is tagged with the build ID, every Terraform state change is logged, and
              every Helm deployment is versioned. Rollbacks are performed by re-running a previous pipeline
              build, which redeployments the corresponding image tag.
            </p>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Environment Progression Rules</h3>
          <div style={cardGrid}>
            <div style={{ ...infoCard, borderLeftColor: c.accent2, borderLeftWidth: 3 }}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>DEV</div>
              <p style={infoCardText}>
                Automatically triggered on every merge to <code style={{ color: c.accent }}>main</code>.
                No approvals required. Full build + deploy + smoke test cycle completes in approximately 15-20 minutes.
                Uses <code style={{ color: c.cyan }}>driveway-pipeline-agents</code> pool.
              </p>
            </div>
            <div style={{ ...infoCard, borderLeftColor: c.orange, borderLeftWidth: 3 }}>
              <div style={{ ...infoCardTitle, color: c.orange }}>UAT</div>
              <p style={infoCardText}>
                Manual trigger only. Requires a team member to explicitly start the pipeline from Azure DevOps.
                Uses <code style={{ color: c.cyan }}>driveway-pipeline-agents-uat</code> pool. Deploys with 3 replicas
                to match production-like scaling.
              </p>
            </div>
            <div style={{ ...infoCard, borderLeftColor: c.red, borderLeftWidth: 3 }}>
              <div style={{ ...infoCardTitle, color: c.red }}>PROD</div>
              <p style={infoCardText}>
                Manual trigger plus an approved Change Request (CR). The pipeline will not execute until the CR
                is in an approved state. Uses <code style={{ color: c.cyan }}>driveway-pipeline-agents</code> pool.
                Auto-scaling from 3-12 replicas at 70% CPU.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 3: PIPELINE FILES ============ */}
      <section id="pipeline-details" style={sectionSpacing}>
        <SectionHeader
          label="Pipeline Definitions"
          title="Pipeline Files"
          description="All 8 Azure DevOps pipeline YAML definitions and their roles"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The project maintains 8 pipeline files in the repository root. Each serves a distinct purpose in the
            delivery workflow. The main deployment pipelines (<code style={{ color: c.accent }}>dev.yml</code>,
            <code style={{ color: c.accent }}> uat.yml</code>, <code style={{ color: c.accent }}>prod.yaml</code>)
            deploy all 5 services. The cron-only pipelines deploy just the cron service for hotfixes to scheduled
            jobs without affecting the rest of the system.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <DataTable
            headers={['Pipeline File', 'Trigger', 'Agent Pool', 'Purpose', 'Services Deployed']}
            rows={[
              [
                <code style={{ color: c.accent, fontWeight: 700 }}>dev.yml</code>,
                <span style={{ color: c.accent2 }}>Auto on main</span>,
                'driveway-pipeline-agents',
                'Full DEV deployment with smoke tests',
                'All 5 services',
              ],
              [
                <code style={{ color: c.orange, fontWeight: 700 }}>uat.yml</code>,
                <span style={{ color: c.orange }}>Manual</span>,
                'driveway-pipeline-agents-uat',
                'Full UAT deployment with smoke tests',
                'All 5 services',
              ],
              [
                <code style={{ color: c.red, fontWeight: 700 }}>prod.yaml</code>,
                <span style={{ color: c.red }}>Manual + CR</span>,
                'driveway-pipeline-agents',
                'Production deployment with Change Request',
                'All 5 services',
              ],
              [
                <code style={{ color: c.text2 }}>odyssey-cron-dev.yml</code>,
                <span style={{ color: c.orange }}>Manual</span>,
                'driveway-pipeline-agents',
                'DEV cron-only hotfix deployment',
                'odyssey-cron only',
              ],
              [
                <code style={{ color: c.text2 }}>odyssey-cron-uat-mesh.yml</code>,
                <span style={{ color: c.orange }}>Manual</span>,
                'driveway-pipeline-agents-uat',
                'UAT cron-only hotfix deployment',
                'odyssey-cron only',
              ],
              [
                <code style={{ color: c.text2 }}>odyssey-cron-prod-mesh.yaml</code>,
                <span>Tag <code style={{ color: c.accent3 }}>v*</code> triggered</span>,
                'driveway-pipeline-agents',
                'PROD cron-only release deployment',
                'odyssey-cron only',
              ],
              [
                <code style={{ color: c.cyan }}>pull-request-check.yml</code>,
                <span style={{ color: c.accent }}>PR to main</span>,
                'driveway-pipeline-agents',
                'PR validation with ephemeral deploy',
                'All 5 (ephemeral)',
              ],
              [
                <code style={{ color: c.pink }}>performance.yaml</code>,
                <span style={{ color: c.orange }}>Manual</span>,
                'driveway-pipeline-agents',
                'K6 load testing against any environment',
                'None (test only)',
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>DEV Pipeline Stage Sequence</h3>
          <p style={para}>
            The <code style={{ color: c.accent }}>dev.yml</code> pipeline is the most comprehensive and serves as the
            reference implementation for all environment pipelines. It progresses through four major stages:
            Build, Infrastructure, Deploy, and Validate. Each stage is dependent on the previous one succeeding.
          </p>
          <MermaidViewer
            title="dev.yml Pipeline Sequence Diagram"
            tabs={[
              { label: 'Pipeline Stages', source: mermaidDevPipelineSequence },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="warning" title="Cron-Only Pipelines">
            The cron-only pipelines (<code>odyssey-cron-dev.yml</code>, <code>odyssey-cron-uat-mesh.yml</code>,
            <code> odyssey-cron-prod-mesh.yaml</code>) exist for emergency hotfixes to scheduled jobs. They skip
            the full 5-service deployment cycle and only build + deploy the cron service. The production cron
            pipeline is uniquely triggered by Git tags matching the <code>v*</code> pattern, enabling versioned
            releases of cron changes independently from the main deployment train.
          </Callout>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Pipeline Build Variables</h3>
          <p style={para}>
            All pipelines share a common set of build variables that control the build and deployment behavior.
            These variables are set at the pipeline level and passed down to individual stages.
          </p>
          <CodeBlock
            language="yaml"
            filename="dev.yml (variables section)"
            code={`variables:
  - name: dockerRegistryServiceConnection
    value: 'driveway-dev-acr-connection'
  - name: containerRegistry
    value: 'drivewaydevcontainerregistry.azurecr.io'
  - name: tag
    value: '$(Build.BuildId)'
  - name: vmImageName
    value: 'ubuntu-latest'
  - name: terraformBackendResourceGroup
    value: 'odyssey-dev-rg'
  - name: terraformBackendStorageAccount
    value: 'odysseydevtfstate'
  - name: terraformBackendContainer
    value: 'tfstate'
  - name: terraformBackendKey
    value: 'odyssey.dev.terraform.tfstate'
  - name: environment
    value: 'dev'
  - name: aksClusterName
    value: 'driveway-dev-aks'
  - name: aksResourceGroup
    value: 'driveway-dev-rg'`}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 4: DOCKER BUILD ============ */}
      <section id="docker-build" style={sectionSpacing}>
        <SectionHeader
          label="Containerization"
          title="Docker Build"
          description="Multi-stage Docker build with Datadog APM integration and JDK 21 runtime"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The Dockerfile uses a multi-stage build to minimize the final image size. The first stage
            uses the official Gradle JDK 21 image to compile all 9 subprojects in parallel using
            <code style={{ color: c.accent }}> ./gradlew bootjar --parallel</code>. The second stage switches to the
            lightweight <code style={{ color: c.accent }}>eclipse-temurin:21-jre</code> runtime image, copies only the
            compiled JAR and the Datadog Java agent, and exposes port 8080. At runtime, the
            <code style={{ color: c.accent }}> ENABLE_DATADOG_APM</code> environment variable controls whether the
            Datadog agent is attached.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Multi-Stage Docker Build Process"
            tabs={[
              { label: 'Docker Build Flow', source: mermaidDockerBuild },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Dockerfile</h3>
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
           -Ddd.profiling.enabled=true \\
           -Ddd.logs.injection=true \\
           -jar app.jar; \\
    else \\
      java -jar app.jar; \\
    fi`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Docker Compose (Local Development)</h3>
          <p style={para}>
            For local development, a Docker Compose file provides MongoDB and Azure Blob Storage emulation.
            The MongoDB instance runs on a non-standard port to avoid conflicts with any locally installed
            MongoDB, and Azurite provides local Azure Blob Storage emulation for testing EDS file imports.
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
                Port <strong>27020</strong> (mapped from container 27017). Database: <code>shopInventory</code>.
                Used by all services for local development. Persistent volume mount at <code>/data/db</code>.
              </p>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.cyan }}>Azurite 3.26.0</div>
              <p style={infoCardText}>
                Blob service on port <strong>10010</strong>, Queue service on port <strong>10011</strong>.
                Emulates Azure Blob Storage for testing EDS TSV file downloads locally without cloud access.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="info" title="Build Argument: MODULE_NAME">
            Each of the 5 service images is built from the same Dockerfile using the <code>MODULE_NAME</code> build
            argument. The pipeline passes values like <code>routes</code>, <code>search</code>, <code>cron</code>,
            <code> consumer</code>, and <code>availability</code> to select which module's JAR to copy into the
            final image. This keeps the Dockerfile DRY while producing service-specific images.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 5: DEPLOYED SERVICES ============ */}
      <section id="services-deployed" style={sectionSpacing}>
        <SectionHeader
          label="Kubernetes"
          title="Deployed Services"
          description="The 5 independently deployable services running on AKS, their Helm chart types, and scaling configuration"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The Odyssey-Api monorepo produces 5 independently deployable services, each packaged as its own
            Docker image and deployed via Helm to Azure Kubernetes Service. The services fall into three
            categories based on their Helm chart type: <strong>api</strong> (HTTP services with ingress),
            <strong> headless</strong> (message consumers without ingress), and <strong>cron</strong>
            (scheduled job runners). Each service connects to MongoDB Atlas and may additionally consume
            Azure Service Bus messages or access Azure Blob Storage.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Deployed Services Architecture"
            tabs={[
              { label: 'Service Architecture', source: mermaidServicesArchitecture },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Service Details</h3>
          <DataTable
            headers={['Service Name', 'Module', 'Helm Chart', 'DEV Replicas', 'PROD Replicas', 'Auto-Scaling', 'External Access']}
            rows={[
              [
                <strong style={{ color: c.accent }}>odyssey-api</strong>,
                'routes',
                <span style={{ color: c.accent2 }}>api v5</span>,
                '1',
                '3',
                <span style={{ color: c.accent2 }}>3-12 @ 70% CPU</span>,
                <span>/shop/* endpoints</span>,
              ],
              [
                <strong style={{ color: c.accent3 }}>odyssey-consumer</strong>,
                'consumer',
                <span style={{ color: c.orange }}>headless v5</span>,
                '1',
                '3',
                <span style={{ color: c.accent2 }}>3-12 @ 70% CPU</span>,
                <span style={{ color: c.text3 }}>No ingress</span>,
              ],
              [
                <strong style={{ color: c.accent }}>odyssey-search-graphql</strong>,
                'search',
                <span style={{ color: c.accent2 }}>api v5</span>,
                '1',
                '3',
                <span style={{ color: c.accent2 }}>3-12 @ 70% CPU</span>,
                <span>/shop-graphql/* endpoints</span>,
              ],
              [
                <strong style={{ color: c.accent3 }}>odyssey-availability-sub</strong>,
                'availability',
                <span style={{ color: c.orange }}>headless v5</span>,
                '1',
                '3',
                <span style={{ color: c.accent2 }}>3-12 @ 70% CPU</span>,
                <span style={{ color: c.text3 }}>No ingress</span>,
              ],
              [
                <strong style={{ color: c.accent2 }}>odyssey-cron</strong>,
                'cron',
                <span style={{ color: c.pink }}>cron v5</span>,
                '1',
                '1',
                <span style={{ color: c.text3 }}>No</span>,
                <span style={{ color: c.text3 }}>No ingress</span>,
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="warning" title="Headless Services">
            The <code>odyssey-consumer</code> and <code>odyssey-availability-sub</code> services use the
            <strong> headless</strong> Helm chart type, meaning they have no Kubernetes Ingress or LoadBalancer
            Service. They operate purely as message consumers, processing messages from Azure Service Bus topics.
            They are not accessible via HTTP and do not appear in the service mesh routing table.
          </Callout>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Helm Chart Types</h3>
          <div style={cardGrid}>
            <div style={{ ...infoCard, borderTopColor: c.accent, borderTopWidth: 3 }}>
              <div style={{ ...infoCardTitle, color: c.accent }}>api v5</div>
              <p style={infoCardText}>
                Full HTTP service chart with Kubernetes Ingress, LoadBalancer Service, readiness/liveness probes,
                and HPA (Horizontal Pod Autoscaler) in production. Used by <code>odyssey-api</code> and
                <code> odyssey-search-graphql</code>. Configures mesh routing with custom hostnames.
              </p>
            </div>
            <div style={{ ...infoCard, borderTopColor: c.orange, borderTopWidth: 3 }}>
              <div style={{ ...infoCardTitle, color: c.orange }}>headless v5</div>
              <p style={infoCardText}>
                Stripped-down chart for message consumers. No Ingress, no LoadBalancer, no external routing.
                Includes readiness/liveness probes and HPA for production auto-scaling. Used by
                <code> odyssey-consumer</code> and <code>odyssey-availability-sub</code>.
              </p>
            </div>
            <div style={{ ...infoCard, borderTopColor: c.pink, borderTopWidth: 3 }}>
              <div style={{ ...infoCardTitle, color: c.pink }}>cron v5</div>
              <p style={infoCardText}>
                Specialized chart for the cron service. Single replica always, no auto-scaling, no Ingress.
                Configured with extended memory limits for large EDS import operations. Includes health
                check probes but no traffic routing.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 6: TERRAFORM ============ */}
      <section id="terraform" style={sectionSpacing}>
        <SectionHeader
          label="Infrastructure as Code"
          title="Terraform Infrastructure"
          description="All cloud resources managed through Terraform including MongoDB Atlas, Azure Service Bus, and monitoring"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            Terraform manages all environment-specific cloud resources as part of the pipeline. Each pipeline
            environment (DEV, UAT, PROD) maintains its own Terraform state file stored in an Azure Storage Account.
            The Terraform configuration provisions MongoDB Atlas search indexes, Azure Service Bus topics and
            subscriptions, and Azure Monitor scheduled query alert rules.
          </p>
          <p style={para}>
            The Terraform step runs as part of every pipeline execution, ensuring infrastructure changes are
            applied atomically alongside application code changes. This prevents infrastructure drift and ensures
            that search indexes, message bus configurations, and monitoring rules are always in sync with the
            application version being deployed.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Terraform-Managed Resources"
            tabs={[
              { label: 'Resource Map', source: mermaidTerraformResources },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Terraform State Storage</h3>
          <DataTable
            headers={['Environment', 'Storage Account', 'Resource Group', 'Container', 'State Key']}
            rows={[
              [
                <span style={{ color: c.accent2, fontWeight: 700 }}>DEV</span>,
                <code style={{ color: c.text }}>odysseydevtfstate</code>,
                'odyssey-dev-rg',
                'tfstate',
                'odyssey.dev.terraform.tfstate',
              ],
              [
                <span style={{ color: c.orange, fontWeight: 700 }}>UAT</span>,
                <code style={{ color: c.text }}>odysseyuattfstate</code>,
                'odyssey-uat-rg',
                'tfstate',
                'odyssey.uat.terraform.tfstate',
              ],
              [
                <span style={{ color: c.red, fontWeight: 700 }}>PROD</span>,
                <code style={{ color: c.text }}>odysseyprodtfstate</code>,
                'odyssey-prod-rg',
                'tfstate',
                'odyssey.prod.terraform.tfstate',
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Terraform Providers</h3>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.orange }}>MongoDB Atlas Provider</div>
              <p style={infoCardText}>
                Version <strong>1.7/1.8</strong>. Manages Atlas Search indexes on the <code>vehicleV3</code>,
                <code> searchSuggestion</code>, <code>vehicleTest</code>, and <code>vehicleSearchRelevancyTest</code>
                collections. The <code>shopSearch</code> index alone defines mappings for over 50 fields including
                nested objects, facets, and autocomplete analyzers.
              </p>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>Azure RM Provider</div>
              <p style={infoCardText}>
                Version <strong>3.20+</strong>. Manages Azure Service Bus namespace topics, subscriptions,
                and Azure Monitor scheduled query rules. Also manages Application Insights resources and
                the alert action groups for email notifications.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>MongoDB Atlas Search Indexes</h3>
          <DataTable
            headers={['Index Name', 'Collection', 'Fields', 'Purpose']}
            rows={[
              [
                <strong style={{ color: c.orange }}>shopSearch</strong>,
                'vehicleV3',
                '50+ mapped fields',
                'Primary search index powering /shop-graphql/ queries with facets, text search, geo, and autocomplete',
              ],
              [
                <strong style={{ color: c.orange }}>shopSuggestions</strong>,
                'searchSuggestion',
                'Autocomplete fields',
                'Powers the search suggestion/typeahead feature on Driveway.com',
              ],
              [
                <strong style={{ color: c.text2 }}>shopSearch (test)</strong>,
                'vehicleTest',
                'Mirror of shopSearch',
                'Used by integration tests to validate search behavior without affecting production data',
              ],
              [
                <strong style={{ color: c.text2 }}>shopSearch (relevancy)</strong>,
                'vehicleSearchRelevancyTest',
                'Mirror of shopSearch',
                'Used by relevancy tuning tests to evaluate scoring weight changes',
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Azure Service Bus Topics</h3>
          <DataTable
            headers={['Topic Name', 'TTL', 'Subscriptions', 'Publisher', 'Consumer']}
            rows={[
              [
                <code style={{ color: c.accent }}>inventory-delta-topic</code>,
                <strong>14 days</strong>,
                'F&I subscriber',
                'odyssey-cron',
                'F&I System (external)',
              ],
              [
                <code style={{ color: c.accent }}>leasing-incentives-topic</code>,
                <strong>2 days</strong>,
                'lease-consumer-sub',
                'Leasing Service (external)',
                'odyssey-consumer',
              ],
              [
                <code style={{ color: c.accent }}>cart-status-update-topic</code>,
                <strong>30 days</strong>,
                'vehicle-availability-subscriber-sub',
                'Cart Service (external)',
                'odyssey-availability-sub',
              ],
              [
                <code style={{ color: c.accent }}>vehicle-data-topic</code>,
                <strong>15 min</strong>,
                'vehicle-topic-search-subscriber-sub',
                'Multiple internal',
                'odyssey-search-graphql',
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="danger" title="Terraform State Locking">
            Terraform state is locked during pipeline execution to prevent concurrent modifications.
            If a pipeline is cancelled mid-run, the state lock may need to be manually released via
            <code> terraform force-unlock</code> before the next pipeline run can proceed. Always check
            the Terraform init step logs if a pipeline fails at the infrastructure stage.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 7: MONITORING ============ */}
      <section id="monitoring" style={sectionSpacing}>
        <SectionHeader
          label="Observability"
          title="Monitoring & Alerts"
          description="Azure Monitor scheduled query rules that watch for import failures and pipeline anomalies"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The Terraform configuration provisions Azure Monitor Scheduled Query Rules that continuously
            monitor the health of the Odyssey-Api system. These alerts query Application Insights telemetry
            data and trigger email notifications when anomalous conditions are detected. The alerts are
            designed to catch both complete outages (no imports for 8 hours) and partial failures (2 out of 3
            consecutive runs failing).
          </p>
          <p style={para}>
            All alerts are provisioned per-environment through Terraform, meaning DEV, UAT, and PROD each have
            their own independent alert configurations. Alert thresholds may differ between environments to
            reduce noise in non-production settings.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Alert Flow"
            tabs={[
              { label: 'Alert Pipeline', source: mermaidAlertFlow },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Alert Definitions</h3>
          <DataTable
            headers={['Alert Name', 'Trigger Condition', 'Evaluation Frequency', 'Window Size', 'Severity']}
            rows={[
              [
                <strong style={{ color: c.red }}>No Imports Alert</strong>,
                'Zero successful EDS imports in the last 8 hours',
                'Every 30 minutes',
                '8 hours',
                <span style={{ color: c.red }}>Sev 1 (Critical)</span>,
              ],
              [
                <strong style={{ color: c.orange }}>Long-Running Job Alert</strong>,
                'Any single cron job execution exceeds 1 hour',
                'Every 15 minutes',
                '1 hour',
                <span style={{ color: c.orange }}>Sev 2 (Warning)</span>,
              ],
              [
                <strong style={{ color: c.red }}>Consecutive Failures Alert</strong>,
                '2 out of 3 consecutive import runs have failed',
                'Every 30 minutes',
                '3 hours',
                <span style={{ color: c.red }}>Sev 1 (Critical)</span>,
              ],
              [
                <strong style={{ color: c.orange }}>Count Mismatch Alert</strong>,
                'Imported vehicle count differs from expected by more than 15,000',
                'Every 30 minutes',
                '2 hours',
                <span style={{ color: c.orange }}>Sev 2 (Warning)</span>,
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Alert Action Groups</h3>
          <p style={para}>
            When an alert fires, it triggers an Action Group that sends email notifications to the Odyssey
            engineering team. The action group is configured in Terraform and includes the team's distribution
            list. In production, critical alerts (Sev 1) also trigger PagerDuty integration for on-call
            notification.
          </p>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>Application Insights</div>
              <p style={infoCardText}>
                All services emit structured logs and custom telemetry to Application Insights. The Datadog
                Java agent (when enabled) provides additional APM traces. Custom events are logged for
                import starts, completions, vehicle counts, and error details.
              </p>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>Scheduled Query Rules</div>
              <p style={infoCardText}>
                KQL (Kusto Query Language) queries run on a schedule against Application Insights data.
                Each query evaluates a specific health condition and returns a count or threshold value
                that determines whether the alert should fire.
              </p>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.red }}>Email Notifications</div>
              <p style={infoCardText}>
                Alert emails include the query results, time window, and a direct link to the Application
                Insights portal for further investigation. PROD alerts additionally send to PagerDuty for
                immediate on-call response during business hours.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 8: HELM CONFIGURATION ============ */}
      <section id="helm-config" style={sectionSpacing}>
        <SectionHeader
          label="Kubernetes Orchestration"
          title="Helm Configuration"
          description="Environment-specific Helm values controlling replicas, scaling, mesh routing, and deployment behavior"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            Helm charts orchestrate the Kubernetes deployments for all 5 services. Each environment has
            distinct configuration values that control replica counts, auto-scaling thresholds, service mesh
            routing, and post-deployment validation. The charts use version 5 of the internal Helm chart
            library, which provides standardized templates for API services, headless consumers, and cron
            runners.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Environment Comparison</h3>
          <DataTable
            headers={['Aspect', 'DEV', 'UAT', 'PROD']}
            highlightColumn={3}
            rows={[
              [
                <strong style={{ color: c.text }}>Trigger</strong>,
                <span style={{ color: c.accent2 }}>Auto on main</span>,
                <span style={{ color: c.orange }}>Manual</span>,
                <span style={{ color: c.red }}>Manual + CR</span>,
              ],
              [
                <strong style={{ color: c.text }}>Container Registry</strong>,
                <code style={{ color: c.text2, fontSize: '0.8rem' }}>drivewaydevcontainerregistry</code>,
                <code style={{ color: c.text2, fontSize: '0.8rem' }}>drivewaydev</code>,
                <code style={{ color: c.text2, fontSize: '0.8rem' }}>drivewayprodcontainerregistry</code>,
              ],
              [
                <strong style={{ color: c.text }}>Replicas</strong>,
                '1',
                '3',
                '3',
              ],
              [
                <strong style={{ color: c.text }}>Auto-Scaling</strong>,
                <span style={{ color: c.text3 }}>No</span>,
                <span style={{ color: c.text3 }}>No</span>,
                <span style={{ color: c.accent2 }}>3-12 @ 70% CPU</span>,
              ],
              [
                <strong style={{ color: c.text }}>Mesh Hosts</strong>,
                <code style={{ color: c.cyan, fontSize: '0.8rem' }}>api-cluster.dev</code>,
                <code style={{ color: c.cyan, fontSize: '0.8rem' }}>api-cluster.uat</code>,
                <span><code style={{ color: c.cyan, fontSize: '0.8rem' }}>api-cluster.prod</code> + <code style={{ color: c.cyan, fontSize: '0.8rem' }}>.com</code></span>,
              ],
              [
                <strong style={{ color: c.text }}>Post-Deploy</strong>,
                'Smoke tests',
                'Smoke tests',
                <span style={{ color: c.red }}>CR approval only</span>,
              ],
              [
                <strong style={{ color: c.text }}>Agent Pool</strong>,
                'driveway-pipeline-agents',
                'driveway-pipeline-agents-uat',
                'driveway-pipeline-agents',
              ],
              [
                <strong style={{ color: c.text }}>Datadog APM</strong>,
                <span style={{ color: c.text3 }}>Disabled</span>,
                <span style={{ color: c.text3 }}>Disabled</span>,
                <span style={{ color: c.accent2 }}>Enabled</span>,
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Key Helm Values</h3>
          <CodeBlock
            language="yaml"
            filename="helm-values-prod.yaml (example)"
            showLineNumbers
            code={`# Production Helm values for odyssey-api
replicaCount: 3

image:
  repository: drivewayprodcontainerregistry.azurecr.io/odyssey-api
  tag: "$(Build.BuildId)"
  pullPolicy: Always

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 12
  targetCPUUtilizationPercentage: 70

resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 2000m
    memory: 4Gi

ingress:
  enabled: true
  hosts:
    - host: api-cluster.prod.driveway.com
      paths:
        - path: /shop
          pathType: Prefix

env:
  SPRING_PROFILES_ACTIVE: prod
  ENABLE_DATADOG_APM: "true"
  DD_SERVICE: odyssey-api
  DD_ENV: prod

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
          <Callout type="info" title="Helm Chart Version Strategy">
            All services use version 5 of the internal Helm chart library. The chart version is pinned in
            the pipeline definition and updated through a separate process. When a new chart version is
            released, all pipelines are updated simultaneously to ensure consistency. The chart version
            is independent of the application version (which uses the Build ID as its tag).
          </Callout>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Helm Deployment Command</h3>
          <p style={para}>
            The pipeline executes Helm upgrades for each service sequentially. Each command passes the
            image tag, secrets, and environment-specific values. The <code style={{ color: c.accent }}>--atomic</code> flag
            ensures that if any deployment fails, Helm automatically rolls back to the previous release.
          </p>
          <CodeBlock
            language="bash"
            filename="Pipeline deploy step (simplified)"
            code={`# Deploy odyssey-api to AKS
helm upgrade odyssey-api ./charts/api \\
  --install \\
  --atomic \\
  --timeout 10m \\
  --namespace odyssey \\
  --set image.tag=$(Build.BuildId) \\
  --set image.repository=$(containerRegistry)/odyssey-api \\
  --set secrets.mongoConnectionString=$(MONGO_CONNECTION_STRING) \\
  --set secrets.serviceBusConnectionString=$(SERVICE_BUS_CONNECTION_STRING) \\
  -f ./charts/api/values-$(environment).yaml`}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 9: SECRETS ============ */}
      <section id="secrets" style={sectionSpacing}>
        <SectionHeader
          label="Security"
          title="Secrets & Key Vaults"
          description="Azure Key Vault integration for secret injection into AKS pods via Helm values"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            Sensitive configuration values (database connection strings, service bus credentials, API keys)
            are stored in Azure Key Vaults and injected into the pipeline at deploy time. The pipeline uses
            Azure DevOps service connections to read secrets from Key Vaults, then passes them to Helm as
            <code style={{ color: c.accent }}> --set secrets.*</code> values, which are mounted as environment
            variables in the AKS pods. This approach keeps secrets out of source control and Terraform state.
          </p>
          <p style={para}>
            Each service has its own Key Vault (or shares one with related services), following the principle
            of least privilege. The 5 Key Vaults contain a total of approximately 20 secret values that are
            injected across the 5 services.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Secret Injection Flow"
            tabs={[
              { label: 'Secret Flow', source: mermaidSecretInjection },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Key Vault Inventory</h3>
          <DataTable
            headers={['Key Vault', 'Primary Service', 'Key Secrets']}
            rows={[
              [
                <strong style={{ color: c.accent3 }}>odyssey-cr-p-kv</strong>,
                'odyssey-cron',
                'MESSAGING_INVENTORY_DELTA_TOPIC_CONNECTION_STRING, MONGO_CONNECTION_STRING, AZURE_BLOB_CONNECTION_STRING',
              ],
              [
                <strong style={{ color: c.accent3 }}>dwmerchandis-kv</strong>,
                'odyssey-api, odyssey-search-graphql',
                'MONGO_CONNECTION_STRING, GRAPHQL_API_KEY, APPLICATION_INSIGHTS_KEY',
              ],
              [
                <strong style={{ color: c.accent3 }}>lease-cons-s-kv</strong>,
                'odyssey-consumer',
                'FINANCE_SERVICE_BUS_CONNECTION_STRING, MONGO_CONNECTION_STRING',
              ],
              [
                <strong style={{ color: c.accent3 }}>vehicle-search-s-kv</strong>,
                'odyssey-search-graphql',
                'SEARCH_SERVICE_BUS_CONNECTION_STRING, MONGO_CONNECTION_STRING, ATLAS_SEARCH_API_KEY',
              ],
              [
                <strong style={{ color: c.accent3 }}>vehicle-avail-s-kv</strong>,
                'odyssey-availability-sub',
                'VEHICLE_AVAILABILITY_SUBSCRIBER_CONNECTION_STRING, MONGO_CONNECTION_STRING',
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Secret Variables Reference</h3>
          <DataTable
            headers={['Variable Name', 'Source Key Vault', 'Used By', 'Description']}
            rows={[
              [
                <code style={{ color: c.cyan, fontSize: '0.8rem' }}>MESSAGING_INVENTORY_DELTA_TOPIC_CONNECTION_STRING</code>,
                'odyssey-cr-p-kv',
                'odyssey-cron',
                'Connection string for publishing inventory deltas to Service Bus',
              ],
              [
                <code style={{ color: c.cyan, fontSize: '0.8rem' }}>FINANCE_SERVICE_BUS_CONNECTION_STRING</code>,
                'lease-cons-s-kv',
                'odyssey-consumer',
                'Connection string for consuming leasing messages from Service Bus',
              ],
              [
                <code style={{ color: c.cyan, fontSize: '0.8rem' }}>VEHICLE_AVAILABILITY_SUBSCRIBER_CONNECTION_STRING</code>,
                'vehicle-avail-s-kv',
                'odyssey-availability-sub',
                'Connection string for consuming cart status messages from Service Bus',
              ],
              [
                <code style={{ color: c.cyan, fontSize: '0.8rem' }}>MONGO_CONNECTION_STRING</code>,
                'Multiple vaults',
                'All 5 services',
                'MongoDB Atlas connection string with authentication credentials',
              ],
              [
                <code style={{ color: c.cyan, fontSize: '0.8rem' }}>AZURE_BLOB_CONNECTION_STRING</code>,
                'odyssey-cr-p-kv',
                'odyssey-cron',
                'Azure Blob Storage connection for downloading EDS TSV files',
              ],
              [
                <code style={{ color: c.cyan, fontSize: '0.8rem' }}>SEARCH_SERVICE_BUS_CONNECTION_STRING</code>,
                'vehicle-search-s-kv',
                'odyssey-search-graphql',
                'Connection string for vehicle-data-topic subscription',
              ],
              [
                <code style={{ color: c.cyan, fontSize: '0.8rem' }}>APPLICATION_INSIGHTS_KEY</code>,
                'dwmerchandis-kv',
                'All 5 services',
                'Instrumentation key for Azure Application Insights telemetry',
              ],
              [
                <code style={{ color: c.cyan, fontSize: '0.8rem' }}>GRAPHQL_API_KEY</code>,
                'dwmerchandis-kv',
                'odyssey-api',
                'API key for authenticating GraphQL mutation requests',
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="danger" title="Secret Rotation">
            Key Vault secrets should be rotated according to the organization's security policy. When a
            secret is rotated in the Key Vault, the corresponding service(s) must be redeployed to pick
            up the new value. There is no automatic hot-reload of secrets in the current architecture.
            After rotating a secret, trigger the appropriate environment pipeline to propagate the change.
          </Callout>
        </motion.div>
      </section>

      {/* ============ SECTION 10: PR PIPELINE ============ */}
      <section id="pr-pipeline" style={sectionSpacing}>
        <SectionHeader
          label="Code Review"
          title="PR Validation"
          description="Automated pull request validation with ephemeral environment deployment"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The <code style={{ color: c.accent }}>pull-request-check.yml</code> pipeline is triggered automatically
            when a pull request is created against the <code style={{ color: c.accent }}>main</code> branch. It performs
            a comprehensive validation that goes beyond simple compilation: it builds all services, runs the full
            test suite with linting, applies Terraform against all environments (to validate infrastructure changes),
            and deploys an ephemeral instance of all 5 services accessible at a PR-specific hostname.
          </p>
          <p style={para}>
            The ephemeral deployment gives reviewers a live environment to test the changes before merging.
            Each PR gets a unique hostname following the pattern
            <code style={{ color: c.cyan }}> pr-N.api-dev.driveway.com</code> where N is the PR number. The
            ephemeral environment is automatically torn down when the PR is merged or closed.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="PR Validation Pipeline"
            tabs={[
              { label: 'PR Check Flow', source: mermaidPrPipeline },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>PR Pipeline Stages</h3>
          <div style={cardGrid}>
            <div style={{ ...infoCard, borderLeftColor: c.accent, borderLeftWidth: 3 }}>
              <div style={{ ...infoCardTitle, color: c.accent }}>1. Build</div>
              <p style={infoCardText}>
                Compiles all 9 Gradle modules using <code>./gradlew bootjar --parallel</code>. This stage
                catches compilation errors, missing dependencies, and Kotlin type errors before any deployment
                happens.
              </p>
            </div>
            <div style={{ ...infoCard, borderLeftColor: c.accent2, borderLeftWidth: 3 }}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>2. Test + Lint</div>
              <p style={infoCardText}>
                Runs the full unit test suite with <code>./gradlew test</code> and applies Ktlint formatting
                checks. Test results and coverage reports are published as pipeline artifacts for review.
              </p>
            </div>
            <div style={{ ...infoCard, borderLeftColor: c.accent3, borderLeftWidth: 3 }}>
              <div style={{ ...infoCardTitle, color: c.accent3 }}>3. Terraform Validate</div>
              <p style={infoCardText}>
                Applies Terraform changes against ALL environments (dev, uat, prod) in plan-only mode.
                This validates that any infrastructure changes in the PR are syntactically correct and
                would produce a valid plan across all environments.
              </p>
            </div>
            <div style={{ ...infoCard, borderLeftColor: c.pink, borderLeftWidth: 3 }}>
              <div style={{ ...infoCardTitle, color: c.pink }}>4. Ephemeral Deploy</div>
              <p style={infoCardText}>
                Deploys all 5 services to the DEV AKS cluster with a PR-specific namespace and hostname.
                The deployment uses the same Helm charts as production but with a single replica per service
                and the PR number embedded in the hostname.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="info" title="Ephemeral Environment Lifecycle">
            Ephemeral environments share the DEV MongoDB Atlas cluster and Service Bus namespace. They
            use separate Kubernetes namespaces (<code>odyssey-pr-N</code>) to isolate resources. The
            namespace and all its resources are automatically deleted when the PR is merged, closed,
            or abandoned. A cleanup cron job also runs daily to remove any orphaned PR namespaces.
          </Callout>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Ephemeral Deployment Configuration</h3>
          <CodeBlock
            language="yaml"
            filename="PR ephemeral deployment values"
            code={`# Ephemeral deployment overrides
namespace: odyssey-pr-$(System.PullRequest.PullRequestId)

replicaCount: 1

ingress:
  enabled: true
  hosts:
    - host: pr-$(System.PullRequest.PullRequestId).api-dev.driveway.com
      paths:
        - path: /shop
          pathType: Prefix

autoscaling:
  enabled: false

resources:
  requests:
    cpu: 250m
    memory: 512Mi
  limits:
    cpu: 1000m
    memory: 2Gi

env:
  SPRING_PROFILES_ACTIVE: dev
  ENABLE_DATADOG_APM: "false"`}
          />
        </motion.div>
      </section>

      {/* ============ SECTION 11: PERFORMANCE ============ */}
      <section id="performance" style={sectionSpacing}>
        <SectionHeader
          label="Load Testing"
          title="Performance Testing"
          description="K6 load testing pipeline for validating service performance under stress"
        />
        <motion.div {...fadeUp}>
          <p style={para}>
            The <code style={{ color: c.accent }}>performance.yaml</code> pipeline provides a standardized way to
            run K6 load tests against any environment. It is manually triggered and accepts parameters that control
            the target environment, ramp-up duration, sustained load duration, ramp-down duration, and the number
            of virtual users. Test results are collected and compared against predefined thresholds to determine
            pass/fail status.
          </p>
          <p style={para}>
            K6 scripts target the GraphQL search endpoints and REST API routes, simulating realistic user traffic
            patterns including search queries, vehicle detail lookups, and filter operations. The tests measure
            response time percentiles (p95, p99), error rates, and throughput (requests per second).
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer
            title="Performance Testing Pipeline"
            tabs={[
              { label: 'Performance Flow', source: mermaidPerformancePipeline },
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>K6 Test Parameters</h3>
          <DataTable
            headers={['Parameter', 'Type', 'Default', 'Description']}
            rows={[
              [
                <code style={{ color: c.accent }}>TARGET_ENV</code>,
                'Enum',
                'dev',
                'Target environment: dev, uat, or prod. Determines base URL and expected thresholds.',
              ],
              [
                <code style={{ color: c.accent }}>RAMP_UP_TIME</code>,
                'Duration',
                '2m',
                'Time to linearly ramp from 0 to target virtual user count.',
              ],
              [
                <code style={{ color: c.accent }}>MAINTAIN_TIME</code>,
                'Duration',
                '10m',
                'Duration to sustain the full virtual user load at steady state.',
              ],
              [
                <code style={{ color: c.accent }}>RAMP_DOWN_TIME</code>,
                'Duration',
                '1m',
                'Time to linearly ramp down from target VUs to 0.',
              ],
              [
                <code style={{ color: c.accent }}>VIRTUAL_USERS</code>,
                'Integer',
                '50',
                'Number of concurrent virtual users during the sustained phase.',
              ],
              [
                <code style={{ color: c.accent }}>THRESHOLDS_P95</code>,
                'Duration',
                '500ms',
                'Maximum acceptable p95 response time. Test fails if exceeded.',
              ],
              [
                <code style={{ color: c.accent }}>THRESHOLDS_P99</code>,
                'Duration',
                '2000ms',
                'Maximum acceptable p99 response time. Test fails if exceeded.',
              ],
              [
                <code style={{ color: c.accent }}>ERROR_RATE_THRESHOLD</code>,
                'Percentage',
                '1%',
                'Maximum acceptable error rate. Test fails if exceeded.',
              ],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>K6 Test Configuration</h3>
          <CodeBlock
            language="javascript"
            filename="k6-config.js (simplified)"
            showLineNumbers
            code={`import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: __ENV.RAMP_UP_TIME || '2m',   target: __ENV.VIRTUAL_USERS || 50 },
    { duration: __ENV.MAINTAIN_TIME || '10m',  target: __ENV.VIRTUAL_USERS || 50 },
    { duration: __ENV.RAMP_DOWN_TIME || '1m',  target: 0 },
  ],
  thresholds: {
    http_req_duration: [
      'p(95)<' + (__ENV.THRESHOLDS_P95 || '500'),
      'p(99)<' + (__ENV.THRESHOLDS_P99 || '2000'),
    ],
    http_req_failed: ['rate<' + (__ENV.ERROR_RATE_THRESHOLD || '0.01')],
  },
};

const BASE_URL = __ENV.TARGET_ENV === 'prod'
  ? 'https://api-cluster.prod.driveway.com'
  : \`https://api-cluster.\${__ENV.TARGET_ENV}.driveway.com\`;

export default function () {
  // Search query test
  const searchRes = http.post(\`\${BASE_URL}/shop-graphql/graphql\`, JSON.stringify({
    query: \`{
      search(input: { make: "Toyota", maxPrice: 35000 }) {
        vehicles { vin make model year price }
        totalCount
      }
    }\`,
  }), { headers: { 'Content-Type': 'application/json' } });

  check(searchRes, {
    'search status 200': (r) => r.status === 200,
    'search has vehicles': (r) => JSON.parse(r.body).data.search.totalCount > 0,
  });

  sleep(1);

  // Vehicle detail test
  const detailRes = http.get(\`\${BASE_URL}/shop/vehicles/sample-vin\`);
  check(detailRes, { 'detail status 200': (r) => r.status === 200 });

  sleep(0.5);
}`}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="warning" title="Performance Testing Best Practices">
            Always run performance tests against DEV or UAT first before targeting production. Production
            performance tests should only be run during off-peak hours and with coordination from the
            on-call team. The K6 test generates significant load and can impact real user traffic if
            not properly managed. Use the <code>VIRTUAL_USERS</code> parameter conservatively and
            monitor Application Insights during the test run.
          </Callout>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Performance Benchmarks</h3>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>Search Queries</div>
              <p style={infoCardText}>
                Target: <strong>p95 &lt; 500ms</strong>, p99 &lt; 2000ms. The GraphQL search endpoint
                should handle 200+ requests/second with Atlas Search aggregation pipelines. Search queries
                with facets are typically 20-30% slower than simple text searches.
              </p>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>REST Endpoints</div>
              <p style={infoCardText}>
                Target: <strong>p95 &lt; 200ms</strong>, p99 &lt; 500ms. The REST API endpoints serving
                vehicle details, cart operations, and admin functions should be significantly faster than
                search queries due to direct MongoDB lookups by VIN.
              </p>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.orange }}>Error Rate</div>
              <p style={infoCardText}>
                Target: <strong>&lt; 1% error rate</strong> under sustained load. Any errors above 1%
                indicate capacity issues (need more replicas), upstream timeouts (MongoDB or Service Bus),
                or application bugs that surface under concurrency.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={{ ...spacer, marginBottom: '4rem' }}>
          <div style={keyTakeaway}>
            <p style={{ ...para, marginBottom: 0, color: c.text }}>
              <strong>Summary:</strong> The Odyssey-Api pipeline infrastructure provides a robust, fully automated
              path from code commit to production deployment. With 8 pipeline definitions, Terraform-managed
              infrastructure, Helm-orchestrated Kubernetes deployments, and comprehensive monitoring, the system
              ensures reliability, traceability, and safety at every stage of the delivery process.
            </p>
          </div>
        </motion.div>
      </section>
    </>
  );
}
