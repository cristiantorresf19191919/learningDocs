import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CSSProperties } from 'react';

interface DbOperation {
  collection: string;
  operation: 'INSERT' | 'READ' | 'UPDATE' | 'DELETE' | 'AGGREGATE' | 'BULK_WRITE' | 'COUNT';
  description: string;
  query?: string;
  module: string;
  frequency: string;
}

const c = {
  bg: '#0a0e17',
  surface: '#111827',
  surface2: '#1a2332',
  border: '#2a3a52',
  text: '#e2e8f0',
  text2: '#94a3b8',
  accent: '#3b82f6',
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
  orange: '#f97316',
};

const opColors: Record<string, string> = {
  INSERT: c.green,
  READ: c.accent,
  UPDATE: c.yellow,
  DELETE: c.red,
  AGGREGATE: c.purple,
  BULK_WRITE: c.cyan,
  COUNT: c.orange,
};

const opIcons: Record<string, string> = {
  INSERT: '\u2795',
  READ: '\uD83D\uDD0D',
  UPDATE: '\u270F\uFE0F',
  DELETE: '\uD83D\uDDD1',
  AGGREGATE: '\uD83D\uDCCA',
  BULK_WRITE: '\uD83D\uDCE6',
  COUNT: '#\uFE0F\u20E3',
};

export const vehicleV3Operations: DbOperation[] = [
  {
    collection: 'vehicleV3',
    operation: 'BULK_WRITE',
    description: 'Batch upsert vehicles during EDS import merge',
    query: 'bulkWrite([ReplaceOneModel(filter: {vin}, replacement: vehicle, upsert: true)])',
    module: 'cron',
    frequency: 'Every 30 min (~100K ops)',
  },
  {
    collection: 'vehicleV3',
    operation: 'AGGREGATE',
    description: 'Atlas Search pipeline for vehicle search queries',
    query: 'aggregate([$search, $match, $addFields, $sort, $skip, $limit])',
    module: 'search',
    frequency: '~1000 queries/min (peak)',
  },
  {
    collection: 'vehicleV3',
    operation: 'READ',
    description: 'Get vehicle by VIN for detail pages and availability checks',
    query: 'findOne({vin: "ABC123"})',
    module: 'search / routes',
    frequency: '~500 reads/min',
  },
  {
    collection: 'vehicleV3',
    operation: 'UPDATE',
    description: 'Update leasing data from consumer messages',
    query: 'updateOne({vin}, {$set: {"leasing": leasingData}})',
    module: 'consumer',
    frequency: '~50 updates/hour',
  },
  {
    collection: 'vehicleV3',
    operation: 'UPDATE',
    description: 'Update purchasePending from cart status messages',
    query: 'updateOne({vin}, {$set: {"availability.purchasePending": true}})',
    module: 'availability',
    frequency: '~200 updates/hour',
  },
  {
    collection: 'vehicleV3',
    operation: 'UPDATE',
    description: 'Mark missing vehicles as DELETED after EDS import',
    query: 'updateMany({lastSeenJobId: {$ne: currentJobId}}, {$set: {status: "DELETED"}})',
    module: 'cron',
    frequency: 'Every 30 min',
  },
  {
    collection: 'vehicleV3',
    operation: 'DELETE',
    description: 'Clean up stale DELETED vehicles older than 7 days',
    query: 'deleteMany({status: "DELETED", updatedAt: {$lt: cutoff}})',
    module: 'cron',
    frequency: 'Daily at 2 AM',
  },
  {
    collection: 'vehicleV3',
    operation: 'COUNT',
    description: 'Count active vehicles for safety check during import',
    query: 'countDocuments({status: "ACTIVE"})',
    module: 'cron',
    frequency: 'Every 30 min',
  },
];

export const allCollectionOperations: DbOperation[] = [
  ...vehicleV3Operations,
  {
    collection: 'temp_vehicleV3_*',
    operation: 'INSERT',
    description: 'Stage incoming EDS vehicles into temporary collection',
    query: 'insertMany(vehicles) // 500/batch, 5 concurrent',
    module: 'cron',
    frequency: 'Every 30 min',
  },
  {
    collection: 'searchSuggestion',
    operation: 'BULK_WRITE',
    description: 'Update autocomplete suggestions after EDS import',
    query: 'bulkWrite([upsert suggestions, delete stale])',
    module: 'cron',
    frequency: 'Every 30 min',
  },
  {
    collection: 'postalCodeOemRegions',
    operation: 'BULK_WRITE',
    description: 'Sync postal code to OEM region mappings',
    query: 'replaceAll(mappings) // ~42K documents',
    module: 'cron',
    frequency: 'Every 6 hours',
  },
  {
    collection: 'searchScoreWeights',
    operation: 'READ',
    description: 'Load active search scoring configuration',
    query: 'findOne({sortType, enabled: true})',
    module: 'search',
    frequency: 'On every search query',
  },
  {
    collection: 'inventoryJobDetails',
    operation: 'INSERT',
    description: 'Track EDS import job status and metrics',
    query: 'insertOne({runId, status: "RUNNING", startTime})',
    module: 'cron',
    frequency: 'Every 30 min',
  },
];

type FilterMode = 'all' | 'collection' | 'operation' | 'module';

