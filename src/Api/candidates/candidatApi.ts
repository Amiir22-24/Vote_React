import type { Candidate, CandidateCreateResponse, CandidateData, CandidateListeResponse } from "../../types/candidat";
import axiosInstance from "../axios_instance";

export const candidateApi = {
    getAll: async (): Promise<CandidateListeResponse> => {
        const response = await axiosInstance.get('/candidats');
        return response.data;
    },
    getById: async (id: number): Promise<Candidate> => {
        const response = await axiosInstance.get(`/candidates/${id}`);
        return response.data;
    },
    read: async (id: number): Promise<Candidate> => {
        const response = await axiosInstance.get(`/candidates/${id}`);
        return response.data;
    },
}
