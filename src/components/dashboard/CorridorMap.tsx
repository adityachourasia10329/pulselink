import React, { useState } from 'react';
import { usePulseLink } from '../../context/PulseLinkContext';
import { BENGALURU_HOSPITALS } from '../../data/mockData';
import { 
  Navigation, 
  Zap, 
  Radio, 
  Flame, 
  MapPin,
  ShieldCheck,
  Truck
} from 'lucide-react';

export const CorridorMap: React.FC = () => {
  const { 
    corridors, 
    selectedCorridorId, 
    setSelectedCorridorId, 
    togglePoliceClearance,
    currentTimeString,
    selectedCity,
    canViewMap,
    canViewOrganOriginLocation
  } = usePulseLink();

  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('hosp_narayana');
  const [showTrafficBottlenecks] = useState(true);

  const activeCorridor = corridors.find(c => c.id === selectedCorridorId) || corridors[0];
  const selectedHospital = BENGALURU_HOSPITALS.find(h => h.id === selectedHospitalId) || BENGALURU_HOSPITALS[0];

  // Map coordinates projection helper (scales Bengaluru bounding box into SVG 800x600)
  const projectCoords = (lat: number, lng: number): { x: number; y: number } => {
    const minLat = 12.68;
    const maxLat = 13.12;
    const minLng = 77.36;
    const maxLng = 77.82;

    const x = ((lng - minLng) / (maxLng - minLng)) * 740 + 30;
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
            <span>{selectedCity.name} Metropolitan Traffic Management Center</span>
            <span className="text-bone-400">•</span>
            <span className="text-sage">Automated Signal Preemption Engine</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-bone-100 mt-1">
            {canViewMap ? 'Live Green Corridor & Traffic Radar' : 'Medical Operations Command & Real-Time ETA Tracking'}
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

      {/* Main Split View: Map (if allowed) or Telemetry ETA Console (if map is restricted) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Interactive Map (if canViewMap) OR ETA Tracking Console (if !canViewMap per Rule 1.2a) */}
        <div className="lg:col-span-8 bg-bottle-950 border border-bottle-700 rounded-xl overflow-hidden relative shadow-2xl flex flex-col">
          
          {/* Header Status Bar */}
          <div className="bg-bottle-900/90 border-b border-bottle-700/80 px-4 py-2.5 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-3">
              <span className="text-bone-300 flex items-center space-x-1">
                <Navigation className="w-3.5 h-3.5 text-bone-300" />
                <span>Sector: {selectedCity.name.toUpperCase()}-METRO ({selectedCity.code})</span>
              </span>
              <span className="text-bone-400">•</span>
              <span className="text-bone-300">
                Route: <strong className="text-bone-100">{activeCorridor.code}</strong>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-bone-400">Time:</span>
              <span className="text-bone-100 font-bold">{currentTimeString}</span>
            </div>
          </div>

          {!canViewMap ? (
            /* RULE 1.2a ENFORCEMENT: MEDICAL STAFF & COMMON USERS DO NOT SEE MAP */
            <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
              
              {/* Security Banner */}
              <div className="p-4 rounded-xl bg-bottle-900 border-2 border-sage/60 text-xs font-mono text-bone-200 space-y-2 shadow-lg">
                <div className="flex items-center space-x-2 text-sage font-bold">
                  <ShieldCheck className="w-5 h-5 text-sage" />
                  <span>SECURITY RULE 1.2a COMPLIANCE: MAP &amp; GPS VISUALS MASKED</span>
                </div>
                <p className="text-bone-300 font-sans leading-relaxed text-xs">
                  Per Rule 1.2a and clinical security protocols, medical personnel and common users track real-time ETA, dispatch pipeline status, police clearance, and cold-chain viability telemetry without geographic map tracking or donor origin coordinates.
                </p>
              </div>

              {/* Large Real-Time ETA Card */}
              <div className="bg-bottle-900 border border-bottle-700 rounded-2xl p-6 shadow-2xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-bottle-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-bone-400 uppercase tracking-wider block">
                      Destination Hospital Node
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-bone-100">
                      {activeCorridor.destination.name}
                    </h3>
                    <p className="text-xs text-bone-300 font-mono mt-0.5">
                      Assigned Vehicle: <strong className="text-bone-100">{activeCorridor.vehicleId}</strong> ({activeCorridor.vehicleType})
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase self-start sm:self-auto ${
                    activeCorridor.policeClearanceActive
                      ? 'bg-vermilion/20 text-vermilion border border-vermilion/50 animate-pulse'
                      : 'bg-amber/20 text-amber border border-amber/40'
                  }`}>
                    {activeCorridor.policeClearanceActive ? 'Priority Green Clearance Active' : 'Standard Emergency Lane'}
                  </span>
                </div>

                {/* ETA Metric Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="bg-bottle-950 p-4 rounded-xl border border-bottle-800">
                    <span className="text-[10px] text-bone-400 font-mono block">Standard Transit ETA</span>
                    <span className="font-mono text-2xl font-bold text-bone-300 mt-1 block">
                      {activeCorridor.standardGpsEtaMinutes} min
                    </span>
                    <span className="text-[10px] text-bone-400 font-mono">Normal City Congestion</span>
                  </div>

                  <div className="bg-bottle-950 p-4 rounded-xl border border-vermilion/60 shadow-inner">
                    <span className="text-[10px] text-vermilion font-mono uppercase font-bold block">PulseLink Green ETA</span>
                    <span className="font-mono text-3xl font-bold text-vermilion mt-1 block">
                      {activeCorridor.greenCorridorEtaMinutes} min
                    </span>
                    <span className="text-[10px] text-sage font-mono">Preempted Corridor</span>
                  </div>

                  <div className="bg-bottle-950 p-4 rounded-xl border border-sage/60">
                    <span className="text-[10px] text-sage font-mono uppercase font-bold block">Critical Time Saved</span>
                    <span className="font-mono text-3xl font-bold text-sage mt-1 block">
                      +{activeCorridor.timeSavedMinutes} min
                    </span>
                    <span className="text-[10px] text-bone-300 font-mono">Cold Ischemia Preservation</span>
                  </div>
                </div>

                {/* Preempted Intersections Progress */}
                <div className="p-4 rounded-xl bg-bottle-950 border border-bottle-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-bone-300">Preempted Traffic Signal Junctions:</span>
                    <span className="font-bold text-bone-100">
                      {activeCorridor.clearedIntersectionsCount} / {activeCorridor.totalIntersectionsCount} Cleared (Priority Green)
                    </span>
                  </div>
                  <div className="w-full bg-bottle-900 h-2.5 rounded-full overflow-hidden border border-bottle-800">
                    <div 
                      className={`h-full transition-all duration-500 ${activeCorridor.policeClearanceActive ? 'bg-vermilion' : 'bg-sage'}`}
                      style={{ width: `${(activeCorridor.clearedIntersectionsCount / activeCorridor.totalIntersectionsCount) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-bone-400 pt-1">
                    <span>Current Speed: {activeCorridor.currentSpeedKmh} km/h</span>
                    <span>Transit Distance: {activeCorridor.distanceKm || 18.4} km</span>
                  </div>
                </div>

                {/* Police Clearance Action Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => togglePoliceClearance(activeCorridor.id)}
                    className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xl ${
                      activeCorridor.policeClearanceActive
                        ? 'bg-vermilion text-bone-50 hover:bg-vermilion-dark ring-2 ring-vermilion/50 animate-pulse'
                        : 'bg-cobalt text-white hover:bg-cobalt-dark shadow-cobalt/30'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>
                      {activeCorridor.policeClearanceActive ? 'Police Clearance Active' : 'Request Traffic Signal Override'}
                    </span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* FULL INTERACTIVE MAP FOR GOVERNMENT EMPLOYEES & PULSELINK OPS */
            <div className="relative flex-1 min-h-[500px]">
              <svg 
                viewBox="0 0 800 600" 
                className="w-full h-full select-none"
                style={{ backgroundColor: '#092119' }}
              >
                {/* Background Grid */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0F372B" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="800" height="600" fill="url(#grid)" />

                {/* Major Arterial Roads */}
                <g stroke="#164A3A" strokeWidth="2" fill="none" strokeLinecap="round">
                  <path d="M 120 40 L 720 540" />
                  <path d="M 680 80 L 100 480" />
                  <circle cx="400" cy="300" r="140" stroke="#164A3A" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                </g>

                {/* Active Corridor Route Path */}
                {activeCorridor.routePath.length > 1 && (
                  <path
                    d={activeCorridor.routePath.reduce((acc, pt, i) => {
                      const p = projectCoords(pt.lat, pt.lng);
                      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                    }, '')}
                    fill="none"
                    stroke={activeCorridor.policeClearanceActive ? '#0C45B0' : '#2E7D32'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Waypoints */}
                {activeCorridor.routePath.map((wp, idx) => {
                  const pt = projectCoords(wp.lat, wp.lng);
                  return (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r={idx === 0 || idx === activeCorridor.routePath.length - 1 ? 5 : 3}
                      fill={activeCorridor.policeClearanceActive ? '#0C45B0' : '#2E7D32'}
                      stroke="#092119"
                      strokeWidth="1.5"
                    />
                  );
                })}

                {/* Traffic Bottlenecks */}
                {showTrafficBottlenecks && (
                  <g>
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
                  </g>
                )}

                {/* Hospital Nodes */}
                {BENGALURU_HOSPITALS.map(hosp => {
                  const pt = projectCoords(hosp.coordinates.lat, hosp.coordinates.lng);
                  const isOrigin = hosp.id === activeCorridor.origin.id;
                  const isDest = hosp.id === activeCorridor.destination.id;
                  const isSelected = hosp.id === selectedHospitalId;

                  let markerFill = '#265444';
                  let markerSize = 6;
                  if (isOrigin) {
                    markerFill = '#2E7D32';
                    markerSize = 8;
                  } else if (isDest) {
                    markerFill = '#0C45B0';
                    markerSize = 8;
                  }

                  return (
                    <g 
                      key={hosp.id} 
                      transform={`translate(${pt.x}, ${pt.y})`}
                      onClick={() => setSelectedHospitalId(hosp.id)}
                      className="cursor-pointer group"
                    >
                      {isSelected && (
                        <circle r={markerSize + 6} fill="none" stroke="#EFE7DA" strokeWidth="1.5" strokeDasharray="3 3" className="animate-spin" />
                      )}
                      <circle 
                        r={markerSize} 
                        fill={markerFill} 
                        stroke="#092119" 
                        strokeWidth={isSelected ? '2' : '1'} 
                        className="group-hover:scale-125 transition-transform"
                      />
                      <text 
                        x="9" 
                        y="4" 
                        fill={isSelected ? '#EFE7DA' : '#A89F91'} 
                        fontSize={isOrigin || isDest || isSelected ? '11' : '9'} 
                        fontWeight={isOrigin || isDest || isSelected ? 'bold' : 'normal'}
                        fontFamily="sans-serif"
                      >
                        {hosp.shortName}
                      </text>
                    </g>
                  );
                })}

                {/* Moving Vehicle */}
                <g transform={`translate(${currentVehiclePos.x}, ${currentVehiclePos.y})`}>
                  <circle 
                    r="24" 
                    fill={activeCorridor.policeClearanceActive ? '#0C45B0' : '#2E7D32'} 
                    fillOpacity="0.2" 
                    className="animate-ping" 
                  />
                  <circle 
                    r="12" 
                    fill="#0F372B" 
                    stroke={activeCorridor.policeClearanceActive ? '#0C45B0' : '#2E7D32'} 
                    strokeWidth="2.5" 
                  />
                  <circle 
                    r="4" 
                    fill={activeCorridor.policeClearanceActive ? '#2E69DB' : '#2E7D32'} 
                  />
                  <g transform="translate(18, -12)">
                    <rect 
                      x="0" 
                      y="0" 
                      width="145" 
                      height="28" 
                      rx="4" 
                      fill="#0F372B" 
                      stroke={activeCorridor.policeClearanceActive ? '#0C45B0' : '#265444'} 
                      strokeWidth="1.2" 
                    />
                    <text x="6" y="12" fill="#EFE7DA" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      {activeCorridor.vehicleId}
                    </text>
                    <text x="6" y="22" fill={activeCorridor.policeClearanceActive ? '#0C45B0' : '#2E7D32'} fontSize="8" fontFamily="monospace">
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
          )}

          {/* Bottom Corridor Route Details Bar */}
          <div className="bg-bottle-900 border-t border-bottle-700/80 p-3 text-xs flex flex-wrap items-center justify-between gap-3 text-bone-300">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-bone-100">Active Corridor:</span>
              <span>{activeCorridor.title}</span>
            </div>
            <div className="flex items-center space-x-4 font-mono text-[11px]">
              <span>Vehicle: <strong className="text-bone-100">{activeCorridor.vehicleType}</strong></span>
              <span>Priority: <strong className="text-vermilion">CODE RED-7</strong></span>
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
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-bottle-950 border border-bottle-700 text-sage uppercase">
                {selectedHospital.zone} Zone
              </span>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <div>
                <h4 className="font-serif font-bold text-bone-100 text-base">{selectedHospital.name}</h4>
                <p className="text-[11px] text-bone-400 font-mono mt-0.5">{selectedHospital.type}</p>
                <p className="text-[11px] text-bone-300 mt-1">{selectedHospital.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs pt-1">
                <div className="bg-bottle-950 p-2 rounded-lg border border-bottle-800">
                  <span className="text-[10px] text-bone-400 block">Emergency Beds</span>
                  <span className="font-bold text-bone-100">{selectedHospital.activeEmergencyBeds} Available</span>
                </div>
                <div className="bg-bottle-950 p-2 rounded-lg border border-bottle-800">
                  <span className="text-[10px] text-bone-400 block">Rooftop Helipad</span>
                  <span className={`font-bold ${selectedHospital.hasHelipad ? 'text-sage' : 'text-bone-400'}`}>
                    {selectedHospital.hasHelipad ? 'Operational' : 'None'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-bottle-800 flex items-center justify-between text-xs font-mono">
                <span className="text-bone-400">Emergency Desk:</span>
                <span className="text-bone-100 font-bold">{selectedHospital.contactPhone}</span>
              </div>
            </div>
          </div>

          {/* Active Dispatch Manifest Card */}
          <div className="bg-bottle-900 border border-bottle-700 rounded-xl p-4 shadow-xl text-xs space-y-3">
            <div className="flex items-center space-x-2 text-bone-300 font-mono uppercase text-xs border-b border-bottle-700 pb-2">
              <Truck className="w-4 h-4 text-sage" />
              <span>Dispatch Manifest</span>
            </div>

            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-bone-400">Origin Facility:</span>
                <span className="text-bone-200">
                  {canViewOrganOriginLocation 
                    ? activeCorridor.origin.shortName 
                    : '[Origin Masked per Rule 1.2a]'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-400">Destination:</span>
                <span className="text-bone-100 font-bold">{activeCorridor.destination.shortName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-400">Cargo Type:</span>
                <span className="text-vermilion font-bold">{activeCorridor.cargoType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-400">Police Escort:</span>
                <span className={activeCorridor.policeClearanceActive ? 'text-vermilion font-bold' : 'text-bone-300'}>
                  {activeCorridor.policeClearanceActive ? 'Signal Override Active' : 'Standard'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
