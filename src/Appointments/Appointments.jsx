import { useState, useCallback } from "react";
import AppointmentHeader from "./AppointmentHeader/AppointmentHeader";
import AppointmentStats from "./AppointmentStats/AppointmentStats";
import AppointmentTable from "./AppointmentTable/AppointmentTable";
import NewAppointmentModal from "./NewAppointmentModal/NewAppointmentModal";
import { useToast } from "../components/Toast/Toast";

/** Always midnight local today */
const getTodayDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const Appointments = ({ initialFilter }) => {
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(getTodayDate);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(initialFilter || "All Appointments");
  const [refreshKey, setRefreshKey] = useState(0);

  /** Called when the header date-navigator changes the date */
  const handleDateChange = useCallback((newDate) => {
    setSelectedDate(newDate);
    setCurrentPage(1);
  }, []);

  /** Called when a pagination button is clicked */
  const handlePageChange = useCallback((page) => {
    if (page < 1) return;
    setCurrentPage(page);
  }, []);

  /** Called when "View next day's schedule" is clicked — go forward 1 day */
  const handleNextDay = useCallback(() => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
    setCurrentPage(1);
  }, [selectedDate]);

  /** Called when a stats card is clicked */
  const handleFilterSelect = useCallback((tab) => {
    setActiveFilter(tab);
  }, []);

  /** Called when appointment is successfully booked */
  const handleBookingSuccess = useCallback(() => {
    setIsModalOpen(false);
    setRefreshKey((k) => k + 1);
    showToast({
      type: "success",
      title: "Appointment Scheduled",
      message: "You have successfully created an appointment.",
    });
  }, [showToast]);

  /** Called when appointment booking fails */
  const handleBookingError = useCallback((msg) => {
    showToast({
      type: "error",
      title: "Booking Failed",
      message: msg || "Failed to book the appointment. Please try again.",
    });
  }, [showToast]);

  return (
    <>
      <div className="appt-page">
        <AppointmentHeader
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onNewAppointment={() => setIsModalOpen(true)}
        />
        <AppointmentStats
          selectedDate={selectedDate}
          onFilterSelect={handleFilterSelect}
          refreshKey={refreshKey}
        />
        <AppointmentTable
          selectedDate={selectedDate}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onNextDay={handleNextDay}
          externalActiveTab={activeFilter}
          onExternalTabConsumed={() => {}}
          refreshKey={refreshKey}
        />
      </div>

      {isModalOpen && (
        <NewAppointmentModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleBookingSuccess}
          onError={handleBookingError}
        />
      )}

      <style>{`
        .appt-page {
          flex: 1;
          overflow: hidden;
          background: #f5f7fa;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
      `}</style>
    </>
  );
};

export default Appointments;
