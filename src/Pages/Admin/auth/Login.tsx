import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import "./Login.css";
import { AdminApi } from "../../../Api/Admin/actionAdmin";

// Interface pour typer la réponse de l'API
interface LoginResponse {
  success: boolean;
  message: string;
  admin: {
    id: number;
    name: string;
    // created_at: string;
    // updated_at: string;
  };
  token: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  const formdata = {
    name: username,
    password: password,
  };

  try {
    const rawResponse = await AdminApi.Login(formdata);
    console.log("Ligne API response:", rawResponse);
    
    let response;
    
    // Si la réponse est une string avec des commentaires HTML, les nettoyer
    if (typeof rawResponse === 'string') {
      const jsonString = rawResponse.replace(/<!--|-->/g, '').trim();
      response = JSON.parse(jsonString);
    } else {
      response = rawResponse;
    }
    
    if (response && response.success) {
      console.log("Login successful:", response);
      
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("authname", response.admin.name);
      
      setError("");
      navigate("/admin/tableau-de-bord");
    } else {
      setError("Nom d'utilisateur ou mot de passe incorrect.");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    setError("Erreur de connexion au serveur. Veuillez réessayer.");
  } finally {
    setIsLoading(false);
  }
};

  // Optionnel: Afficher le nom de l'admin dans le titre si le paramètre est présent
  const getAdminTitle = () => {
    const authname = localStorage.getItem("authname");
    if (authname) {
      return `Administration - ${authname}`;
    }
    return "Administration";
  };

  const getWelcomeMessage = () => {
    const authname = localStorage.getItem("authname");
    if (authname) {
      return `Connectez-vous en tant que ${authname} pour gérer la plateforme`;
    }
    return "Connectez-vous pour gérer la plateforme";
  };

  return (
    <div className="container">
        <div className="iconWrapper" aria-label="Icône utilisateur">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#bb86fc"
            height="40"
            viewBox="0 0 24 24"
            width="40"
            aria-hidden="true"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        <h2>{getAdminTitle()}</h2>
        <p>{getWelcomeMessage()}</p>

        {/* Afficher le nom de l'admin si présent */}
        {localStorage.getItem("authname") && (
          <div className="admin-badge">
            Mode: {localStorage.getItem("authname")}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            placeholder="Entrez votre nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <button 
            type="submit" 
            className={`btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
  );
};

export default Login;