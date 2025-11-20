import { useState, type FormEvent, useEffect } from "react";
import "./CandidatCreate.css";
import type { CandidateData } from "../../../types/candidat";
import type { ConcoursAllResponse, Concours } from "../../../types/Concours";
import { ConcoursApi } from "../../../Api/Concours/concoursApi";
import { AdminApi } from "../../../Api/Admin/actionAdmin";

export const CandidatCreate: React.FC = () => {
  const [formData, setFormData] = useState<CandidateData>({
    firstname: "",
    lastname: "",
    description: "",
    photo: undefined,
    categorie: "",
    matricule: "",
    vote_id: 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Liste des concours de vote
  type Contest = { id: string; name: string };
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContestId, setSelectedContestId] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rawResponse: ConcoursAllResponse = await ConcoursApi.getAll();
        console.log("Ligne API response:", rawResponse);
    
    let response;
    
    // Si la réponse est une string avec des commentaires HTML, les nettoyer
    if (typeof rawResponse === 'string') {
      const jsonString = rawResponse.replace(/<!--|-->/g, '').trim();
      response = JSON.parse(jsonString);
    } else {
      response = rawResponse;
    }
        if (!mounted) return;

        console.log("API Response:", response); // Debug log

        // Gestion plus robuste de la réponse
        let contestsData: Concours[] = [];
        
        if (Array.isArray(response)) {
          // Si la réponse est directement un tableau
          contestsData = response;
        } else if (response && Array.isArray(response.data)) {
          // Si la réponse a une propriété data qui est un tableau
          contestsData = response.data;
        } else if (response && response.data && Array.isArray(response.data)) {
          // Si la réponse a une propriété concours
          contestsData = response.data;
        } else if (response && response && Array.isArray(response)) {
          // Si la réponse a une propriété results
          contestsData = response;
        }

        const formattedContests = contestsData.map((c) => ({ 
          id: c.id.toString(), 
          name: c.name 
        }));
        
        setContests(formattedContests);
        
        if (formattedContests.length > 0) {
          setSelectedContestId(formattedContests[0].id);
        }
      } catch (err) {
        console.error("Impossible de charger les concours:", err);
        setMessage("Erreur lors du chargement des concours");
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    if (!selectedContestId) {
      setMessage("Erreur: Veuillez sélectionner un concours");
      setLoading(false);
      return;
    }

    const submitData = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      description: formData.description,
      photo: formData.photo,
      categorie: formData.categorie,
      matricule: formData.matricule,
      vote_id: parseInt(selectedContestId),
    };

    try {
      const response = await AdminApi.Candidatcreate(submitData);

      if (response) {
        setIsSuccess(true);
        setMessage("Candidat créé avec succès !");
        console.log("Candidat créé avec succès:", response);

        // Reset du formulaire
        setFormData({
          firstname: "",
          lastname: "",
          description: "",
          photo: undefined,
          categorie: "",
          matricule: "",
          vote_id: 0
        });
        if (contests.length > 0) {
          setSelectedContestId(contests[0].id);
        }
      } else {
        throw new Error("La réponse du serveur est invalide.");
      }
    } catch (error: any) {
      console.error("Erreur lors de la création du candidat:", error);
      setMessage(
        `Erreur: La création du candidat a échoué. ${error.message || error}`
      );
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cc-form-container">
      <h2 className="cc-form-title">Ajouter un Nouveau Candidat</h2>

      {message && (
        <p className={`cc-alert ${isSuccess ? "cc-alert-success" : "cc-alert-error"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="cc-form">
        <div>
          <label htmlFor="firstname" className="cc-label">Prénom</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
            className="cc-input"
          />
        </div>

        <div>
          <label htmlFor="lastname" className="cc-label">Nom</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
            className="cc-input"
          />
        </div>

        <div>
          <label htmlFor="matricule" className="cc-label">Matricule</label>
          <input
            type="text"
            id="matricule"
            name="matricule"
            value={formData.matricule}
            onChange={handleChange}
            required
            className="cc-input"
          />
        </div>

        <div>
          <label htmlFor="description" className="cc-label">Biographie / Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="cc-textarea"
          />
        </div>

        <div>
          <label htmlFor="photo" className="cc-label">Photo</label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="cc-input"
          />
        </div>

        <div>
          <label htmlFor="contest" className="cc-label">Concours de vote</label>
          <select
            id="contest"
            name="contest"
            value={selectedContestId}
            onChange={(e) => setSelectedContestId(e.target.value)}
            className="cc-input"
            required
          >
            <option value="" disabled>-- Sélectionner un concours --</option>
            {contests.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="categorie" className="cc-label">Catégorie</label>
          <input
            type="text"
            id="categorie"
            name="categorie"
            value={formData.categorie}
            onChange={handleChange}
            required
            className="cc-input"
          />
        </div>

        <button type="submit" disabled={loading} className="cc-submit-button">
          {loading ? "Création en cours..." : "Créer le Candidat"}
        </button>
      </form>
    </div>
  );
};