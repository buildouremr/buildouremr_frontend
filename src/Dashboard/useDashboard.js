import { useState, useEffect } from "react";
import DashboardAPI from "./API/dashboardAPI";
import useIdleTimer from "../utils/useIdleTimer";

const useDashboard = () => {

  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);

  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.reload();
  };

  const resetActivity = useIdleTimer(
    handleLogout,
    () => setShowTimeoutModal(true)
  );

  const continueSession = () => {

    setShowTimeoutModal(false);

    resetActivity();
  };

  const fetchSummary = async (userId = 1) => {

    setSummaryLoading(true);
    setSummaryError(null);

    try {

      const res =
        await DashboardAPI.getDashboardSummary(userId);

      setSummaryData(res.data?.data ?? null);

    } catch (err) {

      setSummaryError(
        err?.message || "Failed to load summary"
      );

    } finally {

      setSummaryLoading(false);
    }
  };

  useEffect(() => {

    fetchSummary(1);

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
    showTimeoutModal,
    countdown,
    continueSession,
    fetchSummary
  };

};

export default useDashboard;