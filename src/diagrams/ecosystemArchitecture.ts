import type { Node, Edge } from '@xyflow/react';

/* ------------------------------------------------------------------ */
/*  Full Driveway Backend Ecosystem - Interactive ReactFlow Diagram     */
/*  Shows all backend services, frontends, databases, and connections.  */
/* ------------------------------------------------------------------ */

const COLORS = {
  frontend: '#10b981',   // green
  backend: '#3b82f6',    // blue
  database: '#f59e0b',   // yellow
  messaging: '#06b6d4',  // cyan
  external: '#8b5cf6',   // purple
  gateway: '#ec4899',    // pink
  shared: '#f97316',     // orange
};

/* ------------------------------------------------------------------ */
/*  NODES                                                               */
/* ------------------------------------------------------------------ */
export const ecosystemNodes: Node[] = [
  /* ---- API Gateway ---- */
  {
    id: 'api-gateway',
    type: 'custom',
    position: { x: 450, y: 0 },
    data: {
      label: 'API Gateway (APIM)',
      category: 'GATEWAY',
      color: COLORS.gateway,
      description: 'Azure API Management - Routes all traffic to backend services',
      dimmed: false,
    },
  },

  /* ---- Frontend Applications ---- */
  {
    id: 'driveway-ui',
    type: 'custom',
    position: { x: 150, y: -150 },
    data: {
      label: 'Driveway UI',
      category: 'FRONTEND',
      color: COLORS.frontend,
      description: 'Next.js 14 - B2C vehicle marketplace (driveway.com)',
      dimmed: false,
    },
  },
  {
    id: 'freeway-ui',
    type: 'custom',
    position: { x: 500, y: -150 },
    data: {
      label: 'Freeway UI',
      category: 'FRONTEND',
      color: COLORS.frontend,
      description: 'React CRA - Internal dealership CRM (freeway.driveway.com)',
      dimmed: false,
    },
  },
  {
    id: 'admin-ui',
    type: 'custom',
    position: { x: 850, y: -150 },
    data: {
      label: 'Dealerships Admin UI',
      category: 'FRONTEND',
      color: COLORS.frontend,
      description: 'Dealership configuration management UI',
      dimmed: false,
    },
  },

  /* ---- Core Backend Services ---- */
  {
    id: 'odyssey',
    type: 'custom',
    position: { x: 0, y: 200 },
    data: {
      label: 'Odyssey API',
      category: 'BACKEND',
      color: COLORS.backend,
      description: 'Kotlin/Spring Boot - Vehicle inventory & search (5 modules)',
      dimmed: false,
    },
  },
  {
    id: 'products-api',
    type: 'custom',
    position: { x: 300, y: 200 },
    data: {
      label: 'Products API',
      category: 'BACKEND',
      color: COLORS.backend,
      description: 'Kotlin/Spring Boot - F&I product pricing (3 modules)',
      dimmed: false,
    },
  },
  {
    id: 'cart-service',
    type: 'custom',
    position: { x: 600, y: 200 },
    data: {
      label: 'Cart Service',
      category: 'BACKEND',
      color: COLORS.backend,
      description: 'Kotlin/WebFlux/DGS - Shopping cart orchestration (GraphQL)',
      dimmed: false,
    },
  },
  {
    id: 'account-center',
    type: 'custom',
    position: { x: 900, y: 200 },
    data: {
      label: 'Account Center API',
      category: 'BACKEND',
      color: COLORS.backend,
      description: 'Kotlin/Spring Boot - User auth, profiles, saved searches',
      dimmed: false,
    },
  },

  /* ---- Supporting Backend Services ---- */
  {
    id: 'incentives',
    type: 'custom',
    position: { x: 0, y: 400 },
    data: {
      label: 'Incentives API',
      category: 'BACKEND',
      color: COLORS.backend,
      description: 'Kotlin/Spring Boot - New vehicle incentives & leasing (5 services)',
      dimmed: false,
    },
  },
  {
    id: 'taxes-fees',
    type: 'custom',
    position: { x: 300, y: 400 },
    data: {
      label: 'Taxes & Fees API',
      category: 'BACKEND',
      color: COLORS.backend,
      description: 'Kotlin/Spring Boot - Tax/fee calculations via Vitu',
      dimmed: false,
    },
  },
  {
    id: 'prequalification',
    type: 'custom',
    position: { x: 600, y: 400 },
    data: {
      label: 'Prequalification API',
      category: 'BACKEND',
      color: COLORS.backend,
      description: 'Kotlin/Spring Boot - Loan prequalification management',
      dimmed: false,
    },
  },
  {
    id: 'admin-api',
    type: 'custom',
    position: { x: 900, y: 400 },
    data: {
      label: 'Admin API (Libra)',
      category: 'BACKEND',
      color: COLORS.backend,
      description: 'Kotlin/Spring Boot - Dealership & configuration management',
      dimmed: false,
    },
  },

  /* ---- Additional Services ---- */
  {
    id: 'backpack',
    type: 'custom',
    position: { x: 0, y: 600 },
    data: {
      label: 'Backpack API',
      category: 'BACKEND',
      color: COLORS.backend,
      description: 'Kotlin/Spring Boot - Sell/trade-in flow',
      dimmed: false,
    },
  },
  {
    id: 'vehicle-service',
    type: 'custom',
    position: { x: 300, y: 600 },
    data: {
      label: 'Vehicle Service',
      category: 'BACKEND',
      color: COLORS.backend,
      description: 'Kotlin/Spring Boot - Vehicle domain (EDS to PostgreSQL)',
      dimmed: false,
    },
  },
  {
    id: 'salesforce-api',
    type: 'custom',
    position: { x: 600, y: 600 },
    data: {
      label: 'Salesforce Integration',
      category: 'BACKEND',
      color: COLORS.backend,
      description: 'Kotlin/Spring Boot - Salesforce gateway / pass-through',
      dimmed: false,
    },
  },
  {
    id: 'offer-api',
    type: 'custom',
    position: { x: 900, y: 600 },
    data: {
      label: 'Offer API',
      category: 'BACKEND',
      color: COLORS.backend,
      description: 'Kotlin/Spring Boot - Consolidated ico/vehicle-details/carfax',
      dimmed: false,
    },
  },

  /* ---- Azure Service Bus ---- */
  {
    id: 'asb',
    type: 'custom',
    position: { x: 150, y: 830 },
    data: {
      label: 'Azure Service Bus',
      category: 'MESSAGING',
      color: COLORS.messaging,
      description: 'inventory-delta-topic, leasing-incentives-topic, cart-status-update-topic',
      dimmed: false,
    },
  },

  /* ---- Databases ---- */
  {
    id: 'mongodb',
    type: 'database',
    position: { x: 500, y: 830 },
    data: {
      label: 'MongoDB Atlas',
      category: 'DATABASE',
      color: COLORS.database,
      description: 'shopInventory, products, cart, prequalification, backpack',
      dimmed: false,
    },
  },
  {
    id: 'postgresql',
    type: 'database',
    position: { x: 800, y: 830 },
    data: {
      label: 'PostgreSQL',
      category: 'DATABASE',
      color: COLORS.database,
      description: 'account_center, admin, incentives, vehicles',
      dimmed: false,
    },
  },

  /* ---- External Vendors ---- */
  {
    id: 'azure-blob',
    type: 'custom',
    position: { x: -200, y: 300 },
    data: {
      label: 'Azure Blob Storage',
      category: 'EXTERNAL',
      color: COLORS.external,
      description: 'EDS TSV files (vehicle inventory data)',
      dimmed: false,
    },
  },
  {
    id: 'pen-assurant',
    type: 'custom',
    position: { x: -200, y: 500 },
    data: {
      label: 'PEN / Assurant',
      category: 'EXTERNAL',
      color: COLORS.external,
      description: 'SOAP API - F&I product rate provider',
      dimmed: false,
    },
  },
  {
    id: 'auth0',
    type: 'custom',
    position: { x: 1150, y: 200 },
    data: {
      label: 'Auth0',
      category: 'EXTERNAL',
      color: COLORS.external,
      description: 'OAuth2 - User identity & authentication',
      dimmed: false,
    },
  },
  {
    id: 'cox-ais',
    type: 'custom',
    position: { x: -200, y: 700 },
    data: {
      label: 'Cox AIS API',
      category: 'EXTERNAL',
      color: COLORS.external,
      description: 'Vehicle incentives & leasing data',
      dimmed: false,
    },
  },
  {
    id: 'vitu',
    type: 'custom',
    position: { x: 1150, y: 400 },
    data: {
      label: 'Vitu',
      category: 'EXTERNAL',
      color: COLORS.external,
      description: 'Tax/fee/registration calculation engine',
      dimmed: false,
    },
  },
  {
    id: 'maxdigital',
    type: 'custom',
    position: { x: -200, y: 100 },
    data: {
      label: 'MaxDigital',
      category: 'EXTERNAL',
      color: COLORS.external,
      description: 'GraphQL API - Vehicle photo galleries',
      dimmed: false,
    },
  },
];

