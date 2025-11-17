import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  accentColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, accentColor }) => {
  return (
    <div style={{
      flex: 1,
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderLeft: `5px solid ${accentColor}`,
    }}>
      <div>
        <h4 style={{ margin: 0, fontSize: '14px', color: '#666' }}>{title}</h4>
        <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{value}</p>
      </div>
      <div style={{
        backgroundColor: accentColor,
        opacity: 0.1,
        padding: '10px',
        borderRadius: '50%',
        fontSize: '20px',
      }}>
        <span role="img" aria-label={title} style={{ opacity: 1, filter: 'grayscale(1)', color: accentColor }}>
            {icon}
        </span>
      </div>
    </div>
  );
};

export default StatCard;