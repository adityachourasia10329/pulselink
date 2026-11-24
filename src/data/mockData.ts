import type { 
  HospitalNode, 
  CorridorRoute, 
  OrganViabilityItem, 
  BloodInventoryItem, 
  BloodRequestItem, 
  MedicineBatch, 
  TelemetryPoint, 
  FairRouteCandidate, 
  ClearChainBlock,
  UserProfile,
  CityConfig,
  HospitalRegistryItem,
  PatientRegistryItem,
  AllocationConsoleItem
} from '../types';

export const SUPPORTED_CITIES: CityConfig[] = [
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    code: 'BLR',
    activeHospitals: 8,
    activeCorridors: 3,
    description: 'Silicon Plateau Medical Corridor & Heart Transplant Hub'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    code: 'BOM',
    activeHospitals: 12,
    activeCorridors: 5,
    description: 'Western Seaboard Multi-Organ Emergency Grid'
  },
  {
    id: 'delhi',
    name: 'Delhi',
    state: 'National Capital Region',
    code: 'DEL',
    activeHospitals: 14,
    activeCorridors: 6,
    description: 'Apex AIIMS & Northern Arterial Traffic Preemption Grid'
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    code: 'AMD',
    activeHospitals: 7,
    activeCorridors: 2,
    description: 'Sabarmati Healthcare Ring & Regional Blood Depot'
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    code: 'MAA',
    activeHospitals: 9,
    activeCorridors: 4,
    description: 'Southern Transplant Capital & Cadaver Organ Corridor'
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    code: 'CCU',
    activeHospitals: 8,
    activeCorridors: 3,
    description: 'Eastern Zonal Cold-Chain & Emergency Transit Hub'
  },
  {
    id: 'guwahati',
    name: 'Guwahati',
    state: 'Assam',
    code: 'GAU',
    activeHospitals: 5,
    activeCorridors: 2,
    description: 'Northeast Medical Transit Lifeline & Air Bridge Node'
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    state: 'Punjab / Haryana',
    code: 'IXC',
    activeHospitals: 6,
    activeCorridors: 2,
    description: 'PGIMER Tri-City Rapid Green Corridor Network'
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    code: 'HYD',
    activeHospitals: 10,
    activeCorridors: 4,
    description: 'Deccan Genome Valley & Robotic Surgical Dispatch'
  }
];

export const USER_PROFILES: UserProfile[] = [
  {
    id: 'user_manipal_coord',
    name: 'Dr. Ananya Rao, M.S.',
    title: 'Lead Transplant Coordinator',
    institution: 'Manipal Hospital, HAL Old Airport Rd',
    role: 'hospital_coordinator',
    badgeId: 'KMC-TRANS-9812'
  },
  {
    id: 'user_lions_officer',
    name: 'Praveen Kumar, M.Sc.',
    title: 'Chief Transfusion Officer',
    institution: 'Lions Regional Blood Centre, Seshadripuram',
    role: 'blood_bank_officer',
    badgeId: 'BB-KA-44120'
  },
  {
    id: 'user_traffic_dispatch',
    name: 'Inspector M. Siddaramaiah',
    title: 'Command Dispatch Officer',
    institution: 'Bengaluru Traffic Police (Green Corridor Unit)',
    role: 'ambulance_dispatch',
    badgeId: 'BTP-DISP-07'
  },
  {
    id: 'user_trustcare_pharma',
    name: 'Kavita Nair, B.Pharm',
    title: 'Quality & Cold-Chain Auditor',
    institution: 'TrustCare Central Depot, Peenya',
    role: 'pharmacy_coldchain',
    badgeId: 'CDSCO-AUDIT-553'
  }
];

export const BENGALURU_HOSPITALS: HospitalNode[] = [
  {
    id: 'hosp_narayana',
    name: 'Narayana Health City',
    shortName: 'Narayana Health',
    type: 'Tertiary Hospital',
    coordinates: { lat: 12.8252, lng: 77.6896 },
    address: '258/A, Bommasandra Industrial Area, Hosur Road, Bengaluru 560099',
    zone: 'South',
    activeEmergencyBeds: 42,
    hasHelipad: true,
    contactPhone: '+91 80 7122 2222'
  },
  {
    id: 'hosp_manipal',
    name: 'Manipal Hospital (HAL Old Airport)',
    shortName: 'Manipal HAL',
    type: 'Tertiary Hospital',
    coordinates: { lat: 12.9589, lng: 77.6534 },
    address: '98, HAL Old Airport Rd, Kodihalli, Bengaluru 560017',
    zone: 'East',
    activeEmergencyBeds: 36,
    hasHelipad: true,
    contactPhone: '+91 80 2502 4444'
  },
  {
    id: 'hosp_victoria',
    name: 'Victoria Hospital & BMCRI',
    shortName: 'Victoria Hospital',
    type: 'Tertiary Hospital',
    coordinates: { lat: 12.9634, lng: 77.5756 },
    address: 'Fort Road, Near City Market, Kalasipalya, Bengaluru 560002',
    zone: 'Central',
    activeEmergencyBeds: 60,
    hasHelipad: false,
    contactPhone: '+91 80 2670 1150'
  },
  {
    id: 'hosp_stjohns',
    name: "St. John's Medical College Hospital",
    shortName: "St. John's Hospital",
    type: 'Tertiary Hospital',
    coordinates: { lat: 12.9345, lng: 77.6190 },
    address: 'Sarjapur Main Rd, John Nagar, Koramangala, Bengaluru 560034',
    zone: 'South',
    activeEmergencyBeds: 28,
    hasHelipad: false,
    contactPhone: '+91 80 2206 5000'
  },
  {
    id: 'hosp_apollo',
    name: 'Apollo Hospitals Bannerghatta',
    shortName: 'Apollo Bannerghatta',
    type: 'Tertiary Hospital',
    coordinates: { lat: 12.8938, lng: 77.5978 },
    address: '154/11, Bannerghatta Main Rd, Krishnaraju Layout, Bengaluru 560076',
    zone: 'South',
    activeEmergencyBeds: 24,
    hasHelipad: true,
    contactPhone: '+91 80 2630 4050'
  },
  {
    id: 'bank_lions',
    name: 'Lions Blood Centre & Research Institute',
    shortName: 'Lions Blood Centre',
    type: 'Blood Centre',
    coordinates: { lat: 12.9877, lng: 77.5779 },
    address: 'Plot No. 1, 1st Cross, Seshadripuram, Bengaluru 560020',
    zone: 'North',
    activeEmergencyBeds: 0,
    hasHelipad: false,
    contactPhone: '+91 80 2346 6622'
  },
  {
    id: 'bank_rashtrotthana',
    name: 'Rashtrotthana Blood Centre',
    shortName: 'Rashtrotthana Blood Centre',
    type: 'Blood Centre',
    coordinates: { lat: 12.9461, lng: 77.5681 },
    address: 'Keshava Shilpa, Kempegowda Nagar, Gavipuram, Bengaluru 560019',
    zone: 'Central',
    activeEmergencyBeds: 0,
    hasHelipad: false,
    contactPhone: '+91 80 2661 2730'
  },
  {
    id: 'depot_trustcare',
    name: 'TrustCare Central Pharma Depot',
    shortName: 'TrustCare Peenya Depot',
    type: 'Central Depot',
    coordinates: { lat: 13.0315, lng: 77.5140 },
    address: 'Sector 3, Peenya Industrial Area, Bengaluru 560058',
    zone: 'North',
    activeEmergencyBeds: 0,
    hasHelipad: false,
    contactPhone: '+91 80 2839 9000'
  },
  {
    id: 'chc_anekal',
    name: 'Anekal Community Health Centre (CHC)',
    shortName: 'Anekal CHC',
    type: 'Community Health Centre',
    coordinates: { lat: 12.7112, lng: 77.6978 },
    address: 'Main Road, Anekal Town, Bengaluru Urban District 562106',
    zone: 'Rural Fringe',
    activeEmergencyBeds: 12,
    hasHelipad: false,
    contactPhone: '+91 80 2785 2244'
  },
  {
    id: 'chc_nelamangala',
    name: 'Nelamangala Taluk General Hospital',
    shortName: 'Nelamangala Hospital',
    type: 'Community Health Centre',
    coordinates: { lat: 13.0988, lng: 77.3912 },
    address: 'B.H. Road, Nelamangala Town, Bengaluru Rural 562123',
    zone: 'Rural Fringe',
    activeEmergencyBeds: 16,
    hasHelipad: false,
    contactPhone: '+91 80 2772 3130'
  }
];

