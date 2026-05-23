import { useState, useEffect } from "react";
import DashboardAPI from "../API/dashboardAPI";

// ── Helpers ────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Convert a 24-hour "HH:mm" string to "hh:mm AM/PM".
 * "00:xx" → "12:xx AM", "12:xx" → "12:xx PM", "13:xx" → "01:xx PM"
 */
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${String(h).padStart(2, "0")}:${mStr} ${period}`;
};

/**
 * Format an ISO date string to "DD Mon YYYY" e.g. "03 May 2026".
 */
const formatDate = (isoStr) => {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

/**
 * Map a raw appointment object from the API to the shape the UI expects.
 */
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

const usePatientQueue = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const data = {
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
    patients,
    loading,
    error,
  };

  const meth = {
    fetchAppointments: async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await DashboardAPI.getDashboardAppointments();
        const raw = res.data?.data ?? [];
        setPatients(raw.map(mapAppointment));
      } catch (err) {
        setError(err?.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    },

    handleViewAll: () => {
      console.log("View all patients in queue");
    },
  };

  useEffect(() => {
    meth.fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const result = { ...data, ...meth };
  return result;
};

export default usePatientQueue;
