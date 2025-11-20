import React, { useEffect, useState } from "react";
import "./CandidatList.css";
import type { Candidate } from "../../types/candidat";
import { candidateApi } from "../../Api/candidates/candidatApi";
import CandidatCard from "../../Components/CandidatCard";
import { Link } from "react-router";
import PaymentForm from "./PaiementForm";

const CandidatListPage: React.FC = () => {
  const [candidats, setCandidats] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // État du candidat sélectionné pour voter
  const [selectedCandidat, setSelectedCandidat] = useState<Candidate | null>(null);

  useEffect(() => {
    const fetchCandidats = async () => {
      try {
        setLoading(true);
        const response = await candidateApi.getAll();
        let list: any[] = [];
        if (Array.isArray(response)) list = response;
        else if (response && Array.isArray((response as any).data)) list = (response as any).data;
        else if (response && Array.isArray((response as any).candidats)) list = (response as any).candidats;
        else {
          const maybeArray = Object.keys(response || {}).map((k) => (response as any)[k]);
          if (Array.isArray(maybeArray) && maybeArray.length && typeof maybeArray[0] === "object") list = maybeArray;
        }
        if (!Array.isArray(list)) throw new Error("Format de réponse inattendu pour la liste des candidats");
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

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Chargement des candidats...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Erreur de chargement</h3>
      <p>{error}</p>
      <button className="retry-button" onClick={() => window.location.reload()}>Réessayer</button>
    </div>
  );

  return (
    <div className="candidat-list-page">
      <div className="candidat-list-container">
        <header className="page-header">
          <h1 className="page-title">Liste des Candidats</h1>
          <p className="page-subtitle">Découvrez tous les candidats participant au concours</p>
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
                  votes={candidat.votes}
                  onVote={() => setSelectedCandidat(candidat)} // ouverture du formulaire
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <footer className="candidat-footer">
        <p>
          <Link to="../Admin/Login" className="admin-link">🔑 Espace Administrateur</Link>
        </p>
      </footer>

      {/* Modal du formulaire de paiement */}
      {selectedCandidat && (
        <div className="payment-modal">
          <div className="payment-modal-content">
            <button className="close-modal" onClick={() => setSelectedCandidat(null)}>❌</button>
            <PaymentForm
              candidat={selectedCandidat}
              onClose={() => setSelectedCandidat(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatListPage;