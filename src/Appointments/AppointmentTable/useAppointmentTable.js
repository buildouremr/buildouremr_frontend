import { useState, useEffect, useCallback } from "react";
import AppointmentsAPI from "../API/appointmentsAPI";

const TABS = ["All Appointments", "Pending", "Completed", "Cancelled", "No Show"];

const useAppointmentTable = () => {
  const [appointments, setAppointments]       = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [activeTab, setActiveTab]             = useState("All Appointments");
  const [searchQuery, setSearchQuery]         = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);   // detail panel data
  const [detailLoading, setDetailLoading]     = useState(false);
  const [selectedApptId, setSelectedApptId]   = useState(null);   // which row is highlighted

  // ── 1. Fetch appointment list on mount ──────────────────────────
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem("userId") || 1;
      const res = await AppointmentsAPI.getAppointments(userId);
      const list = res.data?.data ?? [];
      setAppointments(list);

      // Auto-select the first row
      if (list.length > 0) {
        fetchPatientDetails(list[0].patientId, true);
        setSelectedApptId(list[0].patientId);
      }
    } catch (err) {
      setError(err?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // ── 2. Fetch patient detail panel ───────────────────────────────
  const fetchPatientDetails = async (appointmentId, silent = false) => {
    if (!silent) setDetailLoading(true);
    try {
      const res = await AppointmentsAPI.getAppointmentPatientDetails(appointmentId);
      setSelectedPatient(res.data?.data ?? null);
    } catch (err) {
      console.error("Failed to load patient details:", err);
      setSelectedPatient(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // ── 3. Filtered + searched appointments ─────────────────────────
  const filteredAppointments = (() => {
    let list = appointments;

    if (activeTab === "Pending")
      list = list.filter((a) => a.status === "Pending" || a.status === "Waiting");
    else if (activeTab === "Completed")
      list = list.filter((a) => a.status === "Completed");
    else if (activeTab === "Cancelled")
      list = list.filter((a) => a.status === "Cancelled");
    else if (activeTab === "No Show")
      list = list.filter((a) => a.status === "No Show");

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((a) =>
        (a.patientName || "").toLowerCase().includes(q)
      );
    }

    return list;
  })();

  // Tab counts derived from the full list
  const tabCounts = {
    "All Appointments": appointments.length,
    "Pending":   appointments.filter((a) => a.status === "Pending" || a.status === "Waiting").length,
    "Completed": appointments.filter((a) => a.status === "Completed").length,
    "Cancelled": appointments.filter((a) => a.status === "Cancelled").length,
    "No Show":   appointments.filter((a) => a.status === "No Show").length,
  };

  // ── Handlers ─────────────────────────────────────────────────────
  const handleSelectPatient = (appt) => {
    setSelectedApptId(appt.patientId);
    fetchPatientDetails(appt.patientId);
  };

  const handleClosePanel  = () => { setSelectedPatient(null); setSelectedApptId(null); };
  const handleTabChange   = (tab) => { setActiveTab(tab); setSearchQuery(""); };
  const handleSearchChange = (q) => setSearchQuery(q);
  const handleStartConsultation = (appt) => console.log("Start consultation:", appt.patientId);

  const data = {
    appointments,
    filteredAppointments,
    tabs: TABS,
    tabCounts,
    activeTab,
    selectedPatient,
    selectedApptId,
    loading,
    detailLoading,
    error,
    searchQuery,
  };

  const meth = {
    handleTabChange,
    handleSelectPatient,
    handleClosePanel,
    handleSearchChange,
    handleStartConsultation,
    fetchAppointments,
  };

  return { ...data, ...meth };
};

export default useAppointmentTable;