export const INITIAL_CORRIDORS: CorridorRoute[] = [
  {
    id: 'corr-01',
    title: 'Donor Heart: Narayana Health City ➔ Manipal Hospital HAL',
    code: 'PULSE-CORR-01',
    cargoType: 'Donor Heart',
    origin: BENGALURU_HOSPITALS[0], // Narayana
    destination: BENGALURU_HOSPITALS[1], // Manipal
    vehicleId: 'KA-05-EM-9901',
    vehicleType: 'Advanced Life Support Ambulance',
    currentPosition: { lat: 12.9175, lng: 77.6238 }, // Approaching Silk Board Junction
    waypointIndex: 3,
    routePath: [
      { lat: 12.8252, lng: 77.6896 }, // Narayana Health City
      { lat: 12.8550, lng: 77.6680 }, // Electronic City Toll Plaza
      { lat: 12.8800, lng: 77.6520 }, // Kudlu Gate
      { lat: 12.9175, lng: 77.6238 }, // Silk Board Flyover / Junction
      { lat: 12.9345, lng: 77.6190 }, // St. John's / Koramangala Water Tank
      { lat: 12.9520, lng: 77.6380 }, // Domlur Flyover / Inner Ring Rd
      { lat: 12.9589, lng: 77.6534 }  // Manipal Hospital HAL Old Airport
    ],
    standardGpsEtaMinutes: 54,
    greenCorridorEtaMinutes: 21,
    timeSavedMinutes: 33,
    status: 'Clearance Active',
    currentSpeedKmh: 76,
    policeClearanceRequested: true,
    policeClearanceActive: true,
    clearedIntersectionsCount: 6,
    totalIntersectionsCount: 8,
    activeBottlenecks: [
      'Silk Board Junction (Signals manually held green by Traffic Control)',
      'Domlur Inner Ring Road merging point'
    ]
  },
  {
    id: 'corr-02',
    title: 'Emergency Blood (O-): Lions Blood Centre ➔ Victoria Hospital OT',
    code: 'PULSE-CORR-02',
    cargoType: 'Emergency Blood (O-)',
    origin: BENGALURU_HOSPITALS[5], // Lions Blood Centre
    destination: BENGALURU_HOSPITALS[2], // Victoria Hospital
    vehicleId: 'KA-04-TR-4102',
    vehicleType: 'Cold-Chain Express Van',
    currentPosition: { lat: 12.9740, lng: 77.5765 }, // Passing Mysore Bank Circle
    waypointIndex: 2,
    routePath: [
      { lat: 12.9877, lng: 77.5779 }, // Lions Blood Centre
      { lat: 12.9780, lng: 77.5750 }, // Anand Rao Circle
      { lat: 12.9710, lng: 77.5770 }, // Mysore Bank Circle
      { lat: 12.9660, lng: 77.5850 }, // Corporation / Hudson Circle
      { lat: 12.9634, lng: 77.5756 }  // Victoria Hospital Emergency Trauma
    ],
    standardGpsEtaMinutes: 28,
    greenCorridorEtaMinutes: 11,
    timeSavedMinutes: 17,
    status: 'In Transit',
    currentSpeedKmh: 62,
    policeClearanceRequested: true,
    policeClearanceActive: false,
    clearedIntersectionsCount: 3,
    totalIntersectionsCount: 5,
    activeBottlenecks: [
      'Anand Rao Circle Flyover under repair',
      'K.R. Market morning congestion zone'
    ]
  },
  {
    id: 'corr-03',
    title: 'Snake Antivenom & Rabies Stock: Peenya Depot ➔ Anekal CHC',
    code: 'PULSE-CORR-03',
    cargoType: 'Snake Antivenom',
    origin: BENGALURU_HOSPITALS[7], // TrustCare Peenya
    destination: BENGALURU_HOSPITALS[8], // Anekal CHC
    vehicleId: 'KA-02-TC-8820',
    vehicleType: 'Cold-Chain Express Van',
    currentPosition: { lat: 12.8900, lng: 77.5400 }, // NICE Road South junction
    waypointIndex: 2,
    routePath: [
      { lat: 13.0315, lng: 77.5140 }, // Peenya Depot
      { lat: 12.9800, lng: 77.5000 }, // NICE Road North junction
      { lat: 12.8900, lng: 77.5400 }, // NICE Road Cloverleaf Bannerghatta Link
      { lat: 12.8200, lng: 77.6100 }, // Jigani Industrial Corridor
      { lat: 12.7112, lng: 77.6978 }  // Anekal CHC
    ],
    standardGpsEtaMinutes: 68,
    greenCorridorEtaMinutes: 38,
    timeSavedMinutes: 30,
    status: 'In Transit',
    currentSpeedKmh: 82,
    policeClearanceRequested: false,
    policeClearanceActive: false,
    clearedIntersectionsCount: 2,
    totalIntersectionsCount: 4,
    activeBottlenecks: [
      'Jigani road surface repair segment'
    ]
  }
];

