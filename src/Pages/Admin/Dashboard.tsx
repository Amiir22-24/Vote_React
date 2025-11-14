import React from "react";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  return (
      <main className="dashboard-main" aria-label="Contenu principal">
        <section>
          <h2>Vue d&apos;ensemble</h2>
          <p className="subtitle">
            Tableau de bord principal de la plateforme de vote
          </p>

          <div className="summary-cards">
            <article className="card">
              <div className="card-content">
                <p className="card-title">Total des votes</p>
                <p className="card-value">1,247</p>
              </div>
              <div className="card-icon" aria-hidden="true">❤️</div>
            </article>
            <article className="card">
              <div className="card-content">
                <p className="card-title">Revenus totaux</p>
                <p className="card-value">124,700 FCFA</p>
              </div>
              <div className="card-icon" aria-hidden="true">💵</div>
            </article>
            <article className="card">
              <div className="card-content">
                <p className="card-title">Candidats actifs</p>
                <p className="card-value">6</p>
              </div>
              <div className="card-icon" aria-hidden="true">👤</div>
            </article>
            <article className="card">
              <div className="card-content">
                <p className="card-title">Concours en cours</p>
                <p className="card-value">1</p>
              </div>
              <div className="card-icon" aria-hidden="true">🏆</div>
            </article>
          </div>
        </section>

        <section className="recent-activity">
          <h3>Activité récente</h3>
          <ul>
            <li>
              <div className="activity-desc">
                <strong>Nouveau vote pour Sarah Dubois</strong>
                <span className="activity-time">Il y a 2 minutes</span>
              </div>
              <div className="activity-value">300 FCFA</div>
            </li>
            <li>
              <div className="activity-desc">
                <strong>Nouveau vote pour Marie Kouassi</strong>
                <span className="activity-time">Il y a 5 minutes</span>
              </div>
              <div className="activity-value">100 FCFA</div>
            </li>
            <li>
              <div className="activity-desc">
                <strong>Nouveau vote pour Jean Baptiste</strong>
                <span className="activity-time">Il y a 8 minutes</span>
              </div>
              <div className="activity-value">500 FCFA</div>
            </li>
          </ul>
        </section>
      </main>
  );
};

export default Dashboard;
