import type { Candidate, CandidateCreateResponse, CandidateData, CandidateListeResponse } from "../../types/candidat";
import axiosInstance from "../axios_instance";

export const candidateApi = {
    getAll: async (): Promise<CandidateListeResponse> => {
        const response = await axiosInstance.get('/candidats');
        return response.data;
    },
    create: async (data: CandidateData): Promise<CandidateCreateResponse> => {
        return axiosInstance.post("/candidats", data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            },
        });
    },
    destroy: async (id: number): Promise<Candidate[]> => {
        const response = await axiosInstance.delete(`/candidates/${id}`);
        return response.data;
    },
    update: async (id: number, formData: FormData): Promise<Candidate[]> => {
        const response = await axiosInstance.put(`/candidates/${id}`, formData);
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

    // Méthode intégrée pour créer un candidat à partir d'un objet Candidate
    createCandidate: async (candidate: Omit<Candidate, "id"> & { photo?: File; matricule?: string }) => {
        const formData = new FormData();
        formData.append("firstname", candidate.firstname);
        formData.append("lastname", candidate.lastname);
        formData.append("matricule", candidate.matricule ?? "");
        formData.append("categorie", candidate.categorie ?? "");
        formData.append("description", candidate.description);
        if (candidate.photo) {
            formData.append("photo", candidate.photo); // File accepté par FormData
        }

        const response = await axiosInstance.post("/candidates", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data as Candidate;
    }
}
