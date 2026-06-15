const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const formatHeaderDate = (d) =>
  `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

/**
 * Accepts external date state from parent (Appointments.jsx)
 * so the header and table stay in sync.
 */
const useAppointmentHeader = ({ selectedDate, onDateChange, onNewAppointment }) => {
  const data = {
    formattedDate: formatHeaderDate(selectedDate),
  };

  const meth = {
    handlePrev: () => {
      const next = new Date(selectedDate);
      next.setDate(next.getDate() - 1);
      onDateChange(next);
    },
    handleNext: () => {
      const next = new Date(selectedDate);
      next.setDate(next.getDate() + 1);
      onDateChange(next);
    },
    /** dateStr comes from <input type="date"> as "YYYY-MM-DD" */
    handleDateChange: (dateStr) => {
      if (!dateStr) return;
      const [year, month, day] = dateStr.split("-").map(Number);
      onDateChange(new Date(year, month - 1, day));
    },
    handleNewAppointment: () => {
      if (onNewAppointment) onNewAppointment();
    },
  };

  return { ...data, ...meth };
};

export default useAppointmentHeader;
