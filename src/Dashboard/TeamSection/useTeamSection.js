import { useState, useEffect } from "react";
import DashboardAPI from "../API/dashboardAPI";

// Build a full display name from the three name fields, skipping empty parts
const buildFullName = (member) => {
  const parts = [
    member.employeeFirstName,
    member.getEmployeeMiddleName,
    member.employeeLastName,
  ].filter((p) => p && p.trim() !== "");
  return parts.join(" ") || "—";
};

// Map a raw API record to the shape TeamSection.jsx expects
const mapMember = (m) => ({
  id: m.employeeProfileId,
  name: buildFullName(m),
  specialty: m.employeeSpeciality ?? "—",
  // API doesn't return a status field yet — default to Available
  status: m.employeeIsActive ? "Available" : "Unavailable",
  avatar: m.employeeImage || null,
});

const useTeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const data = {
    teamMembers,
    loading,
    error,
  };

  const meth = {
    fetchTeamList: async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem("userId");
        const res = await DashboardAPI.getTeamList(userId);
        const raw = res.data?.data ?? [];
        setTeamMembers(raw.map(mapMember));
      } catch (err) {
        setError(err?.message || "Failed to load team");
      } finally {
        setLoading(false);
      }
    },

    handleViewAll: () => {
      console.log("View all team members");
    },

    handleChat: (id) => {
      console.log("Open chat with:", id);
    },
  };

  useEffect(() => {
    meth.fetchTeamList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const result = { ...data, ...meth };
  return result;
};

export default useTeamSection;
