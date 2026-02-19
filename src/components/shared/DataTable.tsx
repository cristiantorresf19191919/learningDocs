import React, { useState } from 'react';

interface DataTableProps {
  headers: string[];
  rows: (string | React.ReactNode)[][];
  highlightColumn?: number;
}

const DataTable: React.FC<DataTableProps> = ({ headers, rows, highlightColumn }) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const wrapperStyle: React.CSSProperties = {
    width: '100%',
    overflowX: 'auto',
    borderRadius: '12px',
    border: '1px solid #2a3a52',
    backgroundColor: '#111827',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  };

  const thStyle = (colIndex: number): React.CSSProperties => ({
    padding: '14px 20px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#64748b',
    backgroundColor: '#0d1117',
    borderBottom: '1px solid #2a3a52',
    whiteSpace: 'nowrap',
    ...(highlightColumn !== undefined && colIndex === highlightColumn
      ? {
          color: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
        }
      : {}),
  });

  const tdStyle = (rowIndex: number, colIndex: number): React.CSSProperties => ({
    padding: '14px 20px',
    color: '#e2e8f0',
    borderBottom:
      rowIndex < rows.length - 1 ? '1px solid rgba(42, 58, 82, 0.5)' : 'none',
    backgroundColor:
      hoveredRow === rowIndex
        ? 'rgba(26, 35, 50, 0.5)'
        : highlightColumn !== undefined && colIndex === highlightColumn
          ? 'rgba(59, 130, 246, 0.03)'
          : 'transparent',
    transition: 'background-color 0.15s ease',
    lineHeight: 1.6,
  });

  return (
    <div style={wrapperStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th key={i} style={thStyle(i)}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onMouseEnter={() => setHoveredRow(rowIndex)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {row.map((cell, colIndex) => (
                <td key={colIndex} style={tdStyle(rowIndex, colIndex)}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
