import React, { useState } from 'react';
import { 
  Gavel, 
  CheckCircle, 
  Edit3, 
  XCircle, 
  RotateCcw, 
  FileText, 
  AlertCircle,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function MagistrateReview({
  reviewState,
  onRecordReview,
  onResetReview,
  consensus
}) {
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [modifyNotes, setModifyNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Default suggested modifications based on consensus
  const handleOpenModifyModal = () => {
    if (!modifyNotes) {
      if (consensus === 'GUILTY') {
        setModifyNotes("Finding of guilt concurred; however, invoking Section 3 of the Probation of Offenders Act 1958 or Section 360 CrPC for release upon admonition/good conduct bond given mitigating circumstances and clean antecedents.");
      } else {
        setModifyNotes("Acquittal advisory approved subject to complainant being granted liberty to pursue appropriate civil debt recovery / arbitration remedies.");
      }
    }
    setIsModifyModalOpen(true);
  };

  const submitModification = () => {
    onRecordReview({
      status: 'MODIFIED',
      decision: 'Modified with Judicial Directions',
      notes: modifyNotes,
      timestamp: new Date().toISOString(),
      magistrateName: "Hon'ble Presiding Magistrate, Court 4"
    });
    setIsModifyModalOpen(false);
  };

  const handleApprove = () => {
    onRecordReview({
      status: 'APPROVED',
      decision: 'Approved Advisory In Toto',
      notes: `The advisory consensus (${consensus}) is concurred with in full. Statutory ingredients and evidentiary threshold verified.`,
      timestamp: new Date().toISOString(),
      magistrateName: "Hon'ble Presiding Magistrate, Court 4"
    });
  };

  const handleOpenRejectModal = () => {
    setRejectReason("Advisory recommendation set aside under inherent discretion. Matters require full viva-voce trial examination under regular summons procedure.");
    setIsRejectModalOpen(true);
  };

  const submitRejection = () => {
    onRecordReview({
      status: 'REJECTED',
      decision: 'Rejected Advisory Recommendation',
      notes: rejectReason,
      timestamp: new Date().toISOString(),
      magistrateName: "Hon'ble Presiding Magistrate, Court 4"
    });
    setIsRejectModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E7E1D8] shadow-court p-6 sm:p-7 transition-all relative overflow-hidden" id="magistrate-review-section">
      {/* Top brass divider line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B08D57]/70 to-transparent" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E7E1D8] gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B2418] to-[#24160F] border border-[#B08D57] flex items-center justify-center text-[#B08D57] shadow-sm">
            <Gavel className="w-5 h-5 text-[#B08D57]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#24160F] tracking-wide font-cinzel">
              Magistrate Bench Review & Order Disposition
            </h2>
            <p className="text-xs text-[#78716C] font-serif italic">
              Official judicial chamber — human sovereign oversight (Article 235 Mandate)
            </p>
          </div>
        </div>

        {reviewState ? (
          <button
            onClick={onResetReview}
            className="inline-flex items-center text-xs font-semibold text-[#3B2418] hover:text-[#24160F] bg-[#FAF9F6] border border-[#B08D57] px-3.5 py-1.5 rounded-lg transition-all font-cinzel tracking-wider shadow-2xs hover:bg-[#B08D57]/10"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-[#B08D57]" />
            Re-open Review
          </button>
        ) : (
          <span className="text-xs font-semibold uppercase tracking-wider text-[#3B2418] bg-[#FAF9F6] px-3 py-1 rounded-lg border border-[#B08D57]/50 font-cinzel">
            Awaiting Judicial Adjudication
          </span>
        )}
      </div>

      {/* When no review is recorded yet: Three Primary Action Buttons */}
      {!reviewState ? (
        <div className="mt-5 space-y-4">
          <p className="text-xs sm:text-[13px] text-[#292524] leading-relaxed font-serif">
            As the presiding judicial authority, review the multi-agent advisory synthesis and select an official action to record in the digital court order sheet:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. Approve */}
            <button
              onClick={handleApprove}
              className="group p-4.5 rounded-xl border border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/80 hover:border-emerald-500 transition-all text-left flex flex-col justify-between shadow-xs hover:shadow-courtLift hover:-translate-y-0.5"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-700" />
                </div>
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide font-cinzel">
                  1. Approve Advisory
                </h4>
                <p className="text-[12px] text-emerald-900/80 mt-1 leading-snug font-serif">
                  Concur with the 4-juror advisory findings and order issuance of formal disposition.
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 mt-3.5 flex items-center font-cinzel tracking-wider">
                Record Approval &rarr;
              </span>
            </button>

            {/* 2. Modify */}
            <button
              onClick={handleOpenModifyModal}
              className="group p-4.5 rounded-xl border border-[#B08D57]/60 bg-[#FAF9F6] hover:bg-[#FAF9F6]/90 hover:border-[#B08D57] transition-all text-left flex flex-col justify-between shadow-xs hover:shadow-courtLift hover:-translate-y-0.5"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#3B2418] text-[#B08D57] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-[#B08D57]/40">
                  <Edit3 className="w-4.5 h-4.5 text-[#B08D57]" />
                </div>
                <h4 className="text-xs font-bold text-[#3B2418] uppercase tracking-wide font-cinzel">
                  2. Modify with Directions
                </h4>
                <p className="text-[12px] text-[#78716C] mt-1 leading-snug font-serif">
                  Accept with judicial modifications (probation bond, community service, compounding).
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#3B2418] mt-3.5 flex items-center font-cinzel tracking-wider">
                Open Modification Order &rarr;
              </span>
            </button>

            {/* 3. Reject */}
            <button
              onClick={handleOpenRejectModal}
              className="group p-4.5 rounded-xl border border-red-300 bg-red-50/40 hover:bg-red-50/80 hover:border-red-500 transition-all text-left flex flex-col justify-between shadow-xs hover:shadow-courtLift hover:-translate-y-0.5"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-red-100 text-[#B91C1C] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <XCircle className="w-4.5 h-4.5 text-[#B91C1C]" />
                </div>
                <h4 className="text-xs font-bold text-red-950 uppercase tracking-wide font-cinzel">
                  3. Reject Recommendation
                </h4>
                <p className="text-[12px] text-red-900/80 mt-1 leading-snug font-serif">
                  Set aside AI recommendation; remit for regular trial or dismiss docket under judicial discretion.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#B91C1C] mt-3.5 flex items-center font-cinzel tracking-wider">
                Record Rejection &rarr;
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* When review HAS been recorded */
        <div className="mt-5 bg-[#FAF9F6] rounded-xl border border-[#B08D57]/50 p-5 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E7E1D8] gap-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#B08D57]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#24160F] font-cinzel">
                Recorded Judicial Disposition (Order Sheet Entry)
              </span>
            </div>
            <div className="flex items-center space-x-2 font-mono text-[11px] text-[#78716C]">
              <span>Logged: {new Date(reviewState.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center space-x-2.5">
              <span className="text-xs font-bold text-[#78716C] font-cinzel">Order Status:</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold font-cinzel tracking-wider ${
                reviewState.status === 'APPROVED' 
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : reviewState.status === 'MODIFIED'
                    ? 'bg-[#B08D57]/20 text-[#3B2418] border border-[#B08D57]'
                    : 'bg-red-100 text-red-900 border border-red-300'
              }`}>
                {reviewState.decision}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#78716C] block mb-1 font-cinzel">
                Magistrate's Recorded Order / Statutory Grounds:
              </span>
              <div className="text-xs sm:text-[13px] text-[#292524] bg-white p-3.5 rounded-lg border border-[#E7E1D8] font-serif leading-relaxed shadow-2xs">
                {reviewState.notes}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 text-[11px] text-[#78716C] border-t border-[#E7E1D8] font-serif">
              <span className="flex items-center space-x-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#B08D57]" />
                <span>Adjudicated by: <strong className="text-[#24160F] font-cinzel">{reviewState.magistrateName}</strong></span>
              </span>
              <span className="italic text-[#78716C]">
                Preserved in digital order sheet & audit report
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modify Modal */}
      {isModifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24160F]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-courtElevated border border-[#B08D57]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E1D8]">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-[#B08D57]" />
                <h3 className="text-sm font-bold text-[#24160F] font-cinzel tracking-wide">
                  Judicial Modification Directions
                </h3>
              </div>
              <button
                onClick={() => setIsModifyModalOpen(false)}
                className="text-[#78716C] hover:text-[#24160F] p-1 rounded-md text-lg"
              >
                &times;
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold text-[#3B2418] uppercase tracking-wider mb-1.5 font-cinzel">
                Enter Judicial Order, Conditions or Probation Directives:
              </label>
              <textarea
                rows={5}
                value={modifyNotes}
                onChange={(e) => setModifyNotes(e.target.value)}
                placeholder="Enter modification terms (e.g. compound offence under Sec 320 CrPC, invoke Sec 3 Probation of Offenders Act, or require compensatory payment)..."
                className="w-full p-3 text-xs sm:text-[13px] leading-relaxed bg-[#FAF9F6] border border-[#E7E1D8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B08D57] font-serif"
              />
            </div>

            <div className="flex items-center justify-end space-x-2.5 mt-4 pt-3 border-t border-[#E7E1D8]">
              <button
                onClick={() => setIsModifyModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#78716C] hover:bg-[#FAF9F6] rounded-lg transition-colors font-cinzel"
              >
                Cancel
              </button>
              <button
                onClick={submitModification}
                disabled={!modifyNotes.trim()}
                className="px-5 py-2 text-xs font-bold text-[#FAF9F6] bg-[#3B2418] hover:bg-[#24160F] border border-[#B08D57] disabled:opacity-50 rounded-lg shadow-sm transition-all font-cinzel tracking-wider"
              >
                Save Judicial Modification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24160F]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-courtElevated border border-red-300">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E1D8]">
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-[#B91C1C]" />
                <h3 className="text-sm font-bold text-[#24160F] font-cinzel tracking-wide">
                  Reject AI Recommendation
                </h3>
              </div>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="text-[#78716C] hover:text-[#24160F] p-1 rounded-md text-lg"
              >
                &times;
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold text-[#B91C1C] uppercase tracking-wider mb-1.5 font-cinzel">
                Judicial Grounds for Setting Aside Advisory:
              </label>
              <textarea
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="State judicial grounds for setting aside advisory (e.g. complex disputed question of fact requiring witness cross-examination)..."
                className="w-full p-3 text-xs sm:text-[13px] leading-relaxed bg-[#FAF9F6] border border-[#E7E1D8] rounded-xl focus:outline-none focus:ring-1 focus:ring-red-400 font-serif"
              />
            </div>

            <div className="flex items-center justify-end space-x-2.5 mt-4 pt-3 border-t border-[#E7E1D8]">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#78716C] hover:bg-[#FAF9F6] rounded-lg transition-colors font-cinzel"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                disabled={!rejectReason.trim()}
                className="px-5 py-2 text-xs font-bold text-white bg-[#B91C1C] hover:bg-red-800 disabled:opacity-50 rounded-lg shadow-sm transition-all font-cinzel tracking-wider"
              >
                Record Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
