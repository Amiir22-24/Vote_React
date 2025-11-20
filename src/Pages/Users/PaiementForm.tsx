import React, { useState, type ChangeEvent, type FormEvent } from "react";
import "./PaiementForm.css";
import type { Candidate } from "../../types/candidat";
import type { PaymentFormData, PaymentMode } from "../../types/paiement";
import { PaiementApi } from "../../Api/Paiement/PaiementApi";

interface PaymentFormProps {
  candidat: Candidate;
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ candidat, onClose }) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    candidatId: candidat.id,
    name: "",
    email: "",
    phone_number: "",
    country: "BJ", // Valeur par défaut
    amount: 100, // Montant minimum par défaut
    currency: "XOF",
    description: `Vote pour ${candidat.firstname} ${candidat.lastname}`,
    mode: "" as PaymentMode,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [responseMsg, setResponseMsg] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  const mobileMoneyModes: { value: PaymentMode; label: string }[] = [
    // Bénin
    { value: "mtn_bj", label: "MTN Mobile Money (Bénin)" },
    { value: "moov_bj", label: "MOOV Money (Bénin)" },
    { value: "celtiis_bj", label: "CELTIIS Cash (Bénin)" },
    { value: "coris_bj", label: "CORIS Money (Bénin)" },
    { value: "bmo_bj", label: "BMO (Bénin)" },

    // Côte d'Ivoire
    { value: "mtn_ci", label: "MTN Mobile Money (Côte d'Ivoire)" },
    { value: "moov_ci", label: "Moov Money (Côte d'Ivoire)" },
    { value: "orange_ci", label: "Orange Money (Côte d'Ivoire)" },
    { value: "wave_ci", label: "Wave (Côte d'Ivoire)" },

    // Niger
    { value: "airtel_ne", label: "Airtel Money (Niger)" },

    // Sénégal
    { value: "orange_sn", label: "Orange Money (Sénégal)" },
    { value: "wave_sn", label: "Wave (Sénégal)" },

    // Togo
    { value: "moov_tg", label: "MOOV Money (Togo)" },
    { value: "togocel_tg", label: "TOGOCEL T-Money (Togo)" },

    // Mali
    { value: "orange_ml", label: "Orange Money (Mali)" },

    // Burkina-Faso
    { value: "moov_bf", label: "MOOV Money (Burkina-Faso)" },
    { value: "orange_bf", label: "Orange Money (Burkina-Faso)" },

    // Guinée
    { value: "mtn_gn", label: "MTN Mobile Money (Guinée)" },
  ];

  // Fonction pour obtenir le code pays automatiquement selon le mode
  const getCountryFromMode = (mode: PaymentMode): string => {
    const countryMap: { [key: string]: string } = {
      // Bénin
      'mtn_bj': 'BJ', 'moov_bj': 'BJ', 'celtiis_bj': 'BJ', 
      'coris_bj': 'BJ', 'bmo_bj': 'BJ',
      
      // Côte d'Ivoire
      'mtn_ci': 'CI', 'moov_ci': 'CI', 'orange_ci': 'CI', 'wave_ci': 'CI',
      
      // Niger
      'airtel_ne': 'NE',
      
      // Sénégal
      'orange_sn': 'SN', 'wave_sn': 'SN',
      
      // Togo
      'moov_tg': 'TG', 'togocel_tg': 'TG',
      
      // Mali
      'orange_ml': 'ML',
      
      // Burkina-Faso
      'moov_bf': 'BF', 'orange_bf': 'BF',
      
      // Guinée
      'mtn_gn': 'GN',
    };
    
    return countryMap[mode] || "BJ"; // Bénin par défaut
  };

  // Fonction pour obtenir la devise automatiquement selon le pays
  const getCurrencyFromCountry = (country: string): string => {
    const currencyMap: { [key: string]: string } = {
      'BJ': 'XOF', // Bénin
      'CI': 'XOF', // Côte d'Ivoire
      'NE': 'XOF', // Niger
      'SN': 'XOF', // Sénégal
      'TG': 'XOF', // Togo
      'ML': 'XOF', // Mali
      'BF': 'XOF', // Burkina-Faso
      'GN': 'GNF', // Guinée
    };
    return currencyMap[country] || 'XOF';
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleModeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const mode = e.target.value as PaymentMode;
    const country = getCountryFromMode(mode);
    const currency = getCurrencyFromCountry(country);
    
    setFormData({ 
      ...formData, 
      mode: mode,
      country: country,
      currency: currency
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");
    setIsSuccess(false);

    // Validation
    if (!formData.phone_number.trim()) {
      setResponseMsg("Veuillez entrer votre numéro de téléphone.");
      setLoading(false);
      return;
    }

    if (!formData.amount || formData.amount < 100) {
      setResponseMsg("Le montant minimum est de 100 FCFA.");
      setLoading(false);
      return;
    }

    if (!formData.mode) {
      setResponseMsg("Veuillez sélectionner un mode de paiement.");
      setLoading(false);
      return;
    }

    try {
      const data = {
        candidatId: candidat.id,
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        country: formData.country,
        amount: formData.amount,
        currency: formData.currency,
        description: formData.description,
        mode: formData.mode,
      };

      console.log("Données envoyées:", data);
      
      const response = await PaiementApi.inittransaction(data);
      
      console.log("Réponse API:", response);

      if (response && response.success) {
        setIsSuccess(true);
        setTransactionData(response);
        setResponseMsg(`Paiement initié avec succès ! Transaction ID : ${response.transaction_id}`);
        
        // Redirection vers l'URL de paiement si disponible
        if (response.payment_url) {
          window.open(response.payment_url, '_blank', 'noopener,noreferrer');
        }
      } else {
        setResponseMsg(`Erreur : ${response?.error || response?.message || "Erreur inconnue"}`);
      }
    } catch (err: any) {
      console.error("Erreur complète:", err);
      
      let errorMessage = "Une erreur inattendue s'est produite.";
      
      if (err.response) {
        const serverError = err.response.data;
        // Nettoyer la réponse si elle contient des commentaires HTML
        const cleanError = typeof serverError === 'string' 
          ? serverError.replace(/<!--|-->/g, '').trim()
          : serverError;
        
        try {
          const errorJson = typeof cleanError === 'string' ? JSON.parse(cleanError) : cleanError;
          errorMessage = errorJson.message || errorJson.error || `Erreur serveur: ${err.response.status}`;
        } catch {
          errorMessage = "Erreur de format de réponse du serveur";
        }
      } else if (err.request) {
        errorMessage = "Impossible de contacter le serveur. Vérifiez votre connexion.";
      } else {
        errorMessage = err.message || "Erreur de configuration";
      }
      
      setResponseMsg(`Erreur : ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setIsSuccess(false);
    setTransactionData(null);
    setResponseMsg("");
  };

  const getSelectedModeLabel = () => {
    const selectedMode = mobileMoneyModes.find(mode => mode.value === formData.mode);
    return selectedMode ? selectedMode.label : '';
  };

  return (
    <div className="payment-form-container">
      <div className="payment-header">
        <h2>Voter pour {candidat.firstname} {candidat.lastname}</h2>
        <p>Votre vote compte ! Soutenez ce candidat en effectuant un paiement.</p>
      </div>

      {responseMsg && (
        <div className={`alert ${isSuccess ? 'alert-success' : 'alert-error'}`}>
          <strong>{isSuccess ? 'Succès :' : 'Erreur :'}</strong> {responseMsg}
          {!isSuccess && (
            <button onClick={handleRetry} className="retry-button">
              Réessayer
            </button>
          )}
        </div>
      )}

      {isSuccess && transactionData ? (
        <div className="success-container">
          <div className="alert alert-success">
            <h3>✅ Paiement initialisé avec succès !</h3>
            <p>Votre transaction a été créée avec l'ID: {transactionData.transaction_id}</p>
            
            {transactionData.payment_url && (
              <div className="payment-actions">
                <a 
                  href={transactionData.payment_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="payment-link"
                >
                  📱 Finaliser le paiement
                </a>
                <button onClick={onClose} className="btn-secondary">
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <form className="payment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nom complet</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Votre nom complet"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Numéro de téléphone</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              placeholder="+229771234567"
              value={formData.phone_number}
              onChange={handleChange}
              required
              pattern="^\+[0-9]{10,15}$"
              title="Format: +229771234567"
            />
            <small>Commencez par l'indicatif pays (ex: +229 pour le Bénin)</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Montant</label>
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="100"
                min="100"
                step="100"
                value={formData.amount}
                onChange={handleChange}
                required
              />
              <small>Minimum: 100 {formData.currency}</small>
            </div>

            <div className="form-group">
              <label htmlFor="currency">Devise</label>
              <select 
                id="currency" 
                name="currency" 
                value={formData.currency} 
                onChange={handleChange}
                disabled // Devise déterminée automatiquement
              >
                <option value="XOF">XOF (Franc CFA)</option>
                <option value="GNF">GNF (Franc guinéen)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Description du paiement"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="country">Pays</label>
              <input
                type="text"
                id="country"
                name="country"
                placeholder="BJ"
                value={formData.country}
                onChange={handleChange}
                required
                maxLength={2}
                style={{textTransform: 'uppercase'}}
                disabled // Pays déterminé automatiquement
              />
              <small>Code pays (2 lettres)</small>
            </div>

            <div className="form-group">
              <label htmlFor="mode">Mode de paiement</label>
              <select 
                id="mode" 
                name="mode" 
                // value={formData.mode} 
                onChange={handleModeChange} 
                required
              >
                <option value="">Sélectionner un Mobile Money</option>
                {mobileMoneyModes.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="payment-summary">
            <h4>Récapitulatif</h4>
            <p><strong>Candidat :</strong> {candidat.firstname} {candidat.lastname}</p>
            <p><strong>Montant :</strong> {formData.amount.toLocaleString()} {formData.currency}</p>
            <p><strong>Nombre de votes :</strong> {Math.floor(formData.amount / 100)}</p>
            <p><strong>Pays :</strong> {formData.country}</p>
            <p><strong>Mode :</strong> {getSelectedModeLabel()}</p>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Traitement..." : "Payer maintenant"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PaymentForm;