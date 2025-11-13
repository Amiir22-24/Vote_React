import axios from "axios";
import { useState, type FormEvent } from "react";
import "./CandidatCreate.css"; 
import { Link } from "react-router";


interface CandidateData {
  name: string;
  nickname: string;
  photo_url: string;
  details: string;
  eventId: number; 
}

export const CandidatCreate: React.FC = () => {
  
  const [formData, setFormData] = useState<CandidateData>({
    name: '',
    nickname: '',
    photo_url: '',
    details: '',
    eventId: 1, 
  });
  
  const [loading, setLoading] = useState(false);
  
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'eventId' ? Number(value) : value,
    }));
  };
   
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsSuccess(false);

    try {
      
      const response = await axios.post('VOTRE_URL_API/api/candidates', formData, {});

      console.log('Candidat créé avec succès:', response.data);
      setMessage('Candidat créé avec succès !');
      setIsSuccess(true);
      
      
      setFormData({
        name: '',
        nickname: '',
        photo_url: '',
        details: '',
        eventId: formData.eventId, 
      });

    } catch (error) {
      console.error('Erreur lors de la création du candidat:', error);
      setMessage(`Erreur: La création du candidat a échoué. ${error instanceof Error ? error.message : ''}`);
      setIsSuccess(false); // Statut Erreur
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <div className="cc-form-container">
      <h2 className="cc-form-title">Ajouter un Nouveau Candidat</h2>
      
      {/* Affichage du message de retour avec classes CSS dynamiques */}
      {message && (
        <p className={`cc-alert ${isSuccess ? 'cc-alert-success' : 'cc-alert-error'}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="cc-form">
        
        {/* Champ Nom et Prénom */}
        <div>
          <label htmlFor="name" className="cc-label">Nom et Prénom</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="cc-input"
          />
        </div>

        
        <div>
          <label htmlFor="nickname" className="cc-label">Surnom ou Numéro de Candidat</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            required
            className="cc-input"
          />
        </div>

        <div>
          <label htmlFor="photo_url" className="cc-label">URL de la Photo</label>
          <input 
            type="url"
            id="photo_url"
            name="photo_url"
            value={formData.photo_url}
            onChange={handleChange}
            className="cc-input"
          />
          <p className="cc-small-text">Pour le moment, entrez le lien de l'image. La gestion des uploads de fichiers peut être ajoutée plus tard.</p>
        </div>

        {/* Champ Détails/Biographie */}
        <div>
          <label htmlFor="details" className="cc-label">Biographie/Détails</label>
          <textarea
            id="details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows={4}
            className="cc-textarea"
          />
        </div>

        
        <div>
          <label htmlFor="eventId" className="cc-label">ID de l'Événement</label>
          <input
            type="number"
            id="eventId"
            name="eventId"
            value={formData.eventId}
            onChange={handleChange}
            required
            readOnly 
            className="cc-input cc-input-readonly"
          />
        </div>

        {/* Bouton de Soumission */}
        <button
          type="submit"
          disabled={loading}
          className="cc-submit-button"
        >
          {loading ? 'Création en cours...' : 'Créer le Candidat'}
        </button>
        <Link to="./Admin/login">Connexion</Link>
      </form>
    </div>
  );
};