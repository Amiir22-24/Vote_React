export interface Candidate {
  id: number;
  firstname: string;
  lastname: string
  description: string;
  photo: File;
  votes: number;
  categorie?: CategoryType;
}
export interface CandidateData {
  firstname: string;
  lastname: string
  description: string;
  matricule: string;
  photo?: File;
  votes?: number;
  categorie?: string;
}
export interface CandidateCreateResponse{
  success: boolean,
  message: string,
  data: Candidate,
} 

export type CategoryType =
  | "Miss"
  | "Mr"
  | "Talent"
  | "Sport"
  | "Art";
