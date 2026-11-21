import React from 'react';
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

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-5 sm:p-6 space-y-5">
      {/* Header & Consensus Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E7EB]">
        <div>
          <h3 className="text-base font-semibold text-[#111827]">
            Vote Analytics
          </h3>
          <p className="text-xs text-[#4B5563] mt-0.5">
            Bench tally: {guiltyCount} Guilty, {notGuiltyCount} Not Guilty
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#4B5563]">Consensus:</span>
          <span className={`px-2.5 py-0.5 rounded-[4px] text-xs font-medium border ${
            consensus === 'GUILTY' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' :
            consensus === 'NOT_GUILTY' ? 'bg-[#F0FDF4] text-[#16A34A] border-[#86EFAC]' :
            'bg-[#F7F7F8] text-[#111827] border-[#E5E7EB]'
          }`}>
            {consensus || 'Pending'}
          </span>
        </div>
      </div>

      {/* Distribution bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-[#4B5563]">
          <span className="text-[#DC2626] font-medium">Guilty ({guiltyPercent}%)</span>
          <span className="text-[#16A34A] font-medium">Not Guilty ({notGuiltyPercent}%)</span>
        </div>
        <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden flex border border-[#E5E7EB]">
          <div 
            className="bg-[#DC2626] transition-all duration-500"
            style={{ width: `${guiltyPercent}%` }}
          />
          <div 
            className="bg-[#16A34A] transition-all duration-500"
            style={{ width: `${notGuiltyPercent}%` }}
          />
        </div>
      </div>

      {/* Shift comparison grid */}
      <div className="pt-2">
        <h4 className="text-xs font-medium text-[#111827] mb-2.5">
          Deliberation Shifts (Round 1 → Round 2)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {jurorShifts.map(({ juror, round1Vote, round2Vote, shifted }) => {
            const isR1Guilty = round1Vote === 'GUILTY';
            const isR2Guilty = round2Vote === 'GUILTY';

            return (
              <div 
                key={juror.id}
                className="p-3 bg-[#F7F7F8] border border-[#E5E7EB] rounded-[8px] text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#111827]">{juror.name}</span>
                  {shifted && (
                    <span className="text-[10px] text-[#B45309] font-medium">Shifted</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#4B5563]">
                  <span>{round1Vote === 'PENDING' ? '—' : isR1Guilty ? 'Guilty' : 'Not Guilty'}</span>
                  <span>→</span>
                  <span className="font-medium text-[#111827]">
                    {round2Vote === 'PENDING' ? '—' : isR2Guilty ? 'Guilty' : 'Not Guilty'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
