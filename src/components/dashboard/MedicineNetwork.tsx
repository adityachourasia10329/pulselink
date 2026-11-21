import React, { useState } from 'react';
import { usePulseLink } from '../../context/PulseLinkContext';
import { 
  ShieldCheck, 
  QrCode, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Share2, 
  Package, 
  Flame, 
  FileText, 
  Battery, 
  Droplets,
  Lock,
  Unlock
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceArea, 
  ReferenceLine 
} from 'recharts';

export const MedicineNetwork: React.FC = () => {
  const { 
    medicines, 
    telemetryData, 
    currentTemp, 
    isExcursionActive, 
    simulateTemperatureExcursion, 
    resetTemperatureExcursion,
    verifyMedicineBatch,
    addAuditLog,
    currentUser
  } = usePulseLink();

  const [inputBatchId, setInputBatchId] = useState('PL-MED-2026-9042');
  const [activeBatchResult, setActiveBatchResult] = useState(medicines[0]);
  const [qrScanning, setQrScanning] = useState(false);
  const [redistributionNotified, setRedistributionNotified] = useState<string | null>(null);

  const handleVerify = (id: string) => {
    const result = verifyMedicineBatch(id);
    if (result) {
      setActiveBatchResult(result);
    }
  };

  const handleSimulateQrScan = (batchId: string) => {
    setQrScanning(true);
    setInputBatchId(batchId);
    setTimeout(() => {
      handleVerify(batchId);
      setQrScanning(false);
    }, 600);
  };

  const handleInitiateRedistribution = async (batchId: string, fromLoc: string, toClinic: string) => {
    setRedistributionNotified(batchId);
    await addAuditLog({
      eventType: 'CHAIN_OF_CUSTODY_HANDOVER',
      entityId: batchId,
      summary: `SURPLUS REDISTRIBUTION DISPATCHED: Stock transfer initialized from [${fromLoc}] to peripheral center [${toClinic}] to prevent near-expiry wastage.`,
      actor: currentUser.name,
      actorRole: currentUser.title,
      location: fromLoc
    });
    setTimeout(() => setRedistributionNotified(null), 4000);
  };

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: VERIFIEDMED (QR & BATCH AUTHENTICATION) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bottle-700/80 pb-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-bone-300">
              <ShieldCheck className="w-3.5 h-3.5 text-sage" />
              <span>VerifiedMed Cryptographic Passport</span>
              <span className="text-bone-400">•</span>
              <span className="text-bone-200">Anti-Counterfeiting Engine</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-bone-100 mt-0.5">
              Medicine Batch &amp; QR Verification Tool
            </h2>
          </div>
          <p className="text-xs text-bone-300 font-mono">
            CDSCO &amp; NABL Hash-Linked Supply Chain
          </p>
        </div>

        {/* Verification Controls & Quick Scenarios */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Form: Search & Quick Scenario Buttons (5 cols) */}
          <div className="lg:col-span-5 bg-bottle-900 border border-bottle-700 rounded-xl p-5 shadow-xl space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-bone-300 mb-1.5">
                Batch Identification Code (Bar/QR Code)
              </label>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={inputBatchId}
                  onChange={e => setInputBatchId(e.target.value)}
                  placeholder="e.g. PL-MED-2026-9042"
                  className="flex-1 bg-bottle-950 border border-bottle-700 rounded-lg px-3 py-2 text-xs font-mono text-bone-100 focus:border-vermilion focus:outline-none uppercase"
                />
                <button
                  onClick={() => handleVerify(inputBatchId)}
                  className="px-4 py-2 bg-bottle-700 hover:bg-bottle-600 border border-bottle-500 rounded-lg text-xs font-mono font-bold text-bone-100 transition-colors"
                >
                  Verify
                </button>
              </div>
            </div>

            {/* One-Click Test Cases */}
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-bone-400 mb-2">
                Pre-Loaded Test Scenarios:
              </p>
              <div className="space-y-2">
                
                {/* Scenario 1: Valid */}
                <button
                  onClick={() => handleSimulateQrScan('PL-MED-2026-9042')}
                  className="w-full text-left p-2.5 rounded-lg bg-bottle-950 hover:bg-bottle-800/80 border border-bottle-800 hover:border-sage/50 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    <QrCode className="w-4 h-4 text-sage" />
                    <div>
                      <p className="text-xs font-semibold text-bone-100">PL-MED-2026-9042</p>
                      <p className="text-[10px] text-bone-400">Human Albumin 20% (Valid Batch)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sage/20 text-sage border border-sage/40">
                    VALID
                  </span>
                </button>

                {/* Scenario 2: Expired */}
                <button
                  onClick={() => handleSimulateQrScan('PL-VAC-2025-1108')}
                  className="w-full text-left p-2.5 rounded-lg bg-bottle-950 hover:bg-bottle-800/80 border border-bottle-800 hover:border-vermilion/50 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    <QrCode className="w-4 h-4 text-vermilion" />
                    <div>
                      <p className="text-xs font-semibold text-bone-100">PL-VAC-2025-1108</p>
                      <p className="text-[10px] text-bone-400">Rabies Immunoglobulin (Expired Oct 2026)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vermilion/20 text-vermilion border border-vermilion/40">
                    EXPIRED
                  </span>
                </button>

                {/* Scenario 3: Duplicate / Flagged */}
                <button
                  onClick={() => handleSimulateQrScan('PL-ANT-2026-3391')}
                  className="w-full text-left p-2.5 rounded-lg bg-bottle-950 hover:bg-bottle-800/80 border border-bottle-800 hover:border-amber/50 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    <QrCode className="w-4 h-4 text-amber" />
                    <div>
                      <p className="text-xs font-semibold text-bone-100">PL-ANT-2026-3391</p>
                      <p className="text-[10px] text-bone-400">Anti-Snake Venom (Duplicate Scan Flag)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber/20 text-amber border border-amber/40">
                    FLAGGED
                  </span>
                </button>

              </div>
            </div>

            {qrScanning && (
              <div className="bg-bottle-950 p-3 rounded-lg border border-bottle-800 text-center text-xs font-mono text-sage animate-pulse">
                Simulating Optical QR &amp; NABL Blockchain Check...
              </div>
            )}
          </div>

          {/* Right Panel: Verified Batch Passport (7 cols) */}
          <div className="lg:col-span-7 bg-bottle-900 border border-bottle-700 rounded-xl p-5 shadow-xl">
            {activeBatchResult ? (
              <div className="space-y-4">
                
                {/* Header & Verification Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-bottle-700">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-bone-400 tracking-wider">
                      Batch Certificate Record
                    </span>
                    <h3 className="font-serif text-xl font-bold text-bone-100">
                      {activeBatchResult.medicineName}
                    </h3>
                    <p className="text-xs font-mono text-bone-300 mt-0.5">
                      Batch ID: <strong className="text-bone-100">{activeBatchResult.batchId}</strong>
                    </p>
                  </div>

                  {/* Status Tag */}
                  <div>
                    {activeBatchResult.verificationStatus === 'VALID' && !activeBatchResult.quarantineState && (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sage/20 text-sage border border-sage/50 font-mono text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>GENUINE &amp; VERIFIED</span>
                      </span>
                    )}

                    {activeBatchResult.verificationStatus === 'EXPIRED' && (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-vermilion/20 text-vermilion border border-vermilion/50 font-mono text-xs font-bold">
                        <Flame className="w-4 h-4" />
                        <span>EXPIRED / RECALL ACTIVE</span>
                      </span>
                    )}

                    {(activeBatchResult.verificationStatus === 'FLAGGED_DUPLICATE' || activeBatchResult.quarantineState) && (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber/20 text-amber border border-amber/50 font-mono text-xs font-bold animate-pulse">
                        <AlertTriangle className="w-4 h-4" />
                        <span>QUARANTINE / AUDIT HOLD</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Passport Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-bottle-950 p-2.5 rounded-lg border border-bottle-800">
                    <p className="text-[10px] text-bone-400 font-mono">Manufacturer</p>
                    <p className="font-semibold text-bone-200 mt-0.5 truncate">{activeBatchResult.manufacturer}</p>
                  </div>

                  <div className="bg-bottle-950 p-2.5 rounded-lg border border-bottle-800">
                    <p className="text-[10px] text-bone-400 font-mono">Mfg / Expiry Date</p>
                    <p className="font-mono text-bone-200 mt-0.5">
                      {activeBatchResult.manufacturingDate} / <strong className={activeBatchResult.verificationStatus === 'EXPIRED' ? 'text-vermilion' : 'text-bone-100'}>{activeBatchResult.expiryDate}</strong>
                    </p>
                  </div>

                  <div className="bg-bottle-950 p-2.5 rounded-lg border border-bottle-800">
                    <p className="text-[10px] text-bone-400 font-mono">CDSCO License</p>
                    <p className="font-mono text-bone-200 mt-0.5 truncate">{activeBatchResult.cdscoLicenseNo}</p>
                  </div>

                  <div className="bg-bottle-950 p-2.5 rounded-lg border border-bottle-800">
                    <p className="text-[10px] text-bone-400 font-mono">Cold-Chain Requirement</p>
                    <p className="font-mono text-sage mt-0.5">{activeBatchResult.storageRequirement}</p>
                  </div>

                  <div className="bg-bottle-950 p-2.5 rounded-lg border border-bottle-800">
                    <p className="text-[10px] text-bone-400 font-mono">Tamper Seal</p>
                    <p className="font-mono mt-0.5">
                      {activeBatchResult.tamperSealIntact ? (
                        <span className="text-sage flex items-center space-x-1">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Intact (Secure)</span>
                        </span>
                      ) : (
                        <span className="text-vermilion flex items-center space-x-1">
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Compromised</span>
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="bg-bottle-950 p-2.5 rounded-lg border border-bottle-800">
                    <p className="text-[10px] text-bone-400 font-mono">Current Location</p>
                    <p className="font-semibold text-bone-200 mt-0.5 truncate">{activeBatchResult.depotLocation}</p>
                  </div>
                </div>

                {/* Cryptographic Hash of Lab Certificate */}
                <div className="bg-bottle-950 p-3 rounded-lg border border-bottle-800 text-xs">
                  <div className="flex items-center justify-between text-bone-400 font-mono text-[10px] mb-1">
                    <span>NABL CERTIFICATE OF ANALYSIS (CoA) CRYPTOGRAPHIC HASH:</span>
                    <span className="text-sage">SHA-256 VALIDATED</span>
                  </div>
                  <p className="font-mono text-[11px] text-bone-200 break-all bg-bottle-900/60 p-2 rounded border border-bottle-800">
                    {activeBatchResult.labCertificateHash}
                  </p>
                </div>

              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-bone-400 text-xs font-mono space-y-2">
                <FileText className="w-8 h-8 text-bottle-700" />
                <span>Enter a batch code to inspect verified cryptographic credentials</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* SECTION 2: COLDGUARD ESP32 TELEMETRY & LIVE CHART */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-bottle-700/80 pb-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-bone-300">
              <Thermometer className="w-3.5 h-3.5 text-sage" />
              <span>ColdGuard Edge IoT Stream</span>
              <span className="text-bone-400">•</span>
              <span className="text-sage">ESP32 Telemetry (2°C – 8°C Band)</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-bone-100 mt-0.5">
              Live Cold-Chain Telemetry &amp; Excursion Engine
            </h2>
          </div>

          {/* Excursion Trigger Actions */}
          <div className="flex items-center space-x-2">
            {!isExcursionActive ? (
              <button
                onClick={simulateTemperatureExcursion}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-vermilion hover:bg-vermilion-dark text-bone-50 text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-vermilion/20 transition-all"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Simulate Temperature Excursion</span>
              </button>
            ) : (
              <button
                onClick={resetTemperatureExcursion}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-sage hover:bg-sage-dark text-bottle-950 text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-sage/30 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset &amp; Stabilize Cooling</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Metrics Header Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Temperature Sensor */}
          <div className={`p-4 rounded-xl border transition-all ${
            isExcursionActive 
              ? 'bg-bottle-950 border-vermilion shadow-lg shadow-vermilion/20 animate-pulse' 
              : 'bg-bottle-900 border-bottle-700'
          }`}>
            <div className="flex items-center justify-between text-xs font-mono text-bone-400">
              <span>Carrier Box Temp</span>
              <Thermometer className={`w-4 h-4 ${isExcursionActive ? 'text-vermilion' : 'text-sage'}`} />
            </div>
            <div className={`text-2xl font-bold font-mono mt-1 ${isExcursionActive ? 'text-vermilion' : 'text-sage'}`}>
              {currentTemp}°C
            </div>
            <p className="text-[10px] font-mono text-bone-400 mt-0.5">
              {isExcursionActive ? 'EXCEEDS SAFE MAX (8.0°C)' : 'Nominal Safe Band (2–8°C)'}
            </p>
          </div>

          {/* Humidity Sensor */}
          <div className="bg-bottle-900 border border-bottle-700 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs font-mono text-bone-400">
              <span>Internal Humidity</span>
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-bone-100 mt-1">
              56% RH
            </div>
            <p className="text-[10px] font-mono text-bone-400 mt-0.5">
              Safe limit &lt; 65% RH
            </p>
          </div>

          {/* Container Battery */}
          <div className="bg-bottle-900 border border-bottle-700 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs font-mono text-bone-400">
              <span>Peltier Battery</span>
              <Battery className="w-4 h-4 text-sage" />
            </div>
            <div className="text-2xl font-bold font-mono text-bone-100 mt-1">
              88%
            </div>
            <p className="text-[10px] font-mono text-bone-400 mt-0.5">
              Est. Reserve: 14.2 Hours
            </p>
          </div>

          {/* Door Seal Status */}
          <div className="bg-bottle-900 border border-bottle-700 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs font-mono text-bone-400">
              <span>Smart Seal / Door</span>
              {isExcursionActive ? (
                <Unlock className="w-4 h-4 text-vermilion" />
              ) : (
                <Lock className="w-4 h-4 text-sage" />
              )}
            </div>
            <div className={`text-xl font-bold font-mono mt-1 ${isExcursionActive ? 'text-vermilion' : 'text-sage'}`}>
              {isExcursionActive ? 'SEAL BREACH' : 'LOCKED (RFID)'}
            </div>
            <p className="text-[10px] font-mono text-bone-400 mt-0.5">
              {isExcursionActive ? 'Audit Incident Logged' : 'Biometric Lock Engaged'}
            </p>
          </div>

        </div>

        {/* Recharts Streaming Chart */}
        <div className="bg-bottle-900 border border-bottle-700 rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-xs font-mono text-bone-300">
              <span className="w-2.5 h-2.5 rounded-full bg-sage" />
              <span>Streaming IoT Telemetry (ESP32-SEN-0881)</span>
              <span className="text-bone-400">•</span>
              <span className="text-bone-400">Shaded Region: Valid Cold-Chain (2°C – 8°C)</span>
            </div>
            {isExcursionActive && (
              <span className="text-xs font-mono text-vermilion font-bold animate-pulse">
                ⚠ ALERT: TEMPERATURE EXCURSION DETECTED
              </span>
            )}
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                {/* Safe Temperature Band Shading (2°C to 8°C) */}
                <ReferenceArea y1={2} y2={8} fill="#4ADE80" fillOpacity={0.07} />
                
                {/* Threshold Line at 8°C */}
                <ReferenceLine y={8} stroke="#0C45B0" strokeDasharray="3 3" label={{ value: 'Max Safe: 8°C', fill: '#0C45B0', fontSize: 10, position: 'right' }} />
                <ReferenceLine y={2} stroke="#4ADE80" strokeDasharray="3 3" label={{ value: 'Min Safe: 2°C', fill: '#4ADE80', fontSize: 10, position: 'right' }} />

                <XAxis 
                  dataKey="time" 
                  stroke="#C8BFA8" 
                  fontSize={10} 
                  tickLine={false} 
                  fontFamily="monospace"
                />
                <YAxis 
                  domain={[0, 14]} 
                  stroke="#C8BFA8" 
                  fontSize={10} 
                  tickLine={false} 
                  unit="°C"
                  fontFamily="monospace"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#09241C', 
                    borderColor: '#164A3B', 
                    borderRadius: '8px',
                    color: '#EFE7DA',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                  formatter={(value: any) => [`${value}°C`, 'Temperature']}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke={isExcursionActive ? '#0C45B0' : '#4ADE80'} 
                  strokeWidth={2.5} 
                  dot={{ r: 3, fill: isExcursionActive ? '#0C45B0' : '#4ADE80' }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* SECTION 3: STOCKWATCH (AFFORDABLE MEDICINE & REDISTRIBUTION) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bottle-700/80 pb-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-bone-300">
              <Package className="w-3.5 h-3.5 text-sage" />
              <span>StockWatch &amp; Fair Redistribution</span>
              <span className="text-bone-400">•</span>
              <span className="text-sage">Zero Expiry Wastage</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-bone-100 mt-0.5">
              Affordable Essential Medicines &amp; Anti-Wastage Balancing
            </h2>
          </div>
          <p className="text-xs text-bone-300 font-mono">
            Direct Jan Aushadhi &amp; State Subsidized Pricing
          </p>
        </div>

        {/* Medicines Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medicines.map(med => {
            const savingsPercent = Math.round(((med.standardMrpInr - med.subsidizedPriceInr) / med.standardMrpInr) * 100);
            const isRedistributing = redistributionNotified === med.batchId;

            return (
              <div 
                key={med.batchId}
                className="bg-bottle-900 border border-bottle-700 rounded-xl p-4 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-bone-100 text-sm">{med.medicineName}</h4>
                      <p className="text-[11px] text-bone-400 font-mono mt-0.5">
                        {med.dosageForm} • {med.manufacturer}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-bottle-950 text-sage border border-bottle-800">
                      {med.currentStockUnits} Units
                    </span>
                  </div>

                  {/* Pricing Comparison: MRP vs PulseLink Subsidized */}
                  <div className="mt-3 flex items-center space-x-4 bg-bottle-950 p-2.5 rounded-lg border border-bottle-800">
                    <div>
                      <span className="text-[10px] text-bone-400 font-mono block">Commercial MRP</span>
                      <span className="line-through text-xs text-bone-400 font-mono">₹{med.standardMrpInr}</span>
                    </div>

                    <div className="border-l border-bottle-800 pl-4">
                      <span className="text-[10px] text-sage font-mono block font-bold">PulseLink Subsidized</span>
                      <span className="text-base font-bold text-bone-100 font-mono">₹{med.subsidizedPriceInr}</span>
                    </div>

                    <div className="ml-auto bg-sage/10 text-sage text-[10px] font-mono px-2 py-1 rounded border border-sage/30">
                      SAVE {savingsPercent}%
                    </div>
                  </div>

                  {/* Redistribution Suggestion if near-expiry */}
                  {med.redistributionRecommended && (
                    <div className="mt-3 bg-bottle-950/80 p-2.5 rounded-lg border border-amber/40 text-xs space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-amber font-mono font-bold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Near Expiry Alert ({med.redistributionRecommended.daysUntilExpiry} Days Left)</span>
                      </div>
                      <p className="text-[11px] text-bone-300">
                        {med.redistributionRecommended.reason}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-mono text-bone-400">
                          Route: {med.redistributionRecommended.fromLocation} ➔ {med.redistributionRecommended.toClinic}
                        </span>
                        <button
                          onClick={() => handleInitiateRedistribution(
                            med.batchId,
                            med.redistributionRecommended!.fromLocation,
                            med.redistributionRecommended!.toClinic
                          )}
                          disabled={isRedistributing}
                          className="px-2.5 py-1 bg-amber hover:bg-amber-dark text-bottle-950 text-[10px] font-mono font-bold rounded flex items-center space-x-1 transition-colors"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>{isRedistributing ? 'Dispatching...' : 'Redistribute'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-bottle-800 flex items-center justify-between text-[11px] font-mono text-bone-400">
                  <span>Batch: {med.batchId}</span>
                  <span>Expires: {med.expiryDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
