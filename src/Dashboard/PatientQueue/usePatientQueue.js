import { useState, useEffect, useCallback, useRef } from "react";
import DashboardAPI from "../API/dashboardAPI";

// ── Config ─────────────────────────────────────────────────────────────────

/** Number of rows shown per UI page */
const UI_PAGE_SIZE = 5;
/** Number of rows the API returns per request */
const API_PAGE_SIZE = 10;

// ── Helpers ────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${String(h).padStart(2, "0")}:${mStr} ${period}`;
};

const formatDate = (isoStr) => {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatDateForAPI = (date) => {
  const d = new Date(date);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
};

const mapAppointment = (appt) => ({
  id: `PT${String(appt.patientId).padStart(4, "0")}`,
  name: appt.patientName?.trim() ?? "—",
  sessionType: appt.type ?? "—",
  doctorName: appt.providerName ?? "—",
  status: appt.status ?? "—",
  ptType: appt.patientType ?? "—",
  dateTime: `${formatDate(appt.appointmentDate)}, ${formatTime(appt.startTime)} to ${formatTime(appt.endTime)}`,
  caseDetails: appt.reason ?? "—",
});

// ── Hook ───────────────────────────────────────────────────────────────────

const usePatientQueue = (selectedDate, onViewAll) => {
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [currentPage, setCurrentPage] = useState(1);   // UI page (5-row pages)
  const [totalPages, setTotalPages]   = useState(1);   // Total UI pages

  /**
   * Cache: maps apiPage (number) → array of 10 mapped appointments.
   * Reset whenever the selected date changes.
   */
  const cacheRef = useRef({});

  /** Which API page is needed for a given UI page? */
  const uiPageToApiPage = (uiPage) => Math.ceil(uiPage / (API_PAGE_SIZE / UI_PAGE_SIZE));

  /** Slice index within the cached API-page data for a given UI page */
  const sliceStart = (uiPage) => ((uiPage - 1) % (API_PAGE_SIZE / UI_PAGE_SIZE)) * UI_PAGE_SIZE;

  // ── Fetch a specific API page (if not already cached) ──────────────────
  const fetchApiPage = useCallback(async (date, apiPage) => {
    if (cacheRef.current[apiPage]) return; // Already cached — skip fetch

    setLoading(true);
    setError(null);
    try {
      const apptDate = formatDateForAPI(date || new Date());
      const res = await DashboardAPI.getDashboardAppointments(apptDate, apiPage);
      const raw = res.data?.data ?? [];
      cacheRef.current[apiPage] = raw.map(mapAppointment);

      // Derive total UI pages from most reliable source first
      if (res.data?.totalAppointments != null) {
        // Most reliable: total count from API header
        setTotalPages(Math.ceil(res.data.totalAppointments / UI_PAGE_SIZE));
      } else if (res.data?.totalPages != null) {
        // API-level total pages → convert to UI pages
        setTotalPages(res.data.totalPages * (API_PAGE_SIZE / UI_PAGE_SIZE));
      } else {
        // Fallback: infer from actual data returned.
        // If we got fewer records than API_PAGE_SIZE, this is the last API page.
        const recordsUpToThisPage = (apiPage - 1) * API_PAGE_SIZE + raw.length;
        setTotalPages(Math.ceil(recordsUpToThisPage / UI_PAGE_SIZE));
      }
    } catch (err) {
      setError(err?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Reset cache + reload page 1 whenever the date changes ──────────────
  useEffect(() => {
    cacheRef.current = {};
    setCurrentPage(1);
    setTotalPages(1);
    fetchApiPage(selectedDate, 1);
  }, [selectedDate, fetchApiPage]);

  // ── When the UI page changes, ensure the corresponding API page is loaded ─
  useEffect(() => {
    const apiPage = uiPageToApiPage(currentPage);
    fetchApiPage(selectedDate, apiPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // ── Derive the 5 rows to display for the current UI page ───────────────
  const apiPage  = uiPageToApiPage(currentPage);
  const cached   = cacheRef.current[apiPage] ?? [];
  const start    = sliceStart(currentPage);
  const patients = cached.slice(start, start + UI_PAGE_SIZE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewAll = () => {
    if (onViewAll) onViewAll();
    else console.log("View all patients in queue");
  };

  return {
    patients,
    loading,
    error,
    currentPage,
    totalPages,
    handlePageChange,
    handleViewAll,
    columns: [
      "Patient ID",
      "Patient Name",
      "Session Type",
      "Doctor Name",
      "Status",
      "PT Type",
      "Date & Time",
      "Case Details",
    ],
  };
};

export default usePatientQueue;
