import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  UserRole,
  UserProfile,
  CorridorRoute,
  OrganViabilityItem,
  BloodInventoryItem,
  BloodRequestItem,
  MedicineBatch,
  TelemetryPoint,
  FairRouteCandidate,
  ClearChainBlock,
  VerificationUserData,
  CityConfig
} from '../types';
import {
  USER_PROFILES,
  SUPPORTED_CITIES,
  INITIAL_CORRIDORS,
  INITIAL_ORGANS,
  INITIAL_BLOOD_BANKS,
  INITIAL_BLOOD_REQUESTS,
  INITIAL_MEDICINES,
  INITIAL_TELEMETRY,
  INITIAL_FAIRROUTE_CANDIDATES,
  INITIAL_AUDIT_BLOCKS
} from '../data/mockData';
import { soundFx } from '../utils/audio';
import { computeSha256 } from '../utils/crypto';

interface PulseLinkContextType {
  // Navigation & Role
  viewMode: 'landing' | 'dashboard' | 'login';
  setViewMode: (mode: 'landing' | 'dashboard' | 'login') => void;
  activeTab: 'corridors' | 'requests' | 'medicine' | 'fairroute' | 'audit';
  setActiveTab: (tab: 'corridors' | 'requests' | 'medicine' | 'fairroute' | 'audit') => void;
  activeSubFocus: 'all' | 'organ' | 'blood' | 'medicine';
  setActiveSubFocus: (focus: 'all' | 'organ' | 'blood' | 'medicine') => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: UserProfile;
  allProfiles: UserProfile[];

  // City Grid Operations
  selectedCity: CityConfig;
  setSelectedCity: (city: CityConfig) => void;
  supportedCities: CityConfig[];

  // Pseudo-login verification gate
  verificationUser: VerificationUserData | null;
  submitVerification: (data: VerificationUserData) => void;
  logoutVerification: () => void;

  // Real-Time Corridors & Vehicles
  corridors: CorridorRoute[];
  togglePoliceClearance: (corridorId: string) => Promise<void>;
  selectedCorridorId: string;
  setSelectedCorridorId: (id: string) => void;

  // Organ Viability
  organTransfers: OrganViabilityItem[];

  // Blood Requests & Banks
  bloodBanks: BloodInventoryItem[];
  bloodRequests: BloodRequestItem[];
  broadcastEmergencyBlood: (params: {
    hospital: string;
    bloodGroup: string;
    units: number;
    indication: string;
    urgency: 'Immediate (OT Critical)' | 'Urgent (<2 hrs)' | 'Scheduled';
  }) => Promise<BloodRequestItem>;
  advanceBloodRequestStatus: (requestId: string) => Promise<void>;

  // Medicine & Cold-Chain
  medicines: MedicineBatch[];
  telemetryData: TelemetryPoint[];
  currentTemp: number;
  isExcursionActive: boolean;
  simulateTemperatureExcursion: () => Promise<void>;
  resetTemperatureExcursion: () => Promise<void>;
  verifyMedicineBatch: (batchId: string) => MedicineBatch | null;

  // FairRoute Decision Support
  candidates: FairRouteCandidate[];
  applyHumanOverride: (candidateId: string, clinicalReason: string, approverId: string) => Promise<void>;

  // ClearChain Audit
  auditBlocks: ClearChainBlock[];
  addAuditLog: (entry: {
    eventType: ClearChainBlock['eventType'];
    entityId: string;
    summary: string;
    actor?: string;
    actorRole?: string;
    location?: string;
    isWarning?: boolean;
  }) => Promise<void>;

  // Audio & Ticker
  audioMuted: boolean;
  toggleAudioMute: () => void;
  currentTimeString: string;

  // Theme Mode (Sand Editorial vs Terracotta Dark)
  themeMode: 'sand' | 'terracotta_dark';
  toggleThemeMode: () => void;
}

const PulseLinkContext = createContext<PulseLinkContextType | undefined>(undefined);

