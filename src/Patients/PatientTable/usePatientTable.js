import { useState, useEffect, useMemo } from "react";
import PatientsAPI from "../API/PatientsAPI";

const TABS = ["All Patients", "My Patients", "Active Patients", "Inactive Patients"];

const usePatientTable = ({ rowsPerPage, refreshTrigger }) => {
  const [patients, setPatients] = useState([]);
  const [chronicDiseases, setChronicDiseases] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All Patients");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPatientsAndDiseases = async () => {
    setLoading(true);
    setError(null);
    try {
      const [patientsRes, diseasesRes] = await Promise.all([
        PatientsAPI.getAllPatients(),
        PatientsAPI.getChronicDiseases()
      ]);
      setPatients(patientsRes.data?.data ?? []);
      const diseases = diseasesRes.data?.data ?? [];
      setChronicDiseases(diseases.map(d => ({ value: d.chronicDiseaseName, label: d.chronicDiseaseName })));
    } catch (err) {
      setError(err?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientsAndDiseases();
  }, [refreshTrigger]);

  const filteredPatients = useMemo(() => {
    let list = patients;

    if (activeTab === "Inactive Patients") {
      list = list.filter((p) => !p.patientRegistrationActive);
    } else if (activeTab === "Active Patients") {
      list = list.filter((p) => p.patientRegistrationActive);
    } else if (activeTab === "My Patients") {
      const loggedInUserId = Number(sessionStorage.getItem("userId"));
      list = list.filter((p) => Number(p.principalDoctorId) === loggedInUserId);
    }

    if (selectedDiseases.length > 0) {
      list = list.filter((p) => selectedDiseases.includes(p.patientRegistrationChronic));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => {
        const fullName = [p.patientRegistrationFirstName, p.patientRegistrationMiddleName, p.patientRegistrationLastName]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return (
          fullName.includes(q) ||
          (p.patientRegistrationMobileNo && p.patientRegistrationMobileNo.includes(q)) ||
          (p.patientRegistrationEmailId && p.patientRegistrationEmailId.includes(q)) ||
          `pt00${p.patientRegistrationId}`.includes(q)
        );
      });
    }
    return list;
  }, [patients, activeTab, searchQuery, selectedDiseases]);

  const safeRowsPerPage = Math.max(rowsPerPage || 10, 1);
  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / safeRowsPerPage));
  const startIdx = (currentPage - 1) * safeRowsPerPage;
  const pagePatients = filteredPatients.slice(startIdx, startIdx + safeRowsPerPage);

  const loggedInUserId = Number(sessionStorage.getItem("userId"));

  const tabCounts = {
    "All Patients": patients.length,
    "My Patients": patients.filter((p) => Number(p.principalDoctorId) === loggedInUserId).length,
    "Active Patients": patients.filter((p) => p.patientRegistrationActive).length,
    "Inactive Patients": patients.filter((p) => !p.patientRegistrationActive).length,
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSearchChange = (q) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1) return;
    setCurrentPage(page);
  };

  return {
    patients,
    filteredPatients,
    pagePatients,
    chronicDiseases,
    selectedDiseases,
    setSelectedDiseases,
    tabs: TABS,
    tabCounts,
    activeTab,
    loading,
    error,
    searchQuery,
    currentPage,
    totalPages,
    handleTabChange,
    handleSearchChange,
    handlePageChange,
  };
};

export default usePatientTable;
