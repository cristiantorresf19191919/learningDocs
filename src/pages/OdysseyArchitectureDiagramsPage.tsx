import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { useSidebar } from '../context/SidebarContext';
import SectionHeader from '../components/shared/SectionHeader';
import MermaidViewer from '../components/diagrams/MermaidViewer';
import Callout from '../components/shared/Callout';

import {
    highLevelArchitecture,
    moduleDependencyGraph,
    edsImportFlow,
    searchQueryFlow,
    serviceBusFlows,
    restApiFlows,
    imageSpinFlow,
    cicdPipeline,
    mongoCollections,
    vehicleLifecycle,
    springProfiles,
    cronScheduleOverview
} from '../diagrams/odysseyArchitectureDiagrams';

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
    accent2: '#10b981',
    accent3: '#8b5cf6',
    orange: '#f59e0b',
    red: '#ef4444',
    pink: '#ec4899',
    cyan: '#06b6d4'
} as const;

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */
const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 },
    transition: { duration: 0.5, ease: 'easeOut' as const }
};

const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, amount: 0.1 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
};

/* ------------------------------------------------------------------ */
/*  TOC data                                                           */
/* ------------------------------------------------------------------ */
const tocItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'system-architecture', label: 'System Architecture' },
    { id: 'module-deps', label: 'Module Dependencies' },
    { id: 'eds-import', label: 'EDS Import Flow' },
    { id: 'search-query', label: 'Search Query Flow' },
    { id: 'service-bus', label: 'Service Bus Flows' },
    { id: 'rest-api', label: 'REST API & Mutations' },
    { id: 'image-spin', label: 'Image & 360 Spin' },
    { id: 'cron-jobs', label: 'Cron Scheduled Jobs' },
    { id: 'cicd', label: 'CI/CD Pipeline' },
    { id: 'mongo-collections', label: 'MongoDB Collections' },
    { id: 'vehicle-lifecycle', label: 'Vehicle Lifecycle' },
    { id: 'spring-profiles', label: 'Spring Profiles' }
];

/* ------------------------------------------------------------------ */
/*  Diagram section data                                               */
/* ------------------------------------------------------------------ */
interface DiagramSection {
    id: string;
    title: string;
    description: string;
    color: string;
    icon: string;
    tabs: { label: string; source: string }[];
}

