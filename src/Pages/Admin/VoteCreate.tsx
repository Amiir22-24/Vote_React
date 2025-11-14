import { useState, type FormEvent } from "react";
import { VoteApi } from "../../Api/Admin/actionAdmin"; // API votes
import "./VoteCreate.css";
import type { voteData,  } from "../../types/vote";

export const VoteCreate: React.FC = () => {
  // Un nom d'état cohérent: formData / setFormData
  const [formData, setFormData] = useState<voteData>({
    name: "",
    date: new Date(),
    echeance: new Date(),
    statuts: "à venir",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "date" || name === "echeance" ? new Date(value) : value,
    } as unknown as voteData));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    try {
      const response = await VoteApi.create(formData);

      // VoteApi.create est maintenant censé retourner response.data (voir actionAdmin)
      if (response) {
        console.log("Vote créé avec succès:", (response.data));
        setMessage("Vote créé avec succès !");
        setIsSuccess(true);

        // Reset du formulaire
        setFormData({
          name: "",
          date: new Date(),
          echeance: new Date(),
          statuts: "à venir",
        });
      } else {
        throw new Error((response as string) || "La réponse du serveur est invalide.");
      }
    } catch (error) {
      console.error("Erreur lors de la création du vote:", error);
      setMessage(
        `Erreur: La création du vote a échoué. ${error}`
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
            <option value=""></option>
            <option value="en cours">En cours</option>
            <option value="passé">Passé</option>
            <option value="à venir ">A venir</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="vc-submit-button">
          {loading ? "Création en cours..." : "Créer le Vote"}
        </button>
      </form>
    </div>
  );
};
