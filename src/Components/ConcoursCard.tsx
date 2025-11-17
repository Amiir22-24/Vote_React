import type { Concours, ConcourStatus } from "../types/Concours";
import "../Pages/VoteList.css"

export interface ConcoursCardProps {
  vote: Concours;
  onOpen: (id: number) => void;
}

export default function ConcoursCard({ vote, onOpen }: ConcoursCardProps) {
  const getStatusColor = (status: ConcourStatus) => {
    switch (status) {
      case "en cours": return "green";
      case "à venir": return "orange";
      case "PASSE": return "red";
      default: return "gray";
    }
  };

  return (
    <div className="vote-card">
      <h3>{vote.name}</h3>

      <p>Date de début : {new Date(vote.date).toLocaleDateString()}</p>
      <p>Échéance : {new Date(vote.echeance).toLocaleDateString()}</p>

      <span 
        className="vote-status" 
        style={{ backgroundColor: getStatusColor(vote.statuts) }}
      >
        {vote.statuts}
      </span>

      <button onClick={() => onOpen(vote.id)}>Voir les détails</button>
    </div>
  );
}
