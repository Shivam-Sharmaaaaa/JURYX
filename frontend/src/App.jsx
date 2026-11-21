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
import { 
  AlertCircle, 
  RotateCcw, 
  WifiOff, 
  FileText, 
  CheckCircle, 
  Scale, 
  Sparkles, 
  Info, 
  ShieldCheck, 
  ChevronRight, 
  ExternalLink 
} from 'lucide-react';

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

    // Mark remaining waiting jurors
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
    
    // Clear previous deliberation and review
    setAppState('analysing');
    setErrorMessage('');
    setDeliberationData(null);
    setReviewState(null);
    setVisibleStatementCount(0);
    setIsAnimating(false);

    // Set all jurors to Analysing
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

      // Enter Deliberating state and start sequential progressive reveal
      setAppState('deliberating');
      setIsAnimating(true);
      let currentIdx = 0;

      // Clear any prior interval
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

        // When all statements are revealed
        if (currentIdx >= allStmts.length) {
          clearInterval(animationTimerRef.current);
          setIsAnimating(false);
          setActiveJurorId(null);
          setAppState('completed');

          // Mark all completed
          setJurorStates(prev => {
            const finished = {};
            Object.keys(prev).forEach(k => {
              finished[k] = { ...prev[k], status: 'Completed' };
            });
            return finished;
          });
        }
      }, 550); // 550ms cadence per statement for smooth natural courtroom reveal

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

  // Skip animation to display entire transcript instantly
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

  // Clear Case Inputs & Deliberation
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

  // Scroll to magistrate review
  const handleProceedToReview = () => {
    const el = document.getElementById('magistrate-review-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#292524] flex flex-col font-serif">
      {/* Top Navigation Bar with Mahogany and Brass Identity */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        offlineDemoMode={offlineDemoMode}
        setOfflineDemoMode={setOfflineDemoMode}
        isDeliberating={appState === 'analysing' || appState === 'deliberating'}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7">
        {/* Banner: Offline Demo Mode Notification */}
        {offlineDemoMode && (
          <div className="bg-[#FAF9F6] border border-[#B08D57] rounded-xl p-3.5 flex items-center justify-between text-xs text-[#24160F] shadow-court">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded bg-[#3B2418] text-[#B08D57] flex items-center justify-center shrink-0">
                <WifiOff className="w-3.5 h-3.5 text-[#B08D57]" />
              </div>
              <span>
                <strong className="font-cinzel text-[#3B2418]">Offline Demo Mode Active:</strong> Running local multi-agent judicial simulations with curated Indian legal precedent.
              </span>
            </div>
            <button
              onClick={() => setOfflineDemoMode(false)}
              className="text-[#3B2418] hover:text-[#B08D57] font-semibold underline text-xs font-cinzel tracking-wider"
            >
              Connect to Live Flask API
            </button>
          </div>
        )}

        {/* TAB 1: DASHBOARD VIEW (PRIMARY WORKSPACE) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-7">
            {/* 1. Case Docket Input Section */}
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

            {/* ERROR STATE: Friendly Error Card with Retry & Switch to Demo */}
            {appState === 'error' && (
              <div className="bg-red-50/60 border border-red-300 rounded-2xl p-6 text-center animate-in fade-in shadow-court">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#B91C1C] flex items-center justify-center mx-auto mb-3 border border-red-200">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-red-950 font-cinzel">
                  Deliberation Engine Communication Error
                </h3>
                <p className="text-xs text-red-900 max-w-lg mx-auto mt-1 leading-relaxed font-serif">
                  {errorMessage}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                  <button
                    onClick={handleStartDeliberation}
                    className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-[#B91C1C] hover:bg-red-800 rounded-xl shadow-xs transition-colors font-cinzel tracking-wider"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    Retry Live Connection
                  </button>
                  <button
                    onClick={() => {
                      setOfflineDemoMode(true);
                      setTimeout(() => handleStartDeliberation(), 100);
                    }}
                    className="inline-flex items-center px-4 py-2 text-xs font-bold text-[#3B2418] bg-[#FAF9F6] hover:bg-[#B08D57]/15 border border-[#B08D57] rounded-xl shadow-xs transition-colors font-cinzel tracking-wider"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#B08D57]" />
                    Switch to Offline Demo Mode & Deliberate
                  </button>
                </div>
              </div>
            )}

            {/* 2. Four AI Juror Cards (Bench Evaluation Grid) */}
            <JurorGrid
              jurorStates={jurorStates}
              isDeliberating={appState === 'analysing' || appState === 'deliberating'}
              activeJurorId={activeJurorId}
            />

            {/* 3. Loading State while API is deliberating initial payload */}
            {appState === 'analysing' && (
              <LoadingState message="Convening Four AI Jurors in Chamber..." />
            )}

            {/* 4. Courtroom Deliberation Feed (Timeline of R1 & R2 Statements) */}
            {(appState === 'deliberating' || appState === 'completed' || deliberationData) && (
              <DebateFeed
                rounds={deliberationData?.rounds || []}
                visibleStatementCount={visibleStatementCount}
                onSkipAnimation={handleSkipAnimation}
                isAnimating={isAnimating}
                isDeliberating={appState === 'deliberating'}
              />
            )}

            {/* 5. Vote Analytics (Revealed once statements are present) */}
            {(appState === 'completed' || (deliberationData && !isAnimating)) && (
              <VoteAnalytics
                tally={deliberationData?.tally}
                consensus={deliberationData?.consensus}
                rounds={deliberationData?.rounds}
              />
            )}

            {/* 6. Final Advisory Recommendation Card */}
            {(appState === 'completed' || (deliberationData && !isAnimating)) && (
              <FinalRecommendation
                deliberationData={deliberationData}
                onProceedToReview={handleProceedToReview}
              />
            )}

            {/* 7. Magistrate Review Panel */}
            {(appState === 'completed' || (deliberationData && !isAnimating)) && (
              <MagistrateReview
                reviewState={reviewState}
                onRecordReview={setReviewState}
                onResetReview={() => setReviewState(null)}
                consensus={deliberationData?.consensus}
              />
            )}

            {/* 8. Downloadable Audit Log Section */}
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

        {/* TAB 2: CASES REPOSITORY VIEW */}
        {activeTab === 'cases' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E7E1D8] shadow-court p-6 sm:p-7 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B08D57]/70 to-transparent" />
              <div className="flex items-center space-x-3.5 pb-4 border-b border-[#E7E1D8]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B2418] to-[#24160F] border border-[#B08D57] text-[#B08D57] flex items-center justify-center font-bold shadow-xs">
                  <FileText className="w-5 h-5 text-[#B08D57]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#24160F] tracking-wide font-cinzel">
                    Benchmark Indian Summary Court Dockets
                  </h2>
                  <p className="text-xs text-[#78716C] font-serif italic">
                    Pre-configured realistic proceedings across Section 379 IPC / BNS, Section 138 NI Act, and Motor Vehicles Act.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                {PRESET_CASES.map((preset) => (
                  <div
                    key={preset.id}
                    className="bg-[#FAF9F6] border border-[#E7E1D8] rounded-xl p-5 flex flex-col justify-between hover:border-[#B08D57] hover:shadow-courtLift transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-[#3B2418] border border-[#B08D57]/40 px-2 py-0.5 rounded font-cinzel">
                          {preset.tag}
                        </span>
                        <span className="text-[10px] text-[#78716C] font-mono">
                          {preset.firNo.split(',')[0]}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#24160F] font-cinzel leading-snug">
                        {preset.title}
                      </h3>
                      <p className="text-xs text-[#78716C] mt-0.5 italic font-serif">
                        {preset.court}
                      </p>

                      <div className="mt-3.5 pt-2.5 border-t border-[#E7E1D8] text-xs text-[#292524] space-y-2 font-serif">
                        <p className="line-clamp-3 leading-relaxed">
                          {preset.description}
                        </p>
                        <div className="text-[11.5px] font-medium text-[#78716C]">
                          <strong className="text-[#3B2418]">Accused:</strong> {preset.accused}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#E7E1D8]">
                      <button
                        onClick={() => {
                          setSelectedPresetId(preset.id);
                          setCaseTitle(preset.title);
                          setCaseDescription(preset.description);
                          setEvidenceDefence(`PROSECUTION EVIDENCE:\n${preset.evidence}\n\nDEFENCE PLEA & MITIGATION:\n${preset.defence}`);
                          setActiveTab('dashboard');
                        }}
                        className="w-full inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-[#3B2418] bg-white hover:bg-[#FAF9F6] border border-[#B08D57] rounded-lg transition-all shadow-2xs font-cinzel tracking-wider hover:border-[#3B2418]"
                      >
                        <span>Load Case Docket in Dashboard</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1 text-[#B08D57]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT LOGS FULL VIEW */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <AuditLog
              caseTitle={caseTitle}
              caseDescription={caseDescription}
              evidenceDefence={evidenceDefence}
              deliberationData={deliberationData}
              reviewState={reviewState}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#B08D57]/40 bg-[#3B2418] py-4 text-center text-xs text-[#FAF9F6]/80 font-serif">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Scale className="w-3.5 h-3.5 text-[#B08D57]" />
            <span className="font-semibold font-cinzel text-[#FAF9F6]">JuryX Judicial Decision-Support System</span>
            <span className="text-[#B08D57]">•</span>
            <span className="italic">Indian Summary Courts Pilot</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-[#FAF9F6]/70">
            <span>Non-Binding Decision Support</span>
            <span>•</span>
            <span>Article 235 Human Oversight Mandate</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
