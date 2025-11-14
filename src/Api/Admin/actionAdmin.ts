import type { adminData, AuthResponse } from "../../types/admin";
import type { Candidate, CandidateData } from "../../types/candidat";
import type { vote, voteAllResponse, voteData, voteDataResponse } from "../../types/vote";
import axiosInstance from "../axios_instance";


export const CandidatApi = {
    Login: async (formData: adminData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/login', formData);
    return response.data;
    },
    getAll: async (): Promise<Candidate [] > => {
    const response = await axiosInstance.get('/candidats');
    return response.data;
    },
    create: async (data: FormData) => {
    return axiosInstance.post("/candidats", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    },
    destroy: async (id: number): Promise<Candidate [] > => {
    const response = await axiosInstance.delete(`/candidates/${id}`);
    return  response.data;
    },
    update: async (id: number, formData:FormData): Promise<Candidate [] > => {
    const response = await axiosInstance.put(`/candidates/${id}`, formData);
    return  response.data;
    },
    getById: async (id: number): Promise<Candidate> => {
    const response = await axiosInstance.get(`/candidates/${id}`);
    return response.data;
    },
    read: async (id: number): Promise<Candidate> => {
    const response = await axiosInstance.get(`/candidates/${id}`);
    return  response.data;
    },
}

export const VoteApi = {
    getAll: async (): Promise<voteAllResponse> => {
    const response = await axiosInstance.get('/votes');
    return response.data;
    },
    create: async (data: voteData): Promise<voteDataResponse> => {
    const response = await axiosInstance.post("/votes", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
    },
    destroy: async (id: number): Promise<Candidate [] > => {
    const response = await axiosInstance.delete(`/votes/${id}`);
    return  response.data;
    },
    update: async (id: number, formData:FormData): Promise<Candidate [] > => {
    const response = await axiosInstance.put(`/votes/${id}`, formData);
    return  response.data;
    },
    getById: async (id: number): Promise<Candidate> => {
    const response = await axiosInstance.get(`/votes/${id}`);
    return response.data;
    },
    read: async (id: number): Promise<Candidate> => {
    const response = await axiosInstance.get(`/votes/${id}`);
    return  response.data;
    },
}