export interface vote{
    id: number;
    name:string;
    date:Date;
    echeance: Date;
    statuts: voteType;
}
export interface voteData{
    name:string;
    date:Date;
    echeance: Date;
    statuts: voteType;
}
export interface voteDataResponse{
    success: boolean;
    status?: string;
    message: string;
    data?: vote;
    error?: string;
}

export type voteType =
  | "en cours"
  | "PASSE"
  | "à venir "