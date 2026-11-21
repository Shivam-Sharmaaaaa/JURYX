import React from 'react';
import JurorCard from './JurorCard';
import { JUROR_DEFINITIONS } from '../data/cases';
import { Users } from 'lucide-react';

export default function JurorGrid({
  jurorStates = {},
  isDeliberating = false,
  activeJurorId = null
}) {
  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between pb-2 border-b border-[#E7E1D8]">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded bg-[#3B2418] text-[#B08D57] flex items-center justify-center border border-[#B08D57]/40 shadow-xs">
            <Users className="w-3.5 h-3.5 text-[#B08D57]" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#24160F] font-cinzel">
            Bench Composition — Four AI Judicial Evaluators
          </h2>
        </div>
        <span className="text-xs text-[#78716C] italic font-serif hidden sm:inline">
          Independent cross-disciplinary evaluation for summary proceedings
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        {JUROR_DEFINITIONS.map((juror) => {
          const state = jurorStates[juror.id] || {};
          return (
            <JurorCard
              key={juror.id}
              juror={juror}
              currentVote={state.vote}
              confidence={state.confidence}
              citedLaw={state.citedLaw}
              status={state.status || 'Waiting'}
              isDeliberating={isDeliberating}
              highlighted={activeJurorId === juror.id}
            />
          );
        })}
      </div>
    </section>
  );
}
