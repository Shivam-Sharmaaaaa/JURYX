import React from 'react';
import JurorCard from './JurorCard';
import { JUROR_DEFINITIONS } from '../data/cases';

export default function JurorGrid({
  jurorStates = {},
  isDeliberating = false,
  activeJurorId = null
}) {
  return (
    <div className="space-y-4">
      {/* Header with simple dot status */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#111827]">
          AI Evaluation Bench
        </h3>
        <div className="flex items-center gap-2 text-xs text-[#4B5563]">
          <span className={`w-2 h-2 rounded-full ${isDeliberating ? 'bg-[#1F2A44] animate-pulse' : 'bg-[#9CA3AF]'}`} />
          <span>{isDeliberating ? 'Active Deliberation' : '4 Evaluators Empanelled'}</span>
        </div>
      </div>

      {/* Grid of 4 clean cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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
    </div>
  );
}
