import { useEffect, useState } from "react";
import "./CandidatCard.css";

export interface CandidatCardProps {
  id: number;
  photo: File | string | null;
  firstname: string;
  lastname: string;
  description: string;
  matricule: string;
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
  matricule,
  votes,
  onVote,
  isAdmin,
  onEdit,
  onDelete,
}: CandidatCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>("");

  // const API_BASE_URL = "http://192.168.0.41:8080/Dzumevi_APi/storage/app/public/";
  const API_BASE_URL = "http://192.168.56.1:8080/Dzumevi_APi/storage/app/public/";
  // const API_BASE_URL = "http://127.0.0.1:8000/storage/app/public/";

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
    if (!photo) {
      return "/1.jpg"; // Créez cette image dans votre dossier public
    }

    // If photo is a File object
    if (photo instanceof File) {
      return fileUrl;
    }

    // If photo is already a full URL
    if (typeof photo === 'string' && (photo.startsWith("http://") || photo.startsWith("https://"))) {
      return photo;
    }

    // If photo is a relative path, construct full URL
    if (typeof photo === 'string') {
      // Nettoyer le chemin de la photo
      const cleanPhotoPath = photo.replace("storage/", "").replace(/^\/+/, "");
      console.log(cleanPhotoPath);
      
      return `${API_BASE_URL}${cleanPhotoPath}`;
    }

    // Fallback to default image
    return "/default-avatar.png";
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
          <span>{matricule}</span> {votes}
        </div>
      </div>

      <div className="c-card-body">
        <h3 className="c-card-name">{firstname} {lastname}</h3>
        <p className="c-card-description">{description}</p>
        <div className="c-card-info">
          <span>{categorie}</span>
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
                title="Modifier le candidat"
              >
                Modifier
              </button>
              <button
                className="vote-button delete"
                onClick={onDelete}
                title="Supprimer le candidat"
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}