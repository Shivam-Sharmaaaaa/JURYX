import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import CaseInput from './components/CaseInput';
import JurorGrid from './components/JurorGrid';
import DebateFeed from './components/DebateFeed';
import VoteAnalytics from './components/VoteAnalytics';
import FinalRecommendation from './components/FinalRecommendation';
import MagistrateReview from './components/MagistrateReview';
import AuditLog from './components/AuditLog';
import LoadingState from './components/LoadingState';
import { PRESET_CASES, JUROR_DEFINITIONS } from './data/cases';
import { deliberateCase } from './services/api';

export default function App() {
  // Navigation & View state: 'dashboard' | 'cases' | 'audit'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Case Input states
  const [caseTitle, setCaseTitle] = useState('');
  const [caseDescription, setCaseDescription] = useState('');
  const [evidenceDefence, setEvidenceDefence] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState(null);

  // Demo / Offline Mode toggle
  const [offlineDemoMode, setOfflineDemoMode] = useState(false);

  // Application Deliberation Lifecycle: 'idle' | 'analysing' | 'deliberating' | 'completed' | 'error'
  const [appState, setAppState] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Deliberation Data returned by API
  const [deliberationData, setDeliberationData] = useState(null);

  // Progressive animation states for courtroom feed
  const [visibleStatementCount, setVisibleStatementCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimerRef = useRef(null);

  // Dynamic Juror Bench State (updates as statements are revealed!)
  const [jurorStates, setJurorStates] = useState({
    analyst: { vote: null, confidence: 0, citedLaw: null, status: 'Waiting' },
    empath: { vote: null, confidence: 0, citedLaw: null, status: 'Waiting' },
    jurist: { vote: null, confidence: 0, citedLaw: null, status: 'Waiting' },
    skeptic: { vote: null, confidence: 0, citedLaw: null, status: 'Waiting' },
  });
  const [activeJurorId, setActiveJurorId] = useState(null);

  // Magistrate Review State
  const [reviewState, setReviewState] = useState(null);

  // Pre-load the first preset case on mount for immediate ease of use
  useEffect(() => {
    const defaultCase = PRESET_CASES[0];
    setSelectedPresetId(defaultCase.id);
    setCaseTitle(defaultCase.title);
    setCaseDescription(defaultCase.description);
    setEvidenceDefence(`PROSECUTION EVIDENCE:\n${defaultCase.evidence}\n\nDEFENCE PLEA & MITIGATION:\n${defaultCase.defence}`);
  }, []);

  // Compute all statements flat list
  const getAllStatements = (data) => {
    if (!data || !data.rounds) return [];
    const flat = [];
    data.rounds.forEach((roundObj) => {
      (roundObj.statements || []).forEach((stmt) => {
        flat.push({
          ...stmt,
          round: roundObj.round || 1
        });
      });
    });
    return flat;
  };

  // Synchronize Juror cards with visible statements as debate unfolds
  const updateJurorStatesFromStatements = (statements, totalExpected) => {
    const newStates = {
      analyst: { vote: null, confidence: 0, citedLaw: null, status: 'Waiting' },
      empath: { vote: null, confidence: 0, citedLaw: null, status: 'Waiting' },
      jurist: { vote: null, confidence: 0, citedLaw: null, status: 'Waiting' },
      skeptic: { vote: null, confidence: 0, citedLaw: null, status: 'Waiting' },
    };

    statements.forEach((stmt) => {
      const id = stmt.juror_id;
      if (newStates[id]) {
        newStates[id] = {
          vote: stmt.vote,
          confidence: stmt.confidence,
          citedLaw: stmt.cited_law,
          status: statements.length === totalExpected ? 'Completed' : 'Analysing'
        };
      }
    });

    JUROR_DEFINITIONS.forEach(j => {
      if (!newStates[j.id].vote) {
        newStates[j.id].status = statements.length > 0 ? 'Analysing' : 'Waiting';
      }
    });

    setJurorStates(newStates);
  };

  // Start Deliberation Handler
  const handleStartDeliberation = async () => {
    const combinedCaseText = `TITLE: ${caseTitle}\n\nDESCRIPTION / FIR:\n${caseDescription}\n\nEVIDENCE & DEFENCE:\n${evidenceDefence}`;
    
    setAppState('analysing');
    setErrorMessage('');
    setDeliberationData(null);
    setReviewState(null);
    setVisibleStatementCount(0);
    setIsAnimating(false);

    setJurorStates({
      analyst: { vote: null, confidence: 0, citedLaw: null, status: 'Analysing' },
      empath: { vote: null, confidence: 0, citedLaw: null, status: 'Analysing' },
      jurist: { vote: null, confidence: 0, citedLaw: null, status: 'Analysing' },
      skeptic: { vote: null, confidence: 0, citedLaw: null, status: 'Analysing' },
    });

    try {
      const result = await deliberateCase({
        case_text: combinedCaseText,
        use_fallback: offlineDemoMode
      });

      setDeliberationData(result);
      const allStmts = getAllStatements(result);

      if (allStmts.length === 0) {
        setAppState('completed');
        return;
      }

      setAppState('deliberating');
      setIsAnimating(true);
      let currentIdx = 0;

      if (animationTimerRef.current) clearInterval(animationTimerRef.current);

      animationTimerRef.current = setInterval(() => {
        currentIdx += 1;
        setVisibleStatementCount(currentIdx);

        const currentVisible = allStmts.slice(0, currentIdx);
        updateJurorStatesFromStatements(currentVisible, allStmts.length);

        const latestStmt = allStmts[currentIdx - 1];
        if (latestStmt) {
          setActiveJurorId(latestStmt.juror_id);
        }

        if (currentIdx >= allStmts.length) {
          clearInterval(animationTimerRef.current);
          setIsAnimating(false);
          setActiveJurorId(null);
          setAppState('completed');

          setJurorStates(prev => {
            const finished = {};
            Object.keys(prev).forEach(k => {
              finished[k] = { ...prev[k], status: 'Completed' };
            });
            return finished;
          });
        }
      }, 550);

    } catch (err) {
      console.error("Deliberation execution error:", err);
      setAppState('error');
      setErrorMessage(
        err.message || "Failed to reach AI Deliberation API at http://localhost:5000. Ensure the Python Flask service is running, or toggle Offline Demo Mode to test immediately."
      );
      setJurorStates({
        analyst: { vote: null, confidence: 0, citedLaw: null, status: 'Waiting' },
        empath: { vote: null, confidence: 0, citedLaw: null, status: 'Waiting' },
        jurist: { vote: null, confidence: 0, citedLaw: null, status: 'Waiting' },
        skeptic: { vote: null, confidence: 0, citedLaw: null, status: 'Waiting' },
      });
    }
  };

  const handleSkipAnimation = () => {
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    if (!deliberationData) return;

    const allStmts = getAllStatements(deliberationData);
    setVisibleStatementCount(allStmts.length);
    updateJurorStatesFromStatements(allStmts, allStmts.length);
    setIsAnimating(false);
    setActiveJurorId(null);
    setAppState('completed');

    setJurorStates(prev => {
      const finished = {};
      Object.keys(prev).forEach(k => {
        finished[k] = { ...prev[k], status: 'Completed' };
      });
      return finished;
    });
  };

  const handleClear = () => {
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    setCaseTitle('');
    setCaseDescription('');
    setEvidenceDefence('');
    setSelectedPresetId(null);
    setDeliberationData(null);
    setReviewState(null);
    setVisibleStatementCount(0);
    setIsAnimating(false);
    setAppState('idle');
    setErrorMessage('');
    setJurorStates({
      analyst: { vote: null, confidence: 0, citedLaw: null, status: 'Waiting' },
      empath: { vote: null, confidence: 0, citedLaw: null, status: 'Waiting' },
      jurist: { vote: null, confidence: 0, citedLaw: null, status: 'Waiting' },
      skeptic: { vote: null, confidence: 0, citedLaw: null, status: 'Waiting' },
    });
  };

  const handleProceedToReview = () => {
    const el = document.getElementById('magistrate-review-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Stepper logic: simple text with dots
  const currentStep = 
    appState === 'completed' || reviewState ? 4 :
    appState === 'deliberating' && visibleStatementCount > 4 ? 2 :
    appState === 'deliberating' || appState === 'analysing' ? 1 :
    caseTitle ? 0 : -1;

  const stepsList = [
    "Case loaded",
    "Round 1",
    "Round 2",
    "Head review",
    "Advisory ready"
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#111827] flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        offlineDemoMode={offlineDemoMode}
        setOfflineDemoMode={setOfflineDemoMode}
        isDeliberating={appState === 'analysing' || appState === 'deliberating'}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Simple stepper with small dots */}
        <div className="flex flex-wrap items-center justify-between gap-2 py-3 px-4 bg-white border border-[#E5E7EB] rounded-[8px] text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {stepsList.map((stepName, idx) => {
              const isDone = idx < currentStep;
              const isCur = idx === currentStep;
              return (
                <div key={idx} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    isCur ? 'bg-[#1F2A44] ring-2 ring-[#1F2A44]/20' :
                    isDone ? 'bg-[#1F2A44]' : 'bg-[#E5E7EB]'
                  }`} />
                  <span className={`${
                    isCur ? 'font-semibold text-[#111827]' :
                    isDone ? 'text-[#111827]' : 'text-[#9CA3AF]'
                  }`}>
                    {stepName}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[#4B5563]">
            {appState === 'deliberating' && 'Deliberation in progress'}
            {appState === 'completed' && 'Deliberation complete'}
            {appState === 'idle' && 'Awaiting case input'}
          </div>
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <CaseInput
              caseTitle={caseTitle}
              setCaseTitle={setCaseTitle}
              caseDescription={caseDescription}
              setCaseDescription={setCaseDescription}
              evidenceDefence={evidenceDefence}
              setEvidenceDefence={setEvidenceDefence}
              onStartDeliberation={handleStartDeliberation}
              onClear={handleClear}
              isDeliberating={appState === 'analysing' || appState === 'deliberating'}
              selectedPresetId={selectedPresetId}
              setSelectedPresetId={setSelectedPresetId}
              offlineDemoMode={offlineDemoMode}
            />

            {appState === 'error' && (
              <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-[8px] text-xs space-y-2">
                <div className="font-semibold text-[#DC2626]">
                  Connection Error
                </div>
                <p className="text-[#4B5563]">
                  {errorMessage}
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleStartDeliberation}
                    className="px-3 py-1 bg-[#DC2626] text-white rounded-[6px]"
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => {
                      setOfflineDemoMode(true);
                      setTimeout(() => handleStartDeliberation(), 100);
                    }}
                    className="px-3 py-1 bg-white border border-[#E5E7EB] text-[#111827] rounded-[6px]"
                  >
                    Switch to Demo Mode
                  </button>
                </div>
              </div>
            )}

            <JurorGrid
              jurorStates={jurorStates}
              isDeliberating={appState === 'analysing' || appState === 'deliberating'}
              activeJurorId={activeJurorId}
            />

            {appState === 'analysing' && (
              <LoadingState message="Convening AI Judicial Evaluators in Chamber..." />
            )}

            {(appState === 'deliberating' || appState === 'completed' || deliberationData) && (
              <DebateFeed
                rounds={deliberationData?.rounds || []}
                visibleStatementCount={visibleStatementCount}
                onSkipAnimation={handleSkipAnimation}
                isAnimating={isAnimating}
                isDeliberating={appState === 'deliberating'}
              />
            )}

            {(appState === 'completed' || (deliberationData && !isAnimating)) && (
              <VoteAnalytics
                tally={deliberationData?.tally}
                consensus={deliberationData?.consensus}
                rounds={deliberationData?.rounds}
              />
            )}

            {(appState === 'completed' || (deliberationData && !isAnimating)) && (
              <FinalRecommendation
                deliberationData={deliberationData}
                onProceedToReview={handleProceedToReview}
              />
            )}

            {(appState === 'completed' || (deliberationData && !isAnimating)) && (
              <MagistrateReview
                reviewState={reviewState}
                onRecordReview={setReviewState}
                onResetReview={() => setReviewState(null)}
                consensus={deliberationData?.consensus}
              />
            )}

            {(appState === 'completed' || deliberationData) && (
              <AuditLog
                caseTitle={caseTitle}
                caseDescription={caseDescription}
                evidenceDefence={evidenceDefence}
                deliberationData={deliberationData}
                reviewState={reviewState}
              />
            )}
          </div>
        )}

        {/* TAB 2: CASES */}
        {activeTab === 'cases' && (
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-6 space-y-6">
            <div>
              <h2 className="text-base font-semibold text-[#111827]">
                Benchmark Cases
              </h2>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Summary proceedings across Indian Penal Code / BNS, Negotiable Instruments Act, and Motor Vehicles Act.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PRESET_CASES.map((preset) => (
                <div 
                  key={preset.id}
                  className="p-4 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-medium text-[#1F2A44] bg-[#F7F7F8] px-2 py-0.5 rounded border border-[#E5E7EB]">
                      {preset.tag}
                    </span>
                    <h3 className="text-sm font-semibold text-[#111827] pt-1">
                      {preset.title}
                    </h3>
                    <p className="text-xs text-[#4B5563] line-clamp-3 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPresetId(preset.id);
                      setCaseTitle(preset.title);
                      setCaseDescription(preset.description);
                      setEvidenceDefence(`PROSECUTION EVIDENCE:\n${preset.evidence}\n\nDEFENCE PLEA & MITIGATION:\n${preset.defence}`);
                      setActiveTab('dashboard');
                    }}
                    className="w-full py-1.5 px-3 text-xs font-medium text-[#111827] bg-[#F7F7F8] hover:bg-[#E5E7EB] border border-[#E5E7EB] rounded-[8px] transition-colors"
                  >
                    Load into Docket
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT */}
        {activeTab === 'audit' && (
          <AuditLog
            caseTitle={caseTitle}
            caseDescription={caseDescription}
            evidenceDefence={evidenceDefence}
            deliberationData={deliberationData}
            reviewState={reviewState}
          />
        )}
      </main>

      <footer className="mt-auto py-5 border-t border-[#E5E7EB] bg-white text-center text-xs text-[#4B5563]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>JuryX · AI Judicial Decision Support System (Summary Courts)</span>
          <span className="text-[11px] text-[#9CA3AF]">Human Oversight Mandate (Article 235)</span>
        </div>
      </footer>
    </div>
  );
}