export const INITIAL_ORGANS: OrganViabilityItem[] = [
  {
    id: 'organ-01',
    organ: 'Heart',
    donorHospital: 'Narayana Health City (Bommasandra)',
    recipientHospital: 'Manipal Hospital (HAL Old Airport)',
    donorId: 'DON-KA-2026-081',
    recipientId: 'REC-KA-2026-944 (Patient S. Kulkarni, 48M)',
    bloodGroup: 'B+',
    totalViabilityHours: 4.0,
    remainingSeconds: 3120, // 52 minutes left (under 60 mins -> pulses Vermilion!)
    status: 'In Transit',
    priority: 'CRITICAL_CODE_RED',
    ischemiaTimeElapsedMinutes: 188,
    assignedVehicleId: 'KA-05-EM-9901',
    estimatedArrivalMinutes: 19,
    allocatedReason: 'Primary recipient with urgent status 1A; MELD-cardio 36, matched 6/6 HLA compatibility, transit window strictly feasible with Green Corridor.',

    // Section 3 additions
    timeOfDeath: '2026-11-25 00:45 IST',
    timeOfDeathCountdownSec: 3120,
    medicalReports: {
      hlaTyping: 'HLA-A*02:01, HLA-B*44:02, HLA-DRB1*04:01 (6/6 Perfect Match)',
      crossMatch: 'T-Cell & B-Cell Complement-Dependent Cytotoxicity (CDC) Negative (<5%)',
      serology: 'HIV-1/2 Non-Reactive, HBsAg Negative, HCV Ab Negative, CMV IgG Pos/IgM Neg',
      ischemicTolerance: 'Max static cold ischemic tolerance: 4.0h. Warm ischemia time at retrieval: 8 mins.',
      clinicalMetrics: 'LVEF: 62%, PaO2/FiO2: 440 mmHg, Troponin-I: 0.02 ng/mL (Normal myocardial function)'
    },
    organCondition: {
      preservationStatus: 'Celsior Solution Cold Storage with Micro-Oxygenated Transit Box #04',
      viabilityScorePercent: 96,
      perfusionMethod: 'Hypothermic Oxygenated Perfusion (HOPE) Transit Pod',
      biopsyAssessment: 'Grade 0: Zero interstitial edema, intact sarcolemma morphology, excellent contractility'
    },
    matchStatus: 'Matched',
    matchReasoning: 'Top cadaveric priority on NOTTO Karnataka list (Status 1A). Cross-match negative with 6/6 HLA compatibility and zero donor-specific anti-HLA antibodies.',
    governmentRegistrations: {
      nottoId: 'NOTTO-KA-HRT-2026-8819',
      sottoClearance: 'SOTTO/KA/ALLOC/VALID/9912',
      thotaForms: ['Form 1 (Brain Stem Death Declaration)', 'Form 8 (Organ Retrieval Authorization)', 'Form 10 (Transplant Handover)'],
      registrationStatus: 'Approved',
      contactOfficer: 'Dr. Suresh Babu, SOTTO Nodal Transplant Officer'
    }
  },
  {
    id: 'organ-02',
    organ: 'Liver',
    donorHospital: 'Victoria Hospital & BMCRI',
    recipientHospital: 'Apollo Hospitals Bannerghatta',
    donorId: 'DON-KA-2026-082',
    recipientId: 'REC-KA-2026-902 (Patient R. Varma, 53M)',
    bloodGroup: 'O+',
    totalViabilityHours: 10.0,
    remainingSeconds: 12940, // ~3.6 hours left
    status: 'Preparing',
    priority: 'HIGH_URGENT',
    ischemiaTimeElapsedMinutes: 384,
    assignedVehicleId: 'KA-04-EM-7119',
    estimatedArrivalMinutes: 32,
    allocatedReason: 'Decompensated cirrhosis (MELD score 34), zero donor anti-HLA antibodies.',

    // Section 3 additions
    timeOfDeath: '2026-11-24 22:30 IST',
    timeOfDeathCountdownSec: 12940,
    medicalReports: {
      hlaTyping: 'HLA-A*01:01, HLA-B*08:01, HLA-DRB1*03:01 (5/6 Compatible Match)',
      crossMatch: 'Flow Cytometry Cross-Match (FCXM) Negative (B & T cell median channel shift < 20)',
      serology: 'HBsAg Negative, HCV Negative, Syphilis Non-Reactive, HIV Negative',
      ischemicTolerance: 'Cold Ischemia tolerance: 10.0h. Warm retrieval ischemia: 14 mins.',
      clinicalMetrics: 'Total Bilirubin: 0.8 mg/dL, ALT: 28 IU/L, AST: 32 IU/L, Peak Lactate during perfusion: 1.4 mmol/L'
    },
    organCondition: {
      preservationStatus: 'University of Wisconsin (UW) Perfusion Solution at 4°C',
      viabilityScorePercent: 91,
      perfusionMethod: 'Machine Perfusion Pre-Flush Standard Protocol',
      biopsyAssessment: 'Grade 1: Minimal microvesicular steatosis (<5%), zero portal inflammation'
    },
    matchStatus: 'Matched',
    matchReasoning: 'Statutory allocation per MELD priority algorithm. Donor liver volume meets graft-to-recipient weight ratio (GRWR 1.12%).',
    governmentRegistrations: {
      nottoId: 'NOTTO-KA-LVR-2026-4402',
      sottoClearance: 'SOTTO/KA/ALLOC/VALID/8834',
      thotaForms: ['Form 1 (Brain Stem Death Declaration)', 'Form 8 (Organ Retrieval Clearance)'],
      registrationStatus: 'Approved',
      contactOfficer: 'Dr. Geetha Murthy, State Organ Sharing Registry'
    }
  },
  {
    id: 'organ-03',
    organ: 'Kidney',
    donorHospital: "St. John's Medical College Hospital",
    recipientHospital: 'Victoria Hospital & BMCRI',
    donorId: 'DON-KA-2026-083',
    recipientId: 'REC-KA-2026-788 (Patient G. Gowda, 36F)',
    bloodGroup: 'A+',
    totalViabilityHours: 24.0,
    remainingSeconds: 48900, // ~13.5 hours left
    status: 'Matched',
    priority: 'STANDARD_PRIORITY',
    ischemiaTimeElapsedMinutes: 625,
    assignedVehicleId: 'KA-01-TC-3012',
    estimatedArrivalMinutes: 45,
    allocatedReason: 'Pediatric mother waiting 3.8 years on state cadaver roster; perfect crossmatch.',

    // Section 3 additions
    timeOfDeath: '2026-11-24 19:15 IST',
    timeOfDeathCountdownSec: 48900,
    medicalReports: {
      hlaTyping: 'HLA-A*03:01, HLA-B*07:02, HLA-DRB1*15:01 (High Stringency Match)',
      crossMatch: 'Luminex Single Antigen Bead Assay: Zero DSA detected (<500 MFI)',
      serology: 'HBV Surface Antigen Non-Reactive, HCV Ab Negative, HIV Negative',
      ischemicTolerance: 'Extended cold storage window: 24.0h. High resilience under pulsatile perfusion.',
      clinicalMetrics: 'Donor Serum Creatinine: 0.9 mg/dL, Glomerular Filtration Rate: 98 mL/min'
    },
    organCondition: {
      preservationStatus: 'Hypothermic Pulsatile Machine Perfusion (LifePort)',
      viabilityScorePercent: 94,
      perfusionMethod: 'Pulsatile Renal Perfusion at 30 mmHg Resistance',
      biopsyAssessment: 'Remuzzi Score 1/12: Completely pristine glomeruli, zero interstitial fibrosis'
    },
    matchStatus: 'Matched',
    matchReasoning: 'Longest waitlist seniority in ABO A+ tier (1,380 days). Excellent functional perfusion dynamics.',
    governmentRegistrations: {
      nottoId: 'NOTTO-KA-KID-2026-1194',
      sottoClearance: 'SOTTO/KA/ALLOC/VALID/7701',
      thotaForms: ['Form 1 (Brain Stem Death)', 'Form 8 (Statutory Authorization)', 'Form 11 (Recipient Acknowledgment)'],
      registrationStatus: 'Approved',
      contactOfficer: 'Dr. Suresh Babu, SOTTO Nodal Transplant Officer'
    }
  }
];

