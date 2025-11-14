export interface vote{
    id: number;
    name:string;
    date:Date;
    echeance: Date;
    statuts: voteStatus;
}
export interface voteData{
    name:string;
    date:Date;
    echeance: Date;
    statuts?: voteStatus;
}
export interface voteDataResponse{
    success: boolean;
    status?: string;
    message: string;
    data?: vote;
    error?: string;
}
export interface voteAllResponse{
    success: boolean;
    message: string;
    data: vote[];
    
}

export type voteStatus =
  | "en cours"
  | "PASSE"
  | "à venir"