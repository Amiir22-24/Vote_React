import type { adminData, AuthResponse } from "../../types/admin";
import type { Candidate, CandidateData } from "../../types/candidat";
import type { ConcoursAllResponse, ConcoursData, ConcoursDataResponse } from "../../types/Concours";
import axiosInstance from "../axios_instance";


export const AdminApi = {
  Login: async (formData: adminData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/login', formData);
    return response.data;
  },
  Candidatcreate: async (data: CandidateData): Promise<Candidate> => {
    const response = await axiosInstance.post("/candidats", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data
  },
    CandidatUpdate: async (id: number, formData: FormData): Promise<Candidate[]> => {
    const response = await axiosInstance.put(`/candidates/${id}`, formData);
    return response.data;
  },

  CandidatDestroy: async (id: number): Promise<Candidate[]> => {
    const response = await axiosInstance.delete(`/candidates/${id}`);
    return response.data;
  },
    
  ConcoursCreate: async (data: ConcoursData): Promise<any> => {
    const response = await axiosInstance.post("/concours", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  ConcoursDestroy: async (id: number): Promise<Candidate[]> => {
    const response = await axiosInstance.delete(`/votes/${id}`);
    return response.data;
  },
  ConcoursUpdate: async (id: number, formData: FormData): Promise<Candidate[]> => {
    const response = await axiosInstance.put(`/votes/${id}`, formData);
    return response.data;
  },
}