export const INITIAL_BLOOD_BANKS: BloodInventoryItem[] = [
  {
    id: 'bank-01',
    bankName: 'Lions Blood Centre & Research Institute',
    location: 'Seshadripuram, Bengaluru',
    contactPhone: '+91 80 2346 6622',
    stock: {
      'O-': 3, // CRITICAL LOW
      'O+': 28,
      'A-': 5,
      'A+': 34,
      'B-': 4,
      'B+': 41,
      'AB-': 2, // CRITICAL LOW
      'AB+': 16
    },
    lastUpdated: '12 mins ago'
  },
  {
    id: 'bank-02',
    bankName: 'Victoria Hospital Blood Bank & Transfusion Dept',
    location: 'City Market / Fort Road',
    contactPhone: '+91 80 2670 1150',
    stock: {
      'O-': 2, // DANGEROUS SHORTAGE
      'O+': 18,
      'A-': 4,
      'A+': 22,
      'B-': 3,
      'B+': 30,
      'AB-': 1,
      'AB+': 12
    },
    lastUpdated: '5 mins ago'
  },
  {
    id: 'bank-03',
    bankName: 'Rashtrotthana Blood Centre',
    location: 'Basavanagudi / Gavipuram',
    contactPhone: '+91 80 2661 2730',
    stock: {
      'O-': 9, // Adequate reserve
      'O+': 46,
      'A-': 11,
      'A+': 52,
      'B-': 8,
      'B+': 59,
      'AB-': 6,
      'AB+': 24
    },
    lastUpdated: '8 mins ago'
  },
  {
    id: 'bank-04',
    bankName: 'Manipal Hospital In-House Transfusion Bank',
    location: 'HAL Old Airport Road',
    contactPhone: '+91 80 2502 4444',
    stock: {
      'O-': 4,
      'O+': 32,
      'A-': 6,
      'A+': 38,
      'B-': 5,
      'B+': 44,
      'AB-': 3,
      'AB+': 19
    },
    lastUpdated: '15 mins ago'
  }
];

