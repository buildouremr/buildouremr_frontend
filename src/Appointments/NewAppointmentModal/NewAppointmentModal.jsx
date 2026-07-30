import React, { useState } from "react";
import {
  MdClose,
  MdPersonOutline,
  MdPersonAddAlt1,
  MdOutlinePhone,
  MdOutlineEmail,
  MdOutlineMale,
  MdOutlineLocationOn,
  MdCalendarToday,
  MdOutlineDescription,
} from "react-icons/md";
import { FaStethoscope } from "react-icons/fa";
import DatePicker from "../../components/DatePicker/DatePicker";
import Dropdown from "../../components/Dropdown/Dropdown";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import useNewAppointmentModal from "./useNewAppointmentModal";

const GENDER_OPTIONS = [
  { value: "Male",   label: "Male"   },
  { value: "Female", label: "Female" },
  { value: "Other",  label: "Other"  },
];

// Inline patient search dropdown
const PatientSearchDropdown = ({ results, onSelect }) => {
  if (!results || results.length === 0) return null;
  const fmtId = (id) => `PT${String(id).padStart(4, "0")}`;
  return (
    <div className="nam-search-dropdown">
      {results.map((p) => (
        <button
          key={p.patientId}
          type="button"
          className="nam-search-row"
          onMouseDown={(e) => { e.preventDefault(); onSelect(p); }}
        >
          <span className="nam-s-id">{fmtId(p.patientId)}</span>
          <span className="nam-s-sep">–</span>
          <span className="nam-s-name">{p.patientName}</span>
          <span className="nam-s-sep">–</span>
          <span className="nam-s-phone">{p.patientMobileNo}</span>
        </button>
      ))}
    </div>
  );
};

// Validation error message component
const FieldError = ({ msg }) =>
  msg ? <span className="nam-field-err">{msg}</span> : null;

