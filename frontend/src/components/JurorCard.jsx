import React from 'react';
import { 
  Search, 
  HeartHandshake, 
  Scale, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

const JUROR_ICONS = {
  analyst: Search,
  empath: HeartHandshake,
  jurist: Scale,
  skeptic: ShieldAlert
};

export default function JurorCard({
  juror,
  currentVote,
  confidence = 0,
  citedLaw,
  status = 'Waiting', // 'Waiting' | 'Analysing' | 'Completed'
  isDeliberating = false,
  highlighted = false
}) {
  const IconComponent = JUROR_ICONS[juror.id] || Scale;

  // Formatting vote display
  const isGuilty = currentVote === 'GUILTY';
  const isNotGuilty = currentVote === 'NOT_GUILTY' || currentVote === 'NOT GUILTY';
  const hasVoted = isGuilty || isNotGuilty;

  // Status badge config
  const getStatusBadge = () => {
    if (status === 'Analysing') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF9F6] text-[#B08D57] border border-[#B08D57]/60 font-cinzel tracking-wider animate-pulse">
          <Clock className="w-2.5 h-2.5 mr-1 text-[#B08D57] animate-spin" />
          Analysing
        </span>
      );
    }
    if (status === 'Completed') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 font-cinzel tracking-wider">
          <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-emerald-700" />
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#FAF9F6] text-[#78716C] border border-[#E7E1D8] font-cinzel tracking-wider">
        <Clock className="w-2.5 h-2.5 mr-1" />
        Waiting
      </span>
    );
  };

  return (
    <div className={`relative bg-white rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between shadow-court hover:shadow-courtElevated overflow-hidden ${
      highlighted ? 'border-[#B08D57] ring-1 ring-[#B08D57]/70' : 'border-[#E7E1D8]'
    }`}>
      {/* Thin brass top border accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B08D57]/80 to-transparent" />

      {/* Header with Juror identity and status */}
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* Mahogany icon tile with brass touch */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B2418] to-[#24160F] border border-[#B08D57]/50 flex items-center justify-center font-bold text-sm shadow-xs text-[#B08D57]">
              <IconComponent className="w-5 h-5 text-[#B08D57]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#24160F] tracking-wide font-cinzel flex items-center space-x-1.5">
                <span>{juror.name}</span>
              </h3>
              <p className="text-[11px] text-[#78716C] font-serif italic">
                {juror.role}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Focus description */}
        <p className="mt-3.5 text-xs text-[#292524]/80 font-serif leading-relaxed border-t border-[#E7E1D8] pt-2.5">
          {juror.description}
        </p>
      </div>

      {/* Vote & Confidence details */}
      <div className="mt-4 pt-3 border-t border-[#E7E1D8] space-y-2.5">
        {/* Vote pill */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] font-cinzel">
            Current Vote:
          </span>
          {hasVoted ? (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider font-cinzel ${
              isGuilty 
                ? 'bg-red-50 text-[#B91C1C] border border-red-200' 
                : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isGuilty ? 'bg-[#B91C1C]' : 'bg-emerald-600'}`}></span>
              {isGuilty ? 'GUILTY' : 'NOT GUILTY'}
            </span>
          ) : (
            <span className="text-xs text-[#78716C] italic font-serif">
              Pending Deliberation
            </span>
          )}
        </div>

        {/* Confidence Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1 font-serif">
            <span className="text-[#78716C]">Confidence Metric</span>
            <span className="font-mono font-bold text-[#24160F]">
              {hasVoted ? `${confidence}%` : '—'}
            </span>
          </div>
          <div className="w-full bg-[#FAF9F6] border border-[#E7E1D8] rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                !hasVoted 
                  ? 'w-0' 
                  : isGuilty 
                    ? 'bg-[#B91C1C]' 
                    : 'bg-emerald-600'
              }`}
              style={{ width: hasVoted ? `${confidence}%` : '0%' }}
            />
          </div>
        </div>

        {/* Cited Indian Law */}
        <div className="pt-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] mb-0.5 font-cinzel">
            Statutory Citation:
          </div>
          <div className="text-[11px] text-[#24160F] bg-[#FAF9F6] rounded-lg p-2 border border-[#E7E1D8] truncate font-serif" title={citedLaw || 'Pending citation'}>
            {citedLaw ? (
              <span className="font-medium text-[#292524]">{citedLaw}</span>
            ) : (
              <span className="text-[#78716C] italic">Provision will appear during debate</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
