import { useState, useEffect, useMemo } from "react";
import AppointmentsAPI from "../API/appointmentsAPI";

// Generates time slots from 09:00 to 21:00 with 15 min intervals
const generateSlots = () => {
  const slots = [];
  for (let h = 9; h <= 21; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 21 && m > 0) break; // End at 21:00 exactly
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
};

const MOCK_SLOTS = generateSlots();

const useNewAppointmentModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
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
    patientId: "",       // Populated when an existing patient is selected
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    appointmentTypeId: "",
    chiefComplaint: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearchPatient = async (query) => {
    // Clear any previously selected patientId when the user types manually
    setFormData((prev) => ({ ...prev, fullName: query, patientId: "" }));
    if (!query || query.length < 2) {
      setPatientSearchResults([]);
      return;
    }
    setIsSearchingPatient(true);
    try {
      const res = await AppointmentsAPI.getPatients(query);
      setPatientSearchResults(res.data?.data || []);
    } catch (err) {
      setPatientSearchResults([]);
    } finally {
      setIsSearchingPatient(false);
    }
  };

  const handleSelectPatient = (patient) => {
    let gender = "";
    if (patient.patientGender === 'M' || patient.patientGender === 'Male') gender = "Male";
    else if (patient.patientGender === 'F' || patient.patientGender === 'Female') gender = "Female";
    else if (patient.patientGender) gender = "Other";

    setFormData((prev) => ({
      ...prev,
      patientId: patient.patientId ?? "",   // ← store the selected patient's ID
      fullName: patient.patientName || "",
      dateOfBirth: patient.patientDob || "",
      phoneNumber: patient.patientMobileNo || "",
      gender: gender,
    }));
    setPatientSearchResults([]);
  };

  const availableSlots = useMemo(() => {
    if (formData.appointmentDate) {
      // In a real app, we'd fetch the slots here based on doctorId and date
      return MOCK_SLOTS;
    }
    return [];
  }, [formData.appointmentDate]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Split Full Name into parts
    const nameParts = formData.fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    const payload = {
      firstName,
      lastName,
      mobileNumber: formData.phoneNumber,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      providerId: formData.doctorId ? parseInt(formData.doctorId, 10) : null,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      appointmentTypeId: formData.appointmentTypeId ? parseInt(formData.appointmentTypeId, 10) : null,
      chiefComplaint: formData.chiefComplaint,
      // Include patientId only for existing patients
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
      setError("Failed to create appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};

export default useNewAppointmentModal;
