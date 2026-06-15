import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import AppointmentsAPI from "../API/appointmentsAPI";

const TABS = ["All Appointments", "Pending", "Completed", "Cancelled", "No Show"];

/** Number of records the API returns per request (must not change) */
const API_PAGE_SIZE = 10;

/** Format a Date object to "YYYY-MM-DD" for the API */
const formatDateForAPI = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Given a list of appointments (sorted by startTime, e.g. "08:00"),
 * find the best one to auto-select based on current local time.
 */
const pickAutoSelectAppt = (list) => {
  if (!list || list.length === 0) return null;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const toMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const sorted = [...list].sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
  const nextAppt = sorted.find((a) => toMinutes(a.startTime) > nowMinutes);
  return nextAppt ?? sorted[sorted.length - 1];
};

/**
 * Which API page index (1-based) contains a given global record index?
 * Global index is 0-based.
 */
const globalIdxToApiPage = (idx) => Math.floor(idx / API_PAGE_SIZE) + 1;

const useAppointmentTable = ({
  selectedDate,
  currentPage,
  onPageChange,
  externalActiveTab,
  rowsPerPage, // Dynamic — driven by container height measurement
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(externalActiveTab || "All Appointments");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedApptId, setSelectedApptId] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);

  /**
   * Cache maps apiPage (number) → array of up to API_PAGE_SIZE raw appointment objects.
   * Reset on date change.
   */
  const cacheRef = useRef({});

  // Sync activeTab when an external filter is pushed (from stats card click)
  useEffect(() => {
    if (externalActiveTab && externalActiveTab !== activeTab) {
      setActiveTab(externalActiveTab);
      setSearchQuery("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalActiveTab]);

  // ── Fetch patient detail panel ────────────────────────────────────
  const fetchPatientDetails = useCallback(async (patientId, silent = false) => {
    if (!patientId) return;
    if (!silent) setDetailLoading(true);
    try {
      const res = await AppointmentsAPI.getAppointmentPatientDetails(patientId);
      setSelectedPatient(res.data?.data ?? null);
    } catch (err) {
      console.error("Failed to load patient details:", err);
      setSelectedPatient(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  // ── Fetch a specific API page (if not already cached) ─────────────
  const fetchApiPage = useCallback(async (date, apiPage) => {
    if (cacheRef.current[apiPage]) return; // Already cached — skip fetch

    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem("userId") || 1;
      const apptDate = formatDateForAPI(date || new Date());
      const res = await AppointmentsAPI.getAppointments(userId, apptDate, apiPage);
      const list = res.data?.data ?? [];

      // Store this batch in cache
      cacheRef.current[apiPage] = list;

      // Determine total record count from the most reliable source
      if (res.data?.totalAppointments != null) {
        setTotalRecords(res.data.totalAppointments);
      } else if (res.data?.totalPages != null) {
        setTotalRecords(res.data.totalPages * API_PAGE_SIZE);
      } else {
        // Fallback: infer from returned data size
        const recordsUpToNow = (apiPage - 1) * API_PAGE_SIZE + list.length;
        setTotalRecords((prev) => Math.max(prev, recordsUpToNow));
      }

      // Auto-select the next upcoming appointment from the first API page
      if (apiPage === 1 && list.length > 0) {
        const autoSelected = pickAutoSelectAppt(list);
        const id = autoSelected?.apptId ?? list[0].apptId;
        setSelectedApptId(id);
        fetchPatientDetails(id, true);
      } else if (apiPage === 1 && list.length === 0) {
        setSelectedPatient(null);
        setSelectedApptId(null);
      }
    } catch (err) {
      setError(err?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [fetchPatientDetails]);

  // ── Reset cache + reload API page 1 whenever date changes ─────────
  useEffect(() => {
    cacheRef.current = {};
    setTotalRecords(0);
    onPageChange(1);
    fetchApiPage(selectedDate, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // ── Build the full list from cached API pages (all fetched so far) ─
  const allCachedAppointments = useMemo(() => {
    const pages = Object.keys(cacheRef.current)
      .map(Number)
      .sort((a, b) => a - b);
    return pages.flatMap((p) => cacheRef.current[p] ?? []);
    // We want this to recompute whenever cache changes — we'll call it
    // inside the render-time derivation below after each fetch.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]); // Re-derive whenever a fetch completes (loading toggles)

  // ── When UI page changes, ensure the required API page is loaded ───
  const safeRowsPerPage = Math.max(rowsPerPage || API_PAGE_SIZE, 1);

  useEffect(() => {
    // Determine which global record indices are needed for this UI page
    const startGlobalIdx = (currentPage - 1) * safeRowsPerPage;
    const endGlobalIdx   = startGlobalIdx + safeRowsPerPage - 1;

    const startApiPage = globalIdxToApiPage(startGlobalIdx);
    const endApiPage   = globalIdxToApiPage(endGlobalIdx);

    for (let p = startApiPage; p <= endApiPage; p++) {
      fetchApiPage(selectedDate, p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, safeRowsPerPage]);

  // ── Apply tab filter + search to full cached list ──────────────────
  const filteredAppointments = useMemo(() => {
    let list = allCachedAppointments;

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
  }, [allCachedAppointments, activeTab, searchQuery]);

  // ── UI-level pagination derived values ─────────────────────────────
  /**
   * Total UI pages = total record count / rowsPerPage.
   * For filtered views we use the filtered count (since we have all cached records).
   */
  const effectiveTotalRecords =
    activeTab === "All Appointments" && !searchQuery.trim()
      ? Math.max(totalRecords, filteredAppointments.length)
      : filteredAppointments.length;

  const totalPages = Math.max(1, Math.ceil(effectiveTotalRecords / safeRowsPerPage));

  /** Records to display for the current UI page */
  const startIdx = (currentPage - 1) * safeRowsPerPage;
  const pageAppointments = filteredAppointments.slice(startIdx, startIdx + safeRowsPerPage);

  // Tab counts derived from the full cached list
  const appointments = allCachedAppointments;
  const tabCounts = {
    "All Appointments": appointments.length,
    "Pending": appointments.filter((a) => a.status === "Pending" || a.status === "Waiting").length,
    "Completed": appointments.filter((a) => a.status === "Completed").length,
    "Cancelled": appointments.filter((a) => a.status === "Cancelled").length,
    "No Show": appointments.filter((a) => a.status === "No Show").length,
  };

  // ── Handlers ───────────────────────────────────────────────────────
  const handleSelectPatient = (appt) => {
    const id = appt.apptId;
    setSelectedApptId(id);
    fetchPatientDetails(id);
  };

  const handleClosePanel = () => { setSelectedPatient(null); setSelectedApptId(null); };
  const handleTabChange = (tab) => { setActiveTab(tab); setSearchQuery(""); onPageChange(1); };
  const handleSearchChange = (q) => { setSearchQuery(q); onPageChange(1); };
  const handleStartConsultation = (appt) => console.log("Start consultation:", appt.patientId);

  return {
    appointments,
    filteredAppointments,
    pageAppointments,
    tabs: TABS,
    tabCounts,
    activeTab,
    selectedPatient,
    selectedApptId,
    loading,
    detailLoading,
    error,
    searchQuery,
    currentPage,
    totalPages,
    handleTabChange,
    handleSelectPatient,
    handleClosePanel,
    handleSearchChange,
    handleStartConsultation,
    fetchAppointments: () => fetchApiPage(selectedDate, 1),
    onPageChange,
  };
};

export default useAppointmentTable;
