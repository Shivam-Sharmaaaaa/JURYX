import React from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Scale, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  GitCommit,
  Check,
  X
} from 'lucide-react';
import { JUROR_DEFINITIONS } from '../data/cases';

export default function VoteAnalytics({
  tally = { guilty: 0, not_guilty: 0 },
  consensus = '',
  rounds = []
}) {
  const totalJurors = (tally.guilty || 0) + (tally.not_guilty || 0) || 4;
  const guiltyCount = tally.guilty || 0;
  const notGuiltyCount = tally.not_guilty || 0;

  const guiltyPercent = Math.round((guiltyCount / totalJurors) * 100);
  const notGuiltyPercent = 100 - guiltyPercent;

  // Extract initial (Round 1) vs final (Round 2) votes per juror
  const r1Statements = rounds.find(r => r.round === 1)?.statements || [];
  const r2Statements = rounds.find(r => r.round === 2)?.statements || [];

  const jurorShifts = JUROR_DEFINITIONS.map(juror => {
    const s1 = r1Statements.find(s => s.juror_id === juror.id);
    const s2 = r2Statements.find(s => s.juror_id === juror.id) || s1;
    
    const v1 = s1 ? (s1.vote || 'UNKNOWN') : 'PENDING';
    const v2 = s2 ? (s2.vote || 'UNKNOWN') : v1;
    const c1 = s1 ? s1.confidence : 0;
    const c2 = s2 ? s2.confidence : c1;

    const shifted = v1 !== 'PENDING' && v2 !== 'PENDING' && v1 !== v2;

    return {
      juror,
      round1Vote: v1,
      round2Vote: v2,
      round1Confidence: c1,
      round2Confidence: c2,
      shifted
    };
  });

  // Consensus badge styling
  const getConsensusBadge = () => {
    if (consensus === 'GUILTY') {
      return (
        <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-[#B91C1C] border border-red-300 shadow-2xs font-cinzel tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#B91C1C] mr-2 animate-pulse" />
          RECOMMEND CONVICTION (GUILTY)
        </span>
      );
    }
    if (consensus === 'NOT_GUILTY' || consensus === 'NOT GUILTY') {
      return (
        <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs font-cinzel tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-600 mr-2 animate-pulse" />
          RECOMMEND ACQUITTAL (NOT GUILTY)
        </span>
      );
    }
    if (consensus === 'HUNG_BENCH') {
      return (
        <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs font-cinzel tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
          HUNG BENCH (TIED VOTE)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#FAF9F6] text-[#78716C] border border-[#E7E1D8] font-cinzel tracking-wider">
        DELIBERATION IN PROGRESS
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E7E1D8] shadow-court p-6 sm:p-7 transition-all relative overflow-hidden">
      {/* Top brass divider accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B08D57]/70 to-transparent" />

      {/* Title & Consensus Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E7E1D8] gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3B2418] text-[#B08D57] flex items-center justify-center border border-[#B08D57]/40 shadow-xs">
              <BarChart2 className="w-4.5 h-4.5 text-[#B08D57]" />
            </div>
            <h2 className="text-base font-bold text-[#24160F] tracking-wide font-cinzel">
              Bench Vote Analytics & Alignment
            </h2>
          </div>
          <p className="text-xs text-[#78716C] mt-1 font-serif">
            Statistical consensus breakdown across initial and rebuttal rounds.
          </p>
        </div>
        <div>
          {getConsensusBadge()}
        </div>
      </div>

      {/* Numerical Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-5">
        {/* Total Jurors */}
        <div className="bg-[#FAF9F6] rounded-xl p-3.5 border border-[#E7E1D8]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block mb-0.5 font-cinzel">
            Total Jurors
          </span>
          <span className="text-2xl font-bold font-mono text-[#24160F]">
            {totalJurors}
          </span>
          <span className="text-[11px] text-[#78716C] block mt-0.5 font-serif italic">
            Full Multi-Agent Bench
          </span>
        </div>

        {/* Guilty Votes */}
        <div className="bg-red-50/60 rounded-xl p-3.5 border border-red-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B91C1C] block mb-0.5 font-cinzel">
            Guilty Votes
          </span>
          <span className="text-2xl font-bold font-mono text-[#B91C1C]">
            {guiltyCount}
          </span>
          <span className="text-[11px] text-[#B91C1C]/80 block mt-0.5 font-serif">
            {guiltyPercent}% of Bench
          </span>
        </div>

        {/* Not Guilty Votes */}
        <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-0.5 font-cinzel">
            Not Guilty Votes
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-800">
            {notGuiltyCount}
          </span>
          <span className="text-[11px] text-emerald-700 block mt-0.5 font-serif">
            {notGuiltyPercent}% of Bench
          </span>
        </div>

        {/* Final Consensus */}
        <div className="bg-[#FAF9F6] rounded-xl p-3.5 border border-[#E7E1D8]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block mb-0.5 font-cinzel">
            Consensus Finding
          </span>
          <span className="text-sm font-bold font-cinzel text-[#24160F] truncate block mt-1">
            {consensus || 'Pending'}
          </span>
          <span className="text-[11px] text-[#78716C] block mt-0.5 font-mono">
            {guiltyCount}G | {notGuiltyCount}NG
          </span>
        </div>
      </div>

      {/* Horizontal Animated Vote Distribution Bar */}
      <div className="mt-6 pt-4 border-t border-[#E7E1D8]">
        <div className="flex items-center justify-between text-xs font-semibold mb-2 font-serif">
          <span className="text-[#B91C1C] flex items-center font-medium">
            <span className="w-2 h-2 rounded-full bg-[#B91C1C] mr-1.5" />
            Guilty: {guiltyCount} ({guiltyPercent}%)
          </span>
          <span className="text-[#78716C] uppercase text-[10px] tracking-widest font-cinzel">
            Bench Split
          </span>
          <span className="text-emerald-800 flex items-center font-medium">
            Not Guilty: {notGuiltyCount} ({notGuiltyPercent}%)
            <span className="w-2 h-2 rounded-full bg-emerald-600 ml-1.5" />
          </span>
        </div>

        {/* Dual Color Horizontal Bar */}
        <div className="w-full h-3 bg-[#FAF9F6] border border-[#E7E1D8] rounded-full overflow-hidden flex shadow-inner">
          <div
            className="bg-[#B91C1C] transition-all duration-700 ease-out"
            style={{ width: `${guiltyPercent}%` }}
            title={`Guilty: ${guiltyPercent}%`}
          />
          <div
            className="bg-emerald-600 transition-all duration-700 ease-out"
            style={{ width: `${notGuiltyPercent}%` }}
            title={`Not Guilty: ${notGuiltyPercent}%`}
          />
        </div>
      </div>

      {/* Initial vs Final Vote Comparison (Round 1 -> Round 2 Shift Table) */}
      <div className="mt-6 pt-4 border-t border-[#E7E1D8]">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#3B2418] flex items-center space-x-2 font-cinzel">
            <TrendingUp className="w-4 h-4 text-[#B08D57]" />
            <span>Deliberation Shift: Round 1 (Initial) vs Round 2 (Rebuttal)</span>
          </h3>
          <span className="text-xs text-[#78716C] font-serif italic">
            Tracks individual position changes post-cross-examination
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {jurorShifts.map(({ juror, round1Vote, round2Vote, round1Confidence, round2Confidence, shifted }) => {
            const isR1Guilty = round1Vote === 'GUILTY';
            const isR2Guilty = round2Vote === 'GUILTY';

            return (
              <div 
                key={juror.id}
                className={`p-3.5 rounded-xl border text-xs transition-all ${
                  shifted
                    ? 'bg-[#FAF9F6] border-[#B08D57] ring-1 ring-[#B08D57]/50 shadow-xs'
                    : 'bg-[#FAF9F6] border-[#E7E1D8]'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#E7E1D8] mb-2.5">
                  <span className="font-bold text-[#24160F] font-cinzel">{juror.name}</span>
                  {shifted ? (
                    <span className="text-[10px] font-bold text-[#3B2418] bg-[#B08D57]/20 border border-[#B08D57]/60 px-1.5 py-0.5 rounded uppercase font-cinzel">
                      Shifted Vote
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#78716C] uppercase font-mono">
                      Consistent
                    </span>
                  )}
                </div>

                {/* Transition flow */}
                <div className="flex items-center justify-between font-mono text-[11px]">
                  {/* Round 1 */}
                  <div className="text-center">
                    <span className="text-[9px] uppercase tracking-wider text-[#78716C] block font-cinzel">
                      R1 Initial
                    </span>
                    <span className={`inline-block px-1.5 py-0.5 rounded font-bold text-[10px] font-cinzel ${
                      isR1Guilty ? 'bg-red-50 text-[#B91C1C] border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    }`}>
                      {round1Vote === 'PENDING' ? '—' : (isR1Guilty ? 'GUILTY' : 'NOT GUILTY')}
                    </span>
                    <span className="block text-[10px] text-[#78716C] mt-0.5">
                      {round1Confidence ? `${round1Confidence}%` : ''}
                    </span>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-[#B08D57] mx-1" />

                  {/* Round 2 */}
                  <div className="text-center">
                    <span className="text-[9px] uppercase tracking-wider text-[#78716C] block font-cinzel">
                      R2 Final
                    </span>
                    <span className={`inline-block px-1.5 py-0.5 rounded font-bold text-[10px] font-cinzel ${
                      isR2Guilty ? 'bg-red-50 text-[#B91C1C] border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    }`}>
                      {round2Vote === 'PENDING' ? '—' : (isR2Guilty ? 'GUILTY' : 'NOT GUILTY')}
                    </span>
                    <span className="block text-[10px] text-[#78716C] mt-0.5">
                      {round2Confidence ? `${round2Confidence}%` : ''}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
