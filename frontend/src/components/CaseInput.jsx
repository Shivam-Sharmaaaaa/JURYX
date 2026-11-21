import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Trash2, 
  ChevronRight, 
  ShieldAlert, 
  BookOpen, 
  Scale, 
  HelpCircle,
  FileCheck,
  Building2,
  AlertTriangle
} from 'lucide-react';
import { PRESET_CASES } from '../data/cases';

export default function CaseInput({
  caseTitle,
  setCaseTitle,
  caseDescription,
  setCaseDescription,
  evidenceDefence,
  setEvidenceDefence,
  onStartDeliberation,
  onClear,
  isDeliberating,
  selectedPresetId,
  setSelectedPresetId,
  offlineDemoMode
}) {
  const [showHelper, setShowHelper] = useState(false);

  // Load a preset case
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setCaseTitle(preset.title);
    setCaseDescription(preset.description);
    setEvidenceDefence(`PROSECUTION EVIDENCE:\n${preset.evidence}\n\nDEFENCE PLEA & MITIGATION:\n${preset.defence}`);
  };

  // Build combined text for deliberation
  const isInputEmpty = !caseTitle.trim() && !caseDescription.trim() && !evidenceDefence.trim();

  return (
    <div className="bg-white rounded-2xl border border-[#E7E1D8] shadow-court p-6 sm:p-7 transition-all relative overflow-hidden">
      {/* Subtle top brass accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B08D57]/70 to-transparent" />

      {/* Header & Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#E7E1D8] gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3B2418] text-[#B08D57] flex items-center justify-center border border-[#B08D57]/40 shadow-xs">
              <FileCheck className="w-4.5 h-4.5 text-[#B08D57]" />
            </div>
            <h2 className="text-lg font-bold text-[#24160F] tracking-wide font-cinzel">
              Case Submission & Official Docket Entry
            </h2>
            <span className="text-[10px] font-semibold text-[#3B2418] bg-[#FAF9F6] border border-[#B08D57]/40 px-2 py-0.5 rounded font-cinzel tracking-wider">
              FORM 1-A
            </span>
          </div>
          <p className="text-xs text-[#78716C] mt-1 font-serif">
            Select a verified benchmark case or draft custom summary court proceedings for multi-agent advisory examination.
          </p>
        </div>

        {/* Preset Case Buttons (Selectable Legal Case Tabs) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider font-cinzel mr-1">
            Docket Presets:
          </span>
          {PRESET_CASES.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                disabled={isDeliberating}
                className={`text-xs px-3.5 py-1.5 rounded-lg border font-serif transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-[#3B2418] text-[#FAF9F6] border-[#B08D57] shadow-sm font-semibold ring-1 ring-[#B08D57]/60'
                    : 'bg-[#FAF9F6] text-[#292524] border-[#E7E1D8] hover:border-[#B08D57]/60 hover:bg-[#FAF9F6]/80'
                }`}
              >
                <span className="font-medium">{preset.tag.split('/')[0].trim()}</span>
                <span className={`text-[10px] ${isSelected ? 'text-[#B08D57]' : 'text-[#78716C]'}`}>
                  ({preset.category.split('/')[0].trim()})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Input Form */}
      <div className="mt-5 space-y-4">
        {/* Case Title Input */}
        <div>
          <label className="block text-xs font-bold text-[#3B2418] uppercase tracking-wider mb-1.5 font-cinzel">
            Case Title / Cause Title <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            value={caseTitle}
            onChange={(e) => {
              setCaseTitle(e.target.value);
              setSelectedPresetId(null);
            }}
            disabled={isDeliberating}
            placeholder="e.g., State vs. Ramesh Kumar (FIR No. 402/2024) or M/s ABC vs. XYZ"
            className="w-full px-4 py-2.5 text-sm bg-[#FAF9F6]/80 hover:bg-white focus:bg-white border border-[#E7E1D8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B08D57] focus:border-[#B08D57] transition-all placeholder:text-[#78716C]/60 text-[#292524] font-serif"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4.5">
          {/* Case Description / FIR Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#3B2418] uppercase tracking-wider font-cinzel">
                Case Description / Summary FIR <span className="text-red-700">*</span>
              </label>
              <span className="text-[11px] text-[#78716C] italic font-serif">
                Alleged Facts & Locus
              </span>
            </div>
            <textarea
              rows={5}
              value={caseDescription}
              onChange={(e) => {
                setCaseDescription(e.target.value);
                setSelectedPresetId(null);
              }}
              disabled={isDeliberating}
              placeholder="Enter factual summary of alleged offense, locus, time of apprehension, and primary complaint..."
              className="w-full p-3.5 text-xs sm:text-[13px] leading-relaxed bg-[#FAF9F6]/80 hover:bg-white focus:bg-white border border-[#E7E1D8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B08D57] focus:border-[#B08D57] transition-all placeholder:text-[#78716C]/60 text-[#292524] font-serif"
            />
          </div>

          {/* Evidence and Defence Details */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#3B2418] uppercase tracking-wider font-cinzel">
                Evidence & Defence Details <span className="text-red-700">*</span>
              </label>
              <span className="text-[11px] text-[#78716C] italic font-serif">
                Plea, Panchnama, Exhibits
              </span>
            </div>
            <textarea
              rows={5}
              value={evidenceDefence}
              onChange={(e) => {
                setEvidenceDefence(e.target.value);
                setSelectedPresetId(null);
              }}
              disabled={isDeliberating}
              placeholder="List prosecution exhibits (CCTV, witness memos, recovery panchnama) and defense arguments (mitigation, statutory exceptions, necessity)..."
              className="w-full p-3.5 text-xs sm:text-[13px] leading-relaxed bg-[#FAF9F6]/80 hover:bg-white focus:bg-white border border-[#E7E1D8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B08D57] focus:border-[#B08D57] transition-all placeholder:text-[#78716C]/60 text-[#292524] font-serif"
            />
          </div>
        </div>

        {/* Footer controls: Clear & Start Deliberation */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#E7E1D8] gap-3">
          <div className="flex items-center space-x-2 text-xs text-[#78716C] font-serif">
            {offlineDemoMode ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#24160F] text-[#B08D57] border border-[#B08D57]/40">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-[#B08D57]" />
                Offline Demo Precedents Active
              </span>
            ) : (
              <span className="inline-flex items-center text-[#78716C]">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mr-2 animate-pulse"></span>
                Connected to local judicial AI service
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {/* Secondary Button: Transparent background, brass outline, mahogany text */}
            <button
              type="button"
              onClick={onClear}
              disabled={isDeliberating || isInputEmpty}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-[#3B2418] bg-transparent border border-[#B08D57] rounded-xl hover:bg-[#B08D57]/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs font-cinzel tracking-wider"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5 text-[#B08D57]" />
              Clear Docket
            </button>

            {/* Primary Button: Mahogany background, parchment text, brass hover border, slight lift animation */}
            <button
              type="button"
              onClick={onStartDeliberation}
              disabled={isDeliberating || isInputEmpty}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold rounded-xl text-[#FAF9F6] border border-[#B08D57]/60 transition-all font-cinzel tracking-wider shadow-sm hover:shadow-courtLift hover:-translate-y-0.5 active:translate-y-0 ${
                isDeliberating || isInputEmpty
                  ? 'bg-[#78716C]/40 text-[#FAF9F6]/60 cursor-not-allowed border-transparent'
                  : 'bg-[#3B2418] hover:bg-[#24160F] hover:border-[#B08D57]'
              }`}
            >
              {isDeliberating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#B08D57]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Deliberating Bench...</span>
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4 mr-2 text-[#B08D57]" />
                  <span>Start Deliberation</span>
                  <ChevronRight className="w-4 h-4 ml-1 text-[#B08D57]" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
