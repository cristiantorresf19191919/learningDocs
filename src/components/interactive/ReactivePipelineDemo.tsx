import React, { useState, useEffect, useCallback, useRef } from 'react';
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

interface Operator {
  id: string;
  label: string;
  code: string;
  color: string;
}

const OPERATORS: Operator[] = [
  { id: 'source', label: 'Source', code: 'Flux.just(1, 2, 3, 4, 5)', color: C.accent },
  { id: 'filter', label: 'Filter', code: '.filter(n -> n > 2)', color: C.yellow },
  { id: 'map', label: 'Map', code: '.map(n -> n * 10)', color: C.cyan },
  { id: 'take', label: 'Take', code: '.take(2)', color: C.pink },
  { id: 'subscriber', label: 'Subscriber', code: 'subscribe()', color: C.green },
];

interface ValueState {
  value: number;
  stage: number; // which operator stage it's at
  status: 'moving' | 'filtered' | 'passed' | 'taken' | 'dropped';
  transformed?: number;
}

const STEP_DELAY = 600;

const ReactivePipelineDemo: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [values, setValues] = useState<ValueState[]>([]);
  const [activeOperator, setActiveOperator] = useState<number>(-1);
  const [finalOutput, setFinalOutput] = useState<number[]>([]);
  const [processingValue, setProcessingValue] = useState<number | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cleanup = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const runAnimation = useCallback(() => {
    cleanup();
    setIsRunning(true);
    setValues([]);
    setFinalOutput([]);
    setActiveOperator(-1);
    setProcessingValue(null);

    const sourceValues = [1, 2, 3, 4, 5];
    let takenCount = 0;
    let delay = 0;

    // Initialize all values
    const t0 = setTimeout(() => {
      setValues(
        sourceValues.map((v) => ({
          value: v,
          stage: 0,
          status: 'moving' as const,
        }))
      );
      setActiveOperator(0);
    }, 300);
    timeoutsRef.current.push(t0);
    delay += 600;

    sourceValues.forEach((val, valIndex) => {
      // Stage 1: Filter (n > 2)
      const t1 = setTimeout(() => {
        setActiveOperator(1);
        setProcessingValue(val);
        setValues((prev) =>
          prev.map((v, i) => (i === valIndex ? { ...v, stage: 1 } : v))
        );
      }, delay);
      timeoutsRef.current.push(t1);
      delay += STEP_DELAY;

      const passesFilter = val > 2;

      const t1b = setTimeout(() => {
        setValues((prev) =>
          prev.map((v, i) =>
            i === valIndex
              ? { ...v, status: passesFilter ? 'passed' : 'filtered' }
              : v
          )
        );
      }, delay);
      timeoutsRef.current.push(t1b);
      delay += STEP_DELAY;

      if (!passesFilter) return;

      // Stage 2: Map (n * 10)
      const mapped = val * 10;

      const t2 = setTimeout(() => {
        setActiveOperator(2);
        setProcessingValue(val);
        setValues((prev) =>
          prev.map((v, i) => (i === valIndex ? { ...v, stage: 2 } : v))
        );
      }, delay);
      timeoutsRef.current.push(t2);
      delay += STEP_DELAY;

      const t2b = setTimeout(() => {
        setValues((prev) =>
          prev.map((v, i) =>
            i === valIndex ? { ...v, transformed: mapped } : v
          )
        );
        setProcessingValue(mapped);
      }, delay);
      timeoutsRef.current.push(t2b);
      delay += STEP_DELAY;

      // Stage 3: Take(2)
      const willTake = takenCount < 2;
      if (willTake) takenCount++;

      const t3 = setTimeout(() => {
        setActiveOperator(3);
        setValues((prev) =>
          prev.map((v, i) => (i === valIndex ? { ...v, stage: 3 } : v))
        );
      }, delay);
      timeoutsRef.current.push(t3);
      delay += STEP_DELAY;

      const t3b = setTimeout(() => {
        setValues((prev) =>
          prev.map((v, i) =>
            i === valIndex
              ? { ...v, status: willTake ? 'taken' : 'dropped' }
              : v
          )
        );
      }, delay);
      timeoutsRef.current.push(t3b);
      delay += STEP_DELAY;

      if (!willTake) return;

      // Stage 4: Subscriber
      const t4 = setTimeout(() => {
        setActiveOperator(4);
        setValues((prev) =>
          prev.map((v, i) => (i === valIndex ? { ...v, stage: 4 } : v))
        );
        setFinalOutput((prev) => [...prev, mapped]);
        setProcessingValue(null);
      }, delay);
      timeoutsRef.current.push(t4);
      delay += STEP_DELAY;
    });

    // End
    const tEnd = setTimeout(() => {
      setIsRunning(false);
      setActiveOperator(-1);
      setProcessingValue(null);
    }, delay + 400);
    timeoutsRef.current.push(tEnd);
  }, [cleanup]);

  const reset = useCallback(() => {
    cleanup();
    setIsRunning(false);
    setValues([]);
    setFinalOutput([]);
    setActiveOperator(-1);
    setProcessingValue(null);
  }, [cleanup]);

  function getValueColor(v: ValueState): string {
    switch (v.status) {
      case 'filtered':
        return C.red;
      case 'passed':
        return C.green;
      case 'taken':
        return C.green;
      case 'dropped':
        return C.red;
      default:
        return C.text;
    }
  }

  function getValueLabel(v: ValueState): string {
    if (v.transformed !== undefined && v.stage >= 2) {
      return String(v.transformed);
    }
    return String(v.value);
  }

  function getStatusLabel(v: ValueState): string {
    switch (v.status) {
      case 'filtered':
        return 'filtered out';
      case 'dropped':
        return 'dropped by take(2)';
      case 'taken':
        return 'emitted';
      default:
        return '';
    }
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
                backgroundColor: C.yellow,
                boxShadow: `0 0 8px ${C.yellow}80`,
              }}
            />
            <h3 style={{ margin: 0, color: C.text, fontSize: 16, fontWeight: 700 }}>
              Reactive Pipeline Demo
            </h3>
          </div>
          <p style={{ margin: '6px 0 0 18px', color: C.text3, fontSize: 13 }}>
            Flux.just(1,2,3,4,5).filter(n &gt; 2).map(n * 10).take(2)
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
        {/* Pipeline operators */}
        <div style={{ display: 'flex', gap: 0, alignItems: 'stretch', marginBottom: 28 }}>
          {OPERATORS.map((op, i) => (
            <React.Fragment key={op.id}>
              {i > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 2px',
                  }}
                >
                  <motion.div
                    animate={{
                      color: activeOperator >= i ? OPERATORS[i].color : C.text3,
                    }}
                    style={{ fontSize: 18, fontWeight: 700 }}
                  >
                    &rarr;
                  </motion.div>
                </div>
              )}
              <motion.div
                animate={{
                  borderColor: activeOperator === i ? op.color : C.border,
                  boxShadow:
                    activeOperator === i
                      ? `0 0 16px ${op.color}30`
                      : '0 0 0 transparent',
                }}
                transition={{ duration: 0.3 }}
                style={{
                  flex: 1,
                  padding: '12px 10px',
                  backgroundColor: activeOperator === i ? `${op.color}10` : C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  textAlign: 'center',
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: activeOperator >= i ? op.color : C.text3,
                    marginBottom: 4,
                  }}
                >
                  {op.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.text2,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    wordBreak: 'break-all',
                  }}
                >
                  {op.code}
                </div>
              </motion.div>
            </React.Fragment>
          ))}
        </div>

        {/* Processing indicator */}
        <AnimatePresence>
          {processingValue !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                textAlign: 'center',
                marginBottom: 20,
                padding: '8px 16px',
                backgroundColor: `${C.accent}12`,
                border: `1px solid ${C.accent}30`,
                borderRadius: 6,
                color: C.accent,
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            >
              Processing: {processingValue}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Value tracker */}
        {values.length > 0 && (
          <div
            style={{
              backgroundColor: C.surface2,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: C.text3,
                textTransform: 'uppercase',
                fontWeight: 700,
                letterSpacing: '0.06em',
                marginBottom: 12,
              }}
            >
              Value Tracker
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '8px 12px',
                    backgroundColor: C.surface3,
                    borderRadius: 6,
                    borderLeft: `3px solid ${getValueColor(v)}`,
                  }}
                >
                  {/* Original value */}
                  <div
                    style={{
                      width: 30,
                      fontSize: 16,
                      fontWeight: 800,
                      color: getValueColor(v),
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                      textAlign: 'center',
                    }}
                  >
                    {v.value}
                  </div>

                  {/* Progress bar */}
                  <div style={{ flex: 1, position: 'relative' }}>
                    <div
                      style={{
                        height: 4,
                        backgroundColor: `${C.border}80`,
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                    >
                      <motion.div
                        animate={{
                          width:
                            v.status === 'filtered'
                              ? `${((v.stage + 0.5) / (OPERATORS.length - 1)) * 100}%`
                              : v.status === 'dropped'
                              ? `${((v.stage + 0.5) / (OPERATORS.length - 1)) * 100}%`
                              : `${(v.stage / (OPERATORS.length - 1)) * 100}%`,
                        }}
                        transition={{ duration: 0.4 }}
                        style={{
                          height: '100%',
                          backgroundColor: getValueColor(v),
                          borderRadius: 2,
                        }}
                      />
                    </div>
                  </div>

                  {/* Transformed value */}
                  <div
                    style={{
                      width: 40,
                      textAlign: 'center',
                      fontSize: 14,
                      fontWeight: 700,
                      color: getValueColor(v),
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}
                  >
                    {getValueLabel(v)}
                  </div>

                  {/* Status */}
                  <div
                    style={{
                      width: 130,
                      textAlign: 'right',
                      fontSize: 11,
                      color:
                        v.status === 'filtered' || v.status === 'dropped'
                          ? C.red
                          : v.status === 'taken'
                          ? C.green
                          : C.text3,
                      fontWeight: 600,
                    }}
                  >
                    {getStatusLabel(v) || (
                      <span style={{ color: C.text3 }}>
                        at {OPERATORS[v.stage]?.label || '...'}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Final output */}
        <AnimatePresence>
          {finalOutput.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '16px 20px',
                backgroundColor: `${C.green}10`,
                border: `1px solid ${C.green}30`,
                borderRadius: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  color: C.text2,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Subscriber Output
              </span>
              <motion.span
                key={finalOutput.length}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                style={{
                  color: C.green,
                  fontSize: 20,
                  fontWeight: 800,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
              >
                [{finalOutput.join(', ')}]
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ReactivePipelineDemo;
