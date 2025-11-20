import { useEffect, useState } from "react";
import "./CandidatCard.css";

export interface CandidatCardProps {
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
}: CandidatCardProps) {
const [imageSrc, setImageSrc] = useState<string>("");
const [isLoading, setIsLoading] = useState(true);
const [hasError, setHasError] = useState(false);

const defaultImage = "";

const API_BASE_URL = "http://192.168.0.212/Dzumevi_APi/public/"; // Remplacez par votre URL

useEffect(() => {
  let url: string | undefined;
  let mounted = true;

  const processImage = async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      if (typeof photo === "string" && photo.trim()) {
        if (photo.startsWith("http://") || photo.startsWith("https://")) {
          setImageSrc(photo);
        } 
        else {
          const apiImageUrl = `${API_BASE_URL}/storage/${photo.replace('storage/', '')}`;
          
          setImageSrc(apiImageUrl);
          
          await checkImageExists(apiImageUrl);
        }
      } else if (photo instanceof File) {
        url = URL.createObjectURL(photo);
        if (mounted) {
          setImageSrc(url);
        }
      } else {
        if (mounted) {
          setImageSrc(defaultImage);
        }
      }
    } catch (err) {
      console.error("Erreur lors du traitement de l'image:", err);
      if (mounted) {
        setHasError(true);
        setImageSrc(defaultImage);
      }
    } finally {
      if (mounted) {
        setIsLoading(false);
      }
    }
  };

  const checkImageExists = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      if (response.ok && mounted) {
        setImageSrc(imageUrl);
      } else {
        throw new Error('Image non trouvée');
      }
    } catch (error) {
      if (mounted) {
        setHasError(true);
        setImageSrc(defaultImage);
      }
    }
  };

  processImage();

  return () => {
    mounted = false;
    if (url) {
      URL.revokeObjectURL(url);
    }
  };
}, [photo]);

const handleImageError = () => {
  setImageSrc(defaultImage);
  setHasError(true);
};
  return (
    <div className="c-card">
      <div className="c-card-image-wrapper">
        {isLoading && (
          <div className="c-card-skeleton">
            <div className="c-card-skeleton-shimmer"></div>
          </div>
        )}
        <img 
          src={imageSrc} 
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
      </div>
    </div>
  );
}