import { useState, useEffect, useMemo } from "react";
import PatientChartAPI from "../API/patientChartAPI";
import axiosInstance from "../../utils/useAPIClient";

const ITEMS_PER_PAGE = 5;

export const usePatientProfile = (patientId) => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tab states
  const [activeConditionTab, setActiveConditionTab] = useState("Active");
  const [activeMedicationTab, setActiveMedicationTab] = useState("Current");
  const [activeAllergyTab, setActiveAllergyTab] = useState("Allergies");

  // Pagination states
  const [conditionsPage, setConditionsPage] = useState(1);
  const [medicationsPage, setMedicationsPage] = useState(1);
  const [allergiesPage, setAllergiesPage] = useState(1);

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

  useEffect(() => {
    fetchProfile();
  }, [patientId]);

  // Reset pagination when tabs change
  useEffect(() => { setConditionsPage(1); }, [activeConditionTab]);
  useEffect(() => { setMedicationsPage(1); }, [activeMedicationTab]);
  useEffect(() => { setAllergiesPage(1); }, [activeAllergyTab]);

  // ─── Derived filtered data ──────────────────────────────────────

  const activeConditions = useMemo(() => {
    if (!patientData?.tables?.conditions) return [];
    return patientData.tables.conditions.filter(
      (c) => c.status && c.status.toLowerCase() === "active"
    );
  }, [patientData]);

  const resolvedConditions = useMemo(() => {
    if (!patientData?.tables?.conditions) return [];
    return patientData.tables.conditions.filter(
      (c) => c.status && c.status.toLowerCase() !== "active"
    );
  }, [patientData]);

  const currentMedications = useMemo(() => {
    if (!patientData?.tables?.medications) return [];
    return patientData.tables.medications.filter((m) => m.status === true);
  }, [patientData]);

  const recentChangeMedications = useMemo(() => {
    // No recent changes data available yet — return empty
    return [];
  }, [patientData]);

  const allergyItems = useMemo(() => {
    if (!patientData?.tables?.allergies) return [];
    return patientData.tables.allergies;
  }, [patientData]);

  // ─── Paginated slices ──────────────────────────────────────────

  const paginateItems = (items, page) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  };

  const getTotalPages = (items) => {
    return Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  };

  // Get the current tab's data for conditions
  const currentConditionData = activeConditionTab === "Active" ? activeConditions : resolvedConditions;
  const paginatedConditions = paginateItems(currentConditionData, conditionsPage);
  const conditionsTotalPages = getTotalPages(currentConditionData);

  // Get the current tab's data for medications
  const currentMedicationData = activeMedicationTab === "Current" ? currentMedications : recentChangeMedications;
  const paginatedMedications = paginateItems(currentMedicationData, medicationsPage);
  const medicationsTotalPages = getTotalPages(currentMedicationData);

  // Allergies
  const paginatedAllergies = paginateItems(allergyItems, allergiesPage);
  const allergiesTotalPages = getTotalPages(allergyItems);

  return {
    patientData,
    loading,
    refetch: fetchProfile,
    tabs: {
      conditions: { active: activeConditionTab, set: setActiveConditionTab },
      medications: { active: activeMedicationTab, set: setActiveMedicationTab },
      allergies: { active: activeAllergyTab, set: setActiveAllergyTab }
    },
    pagination: {
      conditions: {
        items: paginatedConditions,
        allItems: currentConditionData,
        page: conditionsPage,
        totalPages: conditionsTotalPages,
        setPage: setConditionsPage,
        totalCount: currentConditionData.length
      },
      medications: {
        items: paginatedMedications,
        allItems: currentMedicationData,
        page: medicationsPage,
        totalPages: medicationsTotalPages,
        setPage: setMedicationsPage,
        totalCount: currentMedicationData.length
      },
      allergies: {
        items: paginatedAllergies,
        allItems: allergyItems,
        page: allergiesPage,
        totalPages: allergiesTotalPages,
        setPage: setAllergiesPage,
        totalCount: allergyItems.length
      }
    },
    counts: {
      activeConditions: activeConditions.length,
      resolvedConditions: resolvedConditions.length,
      currentMedications: currentMedications.length,
      recentChangeMedications: recentChangeMedications.length,
      allergies: allergyItems.length
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
