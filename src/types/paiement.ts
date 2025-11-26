import type { Candidate } from "./candidat";

// Tous les modes Mobile Money d’Afrique de l’Ouest
export type PaymentMode = "mtn_bj" | "moov_bj" | "celtiis_bj" | "coris_bj" | "bmo_bj" | "mtn_ci" | "moov_ci" | "orange_ci" | "wave_ci" | "airtel_ne" | "orange_sn" | "wave_sn" | "moov_tg" | "togocel" | "orange_ml" | "moov_bf" | "orange_bf" | "mtn_gn";
// Type pour les données du formulaire de paiement
export interface PaymentFormData {
  candidatId: number;
  name: string;
  email: string;
  votes: string
  phone_number: string;
  country: string; // Code pays, ex: TG, BJ, CI
  amount: number;
  currency: string; // XOF, XAF, GHS, GNF
  description: string;
  mode: PaymentMode; // Mobile Money sélectionné
}

// Type pour la réponse du backend
export interface PaymentResponse {
  success: boolean;
  transaction_id?: string;
  transaction_url?: URL;
  message: string;
  error?: string;
}
export interface PaymentFormProps {
  candidat: Candidate;
  onClose: () => void;
}
export interface PaiementData {

   transaction_id: string;
        user_id: string;
        candidate_id: string;
        name: string;
        email: string;
        phone_number: string;
        country: string;
        reference: string;
        currency: string;
        amount: number;
        votes: number;
        status: string;
        paid_at: string;
        fedapay_transaction_id: string;
};

export interface TransactionResponse {
  success: boolean;
  transaction_id?: string;
  payment_url: URL
  message: string;
  error: string;
}

export interface PaiementListeResponse{
  success: boolean;
  message: string;
  data: PaiementData[]
}