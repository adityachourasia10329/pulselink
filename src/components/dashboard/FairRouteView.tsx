import React, { useState } from 'react';
import { usePulseLink } from '../../context/PulseLinkContext';
import { 
  Scale, 
  UserX, 
  ShieldAlert, 
  Lock
} from 'lucide-react';

export const FairRouteView: React.FC = () => {
  const { candidates, applyHumanOverride } = usePulseLink();

  const [overrideModalCandidateId, setOverrideModalCandidateId] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState('Acute intraoperative hemodynamic decompensation requiring immediate salvage grafting');
  const [approverDoctorId, setApproverDoctorId] = useState('DOC-KMC-84920');
  const [overrideSubmitting, setOverrideSubmitting] = useState(false);

  const selectedCandidate = candidates.find(c => c.selected);
  const ruledOutCandidates = candidates.filter(c => !c.selected);

  const handleOverrideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideModalCandidateId) return;

    setOverrideSubmitting(true);
    await applyHumanOverride(overrideModalCandidateId, overrideReason, approverDoctorId);
    setOverrideSubmitting(false);
    setOverrideModalCandidateId(null);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-bottle-700/80 pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-bone-300">
          <Scale className="w-3.5 h-3.5 text-sage" />
          <span>Algorithmic Equity &amp; Clinical Explainability</span>
          <span className="text-bone-400">•</span>
          <span className="text-bone-200">Zero Black-Box Allocation</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-bone-100 mt-1">
          FairRoute Multi-Factor Decision Support
        </h2>
        <p className="text-xs text-bone-300 mt-1 max-w-3xl leading-relaxed">
          Transparent multi-criteria allocation matrix for scarce donor organs and blood reserves. 
          Every decision factor is auditable, explainable, and subject to authorized human clinician override.
        </p>
      </div>

      {/* Decision Summary Banner */}
      <div className="bg-bottle-900 border border-bottle-700 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-sage tracking-wider font-bold">
            Algorithmic Allocation Target
          </span>
          <div className="flex items-center space-x-3 mt-1">
            <h3 className="font-serif text-2xl font-bold text-bone-100">
              Patient {selectedCandidate?.patientInitials} ({selectedCandidate?.age}y)
            </h3>
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-sage/20 text-sage border border-sage/40">
              RECOMMENDED RECIPIENT
            </span>
          </div>
          <p className="text-xs text-bone-300 mt-1">
            Institution: <strong className="text-bone-100">{selectedCandidate?.hospital}</strong> • Recipient ID: <span className="font-mono">{selectedCandidate?.recipientId}</span>
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-bottle-950 px-4 py-2.5 rounded-xl border border-bottle-800">
          <div className="text-center">
            <span className="text-[10px] font-mono text-bone-400 block">Urgency Score</span>
            <span className="font-mono text-lg font-bold text-vermilion">{selectedCandidate?.urgencyScore} / 40</span>
          </div>
          <div className="border-l border-bottle-800 pl-4 text-center">
            <span className="text-[10px] font-mono text-bone-400 block">Viability Feasibility</span>
            <span className="font-mono text-lg font-bold text-sage">{selectedCandidate?.routeFeasibilityScore}%</span>
          </div>
          <div className="border-l border-bottle-800 pl-4 text-center">
            <span className="text-[10px] font-mono text-bone-400 block">Waitlist Days</span>
            <span className="font-mono text-lg font-bold text-bone-100">{selectedCandidate?.waitingDays}d</span>
          </div>
        </div>
      </div>

      {/* Allocation Criteria Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Factor 1 */}
        <div className="bg-bottle-950 border border-bottle-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-mono text-bone-300 mb-2">
            <span>1. Clinical Need (MELD)</span>
            <span className="text-vermilion font-bold">{selectedCandidate?.scoreBreakdown.clinicalNeed} / 40</span>
          </div>
          <div className="w-full bg-bottle-900 h-2 rounded-full overflow-hidden mb-2">
            <div 
              className="bg-vermilion h-full" 
              style={{ width: `${(selectedCandidate?.scoreBreakdown.clinicalNeed! / 40) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-bone-400">
            Status 1A urgent prioritization based on cardiac index and acute mechanical support.
          </p>
        </div>

        {/* Factor 2 */}
        <div className="bg-bottle-950 border border-bottle-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-mono text-bone-300 mb-2">
            <span>2. Transit Viability</span>
            <span className="text-sage font-bold">{selectedCandidate?.scoreBreakdown.viabilityMatch}%</span>
          </div>
          <div className="w-full bg-bottle-900 h-2 rounded-full overflow-hidden mb-2">
            <div 
              className="bg-sage h-full" 
              style={{ width: `${selectedCandidate?.scoreBreakdown.viabilityMatch}%` }}
            />
          </div>
          <p className="text-[11px] text-bone-400">
            Green corridor guarantees 21-min delivery, safely within 4h cold ischemia threshold.
          </p>
        </div>

        {/* Factor 3 */}
        <div className="bg-bottle-950 border border-bottle-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-mono text-bone-300 mb-2">
            <span>3. HLA / Serology</span>
            <span className="text-sage font-bold">{selectedCandidate?.scoreBreakdown.hlaMatch}% Match</span>
          </div>
          <div className="w-full bg-bottle-900 h-2 rounded-full overflow-hidden mb-2">
            <div 
              className="bg-sage h-full" 
              style={{ width: `${selectedCandidate?.scoreBreakdown.hlaMatch}%` }}
            />
          </div>
          <p className="text-[11px] text-bone-400">
            6/6 HLA antigen compatibility; 0.04 hyperacute rejection probability.
          </p>
        </div>

        {/* Factor 4 */}
        <div className="bg-bottle-950 border border-bottle-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-mono text-bone-300 mb-2">
            <span>4. Waiting Equity</span>
            <span className="text-bone-200 font-bold">{selectedCandidate?.scoreBreakdown.equitySeniority}%</span>
          </div>
          <div className="w-full bg-bottle-900 h-2 rounded-full overflow-hidden mb-2">
            <div 
              className="bg-bottle-600 h-full" 
              style={{ width: `${selectedCandidate?.scoreBreakdown.equitySeniority}%` }}
            />
          </div>
          <p className="text-[11px] text-bone-400">
            412 days on Karnataka State Organ and Tissue Transplant Organization (KSTTO) roster.
          </p>
        </div>

      </div>

      {/* Ruled-Out Options & Transparent Disqualifications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-bottle-700/80 pb-2">
          <div className="flex items-center space-x-2">
            <UserX className="w-4 h-4 text-amber" />
            <h3 className="font-serif text-lg font-bold text-bone-100">
              Ruled-Out Candidates &amp; Transparent Clinical Disqualification
            </h3>
          </div>
          <span className="text-xs font-mono text-bone-400">
            Full Explainability Log
          </span>
        </div>

        <div className="space-y-3">
          {ruledOutCandidates.map(candidate => (
            <div 
              key={candidate.recipientId}
              className="bg-bottle-900 border border-bottle-700/80 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-bone-100 text-sm">
                    Candidate {candidate.patientInitials} ({candidate.age}y)
                  </span>
                  <span className="text-xs text-bone-400 font-mono">
                    • {candidate.hospital} • {candidate.recipientId}
                  </span>
                </div>

                <div className="bg-bottle-950 p-2.5 rounded-lg border border-bottle-800 text-xs text-bone-300 leading-relaxed">
                  <strong className="text-amber font-mono text-[11px] block mb-0.5">
                    REASON RULED OUT BY ALGORITHM:
                  </strong>
                  {candidate.ruledOutReason}
                </div>
              </div>

              {/* Human Override Action Button */}
              <div className="shrink-0 self-end md:self-auto">
                <button
                  onClick={() => setOverrideModalCandidateId(candidate.recipientId)}
                  className="px-3.5 py-2 rounded-lg bg-bottle-800 hover:bg-vermilion hover:text-bone-50 text-bone-200 border border-bottle-600 hover:border-vermilion text-xs font-mono font-bold transition-all flex items-center space-x-1.5 shadow"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Human Override</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HUMAN OVERRIDE MODAL */}
      {overrideModalCandidateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bottle-950/85 backdrop-blur-sm p-4">
          <div className="bg-bottle-900 border border-vermilion/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-bottle-700 pb-3">
              <div className="flex items-center space-x-2 text-vermilion">
                <ShieldAlert className="w-5 h-5 text-vermilion" />
                <h3 className="font-serif text-xl font-bold text-bone-100">
                  Authorized Human Clinician Override
                </h3>
              </div>
              <button 
                onClick={() => setOverrideModalCandidateId(null)}
                className="text-bone-400 hover:text-bone-100 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-vermilion/10 border border-vermilion/30 rounded-lg p-3 text-xs text-bone-200 leading-relaxed font-sans">
              <strong>Statutory Warning:</strong> Performing a clinical override bypasses the algorithmic priority rank. 
              This event will be permanently written to the append-only <strong>ClearChain</strong> audit ledger with your 
              approver credentials and timestamp for state regulatory review.
            </div>

            <form onSubmit={handleOverrideSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-bone-300 font-mono mb-1">Target Candidate to Prioritize</label>
                <input 
                  type="text" 
                  value={overrideModalCandidateId} 
                  disabled 
                  className="w-full bg-bottle-950 border border-bottle-700 rounded-lg p-2.5 text-bone-200 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-bone-300 font-mono mb-1">Clinical Justification (Mandatory)</label>
                <textarea 
                  rows={3}
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  className="w-full bg-bottle-950 border border-bottle-700 rounded-lg p-2.5 text-bone-100 font-sans focus:border-vermilion focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-bone-300 font-mono mb-1">Authorizing Doctor / Superintendent ID</label>
                <input 
                  type="text" 
                  value={approverDoctorId}
                  onChange={e => setApproverDoctorId(e.target.value)}
                  className="w-full bg-bottle-950 border border-bottle-700 rounded-lg p-2.5 text-bone-100 font-mono uppercase focus:border-vermilion focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setOverrideModalCandidateId(null)}
                  className="px-4 py-2 rounded-lg bg-bottle-800 text-bone-300 hover:text-bone-100 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={overrideSubmitting}
                  className="px-5 py-2 rounded-lg bg-vermilion hover:bg-vermilion-dark text-bone-50 font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-lg shadow-vermilion/30"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{overrideSubmitting ? 'Signing Block...' : 'Sign & Apply Override'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
