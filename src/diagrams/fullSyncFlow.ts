import type { Node, Edge } from '@xyflow/react';

/* ------------------------------------------------------------------ */
/*  Full EDS -> Odyssey -> Products-Api Sync Flow                      */
/*  15-node centerpiece diagram.                                       */
/*  Layout: left-to-right with two main pipelines:                     */
/*    Top row    : Shop pipeline  (UI -> APIs -> CRM)                  */
/*    Bottom row : fi-rate pipeline (ASB -> receiver -> cache)         */
/* ------------------------------------------------------------------ */

/*
 *  Rough column layout (left to right):
 *
 *  Col 0 (x=0)    : EDS
 *  Col 1 (x=280)  : Odyssey
 *  Col 2 (x=560)  : Azure Service Bus / odyssey-search-graphql
 *  Col 3 (x=840)  : inventory-delta-receiver / Products-Api
 *  Col 4 (x=1120) : PEN / fi-rate (MongoDB) / UIs
 *  Col 5 (x=1400) : Taxes / Cart / Dealer Lead
 *  Col 6 (x=1680) : Salesforce
 */

export const nodes: Node[] = [
  /* ---- Col 0 ---- */
  {
    id: 'eds',
    type: 'custom',
    position: { x: 0, y: 200 },
    data: {
      label: 'EDS',
      category: 'EXTERNAL DATA SOURCE',
      color: '#f97316',
      description: 'External Data Source providing dealer inventory',
      dimmed: false,
    },
  },

  /* ---- Col 1 ---- */
  {
    id: 'odyssey',
    type: 'custom',
    position: { x: 280, y: 200 },
    data: {
      label: 'Odyssey',
      category: 'INVENTORY SYSTEM',
      color: '#06b6d4',
      description: 'Central inventory management platform',
      dimmed: false,
    },
  },

  /* ---- Col 2 ---- */
  {
    id: 'asb',
    type: 'custom',
    position: { x: 560, y: 340 },
    data: {
      label: 'Azure Service Bus',
      category: 'MESSAGE BROKER',
      color: '#3b82f6',
      description: 'Async event bus for inventory deltas',
      dimmed: false,
    },
  },
  {
    id: 'odyssey-graphql',
    type: 'custom',
    position: { x: 560, y: 60 },
    data: {
      label: 'odyssey-search-graphql',
      category: 'QUERY SERVICE',
      color: '#06b6d4',
      description: 'GraphQL gateway for inventory queries',
      dimmed: false,
    },
  },

  /* ---- Col 3 ---- */
  {
    id: 'delta-receiver',
    type: 'custom',
    position: { x: 840, y: 340 },
    data: {
      label: 'inventory-delta-receiver',
      category: 'CONSUMER',
      color: '#3b82f6',
      description: 'Listens to ASB and triggers rate refresh',
      dimmed: false,
    },
  },
  {
    id: 'products-api',
    type: 'custom',
    position: { x: 840, y: 60 },
    data: {
      label: 'Products-Api',
      category: 'BACKEND API',
      color: '#3b82f6',
      description: 'F&I product estimation service',
      dimmed: false,
    },
  },

  /* ---- Col 4 ---- */
  {
    id: 'pen',
    type: 'custom',
    position: { x: 1120, y: 340 },
    data: {
      label: 'PEN/Assurant',
      category: 'EXTERNAL PROVIDER',
      color: '#8b5cf6',
      description: 'SOAP rate provider',
      dimmed: false,
    },
  },
  {
    id: 'fi-rate',
    type: 'database',
    position: { x: 1120, y: 500 },
    data: {
      label: 'fi-rate (MongoDB)',
      category: 'DATABASE',
      color: '#f59e0b',
      description: 'Cached rate documents',
      dimmed: false,
    },
  },
  {
    id: 'cron',
    type: 'custom',
    position: { x: 1120, y: 180 },
    data: {
      label: 'Cron Job',
      category: 'SCHEDULED',
      color: '#ec4899',
      description: 'Periodic rate refresh every 5 min',
      dimmed: false,
    },
  },
  {
    id: 'ui-shop',
    type: 'custom',
    position: { x: 1120, y: -80 },
    data: {
      label: 'UI (Shop/SRP)',
      category: 'FRONTEND',
      color: '#10b981',
      description: 'Search results & shop pages',
      dimmed: false,
    },
  },
  {
    id: 'ui-vdp',
    type: 'custom',
    position: { x: 1120, y: 60 },
    data: {
      label: 'UI (VDP)',
      category: 'FRONTEND',
      color: '#10b981',
      description: 'Vehicle detail page',
      dimmed: false,
    },
  },

  /* ---- Col 5 ---- */
  {
    id: 'taxes-api',
    type: 'custom',
    position: { x: 1400, y: -80 },
    data: {
      label: 'Taxes-And-Fees-API',
      category: 'BACKEND API',
      color: '#10b981',
      description: 'Tax & fee calculations',
      dimmed: false,
    },
  },
  {
    id: 'cart',
    type: 'custom',
    position: { x: 1400, y: 60 },
    data: {
      label: 'Cart Service',
      category: 'BACKEND SERVICE',
      color: '#8b5cf6',
      description: 'Shopping cart & purchase intents',
      dimmed: false,
    },
  },
  {
    id: 'dealer-lead',
    type: 'custom',
    position: { x: 1400, y: 200 },
    data: {
      label: 'Dealer Lead API',
      category: 'BACKEND API',
      color: '#8b5cf6',
      description: 'F&I lead submissions',
      dimmed: false,
    },
  },

  /* ---- Col 6 ---- */
  {
    id: 'salesforce',
    type: 'custom',
    position: { x: 1680, y: 60 },
    data: {
      label: 'Salesforce',
      category: 'EXTERNAL CRM',
      color: '#ec4899',
      description: 'CRM & deal management',
      dimmed: false,
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Edges                                                              */
/* ------------------------------------------------------------------ */

export const edges: Edge[] = [
  /* ---- Data ingestion pipeline ---- */
  {
    id: 'e-eds-odyssey',
    source: 'eds',
    target: 'odyssey',
    type: 'custom',
    data: { label: 'inventory feed', color: '#f97316', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-odyssey-asb',
    source: 'odyssey',
    target: 'asb',
    type: 'custom',
    data: { label: 'publish deltas', color: '#06b6d4', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-odyssey-graphql',
    source: 'odyssey',
    target: 'odyssey-graphql',
    type: 'custom',
    data: { label: 'index data', color: '#06b6d4', animated: true, dimmed: false },
    animated: true,
  },

  /* ---- fi-rate pipeline (bottom) ---- */
  {
    id: 'e-asb-delta',
    source: 'asb',
    target: 'delta-receiver',
    type: 'custom',
    data: { label: 'ASB message', color: '#3b82f6', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-delta-pen',
    source: 'delta-receiver',
    target: 'pen',
    type: 'custom',
    data: { label: 'SOAP getASBRates', color: '#8b5cf6', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-delta-firate',
    source: 'delta-receiver',
    target: 'fi-rate',
    type: 'custom',
    data: { label: 'upsert fi-rate', color: '#f59e0b', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-pen-firate',
    source: 'pen',
    target: 'fi-rate',
    type: 'custom',
    data: { label: 'rate data', color: '#8b5cf6', animated: true, dimmed: false },
    animated: true,
  },

  /* ---- Cron refresh ---- */
  {
    id: 'e-cron-pen',
    source: 'cron',
    target: 'pen',
    type: 'custom',
    data: { label: 'refresh stale rates', color: '#ec4899', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-cron-firate',
    source: 'cron',
    target: 'fi-rate',
    type: 'custom',
    data: { label: 'update cache', color: '#ec4899', animated: true, dimmed: false },
    animated: true,
  },

  /* ---- Shop pipeline (top) ---- */
  {
    id: 'e-graphql-products',
    source: 'odyssey-graphql',
    target: 'products-api',
    type: 'custom',
    data: { label: 'vehicle data', color: '#06b6d4', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-products-firate',
    source: 'products-api',
    target: 'fi-rate',
    type: 'custom',
    data: { label: 'findByVin()', color: '#f59e0b', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-ui-shop-products',
    source: 'ui-shop',
    target: 'products-api',
    type: 'custom',
    data: { label: 'GET /estimator/fi-products', color: '#10b981', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-ui-vdp-products',
    source: 'ui-vdp',
    target: 'products-api',
    type: 'custom',
    data: { label: 'GET /estimator/fi-products', color: '#10b981', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-ui-shop-taxes',
    source: 'ui-shop',
    target: 'taxes-api',
    type: 'custom',
    data: { label: 'POST /taxes-fees/v1', color: '#10b981', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-ui-vdp-cart',
    source: 'ui-vdp',
    target: 'cart',
    type: 'custom',
    data: { label: 'cart operations', color: '#8b5cf6', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-ui-vdp-dealer-lead',
    source: 'ui-vdp',
    target: 'dealer-lead',
    type: 'custom',
    data: { label: 'POST /fni-leads', color: '#8b5cf6', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-cart-salesforce',
    source: 'cart',
    target: 'salesforce',
    type: 'custom',
    data: { label: 'Shop/Finance Intents', color: '#ec4899', animated: true, dimmed: false },
    animated: true,
  },
];
