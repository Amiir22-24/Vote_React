import { useState, type FormEvent, useEffect } from "react";
import { candidateApi } from "../../Api/candidates/candidatApi";
import "./CandidatCreate.css";
import type { CandidateData } from "../../types/candidat";
import { VoteApi } from "../../Api/Admin/actionAdmin";
import type { voteAllResponse } from "../../types/vote";



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
        const res = await VoteApi.getAll();
        if (!mounted) return;

        const votes = (res as voteAllResponse).data ?? [];
        const data = votes.map((v) => ({ id: String(v.id), name: v.name }));
        setContests(data);
        if (data.length) setSelectedContestId(data[0].id);
      } catch (err) {
        console.error("Impossible de charger les concours:", err);
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
    const formdata = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      description: formData.description,
      photo: formData.photo,
      categorie: formData.categorie,
      matricule: formData.matricule,
      vote_id: parseInt(selectedContestId),
    };

    try {
      const response = await candidateApi.create(formdata);

      if (response) {
        setIsSuccess(true);
        setMessage("Candidat créé avec succès !");

        console.log("Candidat créé avec succès:", response);
      }
      else 
        throw new Error(response as string || "La réponse du serveur est invalide.");
      


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
      setSelectedContestId("");
    } catch (error) {
      console.error("Erreur lors de la création du candidat:", error);
      setMessage(
        `Erreur: La création du candidat a échoué. ${error}`
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
