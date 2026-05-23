const useStatsCards = (summaryData) => {
  const total = summaryData?.totalAppointments || 0;
  const waiting = summaryData?.waitingCount || 0;
  const cancelled = summaryData?.cancelledCount || 0;

  const waitingPercent = total > 0 ? Math.round((waiting / total) * 100) : 0;
  const cancelledPercent = total > 0 ? Math.round((cancelled / total) * 100) : 0;

  const data = {
    stats: [
      {
        title: "Waiting Patients",
        value: summaryData?.waitingCount ?? 0,
        change: total > 0 ? `+${waitingPercent}%` : "0%",
        color: "#FF6B35",
        bgColor: "#FFF0E8",
        iconType: "waiting",
      },
      {
        title: "Total Appointments",
        value: summaryData?.totalAppointments ?? 0,
        change: total > 0 ? "+100%" : "0%",
        color: "#2E7DF7",
        bgColor: "#E8F0FF",
        iconType: "appointments",
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
