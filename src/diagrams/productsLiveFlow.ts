import type { Node, Edge } from '@xyflow/react';

/* ------------------------------------------------------------------ */
/*  Products-Api System Architecture  --  Live Flow variant            */
/*  Each node/edge carries a `flows` array so the UI can highlight     */
/*  one flow at a time using applyFlowFilter().                        */
/* ------------------------------------------------------------------ */

export type FlowName = 'pricing' | 'tax' | 'quote' | 'salesforce' | 'cache';

/* ---------- nodes ------------------------------------------------- */

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
      flows: ['pricing', 'tax', 'quote', 'salesforce'] as FlowName[],
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
      flows: ['pricing', 'quote'] as FlowName[],
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
      flows: ['tax'] as FlowName[],
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
      flows: ['quote'] as FlowName[],
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
      flows: ['pricing', 'quote', 'cache'] as FlowName[],
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
      flows: ['pricing', 'quote', 'cache'] as FlowName[],
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
      flows: ['cache'] as FlowName[],
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
      flows: ['salesforce'] as FlowName[],
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
      flows: ['salesforce'] as FlowName[],
    },
  },
];

/* ---------- edges ------------------------------------------------- */

export const edges: Edge[] = [
  {
    id: 'e-ui-products',
    source: 'ui',
    target: 'products-api',
    type: 'custom',
    data: {
      label: 'GET /estimator/fi-products',
      color: '#3b82f6',
      animated: true,
      dimmed: false,
      flows: ['pricing', 'quote'] as FlowName[],
    },
    animated: true,
  },
  {
    id: 'e-ui-taxes',
    source: 'ui',
    target: 'taxes-api',
    type: 'custom',
    data: {
      label: 'POST /taxes-fees/v1',
      color: '#10b981',
      animated: true,
      dimmed: false,
      flows: ['tax'] as FlowName[],
    },
    animated: true,
  },
  {
    id: 'e-ui-dealer-lead',
    source: 'ui',
    target: 'dealer-lead-api',
    type: 'custom',
    data: {
      label: 'POST /fni-leads',
      color: '#8b5cf6',
      animated: true,
      dimmed: false,
      flows: ['quote'] as FlowName[],
    },
    animated: true,
  },
  {
    id: 'e-products-pen',
    source: 'products-api',
    target: 'pen',
    type: 'custom',
    data: {
      label: 'SOAP getASBRates',
      color: '#06b6d4',
      animated: true,
      dimmed: false,
      flows: ['pricing', 'quote'] as FlowName[],
    },
    animated: true,
  },
  {
    id: 'e-products-mongo',
    source: 'products-api',
    target: 'mongodb',
    type: 'custom',
    data: {
      label: 'findByVin()',
      color: '#f59e0b',
      animated: true,
      dimmed: false,
      flows: ['pricing', 'quote'] as FlowName[],
    },
    animated: true,
  },
  {
    id: 'e-cron-pen',
    source: 'cron',
    target: 'pen',
    type: 'custom',
    data: {
      label: 'refresh rates',
      color: '#06b6d4',
      animated: true,
      dimmed: false,
      flows: ['cache'] as FlowName[],
    },
    animated: true,
  },
  {
    id: 'e-cron-mongo',
    source: 'cron',
    target: 'mongodb',
    type: 'custom',
    data: {
      label: 'update cache',
      color: '#f59e0b',
      animated: true,
      dimmed: false,
      flows: ['cache'] as FlowName[],
    },
    animated: true,
  },
  {
    id: 'e-cart-salesforce',
    source: 'cart',
    target: 'salesforce',
    type: 'custom',
    data: {
      label: 'Shop/Finance Intents',
      color: '#ec4899',
      animated: true,
      dimmed: false,
      flows: ['salesforce'] as FlowName[],
    },
    animated: true,
  },
  {
    id: 'e-ui-cart',
    source: 'ui',
    target: 'cart',
    type: 'custom',
    data: {
      label: 'cart operations',
      color: '#8b5cf6',
      animated: true,
      dimmed: false,
      flows: ['salesforce'] as FlowName[],
    },
    animated: true,
  },
];

/* ------------------------------------------------------------------ */
/*  applyFlowFilter                                                    */
/*  Returns deep copies of nodes & edges with `dimmed` set on          */
/*  elements that do NOT participate in the given flow.                 */
/*  Pass `null` to reset (nothing dimmed).                             */
/* ------------------------------------------------------------------ */

export function applyFlowFilter(
  sourceNodes: Node[],
  sourceEdges: Edge[],
  flow: FlowName | null,
): { nodes: Node[]; edges: Edge[] } {
  if (flow === null) {
    return {
      nodes: sourceNodes.map((n) => ({
        ...n,
        data: { ...n.data, dimmed: false },
      })),
      edges: sourceEdges.map((e) => ({
        ...e,
        data: { ...e.data, dimmed: false },
      })),
    };
  }

  return {
    nodes: sourceNodes.map((n) => {
      const flows = (n.data.flows as FlowName[] | undefined) ?? [];
      const inFlow = flows.includes(flow);
      return {
        ...n,
        data: { ...n.data, dimmed: !inFlow },
      };
    }),
    edges: sourceEdges.map((e) => {
      const flows = ((e.data as Record<string, unknown> | undefined)?.flows as FlowName[] | undefined) ?? [];
      const inFlow = flows.includes(flow);
      return {
        ...e,
        data: { ...e.data, dimmed: !inFlow },
      };
    }),
  };
}
