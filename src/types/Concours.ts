export interface Concours{
    id: number;
    name:string;
    date:Date;
    echeance: Date;
    statuts: ConcourStatus;
}
export interface ConcoursData{
    name:string;
    date:Date;
    echeance: Date;
    statuts?: ConcourStatus;
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