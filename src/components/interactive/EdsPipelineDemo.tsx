import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Theme colors
const C = {
  bg: '#0a0e17',
  surface: '#111827',
  surface2: '#1a2332',
  surface3: '#1f2b3d',
  border: '#2a3a52',
  text: '#e2e8f0',
  text2: '#94a3b8',
  text3: '#64748b',
  accent: '#3b82f6',
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
  cyan: '#06b6d4',
  pink: '#ec4899',
} as const;

interface PipelineStage {
  id: string;
  label: string;
  description: string;
  color: string;
  icon: string;
  docsIn: number;
  docsOut: number;
  lostReason?: string;
}

const STAGES: PipelineStage[] = [
  {
    id: 'upload',
    label: 'EDS File Upload',
    description: 'Raw CSV/XML file ingested from EDS provider',
    color: C.accent,
    icon: 'UL',
    docsIn: 50000,
    docsOut: 50000,
  },
  {
    id: 'validate',
    label: 'Parse & Validate',
    description: 'Schema validation, duplicate detection, field normalization',
    color: C.yellow,
    icon: 'PV',
    docsIn: 50000,
    docsOut: 49800,
    lostReason: '200 records failed validation (missing VIN, invalid dates)',
  },
  {
    id: 'transform',
    label: 'Transform to Odyssey Format',
    description: 'Map EDS fields to internal Odyssey document schema',
    color: C.cyan,
    icon: 'TF',
    docsIn: 49800,
    docsOut: 49800,
  },
  {
    id: 'upsert',
    label: 'Bulk Upsert to MongoDB',
    description: 'Batch write with ordered=false for maximum throughput',
    color: C.green,
    icon: 'DB',
    docsIn: 49800,
    docsOut: 49800,
  },
];

const STAGE_DURATION_MS = 1800;
const PROGRESS_INTERVAL_MS = 30;

