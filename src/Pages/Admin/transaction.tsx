import React, { useEffect, useState } from "react";
import "./transaction.css";

interface Transaction {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  country: string;
  amount: number;
  currency: string;
  mode: string;
  description: string;
  status: string;
  reference: string;
  created_at?: string;
  updated_at?: string;
}

const TransactionPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://192.168.0.212/Dzumevi_APi/public/api/paiements/list', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log("Status de la réponse:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur HTTP:", response.status, errorText);
        
        try {
          const cleanText = errorText.replace(/<!--|-->/g, '').trim();
          const errorData = JSON.parse(cleanText);
          setError(`Erreur serveur: ${errorData.message || response.status}`);
        } catch (parseError) {
          setError(`Erreur serveur: ${response.status}`);
        }
        
        setLoading(false);
        return;
      }

      const responseText = await response.text();
      console.log("Réponse brute:", responseText.substring(0, 200));

      let data;
      try {
        const cleanText = responseText.replace(/<!--|-->/g, '').trim();
        data = JSON.parse(cleanText);
      } catch (parseError) {
        console.error("Erreur parsing JSON:", parseError);
        setError("Format de réponse invalide du serveur");
        setLoading(false);
        return;
      }

      console.log("Données reçues:", data);

      if (data.success) {
        // Gestion flexible de la structure de réponse
        const transactionsData = data.data?.transactions || data.data || data.transactions || [];
        
        const formattedTransactions = transactionsData.map((transaction: any) => ({
          id: transaction.id || transaction.transaction_id,
          name: transaction.name || transaction.customer_name || 'N/A',
          email: transaction.email || transaction.customer_email || 'N/A',
          phone_number: transaction.phone_number || transaction.customer_phone || 'N/A',
          country: transaction.country || 'BJ',
          amount: transaction.amount || 0,
          currency: transaction.currency || 'XOF',
          mode: transaction.mode || transaction.payment_method || 'mobile',
          description: transaction.description || 'Transaction de vote',
          status: transaction.status || transaction.state || 'completed',
          reference: transaction.reference || transaction.transaction_id || `TXN-${Date.now()}`,
          created_at: transaction.created_at,
          updated_at: transaction.updated_at
        }));
        
        setTransactions(formattedTransactions);
      } else {
        console.error("Erreur API:", data.message);
        setError(data.message || "Erreur inconnue de l'API");
      }
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filtrer les transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.phone_number.includes(searchTerm) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) return;

    const header = [
      "ID",
      "Référence",
      "Nom",
      "Email",
      "Téléphone",
      "Pays",
      "Montant",
      "Devise",
      "Mode de paiement",
      "Description",
      "Statut",
      "Date"
    ];

    const rows = filteredTransactions.map((t) => [
      t.id,
      t.reference,
      t.name,
      t.email,
      t.phone_number,
      t.country,
      t.amount,
      t.currency,
      t.mode.toUpperCase(),
      t.description,
      t.status,
      t.created_at ? new Date(t.created_at).toLocaleDateString() : 'N/A'
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows]
        .map((e) => e.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'failed':
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'Complété';
      case 'pending':
        return 'En attente';
      case 'failed':
      case 'cancelled':
        return 'Échoué';
      default:
        return status;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="transactions-container">
      {/* En-tête */}
      <header className="transactions-header">
        <div className="header-content">
          <h1>Transactions</h1>
          <p className="subtitle">Gestion et suivi des paiements</p>
        </div>
        <div className="header-actions">
          <button
            onClick={fetchTransactions}
            className="refresh-button"
            title="Actualiser"
          >
            🔄
          </button>
          <button
            onClick={exportToCSV}
            disabled={filteredTransactions.length === 0}
            className="export-button"
          >
            📊 Exporter CSV
          </button>
        </div>
      </header>

      {/* Filtres et recherche */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher par nom, email, téléphone ou référence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {/* <span className="search-icon">🔍</span> */}
        </div>
        
        <div className="filter-group">
          <label htmlFor="status-filter">Statut:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les statuts</option>
            <option value="completed">Complété</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoué</option>
          </select>
        </div>

        <div className="stats-badge">
          {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <strong>Erreur de chargement</strong>
            <p>{error}</p>
            <button onClick={fetchTransactions} className="retry-button">
              Réessayer
            </button>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des transactions...</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💳</div>
          <h3>Aucune transaction trouvée</h3>
          <p>
            {searchTerm || statusFilter !== "all" 
              ? "Aucune transaction ne correspond aux critères de recherche."
              : "Aucune transaction n'a été enregistrée pour le moment."
            }
          </p>
          {(searchTerm || statusFilter !== "all") && (
            <button 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="clear-filters-button"
            >
              Effacer les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Client</th>
                <th>Contact</th>
                <th>Montant</th>
                <th>Mode</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="transaction-row">
                  <td className="reference-cell">
                    <div className="reference-code">{transaction.reference}</div>
                    <small className="transaction-id">ID: {transaction.id}</small>
                  </td>
                  <td className="client-cell">
                    <div className="client-name">{transaction.name}</div>
                    <div className="client-email">{transaction.email}</div>
                  </td>
                  <td className="contact-cell">
                    <div className="phone-number">{transaction.phone_number}</div>
                    <div className="country">{transaction.country}</div>
                  </td>
                  <td className="amount-cell">
                    <div className="amount">{formatAmount(transaction.amount, transaction.currency)}</div>
                    <div className="description">{transaction.description}</div>
                  </td>
                  <td className="mode-cell">
                    <span className={`mode-badge mode-${transaction.mode}`}>
                      {transaction.mode.toUpperCase()}
                    </span>
                  </td>
                  <td className="status-cell">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(transaction.status) }}
                    >
                      {getStatusText(transaction.status)}
                    </span>
                  </td>
                  <td className="date-cell">
                    {formatDate(transaction.created_at)}
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="action-button"
                      title="Voir les détails"
                      onClick={() => console.log('Détails:', transaction)}
                    >
                      👁️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Résumé */}
      {!loading && filteredTransactions.length > 0 && (
        <div className="transactions-summary">
          <div className="summary-item">
            <span className="summary-label">Total des transactions:</span>
            <span className="summary-value">{filteredTransactions.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Montant total:</span>
            <span className="summary-value">
              {formatAmount(
                filteredTransactions.reduce((sum, t) => sum + t.amount, 0),
                filteredTransactions[0]?.currency || 'XOF'
              )}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Dernière mise à jour:</span>
            <span className="summary-value">{new Date().toLocaleTimeString('fr-FR')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;