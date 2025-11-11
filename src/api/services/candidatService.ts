import http from "../httpClient";
import type { Candidate } from "../types/Candidat";

export const candidatService = {
  async getAll() {
    const { data } = await http.get<Candidate[]>("/candidats");
    return data;
  },

  async getById(id: number) {
    const { data } = await http.get<Candidate>(`/candidats/${id}`);
    return data;
  },
};
