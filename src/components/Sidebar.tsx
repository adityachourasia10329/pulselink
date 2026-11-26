import React from 'react';
import { usePulseLink, type PulseLinkTab } from '../context/PulseLinkContext';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Home,
  LayoutDashboard,
  ClipboardList,
  Heart,
  Droplet,
  Pill,
  Building,
  Users,
  CheckSquare,
  Scale,
  FileCheck,
  HelpCircle,
  Activity,
  FileText,
  ShieldCheck,
  Lock,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    isSidebarOpen,
    toggleSidebar,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    activeSubFocus,
    setActiveSubFocus,
    guardNavigation,
    isGateApproved,
    isCommonUser,
    isMedicalStaff,
    isGovEmployee,
    canViewRequestsPanel,
    corridors,
    organTransfers,
    bloodRequests,
    isExcursionActive,
    hospitalRegistry,
    patientRegistry,
    allocationConsole,
    userInquiries,
    currentUser
  } = usePulseLink();

  const handleNavClick = (
    tab?: PulseLinkTab,
    mode: 'landing' | 'dashboard' | 'login' = 'dashboard',
    subFocus?: 'all' | 'organ' | 'blood' | 'medicine'
  ) => {
    if (!isGateApproved) {
      guardNavigation(tab, mode);
      return;
    }
    const permitted = guardNavigation(tab, mode);
    if (permitted) {
      setViewMode(mode);
      if (tab) setActiveTab(tab);
      if (subFocus) setActiveSubFocus(subFocus);
    }
  };

  const urgentOrgan = organTransfers.find(o => o.remainingSeconds < 3600);
  const pendingAllocations = allocationConsole.filter(a => a.officerApprovalStatus === 'PENDING').length;
  const activeCorridorCount = corridors.filter(c => c.policeClearanceActive).length;

  // Item 5: The tabs which reside inside the website should not be visible to someone who is on the login page
  if (!isGateApproved || viewMode === 'login') {
    return null;
  }

  return (
    <>
      {/* 
        When closed, ONLY the opening option is visible.
        Sleek edge-docked trigger tab pinned to left screen edge 
      */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          title="Open Navigation Menu"
          aria-label="Open Navigation Menu"
          className="fixed left-0 top-1/3 -translate-y-1/2 z-40 bg-bottle-950/95 hover:bg-bottle-900 text-bone-200 hover:text-bone-100 pl-2 pr-2.5 py-4 rounded-r-xl border-y border-r border-bottle-600 shadow-2xl backdrop-blur-md flex flex-col items-center gap-2 group transition-all"
        >
          <PanelLeftOpen className="w-4 h-4 text-sage group-hover:scale-125 transition-transform" />
          <span className="text-[10px] font-mono tracking-widest uppercase [writing-mode:vertical-lr] rotate-180 text-bone-300 group-hover:text-bone-100 font-bold">
            TABS
          </span>
        </button>
      )}

      {/* 
        Retractable Left Sidebar Container:
        Smooth transition for width, shifting the sibling main content area 
      */}
      <aside
        className={`shrink-0 bg-bottle-950/95 backdrop-blur-md border-r border-bottle-700/80 flex flex-col transition-all duration-300 ease-in-out select-none z-20 ${
          isSidebarOpen
            ? 'w-64 lg:w-72 opacity-100'
            : 'w-0 overflow-hidden border-r-0 opacity-0 pointer-events-none'
        }`}
        style={{ minWidth: isSidebarOpen ? undefined : 0 }}
      >
        {/* Sidebar Header with Retractable Close Button */}
        <div className="h-14 px-4 border-b border-bottle-700/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-bone-100">
              Operations Menu
            </span>
          </div>

          <button
            onClick={toggleSidebar}
            title="Collapse Navigation Sidebar"
            aria-label="Collapse Navigation Sidebar"
            className="p-1.5 rounded-lg text-bone-400 hover:text-bone-100 hover:bg-bottle-800 transition-colors flex items-center gap-1 group"
          >
            <span className="text-[10px] font-mono uppercase text-bone-400 group-hover:text-bone-200 hidden sm:inline">Close</span>
            <PanelLeftClose className="w-4 h-4 text-bone-300 group-hover:text-bone-100 transition-transform group-hover:-translate-x-0.5" />
          </button>
        </div>

        {/* User Context & Role Pill */}
        <div className="p-3 border-b border-bottle-800/80 bg-bottle-900/40 shrink-0">
          <div className="flex items-center justify-between text-[11px] font-mono text-bone-300">
            <span className="truncate max-w-[140px] font-semibold text-bone-200">
              {currentUser.name}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
              isGateApproved ? 'bg-sage/20 text-sage border border-sage/30' : 'bg-amber/20 text-amber border border-amber/30'
            }`}>
              {isGateApproved ? 'Gate Cleared' : 'Intake Gate'}
            </span>
          </div>
          <p className="text-[10px] text-bone-400 capitalize mt-0.5 truncate">
            {isCommonUser 
              ? 'Patient / Family Interface' 
              : isMedicalStaff 
              ? 'Medical Staff Interface' 
              : isGovEmployee 
              ? 'Govt Registry Console' 
              : 'PulseLink Command'}
          </p>
        </div>

        {/* Scrollable Navigation Tabs List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          
          {/* Gate Locked Warning if not approved */}
          {!isGateApproved && (
            <div className="px-2 py-2.5 rounded-xl bg-amber/10 border border-amber/30 text-amber text-xs font-mono space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>Intake Gate Pending</span>
              </div>
              <p className="text-[11px] text-bone-300 font-sans">
                Complete intake clearance to unlock all operations tabs.
              </p>
              <button
                onClick={() => setViewMode('login')}
                className="w-full mt-1 px-2.5 py-1 rounded bg-amber text-bottle-950 font-bold text-[11px] hover:bg-amber-light transition-all"
              >
                Go to Intake Gate
              </button>
            </div>
          )}

          {/* A. COMMON USER INTERFACE (Patient / Patient's Family) */}
          {isCommonUser ? (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-bone-400 font-semibold">
                Patient Services
              </div>

              <button
                onClick={() => handleNavClick('user_availability')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  viewMode === 'dashboard' && activeTab === 'user_availability'
                    ? 'bg-cobalt text-white shadow-md font-semibold border-l-4 border-sage'
                    : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Activity className="w-4 h-4 text-sage" />
                  <span>Availability (Organ, Blood, Meds)</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bottle-950 text-bone-300">
                  {organTransfers.length + bloodRequests.length}
                </span>
              </button>

              <button
                onClick={() => handleNavClick('user_registrations')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  viewMode === 'dashboard' && activeTab === 'user_registrations'
                    ? 'bg-cobalt text-white shadow-md font-semibold border-l-4 border-sage'
                    : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                }`}
              >
                <FileText className="w-4 h-4 text-bone-300" />
                <span>Government Registrations &amp; Help</span>
              </button>

              <button
                onClick={() => handleNavClick('user_inquiries')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  viewMode === 'dashboard' && activeTab === 'user_inquiries'
                    ? 'bg-cobalt text-white shadow-md font-semibold border-l-4 border-sage'
                    : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <HelpCircle className="w-4 h-4 text-sage" />
                  <span>Direct Inquiries</span>
                </div>
                {userInquiries.length > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bottle-950 text-bone-300">
                    {userInquiries.length}
                  </span>
                )}
              </button>
            </div>
          ) : isMedicalStaff ? (
            /* B. MEDICAL STAFF INTERFACE */
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-bone-400 font-semibold">
                Clinical Workflow
              </div>

              <button
                onClick={() => handleNavClick(undefined, 'landing')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  viewMode === 'landing'
                    ? 'bg-bottle-700 text-bone-100 shadow-md font-semibold border-l-4 border-cobalt'
                    : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                }`}
              >
                <Home className="w-4 h-4 text-bone-300" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => handleNavClick('requests', 'dashboard', 'all')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  viewMode === 'dashboard' && activeTab === 'requests' && activeSubFocus === 'all'
                    ? 'bg-cobalt text-white shadow-md font-semibold border-l-4 border-sage'
                    : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <ClipboardList className="w-4 h-4" />
                  <span>Responds &amp; Requests</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bottle-950 text-bone-300">
                  {organTransfers.length + bloodRequests.length}
                </span>
              </button>

              <button
                onClick={() => handleNavClick('requests', 'dashboard', 'organ')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  viewMode === 'dashboard' && activeTab === 'requests' && activeSubFocus === 'organ'
                    ? 'bg-cobalt text-white shadow-md font-semibold border-l-4 border-vermilion'
                    : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Heart className="w-4 h-4 text-vermilion" />
                  <span>Organ</span>
                </div>
                {urgentOrgan && (
                  <span className="w-2 h-2 rounded-full bg-vermilion animate-ping" />
                )}
              </button>

              <button
                onClick={() => handleNavClick('requests', 'dashboard', 'blood')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  viewMode === 'dashboard' && activeTab === 'requests' && activeSubFocus === 'blood'
                    ? 'bg-cobalt text-white shadow-md font-semibold border-l-4 border-cobalt'
                    : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Droplet className="w-4 h-4 text-cobalt" />
                  <span>Blood</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bottle-950 text-bone-300">
                  {bloodRequests.length}
                </span>
              </button>

              <button
                onClick={() => handleNavClick('medicine', 'dashboard', 'medicine')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  viewMode === 'dashboard' && activeTab === 'medicine'
                    ? 'bg-cobalt text-white shadow-md font-semibold border-l-4 border-sage'
                    : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Pill className="w-4 h-4 text-sage" />
                  <span>Medicines &amp; Test-Kit</span>
                </div>
                {isExcursionActive && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-vermilion text-white font-bold animate-pulse">
                    Alert!
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('medical_reports')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  viewMode === 'dashboard' && activeTab === 'medical_reports'
                    ? 'bg-cobalt text-white shadow-md font-semibold border-l-4 border-sage'
                    : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                }`}
              >
                <FileText className="w-4 h-4 text-sage" />
                <span>Medical Files &amp; Tests</span>
              </button>

              <button
                onClick={() => handleNavClick('corridors', 'dashboard', 'all')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  viewMode === 'dashboard' && activeTab === 'corridors'
                    ? 'bg-cobalt text-white shadow-md font-semibold border-l-4 border-cobalt'
                    : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                }`}
                title="Medical Staff Console (Map & Location Restricted per Rule 1.2a)"
              >
                <LayoutDashboard className="w-4 h-4 text-bone-300" />
                <span>Command Center (ETA Tracking)</span>
              </button>
            </div>
          ) : (
            /* C & D. GOVERNMENT EMPLOYEE & PULSELINK OPS (FULL ACCESS) */
            <div className="space-y-4">
              {/* Operations Section */}
              <div className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-bone-400 font-semibold">
                  Core Dispatch
                </div>

                <button
                  onClick={() => handleNavClick(undefined, 'landing')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    viewMode === 'landing'
                      ? 'bg-bottle-700 text-bone-100 shadow-md font-semibold border-l-4 border-cobalt'
                      : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                  }`}
                >
                  <Home className="w-4 h-4 text-bone-300" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => handleNavClick('corridors', 'dashboard', 'all')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    viewMode === 'dashboard' && activeTab === 'corridors'
                      ? 'bg-cobalt text-white shadow-md font-semibold border-l-4 border-sage'
                      : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Command Center (Map)</span>
                  </div>
                  {activeCorridorCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-sage animate-ping-slow" />
                  )}
                </button>

                {canViewRequestsPanel && (
                  <button
                    onClick={() => handleNavClick('requests', 'dashboard', 'all')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      viewMode === 'dashboard' && activeTab === 'requests' && activeSubFocus === 'all'
                        ? 'bg-cobalt text-white shadow-md font-semibold border-l-4 border-sage'
                        : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <ClipboardList className="w-4 h-4" />
                      <span>Requests Panel</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bottle-950 text-bone-300">
                      {organTransfers.length + bloodRequests.length}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => handleNavClick('requests', 'dashboard', 'organ')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    viewMode === 'dashboard' && activeTab === 'requests' && activeSubFocus === 'organ'
                      ? 'bg-cobalt text-white shadow-md font-semibold border-l-4 border-vermilion'
                      : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Heart className="w-4 h-4 text-vermilion" />
                    <span>Organ</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bottle-950 text-bone-300">
                    {organTransfers.length}
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('requests', 'dashboard', 'blood')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    viewMode === 'dashboard' && activeTab === 'requests' && activeSubFocus === 'blood'
                      ? 'bg-cobalt text-white shadow-md font-semibold border-l-4 border-cobalt'
                      : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Droplet className="w-4 h-4 text-cobalt" />
                    <span>Blood</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bottle-950 text-bone-300">
                    {bloodRequests.length}
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('medicine', 'dashboard', 'medicine')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    viewMode === 'dashboard' && activeTab === 'medicine'
                      ? 'bg-cobalt text-white shadow-md font-semibold border-l-4 border-sage'
                      : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Pill className="w-4 h-4 text-sage" />
                    <span>Medicines</span>
                  </div>
                  {isExcursionActive && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-vermilion text-white font-bold animate-pulse">
                      Excursion
                    </span>
                  )}
                </button>
              </div>

              {/* Government Registries & Allocation Section */}
              <div className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-bone-400 font-semibold">
                  Registries &amp; Governance
                </div>

                <button
                  onClick={() => handleNavClick('hospital_registry')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    viewMode === 'dashboard' && activeTab === 'hospital_registry'
                      ? 'bg-cobalt text-white shadow-md font-semibold border-l-4 border-bone-300'
                      : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Building className="w-4 h-4 text-bone-300" />
                    <span>Hospital Registry</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bottle-950 text-bone-300">
                    {hospitalRegistry.length}
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('patient_registry')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    viewMode === 'dashboard' && activeTab === 'patient_registry'
                      ? 'bg-cobalt text-white shadow-md font-semibold border-l-4 border-sage'
                      : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Users className="w-4 h-4 text-sage" />
                    <span>Patient Registry</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bottle-950 text-bone-300">
                    {patientRegistry.length}
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('allocation_console')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    viewMode === 'dashboard' && activeTab === 'allocation_console'
                      ? 'bg-vermilion text-white shadow-md font-semibold border-l-4 border-white'
                      : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <CheckSquare className="w-4 h-4 text-bone-100" />
                    <span>Allocation &amp; Deallocation</span>
                  </div>
                  {pendingAllocations > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bottle-950 text-vermilion font-bold">
                      {pendingAllocations}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleNavClick('fairroute')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    viewMode === 'dashboard' && activeTab === 'fairroute'
                      ? 'bg-cobalt text-white shadow-md font-semibold border-l-4 border-cobalt'
                      : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                  }`}
                >
                  <Scale className="w-4 h-4 text-bone-300" />
                  <span>FairRoute Decision Support</span>
                </button>

                <button
                  onClick={() => handleNavClick('audit')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    viewMode === 'dashboard' && activeTab === 'audit'
                      ? 'bg-cobalt text-white shadow-md font-semibold border-l-4 border-bone-300'
                      : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/80'
                  }`}
                >
                  <FileCheck className="w-4 h-4 text-bone-300" />
                  <span>ClearChain Audit Trail</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer with Intake Gate Clearance Shortcut */}
        <div className="p-3 border-t border-bottle-800 bg-bottle-950 shrink-0 space-y-2">
          <button
            onClick={() => setViewMode('login')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all border bg-bottle-900/80 border-bottle-700 text-bone-300 hover:text-bone-100 hover:border-bottle-600"
          >
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-sage" />
              <span>Intake Clearance Gate</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-bone-400" />
          </button>

          <div className="flex items-center justify-between text-[10px] font-mono text-bone-400 px-1 pt-1">
            <span>PulseLink v2.6</span>
            <button
              onClick={toggleSidebar}
              className="hover:text-bone-200 underline flex items-center gap-1"
            >
              <span>Retract</span>
              <PanelLeftClose className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
