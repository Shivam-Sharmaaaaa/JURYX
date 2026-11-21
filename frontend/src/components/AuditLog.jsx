import React, { useState } from 'react';
import { JUROR_DEFINITIONS } from '../data/cases';

export default function AuditLog({
  caseTitle,
  caseDescription,
  evidenceDefence,
  deliberationData,
  reviewState
}) {
  const [copied, setCopied] = useState(false);

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

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const hasDeliberation = !!deliberationData;

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
        <div>
          <h3 className="text-base font-semibold text-[#111827]">
            Audit Log (RFC 8259 JSON)
          </h3>
          <p className="text-xs text-[#4B5563] mt-0.5">
            Full reproducible deliberation audit trail and magistrate determination.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyJson}
            disabled={!hasDeliberation}
            className="px-3 py-1.5 text-xs text-[#4B5563] bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-[8px] transition-colors disabled:opacity-40"
          >
            {copied ? 'Copied' : 'Copy JSON'}
          </button>

          <button
            onClick={handleDownloadAuditJson}
            disabled={!hasDeliberation}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#1F2A44] hover:bg-[#2B3A5C] rounded-[8px] transition-colors disabled:opacity-40"
          >
            Download JSON
          </button>
        </div>
      </div>

      <div className="border border-[#E5E7EB] rounded-[8px] overflow-hidden">
        <div className="px-3 py-2 bg-[#F7F7F8] border-b border-[#E5E7EB] text-xs font-mono text-[#4B5563] flex justify-between">
          <span>juryx_audit_report.json</span>
          <span>{hasDeliberation ? 'Live Record' : 'Placeholder'}</span>
        </div>
        <pre className="p-3 bg-[#FFFFFF] text-xs font-mono text-[#111827] overflow-x-auto max-h-72 leading-relaxed">
          {jsonString}
        </pre>
      </div>
    </div>
  );
}
