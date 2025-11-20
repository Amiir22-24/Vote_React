
import type { TransactionResponse, PaiementListeResponse, PaymentFormData } from "../../types/paiement";
import axiosInstance from "../axios_instance";

export const PaiementApi = {
    getAll: async (): Promise<PaiementListeResponse> => {
        const response = await axiosInstance.get('/paiements');
        return response.data;
    },
    inittransaction: async ( formdata: PaymentFormData): Promise<TransactionResponse> => {
        const response = await axiosInstance.post(`/paiements/${formdata.candidatId}`, formdata);
        return response.data;
    },
    
}
