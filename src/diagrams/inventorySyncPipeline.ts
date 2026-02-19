import type { Node, Edge } from '@xyflow/react';

/* ------------------------------------------------------------------ */
/*  Inventory Sync Pipeline                                            */
/*  6-step vertical pipeline showing how inventory data flows from     */
/*  Odyssey through ASB into the fi-rate cache.                        */
/* ------------------------------------------------------------------ */

const X_CENTER = 200;
const Y_GAP = 160;

export const nodes: Node[] = [
  {
    id: 'odyssey-publish',
    type: 'custom',
    position: { x: X_CENTER, y: 0 },
    data: {
      label: 'Odyssey Publishes to ASB',
      category: 'EVENT SOURCE',
      color: '#06b6d4',
      description: 'Inventory add/update events pushed to Azure Service Bus',
      dimmed: false,
    },
  },
  {
    id: 'delta-receiver',
    type: 'custom',
    position: { x: X_CENTER, y: Y_GAP },
    data: {
      label: 'Delta Receiver Picks Up',
      category: 'CONSUMER',
      color: '#3b82f6',
      description: 'inventory-delta-receiver listens for ASB messages',
      dimmed: false,
    },
  },
  {
    id: 'pen-dealer-lookup',
    type: 'custom',
    position: { x: X_CENTER, y: Y_GAP * 2 },
    data: {
      label: 'PEN Dealer Lookup',
      category: 'EXTERNAL LOOKUP',
      color: '#8b5cf6',
      description: 'Resolve PENDealerId for the vehicle dealer',
      dimmed: false,
    },
  },
  {
    id: 'pen-soap',
    type: 'custom',
    position: { x: X_CENTER, y: Y_GAP * 3 },
    data: {
      label: 'PEN/Assurant SOAP Call',
      category: 'EXTERNAL PROVIDER',
      color: '#06b6d4',
      description: 'getASBRates SOAP request for vehicle coverages',
      dimmed: false,
    },
  },
  {
    id: 'fi-rate-create',
    type: 'custom',
    position: { x: X_CENTER, y: Y_GAP * 4 },
    data: {
      label: 'fi-rate Document Created',
      category: 'PERSISTENCE',
      color: '#10b981',
      description: 'MongoDB fi-rate document upserted with rate data',
      dimmed: false,
    },
  },
  {
    id: 'cron-refresh',
    type: 'custom',
    position: { x: X_CENTER, y: Y_GAP * 5 },
    data: {
      label: 'Cron Refreshes (every 5min)',
      category: 'SCHEDULED',
      color: '#f59e0b',
      description: 'Periodic job re-fetches stale rates from PEN',
      dimmed: false,
    },
  },
];

export const edges: Edge[] = [
  {
    id: 'e-odyssey-delta',
    source: 'odyssey-publish',
    target: 'delta-receiver',
    type: 'custom',
    data: { label: 'ASB message', color: '#06b6d4', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-delta-pen-dealer',
    source: 'delta-receiver',
    target: 'pen-dealer-lookup',
    type: 'custom',
    data: { label: 'resolve dealer', color: '#3b82f6', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-pen-dealer-soap',
    source: 'pen-dealer-lookup',
    target: 'pen-soap',
    type: 'custom',
    data: { label: 'SOAP getASBRates', color: '#8b5cf6', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-soap-firate',
    source: 'pen-soap',
    target: 'fi-rate-create',
    type: 'custom',
    data: { label: 'upsert fi-rate', color: '#06b6d4', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-firate-cron',
    source: 'fi-rate-create',
    target: 'cron-refresh',
    type: 'custom',
    data: { label: 'stale check', color: '#10b981', animated: true, dimmed: false },
    animated: true,
  },
];
