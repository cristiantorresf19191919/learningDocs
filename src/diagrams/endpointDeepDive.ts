import type { Node, Edge } from '@xyflow/react';

/* ------------------------------------------------------------------ */
/*  fi-products Endpoint Deep Dive                                     */
/*  7-step internal flow  --  vertical top-to-bottom layout            */
/* ------------------------------------------------------------------ */

const X_CENTER = 200;
const Y_GAP = 160;

export const nodes: Node[] = [
  {
    id: 'handler',
    type: 'custom',
    position: { x: X_CENTER, y: 0 },
    data: {
      label: 'FIHandler.getEstimatedFIProducts()',
      category: 'HANDLER',
      color: '#3b82f6',
      description: 'Express route handler entry-point',
      dimmed: false,
    },
  },
  {
    id: 'determine-types',
    type: 'custom',
    position: { x: X_CENTER, y: Y_GAP },
    data: {
      label: 'FIService - Determine Product Types',
      category: 'SERVICE',
      color: '#10b981',
      description: 'Maps dealer config to FI product categories',
      dimmed: false,
    },
  },
  {
    id: 'graphql-vehicle',
    type: 'custom',
    position: { x: X_CENTER, y: Y_GAP * 2 },
    data: {
      label: 'GraphQLVehicleInventoryService',
      category: 'SERVICE',
      color: '#8b5cf6',
      description: 'Calls Odyssey for vehicle inventory data',
      dimmed: false,
    },
  },
  {
    id: 'merge-products',
    type: 'custom',
    position: { x: X_CENTER, y: Y_GAP * 3 },
    data: {
      label: 'FIService.getFIProducts()',
      category: 'SERVICE',
      color: '#06b6d4',
      description: 'Merge Lithia + PEN product results',
      dimmed: false,
    },
  },
  {
    id: 'pen-cache',
    type: 'custom',
    position: { x: X_CENTER, y: Y_GAP * 4 },
    data: {
      label: 'getPenProducts()',
      category: 'CACHE',
      color: '#f59e0b',
      description: 'fi-rate cache lookup by VIN',
      dimmed: false,
    },
  },
  {
    id: 'cache-decision',
    type: 'decision',
    position: { x: X_CENTER + 40, y: Y_GAP * 5 },
    data: {
      label: 'Cache Hit / Miss',
      color: '#ec4899',
      dimmed: false,
    },
  },
  {
    id: 'response',
    type: 'custom',
    position: { x: X_CENTER, y: Y_GAP * 6 },
    data: {
      label: 'Response Assembled & Returned',
      category: 'RESPONSE',
      color: '#10b981',
      description: 'Final JSON payload sent to client',
      dimmed: false,
    },
  },
];

export const edges: Edge[] = [
  {
    id: 'e-handler-types',
    source: 'handler',
    target: 'determine-types',
    type: 'custom',
    data: { label: 'resolve product types', color: '#3b82f6', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-types-graphql',
    source: 'determine-types',
    target: 'graphql-vehicle',
    type: 'custom',
    data: { label: 'fetch vehicle data', color: '#10b981', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-graphql-merge',
    source: 'graphql-vehicle',
    target: 'merge-products',
    type: 'custom',
    data: { label: 'vehicle + dealer context', color: '#8b5cf6', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-merge-pen',
    source: 'merge-products',
    target: 'pen-cache',
    type: 'custom',
    data: { label: 'lookup PEN rates', color: '#06b6d4', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-pen-decision',
    source: 'pen-cache',
    target: 'cache-decision',
    type: 'custom',
    data: { label: 'check fi-rate doc', color: '#f59e0b', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-decision-response',
    source: 'cache-decision',
    target: 'response',
    type: 'custom',
    data: { label: 'assemble payload', color: '#ec4899', animated: true, dimmed: false },
    animated: true,
  },
];
