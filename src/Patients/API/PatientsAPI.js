import axiosInstance from "../../utils/useAPIClient";

const PatientsAPI = {
    getAllPatients: () => axiosInstance.get(`/patients/getAllPatients`),
    getChronicDiseases: () => axiosInstance.get(`/patients/getChronicDiseases`),
    createNewPatient: (data) => axiosInstance.post(`/patients/createNewPatient`, data)
};

export default PatientsAPI;
