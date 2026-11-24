import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  UserRole,
  UserProfile,
  UserCategory,
  CorridorRoute,
  OrganViabilityItem,
  BloodInventoryItem,
  BloodRequestItem,
  MedicineBatch,
  TelemetryPoint,
  FairRouteCandidate,
  ClearChainBlock,
  VerificationUserData,
  CityConfig,
  HospitalRegistryItem,
  PatientRegistryItem,
  AllocationConsoleItem
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
  INITIAL_AUDIT_BLOCKS,
  HOSPITAL_REGISTRY,
  PATIENT_REGISTRY,
  INITIAL_ALLOCATIONS
} from '../data/mockData';
import { soundFx } from '../utils/audio';
import { computeSha256 } from '../utils/crypto';

export type PulseLinkTab = 
  | 'corridors' 
  | 'requests' 
  | 'medicine' 
  | 'fairroute' 
  | 'audit'
  | 'hospital_registry'
  | 'patient_registry'
  | 'allocation_console'
  | 'user_availability'
  | 'user_registrations'
  | 'user_inquiries'
  | 'medical_reports';

export interface UserInquiryItem {
  id: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  category: 'organ' | 'blood' | 'medicine' | 'general';
  query: string;
  city: string;
  timestamp: string;
  status: 'Received' | 'Assigned to Medical Officer' | 'Action In Progress' | 'Resolved';
  assignedOfficer?: string;
}

interface PulseLinkContextType {
  // Navigation & Gate
  viewMode: 'landing' | 'dashboard' | 'login';
  setViewMode: (mode: 'landing' | 'dashboard' | 'login') => void;
  activeTab: PulseLinkTab;
  setActiveTab: (tab: PulseLinkTab) => void;
  activeSubFocus: 'all' | 'organ' | 'blood' | 'medicine';
  setActiveSubFocus: (focus: 'all' | 'organ' | 'blood' | 'medicine') => void;

  // Sidebar Retractable State
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Gate & Waiting Area
  gateStatus: 'intake' | 'waiting' | 'approved';
  isGateApproved: boolean;
  gateGuardError: string | null;
  setGateGuardError: (err: string | null) => void;
  guardNavigation: (targetTab?: PulseLinkTab, targetView?: 'landing' | 'dashboard' | 'login') => boolean;
  submitIntake: (data: VerificationUserData) => void;
  completeGateAndEnter: () => void;
  resetGateToIntake: () => void;

  // Role booleans & permissions
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: UserProfile;
  allProfiles: UserProfile[];
  userCategory: UserCategory;
  isCommonUser: boolean;
  isMedicalStaff: boolean;
  isGovEmployee: boolean;
  isPulseLinkEmployee: boolean;
  canViewMap: boolean;
  canViewOrganOriginLocation: boolean;
  canViewCommandCenter: boolean;
  canViewRequestsPanel: boolean;

  // City Grid Operations
  selectedCity: CityConfig;
  setSelectedCity: (city: CityConfig) => void;
  supportedCities: CityConfig[];

  // User Verification state
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
  requestMedicalPersonnelHelp: (registrationType: string, organId?: string) => Promise<void>;

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
  medicineSequenceRegistry: Record<string, { internalSequence: string; decodedPayload: string; registeredAt: string }>;
  decodeAndStoreBarcode: (barcodeInput: string) => { success: boolean; batch?: MedicineBatch; message: string; decodedInternalSeq?: string };

  // Government Registries & Allocation Console
  hospitalRegistry: HospitalRegistryItem[];
  patientRegistry: PatientRegistryItem[];
  allocationConsole: AllocationConsoleItem[];
  approveAllocation: (id: string) => Promise<void>;
  deallocateItem: (id: string, reason: string) => Promise<void>;

  // Common User Inquiries
  userInquiries: UserInquiryItem[];
  submitUserInquiry: (category: 'organ' | 'blood' | 'medicine' | 'general', queryText: string) => Promise<void>;

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

  // Theme Mode
  themeMode: 'sand' | 'terracotta_dark';
  toggleThemeMode: () => void;
}

const PulseLinkContext = createContext<PulseLinkContextType | undefined>(undefined);