export default function DatabaseOperationViz() {
  const [filter, setFilter] = useState<FilterMode>('all');
  const [filterValue, setFilterValue] = useState<string>('');
  const [hoveredOp, setHoveredOp] = useState<number | null>(null);
  const [animatingIdx, setAnimatingIdx] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatingIdx((prev) => {
        const ops = getFilteredOps();
        if (ops.length === 0) return null;
        return prev === null ? 0 : (prev + 1) % ops.length;
      });
    }, 2500);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, filterValue]);

  const getFilteredOps = () => {
    if (filter === 'all') return allCollectionOperations;
    return allCollectionOperations.filter((op) => {
      if (filter === 'collection') return op.collection === filterValue;
      if (filter === 'operation') return op.operation === filterValue;
      if (filter === 'module') return op.module.includes(filterValue);
      return true;
    });
  };

  const filteredOps = getFilteredOps();

  const collections = [...new Set(allCollectionOperations.map((o) => o.collection))];
  const operations = [...new Set(allCollectionOperations.map((o) => o.operation))];
  const modules = [...new Set(allCollectionOperations.flatMap((o) => o.module.split(' / ')))];

  const containerStyle: CSSProperties = {
    background: c.surface,
    border: `1px solid ${c.border}`,
    borderRadius: 16,
    padding: '2rem',
    marginTop: '1.5rem',
  };

  const filterBar: CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '1.5rem',
  };

  const chipStyle = (active: boolean, color: string): CSSProperties => ({
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: `1px solid ${active ? color : c.border}`,
    background: active ? `${color}20` : 'transparent',
    color: active ? color : c.text2,
    transition: 'all 0.2s',
  });

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: c.text }}>
          MongoDB Operations Map
        </div>
        <div style={{ fontSize: '0.8rem', color: c.text2 }}>
          {filteredOps.length} operations
        </div>
      </div>

      {/* Filter chips */}
      <div style={filterBar}>
        <button
          style={chipStyle(filter === 'all', c.accent)}
          onClick={() => { setFilter('all'); setFilterValue(''); }}
        >
          All
        </button>
        <span style={{ color: c.text2, fontSize: '0.75rem', padding: '4px 0', opacity: 0.5 }}>|</span>
        {collections.map((col) => (
          <button
            key={col}
            style={chipStyle(filter === 'collection' && filterValue === col, c.yellow)}
            onClick={() => { setFilter('collection'); setFilterValue(col); }}
          >
            {col}
          </button>
        ))}
        <span style={{ color: c.text2, fontSize: '0.75rem', padding: '4px 0', opacity: 0.5 }}>|</span>
        {operations.map((op) => (
          <button
            key={op}
            style={chipStyle(filter === 'operation' && filterValue === op, opColors[op])}
            onClick={() => { setFilter('operation'); setFilterValue(op); }}
          >
            {opIcons[op]} {op}
          </button>
        ))}
        <span style={{ color: c.text2, fontSize: '0.75rem', padding: '4px 0', opacity: 0.5 }}>|</span>
        {modules.map((mod) => (
          <button
            key={mod}
            style={chipStyle(filter === 'module' && filterValue === mod, c.purple)}
            onClick={() => { setFilter('module'); setFilterValue(mod); }}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* Operations list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <AnimatePresence mode="popLayout">
          {filteredOps.map((op, idx) => {
            const color = opColors[op.operation];
            const isHovered = hoveredOp === idx;
            const isAnimating = animatingIdx === idx;

            return (
              <motion.div
                key={`${op.collection}-${op.operation}-${op.description}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setHoveredOp(idx)}
                onMouseLeave={() => setHoveredOp(null)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '100px 85px 1fr auto',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: isHovered || isAnimating ? c.surface2 : 'transparent',
                  borderRadius: 10,
                  border: `1px solid ${isAnimating ? `${color}40` : isHovered ? c.border : 'transparent'}`,
                  transition: 'all 0.2s',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Animated pulse indicator */}
                {isAnimating && (
                  <motion.div
                    initial={{ left: -4 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 3,
                      background: color,
                      borderRadius: 2,
                    }}
                  />
                )}

                {/* Collection */}
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: c.yellow, fontFamily: "'JetBrains Mono', monospace" }}>
                  {op.collection.length > 14 ? op.collection.slice(0, 14) + '..' : op.collection}
                </div>

                {/* Operation badge */}
                <div
                  style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background: `${color}20`,
                    color: color,
                    textAlign: 'center',
                    border: `1px solid ${color}30`,
                  }}
                >
                  {opIcons[op.operation]} {op.operation}
                </div>

                {/* Description */}
                <div>
                  <div style={{ fontSize: '0.85rem', color: c.text, fontWeight: 500 }}>{op.description}</div>
                  {(isHovered || isAnimating) && op.query && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{
                        fontSize: '0.75rem',
                        color: c.cyan,
                        fontFamily: "'JetBrains Mono', monospace",
                        marginTop: 4,
                      }}
                    >
                      {op.query}
                    </motion.div>
                  )}
                </div>

                {/* Module + Frequency */}
                <div style={{ textAlign: 'right', minWidth: 100 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: c.purple }}>{op.module}</div>
                  <div style={{ fontSize: '0.68rem', color: c.text2 }}>{op.frequency}</div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
