// src/api/auth.ts

import axiosInstance from "../../utils/axiosInstance";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string; // Le token JWT retourné par Laravel
  user: {
    id: number;
    name: string;
    email: string;
  };
}

/**
 * Appel API pour la connexion (Route Laravel: /api/admin/login)
 */
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axiosInstance.post('/login', payload); // Assurez-vous que votre route Laravel est bien configurée
  return response.data;
};