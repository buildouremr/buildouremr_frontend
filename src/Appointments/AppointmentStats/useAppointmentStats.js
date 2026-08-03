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

  let stats = [];
  if (counts) {
    const total = counts.totalAppointments ?? 0;
    const completed = counts.completedCount ?? 0;
    const pending = (counts.pendingCount ?? 0) + (counts.waitingCount ?? 0);
    const cancelled = counts.cancelledCount ?? 0;
    const noShow = counts.noShowCount ?? 0;

    const getPosPercent = (val) => {
      if (total === 0 || val === 0) return "0%";
      return "+" + Math.round((val / total) * 100) + "%";
    };

    const getNegPercent = (val) => {
      if (total === 0 || val === 0) return "0%";
      return "-" + Math.round((val / total) * 100) + "%";
    };

    stats = [
      { key: "total",     label: "Total",     value: total,     change: total > 0 ? "+100%" : "0%" },
      { key: "completed", label: "Completed", value: completed, change: getPosPercent(completed) },
      { key: "pending",   label: "Pending",   value: pending,   change: getPosPercent(pending) },
      { key: "cancelled", label: "Cancelled", value: cancelled, change: getNegPercent(cancelled) },
      { key: "noShow",    label: "No Show",   value: noShow,    change: getNegPercent(noShow) },
    ];
  }

  return { stats, counts, loading, error, fetchCounts };
};

export default useAppointmentStats;
