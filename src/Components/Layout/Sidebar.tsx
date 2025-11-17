import React from 'react';
import { Link } from 'react-router-dom';
import type { NavItem } from '../../api/types';

const navItems: NavItem[] = [
  { id: 1, name: 'Tableau de bord', icon: '📊', path: '/admin/dashboard' },
  { id: 2, name: 'Concours', icon: '🏆', path: '/admin/competitions' },
  { id: 3, name: 'Candidats', icon: '🧑', path: '/admin/candidates' },
  { id: 4, name: 'Résultats', icon: '📈', path: '/admin/results' },
  { id: 5, name: 'Transactions', icon: '💳', path: '/admin/transactions' },
];

const Sidebar: React.FC = () => {
  const currentPath = window.location.pathname;

  return (
    <div style={{
      width: '250px',
      minHeight: '100vh',
      backgroundColor: '#f9f9f9',
      padding: '20px 0',
      borderRight: '1px solid #ddd',
    }}>
      <h2 style={{ padding: '0 20px', color: '#6c63ff', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        Administration VoteApp
      </h2>
      <nav>
        {navItems.map(item => (
          <Link
            key={item.id}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 20px',
              textDecoration: 'none',
              color: item.path === currentPath ? '#6c63ff' : '#333',
              backgroundColor: item.path === currentPath ? '#e8e8ff' : 'transparent',
              fontWeight: item.path === currentPath ? 'bold' : 'normal',
              borderLeft: item.path === currentPath ? '4px solid #6c63ff' : '4px solid transparent',
              transition: 'all 0.1s ease',
            }}
            onMouseOver={(e) => {
              if (item.path !== currentPath) {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }
            }}
            onMouseOut={(e) => {
              if (item.path !== currentPath) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ marginRight: '10px' }}>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;