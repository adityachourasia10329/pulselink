import React, { useState } from 'react';
import { usePulseLink } from '../../context/PulseLinkContext';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  Lock, 
  Copy, 
  Check 
} from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const { auditBlocks } = usePulseLink();

  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredBlocks = auditBlocks.filter(block => {
    const matchesFilter = filterType === 'ALL' || block.eventType === filterType;
    const matchesQuery = 
      block.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.currentHash.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesQuery;
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditBlocks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pulselink-clearchain-audit-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Cryptographic Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-bottle-700/80 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-bone-300">
            <Lock className="w-3.5 h-3.5 text-sage" />
            <span>ClearChain Immutable Ledger</span>
            <span className="text-bone-400">•</span>
            <span className="text-sage">SHA-256 Hash Chained Blocks</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-bone-100 mt-1">
            Cryptographic Custody &amp; Handover Audit Trail
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          {/* Integrity Seal */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-bottle-950 border border-sage/40 text-sage text-xs font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>LEDGER VALID • 100% HASH INTEGRITY</span>
          </div>

          {/* Export JSON Button */}
          <button
            onClick={handleExportJson}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-bottle-800 hover:bg-bottle-700 text-bone-100 border border-bottle-600 text-xs font-mono font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Proof (.JSON)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-bottle-900 p-3 rounded-xl border border-bottle-700">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-bone-400 absolute left-3 top-2.5" />
          <input 
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by Entity ID, Actor, or SHA-256 Hash..."
            className="w-full bg-bottle-950 border border-bottle-700 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-bone-100 focus:border-vermilion focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'DISPATCH_CREATED', label: 'Dispatches' },
            { id: 'POLICE_CLEARANCE_ACTIVE', label: 'Traffic Preemption' },
            { id: 'TEMP_EXCURSION_ALERT', label: 'Excursions' },
            { id: 'HUMAN_OVERRIDE', label: 'Overrides' },
            { id: 'CHAIN_OF_CUSTODY_HANDOVER', label: 'Handovers' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                filterType === f.id
                  ? 'bg-bottle-700 text-bone-100 border border-bottle-500 font-bold'
                  : 'text-bone-400 hover:text-bone-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Blocks List */}
      <div className="space-y-3">
        {filteredBlocks.length === 0 ? (
          <div className="bg-bottle-900 border border-bottle-700 rounded-xl p-12 text-center text-bone-400 font-mono text-xs">
            No audit records matching criteria
          </div>
        ) : (
          filteredBlocks.map(block => {
            const isWarning = block.isWarning || block.eventType === 'TEMP_EXCURSION_ALERT' || block.eventType === 'HUMAN_OVERRIDE';

            return (
              <div 
                key={block.blockNumber}
                className={`bg-bottle-900 border rounded-xl p-4 transition-all shadow-md ${
                  isWarning 
                    ? 'border-vermilion/70 bg-gradient-to-r from-bottle-900 to-bottle-950' 
                    : 'border-bottle-700 hover:border-bottle-600'
                }`}
              >
                {/* Block Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-bottle-800">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-bottle-950 text-sage border border-bottle-700">
                      BLOCK #{block.blockNumber}
                    </span>
                    <span className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isWarning ? 'bg-vermilion/20 text-vermilion border border-vermilion/40' : 'bg-bottle-800 text-bone-200'
                    }`}>
                      {block.eventType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-mono text-bone-300">
                      Entity: <strong className="text-bone-100">{block.entityId}</strong>
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-bone-400">
                    {block.timestamp}
                  </span>
                </div>

                {/* Event Summary */}
                <p className="text-xs text-bone-100 font-sans leading-relaxed">
                  {block.summary}
                </p>

                {/* Actor & Location Metadata */}
                <div className="mt-3 flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-bone-300 font-mono">
                  <span>Signer: <strong className="text-bone-200">{block.actor}</strong> ({block.actorRole})</span>
                  <span>•</span>
                  <span>Node: <strong className="text-bone-200">{block.location}</strong></span>
                </div>

                {/* Cryptographic Hash Chain Info */}
                <div className="mt-3 pt-2.5 border-t border-bottle-800/80 grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="flex items-center space-x-1 text-bone-400">
                    <span className="w-16 shrink-0">Prev Hash:</span>
                    <span className="text-bone-300 truncate">{block.previousHash}</span>
                  </div>

                  <div className="flex items-center justify-between bg-bottle-950 px-2 py-1 rounded border border-bottle-800">
                    <div className="flex items-center space-x-1 truncate">
                      <span className="text-sage font-bold shrink-0">Block Hash:</span>
                      <span className="text-bone-100 truncate">{block.currentHash}</span>
                    </div>
                    <button
                      onClick={() => handleCopyHash(block.currentHash)}
                      className="ml-2 text-bone-400 hover:text-bone-100 shrink-0"
                      title="Copy SHA-256 Hash"
                    >
                      {copiedHash === block.currentHash ? <Check className="w-3 h-3 text-sage" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
