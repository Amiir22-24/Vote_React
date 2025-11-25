import { useEffect, useState } from "react";
import "./CandidatCard.css";

export interface CandidatCardProps {
  id: number;
  photo: File | string | null; // Allow null
  firstname: string;
  lastname: string;
  description: string;
  categorie: string;
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
  votes,
  onVote,
  isAdmin,
  onEdit,
  onDelete,
}: CandidatCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>("");

  const API_BASE_URL = "http://192.168.0.41:8080/Dzumevi_APi/public/";

  // Handle image error
  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Handle image load
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // If photo is a File, create object URL
  useEffect(() => {
    let url: string | undefined;

    if (photo instanceof File) {
      url = URL.createObjectURL(photo);
      setFileUrl(url);
    }

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [photo]);

  // Determine final image URL with null safety
  const getImageUrl = (): string => {
    // If there's an error or no photo, return default image
    if (hasError || !photo) {
      return "/default-image.jpg";
    }

    // If photo is a File object
    if (photo instanceof File) {
      return fileUrl;
    }

    // If photo is already a full URL
    if (photo.startsWith("http://") || photo.startsWith("https://")) {
      return photo;
    }

    // If photo is a relative path, construct full URL
    return `${API_BASE_URL}storage/${photo.replace("storage/", "")}`;
  };

  const imageUrl = getImageUrl();

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
          onLoad={handleImageLoad}
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