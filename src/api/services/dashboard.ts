// src/api/dashboard.ts

import axiosInstance from "../../utils/axiosInstance";
import type { DashboardData } from "../types";

/**
 * Fonction pour récupérer les données du tableau de bord.
 * Utilise axiosInstance qui ajoute automatiquement le token JWT.
 */
export const fetchDashboardData = async (): Promise<DashboardData> => {
    // Route Laravel: /api/admin/dashboard
    const response = await axiosInstance.get('/dashboard'); 
    
    // Assurez-vous que la structure de response.data correspond à l'interface DashboardData
    return response.data;
};