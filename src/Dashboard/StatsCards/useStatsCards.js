const useStatsCards = (summaryData) => {
  const total = summaryData?.totalAppointments || 0;
  const pending = summaryData?.pendingCount || 0;
  const cancelled = summaryData?.cancelledCount || 0;

  const getPosPercent = (val) => {
    if (total === 0 || val === 0) return "0%";
    return "+" + Math.round((val / total) * 100) + "%";
  };

  const getNegPercent = (val) => {
    if (total === 0 || val === 0) return "0%";
    return "-" + Math.round((val / total) * 100) + "%";
  };

  const data = {
    stats: [
      {
        title: "Total Appointments",
        value: total,
        change: total > 0 ? "+100%" : "0%",
        color: "#2E7DF7",
        bgColor: "#E8F0FF",
        iconType: "appointments",
      },
      {
        title: "Pending Patients",
        value: pending,
        change: getPosPercent(pending),
        color: "#FF6B35",
        bgColor: "#FFF0E8",
        iconType: "pending",
      },
      {
        title: "Cancelled Appointments",
        value: cancelled,
        change: getNegPercent(cancelled),
        color: "#E74C3C",
        bgColor: "#FFE8E8",
        iconType: "cancelled",
      },
    ],
  };

  const meth = {};

  const result = { ...data, ...meth };
  return result;
};

export default useStatsCards;
