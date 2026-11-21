import React from 'react';

export default function LoadingState({ message = "Convening AI Judicial Evaluators in Chamber..." }) {
  return (
    <div className="p-8 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] text-center space-y-3">
      <div className="w-8 h-8 rounded-full border-2 border-[#1F2A44] border-t-transparent animate-spin mx-auto" />
      <h3 className="text-sm font-semibold text-[#111827]">
        {message}
      </h3>
      <p className="text-xs text-[#4B5563]">
        The four evaluators are analyzing facts, intent, Indian statutes, and evidence gaps.
      </p>
    </div>
  );
}
