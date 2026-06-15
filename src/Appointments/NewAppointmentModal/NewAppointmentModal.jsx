import React from "react";
import { MdClose, MdPersonOutline, MdOutlinePhone, MdCalendarToday, MdOutlineMale, MdOutlineMedicalServices, MdOutlineDescription } from "react-icons/md";
import { FaStethoscope } from "react-icons/fa";
import useNewAppointmentModal from "./useNewAppointmentModal";

const NewAppointmentModal = ({ onClose, onSuccess }) => {
  const {
    formData,
    handleChange,
    handleSearchPatient,
    handleSelectPatient,
    patientSearchResults,
    isSearchingPatient,
    handleSubmit,
    loading,
    error,
    doctors,
    appointmentTypes,
    availableSlots,
  } = useNewAppointmentModal({ onClose, onSuccess });

  return (
    <>
      <div className="nam-overlay" onClick={onClose}>
        <div className="nam-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="nam-header">
            <h2>New Appointments</h2>
            <button className="nam-close-btn" onClick={onClose}>
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
                <div className="nam-field" style={{ position: "relative" }}>
                  <label><MdPersonOutline /> Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter Full Name"
                    value={formData.fullName}
                    onChange={(e) => handleSearchPatient(e.target.value)}
                  />
                  {patientSearchResults.length > 0 && (
                    <div className="nam-dropdown">
                      {patientSearchResults.map((p) => (
                        <div
                          key={p.patientId}
                          className="nam-dropdown-item"
                          onClick={() => handleSelectPatient(p)}
                        >
                          {p.patientName} - {p.patientMobileNo}
                        </div>
                      ))}
                    </div>
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
                  <label><MdCalendarToday /> Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  />
                </div>
                <div className="nam-field">
                  <label><MdOutlineMale /> Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="nam-section">
              <h3 className="nam-section-title">Appointment Details</h3>
              <div className="nam-grid">
                <div className="nam-field">
                  <label><FaStethoscope /> Select Doctor</label>
                  <select
                    value={formData.doctorId}
                    onChange={(e) => handleChange("doctorId", e.target.value)}
                  >
                    <option value="">Choose Doctor</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="nam-field">
                  <label><MdCalendarToday /> Date of Appointment</label>
                  <input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => handleChange("appointmentDate", e.target.value)}
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

            {/* Appointment Type & Chief Complaint */}
            <div className="nam-section nam-grid" style={{ marginTop: "24px" }}>
              <div className="nam-field">
                <label><MdOutlineMedicalServices /> Appointment Type</label>
                <select
                  value={formData.appointmentTypeId}
                  onChange={(e) => handleChange("appointmentTypeId", e.target.value)}
                >
                  <option value="">Choose Appointment Type</option>
                  {appointmentTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="nam-field">
                <label><MdOutlineDescription /> Chief Complaint</label>
                <input
                  type="text"
                  placeholder="Enter Patients Complaints"
                  value={formData.chiefComplaint}
                  onChange={(e) => handleChange("chiefComplaint", e.target.value)}
                />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="nam-footer">
            <button className="nam-btn-cancel" onClick={onClose}>Cancel</button>
            <button className="nam-btn-book" onClick={handleSubmit} disabled={loading}>
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </div>
      </div>

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
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.15);
        }
        .nam-header {
          background: #0070F3;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nam-header h2 {
          color: #fff;
          margin: 0;
          font-size: 1.3rem;
          font-weight: 600;
        }
        .nam-close-btn {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
        }
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
          color: #333;
          margin: 0 0 16px 0;
          font-weight: 600;
        }
        .nam-type-cards {
          display: flex;
          gap: 20px;
        }
        .nam-type-card {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 14px 20px;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          color: #333;
        }
        .nam-type-card.active {
          border-color: #0070F3;
          background: #F0F7FF;
        }
        .nam-type-card input {
          display: none;
        }
        .nam-radio-circle {
          width: 18px;
          height: 18px;
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
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 6px;
          height: 6px;
          background: #fff;
          border-radius: 50%;
        }
        .nam-card-icon {
          font-size: 1.3rem;
          margin-right: 8px;
          color: #666;
        }
        .nam-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .nam-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .nam-field label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #444;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nam-field label svg {
          color: #666;
          font-size: 1.1rem;
        }
        .nam-field input, .nam-field select {
          padding: 12px 14px;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #333;
          background: #F9FAFB;
          outline: none;
        }
        .nam-field input:focus, .nam-field select:focus {
          border-color: #0070F3;
          background: #fff;
        }
        .nam-slots {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }
        .nam-slot {
          padding: 10px;
          border: 1px solid #e0e4ec;
          background: #F9FAFB;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #444;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nam-slot:hover {
          border-color: #0070F3;
        }
        .nam-slot.active {
          background: #EAF3FF;
          border-color: #0070F3;
          color: #0070F3;
        }
        .nam-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 10;
          max-height: 200px;
          overflow-y: auto;
        }
        .nam-dropdown-item {
          padding: 10px 14px;
          font-size: 0.9rem;
          color: #333;
          cursor: pointer;
          border-bottom: 1px solid #f0f2f5;
        }
        .nam-dropdown-item:last-child {
          border-bottom: none;
        }
        .nam-dropdown-item:hover {
          background: #f8fafc;
          color: #0070F3;
        }
        .nam-footer {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding: 20px 32px;
          border-top: 1px solid #eef0f5;
        }
        .nam-btn-cancel {
          padding: 10px 24px;
          border: 1px solid #ccc;
          background: #fff;
          border-radius: 6px;
          font-weight: 600;
          color: #444;
          cursor: pointer;
        }
        .nam-btn-book {
          padding: 10px 24px;
          border: none;
          background: #0070F3;
          color: #fff;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        .nam-btn-book:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
};

export default NewAppointmentModal;
