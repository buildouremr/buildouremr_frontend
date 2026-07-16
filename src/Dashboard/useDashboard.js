import { useState, useEffect, useCallback } from "react";
import DashboardAPI from "./API/dashboardAPI";
import useIdleTimer from "../utils/useIdleTimer";

/** Format Date → "YYYY-MM-DD" */
const formatDateForAPI = (date) => {
  const d = new Date(date);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
};

const getTodayDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const useDashboard = () => {

  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);

  /** Selected date drives both getSummary and PatientQueue */
  const [selectedDate, setSelectedDate] = useState(getTodayDate);

  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const handleLogout = () => {
    window.dispatchEvent(new Event("session-expired"));
  };

  const resetActivity = useIdleTimer(
    handleLogout,
    () => setShowTimeoutModal(true)
  );

  const continueSession = () => {
    setShowTimeoutModal(false);
    resetActivity();
  };

  const fetchSummary = useCallback(async (date) => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const userId = sessionStorage.getItem("userId");
      const res = await DashboardAPI.getDashboardSummary(userId, date);
      setSummaryData(res.data?.data ?? null);
    } catch (err) {
      setSummaryError(err?.message || "Failed to load summary");
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  /** Re-fetch whenever selectedDate changes */
  useEffect(() => {
    fetchSummary(formatDateForAPI(selectedDate));
  }, [selectedDate, fetchSummary]);

  const handleDateChange = useCallback((newDate) => {
    setSelectedDate(newDate);
  }, []);

  useEffect(() => {
    let interval;
    if (showTimeoutModal) {
      setCountdown(60);
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showTimeoutModal]);

  return {
    summaryData,
    summaryLoading,
    summaryError,
    selectedDate,
    handleDateChange,
    showTimeoutModal,
    countdown,
    continueSession,
    fetchSummary,
  };

};

export default useDashboard;