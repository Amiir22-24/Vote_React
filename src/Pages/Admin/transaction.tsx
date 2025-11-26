import React, { useEffect, useState } from "react";
import type { PaiementData, PaiementListeResponse } from "../../types/paiement";

const TransactionPage: React.FC = () => {
  const [transactions, setTransactions] = useState<PaiementData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
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
        // CORRECTION ICI : Les transactions sont dans data.data.transactions
        const transactionsData = data.data.transactions || data.data || [];
        
        // Transformer les données FedaPay vers votre format PaiementData
        const formattedTransactions = transactionsData.map((transaction: any) => ({
          id: transaction.id,
          name: transaction.customer?.firstname + ' ' + transaction.customer?.lastname || 'N/A',
          email: transaction.customer?.email || 'N/A',
          phone_number: transaction.customer?.phone_number?.number || 'N/A',
          country: transaction.customer?.phone_number?.country || 'N/A',
          amount: transaction.amount,
          currency: transaction.currency?.iso || 'XOF',
          mode: transaction.mode || 'mobile',
          description: transaction.description,
          status: transaction.status,
          reference: transaction.reference
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

  const exportToCSV = () => {
    if (transactions.length === 0) return;

    const header = [
      "ID",
      "Nom",
      "Email",
      "Téléphone",
      "Pays",
      "Montant",
      "Devise",
      "Mode de paiement",
      "Description",
      "Statut",
      "Référence"
    ];

    const rows = transactions.map((t) => [
      t.id,
      t.name,
      t.email,
      t.phone_number,
      t.country,
      t.amount,
      t.currency,
      t.mode.toUpperCase(),
      t.description,
      t.status || 'N/A',
      t.reference || 'N/A'
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows]
        .map((e) => e.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: "25px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          alignItems: "center"
        }}
      >
        <h2>Liste des Transactions</h2>

        <button
          onClick={exportToCSV}
          disabled={transactions.length === 0}
          style={{
            padding: "10px 18px",
            backgroundColor: transactions.length === 0 ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: transactions.length === 0 ? "not-allowed" : "pointer",
            fontWeight: "600"
          }}
        >
          Exporter CSV
        </button>
      </div>

      {error && (
        <div style={{
          padding: "10px",
          backgroundColor: "#ffebee",
          color: "#c62828",
          border: "1px solid #ef5350",
          borderRadius: "4px",
          marginBottom: "20px"
        }}>
          <strong>Erreur:</strong> {error}
          <br />
          <small>Vérifiez que le serveur Laravel est bien configuré.</small>
        </div>
      )}

      {loading ? (
        <p>Chargement...</p>
      ) : transactions.length === 0 && !error ? (
        <p>Aucune transaction trouvée.</p>
      ) : (
        <div
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "white"
            }}
          >
            <thead style={{ backgroundColor: "#f0f0f0", display: "table-header-group" }}>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Nom</th>
                <th style={th}>Email</th>
                <th style={th}>Téléphone</th>
                <th style={th}>Pays</th>
                <th style={th}>Montant</th>
                <th style={th}>Devise</th>
                <th style={th}>Mode</th>
                <th style={th}>Description</th>
                <th style={th}>Statut</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td style={td}>{t.id}</td>
                  <td style={td}>{t.name}</td>
                  <td style={td}>{t.email}</td>
                  <td style={td}>{t.phone_number}</td>
                  <td style={td}>{t.country}</td>
                  <td style={td}>{t.amount}</td>
                  <td style={td}>{t.currency}</td>
                  <td style={td}>{t.mode.toUpperCase()}</td>
                  <td style={td}>{t.description}</td>
                  <td style={td}>{t.status || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const th: React.CSSProperties = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  textAlign: "left",
  fontWeight: "600"
};

const td: React.CSSProperties = {
  padding: "10px",
  borderBottom: "1px solid #eee"
};

export default TransactionPage;