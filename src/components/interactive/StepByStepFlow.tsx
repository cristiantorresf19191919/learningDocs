import { useState, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlowStep {
  number: number;
  title: string;
  description: string;
  detail?: string;
  icon: string;
  color: string;
  dbOperation?: string;
}

interface StepByStepFlowProps {
  title: string;
  steps: FlowStep[];
}

const c = {
  bg: '#0a0e17',
  surface: '#111827',
  surface2: '#1a2332',
  border: '#2a3a52',
  text: '#e2e8f0',
  text2: '#94a3b8',
  accent: '#3b82f6',
};

export default function StepByStepFlow({ title, steps }: StepByStepFlowProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAll = async () => {
    setIsPlaying(true);
    for (let i = 0; i < steps.length; i++) {
      setActiveStep(i);
      await new Promise((r) => setTimeout(r, 1800));
    }
    setIsPlaying(false);
  };

  const containerStyle: CSSProperties = {
    background: c.surface,
    border: `1px solid ${c.border}`,
    borderRadius: 16,
    padding: '2rem',
    marginTop: '1.5rem',
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  };

  const titleStyle: CSSProperties = {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: c.text,
  };

  const playBtn: CSSProperties = {
    padding: '8px 20px',
    background: `linear-gradient(135deg, ${c.accent}, #8b5cf6)`,
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: isPlaying ? 'not-allowed' : 'pointer',
    opacity: isPlaying ? 0.6 : 1,
    transition: 'all 0.2s',
  };

  const timelineStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
    position: 'relative',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={titleStyle}>{title}</div>
        <button style={playBtn} onClick={playAll} disabled={isPlaying}>
          {isPlaying ? 'Playing...' : 'Play Animation'}
        </button>
      </div>

      <div style={timelineStyle}>
        {steps.map((step, idx) => {
          const isActive = idx === activeStep;
          const isPast = idx < activeStep;

          return (
            <div key={idx} style={{ display: 'flex', gap: '1.25rem', cursor: 'pointer' }} onClick={() => !isPlaying && setActiveStep(idx)}>
              {/* Timeline line + circle */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
                <motion.div
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    background: isActive ? step.color : isPast ? step.color : c.surface2,
                    borderColor: isActive ? step.color : isPast ? step.color : c.border,
                    boxShadow: isActive ? `0 0 20px ${step.color}40` : 'none',
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: `2px solid ${c.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    zIndex: 1,
                    flexShrink: 0,
                  }}
                >
                  {isPast ? '\u2713' : step.icon}
                </motion.div>
                {idx < steps.length - 1 && (
                  <motion.div
                    animate={{
                      background: isPast ? `linear-gradient(to bottom, ${step.color}, ${steps[idx + 1].color})` : `${c.border}`,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: 2,
                      flex: 1,
                      minHeight: 24,
                      background: c.border,
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <motion.div
                animate={{
                  opacity: isActive ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
                style={{
                  flex: 1,
                  paddingBottom: idx < steps.length - 1 ? '1.25rem' : 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: step.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Step {step.number}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: isActive ? c.text : c.text2 }}>
                    {step.title}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: c.text2, lineHeight: 1.65, margin: 0 }}>
                  {step.description}
                </p>

                <AnimatePresence>
                  {isActive && step.detail && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        style={{
                          marginTop: '0.75rem',
                          padding: '0.75rem 1rem',
                          background: c.surface2,
                          borderRadius: 8,
                          border: `1px solid ${step.color}30`,
                          fontSize: '0.82rem',
                          color: c.text2,
                          lineHeight: 1.7,
                          fontFamily: "'JetBrains Mono', monospace",
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {step.detail}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isActive && step.dbOperation && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        style={{
                          marginTop: '0.5rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '4px 12px',
                          background: `${step.color}15`,
                          border: `1px solid ${step.color}30`,
                          borderRadius: 6,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: step.color,
                        }}
                      >
                        <span style={{ fontSize: '0.85rem' }}>{'\uD83D\uDDC4'}</span>
                        {step.dbOperation}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pre-built flow configurations                                      */
/* ------------------------------------------------------------------ */

export const edsImportSteps: FlowStep[] = [
  {
    number: 1,
    title: 'Check Job Lock',
    description: 'Verify no other import is currently running. Create job tracking record.',
    detail: 'cronJobTracker.createInitialJobDetails(runId, startTime)\ncronJobTracker.startJob()',
    icon: '\uD83D\uDD12',
    color: '#f59e0b',
    dbOperation: 'INSERT into inventoryJobDetails',
  },
  {
    number: 2,
    title: 'Find & Validate EDS File',
    description: 'Locate the newest GZIP TSV file in Azure Blob Storage and validate its structure.',
    detail: 'Container: inbound\nPrefix: CVP/Driveway-Merchandising-V2/\nFormat: GZIP-compressed TSV with 76 columns',
    icon: '\uD83D\uDCC1',
    color: '#3b82f6',
  },
  {
    number: 3,
    title: 'Parse & Stage to Temp Collection',
    description: 'Parse each TSV row into Vehicle objects. Batch insert into a temporary MongoDB collection.',
    detail: 'temp_vehicleV3_{timestamp}\nBatch size: 500 vehicles\nConcurrency: 5 semaphores\n~100K vehicles processed in ~3 minutes',
    icon: '\uD83D\uDCE5',
    color: '#10b981',
    dbOperation: 'BULK INSERT into temp_vehicleV3_*',
  },
  {
    number: 4,
    title: 'Safety Check (15K Threshold)',
    description: 'Compare live vs incoming vehicle counts. Abort if delta exceeds 15,000 to prevent data loss.',
    detail: 'liveCount = vehicleDao.countActive()\nincomingCount = tempDao.count(tempName)\nif (liveCount - incomingCount >= 15_000) ABORT',
    icon: '\uD83D\uDEE1',
    color: '#ef4444',
    dbOperation: 'COUNT on vehicleV3 + temp collection',
  },
  {
    number: 5,
    title: 'Compute Inventory Deltas',
    description: 'Using set operations, determine which vehicles are ADD, UPDATE, or DELETE.',
    detail: 'ADD = incoming VINs - existing VINs\nDELETE = existing VINs - incoming VINs\nUPDATE = overlap where price OR mileage changed\nProcessed in batches of 500, 10 concurrent',
    icon: '\uD83D\uDD04',
    color: '#8b5cf6',
    dbOperation: 'READ VINs from both collections',
  },
  {
    number: 6,
    title: 'Publish Deltas to Service Bus',
    description: 'Send ADD/UPDATE/DELETE events to inventory-delta-topic for downstream consumers.',
    detail: 'Topic: inventory-delta-topic\nBatch size: 100 messages\nSubscriber: F&I System\nTTL: 14 days',
    icon: '\uD83D\uDCE4',
    color: '#06b6d4',
  },
  {
    number: 7,
    title: 'Merge Temp to Live Collection',
    description: 'Copy temp data to live vehicleV3, preserving leasing, availability, and suppression fields.',
    detail: 'Preserved fields during merge:\n- vehicle.leasing (from consumer updates)\n- vehicle.availability.purchasePending\n- vehicle.manuallySuppressed\n- vehicle.image.spinUrl (from Impel)',
    icon: '\uD83D\uDD00',
    color: '#3b82f6',
    dbOperation: 'BULK UPSERT into vehicleV3',
  },
  {
    number: 8,
    title: 'Mark Missing as DELETED',
    description: 'Vehicles not in the latest import get status=DELETED. They remain searchable briefly.',
    detail: 'WHERE lastSeenJobId != currentJobId\nSET status = DELETED\nThese are cleaned up by the hourly stale cleanup job',
    icon: '\uD83D\uDDD1',
    color: '#ef4444',
    dbOperation: 'UPDATE MANY on vehicleV3',
  },
  {
    number: 9,
    title: 'Apply Lease Expiries',
    description: 'Filter expired regional lease prices, update canLease flag, and refresh defaultPrice.',
    detail: 'For each vehicle with leasing.canLease == true:\n- Remove regionalPrices where expiresOn < now\n- If no regions left: canLease = false\n- If region 1 still active: defaultPrice = region1.amountInCents',
    icon: '\uD83D\uDCB0',
    color: '#f59e0b',
    dbOperation: 'BULK UPSERT (batches of 100)',
  },
  {
    number: 10,
    title: 'Update Search Suggestions',
    description: 'Rebuild autocomplete suggestions from the updated inventory data.',
    detail: 'Extracts unique makes, models, body styles\nUpdates searchSuggestion collection\nDeletes stale suggestions not seen recently',
    icon: '\uD83D\uDD0D',
    color: '#10b981',
    dbOperation: 'UPSERT into searchSuggestion',
  },
];

export const searchQuerySteps: FlowStep[] = [
  {
    number: 1,
    title: 'Receive GraphQL Query',
    description: 'Frontend sends a search() query with filters, sort, and pagination parameters.',
    detail: 'Endpoint: /shop-graphql/\nQuery: search(filters: {...}, sort: RECOMMENDED, page: 1, limit: 24)',
    icon: '\uD83C\uDF10',
    color: '#3b82f6',
  },
  {
    number: 2,
    title: 'Build Aggregation Pipeline',
    description: 'PipelineBuilder constructs a MongoDB aggregation pipeline from the query parameters.',
    detail: 'SearchBlock -> $search (Atlas Search)\nCompoundBlock -> must/should/filter\nTextBlock, RangeBlock, NearBlock, EqualsBlock\nScoringBuilder -> function score with weights',
    icon: '\uD83D\uDD27',
    color: '#8b5cf6',
  },
  {
    number: 3,
    title: 'Execute Atlas Search',
    description: 'Run the aggregation pipeline against MongoDB Atlas Search index (shopSearch).',
    detail: 'Index: shopSearch on vehicleV3\n50+ mapped fields for full-text search\nGeo queries for distance-based results\nScoring with custom weight functions',
    icon: '\u26A1',
    color: '#f59e0b',
    dbOperation: 'AGGREGATE on vehicleV3 (Atlas Search)',
  },
  {
    number: 4,
    title: 'Apply Post-Search Transforms',
    description: 'Calculate shipping costs, apply score weights, and compute facet counts.',
    detail: 'ShippingBuilder: on-the-fly cost from Tax & Fee API\nLeasingBuilder: filter by lease availability\nFacets: make, bodyStyle, condition, price ranges',
    icon: '\uD83D\uDCCA',
    color: '#10b981',
  },
  {
    number: 5,
    title: 'Return SearchResult',
    description: 'Return paginated vehicles with total count, facets, and applied filters.',
    detail: 'SearchResult {\n  vehicles: [Vehicle]\n  totalCount: Int\n  facets: FacetResult\n  appliedFilters: [Filter]\n}',
    icon: '\u2705',
    color: '#3b82f6',
  },
];

export const leasingConsumerSteps: FlowStep[] = [
  {
    number: 1,
    title: 'Receive Service Bus Message',
    description: 'odyssey-consumer receives a LeaseIncentivesMessage from leasing-incentives-topic.',
    detail: 'Topic: leasing-incentives-topic\nSubscription: lease-consumer-sub\nLock duration: 5 minutes\nMax retries: 5',
    icon: '\uD83D\uDCE8',
    color: '#8b5cf6',
  },
  {
    number: 2,
    title: 'Deserialize & Route',
    description: 'Parse the message body and route based on type (LEASING or INCENTIVE).',
    detail: 'LEASING -> LeaseHandler.handle(message)\nINCENTIVE -> Log warning (not yet implemented)',
    icon: '\uD83D\uDD00',
    color: '#3b82f6',
  },
  {
    number: 3,
    title: 'Build Leasing Object',
    description: 'Construct the Leasing data structure with regional pricing from the message.',
    detail: 'Leasing(\n  canLease = true,\n  defaultPrice = region1?.amountInCents,\n  regionalPrices = message.regions.map { RegionData(...) }\n)',
    icon: '\uD83D\uDCB3',
    color: '#10b981',
  },
  {
    number: 4,
    title: 'Update Vehicle in MongoDB',
    description: 'Upsert the leasing field on the vehicle document identified by VIN.',
    detail: 'vehicleDao.updateField(message.vin, "leasing", leasingData)',
    icon: '\uD83D\uDDC4',
    color: '#f59e0b',
    dbOperation: 'UPDATE vehicle.leasing on vehicleV3',
  },
  {
    number: 5,
    title: 'Acknowledge Message',
    description: 'Complete the message on the Service Bus to prevent redelivery.',
    detail: 'context.complete() -> message removed from topic\nOn error: message returns to queue after lock expires',
    icon: '\u2705',
    color: '#10b981',
  },
];

export const cartAvailabilitySteps: FlowStep[] = [
  {
    number: 1,
    title: 'Cart Status Event',
    description: 'Shopping Cart Service publishes a CartStatusUpdateMessage when a vehicle is added/removed from cart.',
    detail: 'Topic: cart-status-update-topic\nMessage: { vin, purchasePending: true/false, enqueuedTime }',
    icon: '\uD83D\uDED2',
    color: '#3b82f6',
  },
  {
    number: 2,
    title: 'Receive & Validate',
    description: 'odyssey-availability-sub receives the message and validates the vehicle exists.',
    detail: 'vehicleDao.getByVin(message.vin)\nIf not found -> acknowledge and skip (no retry needed)',
    icon: '\uD83D\uDD0D',
    color: '#8b5cf6',
    dbOperation: 'READ from vehicleV3',
  },
  {
    number: 3,
    title: 'Stale Message Detection',
    description: 'Compare message enqueuedTime with existing vehicle.availability.enqueuedTime.',
    detail: 'if (existing.enqueuedTime > message.enqueuedTime)\n  -> Skip stale message (out-of-order delivery)\nThis ensures eventual consistency without ordered delivery',
    icon: '\u23F0',
    color: '#f59e0b',
  },
  {
    number: 4,
    title: 'Update Purchase Pending',
    description: 'Set the purchasePending flag and store the enqueuedTime for future staleness checks.',
    detail: 'vehicleDao.upsertPurchasePending(\n  vin = message.vin,\n  purchasePending = message.purchasePending,\n  enqueuedTime = message.enqueuedTime\n)',
    icon: '\uD83D\uDDC4',
    color: '#10b981',
    dbOperation: 'UPDATE vehicle.availability on vehicleV3',
  },
  {
    number: 5,
    title: 'Acknowledge',
    description: 'Complete the message. Vehicle now shows "Someone is looking at this" on the frontend.',
    icon: '\u2705',
    color: '#10b981',
  },
];
