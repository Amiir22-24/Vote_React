import type { vote, voteStatus } from "../types/vote";
import "../Pages/VoteList.css"

export interface VoteCardProps {
  vote: vote;
  onOpen: (id: number) => void;
}

export default function VoteCard({ vote, onOpen }: VoteCardProps) {
  const getStatusColor = (status: voteStatus) => {
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
