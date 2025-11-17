import React, { useEffect, useState } from "react";
import CandidatCard from "../../Components/CandidatCard";

import "./CandidatList.css";
import { candidateApi } from "../../Api/candidates/candidatApi";
import type { Candidate } from "../../types/candidat";
import { Link } from "react-router";

// Navbar stylisée


const CandidatListPage: React.FC = () => {
  const [candidats, setCandidats] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupération depuis l'API
  useEffect(() => {
    const fetchCandidats = async () => {
      try {
        setLoading(true);
        // candidateApi.getAll() est censé retourner directement un tableau de candidats
        const response = await candidateApi.getAll();
        // Debug: afficher la réponse brute pour diagnostiquer les formats inattendus
        console.debug("Candidats API response:", response);

        let list: any[] = [];
        if (Array.isArray(response)) {
          list = response;
        } else if (response && Array.isArray((response as any).data)) {
          list = (response as any).data;
        } else if (response && Array.isArray((response as any).candidats)) {
          list = (response as any).candidats;
        } else {
          // essayer de transformer un objet en tableau si besoin
          try {
            const maybeArray = Object.keys(response || {}).map((k) => (response as any)[k]);
            if (Array.isArray(maybeArray) && maybeArray.length && typeof maybeArray[0] === "object") {
              list = maybeArray;
            }
          } catch (err) {
            // ignore
          }
        }

        if (!Array.isArray(list)) {
          throw new Error("Format de réponse inattendu pour la liste des candidats");
        }

        setCandidats(list as Candidate[]);
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
                  categorie={candidat.categorie ?? ""}
                  pricePerVote={(candidat as any).pricePerVote}
                  votes={candidat.votes}
                  onVote={() => alert(`Vote enregistré pour ${candidat.firstname}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
      {/* FOOTER */}
      <footer className="candidat-footer">
        <p>
          <Link to="../Admin/Login" className="admin-link">
            🔑 Espace Administrateur
          </Link>
        </p>
      </footer>
    </div>

  );
};

export default CandidatListPage;