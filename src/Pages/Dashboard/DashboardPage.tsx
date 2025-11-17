import React, { useEffect, useState } from 'react';
import type { Competition, DashboardData } from '../../api/types';
import { fetchDashboardData } from '../../api/services/dashboard';
import StatCard from '../../Components/ui/StatCard';
import TransactionItem from '../../Components/ui/TransactionItem';

const CompetitionItem: React.FC<{ competition: Competition }> = ({ competition }) => (
    <div style={{ padding: '15px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{competition.name}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{competition.votes.toLocaleString()} votes</p>
        </div>
        <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#10b981' }}>{competition.revenue.toLocaleString()} FCFA</p>
            <span style={{ fontSize: '12px', color: competition.status === 'Actif' ? 'green' : '#666' }}>{competition.status}</span>
        </div>
    </div>
);


const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await fetchDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error("Erreur lors du chargement des données du tableau de bord:", error);
        // Gérer l'erreur (afficher un message à l'utilisateur)
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div style={{ padding: '30px', fontSize: '18px' }}>Chargement du Tableau de bord...</div>;
  if (!data) return <div style={{ padding: '30px', color: 'red' }}>Impossible de charger les données du tableau de bord.</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0 }}>Tableau de bord</h1>
          <span style={{ color: 'green', fontWeight: 'bold' }}>Système actif</span> {/* Basé sur l'image */}
      </div>

      {/* Cartes de statistiques */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <StatCard title="Total des votes" value={data.totalVotes.toLocaleString()} icon="🗳️" accentColor="#6c63ff" />
        <StatCard title="Revenus totaux" value={data.totalRevenue.toLocaleString() + ' FCFA'} icon="💰" accentColor="#10b981" />
        <StatCard title="Concours actifs" value={data.activeCompetitions.toLocaleString()} icon="🏆" accentColor="#f59e0b" />
        <StatCard title="Total candidats" value={data.totalCandidates.toLocaleString()} icon="🧑" accentColor="#ef4444" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        
        {/* Concours en cours */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>Concours en cours</h2>
          {data.ongoingCompetitions.map(comp => (
            <CompetitionItem key={comp.id} competition={comp} />
          ))}
        </div>

        {/* Transactions récentes */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>Transactions récentes</h2>
          {data.recentTransactions.map(transaction => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;