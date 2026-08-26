import React, { useState, useEffect } from "react";

import DatePicker from "../../components/DatePicker/DatePicker";
import Dropdown from "../../components/Dropdown/Dropdown";
import PatientSearchInput from "../../components/PatientSearchInput/PatientSearchInput";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import SavePatientConfirmModal from "./SavePatientConfirmModal";
import useNewPatientModal from "./useNewPatientModal";
import { X, User, Phone, Mail, MapPin, Calendar, FileText, Stethoscope, Syringe } from 'lucide-react';

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const BLOOD_GROUP_OPTIONS = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

const TagInputBelow = ({ tags, onAdd, onRemove, placeholder }) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      onAdd(input.trim());
      setInput("");
    }
  };

  return (
    <div className="npm-tag-container">
      <input
        type="text"
        className="npm-tag-input"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {tags.length > 0 && (
        <div className="npm-tags-list">
          {tags.map((tag, i) => (
            <span key={i} className="npm-tag-pill">
              {tag}
              <button type="button" className="npm-tag-remove" onClick={() => onRemove(i)}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Inline search dropdown used under First/Last Name
const PatientSearchDropdown = ({ results, query, onSelect, onCreateNew }) => {
  if (!query || query.length < 2) return null;
  const fmtId = (id) => `PT${String(id).padStart(4, "0")}`;
  return (
    <div className="npm-search-dropdown">
      {results.length === 0 ? (
        <div className="npm-search-empty">
          <span>No patients found</span>
          <button
            type="button"
            className="npm-create-new-btn"
            onMouseDown={(e) => { e.preventDefault(); onCreateNew(query); }}
          >
            + Create New
          </button>
        </div>
      ) : (
        results.map((p) => (
          <button
            key={p.patientId}
            type="button"
            className="npm-search-row"
            onMouseDown={(e) => { e.preventDefault(); onSelect(p); }}
          >
            <span className="npm-s-id">{fmtId(p.patientId)}</span>
            <span className="npm-s-sep">–</span>
            <span className="npm-s-name">{p.patientName}</span>
            <span className="npm-s-sep">–</span>
            <span className="npm-s-phone">{p.patientMobileNo}</span>
          </button>
        ))
      )}
    </div>
  );
};

const NewPatientModal = ({ onClose, onSuccess, onError }) => {
  const {
    formData,
    handleChange,
    handleSearchPatient,
    handleSearchByName,
    handleSelectPatient,
    handleCreateNew,
    patientSearchResults,
    fullNameSearchResults,
    isSearchingPatient,
    validateBeforeSubmit,
    executeSubmit,
    loading,
    error,
    doctors,
    availableSlots,
    hasUnsavedChanges,
    addTag,
    removeTag,
  } = useNewPatientModal({ onClose, onSuccess, onError });

  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [activeNameField, setActiveNameField] = useState(null);

  const handleAttemptClose = () => {
    if (hasUnsavedChanges()) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleAttemptClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasUnsavedChanges, onClose]);

  const handleNameChange = (field, value) => {
    handleSearchByName(field, value);
    setActiveNameField(field);
  };

  return (
    <>
      <div className="npm-overlay">
        <div className="npm-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="npm-header">
            <h2>Create New Patient &amp; Schedule Appointment</h2>
            <button className="npm-close-btn" onClick={handleAttemptClose}>
              <X />
            </button>
          </div>

          {/* Body */}
          <div className="npm-body">
            {error && <div className="npm-error">{error}</div>}

            {/* Patient Type */}
            <div className="npm-section">
              <h3 className="npm-section-title">Patient Type</h3>
              <div className="npm-type-cards">
                <label className={`npm-type-card ${formData.patientType === "Existing Patient" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="patientType"
                    value="Existing Patient"
                    checked={formData.patientType === "Existing Patient"}
                    onChange={(e) => handleChange("patientType", e.target.value)}
                  />
                  <div className="npm-radio-circle"></div>
                  <User className="npm-card-icon" /> Existing Patient
                </label>
                <label className={`npm-type-card ${formData.patientType === "New Patient" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="patientType"
                    value="New Patient"
                    checked={formData.patientType === "New Patient"}
                    onChange={(e) => handleChange("patientType", e.target.value)}
                  />
                  <div className="npm-radio-circle"></div>
                  <User className="npm-card-icon" /> New Patient
                </label>
              </div>
            </div>

            {/* Patient Search - full name with Create New */}
            <div className="npm-section">
              <div style={{ position: "relative" }}>
                <PatientSearchInput
                  value={formData.fullName}
                  onChange={handleSearchPatient}
                  onSelect={(p) => { handleSelectPatient(p); }}
                  results={fullNameSearchResults}
                  loading={isSearchingPatient}
                  placeholder="Search by Full Name"
                  createNewNode={
                    !isSearchingPatient && formData.fullName?.length >= 2 && fullNameSearchResults.length === 0
                      ? (
                        <button
                          type="button"
                          className="npm-fullname-create-btn"
                          onMouseDown={(e) => { e.preventDefault(); handleCreateNew(formData.fullName); }}
                        >
                          + Create New
                        </button>
                      )
                      : null
                  }
                />
              </div>
            </div>

            {/* Patient Details */}
            <div className="npm-section">
              <h3 className="npm-section-title">Patient Details</h3>
              <div className="npm-grid">
                <div className="npm-field" style={{ position: "relative" }}>
                  <label><User /> First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleNameChange("firstName", e.target.value)}
                    onBlur={() => setTimeout(() => setActiveNameField(null), 150)}
                    autoComplete="off"
                  />
                  {activeNameField === "firstName" && (
                    <PatientSearchDropdown
                      results={patientSearchResults}
                      query={formData.firstName}
                      onSelect={(p) => { handleSelectPatient(p); setActiveNameField(null); }}
                      onCreateNew={(q) => { handleCreateNew(q); setActiveNameField(null); }}
                    />
                  )}
                </div>
                <div className="npm-field" style={{ position: "relative" }}>
                  <label><User /> Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleNameChange("lastName", e.target.value)}
                    onBlur={() => setTimeout(() => setActiveNameField(null), 150)}
                    autoComplete="off"
                  />
                  {activeNameField === "lastName" && (
                    <PatientSearchDropdown
                      results={patientSearchResults}
                      query={formData.lastName}
                      onSelect={(p) => { handleSelectPatient(p); setActiveNameField(null); }}
                      onCreateNew={(q) => { handleCreateNew(q); setActiveNameField(null); }}
                    />
                  )}
                </div>
                <div className="npm-field">
                  <label><Calendar /> Date of Birth</label>
                  <DatePicker
                    value={formData.dateOfBirth}
                    onChange={(v) => handleChange("dateOfBirth", v)}
                    placeholder="dd-mm--yyyy"
                  />
                </div>
                <div className="npm-field">
                  <label><User /> Gender</label>
                  <Dropdown
                    options={GENDER_OPTIONS}
                    value={formData.gender}
                    onChange={(v) => handleChange("gender", v)}
                    placeholder="Select Gender"
                  />
                </div>
                <div className="npm-field">
                  <label><Phone /> Phone Number</label>
                  <input
                    type="text"
                    placeholder="909-090-9090"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      const limited = val.substring(0, 10);
                      let formatted = limited;
                      if (limited.length > 3 && limited.length <= 6) {
                        formatted = `${limited.substring(0,3)}-${limited.substring(3)}`;
                      } else if (limited.length > 6) {
                        formatted = `${limited.substring(0,3)}-${limited.substring(3,6)}-${limited.substring(6)}`;
                      }
                      handleChange("phoneNumber", formatted);
                    }}
                    maxLength="12"
                  />
                </div>
                <div className="npm-field">
                  <label><Mail /> Email Id</label>
                  <input
                    type="email"
                    placeholder="Name@gmail.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="npm-field">
                  <label><Phone /> Emergency Contact</label>
                  <input
                    type="text"
                    placeholder="(+91) 98876xxxxx"
                    value={formData.emergencyContact}
                    onChange={(e) => handleChange("emergencyContact", e.target.value)}
                  />
                </div>
                <div className="npm-field">
                  <label><MapPin /> Location</label>
                  <input
                    type="text"
                    placeholder="XYZ Street, city ,town"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                </div>
                <div className="npm-field">
                  <label><User /> Height (cm)</label>
                  <input
                    type="text"
                    placeholder="170 cm"
                    value={formData.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                  />
                </div>
                <div className="npm-field">
                  <label><User /> Weight (kg)</label>
                  <input
                    type="text"
                    placeholder="70 kg"
                    value={formData.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                  />
                </div>
                <div className="npm-field">
                  <label><User /> BMI</label>
                  <input
                    type="text"
                    placeholder="24.2"
                    value={formData.bmi}
                    onChange={(e) => handleChange("bmi", e.target.value)}
                  />
                </div>
                <div className="npm-field">
                  <label><User /> Blood Group</label>
                  <Dropdown
                    options={BLOOD_GROUP_OPTIONS}
                    value={formData.bloodGroup}
                    onChange={(v) => handleChange("bloodGroup", v)}
                    placeholder="Select Blood Group"
                  />
                </div>
              </div>
            </div>

            {/* Clinical Baseline */}
            <div className="npm-section">
              <h3 className="npm-section-title">Clinical Baseline</h3>
              <div className="npm-grid">
                <div className="npm-field">
                  <label><FileText /> Chief Complaint</label>
                  <input
                    type="text"
                    placeholder="Quarterly Heart Check up"
                    value={formData.chiefComplaint}
                    onChange={(e) => handleChange("chiefComplaint", e.target.value)}
                  />
                </div>
                <div className="npm-field">
                  <label><Syringe /> Known Allergies</label>
                  <TagInputBelow
                    tags={formData.knownAllergies}
                    onAdd={(val) => addTag("knownAllergies", val)}
                    onRemove={(idx) => removeTag("knownAllergies", idx)}
                    placeholder="Add Known Allergies"
                  />
                </div>
                <div className="npm-field npm-field-full">
                  <label><Syringe /> Chronic History</label>
                  <TagInputBelow
                    tags={formData.chronicHistory}
                    onAdd={(val) => addTag("chronicHistory", val)}
                    onRemove={(idx) => removeTag("chronicHistory", idx)}
                    placeholder="Add chronic histories"
                  />
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="npm-section">
              <h3 className="npm-section-title">Appointment Details</h3>
              <div className="npm-grid">
                <div className="npm-field">
                  <label><Stethoscope /> Select Doctor</label>
                  <Dropdown
                    options={doctors.map((d) => ({ value: d.id, label: d.name }))}
                    value={formData.doctorId}
                    onChange={(v) => handleChange("doctorId", v)}
                    placeholder="Select Doctor"
                  />
                </div>
                <div className="npm-field">
                  <label><Calendar /> Date of Appointment</label>
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
              <div className="npm-section">
                <h3 className="npm-section-title">Available Time Slots</h3>
                <div className="npm-slots">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      className={`npm-slot ${formData.appointmentTime === slot ? "active" : ""}`}
                      onClick={() => handleChange("appointmentTime", slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="npm-footer">
            <button className="npm-btn-cancel" onClick={handleAttemptClose}>Cancel</button>
            <button className="npm-btn-book" onClick={() => {
              if (validateBeforeSubmit()) {
                setShowSaveConfirm(true);
              }
            }} disabled={loading}>
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </div>
      </div>

      {showSaveConfirm && (
        <SavePatientConfirmModal
          onConfirm={() => {
            setShowSaveConfirm(false);
            executeSubmit();
          }}
          onCancel={() => setShowSaveConfirm(false)}
          loading={loading}
        />
      )}

      {showCloseConfirm && (
        <ConfirmModal
          variant="delete"
          title="Close without saving?"
          message="Are you sure you want to close this? This action cannot be undone."
          confirmLabel="Yes"
          onConfirm={onClose}
          onCancel={() => setShowCloseConfirm(false)}
        />
      )}

      <style>{`
        .npm-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .npm-modal {
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
        .npm-header {
          background: #0070F3;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .npm-header h2 {
          color: #fff;
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .npm-close-btn {
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
        .npm-close-btn:hover { color: #fff; }

        .npm-body {
          padding: 24px 32px;
          overflow-y: auto;
          flex: 1;
        }
        .npm-error {
          padding: 12px;
          background: #ffe8e8;
          color: #e74c3c;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }
        .npm-section {
          margin-bottom: 28px;
        }
        .npm-section-title {
          font-size: 1.05rem;
          color: #1a1a2e;
          margin: 0 0 16px 0;
          font-weight: 700;
        }
        .npm-type-cards {
          display: flex;
          gap: 20px;
        }
        .npm-type-card {
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
        .npm-type-card.active {
          border-color: #0070F3;
          background: #F0F7FF;
          color: #0070F3;
        }
        .npm-type-card input {
          display: none;
        }
        .npm-radio-circle {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid #d1d5db;
          margin-right: 12px;
          flex-shrink: 0;
          position: relative;
          background: #fff;
          transition: border-color 0.2s, background 0.2s;
        }
        .npm-type-card.active .npm-radio-circle {
          border-color: #0070F3;
          background: #0070F3;
        }
        .npm-type-card.active .npm-radio-circle::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 6px;
          height: 6px;
          background: #fff;
          border-radius: 50%;
        }
        .npm-card-icon {
          font-size: 1.2rem;
          margin-right: 8px;
          color: currentColor;
        }

        .npm-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .npm-field-full { grid-column: 1 / -1; }
        .npm-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .npm-field label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .npm-field label svg {
          color: #6b7280;
          font-size: 1.1rem;
        }
        .npm-field input, .npm-tag-input {
          padding: 10px 14px;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #1a1a2e;
          background: #f9fafb;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .npm-field input:focus, .npm-tag-input:focus {
          border-color: #2E7DF7;
          background: #fff;
        }
        .npm-field input::placeholder, .npm-tag-input::placeholder {
          color: #9ca3af;
        }

        /* Tags below input */
        .npm-tag-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .npm-tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .npm-tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border: 1px solid #93C5FD;
          background: #EAF3FF;
          color: #2E7DF7;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        .npm-tag-remove {
          background: none;
          border: none;
          color: #2E7DF7;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
          line-height: 1;
        }

        /* Patient search dropdown under name fields */
        .npm-search-dropdown {
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
        .npm-search-row {
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
        .npm-search-row:last-child { border-bottom: none; }
        .npm-search-row:hover { background: #f5f8ff; }
        .npm-s-id { font-weight: 700; color: #1a1a2e; min-width: 48px; }
        .npm-s-name { flex: 1; color: #374151; font-weight: 500; }
        .npm-s-phone { color: #6b7280; }
        .npm-s-sep { color: #d1d5db; }
        .npm-search-empty {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          font-size: 0.85rem;
          color: #9ca3af;
        }
        .npm-create-new-btn, .npm-fullname-create-btn {
          background: #EAF3FF;
          color: #2E7DF7;
          border: 1px solid #93C5FD;
          border-radius: 6px;
          padding: 4px 12px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .npm-create-new-btn:hover, .npm-fullname-create-btn:hover { background: #d0e9ff; }

        .npm-slots {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }
        .npm-slot {
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
        .npm-slot:hover {
          border-color: #93c5fd;
        }
        .npm-slot.active {
          background: #EAF3FF;
          border-color: #2E7DF7;
          color: #2E7DF7;
        }

        .npm-footer {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding: 20px 32px;
          flex-shrink: 0;
        }
        .npm-btn-cancel {
          padding: 10px 24px;
          border: 1.5px solid #d1d5db;
          background: #fff;
          border-radius: 6px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s;
        }
        .npm-btn-cancel:hover { background: #f9fafb; border-color: #9ca3af; }
        .npm-btn-book {
          padding: 10px 24px;
          border: none;
          background: #0070F3;
          color: #fff;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .npm-btn-book:hover { background: #0057c2; }
        .npm-btn-book:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
};

export default NewPatientModal;
