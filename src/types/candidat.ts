export interface Candidate {
  id: number;
  firstname: string;
  lastname: string
  description: string;
  photo: File;
  votes: number;
  category?: CategoryType;
}
export interface CandidateData {
  firstname: string;
  lastname: string
  description: string;
  photo?: File;
  votes?: number;
  category?: string;
}
export interface CandidateCreateResponse{
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
