import React, { useState } from 'react';
import { usePulseLink, type PulseLinkTab } from '../context/PulseLinkContext';
import {
  ChevronDown,
  User,
  Clock,
  Flame,
  LayoutDashboard,
  Home,
  ClipboardList,
  Droplet,
  Pill,
  ChevronRight,
  MapPin,
  Check,
  Volume2,
  VolumeX,
  Building,
  Users,
  CheckSquare,
  HelpCircle,
  FileText,
  Heart,
  Shield,
  Activity
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    activeSubFocus,
    setActiveSubFocus,
    currentRole,
    setCurrentRole,
    currentUser,
    allProfiles,
    selectedCity,
    setSelectedCity,
    supportedCities,
    verificationUser,
    audioMuted,
    toggleAudioMute,
    currentTimeString,
    organTransfers,
    isExcursionActive,
    isGateApproved,
    guardNavigation,
    isCommonUser,
    isMedicalStaff,
    canViewRequestsPanel
  } = usePulseLink();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  // Check if any organ is under 60 minutes
  const urgentOrgan = organTransfers.find(o => o.remainingSeconds < 3600);

  const handleNavClick = (tab?: PulseLinkTab, mode: 'landing' | 'dashboard' | 'login' = 'dashboard') => {
    if (!isGateApproved) {
      guardNavigation(tab, mode);
      return;
    }
    const permitted = guardNavigation(tab, mode);
    if (permitted) {
      setViewMode(mode);
      if (tab) setActiveTab(tab);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-bottle-900/95 backdrop-blur-md border-b border-bottle-700/80 transition-all">

      {/* 7) Continuous Right-to-Left News Headline Ticker */}
      <div className="bg-cobalt text-white text-xs font-mono font-medium py-1 px-4 overflow-hidden shadow-sm border-b border-cobalt-dark flex items-center relative select-none">
        <div className="animate-headline-ticker inline-flex items-center space-x-12">
          {urgentOrgan || isExcursionActive ? (
            <>
              <span className="flex items-center space-x-2 text-white font-bold tracking-wide">
                <Flame className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>CRITICAL DISPATCH ALERT:</span>
                {urgentOrgan && (
                  <span>
                    {urgentOrgan.organ.toUpperCase()} COLD ISCHEMIA WINDOW &lt; 60 MIN ({Math.floor(urgentOrgan.remainingSeconds / 60)}m {urgentOrgan.remainingSeconds % 60}s remaining) • Destination: {urgentOrgan.recipientHospital} • Preemption Code: RED-7
                  </span>
                )}
                {isExcursionActive && (
                  <span className="ml-3 underline font-semibold">
                    • ESP32 COLD-CHAIN BREACH: Temperature 11.4°C in Transit Box #04!
                  </span>
                )}
              </span>
              <span className="text-white/80">
                • Traffic Police Clearance Active in {selectedCity.name} • Priority Corridor Code-1 Alpha
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center space-x-2 text-white/95 font-medium tracking-wide">
                <span className="w-2 h-2 rounded-full bg-sage inline-block animate-pulse" />
                <span className="font-bold">ALL SYSTEMS NOMINAL:</span>
                <span>
                  No active medical transport urgencies across {selectedCity.name} grid. Regional organ cold-chains, blood transfusion banks, and verified essential medicine supply routes operating in safe state.
                </span>
              </span>
              <span className="text-white/75">
                • Green Corridors on Standby • Traffic Signal Preemption Ready • ESP32 Sensors Nominal (2.0°C – 8.0°C Safe Band)
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Bar - Full width edge-to-edge pushing PulseLink to top-left corner */}
      <div className="w-full px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Left Top Corner: New PulseLink India Tricolor & Heart Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <button
              onClick={() => handleNavClick(undefined, 'landing')}
              className="flex items-center text-left group focus:outline-none"
              title="PulseLink Overview"
            >
              <div className="bg-white px-2 py-0.5 rounded-lg shadow-md border border-bottle-700/60 group-hover:scale-105 transition-transform flex items-center h-9">
                <img 
                  src="/pulselink-logo.jpg" 
                  alt="PulseLink" 
                  className="h-7 w-auto object-contain" 
                />
              </div>
            </button>

            {/* City Selector Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center space-x-1 text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 bg-bottle-950/90 hover:bg-bottle-800 text-bone-200 hover:text-bone-100 rounded-md border border-bottle-700 hover:border-cobalt transition-all shadow-sm group"
                title="Click to change operating city grid"
              >
                <MapPin className="w-3 h-3 text-sage group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-bone-100">v2.6 {selectedCity.name}</span>
                <ChevronDown className={`w-3 h-3 text-bone-400 group-hover:text-bone-200 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* City Dropdown Menu */}
              {cityDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-72 sm:w-80 bg-bottle-900 border border-bottle-600 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="px-3.5 py-2 border-b border-bottle-700/80">
                    <p className="text-[10px] uppercase font-mono tracking-wider text-bone-400">
                      Switch Healthcare Operations Grid
                    </p>
                    <p className="text-xs text-bone-200 font-sans mt-0.5 font-medium">
                      Select City Network (9 Operational Hubs)
                    </p>
                  </div>

                  <div className="max-h-72 overflow-y-auto py-1">
                    {supportedCities.map(city => {
                      const isSelected = city.id === selectedCity.id;
                      return (
                        <button
                          key={city.id}
                          onClick={() => {
                            setSelectedCity(city);
                            setCityDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 flex items-start space-x-3 transition-colors ${isSelected
                            ? 'bg-bottle-700/70 text-bone-100 border-l-2 border-cobalt'
                            : 'hover:bg-bottle-800/80 text-bone-300 hover:text-bone-100'
                            }`}
                        >
                          <div className="mt-0.5">
                            {isSelected ? (
                              <Check className="w-4 h-4 text-cobalt" />
                            ) : (
                              <MapPin className="w-4 h-4 text-bone-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-bone-100">
                                {city.name}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bottle-950 border border-bottle-700 text-bone-300 uppercase">
                                {city.code}
                              </span>
                            </div>
                            <p className="text-[11px] text-bone-300 font-sans mt-0.5">
                              {city.state}
                            </p>
                            <p className="text-[10px] text-bone-400 font-mono mt-0.5 line-clamp-1">
                              {city.activeHospitals} Hospitals • {city.activeCorridors} Active Corridors
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* User Verification Pill without "B2B:" prefix */}
            <button
              onClick={() => setViewMode('login')}
              title="Click to view statutory verification gate intake & clearance"
              className={`hidden md:inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border text-xs font-mono transition-all ${viewMode === 'login'
                ? 'border-cobalt bg-cobalt/20 text-bone-100 ring-1 ring-cobalt'
                : 'border-bottle-700 bg-bottle-950/90 text-bone-200 hover:border-bottle-600'
                }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isGateApproved ? 'bg-sage' : 'bg-amber'} animate-pulse`} />
              <span className="truncate max-w-[120px] lg:max-w-[170px]">
                {verificationUser ? `${verificationUser.fullName} (${verificationUser.workOrganisation})` : 'Verify Access'}
              </span>
              <ChevronRight className="w-3 h-3 text-bone-300" />
            </button>
          </div>

          {/* Center Navigation Tabs: TAILORED ACCORDING TO ROLE & VISIBILITY GUARDRAILS */}
          <nav className="flex items-center bg-bottle-950/90 p-1 rounded-xl border border-bottle-700/80 space-x-1 shrink-0 overflow-x-auto max-w-full">
            
            {/* If NOT yet gate approved, show locked gate notice or intake shortcut */}
            {!isGateApproved ? (
              <button
                onClick={() => setViewMode('login')}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono text-amber bg-amber/10 border border-amber/40 animate-pulse font-semibold"
              >
                <Shield className="w-3.5 h-3.5 text-amber" />
                <span>Complete Intake Clearance to Unlock Tabs</span>
              </button>
            ) : isCommonUser ? (
              /* A. COMMON USER INTERFACE (Patient / Patient's Family) */
              <>
                <button
                  onClick={() => handleNavClick('user_availability')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                    viewMode === 'dashboard' && activeTab === 'user_availability'
                      ? 'bg-cobalt text-white shadow-sm font-semibold'
                      : 'text-bone-300 hover:text-bone-100'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-sage" />
                  <span>Availability (Organ, Blood, Meds)</span>
                </button>

                <button
                  onClick={() => handleNavClick('user_registrations')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                    viewMode === 'dashboard' && activeTab === 'user_registrations'
                      ? 'bg-cobalt text-white shadow-sm font-semibold'
                      : 'text-bone-300 hover:text-bone-100'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-bone-300" />
                  <span>Government Registrations &amp; Help</span>
                </button>

                <button
                  onClick={() => handleNavClick('user_inquiries')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                    viewMode === 'dashboard' && activeTab === 'user_inquiries'
                      ? 'bg-cobalt text-white shadow-sm font-semibold'
                      : 'text-bone-300 hover:text-bone-100'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-sage" />
                  <span>Direct Inquiries</span>
                </button>
              </>
            ) : isMedicalStaff ? (
              /* B. MEDICAL STAFF INTERFACE */
              <>
                <button
                  onClick={() => handleNavClick(undefined, 'landing')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                    viewMode === 'landing'
                      ? 'bg-bottle-700 text-bone-100 shadow-sm border border-bottle-600 font-semibold'
                      : 'text-bone-300 hover:text-bone-100'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => {
                    handleNavClick('requests');
                    setActiveSubFocus('all');
                  }}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                    viewMode === 'dashboard' && activeTab === 'requests' && activeSubFocus === 'all'
                      ? 'bg-cobalt text-white shadow-sm font-semibold'
                      : 'text-bone-300 hover:text-bone-100'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Responds &amp; Requests</span>
                </button>

                <button
                  onClick={() => {
                    handleNavClick('requests');
                    setActiveSubFocus('organ');
                  }}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                    viewMode === 'dashboard' && activeTab === 'requests' && activeSubFocus === 'organ'
                      ? 'bg-cobalt text-white shadow-sm font-semibold'
                      : 'text-bone-300 hover:text-bone-100'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-vermilion" />
                  <span>Organ</span>
                </button>

                <button
                  onClick={() => {
                    handleNavClick('requests');
                    setActiveSubFocus('blood');
                  }}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                    viewMode === 'dashboard' && activeTab === 'requests' && activeSubFocus === 'blood'
                      ? 'bg-cobalt text-white shadow-sm font-semibold'
                      : 'text-bone-300 hover:text-bone-100'
                  }`}
                >
                  <Droplet className="w-3.5 h-3.5 text-cobalt" />
                  <span>Blood</span>
                </button>

                <button
                  onClick={() => {
                    handleNavClick('medicine');
                    setActiveSubFocus('medicine');
                  }}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                    viewMode === 'dashboard' && activeTab === 'medicine'
                      ? 'bg-cobalt text-white shadow-sm font-semibold'
                      : 'text-bone-300 hover:text-bone-100'
                  }`}
                >
                  <Pill className="w-3.5 h-3.5 text-sage" />
                  <span>Medicines &amp; Test-Kit</span>
                </button>

                <button
                  onClick={() => handleNavClick('medical_reports')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                    viewMode === 'dashboard' && activeTab === 'medical_reports'
                      ? 'bg-cobalt text-white shadow-sm font-semibold'
                      : 'text-bone-300 hover:text-bone-100'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-sage" />
                  <span>Medical Files &amp; Tests</span>
                </button>

                {/* Command Center for Medical Staff (with Map excluded per Rule 1.2a) */}
                <button
                  onClick={() => {
                    handleNavClick('corridors');
                    setActiveSubFocus('all');
                  }}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    viewMode === 'dashboard' && activeTab === 'corridors'
                      ? 'bg-cobalt text-white shadow-sm'
                      : 'text-bone-300 hover:text-bone-100'
                  }`}
                  title="Medical Staff Operations Console (Map and Origin Location Restricted per Rule 1.2a)"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Command Center (ETA Tracking)</span>
                </button>
              </>
            ) : (
              /* C & D. GOVERNMENT EMPLOYEE & PULSELINK OPS (FULL ACCESS) */
              <>
                <button
                  onClick={() => handleNavClick(undefined, 'landing')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                    viewMode === 'landing'
                      ? 'bg-bottle-700 text-bone-100 shadow-sm border border-bottle-600 font-semibold'
                      : 'text-bone-300 hover:text-bone-100'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => {
                    handleNavClick('corridors');
                    setActiveSubFocus('all');
                  }}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    viewMode === 'dashboard' && activeTab === 'corridors'
                      ? 'bg-cobalt text-white shadow-sm'
                      : 'text-bone-300 hover:text-bone-100'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Command Center (Map)</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-sage animate-ping-slow ml-0.5" />
                </button>

                {canViewRequestsPanel && (
                  <button
                    onClick={() => {
                      handleNavClick('requests');
                      setActiveSubFocus('all');
                    }}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                      viewMode === 'dashboard' && activeTab === 'requests' && activeSubFocus === 'all'
                        ? 'bg-cobalt text-white shadow-sm font-semibold'
                        : 'text-bone-300 hover:text-bone-100'
                    }`}
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>Requests Panel</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    handleNavClick('requests');
                    setActiveSubFocus('organ');
                  }}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                    viewMode === 'dashboard' && activeTab === 'requests' && activeSubFocus === 'organ'
                      ? 'bg-cobalt text-white shadow-sm font-semibold'
                      : 'text-bone-300 hover:text-bone-100'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-vermilion" />
                  <span>Organ</span>
                </button>

                <button
                  onClick={() => {
                    handleNavClick('requests');
                    setActiveSubFocus('blood');
                  }}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                    viewMode === 'dashboard' && activeTab === 'requests' && activeSubFocus === 'blood'
                      ? 'bg-cobalt text-white shadow-sm font-semibold'
                      : 'text-bone-300 hover:text-bone-100'
                  }`}
                >
                  <Droplet className="w-3.5 h-3.5 text-cobalt" />
                  <span>Blood</span>
                </button>

                <button
                  onClick={() => {
                    handleNavClick('medicine');
                    setActiveSubFocus('medicine');
                  }}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                    viewMode === 'dashboard' && activeTab === 'medicine'
                      ? 'bg-cobalt text-white shadow-sm font-semibold'
                      : 'text-bone-300 hover:text-bone-100'
                  }`}
                >
                  <Pill className="w-3.5 h-3.5 text-sage" />
                  <span>Medicines</span>
                </button>

                {/* Section 2C Government Registries & Allocation Console */}
                <button
                  onClick={() => handleNavClick('hospital_registry')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                    viewMode === 'dashboard' && activeTab === 'hospital_registry'
                      ? 'bg-cobalt text-white shadow-sm font-semibold'
                      : 'text-bone-300 hover:text-bone-100'
                  }`}
                >
                  <Building className="w-3.5 h-3.5 text-bone-300" />
                  <span>Hospital Registry</span>
                </button>

                <button
                  onClick={() => handleNavClick('patient_registry')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                    viewMode === 'dashboard' && activeTab === 'patient_registry'
                      ? 'bg-cobalt text-white shadow-sm font-semibold'
                      : 'text-bone-300 hover:text-bone-100'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-sage" />
                  <span>Patient Registry</span>
                </button>

                <button
                  onClick={() => handleNavClick('allocation_console')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                    viewMode === 'dashboard' && activeTab === 'allocation_console'
                      ? 'bg-vermilion text-white shadow-sm font-semibold'
                      : 'text-bone-300 hover:text-bone-100'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5 text-bone-100" />
                  <span>Allocation &amp; Deallocation</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Action Tools: 6) IST Clock on left of profile + 3) Small Profile Option in Far Right Corner */}
          <div className="flex items-center space-x-2 shrink-0">

            {/* Live Clock IST */}
            <div className="flex items-center space-x-1.5 text-xs font-mono text-bone-300 bg-bottle-950/70 px-2 py-1 rounded-lg border border-bottle-700/60 whitespace-nowrap shadow-sm">
              <Clock className="w-3.5 h-3.5 text-sage" />
              <span>{currentTimeString || '23:42:00 IST'}</span>
            </div>

            {/* Audio Toggle Button */}
            <button
              onClick={toggleAudioMute}
              title={audioMuted ? "Unmute Command Audio Telemetry" : "Mute Command Audio Telemetry"}
              className={`p-1.5 rounded-lg border transition-all ${audioMuted
                ? 'border-bottle-700 text-bone-400 hover:text-bone-200 bg-bottle-950/60'
                : 'border-sage/40 bg-bottle-700/40 text-sage hover:bg-bottle-700/60'
                }`}
            >
              {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* 3) Small Profile Option (Far Right Corner - displays details ONLY when clicked) */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                title="Click to view profile details & switch persona"
                className="w-8 h-8 rounded-full bg-bottle-950 border border-bottle-700 hover:border-cobalt flex items-center justify-center text-bone-200 hover:text-bone-100 transition-all shadow-sm focus:outline-none"
              >
                <User className="w-4 h-4 text-bone-200" />
              </button>

              {/* Dropdown Menu - Displays details ONLY when clicked */}
              {roleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-bottle-900 border border-bottle-600 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3.5 py-2.5 border-b border-bottle-700">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-bottle-700 flex items-center justify-center text-bone-100 font-bold text-xs">
                        <User className="w-4 h-4 text-bone-200" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-bone-100 truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-bone-300 capitalize">{currentUser.role.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-bone-400 font-mono mt-1.5 truncate">{currentUser.institution}</p>
                    <p className="text-[10px] text-sage font-mono mt-0.5 capitalize">
                      Gate Status: {isGateApproved ? 'Cleared & Authenticated' : 'Intake Pending'}
                    </p>
                  </div>

                  <div className="px-3.5 py-1.5 border-b border-bottle-700/60">
                    <p className="text-[10px] uppercase font-mono tracking-wider text-bone-400">
                      Switch Active Persona / Role
                    </p>
                  </div>

                  <div className="py-1">
                    {allProfiles.map(profile => {
                      const isActive = profile.role === currentRole;
                      return (
                        <button
                          key={profile.id}
                          onClick={() => {
                            setCurrentRole(profile.role);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 flex items-start space-x-2.5 transition-colors ${isActive
                            ? 'bg-bottle-700/60 text-bone-100 border-l-2 border-cobalt'
                            : 'hover:bg-bottle-800 text-bone-300 hover:text-bone-100'
                            }`}
                        >
                          <div className="mt-0.5">
                            <span className={`inline-block w-2 h-2 rounded-full ${isActive ? 'bg-cobalt' : 'bg-bottle-600'}`} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-bone-100">{profile.name}</p>
                            <p className="text-[11px] text-bone-300">{profile.title}</p>
                            <p className="text-[10px] text-bone-400 font-mono mt-0.5">{profile.institution}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
