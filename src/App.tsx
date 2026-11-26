import React from 'react';
import { PulseLinkProvider, usePulseLink } from './context/PulseLinkContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { VerificationGatePage } from './components/auth/VerificationGatePage';

const AppContent: React.FC = () => {
  const { viewMode, isGateApproved } = usePulseLink();

  return (
    <div className="min-h-screen bg-bottle-800 text-bone-100 flex flex-col font-sans selection:bg-vermilion selection:text-bone-50">
      <Navbar />
      
      {/* Main Container with Retractable Left Sidebar & Dynamic Layout Shift */}
      <div className="flex-1 flex overflow-hidden relative">
        {isGateApproved && viewMode !== 'login' && <Sidebar />}
        <main className="flex-1 min-w-0 overflow-y-auto transition-all duration-300 ease-in-out">
          {viewMode === 'login' || !isGateApproved ? (
            <VerificationGatePage />
          ) : viewMode === 'landing' ? (
            <LandingPage />
          ) : (
            <DashboardLayout />
          )}
        </main>
      </div>

      {/* Persistent subtle footer governance badge */}
      <div className="bg-bottle-950/80 border-t border-bottle-800 py-2.5 px-4 text-center text-[11px] font-mono text-bone-400">
        <span className="text-amber font-semibold">Governance Notice:</span> Prototype Simulation — Synthetic Data Only. Decision-support tool; final clinical and allocation authority remains with authorized medical teams.
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PulseLinkProvider>
      <AppContent />
    </PulseLinkProvider>
  );
};

export default App;
