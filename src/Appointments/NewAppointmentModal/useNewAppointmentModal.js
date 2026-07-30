import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import AppointmentsAPI from "../API/appointmentsAPI";

/**
 * Generate 15-minute time slots from 09:00 to 21:00.
 */
const generateSlots = () => {
  const slots = [];
  for (let h = 9; h <= 21; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 21 && m > 0) break;
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
};

const ALL_SLOTS = generateSlots();

const INITIAL_FORM = {
  patientType: "Existing Patient",
  patientId: "",        // Set when an existing patient is selected from search
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  dateOfBirth: "",
  gender: "",
  location: "",
  chronicDisease: "",
  doctorId: "",
  appointmentDate: "",
  appointmentTime: "",
  appointmentTypeId: "",
  chiefComplaint: "",
};

const useNewAppointmentModal = ({ onClose, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const [doctors, setDoctors] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [patientSearchResults, setPatientSearchResults] = useState([]);

  // Prevent duplicate submissions
  const submittingRef = useRef(false);

  useEffect(() => {
    AppointmentsAPI.getCreateApptDetails()
      .then((res) => {
        if (res.data?.data) {
          setDoctors(res.data.data.providers || []);
          setAppointmentTypes(res.data.data.appointmentTypes || []);
        }
      })
      .catch((err) => console.error("Failed to fetch appointment details:", err));
  }, []);

  const [formData, setFormData] = useState(INITIAL_FORM);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear the validation error for this field when user edits it
    setValidationErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  // Called when user types in First Name or Last Name — triggers patient search
  const handleSearchByName = useCallback(async (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value, patientId: "" }));
    // Clear validation error for this field
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      delete next.patientId;
      return next;
    });

    const combined = field === "firstName"
      ? `${value} ${formData.lastName}`.trim()
      : `${formData.firstName} ${value}`.trim();

    if (!combined || combined.length < 2) {
      setPatientSearchResults([]);
      return;
    }
    try {
      const res = await AppointmentsAPI.getPatients(combined);
      setPatientSearchResults(res.data?.data || []);
    } catch {
      setPatientSearchResults([]);
    }
  }, [formData.firstName, formData.lastName]);

  // Called when user selects a patient from the search dropdown
  const handleSelectPatient = useCallback((patient) => {
    let gender = "";
    const g = patient.patientGender || "";
    if (g === "M" || g.toLowerCase() === "male") gender = "Male";
    else if (g === "F" || g.toLowerCase() === "female") gender = "Female";
    else if (g) gender = "Other";

    const nameParts = (patient.patientName || "").trim().split(/\s+/);
    setFormData((prev) => ({
      ...prev,
      patientId: String(patient.patientId || ""),
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      phoneNumber: patient.patientMobileNo || "",
      dateOfBirth: patient.patientDob || "",
      gender,
    }));
    setPatientSearchResults([]);
    // Clear related validation errors
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next.patientId;
      delete next.firstName;
      return next;
    });
  }, []);

  // Switch patient type — reset patient-specific fields
  const handlePatientTypeChange = useCallback((type) => {
    setFormData((prev) => ({
      ...INITIAL_FORM,
      patientType: type,
      // Keep appointment details when switching type
      doctorId: prev.doctorId,
      appointmentDate: prev.appointmentDate,
      appointmentTime: prev.appointmentTime,
      appointmentTypeId: prev.appointmentTypeId,
      chiefComplaint: prev.chiefComplaint,
    }));
    setValidationErrors({});
    setPatientSearchResults([]);
  }, []);

  /** Show time slots only once a date AND doctor are selected */
  const availableSlots = useMemo(() => {
    if (formData.appointmentDate && formData.doctorId) return ALL_SLOTS;
    return [];
  }, [formData.appointmentDate, formData.doctorId]);

  const hasUnsavedChanges = useCallback(() => {
    return (
      formData.firstName || formData.lastName || formData.phoneNumber ||
      formData.email || formData.dateOfBirth || formData.gender ||
      formData.location || formData.chronicDisease ||
      formData.doctorId || formData.appointmentDate || formData.appointmentTime ||
      formData.appointmentTypeId || formData.chiefComplaint
    );
  }, [formData]);

  // ── Frontend validation ───────────────────────────────────────────────────
  const validate = useCallback(() => {
    const errors = {};
    const isExisting = formData.patientType === "Existing Patient";

    if (isExisting) {
      if (!formData.firstName.trim()) {
        errors.firstName = "Search and select a patient.";
      } else if (!formData.patientId) {
        errors.patientId = "Please select a patient from the search results.";
      }
    } else {
      // New Patient
      if (!formData.firstName.trim()) errors.firstName = "First name is required.";
      if (!formData.lastName.trim())  errors.lastName  = "Last name is required.";
      if (!formData.phoneNumber.trim()) errors.phoneNumber = "Phone number is required.";
      if (!formData.gender)           errors.gender    = "Gender is required.";
    }

    if (!formData.doctorId)         errors.doctorId         = "Please select a doctor.";
    if (!formData.appointmentDate)  errors.appointmentDate  = "Appointment date is required.";
    if (!formData.appointmentTime)  errors.appointmentTime  = "Please select a time slot.";
    if (!formData.appointmentTypeId) errors.appointmentTypeId = "Please select an appointment type.";

    return errors;
  }, [formData]);

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    // Prevent duplicate submissions
    if (submittingRef.current) return;

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    setError(null);
    setValidationErrors({});

    const isExisting = formData.patientType === "Existing Patient";

    const payload = {
      patientId: isExisting ? formData.patientId : null,
      firstName: formData.firstName,
      lastName: formData.lastName,
      mobileNumber: formData.phoneNumber,
      email: formData.email,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      location: formData.location,
      chronicDisease: formData.chronicDisease,
      providerId: formData.doctorId ? parseInt(formData.doctorId, 10) : null,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      appointmentTypeId: formData.appointmentTypeId
        ? String(parseInt(formData.appointmentTypeId, 10))
        : null,
      chiefComplaint: formData.chiefComplaint,
    };

    try {
      await AppointmentsAPI.createAppointment(payload);
      if (onSuccess) onSuccess();
      // NOTE: onSuccess in Appointments.jsx already closes the modal.
      // Do NOT call onClose() here to avoid double-close.
    } catch (err) {
      console.error("Failed to create appointment", err);
      // Extract backend validation message if available
      const backendMsg =
        err?.response?.data?.data ||
        err?.response?.data?.message ||
        err?.message ||
        null;
      const msg = backendMsg || "Failed to create appointment. Please try again.";
      setError(msg);
      if (onError) onError(msg);
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  }, [formData, validate, onSuccess, onError]);

  return {
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
  };
};

export default useNewAppointmentModal;
