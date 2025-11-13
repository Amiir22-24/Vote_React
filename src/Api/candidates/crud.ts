import type { Candidate } from "../../types/candidat";
import axiosInstance from "../axios_instance";


export const candidateApi = {
    getAll: async (): Promise<Candidate [] > => {
    const response = await axiosInstance.get('/candidates');
    return response.data;
    },
    create: async (data: FormData) => {
    return axiosInstance.post("/candidates", data, {
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