import { useState, useEffect } from "react";
import PatientChartAPI from "../API/patientChartAPI";
import axiosInstance from "../../utils/useAPIClient";

// ==========================================
// REFERENCE DATA (Isolated for future API replacement)
// ==========================================
const REFERENCE_PATIENT_DATA = {
  header: {
    name: "Ralph Edwards",
    status: "Stable",
    id: "PT-9081",
    gender: "Female",
    age: "45 yrs",
    dob: "12 Mar 1980",
    bloodGroup: { value: "O+", date: "12 Aug 2018" },
    height: { value: "175 cm", date: "12 Aug 2025" },
    weight: { value: "82 kg", date: "12 Aug 2026" },
    bmi: { value: "26.8", date: "30 Jan 2026" },
    lastVisit: "12 July 2026"
  },
  alerts: {
    allergies: [
      "Allergy: Penicillin (Severe)",
      "Allergy: Peanuts",
      "Allergy: Eggs",
      "Allergy: Cow's milk",
      "Allergy: Wheat and gluten",
      "Allergy: Latex and cosmetics"
    ],
    conditions: [
      "Active Condition: Type II Diabetes",
      "Active Condition: Hypertension",
      "Active Condition: Thyroid",
      "Active Condition: Cholesterol"
    ]
  },
  vitals: {
    bp: { value: "138/88", unit: "mmHg" },
    hr: { value: "78", unit: "bpm" },
    rr: { value: "18", unit: "/min" },
    spo2: { value: "98", unit: "%" },
    temp: { value: "98.6", unit: "°F" },
    weight: { value: "72", unit: "kg" },
    bmi: { value: "24.1", unit: "kg/m²" }
  },
  tables: {
    conditions: [
      { condition: "Hypertension", status: "Active", since: "2019", notes: "On medication" },
      { condition: "Type 2 Diabetes Mellitus", status: "Active", since: "2022", notes: "Mild symptoms" },
      { condition: "Dyslipidemia", status: "Active", since: "2025", notes: "Poor glycemic control" },
      { condition: "Diabetic Neuropathy", status: "Active", since: "2021", notes: "On medication" }
    ],
    medications: [
      { name: "Amoxicillin 500mg", type: "Capsule", frequency: "1 - 1 - 1", route: "Oral", duration: "5 Days", startDate: "10 Jan 2026", prescriber: "Dr. Ashok Ranjith" },
      { name: "Lisinopril 10mg", type: "Capsule", frequency: "0 - 0 - 1", route: "Oral", duration: "7 Days", startDate: "10 Jan 2026", prescriber: "Dr. Santosh Jacob" },
      { name: "Lisinopril 10mg", type: "Capsule", frequency: "1 - 0 - 1", route: "Oral", duration: "14 Days", startDate: "10 Jan 2025", prescriber: "Dr. Palaniyappan" }
    ],
    allergies: [
      { allergy: "Penicillin", type: "Drug", severity: "Severe", reaction: "Anaphylaxis", recordedOn: "12 Jan 2022" },
      { allergy: "Egg", type: "Food", severity: "Moderate", reaction: "Rash, Itching", recordedOn: "12 Jan 2022" },
      { allergy: "Shellfish", type: "Food", severity: "Moderate", reaction: "Rash, Itching", recordedOn: "10 Jan 2025" }
    ]
  },
  clinicalJourney: {
    consultations: { last: "15 May 2026", total: "18 visits" },
    treatmentChanges: { last: "10 May 2026", total: "5 visits" },
    importantEvents: { last: "27 Apr 2026", total: "8" }
  }
};

export const usePatientProfile = (patientId) => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tab states
  const [activeConditionTab, setActiveConditionTab] = useState("Active");
  const [activeMedicationTab, setActiveMedicationTab] = useState("Current");
  const [activeAllergyTab, setActiveAllergyTab] = useState("Allergies");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!patientId) return;
      try {
        setLoading(true);
        const res = await PatientChartAPI.getPatientProfile(patientId);
        setPatientData(res.data);
      } catch (e) {
        console.error("Failed to load patient profile:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [patientId]);

  return {
    patientData,
    loading,
    tabs: {
      conditions: { active: activeConditionTab, set: setActiveConditionTab },
      medications: { active: activeMedicationTab, set: setActiveMedicationTab },
      allergies: { active: activeAllergyTab, set: setActiveAllergyTab }
    }
  };
};

export const createEncounter = async (patientId) => {
  try {
    const response = await axiosInstance.post('/encounters/start', { patientId });
    return response.data;
  } catch (error) {
    console.error("Error creating encounter", error);
    return null;
  }
};
