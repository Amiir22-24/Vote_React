import type { Candidate } from "./candidat";

// Tous les modes Mobile Money d’Afrique de l’Ouest
export type PaymentMode =
  | "mtn_tg" | "moov_tg"
  | "mtn_bj" | "moov_bj"
  | "orange_ci" | "mtn_ci" | "moov_ci"
  | "orange_bf" | "airtel_bf" | "moov_bf"
  | "mtn_gh" | "vodafone_gh" | "airteltigo_gh"
  | "airtel_ne" | "moov_ne"
  | "orange_sn" | "wave_sn" | "free_sn" | "emoney_sn"
  | "orange_gn" | "mtn_gn" | "cellcom_gn"
  | "orange_ml" | "moov_ml" | "telecel_ml";

// Type pour les données du formulaire de paiement
export interface PaymentFormData {
  name: string;
  email: string;
  phone_number: string;
  country: string; // Code pays, ex: TG, BJ, CI
  amount: number | string;
  currency: string; // XOF, XAF, GHS, GNF
  description: string;
  mode: PaymentMode; // Mobile Money sélectionné
}

// Type pour la réponse du backend
export interface PaymentResponse {
  success: boolean;
  transaction_id?: string;
  message: string;
  error?: string;
}
export interface PaymentFormProps {
  candidat: Candidate;
  onClose: () => void;
}
export interface PaiementData {

  id: number;
  name: string;
  email: string;
  phone_number: string;
  country: string;
  description: string;
  amount: number | string;
  currency: string;
  callback_url: string;
  mode: PaymentMode;
  customer: string
};

export interface TransactionResponse {
  sussess: boolean;
  transaction_id?: string;
  message: string;
  error: string;
}

export interface PaiementListeResponse{
  success: boolean;
  message: string;
  data: PaiementData[]
}