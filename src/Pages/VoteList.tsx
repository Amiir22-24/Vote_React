import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import "./VoteList.css";
import { VoteApi } from "../Api/Admin/actionAdmin";
import type { vote, voteAllResponse } from "../types/vote";

// VoteCard local
const VoteCard: React.FC<{ vote: vote; onOpen: (id: number) => void }> = ({ vote, onOpen }) => {
  const getStatusColor = (status: vote["statuts"]) => {
    switch (status) {
      case "en cours": return "#28a745";   // vert
      case "à venir": return "#ffc107";    // jaune
      case "PASSE": return "#dc3545";      // rouge
      default: return "#6c757d";           // gris
    }
  };

  return (
    <div className="vote-card">
      <h3 className="vote-name">{vote.name}</h3>
      <p>Date début : {new Date(vote.date).toLocaleDateString()}</p>
      <p>Échéance : {new Date(vote.echeance).toLocaleDateString()}</p>
      <span className="vote-status" style={{ backgroundColor: getStatusColor(vote.statuts) }}>
        {vote.statuts}
      </span>
      <button className="vote-button" onClick={() => onOpen(vote.id)}>
        Voir détails
      </button>
    </div>
  );
};

// Navbar locale
const Navbar: React.FC = () => (
  <nav className="navbar">
    <div className="nav-container">
      <div className="nav-logo">
        <h2>Concours</h2>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/candidats" className="nav-link">👥 Candidats</Link>
        </li>
        <li>
          <Link to="/vote" className="nav-link active">🏆 Concours</Link>
        </li>
      </ul>
    </div>
  </nav>
);

const VoteListPage: React.FC = () => {
  const [votes, setVotes] = useState<vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        setLoading(true);
        const response: voteAllResponse = await VoteApi.getAll(); // fetch API
        setVotes(response.data || []);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Erreur lors du chargement des votes");
      } finally {
        setLoading(false);
      }
    };

    fetchVotes();
  }, []);

  if (loading) return (
    <div>
      <Navbar />
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des votes...</p>
      </div>
    </div>
  );

  if (error) return (
    <div>
      <Navbar />
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Erreur de chargement</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">Réessayer</button>
      </div>
    </div>
  );

  return (
    <div className="vote-list-page">
      <Navbar />

      <div className="vote-list-container">
        <header className="page-header">
          <h1 className="page-title">Liste des Votes</h1>
          <p className="page-subtitle">
            Découvrez tous les concours en cours ou à venir
          </p>
          <div className="stats-badge">{votes.length} vote{votes.length > 1 ? 's' : ''}</div>
        </header>

        <main className="vote-list-main">
          {votes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏆</div>
              <h3>Aucun vote disponible</h3>
              <p>Il n'y a pas de concours pour le moment.</p>
            </div>
          ) : (
            <div className="vote-grid">
              {votes.map((v) => (
                <VoteCard
                  key={v.id}
                  vote={v}
                  onOpen={(id) => alert(`Ouvrir vote ${id}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VoteListPage;
