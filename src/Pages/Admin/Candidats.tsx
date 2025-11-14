import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import CandidatList from "../CandidatList";
import { CandidatCreate } from "./CandidatCreate";
import { useState } from "react";

export default function Candidats() {
  const navigate = useNavigate();

  type ActiveComponent =
    | "candidatList"
    | "candidatCreate"
    | "concours"
    | "statistiques"
    | "transactions";

  const [activeComponent, setActiveComponent] = useState<ActiveComponent>("candidatList");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "candidatList":
        return <CandidatList />;
      case "candidatCreate":
        return <CandidatCreate />;
      case "concours":
        return <div>Contenu Concours</div>;
      case "statistiques":
        return <div>Contenu Statistiques</div>;
      case "transactions":
        return <div>Contenu Transactions</div>;
      default:
        return <CandidatList />;
    }
  };

  const handleNavigationClick = () => {
    setActiveComponent((prev) =>
      prev === "candidatList" ? "candidatCreate" : "candidatList"
    );
  };

  return (
    <main className="dashboard-main" aria-label="Contenu principal">
      <div className="candidats-header">
        <h2>Liste des candidats</h2>

        <button onClick={handleNavigationClick} className="cc-button-primary">
          {activeComponent === "candidatList" ? "Ajouter un candidat" : "Retour à la liste"}
        </button>
      </div>

      {/* Zone d'affichage des candidats */}
      <section className="candidats-list">
        {renderActiveComponent()}
      </section>
    </main>
  );
}
