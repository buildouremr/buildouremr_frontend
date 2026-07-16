const usePatientsChart = () => {
  const data = {
    totalPatients: 528,
    chartData: [
      { day: "Mon", newPatients: 30, oldPatients: 20 },
      { day: "Tue", newPatients: 35, oldPatients: 25 },
      { day: "Wed", newPatients: 65, oldPatients: 45 },
      { day: "Thu", newPatients: 90, oldPatients: 60 },
      { day: "Fri", newPatients: 50, oldPatients: 35 },
      { day: "Sat", newPatients: 85, oldPatients: 55 },
      { day: "Sun", newPatients: 70, oldPatients: 40 },
    ],
  };

  const meth = {
    handleViewAll: () => {
      // TODO: View all patients chart
    },
  };

  const result = { ...data, ...meth };
  return result;
};

export default usePatientsChart;
