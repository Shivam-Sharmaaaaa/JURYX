import React from 'react';
import { Scale } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  offlineDemoMode, 
  setOfflineDemoMode,
  isDeliberating
}) {
  return (
    <header className="w-full bg-[#FFFFFF] border-b border-[#E5E7EB] sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Clean wordmark with minimal scale icon */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Scale className="w-5 h-5 text-[#1F2A44]" />
            <span className="font-semibold text-base text-[#111827] tracking-tight">
              JuryX
            </span>
          </div>

          <span className="text-xs px-2 py-0.5 rounded border border-[#E5E7EB] text-[#4B5563] bg-[#F7F7F8] hidden sm:inline-block">
            Summary Courts · Advisory
          </span>
        </div>

        {/* Right: Text navigation links and Demo Mode Toggle */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-5 text-sm">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`transition-colors ${
                activeTab === 'dashboard'
                  ? 'text-[#1F2A44] font-semibold'
                  : 'text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('cases')}
              className={`transition-colors ${
                activeTab === 'cases'
                  ? 'text-[#1F2A44] font-semibold'
                  : 'text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              Cases
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`transition-colors ${
                activeTab === 'audit'
                  ? 'text-[#1F2A44] font-semibold'
                  : 'text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              Audit Logs
            </button>
          </nav>

          <div className="h-4 w-px bg-[#E5E7EB] hidden sm:block" />

          {/* Offline demo toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#4B5563] hidden md:inline">Demo Mode</span>
            <button
              type="button"
              role="switch"
              aria-checked={offlineDemoMode}
              disabled={isDeliberating}
              onClick={() => setOfflineDemoMode(prev => !prev)}
              className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1F2A44] focus:ring-offset-1 ${
                isDeliberating ? 'opacity-50 cursor-not-allowed' : ''
              } ${offlineDemoMode ? 'bg-[#1F2A44]' : 'bg-[#E5E7EB]'}`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  offlineDemoMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
