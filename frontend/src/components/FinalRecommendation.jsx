import React from 'react';

export default function FinalRecommendation({
  deliberationData,
  onProceedToReview
}) {
  if (!deliberationData) return null;

  const {
    consensus,
    tally = { guilty: 0, not_guilty: 0 },
    evidence_gaps = [],
    juror_disagreement,
    deliberation_time_ms = 2100,
    advisory_notice,
    rounds = []
  } = deliberationData;

  const isGuilty = consensus === 'GUILTY';
  const isNotGuilty = consensus === 'NOT_GUILTY' || consensus === 'NOT GUILTY';

  const r2Statements = rounds.find(r => r.round === 2)?.statements || [];
  const prosecutionArgs = r2Statements.filter(s => s.vote === 'GUILTY');
  const defenceArgs = r2Statements.filter(s => s.vote === 'NOT_GUILTY' || s.vote === 'NOT GUILTY');

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-5 sm:p-6 space-y-5">
      {/* Official Advisory Banner */}
      <div className="p-3 bg-[#F7F7F8] border border-[#E5E7EB] rounded-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-[#111827]">
          AI-GENERATED ADVISORY RECOMMENDATION — NOT A COURT JUDGMENT
        </span>
        <span className="text-[#4B5563]">
          Deliberation time: {(deliberation_time_ms / 1000).toFixed(2)}s
        </span>
      </div>

      {/* Advisory finding */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#4B5563]">Consensus Finding:</span>
          <span className={`px-3 py-1 rounded-[4px] text-sm font-semibold border ${
            isGuilty ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' :
            isNotGuilty ? 'bg-[#F0FDF4] text-[#16A34A] border-[#86EFAC]' :
            'bg-[#F7F7F8] text-[#111827] border-[#E5E7EB]'
          }`}>
            {isGuilty ? 'Recommend Conviction (Guilty)' : isNotGuilty ? 'Recommend Acquittal (Not Guilty)' : consensus}
          </span>
          <span className="text-xs text-[#4B5563]">({tally.guilty} Guilty / {tally.not_guilty} Not Guilty)</span>
        </div>

        <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed pt-1">
          {juror_disagreement || 'The bench has reached a formal recommendation. Human magistrate retains final authority.'}
        </p>
      </div>

      {/* Key Arguments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-3.5 bg-[#F7F7F8] border border-[#E5E7EB] rounded-[8px] space-y-2">
          <h4 className="text-xs font-semibold text-[#111827]">
            Arguments Supporting Guilt ({prosecutionArgs.length})
          </h4>
          <ul className="text-xs text-[#4B5563] space-y-1.5 list-disc list-inside">
            {prosecutionArgs.map((a, i) => (
              <li key={i}>
                <span className="font-medium text-[#111827]">{a.juror_name}: </span>
                {a.argument}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3.5 bg-[#F7F7F8] border border-[#E5E7EB] rounded-[8px] space-y-2">
          <h4 className="text-xs font-semibold text-[#111827]">
            Arguments Supporting Acquittal / Mitigation ({defenceArgs.length})
          </h4>
          <ul className="text-xs text-[#4B5563] space-y-1.5 list-disc list-inside">
            {defenceArgs.map((a, i) => (
              <li key={i}>
                <span className="font-medium text-[#111827]">{a.juror_name}: </span>
                {a.argument}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Evidence gaps */}
      {evidence_gaps && evidence_gaps.length > 0 && (
        <div className="p-3.5 bg-[#F7F7F8] border border-[#E5E7EB] rounded-[8px] space-y-1.5">
          <h4 className="text-xs font-semibold text-[#111827]">
            Important Evidentiary Deficiencies Flagged
          </h4>
          <ul className="text-xs text-[#4B5563] space-y-1 list-disc list-inside">
            {evidence_gaps.map((gap, idx) => (
              <li key={idx}>{gap}</li>
            ))}
          </ul>
        </div>
      )}

      {onProceedToReview && (
        <div className="flex justify-end pt-2 border-t border-[#E5E7EB]">
          <button
            onClick={onProceedToReview}
            className="px-4 py-2 text-xs font-medium text-white bg-[#1F2A44] hover:bg-[#2B3A5C] rounded-[8px] transition-colors"
          >
            Proceed to Magistrate Review →
          </button>
        </div>
      )}
    </div>
  );
}
