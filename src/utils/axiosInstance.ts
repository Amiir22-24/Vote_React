// src/utils/axiosInstance.ts

import type { AxiosInstance } from "axios";
import axios from "axios";

const BASE_URL = 'http://127.0.0.1:8000/api/admin'; 

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Intercepteur de requêtes pour ajouter le token JWT à chaque requête.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis le stockage local (ou autre gestion d'état)
    const token = localStorage.getItem('admin_token');

    if (token) {
      // Si un token existe, l'ajouter dans l'en-tête Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponses pour gérer les erreurs d'authentification (401).
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si la réponse est 401 (Non autorisé), cela signifie que le token est expiré ou invalide.
    if (error.response && error.response.status === 401) {
      console.error("Token expiré ou invalide. Déconnexion...");
      
      // Nettoyer le token et rediriger vers la page de connexion
      localStorage.removeItem('admin_token');
      // window.location.href = '/login'; // Redirection forcee

      // NOTE: L'idéal est de gérer la redirection via un hook ou un contexte dans React
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;