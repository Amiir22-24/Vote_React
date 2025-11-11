import http from "../httpClient";
import type { vote } from "../types/Vote";

export const voteService = {
  async getAll() {
    const { data } = await http.get<vote[]>("/votes");
    return data;
  },

  async create(payload: Omit<vote, "id">) {
    const { data } = await http.post<vote>("/votes", payload);
    return data;
  },
};
