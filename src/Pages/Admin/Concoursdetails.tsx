import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {  } from "../../Api/Admin/actionAdmin";
import type { Candidate } from "../../types/candidat";
import CandidatCard from "../../Components/CandidatCard";
import { candidateApi } from "../../Api/candidates/candidatApi";

const ConcoursDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidats, setCandidats] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidats = async () => {
      try {
        setLoading(true);
        const response = await candidateApi.getById(Number(id));
        setCandidats(response ? [response] : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidats();
  }, [id]);

  if (loading) return <p>Chargement des candidats...</p>;

  return (
    <div>
      <h2>Candidats du concours #{id}</h2>
      {candidats.length === 0 ? (
        <p>Aucun candidat pour ce concours.</p>
      ) : (
        <div className="candidat-grid">
          {candidats.map(c => (
            <CandidatCard
              key={c.id}
              photo={c.photo}
              firstname={c.firstname}
              lastname={c.lastname}
              description={c.description}
              categorie={c.categorie ?? ""}
              votes={c.votes}
              onVote={() => alert(`Vote enregistré pour ${c.firstname}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConcoursDetailPage;