export const INITIAL_BLOOD_REQUESTS: BloodRequestItem[] = [
  {
    id: 'req-b-101',
    requestingHospital: 'Victoria Hospital (Trauma ICU)',
    bloodGroup: 'O-',
    unitsRequested: 4,
    clinicalIndication: 'Emergency Trauma / Polytrauma Road Accident, Hemoglobin 4.2 g/dL',
    urgency: 'Immediate (OT Critical)',
    status: 'In Transit',
    matchedBank: 'Rashtrotthana Blood Centre',
    assignedVehicleId: 'KA-04-TR-4102',
    timestamp: '23:18 IST',
    etaMinutes: 11,

    // Section 5 additions
    bloodGroupCheck: {
      donorGroup: 'O-',
      compatibleRecipients: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+ (Universal Donor)'],
      rhFactor: 'Negative',
      crossMatchResult: 'COMPATIBLE'
    },
    bloodConditionAndQuality: {
      storageCondition: '2.0°C to 6.0°C Continuous Monitored CPDA-1 Storage',
      screeningCertified: true,
      screeningDetails: 'HIV-1/2, HBsAg, HCV-Ab, Syphilis/VDRL, Malaria Non-Reactive (NABL Certified)',
      qualityStatus: 'Pristine',
      hematocritPercent: 62,
      hemolysisPercent: 0.3
    },
    quantityNeeded: 4,
    urgencyLevel: 'Critical (OT Immediate)'
  },
  {
    id: 'req-b-102',
    requestingHospital: 'Manipal Hospital (Cardiac OT 3)',
    bloodGroup: 'AB-',
    unitsRequested: 2,
    clinicalIndication: 'Acute Aortic Dissection Repair',
    urgency: 'Immediate (OT Critical)',
    status: 'Matched',
    matchedBank: 'Rashtrotthana Blood Centre',
    assignedVehicleId: 'KA-05-EM-9901',
    timestamp: '23:25 IST',
    etaMinutes: 18,

    // Section 5 additions
    bloodGroupCheck: {
      donorGroup: 'AB-',
      compatibleRecipients: ['AB-', 'AB+'],
      rhFactor: 'Negative',
      crossMatchResult: 'COMPATIBLE'
    },
    bloodConditionAndQuality: {
      storageCondition: '2.0°C to 6.0°C Monitored Refrigeration with IoT Temp Sensor',
      screeningCertified: true,
      screeningDetails: 'HIV Non-Reactive, Hepatitis B/C Clean, NAT Tested Certified',
      qualityStatus: 'Pristine',
      hematocritPercent: 58,
      hemolysisPercent: 0.2
    },
    quantityNeeded: 2,
    urgencyLevel: 'Critical (OT Immediate)'
  },
  {
    id: 'req-b-103',
    requestingHospital: 'Anekal CHC (Maternity Ward)',
    bloodGroup: 'B+',
    unitsRequested: 3,
    clinicalIndication: 'Severe Postpartum Hemorrhage (PPH)',
    urgency: 'Urgent (<2 hrs)',
    status: 'Dispatched',
    matchedBank: 'Narayana Health City Blood Bank',
    assignedVehicleId: 'KA-02-TC-8820',
    timestamp: '23:05 IST',
    etaMinutes: 24,

    // Section 5 additions
    bloodGroupCheck: {
      donorGroup: 'B+',
      compatibleRecipients: ['B+', 'AB+'],
      rhFactor: 'Positive',
      crossMatchResult: 'COMPATIBLE'
    },
    bloodConditionAndQuality: {
      storageCondition: '3.4°C Cold-Chain Express Transit Box #02',
      screeningCertified: true,
      screeningDetails: 'Complete 5-Point Mandatory Serological Clearance Verified',
      qualityStatus: 'Acceptable',
      hematocritPercent: 60,
      hemolysisPercent: 0.4
    },
    quantityNeeded: 3,
    urgencyLevel: 'Urgent (<2 hrs)'
  }
];

