export interface vote{
    id: number;
    name:string;
    date:Date;
    echeance: Date;
    statuts: voteType;
}

export type voteType =
  | "En cours"
  | "Expiré"
  | "A venir "