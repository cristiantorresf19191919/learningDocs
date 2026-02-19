import { Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import FIArchitecturePage from './pages/FIArchitecturePage';
import ProductsApiPage from './pages/ProductsApiPage';
import SyncFlowsPage from './pages/SyncFlowsPage';
import OdysseyDeepDivePage from './pages/OdysseyDeepDivePage';

/* ---------- routes ---------- */

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products-api" element={<ProductsApiPage />} />
        <Route path="/fi-architecture" element={<FIArchitecturePage />} />
        <Route path="/sync-flows" element={<SyncFlowsPage />} />
        <Route path="/odyssey-deep-dive" element={<OdysseyDeepDivePage />} />
      </Route>
    </Routes>
  );
}
