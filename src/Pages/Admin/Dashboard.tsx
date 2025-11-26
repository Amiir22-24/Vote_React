import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { ConcoursApi } from "../../Api/Concours/concoursApi";

interface SummaryCard {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface ActivityItem {
  id: number;
  description: string;
  time: string;
  amount: string | number;
  type: 'vote' | 'candidat' | 'concours';
  candidatName?: string;
  concoursName?: string;
}

interface DashboardStats {
  totalVotes: number;
  totalRevenue: number;
  activeCandidates: number;
  activeConcours: number;
  recentActivities: ActivityItem[];
}

const Dashboard: React.FC = () => {
  const [summaryCards, setSummaryCards] = useState<SummaryCard[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalVotes: 0,
    totalRevenue: 0,
    activeCandidates: 0,
    activeConcours: 0,
    recentActivities: []
  });

  // Fonction pour formater la date relative
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "À l'instant";
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} minutes`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} heures`;
    if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)} jours`;
    
    return date.toLocaleDateString('fr-FR');
  };

  // Fonction pour récupérer les données du dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer tous les concours actifs
      const concoursResponse = await ConcoursApi.getAll();
      if (!concoursResponse.success) {
        throw new Error(concoursResponse.message || "Erreur lors du chargement des concours");
      }

      const allConcours = concoursResponse.data;
      const activeConcours = allConcours.filter((concours: any) => 
        concours.statut === 'en cours' && concours.is_active
      );

      // Calculer les statistiques globales
      let totalVotes = 0;
      let totalRevenue = 0;
      let totalCandidates = 0;

      // Pour chaque concours actif, récupérer les candidats et calculer les stats
      for (const concours of activeConcours) {
        totalVotes += concours.nombre_votes || 0;
        totalRevenue += concours.total_recettes || 0;
        totalCandidates += concours.nombre_candidats || 0;
      }

      // Récupérer les activités récentes (votes)
      const recentVotes = await getRecentActivities();

      const dashboardData: DashboardStats = {
        totalVotes,
        totalRevenue,
        activeCandidates: totalCandidates,
        activeConcours: activeConcours.length,
        recentActivities: recentVotes
      };

      setStats(dashboardData);

      // Préparer les cartes de résumé
      const summary: SummaryCard[] = [
        { 
          title: "Total des votes", 
          value: dashboardData.totalVotes.toLocaleString(), 
          icon: "",
          trend: { value: 12, isPositive: true }
        },
        { 
          title: "Revenus totaux", 
          value: `${(dashboardData.totalRevenue / 1000).toLocaleString()}K FCFA`, 
          icon: "",
          trend: { value: 8, isPositive: true }
        },
        { 
          title: "Candidats actifs", 
          value: dashboardData.activeCandidates, 
          icon: "",
          trend: { value: 5, isPositive: true }
        },
        { 
          title: "Concours en cours", 
          value: dashboardData.activeConcours, 
          icon: "",
          trend: { value: 0, isPositive: true }
        },
      ];

      setSummaryCards(summary);
      setRecentActivities(dashboardData.recentActivities);

    } catch (err: any) {
      console.error("Erreur lors du chargement du dashboard:", err);
      setError(err.message || "Une erreur est survenue lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les activités récentes
  const getRecentActivities = async (): Promise<ActivityItem[]> => {
    try {
      // Si vous avez une API pour les votes récents, utilisez-la
      // const votesResponse = await VotesApi.getRecent();
      
      // Pour l'instant, on simule avec les données des concours
      const concoursResponse = await ConcoursApi.getAll();
      if (!concoursResponse.success) {
        return [];
      }

      const activities: ActivityItem[] = [];
      const allConcours = concoursResponse.data;

      // Prendre les 3 premiers concours pour les activités
      const sampleConcours = allConcours.slice(0, 3);

      for (const concours of sampleConcours) {
        // Récupérer les candidats de ce concours
        const candidatsResponse = await ConcoursApi.getCandidats(concours.id);
        if (candidatsResponse.success && candidatsResponse.data.length > 0) {
          const candidats = candidatsResponse.data.slice(0, 2); // Prendre 2 candidats par concours
          
          for (const candidat of candidats) {
            if (candidat.votes > 0) {
              activities.push({
                id: candidat.id,
                description: "Nouveau vote enregistré",
                time: formatRelativeTime(concours.updated_at),
                amount: "100 FCFA",
                type: 'vote',
                candidatName: `${candidat.firstname} ${candidat.lastname}`,
                concoursName: concours.name
              });
            }
          }
        }

        // Ajouter une activité de création de concours
        activities.push({
          id: concours.id,
          description: "Concours créé",
          time: formatRelativeTime(concours.created_at),
          amount: "-",
          type: 'concours',
          concoursName: concours.name
        });
      }

      // Trier par date (les plus récents en premier) et prendre les 5 premiers
      return activities
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);

    } catch (error) {
      console.error("Erreur lors de la récupération des activités:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vote':
        return '🗳️';
      case 'candidat':
        return '👤';
      case 'concours':
        return '🏆';
      default:
        return '📢';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'vote':
        return '#10b981';
      case 'candidat':
        return '#3b82f6';
      case 'concours':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <main className="dashboard-main">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des données...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-main">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Erreur de chargement</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={handleRefresh}>
            Réessayer
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-main" aria-label="Contenu principal">
      {/* En-tête */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Tableau de bord</h1>
          <p className="subtitle">Vue d'ensemble de votre plateforme de vote</p>
        </div>
        <div className="header-actions">
          <button className="refresh-button" onClick={handleRefresh} title="Actualiser">
            🔄
          </button>
        </div>
      </header>

      {/* Cartes de résumé */}
      <section className="stats-section">
        <h2>Vue d'ensemble</h2>
        <div className="summary-cards">
          {summaryCards.map((card, index) => (
            <article key={index} className="summary-card">
              <div className="card-content">
                <div className="card-header">
                  <p className="card-title">{card.title}</p>
                  {card.trend && (
                    <span className={`trend ${card.trend.isPositive ? 'positive' : 'negative'}`}>
                      {card.trend.isPositive ? '↗' : '↘'} {card.trend.value}%
                    </span>
                  )}
                </div>
                <p className="card-value">{card.value}</p>
              </div>
              <div className="card-icon" aria-hidden="true">{card.icon}</div>
            </article>
          ))}
        </div>
      </section>

      {/* Activités récentes */}
      <section className="recent-activity">
        <div className="section-header">
          <h3>Activité récente</h3>
          <span className="activity-count">{recentActivities.length} activités</span>
        </div>
        
        {recentActivities.length > 0 ? (
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon" style={{ backgroundColor: getActivityColor(activity.type) }}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <div className="activity-desc">
                    <strong>{activity.description}</strong>
                    {activity.candidatName && (
                      <span className="activity-detail">pour {activity.candidatName}</span>
                    )}
                    {activity.concoursName && (
                      <span className="activity-detail">- {activity.concoursName}</span>
                    )}
                    <span className="activity-time">{activity.time}</span>
                  </div>
                  <div className="activity-value">{activity.amount}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-activities">
            <div className="empty-icon"></div>
            <p>Aucune activité récente</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;