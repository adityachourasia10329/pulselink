import React, { useState } from 'react';
import { usePulseLink } from '../../context/PulseLinkContext';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  Heart, 
  FileCheck
} from 'lucide-react';

export const MedicalReportsView: React.FC = () => {
  const { organTransfers, currentUser, addAuditLog, selectedCity } = usePulseLink();

  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    id: string;
    name: string;
    type: string;
    uploadedBy: string;
    timestamp: string;
    status: 'Verified' | 'Pending Review';
  }>>([
    {
      id: 'REP-HLA-901',
      name: 'HLA_High_Resolution_Sequencing_Narayana_Donor.pdf',
      type: 'HLA Typing & Crossmatch',
      uploadedBy: 'Dr. C. Shantharam',
      timestamp: '2026-11-25 01:20 IST',
      status: 'Verified'
    },
    {
      id: 'REP-SER-902',
      name: 'Serology_Viral_Screening_NAT_Negative_Cert.pdf',
      type: 'Infectious Disease NAT',
      uploadedBy: 'NABL Central Lab Officer',
      timestamp: '2026-11-25 01:45 IST',
      status: 'Verified'
    },
    {
      id: 'REP-BIO-903',
      name: 'Donor_Liver_Zero_Hour_Wedge_Biopsy_Score.pdf',
      type: 'Histopathology Biopsy',
      uploadedBy: 'Dr. R. K. Hegde',
      timestamp: '2026-11-25 02:10 IST',
      status: 'Verified'
    }
  ]);

  const [activeModalReport, setActiveModalReport] = useState<any | null>(null);
  const [uploadSuccessToast, setUploadSuccessToast] = useState(false);

  const handleSimulateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newEntry = {
        id: `REP-CLIN-${Math.floor(100 + Math.random() * 900)}`,
        name: file.name,
        type: 'Clinical Diagnostic Report',
        uploadedBy: currentUser.name,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST',
        status: 'Verified' as const
      };

      setUploadedFiles(prev => [newEntry, ...prev]);
      setUploadSuccessToast(true);

      await addAuditLog({
        eventType: 'DISPATCH_CREATED',
        entityId: newEntry.id,
        summary: `CLINICAL REPORT UPLOADED & SIGNED: "${newEntry.name}" attached by ${currentUser.name} (${currentUser.institution}).`,
        actor: currentUser.name,
        actorRole: currentUser.title,
        location: selectedCity.name
      });

      setTimeout(() => setUploadSuccessToast(false), 3500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-bottle-900 border border-bottle-700/80 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-bone-300">
            <ShieldCheck className="w-4 h-4 text-sage" />
            <span>Clinical Data Governance Protocol</span>
            <span className="text-bone-400">•</span>
            <span className="text-bone-200">THOTA / NABL Encrypted Vault</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-bone-100 mt-1">
            Medical Files &amp; Clinical Test Reports
          </h1>
          <p className="text-xs text-bone-300 font-sans mt-0.5">
            Verified donor diagnostics, HLA cross-matches, biopsy scores, and infectious screening reports.
          </p>
        </div>

        {/* Upload Button */}
        <label className="py-2.5 px-4 rounded-xl bg-cobalt hover:bg-cobalt-dark text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cobalt/30 transition-all flex items-center justify-center space-x-2 cursor-pointer self-start sm:self-auto">
          <Upload className="w-4 h-4" />
          <span>Upload Lab Report</span>
          <input type="file" onChange={handleSimulateUpload} className="hidden" accept=".pdf,.doc,.docx,.png,.jpg" />
        </label>
      </div>

      {uploadSuccessToast && (
        <div className="p-3.5 rounded-xl bg-sage/20 border border-sage text-sage text-xs font-mono flex items-center space-x-2 shadow-lg animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Clinical report successfully encrypted, timestamped, and stored in PulseLink ClearChain vault.</span>
        </div>
      )}

      {/* Grid of Verified Organ Clinical Dossiers */}
      <div className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-bone-100">
          Active Donor Organ Clinical Summaries
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {organTransfers.map(organ => (
            <div 
              key={organ.id}
              className="bg-bottle-900 border border-bottle-700 rounded-xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-bottle-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-vermilion" />
                    <span className="font-serif font-bold text-bone-100 text-lg">{organ.organ}</span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-bottle-950 border border-bottle-700 text-sage">
                      {organ.bloodGroup}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-bone-400">ID: {organ.id}</span>
                </div>

                <div className="mt-3 space-y-2 text-xs font-mono bg-bottle-950 p-3 rounded-lg border border-bottle-800">
                  <div>
                    <span className="text-bone-400 text-[10px] block">HLA Typing Result:</span>
                    <span className="text-bone-100 font-semibold">{organ.medicalReports.hlaTyping}</span>
                  </div>
                  <div>
                    <span className="text-bone-400 text-[10px] block">Cross-Match Status:</span>
                    <span className="text-sage font-semibold">{organ.medicalReports.crossMatchResult || organ.medicalReports.crossMatch}</span>
                  </div>
                  <div>
                    <span className="text-bone-400 text-[10px] block">Serology (Infectious Diseases):</span>
                    <span className="text-bone-200">{organ.medicalReports.serology}</span>
                  </div>
                  <div>
                    <span className="text-bone-400 text-[10px] block">Organ Condition / Biopsy:</span>
                    <span className="text-bone-200">{organ.medicalReports.biopsyScore || organ.organCondition.biopsyAssessment}</span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-bone-300 font-sans leading-relaxed">
                  {organ.medicalReports.clinicalSummary || organ.allocatedReason}
                </p>
              </div>

              <button
                onClick={() => setActiveModalReport(organ)}
                className="w-full py-2 px-3 rounded-lg bg-bottle-800 hover:bg-bottle-700 border border-bottle-600 text-bone-100 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-sage" />
                <span>View Full Clinical Diagnostic File</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Uploaded Documents Table */}
      <div className="space-y-3 pt-4 border-t border-bottle-800">
        <h2 className="font-serif text-xl font-bold text-bone-100">
          Encrypted Clinical Documents &amp; Test Certificates
        </h2>

        <div className="bg-bottle-900 border border-bottle-700 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-bottle-950 text-bone-300 font-mono uppercase text-[11px] border-b border-bottle-700">
              <tr>
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-3">Report Category</th>
                <th className="py-3 px-3">Uploaded By</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bottle-800">
              {uploadedFiles.map(file => (
                <tr key={file.id} className="hover:bg-bottle-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-bone-100 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-sage shrink-0" />
                    <span>{file.name}</span>
                  </td>
                  <td className="py-3.5 px-3 text-bone-300 font-mono">{file.type}</td>
                  <td className="py-3.5 px-3 text-bone-200">{file.uploadedBy}</td>
                  <td className="py-3.5 px-3 text-bone-400 font-mono">{file.timestamp}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sage/20 text-sage border border-sage/40">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{file.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {activeModalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bottle-950/80 backdrop-blur-sm p-4">
          <div className="bg-bottle-900 border border-bottle-600 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-bottle-700 pb-3">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-sage" />
                <h3 className="font-serif text-lg font-bold text-bone-100">
                  Clinical Diagnostic Dossier: {activeModalReport.organ} ({activeModalReport.id})
                </h3>
              </div>
              <button 
                onClick={() => setActiveModalReport(null)}
                className="text-bone-400 hover:text-bone-100 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono bg-bottle-950 p-4 rounded-xl border border-bottle-800">
              <div className="flex justify-between">
                <span className="text-bone-400">Blood Type:</span>
                <span className="text-sage font-bold">{activeModalReport.bloodGroup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-400">Time of Death of Initial Owner:</span>
                <span className="text-bone-200">{activeModalReport.timeOfDeathInitialOwner || activeModalReport.timeOfDeath}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-400">HLA Typing:</span>
                <span className="text-bone-100">{activeModalReport.medicalReports.hlaTyping}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-400">Cross-Match:</span>
                <span className="text-sage font-bold">{activeModalReport.medicalReports.crossMatchResult || activeModalReport.medicalReports.crossMatch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-400">Serology NAT:</span>
                <span className="text-bone-200">{activeModalReport.medicalReports.serology}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-400">Preservation Modality:</span>
                <span className="text-bone-200">{activeModalReport.organCondition.preservationMethod || activeModalReport.organCondition.perfusionMethod}</span>
              </div>
            </div>

            <p className="text-xs text-bone-200 font-sans leading-relaxed">
              {activeModalReport.medicalReports.clinicalSummary || activeModalReport.allocatedReason}
            </p>

            <button
              onClick={() => setActiveModalReport(null)}
              className="w-full py-2.5 rounded-xl bg-bottle-800 hover:bg-bottle-700 text-bone-100 text-xs font-semibold"
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
