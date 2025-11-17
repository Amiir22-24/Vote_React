import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Candidats from "./Candidats/Candidats";
import Concours from "./Concours/Concours";
import Statistiques from "./Statistique";
import { useNavigate } from "react-router";

type ActiveComponent = "dashboard" | "candidats" | "concours" | "statistiques" | "transactions";

const SideBar: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<ActiveComponent>("dashboard");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <Dashboard />;
      case "candidats":
        return <Candidats />;
      case "concours":
        return <Concours />;
      case "statistiques":
        return <Statistiques />;
      case "transactions":
        return <div>Contenu Transactions</div>;
      default:
        return <Dashboard />;
    }
  };
  const navigate = useNavigate();
  const handleNavigationClick = (component: ActiveComponent) => {
    setActiveComponent(component);
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <button
          className="back-button"
          aria-label="Retour au vote"
          onClick={() => navigate("/")}
        >
          ← Retour au vote
        </button>
        <h1>Administration</h1>
        <div className="user-profile" title="Administrateur">
          <span className="user-icon" aria-hidden="true">👤</span>
          <span className="user-name">{localStorage.getItem("authname")}</span>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <nav className="dashboard-sidebar" aria-label="Menu de navigation">
        <ul>
          <li className={activeComponent === "dashboard" ? "active" : ""}>
            <button onClick={() => handleNavigationClick("dashboard")}>
              <span className="icon" aria-hidden="true">📊</span>
              Vue d&apos;ensemble
            </button>
          </li>
          <li className={activeComponent === "concours" ? "active" : ""}>
            <button onClick={() => handleNavigationClick("concours")}>
              <span className="icon" aria-hidden="true">🏆</span>
              Concours
            </button>
          </li>
          <li className={activeComponent === "candidats" ? "active" : ""}>
            <button onClick={() => handleNavigationClick("candidats")}>
              <span className="icon" aria-hidden="true">👥</span>
              Candidats
            </button>
          </li>
          <li className={activeComponent === "statistiques" ? "active" : ""}>
            <button onClick={() => handleNavigationClick("statistiques")}>
              <span className="icon" aria-hidden="true">📈</span>
              Statistiques
            </button>
          </li>
          <li className={activeComponent === "transactions" ? "active" : ""}>
            <button onClick={() => handleNavigationClick("transactions")}>
              <span className="icon" aria-hidden="true">💰</span>
              Transactions
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {renderActiveComponent()}
      </main>
    </div>
  );
}

export default SideBar;