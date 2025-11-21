import { useEffect, useState } from "react";
import "./CandidatCard.css";

export interface CandidatCardProps {
  id: number;
  photo: File | string;
  firstname: string;
  lastname: string;
  description: string;
  categorie: string;
  // pricePerVote: string;
  votes: number;
  isAdmin: boolean;

  onVote: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CandidatCard({
  photo,
  firstname,
  lastname,
  description,
  categorie,
  // pricePerVote,
  votes,
  onVote,
  isAdmin,
  onEdit,
  onDelete,

}: CandidatCardProps) {
const [isLoading, setIsLoading] = useState(true);
const [hasError, setHasError] = useState(false);


const API_BASE_URL = "http://192.168.0.212/Dzumevi_APi/public/"; // Remplacez par votre URL

  const [fileUrl, setFileUrl] = useState<string>("");

  // Si image échoue, mettre image par défaut
  const handleImageError = () => {
    setHasError(true);
  };

  // Si photo est un File, créer un URL utilisable
  useEffect(() => {
    let url: string | undefined;

    if (photo instanceof File) {
      url = URL.createObjectURL(photo);
      setFileUrl(url);
    }

    return () => {
      if (url) URL.revokeObjectURL(url); // Libérer la mémoire
    };
  }, [photo]);

  // Déterminer l'URL finale de l'image
  const imageUrl = hasError
    ? "/default-image.jpg" // Image par défaut locale dans public/
    : photo instanceof File
    ? fileUrl
    : photo.startsWith("http://") || photo.startsWith("https://")
    ? photo
    : `${API_BASE_URL}storage/${photo.replace("storage/", "")}`;

  return (
    <div className="c-card">
      <div className="c-card-image-wrapper">
        {isLoading && (
          <div className="c-card-skeleton">
            <div className="c-card-skeleton-shimmer"></div>
          </div>
        )}
        <img 
          src={imageUrl} 
          alt={`${firstname} ${lastname}`} 
          className={`c-card-image ${isLoading ? "c-card-image-loading" : ""} ${hasError ? "c-card-image-error" : ""}`}
          onLoad={() => setIsLoading(false)}
          onError={handleImageError}
        />
        <div className="c-card-votes">
          <span>❤️</span> {votes}
        </div>
      </div>

      <div className="c-card-body">
        <h3 className="c-card-name">{firstname} {lastname}</h3>
        <p className="c-card-description">{description}</p>
        <div className="c-card-info">
          <span>🏆 {categorie}</span>
          {/* <span>{pricePerVote}</span> */}
        </div>
        <button className="c-card-button" onClick={onVote}>
          Votez maintenant
        </button>
        <div className="vote-actions">
        {isAdmin && (
          <div className="admin-actions">
            <button
              className="vote-button edit"
              onClick={onEdit}
              title="Modifier le concours"
            >
              ✏️
            </button>
            <button
              className="vote-button delete"
              onClick={onDelete}
              title="Supprimer le concours"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}