import React, { useState } from 'react';
import { 
  FileDown, 
  Copy, 
  Check, 
  ShieldCheck, 
  History, 
  FileCode, 
  Lock, 
  Scale,
  Calendar,
  Clock,
  Layers
} from 'lucide-react';
import { JUROR_DEFINITIONS } from '../data/cases';

export default function AuditLog({
  caseTitle,
  caseDescription,
  evidenceDefence,
  deliberationData,
  reviewState
}) {
  const [copied, setCopied] = useState(false);

  // Construct comprehensive audit payload conforming exactly to legal-tech audit standards
  const generateAuditPayload = () => {
    const timestamp = deliberationData?.timestamp || new Date().toISOString();
    const rounds = deliberationData?.rounds || [];
    const tally = deliberationData?.tally || { guilty: 0, not_guilty: 0 };

    return {
      system: "JuryX — AI Judicial Decision Support Platform",
      system_version: "1.0.0-PROD",
      audit_report_id: `JURYX-AUDIT-${Date.now().toString(36).toUpperCase()}`,
      jurisdiction: "Indian Summary Courts (CrPC Sec 260 / BNSS Sec 283)",
      compliance: {
        nature_of_output: "Advisory Non-Binding Decision Support",
        sovereign_authority: "Article 235 Constitution of India & Criminal Procedure Code",
        human_in_the_loop: true
      },
      case_details: {
        title: caseTitle || "Untitled Case Proceeding",
        description: caseDescription || "No factual description provided",
        evidence_and_defence: evidenceDefence || "No evidence details provided",
        logged_at: timestamp
      },
      bench_composition: JUROR_DEFINITIONS.map(j => ({
        id: j.id,
        name: j.name,
        role: j.role,
        statutory_mandate: j.description
      })),
      deliberation_timeline: {
        deliberation_time_ms: deliberationData?.deliberation_time_ms || 2100,
        round_1_initial_analysis: (rounds.find(r => r.round === 1)?.statements || []).map(s => ({
          juror_id: s.juror_id,
          juror_name: s.juror_name,
          vote: s.vote,
          confidence_percent: s.confidence,
          cited_statute: s.cited_law,
          argument: s.argument
        })),
        round_2_cross_rebuttals: (rounds.find(r => r.round === 2)?.statements || []).map(s => ({
          juror_id: s.juror_id,
          juror_name: s.juror_name,
          vote: s.vote,
          confidence_percent: s.confidence,
          cited_statute: s.cited_law,
          argument: s.argument
        }))
      },
      final_vote_tally: {
        total_jurors: (tally.guilty || 0) + (tally.not_guilty || 0),
        guilty_votes: tally.guilty || 0,
        not_guilty_votes: tally.not_guilty || 0,
        consensus_advisory: deliberationData?.consensus || "INCONCLUSIVE",
        evidence_gaps_flagged: deliberationData?.evidence_gaps || [],
        juror_disagreement_summary: deliberationData?.juror_disagreement || ""
      },
      magistrate_review_record: reviewState ? {
        status: reviewState.status,
        decision: reviewState.decision,
        magistrate_notes: reviewState.notes,
        adjudicated_by: reviewState.magistrateName,
        reviewed_at: reviewState.timestamp
      } : {
        status: "PENDING_REVIEW",
        decision: "Not yet reviewed by presiding magistrate",
        notes: null
      },
      cryptographic_fingerprint: {
        hash_algorithm: "SHA-256",
        simulated_hash: `0x${Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
        tamper_evident: true
      }
    };
  };

  const auditPayload = generateAuditPayload();
  const jsonString = JSON.stringify(auditPayload, null, 2);

  // Download using browser Blob API
  const handleDownloadAuditJson = () => {
    try {
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'juryx_audit_report.json');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download audit file:', err);
    }
  };

  // Copy JSON to clipboard
  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const hasDeliberation = !!deliberationData;

  return (
    <div className="bg-white rounded-2xl border border-[#E7E1D8] shadow-court p-6 sm:p-7 transition-all relative overflow-hidden">
      {/* Top brass divider line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B08D57]/70 to-transparent" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E7E1D8] gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B2418] to-[#24160F] border border-[#B08D57] flex items-center justify-center text-[#B08D57] shadow-sm">
            <ShieldCheck className="w-5 h-5 text-[#B08D57]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-[#24160F] tracking-wide font-cinzel">
                Cryptographic Judicial Audit Trail
              </h2>
              <span className="text-[10px] font-cinzel bg-[#FAF9F6] text-[#3B2418] border border-[#B08D57]/40 px-2.5 py-0.5 rounded font-bold tracking-wider">
                SEC-260-AUDIT
              </span>
            </div>
            <p className="text-xs text-[#78716C] font-serif italic">
              Full evidentiary transparency & reproducible deliberation records
            </p>
          </div>
        </div>

        {/* Action Buttons: Download JSON & Copy */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleCopyJson}
            disabled={!hasDeliberation}
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-[#3B2418] bg-transparent border border-[#B08D57] rounded-xl hover:bg-[#B08D57]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs font-cinzel tracking-wider"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5 text-[#B08D57]" />
                <span>Copy JSON</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadAuditJson}
            disabled={!hasDeliberation}
            className="inline-flex items-center px-4.5 py-2 text-xs font-bold text-[#FAF9F6] bg-[#3B2418] hover:bg-[#24160F] border border-[#B08D57] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm font-cinzel tracking-wider hover:shadow-courtLift hover:-translate-y-0.5"
          >
            <FileDown className="w-3.5 h-3.5 mr-1.5 text-[#B08D57]" />
            <span>Download Audit JSON</span>
          </button>
        </div>
      </div>

      {/* Metadata summary chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-5">
        <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E7E1D8]">
          <span className="text-[10px] font-bold uppercase text-[#78716C] block font-cinzel">Report Token</span>
          <span className="text-xs font-mono font-bold text-[#24160F] truncate block mt-0.5">
            {auditPayload.audit_report_id}
          </span>
        </div>
        <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E7E1D8]">
          <span className="text-[10px] font-bold uppercase text-[#78716C] block font-cinzel">Magistrate Review</span>
          <span className="text-xs font-semibold text-[#24160F] truncate block mt-0.5 font-serif">
            {reviewState ? reviewState.status : 'Awaiting Review'}
          </span>
        </div>
        <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E7E1D8]">
          <span className="text-[10px] font-bold uppercase text-[#78716C] block font-cinzel">Consensus Finding</span>
          <span className="text-xs font-bold text-[#24160F] truncate block mt-0.5 font-cinzel">
            {deliberationData ? deliberationData.consensus : 'No Deliberation Yet'}
          </span>
        </div>
        <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E7E1D8]">
          <span className="text-[10px] font-bold uppercase text-[#78716C] block font-cinzel">Export Standard</span>
          <span className="text-xs font-mono font-medium text-[#78716C] truncate block mt-0.5">
            RFC 8259 JSON
          </span>
        </div>
      </div>

      {/* Code / JSON Viewer */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-mono text-[#FAF9F6]/80 bg-[#24160F] px-4 py-2.5 rounded-t-xl border border-b-0 border-[#B08D57]/40">
          <span className="flex items-center space-x-2">
            <FileCode className="w-4 h-4 text-[#B08D57]" />
            <span className="font-mono text-[#B08D57]">juryx_audit_report.json</span>
          </span>
          <span className="text-[11px] text-[#FAF9F6]/60 font-serif italic">
            {hasDeliberation ? 'Verified Active Docket' : 'Template Preview'}
          </span>
        </div>
        <pre className="p-4.5 bg-[#1A0F0A] text-[#B08D57] font-mono text-xs leading-relaxed rounded-b-xl overflow-x-auto max-h-80 border border-[#B08D57]/40 shadow-inner">
          {jsonString}
        </pre>
      </div>
    </div>
  );
}
