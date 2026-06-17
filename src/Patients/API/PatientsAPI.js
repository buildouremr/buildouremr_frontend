import axiosInstance from "../../utils/useAPIClient";

const PatientsAPI = {
    getAllPatients: () => axiosInstance.get(`/appointments/getAllPatients`)
};

export default PatientsAPI;
