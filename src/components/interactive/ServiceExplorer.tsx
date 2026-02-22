import { useState, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  yellow: '#f59e0b',
  red: '#ef4444',
  cyan: '#06b6d4',
  pink: '#ec4899',
  orange: '#f97316',
  purple: '#8b5cf6',
} as const;

/* ------------------------------------------------------------------ */
/*  Service data type                                                   */
/* ------------------------------------------------------------------ */
export interface ServiceInfo {
  id: string;
  name: string;
  shortName: string;
  color: string;
  icon: string;
  language: string;
  framework: string;
  database: string;
  description: string;
  responsibilities: string[];
  endpoints: string[];
  integrations: string[];
  repo: string;
  modules?: string[];
}

/* ------------------------------------------------------------------ */
/*  All service data                                                    */
/* ------------------------------------------------------------------ */
export const services: ServiceInfo[] = [
  {
    id: 'odyssey',
    name: 'Odyssey API',
    shortName: 'Odyssey',
    color: c.accent,
    icon: '\u{1F30D}',
    language: 'Kotlin',
    framework: 'Spring Boot 3.4.3',
    database: 'MongoDB Atlas (shopInventory)',
    description:
      'The central vehicle inventory and search engine. Ingests EDS data, serves GraphQL search to the UI, and publishes inventory deltas to Azure Service Bus for downstream consumers.',
    responsibilities: [
      'EDS vehicle import (GZIP TSV from Azure Blob every 30 min)',
      'GraphQL search queries (search, getFacets, getSearchSuggestions, getVehicleByVin)',
      'Vehicle availability tracking (purchasePending flag)',
      'MaxDigital photo gallery integration',
      'Impel/SpinCar 360-degree spin integration',
      'Postal code OEM region sync from Incentives API',
      'Stale record cleanup and temp collection management',
      'Leasing data consumption from Azure Service Bus',
    ],
    endpoints: [
      'GraphQL /shop/gql/v5/graphql (search queries)',
      'GraphQL mutations (inventory management)',
      'GET /playground (GraphQL IDE)',
      'Cron triggers for EDS import, region sync, cleanup',
    ],
    integrations: [
      'Azure Blob Storage (EDS files)',
      'MaxDigital (GraphQL - photos)',
      'Impel/SpinCar (REST - 360 spins)',
      'Admin API / Libra (dealership data)',
      'Incentives API (OEM regions)',
      'Tax & Fee API (shipping costs)',
      'Azure Service Bus (publish inventory deltas)',
    ],
    repo: 'Odyssey-Api',
    modules: ['routes', 'search', 'cron', 'consumer', 'availability'],
  },
  {
    id: 'products',
    name: 'Products API',
    shortName: 'Products',
    color: c.green,
    icon: '\u{1F4B0}',
    language: 'Kotlin',
    framework: 'Spring Boot 3.5.7',
    database: 'MongoDB (products)',
    description:
      'Finance & Insurance product pricing engine. Serves F&I products (LOF, Valet, VSC, T&W, VLP) to the UI with MongoDB-cached PEN/Assurant rates and Lithia static products.',
    responsibilities: [
      'Serve F&I product pricing via REST API',
      'Cache PEN/Assurant SOAP rates in MongoDB (fi-rate collection)',
      'Refresh stale PEN rates every 5 minutes (cron)',
      'Process inventory delta events from Azure Service Bus',
      'Apply markup logic: VSC (+$1500), T&W (x2.2), VLP (fixed $1095)',
      'Handle Florida regulatory pricing exceptions',
    ],
    endpoints: [
      'GET /estimator/fi-products?vehicleId=&userZip=&userState=&paymentSelection=',
      'GET /test/fi-Rate/update-cached-markup (admin refresh)',
    ],
    integrations: [
      'PEN / Assurant (SOAP getASBRates)',
      'Odyssey (GraphQL vehicle search)',
      'Azure Service Bus (inventory-delta-receiver)',
    ],
    repo: 'Products-Api',
    modules: ['routes', 'inventory-delta-receiver', 'cron'],
  },
  {
    id: 'cart',
    name: 'Cart Service',
    shortName: 'Cart',
    color: c.pink,
    icon: '\u{1F6D2}',
    language: 'Kotlin',
    framework: 'Spring WebFlux + Netflix DGS',
    database: 'MongoDB (cart)',
    description:
      'Shopping cart orchestration hub. Manages the entire checkout flow using GraphQL mutations, coordinating with 8+ backend services for vehicle data, pricing, taxes, and financing.',
    responsibilities: [
      'Cart CRUD operations (GraphQL mutations)',
      'Vehicle reserve/release on cart state changes',
      'Orchestrate checkout with Products, Taxes, Prequalification, Incentives',
      'Publish cart-status-update to Azure Service Bus',
      'Abandoned cart cleanup (cron)',
      'Integration with Salesforce for intent publishing',
    ],
    endpoints: [
      'GraphQL /cart/v1 (mutations)',
      'Cron: cart cleanup (abandoned/timed out)',
    ],
    integrations: [
      'Account Center (user data)',
      'Odyssey (vehicle search)',
      'Products API (F&I products)',
      'Prequalification API (loan prequal)',
      'Incentives API (incentive data)',
      'Taxes & Fees API (tax calculations)',
      'Personalization API (recommendations)',
      'Contentful (CMS content)',
      'Azure Service Bus (cart-status-update-topic)',
    ],
    repo: 'cart-service',
    modules: ['service (API)', 'cron'],
  },
  {
    id: 'account',
    name: 'Account Center API',
    shortName: 'Account',
    color: c.cyan,
    icon: '\u{1F464}',
    language: 'Kotlin',
    framework: 'Spring Boot 2.7.3',
    database: 'PostgreSQL + Auth0',
    description:
      'User authentication and profile management. Proxies Auth0 for identity, manages saved searches, favorites, and addresses in PostgreSQL.',
    responsibilities: [
      'User signup/login via Auth0 proxy',
      'Saved searches CRUD (PostgreSQL)',
      'Favorites CRUD (PostgreSQL)',
      'Address management from Auth0',
      'Email verification via Emailable API',
      'Facebook compliance user deletion',
      'Vehicle contract retrieval from Products API',
    ],
    endpoints: [
      'POST /signup, GET/PATCH /user, GET /users',
      'POST /validations (email verification)',
      'CRUD /vehicles (my vehicles)',
      'CRUD /saved-searches',
      'CRUD /favorites',
      'GET /addresses',
      'DELETE /user/delete (Facebook compliance)',
    ],
    integrations: [
      'Auth0 (OAuth2 identity)',
      'Emailable (email verification)',
      'Products API (vehicle contracts)',
    ],
    repo: 'Account-Center-API',
  },
  {
    id: 'incentives',
    name: 'Incentives API',
    shortName: 'Incentives',
    color: c.orange,
    icon: '\u{1F3AF}',
    language: 'Kotlin',
    framework: 'Spring Boot',
    database: 'PostgreSQL',
    description:
      'New vehicle purchase incentives and leasing data pipeline. Syncs from Cox AIS API, caches in PostgreSQL, and publishes to Azure Service Bus for Odyssey consumption.',
    responsibilities: [
      'Sync Cox AIS region data to PostgreSQL (cron)',
      'Sync Cox AIS incentives/leasing data (cron)',
      'Publish cached incentives to Azure Service Bus (cron)',
      'Process inventory delta events from Odyssey',
      'Serve incentive/leasing data via REST API',
    ],
    endpoints: [
      'GET /triggers/inventory-init',
      'GET /test/cron/region-sync',
      'GET /test/cron/incentives-sync',
      'GET /test/cron/incentives-publisher',
    ],
    integrations: [
      'Cox AIS API (incentives & leasing)',
      'Odyssey (vehicle inventory)',
      'Azure Service Bus (leasing-incentives-topic)',
    ],
    repo: 'Incentives-API',
    modules: ['routes', 'inventory-delta-receiver', 'region-sync', 'incentives-sync', 'incentives-publisher'],
  },
  {
    id: 'taxes',
    name: 'Taxes & Fees API',
    shortName: 'Taxes',
    color: c.yellow,
    icon: '\u{1F4CA}',
    language: 'Kotlin',
    framework: 'Spring Boot',
    database: 'Vitu (external)',
    description:
      'Tax, fee, and registration cost calculation service. Provides estimates for shopping cart and detailed transactions for Freeway CRM via the Vitu integration.',
    responsibilities: [
      'Calculate state, county, city, local taxes',
      'Provide shipping cost estimates',
      'Generate tax estimates for cart (less detailed)',
      'Process transactions for Freeway CRM (detailed, pushed to Vitu)',
    ],
    endpoints: [
      'GET/POST /taxes-fees (estimates)',
      'GET/POST /transactions (Freeway CRM)',
    ],
    integrations: [
      'Vitu (tax/fee calculation engine)',
    ],
    repo: 'Taxes-And-Fees-API',
  },
  {
    id: 'prequalification',
    name: 'Prequalification API',
    shortName: 'Prequal',
    color: c.purple,
    icon: '\u{1F4B3}',
    language: 'Kotlin',
    framework: 'Spring Boot',
    database: 'MongoDB',
    description:
      'Loan prequalification management. Handles global and vehicle-specific prequalifications by coordinating with Equifax, DFC, FinCo, and Salesforce.',
    responsibilities: [
      'Global loan prequalification (finance eligibility)',
      'Vehicle-specific prequalification (full deal details)',
      'Credit score retrieval from Equifax',
      'Eligibility determination via DFC',
      'Recaptcha validation via Google',
      'Feature flag control via Optimizely',
      'Lead creation in Salesforce',
    ],
    endpoints: [
      'POST /global-loan-prequalifications',
      'POST /vehicle-loan-prequalifications',
      'GET /loan-prequalifications (auth required)',
      'GET /internal/loan-prequalifications',
      'PATCH /loan-prequalifications',
    ],
    integrations: [
      'Equifax (credit score)',
      'DFC (financing eligibility)',
      'FinCo (DFC refinement)',
      'Salesforce (lead follow-up)',
      'Google (Recaptcha)',
      'Optimizely (feature flags)',
      'Address Service, Vehicle Service, Incentives, Admin, Tax & Fee',
    ],
    repo: 'Prequalification-API',
  },
  {
    id: 'admin',
    name: 'Admin API (Libra)',
    shortName: 'Admin',
    color: '#ef4444',
    icon: '\u{2699}\u{FE0F}',
    language: 'Kotlin',
    framework: 'Spring Boot 3.x',
    database: 'PostgreSQL',
    description:
      'Dealership and configuration management. Provides read-only internal API for backend services and full CRUD Dealer Admin API for the admin UI.',
    responsibilities: [
      'Manage dealership data (names, states, zones, regions)',
      'Free-shipping zone configuration',
      'Dealer configuration and metadata',
      'Serve dealership info to Odyssey, Cart, Prequalification',
    ],
    endpoints: [
      'GET /admin/v5/dealerships (read-only, internal)',
      'CRUD /dealer-admin/v1/* (Dealer Admin API)',
    ],
    integrations: [
      'Consumed by: Odyssey, Cart Service, Prequalification, Account Center',
    ],
    repo: 'Admin-API',
  },
  {
    id: 'backpack',
    name: 'Backpack API (Sell)',
    shortName: 'Backpack',
    color: '#14b8a6',
    icon: '\u{1F697}',
    language: 'Kotlin',
    framework: 'Spring Boot',
    database: 'MongoDB (sell-flow)',
    description:
      'Backend for the Lithia sell/trade-in flow. Manages vehicle inspections, offer generation, and appointment scheduling.',
    responsibilities: [
      'Vehicle inspection management',
      'Trade-in offer generation',
      'Third-party API sync (TimeTap appointments)',
      'YMMT (year/make/model/trim) data',
    ],
    endpoints: [
      'REST /sell/v10/* (sell flow routes)',
      'Cron: sync jobs',
    ],
    integrations: [
      'TimeTap (appointment booking)',
      'MongoDB (inspections, savedOffers, ymmt)',
    ],
    repo: 'BackPack',
    modules: ['routes', 'cron'],
  },
  {
    id: 'vehicle-service',
    name: 'Vehicle Service',
    shortName: 'Vehicle Svc',
    color: '#6366f1',
    icon: '\u{1F698}',
    language: 'Kotlin',
    framework: 'Spring Boot',
    database: 'PostgreSQL',
    description:
      'Vehicle domain service for internal systems. Receives data from Midas team via EDS and Azure Data Factory into PostgreSQL.',
    responsibilities: [
      'Serve vehicle details to internal Driveway systems',
      'Maintain EDS-sourced vehicle data in PostgreSQL',
    ],
    endpoints: [
      'Internal vehicle detail endpoints',
    ],
    integrations: [
      'Midas Team (EDS data via Azure Data Factory)',
      'Consumed by: Prequalification API',
    ],
    repo: 'vehicle-service',
  },
  {
    id: 'salesforce',
    name: 'Salesforce Integration',
    shortName: 'Salesforce',
    color: '#0ea5e9',
    icon: '\u{2601}\u{FE0F}',
    language: 'Kotlin',
    framework: 'Spring Boot',
    database: 'Pass-through',
    description:
      'Gateway/pass-through service for Salesforce CRM integrations. Routes data from multiple services to Salesforce for lead management.',
    responsibilities: [
      'Gateway for Salesforce API calls',
      'Lead creation and management',
      'DCC pipeline integration',
    ],
    endpoints: [
      '/salesforce/v2/* (pass-through routes)',
    ],
    integrations: [
      'Salesforce CRM',
      'Multiple internal services',
    ],
    repo: 'Salesforce-Integration-API',
  },
  {
    id: 'offer',
    name: 'Offer API',
    shortName: 'Offer',
    color: '#a855f7',
    icon: '\u{1F4DD}',
    language: 'Kotlin',
    framework: 'Spring Boot',
    database: 'MongoDB (replacing Redis & Snowflake)',
    description:
      'Consolidated API replacing three legacy services (ico-api, vehicle-details-api, carfax-api). Simplifies architecture from 3 to 1 deployable.',
    responsibilities: [
      'Vehicle offer management (consolidated from ico-api)',
      'Vehicle details (consolidated from vehicle-details-api)',
      'Carfax data (consolidated from carfax-api)',
      'Improved status codes and testing standards',
    ],
    endpoints: [
      'Offer management endpoints (replacing 3 legacy APIs)',
    ],
    integrations: [
      'MongoDB (replacing Redis & Snowflake)',
    ],
    repo: 'offer-api',
  },
];

