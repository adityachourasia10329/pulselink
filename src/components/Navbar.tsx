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
  Home
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    currentRole, 
    setCurrentRole, 
    currentUser, 
    allProfiles,
    audioMuted, 
    toggleAudioMute,
    currentTimeString,
    organTransfers,
    isExcursionActive
  } = usePulseLink();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

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
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setViewMode('landing')}
              className="flex items-center space-x-3 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-lg bg-bottle-700 border border-bottle-600 flex items-center justify-center text-vermilion group-hover:border-vermilion/50 transition-colors shadow-inner">
                <Heart className="w-5 h-5 fill-vermilion/20 stroke-vermilion group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-serif text-2xl font-bold tracking-tight text-bone-100">
                    Pulse<span className="text-vermilion">Link</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 bg-bottle-700/60 text-bone-300 rounded border border-bottle-600/50">
                    v2.6 Bengaluru
                  </span>
                </div>
                <p className="text-[11px] text-bone-300 tracking-wide font-sans hidden sm:block">
                  Unified Medical Logistics &amp; Trust Network
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Mode Toggle */}
          <div className="flex items-center bg-bottle-950 p-1 rounded-lg border border-bottle-700/80">
            <button
              onClick={() => setViewMode('landing')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'landing'
                  ? 'bg-bottle-700 text-bone-100 shadow-sm border border-bottle-600'
                  : 'text-bone-300 hover:text-bone-100'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setViewMode('dashboard')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'dashboard'
                  ? 'bg-vermilion text-bone-50 shadow-md shadow-vermilion/25'
                  : 'text-bone-300 hover:text-bone-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Command Center</span>
              <span className="w-2 h-2 rounded-full bg-sage animate-ping-slow ml-1" />
            </button>
          </div>

          {/* Right Action Tools: Role Switcher & Audio */}
          <div className="flex items-center space-x-3">
            
            {/* Live Clock IST */}
            <div className="hidden lg:flex items-center space-x-1.5 text-xs font-mono text-bone-300 bg-bottle-950/60 px-2.5 py-1.5 rounded border border-bottle-700/50">
              <Clock className="w-3.5 h-3.5 text-sage" />
              <span>{currentTimeString || '23:42:00 IST'}</span>
            </div>

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
