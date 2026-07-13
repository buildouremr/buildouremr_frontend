import { useState, useEffect, useMemo, useCallback } from "react";
import AppointmentsAPI from "../../Appointments/API/appointmentsAPI";

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

const MOCK_SLOTS = generateSlots();

const useNewPatientModal = ({ onClose, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  // Results for full-name search bar
  const [fullNameSearchResults, setFullNameSearchResults] = useState([]);
  // Results for first/last name field inline search
  const [patientSearchResults, setPatientSearchResults] = useState([]);
  const [isSearchingPatient, setIsSearchingPatient] = useState(false);

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

  const [formData, setFormData] = useState({
    patientType: "Existing Patient",
    patientId: "",
    fullName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    emergencyContact: "",
    location: "",
    chiefComplaint: "",
    knownAllergies: [],
    chronicHistory: [],
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = (field, val) => {
    if (!formData[field].includes(val)) {
      setFormData((prev) => ({ ...prev, [field]: [...prev[field], val] }));
    }
  };

  const removeTag = (field, idx) => {
    setFormData((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));
  };

  // Full-name search bar handler
  const handleSearchPatient = async (query) => {
    setFormData((prev) => ({ ...prev, fullName: query, patientId: "" }));
    if (!query || query.length < 2) {
      setFullNameSearchResults([]);
      return;
    }
    setIsSearchingPatient(true);
    try {
      const res = await AppointmentsAPI.getPatients(query);
      setFullNameSearchResults(res.data?.data || []);
    } catch {
      setFullNameSearchResults([]);
    } finally {
      setIsSearchingPatient(false);
    }
  };

  // First/Last name field handler — searches API with combined name
  const handleSearchByName = useCallback(async (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleSelectPatient = (patient) => {
    let gender = "";
    if (patient.patientGender === "M" || patient.patientGender === "Male") gender = "Male";
    else if (patient.patientGender === "F" || patient.patientGender === "Female") gender = "Female";
    else if (patient.patientGender) gender = "Other";

    const nameParts = (patient.patientName || "").split(" ");

    setFormData((prev) => ({
      ...prev,
      patientId: patient.patientId ?? "",
      fullName: patient.patientName || "",
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      dateOfBirth: patient.patientDob || "",
      phoneNumber: patient.patientMobileNo || "",
      gender,
    }));
    setPatientSearchResults([]);
    setFullNameSearchResults([]);
  };

  // "Create New" button clicked — splits the query into first/last name
  const handleCreateNew = (query) => {
    const parts = (query || "").trim().split(" ");
    setFormData((prev) => ({
      ...prev,
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
      fullName: "",
      patientType: "New Patient",
    }));
    setPatientSearchResults([]);
    setFullNameSearchResults([]);
  };

  const availableSlots = useMemo(() => {
    if (formData.appointmentDate) return MOCK_SLOTS;
    return [];
  }, [formData.appointmentDate]);

  const hasUnsavedChanges = () => {
    return (
      formData.firstName || formData.lastName || formData.phoneNumber ||
      formData.email || formData.dateOfBirth || formData.gender ||
      formData.emergencyContact || formData.location || formData.chiefComplaint ||
      formData.knownAllergies.length > 0 || formData.chronicHistory.length > 0 ||
      formData.doctorId || formData.appointmentDate || formData.appointmentTime
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      mobileNumber: formData.phoneNumber,
      email: formData.email,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      emergencyContact: formData.emergencyContact,
      location: formData.location,
      chiefComplaint: formData.chiefComplaint,
      knownAllergies: formData.knownAllergies,
      chronicHistory: formData.chronicHistory,
      providerId: formData.doctorId ? parseInt(formData.doctorId, 10) : null,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      ...(formData.patientType === "Existing Patient" && formData.patientId
        ? { patientId: parseInt(formData.patientId, 10) }
        : {}),
    };

    try {
      await AppointmentsAPI.createAppointment(payload);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to create appointment", err);
      const msg = "Failed to create appointment. Please try again.";
      setError(msg);
      if (onError) onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    addTag,
    removeTag,
    handleSearchPatient,
    handleSearchByName,
    handleSelectPatient,
    handleCreateNew,
    patientSearchResults,
    fullNameSearchResults,
    isSearchingPatient,
    handleSubmit,
    loading,
    error,
    doctors,
    appointmentTypes,
    availableSlots,
    hasUnsavedChanges,
  };
};

export default useNewPatientModal;
