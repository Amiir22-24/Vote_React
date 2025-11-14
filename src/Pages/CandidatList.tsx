import React, { useEffect, useState } from "react";
import CandidatCard from "../Components/CandidatCard";
import { Link } from "react-router-dom";
import "./CandidatList.css";

interface Candidat {
  id: number;
  firstname: string;
  lastname: string;
  description: string;
  categorie: string;
  pricePerVote: string;
  photo: string;
  votes: number;
}

// Navbar stylisée
const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <h2>Concours</h2>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/candidats" className="nav-link active">
              👥 Candidats
            </Link>
          </li>
          <li>
            <Link to="/vote" className="nav-link">
              🏆 Concours
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

const CandidatListPage: React.FC = () => {
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupération depuis l'API
  useEffect(() => {
    const fetchCandidats = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/apicandidats");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des candidats");
        }
        const data = await response.json();
        setCandidats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
        console.error("Erreur récupération candidats :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidats();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des candidats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Erreur de chargement</h3>
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="candidat-list-page">
      <Navbar />
      
      <div className="candidat-list-container">
        <header className="page-header">
          <h1 className="page-title">Liste des Candidats</h1>
          <p className="page-subtitle">
            Découvrez tous les candidats participant au concours
          </p>
          <div className="stats-badge">
            {candidats.length} candidat{candidats.length > 1 ? 's' : ''} au total
          </div>
        </header>

        <main className="candidat-list-main">
          {candidats.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>Aucun candidat disponible</h3>
              <p>Il n'y a pas de candidats pour le moment.</p>
            </div>
          ) : (
            <div className="candidat-grid">
              {candidats.map((candidat) => (
                <CandidatCard
                  key={candidat.id}
                  photo={candidat.photo}
                  firstname={candidat.firstname}
                  lastname={candidat.lastname}
                  description={candidat.description}
                  categorie={candidat.categorie}
                  pricePerVote={candidat.pricePerVote}
                  votes={candidat.votes}
                  onVote={() => alert(`Vote enregistré pour ${candidat.firstname}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CandidatListPage;