/* ------------------------------------------------------------------ */
/*  Styles                                                              */
/* ------------------------------------------------------------------ */
const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const filterBar: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  padding: '1rem',
  background: c.surface,
  borderRadius: 12,
  border: `1px solid ${c.border}`,
  marginBottom: '0.5rem',
};

const filterBtnBase: CSSProperties = {
  padding: '6px 14px',
  fontSize: '0.78rem',
  fontWeight: 600,
  borderRadius: 8,
  border: `1px solid ${c.border}`,
  background: 'transparent',
  color: c.text2,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const serviceCard = (color: string, isExpanded: boolean): CSSProperties => ({
  background: c.surface,
  border: `1px solid ${isExpanded ? color : c.border}`,
  borderLeft: `4px solid ${color}`,
  borderRadius: 14,
  overflow: 'hidden',
  transition: 'border-color 0.3s, box-shadow 0.3s',
  boxShadow: isExpanded ? `0 0 20px ${color}15` : 'none',
});

const cardHeader: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '1.25rem 1.5rem',
  cursor: 'pointer',
  userSelect: 'none',
};

const iconBox = (color: string): CSSProperties => ({
  width: 44,
  height: 44,
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `${color}15`,
  fontSize: '1.3rem',
  flexShrink: 0,
});

const nameStyle: CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: c.text,
  margin: 0,
};

