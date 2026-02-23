import { Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import FIArchitecturePage from './pages/FIArchitecturePage';
import ProductsApiPage from './pages/ProductsApiPage';
import SyncFlowsPage from './pages/SyncFlowsPage';
import OdysseyDeepDivePage from './pages/OdysseyDeepDivePage';
import OwnershipLandingPage from './pages/OwnershipLandingPage';
import BackendServicesPage from './pages/BackendServicesPage';
import OdysseyPipelinePage from './pages/OdysseyPipelinePage';
import OdysseyEndpointsPage from './pages/OdysseyEndpointsPage';
import OdysseyServicesPage from './pages/OdysseyServicesPage';
import OdysseyGradlePage from './pages/OdysseyGradlePage';
import OdysseySystemOverviewPage from './pages/OdysseySystemOverviewPage';
import CronDeepDivePage from './pages/CronDeepDivePage';
import InventorySyncPage from './pages/InventorySyncPage';
import SrpSearchPage from './pages/SrpSearchPage';
import GraphqlExposurePage from './pages/GraphqlExposurePage';
import DeploymentConfigPage from './pages/DeploymentConfigPage';
import GlossaryPage from './pages/GlossaryPage';
import ReactorOperatorsPage from './pages/ReactorOperatorsPage';
import SearchPipelinePage from './pages/SearchPipelinePage';
import EdsImportPipelinePage from './pages/EdsImportPipelinePage';
import SearchFlowDeepDivePage from './pages/SearchFlowDeepDivePage';
import OdysseyDocumentationPage from './pages/OdysseyDocumentationPage';
import OdysseySearchQueryLogicPage from './pages/OdysseySearchQueryLogicPage';
import OdysseyTechnicalGuidePage from './pages/OdysseyTechnicalGuidePage';

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
        <Route path="/ownership-landing" element={<OwnershipLandingPage />} />
        <Route path="/backend-services" element={<BackendServicesPage />} />
        <Route path="/odyssey-pipelines" element={<OdysseyPipelinePage />} />
        <Route path="/odyssey-endpoints" element={<OdysseyEndpointsPage />} />
        <Route path="/odyssey-services" element={<OdysseyServicesPage />} />
        <Route path="/odyssey-gradle" element={<OdysseyGradlePage />} />
        <Route path="/system-overview" element={<OdysseySystemOverviewPage />} />
        <Route path="/cron-deep-dive" element={<CronDeepDivePage />} />
        <Route path="/inventory-sync" element={<InventorySyncPage />} />
        <Route path="/srp-search" element={<SrpSearchPage />} />
        <Route path="/graphql-exposure" element={<GraphqlExposurePage />} />
        <Route path="/deployment-config" element={<DeploymentConfigPage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="/reactor-operators" element={<ReactorOperatorsPage />} />
        <Route path="/search-pipeline" element={<SearchPipelinePage />} />
        <Route path="/eds-import-pipeline" element={<EdsImportPipelinePage />} />
        <Route path="/search-flow-deep-dive" element={<SearchFlowDeepDivePage />} />
        <Route path="/odyssey-documentation" element={<OdysseyDocumentationPage />} />
        <Route path="/odyssey-search-query-logic" element={<OdysseySearchQueryLogicPage />} />
        <Route path="/odyssey-technical-guide" element={<OdysseyTechnicalGuidePage />} />
      </Route>
    </Routes>
  );
}
