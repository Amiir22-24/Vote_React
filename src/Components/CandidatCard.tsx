import React, { useEffect, useState } from "react";
import "./CandidatCard.css";

export interface CandidatCardProps {
  photo: File | string;
  firstname: string;
  lastname: string;
  description: string;
  categorie: string;
  pricePerVote: string;
  votes: number;
  onVote: () => void;
}

export default function CandidatCard({
  photo,
  firstname,
  lastname,
  description,
  categorie,
  pricePerVote,
  votes,
  onVote,
}: CandidatCardProps) {
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    let url: string | undefined;

    if (typeof photo === "string") {
      setImageSrc(photo);
    } else if (photo instanceof File) {
      url = URL.createObjectURL(photo);
      setImageSrc(url);
    } else {
      setImageSrc("");
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [photo]);

  return (
    <div className="c-card">
      <div className="c-card-image-wrapper">
        <img src={imageSrc} alt={`${firstname} ${lastname}`} className="c-card-image" />
        <div className="c-card-votes">
          <span>❤️</span> {votes}
        </div>
      </div>

      <div className="c-card-body">
        <h3 className="c-card-name">{firstname} {lastname}</h3>
        <p className="c-card-description">{description}</p>
        <div className="c-card-info">
          <span>🏆 {categorie}</span>
          <span>{pricePerVote}</span>
        </div>
        <button className="c-card-button" onClick={onVote}>
          Votez maintenant
        </button>
      </div>
    </div>
  );
}