const descBrief: CSSProperties = {
  fontSize: '0.82rem',
  color: c.text2,
  lineHeight: 1.5,
  margin: '2px 0 0',
};

const techBadge = (color: string): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '3px 10px',
  borderRadius: 6,
  background: `${color}12`,
  border: `1px solid ${color}30`,
  color,
  fontSize: '0.72rem',
  fontWeight: 600,
  whiteSpace: 'nowrap',
});

const expandedBody: CSSProperties = {
  padding: '0 1.5rem 1.5rem',
  borderTop: `1px solid ${c.border}`,
};

const detailGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1rem',
  marginTop: '1rem',
};

const detailSection: CSSProperties = {
  background: c.surface2,
  borderRadius: 10,
  padding: '1rem',
  border: `1px solid ${c.border}`,
};

const detailTitle: CSSProperties = {
  fontSize: '0.78rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: c.accent,
  marginBottom: '0.6rem',
};

const detailItem: CSSProperties = {
  fontSize: '0.82rem',
  color: c.text2,
  lineHeight: 1.7,
  padding: '2px 0',
  display: 'flex',
  alignItems: 'flex-start',
  gap: 6,
};

const chevronStyle = (open: boolean): CSSProperties => ({
  display: 'inline-block',
  transition: 'transform 0.3s ease',
  transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
  color: c.text3,
  fontSize: '0.85rem',
  marginLeft: 'auto',
  flexShrink: 0,
});

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
type FilterType = 'all' | 'core' | 'supporting' | 'mongodb' | 'postgresql';

