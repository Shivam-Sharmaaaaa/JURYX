import React, { useState } from 'react';
import { SAMPLE_CASES } from './cases';

export default function App() {
  const [selectedCase, setSelectedCase] = useState(SAMPLE_CASES[0]);
  const [deliberationData, setDeliberationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeRound, setActiveRound] = useState('round_1');

  // Trigger deliberation (calls backend or fallback)
  const handleDeliberate = async (useFallback = false) => {
    setLoading(true);
    try {
      const url = useFallback ? '/api/deliberate?fallback=true' : '/api/deliberate';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedCase)
      });
      const data = await response.json();
      setDeliberationData(data);
    } catch (err) {
      console.warn("Backend unavailable, loading local fallback structure", err);
      // TODO (Teammate 4 & 5): Handle error display and retry
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-400">
            JX
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">JuryX</h1>
            <p className="text-xs text-slate-400">AI Advisory Jury Panel for Indian Summary Offences</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Hackathon Scaffold v0.1
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Case Selector & Facts */}
        <section className="lg:col-span-4 flex flex-col space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Select Summary Case
            </h2>
            <div className="space-y-2">
              {SAMPLE_CASES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCase(c); setDeliberationData(null); }}
                  className={`w-full text-left p-3 rounded-lg border transition text-sm ${
                    selectedCase.id === c.id
                      ? 'border-amber-500/50 bg-amber-500/10 text-white font-medium'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-300'
                  }`}
                >
                  <div className="text-xs text-amber-400 font-mono mb-0.5">{c.id}</div>
                  <div className="line-clamp-1">{c.title}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Case Brief
            </h2>
            <div className="text-xs text-slate-400 font-mono mb-2">{selectedCase.statute}</div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {selectedCase.facts}
            </p>
            
            <div className="pt-3 border-t border-slate-800">
              <h3 className="text-xs font-semibold text-slate-400 mb-2">Advisory Focus:</h3>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {selectedCase.questions_for_jury.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => handleDeliberate(false)}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-sm transition disabled:opacity-50"
              >
                {loading ? "Deliberating..." : "Start 3-Round Deliberation"}
              </button>
              <button
                onClick={() => handleDeliberate(true)}
                disabled={loading}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition"
              >
                Load Instant Demo (Fallback)
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: 3-Round Deliberation Panel */}
        <section className="lg:col-span-8 flex flex-col space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm min-h-[500px] flex flex-col">
            
            {/* Round Navigation Tabs */}
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-4">
              <button
                onClick={() => setActiveRound('round_1')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeRound === 'round_1'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Round 1: Initial Stances (4 Jurors)
              </button>
              <button
                onClick={() => setActiveRound('round_2')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeRound === 'round_2'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Round 2: Rebuttal & Cross-Examination
              </button>
              <button
                onClick={() => setActiveRound('round_3')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeRound === 'round_3'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Round 3: Advisory Verdict (Lead Jurist)
              </button>
            </div>

            {/* Deliberation Content View */}
            {!deliberationData ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-xl mb-3">
                  ⚖
                </div>
                <h3 className="text-sm font-semibold text-slate-300">Awaiting Deliberation</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Click "Start 3-Round Deliberation" or "Load Instant Demo" to see the Analyst, Empath, Jurist, Skeptic, and Lead Jurist in action.
                </p>
              </div>
            ) : (
              <div className="flex-1 space-y-4">
                {activeRound === 'round_1' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* TODO (Teammate 4 & 5): Enhance Juror card components */}
                    {deliberationData.round_1_initial?.map((juror) => (
                      <div key={juror.juror_id} className="p-4 rounded-lg bg-slate-950/60 border border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm text-amber-300">{juror.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {juror.stance}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{juror.opinion}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeRound === 'round_2' && (
                  <div className="space-y-3">
                    {/* TODO (Teammate 4 & 5): Rebuttal dialogue thread layout */}
                    {deliberationData.round_2_rebuttal?.map((juror) => (
                      <div key={juror.juror_id} className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                        <span className="font-semibold text-xs text-amber-400 block mb-1">{juror.name}</span>
                        <p className="text-xs text-slate-300">{juror.opinion}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeRound === 'round_3' && deliberationData.round_3_synthesis && (
                  <div className="p-5 rounded-lg bg-amber-950/20 border border-amber-600/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                        {deliberationData.round_3_synthesis.lead_jurist} Advisory Summary
                      </span>
                      <span className="text-xs text-slate-400">
                        {deliberationData.round_3_synthesis.consensus_level}
                      </span>
                    </div>
                    <div className="text-base font-semibold text-white">
                      {deliberationData.round_3_synthesis.advisory_verdict}
                    </div>
                    <div className="text-xs text-slate-300 bg-slate-950/50 p-3 rounded border border-slate-800">
                      <strong className="text-slate-200">Statutory Reference: </strong>
                      {deliberationData.round_3_synthesis.statutory_reference}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {deliberationData.round_3_synthesis.rationale}
                    </p>
                    <div className="text-xs text-amber-200 font-medium bg-amber-900/30 p-2.5 rounded border border-amber-700/40">
                      Recommended Remedy: {deliberationData.round_3_synthesis.recommended_remedy}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