/* ------------------------------------------------------------------ */
/*  EDGES                                                               */
/* ------------------------------------------------------------------ */
export const ecosystemEdges: Edge[] = [
  /* ---- Frontend to Gateway ---- */
  {
    id: 'e-dui-gw',
    source: 'driveway-ui',
    target: 'api-gateway',
    type: 'custom',
    data: { label: 'REST/GraphQL', color: COLORS.frontend, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-fui-gw',
    source: 'freeway-ui',
    target: 'api-gateway',
    type: 'custom',
    data: { label: 'REST', color: COLORS.frontend, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-aui-admin',
    source: 'admin-ui',
    target: 'admin-api',
    type: 'custom',
    data: { label: 'REST', color: COLORS.frontend, animated: true, dimmed: false },
    animated: true,
  },

  /* ---- Gateway to Services ---- */
  {
    id: 'e-gw-ody',
    source: 'api-gateway',
    target: 'odyssey',
    type: 'custom',
    data: { label: '/shop/gql/v5', color: COLORS.gateway, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-gw-prod',
    source: 'api-gateway',
    target: 'products-api',
    type: 'custom',
    data: { label: '/products/v4', color: COLORS.gateway, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-gw-cart',
    source: 'api-gateway',
    target: 'cart-service',
    type: 'custom',
    data: { label: '/cart/v1', color: COLORS.gateway, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-gw-acc',
    source: 'api-gateway',
    target: 'account-center',
    type: 'custom',
    data: { label: '/account-center/v3', color: COLORS.gateway, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-gw-inc',
    source: 'api-gateway',
    target: 'incentives',
    type: 'custom',
    data: { label: '/incentives/v1', color: COLORS.gateway, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-gw-tax',
    source: 'api-gateway',
    target: 'taxes-fees',
    type: 'custom',
    data: { label: '/taxes-fees/v1', color: COLORS.gateway, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-gw-preq',
    source: 'api-gateway',
    target: 'prequalification',
    type: 'custom',
    data: { label: '/prequalification/v1', color: COLORS.gateway, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-gw-back',
    source: 'api-gateway',
    target: 'backpack',
    type: 'custom',
    data: { label: '/sell/v10', color: COLORS.gateway, animated: true, dimmed: false },
    animated: true,
  },

  /* ---- Service-to-Service (REST/GraphQL) ---- */
  {
    id: 'e-cart-prod',
    source: 'cart-service',
    target: 'products-api',
    type: 'custom',
    data: { label: 'F&I products', color: COLORS.backend, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-cart-ody',
    source: 'cart-service',
    target: 'odyssey',
    type: 'custom',
    data: { label: 'vehicle search', color: COLORS.backend, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-cart-tax',
    source: 'cart-service',
    target: 'taxes-fees',
    type: 'custom',
    data: { label: 'tax estimates', color: COLORS.backend, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-cart-preq',
    source: 'cart-service',
    target: 'prequalification',
    type: 'custom',
    data: { label: 'loan prequal', color: COLORS.backend, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-cart-inc',
    source: 'cart-service',
    target: 'incentives',
    type: 'custom',
    data: { label: 'incentive data', color: COLORS.backend, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-ody-admin',
    source: 'odyssey',
    target: 'admin-api',
    type: 'custom',
    data: { label: 'dealership data', color: COLORS.backend, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-prod-ody',
    source: 'products-api',
    target: 'odyssey',
    type: 'custom',
    data: { label: 'GraphQL search', color: COLORS.backend, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-preq-admin',
    source: 'prequalification',
    target: 'admin-api',
    type: 'custom',
    data: { label: 'dealer names', color: COLORS.backend, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-preq-tax',
    source: 'prequalification',
    target: 'taxes-fees',
    type: 'custom',
    data: { label: 'tax estimates', color: COLORS.backend, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-preq-veh',
    source: 'prequalification',
    target: 'vehicle-service',
    type: 'custom',
    data: { label: 'vehicle details', color: COLORS.backend, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-acc-prod',
    source: 'account-center',
    target: 'products-api',
    type: 'custom',
    data: { label: 'contracts', color: COLORS.backend, animated: true, dimmed: false },
    animated: true,
  },

  /* ---- External Integrations ---- */
  {
    id: 'e-ody-blob',
    source: 'azure-blob',
    target: 'odyssey',
    type: 'custom',
    data: { label: 'EDS TSV files', color: COLORS.external, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-prod-pen',
    source: 'products-api',
    target: 'pen-assurant',
    type: 'custom',
    data: { label: 'SOAP getASBRates', color: COLORS.external, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-acc-auth0',
    source: 'account-center',
    target: 'auth0',
    type: 'custom',
    data: { label: 'OAuth2', color: COLORS.external, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-inc-cox',
    source: 'incentives',
    target: 'cox-ais',
    type: 'custom',
    data: { label: 'incentives/leasing', color: COLORS.external, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-tax-vitu',
    source: 'taxes-fees',
    target: 'vitu',
    type: 'custom',
    data: { label: 'tax calculation', color: COLORS.external, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-ody-max',
    source: 'odyssey',
    target: 'maxdigital',
    type: 'custom',
    data: { label: 'vehicle photos', color: COLORS.external, animated: true, dimmed: false },
    animated: true,
  },

  /* ---- Azure Service Bus ---- */
  {
    id: 'e-ody-asb',
    source: 'odyssey',
    target: 'asb',
    type: 'custom',
    data: { label: 'inventory-delta-topic', color: COLORS.messaging, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-asb-prod',
    source: 'asb',
    target: 'products-api',
    type: 'custom',
    data: { label: 'delta-receiver', color: COLORS.messaging, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-asb-inc',
    source: 'asb',
    target: 'incentives',
    type: 'custom',
    data: { label: 'delta-receiver', color: COLORS.messaging, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-cart-asb',
    source: 'cart-service',
    target: 'asb',
    type: 'custom',
    data: { label: 'cart-status-update', color: COLORS.messaging, animated: true, dimmed: false },
    animated: true,
  },

  /* ---- Database Connections ---- */
  {
    id: 'e-ody-mongo',
    source: 'odyssey',
    target: 'mongodb',
    type: 'custom',
    data: { label: 'shopInventory', color: COLORS.database, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-prod-mongo',
    source: 'products-api',
    target: 'mongodb',
    type: 'custom',
    data: { label: 'products', color: COLORS.database, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-cart-mongo',
    source: 'cart-service',
    target: 'mongodb',
    type: 'custom',
    data: { label: 'cart', color: COLORS.database, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-preq-mongo',
    source: 'prequalification',
    target: 'mongodb',
    type: 'custom',
    data: { label: 'prequalification', color: COLORS.database, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-back-mongo',
    source: 'backpack',
    target: 'mongodb',
    type: 'custom',
    data: { label: 'backpack', color: COLORS.database, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-acc-pg',
    source: 'account-center',
    target: 'postgresql',
    type: 'custom',
    data: { label: 'account_center', color: COLORS.database, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-admin-pg',
    source: 'admin-api',
    target: 'postgresql',
    type: 'custom',
    data: { label: 'admin', color: COLORS.database, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-inc-pg',
    source: 'incentives',
    target: 'postgresql',
    type: 'custom',
    data: { label: 'incentives', color: COLORS.database, animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-veh-pg',
    source: 'vehicle-service',
    target: 'postgresql',
    type: 'custom',
    data: { label: 'vehicles', color: COLORS.database, animated: true, dimmed: false },
    animated: true,
  },
];
