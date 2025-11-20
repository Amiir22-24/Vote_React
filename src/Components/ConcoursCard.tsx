import { useNavigate } from "react-router-dom";
import React from "react";

  const [votes, setVotes] = React.useState<Concours[]>([]);
  const navigate = useNavigate();

import type { Concours, ConcourStatus } from "../types/Concours";
import "../Pages/VoteList.css"

export interface ConcoursCardProps {
  concours: Concours;
  onOpen: (id: number) => void;
}

export default function ConcoursCard() {
  const getStatusColor = (status: ConcourStatus) => {
    switch (status) {
      case "en cours": return "green";
      case "à venir": return "orange";
      case "PASSE": return "red";
      default: return "gray";
    }
  };

  return (
    <div className="vote-list">
      {votes.map(v => (
        <ConcoursCard
          key={v.id}
          concours={v}
          onOpen={(id) => navigate(`/vote/${id}`)} // <-- redirection ici
        />
      ))}
    </div>
  );
};

export default function ConcoursCard({ concours, onOpen }: ConcoursCardProps) {
  return (
    <div className="concours-card" onClick={() => onOpen(concours.id)}>;
      <h2>{concours.title}</h2>
      <p>{concours.description}</p>
      <p style={{ color: getStatusColor(concours.status) }}>{concours.status}</p>
    </div>
  );
} 
