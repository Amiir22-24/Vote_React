import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AdminApi } from "../../Api/Admin/actionAdmin";
import type { Candidate } from "../../types/candidat";
import CandidatCard from "../../Components/CandidatCard";
import { ConcoursApi } from "../../Api/Concours/concoursApi";

const ConcoursDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidats, setCandidats] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCandidat, setSelectedCandidat] = useState<Candidate | null>(null);
  const [editingCandidat, setEditingCandidat] = useState<Candidate | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  const fetchCandidats = async () => {
    try {
      setLoading(true);

      // vérifier la présence et la validité de l'id avant l'appel API
      if (!id) {
        setError("ID du concours manquant");
        setLoading(false);
        return;
      }
      const idNum = Number(id);
      if (Number.isNaN(idNum)) {
        setError("ID du concours invalide");
        setLoading(false);
        return;
      }

      const rawResponse = await ConcoursApi.getCandidatsByConcours(idNum);
      let response;
      if (typeof rawResponse === 'string') {
        const jsonString = (rawResponse as string).replace(/<!--|-->/g, '').trim();
        response = JSON.parse(jsonString);
      } else {
        response = rawResponse;
      }

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
  const checkAdmin = () => {
      const token = localStorage.getItem("authToken");
      const adminName = localStorage.getItem("authname");
      setIsAdmin(!!(token && adminName));
    };
  // Récupération depuis l'API
  useEffect(() => {

    fetchCandidats();
    checkAdmin();
  }, [id]);
  
    // Gestion CRUD
    const handleEdit = (candidat: Candidate) => {
      setEditingCandidat(candidat);
    };
  
    const handleDelete = async (id: number) => {
      try {
        await AdminApi.CandidatDestroy(id);
        setCandidats(prev => prev.filter(c => c.id !== id));
        setDeleteConfirm(null);
      } catch (err: any) {
        console.error("Erreur lors de la suppression:", err);
        setError("Erreur lors de la suppression du candidat");
      }
    };
  
    const handleSave = async (formData: any) => {
      try {
        if (editingCandidat) {
          // Modification
          await AdminApi.CandidatUpdate(editingCandidat.id, formData);
        } else {
          // Création
          await AdminApi.Candidatcreate(formData);
        }
        
        setEditingCandidat(null);
        setShowCreateModal(false);
        fetchCandidats(); // Recharger la liste
      } catch (err: any) {
        console.error("Erreur lors de la sauvegarde:", err);
        setError("Erreur lors de la sauvegarde du candidat");
      }
    };

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
                  id= {candidat.id}
                  photo={candidat.photo}
                  firstname={candidat.firstname}
                  lastname={candidat.lastname}
                  description={candidat.description}
                  categorie={candidat.categorie ?? ""}
                  // pricePerVote={(candidat as any).pricePerVote}
                  votes={candidat.votes}
                  onVote={() => setSelectedCandidat(candidat)}
                  isAdmin={isAdmin}
                  onEdit={() => handleEdit(candidat)}
                  onDelete={() => setDeleteConfirm(candidat.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

    </div>

  );
};

export default ConcoursDetailPage;