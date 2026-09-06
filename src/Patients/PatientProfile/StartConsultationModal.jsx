import React from 'react';
import { X, AlertTriangle, Calendar, FilePlus, Edit3, Info } from 'lucide-react';
import './PatientProfileModals.css';

const StartConsultationModal = ({
  isOpen,
  onClose,
  unsignedInfo,
  onContinueUnsigned,
  onReviewAndClose
}) => {
  if (!isOpen) return null;

  const { encounterId, formattedDate, providerName, lastUpdated } = unsignedInfo || {};

  const displayDate = formattedDate && formattedDate !== '-' ? formattedDate : (lastUpdated || 'Recent Consultation');
  const displayProvider = providerName || 'Dr. Ashok';

  return (
    <div className="pp-modal-overlay">
      <div className="pp-modal-container start-consultation-modal">
        {/* Header */}
        <div className="pp-modal-header">
          <h2 className="pp-modal-title">Start Consultation</h2>
          <button className="pp-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="pp-modal-body">
          {/* Amber Yellow Alert Box */}
          <div className="sc-unfinished-alert">
            <div className="sc-alert-header">
              <AlertTriangle className="sc-alert-icon" size={18} />
              <span className="sc-alert-title">Unfinished consultation found</span>
            </div>
            <p className="sc-alert-subtitle">
              This patient has an unsigned consultation that was started earlier.
            </p>

            {/* Inner White Card */}
            <div className="sc-unfinished-card">
              <div className="sc-card-left">
                <div className="sc-calendar-icon-wrapper">
                  <Calendar size={18} className="sc-calendar-icon" />
                </div>
                <div className="sc-card-info">
                  <h4 className="sc-card-date">{displayDate}</h4>
                  <p className="sc-card-sub">
                    Last updated: {displayDate} • {displayProvider}
                  </p>
                </div>
              </div>
              <span className="sc-badge-unsigned">Unsigned</span>
            </div>
          </div>

          {/* Action Choice Section */}
          <h3 className="sc-choice-heading">What would you like to do?</h3>

          <div className="sc-options-grid">
            {/* Card 1: Continue Unsigned */}
            <div className="sc-option-card blue">
              <div className="sc-option-icon-wrapper blue">
                <FilePlus size={22} />
              </div>
              <h4 className="sc-option-title">Continue Unsigned existing consultation</h4>
              <p className="sc-option-desc">
                Open the unsigned consultation and continue.
              </p>
              <button 
                className="sc-option-btn blue" 
                onClick={() => onContinueUnsigned(encounterId)}
              >
                Continue
              </button>
            </div>

            {/* Card 2: Review & Close */}
            <div className="sc-option-card purple">
              <div className="sc-option-icon-wrapper purple">
                <Edit3 size={22} />
              </div>
              <h4 className="sc-option-title">Review, Close & Start new Consultation</h4>
              <p className="sc-option-desc">
                Review and sign the previous consultation, then start a new visit.
              </p>
              <button 
                className="sc-option-btn purple" 
                onClick={() => onReviewAndClose(encounterId)}
              >
                Review & Close
              </button>
            </div>
          </div>

          {/* Bottom Info Banner */}
          <div className="sc-info-banner">
            <Info size={16} className="sc-info-icon" />
            <span>Closing will permanently lock the previous consultation, And will not allow to edit in future.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartConsultationModal;