export const INITIAL_MEDICINES: MedicineBatch[] = [
  {
    batchId: 'PL-MED-2026-9042',
    medicineName: 'Human Albumin 20% Infusion (100ml)',
    dosageForm: 'IV Infusion Solution',
    manufacturer: 'Bharat Serums & Vaccines Ltd',
    manufacturingDate: '2026-03-12',
    expiryDate: '2028-02-28',
    cdscoLicenseNo: 'CDSCO/BIO/KA/8849/2026',
    currentStockUnits: 340,
    depotLocation: 'TrustCare Central Depot, Peenya',
    storageRequirement: '2°C to 8°C (Cold-Chain Required)',
    standardMrpInr: 4450,
    subsidizedPriceInr: 1280,
    labCertificateHash: 'sha256:d48e89f2a4c871b9e02319fbc7412e09bb31980327f2f7aa',
    verificationStatus: 'VALID',
    quarantineState: false,
    tamperSealIntact: true,

    // Section 4 additions
    internalBarcodeSequence: 'GS1-DATAMATRIX:010890123456789021PL90421728022810BSV26',
    decodedPayload: {
      gtin: '08901234567890',
      batchNo: 'BSV-2026-9042',
      serialNo: 'SN-KA-441092',
      verificationHash: '0x992fa1d08bc3e412a89df44'
    },
    testKitDirections: {
      steps: [
        'Step 1: Draw 0.2 ml sample using sterile pipette and add into Test Tube A (Buffered Saline).',
        'Step 2: Insert PulseLink Protein Reaction Strip; gently agitate for 5 seconds.',
        'Step 3: Allow colorimetric reaction to incubate undisturbed for 30 seconds at 20°C-25°C.',
        'Step 4: Compare color band against the CDSCO verified reference card (Violet = Valid, Amber = Compromised).'
      ],
      colorBandCheck: 'Deep Violet (#6D28D9) confirms >19.5% pure human albumin fraction without denaturation.',
      observationWindowSeconds: 30,
      reagentSolutionName: 'PulseLink Albumin Verification Buffer Type-1'
    },
    requestOrigin: {
      facilityName: 'Victoria Hospital & BMCRI',
      department: 'Trauma ICU & Burn Unit',
      locationCity: 'Bengaluru Central',
      timestamp: '2026-11-25 01:25 IST'
    },
    requestedItem: {
      name: 'Human Albumin 20% Infusion',
      dosageForm: 'IV Infusion Glass Bottle',
      strength: '20g / 100ml (20%)',
      quantityUnits: 25,
      clinicalUrgency: 'CRITICAL_ICU'
    }
  },
  {
    batchId: 'PL-VAC-2025-1108',
    medicineName: 'Anti-Rabies Immunoglobulin (Equine) 1000 IU',
    dosageForm: 'Injectable Solution',
    manufacturer: 'Serum Institute of India Pvt Ltd',
    manufacturingDate: '2024-11-01',
    expiryDate: '2026-10-31',
    cdscoLicenseNo: 'CDSCO/VAC/MH/3199/2024',
    currentStockUnits: 85,
    depotLocation: 'Nelamangala Taluk Hospital Pharmacy',
    storageRequirement: '2°C to 8°C (Strict Cold-Chain)',
    standardMrpInr: 2150,
    subsidizedPriceInr: 450,
    labCertificateHash: 'sha256:8890ab221c97a8120349bca74e921d743a19b8449021da33',
    verificationStatus: 'EXPIRED',
    quarantineState: true,
    tamperSealIntact: true,

    // Section 4 additions
    internalBarcodeSequence: 'GS1-DATAMATRIX:010890111222333421PL11081726103110SERUM25',
    decodedPayload: {
      gtin: '08901112223334',
      batchNo: 'SII-2025-1108',
      serialNo: 'SN-MH-991204',
      verificationHash: '0x11ab4889efc3409'
    },
    testKitDirections: {
      steps: [
        'Step 1: Check physical vial clarity under white light; verify absence of flocculation.',
        'Step 2: Add 1 drop to Lyophilized Immuno-Test Well B.',
        'Step 3: Read result band within 45 seconds.',
        'Step 4: Red line over expiration control confirms quarantine status.'
      ],
      colorBandCheck: 'Flagged: Expiration marker active. Automatic quarantine protocol engaged.',
      observationWindowSeconds: 45,
      reagentSolutionName: 'PulseLink Immunoglobulin Titration Reagent'
    },
    requestOrigin: {
      facilityName: 'Nelamangala Taluk General Hospital',
      department: 'Emergency Animal Bite Clinic',
      locationCity: 'Bengaluru Rural',
      timestamp: '2026-11-25 00:50 IST'
    },
    requestedItem: {
      name: 'Anti-Rabies Immunoglobulin 1000 IU',
      dosageForm: 'Vial with Sterile Diluent',
      strength: '1000 IU / 5ml',
      quantityUnits: 15,
      clinicalUrgency: 'HIGH_PRIORITY'
    }
  },
  {
    batchId: 'PL-ANT-2026-3391',
    medicineName: 'Polyvalent Anti-Snake Venom Serum (Lyophilized)',
    dosageForm: 'Vial with Sterile Diluent',
    manufacturer: 'Haffkine Bio-Pharmaceutical Corp',
    manufacturingDate: '2026-01-15',
    expiryDate: '2028-12-31',
    cdscoLicenseNo: 'CDSCO/ASV/KA/1120/2026',
    currentStockUnits: 120,
    depotLocation: 'Anekal Community Health Centre',
    storageRequirement: 'Store below 25°C in dry dark space',
    standardMrpInr: 1800,
    subsidizedPriceInr: 320,
    labCertificateHash: 'sha256:5521ca9001bfa9824c90d8a113f990142b781190bcda4211',
    verificationStatus: 'FLAGGED_DUPLICATE',
    quarantineState: true,
    tamperSealIntact: false,
    redistributionRecommended: {
      fromLocation: 'Victoria Hospital Surplus Stock',
      toClinic: 'Anekal CHC (High viper snakebite prevalence)',
      daysUntilExpiry: 45,
      reason: 'Prevent expiration wastage; Anekal records 8 bites/week vs Victoria 1 bite/month.'
    },

    // Section 4 additions
    internalBarcodeSequence: 'GS1-DATAMATRIX:010890999888777621PL33911728123110HAF26',
    decodedPayload: {
      gtin: '08909998887776',
      batchNo: 'HAF-2026-3391',
      serialNo: 'SN-KA-118822',
      verificationHash: '0x44cd88219ffbb01'
    },
    testKitDirections: {
      steps: [
        'Step 1: Reconstitute vial with 10ml sterile water for injection.',
        'Step 2: Apply 10 microliters onto the Venom Neutralization Test Card.',
        'Step 3: Observe antibody binding control line at 60 seconds.',
        'Step 4: Dual lines confirm authentic polyvalent neutralizing potency (Cobra, Krait, Russell Viper, Saw-Scaled Viper).'
      ],
      colorBandCheck: 'Dual Violet Bands (Test + Control) confirm 100% active polyvalent venom neutralizer.',
      observationWindowSeconds: 60,
      reagentSolutionName: 'PulseLink Venom Potency Neutralization Test Kit'
    },
    requestOrigin: {
      facilityName: 'Anekal Community Health Centre (CHC)',
      department: 'Rural Anti-Venom Emergency Unit',
      locationCity: 'Bengaluru South Fringe',
      timestamp: '2026-11-25 01:10 IST'
    },
    requestedItem: {
      name: 'Polyvalent Anti-Snake Venom Serum',
      dosageForm: 'Lyophilized Powder + Diluent',
      strength: 'Neutralizes 0.6mg Cobra / 0.45mg Russell Viper',
      quantityUnits: 40,
      clinicalUrgency: 'CRITICAL_ICU'
    }
  },
  {
    batchId: 'PL-INS-2026-5510',
    medicineName: 'Insulin Glargine 100 IU/ml (3ml Cartridge)',
    dosageForm: 'Subcutaneous Solution',
    manufacturer: 'Biocon Biologics India',
    manufacturingDate: '2026-05-10',
    expiryDate: '2027-11-30',
    cdscoLicenseNo: 'CDSCO/BIO/KA/4092/2026',
    currentStockUnits: 620,
    depotLocation: 'TrustCare Peenya Depot',
    storageRequirement: '2°C to 8°C (Do Not Freeze)',
    standardMrpInr: 1250,
    subsidizedPriceInr: 290,
    labCertificateHash: 'sha256:fe92100a74ba18992fca3991209cc54199ba82019488aef0',
    verificationStatus: 'VALID',
    quarantineState: false,
    tamperSealIntact: true,
    redistributionRecommended: {
      fromLocation: 'Manipal Hospital Pharmacy Depot',
      toClinic: 'Nelamangala Taluk Hospital',
      daysUntilExpiry: 58,
      reason: 'Rebalance surplus diabetic stock to suburban center facing insulin deficit.'
    },

    // Section 4 additions
    internalBarcodeSequence: 'GS1-DATAMATRIX:010890555444333221PL55101727113010BIOCON26',
    decodedPayload: {
      gtin: '08905554443332',
      batchNo: 'BIO-2026-5510',
      serialNo: 'SN-KA-772911',
      verificationHash: '0x88ee2109bac3301'
    },
    testKitDirections: {
      steps: [
        'Step 1: Confirm cold storage temperature log has remained between 2.0°C and 8.0°C.',
        'Step 2: Inspect solution clarity for any crystal formation.',
        'Step 3: Sample 0.1 ml with PulseLink Glargine Solubility pH Strips.',
        'Step 4: Verify acidic clear formulation (pH 4.0 ± 0.2) ensuring delayed subcutaneous release.'
      ],
      colorBandCheck: 'Verified pH 4.0 clear band matches Biocon genuine biosimilar standard.',
      observationWindowSeconds: 15,
      reagentSolutionName: 'PulseLink Insulin Cold-Chain Integrity Test Kit'
    },
    requestOrigin: {
      facilityName: 'Manipal Hospital (HAL Old Airport)',
      department: 'Inpatient Endocrinology Pharmacy',
      locationCity: 'Bengaluru East',
      timestamp: '2026-11-24 23:40 IST'
    },
    requestedItem: {
      name: 'Insulin Glargine 100 IU/ml',
      dosageForm: 'Pen Cartridges (3ml)',
      strength: '100 IU / ml',
      quantityUnits: 50,
      clinicalUrgency: 'ROUTINE_STOCK'
    }
  }
];

