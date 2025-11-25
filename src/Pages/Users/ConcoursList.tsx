import React, { useEffect, useState } from "react";
import "./concours.css";
import type { Concours as ConcoursType } from "../../types/Concours";
import { useNavigate } from "react-router";
import { ConcoursApi } from "../../Api/Concours/concoursApi";
import { AdminApi } from "../../Api/Admin/actionAdmin";
import { ConcoursCreate } from "../Admin/Concours/ConcoursCreate";

// VoteCard local avec actions CRUD
const ConcoursCard: React.FC<{ 
  vote: ConcoursType; 
  onOpen: (id: number) => void;
  onEdit: (vote: ConcoursType) => void;
  onDelete: (id: number) => void;
  isAdmin: boolean;
}> = ({ vote, onOpen, onEdit, onDelete, isAdmin }) => {
  const getStatusColor = (status: ConcoursType["statuts"]) => {
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
      
      <div className="vote-actions">
        <button className="vote-button primary" onClick={() => onOpen(vote.id)}>
          Voir détails
        </button>
        
        {isAdmin && (
          <div className="admin-actions">
            <button 
              className="vote-button edit" 
              onClick={() => onEdit(vote)}
              title="Modifier le concours"
            >
              ✏️
            </button>
            <button 
              className="vote-button delete" 
              onClick={() => onDelete(vote.id)}
              title="Supprimer le concours"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Modal pour créer/modifier un concours
const ConcoursModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  concours?: ConcoursType | null;
  isEditing: boolean;
}> = ({ isOpen, onClose, onSave, concours, isEditing }) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    echeance: "",
    statuts: "à venir" as ConcoursType["statuts"]
  });

  useEffect(() => {
    if (concours) {
      setFormData({
        name: concours.name,
        date: (typeof concours.date === 'string' ? concours.date : concours.date.toISOString()).split('T')[0], // Format YYYY-MM-DD
        echeance: (typeof concours.echeance === 'string' ? concours.echeance : concours.echeance.toISOString()).split('T')[0],
        statuts: concours.statuts
      });
    } else {
      setFormData({
        name: "",
        date: "",
        echeance: "",
        statuts: "à venir"
      });
    }
  }, [concours]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return( 
    <ConcoursCreate />
  );
};

const ConcoursList: React.FC = () => {
  const [votes, setVotes] = useState<ConcoursType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingConcours, setEditingConcours] = useState<ConcoursType | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem("authToken");
      const adminName = localStorage.getItem("authname");
      setIsAdmin(!!(token && adminName));
    };

    checkAdmin();
  }, []);

  const fetchVotes = async () => {
    try {
      setLoading(true);
      const rawResponse = await ConcoursApi.getAll();
      
      let responseData;
      if (typeof rawResponse === 'string') {
        const jsonString = (rawResponse as string).replace(/<!--|-->/g, '').trim();
        responseData = JSON.parse(jsonString);
      } else {
        responseData = rawResponse;
      }

      let contestsData: ConcoursType[] = [];
      if (Array.isArray(responseData)) {
        contestsData = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        contestsData = responseData.data;
      }

      setVotes(contestsData);
    } catch (err: any) {
      console.error("Erreur lors du chargement des concours:", err);
      setError(err?.message || "Erreur lors du chargement des votes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  const handleOpen = (id: number) => {
    navigate(`/concours/${id}/candidats`);
  };

  const handleEdit = (vote: ConcoursType) => {
    setEditingConcours(vote);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin) return;
    
    try {
      await AdminApi.ConcoursDestroy(id);
      setVotes(prev => prev.filter(vote => vote.id !== id));
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error("Erreur lors de la suppression:", err);
      setError("Erreur lors de la suppression du concours");
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (editingConcours) {
        // Modification
        await AdminApi.ConcoursUpdate(editingConcours.id, formData);
      } else {
        // Création
        await AdminApi.ConconrsCreate(formData);
      }
      
      setModalOpen(false);
      setEditingConcours(null);
      fetchVotes(); // Recharger la liste
    } catch (err: any) {
      console.error("Erreur lors de la sauvegarde:", err);
      setError("Erreur lors de la sauvegarde du concours");
    }
  };

  const handleCreateNew = () => {
    setEditingConcours(null);
    setModalOpen(true);
  };

  if (loading) return <p>Chargement des votes...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="concours-container">
      <div className="page-header">
        <h1>Liste des concours</h1>
        {isAdmin && (
          <button className="create-button" onClick={handleCreateNew}>
            + Nouveau concours
          </button>
        )}
      </div>

      <div className="vote-grid">
        {votes.length > 0 ? (
          votes.map(vote => (
            <ConcoursCard
              key={vote.id}
              vote={vote}
              onOpen={handleOpen}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteConfirm(id)}
              isAdmin={isAdmin}
            />
          ))
        ) : (
          <p>Aucun concours disponible</p>
        )}
      </div>

      {/* Modal de création/édition */}
      <ConcoursModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingConcours(null);
        }}
        onSave={handleSave}
        concours={editingConcours}
        isEditing={!!editingConcours}
      />

      {/* Modal de confirmation de suppression */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Confirmer la suppression</h2>
            </div>
            <p>Êtes-vous sûr de vouloir supprimer ce concours ? Cette action est irréversible.</p>
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

export default ConcoursList;