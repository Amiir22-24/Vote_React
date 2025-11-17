import { useState } from "react";
import ConcoursList from "./ConcoursList";
import CandidatListPage from "./CandidatList";


type ActiveComponent = "candidats" | "concours";

const UserPage: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<ActiveComponent>("candidats");

    const renderActiveComponent = () => {
        switch (activeComponent) {

            case "candidats":
                return <CandidatListPage />;
            case "concours":
                return <ConcoursList />;

            default:
                return <CandidatListPage />;
        }


    };
    const handleNavigationClick = (component: ActiveComponent) => {
        setActiveComponent(component);
    };
    return (
        <div>
                <nav className="navbar" aria-label="Menu de navigation">
                    <div className="nav-container">
                        <div className="nav-logo">
                            <h2>Dzumévi</h2>
                        </div>
                        <ul className="nav-links">
                            <li className={activeComponent === "candidats" ? "active" : ""}>
                                <button onClick={() => handleNavigationClick("candidats")}>

                                    Candidats
                                </button>
                            </li>
                            <li className={activeComponent === "concours" ? "active" : ""}>
                                <button onClick={() => handleNavigationClick("concours")}>
                                    Concours
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>

            <main className="dashboard-main">
                {renderActiveComponent()}
            </main>
        </div>
    );

}
export default UserPage;