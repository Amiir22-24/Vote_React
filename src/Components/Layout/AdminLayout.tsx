import React from 'react';
import Sidebar from './Sidebar';
// import Header from './Header'; // Peut être ajouté si nécessaire
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f9' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Vous pouvez ajouter un Header ici si besoin */}
        {/* <Header /> */}
        <main style={{ padding: '30px', flexGrow: 1 }}>
          <Outlet /> {/* Affiche le composant de la route enfant (ex: DashboardPage) */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;