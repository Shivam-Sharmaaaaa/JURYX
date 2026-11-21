import React from 'react';

export default function JurorCard({
  juror,
  currentVote,
  confidence = 0,
  citedLaw,
  status = 'Waiting', // 'Waiting' | 'Analysing' | 'Completed'
  isDeliberating = false,
  highlighted = false
}) {
  const isGuilty = currentVote === 'GUILTY';
  const isNotGuilty = currentVote === 'NOT_GUILTY' || currentVote === 'NOT GUILTY';
  const hasVoted = isGuilty || isNotGuilty;

  return (
    <div className={`bg-[#FFFFFF] border rounded-[8px] p-4 flex flex-col justify-between transition-colors ${
      highlighted
        ? 'border-[#1F2A44] ring-1 ring-[#1F2A44]'
        : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
    }`}>
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
          <h4 className="text-sm font-semibold text-[#111827]">
            {juror.name}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-[#4B5563]">
            <span className={`w-1.5 h-1.5 rounded-full ${
              status === 'Completed' ? 'bg-[#16A34A]' :
              status === 'Analysing' ? 'bg-[#1F2A44] animate-pulse' : 'bg-[#D1D5DB]'
            }`} />
            <span className="text-[11px]">{status}</span>
          </div>
        </div>

        <p className="text-xs text-[#4B5563] mt-2.5 line-clamp-2 leading-relaxed">
          {juror.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#E5E7EB] space-y-2 text-xs">
        {/* Vote label */}
        <div className="flex items-center justify-between">
          <span className="text-[#4B5563]">Vote</span>
          {hasVoted ? (
            <span className={`px-2 py-0.5 rounded-[4px] text-[11px] font-medium ${
              isGuilty
                ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]'
                : 'bg-[#F0FDF4] text-[#16A34A] border border-[#86EFAC]'
            }`}>
              {isGuilty ? 'Guilty' : 'Not Guilty'}
            </span>
          ) : (
            <span className="text-[#9CA3AF] italic">Pending</span>
          )}
        </div>

        {/* Confidence metric */}
        <div className="flex items-center justify-between">
          <span className="text-[#4B5563]">Confidence</span>
          <span className="font-mono text-[#111827] font-medium">
            {hasVoted ? `${confidence}%` : '—'}
          </span>
        </div>

        {/* Cited Law */}
        <div className="pt-1 text-[11px] truncate" title={citedLaw || ''}>
          <span className="text-[#4B5563]">Statute: </span>
          <span className="text-[#111827]">
            {citedLaw ? citedLaw : <span className="text-[#9CA3AF] italic">None</span>}
          </span>
        </div>
      </div>
    </div>
  );
}
