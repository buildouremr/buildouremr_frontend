const useStatsCards = (summaryData) => {
  const total = summaryData?.totalAppointments || 0;
  const pending = summaryData?.pendingCount || 0;
  const cancelled = summaryData?.cancelledCount || 0;

  const pendingPercent = total > 0 ? Math.round((pending / total) * 100) : 0;
  const cancelledPercent = total > 0 ? Math.round((cancelled / total) * 100) : 0;

  const data = {
    stats: [
      {
        title: "Total Appointments",
        value: summaryData?.totalAppointments ?? 0,
        change: total > 0 ? "+100%" : "0%",
        color: "#2E7DF7",
        bgColor: "#E8F0FF",
        iconType: "appointments",
      },
      {
        title: "Pending Patients",
        value: summaryData?.pendingCount ?? 0,
        change: total > 0 ? `+${pendingPercent}%` : "0%",
        color: "#FF6B35",
        bgColor: "#FFF0E8",
        iconType: "pending",
      },
      {
        title: "Cancelled Appointments",
        value: summaryData?.cancelledCount ?? 0,
        change: total > 0 ? `-${cancelledPercent}%` : "0%",
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
