import React, { useState } from 'react';
import { usePulseLink } from '../../context/PulseLinkContext';
import { 
  Building2, 
  Users, 
  CheckSquare, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search
} from 'lucide-react';

export const GovernmentRegistriesView: React.FC<{ initialSection?: 'hospital' | 'patient' | 'allocation' }> = ({
  initialSection = 'allocation'
}) => {
  const { 
    hospitalRegistry, 
    patientRegistry, 
    allocationConsole, 
    approveAllocation, 
    deallocateItem,
    currentUser,
    selectedCity
  } = usePulseLink();

  const [activeSubTab, setActiveSubTab] = useState<'hospital' | 'patient' | 'allocation'>(initialSection);
  const [searchTerm, setSearchTerm] = useState('');
  const [deallocateModalId, setDeallocateModalId] = useState<string | null>(null);
  const [deallocateReason, setDeallocateReason] = useState('');

  const handleDeallocateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deallocateModalId) return;
    await deallocateItem(deallocateModalId, deallocateReason || 'Clinical re-evaluation required by State Nodal Officer');
    setDeallocateModalId(null);
    setDeallocateReason('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Console Header */}
      <div className="bg-bottle-900 border border-bottle-700/80 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-bone-300">
            <ShieldCheck className="w-4 h-4 text-sage" />
            <span>Apex Statutory Authority</span>
            <span className="text-bone-400">•</span>
            <span className="text-sage">NOTTO / SOTTO State Nodal Console</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-bone-100 mt-1">
            Government Registry &amp; Allocation Control Room
          </h1>
          <p className="text-xs text-bone-300 font-mono mt-0.5">
            Jurisdiction: {selectedCity.name} Metropolitan Directorate • Officer: {currentUser.name}
          </p>
        </div>

        {/* Console Sub-Navigation */}
        <div className="flex items-center space-x-1.5 bg-bottle-950 p-1.5 rounded-xl border border-bottle-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('allocation')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'allocation'
                ? 'bg-vermilion text-white shadow-md'
                : 'text-bone-300 hover:text-bone-100'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Allocation Console ({allocationConsole.filter(a => a.officerApprovalStatus === 'PENDING').length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('patient')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'patient'
                ? 'bg-cobalt text-white shadow-md'
                : 'text-bone-300 hover:text-bone-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Patient Registry ({patientRegistry.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('hospital')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'hospital'
                ? 'bg-cobalt text-white shadow-md'
                : 'text-bone-300 hover:text-bone-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Hospital Registry ({hospitalRegistry.length})</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: ALLOCATION & DEALLOCATION CONSOLE */}
      {activeSubTab === 'allocation' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-bottle-700/80 pb-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-bone-100">
                Clinical Allocation &amp; Deallocation Suggestions
              </h2>
              <p className="text-xs text-bone-300 font-sans mt-0.5">
                Statutory suggestions generated from HLA cross-matching, MELD scores, and cold ischemia thresholds for regulatory review.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {allocationConsole.map(item => {
              const isApproved = item.officerApprovalStatus === 'APPROVED';
              const isDeallocated = item.officerApprovalStatus === 'DEALLOCATED';

              return (
                <div 
                  key={item.id}
                  className={`bg-bottle-900 border rounded-2xl p-5 shadow-xl transition-all ${
                    isApproved 
                      ? 'border-sage/60 bg-bottle-900/90' 
                      : isDeallocated 
                      ? 'border-vermilion/50 bg-bottle-950/80' 
                      : 'border-bottle-700 hover:border-bottle-600'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    
                    {/* Main Details */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-2.5">
                        <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-bottle-950 border border-bottle-700 text-bone-200 uppercase">
                          {item.id}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-bone-100">
                          {item.organ.toUpperCase()} Allocation Suggestion: Patient {item.patientInitials}
                        </h3>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          isApproved 
                            ? 'bg-sage/20 text-sage border border-sage/40' 
                            : isDeallocated 
                            ? 'bg-vermilion/20 text-vermilion border border-vermilion/40' 
                            : 'bg-amber/20 text-amber border border-amber/40 animate-pulse'
                        }`}>
                          Status: {item.officerApprovalStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                        <div className="p-2.5 rounded-xl bg-bottle-950 border border-bottle-800">
                          <span className="text-bone-400 block text-[10px]">Patient File &amp; Hospital</span>
                          <span className="text-bone-100 font-semibold">{item.patientInitials} ({item.patientId})</span>
                          <span className="text-bone-300 block text-[11px] truncate">{item.hospital}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-bottle-950 border border-bottle-800">
                          <span className="text-bone-400 block text-[10px]">Organ Batch ID</span>
                          <span className="text-vermilion font-semibold">{item.organId}</span>
                          <span className="text-bone-300 block text-[11px]">Recommended Action: {item.suggestedAction}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-bottle-950 border border-bottle-800">
                          <span className="text-bone-400 block text-[10px]">Timestamp</span>
                          <span className="text-bone-200">{item.timestamp}</span>
                          <span className="text-sage block text-[11px]">State Directorate Node</span>
                        </div>
                      </div>

                      {/* Clinical Reasoning & Reports */}
                      <div className="space-y-1.5 p-3 rounded-xl bg-bottle-950/60 border border-bottle-800 text-xs">
                        <div>
                          <span className="text-sage font-mono text-[11px] uppercase font-bold block">
                            Diagnostic &amp; Test Summary:
                          </span>
                          <p className="text-bone-200 font-sans mt-0.5">{item.medicalReportsSummary}</p>
                        </div>
                        <div className="pt-1.5 border-t border-bottle-800">
                          <span className="text-bone-300 font-mono text-[11px] uppercase font-bold block">
                            Algorithmic Clinical Rationale:
                          </span>
                          <p className="text-bone-300 font-sans mt-0.5">{item.clinicalReasoning}</p>
                        </div>
                      </div>
                    </div>

                    {/* Government Officer Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 pt-2 lg:pt-0">
                      {!isApproved && !isDeallocated && (
                        <>
                          <button
                            onClick={() => approveAllocation(item.id)}
                            className="py-2.5 px-4 rounded-xl bg-sage hover:bg-sage/90 text-bottle-950 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve Allocation</span>
                          </button>

                          <button
                            onClick={() => setDeallocateModalId(item.id)}
                            className="py-2.5 px-4 rounded-xl bg-bottle-950 hover:bg-vermilion/20 border border-bottle-700 hover:border-vermilion text-vermilion font-medium text-xs transition-all flex items-center justify-center space-x-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Deallocate</span>
                          </button>
                        </>
                      )}

                      {isApproved && (
                        <div className="p-3 rounded-xl bg-sage/10 border border-sage/40 text-sage text-center text-xs font-mono space-y-1">
                          <CheckCircle2 className="w-5 h-5 mx-auto" />
                          <span className="font-bold block">Ratified &amp; Allocated</span>
                          <span className="text-[10px] text-bone-300 block">SOTTO Clearance Certificate Dispatched</span>
                        </div>
                      )}

                      {isDeallocated && (
                        <div className="p-3 rounded-xl bg-vermilion/10 border border-vermilion/40 text-vermilion text-center text-xs font-mono space-y-1">
                          <XCircle className="w-5 h-5 mx-auto" />
                          <span className="font-bold block">Deallocated</span>
                          <span className="text-[10px] text-bone-300 block">Reverted to Waiting List Queue</span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: PATIENT REGISTRY */}
      {activeSubTab === 'patient' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-bottle-700/80 pb-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-bone-100">
                State Patient Registry (NOTTO National Waitlist Node)
              </h2>
              <p className="text-xs text-bone-300 font-sans mt-0.5">
                Centralized registry of verified waitlisted recipients with MELD clinical scoring and statutory status.
              </p>
            </div>
            
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-bone-400" />
              <input
                type="text"
                placeholder="Search patient, blood, hospital..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-bottle-950 border border-bottle-700 rounded-lg text-xs text-bone-100 outline-none focus:border-cobalt"
              />
            </div>
          </div>

          <div className="bg-bottle-900 border border-bottle-700 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-bottle-950 text-bone-300 font-mono uppercase text-[11px] border-b border-bottle-700">
                  <tr>
                    <th className="py-3 px-4">Patient ID</th>
                    <th className="py-3 px-3">Organ Needed</th>
                    <th className="py-3 px-3">Blood Group</th>
                    <th className="py-3 px-3">Age / Gender</th>
                    <th className="py-3 px-3">MELD / Severity Score</th>
                    <th className="py-3 px-3">Urgency Tier</th>
                    <th className="py-3 px-3">Hospital</th>
                    <th className="py-3 px-4 text-right">Allocation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bottle-800">
                  {patientRegistry
                    .filter(p => !searchTerm || p.patientInitials.toLowerCase().includes(searchTerm.toLowerCase()) || p.hospital.toLowerCase().includes(searchTerm.toLowerCase()) || p.organNeeded.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(patient => (
                      <tr key={patient.id} className="hover:bg-bottle-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-bone-100">
                          {patient.patientInitials}
                          <span className="block text-[10px] text-bone-400 font-normal">{patient.id}</span>
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-vermilion">{patient.organNeeded}</td>
                        <td className="py-3.5 px-3 font-mono font-bold text-sage">{patient.bloodGroup}</td>
                        <td className="py-3.5 px-3 text-bone-300 font-mono">{patient.age}y / {patient.gender}</td>
                        <td className="py-3.5 px-3 font-mono font-bold text-amber">
                          Score {patient.meldScore}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-bottle-950 border border-bottle-700 text-bone-200">
                            {patient.urgencyTier.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-bone-300 truncate max-w-[160px]">{patient.hospital}</td>
                        <td className="py-3.5 px-4 text-right">
                          <span className={`inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                            patient.allocationStatus === 'ALLOCATED'
                              ? 'bg-sage/20 text-sage border border-sage/40'
                              : patient.allocationStatus === 'DEALLOCATED'
                              ? 'bg-vermilion/20 text-vermilion border border-vermilion/40'
                              : 'bg-bottle-950 text-bone-300 border border-bottle-800'
                          }`}>
                            {patient.allocationStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: HOSPITAL REGISTRY */}
      {activeSubTab === 'hospital' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-bottle-700/80 pb-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-bone-100">
                State Hospital &amp; Transplant Centre Registry
              </h2>
              <p className="text-xs text-bone-300 font-sans mt-0.5">
                Statutory accreditation records, NOTTO registration licenses, and nodal officer contacts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hospitalRegistry.map(hosp => (
              <div 
                key={hosp.id}
                className="bg-bottle-900 border border-bottle-700 rounded-xl p-4 shadow-xl space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-bone-100 text-base">{hosp.name}</h3>
                    <p className="text-[11px] font-mono text-bone-400">License: {hosp.licenseNumber}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sage/20 border border-sage/40 text-sage">
                    {hosp.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-mono bg-bottle-950 p-3 rounded-lg border border-bottle-800">
                  <div className="flex justify-between">
                    <span className="text-bone-400">Accreditation:</span>
                    <span className="text-bone-200">{hosp.accreditation.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-bone-400">Active Transplant Beds:</span>
                    <span className="text-sage font-bold">{hosp.activeTransplantBeds} Dedicated OT/ICU</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-bone-400">Nodal Officer:</span>
                    <span className="text-bone-100">{hosp.nodalOfficer}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-bottle-800/80">
                    <span className="text-bone-400">Direct Hotline:</span>
                    <span className="text-cobalt font-bold">{hosp.contact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DEALLOCATE MODAL */}
      {deallocateModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bottle-950/80 backdrop-blur-sm p-4">
          <div className="bg-bottle-900 border border-vermilion rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-vermilion">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-serif text-lg font-bold text-bone-100">
                Confirm Statutory Deallocation
              </h3>
            </div>
            
            <p className="text-xs text-bone-300 font-sans leading-relaxed">
              State officer authorization required. Please record the clinical or administrative justification for deallocating candidate <strong className="text-bone-100">{deallocateModalId}</strong>.
            </p>

            <form onSubmit={handleDeallocateSubmit} className="space-y-3">
              <textarea
                required
                rows={3}
                value={deallocateReason}
                onChange={e => setDeallocateReason(e.target.value)}
                placeholder="e.g. Cross-match report indicated hyperacute rejection risk; donor-recipient weight discordance > 25%."
                className="w-full bg-bottle-950 border border-bottle-700 rounded-xl p-3 text-xs text-bone-100 focus:border-vermilion outline-none"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-vermilion hover:bg-vermilion-dark text-white font-bold text-xs shadow-md transition-all"
                >
                  Confirm Deallocation
                </button>
                <button
                  type="button"
                  onClick={() => setDeallocateModalId(null)}
                  className="py-2.5 px-4 rounded-xl bg-bottle-950 border border-bottle-700 text-bone-300 hover:text-bone-100 text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
