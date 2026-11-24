import React, { useState } from 'react';
import { usePulseLink } from '../../context/PulseLinkContext';
import { 
  Heart, 
  Droplet, 
  Pill, 
  FileText, 
  UserCheck, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  Info,
  Building
} from 'lucide-react';

export const CommonUserViews: React.FC<{ activeSubMode?: 'availability' | 'registrations' | 'inquiries' }> = ({
  activeSubMode = 'availability'
}) => {
  const { 
    organTransfers, 
    bloodBanks, 
    medicines, 
    userInquiries, 
    submitUserInquiry, 
    requestMedicalPersonnelHelp,
    selectedCity,
    verificationUser
  } = usePulseLink();

  const [currentSubMode, setCurrentSubMode] = useState<'availability' | 'registrations' | 'inquiries'>(activeSubMode);
  
  // Inquiry form state
  const [inquiryCategory, setInquiryCategory] = useState<'organ' | 'blood' | 'medicine' | 'general'>('organ');
  const [inquiryQuery, setInquiryQuery] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Assistance modal state
  const [helpRequestedModal, setHelpRequestedModal] = useState<string | null>(null);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryQuery.trim()) return;
    await submitUserInquiry(inquiryCategory, inquiryQuery);
    setInquirySubmitted(true);
    setInquiryQuery('');
    setTimeout(() => setInquirySubmitted(false), 4000);
  };

  const handleRequestHelp = async (registrationName: string, organId?: string) => {
    await requestMedicalPersonnelHelp(registrationName, organId);
    setHelpRequestedModal(registrationName);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-bottle-900 border border-bottle-700/80 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-bone-300">
            <span className="w-2 h-2 rounded-full bg-sage animate-ping-slow" />
            <span>Patient &amp; Family Support Portal</span>
            <span className="text-bone-400">•</span>
            <span className="text-bone-200">{selectedCity.name} Healthcare Grid</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-bone-100 mt-1">
            Transplantation, Transfusion &amp; Medicine Assistance
          </h1>
          <p className="text-xs text-bone-300 font-sans mt-0.5">
            Transparent availability status and assisted government statutory compliance workflows.
          </p>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center space-x-1.5 bg-bottle-950 p-1.5 rounded-xl border border-bottle-800 self-start sm:self-auto">
          <button
            onClick={() => setCurrentSubMode('availability')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentSubMode === 'availability'
                ? 'bg-cobalt text-white shadow-md'
                : 'text-bone-300 hover:text-bone-100'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-vermilion" />
            <span>Availability Status</span>
          </button>

          <button
            onClick={() => setCurrentSubMode('registrations')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentSubMode === 'registrations'
                ? 'bg-cobalt text-white shadow-md'
                : 'text-bone-300 hover:text-bone-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Gov Registrations &amp; Help</span>
          </button>

          <button
            onClick={() => setCurrentSubMode('inquiries')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentSubMode === 'inquiries'
                ? 'bg-cobalt text-white shadow-md'
                : 'text-bone-300 hover:text-bone-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-sage" />
            <span>Direct Inquiries ({userInquiries.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: AVAILABILITY STATUS (Rule 1.2a Compliant: NO MAP & NO ORGAN ORIGIN LOCATION) */}
      {currentSubMode === 'availability' && (
        <div className="space-y-6">
          
          {/* Security Notice */}
          <div className="p-3.5 rounded-xl bg-bottle-950 border border-bottle-800 text-xs font-mono text-bone-300 flex items-center space-x-2.5">
            <Info className="w-4 h-4 text-sage shrink-0" />
            <span>
              Security Rule 1.2a Compliant: Live physiological viability and matched statuses are shown below. Precise donor origin GPS and maps are restricted to prevent unauthorized interference.
            </span>
          </div>

          {/* Organs Availability */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-bottle-700/80 pb-2">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-vermilion" />
                <h2 className="font-serif text-lg font-bold text-bone-100">
                  Organ Availability &amp; Matching Status
                </h2>
              </div>
              <span className="text-xs font-mono text-sage font-bold">
                {organTransfers.length} Active Donor Profiles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {organTransfers.map(item => (
                <div 
                  key={item.id}
                  className="bg-bottle-900 border border-bottle-700 rounded-xl p-4 shadow-lg space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-serif text-xl font-bold text-bone-100">{item.organ}</span>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-bottle-950 border border-bottle-700 text-sage">
                          {item.bloodGroup}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        item.matchStatus === 'Matched'
                          ? 'bg-sage/20 text-sage border border-sage/40'
                          : item.matchStatus === 'Pending Review'
                          ? 'bg-amber/20 text-amber border border-amber/40'
                          : 'bg-bottle-950 text-bone-300 border border-bottle-800'
                      }`}>
                        {item.matchStatus}
                      </span>
                    </div>

                    <div className="mt-3 p-2.5 rounded-lg bg-bottle-950 border border-bottle-800 text-xs font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="text-bone-400">ToD of Donor:</span>
                        <span className="text-bone-200">{item.timeOfDeathInitialOwner || item.timeOfDeath}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-bone-400">Remaining Viability:</span>
                        <span className="text-vermilion font-bold">
                          {Math.floor(item.remainingSeconds / 3600)}h {Math.floor((item.remainingSeconds % 3600) / 60)}m
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-bone-400">Organ Condition:</span>
                        <span className="text-sage">{(item.organCondition.preservationMethod || item.organCondition.perfusionMethod || 'HMP').split(' ')[0]} (4°C)</span>
                      </div>
                    </div>

                    {/* Masked origin facility */}
                    <div className="mt-2 text-[11px] font-mono text-bone-400">
                      <span className="block text-bone-500 text-[10px]">Origin Hospital:</span>
                      <span className="text-bone-300 italic">[Facility Masked per Security Rule 1.2a]</span>
                    </div>

                    <div className="mt-2 text-xs text-bone-300 font-sans p-2 rounded bg-bottle-950/60 border border-bottle-800">
                      <span className="text-[10px] font-mono text-bone-400 block">Clinical Reasoning:</span>
                      <p className="mt-0.5 line-clamp-2">{item.matchReasoning}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRequestHelp('NOTTO Organ Allocation Guideline', item.id)}
                    className="w-full py-2 px-3 rounded-lg bg-bottle-800 hover:bg-bottle-700 border border-bottle-600 text-bone-100 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-sage" />
                    <span>Take Help of Medical Personnel</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Blood Availability */}
          <div className="space-y-3 pt-4 border-t border-bottle-800">
            <div className="flex items-center justify-between border-b border-bottle-700/80 pb-2">
              <div className="flex items-center space-x-2">
                <Droplet className="w-4 h-4 text-vermilion" />
                <h2 className="font-serif text-lg font-bold text-bone-100">
                  Regional Blood Bank Availability
                </h2>
              </div>
              <span className="text-xs font-mono text-bone-300">
                Live Transfusion Reserve Radar
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {bloodBanks.map(bank => (
                <div key={bank.id} className="bg-bottle-900 border border-bottle-700 rounded-xl p-3.5 text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-bone-100 font-serif">{bank.bankName}</h4>
                      <p className="text-[11px] text-bone-400 font-mono">{bank.location}</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                  </div>

                  <div className="grid grid-cols-4 gap-1 font-mono text-center">
                    {Object.entries(bank.stock).slice(0, 4).map(([group, qty]) => (
                      <div key={group} className="bg-bottle-950 p-1 rounded border border-bottle-800">
                        <span className="block text-[10px] text-bone-400">{group}</span>
                        <span className="font-bold text-bone-100">{qty}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-bone-400 font-mono text-right">
                    Hotline: {bank.contactPhone}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Essential Medicine Availability */}
          <div className="space-y-3 pt-4 border-t border-bottle-800">
            <div className="flex items-center justify-between border-b border-bottle-700/80 pb-2">
              <div className="flex items-center space-x-2">
                <Pill className="w-4 h-4 text-sage" />
                <h2 className="font-serif text-lg font-bold text-bone-100">
                  Verified Critical Medicine Availability
                </h2>
              </div>
              <span className="text-xs font-mono text-sage">
                {medicines.length} Authenticated Batches
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {medicines.map(med => (
                <div key={med.batchId} className="bg-bottle-900 border border-bottle-700 rounded-xl p-3.5 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-bone-100">{med.medicineName}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sage/20 text-sage border border-sage/40">
                      {med.verificationStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-bone-300 font-mono">
                    Batch: {med.batchId} • {med.unitsAvailable || med.currentStockUnits} Available
                  </p>
                  <p className="text-[10px] text-bone-400 font-mono">
                    Storage: {med.storageRequirement}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: GOVERNMENT REGISTRATIONS NEEDED & HELP */}
      {currentSubMode === 'registrations' && (
        <div className="space-y-6">
          <div className="border-b border-bottle-700/80 pb-3">
            <h2 className="font-serif text-xl font-bold text-bone-100">
              Government Registrations &amp; Statutory Approvals Needed
            </h2>
            <p className="text-xs text-bone-300 font-sans mt-0.5">
              Clear checklist of mandatory regulatory clearances required under Transplantation of Human Organs and Tissues Act (THOTA 1994).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* NOTTO Registration */}
            <div className="bg-bottle-900 border border-bottle-700 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-sage font-bold block">
                    National Level Registration
                  </span>
                  <h3 className="font-serif text-lg font-bold text-bone-100">
                    NOTTO National Organ Registry
                  </h3>
                </div>
                <Building className="w-5 h-5 text-bone-400" />
              </div>

              <p className="text-xs text-bone-300 font-sans leading-relaxed">
                National Organ &amp; Tissue Transplant Organisation (NOTTO) registration is mandatory for all recipients on the waiting list.
              </p>

              <div className="p-3 rounded-xl bg-bottle-950 border border-bottle-800 text-xs font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-bone-400">Required Document:</span>
                  <span className="text-bone-200 font-semibold">NOTTO Form 7 (Waitlist Registry)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bone-400">Processing Time:</span>
                  <span className="text-sage">Instant Emergency Fast-Track</span>
                </div>
              </div>

              <button
                onClick={() => handleRequestHelp('NOTTO Form 7 Waitlist Registration')}
                className="w-full py-2.5 px-4 rounded-xl bg-cobalt hover:bg-cobalt-dark text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Take Help of Medical Personnel for NOTTO</span>
              </button>
            </div>

            {/* SOTTO / ROTTO Clearance */}
            <div className="bg-bottle-900 border border-bottle-700 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-sage font-bold block">
                    State Apex Authority
                  </span>
                  <h3 className="font-serif text-lg font-bold text-bone-100">
                    SOTTO / ROTTO State Clearance
                  </h3>
                </div>
                <Building className="w-5 h-5 text-bone-400" />
              </div>

              <p className="text-xs text-bone-300 font-sans leading-relaxed">
                State Organ &amp; Tissue Transplant Organization (SOTTO Karnataka / Jeevasarthakathe) approval required for organ allocation and inter-hospital corridor dispatch.
              </p>

              <div className="p-3 rounded-xl bg-bottle-950 border border-bottle-800 text-xs font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-bone-400">Required Document:</span>
                  <span className="text-bone-200 font-semibold">Form 1 (Related) / Form 8 (Deceased)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bone-400">Authorization:</span>
                  <span className="text-sage">Hospital Authorization Committee</span>
                </div>
              </div>

              <button
                onClick={() => handleRequestHelp('SOTTO State Clearance Authorization')}
                className="w-full py-2.5 px-4 rounded-xl bg-cobalt hover:bg-cobalt-dark text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Take Help of Medical Personnel for SOTTO</span>
              </button>
            </div>

            {/* THOTA Statutory Committee */}
            <div className="bg-bottle-900 border border-bottle-700 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-sage font-bold block">
                    Statutory Clinical Committee
                  </span>
                  <h3 className="font-serif text-lg font-bold text-bone-100">
                    THOTA Hospital Authorization Committee
                  </h3>
                </div>
                <FileText className="w-5 h-5 text-bone-400" />
              </div>

              <p className="text-xs text-bone-300 font-sans leading-relaxed">
                Mandatory clinical review under THOTA Rules 2014 to verify HLA cross-match results, informed consent, and recipient medical stability.
              </p>

              <button
                onClick={() => handleRequestHelp('THOTA Hospital Authorization Review')}
                className="w-full py-2.5 px-4 rounded-xl bg-bottle-800 hover:bg-bottle-700 border border-bottle-600 text-bone-100 font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
              >
                <UserCheck className="w-4 h-4 text-sage" />
                <span>Request Clinical Personnel Assistance</span>
              </button>
            </div>

            {/* Blood Transfusion Emergency Protocol */}
            <div className="bg-bottle-900 border border-bottle-700 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-sage font-bold block">
                    State Blood Transfusion Council
                  </span>
                  <h3 className="font-serif text-lg font-bold text-bone-100">
                    SBTC Rare Blood Group Requisition
                  </h3>
                </div>
                <Droplet className="w-5 h-5 text-vermilion" />
              </div>

              <p className="text-xs text-bone-300 font-sans leading-relaxed">
                Emergency protocol clearance for negative Rh factor PRBC release from central reserve depots across Bengaluru.
              </p>

              <button
                onClick={() => handleRequestHelp('SBTC Rare Blood Requisition Fast-Track')}
                className="w-full py-2.5 px-4 rounded-xl bg-bottle-800 hover:bg-bottle-700 border border-bottle-600 text-bone-100 font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
              >
                <UserCheck className="w-4 h-4 text-sage" />
                <span>Request Transfusion Officer Assistance</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* VIEW 3: DIRECT USER INQUIRIES & SUBMISSION */}
      {currentSubMode === 'inquiries' && (
        <div className="space-y-6">
          <div className="border-b border-bottle-700/80 pb-3">
            <h2 className="font-serif text-xl font-bold text-bone-100">
              Submit Direct Patient &amp; Family Inquiry
            </h2>
            <p className="text-xs text-bone-300 font-sans mt-0.5">
              Submit urgent assistance requests directly to the PulseLink Duty Medical Officer desk.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form */}
            <div className="lg:col-span-5 bg-bottle-900 border border-bottle-700 rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="font-serif font-bold text-bone-100 text-base">
                New Assistance Request
              </h3>

              {inquirySubmitted && (
                <div className="p-3 rounded-xl bg-sage/20 border border-sage text-sage text-xs font-mono flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Inquiry logged successfully. Assigned to duty medical officer.</span>
                </div>
              )}

              <form onSubmit={handleInquirySubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-bone-300 font-mono mb-1">Inquiry Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'organ', label: 'Organ Transfer' },
                      { id: 'blood', label: 'Blood Requisition' },
                      { id: 'medicine', label: 'Medicine Sourcing' },
                      { id: 'general', label: 'Gov Clearance' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setInquiryCategory(cat.id as any)}
                        className={`p-2 rounded-lg font-mono text-[11px] border text-center transition-all ${
                          inquiryCategory === cat.id
                            ? 'bg-cobalt text-white border-cobalt font-bold'
                            : 'bg-bottle-950 border-bottle-700 text-bone-300 hover:text-bone-100'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-bone-300 font-mono mb-1">Your Detailed Query / Situation</label>
                  <textarea
                    required
                    rows={4}
                    value={inquiryQuery}
                    onChange={e => setInquiryQuery(e.target.value)}
                    placeholder="Describe patient requirement, hospital admitted to, and required statutory assistance..."
                    className="w-full bg-bottle-950 border border-bottle-700 rounded-xl p-3 text-bone-100 focus:border-cobalt outline-none font-sans"
                  />
                </div>

                <div className="p-2.5 rounded-lg bg-bottle-950/80 border border-bottle-800 text-[11px] font-mono text-bone-400">
                  Contact will be made via: <strong className="text-bone-100">{verificationUser?.phoneWhatsapp || 'Your WhatsApp Number'}</strong>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-cobalt hover:bg-cobalt-dark text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cobalt/30 transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Inquiry to Medical Officer</span>
                </button>
              </form>
            </div>

            {/* Inquiries Log */}
            <div className="lg:col-span-7 space-y-3">
              <h3 className="font-serif font-bold text-bone-100 text-base">
                Your Submitted Inquiries &amp; Response Timeline
              </h3>

              <div className="space-y-3">
                {userInquiries.map(inq => (
                  <div 
                    key={inq.id}
                    className="bg-bottle-900 border border-bottle-700 rounded-xl p-4 shadow-md space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-bone-200 px-2 py-0.5 rounded bg-bottle-950 border border-bottle-700">
                          {inq.id}
                        </span>
                        <span className="font-mono text-sage uppercase font-bold text-[10px]">
                          {inq.category}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-bone-400">
                        {inq.timestamp}
                      </span>
                    </div>

                    <p className="text-bone-200 font-sans leading-relaxed">
                      {inq.query}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-bottle-800 text-[11px] font-mono">
                      <span className="text-bone-400">
                        Assigned To: <strong className="text-bone-200">{inq.assignedOfficer || 'Duty Officer'}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-sage/20 border border-sage/40 text-sage font-bold">
                        {inq.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR TAKING HELP OF MEDICAL PERSONNEL */}
      {helpRequestedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bottle-950/80 backdrop-blur-sm p-4">
          <div className="bg-bottle-900 border border-sage rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2.5 text-sage">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="font-serif text-lg font-bold text-bone-100">
                Medical Personnel Paged
              </h3>
            </div>
            
            <p className="text-xs text-bone-200 font-sans leading-relaxed">
              Assistance request registered for <strong className="text-sage">{helpRequestedModal}</strong>. The Hospital Transplant Coordinator / Nodal Medical Officer has been dispatched to contact you via WhatsApp / Phone:
            </p>

            <div className="p-3 rounded-xl bg-bottle-950 border border-bottle-800 text-xs font-mono text-bone-300">
              <span className="block text-bone-400 text-[10px]">Assigned Duty Clinician:</span>
              <span className="text-bone-100 font-bold">Dr. C. Shantharam (Hospital Coordinator)</span>
              <span className="block text-sage text-[10px] mt-1">Expected Response Time: &lt; 5 minutes</span>
            </div>

            <button
              onClick={() => setHelpRequestedModal(null)}
              className="w-full py-2.5 rounded-xl bg-sage hover:bg-sage/90 text-bottle-950 font-bold text-xs"
            >
              Acknowledged
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
