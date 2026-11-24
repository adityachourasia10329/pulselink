import React from 'react';
import { usePulseLink, type PulseLinkTab } from '../../context/PulseLinkContext';
import { CorridorMap } from './CorridorMap';
import { RequestsHub } from './RequestsHub';
import { MedicineNetwork } from './MedicineNetwork';
import { FairRouteView } from './FairRouteView';
import { AuditTrailView } from './AuditTrailView';
import { GovernmentRegistriesView } from './GovernmentRegistriesView';
import { CommonUserViews } from './CommonUserViews';
import { MedicalReportsView } from './MedicalReportsView';
import { 
  Navigation, 
  HeartHandshake, 
  Package, 
  Scale, 
  FileCheck, 
  Thermometer, 
  Activity, 
  Building2, 
  Users, 
  CheckSquare, 
  HelpCircle, 
  FileText, 
  Heart
} from 'lucide-react';

interface TabItem {
  id: PulseLinkTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  countBadge?: string;
  alert?: boolean;
}

export const DashboardLayout: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    corridors, 
    organTransfers, 
    bloodRequests, 
    isExcursionActive, 
    currentTemp,
    isCommonUser,
    isMedicalStaff,
    userInquiries,
    allocationConsole
  } = usePulseLink();

  // Role-tailored tabs
  const getTabsForRole = (): TabItem[] => {
    if (isCommonUser) {
      return [
        { id: 'user_availability', label: 'Availability (Organ, Blood, Meds)', icon: Heart, count: organTransfers.length + bloodRequests.length, countBadge: 'Live' },
        { id: 'user_registrations', label: 'Government Registrations & Help', icon: FileText },
        { id: 'user_inquiries', label: 'Direct Inquiries & Support', icon: HelpCircle, count: userInquiries.length }
      ];
    } else if (isMedicalStaff) {
      return [
        { id: 'requests', label: 'Responds & Requests Hub', icon: HeartHandshake, count: organTransfers.length + bloodRequests.length, countBadge: 'Live' },
        { id: 'medicine', label: 'Medicines & Test-Kit', icon: Package, alert: isExcursionActive },
        { id: 'medical_reports', label: 'Medical Files & Tests', icon: FileCheck },
        { id: 'corridors', label: 'Command Center (ETA Tracking)', icon: Navigation }
      ];
    } else {
      // Government Employee / PulseLink Ops
      return [
        { id: 'corridors', label: 'Command Center & Map', icon: Navigation, count: corridors.filter(c => c.policeClearanceActive).length, countBadge: 'Active' },
        { id: 'requests', label: 'Organ & Blood Hub', icon: HeartHandshake, count: organTransfers.length + bloodRequests.length, countBadge: 'Live' },
        { id: 'medicine', label: 'Medicine & Cold-Chain', icon: Package, alert: isExcursionActive },
        { id: 'hospital_registry', label: 'Hospital Registry', icon: Building2 },
        { id: 'patient_registry', label: 'Patient Registry', icon: Users },
        { id: 'allocation_console', label: 'Allocation & Deallocation', icon: CheckSquare, count: allocationConsole.filter(a => a.officerApprovalStatus === 'PENDING').length, countBadge: 'Pending' },
        { id: 'fairroute', label: 'FairRoute Decision Support', icon: Scale },
        { id: 'audit', label: 'ClearChain Audit', icon: FileCheck }
      ];
    }
  };

  const navigationTabs = getTabsForRole();
  const urgentOrgan = organTransfers.find(o => o.remainingSeconds < 3600);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Welcome & Quick Telemetry Ticker */}
      <div className="bg-bottle-900 border border-bottle-700/90 rounded-2xl p-5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-bone-300">
            <span className="w-2 h-2 rounded-full bg-sage animate-ping-slow" />
            <span>Active Session:</span>
            <span className="text-bone-100 font-bold">{currentUser.name}</span>
            <span className="text-bone-400">({currentUser.badgeId})</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-bone-100 mt-1">
            {isCommonUser 
              ? 'PulseLink Patient & Family Support Console'
              : isMedicalStaff 
              ? 'PulseLink Hospital Medical Staff Console'
              : 'PulseLink Emergency Operations Console'}
          </h1>
          <p className="text-xs text-bone-300 font-mono mt-0.5">
            Node: {currentUser.institution}
          </p>
        </div>

        {/* Live Status Indicators */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          
          {/* Corridors status (hidden from Common Users) */}
          {!isCommonUser && (
            <div className="bg-bottle-950 px-3 py-2 rounded-xl border border-bottle-800 flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-sage" />
              <div>
                <span className="text-bone-400 block text-[10px]">Green Corridors</span>
                <span className="font-bold text-bone-100">{corridors.filter(c => c.policeClearanceActive).length} Active</span>
              </div>
            </div>
          )}

          {/* Organs in transit */}
          <div className={`px-3 py-2 rounded-xl border flex items-center space-x-2 ${
            urgentOrgan ? 'bg-vermilion/20 border-vermilion text-vermilion animate-pulse' : 'bg-bottle-950 border-bottle-800'
          }`}>
            <Activity className="w-4 h-4 text-vermilion" />
            <div>
              <span className="text-bone-400 block text-[10px]">Cold Ischemia</span>
              <span className="font-bold text-bone-100">{organTransfers.length} Organs</span>
            </div>
          </div>

          {/* Cold Chain Temp */}
          <div className={`px-3 py-2 rounded-xl border flex items-center space-x-2 ${
            isExcursionActive ? 'bg-vermilion/20 border-vermilion text-vermilion animate-pulse' : 'bg-bottle-950 border-bottle-800'
          }`}>
            <Thermometer className={`w-4 h-4 ${isExcursionActive ? 'text-vermilion' : 'text-sage'}`} />
            <div>
              <span className="text-bone-400 block text-[10px]">Cold-Chain IoT</span>
              <span className="font-bold text-bone-100">{currentTemp}°C</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Tab Navigation Buttons */}
      <div className="flex items-center space-x-2 border-b border-bottle-700/80 pb-1 overflow-x-auto">
        {navigationTabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-bottle-700 text-bone-100 border border-bottle-500 shadow-lg font-bold' 
                  : 'text-bone-300 hover:text-bone-100 hover:bg-bottle-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sage' : 'text-bone-400'}`} />
              <span>{tab.label}</span>

              {tab.alert && (
                <span className="w-2 h-2 rounded-full bg-vermilion animate-ping" />
              )}

              {tab.count !== undefined && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-bottle-950 text-bone-200' : 'bg-bottle-800 text-bone-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Render Active View */}
      <main className="transition-all duration-300">
        {activeTab === 'corridors' && <CorridorMap />}
        {activeTab === 'requests' && <RequestsHub />}
        {activeTab === 'medicine' && <MedicineNetwork />}
        {activeTab === 'fairroute' && <FairRouteView />}
        {activeTab === 'audit' && <AuditTrailView />}
        {activeTab === 'hospital_registry' && <GovernmentRegistriesView initialSection="hospital" />}
        {activeTab === 'patient_registry' && <GovernmentRegistriesView initialSection="patient" />}
        {activeTab === 'allocation_console' && <GovernmentRegistriesView initialSection="allocation" />}
        {activeTab === 'user_availability' && <CommonUserViews activeSubMode="availability" />}
        {activeTab === 'user_registrations' && <CommonUserViews activeSubMode="registrations" />}
        {activeTab === 'user_inquiries' && <CommonUserViews activeSubMode="inquiries" />}
        {activeTab === 'medical_reports' && <MedicalReportsView />}
      </main>

    </div>
  );
};
