import React, { useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Search, 
  HeartHandshake, 
  Scale, 
  ShieldAlert, 
  ArrowRight, 
  BookMarked, 
  Sparkles,
  FastForward,
  Play,
  RotateCcw,
  CheckCircle,
  Clock
} from 'lucide-react';
import { JUROR_DEFINITIONS } from '../data/cases';

const JUROR_ICONS = {
  analyst: Search,
  empath: HeartHandshake,
  jurist: Scale,
  skeptic: ShieldAlert
};

export default function DebateFeed({
  rounds = [],
  visibleStatementCount = 0,
  onSkipAnimation,
  isAnimating = false,
  isDeliberating = false
}) {
  const feedEndRef = useRef(null);

  // Collect all statements across rounds with their parent round
  const allStatements = [];
  rounds.forEach((roundObj) => {
    (roundObj.statements || []).forEach((stmt, idx) => {
      allStatements.push({
        ...stmt,
        round: roundObj.round || 1,
        statementIndex: allStatements.length + 1
      });
    });
  });

  const visibleStatements = allStatements.slice(0, visibleStatementCount);

  // Auto-scroll to latest visible statement during deliberation animation
  useEffect(() => {
    if (isAnimating && feedEndRef.current) {
      feedEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [visibleStatementCount, isAnimating]);

  if (rounds.length === 0 && !isDeliberating) {
    return (
      <div className="bg-white rounded-2xl border border-[#E7E1D8] shadow-court p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B08D57]/60 to-transparent" />
        <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#E7E1D8] flex items-center justify-center text-[#B08D57] mx-auto mb-3 shadow-xs">
          <MessageSquare className="w-6 h-6 text-[#B08D57]" />
        </div>
        <h3 className="text-base font-bold text-[#24160F] font-cinzel">
          Courtroom Deliberation Chamber
        </h3>
        <p className="text-xs text-[#78716C] max-w-md mx-auto mt-1 font-serif">
          Submit a case docket above to convene the 4 AI jurors. The two-round cross-examination transcript will unfold here in real time.
        </p>
      </div>
    );
  }

  // Group visible statements by round for clear separation
  const round1Statements = visibleStatements.filter(s => s.round === 1);
  const round2Statements = visibleStatements.filter(s => s.round === 2);

  const renderStatementCard = (stmt) => {
    const jurorDef = JUROR_DEFINITIONS.find(j => j.id === stmt.juror_id) || {
      name: stmt.juror_name,
      avatarBg: 'bg-[#3B2418] text-[#B08D57]',
      badgeBg: 'bg-[#FAF9F6] text-[#292524]'
    };
    const IconComponent = JUROR_ICONS[stmt.juror_id] || Scale;
    const isGuilty = stmt.vote === 'GUILTY';

    return (
      <div
        key={`${stmt.round}-${stmt.juror_id}-${stmt.statementIndex}`}
        className="animate-statement-in bg-white rounded-xl border border-[#E7E1D8] shadow-xs hover:border-[#B08D57]/70 transition-all p-4.5 mb-3.5 relative overflow-hidden group"
      >
        {/* Left accent strip */}
        <div 
          className={`absolute left-0 top-0 bottom-0 w-1.5 ${
            isGuilty ? 'bg-[#B91C1C]' : 'bg-emerald-600'
          }`} 
        />

        {/* Card Header: Juror info + Vote badge + Confidence */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#E7E1D8]/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B2418] to-[#24160F] border border-[#B08D57]/40 flex items-center justify-center font-bold text-xs text-[#B08D57] shadow-xs">
              <IconComponent className="w-4 h-4 text-[#B08D57]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#24160F] tracking-wide font-cinzel">
                  {stmt.juror_name || jurorDef.name}
                </span>
                <span className="text-[11px] text-[#78716C] font-serif italic hidden sm:inline">
                  • {stmt.role || jurorDef.role}
                </span>
              </div>
              <span className="text-[11px] text-[#78716C] font-serif italic sm:hidden">
                {stmt.role || jurorDef.role}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Round & Sequence pill */}
            <span className="text-[10px] font-mono text-[#78716C] bg-[#FAF9F6] border border-[#E7E1D8] px-2 py-0.5 rounded">
              ENTRY #{stmt.statementIndex}
            </span>

            {/* Confidence */}
            <span className="text-[11px] font-mono font-semibold text-[#24160F] bg-[#FAF9F6] border border-[#E7E1D8] px-2 py-0.5 rounded">
              {stmt.confidence}% conf.
            </span>

            {/* Vote Badge */}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider font-cinzel ${
              isGuilty
                ? 'bg-red-50 text-[#B91C1C] border border-red-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isGuilty ? 'bg-[#B91C1C]' : 'bg-emerald-600'}`} />
              {isGuilty ? 'GUILTY' : 'NOT GUILTY'}
            </span>
          </div>
        </div>

        {/* Argument Text (Transcript prose) */}
        <div className="pt-3 pb-2 text-xs sm:text-[13.5px] leading-relaxed text-[#292524] font-serif">
          {stmt.argument}
        </div>

        {/* Cited Law Box */}
        {stmt.cited_law && (
          <div className="mt-2.5 pt-2 border-t border-[#E7E1D8]/60 flex items-start space-x-2 text-[11px] bg-[#FAF9F6] p-2.5 rounded-lg border border-[#E7E1D8]">
            <BookMarked className="w-3.5 h-3.5 text-[#B08D57] shrink-0 mt-0.5" />
            <div className="text-[#24160F] leading-snug font-serif">
              <span className="font-bold text-[#3B2418] uppercase text-[10px] mr-1.5 font-cinzel tracking-wider">
                Statute / Precedent Cited:
              </span>
              <span className="font-medium text-[#292524]">{stmt.cited_law}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E7E1D8] shadow-court p-6 sm:p-7 transition-all relative overflow-hidden">
      {/* Subtle top brass accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B08D57]/70 to-transparent" />

      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E7E1D8] gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#B08D57] animate-pulse" />
            <h2 className="text-base font-bold text-[#24160F] tracking-wide font-cinzel">
              Courtroom Deliberation Transcript
            </h2>
            <span className="text-[10px] font-mono text-[#3B2418] bg-[#FAF9F6] border border-[#B08D57]/40 px-2.5 py-0.5 rounded font-cinzel font-semibold">
              {visibleStatements.length} / {allStatements.length} STATEMENTS RECORDED
            </span>
          </div>
          <p className="text-xs text-[#78716C] mt-1 font-serif">
            Sequential multi-agent cross-examination across two formal debate rounds.
          </p>
        </div>

        {/* Animation & Fast Forward Controls */}
        <div className="flex items-center space-x-2">
          {isAnimating && (
            <button
              onClick={onSkipAnimation}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-[#3B2418] bg-[#FAF9F6] hover:bg-[#B08D57]/10 border border-[#B08D57] rounded-lg transition-colors shadow-2xs font-cinzel tracking-wider"
            >
              <FastForward className="w-3.5 h-3.5 mr-1 text-[#B08D57]" />
              Skip to Full Transcript
            </button>
          )}
          {!isAnimating && visibleStatements.length === allStatements.length && allStatements.length > 0 && (
            <span className="inline-flex items-center text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-300 font-cinzel tracking-wider">
              <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
              Deliberation Complete
            </span>
          )}
        </div>
      </div>

      {/* Feed Body */}
      <div className="mt-5 space-y-6">
        {/* ROUND 1 */}
        {round1Statements.length > 0 && (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="px-3.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-[#3B2418] text-[#FAF9F6] border border-[#B08D57]/50 shadow-2xs font-cinzel">
                Round 1: Initial Legal & Factual Assessment
              </div>
              <div className="h-px bg-[#B08D57]/40 flex-1" />
              <span className="text-xs text-[#78716C] font-serif italic">
                Independent Findings
              </span>
            </div>
            <div>
              {round1Statements.map(renderStatementCard)}
            </div>
          </div>
        )}

        {/* ROUND 2 DIVIDER (Subtle brass separator) */}
        {round2Statements.length > 0 && (
          <div className="pt-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="px-3.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-[#24160F] text-[#B08D57] border border-[#B08D57] shadow-2xs flex items-center space-x-1.5 font-cinzel">
                <Sparkles className="w-3.5 h-3.5 text-[#B08D57]" />
                <span>Round 2: Cross-Deliberation & Rebuttals</span>
              </div>
              <div className="h-px bg-[#B08D57]/40 flex-1" />
              <span className="text-xs text-[#3B2418] font-serif italic font-medium">
                Jurors scrutinize peer arguments
              </span>
            </div>
            <div>
              {round2Statements.map(renderStatementCard)}
            </div>
          </div>
        )}

        {/* In-progress spinner while waiting for next statement */}
        {isAnimating && (
          <div className="flex items-center justify-center py-4 text-xs text-[#78716C] space-x-2 bg-[#FAF9F6] rounded-xl border border-dashed border-[#B08D57]/50 font-serif">
            <div className="w-2 h-2 rounded-full bg-[#B08D57] animate-ping" />
            <span>Jurors reviewing arguments in deliberation chamber...</span>
          </div>
        )}

        <div ref={feedEndRef} />
      </div>
    </div>
  );
}
