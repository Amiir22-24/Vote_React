// src/types/index.ts

/** Interfaces pour les données du Tableau de bord */
export interface DashboardData {
  totalVotes: number;
  totalRevenue: number;
  activeCompetitions: number;
  totalCandidates: number;
  ongoingCompetitions: Competition[];
  recentTransactions: Transaction[];
}

/** Interface pour un Concours */
export interface Competition {
  id: number;
  name: string;
  votes: number;
  revenue: number;
  status: 'Actif' | 'Fermé' | 'En attente';
}

/** Interface pour une Transaction */
export interface Transaction {
  id: number;
  customerName: string;
  candidateName: string;
  amount: number;
  votes: number;
}

/** Interface pour la barre de navigation */
export interface NavItem {
  id: number;
  name: string;
  icon: string; // Utiliser un nom de classe ou d'icône simple
  path: string;
}