const sections: DiagramSection[] = [
    {
        id: 'system-architecture',
        title: 'High-Level System Architecture',
        description: 'All 5 Odyssey services, shared libraries, Azure infrastructure, and external API integrations in one view.',
        color: c.accent,
        icon: '1',
        tabs: [{ label: 'System Architecture', source: highLevelArchitecture }]
    },
    {
        id: 'module-deps',
        title: 'Module Dependency Graph',
        description: 'How the 9 Gradle subprojects depend on each other. All deployable modules share the library core.',
        color: c.accent2,
        icon: '2',
        tabs: [{ label: 'Dependencies', source: moduleDependencyGraph }]
    },
    {
        id: 'eds-import',
        title: 'EDS Vehicle Import Flow',
        description: 'The cron job that runs every 30 minutes: reads GZIP TSV from Azure Blob, stages to a temp collection, validates, merges to live, and publishes deltas.',
        color: c.orange,
        icon: '3',
        tabs: [{ label: 'Import Sequence', source: edsImportFlow }]
    },
    {
        id: 'search-query',
        title: 'GraphQL Search Query Flow',
        description: 'How a search request flows through Pipeline/Search/Filter builders into the custom aggregation DSL and hits MongoDB Atlas Search.',
        color: c.accent2,
        icon: '4',
        tabs: [{ label: 'Search Pipeline', source: searchQueryFlow }]
    },
    {
        id: 'service-bus',
        title: 'Azure Service Bus Message Flows',
        description: 'All 4 Service Bus topics with their publishers, subscribers, and downstream processors.',
        color: c.cyan,
        icon: '5',
        tabs: [{ label: 'Message Flows', source: serviceBusFlows }]
    },
    {
        id: 'rest-api',
        title: 'REST API & GraphQL Mutations',
        description: 'Routes module endpoints: Impel webhook, score weight CRUD, leasing NDJSON sink, and 5 GraphQL mutations.',
        color: c.accent,
        icon: '6',
        tabs: [{ label: 'REST & Mutations', source: restApiFlows }]
    },
    {
        id: 'image-spin',
        title: 'Vehicle Image & 360 Spin Flow',
        description: 'MaxDigital photo gallery retrieval via GraphQL and Impel/SpinCar webhook for 360-degree vehicle spins.',
        color: c.pink,
        icon: '7',
        tabs: [{ label: 'Image & Spin Sequence', source: imageSpinFlow }]
    },
    {
        id: 'cron-jobs',
        title: 'Cron Scheduled Jobs',
        description: 'All 5 background cron jobs with their schedules and responsibilities.',
        color: c.orange,
        icon: '8',
        tabs: [{ label: 'Job Schedule', source: cronScheduleOverview }]
    },
    {
        id: 'cicd',
        title: 'CI/CD Pipeline',
        description: 'Build, test, Docker, Terraform, Helm deploy, and smoke tests across DEV/UAT/PROD environments.',
        color: c.accent3,
        icon: '9',
        tabs: [{ label: 'Pipeline Flow', source: cicdPipeline }]
    },
    {
        id: 'mongo-collections',
        title: 'MongoDB Collection Relationships',
        description: 'ER diagram of the 5 primary collections in shopInventory and how they relate.',
        color: c.orange,
        icon: '10',
        tabs: [{ label: 'ER Diagram', source: mongoCollections }]
    },
    {
        id: 'vehicle-lifecycle',
        title: 'Vehicle Lifecycle State Diagram',
        description: 'A vehicle\u2019s journey from Blob upload through staging, validation, live collection states, enrichment, and search indexing.',
        color: c.red,
        icon: '11',
        tabs: [{ label: 'State Diagram', source: vehicleLifecycle }]
    },
    {
        id: 'spring-profiles',
        title: 'Spring Profile Configuration',
        description: 'Side-by-side comparison of the laptop local dev profile vs cloud deployment profiles.',
        color: c.accent2,
        icon: '12',
        tabs: [{ label: 'Profiles', source: springProfiles }]
    }
];

