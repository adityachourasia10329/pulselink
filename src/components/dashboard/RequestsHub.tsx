import React, { useState } from 'react';
import { usePulseLink } from '../../context/PulseLinkContext';
import { BENGALURU_HOSPITALS } from '../../data/mockData';
import { 
  Heart, 
  Droplet, 
  Send, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ArrowRight, 
  Flame
} from 'lucide-react';

export const RequestsHub: React.FC = () => {
  const { 
    organTransfers, 
    bloodBanks, 
    bloodRequests, 
    broadcastEmergencyBlood, 
    advanceBloodRequestStatus,
    activeSubFocus,
    setActiveSubFocus 
  } = usePulseLink();

  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [targetHospital, setTargetHospital] = useState(BENGALURU_HOSPITALS[2].name); // Victoria Hospital
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('O-');
  const [requestedUnits, setRequestedUnits] = useState(3);
  const [clinicalIndication, setClinicalIndication] = useState('Acute Trauma Resuscitation — Massive Hemorrhage Protocol');
  const [urgencyTier, setUrgencyTier] = useState<'Immediate (OT Critical)' | 'Urgent (<2 hrs)' | 'Scheduled'>('Immediate (OT Critical)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format seconds into HH:MM:SS
  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await broadcastEmergencyBlood({
      hospital: targetHospital,
      bloodGroup: selectedBloodGroup,
      units: Number(requestedUnits),
      indication: clinicalIndication,
      urgency: urgencyTier
    });
    setIsSubmitting(false);
    setBroadcastModalOpen(false);
  };

  const bloodGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  return (
    <div className="space-y-8">
      
      {/* Sub-Focus Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-bottle-950/80 border border-bottle-700/80 p-2.5 rounded-xl">
        <div className="flex items-center space-x-1.5">
          <span className="text-xs font-mono text-bone-400 mr-2">Filter View:</span>
          <button
            onClick={() => setActiveSubFocus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubFocus === 'all'
                ? 'bg-cobalt text-white shadow-sm font-semibold'
                : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-800'
            }`}
          >
            All Requests &amp; Trackers
          </button>
          <button
            onClick={() => setActiveSubFocus('organ')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubFocus === 'organ'
                ? 'bg-cobalt text-white shadow-sm font-semibold'
                : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-800'
            }`}
          >
            <Heart className="w-3 h-3 text-vermilion" />
            <span>Organ Viability ({organTransfers.length})</span>
          </button>
          <button
            onClick={() => setActiveSubFocus('blood')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubFocus === 'blood'
                ? 'bg-cobalt text-white shadow-sm font-semibold'
                : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-800'
            }`}
          >
            <Droplet className="w-3 h-3 text-vermilion" />
            <span>Blood Shortages &amp; Banks ({bloodRequests.length})</span>
          </button>
        </div>

        <div className="text-xs font-mono text-bone-400">
          Showing: <span className="text-bone-100 font-semibold capitalize">{activeSubFocus === 'all' ? 'Unified Hub' : `${activeSubFocus} Section`}</span>
        </div>
      </div>

      {/* SECTION 1: ORGAN VIABILITY TRACKER */}
      {(activeSubFocus === 'all' || activeSubFocus === 'organ') && (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bottle-700/80 pb-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-bone-300">
              <Heart className="w-3.5 h-3.5 text-vermilion" />
              <span>Cold Ischemia Telemetry</span>
              <span className="text-bone-400">•</span>
              <span className="text-sage">Autonomous Viability Clocks</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-bone-100 mt-0.5">
              Organ Viability &amp; Ischemia Tracker
            </h2>
          </div>
          <p className="text-xs text-bone-300 font-mono">
            Active Organ Transfers: <strong className="text-bone-100">{organTransfers.length} Monitored</strong>
          </p>
        </div>

        {/* Organ Viability Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {organTransfers.map(item => {
            const isCritical = item.remainingSeconds < 3600; // less than 60 mins
            const totalSec = item.totalViabilityHours * 3600;
            const elapsedPercent = Math.min(100, Math.round(((totalSec - item.remainingSeconds) / totalSec) * 100));

            return (
              <div 
                key={item.id}
                className={`bg-bottle-900 rounded-xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isCritical 
                    ? 'border-vermilion shadow-2xl shadow-vermilion/20 ring-1 ring-vermilion/50 animate-pulse-vermilion' 
                    : 'border-bottle-700 hover:border-bottle-600 shadow-xl'
                }`}
              >
                {/* Critical Glow Badge if < 60 min */}
                {isCritical && (
                  <div className="absolute top-0 right-0 bg-vermilion text-bone-50 text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-bl-lg flex items-center space-x-1 shadow-md">
                    <Flame className="w-3 h-3 text-bone-50 animate-bounce" />
                    <span>CRITICAL ISCHEMIA WINDOW</span>
                  </div>
                )}

                <div>
                  {/* Organ Header & Blood Group */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-serif text-2xl font-bold text-bone-100">{item.organ}</span>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-bottle-950 border border-bottle-700 text-sage">
                          {item.bloodGroup}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-bone-400 mt-0.5">
                        Donor ID: {item.donorId}
                      </p>
                    </div>

                    {!isCritical && (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-bottle-800 text-bone-300 border border-bottle-600">
                        {item.status}
                      </span>
                    )}
                  </div>

                  {/* Countdown Timer Display */}
                  <div className="mt-4 bg-bottle-950 rounded-xl p-3.5 border border-bottle-800 text-center">
                    <div className="flex items-center justify-center space-x-1.5 text-xs text-bone-300 font-mono mb-1">
                      <Clock className="w-3.5 h-3.5 text-bone-400" />
                      <span>Remaining Cold Ischemia Window</span>
                    </div>

                    <div className={`font-mono text-3xl font-bold tracking-wider ${
                      isCritical ? 'text-vermilion drop-shadow-md' : 'text-bone-100'
                    }`}>
                      {formatTimer(item.remainingSeconds)}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2.5">
                      <div className="flex justify-between text-[10px] font-mono text-bone-400 mb-1">
                        <span>Elapsed: {item.ischemiaTimeElapsedMinutes}m</span>
                        <span>Max Window: {item.totalViabilityHours}h</span>
                      </div>
                      <div className="w-full bg-bottle-900 h-2 rounded-full overflow-hidden border border-bottle-800">
                        <div 
                          className={`h-full transition-all duration-1000 ${isCritical ? 'bg-vermilion' : 'bg-sage'}`}
                          style={{ width: `${elapsedPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Route & Hospitals */}
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-start space-x-2">
                      <span className="text-bone-400 font-mono text-[11px] w-14 shrink-0">Donor:</span>
                      <span className="text-bone-200 font-medium">{item.donorHospital}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-vermilion font-mono text-[11px] w-14 shrink-0">Recipient:</span>
                      <span className="text-bone-100 font-semibold">{item.recipientHospital}</span>
                    </div>
                  </div>
                </div>

                {/* Footer details */}
                <div className="mt-4 pt-3 border-t border-bottle-800/80 flex items-center justify-between text-[11px] font-mono text-bone-300">
                  <span>Vehicle: <strong className="text-bone-100">{item.assignedVehicleId}</strong></span>
                  <span>ETA: <strong className="text-sage">{item.estimatedArrivalMinutes} min</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* SECTION 2 & 3: BLOOD SHORTAGES & PIPELINE */}
      {(activeSubFocus === 'all' || activeSubFocus === 'blood') && (
        <div className="space-y-8">
          {/* SECTION 2: REGIONAL BLOOD SHORTAGE & EMERGENCY BROADCAST */}
          <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-bottle-700/80 pb-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-bone-300">
              <Droplet className="w-3.5 h-3.5 text-vermilion" />
              <span>Inter-Hospital Transfusion Grid</span>
              <span className="text-bone-400">•</span>
              <span className="text-sage">Real-Time Regional Reserves</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-bone-100 mt-0.5">
              Blood Shortage Radar &amp; Instant Matching
            </h2>
          </div>

          <button
            onClick={() => setBroadcastModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-vermilion hover:bg-vermilion-dark text-bone-50 text-xs font-bold uppercase tracking-wider shadow-lg shadow-vermilion/20 transition-all self-start sm:self-auto"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast Emergency Blood Request</span>
          </button>
        </div>

        {/* Regional Blood Bank Inventory Table */}
        <div className="bg-bottle-900 border border-bottle-700 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-bottle-950 text-bone-300 font-mono uppercase text-[11px] border-b border-bottle-700">
                <tr>
                  <th className="py-3 px-4">Blood Centre / Bank</th>
                  <th className="py-3 px-3">Location</th>
                  {bloodGroups.map(bg => (
                    <th key={bg} className="py-3 px-3 text-center">{bg}</th>
                  ))}
                  <th className="py-3 px-4 text-right">Telemetry Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bottle-800">
                {bloodBanks.map(bank => (
                  <tr key={bank.id} className="hover:bg-bottle-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-bone-100">
                      {bank.bankName}
                      <span className="block text-[11px] font-normal text-bone-400 font-mono mt-0.5">
                        {bank.contactPhone}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-bone-300">{bank.location}</td>

                    {/* Stock Per Blood Group */}
                    {bloodGroups.map(bg => {
                      const count = bank.stock[bg] || 0;
                      const isCriticalShortage = count <= 2 && (bg === 'O-' || bg === 'AB-');
                      const isLow = count <= 4;

                      return (
                        <td key={bg} className="py-3.5 px-3 text-center font-mono">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                            isCriticalShortage 
                              ? 'bg-vermilion/20 text-vermilion border border-vermilion/50 animate-pulse' 
                              : isLow 
                                ? 'bg-amber/20 text-amber border border-amber/40' 
                                : 'bg-bottle-950 text-bone-200 border border-bottle-800'
                          }`}>
                            {count}
                          </span>
                        </td>
                      );
                    })}

                    <td className="py-3.5 px-4 text-right font-mono text-bone-400 text-[11px]">
                      {bank.lastUpdated}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 3: INTER-HOSPITAL COORDINATION PIPELINE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-bottle-700/80 pb-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-bone-300">
              <Truck className="w-3.5 h-3.5 text-sage" />
              <span>Custody &amp; Handover Workflow</span>
              <span className="text-bone-400">•</span>
              <span className="text-bone-200">5-Stage Verification</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-bone-100 mt-0.5">
              Live Inter-Hospital Request Pipeline
            </h2>
          </div>
        </div>

        {/* Visual Pipeline Stages */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {(['Requested', 'Matched', 'Dispatched', 'In Transit', 'Handover Verified'] as const).map((stage, idx) => {
            const stageRequests = bloodRequests.filter(r => r.status === stage);

            return (
              <div 
                key={stage}
                className="bg-bottle-950 border border-bottle-700/80 rounded-xl p-3.5 flex flex-col min-h-[220px]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-bottle-800">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-4 h-4 rounded-full bg-bottle-800 text-[10px] font-mono flex items-center justify-center text-bone-200">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-mono font-bold text-bone-200 uppercase tracking-wider">
                      {stage}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bottle-800 text-bone-300">
                    {stageRequests.length}
                  </span>
                </div>

                {/* Cards in this Stage */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {stageRequests.length === 0 ? (
                    <div className="h-28 flex items-center justify-center text-[11px] text-bone-400 font-mono italic">
                      No requests in this stage
                    </div>
                  ) : (
                    stageRequests.map(req => (
                      <div 
                        key={req.id}
                        className="bg-bottle-900 border border-bottle-700 hover:border-bottle-600 rounded-lg p-3 text-xs space-y-2 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-vermilion">
                            {req.bloodGroup} • {req.unitsRequested} Units
                          </span>
                          <span className="text-[10px] font-mono text-bone-400">
                            {req.timestamp}
                          </span>
                        </div>

                        <p className="font-semibold text-bone-100 text-[11px] truncate">
                          {req.requestingHospital}
                        </p>

                        <p className="text-[10px] text-bone-300 line-clamp-2">
                          {req.clinicalIndication}
                        </p>

                        {req.matchedBank && (
                          <div className="text-[10px] font-mono text-sage flex items-center space-x-1">
                            <span>From:</span>
                            <span className="truncate">{req.matchedBank}</span>
                          </div>
                        )}

                        {/* Advance Action Button if not final */}
                        {stage !== 'Handover Verified' && (
                          <button
                            onClick={() => advanceBloodRequestStatus(req.id)}
                            className="w-full mt-1 py-1.5 px-2 bg-bottle-800 hover:bg-bottle-700 border border-bottle-600 rounded text-[10px] font-mono font-semibold text-bone-200 flex items-center justify-center space-x-1 transition-colors"
                          >
                            <span>Advance Stage</span>
                            <ArrowRight className="w-3 h-3 text-sage" />
                          </button>
                        )}

                        {stage === 'Handover Verified' && (
                          <div className="flex items-center space-x-1 text-[10px] font-mono text-sage pt-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Digital Signature Sealed</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
      )}

      {/* MODAL: BROADCAST EMERGENCY BLOOD REQUEST */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bottle-950/80 backdrop-blur-sm p-4">
          <div className="bg-bottle-900 border border-bottle-600 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-bottle-700 pb-3">
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4 text-vermilion" />
                <h3 className="font-serif text-xl font-bold text-bone-100">
                  Broadcast Emergency Blood Request
                </h3>
              </div>
              <button 
                onClick={() => setBroadcastModalOpen(false)}
                className="text-bone-400 hover:text-bone-100 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-4 text-xs">
              
              {/* Target Hospital */}
              <div>
                <label className="block text-bone-300 font-mono mb-1">Requesting Hospital / Facility</label>
                <select 
                  value={targetHospital} 
                  onChange={e => setTargetHospital(e.target.value)}
                  className="w-full bg-bottle-950 border border-bottle-700 rounded-lg p-2.5 text-bone-100 font-sans focus:border-vermilion focus:outline-none"
                >
                  {BENGALURU_HOSPITALS.map(h => (
                    <option key={h.id} value={h.name}>{h.name}</option>
                  ))}
                </select>
              </div>

              {/* Blood Group & Units */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-bone-300 font-mono mb-1">Blood Group Required</label>
                  <select 
                    value={selectedBloodGroup} 
                    onChange={e => setSelectedBloodGroup(e.target.value)}
                    className="w-full bg-bottle-950 border border-bottle-700 rounded-lg p-2.5 text-bone-100 font-mono font-bold focus:border-vermilion focus:outline-none"
                  >
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-bone-300 font-mono mb-1">Units (PRBC / Whole)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={requestedUnits} 
                    onChange={e => setRequestedUnits(Number(e.target.value))}
                    className="w-full bg-bottle-950 border border-bottle-700 rounded-lg p-2.5 text-bone-100 font-mono focus:border-vermilion focus:outline-none"
                  />
                </div>
              </div>

              {/* Clinical Indication */}
              <div>
                <label className="block text-bone-300 font-mono mb-1">Clinical Indication / Diagnosis</label>
                <input 
                  type="text" 
                  value={clinicalIndication} 
                  onChange={e => setClinicalIndication(e.target.value)}
                  placeholder="e.g. Acute Trauma, Hemorrhage, Cardiac Bypass"
                  className="w-full bg-bottle-950 border border-bottle-700 rounded-lg p-2.5 text-bone-100 font-sans focus:border-vermilion focus:outline-none"
                  required
                />
              </div>

              {/* Urgency Tier */}
              <div>
                <label className="block text-bone-300 font-mono mb-1">Urgency Classification</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Immediate (OT Critical)', 'Urgent (<2 hrs)', 'Scheduled'] as const).map(tier => (
                    <button
                      type="button"
                      key={tier}
                      onClick={() => setUrgencyTier(tier)}
                      className={`p-2 rounded-lg border text-center font-mono text-[11px] transition-all ${
                        urgencyTier === tier
                          ? 'bg-vermilion border-vermilion text-bone-50 font-bold shadow'
                          : 'bg-bottle-950 border-bottle-700 text-bone-300 hover:border-bottle-600'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setBroadcastModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-bottle-800 text-bone-300 hover:text-bone-100 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-vermilion hover:bg-vermilion-dark text-bone-50 font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-lg shadow-vermilion/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Matching Banks...' : 'Broadcast Request'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