const NewAppointmentModal = ({ onClose, onSuccess, onError }) => {
  const {
    formData,
    handleChange,
    handleSearchByName,
    handleSelectPatient,
    handlePatientTypeChange,
    patientSearchResults,
    handleSubmit,
    loading,
    error,
    validationErrors,
    doctors,
    appointmentTypes,
    availableSlots,
    hasUnsavedChanges,
  } = useNewAppointmentModal({ onClose, onSuccess, onError });

  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [activeSearchField, setActiveSearchField] = useState(null);

  const handleAttemptClose = () => {
    if (hasUnsavedChanges()) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  const handleNameChange = (field, value) => {
    handleSearchByName(field, value);
    setActiveSearchField(field);
  };

  const handlePatientSelect = (p) => {
    handleSelectPatient(p);
    setActiveSearchField(null);
  };

  const isExisting = formData.patientType === "Existing Patient";

  return (
    <>
      <div className="nam-overlay">
        <div className="nam-modal" role="dialog" aria-modal="true" aria-labelledby="nam-title" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="nam-header">
            <h2 id="nam-title">New Appointments</h2>
            <button type="button" className="nam-close-btn" onClick={handleAttemptClose} aria-label="Close">
              <MdClose />
            </button>
          </div>

          {/* Body */}
          <div className="nam-body">
            {error && <div className="nam-error" role="alert">{error}</div>}

            {/* ── Patient Type ── */}
            <div className="nam-section">
              <h3 className="nam-section-title">Patient Type</h3>
              <div className="nam-type-cards">
                <label className={`nam-type-card ${isExisting ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="patientType"
                    value="Existing Patient"
                    checked={isExisting}
                    onChange={() => handlePatientTypeChange("Existing Patient")}
                  />
                  <div className="nam-radio-circle" />
                  <MdPersonOutline className="nam-card-icon" />
                  Existing Patient
                </label>
                <label className={`nam-type-card ${!isExisting ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="patientType"
                    value="New Patient"
                    checked={!isExisting}
                    onChange={() => handlePatientTypeChange("New Patient")}
                  />
                  <div className="nam-radio-circle" />
                  <MdPersonAddAlt1 className="nam-card-icon" />
                  New Patient
                </label>
              </div>
            </div>

            {/* ── Patient Details ── */}
            <div className="nam-section">
              <h3 className="nam-section-title">Patient Details</h3>
              <div className="nam-grid">

                {/* First Name */}
                <div className="nam-field" style={{ position: "relative" }}>
                  <label htmlFor="nam-firstName">
                    <MdPersonOutline /> First Name
                    {!isExisting && <span className="nam-req">*</span>}
                    {isExisting && <span className="nam-req">*</span>}
                  </label>
                  <input
                    id="nam-firstName"
                    type="text"
                    placeholder="Enter First Name"
                    value={formData.firstName}
                    onChange={(e) => handleNameChange("firstName", e.target.value)}
                    onBlur={() => setTimeout(() => setActiveSearchField(null), 150)}
                    autoComplete="off"
                    className={validationErrors.firstName || validationErrors.patientId ? "nam-input-error" : ""}
                    readOnly={isExisting && !!formData.patientId}
                  />
                  {activeSearchField === "firstName" && (
                    <PatientSearchDropdown results={patientSearchResults} onSelect={handlePatientSelect} />
                  )}
                  <FieldError msg={validationErrors.firstName || validationErrors.patientId} />
                </div>

                {/* Last Name */}
                <div className="nam-field" style={{ position: "relative" }}>
                  <label htmlFor="nam-lastName"><MdPersonOutline /> Last Name</label>
                  <input
                    id="nam-lastName"
                    type="text"
                    placeholder="Enter Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleNameChange("lastName", e.target.value)}
                    onBlur={() => setTimeout(() => setActiveSearchField(null), 150)}
                    autoComplete="off"
                    className={validationErrors.lastName ? "nam-input-error" : ""}
                    readOnly={isExisting && !!formData.patientId}
                  />
                  {activeSearchField === "lastName" && (
                    <PatientSearchDropdown results={patientSearchResults} onSelect={handlePatientSelect} />
                  )}
                  <FieldError msg={validationErrors.lastName} />
                </div>

                {/* Phone Number */}
                <div className="nam-field">
                  <label htmlFor="nam-phone">
                    <MdOutlinePhone /> Phone Number
                    {!isExisting && <span className="nam-req">*</span>}
                  </label>
                  <input
                    id="nam-phone"
                    type="text"
                    placeholder="(+91) 98876xxxxx"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    className={validationErrors.phoneNumber ? "nam-input-error" : ""}
                    readOnly={isExisting && !!formData.patientId}
                  />
                  <FieldError msg={validationErrors.phoneNumber} />
                </div>

                {/* Email */}
                <div className="nam-field">
                  <label htmlFor="nam-email"><MdOutlineEmail /> Email id</label>
                  <input
                    id="nam-email"
                    type="email"
                    placeholder="Name@gmail.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    readOnly={isExisting && !!formData.patientId}
                  />
                </div>

                {/* Date of Birth */}
                <div className="nam-field">
                  <label><MdCalendarToday /> Date of Birth</label>
                  <DatePicker
                    value={formData.dateOfBirth}
                    onChange={(v) => handleChange("dateOfBirth", v)}
                    placeholder="dd-mm-yyyy"
                    openUpward={false}
                    disabled={isExisting && !!formData.patientId}
                  />
                </div>

                {/* Gender */}
                <div className="nam-field">
                  <label>
                    <MdOutlineMale /> Gender
                    {!isExisting && <span className="nam-req">*</span>}
                  </label>
                  <Dropdown
                    options={GENDER_OPTIONS}
                    value={formData.gender}
                    onChange={(v) => handleChange("gender", v)}
                    placeholder="Select Gender"
                    className={validationErrors.gender ? "nam-input-error" : ""}
                    disabled={isExisting && !!formData.patientId}
                  />
                  <FieldError msg={validationErrors.gender} />
                </div>

                {/* Location */}
                <div className="nam-field">
                  <label htmlFor="nam-location"><MdOutlineLocationOn /> Location</label>
                  <input
                    id="nam-location"
                    type="text"
                    placeholder="XYZ Street, city, town"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    readOnly={isExisting && !!formData.patientId}
                  />
                </div>

                {/* Chronic Disease */}
                <div className="nam-field">
                  <label htmlFor="nam-chronic"><FaStethoscope /> Chronic Disease</label>
                  <input
                    id="nam-chronic"
                    type="text"
                    placeholder="Add the chronic disease"
                    value={formData.chronicDisease}
                    onChange={(e) => handleChange("chronicDisease", e.target.value)}
                    readOnly={isExisting && !!formData.patientId}
                  />
                </div>

              </div>

              {/* Existing Patient selection hint */}
              {isExisting && !formData.patientId && (
                <p className="nam-search-hint">
                  Type the patient's name above to search and select from existing records.
                </p>
              )}
              {isExisting && formData.patientId && (
                <p className="nam-selected-hint">
                  ✓ Patient selected. <button type="button" className="nam-clear-patient" onClick={() => handlePatientTypeChange("Existing Patient")}>Change</button>
                </p>
              )}
            </div>

            {/* ── Appointment Details ── */}
            <div className="nam-section">
              <h3 className="nam-section-title">Appointment Details</h3>
              <div className="nam-grid">
                <div className="nam-field">
                  <label><FaStethoscope /> Select Doctor <span className="nam-req">*</span></label>
                  <Dropdown
                    options={doctors.map((d) => ({ value: String(d.id), label: d.name }))}
                    value={formData.doctorId}
                    onChange={(v) => handleChange("doctorId", v)}
                    placeholder="Choose Doctor"
                    className={validationErrors.doctorId ? "nam-input-error" : ""}
                  />
                  <FieldError msg={validationErrors.doctorId} />
                </div>
                <div className="nam-field">
                  <label><MdCalendarToday /> Date of Appointment <span className="nam-req">*</span></label>
                  <DatePicker
                    value={formData.appointmentDate}
                    onChange={(v) => handleChange("appointmentDate", v)}
                    placeholder="dd-mm-yyyy"
                    openUpward={true}
                    className={validationErrors.appointmentDate ? "nam-input-error" : ""}
                  />
                  <FieldError msg={validationErrors.appointmentDate} />
                </div>
              </div>
            </div>

            {/* ── Available Time Slots ── */}
            {availableSlots.length > 0 && (
              <div className="nam-section">
                <h3 className="nam-section-title">Available Time Slots</h3>
                {validationErrors.appointmentTime && (
                  <p className="nam-field-err" style={{ marginBottom: "8px" }}>{validationErrors.appointmentTime}</p>
                )}
                <div className="nam-slots">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`nam-slot ${formData.appointmentTime === slot ? "active" : ""}`}
                      onClick={() => handleChange("appointmentTime", slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Appointment Type & Chief Complaint ── */}
            <div className="nam-section nam-grid" style={{ marginBottom: 0 }}>
              <div className="nam-field">
                <label><MdOutlineDescription /> Appointment Type <span className="nam-req">*</span></label>
                <Dropdown
                  options={appointmentTypes.map((t) => ({ value: String(t.id), label: t.name }))}
                  value={formData.appointmentTypeId}
                  onChange={(v) => handleChange("appointmentTypeId", v)}
                  placeholder="Choose Appointment Type"
                  className={validationErrors.appointmentTypeId ? "nam-input-error" : ""}
                />
                <FieldError msg={validationErrors.appointmentTypeId} />
              </div>
              <div className="nam-field">
                <label htmlFor="nam-complaint"><MdOutlineDescription /> Chief Complaint</label>
                <input
                  id="nam-complaint"
                  type="text"
                  placeholder="Enter Patients Complaints"
                  value={formData.chiefComplaint}
                  onChange={(e) => handleChange("chiefComplaint", e.target.value)}
                />
              </div>
            </div>

          </div>{/* end nam-body */}

          {/* Footer */}
          <div className="nam-footer">
            <button type="button" className="nam-btn-cancel" onClick={handleAttemptClose}>
              Cancel
            </button>
            <button
              type="button"
              className="nam-btn-book"
              onClick={handleSubmit}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </div>

        </div>
      </div>

      {showCloseConfirm && (
        <ConfirmModal
          variant="delete"
          title="Close without saving?"
          message="You have unsaved changes. Are you sure you want to close this appointment form?"
          confirmLabel="Yes, Close"
          onConfirm={onClose}
          onCancel={() => setShowCloseConfirm(false)}
        />
      )}

      <style>{`
        .nam-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .nam-modal {
          background: #fff;
          width: 100%;
          max-width: 800px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          max-height: 92vh;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        }

        /* Header */
        .nam-header {
          background: #1976D2;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .nam-header h2 {
          color: #fff;
          margin: 0;
          font-size: 1.15rem;
          font-weight: 700;
        }
        .nam-close-btn {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.85);
          font-size: 1.4rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          border-radius: 4px;
          padding: 4px;
          transition: color 0.15s, background 0.15s;
        }
        .nam-close-btn:hover { color: #fff; background: rgba(255,255,255,0.15); }

        /* Body */
        .nam-body {
          padding: 24px 28px;
          overflow-y: auto;
          flex: 1;
        }
        .nam-error {
          padding: 12px 16px;
          background: #FEF2F2;
          color: #dc2626;
          border: 1px solid #FECACA;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.88rem;
          font-weight: 500;
        }

        /* Sections */
        .nam-section {
          margin-bottom: 24px;
        }
        .nam-section-title {
          font-size: 0.97rem;
          color: #111827;
          margin: 0 0 14px 0;
          font-weight: 700;
        }

        /* Patient Type Cards */
        .nam-type-cards {
          display: flex;
          gap: 16px;
        }
        .nam-type-card {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 11px 16px;
          border: 1.5px solid #E5E7EB;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          font-size: 0.9rem;
          color: #374151;
          gap: 0;
        }
        .nam-type-card.active {
          border-color: #1976D2;
          background: #EFF6FF;
          color: #1976D2;
        }
        .nam-type-card input { display: none; }
        .nam-radio-circle {
          width: 16px; height: 16px;
          border-radius: 50%;
          border: 2px solid #D1D5DB;
          margin-right: 10px;
          flex-shrink: 0;
          position: relative;
          background: #fff;
          transition: border-color 0.2s, background 0.2s;
        }
        .nam-type-card.active .nam-radio-circle {
          border-color: #1976D2;
          background: #1976D2;
        }
        .nam-type-card.active .nam-radio-circle::after {
          content: "";
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 6px; height: 6px;
          background: #fff;
          border-radius: 50%;
        }
        .nam-card-icon {
          font-size: 1.1rem;
          margin-right: 7px;
          color: currentColor;
        }

        /* Grid */
        .nam-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px 20px;
        }

        /* Field */
        .nam-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .nam-field label {
          font-size: 0.86rem;
          font-weight: 600;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .nam-field label svg { color: #6B7280; font-size: 1rem; }
        .nam-req { color: #EF4444; margin-left: 2px; }

        .nam-field input {
          padding: 9px 13px;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          font-size: 0.88rem;
          color: #111827;
          background: #F9FAFB;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
          width: 100%;
          box-sizing: border-box;
        }
        .nam-field input:focus { border-color: #1976D2; background: #fff; box-shadow: 0 0 0 3px rgba(25,118,210,0.08); }
        .nam-field input::placeholder { color: #9CA3AF; }
        .nam-field input[readonly] { background: #F3F4F6; color: #6B7280; cursor: default; }
        .nam-input-error { border-color: #EF4444 !important; }
        .nam-field-err {
          font-size: 0.78rem;
          color: #EF4444;
          font-weight: 500;
        }

        /* Patient search dropdown */
        .nam-search-dropdown {
          position: absolute;
          top: calc(100% + 2px);
          left: 0; right: 0;
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          z-index: 1200;
          max-height: 220px;
          overflow-y: auto;
        }
        .nam-search-row {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 10px 14px;
          border: none;
          background: transparent;
          border-bottom: 1px solid #F3F4F6;
          cursor: pointer;
          text-align: left;
          font-size: 0.84rem;
          transition: background 0.12s;
        }
        .nam-search-row:last-child { border-bottom: none; }
        .nam-search-row:hover { background: #EFF6FF; }
        .nam-s-id { font-weight: 700; color: #111827; min-width: 50px; }
        .nam-s-name { flex: 1; color: #374151; font-weight: 500; }
        .nam-s-phone { color: #6B7280; font-size: 0.8rem; }
        .nam-s-sep { color: #D1D5DB; }

        /* Hints */
        .nam-search-hint {
          margin: 8px 0 0;
          font-size: 0.8rem;
          color: #6B7280;
          font-style: italic;
        }
        .nam-selected-hint {
          margin: 8px 0 0;
          font-size: 0.82rem;
          color: #059669;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nam-clear-patient {
          background: none; border: none;
          color: #1976D2; font-size: 0.82rem;
          cursor: pointer; text-decoration: underline;
          padding: 0; font-weight: 500;
        }

        /* Time Slots */
        .nam-slots {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
        }
        .nam-slot {
          padding: 9px 6px;
          border: 1px solid #E5E7EB;
          background: #F9FAFB;
          border-radius: 6px;
          font-size: 0.86rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.18s;
          text-align: center;
        }
        .nam-slot:hover { border-color: #93C5FD; background: #EFF6FF; }
        .nam-slot.active {
          background: #EFF6FF;
          border-color: #1976D2;
          color: #1976D2;
          font-weight: 700;
        }

        /* Footer */
        .nam-footer {
          display: flex;
          justify-content: flex-end;
          gap: 14px;
          padding: 16px 28px;
          flex-shrink: 0;
          border-top: 1px solid #F3F4F6;
        }
        .nam-btn-cancel {
          padding: 9px 24px;
          border: 1.5px solid #D1D5DB;
          background: #fff;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s;
        }
        .nam-btn-cancel:hover { background: #F9FAFB; border-color: #9CA3AF; }
        .nam-btn-book {
          padding: 9px 28px;
          border: none;
          background: #1976D2;
          color: #fff;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.15s;
        }
        .nam-btn-book:hover:not(:disabled) { background: #1565C0; }
        .nam-btn-book:disabled { opacity: 0.65; cursor: not-allowed; }

        /* Responsive */
        @media (max-width: 600px) {
          .nam-grid { grid-template-columns: 1fr; }
          .nam-type-cards { flex-direction: column; }
          .nam-slots { grid-template-columns: repeat(3, 1fr); }
          .nam-body { padding: 16px; }
          .nam-footer { padding: 14px 16px; }
        }
      `}</style>
    </>
  );
};

export default NewAppointmentModal;
