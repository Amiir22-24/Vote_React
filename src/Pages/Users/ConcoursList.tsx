import React, { useEffect, useState } from "react";
import "./concours.css";
import type { Concours as ConcoursList, ConcorsAllResponse, Concours } from "../../types/Concours";
import { useNavigate } from "react-router";
import { ConcoursApi } from "../../Api/Concours/concoursApi";

// VoteCard local
const ConcoursCard: React.FC<{ vote: ConcoursList; onOpen: (id: number) => void }> = ({ vote, onOpen }) => {
  const getStatusColor = (status: ConcoursList["statuts"]) => {
    switch (status) {
      case "en cours": return "#28a745";   // vert
      case "à venir": return "#ffc107";    // jaune
      case "PASSE": return "#dc3545";      // rouge
      default: return "#6c757d";           // gris
    }
  };

  return (
    <div className="vote-card">
      <h3 className="vote-name">{vote.name}</h3>
      <p>Date début : {new Date(vote.date).toLocaleDateString()}</p>
      <p>Échéance : {new Date(vote.echeance).toLocaleDateString()}</p>
      <span className="vote-status" style={{ backgroundColor: getStatusColor(vote.statuts) }}>
        {vote.statuts}
      </span>
      <button className="vote-button" onClick={() => onOpen(vote.id)}>
        Voir détails
      </button>
    </div>
  );
};

// Navbar locale

const ConcoursList: React.FC = () => {
    const [votes, setVotes] = useState<Concours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        setLoading(true);
        const response: ConcorsAllResponse = await ConcoursApi.getAll();
        setVotes(response.data || []);
      } catch (err: any) {
        setError(err?.message ||  "Erreur lors du chargement des votes");
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
          <ConcoursCard
            key={v.id}
            vote={v}
            onOpen={(id) => navigate(`/concours/${id}/candidats`)} 
          />
        ))}
      </div>
    </div>
  );
};

export default ConcoursList;
