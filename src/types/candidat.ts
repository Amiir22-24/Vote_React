export interface Candidate {
  id: number;
  firstname: string;
  lastname: string
  description: string;
  photo: string;
  votes: number;
  category?: CategoryType;
}

export type CategoryType =
  | "Miss"
  | "Mr"
  | "Talent"
  | "Sport"
  | "Art";
