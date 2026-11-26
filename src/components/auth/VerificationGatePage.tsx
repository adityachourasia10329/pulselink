import React, { useState, useEffect } from 'react';
import { usePulseLink } from '../../context/PulseLinkContext';
import type { UserCategory, PurposeOfVisit, VerificationUserData } from '../../types';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  User, 
  Mail, 
  MapPin, 
  Phone,
  Bookmark,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Clock,
  FileCheck2,
  Edit3
} from 'lucide-react';

export const VerificationGatePage: React.FC = () => {
  const { 
    gateStatus,
    gateGuardError,
    submitIntake,
    completeGateAndEnter,
    resetGateToIntake
  } = usePulseLink();

  // Do NOT auto-fill details on initial visit or reload — form starts completely blank
  // until the user explicitly clicks a saved preset profile on this device.
  const getInitialState = (): VerificationUserData => {
    return {
      fullName: '',
      email: '',
      workOrganisation: '',
      city: '',
      userCategory: '' as UserCategory,
      purposeOfVisit: '' as PurposeOfVisit,
      phoneWhatsapp: '',
      isPulseLinkEmployee: undefined,
      verifiedAt: ''
    };
  };

  const initial = getInitialState();

  const [fullName, setFullName] = useState(initial.fullName || '');
  const [phone, setPhone] = useState(initial.phoneWhatsapp || '');
  const [email, setEmail] = useState(initial.email || '');
  const [workOrganisation, setWorkOrganisation] = useState(initial.workOrganisation || '');
  const [city, setCity] = useState(initial.city || '');
  const [userCategory, setUserCategory] = useState<UserCategory | ''>(initial.userCategory || '');
  const [purposeOfVisit, setPurposeOfVisit] = useState<PurposeOfVisit | ''>(initial.purposeOfVisit || '');
  const [isPulseLinkEmployee, setIsPulseLinkEmployee] = useState<boolean | null>(
    typeof initial.isPulseLinkEmployee === 'boolean' ? initial.isPulseLinkEmployee : null
  );
  const [showEmployeePrompt, setShowEmployeePrompt] = useState(false);

  // Load ONLY presets entered on this particular device (never dummy or someone else's details)
  const [devicePresets, setDevicePresets] = useState<VerificationUserData[]>(() => {
    try {
      const raw = localStorage.getItem('pulselink_device_saved_profiles');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Automatically sync current form choices into localStorage on this device
  useEffect(() => {
    const currentData: VerificationUserData = {
      fullName,
      email,
      workOrganisation,
      city,
      phoneWhatsapp: phone,
      userCategory: userCategory || 'patient_or_family' as UserCategory,
      purposeOfVisit: purposeOfVisit || 'requesting' as PurposeOfVisit,
      isPulseLinkEmployee: isPulseLinkEmployee ?? false,
      verifiedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem('pulselink_verification_gate', JSON.stringify(currentData));
    } catch {
      // ignore
    }
  }, [fullName, email, workOrganisation, city, phone, userCategory, purposeOfVisit, isPulseLinkEmployee]);

  const saveToDevicePresets = (profile: VerificationUserData) => {
    try {
      const raw = localStorage.getItem('pulselink_device_saved_profiles');
      let list: VerificationUserData[] = raw ? JSON.parse(raw) : [];
      list = list.filter(p => !(p.email === profile.email && p.fullName === profile.fullName));
      list.unshift(profile);
      if (list.length > 3) list = list.slice(0, 3);
      localStorage.setItem('pulselink_device_saved_profiles', JSON.stringify(list));
      setDevicePresets(list);
    } catch {
      // ignore
    }
  };

  const handleApplyPreset = (preset: VerificationUserData) => {
    setFullName(preset.fullName || '');
    setPhone(preset.phoneWhatsapp || '');
    setEmail(preset.email || '');
    setWorkOrganisation(preset.workOrganisation || '');
    setCity(preset.city || 'Bengaluru');
    if (preset.userCategory) setUserCategory(preset.userCategory);
    if (preset.purposeOfVisit) setPurposeOfVisit(preset.purposeOfVisit);
    if (typeof preset.isPulseLinkEmployee === 'boolean') {
      setIsPulseLinkEmployee(preset.isPulseLinkEmployee);
    }
  };

  const handleDeleteDevicePreset = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = devicePresets.filter((_, idx) => idx !== indexToDelete);
    setDevicePresets(updated);
    try {
      localStorage.setItem('pulselink_device_saved_profiles', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSelectCategory = (catId: UserCategory) => {
    setUserCategory(catId);
    if (catId === 'other') {
      setShowEmployeePrompt(true);
    } else {
      setShowEmployeePrompt(false);
      setIsPulseLinkEmployee(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData: VerificationUserData = {
      fullName: fullName.trim() || 'Guest User',
      email: email.trim() || 'contact@pulselink.in',
      workOrganisation: workOrganisation.trim() || (isPulseLinkEmployee ? 'PulseLink Core Logistics' : 'Independent Network'),
      city: city.trim() || 'Bengaluru',
      userCategory: userCategory || 'patient_or_family' as UserCategory,
      purposeOfVisit: purposeOfVisit || 'requesting' as PurposeOfVisit,
      phoneWhatsapp: phone.trim(),
      isPulseLinkEmployee: isPulseLinkEmployee ?? false,
      verifiedAt: new Date().toISOString()
    };

    saveToDevicePresets(submissionData);
    submitIntake(submissionData);
  };

  // Determine assigned interface description for Waiting Area
  const getAssignedInterfaceInfo = () => {
    if (userCategory === 'patient_or_family' || userCategory === 'patient_family') {
      return {
        title: 'Common User Interface (Patient / Family Support)',
        allowed: ['Organ, Blood & Essential Medicine Availability', 'Government Registrations (NOTTO/ROTTO/THOTA)', 'Direct Medical Personnel Help Assistance', 'Patient Inquiry Submission'],
        restricted: ['Command Center (Restricted)', 'Live Green Corridor Map (Rule 1.2a Restricted)', 'Organ Physical Location (Rule 1.2a Restricted)', 'Internal Hospital Requests Dispatch Console (Restricted)']
      };
    } else if (userCategory === 'medical_staff') {
      return {
        title: 'Medical Staff / Medical Industry Interface',
        allowed: ['Hospital Responds & Requests Dispatch Console', 'Command Center Operations (Without Geographic Map per Rule 1.2a)', 'Real-Time ETA Tracking', 'Medical Files & Clinical Test Reports Hub', 'Government Registrations Guidance Tools'],
        restricted: ['Live Green Corridor Map (Rule 1.2a Restricted)', 'Organ Geographic Origin Coordinates (Rule 1.2a Restricted)']
      };
    } else if (userCategory === 'gov_employee') {
      return {
        title: 'Government Employee Interface (State Apex Regulatory Console)',
        allowed: ['Full Platform Access', 'Live Green Corridor Map with Traffic Signal Preemption', 'State Hospital Registry & Accreditation Audit', 'State Patient Registry & MELD Urgency Monitoring', 'Clinical Allocation & Deallocation Console', 'ClearChain Cryptographic Audit Trail'],
        restricted: []
      };
    } else {
      return {
        title: isPulseLinkEmployee ? 'PulseLink Core Employee Operations Console' : 'PulseLink External Logistics Console',
        allowed: ['Full Platform Operations Console', 'Green Corridor Dispatch & Telemetry', 'Cold-Chain IoT Monitoring', 'VerifiedMed Barcode & Quality Ledger'],
        restricted: []
      };
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Route Guard Error Banner if direct tab navigation was attempted */}
      {gateGuardError && (
        <div className="w-full max-w-xl mx-auto mb-6 p-4 rounded-xl bg-vermilion/20 border-2 border-vermilion text-bone-100 flex items-start space-x-3 shadow-2xl animate-in fade-in duration-200">
          <AlertTriangle className="w-5 h-5 text-vermilion shrink-0 mt-0.5 animate-bounce" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-vermilion uppercase tracking-wider font-mono">
              Mandatory Gate Clearance Required
            </p>
            <p className="text-bone-200 font-sans leading-relaxed">
              {gateGuardError}
            </p>
          </div>
        </div>
      )}

      {/* Floating Hover Box on top of the details page when 'Other' is selected */}
      {showEmployeePrompt && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bottle-950/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowEmployeePrompt(false)}
        >
          <div 
            className="relative w-full max-w-sm bg-bottle-900 border-2 border-cobalt rounded-2xl shadow-2xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowEmployeePrompt(false)}
              className="absolute top-3 right-3 p-1 rounded-lg text-bone-400 hover:text-bone-100 hover:bg-bottle-800 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex p-2 bg-white rounded-xl shadow-md border border-bone-300/40 mx-auto">
              <img 
                src="/pulselink-logo.jpg" 
                alt="PulseLink Logo" 
                className="h-8 w-auto object-contain" 
              />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-bone-100 font-serif">
                Are you a PulseLink employee?
              </h3>
              <p className="text-xs text-bone-300 font-sans">
                Please confirm whether you are an authorized PulseLink internal team member.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsPulseLinkEmployee(true);
                  if (!workOrganisation || workOrganisation.trim() === '') {
                    setWorkOrganisation('PulseLink Operations');
                  }
                  setShowEmployeePrompt(false);
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs transition-all shadow-md flex items-center justify-center space-x-1.5 ${
                  isPulseLinkEmployee === true
                    ? 'bg-sage text-bottle-950'
                    : 'bg-cobalt hover:bg-cobalt-dark text-white'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Yes, I am</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPulseLinkEmployee(false);
                  setShowEmployeePrompt(false);
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl font-medium text-xs transition-all border flex items-center justify-center space-x-1.5 ${
                  isPulseLinkEmployee === false
                    ? 'bg-bottle-700 text-bone-100 border-bottle-500'
                    : 'bg-bottle-950 hover:bg-bottle-800 border-bottle-700 text-bone-300 hover:text-bone-100'
                }`}
              >
                <X className="w-3.5 h-3.5" />
                <span>No, external</span>
              </button>
            </div>

            {isPulseLinkEmployee === true && (
              <p className="text-[11px] font-mono text-sage bg-bottle-950/90 py-1 px-2.5 rounded-lg border border-sage/40">
                PulseLink Staff Mode Activated
              </p>
            )}
          </div>
        </div>
      )}

      {/* STATE A: WAITING AREA SCREEN (When gateStatus === 'waiting') */}
      {gateStatus === 'waiting' ? (
        <div className="w-full max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="bg-white p-3 rounded-2xl shadow-xl border border-bone-400/20 max-w-[200px]">
              <img 
                src="/pulselink-logo.jpg" 
                alt="PulseLink Logo" 
                className="w-full h-auto object-contain" 
              />
            </div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sage/20 border border-sage text-sage text-xs font-mono font-semibold">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>Intake Verified — Clearance Waiting Area</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-bone-100">
              Statutory Verification Clearance Status
            </h1>
            <p className="text-xs text-bone-300 font-sans max-w-lg">
              Details gathered successfully. Review your assigned single-site interface permissions and access your designated console.
            </p>
          </div>

          {/* Persona Card */}
          <div className="bg-bottle-900 border border-bottle-700 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-bottle-700/80 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-bone-400 block">
                  Intake Profile Identification
                </span>
                <h3 className="text-lg font-bold text-bone-100 font-serif">
                  {fullName}
                </h3>
                <p className="text-xs text-bone-300 font-mono">
                  {workOrganisation} • {city}
                </p>
              </div>
              <button
                onClick={resetGateToIntake}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-bottle-950 border border-bottle-700 text-bone-300 hover:text-bone-100 hover:border-cobalt text-xs font-mono transition-all"
                title="Edit intake details"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Details</span>
              </button>
            </div>

            {/* Verification Checklist */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono uppercase tracking-wider text-bone-400 block">
                Statutory Compliance &amp; Protocol Verification
              </span>
              
              <div className="space-y-2">
                <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-bottle-950/80 border border-bottle-800">
                  <CheckCircle2 className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-bone-100 block">Identity &amp; Communication Protocol Cleared</span>
                    <span className="text-bone-400 font-mono text-[11px]">Contact: {phone} • {email}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-bottle-950/80 border border-bottle-800">
                  <FileCheck2 className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-bone-100 block">Regulatory Compliance Node Handshake (NOTTO / CDSCO)</span>
                    <span className="text-bone-400 font-mono text-[11px]">THOTA Act 1994 compliance check active • City Grid: {city}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-bottle-950/80 border border-bottle-800">
                  <ShieldCheck className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-bone-100 block">Assigned Interface Designation</span>
                    <span className="text-bone-200 font-medium block mt-0.5">{getAssignedInterfaceInfo().title}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Allowed & Restricted Permissions Box — Only visible to Gov Employee and PulseLink Employee */}
            {(userCategory === 'gov_employee' || (userCategory === 'other' && isPulseLinkEmployee === true)) && (
            <div className="p-4 rounded-xl bg-bottle-950 border border-bottle-800 space-y-3">
              <div>
                <span className="text-[11px] font-mono text-sage uppercase font-bold tracking-wider block mb-1">
                  Active Features in Your Interface:
                </span>
                <ul className="text-xs text-bone-200 space-y-1 list-disc list-inside">
                  {getAssignedInterfaceInfo().allowed.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {getAssignedInterfaceInfo().restricted.length > 0 && (
                <div className="pt-2 border-t border-bottle-800">
                  <span className="text-[11px] font-mono text-vermilion uppercase font-bold tracking-wider block mb-1">
                    Strict Role Exclusions Enforced:
                  </span>
                  <ul className="text-xs text-bone-400 space-y-1 list-disc list-inside">
                    {getAssignedInterfaceInfo().restricted.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            )}

            {/* Enter Button */}
            <div className="pt-2 space-y-2">
              <button
                onClick={completeGateAndEnter}
                className="w-full py-4 rounded-xl bg-cobalt hover:bg-cobalt-dark text-white font-bold text-sm tracking-wider uppercase shadow-xl shadow-cobalt/30 transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Enter Designated Interface</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      ) : (
        /* STATE B: INTAKE DETAILS GATHERING FORM */
        <div className="w-full max-w-xl mx-auto space-y-6">
          
          {/* NEW LOGO DISPLAY AT TOP */}
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="bg-white p-3 rounded-2xl shadow-xl border border-bone-400/20 max-w-[240px] hover:scale-105 transition-transform duration-200">
              <img 
                src="/pulselink-logo.jpg" 
                alt="PulseLink — Indian Medical Logistics & Emergency Corridor Grid" 
                className="w-full h-auto object-contain"
              />
            </div>
            <p className="text-xs text-bone-300 font-mono tracking-wide">
              Unified National Medical Logistics &amp; Emergency Corridor Grid
            </p>
          </div>

          {/* QUICK PRESETS: Only show profiles entered on THIS particular device */}
          {devicePresets.length > 0 && (
            <div className="bg-bottle-900/60 border border-bottle-700/60 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <span className="font-mono text-[11px] text-bone-300 flex items-center space-x-1.5 pl-1">
                <Bookmark className="w-3.5 h-3.5 text-sage" />
                <span>Saved on this device:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {devicePresets.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleApplyPreset(preset)}
                    className="group inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-bottle-950 border border-bottle-700 hover:border-cobalt text-bone-200 hover:text-bone-100 text-[11px] transition-all cursor-pointer"
                    title="Click to fill form with this device's saved details"
                  >
                    <span className="font-medium max-w-[140px] truncate">{preset.fullName} ({preset.workOrganisation || preset.city})</span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteDevicePreset(idx, e)}
                      className="text-bone-400 hover:text-vermilion ml-1 p-0.5 rounded transition-colors"
                      title="Remove this profile from this device"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Container with strict ordering as requested */}
          <form onSubmit={handleSubmit} className="space-y-5 bg-bottle-900/80 border border-bottle-700 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            
            {/* STEP 1: Are you? Question with options */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-bone-100 text-sm">
                  Are you?
                </label>
                <span className="text-amber font-semibold text-[11px]">* Required</span>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { id: 'patient_or_family', label: "a) Patient or patient's family" },
                  { id: 'medical_staff', label: 'b) Medical staff' },
                  { id: 'gov_employee', label: 'c) Gov employee' },
                  { 
                    id: 'other', 
                    label: isPulseLinkEmployee === true 
                      ? 'd) Other (PulseLink Employee)' 
                      : isPulseLinkEmployee === false 
                      ? 'd) Other (External)' 
                      : 'd) Other' 
                  }
                ].map((opt) => {
                  const isSelected = userCategory === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectCategory(opt.id as UserCategory)}
                      className={`px-4 py-2 rounded-full text-xs transition-all ${
                        isSelected
                          ? 'bg-black text-white font-bold shadow-lg scale-[1.02] border-2 border-white ring-2 ring-black/50'
                          : 'bg-bottle-950 border border-bottle-700 text-bone-300 hover:border-bottle-600 hover:text-bone-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Full Name */}
            <div className="space-y-1.5 pt-2 border-t border-bottle-700/60">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="fullName" className="font-medium text-bone-200 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-bone-400" />
                  <span>Full Name</span>
                </label>
                <span className="text-amber font-semibold text-[11px]">* Required</span>
              </div>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Dr. Ananya Rao / Rajesh Sharma"
                className="w-full bg-bottle-950 border border-bottle-700 focus:border-cobalt focus:ring-1 focus:ring-cobalt rounded-xl px-4 py-3 text-sm text-bone-100 placeholder-bone-400/60 outline-none transition-all shadow-inner font-sans"
              />
            </div>

            {/* STEP 3: Contact Number (WhatsApp number is preferable) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="phone" className="font-medium text-bone-200 flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-bone-400" />
                  <span>Contact Number (WhatsApp number is preferable)</span>
                </label>
                <span className="text-amber font-semibold text-[11px]">* Required</span>
              </div>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98860 12345"
                className="w-full bg-bottle-950 border border-bottle-700 focus:border-cobalt focus:ring-1 focus:ring-cobalt rounded-xl px-4 py-3 text-sm text-bone-100 placeholder-bone-400/60 outline-none transition-all shadow-inner font-sans"
              />
            </div>

            {/* STEP 4: Corporate / Business Email ID */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="email" className="font-medium text-bone-200 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-bone-400" />
                  <span>Corporate / Business Email ID</span>
                </label>
                <span className="text-amber font-semibold text-[11px]">* Required</span>
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. coordinator@manipal.edu"
                className="w-full bg-bottle-950 border border-bottle-700 focus:border-cobalt focus:ring-1 focus:ring-cobalt rounded-xl px-4 py-3 text-sm text-bone-100 placeholder-bone-400/60 outline-none transition-all shadow-inner font-sans"
              />
            </div>

            {/* STEP 5: Name of the Organisation (Changed from Type of business) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="workOrg" className="font-medium text-bone-200 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-bone-400" />
                  <span>Name of the Organisation</span>
                </label>
                <span className="text-amber font-semibold text-[11px]">* Required</span>
              </div>
              <input
                id="workOrg"
                type="text"
                required
                value={workOrganisation}
                onChange={(e) => setWorkOrganisation(e.target.value)}
                placeholder="e.g. Manipal Hospital, City Blood Bank, Apollo Clinic"
                className="w-full bg-bottle-950 border border-bottle-700 focus:border-cobalt focus:ring-1 focus:ring-cobalt rounded-xl px-4 py-3 text-sm text-bone-100 placeholder-bone-400/60 outline-none transition-all shadow-inner font-sans"
              />
            </div>

            {/* STEP 6: City */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="city" className="font-medium text-bone-200 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-bone-400" />
                  <span>City</span>
                </label>
                <span className="text-amber font-semibold text-[11px]">* Required</span>
              </div>
              <input
                id="city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru, Mumbai, Delhi"
                className="w-full bg-bottle-950 border border-bottle-700 focus:border-cobalt focus:ring-1 focus:ring-cobalt rounded-xl px-4 py-3 text-sm text-bone-100 placeholder-bone-400/60 outline-none transition-all shadow-inner font-sans"
              />
            </div>

            {/* STEP 7: What brings you to PulseLink (with the logo) */}
            <div className="space-y-2 pt-3 border-t border-bottle-700/60">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="bg-white p-1 rounded-md shadow-sm border border-bone-300/40 shrink-0">
                    <img 
                      src="/pulselink-logo.jpg" 
                      alt="PulseLink Logo" 
                      className="h-5 w-auto object-contain" 
                    />
                  </div>
                  <label className="font-semibold text-bone-100 text-sm">
                    What brings you to PulseLink?
                  </label>
                </div>
                <span className="text-amber font-semibold text-[11px]">* Required</span>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { id: 'requesting', label: 'a) Requesting' },
                  { id: 'responding', label: 'b) Responding' },
                  { id: 'inquiry', label: 'c) Inquiry' },
                  { id: 'regular_audit', label: 'd) Regular Audit' },
                  { id: 'others', label: 'e) Others' }
                ].map((opt) => {
                  const isSelected = purposeOfVisit === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPurposeOfVisit(opt.id as PurposeOfVisit)}
                      className={`px-4 py-2 rounded-full text-xs transition-all ${
                        isSelected
                          ? 'bg-black text-white font-bold shadow-lg scale-[1.02] border-2 border-white ring-2 ring-black/50'
                          : 'bg-bottle-950 border border-bottle-700 text-bone-300 hover:border-bottle-600 hover:text-bone-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 space-y-3">
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-cobalt hover:bg-cobalt-dark text-white font-bold text-sm tracking-wider uppercase shadow-xl shadow-cobalt/30 transition-all flex items-center justify-center space-x-2 group"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Submit Details &amp; Enter Waiting Area</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
};
