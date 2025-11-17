import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VoteApi } from "../Api/Admin/actionAdmin";
import type { vote, voteAllResponse } from "../types/vote";
import "./VoteList.css";

// VoteCard local
const VoteCard: React.FC<{ vote: vote; onOpen: (id: number) => void }> = ({ vote, onOpen }) => {
  const getStatusColor = (status: vote["statuts"]) => {
    switch (status) {
      case "en cours": return "#28a745";
      case "à venir": return "#ffc107";
      case "PASSE": return "#dc3545";
      default: return "#6c757d";
    }
  };

  return (
    <div className="vote-card">
      <h3>{vote.name}</h3>
      <p>Date début : {new Date(vote.date).toLocaleDateString()}</p>
      <p>Échéance : {new Date(vote.echeance).toLocaleDateString()}</p>
      <span style={{ backgroundColor: getStatusColor(vote.statuts) }}>{vote.statuts}</span>
      <button onClick={() => onOpen(vote.id)}>Voir détails</button>
    </div>
  );
};

const VoteListPage: React.FC = () => {
  const [votes, setVotes] = useState<vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // <- useNavigate au sommet

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        setLoading(true);
        const response: voteAllResponse = await VoteApi.getAll();
        setVotes(response.data || []);
      } catch (err: any) {
        setError(err?.message || "Erreur lors du chargement des votes");
      } finally {
        setLoading(false);
      }
    };

    fetchVotes();
  }, []);

  if (loading) return <p>Chargement des votes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Liste des votes</h1>
      <div className="vote-grid">
        {votes.map(v => (
          <VoteCard
            key={v.id}
            vote={v}
            onOpen={(id) => navigate(`/vote/${id}`)} // navigation fonctionnelle
          />
        ))}
      </div>
    </div>
  );
};

export default VoteListPage;
