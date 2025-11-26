import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Candidate } from "../../types/candidat";
import CandidatCard from "../../Components/CandidatCard";
import { candidateApi } from "../../Api/candidates/candidatApi";

const ConcoursDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidats, setCandidats] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidats = async () => {
      try {
        setLoading(true);
        // On récupère tous les candidats pour le concours
        const response = await candidateApi.getByConcoursId(Number(id));
        setCandidats(response || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidats();
  }, [id]);

  const handleVote = (candidatId: number) => {
    // Redirige vers le formulaire de paiement pour ce candidat
    navigate(`/paiement/${candidatId}`);
  };

  if (loading) return <p>Chargement des candidats...</p>;

  return (
    <div>
      <h2>Candidats du concours #{id}</h2>
      {candidats.length === 0 ? (
        <p>Aucun candidat pour ce concours.</p>
      ) : (
        <div className="candidat-grid">
          {candidats.map((c) => (
            <CandidatCard
              key={c.id}
              photo={c.photo}
              firstname={c.firstname}
              lastname={c.lastname}
              description={c.description}
              categorie={c.categorie ?? ""}
              votes={c.votes}
              onVote={() => handleVote(c.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConcoursDetailPage;
