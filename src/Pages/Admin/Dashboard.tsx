import React, { useEffect, useState } from "react";
import "./Dashboard.css";

interface SummaryCard {
  title: string;
  icon: string;
}

interface ActivityItem {
  description: string;
  time: string;
  amount: string | number;
}

const Dashboard: React.FC = () => {
  const [summaryCards, setSummaryCards] = useState<SummaryCard[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const summary: SummaryCard[] = [
        { title: "Total des votes", icon: "❤️" },
        { title: "Revenus totaux", icon: "💵" },
        { title: "Candidats actifs", icon: "👤" },
        { title: "Concours en cours", icon: "🏆" },
      ];

      const activities: ActivityItem[] = [
        { description: "Nouveau vote pour Sarah Dubois", time: "Il y a 2 minutes", amount: "300 FCFA" },
        { description: "Nouveau vote pour Marie Kouassi", time: "Il y a 5 minutes", amount: "100 FCFA" },
        { description: "Nouveau vote pour Jean Baptiste", time: "Il y a 8 minutes", amount: "500 FCFA" },
      ];

      setSummaryCards(summary);
      setRecentActivities(activities);
    };

    fetchDashboardData();
  }, []);

  return (
    <main className="dashboard-main" aria-label="Contenu principal">
      <section>
        <h2>Vue d&apos;ensemble</h2>
        <p className="subtitle">Tableau de bord principal de la plateforme de vote</p>

        <div className="summary-cards">
          {summaryCards.map((card, index) => (
            <article key={index} className="card">
              <div className="card-content">
                <p className="card-title">{card.title}</p>
              </div>
              <div className="card-icon" aria-hidden="true">{card.icon}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="recent-activity">
        <h3>Activité récente</h3>
        <ul>
          {recentActivities.map((activity, index) => (
            <li key={index}>
              <div className="activity-desc">
                <strong>{activity.description}</strong>
                <span className="activity-time">{activity.time}</span>
              </div>
              <div className="activity-value">{activity.amount}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Dashboard;
