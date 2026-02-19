import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import ProgressBar from './ProgressBar';

const shellStyle: React.CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
  paddingTop: 60, // height of TopNav
};

const mainStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: '0 2.5rem 4rem 2.5rem',
  maxWidth: 960,
  marginLeft: 260, // sidebar width
};

export default function AppShell() {
  return (
    <>
      <ProgressBar />
      <TopNav />
      <div style={shellStyle}>
        <Sidebar
          sections={[]}
        />
        <main style={mainStyle}>
          <Outlet />
        </main>
      </div>
    </>
  );
}
