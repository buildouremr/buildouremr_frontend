import { useState, useEffect } from "react";

const useSidebar = (initialMenu = "Dashboard", onMenuChange, summaryData) => {
  const [activeMenu, setActiveMenu] = useState(initialMenu);

  // Sync internal state whenever the parent-controlled prop changes
  // (e.g., when a Dashboard stat card navigates to Appointments)
  useEffect(() => {
    setActiveMenu(initialMenu);
  }, [initialMenu]);

  const apptsCount = summaryData?.totalAppointments ?? "0";

  const mainMenuItems = [
    { name: "Dashboard", icon: "dashboard" },
    { name: "Appointments", icon: "calendar", badge: apptsCount.toString() },
    { name: "Patients", icon: "people" },
    { name: "Doctors", icon: "medical" },
    { name: "Laboratory", icon: "science", tag: "Beta", tagColor: "#28a745" },
    { name: "Pharmacy", icon: "pharmacy", tag: "New", tagColor: "#e74c3c" },
    { name: "Staffs", icon: "groups" },
    { name: "Settings", icon: "settings" },
  ];

  const helpMenuItems = [
    { name: "Documentation", icon: "document" },
    { name: "Changelog", icon: "changelog", badge: "+10" },
    { name: "Multilevel", icon: "layers", hasArrow: true },
  ];

  const data = {
    activeMenu,
    mainMenuItems,
    helpMenuItems,
  };

  const meth = {
    handleMenuClick: (menu) => {
      setActiveMenu(menu);
      onMenuChange && onMenuChange(menu);
    },
  };

  const result = { ...data, ...meth };
  return result;
};

export default useSidebar;