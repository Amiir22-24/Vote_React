export interface Candidate {
  id: number;
  firstname: string;
  lastname: string
  description: string;
  matricule: string;
  photo: File;
  votes: number;
  categorie?: CategoryType;
  vote_id: number,
}
export interface CandidateData {
  firstname: string;
  lastname: string
  description: string;
  matricule: string;
  photo?: File;
  votes?: number;
  categorie?: string;
  concours_id: number;
}
export interface CandidateCreateResponse{
  success: boolean,
  message: string,
  data: Candidate,
} 
export interface CandidateListeResponse{
  success: boolean,
  message: string,
  data: Candidate[],
} 

export type CategoryType =
  | "Miss"
  | "Mr"
  | "Talent"
  | "Sport"
  | "Art";
