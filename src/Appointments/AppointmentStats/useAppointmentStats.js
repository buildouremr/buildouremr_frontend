import { useState, useEffect } from "react";
import AppointmentsAPI from "../API/appointmentsAPI";

const useAppointmentStats = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem("userId") || 1;
      const res = await AppointmentsAPI.getAppointmentStatusCounts(userId);
      setCounts(res.data?.data ?? null);
    } catch (err) {
      setError(err?.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const data = { stats, counts, loading, error };
  const meth = { fetchCounts };

  return { ...data, ...meth };
};

export default useAppointmentStats;
