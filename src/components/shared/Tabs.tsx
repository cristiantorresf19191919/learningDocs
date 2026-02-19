import React, { useState, useRef, useEffect } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeTab = tabRefs.current[activeIndex];
    if (activeTab) {
      setIndicatorStyle({
        width: `${activeTab.offsetWidth}px`,
        transform: `translateX(${activeTab.offsetLeft}px)`,
      });
    }
  }, [activeIndex]);

  const containerStyle: React.CSSProperties = {
    width: '100%',
  };

  const tabBarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#111827',
    borderRadius: '10px',
    padding: '4px',
    border: '1px solid #2a3a52',
    marginBottom: '20px',
    overflowX: 'auto',
  };

  const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
    position: 'relative',
    zIndex: 1,
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: isActive ? 600 : 500,
    color: isActive ? '#e2e8f0' : '#64748b',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  });

  const activeIndicatorStyle: React.CSSProperties = {
    position: 'absolute',
    top: '4px',
    left: 0,
    height: 'calc(100% - 8px)',
    backgroundColor: '#1a2332',
    borderRadius: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    border: '1px solid #2a3a52',
    ...indicatorStyle,
  };

  const panelStyle: React.CSSProperties = {
    backgroundColor: '#111827',
    border: '1px solid #2a3a52',
    borderRadius: '12px',
    padding: '24px',
    minHeight: '100px',
  };

  return (
    <div style={containerStyle}>
      <div style={tabBarStyle}>
        <div style={activeIndicatorStyle} />
        {tabs.map((tab, index) => (
          <button
            key={index}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            style={tabButtonStyle(index === activeIndex)}
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={panelStyle}>
        {tabs[activeIndex]?.content}
      </div>
    </div>
  );
};

export default Tabs;
