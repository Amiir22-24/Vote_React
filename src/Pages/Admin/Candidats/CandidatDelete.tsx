import axios from "axios";
import { useState, type FormEvent } from "react";
import "./CandidatCreate.css"; // on peut réutiliser le même CSS

interface DeleteData {
  candidateId: number;
}

export const CandidatDelete: React.FC = () => {
  const [formData, setFormData] = useState<DeleteData>({
    candidateId: 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.candidateId) {
      setMessage("Veuillez saisir un ID valide.");
      setIsSuccess(false);
      return;
    }

    if (!window.confirm("Voulez-vous vraiment supprimer ce candidat ?")) return;

    setLoading(true);
    setMessage('');
    setIsSuccess(false);

    try {
      const response = await axios.delete(`VOTRE_URL_API/api/candidates/${formData.candidateId}`);
      
      console.log("Candidat supprimé:", response.data);
      setMessage("Candidat supprimé avec succès !");
      setIsSuccess(true);

      setFormData({ candidateId: 0 });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      if (axios.isAxiosError(error) && error.response) {
        setMessage(`Erreur: ${error.response.data.message || "La suppression a échoué."}`);
      } else {
        setMessage(`Erreur: ${error instanceof Error ? error.message : ""}`);
      }
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cc-form-container">
      <h2 className="cc-form-title">Supprimer un Candidat</h2>

      {message && (
        <p className={`cc-alert ${isSuccess ? 'cc-alert-success' : 'cc-alert-error'}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="cc-form">
        <div>
          <label htmlFor="candidateId" className="cc-label">ID du Candidat</label>
          <input
            type="number"
            id="candidateId"
            name="candidateId"
            value={formData.candidateId}
            onChange={handleChange}
            required
            className="cc-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="cc-submit-button"
        >
          {loading ? 'Suppression en cours...' : 'Supprimer le Candidat'}
        </button>
      </form>
    </div>
  );
};
