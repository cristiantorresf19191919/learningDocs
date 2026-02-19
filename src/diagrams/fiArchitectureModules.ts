import type { Node, Edge } from '@xyflow/react';

/* ------------------------------------------------------------------ */
/*  F&I Architecture - Module Dependency Graph                         */
/*  Shows the 4 modules of Products-API and how they interact.         */
/* ------------------------------------------------------------------ */

export const nodes: Node[] = [
  {
    id: 'routes-module',
    type: 'custom',
    position: { x: 60, y: 0 },
    data: {
      label: 'Routes Module',
      category: 'HTTP LAYER',
      color: '#3b82f6',
      description: 'FIRoutes.kt / FIHandler.kt - HTTP endpoint definitions',
      dimmed: false,
    },
  },
  {
    id: 'library-module',
    type: 'custom',
    position: { x: 60, y: 200 },
    data: {
      label: 'Library Module',
      category: 'SHARED LOGIC',
      color: '#10b981',
      description: 'FIService.kt / PenMediator.kt - Core business logic',
      dimmed: false,
    },
  },
  {
    id: 'cron-module',
    type: 'custom',
    position: { x: 400, y: 0 },
    data: {
      label: 'Cron Module',
      category: 'SCHEDULED JOBS',
      color: '#ec4899',
      description: 'FIRateRefresh.kt / FIRateService.kt - Background refresh',
      dimmed: false,
    },
  },
  {
    id: 'delta-receiver',
    type: 'custom',
    position: { x: 400, y: 200 },
    data: {
      label: 'Inventory Delta Receiver',
      category: 'ASB CONSUMER',
      color: '#06b6d4',
      description: 'VehicleInventoryTopicReceiver.kt - ASB message consumer',
      dimmed: false,
    },
  },
  {
    id: 'mongodb',
    type: 'database',
    position: { x: 230, y: 400 },
    data: {
      label: 'MongoDB (fi-rate)',
      category: 'DATABASE',
      color: '#f59e0b',
      description: 'CachedFIProducts collection',
      dimmed: false,
    },
  },
  {
    id: 'pen-assurant',
    type: 'custom',
    position: { x: 500, y: 400 },
    data: {
      label: 'PEN / Assurant',
      category: 'EXTERNAL PROVIDER',
      color: '#8b5cf6',
      description: 'SOAP-based rate provider (getASBRates)',
      dimmed: false,
    },
  },
];

export const edges: Edge[] = [
  {
    id: 'e-routes-library',
    source: 'routes-module',
    target: 'library-module',
    type: 'custom',
    data: { label: 'delegates to', color: '#3b82f6', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-cron-library',
    source: 'cron-module',
    target: 'library-module',
    type: 'custom',
    data: { label: 'uses', color: '#ec4899', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-delta-library',
    source: 'delta-receiver',
    target: 'library-module',
    type: 'custom',
    data: { label: 'uses', color: '#06b6d4', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-library-mongo',
    source: 'library-module',
    target: 'mongodb',
    type: 'custom',
    data: { label: 'read/write cache', color: '#10b981', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-library-pen',
    source: 'library-module',
    target: 'pen-assurant',
    type: 'custom',
    data: { label: 'SOAP getASBRates', color: '#8b5cf6', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-cron-mongo',
    source: 'cron-module',
    target: 'mongodb',
    type: 'custom',
    data: { label: 'query stale docs', color: '#f59e0b', animated: true, dimmed: false },
    animated: true,
  },
];
