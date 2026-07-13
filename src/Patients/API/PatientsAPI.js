import axiosInstance from "../../utils/useAPIClient";

const PatientsAPI = {
    getAllPatients: () => axiosInstance.get(`/appointments/getAllPatients`),
    getChronicDiseases: () => axiosInstance.get(`/appointments/getChronicDiseases`)
};

export default PatientsAPI;
