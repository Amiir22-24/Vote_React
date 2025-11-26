
import axiosInstance from "../axios_instance";

export const ConcoursApi = {
  getAll: async (): Promise<any> => {
    const response = await axiosInstance.get('/concours');
    return response.data;
  },

  getActifs: async (): Promise<any> => {
    const response = await axiosInstance.get('/concours/actifs');
    return response.data;
  },

  getById: async (id: number): Promise<any> => {
    const response = await axiosInstance.get(`/concours/${id}`);
    return response.data;
  },

  getCandidats: async (concoursId: number): Promise<any> => {
    const response = await axiosInstance.get(`/concours/${concoursId}/candidats`);
    return response.data;
  },
};