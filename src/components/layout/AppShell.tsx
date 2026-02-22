import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import ProgressBar from './ProgressBar';
import CommandPalette from '../shared/CommandPalette';
import ScrollToTop from '../shared/ScrollToTop';
import { useWindowWidth } from '../../hooks/useWindowWidth';

const MOBILE_BP = 768;
const TABLET_BP = 1080;

const shellStyle: React.CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
  paddingTop: 60,
};

export default function AppShell() {
  const width = useWindowWidth();
  const mobile = width < MOBILE_BP;
  const tablet = width >= MOBILE_BP && width < TABLET_BP;
  const [searchOpen, setSearchOpen] = useState(false);

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleCloseSearch = useCallback(() => setSearchOpen(false), []);
  const handleOpenSearch = useCallback(() => setSearchOpen(true), []);

  const mainStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    padding: mobile
      ? '0 1rem 2rem'
      : tablet
        ? '0 1.5rem 3rem'
        : '0 3rem 4rem',
    maxWidth: 1200,
    marginLeft: mobile ? 0 : 260,
  };

  return (
    <>
      <ProgressBar />
      <TopNav onOpenSearch={handleOpenSearch} />
      <div style={shellStyle}>
        <Sidebar />
        <main style={mainStyle}>
          <Outlet />
        </main>
      </div>
      <ScrollToTop />
      <CommandPalette isOpen={searchOpen} onClose={handleCloseSearch} />
    </>
  );
}
