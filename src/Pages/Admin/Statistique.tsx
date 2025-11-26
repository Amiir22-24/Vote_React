import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { ConcoursApi } from "../../Api/Concours/concoursApi";

interface Candidat {
  id: number;
  firstname: string;
  lastname: string;
  description: string;
  categorie: string;
  matricule: string;
  votes: number;
  photo?: string;
  concours_id: number;
}

interface Concours {
  id: number;
  name: string;
  description: string;
  date_debut: string;
  date_fin: string;
  statut: string;
  nombre_candidats: number;
  nombre_votes: number;
  total_recettes: number;
  is_active: boolean;
}

interface StatistiqueCarte {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const Statistiques: React.FC = () => {
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [concours, setConcours] = useState<Concours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [concoursActif, setConcoursActif] = useState<Concours | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer tous les concours
      const concoursResponse = await ConcoursApi.getAll();
      if (!concoursResponse.success) {
        throw new Error(concoursResponse.message || "Erreur lors du chargement des concours");
      }

      const allConcours = concoursResponse.data;
      setConcours(allConcours);

      // Trouver le concours actif (ou le premier concours)
      const actif = allConcours.find(c => c.statut === 'en cours') || allConcours[0];
      setConcoursActif(actif);

      if (actif) {
        // Récupérer les candidats du concours actif
        const candidatsResponse = await ConcoursApi.getCandidats(actif.id);
        if (candidatsResponse.success) {
          setCandidats(candidatsResponse.data);
        } else {
          throw new Error(candidatsResponse.message || "Erreur lors du chargement des candidats");
        }
      }

    } catch (err: any) {
      console.error('Erreur lors du chargement des données:', err);
      setError(err.message || "Une erreur est survenue lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  // --- CALCULS DES STATISTIQUES ---
  const totalVotes = concours.reduce((sum, c) => sum + (c.nombre_votes || 0), 0);
  const totalRevenue = concours.reduce((sum, c) => sum + (c.total_recettes || 0), 0);
  const activeCandidates = candidats.length;
  const averageVotes = activeCandidates > 0 ? Math.round(totalVotes / activeCandidates) : 0;
  const activeConcours = concours.filter(c => c.statut === 'en cours').length;

  // Cartes de statistiques
  const statistiquesCartes: StatistiqueCarte[] = [
    {
      title: "Total des Votes",
      value: totalVotes.toLocaleString(),
      icon: "❤️",
      color: "#ef4444"
    },
    {
      title: "Revenu Total",
      value: `${(totalRevenue / 1000).toLocaleString()}K FCFA`,
      icon: "💵",
      color: "#10b981"
    },
    {
      title: "Candidats Actifs",
      value: activeCandidates,
      icon: "👤",
      color: "#3b82f6"
    },
    {
      title: "Concours en Cours",
      value: activeConcours,
      icon: "🏆",
      color: "#f59e0b"
    }
  ];

  const topCandidates = [...candidats]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5)
    .map(candidat => ({
      id: candidat.id,
      name: `${candidat.firstname} ${candidat.lastname}`,
      categorie: candidat.categorie,
      votes: candidat.votes,
      percentage: totalVotes > 0 ? Math.round((candidat.votes / totalVotes) * 100 * 10) / 10 : 0
    }));

  const voteDistribution = candidats.map(candidat => ({
    id: candidat.id,
    name: `${candidat.firstname} ${candidat.lastname}`,
    votes: candidat.votes,
    percentage: totalVotes > 0 ? Math.round((candidat.votes / totalVotes) * 100 * 10) / 10 : 0
  }));

  // --- RENDU PENDANT LE CHARGEMENT ---
  if (loading) {
    return (
      <main className="dashboard-main">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des statistiques...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-main">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Erreur de chargement</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={handleRefresh}>
            Réessayer
          </button>
        </div>
      </main>
    );
  }

  // --- RENDU FINAL ---
  return (
    <main className="dashboard-main">
      {/* En-tête */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>📊 Tableau de Bord des Statistiques</h1>
          <p className="subtitle">
            {concoursActif 
              ? `Statistiques pour le concours: ${concoursActif.name}`
              : "Aperçu global de tous les concours"
            }
          </p>
        </div>
        <div className="header-actions">
          <button className="refresh-button" onClick={handleRefresh} title="Actualiser les données">
            🔄
          </button>
        </div>
      </header>

      {/* SECTION 1: Cartes de Statistiques Générales */}
      <section className="stats-section">
        <h2>Vue d'ensemble</h2>
        <div className="stats-cards">
          {statistiquesCartes.map((carte, index) => (
            <div key={index} className="stat-card" style={{ borderLeftColor: carte.color }}>
              <div className="card-content">
                <div className="card-icon" style={{ color: carte.color }}>
                  {carte.icon}
                </div>
                <div className="card-text">
                  <h3>{carte.title}</h3>
                  <p className="value">{carte.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Top 5 Candidats */}
      <section className="stats-section">
        <div className="section-header">
          <h2>🥇 Top 5 Candidats</h2>
          <span className="section-subtitle">
            {concoursActif ? `Concours: ${concoursActif.name}` : "Tous les concours"}
          </span>
        </div>
        <div className="card">
          {topCandidates.length > 0 ? (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Candidat</th>
                  <th>Catégorie</th>
                  <th>Votes</th>
                  <th>Pourcentage</th>
                </tr>
              </thead>
              <tbody>
                {topCandidates.map((candidat, index) => (
                  <tr key={candidat.id}>
                    <td className="position-cell">
                      <span className={`position-badge position-${index + 1}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="candidate-cell">
                      <strong>{candidat.name}</strong>
                    </td>
                    <td className="category-cell">
                      {candidat.categorie}
                    </td>
                    <td className="votes-cell">
                      {candidat.votes.toLocaleString()}
                    </td>
                    <td className="percentage-cell">
                      <div className="percentage-container">
                        <span className="percentage-value">
                          {candidat.percentage.toFixed(1)}%
                        </span>
                        <div className="progress-bar-container">
                          <div 
                            className="progress-bar" 
                            style={{ width: `${candidat.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <p>Aucun candidat trouvé ou pas de votes enregistrés.</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: Distribution Complète des Votes */}
      <section className="stats-section">
        <div className="section-header">
          <h2>📈 Distribution Complète des Votes</h2>
          <span className="section-subtitle">
            {candidats.length} candidats - {totalVotes.toLocaleString()} votes totaux
          </span>
        </div>
        <div className="card">
          {voteDistribution.length > 0 ? (
            <div className="distribution-list">
              {voteDistribution
                .sort((a, b) => b.votes - a.votes)
                .map((candidat, index) => (
                  <div key={candidat.id} className="distribution-item">
                    <div className="distribution-rank">
                      <span className="rank-number">#{index + 1}</span>
                    </div>
                    <div className="distribution-info">
                      <div className="candidate-name">{candidat.name}</div>
                      <div className="distribution-stats">
                        <span className="vote-count">{candidat.votes.toLocaleString()} votes</span>
                        <span className="vote-percentage">{candidat.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="distribution-bar-container">
                      <div 
                        className="distribution-bar" 
                        style={{ width: `${candidat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <p>Aucune donnée de distribution disponible.</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: Informations Concours */}
      {concoursActif && (
        <section className="stats-section">
          <h2>🏆 Informations du Concours Actif</h2>
          <div className="card">
            <div className="concours-info">
              <div className="info-item">
                <span className="info-label">Nom:</span>
                <span className="info-value">{concoursActif.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Description:</span>
                <span className="info-value">{concoursActif.description}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Période:</span>
                <span className="info-value">
                  Du {new Date(concoursActif.date_debut).toLocaleDateString()} au {new Date(concoursActif.date_fin).toLocaleDateString()}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Statut:</span>
                <span className={`status-badge status-${concoursActif.statut.replace(' ', '-')}`}>
                  {concoursActif.statut}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Statistiques;