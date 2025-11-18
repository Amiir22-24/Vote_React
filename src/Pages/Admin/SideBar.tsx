import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Candidats from "./Candidats/Candidats";
import Concours from "./Concours/Concours";
import Statistiques from "./Statistique";

type ActiveComponent = "dashboard" | "candidats" | "concours" | "statistiques" | "transactions";

const SideBar: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<ActiveComponent>("dashboard");
  const navigate = useNavigate(); // hook pour la navigation

  const menuItems: { key: ActiveComponent; label: string; icon: string }[] = [
    { key: "dashboard", label: "Vue d'ensemble", icon: "📊" },
    { key: "concours", label: "Concours", icon: "🏆" },
    { key: "candidats", label: "Candidats", icon: "👥" },
    { key: "statistiques", label: "Statistiques", icon: "📈" },
    { key: "transactions", label: "Transactions", icon: "💰" },
  ];

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
          <span className="user-name">{localStorage.getItem("authname") || "Admin"}</span>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <nav className="dashboard-sidebar" aria-label="Menu de navigation">
        <ul>
          {menuItems.map((item) => (
            <li key={item.key} className={activeComponent === item.key ? "active" : ""}>
              <button onClick={() => handleNavigationClick(item.key)}>
                <span className="icon" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">{renderActiveComponent()}</main>
    </div>
  );
};

export default SideBar;
