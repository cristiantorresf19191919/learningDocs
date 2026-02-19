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

interface Stage {
  id: number;
  label: string;
  description: string;
  color: string;
  icon: string;
  value?: string;
}

const STAGES: Stage[] = [
  {
    id: 0,
    label: 'subscribe()',
    description: 'Subscriber subscribes to the Mono source',
    color: C.accent,
    icon: 'S',
  },
  {
    id: 1,
    label: 'onSubscribe()',
    description: 'Publisher acknowledges subscription with a Subscription object',
    color: C.cyan,
    icon: 'OS',
  },
  {
    id: 2,
    label: 'request(n)',
    description: 'Subscriber requests n elements via backpressure',
    color: C.yellow,
    icon: 'R',
    value: 'n = 1',
  },
  {
    id: 3,
    label: 'onNext(value)',
    description: 'Publisher emits the single value to subscriber',
    color: C.green,
    icon: 'ON',
    value: '"Hello, Reactive!"',
  },
  {
    id: 4,
    label: 'onComplete()',
    description: 'Publisher signals the stream is complete',
    color: C.pink,
    icon: 'OC',
  },
];

const STAGE_DELAY_MS = 900;

const MonoLifecycleDemo: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [flowValue, setFlowValue] = useState<string | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cleanup = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const runAnimation = useCallback(() => {
    cleanup();
    setIsRunning(true);
    setActiveStage(-1);
    setFlowValue(null);

    STAGES.forEach((stage, i) => {
      const t = setTimeout(() => {
        setActiveStage(i);
        if (stage.value) {
          setFlowValue(stage.value);
        }
        if (i === STAGES.length - 1) {
          const endT = setTimeout(() => setIsRunning(false), 800);
          timeoutsRef.current.push(endT);
        }
      }, (i + 1) * STAGE_DELAY_MS);
      timeoutsRef.current.push(t);
    });
  }, [cleanup]);

  const reset = useCallback(() => {
    cleanup();
    setIsRunning(false);
    setActiveStage(-1);
    setFlowValue(null);
  }, [cleanup]);

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
        maxWidth: 800,
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
                backgroundColor: C.cyan,
                boxShadow: `0 0 8px ${C.cyan}80`,
              }}
            />
            <h3 style={{ margin: 0, color: C.text, fontSize: 16, fontWeight: 700 }}>
              Mono Subscribe Lifecycle
            </h3>
          </div>
          <p style={{ margin: '6px 0 0 18px', color: C.text3, fontSize: 13 }}>
            Reactive Streams protocol: Publisher &harr; Subscriber handshake
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
              transition: 'all 0.2s',
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

      {/* Pipeline */}
      <div style={{ padding: 24 }}>
        {/* Flow value indicator */}
        <AnimatePresence>
          {flowValue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                textAlign: 'center',
                marginBottom: 20,
                padding: '10px 20px',
                backgroundColor: `${C.green}15`,
                border: `1px solid ${C.green}40`,
                borderRadius: 8,
              }}
            >
              <span style={{ color: C.text3, fontSize: 12 }}>Current value: </span>
              <span
                style={{
                  color: C.green,
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
              >
                {flowValue}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {STAGES.map((stage, i) => {
            const isActive = activeStage >= i;
            const isCurrent = activeStage === i;

            return (
              <React.Fragment key={stage.id}>
                {/* Connector line */}
                {i > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      height: 32,
                      position: 'relative',
                    }}
                  >
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{
                        scaleY: activeStage >= i ? 1 : 0,
                        backgroundColor: isActive ? stage.color : C.border,
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        width: 2,
                        height: '100%',
                        transformOrigin: 'top',
                      }}
                    />
                    {/* Arrow */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          position: 'absolute',
                          bottom: -2,
                          width: 0,
                          height: 0,
                          borderLeft: '5px solid transparent',
                          borderRight: '5px solid transparent',
                          borderTop: `6px solid ${stage.color}`,
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Stage card */}
                <motion.div
                  animate={{
                    borderColor: isCurrent ? stage.color : isActive ? `${stage.color}50` : C.border,
                    backgroundColor: isCurrent ? `${stage.color}10` : C.surface2,
                    boxShadow: isCurrent
                      ? `0 0 20px ${stage.color}25, inset 0 0 20px ${stage.color}08`
                      : 'none',
                  }}
                  transition={{ duration: 0.4 }}
                  style={{
                    padding: '16px 20px',
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  {/* Icon circle */}
                  <motion.div
                    animate={{
                      backgroundColor: isActive ? stage.color : C.surface3,
                      boxShadow: isCurrent ? `0 0 12px ${stage.color}60` : 'none',
                    }}
                    transition={{ duration: 0.4 }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 13,
                      fontWeight: 800,
                      color: isActive ? '#fff' : C.text3,
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}
                  >
                    {stage.icon}
                  </motion.div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: isActive ? stage.color : C.text3,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        transition: 'color 0.4s',
                      }}
                    >
                      {stage.label}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: isActive ? C.text2 : C.text3,
                        marginTop: 4,
                        transition: 'color 0.4s',
                      }}
                    >
                      {stage.description}
                    </div>
                  </div>

                  {/* Stage value badge */}
                  {stage.value && isActive && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: `${stage.color}20`,
                        border: `1px solid ${stage.color}40`,
                        borderRadius: 6,
                        color: stage.color,
                        fontSize: 12,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {stage.value}
                    </motion.div>
                  )}

                  {/* Status indicator */}
                  <motion.div
                    animate={{
                      scale: isCurrent ? [1, 1.3, 1] : 1,
                      backgroundColor: isActive ? stage.color : C.surface3,
                    }}
                    transition={{
                      scale: { repeat: isCurrent ? Infinity : 0, duration: 1 },
                      backgroundColor: { duration: 0.4 },
                    }}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      flexShrink: 0,
                    }}
                  />
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Completion message */}
        <AnimatePresence>
          {activeStage === STAGES.length - 1 && !isRunning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginTop: 20,
                padding: '14px 20px',
                backgroundColor: `${C.green}12`,
                border: `1px solid ${C.green}30`,
                borderRadius: 8,
                textAlign: 'center',
                color: C.green,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Mono lifecycle complete -- stream terminated successfully
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MonoLifecycleDemo;
