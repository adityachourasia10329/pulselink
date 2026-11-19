import React, { useState } from 'react';
import { usePulseLink } from '../../context/PulseLinkContext';
import { BENGALURU_HOSPITALS } from '../../data/mockData';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Navigation, 
  Zap, 
  AlertTriangle, 
  Radio, 
  Flame, 
  PhoneCall, 
  MapPin
} from 'lucide-react';

export const CorridorMap: React.FC = () => {
  const { 
    corridors, 
    selectedCorridorId, 
    setSelectedCorridorId, 
    togglePoliceClearance,
    currentTimeString
  } = usePulseLink();

  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('hosp_narayana');
  const [showTrafficBottlenecks, setShowTrafficBottlenecks] = useState(true);

  const activeCorridor = corridors.find(c => c.id === selectedCorridorId) || corridors[0];
  const selectedHospital = BENGALURU_HOSPITALS.find(h => h.id === selectedHospitalId) || BENGALURU_HOSPITALS[0];

  // Map coordinates projection helper (scales Bengaluru bounding box into SVG 800x600)
  // Lat: 12.68 to 13.12 (South to North)
  // Lng: 77.36 to 77.82 (West to East)
  const projectCoords = (lat: number, lng: number): { x: number; y: number } => {
    const minLat = 12.68;
    const maxLat = 13.12;
    const minLng = 77.36;
    const maxLng = 77.82;

    const x = ((lng - minLng) / (maxLng - minLng)) * 740 + 30;
    // Invert Y because latitude increases upwards
    const y = ((maxLat - lat) / (maxLat - minLat)) * 520 + 40;
    return { x, y };
  };

  const currentVehiclePos = projectCoords(activeCorridor.currentPosition.lat, activeCorridor.currentPosition.lng);

  return (
    <div className="space-y-6">
      
      {/* Top Controls & Route Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-bottle-900 border border-bottle-700/80 p-4 rounded-xl shadow-lg">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-bone-300">
            <Radio className="w-3.5 h-3.5 text-vermilion animate-pulse" />
            <span>Bengaluru Metropolitan Traffic Management Center</span>
            <span className="text-bone-400">•</span>
            <span className="text-sage">Automated Signal Preemption Engine</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-bone-100 mt-1">
            Live Green Corridor &amp; Traffic Radar
          </h2>
        </div>

        {/* Corridor Route Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {corridors.map(corr => {
            const isSelected = corr.id === selectedCorridorId;
            return (
              <button
                key={corr.id}
                onClick={() => setSelectedCorridorId(corr.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  isSelected 
                    ? 'bg-bottle-700 border-vermilion text-bone-50 shadow-md ring-1 ring-vermilion/50' 
                    : 'bg-bottle-950 border-bottle-700 text-bone-300 hover:text-bone-100 hover:border-bottle-600'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${corr.policeClearanceActive ? 'bg-vermilion animate-ping-slow' : 'bg-sage'}`} />
                <span className="font-mono font-semibold">{corr.code}</span>
                <span className="text-bone-300 hidden sm:inline">({corr.cargoType})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map & Telemetry Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Interactive Vector Map (8 cols) */}
        <div className="lg:col-span-8 bg-bottle-950 border border-bottle-700 rounded-xl overflow-hidden relative shadow-2xl flex flex-col">
          
          {/* Map Header Status Bar */}
          <div className="bg-bottle-900/90 border-b border-bottle-700/80 px-4 py-2.5 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-3">
              <span className="text-bone-300 flex items-center space-x-1">
                <Navigation className="w-3.5 h-3.5 text-bone-300" />
                <span>Sector: BENGALURU-URBAN</span>
              </span>
              <span className="text-bone-400">|</span>
              <span className="text-sage flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                <span>GPS LOCK: 12 SATELLITES</span>
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-1.5 cursor-pointer text-bone-300 hover:text-bone-100">
                <input 
                  type="checkbox" 
                  checked={showTrafficBottlenecks} 
                  onChange={e => setShowTrafficBottlenecks(e.target.checked)}
                  className="rounded border-bottle-600 bg-bottle-900 text-vermilion focus:ring-0 text-xs"
                />
                <span className="text-[11px]">Show Bottlenecks</span>
              </label>
              <span className="text-bone-400 font-bold">{currentTimeString}</span>
            </div>
          </div>

          {/* Interactive SVG Radar Canvas */}
          <div className="relative w-full h-[520px] bg-gradient-to-b from-[#061812] to-[#0A261E] select-none overflow-hidden">
            
            {/* Grid Pattern Background */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2A7A63" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* SVG Map Lines & Waypoints */}
            <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
              
              {/* Other inactive corridor paths (dimmed) */}
              {corridors.filter(c => c.id !== activeCorridor.id).map(corr => {
                const pathStr = corr.routePath.map((p, idx) => {
                  const pt = projectCoords(p.lat, p.lng);
                  return `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`;
                }).join(' ');

                return (
                  <path
                    key={corr.id}
                    d={pathStr}
                    fill="none"
                    stroke="#164A3B"
                    strokeWidth="3"
                    strokeDasharray="4 4"
                    className="opacity-50"
                  />
                );
              })}

              {/* Active Corridor Glow Filter */}
              <defs>
                <filter id="corridor-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Active Corridor Glowing Road Route */}
              {(() => {
                const pathStr = activeCorridor.routePath.map((p, idx) => {
                  const pt = projectCoords(p.lat, p.lng);
                  return `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`;
                }).join(' ');

                return (
                  <g>
                    {/* Outer Glow Halo */}
                    <path
                      d={pathStr}
                      fill="none"
                      stroke={activeCorridor.policeClearanceActive ? '#E63B2E' : '#4ADE80'}
                      strokeWidth="8"
                      strokeOpacity="0.3"
                      filter="url(#corridor-glow)"
                    />
                    {/* Core Line */}
                    <path
                      d={pathStr}
                      fill="none"
                      stroke={activeCorridor.policeClearanceActive ? '#FF5A4D' : '#4ADE80'}
                      strokeWidth="3.5"
                      strokeDasharray={activeCorridor.policeClearanceActive ? 'none' : '6 4'}
                    />
                  </g>
                );
              })()}

              {/* Waypoints along Active Route */}
              {activeCorridor.routePath.map((wp, idx) => {
                const pt = projectCoords(wp.lat, wp.lng);
                return (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={idx === 0 || idx === activeCorridor.routePath.length - 1 ? 5 : 3}
                    fill={activeCorridor.policeClearanceActive ? '#E63B2E' : '#4ADE80'}
                    stroke="#09241C"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Traffic Bottleneck Warning Points */}
              {showTrafficBottlenecks && (
                <g>
                  {/* Silk Board Junction */}
                  {(() => {
                    const sb = projectCoords(12.9175, 77.6238);
                    return (
                      <g transform={`translate(${sb.x}, ${sb.y})`}>
                        <circle r="12" fill="#F59E0B" fillOpacity="0.2" className="animate-ping" />
                        <circle r="5" fill="#F59E0B" />
                        <text x="8" y="4" fill="#F59E0B" fontSize="10" fontFamily="monospace" fontWeight="bold">
                          Silk Board Congestion
                        </text>
                      </g>
                    );
                  })()}

                  {/* K.R. Market / Anand Rao */}
                  {(() => {
                    const km = projectCoords(12.9710, 77.5770);
                    return (
                      <g transform={`translate(${km.x}, ${km.y})`}>
                        <circle r="4" fill="#F59E0B" />
                        <text x="8" y="4" fill="#F59E0B" fontSize="9" fontFamily="monospace">
                          City Market Zone
                        </text>
                      </g>
                    );
                  })()}
                </g>
              )}

              {/* Hospital Nodes */}
              {BENGALURU_HOSPITALS.map(hosp => {
                const pt = projectCoords(hosp.coordinates.lat, hosp.coordinates.lng);
                const isOrigin = hosp.id === activeCorridor.origin.id;
                const isDest = hosp.id === activeCorridor.destination.id;
                const isSelected = hosp.id === selectedHospitalId;

                let markerFill = '#2A7A63';
                let markerSize = 6;
                if (isOrigin) {
                  markerFill = '#4ADE80';
                  markerSize = 8;
                } else if (isDest) {
                  markerFill = '#E63B2E';
                  markerSize = 8;
                }

                return (
                  <g 
                    key={hosp.id} 
                    transform={`translate(${pt.x}, ${pt.y})`}
                    onClick={() => setSelectedHospitalId(hosp.id)}
                    className="cursor-pointer group"
                  >
                    {/* Ring if selected */}
                    {isSelected && (
                      <circle r={markerSize + 6} fill="none" stroke="#EFE7DA" strokeWidth="1.5" strokeDasharray="3 3" className="animate-spin" />
                    )}

                    {/* Node Circle */}
                    <circle 
                      r={markerSize} 
                      fill={markerFill} 
                      stroke="#EFE7DA" 
                      strokeWidth={isSelected ? '2' : '1'} 
                      className="group-hover:scale-125 transition-transform"
                    />

                    {/* Label */}
                    <text 
                      x="9" 
                      y="4" 
                      fill={isSelected ? '#EFE7DA' : '#C8BFA8'} 
                      fontSize={isOrigin || isDest || isSelected ? '11' : '9'} 
                      fontWeight={isOrigin || isDest || isSelected ? 'bold' : 'normal'}
                      fontFamily="sans-serif"
                      className="drop-shadow-md select-none group-hover:fill-white"
                    >
                      {hosp.shortName}
                    </text>
                  </g>
                );
              })}

              {/* Live Animated Ambulance / Cargo Vehicle Marker */}
              <g transform={`translate(${currentVehiclePos.x}, ${currentVehiclePos.y})`}>
                {/* Radar sweep / pulse around vehicle */}
                <circle 
                  r="24" 
                  fill={activeCorridor.policeClearanceActive ? '#E63B2E' : '#4ADE80'} 
                  fillOpacity="0.18" 
                  className="animate-ping" 
                />
                <circle 
                  r="14" 
                  fill="#09241C" 
                  stroke={activeCorridor.policeClearanceActive ? '#E63B2E' : '#4ADE80'} 
                  strokeWidth="2.5" 
                />
                {/* Icon inside marker */}
                <circle 
                  r="4" 
                  fill={activeCorridor.policeClearanceActive ? '#FF5A4D' : '#4ADE80'} 
                />
                {/* Vehicle Callout Tag */}
                <g transform="translate(18, -12)">
                  <rect 
                    x="0" 
                    y="0" 
                    width="145" 
                    height="28" 
                    rx="4" 
                    fill="#09241C" 
                    stroke={activeCorridor.policeClearanceActive ? '#E63B2E' : '#164A3B'} 
                    strokeWidth="1.2" 
                  />
                  <text x="6" y="12" fill="#EFE7DA" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    {activeCorridor.vehicleId}
                  </text>
                  <text x="6" y="22" fill="#4ADE80" fontSize="8" fontFamily="monospace">
                    {activeCorridor.currentSpeedKmh} km/h • {activeCorridor.cargoType}
                  </text>
                </g>
              </g>

            </svg>

            {/* Bottom-Left Overlay: ETA Comparison Card */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-bottle-900/95 border border-bottle-700/90 rounded-xl p-3.5 backdrop-blur-md shadow-2xl">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-bottle-700">
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-vermilion" />
                  <span className="font-mono text-xs font-bold text-bone-100 uppercase">
                    Corridor Clearance Telemetry
                  </span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  activeCorridor.policeClearanceActive 
                    ? 'bg-vermilion/20 text-vermilion border border-vermilion/40' 
                    : 'bg-amber/20 text-amber border border-amber/40'
                }`}>
                  {activeCorridor.policeClearanceActive ? 'Clearance Active' : 'Standard Escort'}
                </span>
              </div>

              {/* Standard vs Green Corridor ETA Delta */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-bottle-950 p-2 rounded-lg border border-bottle-800">
                  <p className="text-[10px] text-bone-400 font-sans">Standard GPS</p>
                  <p className="font-mono text-base font-bold text-bone-300">
                    {activeCorridor.standardGpsEtaMinutes} <span className="text-[11px] font-normal">min</span>
                  </p>
                  <p className="text-[9px] text-bone-400 mt-0.5">Heavy Traffic</p>
                </div>

                <div className="bg-bottle-950 p-2 rounded-lg border border-vermilion/40 shadow-inner">
                  <p className="text-[10px] text-vermilion font-sans font-bold">PulseLink ETA</p>
                  <p className="font-mono text-lg font-bold text-vermilion">
                    {activeCorridor.greenCorridorEtaMinutes} <span className="text-[11px] font-normal">min</span>
                  </p>
                  <p className="text-[9px] text-sage font-mono mt-0.5">Optimal Path</p>
                </div>

                <div className="bg-bottle-950 p-2 rounded-lg border border-sage/40">
                  <p className="text-[10px] text-sage font-sans font-bold">Time Saved</p>
                  <p className="font-mono text-lg font-bold text-sage">
                    +{activeCorridor.timeSavedMinutes} <span className="text-[11px] font-normal">min</span>
                  </p>
                  <p className="text-[9px] text-bone-300 mt-0.5">Critical Margin</p>
                </div>
              </div>

              {/* Progress Bar of Intersections Cleared */}
              <div className="mt-3 pt-2 border-t border-bottle-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono text-bone-300 mb-1">
                  <span>Preempted Traffic Signals:</span>
                  <span className="font-bold text-bone-100">
                    {activeCorridor.clearedIntersectionsCount} / {activeCorridor.totalIntersectionsCount} Cleared
                  </span>
                </div>
                <div className="w-full bg-bottle-950 h-2 rounded-full overflow-hidden border border-bottle-800">
                  <div 
                    className={`h-full transition-all duration-500 ${activeCorridor.policeClearanceActive ? 'bg-vermilion' : 'bg-sage'}`}
                    style={{ width: `${(activeCorridor.clearedIntersectionsCount / activeCorridor.totalIntersectionsCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Top-Right Overlay: Corridor Quick Toggle Action */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => togglePoliceClearance(activeCorridor.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xl ${
                  activeCorridor.policeClearanceActive
                    ? 'bg-vermilion text-bone-50 hover:bg-vermilion-dark ring-2 ring-vermilion/50 animate-pulse'
                    : 'bg-bottle-700 text-bone-100 hover:bg-bottle-600 border border-bottle-500'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>
                  {activeCorridor.policeClearanceActive ? 'Police Clearance Active' : 'Request Traffic Clearance'}
                </span>
              </button>
            </div>

          </div>

          {/* Bottom Corridor Route Details Bar */}
          <div className="bg-bottle-900 border-t border-bottle-700/80 p-3 text-xs flex flex-wrap items-center justify-between gap-3 text-bone-300">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-bone-100">Active Corridor:</span>
              <span>{activeCorridor.title}</span>
            </div>
            <div className="flex items-center space-x-4 font-mono text-[11px]">
              <span>Vehicle: <strong className="text-bone-100">{activeCorridor.vehicleType}</strong></span>
              <span>Priority: <strong className="text-vermilion">CODE RED</strong></span>
            </div>
          </div>
        </div>

        {/* Right Side: Hospital & Route Intel Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Hospital Node Inspection Card */}
          <div className="bg-bottle-900 border border-bottle-700 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-bottle-700">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-sage" />
                <span className="font-mono text-xs uppercase tracking-wider text-bone-300">
                  Node Telemetry
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-bottle-800 text-bone-200 border border-bottle-600">
                {selectedHospital.zone} Bengaluru
              </span>
            </div>

            <div className="mt-3">
              <h3 className="font-serif text-lg font-bold text-bone-100">
                {selectedHospital.name}
              </h3>
              <p className="text-xs text-bone-300 mt-1 leading-relaxed">
                {selectedHospital.address}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-bottle-950 p-2.5 rounded-lg border border-bottle-800">
                <p className="text-[10px] text-bone-400 uppercase font-mono">Emergency Beds</p>
                <p className="text-lg font-bold font-mono text-bone-100 mt-0.5">
                  {selectedHospital.activeEmergencyBeds} <span className="text-xs text-sage font-normal">Available</span>
                </p>
              </div>

              <div className="bg-bottle-950 p-2.5 rounded-lg border border-bottle-800">
                <p className="text-[10px] text-bone-400 uppercase font-mono">Helipad Facility</p>
                <p className="text-lg font-bold font-mono text-bone-100 mt-0.5">
                  {selectedHospital.hasHelipad ? (
                    <span className="text-sage flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Operational</span>
                    </span>
                  ) : (
                    <span className="text-bone-400">Ground Only</span>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-bottle-800 flex items-center justify-between text-xs">
              <span className="text-bone-400 font-mono">Emergency Hotline:</span>
              <a 
                href={`tel:${selectedHospital.contactPhone}`} 
                className="font-mono font-semibold text-bone-100 hover:text-vermilion flex items-center space-x-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{selectedHospital.contactPhone}</span>
              </a>
            </div>
          </div>

          {/* Traffic Police Preemption Clearance Card */}
          <div className="bg-bottle-900 border border-bottle-700 rounded-xl p-4 shadow-xl">
            <div className="flex items-center space-x-2 pb-3 border-b border-bottle-700">
              <ShieldAlert className="w-4 h-4 text-vermilion" />
              <h3 className="font-serif text-base font-bold text-bone-100">
                Traffic Police Clearance Status
              </h3>
            </div>

            <div className="mt-3 space-y-3">
              <div className="bg-bottle-950 p-3 rounded-lg border border-bottle-800">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-bone-300">Corridor Authorization:</span>
                  <span className={activeCorridor.policeClearanceActive ? 'text-sage font-bold' : 'text-amber'}>
                    {activeCorridor.policeClearanceActive ? 'ACTIVE PREEMPTION' : 'PENDING APPROVAL'}
                  </span>
                </div>
                <p className="text-xs text-bone-300 leading-relaxed">
                  {activeCorridor.policeClearanceActive 
                    ? 'Automated green signal holds active across Silk Board, Koramangala & Domlur corridors. Siren audio stream relayed to traffic command.'
                    : 'Standard traffic conditions apply. Click "Request Traffic Clearance" to signal Bengaluru Traffic Police (BTP) central controller.'}
                </p>
              </div>

              {/* Bottlenecks List */}
              <div>
                <p className="text-xs font-mono font-semibold text-bone-300 mb-1.5 uppercase">
                  Active Monitored Bottlenecks
                </p>
                <div className="space-y-1.5">
                  {activeCorridor.activeBottlenecks.map((bottleneck, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start space-x-2 text-xs bg-bottle-950/60 p-2 rounded border border-bottle-800/80 text-bone-300"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber shrink-0 mt-0.5" />
                      <span>{bottleneck}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => togglePoliceClearance(activeCorridor.id)}
                className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                  activeCorridor.policeClearanceActive
                    ? 'bg-bottle-800 border border-bottle-600 text-bone-200 hover:bg-bottle-700'
                    : 'bg-vermilion hover:bg-vermilion-dark text-bone-50 shadow-lg shadow-vermilion/20'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>
                  {activeCorridor.policeClearanceActive ? 'Deactivate Preemption' : 'Override All Route Signals'}
                </span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
