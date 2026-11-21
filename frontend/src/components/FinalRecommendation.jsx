import React from 'react';
import { 
  Award, 
  ShieldAlert, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  FileSearch, 
  HelpCircle,
  Gavel,
  ChevronRight
} from 'lucide-react';

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
  const isHung = consensus === 'HUNG_BENCH';

  // Extract key arguments from final round statements
  const r2Statements = rounds.find(r => r.round === 2)?.statements || [];
  const prosecutionArgs = r2Statements.filter(s => s.vote === 'GUILTY');
  const defenceArgs = r2Statements.filter(s => s.vote === 'NOT_GUILTY' || s.vote === 'NOT GUILTY');

  return (
    <div className="bg-white rounded-2xl border-2 border-[#B08D57]/50 shadow-courtElevated p-6 sm:p-8 relative overflow-hidden transition-all">
      {/* Top ornamental brass line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#3B2418] via-[#B08D57] to-[#3B2418]" />

      {/* Official Stamp Warning Banner */}
      <div className="bg-[#FAF9F6] border-2 border-[#B08D57] rounded-xl p-4 mb-6 flex items-start space-x-3.5 shadow-2xs relative">
        <div className="w-8 h-8 rounded-lg bg-[#3B2418] border border-[#B08D57]/60 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldAlert className="w-4.5 h-4.5 text-[#B08D57]" />
        </div>
        <div className="text-xs text-[#24160F] leading-relaxed">
          <span className="font-bold uppercase tracking-wider block text-[11px] text-[#3B2418] mb-1 font-cinzel">
            AI-GENERATED ADVISORY RECOMMENDATION — NOT A COURT JUDGMENT
          </span>
          <p className="text-[#78716C] font-serif text-[13px]">
            {advisory_notice || "This advisory synthesis is produced by multi-agent natural language models for judicial decision support. A human magistrate retains sovereign and sole adjudicatory authority under Article 235 of the Constitution of India and Criminal Procedure Code."}
          </p>
        </div>
      </div>

      {/* Main Header & Consensus Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-[#E7E1D8] gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#3B2418] to-[#24160F] border border-[#B08D57] flex items-center justify-center text-[#B08D57] shadow-sm">
              <Gavel className="w-6 h-6 text-[#B08D57]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#24160F] font-cinzel tracking-wide">
                Consensus Advisory Verdict
              </h2>
              <p className="text-xs text-[#78716C] font-serif italic mt-0.5">
                Synthesized from 4 autonomous legal evaluation agents
              </p>
            </div>
          </div>
        </div>

        {/* Verdict Badge & Time */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-xs text-[#78716C] bg-[#FAF9F6] border border-[#E7E1D8] px-3.5 py-2 rounded-xl font-mono">
            <Clock className="w-3.5 h-3.5 text-[#B08D57]" />
            <span>Deliberation Time: {(deliberation_time_ms / 1000).toFixed(2)}s</span>
          </div>

          <div className={`px-5 py-2 rounded-xl border text-sm font-bold tracking-wider flex items-center space-x-2 shadow-xs font-cinzel ${
            isGuilty 
              ? 'bg-red-50 text-[#B91C1C] border-red-300' 
              : isNotGuilty 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                : 'bg-amber-50 text-amber-900 border-amber-300'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${
              isGuilty ? 'bg-[#B91C1C]' : isNotGuilty ? 'bg-emerald-600' : 'bg-amber-600'
            }`} />
            <span>
              {isGuilty && 'ADVISORY: GUILTY / CONVICT'}
              {isNotGuilty && 'ADVISORY: NOT GUILTY / ACQUIT'}
              {isHung && 'ADVISORY: HUNG BENCH (REFER TO CHIEF MAGISTRATE)'}
            </span>
            <span className="text-xs font-normal opacity-80 pl-1.5 border-l border-current">
              ({tally.guilty}G — {tally.not_guilty}NG)
            </span>
          </div>
        </div>
      </div>

      {/* Disagreement / Dissent Synthesis */}
      <div className="mt-6 bg-[#FAF9F6] border border-[#E7E1D8] rounded-xl p-4.5">
        <div className="flex items-center space-x-2.5 mb-2">
          <Scale className="w-4 h-4 text-[#B08D57]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#3B2418] font-cinzel">
            Juror Disagreement & Dissent Analysis
          </h3>
        </div>
        <p className="text-xs sm:text-[13.5px] text-[#292524] leading-relaxed font-serif">
          {juror_disagreement}
        </p>
      </div>

      {/* Key Arguments From Both Sides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 mt-5">
        {/* Prosecution / Guilt Arguments */}
        <div className="bg-red-50/30 rounded-xl border border-red-200/80 p-4.5">
          <div className="flex items-center justify-between pb-2 border-b border-red-200/60 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B91C1C] flex items-center font-cinzel">
              <span className="w-2 h-2 rounded-full bg-[#B91C1C] mr-2" />
              Key Arguments Supporting Guilt ({prosecutionArgs.length})
            </span>
          </div>
          {prosecutionArgs.length > 0 ? (
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#292524] font-serif">
              {prosecutionArgs.map((arg, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="font-bold text-[#B91C1C] shrink-0 text-[11px] font-cinzel mt-0.5">
                    [{arg.juror_name.split(' ')[1] || arg.juror_name}]:
                  </span>
                  <span className="text-[#292524] leading-relaxed">
                    {arg.argument}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#78716C] italic font-serif">
              No juror supported conviction in final round.
            </p>
          )}
        </div>

        {/* Defence / Innocence Arguments */}
        <div className="bg-emerald-50/30 rounded-xl border border-emerald-200/80 p-4.5">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center font-cinzel">
              <span className="w-2 h-2 rounded-full bg-emerald-600 mr-2" />
              Key Arguments Supporting Acquittal / Mitigation ({defenceArgs.length})
            </span>
          </div>
          {defenceArgs.length > 0 ? (
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#292524] font-serif">
              {defenceArgs.map((arg, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="font-bold text-emerald-800 shrink-0 text-[11px] font-cinzel mt-0.5">
                    [{arg.juror_name.split(' ')[1] || arg.juror_name}]:
                  </span>
                  <span className="text-[#292524] leading-relaxed">
                    {arg.argument}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#78716C] italic font-serif">
              No juror supported acquittal in final round.
            </p>
          )}
        </div>
      </div>

      {/* Important Evidence Gaps (Identified by Skeptic/Analyst) */}
      {evidence_gaps && evidence_gaps.length > 0 && (
        <div className="mt-5 bg-[#FAF9F6] border border-[#B08D57]/40 rounded-xl p-4.5">
          <div className="flex items-center space-x-2 mb-2">
            <FileSearch className="w-4 h-4 text-[#B08D57]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3B2418] font-cinzel">
              Critical Evidentiary Deficiencies Flagged for Judicial Inquiry
            </h4>
          </div>
          <ul className="space-y-2 text-xs sm:text-[13px] text-[#292524] font-serif">
            {evidence_gaps.map((gap, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-[#B08D57] font-bold">•</span>
                <span className="leading-relaxed">{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fast link to Magistrate Review Panel */}
      {onProceedToReview && (
        <div className="mt-6 pt-4 border-t border-[#E7E1D8] flex items-center justify-end">
          <button
            onClick={onProceedToReview}
            className="inline-flex items-center px-5 py-2.5 text-xs font-bold text-[#3B2418] bg-[#FAF9F6] hover:bg-[#B08D57]/15 border border-[#B08D57] rounded-xl transition-all shadow-2xs font-cinzel tracking-wider hover:-translate-y-0.5"
          >
            <span>Proceed to Magistrate Review & Order Recording</span>
            <ChevronRight className="w-4 h-4 ml-2 text-[#B08D57]" />
          </button>
        </div>
      )}
    </div>
  );
}
