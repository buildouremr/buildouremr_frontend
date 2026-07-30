import { useState, useEffect, useCallback } from "react";
import AppointmentsAPI from "../API/appointmentsAPI";

/** Format a Date object → "YYYY-MM-DD" */
const formatDate = (date) => {
  const d = new Date(date);
  const year  = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day   = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const useAppointmentStats = (selectedDate, refreshKey) => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = sessionStorage.getItem("userId");
      const dateStr = selectedDate ? formatDate(selectedDate) : null;
      const res = await AppointmentsAPI.getAppointmentStatusCounts(userId, dateStr);
      setCounts(res.data?.data ?? null);
    } catch (err) {
      setError(err?.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  // Re-fetch when date changes OR after a new appointment is booked (refreshKey bumps)
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts, refreshKey]);

  // Build the stats array from API keys
  const stats = counts
    ? [
        { key: "total",     label: "Total",     value: counts.totalAppointments ?? 0 },
        { key: "completed", label: "Completed",  value: counts.completedCount    ?? 0 },
        { key: "pending",   label: "Pending",    value: (counts.pendingCount ?? 0) + (counts.waitingCount ?? 0) },
        { key: "cancelled", label: "Cancelled",  value: counts.cancelledCount    ?? 0 },
        { key: "noShow",    label: "No Show",    value: counts.noShowCount       ?? 0 },
      ]
    : [];

  return { stats, counts, loading, error, fetchCounts };
};

export default useAppointmentStats;
