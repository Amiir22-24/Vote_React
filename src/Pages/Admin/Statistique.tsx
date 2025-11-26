import React, { useState, useEffect } from "react";
import "./Dashboard.css"; // Assurez-vous que ce fichier existe

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
      // Simuler la récupération des données (remplacez par vos vrais endpoints)
      const candidatsResponse = await fetch('/api/candidats');
      const candidatsData = await candidatsResponse.json();
      setCandidats(candidatsData);

      const votesResponse = await fetch('/api/votes');
      const votesData = await votesResponse.json();
      setVotes(votesData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDU PENDANT LE CHARGEMENT ---
  if (loading) {
    return (
      <div className="dashboard-container loading-container">
        <div className="loading">Chargement des statistiques...</div>
      </div>
    );
  }

  // --- CALCULS DES STATISTIQUES ---
  const totalVotes = candidats.reduce((sum, c) => sum + c.nombreVotes, 0); // Utiliser les candidats pour les votes
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

  // --- RENDU FINAL (AJOUTÉ) ---
  return (
    <div className="dashboard-container">
      <h1>📊 Tableau de Bord des Votes</h1>
      
      {/* SECTION 1: Cartes de Statistiques Générales */}
      <div className="stats-cards">
        <div className="card stat-card total-votes">
          <h3>Total des Votes</h3>
          <p className="value">{totalVotes.toLocaleString()}</p>
        </div>
        <div className="card stat-card total-revenue">
          <h3>Revenu Total</h3>
          <p className="value">{totalRevenue.toLocaleString()} F CFA</p>
        </div>
        <div className="card stat-card active-candidates">
          <h3>Candidats Actifs</h3>
          <p className="value">{activeCandidates}</p>
        </div>
        <div className="card stat-card average-votes">
          <h3>Moyenne par Candidat</h3>
          <p className="value">{averageVotes.toLocaleString()}</p>
        </div>
      </div>
      
      {/* SECTION 2: Top 5 Candidats */}
      <div className="stats-section top-candidates-section">
        <h2>🥇 Top 5 Candidats</h2>
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Candidat</th>
                <th>Votes</th>
                <th>% Total</th>
              </tr>
            </thead>
            <tbody>
              {topCandidates.length > 0 ? (
                topCandidates.map((c, index) => (
                  <tr key={index}>
                    <td><strong>{c.name}</strong> ({c.title})</td>
                    <td>{c.votes.toLocaleString()}</td>
                    <td>
                      {c.percentage.toFixed(1)}%
                      <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${c.percentage}%` }}></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>Aucun candidat trouvé ou pas de votes.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Distribution Complète (si besoin d'un tableau détaillé) */}
      <div className="stats-section distribution-section">
        <h2>📈 Distribution Complète des Votes</h2>
        <div className="card">
          <ul>
            {voteDistribution.map((c, index) => (
              <li key={index}>
                <span className="candidate-name">{c.name} :</span>
                <span className="candidate-votes">{c.votes.toLocaleString()} votes ({c.percentage.toFixed(1)}%)</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Statistiques;