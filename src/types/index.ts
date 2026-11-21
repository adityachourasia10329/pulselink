export type UserRole = 
  | 'hospital_coordinator' 
  | 'blood_bank_officer' 
  | 'ambulance_dispatch' 
  | 'pharmacy_coldchain';

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  institution: string;
  role: UserRole;
  badgeId: string;
}

export type UserCategory = 
  | 'patient_family' 
  | 'medical_staff' 
  | 'gov_employee' 
  | 'other';

export type PurposeOfVisit = 
  | 'requesting' 
  | 'responding' 
  | 'inquiry' 
  | 'regular_audit' 
  | 'others';

export interface VerificationUserData {
  fullName: string;
  email: string;
  workOrganisation: string;
  city: string;
  userCategory: UserCategory;
  purposeOfVisit: PurposeOfVisit;
  phoneWhatsapp?: string;
  verifiedAt?: string;
}

export interface CityConfig {
  id: string;
  name: string;
  state: string;
  code: string;
  activeHospitals: number;
  activeCorridors: number;
  description: string;
}

export type OrganType = 'Heart' | 'Liver' | 'Kidney' | 'Cornea' | 'Lungs';

export interface OrganViabilityItem {
  id: string;
  organ: OrganType;
  donorHospital: string;
  recipientHospital: string;
  donorId: string;
  recipientId: string;
  bloodGroup: string;
  totalViabilityHours: number;
  remainingSeconds: number; // dynamically ticks down
  status: 'In Transit' | 'Preparing' | 'Matched' | 'Transplanted';
  priority: 'CRITICAL_CODE_RED' | 'HIGH_URGENT' | 'STANDARD_PRIORITY';
  ischemiaTimeElapsedMinutes: number;
  assignedVehicleId: string;
  estimatedArrivalMinutes: number;
  allocatedReason: string;
}

export interface BloodInventoryItem {
  id: string;
  bankName: string;
  location: string;
  contactNumber?: string;
  contactPhone?: string;
  stock: Record<string, number>; // e.g. { 'O-': 4, 'O+': 28, 'A-': 6, ... }
  lastUpdated: string;
}

export interface BloodRequestItem {
  id: string;
  requestingHospital: string;
  bloodGroup: string;
  unitsRequested: number;
  clinicalIndication: string; // e.g., 'Emergency Cardiac Bypass', 'Severe Postpartum Hemorrhage'
  urgency: 'Immediate (OT Critical)' | 'Urgent (<2 hrs)' | 'Scheduled';
  status: 'Requested' | 'Matched' | 'Dispatched' | 'In Transit' | 'Handover Verified';
  matchedBank?: string;
  assignedVehicleId?: string;
  timestamp: string;
  etaMinutes?: number;
}

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export interface HospitalNode {
  id: string;
  name: string;
  shortName: string;
  type: 'Tertiary Hospital' | 'Blood Centre' | 'Community Health Centre' | 'Central Depot';
  coordinates: GeoCoordinate;
  address: string;
  zone: 'Central' | 'South' | 'East' | 'North' | 'Rural Fringe';
  activeEmergencyBeds: number;
  hasHelipad: boolean;
  contactPhone: string;
}

export interface CorridorRoute {
  id: string;
  title: string;
  code: string;
  cargoType: 'Donor Heart' | 'Emergency Blood (O-)' | 'Snake Antivenom' | 'Donor Liver';
  origin: HospitalNode;
  destination: HospitalNode;
  vehicleId: string;
  vehicleType: 'Advanced Life Support Ambulance' | 'Cold-Chain Express Van' | 'Medical Drone';
  currentPosition: GeoCoordinate;
  waypointIndex: number;
  routePath: GeoCoordinate[];
  standardGpsEtaMinutes: number;
  greenCorridorEtaMinutes: number;
  timeSavedMinutes: number;
  status: 'In Transit' | 'Clearance Active' | 'Approaching Destination' | 'Completed';
  currentSpeedKmh: number;
  policeClearanceRequested: boolean;
  policeClearanceActive: boolean;
  clearedIntersectionsCount: number;
  totalIntersectionsCount: number;
  activeBottlenecks: string[];
}

export interface MedicineBatch {
  batchId: string;
  medicineName: string;
  dosageForm: string;
  manufacturer: string;
  manufacturingDate: string;
  expiryDate: string;
  cdscoLicenseNo: string;
  currentStockUnits: number;
  depotLocation: string;
  storageRequirement: string; // e.g., '2°C to 8°C (Cold-Chain)'
  standardMrpInr: number;
  subsidizedPriceInr: number;
  labCertificateHash: string;
  verificationStatus: 'VALID' | 'EXPIRED' | 'FLAGGED_DUPLICATE';
  quarantineState: boolean;
  tamperSealIntact: boolean;
  redistributionRecommended?: {
    fromLocation: string;
    toClinic: string;
    daysUntilExpiry: number;
    reason: string;
  };
}

export interface TelemetryPoint {
  time: string;
  temperature: number; // °C
  humidity: number; // %
  batteryPercent: number;
  doorOpened: boolean;
  safeMin: number;
  safeMax: number;
}

export interface FairRouteCandidate {
  recipientId: string;
  patientInitials: string;
  age: number;
  hospital: string;
  urgencyScore: number; // MELD score or emergency index (0-40)
  ischemiaRiskPercent: number;
  routeFeasibilityScore: number;
  waitingDays: number;
  selected: boolean;
  ruledOutReason?: string;
  scoreBreakdown: {
    clinicalNeed: number;
    viabilityMatch: number;
    hlaMatch: number;
    equitySeniority: number;
  };
}

export interface ClearChainBlock {
  blockNumber: number;
  timestamp: string;
  eventType: 'DISPATCH_CREATED' | 'POLICE_CLEARANCE_ACTIVE' | 'COLD_CHAIN_TELEMETRY' | 'TEMP_EXCURSION_ALERT' | 'HUMAN_OVERRIDE' | 'CHAIN_OF_CUSTODY_HANDOVER';
  entityId: string;
  summary: string;
  actor: string;
  actorRole: string;
  location: string;
  previousHash: string;
  currentHash: string;
  isWarning?: boolean;
}
