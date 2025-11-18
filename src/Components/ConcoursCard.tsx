<<<<<<< HEAD:src/Components/VoteCard.tsx
import { useNavigate } from "react-router-dom";
import VoteCard from "../Components/VoteCard";
import type { vote } from "../types/vote";
import React from "react";

const Votepage: React.FC = () => {
  const [votes, setVotes] = React.useState<vote[]>([]);
  const navigate = useNavigate();
=======
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
>>>>>>> a0aa71b4a93f886919534b6f5fbfe9ed1c939b36:src/Components/ConcoursCard.tsx

  return (
    <div className="vote-list">
      {votes.map(v => (
        <VoteCard
          key={v.id}
          vote={v}
          onOpen={(id) => navigate(`/vote/${id}`)} // <-- redirection ici
        />
      ))}
    </div>
  );
};

export default Votepage;
