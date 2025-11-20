import React, { useEffect, useState } from "react";
import "./CandidatList.css";
import type { Candidate } from "../../types/candidat";
import { candidateApi } from "../../Api/candidates/candidatApi";
import { AdminApi } from "../../Api/Admin/actionAdmin";
import CandidatCard from "../../Components/CandidatCard";
import { Link } from "react-router";
import PaymentForm from "./PaiementForm";

const CandidatListPage: React.FC = () => {
  const [candidats, setCandidats] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // États pour les modals
  const [selectedCandidat, setSelectedCandidat] = useState<Candidate | null>(null);
  const [editingCandidat, setEditingCandidat] = useState<Candidate | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem("authToken");
      const adminName = localStorage.getItem("authname");
      setIsAdmin(!!(token && adminName));
    };
    checkAdmin();
  }, []);

  const fetchCandidats = async () => {
    try {
      setLoading(true);
      const rawResponse = await candidateApi.getAll();
      let responseData;
            if (typeof rawResponse === 'string') {
              const jsonString = (rawResponse as string).replace(/<!--|-->/g, '').trim();
              responseData = JSON.parse(jsonString);
            } else {
              responseData = rawResponse;
            }
      
            let candidatsData: Candidate[] = [];
            if (Array.isArray(responseData)) {
              candidatsData = responseData;
            } else if (responseData && Array.isArray(responseData.data)) {
              candidatsData = responseData.data;
            }
      
            setCandidats(candidatsData);
          } catch (err: any) {
            console.error("Erreur lors du chargement des concours:", err);
            setError(err?.message || "Erreur lors du chargement des votes");
          } finally {
            setLoading(false);
          }
  };

  useEffect(() => {
    fetchCandidats();
  }, []);

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

  // Modal de création/édition
  const CandidatModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    candidat?: Candidate | null;
    isEditing: boolean;
  }> = ({ isOpen, onClose, onSave, candidat, isEditing }) => {
    const [formData, setFormData] = useState({
      firstname: "",
      lastname: "",
      description: "",
      categorie: "",
      matricule: "",
      photo: null as File | null,
      vote_id: 1 // À adapter selon vos besoins
    });

    useEffect(() => {
      if (candidat) {
        setFormData({
          firstname: candidat.firstname,
          lastname: candidat.lastname,
          description: candidat.description,
          categorie: candidat.categorie ?? "",
          matricule: candidat.matricule ?? "",
          photo: null,
          vote_id: candidat.vote_id ?? 1
        });
      } else {
        setFormData({
          firstname: "",
          lastname: "",
          description: "",
          categorie: "",
          matricule: "",
          photo: null,
          vote_id: 1
        });
      }
    }, [candidat]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFormData(prev => ({ ...prev, photo: e.target.files![0] }));
      }
    };

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{isEditing ? "Modifier le candidat" : "Créer un nouveau candidat"}</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstname">Prénom</label>
                <input
                  type="text"
                  id="firstname"
                  value={formData.firstname}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstname: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastname">Nom</label>
                <input
                  type="text"
                  id="lastname"
                  value={formData.lastname}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastname: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="matricule">Matricule</label>
              <input
                type="text"
                id="matricule"
                value={formData.matricule}
                onChange={(e) => setFormData(prev => ({ ...prev, matricule: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="categorie">Catégorie</label>
              <input
                type="text"
                id="categorie"
                value={formData.categorie}
                onChange={(e) => setFormData(prev => ({ ...prev, categorie: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="photo">Photo</label>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Annuler
              </button>
              <button type="submit" className="btn-primary">
                {isEditing ? "Modifier" : "Créer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
          <div className="header-top">
            <div className="header-titles">
              <h1 className="page-title">Liste des Candidats</h1>
              <p className="page-subtitle">Découvrez tous les candidats participant au concours</p>
            </div>
            {isAdmin && (
              <div className="admin-actions-header">
                <button 
                  className="create-button"
                  onClick={() => setShowCreateModal(true)}
                >
                  + Nouveau candidat
                </button>
              </div>
            )}
          </div>
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
              {isAdmin && (
                <button 
                  className="create-button"
                  onClick={() => setShowCreateModal(true)}
                >
                  Créer le premier candidat
                </button>
              )}
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

      <footer className="candidat-footer">
        <p>
          {isAdmin ? (
            <span className="admin-badge">🔑 Mode Administrateur</span>
          ) : (
            <Link to="../Admin/Login" className="admin-link">🔑 Espace Administrateur</Link>
          )}
        </p>
      </footer>

      {/* Modal de vote */}
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

      {/* Modal de création/édition */}
      <CandidatModal
        isOpen={showCreateModal || !!editingCandidat}
        onClose={() => {
          setShowCreateModal(false);
          setEditingCandidat(null);
        }}
        onSave={handleSave}
        candidat={editingCandidat}
        isEditing={!!editingCandidat}
      />

      {/* Modal de confirmation de suppression */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Confirmer la suppression</h2>
            </div>
            <p>Êtes-vous sûr de vouloir supprimer ce candidat ? Cette action est irréversible.</p>
            <div className="modal-actions">
              <button 
                onClick={() => setDeleteConfirm(null)} 
                className="btn-secondary"
              >
                Annuler
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirm)} 
                className="btn-danger"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatListPage;