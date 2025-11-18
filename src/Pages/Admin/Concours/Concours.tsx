import { useState } from "react";
import { ConcoursCreate } from "./ConcoursCreate";
import "./ConcoursCreate.css"
import ConcoursList from "../../Users/ConcoursList";
export default function Concours() {
  type ActiveComponent = "ConcoursList" | "ConcoursCreate";
  const [activeComponent, setActiveComponent] = useState<ActiveComponent>("ConcoursList");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "ConcoursList":
        return <ConcoursList />;
      case "ConcoursCreate":
        return <ConcoursCreate />;
      default:
        return <ConcoursList />;
    }
  };

  return (
    <div className="concours-container">
      <div className="concours-header">
        <h2>Gestion des Concours</h2>
        <button
          onClick={() =>
            setActiveComponent(activeComponent === "ConcoursList" ? "ConcoursCreate" : "ConcoursList")
          }
          className="cc-button-primary"
        >
          {activeComponent === "ConcoursList" ? "Ajouter un concours" : "Retour à la liste"}
        </button>
      </div>

      <section className="concours-content">{renderActiveComponent()}</section>
    </div>
  );
}
