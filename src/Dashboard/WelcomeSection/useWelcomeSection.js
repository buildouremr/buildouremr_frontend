const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const formatHeaderDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const useWelcomeSection = (summaryData, summaryLoading, selectedDate) => {
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
    formattedDate: formatHeaderDate(selectedDate),
  };

  return data;
};

export default useWelcomeSection;