export const PulseLinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard' | 'login'>('landing');
  const [activeTab, setActiveTab] = useState<'corridors' | 'requests' | 'medicine' | 'fairroute' | 'audit'>('corridors');
  const [activeSubFocus, setActiveSubFocus] = useState<'all' | 'organ' | 'blood' | 'medicine'>('all');
  const [currentRole, setCurrentRole] = useState<UserRole>('hospital_coordinator');
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('corr-01');

  // Selected City Grid Operations
  const [selectedCity, setSelectedCityState] = useState<CityConfig>(() => {
    try {
      const savedCityId = localStorage.getItem('pulselink_selected_city');
      const found = SUPPORTED_CITIES.find(c => c.id === savedCityId);
      if (found) return found;
    } catch {
      // ignore
    }
    return SUPPORTED_CITIES[0]; // Bengaluru default
  });

  const setSelectedCity = (city: CityConfig) => {
    setSelectedCityState(city);
    try {
      localStorage.setItem('pulselink_selected_city', city.id);
    } catch {
      // ignore
    }
    soundFx.playSuccessChime();
  };

  // Pseudo-login verification gate state
  const [verificationUser, setVerificationUser] = useState<VerificationUserData | null>(() => {
    try {
      const saved = localStorage.getItem('pulselink_verification_gate');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      fullName: 'aditya chourasia',
      email: 'aditya.chourasia10329@gmail.com',
      workOrganisation: 'cafe / Healthcare Allied Service',
      city: 'Bengaluru',
      userCategory: 'medical_staff',
      purposeOfVisit: 'requesting',
      phoneWhatsapp: '9313264332',
      verifiedAt: new Date().toISOString()
    };
  });

  const submitVerification = (data: VerificationUserData) => {
    const enrichedData = {
      ...data,
      verifiedAt: new Date().toISOString()
    };
    setVerificationUser(enrichedData);
    try {
      localStorage.setItem('pulselink_verification_gate', JSON.stringify(enrichedData));
    } catch {
      // ignore
    }

    if (data.userCategory === 'gov_employee') {
      setCurrentRole('ambulance_dispatch');
    } else if (data.userCategory === 'medical_staff') {
      setCurrentRole('hospital_coordinator');
    }
    
    setViewMode('dashboard');
  };

  const logoutVerification = () => {
    setVerificationUser(null);
    try {
      localStorage.removeItem('pulselink_verification_gate');
    } catch {
      // ignore
    }
  };

  const [corridors, setCorridors] = useState<CorridorRoute[]>(INITIAL_CORRIDORS);
  const [organTransfers, setOrganTransfers] = useState<OrganViabilityItem[]>(INITIAL_ORGANS);
  const [bloodBanks, setBloodBanks] = useState<BloodInventoryItem[]>(INITIAL_BLOOD_BANKS);
  const [bloodRequests, setBloodRequests] = useState<BloodRequestItem[]>(INITIAL_BLOOD_REQUESTS);
  const [medicines, setMedicines] = useState<MedicineBatch[]>(INITIAL_MEDICINES);
  const [telemetryData, setTelemetryData] = useState<TelemetryPoint[]>(INITIAL_TELEMETRY);
  const [isExcursionActive, setIsExcursionActive] = useState<boolean>(false);
  const [candidates, setCandidates] = useState<FairRouteCandidate[]>(INITIAL_FAIRROUTE_CANDIDATES);
  const [auditBlocks, setAuditBlocks] = useState<ClearChainBlock[]>(INITIAL_AUDIT_BLOCKS);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [currentTimeString, setCurrentTimeString] = useState<string>('');
  const [themeMode, setThemeMode] = useState<'sand' | 'terracotta_dark'>('sand');

  const toggleThemeMode = () => {
    setThemeMode(prev => prev === 'sand' ? 'terracotta_dark' : 'sand');
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (themeMode === 'terracotta_dark') {
        document.documentElement.setAttribute('data-theme', 'terracotta-dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  }, [themeMode]);

  const baseProfile = USER_PROFILES.find(p => p.role === currentRole) || USER_PROFILES[0];
  const currentUser: UserProfile = verificationUser ? {
    ...baseProfile,
    name: verificationUser.fullName,
    institution: verificationUser.workOrganisation || baseProfile.institution
  } : baseProfile;

  const toggleAudioMute = () => {
    const next = !audioMuted;
    setAudioMuted(next);
    soundFx.setMuted(next);
  };

  // Helper to add cryptographically chained audit blocks
  const addAuditLog = useCallback(async (entry: {
    eventType: ClearChainBlock['eventType'];
    entityId: string;
    summary: string;
    actor?: string;
    actorRole?: string;
    location?: string;
    isWarning?: boolean;
  }) => {
    const lastBlock = auditBlocks[0];
    const prevHash = lastBlock ? lastBlock.currentHash : '0x0000000000000000000000000000000000000000';
    const nextNumber = (lastBlock ? lastBlock.blockNumber : 1000) + 1;
    const nowIso = new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST';
    const rawMessage = `${nextNumber}:${nowIso}:${entry.eventType}:${entry.entityId}:${entry.summary}:${prevHash}`;
    const newHash = await computeSha256(rawMessage);

    const newBlock: ClearChainBlock = {
      blockNumber: nextNumber,
      timestamp: `2026-11-18 ${nowIso}`,
      eventType: entry.eventType,
      entityId: entry.entityId,
      summary: entry.summary,
      actor: entry.actor || currentUser.name,
      actorRole: entry.actorRole || currentUser.title,
      location: entry.location || currentUser.institution,
      previousHash: prevHash,
      currentHash: newHash,
      isWarning: entry.isWarning
    };

    setAuditBlocks(prev => [newBlock, ...prev]);
  }, [auditBlocks, currentUser]);

  // Second-by-second simulation clock
  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      setCurrentTimeString(now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST');

      // 1. Decrement organ ischemia countdown
      setOrganTransfers(prev => prev.map(item => {
        if (item.status === 'In Transit' || item.status === 'Preparing') {
          const nextSec = Math.max(0, item.remainingSeconds - 1);
          return {
            ...item,
            remainingSeconds: nextSec,
            ischemiaTimeElapsedMinutes: item.ischemiaTimeElapsedMinutes + (nextSec % 60 === 0 ? 1 : 0)
          };
        }
        return item;
      }));

      // 2. Smoothly progress corridor vehicle GPS positions
      setCorridors(prev => prev.map(corr => {
        if (corr.status === 'In Transit' || corr.status === 'Clearance Active') {
          const totalPoints = corr.routePath.length;
          const nextWaypointIndex = (corr.waypointIndex + 1) % totalPoints;
          const nextWaypoint = corr.routePath[nextWaypointIndex];

          // Small step towards target
          const stepFactor = 0.04;
          const newLat = corr.currentPosition.lat + (nextWaypoint.lat - corr.currentPosition.lat) * stepFactor;
          const newLng = corr.currentPosition.lng + (nextWaypoint.lng - corr.currentPosition.lng) * stepFactor;

          const distToNext = Math.hypot(newLat - nextWaypoint.lat, newLng - nextWaypoint.lng);
          const updatedIndex = distToNext < 0.005 ? nextWaypointIndex : corr.waypointIndex;

          return {
            ...corr,
            currentPosition: { lat: newLat, lng: newLng },
            waypointIndex: updatedIndex,
            currentSpeedKmh: corr.policeClearanceActive
              ? Math.floor(74 + Math.sin(Date.now() / 3000) * 8)
              : Math.floor(52 + Math.sin(Date.now() / 3000) * 6)
          };
        }
        return corr;
      }));
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Telemetry stream generator (every 3.5 seconds)
  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      setTelemetryData(prev => {
        const last = prev[prev.length - 1];
        const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

        let targetTemp: number;
        if (isExcursionActive) {
          // Excursion elevated temp with jitter
          targetTemp = Number((11.2 + Math.random() * 0.6).toFixed(1));
        } else {
          // Safe cold-chain band with gentle jitter around 4.2°C
          targetTemp = Number((4.1 + Math.random() * 0.4).toFixed(1));
        }

        const newPoint: TelemetryPoint = {
          time: nowTime,
          temperature: targetTemp,
          humidity: Math.floor(54 + Math.random() * 4),
          batteryPercent: Math.max(75, last.batteryPercent - 0.02),
          doorOpened: isExcursionActive && Math.random() > 0.5,
          safeMin: 2.0,
          safeMax: 8.0
        };

        const trimmed = [...prev.slice(-15), newPoint];
        return trimmed;
      });
    }, 3500);

    return () => clearInterval(telemetryInterval);
  }, [isExcursionActive]);

  // Current temperature getter
  const currentTemp = telemetryData.length > 0
    ? telemetryData[telemetryData.length - 1].temperature
    : 4.2;

  // Toggle Traffic Police Clearance
  const togglePoliceClearance = async (corridorId: string) => {
    const corr = corridors.find(c => c.id === corridorId);
    if (!corr) return;

    const nextState = !corr.policeClearanceActive;

    setCorridors(prev => prev.map(c => {
      if (c.id === corridorId) {
        return {
          ...c,
          policeClearanceRequested: true,
          policeClearanceActive: nextState,
          status: nextState ? 'Clearance Active' : 'In Transit',
          clearedIntersectionsCount: nextState ? c.totalIntersectionsCount : Math.max(1, c.totalIntersectionsCount - 3)
        };
      }
      return c;
    }));

    if (nextState) {
      soundFx.playSuccessChime();
      await addAuditLog({
        eventType: 'POLICE_CLEARANCE_ACTIVE',
        entityId: corr.code,
        summary: `TRAFFIC SIGNAL OVERRIDE ACTIVATED: Traffic Police Command prioritized ${corr.title}. All ${corr.totalIntersectionsCount} junctions switched to Priority Green.`,
        actor: currentUser.name,
        actorRole: currentUser.title,
        location: 'Bengaluru Traffic Management Centre'
      });
    } else {
      soundFx.playEmergencyBeep();
      await addAuditLog({
        eventType: 'POLICE_CLEARANCE_ACTIVE',
        entityId: corr.code,
        summary: `Traffic clearance deactivated for ${corr.title}. Vehicle reverted to standard emergency lane priority.`,
        actor: currentUser.name,
        actorRole: currentUser.title,
        location: 'Traffic Operations Console'
      });
    }
  };

  // Broadcast Emergency Blood Request
  const broadcastEmergencyBlood = async (params: {
    hospital: string;
    bloodGroup: string;
    units: number;
    indication: string;
    urgency: 'Immediate (OT Critical)' | 'Urgent (<2 hrs)' | 'Scheduled';
  }): Promise<BloodRequestItem> => {
    soundFx.playEmergencyBeep();

    // Find bank with stock
    const matchingBank = bloodBanks.find(b => (b.stock[params.bloodGroup] || 0) >= params.units) || bloodBanks[2]; // Rashtrotthana has high stock

    const newReqId = `req-b-${Math.floor(100 + Math.random() * 900)}`;
    const newRequest: BloodRequestItem = {
      id: newReqId,
      requestingHospital: params.hospital,
      bloodGroup: params.bloodGroup,
      unitsRequested: params.units,
      clinicalIndication: params.indication,
      urgency: params.urgency,
      status: 'Matched',
      matchedBank: matchingBank.bankName,
      assignedVehicleId: 'KA-04-TR-4102',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST',
      etaMinutes: 14
    };

    // Deduct stock from bank
    setBloodBanks(prev => prev.map(b => {
      if (b.id === matchingBank.id) {
        const currentQty = b.stock[params.bloodGroup] || 0;
        return {
          ...b,
          stock: {
            ...b.stock,
            [params.bloodGroup]: Math.max(0, currentQty - params.units)
          },
          lastUpdated: 'Just now'
        };
      }
      return b;
    }));

    setBloodRequests(prev => [newRequest, ...prev]);

    await addAuditLog({
      eventType: 'DISPATCH_CREATED',
      entityId: newReqId.toUpperCase(),
      summary: `EMERGENCY BLOOD BROADCAST MATCHED: ${params.units} units of ${params.bloodGroup} allocated from ${matchingBank.bankName} for ${params.hospital}. Indication: ${params.indication}.`,
      actor: currentUser.name,
      actorRole: currentUser.title,
      location: params.hospital
    });

    return newRequest;
  };

  // Advance Blood Request Status
  const advanceBloodRequestStatus = async (requestId: string) => {
    const current = bloodRequests.find(r => r.id === requestId);
    if (!current) return;

    const pipeline: BloodRequestItem['status'][] = ['Requested', 'Matched', 'Dispatched', 'In Transit', 'Handover Verified'];
    const currentIndex = pipeline.indexOf(current.status);
    if (currentIndex >= pipeline.length - 1) return;

    const nextStatus = pipeline[currentIndex + 1];

    setBloodRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return { ...r, status: nextStatus };
      }
      return r;
    }));

    soundFx.playSuccessChime();

    await addAuditLog({
      eventType: nextStatus === 'Handover Verified' ? 'CHAIN_OF_CUSTODY_HANDOVER' : 'DISPATCH_CREATED',
      entityId: current.id.toUpperCase(),
      summary: `Blood Request ${current.id.toUpperCase()} advanced to status [${nextStatus}]. Units: ${current.unitsRequested}x ${current.bloodGroup}. Destination: ${current.requestingHospital}.`,
      actor: currentUser.name,
      actorRole: currentUser.title,
      location: current.requestingHospital
    });
  };

  // Simulate Temperature Excursion
  const simulateTemperatureExcursion = async () => {
    setIsExcursionActive(true);
    soundFx.playExcursionAlarm();

    // Mark current active cold-chain batch as quarantined
    setMedicines(prev => prev.map(m => {
      if (m.batchId === 'PL-MED-2026-9042') {
        return {
          ...m,
          quarantineState: true,
          verificationStatus: 'FLAGGED_DUPLICATE' // marked for inspection
        };
      }
      return m;
    }));

    await addAuditLog({
      eventType: 'TEMP_EXCURSION_ALERT',
      entityId: 'ESP32-SEN-0881',
      summary: 'CRITICAL COLD-CHAIN BREACH: Temperature spiked to 11.4°C (Exceeds maximum safe threshold 8.0°C). Carrier Box #04 seal breach detected. Batch PL-MED-2026-9042 placed in QUARANTINE.',
      actor: 'ESP32 Automated Firmware Monitor',
      actorRole: 'IoT Telemetry Daemon',
      location: 'Silk Board Transit Corridor',
      isWarning: true
    });
  };

  // Reset Temperature Excursion
  const resetTemperatureExcursion = async () => {
    setIsExcursionActive(false);
    soundFx.playSuccessChime();

    setMedicines(prev => prev.map(m => {
      if (m.batchId === 'PL-MED-2026-9042') {
        return {
          ...m,
          quarantineState: false,
          verificationStatus: 'VALID'
        };
      }
      return m;
    }));

    await addAuditLog({
      eventType: 'COLD_CHAIN_TELEMETRY',
      entityId: 'ESP32-SEN-0881',
      summary: 'Cold-chain cooling restored by auxiliary Peltier compressor. Temperature normalized to 4.2°C. Quarantine lifted post-quality audit check.',
      actor: currentUser.name,
      actorRole: currentUser.title,
      location: 'TrustCare Mobile Logistics Van'
    });
  };

  // Verify Medicine Batch
  const verifyMedicineBatch = (batchId: string): MedicineBatch | null => {
    const found = medicines.find(m => m.batchId.toLowerCase() === batchId.trim().toLowerCase());
    return found || null;
  };

  // Human Override in FairRoute
  const applyHumanOverride = async (candidateId: string, clinicalReason: string, approverId: string) => {
    const target = candidates.find(c => c.recipientId === candidateId);
    if (!target) return;

    setCandidates(prev => prev.map(c => {
      if (c.recipientId === candidateId) {
        return {
          ...c,
          selected: true,
          ruledOutReason: undefined
        };
      }
      return {
        ...c,
        selected: false,
        ruledOutReason: `Deferred due to human clinician override by Dr. ${approverId}. Reason: ${clinicalReason}`
      };
    }));

    soundFx.playEmergencyBeep();

    await addAuditLog({
      eventType: 'HUMAN_OVERRIDE',
      entityId: target.recipientId,
      summary: `MANDATORY HUMAN OVERRIDE RECORDED: Algorithmic allocation overridden in favor of Patient ${target.patientInitials} (${target.hospital}). Reason: "${clinicalReason}". Authorized Clinician ID: ${approverId}.`,
      actor: `Dr. Approver [${approverId}]`,
      actorRole: 'Senior Transplant Surgeon / Medical Superintendent',
      location: target.hospital,
      isWarning: true
    });
  };

  return (
    <PulseLinkContext.Provider value={{
      viewMode,
      setViewMode,
      activeTab,
      setActiveTab,
      activeSubFocus,
      setActiveSubFocus,
      currentRole,
      setCurrentRole,
      currentUser,
      allProfiles: USER_PROFILES,
      selectedCity,
      setSelectedCity,
      supportedCities: SUPPORTED_CITIES,
      verificationUser,
      submitVerification,
      logoutVerification,
      corridors,
      togglePoliceClearance,
      selectedCorridorId,
      setSelectedCorridorId,
      organTransfers,
      bloodBanks,
      bloodRequests,
      broadcastEmergencyBlood,
      advanceBloodRequestStatus,
      medicines,
      telemetryData,
      currentTemp,
      isExcursionActive,
      simulateTemperatureExcursion,
      resetTemperatureExcursion,
      verifyMedicineBatch,
      candidates,
      applyHumanOverride,
      auditBlocks,
      addAuditLog,
      audioMuted,
      toggleAudioMute,
      currentTimeString,
      themeMode,
      toggleThemeMode
    }}>
      {children}
    </PulseLinkContext.Provider>
  );
};

export const usePulseLink = () => {
  const context = useContext(PulseLinkContext);
  if (!context) {
    throw new Error('usePulseLink must be used within a PulseLinkProvider');
  }
  return context;
};
