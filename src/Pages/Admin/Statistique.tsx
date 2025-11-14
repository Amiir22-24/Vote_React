import React, { useState, useEffect } from "react";
import "./Dashboard.css";

interface Candidat {
  id: string;
  nom: string;
  titre: string;
  nombreVotes: number;
  estActif: boolean;
}

interface Vote {
  id: string;
  candidatId: string;
  montant: number;
  date: string;
}

const Statistiques: React.FC = () => {
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Récupérer les candidats
      const candidatsResponse = await fetch('/api/candidats');
      const candidatsData = await candidatsResponse.json();
      setCandidats(candidatsData);

      // Récupérer les votes
      const votesResponse = await fetch('/api/votes');
      const votesData = await votesResponse.json();
      setVotes(votesData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Chargement des statistiques...</div>;
  }

  // Calculs des statistiques
  const totalVotes = votes.length;
  const totalRevenue = votes.reduce((sum, vote) => sum + vote.montant, 0);
  const activeCandidates = candidats.filter(c => c.estActif).length;
  const averageVotes = activeCandidates > 0 ? Math.round(totalVotes / activeCandidates) : 0;

  const topCandidates = [...candidats]
    .sort((a, b) => b.nombreVotes - a.nombreVotes)
    .slice(0, 5)
    .map(candidat => ({
      name: candidat.nom,
      title: candidat.titre,
      votes: candidat.nombreVotes,
      percentage: totalVotes > 0 ? Math.round((candidat.nombreVotes / totalVotes) * 100 * 10) / 10 : 0
    }));

  const voteDistribution = candidats.map(candidat => ({
    name: candidat.nom,
    votes: candidat.nombreVotes,
    percentage: totalVotes > 0 ? Math.round((candidat.nombreVotes / totalVotes) * 100 * 10) / 10 : 0
  }));

  const statsData = {
    totalVotes,
    totalRevenue,
    activeCandidates,
    averageVotes,
    topCandidates,
    voteDistribution
  };
};

export default Statistiques;