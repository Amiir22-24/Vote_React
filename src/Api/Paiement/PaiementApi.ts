// src/api/paiement.ts

import type { 
  TransactionResponse, 
  PaiementListeResponse, 
  PaymentFormData 
} from "../../types/paiement";
import axiosInstance from "../axios_instance";

export const PaiementApi = {

  // Lister toutes les transactions (admin)
  listAll: async (): Promise<any> => {
    const response = await axiosInstance.get('/paiements/list');
    return response.data;
  },

  // Initialiser un paiement (utilisateur connecté)
  initiate: async (data: PaymentFormData): Promise<any> => {
    const response = await axiosInstance.post(`/paiements/${data.candidatId}/vote`, data);
    return response.data;
  },

  // Voter anonymement (ancien système – si tu veux le garder)
  doVote: async (candidatId: number | string, formdata: any): Promise<TransactionResponse> => {
    const response = await axiosInstance.post(`/payment/${candidatId}/vote`, formdata);
    return response.data;
  },

  // Vérifier le statut d'une transaction
  checkStatus: async (transactionId: number | string): Promise<any> => {
    const response = await axiosInstance.get(`/payment/status/${transactionId}`);
    return response.data;
  },

  // Optionnel : récupérer les transactions de l'utilisateur connecté
  myTransactions: async (): Promise<PaiementListeResponse> => {
    const response = await axiosInstance.get('/payment/my-transactions');
    return response.data;
  },
};