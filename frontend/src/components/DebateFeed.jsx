import React, { useEffect, useRef } from 'react';

export default function DebateFeed({
  rounds = [],
  visibleStatementCount = 0,
  onSkipAnimation,
  isAnimating = false,
  isDeliberating = false
}) {
  const feedEndRef = useRef(null);

  const allStatements = [];
  rounds.forEach((roundObj) => {
    (roundObj.statements || []).forEach((stmt) => {
      allStatements.push({
        ...stmt,
        round: roundObj.round || 1,
        statementIndex: allStatements.length + 1
      });
    });
  });

  const visibleStatements = allStatements.slice(0, visibleStatementCount);

  useEffect(() => {
    if (isAnimating && feedEndRef.current) {
      feedEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [visibleStatementCount, isAnimating]);

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
        <div>
          <h3 className="text-base font-semibold text-[#111827]">
            Courtroom Deliberation Feed
          </h3>
          <p className="text-xs text-[#4B5563] mt-0.5">
            Two-round debate between the four AI evaluators.
          </p>
        </div>

        {isAnimating && (
          <button
            onClick={onSkipAnimation}
            className="text-xs font-medium text-[#1F2A44] hover:underline"
          >
            Skip animation
          </button>
        )}
      </div>

      {/* Feed list */}
      <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
        {allStatements.length === 0 && !isDeliberating && (
          <div className="py-10 text-center text-xs text-[#9CA3AF] border border-dashed border-[#E5E7EB] rounded-[8px]">
            No deliberation yet. Click "Start Deliberation" to begin.
          </div>
        )}

        {visibleStatements.map((stmt, index) => {
          const isGuilty = stmt.vote === 'GUILTY';
          const isFirstOfRound2 = stmt.round === 2 && (index === 0 || visibleStatements[index - 1]?.round === 1);

          return (
            <React.Fragment key={`${stmt.round}-${stmt.juror_id}-${stmt.statementIndex}`}>
              {isFirstOfRound2 && (
                <div className="py-2.5 flex items-center gap-3">
                  <div className="h-px bg-[#E5E7EB] flex-1" />
                  <span className="text-xs font-semibold text-[#1F2A44] px-2.5 py-0.5 rounded border border-[#E5E7EB] bg-[#F7F7F8]">
                    Round 2: Rebuttals & Reconsideration
                  </span>
                  <div className="h-px bg-[#E5E7EB] flex-1" />
                </div>
              )}

              <div className="p-4 rounded-[8px] border border-[#E5E7EB] bg-[#FFFFFF] space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#111827]">
                      {stmt.juror_name}
                    </span>
                    <span className="text-[#9CA3AF]">·</span>
                    <span className="text-[#4B5563]">Round {stmt.round}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#4B5563] font-mono">{stmt.confidence}% conf.</span>
                    <span className={`px-2 py-0.5 rounded-[4px] text-[11px] font-medium ${
                      isGuilty 
                        ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]' 
                        : 'bg-[#F0FDF4] text-[#16A34A] border border-[#86EFAC]'
                    }`}>
                      {isGuilty ? 'Guilty' : 'Not Guilty'}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                  {stmt.argument}
                </p>

                {stmt.cited_law && (
                  <div className="text-[11px] text-[#111827] pt-1">
                    <span className="text-[#4B5563] font-medium">Cited provision: </span>
                    <span>{stmt.cited_law}</span>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}

        {isAnimating && (
          <div className="py-2 text-center text-xs text-[#4B5563] animate-pulse">
            Evaluators deliberating next statement...
          </div>
        )}

        <div ref={feedEndRef} />
      </div>
    </div>
  );
}
