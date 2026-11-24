import React, { useState } from 'react';
import { usePulseLink } from '../../context/PulseLinkContext';
import { 
  ShieldCheck, 
  QrCode, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Flame, 
  FileText, 
  Battery, 
  Droplets,
  Lock,
  Unlock,
  TestTube,
  Building,
  ScanLine
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
    decodeAndStoreBarcode,
    selectedCity
  } = usePulseLink();

  const [inputBatchId, setInputBatchId] = useState('PL-MED-2026-9042');
  const [activeBatchResult, setActiveBatchResult] = useState(medicines[0]);
  const [barcodeScanFeedback, setBarcodeScanFeedback] = useState<string | null>(null);
  const [qrScanning, setQrScanning] = useState(false);
  const [activeTestKitStep, setActiveTestKitStep] = useState(1);

  // Active Medicine Supply Requests across City Hubs (Section 4 Request Origin & Items)
  const activeSupplyRequests = medicines.map(m => ({
    id: `REQ-MED-${m.batchId.slice(-4)}`,
    batchId: m.batchId,
    medicineName: m.medicineName,
    originHospital: m.requestOrigin?.originFacility || m.requestOrigin?.facilityName || 'Manipal Hospital (Old Airport Rd)',
    department: m.requestOrigin?.department || 'Cardio-Thoracic ICU',
    requestedItem: m.requestedItem || {
      name: m.medicineName,
      dosageForm: m.dosageForm,
      strength: '500 mg / 10 ml',
      quantityUnits: 25,
      clinicalUrgency: 'CRITICAL_ICU'
    },
    requestedAt: m.requestOrigin?.timestamp || '2026-11-25 02:00 IST'
  }));

  const handleVerify = (id: string) => {
    const res = decodeAndStoreBarcode(id);
    if (res.success && res.batch) {
      setActiveBatchResult(res.batch);
      setBarcodeScanFeedback(res.message);
    } else {
      const fallback = verifyMedicineBatch(id);
      if (fallback) setActiveBatchResult(fallback);
      setBarcodeScanFeedback(res.message);
    }
  };

  const handleSimulateQrScan = (batchId: string) => {
    setQrScanning(true);
    setInputBatchId(batchId);
    setTimeout(() => {
      handleVerify(batchId);
      setQrScanning(false);
    }, 500);
  };

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: VERIFIEDMED (QR & BATCH AUTHENTICATION + INTERNAL SEQUENCE STORAGE) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bottle-700/80 pb-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-bone-300">
              <ShieldCheck className="w-3.5 h-3.5 text-sage" />
              <span>VerifiedMed Cryptographic Passport &amp; Barcode Ledger</span>
              <span className="text-bone-400">•</span>
              <span className="text-bone-200">Internal Sequence Storage Registry</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-bone-100 mt-0.5">
              Medicine Barcode Authentication &amp; Quality Control
            </h2>
          </div>
          <p className="text-xs text-bone-300 font-mono">
            CDSCO &amp; NABL Hash-Linked Supply Chain
          </p>
        </div>

        {/* Verification Controls & Quick Scenarios */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Form: Search & Quick Scenario Buttons (5 cols) */}
          <div className="lg:col-span-5 bg-bottle-900 border border-bottle-700 rounded-xl p-5 shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-bone-300 mb-1.5 flex items-center justify-between">
                <span>Barcode / Batch Scanner Input</span>
                <ScanLine className="w-3.5 h-3.5 text-sage" />
              </label>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={inputBatchId}
                  onChange={e => setInputBatchId(e.target.value)}
                  placeholder="Scan barcode or enter batch ID..."
                  className="flex-1 bg-bottle-950 border border-bottle-700 rounded-lg px-3 py-2 text-xs font-mono text-bone-100 focus:border-cobalt focus:outline-none uppercase"
                />
                <button
                  onClick={() => handleVerify(inputBatchId)}
                  className="px-4 py-2 bg-cobalt hover:bg-cobalt-dark text-white rounded-lg text-xs font-mono font-bold transition-colors flex items-center space-x-1"
                >
                  <ScanLine className="w-3.5 h-3.5" />
                  <span>Decode</span>
                </button>
              </div>
            </div>

            {/* Internal Sequence Storage Notice (Section 4) */}
            <div className="p-3 rounded-lg bg-bottle-950 border border-bottle-800 text-[11px] font-mono space-y-1">
              <div className="flex items-center space-x-1.5 text-sage font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>Internal Sequence Ledger Protected:</span>
              </div>
              <p className="text-bone-300 text-[10px] leading-relaxed">
                Decoded barcode sequences are held securely in the PulseLink internal state ledger. Raw manufacturer private keys and internal sequences are never broadcast or leaked publicly.
              </p>
            </div>

            {barcodeScanFeedback && (
              <div className="p-2.5 rounded-lg bg-bottle-950 border border-sage/40 text-[11px] font-mono text-bone-200">
                {barcodeScanFeedback}
              </div>
            )}

            {/* One-Click Test Cases */}
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-bone-400 mb-2">
                Simulate Barcode Scan Scenarios:
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
                      <p className="text-[10px] text-bone-400">Rabies Immunoglobulin (Expired)</p>
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
                      <p className="text-[10px] text-bone-400">Anti-Snake Venom (Flagged)</p>
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
                Simulating Optical Barcode Scan &amp; Internal Ledger Storage...
              </div>
            )}
          </div>

          {/* Right Panel: Verified Batch Passport & Decoded Security Token (7 cols) */}
          <div className="lg:col-span-7 bg-bottle-900 border border-bottle-700 rounded-xl p-5 shadow-xl">
            {activeBatchResult ? (
              <div className="space-y-4">
                
                {/* Header & Verification Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-bottle-700">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-bone-400 tracking-wider">
                      Batch Certificate Record &amp; Security Token
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

                {/* Internal Sequence Registry Status (Section 4) */}
                <div className="bg-bottle-950 p-3 rounded-lg border border-bottle-800 text-xs">
                  <div className="flex items-center justify-between text-bone-400 font-mono text-[10px] mb-1">
                    <span>INTERNAL DECODED SEQUENCE LEDGER ENTRY (PROTECTED):</span>
                    <span className="text-sage font-bold">STORED IN APP STATE</span>
                  </div>
                  <div className="bg-bottle-900/80 p-2.5 rounded border border-bottle-800 text-[11px] font-mono text-bone-300 flex items-center justify-between">
                    <div>
                      <span className="text-bone-400">Ledger Key: </span>
                      <strong className="text-bone-100">{activeBatchResult.batchId}</strong>
                      <span className="text-bone-400 ml-2">• Hash: </span>
                      <span className="text-sage font-mono">{activeBatchResult.internalBarcodeSequence.slice(0, 16)}...</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-sage/20 border border-sage/40 text-sage text-[10px]">
                      Encrypted &amp; Authenticated
                    </span>
                  </div>
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

      {/* SECTION 2: MEDICINE TEST-KIT DIRECTIONS (Section 4 Specifications) */}
      <div className="space-y-4">
        <div className="border-b border-bottle-700/80 pb-3">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-bone-300">
            <TestTube className="w-4 h-4 text-sage" />
            <span>Chemical Quality Assurance Standard</span>
            <span className="text-bone-400">•</span>
            <span className="text-bone-200">Point-of-Care Verification Protocol</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-bone-100 mt-0.5">
            Physical Medicine Test-Kit Step-by-Step Directions
          </h2>
          <p className="text-xs text-bone-300 font-sans mt-0.5">
            Hospital clinicians and pharmacists must follow these physical testing steps to verify active API composition prior to bedside infusion.
          </p>
        </div>

        {/* Step-by-step Interactive Carousel / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Step 1 */}
          <div 
            onClick={() => setActiveTestKitStep(1)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeTestKitStep === 1 
                ? 'bg-bottle-900 border-cobalt ring-1 ring-cobalt shadow-xl' 
                : 'bg-bottle-950 border-bottle-800 hover:border-bottle-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-6 h-6 rounded-full bg-cobalt text-white text-xs font-mono font-bold flex items-center justify-center">
                1
              </span>
              <span className="text-[10px] font-mono text-bone-400 uppercase">Preparation</span>
            </div>
            <h4 className="font-serif font-bold text-bone-100 text-sm">
              Reagent Vial Swab &amp; Aliquot Sampling
            </h4>
            <p className="text-xs text-bone-300 font-sans mt-2 leading-relaxed">
              Carefully draw 0.1 mL liquid or 50 mg powder using the sterile micro-dropper from the medicine vial. Introduce into Reagent Chamber A (Buffer Solution pH 7.2).
            </p>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => setActiveTestKitStep(2)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeTestKitStep === 2 
                ? 'bg-bottle-900 border-cobalt ring-1 ring-cobalt shadow-xl' 
                : 'bg-bottle-950 border-bottle-800 hover:border-bottle-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-6 h-6 rounded-full bg-cobalt text-white text-xs font-mono font-bold flex items-center justify-center">
                2
              </span>
              <span className="text-[10px] font-mono text-bone-400 uppercase">Reaction</span>
            </div>
            <h4 className="font-serif font-bold text-bone-100 text-sm">
              Colorimetric Mixing &amp; Incubation
            </h4>
            <p className="text-xs text-bone-300 font-sans mt-2 leading-relaxed">
              Invert the test kit vial 5 times. Allow colorimetric chemical reagent reaction to incubate at room temperature for precisely 90 seconds without agitation.
            </p>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => setActiveTestKitStep(3)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeTestKitStep === 3 
                ? 'bg-bottle-900 border-cobalt ring-1 ring-cobalt shadow-xl' 
                : 'bg-bottle-950 border-bottle-800 hover:border-bottle-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-6 h-6 rounded-full bg-cobalt text-white text-xs font-mono font-bold flex items-center justify-center">
                3
              </span>
              <span className="text-[10px] font-mono text-bone-400 uppercase">Comparison</span>
            </div>
            <h4 className="font-serif font-bold text-bone-100 text-sm">
              Spectrum Color Band Matching
            </h4>
            <p className="text-xs text-bone-300 font-sans mt-2 leading-relaxed">
              Compare the resulting test vial hue against the CDSCO standard reference strip: Pure API turns Emerald Green (#0F372B). Adulterated or degraded compounds precipitate cloudy grey.
            </p>
          </div>

          {/* Step 4 */}
          <div 
            onClick={() => setActiveTestKitStep(4)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeTestKitStep === 4 
                ? 'bg-bottle-900 border-cobalt ring-1 ring-cobalt shadow-xl' 
                : 'bg-bottle-950 border-bottle-800 hover:border-bottle-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-6 h-6 rounded-full bg-sage text-bottle-950 text-xs font-mono font-bold flex items-center justify-center">
                4
              </span>
              <span className="text-[10px] font-mono text-sage uppercase font-bold">Clearance</span>
            </div>
            <h4 className="font-serif font-bold text-bone-100 text-sm">
              Digital Clearance Log &amp; Infusion
            </h4>
            <p className="text-xs text-bone-300 font-sans mt-2 leading-relaxed">
              Confirm test result in the PulseLink terminal to release medicine from quarantine hold and sign digital custody handover for ICU administration.
            </p>
          </div>

        </div>
      </div>

      {/* SECTION 3: REQUEST ORIGIN & ITEMS (Section 4 Specifications) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bottle-700/80 pb-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-bone-300">
              <Building className="w-3.5 h-3.5 text-sage" />
              <span>Inter-Hospital Essential Medicine Requisition Feed</span>
              <span className="text-bone-400">•</span>
              <span className="text-bone-200">{selectedCity.name} Metropolitan Grid</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-bone-100 mt-0.5">
              Live Requisition Origins &amp; Requested Items
            </h2>
          </div>
          <span className="text-xs font-mono text-bone-400">
            {activeSupplyRequests.length} Active Medical Facility Orders
          </span>
        </div>

        {/* Requisitions Table */}
        <div className="bg-bottle-900 border border-bottle-700 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-bottle-950 text-bone-300 font-mono uppercase text-[11px] border-b border-bottle-700">
              <tr>
                <th className="py-3 px-4">Request Origin Facility</th>
                <th className="py-3 px-3">Hospital Department</th>
                <th className="py-3 px-3">Item Requested</th>
                <th className="py-3 px-3">Strength &amp; Form</th>
                <th className="py-3 px-3">Quantity</th>
                <th className="py-3 px-3">Urgency</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bottle-800">
              {activeSupplyRequests.map(req => (
                <tr key={req.id} className="hover:bg-bottle-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-bone-100">
                    {req.originHospital}
                    <span className="block text-[10px] text-bone-400 font-mono">{req.id}</span>
                  </td>
                  <td className="py-3.5 px-3 text-bone-300 font-mono">{req.department}</td>
                  <td className="py-3.5 px-3 font-bold text-sage">{req.requestedItem.name}</td>
                  <td className="py-3.5 px-3 font-mono text-bone-200">{req.requestedItem.dosageForm} ({req.requestedItem.strength})</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-bone-100">{req.requestedItem.quantityUnits} Units</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      req.requestedItem.clinicalUrgency === 'CRITICAL_ICU'
                        ? 'bg-vermilion/20 text-vermilion border border-vermilion/40'
                        : 'bg-amber/20 text-amber border border-amber/40'
                    }`}>
                      {req.requestedItem.clinicalUrgency.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-bone-400 text-[11px]">
                    {req.requestedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: COLDGUARD ESP32 TELEMETRY & LIVE CHART */}
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
          
          <div className={`p-4 rounded-xl border transition-all ${
            isExcursionActive 
              ? 'bg-bottle-950 border-vermilion shadow-lg shadow-vermilion/20 animate-pulse' 
              : 'bg-bottle-900 border-bottle-700'
          }`}>
            <div className="flex items-center justify-between text-bone-400 text-xs font-mono">
              <span>Probe Temp (ESP32)</span>
              <Thermometer className={`w-4 h-4 ${isExcursionActive ? 'text-vermilion' : 'text-sage'}`} />
            </div>
            <p className={`font-mono text-2xl font-bold mt-1 ${isExcursionActive ? 'text-vermilion' : 'text-bone-100'}`}>
              {currentTemp}°C
            </p>
            <p className="text-[10px] text-bone-400 font-mono mt-0.5">
              Safe Band: 2.0°C – 8.0°C
            </p>
          </div>

          <div className="bg-bottle-900 border border-bottle-700 p-4 rounded-xl">
            <div className="flex items-center justify-between text-bone-400 text-xs font-mono">
              <span>Box Humidity</span>
              <Droplets className="w-4 h-4 text-cobalt" />
            </div>
            <p className="font-mono text-2xl font-bold text-bone-100 mt-1">
              {telemetryData.length > 0 ? telemetryData[telemetryData.length - 1].humidity : 55}%
            </p>
            <p className="text-[10px] text-bone-400 font-mono mt-0.5">
              Target: 40% – 65% RH
            </p>
          </div>

          <div className="bg-bottle-900 border border-bottle-700 p-4 rounded-xl">
            <div className="flex items-center justify-between text-bone-400 text-xs font-mono">
              <span>Carrier Battery</span>
              <Battery className="w-4 h-4 text-sage" />
            </div>
            <p className="font-mono text-2xl font-bold text-bone-100 mt-1">
              {telemetryData.length > 0 ? Math.round(telemetryData[telemetryData.length - 1].batteryPercent) : 89}%
            </p>
            <p className="text-[10px] text-bone-400 font-mono mt-0.5">
              Est. Remaining: 14h 20m
            </p>
          </div>

          <div className={`p-4 rounded-xl border ${
            isExcursionActive ? 'bg-vermilion/20 border-vermilion text-vermilion' : 'bg-bottle-900 border-bottle-700'
          }`}>
            <div className="flex items-center justify-between text-xs font-mono">
              <span>Lid Tamper Seal</span>
              {isExcursionActive ? <Unlock className="w-4 h-4 text-vermilion" /> : <Lock className="w-4 h-4 text-sage" />}
            </div>
            <p className="font-mono text-lg font-bold mt-1">
              {isExcursionActive ? 'SEAL BREACHED' : 'HERMETICALLY SEALED'}
            </p>
            <p className="text-[10px] font-mono mt-0.5">
              {isExcursionActive ? 'Optical sensor open' : 'Magnetic switch locked'}
            </p>
          </div>

        </div>

        {/* Temperature Line Chart */}
        <div className="bg-bottle-900 border border-bottle-700 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <span className="text-bone-300">Continuous Rolling Thermal Stream (Last 15 Heartbeats)</span>
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1 text-sage">
                <span className="w-2.5 h-0.5 bg-sage inline-block" />
                <span>Safe Band (2°C–8°C)</span>
              </span>
              <span className="flex items-center space-x-1 text-vermilion">
                <span className="w-2.5 h-0.5 bg-vermilion inline-block" />
                <span>Excursion Limit</span>
              </span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <ReferenceArea y1={2.0} y2={8.0} fill="#2E7D32" fillOpacity={0.12} />
                <ReferenceLine y={8.0} stroke="#E63B2E" strokeDasharray="3 3" />
                <ReferenceLine y={2.0} stroke="#0C45B0" strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#A89F91" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 14]} stroke="#A89F91" fontSize={10} tickLine={false} unit="°C" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F372B', 
                    borderColor: '#265444', 
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
                  stroke={isExcursionActive ? '#E63B2E' : '#2E7D32'} 
                  strokeWidth={2.5} 
                  dot={{ r: 3, fill: isExcursionActive ? '#E63B2E' : '#2E7D32' }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
