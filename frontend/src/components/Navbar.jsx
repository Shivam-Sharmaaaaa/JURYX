import React from 'react';
import { Scale, ShieldAlert, Sparkles, Wifi, WifiOff, FileText, LayoutDashboard, History } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  offlineDemoMode, 
  setOfflineDemoMode,
  isDeliberating
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#3B2418] border-b border-[#B08D57]/60 shadow-courtElevated transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-17 py-1">
          {/* Brand & Subtitle */}
          <div className="flex items-center space-x-4">
            <div 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center space-x-3.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#24160F] to-[#1A0F0A] border border-[#B08D57]/50 flex items-center justify-center text-[#B08D57] shadow-sm group-hover:border-[#B08D57] group-hover:scale-105 transition-all">
                <Scale className="w-5 h-5 text-[#B08D57]" />
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl font-bold tracking-wider text-[#FAF9F6] font-cinzel">
                    JURY<span className="text-[#B08D57]">X</span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded border border-[#B08D57]/40 bg-[#24160F] text-[#B08D57] tracking-widest font-cinzel">
                    BENCH v1.0
                  </span>
                </div>
                <p className="text-[12px] text-[#FAF9F6]/70 font-serif tracking-wide italic">
                  AI-Powered Judicial Decision Support
                </p>
              </div>
            </div>

            {/* Statutory & Advisory Badges */}
            <div className="hidden lg:flex items-center space-x-2.5 pl-4 border-l border-[#B08D57]/30">
              <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-semibold bg-[#24160F]/80 text-[#FAF9F6]/85 border border-[#B08D57]/30 tracking-widest font-cinzel">
                SUMMARY OFFENCES ONLY
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-semibold bg-[#24160F]/80 text-[#B08D57] border border-[#B08D57]/40 tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-[#B08D57]" />
                ADVISORY ONLY — NOT BINDING
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-[#24160F]/80 p-1 rounded-xl border border-[#B08D57]/30 shadow-inner">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-cinzel tracking-wider transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#3B2418] text-[#B08D57] border border-[#B08D57]/60 shadow-sm font-semibold'
                  : 'text-[#FAF9F6]/75 hover:text-[#FAF9F6] hover:bg-[#3B2418]/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#B08D57]" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('cases')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-cinzel tracking-wider transition-all ${
                activeTab === 'cases'
                  ? 'bg-[#3B2418] text-[#B08D57] border border-[#B08D57]/60 shadow-sm font-semibold'
                  : 'text-[#FAF9F6]/75 hover:text-[#FAF9F6] hover:bg-[#3B2418]/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#B08D57]" />
              <span>Cases</span>
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-cinzel tracking-wider transition-all ${
                activeTab === 'audit'
                  ? 'bg-[#3B2418] text-[#B08D57] border border-[#B08D57]/60 shadow-sm font-semibold'
                  : 'text-[#FAF9F6]/75 hover:text-[#FAF9F6] hover:bg-[#3B2418]/60'
              }`}
            >
              <History className="w-3.5 h-3.5 text-[#B08D57]" />
              <span>Audit Logs</span>
            </button>
          </nav>

          {/* Right Action: Offline Demo Mode Toggle */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2.5 bg-[#24160F] border border-[#B08D57]/40 px-3 py-1.5 rounded-xl shadow-inner">
              <div className="flex items-center space-x-1.5 text-xs text-[#FAF9F6]/80 font-serif">
                {offlineDemoMode ? (
                  <WifiOff className="w-3.5 h-3.5 text-[#B08D57]" />
                ) : (
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span className="hidden sm:inline tracking-wide">Offline Demo Mode</span>
                <span className="sm:hidden">Demo</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={offlineDemoMode}
                disabled={isDeliberating}
                onClick={() => setOfflineDemoMode(prev => !prev)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-[#B08D57]/40 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-[#B08D57] ${
                  isDeliberating ? 'opacity-50 cursor-not-allowed' : ''
                } ${offlineDemoMode ? 'bg-[#B08D57]' : 'bg-[#3B2418]'}`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#FAF9F6] shadow-sm ring-0 transition duration-200 ease-in-out ${
                    offlineDemoMode ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-[#B08D57]/25 text-xs">
          <div className="flex space-x-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1 rounded font-cinzel ${activeTab === 'dashboard' ? 'bg-[#24160F] text-[#B08D57] border border-[#B08D57]/50 font-semibold' : 'text-[#FAF9F6]/70'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('cases')}
              className={`px-3 py-1 rounded font-cinzel ${activeTab === 'cases' ? 'bg-[#24160F] text-[#B08D57] border border-[#B08D57]/50 font-semibold' : 'text-[#FAF9F6]/70'}`}
            >
              Cases
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1 rounded font-cinzel ${activeTab === 'audit' ? 'bg-[#24160F] text-[#B08D57] border border-[#B08D57]/50 font-semibold' : 'text-[#FAF9F6]/70'}`}
            >
              Audit Logs
            </button>
          </div>
          <span className="text-[10px] font-cinzel text-[#B08D57] uppercase tracking-wider">
            Summary Courts
          </span>
        </div>
      </div>
    </header>
  );
}
