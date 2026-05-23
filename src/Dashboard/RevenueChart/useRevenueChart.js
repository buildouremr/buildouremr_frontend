const useRevenueChart = () => {
  const data = {
    revenueData: [
      { day: "Monday", amount: 12000 },
      { day: "Tuesday", amount: 8000 },
      { day: "Wednesday", amount: 9000 },
      { day: "Thursday", amount: 7100 },
      { day: "Friday", amount: 9600 },
      { day: "Saturday", amount: 9200 },
      { day: "Sunday", amount: 24800 },
    ],
    maxAmount: 24800,
  };

  const meth = {
    handleViewAll: () => {
      console.log("View all revenue");
    },
    formatCurrency: (amount) => {
      return "₹ " + amount.toLocaleString("en-IN");
    },
  };

  const result = { ...data, ...meth };
  return result;
};

export default useRevenueChart;
