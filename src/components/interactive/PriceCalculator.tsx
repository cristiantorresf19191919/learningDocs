import React, { useState, useMemo } from 'react';
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

type ProductType = 'VSC' | 'VLP' | 'T&W';
type DealerState = 'Non-Florida' | 'Florida';

interface CalculationResult {
  totalInCents: number;
  formula: string;
  marginCents: number;
}

function calculate(
  dealerCost: number,
  retailPrice: number,
  productType: ProductType,
  dealerState: DealerState
): CalculationResult {
  let totalInCents: number;
  let formula: string;

  switch (productType) {
    case 'VSC':
      if (dealerState === 'Florida') {
        totalInCents = retailPrice;
        formula = 'totalInCents = retailPrice (VSC Florida)';
      } else {
        totalInCents = dealerCost + 150000;
        formula = 'totalInCents = dealerCost + 150000 (VSC Non-FL)';
      }
      break;
    case 'VLP':
      totalInCents = 109500;
      formula = 'totalInCents = 109500 (VLP fixed price, ignores inputs)';
      break;
    case 'T&W':
      if (dealerState === 'Florida') {
        totalInCents = retailPrice;
        formula = 'totalInCents = retailPrice (T&W Florida)';
      } else {
        totalInCents = Math.round(dealerCost * 2.2);
        formula = 'totalInCents = Math.round(dealerCost * 2.2) (T&W Non-FL)';
      }
      break;
  }

  const marginCents = totalInCents - dealerCost;

  return { totalInCents, formula, marginCents };
}

function centsToDollars(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const PriceCalculator: React.FC = () => {
  const [dealerCost, setDealerCost] = useState<number>(180000);
  const [retailPrice, setRetailPrice] = useState<number>(320000);
  const [productType, setProductType] = useState<ProductType>('VSC');
  const [dealerState, setDealerState] = useState<DealerState>('Non-Florida');

  const result = useMemo(
    () => calculate(dealerCost, retailPrice, productType, dealerState),
    [dealerCost, retailPrice, productType, dealerState]
  );

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    color: C.text,
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 6,
    color: C.text2,
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

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
        maxWidth: 720,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${C.border}`,
          background: `linear-gradient(135deg, ${C.surface2}, ${C.surface})`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: C.accent,
              boxShadow: `0 0 8px ${C.accent}80`,
            }}
          />
          <h3 style={{ margin: 0, color: C.text, fontSize: 16, fontWeight: 700 }}>
            Products-API Price Calculator
          </h3>
        </div>
        <p style={{ margin: '6px 0 0 18px', color: C.text3, fontSize: 13 }}>
          Simulates markup logic for PEN product pricing
        </p>
      </div>

      {/* Inputs */}
      <div style={{ padding: 24 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
          }}
        >
          {/* Dealer Cost */}
          <div>
            <label style={labelStyle}>PEN Dealer Cost (cents)</label>
            <input
              type="number"
              value={dealerCost}
              onChange={(e) => setDealerCost(Number(e.target.value) || 0)}
              style={inputStyle}
            />
            <span style={{ color: C.text3, fontSize: 11, marginTop: 4, display: 'block' }}>
              = {centsToDollars(dealerCost)}
            </span>
          </div>

          {/* Retail Price */}
          <div>
            <label style={labelStyle}>PEN Retail Price (cents)</label>
            <input
              type="number"
              value={retailPrice}
              onChange={(e) => setRetailPrice(Number(e.target.value) || 0)}
              style={inputStyle}
            />
            <span style={{ color: C.text3, fontSize: 11, marginTop: 4, display: 'block' }}>
              = {centsToDollars(retailPrice)}
            </span>
          </div>

          {/* Product Type */}
          <div>
            <label style={labelStyle}>Product Type</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value as ProductType)}
              style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
            >
              <option value="VSC">VSC</option>
              <option value="VLP">VLP</option>
              <option value="T&W">T&W</option>
            </select>
          </div>

          {/* Dealer State */}
          <div>
            <label style={labelStyle}>Dealer State</label>
            <select
              value={dealerState}
              onChange={(e) => setDealerState(e.target.value as DealerState)}
              style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
            >
              <option value="Non-Florida">Non-Florida</option>
              <option value="Florida">Florida</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${productType}-${dealerState}-${dealerCost}-${retailPrice}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              marginTop: 24,
              padding: 20,
              backgroundColor: C.surface2,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: C.text3,
                textTransform: 'uppercase',
                fontWeight: 700,
                letterSpacing: '0.06em',
                marginBottom: 16,
              }}
            >
              Calculation Result
            </div>

            {/* Result rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <ResultRow label="PEN Dealer Cost" value={centsToDollars(dealerCost)} color={C.text} />
              <ResultRow label="PEN Retail Price" value={centsToDollars(retailPrice)} color={C.text} />

              <div
                style={{
                  borderTop: `1px dashed ${C.border}`,
                  paddingTop: 12,
                }}
              >
                <ResultRow label="Formula" value={result.formula} color={C.cyan} mono />
              </div>

              <ResultRow
                label="Margin Over Dealer Cost"
                value={`${centsToDollars(result.marginCents)} (${result.marginCents.toLocaleString()} cents)`}
                color={result.marginCents >= 0 ? C.green : C.red}
              />

              <div
                style={{
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 14,
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: C.text2, fontSize: 13, fontWeight: 600 }}>
                    Final Customer Price
                  </span>
                  <motion.span
                    key={result.totalInCents}
                    initial={{ scale: 1.15, color: '#fff' }}
                    animate={{ scale: 1, color: C.green }}
                    transition={{ duration: 0.4 }}
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}
                  >
                    {centsToDollars(result.totalInCents)}
                  </motion.span>
                </div>
                <div
                  style={{
                    textAlign: 'right',
                    color: C.text3,
                    fontSize: 11,
                    marginTop: 2,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  }}
                >
                  ({result.totalInCents.toLocaleString()} cents)
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

interface ResultRowProps {
  label: string;
  value: string;
  color: string;
  mono?: boolean;
}

const ResultRow: React.FC<ResultRowProps> = ({ label, value, color, mono }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 16,
    }}
  >
    <span style={{ color: C.text2, fontSize: 13, flexShrink: 0 }}>{label}</span>
    <span
      style={{
        color,
        fontSize: mono ? 12 : 14,
        fontWeight: 600,
        fontFamily: mono ? "'JetBrains Mono', 'Fira Code', monospace" : 'inherit',
        textAlign: 'right',
        wordBreak: 'break-word',
      }}
    >
      {value}
    </span>
  </div>
);

export default PriceCalculator;