const coreIds = ['odyssey', 'products', 'cart', 'account'];
const mongoIds = ['odyssey', 'products', 'cart', 'prequalification', 'backpack', 'offer'];
const pgIds = ['account', 'admin', 'incentives', 'vehicle-service'];

export default function ServiceExplorer() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredServices = services.filter((svc) => {
    if (filter === 'all') return true;
    if (filter === 'core') return coreIds.includes(svc.id);
    if (filter === 'supporting') return !coreIds.includes(svc.id);
    if (filter === 'mongodb') return mongoIds.includes(svc.id);
    if (filter === 'postgresql') return pgIds.includes(svc.id);
    return true;
  });

  const filters: { label: string; value: FilterType; color: string }[] = [
    { label: 'All Services', value: 'all', color: c.accent },
    { label: 'Core (4)', value: 'core', color: c.green },
    { label: 'Supporting', value: 'supporting', color: c.orange },
    { label: 'MongoDB', value: 'mongodb', color: c.yellow },
    { label: 'PostgreSQL', value: 'postgresql', color: c.cyan },
  ];

  return (
    <div style={containerStyle}>
      {/* Filter bar */}
      <div style={filterBar}>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: c.text3, alignSelf: 'center', marginRight: 4 }}>
          Filter:
        </span>
        {filters.map((f) => (
          <button
            key={f.value}
            style={{
              ...filterBtnBase,
              ...(filter === f.value
                ? { borderColor: f.color, color: f.color, background: `${f.color}12` }
                : {}),
            }}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Service cards */}
      {filteredServices.map((svc) => {
        const isExpanded = expanded === svc.id;
        return (
          <motion.div
            key={svc.id}
            style={serviceCard(svc.color, isExpanded)}
            layout
            whileHover={!isExpanded ? { borderColor: svc.color, boxShadow: `0 2px 16px ${svc.color}12` } : undefined}
          >
            <div style={cardHeader} onClick={() => setExpanded(isExpanded ? null : svc.id)}>
              <div style={iconBox(svc.color)}>{svc.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={nameStyle}>{svc.name}</h4>
                <p style={descBrief}>{svc.language} / {svc.framework} / {svc.database}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {svc.modules && (
                  <span style={techBadge(svc.color)}>{svc.modules.length} modules</span>
                )}
                <span style={techBadge(c.text3)}>{svc.repo}</span>
              </div>
              <span style={chevronStyle(isExpanded)}>&#9654;</span>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={expandedBody}>
                    {/* Description */}
                    <p style={{ fontSize: '0.88rem', color: c.text2, lineHeight: 1.75, margin: '1rem 0' }}>
                      {svc.description}
                    </p>

                    {/* Modules */}
                    {svc.modules && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        {svc.modules.map((m) => (
                          <span key={m} style={techBadge(svc.color)}>{m}</span>
                        ))}
                      </div>
                    )}

                    <div style={detailGrid}>
                      {/* Responsibilities */}
                      <div style={detailSection}>
                        <div style={detailTitle}>Responsibilities</div>
                        {svc.responsibilities.map((r, i) => (
                          <div key={i} style={detailItem}>
                            <span style={{ color: c.green, fontWeight: 700, flexShrink: 0 }}>&#10003;</span>
                            {r}
                          </div>
                        ))}
                      </div>

                      {/* Endpoints */}
                      <div style={detailSection}>
                        <div style={detailTitle}>Key Endpoints</div>
                        {svc.endpoints.map((ep, i) => (
                          <div key={i} style={detailItem}>
                            <span style={{ color: c.accent, fontWeight: 700, flexShrink: 0 }}>&rsaquo;</span>
                            <code style={{
                              fontFamily: "'SF Mono', 'Fira Code', monospace",
                              fontSize: '0.78rem',
                              color: c.text2,
                              wordBreak: 'break-all',
                            }}>
                              {ep}
                            </code>
                          </div>
                        ))}
                      </div>

                      {/* Integrations */}
                      <div style={detailSection}>
                        <div style={detailTitle}>Integrations</div>
                        {svc.integrations.map((intg, i) => (
                          <div key={i} style={detailItem}>
                            <span style={{ color: c.purple, fontWeight: 700, flexShrink: 0 }}>&bull;</span>
                            {intg}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
