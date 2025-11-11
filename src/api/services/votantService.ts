import http from "../httpClient";
import type { votant } from "../types/Votant";

export const votantService = {
  async register(voter: Omit<votant, "id">) {
    const { data } = await http.post<votant>("/votants", voter);
    return data;
  },

  async getAll() {
    const { data } = await http.get<votant[]>("/votants");
    return data;
  },
};
