import { useState, type FormEvent } from "react";
import { candidateApi } from "../../Api/candidates/candidatApi";
import "./CandidatCreate.css";
import type { CandidateData } from "../../types/candidat";



export const CandidatCreate: React.FC = () => {
  const [formData, setFormData] = useState<CandidateData>({
    firstname: "",
    lastname: "",
    description: "",
    photo: undefined,
    categorie: "",
    matricule: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

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
    };

    try {
      const response = await candidateApi.create(formdata);

      if (response.success) {

        console.log("Candidat créé avec succès:", response);
        setMessage("Candidat créé avec succès !");
        setIsSuccess(true);
      }
      else 
        throw new Error(response.message);
      


      // Reset du formulaire
      setFormData({
        firstname: "",
        lastname: "",
        description: "",
        photo: undefined,
        categorie: "",
        matricule: "",
      });
    } catch (error) {
      console.error("Erreur lors de la création du candidat:", error);
      setMessage(
        `Erreur: La création du candidat a échoué. ${error instanceof Error ? error.message : ""
        }`
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
