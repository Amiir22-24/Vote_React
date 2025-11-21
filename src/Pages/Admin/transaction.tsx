import React, { useEffect, useState } from "react";
import type { PaiementData, PaiementListeResponse } from "../../types/paiement";

const TransactionPage: React.FC = () => {
  const [transactions, setTransactions] = useState<PaiementData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/paiements");
      const data: PaiementListeResponse = await response.json();

      if (data.success) {
        setTransactions(data.data);
      } else {
        console.error("Erreur API :", data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
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
      "Description"
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
      t.description
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
          style={{
            padding: "10px 18px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Exporter CSV
        </button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : transactions.length === 0 ? (
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
