const usePriorityCenter = () => {
  const data = {
    priorities: [
      {
        id: 1,
        title: "Waiting Patients",
        icon: "WP",
        iconBg: "#E8F0FF",
        iconColor: "#2E7DF7",
      },
      {
        id: 2,
        title: "Follow up dues",
        icon: "FU",
        iconBg: "#FFE8E8",
        iconColor: "#E74C3C",
      },
      {
        id: 3,
        title: "Lab Results to Review",
        icon: "LR",
        iconBg: "#FFF8E1",
        iconColor: "#F9A825",
      },
      {
        id: 4,
        title: "No Show",
        icon: "NS",
        iconBg: "#FFF8E1",
        iconColor: "#F9A825",
      },
    ],
  };

  const meth = {
    handleView: (id) => {
      // TODO: View priority item id
    },
  };

  const result = { ...data, ...meth };
  return result;
};

export default usePriorityCenter;
