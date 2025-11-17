import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/Auth/LoginPage';
import AdminLayout from './Components/Layout/AdminLayout';
import DashboardPage from './Pages/Dashboard/DashboardPage';

// Pages
// Placeholders pour les autres pages
const CompetitionsPage = () => <div style={{ padding: '30px' }}><h1>Gestion des Concours</h1><p>Implémentation à faire ici (CRUD).</p></div>;
const CandidatesPage = () => <div style={{ padding: '30px' }}><h1>Gestion des Candidats</h1><p>Implémentation à faire ici (CRUD).</p></div>;
const TransactionsPage = () => <div style={{ padding: '30px' }}><h1>Gestion des Transactions</h1><p>Historique complet des transactions.</p></div>;
const ResultsPage = () => <div style={{ padding: '30px' }}><h1>Résultats des Concours</h1><p>Affichage des résultats et classements.</p></div>;


// Layout

// Composant de protection de route
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('admin_token');
  
  if (!isAuthenticated) {
    // Si non authentifié, redirige vers la page de connexion
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route pour la connexion */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Routes d'administration protégées avec le Layout */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          {/* Routes enfants qui s'affichent dans l'Outlet d'AdminLayout */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="competitions" element={<CompetitionsPage />} />
          <Route path="candidates" element={<CandidatesPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          {/* Redirection par défaut si /admin est atteint */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Redirection de la racine vers /login ou /admin/dashboard */}
        <Route path="*" element={<Navigate to={localStorage.getItem('admin_token') ? "/admin/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;