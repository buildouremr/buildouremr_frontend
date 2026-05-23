import { useState } from "react";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const formatHeaderDate = (d) =>
  `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

const useAppointmentHeader = () => {
  const [currentDate, setCurrentDate] = useState(new Date("2026-05-10"));

  const data = {
    formattedDate: formatHeaderDate(currentDate),
  };

  const meth = {
    handlePrev: () => {
      setCurrentDate((d) => {
        const next = new Date(d);
        next.setDate(next.getDate() - 1);
        return next;
      });
    },
    handleNext: () => {
      setCurrentDate((d) => {
        const next = new Date(d);
        next.setDate(next.getDate() + 1);
        return next;
      });
    },
    handleDateChange: (dateStr) => {
      if (!dateStr) return;
      setCurrentDate(new Date(dateStr));
    },
    handleNewAppointment: () => console.log("New appointment"),
  };

  const result = { ...data, ...meth };
  return result;
};

export default useAppointmentHeader;
