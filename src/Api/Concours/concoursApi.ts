import type { Candidate } from "../../types/candidat";
import type { ConcorsAllResponse } from "../../types/Concours";
import axiosInstance from "../axios_instance";

export const ConcoursApi = {
  getAll: async (): Promise<ConcorsAllResponse> => {
    const response = await axiosInstance.get('/concours');
    return response.data;
  },
  getById: async (id: number): Promise<Candidate> => {
    const response = await axiosInstance.get(`/concours/${id}`);
    return response.data;
  },
  getCandidatsByConcours: async (id: number): Promise<Candidate> => {
    const response = await axiosInstance.get(`/concours/${id}/candidats`);
    return response.data;
  },
  read: async (id: number): Promise<Candidate> => {
    const response = await axiosInstance.get(`/concours/${id}`);
    return response.data;
  },
}