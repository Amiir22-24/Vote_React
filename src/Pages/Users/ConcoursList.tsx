import React, { useEffect, useState } from "react";
import "./concours.css";
import type { Concours as ConcoursType } from "../../types/Concours";
import { useNavigate } from "react-router";
import { ConcoursApi } from "../../Api/Concours/concoursApi";
import { AdminApi } from "../../Api/Admin/actionAdmin";

// VoteCard local avec actions CRUD
const ConcoursCard: React.FC<{ 
  concours: ConcoursType; 
  onOpen: (id: number) => void;
  onEdit: (concours: ConcoursType) => void;
  onDelete: (id: number) => void;
  isAdmin: boolean;
}> = ({ concours, onOpen, onEdit, onDelete, isAdmin }) => {
  const getStatusColor = (status: ConcoursType["statut"]) => {
    switch (status) {
      case "en cours": return "#28a745";   // vert
      case "à venir": return "#ffc107";    // jaune
      case "passé": return "#dc3545";      // rouge
      default: return "#6c757d";           // gris
    }
  };

  const getStatusText = (status: ConcoursType["statut"]) => {
    switch (status) {
      case "en cours": return "En Cours";
      case "à venir": return "À Venir";
      case "passé": return "Terminé";
      default: return status;
    }
  };

  return (
    <div className="vote-card">
      {concours.image_url && (
        <div className="vote-image">
          <img src={concours.image_url} alt={concours.name} />
        </div>
      )}
      <h3 className="vote-name">{concours.name}</h3>
      <p className="vote-description">{concours.description}</p>
      <div className="vote-dates">
        <p>Début : {new Date(concours.date_debut).toLocaleDateString()}</p>
        <p>Fin : {new Date(concours.date_fin).toLocaleDateString()}</p>
      </div>
      <div className="vote-stats">
        <span className="stat-item"> {concours.nombre_candidats} candidats</span>
        <span className="stat-item"> {concours.nombre_votes} votes</span>
        <span className="stat-item"> {concours.total_recettes} FCFA</span>
      </div>
      <span 
        className="vote-status" 
        style={{ backgroundColor: getStatusColor(concours.statut) }}
      >
        {getStatusText(concours.statut)}
      </span>
      
      <div className="vote-actions">
        <button className="vote-button primary" onClick={() => onOpen(concours.id)}>
          Voir les candidats
        </button>
        
        {isAdmin && (
          <div className="admin-actions">
            <button 
              className="vote-button edit" 
              onClick={() => onEdit(concours)}
              title="Modifier le concours"
            >
              Modifier
            </button>
            <button 
              className="vote-button delete" 
              onClick={() => onDelete(concours.id)}
              title="Supprimer le concours"
            >
              Supprimer
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
    description: "",
    date_debut: "",
    date_fin: "",
    statut: "à venir" as ConcoursType["statut"],
    image_url: "",
    prix_par_vote: 100,
    is_active: true
  });

  useEffect(() => {
    if (concours) {
      setFormData({
        name: concours.name,
        description: concours.description || "",
        date_debut: concours.date_debut.split('T')[0],
        date_fin: concours.date_fin.split('T')[0],
        statut: concours.statut,
        image_url: concours.image_url || "",
        prix_par_vote: concours.prix_par_vote || 100,
        is_active: concours.is_active !== undefined ? concours.is_active : true
      });
    } else {
      setFormData({
        name: "",
        description: "",
        date_debut: "",
        date_fin: "",
        statut: "à venir",
        image_url: "",
        prix_par_vote: 100,
        is_active: true
      });
    }
  }, [concours]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
          <h2>{isEditing ? "Modifier le concours" : "Créer un nouveau concours"}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Nom du concours *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date_debut">Date de début *</label>
              <input
                type="date"
                id="date_debut"
                value={formData.date_debut}
                onChange={(e) => setFormData(prev => ({ ...prev, date_debut: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date_fin">Date de fin *</label>
              <input
                type="date"
                id="date_fin"
                value={formData.date_fin}
                onChange={(e) => setFormData(prev => ({ ...prev, date_fin: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="statut">Statut *</label>
              <select
                id="statut"
                value={formData.statut}
                onChange={(e) => setFormData(prev => ({ ...prev, statut: e.target.value as ConcoursType["statut"] }))}
                required
              >
                <option value="à venir">À Venir</option>
                <option value="en cours">En Cours</option>
                <option value="passé">Terminé</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="prix_par_vote">Prix par vote (FCFA) *</label>
              <input
                type="number"
                id="prix_par_vote"
                value={formData.prix_par_vote}
                onChange={(e) => setFormData(prev => ({ ...prev, prix_par_vote: parseInt(e.target.value) }))}
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image_url">URL de l'image</label>
            <input
              type="url"
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              />
              <span className="checkmark"></span>
              Concours actif
            </label>
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

const ConcoursList: React.FC = () => {
  const [concours, setConcours] = useState<ConcoursType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingConcours, setEditingConcours] = useState<ConcoursType | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'actifs' | 'a_venir' | 'passes'>('all');
  
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

  const fetchConcours = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ConcoursApi.getAll();
      
      // Vérifier la structure de la réponse
      if (response && response.success) {
        setConcours(response.data);
      } else {
        throw new Error(response?.message || "Format de réponse invalide");
      }
    } catch (err: any) {
      console.error("Erreur lors du chargement des concours:", err);
      setError(err?.message || "Erreur lors du chargement des concours");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConcours();
  }, []);

  const handleOpen = (id: number) => {
    navigate(`/concours/${id}/candidats`);
  };

  const handleEdit = (concours: ConcoursType) => {
    setEditingConcours(concours);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin) return;
    
    try {
      await AdminApi.ConcoursDestroy(id);
      setConcours(prev => prev.filter(concours => concours.id !== id));
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
        await AdminApi.ConcoursCreate(formData);
      }
      
      setModalOpen(false);
      setEditingConcours(null);
      fetchConcours(); // Recharger la liste
    } catch (err: any) {
      console.error("Erreur lors de la sauvegarde:", err);
      setError("Erreur lors de la sauvegarde du concours");
    }
  };

  // Filtrer les concours
  const filteredConcours = concours.filter(concours => {
    switch (filter) {
      case 'actifs':
        return concours.statut === 'en cours';
      case 'a_venir':
        return concours.statut === 'à venir';
      case 'passes':
        return concours.statut === 'passé';
      default:
        return true;
    }
  });

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Chargement des concours...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Erreur de chargement</h3>
      <p>{error}</p>
      <button className="retry-button" onClick={fetchConcours}>
        Réessayer
      </button>
    </div>
  );

  return (
    <div className="concours-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Liste des concours</h1>
          {isAdmin && (
            <button 
              className="create-button"
              onClick={() => setModalOpen(true)}
            >
              + Nouveau concours
            </button>
          )}
        </div>
        
        {/* Filtres */}
        <div className="filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tous ({concours.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'actifs' ? 'active' : ''}`}
            onClick={() => setFilter('actifs')}
          >
            En Cours ({concours.filter(c => c.statut === 'en cours').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'a_venir' ? 'active' : ''}`}
            onClick={() => setFilter('a_venir')}
          >
            À Venir ({concours.filter(c => c.statut === 'à venir').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'passes' ? 'active' : ''}`}
            onClick={() => setFilter('passes')}
          >
            Terminés ({concours.filter(c => c.statut === 'passé').length})
          </button>
        </div>
      </div>

      <div className="vote-grid">
        {filteredConcours.length > 0 ? (
          filteredConcours.map(concours => (
            <ConcoursCard
              key={concours.id}
              concours={concours}
              onOpen={handleOpen}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteConfirm(id)}
              isAdmin={isAdmin}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <h3>Aucun concours trouvé</h3>
            <p>Aucun concours ne correspond aux critères sélectionnés.</p>
          </div>
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