import { useState } from "react";

const useWelcomeSection = (summaryData, summaryLoading) => {
  const [activeFilter, setActiveFilter] = useState("Today");

  // Build display name: prepend "Dr. " only when role is Doctor
  const buildDisplayName = () => {
    if (!summaryData) return "—";
    const prefix = summaryData.role === "Doctor" ? "Dr. " : "";
    return `${prefix}${summaryData.employeeName}`;
  };

  const data = {
    doctorName: buildDisplayName(),
    visitCount: summaryData?.totalAppointments ?? "—",
    summaryLoading,
    filterOptions: ["Today", "1d", "2d", "3d", "1W"],
    activeFilter,
  };

  const meth = {
    handleFilterChange: (filter) => setActiveFilter(filter),
  };

  const result = { ...data, ...meth };
  return result;
};

export default useWelcomeSection;
