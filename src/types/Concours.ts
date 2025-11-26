// types/Concours.ts
export interface Concours {
  id: number;
  name: string;
  description: string;
  date_debut: string;
  date_fin: string;
  statut: "en cours" | "à venir" | "passé";
  image_url?: string;
  prix_par_vote: number;
  nombre_candidats: number;
  nombre_votes: number;
  total_recettes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
export interface ConcoursData{
    name:string;
    date_debut:Date;
    description: string;
    date_fin: Date;
    statut?: ConcourStatus;
    image_url: string;
    prix_par_vote: number;
    is_active?: boolean;
}
export interface ConcoursDataResponse{
    success: boolean;
    status?: string;
    message: string;
    data?: Concours;
    error?: string;
}
export interface ConcoursAllResponse{
    success: boolean;
    message: string;
    data: Concours[];
    
}

export type ConcourStatus =
  | "en cours"
  | "PASSE"
  | "à venir"