import React from 'react';
import { usePulseLink } from '../../context/PulseLinkContext';
import { 
  Heart, 
  Activity, 
  Navigation, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Scale,
  Lock
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setViewMode, setActiveTab, selectedCity, guardNavigation } = usePulseLink();

  const handleLaunchCommandCenter = (tab?: any) => {
    const permitted = guardNavigation(tab, 'dashboard');
    if (permitted) {
      if (tab) setActiveTab(tab);
      setViewMode('dashboard');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Subtle Background Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-bottle-700/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* New PulseLink India Tricolor & Heart Logo */}
          <div className="flex justify-center">
            <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-bone-400/20 inline-block hover:scale-105 transition-transform duration-200">
              <img 
                src="/pulselink-logo.jpg" 
                alt="PulseLink" 
                className="h-16 sm:h-20 w-auto object-contain"
              />
            </div>
          </div>

          {/* Top Tag */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-bottle-900 border border-bottle-700 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-vermilion animate-ping" />
            <span className="text-xs font-mono font-medium text-bone-200 uppercase tracking-widest">
              Autonomous Medical Logistics • {selectedCity.name} Grid
            </span>
          </div>

          {/* Hero Editorial Heading */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-bone-100 leading-[1.12]">
              Every Second Counts When Life Hangs in <span className="italic text-vermilion underline decoration-vermilion/40 decoration-wavy underline-offset-8">Transit.</span>
            </h1>
            <p className="font-sans text-base sm:text-xl text-bone-300 max-w-2xl mx-auto leading-relaxed pt-2">
              PulseLink coordinates time-critical organ cold ischemia windows, preempts traffic signals for green corridors, and secures an authentic, temperature-guaranteed medicine supply chain across {selectedCity.name}.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleLaunchCommandCenter('corridors')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-vermilion hover:bg-vermilion-dark text-bone-50 font-bold text-sm uppercase tracking-wider shadow-2xl shadow-vermilion/40 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Launch Command Center</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleLaunchCommandCenter('requests')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-bottle-900 hover:bg-bottle-800 text-bone-100 border border-bottle-600 font-semibold text-sm transition-all flex items-center justify-center space-x-2"
            >
              <Activity className="w-4 h-4 text-sage" />
              <span>Inspect Organ Viability Timers</span>
            </button>

            <button
              onClick={() => setViewMode('login')}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-bottle-950 hover:bg-bottle-900 text-amber border border-amber/50 font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <Lock className="w-4 h-4" />
              <span>Clinical Access Gate</span>
            </button>
          </div>

          {/* Live-Ticking Summary Ticker */}
          <div className="max-w-4xl mx-auto pt-8">
            <div className="bg-bottle-900/90 border border-bottle-700 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              
              <div>
                <span className="text-[11px] font-mono text-bone-400 uppercase tracking-wider block">Active Corridors</span>
                <span className="font-mono text-2xl sm:text-3xl font-bold text-sage">3 En Route</span>
                <span className="text-[10px] text-bone-300 block font-sans mt-0.5">Police Signals Preempted</span>
              </div>

              <div className="border-l border-bottle-800 pl-2">
                <span className="text-[11px] font-mono text-bone-400 uppercase tracking-wider block">Cold Ischemia Clock</span>
                <span className="font-mono text-2xl sm:text-3xl font-bold text-vermilion">52m 12s</span>
                <span className="text-[10px] text-bone-300 block font-sans mt-0.5">Human Heart Transiting</span>
              </div>

              <div className="border-l border-bottle-800 pl-2">
                <span className="text-[11px] font-mono text-bone-400 uppercase tracking-wider block">Blood Units Matched</span>
                <span className="font-mono text-2xl sm:text-3xl font-bold text-bone-100">84 Units</span>
                <span className="text-[10px] text-bone-300 block font-sans mt-0.5">O- &amp; AB- Emergency</span>
              </div>

              <div className="border-l border-bottle-800 pl-2">
                <span className="text-[11px] font-mono text-bone-400 uppercase tracking-wider block">Cold-Chain Proof</span>
                <span className="font-mono text-2xl sm:text-3xl font-bold text-sage">99.8%</span>
                <span className="text-[10px] text-bone-300 block font-sans mt-0.5">ESP32 IoT Monitored</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3-PILLAR ARCHITECTURE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-sage">
            <span className="w-1.5 h-1.5 rounded-full bg-sage" />
            <span>Architecture &amp; Core Systems</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bone-100">
            A Unified Triad for Time-Critical Healthcare Logistics
          </h2>
          <p className="text-sm text-bone-300 font-sans leading-relaxed">
            Engineered to dissolve institutional silos between transplant surgeons, traffic control authorities, blood transfusion centres, and medicine cold-chains.
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1 */}
          <div className="bg-bottle-900 border border-bottle-700 hover:border-bottle-500 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-bottle-800 border border-bottle-700 flex items-center justify-center text-vermilion group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 stroke-vermilion fill-vermilion/20" />
              </div>
              <h3 className="font-serif text-xl font-bold text-bone-100">
                1. Organ &amp; Blood Emergency Dispatch
              </h3>
              <p className="text-xs text-bone-300 font-sans leading-relaxed">
                Autonomous second-by-second <strong>Cold Ischemia Countdown Timers</strong>. 
                When viability windows drop below 60 minutes, the network escalates priority to Code Vermilion, automatically matching compatible hospital teams and nearest blood banks.
              </p>

              <ul className="space-y-2 text-xs font-mono text-bone-300 pt-2 border-t border-bottle-800">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                  <span>Real-time Cardiac &amp; Hepatic Timers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                  <span>5-Step Chain-of-Custody Pipeline</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleLaunchCommandCenter('requests')}
              className="mt-6 w-full py-2.5 rounded-lg bg-bottle-800 hover:bg-bottle-700 border border-bottle-600 text-xs font-mono font-bold text-bone-100 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Explore Viability Timers</span>
              <ArrowRight className="w-3.5 h-3.5 text-vermilion" />
            </button>
          </div>

          {/* Pillar 2 */}
          <div className="bg-bottle-900 border border-bottle-700 hover:border-bottle-500 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-bottle-800 border border-bottle-700 flex items-center justify-center text-sage group-hover:scale-110 transition-transform">
                <Navigation className="w-6 h-6 stroke-sage" />
              </div>
              <h3 className="font-serif text-xl font-bold text-bone-100">
                2. Green Corridor &amp; Traffic Routing
              </h3>
              <p className="text-xs text-bone-300 font-sans leading-relaxed">
                Direct integration with Bengaluru Traffic Police (BTP) signal infrastructure. 
                Simulates real-time green signal preemption across congested hubs like Silk Board, Dairy Circle, and Domlur, slashing transit time by up to <strong>41%</strong>.
              </p>

              <ul className="space-y-2 text-xs font-mono text-bone-300 pt-2 border-t border-bottle-800">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                  <span>Standard GPS vs Green-Corridor ETA</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                  <span>Automated Traffic Light Overrides</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleLaunchCommandCenter('corridors')}
              className="mt-6 w-full py-2.5 rounded-lg bg-bottle-800 hover:bg-bottle-700 border border-bottle-600 text-xs font-mono font-bold text-bone-100 transition-colors flex items-center justify-center space-x-2"
            >
              <span>View Bengaluru Radar Map</span>
              <ArrowRight className="w-3.5 h-3.5 text-sage" />
            </button>
          </div>

          {/* Pillar 3 */}
          <div className="bg-bottle-900 border border-bottle-700 hover:border-bottle-500 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-bottle-800 border border-bottle-700 flex items-center justify-center text-amber group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 stroke-amber" />
              </div>
              <h3 className="font-serif text-xl font-bold text-bone-100">
                3. TrustCare Medicine Network
              </h3>
              <p className="text-xs text-bone-300 font-sans leading-relaxed">
                Cryptographic batch verification linked to CDSCO and NABL lab certificates. 
                Real-time ESP32 temperature telemetry (2°C–8°C safe band) with automatic quarantine triggers upon temperature excursion or tamper detection.
              </p>

              <ul className="space-y-2 text-xs font-mono text-bone-300 pt-2 border-t border-bottle-800">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                  <span>QR Optical &amp; Hash Verification</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                  <span>Zero-Wastage Rural Redistribution</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleLaunchCommandCenter('medicine')}
              className="mt-6 w-full py-2.5 rounded-lg bg-bottle-800 hover:bg-bottle-700 border border-bottle-600 text-xs font-mono font-bold text-bone-100 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Verify Batches &amp; Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber" />
            </button>
          </div>

        </div>
      </section>

      {/* IMPACT METRICS & CLINICAL ASSURANCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-bottle-950 via-bottle-900 to-bottle-950 border border-bottle-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-sage font-bold">
                Proven Protocol Benchmarks
              </span>
              <h3 className="font-serif text-3xl font-bold text-bone-100">
                Engineering Seconds Into Survival.
              </h3>
              <p className="text-xs text-bone-300 leading-relaxed font-sans">
                By integrating inter-hospital dispatch directly with Bengaluru Traffic Management Centre (BTP TMC) signal overrides and continuous ESP32 cold-chain logging, PulseLink prevents both organ ischemic necrosis and counterfeit medicine ingress.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleLaunchCommandCenter('fairroute')}
                  className="px-5 py-2.5 rounded-lg bg-bottle-800 hover:bg-bottle-700 border border-bottle-600 text-xs font-mono font-bold text-bone-100 flex items-center space-x-2 transition-colors"
                >
                  <Scale className="w-4 h-4 text-sage" />
                  <span>Review FairRoute Decision Logic</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-bottle-900/80 border border-bottle-800 p-4 rounded-xl text-center">
                <span className="font-mono text-3xl font-bold text-sage">33 min</span>
                <p className="text-xs text-bone-200 font-semibold mt-1">Average Time Saved</p>
                <p className="text-[10px] text-bone-400 font-mono mt-0.5">Per Cardiac Corridor</p>
              </div>

              <div className="bg-bottle-900/80 border border-bottle-800 p-4 rounded-xl text-center">
                <span className="font-mono text-3xl font-bold text-vermilion">3.2 min</span>
                <p className="text-xs text-bone-200 font-semibold mt-1">Signal Clearance</p>
                <p className="text-[10px] text-bone-400 font-mono mt-0.5">Automated BTP Preemption</p>
              </div>

              <div className="bg-bottle-900/80 border border-bottle-800 p-4 rounded-xl text-center">
                <span className="font-mono text-3xl font-bold text-bone-100">100%</span>
                <p className="text-xs text-bone-200 font-semibold mt-1">Audit Traceability</p>
                <p className="text-[10px] text-bone-400 font-mono mt-0.5">SHA-256 Ledger Blocks</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER & GOVERNANCE NOTICE */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-bottle-700/60">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-bone-400">
          <div className="flex items-center space-x-3">
            <span className="font-serif text-sm font-bold text-bone-200">
              Pulse<span className="text-vermilion">Link</span>
            </span>
            <span>•</span>
            <span>Bengaluru Regional Medical Logistics Node</span>
          </div>

          {/* Governance Notice Required */}
          <div className="text-center md:text-right text-[11px] text-bone-300 max-w-xl">
            <span className="text-amber font-semibold">Governance Notice:</span> Prototype Simulation — Synthetic Data Only. Decision-support tool; final clinical and allocation authority remains with authorized medical teams.
          </div>
        </div>
      </footer>

    </div>
  );
};
