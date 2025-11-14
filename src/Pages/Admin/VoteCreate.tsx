import { useState, type FormEvent } from "react";
import { VoteApi } from "../../Api/Admin/actionAdmin"; // ton API pour votes
import "./VoteCreate.css";
import type { voteData, voteType } from "../../types/vote";

export const VoteCreate: React.FC = () => {
  const [formData, setFormData] = useState<voteData>({
    id: 0,
    name: "",
    date: new Date(),
    echeance: new Date(),
    statuts: "A venir ",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "date" || name === "echeance" ? new Date(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    try {
      const formDataObj = new FormData();
      formDataObj.append("id", formData.id.toString());
      formDataObj.append("name", formData.name);
      formDataObj.append("date", formData.date.toISOString());
      formDataObj.append("echeance", formData.echeance.toISOString());
      formDataObj.append("statuts", formData.statuts);

      const response = await VoteApi.create(formDataObj); // appel à ton API
      const data = (response as any).data as { success?: boolean; message?: string };

      if (data?.success) {
        console.log("Vote créé avec succès:", data);
        setMessage("Vote créé avec succès !");
        setIsSuccess(true);

        // Reset du formulaire
        setFormData({
          id: 0,
          name: "",
          date: new Date(),
          echeance: new Date(),
          statuts: "A venir ",
        });
      } else {
        throw new Error(data?.message || "La réponse du serveur est invalide.");
      }
    } catch (error) {
      console.error("Erreur lors de la création du vote:", error);
      setMessage(
        `Erreur: La création du vote a échoué. ${
          error instanceof Error ? error.message : ""
        }`
      );
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vc-form-container">
      <h2 className="vc-form-title">Créer un Nouveau Vote / Concours</h2>

      {message && (
        <p className={`vc-alert ${isSuccess ? "vc-alert-success" : "vc-alert-error"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="vc-form">
        <div>
          <label htmlFor="name" className="vc-label">Nom du vote</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="vc-input"
          />
        </div>

        <div>
          <label htmlFor="date" className="vc-label">Date de début</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date.toISOString().split("T")[0]}
            onChange={handleChange}
            required
            className="vc-input"
          />
        </div>

        <div>
          <label htmlFor="echeance" className="vc-label">Échéance</label>
          <input
            type="date"
            id="echeance"
            name="echeance"
            value={formData.echeance.toISOString().split("T")[0]}
            onChange={handleChange}
            required
            className="vc-input"
          />
        </div>

        <div>
          <label htmlFor="statuts" className="vc-label">Statut</label>
          <select
            id="statuts"
            name="statuts"
            value={formData.statuts}
            onChange={handleChange}
            className="vc-select"
          >
            <option value="En cours">En cours</option>
            <option value="Expiré">Expiré</option>
            <option value="A venir ">A venir</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="vc-submit-button">
          {loading ? "Création en cours..." : "Créer le Vote"}
        </button>
      </form>
    </div>
  );
};
