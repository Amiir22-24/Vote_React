import { useState } from "react";
import VoteList from "../VoteList";
import { VoteCreate } from "../Admin/VoteCreate";

export default function Concours() {
  type ActiveComponent = "voteList" | "voteCreate";
  const [activeComponent, setActiveComponent] = useState<ActiveComponent>("voteList");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "voteList":
        return <VoteList />;
      case "voteCreate":
        return <VoteCreate />;
      default:
        return <VoteList />;
    }
  };

  return (
    <div className="concours-container">
      <div className="concours-header">
        <h2>Gestion des Concours</h2>
        <button
          onClick={() =>
            setActiveComponent(activeComponent === "voteList" ? "voteCreate" : "voteList")
          }
          className="cc-button-primary"
        >
          {activeComponent === "voteList" ? "Ajouter un concours" : "Retour à la liste"}
        </button>
      </div>

      <section className="concours-content">{renderActiveComponent()}</section>
    </div>
  );
}
