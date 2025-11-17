import React from 'react';
import type { Transaction } from '../../api/types';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid #eee',
      color: '#333'
    }}>
      <div>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{transaction.customerName}</p>
        <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{transaction.candidateName}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: '#10b981' }}>{transaction.amount} FCFA</p>
        <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{transaction.votes} votes</p>
      </div>
    </div>
  );
};

export default TransactionItem;