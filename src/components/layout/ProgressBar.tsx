import { useEffect, useState, type CSSProperties } from 'react';

const barContainer: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: 3,
  zIndex: 1100,
  background: 'transparent',
  pointerEvents: 'none',
};

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setProgress(0);
        return;
      }
      const pct = Math.min((scrollTop / docHeight) * 100, 100);
      setProgress(pct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const barFill: CSSProperties = {
    height: '100%',
    width: `${progress}%`,
    background: 'linear-gradient(90deg, var(--accent), var(--accent2), var(--accent3))',
    borderRadius: '0 2px 2px 0',
    transition: 'width 0.1s linear',
  };

  return (
    <div style={barContainer}>
      <div style={barFill} />
    </div>
  );
}