export const PulseLinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always open on pseudo login page (gate) every time the site is loaded / reloaded
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard' | 'login'>('login');
  const [activeTab, setActiveTab] = useState<PulseLinkTab>('corridors');
  const [activeSubFocus, setActiveSubFocus] = useState<'all' | 'organ' | 'blood' | 'medicine'>('all');
  const [currentRole, setCurrentRole] = useState<UserRole>('hospital_coordinator');
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('corr-01');

  // Gate Status & Route Guards: No tab can open without completing intake & waiting clearance
  const [gateStatus, setGateStatus] = useState<'intake' | 'waiting' | 'approved'>('intake');
  const [gateGuardError, setGateGuardError] = useState<string | null>(null);

  const isGateApproved = gateStatus === 'approved';

  // Retractable Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pulselink_sidebar_open');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => {
      const next = !prev;
      try {
        localStorage.setItem('pulselink_sidebar_open', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

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

  // Pseudo-login verification gate state - saved for fast and easy filing
  const [verificationUser, setVerificationUser] = useState<VerificationUserData | null>(() => {
    try {
      const saved = localStorage.getItem('pulselink_verification_gate');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // ignore
    }
    return {
      fullName: 'aditya chourasia',
      email: 'aditya.chourasia10329@gmail.com',
      workOrganisation: 'manipal hospital',
      city: 'Bengaluru',
      userCategory: 'medical_staff',
      purposeOfVisit: 'requesting',
      phoneWhatsapp: '9313264332',
      isPulseLinkEmployee: false,
      verifiedAt: new Date().toISOString()
    };
  });

  // Calculate role booleans based on category
  const userCategory: UserCategory = verificationUser?.userCategory || 'medical_staff';
  const isPulseLinkEmployee = Boolean(verificationUser?.isPulseLinkEmployee);
  const isGovEmployee = userCategory === 'gov_employee';
  const isMedicalStaff = userCategory === 'medical_staff';
  const isCommonUser = userCategory === 'patient_or_family' || userCategory === 'patient_family';

  // Strict Permissions per Section 2 & 6:
  // - Map feature: ONLY Government Employee and PulseLink Employee can view map!
  //   Medical Staff and Common User MUST NOT see map feature.
  const canViewMap = isGovEmployee || isPulseLinkEmployee;

  // - Organ physical location: Medical Staff and Common User MUST NOT see where the organ is located.
  const canViewOrganOriginLocation = isGovEmployee || isPulseLinkEmployee;

  // - Command Center: Visible to Government Employee, PulseLink Employee, and Medical Staff (without map).
  //   Common User has NO Command Center access.
  const canViewCommandCenter = isGovEmployee || isPulseLinkEmployee || isMedicalStaff;

  // - Requests Panel: Visible only to Medical Staff and Government Employee.
  //   Common User has dedicated inquiry/availability views.
  const canViewRequestsPanel = isMedicalStaff || isGovEmployee || isPulseLinkEmployee;

  // Guard Navigation: Intercept any tab access if not passed intake/waiting clearance
  const guardNavigation = (targetTab?: PulseLinkTab, targetView?: 'landing' | 'dashboard' | 'login'): boolean => {
    if (!isGateApproved) {
      soundFx.playEmergencyBeep();
      setGateGuardError(
        'MANDATORY GATE ACCESS RESTRICTED: Complete intake details and receive verification clearance before navigating to operational tabs.'
      );
      setViewMode('login');
      return false;
    }

    // Role-specific route guards
    if (isCommonUser) {
      if (targetTab === 'corridors' || targetView === 'landing') {
        soundFx.playEmergencyBeep();
        setGateGuardError('Common User profile is restricted to Availability, Registrations, and Direct Inquiries. Command Center and Overview are restricted.');
        return false;
      }
      if (targetTab === 'requests') {
        soundFx.playEmergencyBeep();
        setGateGuardError('Internal Requests dispatch console is restricted to verified Medical Staff and Government Officers.');
        return false;
      }
    }

    if (isMedicalStaff && targetTab === 'corridors') {
      // Allowed Command Center, but map is excluded within the component
    }

    setGateGuardError(null);
    if (targetView) setViewMode(targetView);
    if (targetTab) setActiveTab(targetTab);
    return true;
  };

  const submitIntake = (data: VerificationUserData) => {
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

    // Move to Waiting Area stage
    setGateStatus('waiting');
    setGateGuardError(null);
    soundFx.playSuccessChime();
  };

  const completeGateAndEnter = () => {
    setGateStatus('approved');
    setGateGuardError(null);
    soundFx.playSuccessChime();

    // Divert into tailored interface per section 2:
    if (isCommonUser) {
      // Common User (Patient / Family): Availability view
      setViewMode('dashboard');
      setActiveTab('user_availability');
      setActiveSubFocus('all');
    } else if (isMedicalStaff) {
      // Medical Staff: Requests & Responds console
      setCurrentRole('hospital_coordinator');
      setViewMode('dashboard');
      setActiveTab('requests');
      setActiveSubFocus('all');
    } else if (isGovEmployee) {
      // Government Employee: Full site access with Command Center / Allocation
      setCurrentRole('ambulance_dispatch');
      setViewMode('dashboard');
      setActiveTab('corridors');
      setActiveSubFocus('all');
    } else {
      // PulseLink Employee / Other
      setViewMode('dashboard');
      setActiveTab('corridors');
      setActiveSubFocus('all');
    }
  };

  const resetGateToIntake = () => {
    setGateStatus('intake');
    setViewMode('login');
  };

  const submitVerification = (data: VerificationUserData) => {
    submitIntake(data);
  };

  const logoutVerification = () => {
    setVerificationUser(null);
    setGateStatus('intake');
    setViewMode('login');
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

  // Registries for Section 2C
  const [hospitalRegistry] = useState<HospitalRegistryItem[]>(HOSPITAL_REGISTRY);
  const [patientRegistry, setPatientRegistry] = useState<PatientRegistryItem[]>(PATIENT_REGISTRY);
  const [allocationConsole, setAllocationConsole] = useState<AllocationConsoleItem[]>(INITIAL_ALLOCATIONS);

  // Medicine Barcode & Internal Sequence Storage (Section 4)
  // Decodes barcode and stores sequence internally without leaking publicly
  const [medicineSequenceRegistry, setMedicineSequenceRegistry] = useState<
    Record<string, { internalSequence: string; decodedPayload: string; registeredAt: string }>
  >(() => {
    const initialMap: Record<string, { internalSequence: string; decodedPayload: string; registeredAt: string }> = {};
    INITIAL_MEDICINES.forEach(m => {
      initialMap[m.batchId] = {
        internalSequence: m.internalBarcodeSequence,
        decodedPayload: JSON.stringify(m.decodedPayload),
        registeredAt: new Date().toISOString()
      };
    });
    return initialMap;
  });

  // User Inquiries for Common User Interface (Section 2A)
  const [userInquiries, setUserInquiries] = useState<UserInquiryItem[]>([
    {
      id: 'INQ-701',
      userName: 'Ramesh Sundaram (Family)',
      userPhone: '9845012345',
      userEmail: 'ramesh.sundaram@gmail.com',
      category: 'organ',
      query: 'Urgent assistance needed with NOTTO registration Form 7 for deceased donor liver waitlist clearance.',
      city: 'Bengaluru',
      timestamp: '2026-11-25 01:15 IST',
      status: 'Assigned to Medical Officer',
      assignedOfficer: 'Dr. C. Shantharam'
    },
    {
      id: 'INQ-702',
      userName: 'Anita Rao (Patient)',
      userPhone: '9741098765',
      userEmail: 'anita.rao@outlook.com',
      category: 'blood',
      query: 'Seeking 2 units of O- Negative PRBC for scheduled cardiac surgery at Victoria Hospital.',
      city: 'Bengaluru',
      timestamp: '2026-11-25 02:00 IST',
      status: 'Action In Progress',
      assignedOfficer: 'Praveen Kumar'
    }
  ]);

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
      timestamp: `2026-11-25 ${nowIso}`,
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
          targetTemp = Number((11.2 + Math.random() * 0.6).toFixed(1));
        } else {
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

        return [...prev.slice(-15), newPoint];
      });
    }, 3500);

    return () => clearInterval(telemetryInterval);
  }, [isExcursionActive]);

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

    const matchingBank = bloodBanks.find(b => (b.stock[params.bloodGroup] || 0) >= params.units) || bloodBanks[2];

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
      etaMinutes: 14,
      bloodGroupCheck: {
        donorGroup: params.bloodGroup,
        compatibleRecipients: [params.bloodGroup],
        rhFactor: params.bloodGroup.includes('+') ? 'Positive' : 'Negative',
        crossMatchResult: 'COMPATIBLE'
      },
      bloodConditionAndQuality: {
        storageCondition: '2°C to 6°C Monitored CPDA-1 Refrigerated Storage',
        screeningCertified: true,
        screeningDetails: 'HIV-1/2, HBsAg, HCV, Syphilis, Malaria Non-Reactive (NABL Certified)',
        qualityStatus: 'Pristine',
        hematocritPercent: 42,
        hemolysisPercent: 0.18
      },
      quantityNeeded: params.units,
      urgencyLevel: params.urgency === 'Immediate (OT Critical)' ? 'Critical (OT Immediate)' : 'Urgent (<2 hrs)'
    };

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

    setMedicines(prev => prev.map(m => {
      if (m.batchId === 'PL-MED-2026-9042') {
        return {
          ...m,
          quarantineState: true,
          verificationStatus: 'FLAGGED_DUPLICATE'
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

  // Barcode & Internal Sequence Storage (Section 4)
  const decodeAndStoreBarcode = (barcodeInput: string) => {
    const trimmed = barcodeInput.trim();
    // Check if matches batch or internal sequence
    const found = medicines.find(
      m => m.batchId.toLowerCase() === trimmed.toLowerCase() ||
           m.internalBarcodeSequence.toLowerCase() === trimmed.toLowerCase() ||
           trimmed.includes(m.batchId)
    );

    if (found) {
      // Keep internal sequence safely stored in our internal registry
      const internalSeq = found.internalBarcodeSequence;
      setMedicineSequenceRegistry(prev => ({
        ...prev,
        [found.batchId]: {
          internalSequence: internalSeq,
          decodedPayload: JSON.stringify(found.decodedPayload),
          registeredAt: new Date().toISOString()
        }
      }));

      soundFx.playSuccessChime();
      return {
        success: true,
        batch: found,
        decodedInternalSeq: internalSeq,
        message: `Barcode successfully authenticated. Decoded internal sequence safely stored in PulseLink Secure Internal Ledger (Registry ID: SEC-${found.batchId.slice(-4)}).`
      };
    }

    soundFx.playEmergencyBeep();
    return {
      success: false,
      message: 'Unrecognized barcode syntax or sequence mismatch. Not found in verified CDSCO registry.'
    };
  };

  // Request Help of Medical Personnel (Section 2A & 3)
  const requestMedicalPersonnelHelp = async (registrationType: string, organId?: string) => {
    soundFx.playSuccessChime();
    const organItem = organTransfers.find(o => o.id === organId);
    const newInquiry: UserInquiryItem = {
      id: `HELP-${Math.floor(1000 + Math.random() * 9000)}`,
      userName: verificationUser?.fullName || 'Family of Patient',
      userPhone: verificationUser?.phoneWhatsapp || '9313264332',
      userEmail: verificationUser?.email || 'contact@pulselink.in',
      category: 'organ',
      query: `Assistance requested for mandatory statutory registration [${registrationType}] regarding ${organItem ? `${organItem.organ} (${organItem.bloodGroup})` : 'Organ Allocation'}. Requested prompt nodal clinician contact.`,
      city: selectedCity.name,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST',
      status: 'Assigned to Medical Officer',
      assignedOfficer: organItem?.governmentRegistrations.contactOfficer || 'Dr. C. Shantharam'
    };

    setUserInquiries(prev => [newInquiry, ...prev]);

    await addAuditLog({
      eventType: 'DISPATCH_CREATED',
      entityId: newInquiry.id,
      summary: `PATIENT REGISTRATION ASSISTANCE ESCALATED: Medical personnel dispatched to guide patient family through ${registrationType}. Contact: ${newInquiry.userName} (${newInquiry.userPhone}).`,
      actor: currentUser.name,
      actorRole: 'Intake Support Coordinator',
      location: selectedCity.name
    });
  };

  // Common User Inquiries (Section 2A)
  const submitUserInquiry = async (category: 'organ' | 'blood' | 'medicine' | 'general', queryText: string) => {
    soundFx.playSuccessChime();
    const newInq: UserInquiryItem = {
      id: `INQ-${Math.floor(100 + Math.random() * 900)}`,
      userName: verificationUser?.fullName || 'Guest User',
      userPhone: verificationUser?.phoneWhatsapp || '9313264332',
      userEmail: verificationUser?.email || 'patient@pulselink.in',
      category,
      query: queryText,
      city: selectedCity.name,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST',
      status: 'Received',
      assignedOfficer: 'PulseLink Duty Medical Officer'
    };

    setUserInquiries(prev => [newInq, ...prev]);

    await addAuditLog({
      eventType: 'DISPATCH_CREATED',
      entityId: newInq.id,
      summary: `User Inquiry Submitted [${category.toUpperCase()}]: "${queryText.slice(0, 70)}..." from ${newInq.userName}.`,
      actor: newInq.userName,
      actorRole: 'Common User / Patient Representative',
      location: selectedCity.name
    });
  };

  // Government Allocation Console Approvals & Deallocations (Section 2C)
  const approveAllocation = async (id: string) => {
    setAllocationConsole(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, officerApprovalStatus: 'APPROVED' };
      }
      return item;
    }));

    // Update patient registry status
    const alloc = allocationConsole.find(a => a.id === id);
    if (alloc) {
      setPatientRegistry(prev => prev.map(p => {
        if (p.id === alloc.patientId) {
          return { ...p, allocationStatus: 'ALLOCATED' };
        }
        return p;
      }));
    }

    soundFx.playSuccessChime();
    await addAuditLog({
      eventType: 'HUMAN_OVERRIDE',
      entityId: id,
      summary: `GOVERNMENT STATUTORY APPROVAL: Allocation Console Item ${id} ratified by Nodal Officer ${currentUser.name}. Organ allocated based on cross-match and HLA reports.`,
      actor: currentUser.name,
      actorRole: 'State Organ Allocation Authority (SOTTO/ROTTO)',
      location: selectedCity.name
    });
  };

  const deallocateItem = async (id: string, reason: string) => {
    setAllocationConsole(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          officerApprovalStatus: 'DEALLOCATED',
          clinicalReasoning: `DEALLOCATED: ${reason}. ${item.clinicalReasoning}`
        };
      }
      return item;
    }));

    const alloc = allocationConsole.find(a => a.id === id);
    if (alloc) {
      setPatientRegistry(prev => prev.map(p => {
        if (p.id === alloc.patientId) {
          return { ...p, allocationStatus: 'DEALLOCATED' };
        }
        return p;
      }));
    }

    soundFx.playEmergencyBeep();
    await addAuditLog({
      eventType: 'HUMAN_OVERRIDE',
      entityId: id,
      summary: `GOVERNMENT STATUTORY DEALLOCATION: Allocation Item ${id} deallocated. Reason: "${reason}". Officer: ${currentUser.name}.`,
      actor: currentUser.name,
      actorRole: 'State Organ Allocation Authority (SOTTO/ROTTO)',
      location: selectedCity.name,
      isWarning: true
    });
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
      isSidebarOpen,
      setIsSidebarOpen,
      toggleSidebar,
      gateStatus,
      isGateApproved,
      gateGuardError,
      setGateGuardError,
      guardNavigation,
      submitIntake,
      completeGateAndEnter,
      resetGateToIntake,
      currentRole,
      setCurrentRole,
      currentUser,
      allProfiles: USER_PROFILES,
      userCategory,
      isCommonUser,
      isMedicalStaff,
      isGovEmployee,
      isPulseLinkEmployee,
      canViewMap,
      canViewOrganOriginLocation,
      canViewCommandCenter,
      canViewRequestsPanel,
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
      requestMedicalPersonnelHelp,
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
      medicineSequenceRegistry,
      decodeAndStoreBarcode,
      hospitalRegistry,
      patientRegistry,
      allocationConsole,
      approveAllocation,
      deallocateItem,
      userInquiries,
      submitUserInquiry,
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
