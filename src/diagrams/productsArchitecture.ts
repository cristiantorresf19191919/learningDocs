import type { Node, Edge } from '@xyflow/react';

/* ------------------------------------------------------------------ */
/*  Products-Api System Architecture                                   */
/* ------------------------------------------------------------------ */

export const nodes: Node[] = [
  {
    id: 'ui',
    type: 'custom',
    position: { x: 60, y: 0 },
    data: {
      label: 'UI (React)',
      category: 'FRONTEND',
      color: '#10b981',
      description: 'Shop / SRP / VDP pages',
      dimmed: false,
    },
  },
  {
    id: 'products-api',
    type: 'custom',
    position: { x: 60, y: 180 },
    data: {
      label: 'Products-Api',
      category: 'BACKEND API',
      color: '#3b82f6',
      description: 'F&I product estimation service',
      dimmed: false,
    },
  },
  {
    id: 'taxes-api',
    type: 'custom',
    position: { x: 340, y: 0 },
    data: {
      label: 'Taxes-And-Fees-API',
      category: 'BACKEND API',
      color: '#10b981',
      description: 'Tax & fee calculations',
      dimmed: false,
    },
  },
  {
    id: 'dealer-lead-api',
    type: 'custom',
    position: { x: 600, y: 0 },
    data: {
      label: 'Dealer Lead API',
      category: 'BACKEND API',
      color: '#8b5cf6',
      description: 'F&I lead submission',
      dimmed: false,
    },
  },
  {
    id: 'pen',
    type: 'custom',
    position: { x: 340, y: 180 },
    data: {
      label: 'PEN/Assurant',
      category: 'EXTERNAL PROVIDER',
      color: '#06b6d4',
      description: 'SOAP-based rate provider',
      dimmed: false,
    },
  },
  {
    id: 'mongodb',
    type: 'database',
    position: { x: 60, y: 380 },
    data: {
      label: 'MongoDB (fi-rate)',
      category: 'DATABASE',
      color: '#f59e0b',
      description: 'Cached rate documents',
      dimmed: false,
    },
  },
  {
    id: 'cron',
    type: 'custom',
    position: { x: 340, y: 380 },
    data: {
      label: 'Cron + Delta Receiver',
      category: 'SCHEDULED',
      color: '#f59e0b',
      description: 'Background sync jobs',
      dimmed: false,
    },
  },
  {
    id: 'cart',
    type: 'custom',
    position: { x: 600, y: 180 },
    data: {
      label: 'Cart Service',
      category: 'BACKEND SERVICE',
      color: '#8b5cf6',
      description: 'Shopping cart & intents',
      dimmed: false,
    },
  },
  {
    id: 'salesforce',
    type: 'custom',
    position: { x: 600, y: 380 },
    data: {
      label: 'Salesforce',
      category: 'EXTERNAL CRM',
      color: '#ec4899',
      description: 'CRM & deal management',
      dimmed: false,
    },
  },
];

export const edges: Edge[] = [
  {
    id: 'e-ui-products',
    source: 'ui',
    target: 'products-api',
    type: 'custom',
    data: { label: 'GET /estimator/fi-products', color: '#3b82f6', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-ui-taxes',
    source: 'ui',
    target: 'taxes-api',
    type: 'custom',
    data: { label: 'POST /taxes-fees/v1', color: '#10b981', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-ui-dealer-lead',
    source: 'ui',
    target: 'dealer-lead-api',
    type: 'custom',
    data: { label: 'POST /fni-leads', color: '#8b5cf6', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-products-pen',
    source: 'products-api',
    target: 'pen',
    type: 'custom',
    data: { label: 'SOAP getASBRates', color: '#06b6d4', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-products-mongo',
    source: 'products-api',
    target: 'mongodb',
    type: 'custom',
    data: { label: 'findByVin()', color: '#f59e0b', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-cron-pen',
    source: 'cron',
    target: 'pen',
    type: 'custom',
    data: { label: 'refresh rates', color: '#06b6d4', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-cron-mongo',
    source: 'cron',
    target: 'mongodb',
    type: 'custom',
    data: { label: 'update cache', color: '#f59e0b', animated: true, dimmed: false },
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
  {
    id: 'e-ui-cart',
    source: 'ui',
    target: 'cart',
    type: 'custom',
    data: { label: 'cart operations', color: '#8b5cf6', animated: true, dimmed: false },
    animated: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Flow filters                                                       */
/* ------------------------------------------------------------------ */

export type FlowName = 'pricing' | 'tax' | 'quote' | 'salesforce' | 'cache';

export const flowFilters: Record<FlowName, { nodes: string[]; edges: string[] }> = {
  pricing: {
    nodes: ['ui', 'products-api', 'pen', 'mongodb'],
    edges: ['e-ui-products', 'e-products-pen', 'e-products-mongo'],
  },
  tax: {
    nodes: ['ui', 'taxes-api'],
    edges: ['e-ui-taxes'],
  },
  quote: {
    nodes: ['ui', 'products-api', 'pen', 'mongodb', 'dealer-lead-api'],
    edges: ['e-ui-products', 'e-products-pen', 'e-products-mongo', 'e-ui-dealer-lead'],
  },
  salesforce: {
    nodes: ['ui', 'cart', 'salesforce'],
    edges: ['e-ui-cart', 'e-cart-salesforce'],
  },
  cache: {
    nodes: ['cron', 'pen', 'mongodb'],
    edges: ['e-cron-pen', 'e-cron-mongo'],
  },
};
