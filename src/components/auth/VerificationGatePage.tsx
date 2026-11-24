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
  Trash2
} from 'lucide-react';

export const VerificationGatePage: React.FC = () => {
  const { 
    verificationUser, 
    submitVerification, 
    setViewMode, 
    setActiveTab 
  } = usePulseLink();

  // Load initial state from localStorage on this device or context
  const getInitialState = (): VerificationUserData => {
    try {
      const saved = localStorage.getItem('pulselink_verification_gate');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // ignore
    }
    return (
      verificationUser || {
        fullName: '',
        email: '',
        workOrganisation: '',
        city: 'Bengaluru',
        userCategory: 'medical_staff',
        purposeOfVisit: 'requesting',
        phoneWhatsapp: '',
        verifiedAt: new Date().toISOString()
      }
    );
  };

  const initial = getInitialState();

  const [fullName, setFullName] = useState(initial.fullName || '');
  const [phone, setPhone] = useState(initial.phoneWhatsapp || '');
  const [email, setEmail] = useState(initial.email || '');
  const [workOrganisation, setWorkOrganisation] = useState(initial.workOrganisation || '');
  const [city, setCity] = useState(initial.city || 'Bengaluru');
  const [userCategory, setUserCategory] = useState<UserCategory>(initial.userCategory || 'medical_staff');
  const [purposeOfVisit, setPurposeOfVisit] = useState<PurposeOfVisit>(initial.purposeOfVisit || 'requesting');

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

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
      userCategory,
      purposeOfVisit,
      verifiedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem('pulselink_verification_gate', JSON.stringify(currentData));
    } catch {
      // ignore
    }
  }, [fullName, email, workOrganisation, city, phone, userCategory, purposeOfVisit]);

  const saveToDevicePresets = (profile: VerificationUserData) => {
    try {
      const raw = localStorage.getItem('pulselink_device_saved_profiles');
      let list: VerificationUserData[] = raw ? JSON.parse(raw) : [];
      // Remove matching entry if already present
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData: VerificationUserData = {
      fullName: fullName.trim() || 'Guest User',
      email: email.trim() || 'contact@pulselink.in',
      workOrganisation: workOrganisation.trim() || 'Independent / Hospital Network',
      city: city.trim() || 'Bengaluru',
      userCategory,
      purposeOfVisit,
      phoneWhatsapp: phone.trim(),
      verifiedAt: new Date().toISOString()
    };

    // Save to this device's presets
    saveToDevicePresets(submissionData);
    submitVerification(submissionData);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setViewMode('dashboard');
      setActiveTab('corridors');
    }, 450);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      
      <div className="w-full max-w-xl mx-auto space-y-6">
        
        {/* 1) NEW LOGO DISPLAY AT TOP (India map with tricolor, road ring with heart, and PulseLink brand) */}
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

        {/* 2) QUICK PRESETS: Only show profiles entered on THIS particular device */}
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
                { id: 'patient_family', label: "a) Patient or patient's family" },
                { id: 'medical_staff', label: 'b) Medical staff' },
                { id: 'gov_employee', label: 'c) Gov employee' },
                { id: 'other', label: 'd) Other' }
              ].map((opt) => {
                const isSelected = userCategory === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setUserCategory(opt.id as UserCategory)}
                    className={`px-4 py-2 rounded-full text-xs transition-all ${
                      isSelected
                        ? 'bg-bone-50 text-bottle-950 font-bold shadow-md scale-[1.02]'
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
                        ? 'bg-bone-50 text-bottle-950 font-bold shadow-md scale-[1.02]'
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
              {submittedSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
                  <span>Access Granted — Entering Studio...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Authorize &amp; Enter Command Grid</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setViewMode('landing')}
              className="w-full py-2.5 text-xs text-bone-400 hover:text-bone-200 transition-colors text-center"
            >
              Cancel and Return to Overview
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
