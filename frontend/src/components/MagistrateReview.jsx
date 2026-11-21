import React, { useState } from 'react';

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
  const [notesInput, setNotesInput] = useState('');

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
      notes: notesInput || `The advisory consensus (${consensus}) is concurred with in full. Statutory ingredients and evidentiary threshold verified.`,
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
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-5 sm:p-6 space-y-4" id="magistrate-review-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E7EB]">
        <div>
          <h3 className="text-base font-semibold text-[#111827]">
            Magistrate Review
          </h3>
          <p className="text-xs text-[#4B5563] mt-0.5">
            The advisory is non-binding. The magistrate retains final adjudicatory authority.
          </p>
        </div>

        {reviewState && (
          <button
            onClick={onResetReview}
            className="text-xs text-[#1F2A44] hover:underline"
          >
            Re-open Review
          </button>
        )}
      </div>

      {!reviewState ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#111827] mb-1.5">
              Magistrate's Notes
            </label>
            <textarea
              rows={3}
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="Enter judicial reasoning or notes..."
              className="w-full p-3 text-xs sm:text-sm bg-white border border-[#E5E7EB] rounded-[8px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1F2A44] focus:ring-1 focus:ring-[#1F2A44] transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleApprove}
              className="px-4 py-2 text-xs font-medium text-white bg-[#1F2A44] hover:bg-[#2B3A5C] rounded-[8px] transition-colors"
            >
              Approve Recommendation
            </button>
            <button
              onClick={handleOpenModifyModal}
              className="px-4 py-2 text-xs font-medium text-[#111827] bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-[8px] transition-colors"
            >
              Modify Recommendation
            </button>
            <button
              onClick={handleOpenRejectModal}
              className="px-4 py-2 text-xs font-medium text-[#DC2626] bg-white border border-[#E5E7EB] hover:border-[#FCA5A5] rounded-[8px] transition-colors"
            >
              Reject Recommendation
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-[#F7F7F8] border border-[#E5E7EB] rounded-[8px] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#111827]">
              Decision: {reviewState.decision}
            </span>
            <span className="text-[#4B5563]">
              {new Date(reviewState.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
            {reviewState.notes}
          </p>
          <p className="text-[11px] text-[#9CA3AF] pt-1">
            Presiding: {reviewState.magistrateName}
          </p>
        </div>
      )}

      {/* Modify Modal */}
      {isModifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E7EB] rounded-[8px] max-w-lg w-full p-6 space-y-4 shadow-subtle">
            <h3 className="text-sm font-semibold text-[#111827]">
              Modify Recommendation
            </h3>
            <textarea
              rows={5}
              value={modifyNotes}
              onChange={(e) => setModifyNotes(e.target.value)}
              placeholder="Enter modification directives..."
              className="w-full p-3 text-xs sm:text-sm bg-white border border-[#E5E7EB] rounded-[8px] text-[#111827] focus:outline-none focus:border-[#1F2A44] focus:ring-1 focus:ring-[#1F2A44]"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModifyModalOpen(false)}
                className="px-3 py-1.5 text-xs text-[#4B5563] hover:text-[#111827]"
              >
                Cancel
              </button>
              <button
                onClick={submitModification}
                className="px-4 py-1.5 text-xs font-medium text-white bg-[#1F2A44] hover:bg-[#2B3A5C] rounded-[8px]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E7EB] rounded-[8px] max-w-lg w-full p-6 space-y-4 shadow-subtle">
            <h3 className="text-sm font-semibold text-[#DC2626]">
              Reject Recommendation
            </h3>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter grounds for rejection..."
              className="w-full p-3 text-xs sm:text-sm bg-white border border-[#E5E7EB] rounded-[8px] text-[#111827] focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-3 py-1.5 text-xs text-[#4B5563] hover:text-[#111827]"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                className="px-4 py-1.5 text-xs font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-[8px]"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
