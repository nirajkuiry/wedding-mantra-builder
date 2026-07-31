import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';

const Landing = lazy(() => import('./pages/Landing'));
const Builder = lazy(() => import('./pages/Builder'));
const PackageFlow = lazy(() => import('./pages/PackageFlow'));
const Settings = lazy(() => import('./pages/Settings'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function PageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="font-display text-lg text-gold/70">Loading…</span>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/packages" element={<PackageFlow />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
