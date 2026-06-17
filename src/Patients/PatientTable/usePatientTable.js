import { useState, useEffect, useMemo } from "react";
import PatientsAPI from "../API/PatientsAPI";

const TABS = ["All Patients", "My Patients", "Active Patients", "Inactive Patients"];

const usePatientTable = ({ rowsPerPage }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All Patients");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await PatientsAPI.getAllPatients();
      setPatients(res.data?.data ?? []);
    } catch (err) {
      setError(err?.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    let list = patients;

    if (activeTab === "Inactive Patients") {
      list = list.filter((p) => !p.patientRegistrationActive);
    } else if (activeTab === "Active Patients") {
      list = list.filter((p) => p.patientRegistrationActive);
    } else if (activeTab === "My Patients") {
      const loggedInUserId = Number(localStorage.getItem("userId"));
      list = list.filter((p) => Number(p.principalDoctorId) === loggedInUserId);
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
  }, [patients, activeTab, searchQuery]);

  const safeRowsPerPage = Math.max(rowsPerPage || 10, 1);
  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / safeRowsPerPage));
  const startIdx = (currentPage - 1) * safeRowsPerPage;
  const pagePatients = filteredPatients.slice(startIdx, startIdx + safeRowsPerPage);

  const loggedInUserId = Number(localStorage.getItem("userId"));

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
