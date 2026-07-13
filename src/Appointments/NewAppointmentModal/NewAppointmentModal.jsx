import React, { useState } from "react";
import { MdClose, MdPersonOutline, MdOutlinePhone, MdOutlineEmail, MdOutlineMale, MdOutlineLocationOn, MdCalendarToday, MdOutlineDescription } from "react-icons/md";
import { FaStethoscope } from "react-icons/fa";
import DatePicker from "../../components/DatePicker/DatePicker";
import Dropdown from "../../components/Dropdown/Dropdown";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import useNewAppointmentModal from "./useNewAppointmentModal";

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

// Inline mini search dropdown for First/Last name fields
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

const NewAppointmentModal = ({ onClose, onSuccess, onError }) => {
  const {
    formData,
    handleChange,
    handleSearchByName,
    handleSelectPatient,
    patientSearchResults,
    handleSubmit,
    loading,
    error,
    doctors,
    appointmentTypes,
    availableSlots,
    hasUnsavedChanges,
  } = useNewAppointmentModal({ onClose, onSuccess, onError });

  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [activeSearchField, setActiveSearchField] = useState(null); // 'firstName' | 'lastName'

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

  return (
    <>
      <div className="nam-overlay">
        <div className="nam-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="nam-header">
            <h2>New Appointments</h2>
            <button className="nam-close-btn" onClick={handleAttemptClose}>
              <MdClose />
            </button>
          </div>

          {/* Body */}
          <div className="nam-body">
            {error && <div className="nam-error">{error}</div>}

            {/* Patient Type */}
            <div className="nam-section">
              <h3 className="nam-section-title">Patient Type</h3>
              <div className="nam-type-cards">
                <label className={`nam-type-card ${formData.patientType === "Existing Patient" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="patientType"
                    value="Existing Patient"
                    checked={formData.patientType === "Existing Patient"}
                    onChange={(e) => handleChange("patientType", e.target.value)}
                  />
                  <div className="nam-radio-circle"></div>
                  <MdPersonOutline className="nam-card-icon" /> Existing Patient
                </label>
                <label className={`nam-type-card ${formData.patientType === "New Patient" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="patientType"
                    value="New Patient"
                    checked={formData.patientType === "New Patient"}
                    onChange={(e) => handleChange("patientType", e.target.value)}
                  />
                  <div className="nam-radio-circle"></div>
                  <MdPersonOutline className="nam-card-icon" /> New Patient
                </label>
              </div>
            </div>

            {/* Patient Details */}
            <div className="nam-section">
              <h3 className="nam-section-title">Patient Details</h3>
              <div className="nam-grid">
                {/* First Name with search */}
                <div className="nam-field" style={{ position: "relative" }}>
                  <label><MdPersonOutline /> First Name</label>
                  <input
                    type="text"
                    placeholder="Enter First Name"
                    value={formData.firstName}
                    onChange={(e) => handleNameChange("firstName", e.target.value)}
                    onBlur={() => setTimeout(() => setActiveSearchField(null), 150)}
                    autoComplete="off"
                  />
                  {activeSearchField === "firstName" && (
                    <PatientSearchDropdown results={patientSearchResults} onSelect={handlePatientSelect} />
                  )}
                </div>
                {/* Last Name with search */}
                <div className="nam-field" style={{ position: "relative" }}>
                  <label><MdPersonOutline /> Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleNameChange("lastName", e.target.value)}
                    onBlur={() => setTimeout(() => setActiveSearchField(null), 150)}
                    autoComplete="off"
                  />
                  {activeSearchField === "lastName" && (
                    <PatientSearchDropdown results={patientSearchResults} onSelect={handlePatientSelect} />
                  )}
                </div>
                <div className="nam-field">
                  <label><MdOutlinePhone /> Phone Number</label>
                  <input
                    type="text"
                    placeholder="(+91) 98876xxxxx"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  />
                </div>
                <div className="nam-field">
                  <label><MdOutlineEmail /> Email id</label>
                  <input
                    type="email"
                    placeholder="Name@gmail.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="nam-field">
                  <label><MdCalendarToday /> Date of Birth</label>
                  <DatePicker
                    value={formData.dateOfBirth}
                    onChange={(v) => handleChange("dateOfBirth", v)}
                    placeholder="dd-mm--yyyy"
                    openUpward={false}
                  />
                </div>
                <div className="nam-field">
                  <label><MdOutlineMale /> Gender</label>
                  <Dropdown
                    options={GENDER_OPTIONS}
                    value={formData.gender}
                    onChange={(v) => handleChange("gender", v)}
                    placeholder="Select Gender"
                  />
                </div>
                <div className="nam-field">
                  <label><MdOutlineLocationOn /> Location</label>
                  <input
                    type="text"
                    placeholder="XYZ Street, city ,town"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                </div>
                <div className="nam-field">
                  <label><FaStethoscope /> Chronic Disease</label>
                  <input
                    type="text"
                    placeholder="Add the chronic disease"
                    value={formData.chronicDisease}
                    onChange={(e) => handleChange("chronicDisease", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="nam-section">
              <h3 className="nam-section-title">Appointment Details</h3>
              <div className="nam-grid">
                <div className="nam-field">
                  <label><FaStethoscope /> Select Doctor</label>
                  <Dropdown
                    options={doctors.map((d) => ({ value: d.id, label: d.name }))}
                    value={formData.doctorId}
                    onChange={(v) => handleChange("doctorId", v)}
                    placeholder="Select Doctor"
                  />
                </div>
                <div className="nam-field">
                  <label><MdCalendarToday /> Date of Appointment</label>
                  <DatePicker
                    value={formData.appointmentDate}
                    onChange={(v) => handleChange("appointmentDate", v)}
                    placeholder="DD-MM-YYYY"
                    openUpward={true}
                  />
                </div>
              </div>
            </div>

            {/* Available Time Slots */}
            {availableSlots.length > 0 && (
              <div className="nam-section">
                <h3 className="nam-section-title">Available Time Slots</h3>
                <div className="nam-slots">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      className={`nam-slot ${formData.appointmentTime === slot ? "active" : ""}`}
                      onClick={() => handleChange("appointmentTime", slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Row — Appointment Type & Chief Complaint */}
            <div className="nam-section nam-grid" style={{ marginBottom: "0" }}>
              <div className="nam-field">
                <label><MdOutlineDescription /> Appointment Type</label>
                <Dropdown
                  options={appointmentTypes.map((t) => ({ value: t.id, label: t.name }))}
                  value={formData.appointmentTypeId}
                  onChange={(v) => handleChange("appointmentTypeId", v)}
                  placeholder="Select Type"
                />
              </div>
              <div className="nam-field">
                <label><MdOutlineDescription /> Chief Complaint</label>
                <input
                  type="text"
                  placeholder="Quarterly Heart Check up"
                  value={formData.chiefComplaint}
                  onChange={(e) => handleChange("chiefComplaint", e.target.value)}
                />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="nam-footer">
            <button className="nam-btn-cancel" onClick={handleAttemptClose}>Cancel</button>
            <button className="nam-btn-book" onClick={handleSubmit} disabled={loading}>
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </div>
      </div>

      {showCloseConfirm && (
        <ConfirmModal
          variant="delete"
          title="Close Appointment before scheduling?"
          message="Are you sure you want to close this appointment? This action cannot be undone."
          confirmLabel="Yes"
          onConfirm={onClose}
          onCancel={() => setShowCloseConfirm(false)}
        />
      )}

      <style>{`
        .nam-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
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
          box-shadow: 0 4px 24px rgba(0,0,0,0.15);
        }
        .nam-header {
          background: #0070F3;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .nam-header h2 {
          color: #fff;
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .nam-close-btn {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.8);
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          border-radius: 6px;
          padding: 2px;
          transition: color 0.15s;
        }
        .nam-close-btn:hover { color: #fff; }

        .nam-body {
          padding: 24px 32px;
          overflow-y: auto;
          flex: 1;
        }
        .nam-error {
          padding: 12px;
          background: #ffe8e8;
          color: #e74c3c;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }
        .nam-section {
          margin-bottom: 28px;
        }
        .nam-section-title {
          font-size: 1.05rem;
          color: #1a1a2e;
          margin: 0 0 16px 0;
          font-weight: 700;
        }
        .nam-type-cards {
          display: flex;
          gap: 20px;
        }
        .nam-type-card {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          color: #374151;
        }
        .nam-type-card.active {
          border-color: #0070F3;
          background: #F0F7FF;
          color: #0070F3;
        }
        .nam-type-card input { display: none; }
        .nam-radio-circle {
          width: 16px; height: 16px;
          border-radius: 50%;
          border: 2px solid #d1d5db;
          margin-right: 12px;
          flex-shrink: 0;
          position: relative;
          background: #fff;
          transition: border-color 0.2s, background 0.2s;
        }
        .nam-type-card.active .nam-radio-circle {
          border-color: #0070F3;
          background: #0070F3;
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
        .nam-card-icon { font-size: 1.2rem; margin-right: 8px; color: currentColor; }

        .nam-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .nam-field-full { grid-column: 1 / -1; }
        .nam-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .nam-field label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nam-field label svg { color: #6b7280; font-size: 1.1rem; }
        .nam-field input {
          padding: 10px 14px;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #1a1a2e;
          background: #f9fafb;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
          width: 100%;
          box-sizing: border-box;
        }
        .nam-field input:focus { border-color: #2E7DF7; background: #fff; }
        .nam-field input::placeholder { color: #9ca3af; }

        /* Inline patient search dropdown */
        .nam-search-dropdown {
          position: absolute;
          top: calc(100% + 2px);
          left: 0; right: 0;
          background: #fff;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          z-index: 1200;
          max-height: 200px;
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
          border-bottom: 1px solid #f0f2f5;
          cursor: pointer;
          text-align: left;
          font-size: 0.84rem;
          transition: background 0.12s;
        }
        .nam-search-row:last-child { border-bottom: none; }
        .nam-search-row:hover { background: #f5f8ff; }
        .nam-s-id { font-weight: 700; color: #1a1a2e; min-width: 48px; }
        .nam-s-name { flex: 1; color: #374151; font-weight: 500; }
        .nam-s-phone { color: #6b7280; }
        .nam-s-sep { color: #d1d5db; }

        .nam-slots {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }
        .nam-slot {
          padding: 10px;
          border: 1px solid #e0e4ec;
          background: #f9fafb;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nam-slot:hover { border-color: #93c5fd; }
        .nam-slot.active {
          background: #EAF3FF;
          border-color: #2E7DF7;
          color: #2E7DF7;
        }

        .nam-footer {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding: 20px 32px;
          flex-shrink: 0;
        }
        .nam-btn-cancel {
          padding: 10px 24px;
          border: 1.5px solid #d1d5db;
          background: #fff;
          border-radius: 6px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s;
        }
        .nam-btn-cancel:hover { background: #f9fafb; border-color: #9ca3af; }
        .nam-btn-book {
          padding: 10px 24px;
          border: none;
          background: #0070F3;
          color: #fff;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .nam-btn-book:hover { background: #0057c2; }
        .nam-btn-book:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </>
  );
};

export default NewAppointmentModal;
