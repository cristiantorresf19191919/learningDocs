import type { Node, Edge } from '@xyflow/react';

/* ------------------------------------------------------------------ */
/*  fi-rate Decision Tree                                              */
/*  Decision flowchart using diamond nodes for branching logic.        */
/*  Vertical layout with "No" branches going right to error states.    */
/* ------------------------------------------------------------------ */

const X_MAIN = 200;       // Main (happy) path X position
const X_ERROR = 520;      // Error / rejection branch X position
const Y_GAP = 160;

export const nodes: Node[] = [
  /* ---------- start ------------------------------------------------ */
  {
    id: 'start',
    type: 'custom',
    position: { x: X_MAIN, y: 0 },
    data: {
      label: 'Odyssey adds/updates vehicle',
      category: 'START',
      color: '#3b82f6',
      description: 'Inventory event originating from Odyssey',
      dimmed: false,
    },
  },

  /* ---------- decision 1 ------------------------------------------- */
  {
    id: 'd-asb',
    type: 'decision',
    position: { x: X_MAIN + 40, y: Y_GAP },
    data: {
      label: 'Publishes to ASB?',
      color: '#f59e0b',
      dimmed: false,
    },
  },
  {
    id: 'err-no-asb',
    type: 'custom',
    position: { x: X_ERROR, y: Y_GAP },
    data: {
      label: 'No fi-rate entry',
      category: 'DEAD END',
      color: '#ef4444',
      description: 'Vehicle never reaches the pipeline',
      dimmed: false,
    },
  },

  /* ---------- decision 2 ------------------------------------------- */
  {
    id: 'd-delta',
    type: 'decision',
    position: { x: X_MAIN + 40, y: Y_GAP * 2 },
    data: {
      label: 'Delta receiver gets msg?',
      color: '#f59e0b',
      dimmed: false,
    },
  },
  {
    id: 'err-no-delta',
    type: 'custom',
    position: { x: X_ERROR, y: Y_GAP * 2 },
    data: {
      label: 'No fi-rate entry',
      category: 'DEAD END',
      color: '#ef4444',
      description: 'Message lost or filtered',
      dimmed: false,
    },
  },

  /* ---------- decision 3 ------------------------------------------- */
  {
    id: 'd-update-error',
    type: 'decision',
    position: { x: X_MAIN + 40, y: Y_GAP * 3 },
    data: {
      label: 'VIN UPDATE_ERROR?',
      color: '#f59e0b',
      dimmed: false,
    },
  },
  {
    id: 'err-perm-skip',
    type: 'custom',
    position: { x: X_ERROR, y: Y_GAP * 3 },
    data: {
      label: 'Permanently skipped',
      category: 'ERROR',
      color: '#ef4444',
      description: 'VIN marked as un-processable',
      dimmed: false,
    },
  },

  /* ---------- decision 4 ------------------------------------------- */
  {
    id: 'd-pen-dealer',
    type: 'decision',
    position: { x: X_MAIN + 40, y: Y_GAP * 4 },
    data: {
      label: 'PENDealer exists?',
      color: '#f59e0b',
      dimmed: false,
    },
  },
  {
    id: 'err-null-rates',
    type: 'custom',
    position: { x: X_ERROR, y: Y_GAP * 4 },
    data: {
      label: 'All rates null',
      category: 'FALLBACK',
      color: '#ef4444',
      description: 'No PEN dealer mapping found',
      dimmed: false,
    },
  },

  /* ---------- decision 5 ------------------------------------------- */
  {
    id: 'd-valid-coverages',
    type: 'decision',
    position: { x: X_MAIN + 40, y: Y_GAP * 5 },
    data: {
      label: 'PEN valid coverages?',
      color: '#f59e0b',
      dimmed: false,
    },
  },
  {
    id: 'err-no-coverages',
    type: 'custom',
    position: { x: X_ERROR, y: Y_GAP * 5 },
    data: {
      label: 'rateExist = false',
      category: 'WARNING',
      color: '#f59e0b',
      description: 'Rates flagged as non-existent',
      dimmed: false,
    },
  },

  /* ---------- success ---------------------------------------------- */
  {
    id: 'success',
    type: 'custom',
    position: { x: X_MAIN, y: Y_GAP * 6 },
    data: {
      label: 'fi-rate cached!',
      category: 'SUCCESS',
      color: '#10b981',
      description: 'Rate document persisted in MongoDB',
      dimmed: false,
    },
  },
];

/* ---------- edges ------------------------------------------------- */

export const edges: Edge[] = [
  /* happy path (top to bottom) */
  {
    id: 'e-start-asb',
    source: 'start',
    target: 'd-asb',
    type: 'custom',
    data: { label: '', color: '#3b82f6', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-asb-delta',
    source: 'd-asb',
    target: 'd-delta',
    type: 'custom',
    data: { label: 'Yes', color: '#10b981', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-delta-update',
    source: 'd-delta',
    target: 'd-update-error',
    type: 'custom',
    data: { label: 'Yes', color: '#10b981', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-update-pen',
    source: 'd-update-error',
    target: 'd-pen-dealer',
    type: 'custom',
    data: { label: 'No (OK)', color: '#10b981', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-pen-coverages',
    source: 'd-pen-dealer',
    target: 'd-valid-coverages',
    type: 'custom',
    data: { label: 'Yes', color: '#10b981', animated: true, dimmed: false },
    animated: true,
  },
  {
    id: 'e-coverages-success',
    source: 'd-valid-coverages',
    target: 'success',
    type: 'custom',
    data: { label: 'Yes', color: '#10b981', animated: true, dimmed: false },
    animated: true,
  },

  /* rejection branches (right side) */
  {
    id: 'e-asb-no',
    source: 'd-asb',
    target: 'err-no-asb',
    sourceHandle: 'right-source',
    type: 'custom',
    data: { label: 'No', color: '#ef4444', animated: false, dimmed: false },
    style: { strokeDasharray: '6 3' },
  },
  {
    id: 'e-delta-no',
    source: 'd-delta',
    target: 'err-no-delta',
    sourceHandle: 'right-source',
    type: 'custom',
    data: { label: 'No', color: '#ef4444', animated: false, dimmed: false },
    style: { strokeDasharray: '6 3' },
  },
  {
    id: 'e-update-yes',
    source: 'd-update-error',
    target: 'err-perm-skip',
    sourceHandle: 'right-source',
    type: 'custom',
    data: { label: 'Yes (error)', color: '#ef4444', animated: false, dimmed: false },
    style: { strokeDasharray: '6 3' },
  },
  {
    id: 'e-pen-no',
    source: 'd-pen-dealer',
    target: 'err-null-rates',
    sourceHandle: 'right-source',
    type: 'custom',
    data: { label: 'No', color: '#ef4444', animated: false, dimmed: false },
    style: { strokeDasharray: '6 3' },
  },
  {
    id: 'e-coverages-no',
    source: 'd-valid-coverages',
    target: 'err-no-coverages',
    sourceHandle: 'right-source',
    type: 'custom',
    data: { label: 'No', color: '#f59e0b', animated: false, dimmed: false },
    style: { strokeDasharray: '6 3' },
  },
];
