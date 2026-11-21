import React, { useState } from 'react';
import { usePulseLink } from '../context/PulseLinkContext';
import { 
  Heart, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  User, 
  Clock, 
  Flame,
  LayoutDashboard,
  Home,
  Palette,
  ClipboardList,
  Droplet,
  Pill,
  Lock,
  ChevronRight,
  MapPin,
  Check
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
    themeMode,
    toggleThemeMode
  } = usePulseLink();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  // Check if any organ is under 60 minutes
  const urgentOrgan = organTransfers.find(o => o.remainingSeconds < 3600);

  return (
    <header className="sticky top-0 z-50 bg-bottle-900/95 backdrop-blur-md border-b border-bottle-700/80 transition-all">
      {/* Critical Emergency Banner if active */}
      {(urgentOrgan || isExcursionActive) && (
        <div className="bg-vermilion text-bone-50 text-xs font-mono font-medium px-4 py-1.5 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2 animate-pulse">
            <Flame className="w-4 h-4 text-bone-50" />
            <span className="font-bold tracking-wide">CRITICAL DISPATCH ALERT:</span>
            {urgentOrgan && (
              <span>
                {urgentOrgan.organ.toUpperCase()} ISCHEMIA WINDOW &lt; 60 MIN ({Math.floor(urgentOrgan.remainingSeconds / 60)}m {urgentOrgan.remainingSeconds % 60}s remaining). Destination: {urgentOrgan.recipientHospital}.
              </span>
            )}
            {isExcursionActive && (
              <span className="ml-3 font-semibold underline">
                ESP32 COLD-CHAIN BREACH: Temperature 11.4°C in Transit Box #04!
              </span>
            )}
          </div>
          <span className="hidden md:inline-block uppercase tracking-wider text-[11px] bg-bottle-950/40 px-2 py-0.5 rounded border border-bone-100/30">
            Emergency Preemption Code: RED-7
          </span>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button 
              onClick={() => setViewMode('landing')}
              className="flex items-center space-x-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-bottle-700 border border-bottle-600 flex items-center justify-center text-vermilion group-hover:border-vermilion/50 transition-colors shadow-inner">
                <Heart className="w-5 h-5 fill-vermilion/20 stroke-vermilion group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-bone-100">
                  Pulse<span className="text-vermilion">Link</span>
                </span>
                <p className="text-[10px] text-bone-300 tracking-wide font-sans hidden 2xl:block">
                  Unified Medical Logistics
                </p>
              </div>
            </button>

            {/* City Selector Button with Dropdown (Photo match) */}
            <div className="relative">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center space-x-1 text-[10px] uppercase font-mono tracking-wider px-2 py-1 bg-bottle-950/90 hover:bg-bottle-800 text-bone-200 hover:text-bone-100 rounded-md border border-bottle-700 hover:border-cobalt transition-all shadow-sm group"
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
                          className={`w-full text-left px-3.5 py-2.5 flex items-start space-x-3 transition-colors ${
                            isSelected 
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

            {/* B2B Pseudo-Login Pill (Image 1 match) */}
            <button
              onClick={() => setViewMode(viewMode === 'login' ? 'dashboard' : 'login')}
              title="Click to manage B2B Verification Gate credentials & visit survey"
              className={`hidden md:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-xs font-mono transition-all ${
                viewMode === 'login'
                  ? 'border-cobalt bg-cobalt/20 text-bone-100 ring-1 ring-cobalt'
                  : verificationUser
                  ? 'border-bottle-700 bg-bottle-950/90 text-bone-200 hover:border-bottle-600'
                  : 'border-amber/70 bg-amber/10 text-amber hover:bg-amber/20'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
              <Lock className="w-3 h-3 text-amber" />
              <span className="font-semibold text-bone-100">B2B:</span>
              <span className="truncate max-w-[100px] lg:max-w-[150px]">
                {verificationUser ? `${verificationUser.fullName} (${verificationUser.workOrganisation})` : 'Verify Gate'}
              </span>
              <ChevronRight className="w-3 h-3 text-bone-300" />
            </button>
          </div>

          {/* Center Navigation Mode & Section Tabs (Overview, Requests Panel, Organ, Blood, Medicines, Command Center) */}
          <nav className="flex items-center bg-bottle-950 p-1 rounded-xl border border-bottle-700/80 max-w-full overflow-x-auto no-scrollbar space-x-0.5 sm:space-x-1">
            {/* 1. Overview */}
            <button
              onClick={() => setViewMode('landing')}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap ${
                viewMode === 'landing'
                  ? 'bg-bottle-700 text-bone-100 shadow-sm border border-bottle-600 font-semibold'
                  : 'text-bone-300 hover:text-bone-100'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            {/* 2. Requests Panel */}
            <button
              onClick={() => {
                setViewMode('dashboard');
                setActiveTab('requests');
                setActiveSubFocus('all');
              }}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap ${
                viewMode === 'dashboard' && activeTab === 'requests' && activeSubFocus === 'all'
                  ? 'bg-cobalt text-white shadow-md shadow-cobalt/25 font-semibold'
                  : 'text-bone-300 hover:text-bone-100'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Requests Panel</span>
            </button>

            {/* 3. Organ */}
            <button
              onClick={() => {
                setViewMode('dashboard');
                setActiveTab('requests');
                setActiveSubFocus('organ');
              }}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap ${
                viewMode === 'dashboard' && activeTab === 'requests' && activeSubFocus === 'organ'
                  ? 'bg-cobalt text-white shadow-md shadow-cobalt/25 font-semibold'
                  : 'text-bone-300 hover:text-bone-100'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-vermilion" />
              <span>Organ</span>
            </button>

            {/* 4. Blood */}
            <button
              onClick={() => {
                setViewMode('dashboard');
                setActiveTab('requests');
                setActiveSubFocus('blood');
              }}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap ${
                viewMode === 'dashboard' && activeTab === 'requests' && activeSubFocus === 'blood'
                  ? 'bg-cobalt text-white shadow-md shadow-cobalt/25 font-semibold'
                  : 'text-bone-300 hover:text-bone-100'
              }`}
            >
              <Droplet className="w-3.5 h-3.5 text-vermilion" />
              <span>Blood</span>
            </button>

            {/* 5. Medicines */}
            <button
              onClick={() => {
                setViewMode('dashboard');
                setActiveTab('medicine');
                setActiveSubFocus('medicine');
              }}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap ${
                viewMode === 'dashboard' && activeTab === 'medicine'
                  ? 'bg-cobalt text-white shadow-md shadow-cobalt/25 font-semibold'
                  : 'text-bone-300 hover:text-bone-100'
              }`}
            >
              <Pill className="w-3.5 h-3.5 text-sage" />
              <span>Medicines</span>
            </button>

            {/* 6. Command Center */}
            <button
              onClick={() => {
                setViewMode('dashboard');
                setActiveTab('corridors');
                setActiveSubFocus('all');
              }}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                viewMode === 'dashboard' && activeTab === 'corridors'
                  ? 'bg-cobalt text-white shadow-md shadow-cobalt/25'
                  : 'text-bone-300 hover:text-bone-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Command Center</span>
              <span className="w-2 h-2 rounded-full bg-sage animate-ping-slow ml-0.5" />
            </button>
          </nav>

          {/* Right Action Tools: Role Switcher & Audio */}
          <div className="flex items-center space-x-3">
            
            {/* Live Clock IST */}
            <div className="hidden lg:flex items-center space-x-1.5 text-xs font-mono text-bone-300 bg-bottle-950/60 px-2.5 py-1.5 rounded border border-bottle-700/50">
              <Clock className="w-3.5 h-3.5 text-sage" />
              <span>{currentTimeString || '23:42:00 IST'}</span>
            </div>

            {/* Theme Mode Toggle (Sand Editorial vs Terracotta Dark) */}
            <button
              onClick={toggleThemeMode}
              title={themeMode === 'sand' ? "Switch to Terracotta Dark Theme" : "Switch to Sand Editorial Theme"}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-bottle-700 bg-bottle-950 text-xs font-mono text-bone-200 hover:border-bottle-600 hover:text-bone-100 transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-cobalt" />
              <span className="hidden md:inline text-[11px]">
                {themeMode === 'sand' ? 'Sand' : 'Terracotta Dark'}
              </span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleAudioMute}
              title={audioMuted ? "Unmute Command Audio Telemetry" : "Mute Command Audio Telemetry"}
              className={`p-2 rounded-lg border transition-colors ${
                audioMuted 
                  ? 'border-bottle-700 text-bone-400 hover:text-bone-200' 
                  : 'border-sage/40 bg-bottle-700/30 text-sage hover:bg-bottle-700/50'
              }`}
            >
              {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-2 bg-bottle-950 border border-bottle-700 hover:border-bottle-600 px-3 py-1.5 rounded-lg text-xs transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-bottle-700 flex items-center justify-center text-bone-100 font-bold text-[10px]">
                  <User className="w-3.5 h-3.5 text-bone-300" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-bone-100 truncate max-w-[130px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-bone-400 capitalize">
                    {currentUser.role.replace('_', ' ')}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-bone-300" />
              </button>

              {/* Dropdown Menu */}
              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-bottle-900 border border-bottle-600 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-xl"
                  onClick={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-bottle-700">
                    <p className="text-[10px] uppercase font-mono tracking-wider text-bone-400">
                      Switch Active Persona / Role
                    </p>
                    <p className="text-xs text-bone-300 mt-0.5">
                      Adapts dashboard controls, permissions &amp; audit signing
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
                          className={`w-full text-left px-3 py-2 flex items-start space-x-2.5 transition-colors ${
                            isActive 
                              ? 'bg-bottle-700/60 text-bone-100 border-l-2 border-vermilion' 
                              : 'hover:bg-bottle-800 text-bone-300 hover:text-bone-100'
                          }`}
                        >
                          <div className="mt-0.5">
                            <span className={`inline-block w-2 h-2 rounded-full ${isActive ? 'bg-vermilion' : 'bg-bottle-600'}`} />
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
