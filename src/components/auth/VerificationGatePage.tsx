import React, { useState } from 'react';
import { usePulseLink } from '../../context/PulseLinkContext';
import type { UserCategory, PurposeOfVisit } from '../../types';
import { 
  ChevronRight, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  User, 
  Mail, 
  MapPin, 
  Phone,
  Sparkles
} from 'lucide-react';

export const VerificationGatePage: React.FC = () => {
  const { 
    verificationUser, 
    submitVerification, 
    setViewMode, 
    setActiveTab 
  } = usePulseLink();

  const [fullName, setFullName] = useState(verificationUser?.fullName || 'aditya chourasia');
  const [workOrganisation, setWorkOrganisation] = useState(verificationUser?.workOrganisation || 'cafe');
  const [email, setEmail] = useState(verificationUser?.email || 'aditya.chourasia10329@gmail.com');
  const [city, setCity] = useState(verificationUser?.city || 'Bengaluru');
  const [phone, setPhone] = useState(verificationUser?.phoneWhatsapp || '9313264332');
  const [userCategory, setUserCategory] = useState<UserCategory>(verificationUser?.userCategory || 'medical_staff');
  const [purposeOfVisit, setPurposeOfVisit] = useState<PurposeOfVisit>(verificationUser?.purposeOfVisit || 'requesting');

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitVerification({
      fullName: fullName.trim() || 'Aditya Chourasia',
      email: email.trim() || 'aditya.chourasia10329@gmail.com',
      workOrganisation: workOrganisation.trim() || 'Hospital Network',
      city: city.trim() || 'Bengaluru',
      userCategory,
      purposeOfVisit,
      phoneWhatsapp: phone.trim()
    });
    setSubmittedSuccess(true);
    setTimeout(() => {
      setViewMode('dashboard');
      setActiveTab('corridors');
    }, 600);
  };

  const handleQuickFill = (role: 'aditya_cafe' | 'doctor' | 'police' | 'patient') => {
    if (role === 'aditya_cafe') {
      setFullName('aditya chourasia');
      setEmail('aditya.chourasia10329@gmail.com');
      setWorkOrganisation('cafe');
      setCity('Bengaluru');
      setPhone('9313264332');
      setUserCategory('medical_staff');
      setPurposeOfVisit('requesting');
    } else if (role === 'doctor') {
      setFullName('Dr. Ananya Rao, M.S.');
      setEmail('ananya.rao@manipal.edu');
      setWorkOrganisation('Manipal Hospital & Research Institute');
      setCity('Bengaluru');
      setPhone('+91 98860 12345');
      setUserCategory('medical_staff');
      setPurposeOfVisit('requesting');
    } else if (role === 'police') {
      setFullName('Insp. S. Vijay Kumar');
      setEmail('traffic.dispatch@ksp.gov.in');
      setWorkOrganisation('Bengaluru City Traffic Police (Clearance Div)');
      setCity('Bengaluru');
      setPhone('+91 94490 88765');
      setUserCategory('gov_employee');
      setPurposeOfVisit('responding');
    } else {
      setFullName('Rajesh & Priya Sharma');
      setEmail('priya.sharma99@gmail.com');
      setWorkOrganisation('Patient Recipient Kin (Fortis)');
      setCity('Bengaluru');
      setPhone('+91 98450 44321');
      setUserCategory('patient_family');
      setPurposeOfVisit('inquiry');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Container matching screenshot */}
      <div className="w-full max-w-xl mx-auto space-y-6">
        
        {/* Top Status Pill - Clean without B2B */}
        <div className="flex justify-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-bottle-950/90 border border-bottle-700 shadow-sm text-xs font-mono text-bone-200">
            <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
            <span className="font-medium text-bone-100">{fullName || 'aditya chourasia'} ({workOrganisation || 'manipal hospitals'})</span>
            <ChevronRight className="w-3.5 h-3.5 text-bone-300" />
          </div>
        </div>

        {/* Quick-Fill Pill Bar for Convenience */}
        <div className="bg-bottle-900/60 border border-bottle-700/60 rounded-xl p-2.5 flex items-center justify-between text-xs">
          <span className="font-mono text-[11px] text-bone-400 flex items-center space-x-1 pl-1">
            <Sparkles className="w-3 h-3 text-cobalt" />
            <span>Quick Fill Presets:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill('aditya_cafe')}
              className="px-2 py-0.5 rounded-md bg-bottle-950 border border-bottle-700 hover:border-cobalt text-bone-200 hover:text-bone-100 text-[11px] transition-colors"
            >
              Aditya (SS Match)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('doctor')}
              className="px-2 py-0.5 rounded-md bg-bottle-950 border border-bottle-700 hover:border-cobalt text-bone-200 hover:text-bone-100 text-[11px] transition-colors"
            >
              Surgeon
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('police')}
              className="px-2 py-0.5 rounded-md bg-bottle-950 border border-bottle-700 hover:border-cobalt text-bone-200 hover:text-bone-100 text-[11px] transition-colors"
            >
              Traffic Dispatch
            </button>
          </div>
        </div>

        {/* Main Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-5 bg-bottle-900/80 border border-bottle-700 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          
          {/* Field: Full Name */}
          <div className="space-y-1.5">
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
              placeholder="e.g. aditya chourasia"
              className="w-full bg-bottle-950 border border-bottle-700 focus:border-cobalt focus:ring-1 focus:ring-cobalt rounded-xl px-4 py-3 text-sm text-bone-100 placeholder-bone-400/60 outline-none transition-all shadow-inner font-sans"
            />
          </div>

          {/* Field: Type of Business / Work Organisation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="workOrg" className="font-medium text-bone-200 flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-bone-400" />
                <span>Type of Business / Work Organisation</span>
              </label>
              <span className="text-amber font-semibold text-[11px]">* Required</span>
            </div>
            <input
              id="workOrg"
              type="text"
              required
              value={workOrganisation}
              onChange={(e) => setWorkOrganisation(e.target.value)}
              placeholder="e.g. cafe, Manipal Hospital, Blood Bank"
              className="w-full bg-bottle-950 border border-bottle-700 focus:border-cobalt focus:ring-1 focus:ring-cobalt rounded-xl px-4 py-3 text-sm text-bone-100 placeholder-bone-400/60 outline-none transition-all shadow-inner font-sans"
            />
          </div>

          {/* Field: Corporate / Business Email ID */}
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
              placeholder="e.g. aditya.chourasia10329@gmail.com"
              className="w-full bg-bottle-950 border border-bottle-700 focus:border-cobalt focus:ring-1 focus:ring-cobalt rounded-xl px-4 py-3 text-sm text-bone-100 placeholder-bone-400/60 outline-none transition-all shadow-inner font-sans"
            />
          </div>

          {/* Field: City */}
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
              placeholder="e.g. Bengaluru"
              className="w-full bg-bottle-950 border border-bottle-700 focus:border-cobalt focus:ring-1 focus:ring-cobalt rounded-xl px-4 py-3 text-sm text-bone-100 placeholder-bone-400/60 outline-none transition-all shadow-inner font-sans"
            />
          </div>

          {/* Field: Direct Phone / WhatsApp */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="phone" className="font-medium text-bone-200 flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-bone-400" />
                <span>Direct Phone / WhatsApp</span>
              </label>
              <span className="text-amber font-semibold text-[11px]">* Required</span>
            </div>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9313264332"
              className="w-full bg-bottle-950 border border-bottle-700 focus:border-cobalt focus:ring-1 focus:ring-cobalt rounded-xl px-4 py-3 text-sm text-bone-100 placeholder-bone-400/60 outline-none transition-all shadow-inner font-sans"
            />
          </div>

          {/* QUESTION (e) - styled as screenshot 3 pill options */}
          <div className="space-y-2 pt-2 border-t border-bottle-700/60">
            <div className="flex items-center justify-between text-xs">
              <label className="font-medium text-bone-100 text-sm">
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

          {/* QUESTION (f) - styled as screenshot 3 pill options */}
          <div className="space-y-2 pt-2 border-t border-bottle-700/60">
            <div className="flex items-center justify-between text-xs">
              <label className="font-medium text-bone-100 text-sm">
                Purpose of visit
              </label>
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
