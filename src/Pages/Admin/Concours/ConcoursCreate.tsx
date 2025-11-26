import { useState, type FormEvent } from "react";
import "./ConcoursCreate.css";
import type { ConcoursData } from "../../../types/Concours";
import { AdminApi } from "../../../Api/Admin/actionAdmin";

export const ConcoursCreate: React.FC = () => {
  const [formData, setFormData] = useState<ConcoursData>({
    name: "",
    description: "",
    date_debut: new Date(),
    date_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
    statut: "à venir",
    image_url: "",
    prix_par_vote: 100,
    is_active: true
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'date' || name === 'echeance' ? new Date(value) : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    // Validation des dates
    if (formData.date_fin <= formData.date_debut) {
      setMessage("Erreur: La date de fin doit être postérieure à la date de début.");
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    try {
      // Préparer les données pour l'API
      const apiData = {
        name: formData.name,
        description: formData.description,
        date_debut: formData.date_debut,
        date_fin: formData.date_fin,
        statut: formData.statut,
        image_url: formData.image_url,
        prix_par_vote: formData.prix_par_vote,
        is_active: formData.is_active
      };

      const response = await AdminApi.ConcoursCreate(apiData);

      if (response && response.success) {
        console.log("Concours créé avec succès:", response.data);
        setMessage("Concours créé avec succès !");
        setIsSuccess(true);

        // Reset du formulaire
        setFormData({
          name: "",
          description: "",
          date_debut: new Date(),
          date_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          statut: "à venir",
          image_url: "",
          prix_par_vote: 100,
          is_active: true
        });
      } else {
        throw new Error(response?.message || "La réponse du serveur est invalide.");
      }
    } catch (error: any) {
      console.error("Erreur lors de la création du concours:", error);
      setMessage(
        `Erreur: La création du concours a échoué. ${error.message || error}`
      );
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vc-form-container">
      <h2 className="vc-form-title">Créer un Nouveau Concours</h2>

      {message && (
        <p className={`vc-alert ${isSuccess ? "vc-alert-success" : "vc-alert-error"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="vc-form">
        <div>
          <label htmlFor="name" className="vc-label">Nom du concours *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="vc-input"
            placeholder="Ex: Concours de Musique 2024"
          />
        </div>

        <div>
          <label htmlFor="description" className="vc-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="vc-textarea"
            placeholder="Décrivez le concours, ses objectifs, ses règles..."
          />
        </div>

        <div className="vc-form-row">
          <div>
            <label htmlFor="date" className="vc-label">Date de début *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date_debut.toISOString().split('T')[0]}
              onChange={handleChange}
              required
              className="vc-input"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label htmlFor="echeance" className="vc-label">Date de fin *</label>
            <input
              type="date"
              id="echeance"
              name="echeance"
              value={formData.date_fin.toISOString().split('T')[0]}
              onChange={handleChange}
              required
              className="vc-input"
              min={formData.date_debut.toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="vc-form-row">
          <div>
            <label htmlFor="statut" className="vc-label">Statut *</label>
            <select
              id="statut"
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              className="vc-select"
              required
            >
              <option value="à venir">À Venir</option>
              <option value="en cours">En Cours</option>
              <option value="passé">Terminé</option>
            </select>
          </div>

          <div>
            <label htmlFor="prix_par_vote" className="vc-label">Prix par vote (FCFA) *</label>
            <input
              type="number"
              id="prix_par_vote"
              name="prix_par_vote"
              value={formData.prix_par_vote}
              onChange={handleChange}
              required
              min="1"
              step="1"
              className="vc-input"
            />
          </div>
        </div>

        <div>
          <label htmlFor="image_url" className="vc-label">URL de l'image</label>
          <input
            type="file"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="vc-input"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="vc-checkbox-group">
          <label className="vc-checkbox-label">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="vc-checkbox"
            />
            Concours actif
          </label>
          <small className="vc-checkbox-help">
            Désactivez cette option pour masquer le concours sans le supprimer.
          </small>
        </div>

        <button type="submit" disabled={loading} className="vc-submit-button">
          {loading ? "Création en cours..." : "Créer le Concours"}
        </button>
      </form>
    </div>
  );
}; 