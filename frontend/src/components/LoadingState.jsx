import React from 'react';
import { Scale, Search, HeartHandshake, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

export default function LoadingState({ message = "Convening AI Judicial Evaluators..." }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E7E1D8] shadow-court p-10 sm:p-12 text-center transition-all relative overflow-hidden">
      {/* Top brass divider line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B08D57]/70 to-transparent" />

      <div className="relative w-16 h-16 mx-auto mb-5">
        {/* Outer pulsating ring */}
        <div className="absolute inset-0 rounded-2xl bg-[#B08D57]/20 animate-ping opacity-60" />
        {/* Core emblem */}
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B2418] to-[#24160F] border border-[#B08D57] flex items-center justify-center text-[#B08D57] shadow-md">
          <Scale className="w-8 h-8 text-[#B08D57] animate-pulse" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-[#24160F] tracking-wide font-cinzel">
        {message}
      </h3>
      <p className="text-xs text-[#78716C] max-w-md mx-auto mt-1 font-serif leading-relaxed">
        Formulating multi-agent legal queries across IPC/BNS, CrPC/BNSS, Evidence Act, and appellate precedents.
      </p>

      {/* Juror progress indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-xl mx-auto mt-6">
        <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E1D8] flex items-center space-x-2.5 text-left">
          <Search className="w-4 h-4 text-[#B08D57] animate-spin" />
          <div>
            <span className="text-[10px] font-bold text-[#24160F] block uppercase font-cinzel">Analyst</span>
            <span className="text-[11px] text-[#78716C] font-serif">Verifying timeline</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E1D8] flex items-center space-x-2.5 text-left">
          <HeartHandshake className="w-4 h-4 text-[#B08D57] animate-pulse" />
          <div>
            <span className="text-[10px] font-bold text-[#24160F] block uppercase font-cinzel">Empath</span>
            <span className="text-[11px] text-[#78716C] font-serif">Examining intent</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E1D8] flex items-center space-x-2.5 text-left">
          <Scale className="w-4 h-4 text-[#B08D57] animate-bounce" />
          <div>
            <span className="text-[10px] font-bold text-[#24160F] block uppercase font-cinzel">Jurist</span>
            <span className="text-[11px] text-[#78716C] font-serif">Citing Indian law</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E1D8] flex items-center space-x-2.5 text-left">
          <ShieldAlert className="w-4 h-4 text-[#B08D57] animate-pulse" />
          <div>
            <span className="text-[10px] font-bold text-[#24160F] block uppercase font-cinzel">Skeptic</span>
            <span className="text-[11px] text-[#78716C] font-serif">Auditing gaps</span>
          </div>
        </div>
      </div>
    </div>
  );
}
