import { useState, type FormEvent, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { candidateApi } from "../../Api/candidates/candidatApi";
import "./CandidatCreate.css";
import type { CandidateData } from "../../types/candidat";
import { VoteApi } from "../../Api/Admin/actionAdmin";
import type { voteAllResponse } from "../../types/vote";



export const CandidatUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
        // Charger les concours
        const res = await VoteApi.getAll();
        if (!mounted) return;

        const votes = (res as voteAllResponse).data ?? [];
        const data = votes.map((v) => ({ id: String(v.id), name: v.name }));
        setContests(data);

        // Charger les données du candidat à modifier
        if (!id) {
          setMessage("ID du candidat manquant");
          return;
        }

        const candidate = await candidateApi.getById(parseInt(id));
        if (!mounted) return;

        // Remplir le formulaire avec les données du candidat
        setFormData({
          firstname: candidate.firstname,
          lastname: candidate.lastname,
          description: candidate.description,
          photo: undefined, // on n'affiche pas l'image existante dans le file input
          categorie: typeof candidate.categorie === 'string' ? candidate.categorie : (candidate.categorie as unknown as string) ?? "",
          matricule: "",
          vote_id: candidate.vote_id ?? 0,
        });

        // Pré-sélectionner le concours du candidat
        setSelectedContestId(String(candidate.vote_id ?? 0));
      } catch (err) {
        console.error("Impossible de charger les données:", err);
        setMessage("Erreur lors du chargement des données du candidat");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    if (!id) {
      setMessage("ID du candidat manquant");
      setLoading(false);
      return;
    }

    const formdata = new FormData();
    formdata.append("firstname", formData.firstname);
    formdata.append("lastname", formData.lastname);
    formdata.append("description", formData.description);
    formdata.append("categorie", formData.categorie ?? "");
    formdata.append("matricule", formData.matricule);
    formdata.append("vote_id", String(parseInt(selectedContestId)));
    
    // Ajouter la photo uniquement si une nouvelle a été sélectionnée
    if (formData.photo) {
      formdata.append("photo", formData.photo);
    }

    try {
      const response = await candidateApi.update(parseInt(id), formdata);

      if (response) {
        setIsSuccess(true);
        setMessage("Candidat mis à jour avec succès !");
        console.log("Candidat mis à jour avec succès:", response);
        
        // Rediriger vers la liste après 2 secondes
        setTimeout(() => {
          navigate("/admin/candidats");
        }, 2000);
      } else {
        throw new Error("La réponse du serveur est invalide.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du candidat:", error);
      setMessage(
        `Erreur: La mise à jour du candidat a échoué. ${error instanceof Error ? error.message : ""}`
      );
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cc-form-container">
      <h2 className="cc-form-title">Mettre à jour le Candidat</h2>

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