const EdsPipelineDemo: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeStage, setActiveStage] = useState<number>(-1);
  const [stageProgress, setStageProgress] = useState<number[]>([0, 0, 0, 0]);
  const [completedStages, setCompletedStages] = useState<Set<number>>(new Set());
  const [showLostDocs, setShowLostDocs] = useState(false);
  const [finished, setFinished] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  const cleanup = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const runAnimation = useCallback(() => {
    cleanup();
    setIsRunning(true);
    setActiveStage(-1);
    setStageProgress([0, 0, 0, 0]);
    setCompletedStages(new Set());
    setShowLostDocs(false);
    setFinished(false);

    STAGES.forEach((stage, i) => {
      const startDelay = i * STAGE_DURATION_MS + 300;

      // Start stage
      const tStart = setTimeout(() => {
        setActiveStage(i);

        // Animate progress
        const steps = STAGE_DURATION_MS / PROGRESS_INTERVAL_MS;
        let step = 0;
        const interval = setInterval(() => {
          step++;
          const progress = Math.min(step / steps, 1);
          setStageProgress((prev) => {
            const next = [...prev];
            next[i] = progress;
            return next;
          });

          if (progress >= 1) {
            clearInterval(interval);
          }
        }, PROGRESS_INTERVAL_MS);
        intervalsRef.current.push(interval);

        // Show lost docs animation at validation stage
        if (stage.lostReason) {
          const tLost = setTimeout(() => {
            setShowLostDocs(true);
          }, STAGE_DURATION_MS * 0.5);
          timeoutsRef.current.push(tLost);
        }
      }, startDelay);
      timeoutsRef.current.push(tStart);

      // Complete stage
      const tComplete = setTimeout(() => {
        setCompletedStages((prev) => new Set([...prev, i]));
      }, startDelay + STAGE_DURATION_MS);
      timeoutsRef.current.push(tComplete);
    });

    // Finish
    const tEnd = setTimeout(() => {
      setIsRunning(false);
      setFinished(true);
    }, STAGES.length * STAGE_DURATION_MS + 600);
    timeoutsRef.current.push(tEnd);
  }, [cleanup]);

  const reset = useCallback(() => {
    cleanup();
    setIsRunning(false);
    setActiveStage(-1);
    setStageProgress([0, 0, 0, 0]);
    setCompletedStages(new Set());
    setShowLostDocs(false);
    setFinished(false);
  }, [cleanup]);

  function formatNumber(n: number): string {
    return n.toLocaleString();
  }

  function getDocCountDisplay(stageIndex: number): string {
    const stage = STAGES[stageIndex];
    const progress = stageProgress[stageIndex];
    if (progress === 0 && !completedStages.has(stageIndex)) return '--';
    if (completedStages.has(stageIndex)) return formatNumber(stage.docsOut);
    // Animate count during processing
    const lost = stage.docsIn - stage.docsOut;
    const currentLost = Math.round(lost * progress);
    return formatNumber(stage.docsIn - currentLost);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: 860,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${C.border}`,
          background: `linear-gradient(135deg, ${C.surface2}, ${C.surface})`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: C.green,
                boxShadow: `0 0 8px ${C.green}80`,
              }}
            />
            <h3 style={{ margin: 0, color: C.text, fontSize: 16, fontWeight: 700 }}>
              EDS Import Pipeline
            </h3>
          </div>
          <p style={{ margin: '6px 0 0 18px', color: C.text3, fontSize: 13 }}>
            Electronic Dealer Services -- 4-stage batch import process
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={runAnimation}
            disabled={isRunning}
            style={{
              padding: '8px 20px',
              backgroundColor: isRunning ? C.surface3 : C.accent,
              color: isRunning ? C.text3 : '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: isRunning ? 'not-allowed' : 'pointer',
            }}
          >
            {isRunning ? 'Running...' : 'Run'}
          </button>
          <button
            onClick={reset}
            style={{
              padding: '8px 16px',
              backgroundColor: C.surface3,
              color: C.text2,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        {/* Document count summary bar */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 24,
            justifyContent: 'center',
          }}
        >
          {STAGES.map((stage, i) => (
            <React.Fragment key={stage.id}>
              {i > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: completedStages.has(i - 1) ? STAGES[i - 1].color : C.text3,
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  &rarr;
                </div>
              )}
              <motion.div
                animate={{
                  borderColor:
                    activeStage === i
                      ? stage.color
                      : completedStages.has(i)
                      ? `${stage.color}60`
                      : C.border,
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  textAlign: 'center',
                  minWidth: 80,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color:
                      activeStage >= i || completedStages.has(i)
                        ? stage.color
                        : C.text3,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    transition: 'color 0.3s',
                  }}
                >
                  {getDocCountDisplay(i)}
                </div>
                <div style={{ fontSize: 9, color: C.text3, marginTop: 2, fontWeight: 600, textTransform: 'uppercase' }}>
                  docs
                </div>
              </motion.div>
            </React.Fragment>
          ))}
        </div>

        {/* Stage cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {STAGES.map((stage, i) => {
            const isActive = activeStage === i;
            const isCompleted = completedStages.has(i);
            const progress = stageProgress[i];

            return (
              <React.Fragment key={stage.id}>
                {/* Connector */}
                {i > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'center', height: 24 }}>
                    <motion.div
                      animate={{
                        backgroundColor: completedStages.has(i - 1)
                          ? STAGES[i - 1].color
                          : C.border,
                        scaleY: completedStages.has(i - 1) ? 1 : 0.3,
                      }}
                      style={{
                        width: 2,
                        height: '100%',
                        transformOrigin: 'top',
                      }}
                    />
                  </div>
                )}

                {/* Stage card */}
                <motion.div
                  animate={{
                    borderColor: isActive
                      ? stage.color
                      : isCompleted
                      ? `${stage.color}40`
                      : C.border,
                    backgroundColor: isActive ? `${stage.color}08` : C.surface2,
                    boxShadow: isActive
                      ? `0 0 24px ${stage.color}20`
                      : '0 0 0 transparent',
                  }}
                  transition={{ duration: 0.4 }}
                  style={{
                    padding: '18px 20px',
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                    {/* Icon */}
                    <motion.div
                      animate={{
                        backgroundColor: isActive || isCompleted ? stage.color : C.surface3,
                        boxShadow: isActive ? `0 0 14px ${stage.color}50` : 'none',
                      }}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 800,
                        color: isActive || isCompleted ? '#fff' : C.text3,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        flexShrink: 0,
                      }}
                    >
                      {stage.icon}
                    </motion.div>

                    {/* Label and description */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: isActive || isCompleted ? stage.color : C.text3,
                          transition: 'color 0.3s',
                        }}
                      >
                        {stage.label}
                      </div>
                      <div style={{ fontSize: 12, color: C.text3, marginTop: 2 }}>
                        {stage.description}
                      </div>
                    </div>

                    {/* Status badge */}
                    <div
                      style={{
                        padding: '4px 12px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: isCompleted
                          ? `${C.green}20`
                          : isActive
                          ? `${stage.color}20`
                          : C.surface3,
                        color: isCompleted ? C.green : isActive ? stage.color : C.text3,
                        border: `1px solid ${
                          isCompleted
                            ? `${C.green}40`
                            : isActive
                            ? `${stage.color}40`
                            : C.border
                        }`,
                      }}
                    >
                      {isCompleted ? 'Done' : isActive ? 'Processing...' : 'Pending'}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      height: 6,
                      backgroundColor: `${C.border}60`,
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.05 }}
                      style={{
                        height: '100%',
                        backgroundColor: stage.color,
                        borderRadius: 3,
                        boxShadow: isActive ? `0 0 8px ${stage.color}60` : 'none',
                      }}
                    />
                  </div>

                  {/* Document count display */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: 8,
                      fontSize: 11,
                      color: C.text3,
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}
                  >
                    <span>In: {formatNumber(stage.docsIn)}</span>
                    <span>
                      Out:{' '}
                      <span
                        style={{
                          color:
                            stage.docsOut < stage.docsIn && (isActive || isCompleted)
                              ? C.red
                              : isActive || isCompleted
                              ? C.green
                              : C.text3,
                          fontWeight: 600,
                        }}
                      >
                        {isActive || isCompleted
                          ? getDocCountDisplay(i)
                          : formatNumber(stage.docsOut)}
                      </span>
                    </span>
                  </div>

                  {/* Lost docs warning */}
                  <AnimatePresence>
                    {stage.lostReason && showLostDocs && (isActive || isCompleted) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          marginTop: 10,
                          padding: '10px 14px',
                          backgroundColor: `${C.red}10`,
                          border: `1px solid ${C.red}30`,
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            backgroundColor: `${C.red}30`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            color: C.red,
                            fontWeight: 800,
                            flexShrink: 0,
                            marginTop: 1,
                          }}
                        >
                          !
                        </div>
                        <div style={{ fontSize: 12, color: C.red, lineHeight: 1.5 }}>
                          {stage.lostReason}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Completion summary */}
        <AnimatePresence>
          {finished && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                marginTop: 24,
                padding: '18px 24px',
                backgroundColor: `${C.green}10`,
                border: `1px solid ${C.green}30`,
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.green,
                  marginBottom: 10,
                }}
              >
                Import Complete
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 16,
                }}
              >
                <SummaryCard
                  label="Total Ingested"
                  value="50,000"
                  color={C.accent}
                />
                <SummaryCard
                  label="Validation Failures"
                  value="200"
                  color={C.red}
                />
                <SummaryCard
                  label="Successfully Upserted"
                  value="49,800"
                  color={C.green}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

interface SummaryCardProps {
  label: string;
  value: string;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, color }) => (
  <div
    style={{
      padding: '10px 14px',
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      textAlign: 'center',
    }}
  >
    <div
      style={{
        fontSize: 20,
        fontWeight: 800,
        color,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: 10, color: C.text3, marginTop: 4, fontWeight: 600, textTransform: 'uppercase' }}>
      {label}
    </div>
  </div>
);

export default EdsPipelineDemo;
