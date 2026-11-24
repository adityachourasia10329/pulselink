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
  Flame, 
  UserCheck, 
  FileText, 
  Info
} from 'lucide-react';

export const RequestsHub: React.FC = () => {
  const { 
    organTransfers, 
    bloodBanks, 
    bloodRequests, 
    broadcastEmergencyBlood, 
    advanceBloodRequestStatus,
    activeSubFocus,
    setActiveSubFocus,
    canViewOrganOriginLocation,
    requestMedicalPersonnelHelp
  } = usePulseLink();

  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [targetHospital, setTargetHospital] = useState(BENGALURU_HOSPITALS[2].name);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('O-');
  const [requestedUnits, setRequestedUnits] = useState(3);
  const [clinicalIndication, setClinicalIndication] = useState('Acute Trauma Resuscitation — Massive Hemorrhage Protocol');
  const [urgencyTier, setUrgencyTier] = useState<'Immediate (OT Critical)' | 'Urgent (<2 hrs)' | 'Scheduled'>('Immediate (OT Critical)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Expanded report modal
  const [activeReportOrgan, setActiveReportOrgan] = useState<any | null>(null);
  const [activeHelpToast, setActiveHelpToast] = useState<string | null>(null);

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

  const handleHelpClick = async (regType: string, organId: string) => {
    await requestMedicalPersonnelHelp(regType, organId);
    setActiveHelpToast(`Medical personnel dispatched to assist with ${regType}.`);
    setTimeout(() => setActiveHelpToast(null), 4000);
  };

  const bloodGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  return (
    <div className="space-y-8">
      
      {activeHelpToast && (
        <div className="p-3.5 rounded-xl bg-sage/20 border border-sage text-sage text-xs font-mono flex items-center space-x-2 shadow-lg animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{activeHelpToast}</span>
        </div>
      )}

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

      {/* SECTION 1: ORGAN VIABILITY TRACKER (Section 3 Specifications) */}
      {(activeSubFocus === 'all' || activeSubFocus === 'organ') && (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bottle-700/80 pb-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-bone-300">
              <Heart className="w-3.5 h-3.5 text-vermilion" />
              <span>Cold Ischemia &amp; Clinical Match Engine</span>
              <span className="text-bone-400">•</span>
              <span className="text-sage">Autonomous Viability Clocks</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-bone-100 mt-0.5">
              Organ Viability &amp; Clinical Matching Console
            </h2>
          </div>
          <p className="text-xs text-bone-300 font-mono">
            Active Organ Transfers: <strong className="text-bone-100">{organTransfers.length} Monitored</strong>
          </p>
        </div>

        {/* Security Rule 1.2a Notice when location is masked */}
        {!canViewOrganOriginLocation && (
          <div className="p-3 rounded-xl bg-bottle-950/80 border border-bottle-800 text-xs font-mono text-bone-300 flex items-center space-x-2">
            <Info className="w-4 h-4 text-sage shrink-0" />
            <span>
              Security Rule 1.2a Masking Active: Precise donor procurement hospital coordinates and map visuals are restricted for clinical privacy and security.
            </span>
          </div>
        )}

        {/* Organ Viability Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {organTransfers.map(item => {
            const isCritical = item.remainingSeconds < 3600;
            const totalSec = item.totalViabilityHours * 3600;
            const elapsedPercent = Math.min(100, Math.round(((totalSec - item.remainingSeconds) / totalSec) * 100));

            return (
              <div 
                key={item.id}
                className={`bg-bottle-900 rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isCritical 
                    ? 'border-vermilion shadow-2xl shadow-vermilion/20 ring-1 ring-vermilion/50' 
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

                <div className="space-y-4">
                  {/* Organ Header, Blood Type & Match Status */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-serif text-2xl font-bold text-bone-100">{item.organ}</span>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-bottle-950 border border-bottle-700 text-sage" title="Blood Type of Organ Donor">
                          Type {item.bloodType || item.bloodGroup}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-bone-400 mt-0.5">
                        Donor ID: {item.donorId}
                      </p>
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        item.matchStatus === 'Matched'
                          ? 'bg-sage/20 text-sage border border-sage/40'
                          : item.matchStatus === 'Pending Review'
                          ? 'bg-amber/20 text-amber border border-amber/40'
                          : 'bg-bottle-950 text-bone-300 border border-bottle-800'
                      }`}>
                        {item.matchStatus}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-bottle-800 text-bone-300">
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* ToD of Initial Owner & Live Countdown Timer */}
                  <div className="bg-bottle-950 rounded-xl p-3.5 border border-bottle-800 text-center space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-bone-400 border-b border-bottle-800/80 pb-1.5">
                      <span>Time of Death (ToD):</span>
                      <span className="text-bone-200 font-bold">{item.timeOfDeathInitialOwner || item.timeOfDeath}</span>
                    </div>

                    <div className="flex items-center justify-center space-x-1.5 text-xs text-bone-300 font-mono">
                      <Clock className="w-3.5 h-3.5 text-bone-400" />
                      <span>Remaining Cold Ischemia Window</span>
                    </div>

                    <div className={`font-mono text-3xl font-bold tracking-wider ${
                      isCritical ? 'text-vermilion drop-shadow-md animate-pulse' : 'text-bone-100'
                    }`}>
                      {formatTimer(item.remainingSeconds)}
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-1">
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

                  {/* Organ Condition & Preservation */}
                  <div className="p-3 rounded-xl bg-bottle-950/70 border border-bottle-800 text-xs font-mono space-y-1">
                    <div className="flex justify-between">
                      <span className="text-bone-400 text-[10px]">Preservation Modality:</span>
                      <span className="text-bone-200 text-[11px] font-semibold">{item.organCondition.preservationMethod || item.organCondition.perfusionMethod || 'Hypothermic Machine Perfusion (HMP)'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-bone-400 text-[10px]">Perfusion Temp:</span>
                      <span className="text-sage text-[11px] font-bold">{item.organCondition.temperatureCelsius || 4.0}°C Monitored</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-bone-400 text-[10px]">Biochemical Status:</span>
                      <span className="text-bone-300 text-[10px] truncate max-w-[150px]">{item.organCondition.biochemicalParameters || item.organCondition.biopsyAssessment}</span>
                    </div>
                  </div>

                  {/* Match Status & Reasoning for New Patient */}
                  <div className="p-3 rounded-xl bg-bottle-950/70 border border-bottle-800 text-xs space-y-1">
                    <span className="text-[10px] font-mono uppercase text-sage font-bold block">
                      Patient Compatibility Reasoning:
                    </span>
                    <p className="text-bone-200 font-sans text-xs leading-relaxed">
                      {item.matchReasoning}
                    </p>
                  </div>

                  {/* Route & Hospitals (Respecting Rule 1.2a Masking) */}
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex items-start space-x-2">
                      <span className="text-bone-400 text-[11px] w-14 shrink-0">Donor:</span>
                      {canViewOrganOriginLocation ? (
                        <span className="text-bone-200 font-medium">{item.donorHospital}</span>
                      ) : (
                        <span className="text-bone-400 italic text-[11px]">[Origin Location Masked per Rule 1.2a]</span>
                      )}
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-vermilion text-[11px] w-14 shrink-0">Recipient:</span>
                      <span className="text-bone-100 font-semibold">{item.recipientHospital}</span>
                    </div>
                  </div>

                  {/* Government Registrations Needed */}
                  <div className="p-3 rounded-xl bg-bottle-950/90 border border-bottle-800 text-xs space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-bone-400">
                      <span>Government Registrations Needed:</span>
                      <span className="text-sage font-bold">{item.governmentRegistrations.registrationStatus}</span>
                    </div>
                    <div className="text-[11px] font-mono text-bone-200 space-y-0.5">
                      <div>NOTTO ID: <strong className="text-bone-100">{item.governmentRegistrations.nottoId}</strong></div>
                      <div>Forms: <strong className="text-bone-100">{item.governmentRegistrations.thotaForms.join(', ')}</strong></div>
                    </div>

                    <button
                      onClick={() => handleHelpClick(item.governmentRegistrations.thotaForms[0] || 'NOTTO Clearance', item.id)}
                      className="w-full mt-1 py-2 px-3 rounded-lg bg-cobalt hover:bg-cobalt-dark text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Take Help of Medical Personnel</span>
                    </button>
                  </div>
                </div>

                {/* Footer details */}
                <div className="mt-4 pt-3 border-t border-bottle-800/80 flex items-center justify-between text-[11px] font-mono text-bone-300">
                  <button
                    onClick={() => setActiveReportOrgan(item)}
                    className="text-sage hover:underline flex items-center space-x-1 text-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Medical Reports</span>
                  </button>
                  <span>ETA: <strong className="text-sage">{item.estimatedArrivalMinutes} min</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* SECTION 2 & 3: BLOOD SHORTAGES & PIPELINE (Section 5 Specifications) */}
      {(activeSubFocus === 'all' || activeSubFocus === 'blood') && (
        <div className="space-y-8">
          
          {/* Blood Shortages & Broadcast */}
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

          {/* Inter-Hospital Coordination Pipeline with Section 5 Blood Checks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-bottle-700/80 pb-3">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-bone-300">
                  <Truck className="w-3.5 h-3.5 text-sage" />
                  <span>Blood Condition, Quality &amp; Compatibility Checks</span>
                  <span className="text-bone-400">•</span>
                  <span className="text-bone-200">5-Stage Verification</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-bone-100 mt-0.5">
                  Live Transfusion Requisition Pipeline
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
                    className="bg-bottle-950 border border-bottle-700/80 rounded-xl p-3 flex flex-col min-h-[300px]"
                  >
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
                                {req.bloodGroup} • {req.quantityNeeded || req.unitsRequested} Units
                              </span>
                              <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                                req.urgencyLevel?.includes('Critical')
                                  ? 'bg-vermilion/20 text-vermilion border border-vermilion/40'
                                  : 'bg-amber/20 text-amber border border-amber/40'
                              }`}>
                                {req.urgencyLevel || req.urgency}
                              </span>
                            </div>

                            <p className="font-semibold text-bone-100 text-[11px] truncate">
                              {req.requestingHospital}
                            </p>

                            {/* Blood Group Check & Crossmatch (Section 5) */}
                            {req.bloodGroupCheck && (
                              <div className="p-2 rounded bg-bottle-950 border border-bottle-800 text-[10px] font-mono space-y-0.5">
                                <div className="flex justify-between">
                                  <span className="text-bone-400">Rh Factor:</span>
                                  <span className="text-bone-200 font-bold">{req.bloodGroupCheck.rhFactor}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-bone-400">Cross-Match:</span>
                                  <span className="text-sage font-bold">{req.bloodGroupCheck.crossMatchResult}</span>
                                </div>
                              </div>
                            )}

                            {/* Blood Condition & Quality (Section 5) */}
                            {req.bloodConditionAndQuality && (
                              <div className="p-2 rounded bg-bottle-950/70 border border-bottle-800 text-[10px] font-mono space-y-0.5">
                                <div className="flex justify-between">
                                  <span className="text-bone-400">Condition:</span>
                                  <span className="text-sage font-bold">{req.bloodConditionAndQuality.qualityStatus}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-bone-400">HCT / Hemolysis:</span>
                                  <span className="text-bone-200">{req.bloodConditionAndQuality.hematocritPercent}% / {req.bloodConditionAndQuality.hemolysisPercent}%</span>
                                </div>
                              </div>
                            )}

                            {req.matchedBank && (
                              <div className="text-[10px] font-mono text-sage flex items-center space-x-1">
                                <span>From:</span>
                                <span className="truncate">{req.matchedBank}</span>
                              </div>
                            )}

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

      {/* DETAIL MODAL: VIEW CLINICAL MEDICAL REPORTS */}
      {activeReportOrgan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bottle-950/80 backdrop-blur-sm p-4">
          <div className="bg-bottle-900 border border-bottle-600 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-bottle-700 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-sage" />
                <h3 className="font-serif text-lg font-bold text-bone-100">
                  Donor Clinical Dossier: {activeReportOrgan.organ} ({activeReportOrgan.id})
                </h3>
              </div>
              <button 
                onClick={() => setActiveReportOrgan(null)}
                className="text-bone-400 hover:text-bone-100 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono bg-bottle-950 p-4 rounded-xl border border-bottle-800">
              <div className="flex justify-between">
                <span className="text-bone-400">Blood Type:</span>
                <span className="text-sage font-bold">{activeReportOrgan.bloodType || activeReportOrgan.bloodGroup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-400">ToD of Initial Owner:</span>
                <span className="text-bone-200 font-bold">{activeReportOrgan.timeOfDeathInitialOwner || activeReportOrgan.timeOfDeath}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-400">HLA Typing:</span>
                <span className="text-bone-100">{activeReportOrgan.medicalReports.hlaTyping}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-400">Cross-Match:</span>
                <span className="text-sage font-bold">{activeReportOrgan.medicalReports.crossMatchResult || activeReportOrgan.medicalReports.crossMatch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-400">Serology Screening:</span>
                <span className="text-bone-200">{activeReportOrgan.medicalReports.serology}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-400">Biopsy Status:</span>
                <span className="text-bone-200">{activeReportOrgan.medicalReports.biopsyScore || activeReportOrgan.organCondition.biopsyAssessment}</span>
              </div>
            </div>

            <p className="text-xs text-bone-200 font-sans leading-relaxed">
              {activeReportOrgan.medicalReports.clinicalSummary || activeReportOrgan.allocatedReason}
            </p>

            <button
              onClick={() => setActiveReportOrgan(null)}
              className="w-full py-2.5 rounded-xl bg-bottle-800 hover:bg-bottle-700 text-bone-100 text-xs font-semibold"
            >
              Close Dossier
            </button>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-bone-300 font-mono mb-1">Blood Group</label>
                  <select 
                    value={selectedBloodGroup} 
                    onChange={e => setSelectedBloodGroup(e.target.value)}
                    className="w-full bg-bottle-950 border border-bottle-700 rounded-lg p-2.5 text-bone-100 font-sans focus:border-vermilion focus:outline-none"
                  >
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-bone-300 font-mono mb-1">Units (PRBC)</label>
                  <input 
                    type="number" 
                    min={1} 
                    max={12} 
                    value={requestedUnits} 
                    onChange={e => setRequestedUnits(Number(e.target.value))}
                    className="w-full bg-bottle-950 border border-bottle-700 rounded-lg p-2.5 text-bone-100 font-sans focus:border-vermilion focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-bone-300 font-mono mb-1">Clinical Indication</label>
                <input 
                  type="text" 
                  value={clinicalIndication} 
                  onChange={e => setClinicalIndication(e.target.value)}
                  className="w-full bg-bottle-950 border border-bottle-700 rounded-lg p-2.5 text-bone-100 font-sans focus:border-vermilion focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-bone-300 font-mono mb-1">Urgency Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Immediate (OT Critical)', 'Urgent (<2 hrs)', 'Scheduled'] as const).map(tier => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setUrgencyTier(tier)}
                      className={`py-2 px-2 rounded-lg text-center font-mono text-[11px] border transition-all ${
                        urgencyTier === tier 
                          ? 'bg-vermilion text-bone-50 border-vermilion font-bold' 
                          : 'bg-bottle-950 text-bone-300 border-bottle-700 hover:border-bottle-600'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg bg-vermilion hover:bg-vermilion-dark text-bone-50 font-bold uppercase tracking-wider text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting Over Grid...' : 'Broadcast Immediate Dispatch'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
