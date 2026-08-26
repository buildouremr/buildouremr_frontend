import axiosInstance from "../../utils/useAPIClient";

const encounterAPI = {
  /**
   * Starts a new encounter or returns an existing active encounter.
   */
  startEncounter: async (patientId) => {
    try {
      const response = await axiosInstance.post(`/encounters/start`, { patientId });
      return response.data; // Expected: { status: "SUCCESS", data: { encounterId, ... } }
    } catch (error) {
      console.error("Error starting encounter", error);
      throw error;
    }
  },

  /**
   * Checks out an existing encounter.
   */
  checkoutEncounter: async (encounterId) => {
    try {
      const response = await axiosInstance.post(`/encounters/${encounterId}/checkout`, {});
      return response.data;
    } catch (error) {
      console.error("Error checking out encounter", error);
      throw error;
    }
  },
};

export default encounterAPI;