// Section 2C: Government Registries & Allocation Console Data
export const HOSPITAL_REGISTRY: HospitalRegistryItem[] = [
  {
    id: 'reg-hosp-01',
    name: 'Manipal Hospital (HAL Old Airport Road)',
    licenseNumber: 'KA-DHS-NOTTO-0492',
    accreditation: 'NABH_LEVEL_3',
    city: 'Bengaluru',
    activeTransplantBeds: 18,
    nodalOfficer: 'Dr. Ananya Rao, M.S. (Lead Coordinator)',
    contact: '+91 80 2502 4444',
    status: 'VERIFIED'
  },
  {
    id: 'reg-hosp-02',
    name: 'Narayana Health City (Bommasandra)',
    licenseNumber: 'KA-DHS-NOTTO-0182',
    accreditation: 'GOVT_APEX',
    city: 'Bengaluru',
    activeTransplantBeds: 24,
    nodalOfficer: 'Dr. C. Shanthi, M.Ch (Cardiothoracic Nodal)',
    contact: '+91 80 7122 2222',
    status: 'VERIFIED'
  },
  {
    id: 'reg-hosp-03',
    name: 'Victoria Hospital & BMCRI',
    licenseNumber: 'KA-GOVT-BMCRI-0012',
    accreditation: 'GOVT_APEX',
    city: 'Bengaluru',
    activeTransplantBeds: 32,
    nodalOfficer: 'Prof. B. Ramesh, M.S., FRCS',
    contact: '+91 80 2670 1150',
    status: 'VERIFIED'
  },
  {
    id: 'reg-hosp-04',
    name: 'Apollo Hospitals Bannerghatta',
    licenseNumber: 'KA-DHS-NOTTO-0771',
    accreditation: 'NABH_LEVEL_3',
    city: 'Bengaluru',
    activeTransplantBeds: 14,
    nodalOfficer: 'Dr. Mahesh Gopalan, M.D.',
    contact: '+91 80 2630 4050',
    status: 'VERIFIED'
  }
];

export const PATIENT_REGISTRY: PatientRegistryItem[] = [
  {
    id: 'pat-reg-01',
    patientInitials: 'S. Kulkarni',
    age: 48,
    gender: 'M',
    bloodGroup: 'B+',
    organNeeded: 'Heart',
    meldScore: 36,
    urgencyTier: 'STATUS_1A_CRITICAL',
    registeredDate: '2025-08-14',
    hospital: 'Manipal Hospital (HAL Old Airport)',
    allocationStatus: 'ALLOCATED'
  },
  {
    id: 'pat-reg-02',
    patientInitials: 'R. Varma',
    age: 53,
    gender: 'M',
    bloodGroup: 'O+',
    organNeeded: 'Liver',
    meldScore: 34,
    urgencyTier: 'STATUS_1B_URGENT',
    registeredDate: '2025-11-02',
    hospital: 'Apollo Hospitals Bannerghatta',
    allocationStatus: 'ALLOCATED'
  },
  {
    id: 'pat-reg-03',
    patientInitials: 'G. Gowda',
    age: 36,
    gender: 'F',
    bloodGroup: 'A+',
    organNeeded: 'Kidney',
    meldScore: 28,
    urgencyTier: 'STATUS_2_WAITLIST',
    registeredDate: '2023-01-20',
    hospital: 'Victoria Hospital & BMCRI',
    allocationStatus: 'ALLOCATED'
  },
  {
    id: 'pat-reg-04',
    patientInitials: 'A. Joseph',
    age: 41,
    gender: 'M',
    bloodGroup: 'O-',
    organNeeded: 'Heart',
    meldScore: 33,
    urgencyTier: 'STATUS_1B_URGENT',
    registeredDate: '2025-09-18',
    hospital: 'Narayana Health City',
    allocationStatus: 'WAITLISTED'
  },
  {
    id: 'pat-reg-05',
    patientInitials: 'P. Venkat',
    age: 62,
    gender: 'M',
    bloodGroup: 'B+',
    organNeeded: 'Kidney',
    meldScore: 19,
    urgencyTier: 'STATUS_2_WAITLIST',
    registeredDate: '2024-04-12',
    hospital: 'Victoria Hospital & BMCRI',
    allocationStatus: 'WAITLISTED'
  }
];

export const INITIAL_ALLOCATIONS: AllocationConsoleItem[] = [
  {
    id: 'alloc-01',
    patientId: 'pat-reg-01',
    patientInitials: 'S. Kulkarni (48M)',
    hospital: 'Manipal Hospital (HAL Old Airport)',
    organ: 'Heart',
    organId: 'organ-01',
    suggestedAction: 'ALLOCATE',
    clinicalReasoning: 'Top recipient on NOTTO Karnataka Status 1A list. HLA 6/6 complete antigen match, zero donor-specific anti-HLA antibodies, cross-match negative. Green Corridor ETA (19 min) is well within 4.0h cold ischemia threshold.',
    medicalReportsSummary: 'LVEF 18% end-stage DCM, PA catheter on dual inotropes. Donor heart echo: LVEF 62%, PaO2 440 mmHg, Troponin nominal.',
    officerApprovalStatus: 'APPROVED',
    timestamp: '2026-11-25 01:05 IST'
  },
  {
    id: 'alloc-02',
    patientId: 'pat-reg-02',
    patientInitials: 'R. Varma (53M)',
    hospital: 'Apollo Hospitals Bannerghatta',
    organ: 'Liver',
    organId: 'organ-02',
    suggestedAction: 'ALLOCATE',
    clinicalReasoning: 'MELD score 34 with refractory ascites and recurrent encephalopathy. Donor GRWR 1.12% with biopsy showing <5% microvesicular steatosis.',
    medicalReportsSummary: 'Total Bilirubin 14.8 mg/dL, INR 2.4, Serum Creatinine 1.8 mg/dL. Donor LFT: Bilirubin 0.8, AST 32.',
    officerApprovalStatus: 'APPROVED',
    timestamp: '2026-11-25 00:40 IST'
  },
  {
    id: 'alloc-03',
    patientId: 'pat-reg-04',
    patientInitials: 'A. Joseph (41M)',
    hospital: 'Narayana Health City',
    organ: 'Heart',
    organId: 'organ-01',
    suggestedAction: 'DEALLOCATE',
    clinicalReasoning: 'Deallocation suggested: Patient serum anti-HLA Class I antibody screen tested positive (DSA MFI > 6,500 against donor HLA-B*44). High hyperacute rejection risk. Primary allocation to S. Kulkarni approved.',
    medicalReportsSummary: 'DSA positive. Panel Reactive Antibodies (PRA) 82%. Urgent re-matching required.',
    officerApprovalStatus: 'DEALLOCATED',
    timestamp: '2026-11-25 00:55 IST'
  }
];

