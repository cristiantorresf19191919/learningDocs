import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import ProgressBar from './ProgressBar';

const shellStyle: React.CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
  paddingTop: 60,
};

const mainStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: '0 3rem 4rem 3rem',
  maxWidth: 1200,
  marginLeft: 260,
};

export default function AppShell() {
  return (
    <>
      <ProgressBar />
      <TopNav />
      <div style={shellStyle}>
        <Sidebar />
        <main style={mainStyle}>
          <Outlet />
        </main>
      </div>
    </>
  );
}
