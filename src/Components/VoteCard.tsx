import { useNavigate } from "react-router-dom";
import VoteCard from "../Components/VoteCard";
import type { vote } from "../types/vote";
import React from "react";

const Votepage: React.FC = () => {
  const [votes, setVotes] = React.useState<vote[]>([]);
  const navigate = useNavigate();

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