export const INITIAL_TELEMETRY: TelemetryPoint[] = [
  { time: '23:10', temperature: 4.1, humidity: 55, batteryPercent: 94, doorOpened: false, safeMin: 2.0, safeMax: 8.0 },
  { time: '23:14', temperature: 4.3, humidity: 56, batteryPercent: 93, doorOpened: false, safeMin: 2.0, safeMax: 8.0 },
  { time: '23:18', temperature: 4.2, humidity: 54, batteryPercent: 92, doorOpened: false, safeMin: 2.0, safeMax: 8.0 },
  { time: '23:22', temperature: 4.5, humidity: 57, batteryPercent: 91, doorOpened: false, safeMin: 2.0, safeMax: 8.0 },
  { time: '23:26', temperature: 4.4, humidity: 55, batteryPercent: 90, doorOpened: false, safeMin: 2.0, safeMax: 8.0 },
  { time: '23:30', temperature: 4.6, humidity: 58, batteryPercent: 89, doorOpened: false, safeMin: 2.0, safeMax: 8.0 },
  { time: '23:34', temperature: 4.8, humidity: 59, batteryPercent: 88, doorOpened: false, safeMin: 2.0, safeMax: 8.0 }
];

export const INITIAL_FAIRROUTE_CANDIDATES: FairRouteCandidate[] = [
  {
    recipientId: 'REC-KA-2026-944',
    patientInitials: 'S.K.',
    age: 48,
    hospital: 'Manipal Hospital (HAL Old Airport)',
    urgencyScore: 36, // Severe Status 1A
    ischemiaRiskPercent: 14,
    routeFeasibilityScore: 94, // 21 mins green corridor
    waitingDays: 412,
    selected: true,
    scoreBreakdown: {
      clinicalNeed: 38,
      viabilityMatch: 92,
      hlaMatch: 96,
      equitySeniority: 88
    }
  },
  {
    recipientId: 'REC-KA-2026-819',
    patientInitials: 'V.M.',
    age: 52,
    hospital: 'Apollo Hospitals Bannerghatta',
    urgencyScore: 31,
    ischemiaRiskPercent: 46,
    routeFeasibilityScore: 68,
    waitingDays: 310,
    selected: false,
    ruledOutReason: 'Excess cold ischemia risk: Heavy traffic on Outer Ring Rd makes transit window >65 mins, which would surpass safe cardiac cold ischemia threshold of 4.0h. Clinically safer for next available donor closer to South corridor.',
    scoreBreakdown: {
      clinicalNeed: 31,
      viabilityMatch: 64,
      hlaMatch: 82,
      equitySeniority: 72
    }
  },
  {
    recipientId: 'REC-KA-2026-702',
    patientInitials: 'K.P.',
    age: 61,
    hospital: 'Victoria Hospital & BMCRI',
    urgencyScore: 22,
    ischemiaRiskPercent: 38,
    routeFeasibilityScore: 75,
    waitingDays: 190,
    selected: false,
    ruledOutReason: 'Lower clinical urgency (Status 2, stable on inotropes). Donor crossmatch revealed 2/6 donor-specific antibodies (DSA positive titer 1:128) indicating elevated hyperacute rejection hazard.',
    scoreBreakdown: {
      clinicalNeed: 22,
      viabilityMatch: 70,
      hlaMatch: 45,
      equitySeniority: 58
    }
  }
];

export const INITIAL_AUDIT_BLOCKS: ClearChainBlock[] = [
  {
    blockNumber: 1042,
    timestamp: '2026-11-18 23:28:44 IST',
    eventType: 'POLICE_CLEARANCE_ACTIVE',
    entityId: 'PULSE-CORR-01',
    summary: 'Green Corridor preemption activated by BTP Traffic Control. 6 signals overridden on Hosur Elevated Expressway & Silk Board Flyover.',
    actor: 'Inspector M. Siddaramaiah (Badge: BTP-DISP-07)',
    actorRole: 'Ambulance & Green Corridor Dispatch',
    location: 'Bengaluru Traffic Management Centre (Infantry Rd)',
    previousHash: '0x9a4e7f82b13009da19284cf780214aef99321',
    currentHash: '0x3f1b9920acde881249bfa813098f921da8490'
  },
  {
    blockNumber: 1041,
    timestamp: '2026-11-18 23:18:10 IST',
    eventType: 'COLD_CHAIN_TELEMETRY',
    entityId: 'ESP32-SEN-0881',
    summary: 'Carrier Box #04 telemetry heartbeat confirmed: 4.4°C, 55% RH, Door Seal: SECURE, GPS locked at Silk Board.',
    actor: 'Automated IoT Daemon (Firmware v2.4-ESP32)',
    actorRole: 'ColdGuard Edge Telemetry',
    location: 'Latitude 12.9175, Longitude 77.6238',
    previousHash: '0x7b88921dfa0134ac99824cf10928bb8419208',
    currentHash: '0x9a4e7f82b13009da19284cf780214aef99321'
  },
  {
    blockNumber: 1040,
    timestamp: '2026-11-18 23:14:02 IST',
    eventType: 'DISPATCH_CREATED',
    entityId: 'ORGAN-HEART-081',
    summary: 'Human Donor Heart procured and chilled at Narayana Health City. Handover signed to ALS Ambulance KA-05-EM-9901.',
    actor: 'Dr. C. Shantharam, Chief Transplant Surgeon',
    actorRole: 'Hospital Coordinator (Narayana Health)',
    location: 'OT Complex 4, Narayana Health City, Bommasandra',
    previousHash: '0x12c4998af38008da771029ba883019cf88214',
    currentHash: '0x7b88921dfa0134ac99824cf10928bb8419208'
  },
  {
    blockNumber: 1039,
    timestamp: '2026-11-18 22:58:30 IST',
    eventType: 'CHAIN_OF_CUSTODY_HANDOVER',
    entityId: 'REQ-B-101',
    summary: '4 Units O- Negative PRBC released under emergency trauma protocol. Transferred to Cold-Chain Express KA-04-TR-4102.',
    actor: 'Praveen Kumar, Chief Transfusion Officer',
    actorRole: 'Blood Bank Officer (Lions Blood Centre)',
    location: 'Cryostorage Vault 2, Lions Blood Centre',
    previousHash: '0x44901ba873099ea182049ba019388dfa91283',
    currentHash: '0x12c4998af38008da771029ba883019cf88214'
  }
];
