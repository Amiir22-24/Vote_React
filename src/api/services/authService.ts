import http from "../httpClient";

export const authService = {
  async login(email: string, password: string) {
    const { data } = await http.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    return data;
  },

  async logout() {
    localStorage.removeItem("token");
  },
};
