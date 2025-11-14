import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import "./Login.css";
import { CandidatApi } from "../../Api/Admin/actionAdmin";


const Login: React.FC = () => {
  // const { admin } = useParams(); // Récupération du paramètre admin depuis l'URL
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
      const response = await CandidatApi.Login(formdata);
      
      if (response.success) {
        console.log("Login successful:", response);
        // Stocker les informations d'authentification
        localStorage.setItem("authToken", response.token || "authenticated");
        localStorage.setItem("authname", response.admin!.name || "authenticated");
        
        setError("");
        navigate("/admin/tableau-de-bord");
      } else {
        setError("Nom d'utilisateur ou mot de passe incorrect. Seuls les admins peuvent se connecter.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Erreur de connexion au serveur. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Optionnel: Afficher le nom de l'admin dans le titre si le paramètre est présent
  const getAdminTitle = () => {
    if (localStorage.getItem("adminData")) {
      return `Administration - ${localStorage.getItem("adminData")}`;
    }
    return "Administration";
  };

  const getWelcomeMessage = () => {
    if (localStorage.getItem("adminData")) {
      return `Connectez-vous en tant que ${localStorage.getItem("adminData")} pour gérer la plateforme`;
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

        {/* Afficher le paramètre admin si présent */}
        {localStorage.getItem("adminData") && (
          <div className="admin-badge">
            Mode: {localStorage.getItem("adminData")}
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