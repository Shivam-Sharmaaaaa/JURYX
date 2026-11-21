import React from 'react';
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
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setCaseTitle(preset.title);
    setCaseDescription(preset.description);
    setEvidenceDefence(`PROSECUTION EVIDENCE:\n${preset.evidence}\n\nDEFENCE PLEA & MITIGATION:\n${preset.defence}`);
  };

  const isInputEmpty = !caseTitle.trim() && !caseDescription.trim() && !evidenceDefence.trim();

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-5 sm:p-6 space-y-5">
      {/* Top Header & Presets */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-[#111827]">
              Case Docket
            </h2>
            <p className="text-xs text-[#4B5563] mt-0.5">
              Select a benchmark case or enter custom facts and evidence below.
            </p>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_CASES.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  disabled={isDeliberating}
                  className={`text-xs px-3 py-1.5 rounded-[8px] border transition-colors ${
                    isSelected
                      ? 'bg-[#1F2A44] text-white border-[#1F2A44] font-medium'
                      : 'bg-[#FFFFFF] text-[#4B5563] border-[#E5E7EB] hover:border-[#D1D5DB] hover:text-[#111827]'
                  }`}
                >
                  {preset.category.split('/')[0].trim()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4 pt-1 border-t border-[#E5E7EB]">
        <div>
          <label className="block text-xs font-medium text-[#111827] mb-1.5">
            Case Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={caseTitle}
            onChange={(e) => {
              setCaseTitle(e.target.value);
              setSelectedPresetId(null);
            }}
            disabled={isDeliberating}
            placeholder="e.g. State vs. Ramesh Kumar"
            className="w-full px-3 py-2 text-sm bg-white border border-[#E5E7EB] rounded-[8px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1F2A44] focus:ring-1 focus:ring-[#1F2A44] transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#111827] mb-1.5">
              FIR / Complaint Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={caseDescription}
              onChange={(e) => {
                setCaseDescription(e.target.value);
                setSelectedPresetId(null);
              }}
              disabled={isDeliberating}
              placeholder="Enter factual summary of alleged offense..."
              className="w-full p-3 text-xs sm:text-sm bg-white border border-[#E5E7EB] rounded-[8px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1F2A44] focus:ring-1 focus:ring-[#1F2A44] transition-colors resize-y leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#111827] mb-1.5">
              Evidence & Defence Details <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={evidenceDefence}
              onChange={(e) => {
                setEvidenceDefence(e.target.value);
                setSelectedPresetId(null);
              }}
              disabled={isDeliberating}
              placeholder="List prosecution evidence and defense arguments..."
              className="w-full p-3 text-xs sm:text-sm bg-white border border-[#E5E7EB] rounded-[8px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1F2A44] focus:ring-1 focus:ring-[#1F2A44] transition-colors resize-y leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E5E7EB]">
        <div className="text-xs text-[#4B5563]">
          {offlineDemoMode ? (
            <span className="text-[#B45309] font-medium">Offline Demo Mode Active</span>
          ) : (
            <span>Connected to AI backend</span>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onClear}
            disabled={isDeliberating || isInputEmpty}
            className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-medium text-[#4B5563] bg-white border border-[#E5E7EB] rounded-[8px] hover:border-[#D1D5DB] hover:text-[#111827] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={onStartDeliberation}
            disabled={isDeliberating || isInputEmpty}
            className="flex-1 sm:flex-none px-5 py-2 text-xs font-medium text-white bg-[#1F2A44] hover:bg-[#2B3A5C] rounded-[8px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeliberating ? 'Deliberating...' : 'Start Deliberation'}
          </button>
        </div>
      </div>
    </div>
  );
}