/* ------------------------------------------------------------------ */
/*  Quick-reference table data                                         */
/* ------------------------------------------------------------------ */
const serviceTable = [
    { service: 'routes', type: 'REST + GraphQL Mutations', helm: 'api (v5)', path: '/shop/' },
    { service: 'search', type: 'GraphQL Queries', helm: 'api (v5)', path: '/shop-graphql/' },
    { service: 'cron', type: 'Scheduled Jobs', helm: 'cron (v5)', path: 'N/A' },
    { service: 'consumer', type: 'Service Bus Listener', helm: 'headless (v5)', path: '/shop-consumer/' },
    { service: 'availability', type: 'Service Bus Listener', helm: 'headless (v5)', path: '/shop-availability-sub/' }
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function OdysseyArchitectureDiagramsPage() {
    const { setSidebar } = useSidebar();

    useEffect(() => {
        setSidebar('Architecture Diagrams', tocItems);
        return () => setSidebar('', []);
    }, []);

    return (
        <div style={styles.page}>
            {/* Hero */}
            <SectionHeader
                label="Odyssey-Api"
                title="Architecture Diagrams"
                description="12 interactive Mermaid diagrams visualizing every flow in the Odyssey backend platform."
                id="overview"
            />

            {/* Stats row */}
            <motion.div style={styles.statsRow} {...fadeUp}>
                {[
                    { value: '12', label: 'Diagrams', color: c.accent },
                    { value: '5', label: 'Services', color: c.accent2 },
                    { value: '4', label: 'Bus Topics', color: c.cyan },
                    { value: '5', label: 'Cron Jobs', color: c.orange }
                ].map((s, i) => (
                    <motion.div
                        key={s.label}
                        style={styles.statCard}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        whileHover={{ borderColor: s.color, boxShadow: `0 0 20px ${s.color}22` }}
                    >
                        <div style={{ ...styles.statValue, background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            {s.value}
                        </div>
                        <div style={styles.statLabel}>{s.label}</div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Services quick-reference */}
            <motion.div {...fadeUp} style={{ marginBottom: '2.5rem' }}>
                <Callout type="info" title="Deployed Services Quick Reference">
                    <div style={styles.tableWrap}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Service</th>
                                    <th style={styles.th}>Type</th>
                                    <th style={styles.th}>Helm Chart</th>
                                    <th style={styles.th}>Endpoint</th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviceTable.map((row) => (
                                    <tr key={row.service}>
                                        <td style={styles.td}>
                                            <span style={styles.serviceBadge}>{row.service}</span>
                                        </td>
                                        <td style={styles.td}>{row.type}</td>
                                        <td style={styles.td}><code style={styles.code}>{row.helm}</code></td>
                                        <td style={styles.td}><code style={styles.code}>{row.path}</code></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Callout>
            </motion.div>

            {/* Diagram sections */}
            {sections.map((section) => (
                <section key={section.id} id={section.id} style={styles.section}>
                    <motion.div {...fadeUp}>
                        <div style={styles.sectionHeader}>
                            <span style={{ ...styles.sectionNumber, background: `${section.color}20`, color: section.color, border: `1px solid ${section.color}40` }}>
                                {section.icon}
                            </span>
                            <div>
                                <h2 style={styles.sectionTitle}>{section.title}</h2>
                                <p style={styles.sectionDesc}>{section.description}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div {...scaleIn}>
                        <MermaidViewer tabs={section.tabs} title={section.title} />
                    </motion.div>
                </section>
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const styles = {
    page: {
        padding: '0 0 4rem 0',
        color: c.text
    } satisfies CSSProperties,

    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '0.75rem',
        margin: '0 0 2.5rem'
    } satisfies CSSProperties,

    statCard: {
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        padding: '1.5rem 1rem',
        textAlign: 'center' as const,
        transition: 'border-color 0.25s, box-shadow 0.25s'
    } satisfies CSSProperties,

    statValue: {
        fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
        fontWeight: 800,
        lineHeight: 1,
        marginBottom: '0.35rem'
    } satisfies CSSProperties,

    statLabel: {
        fontSize: '0.85rem',
        color: c.text2,
        fontWeight: 500
    } satisfies CSSProperties,

    section: {
        marginBottom: '3rem'
    } satisfies CSSProperties,

    sectionHeader: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        marginBottom: '1.25rem'
    } satisfies CSSProperties,

    sectionNumber: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: 10,
        fontSize: '0.85rem',
        fontWeight: 700,
        flexShrink: 0,
        marginTop: 2
    } satisfies CSSProperties,

    sectionTitle: {
        fontSize: '1.3rem',
        fontWeight: 700,
        margin: '0 0 0.35rem',
        color: c.text
    } satisfies CSSProperties,

    sectionDesc: {
        fontSize: '0.9rem',
        color: c.text2,
        lineHeight: 1.6,
        margin: 0
    } satisfies CSSProperties,

    tableWrap: {
        overflowX: 'auto' as const,
        marginTop: '0.75rem'
    } satisfies CSSProperties,

    table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        fontSize: '0.88rem'
    } satisfies CSSProperties,

    th: {
        textAlign: 'left' as const,
        padding: '0.6rem 0.85rem',
        borderBottom: `1px solid ${c.border}`,
        color: c.text2,
        fontWeight: 600,
        fontSize: '0.8rem',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.04em'
    } satisfies CSSProperties,

    td: {
        padding: '0.6rem 0.85rem',
        borderBottom: `1px solid ${c.border}`,
        color: c.text
    } satisfies CSSProperties,

    serviceBadge: {
        display: 'inline-block',
        padding: '0.2rem 0.6rem',
        borderRadius: 6,
        background: `${c.accent}18`,
        color: c.accent,
        fontWeight: 600,
        fontSize: '0.84rem'
    } satisfies CSSProperties,

    code: {
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '0.82rem',
        padding: '0.15rem 0.4rem',
        borderRadius: 4,
        background: c.surface2,
        color: c.text2
    } satisfies CSSProperties
};
