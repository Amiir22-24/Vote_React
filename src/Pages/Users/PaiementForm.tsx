import React, { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from "react";
import "./PaiementForm.css";
import type { Candidate } from "../../types/candidat";
import type { PaymentFormData, PaymentMode } from "../../types/paiement";
import { PaiementApi } from "../../Api/Paiement/PaiementApi";

interface PaymentFormProps {
  candidat: Candidate;
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ candidat, onClose }) => {
  const formRef = useRef<HTMLFormElement | null>(null);

  const [formData, setFormData] = useState<PaymentFormData>({
    candidatId: candidat.id,
    name: "",
    email: "",
    phone_number: "",
    country: "BJ",
    amount: 100,
    currency: "XOF",
    description: `Vote pour ${candidat.firstname} ${candidat.lastname}`,
    mode: "" as PaymentMode,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [responseMsg, setResponseMsg] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  const mobileMoneyModes: { value: PaymentMode; label: string }[] = [
    { value: "mtn_bj", label: "MTN Mobile Money (Bénin)" },
    { value: "moov_bj", label: "MOOV Money (Bénin)" },
    { value: "celtiis_bj", label: "CELTIIS Cash (Bénin)" },
    { value: "coris_bj", label: "CORIS Money (Bénin)" },
    { value: "bmo_bj", label: "BMO (Bénin)" },
    { value: "mtn_ci", label: "MTN Mobile Money (Côte d'Ivoire)" },
    { value: "moov_ci", label: "Moov Money (Côte d'Ivoire)" },
    { value: "orange_ci", label: "Orange Money (Côte d'Ivoire)" },
    { value: "wave_ci", label: "Wave (Côte d'Ivoire)" },
    { value: "airtel_ne", label: "Airtel Money (Niger)" },
    { value: "orange_sn", label: "Orange Money (Sénégal)" },
    { value: "wave_sn", label: "Wave (Sénégal)" },
    { value: "moov_tg", label: "MOOV Money (Togo)" },
    { value: "togocel_tg", label: "TOGOCEL T-Money (Togo)" },
    { value: "orange_ml", label: "Orange Money (Mali)" },
    { value: "moov_bf", label: "MOOV Money (Burkina-Faso)" },
    { value: "orange_bf", label: "Orange Money (Burkina-Faso)" },
    { value: "mtn_gn", label: "MTN Mobile Money (Guinée)" },
  ];

  const getCountryFromMode = (mode: PaymentMode): string => {
    const countryMap: { [key: string]: string } = {
      mtn_bj: "BJ", moov_bj: "BJ", celtiis_bj: "BJ", coris_bj: "BJ", bmo_bj: "BJ",
      mtn_ci: "CI", moov_ci: "CI", orange_ci: "CI", wave_ci: "CI",
      airtel_ne: "NE",
      orange_sn: "SN", wave_sn: "SN",
      moov_tg: "TG", togocel_tg: "TG",
      orange_ml: "ML",
      moov_bf: "BF", orange_bf: "BF",
      mtn_gn: "GN",
    };
    return countryMap[mode] || "BJ";
  };

  const getCurrencyFromCountry = (country: string): string => {
    const currencyMap: { [key: string]: string } = {
      BJ: "XOF", CI: "XOF", NE: "XOF", SN: "XOF", TG: "XOF", ML: "XOF", BF: "XOF", GN: "GNF"
    };
    return currencyMap[country] || "XOF";
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleModeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const mode = e.target.value as PaymentMode;
    const country = getCountryFromMode(mode);
    const currency = getCurrencyFromCountry(country);
    setFormData({ ...formData, mode, country, currency });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");
    setIsSuccess(false);

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
      const data = { ...formData, candidatId: candidat.id };
      const response = await PaiementApi.inittransaction(data);

      if (response && response.success) {
        setIsSuccess(true);
        setTransactionData(response);
        setResponseMsg(`Paiement initié avec succès ! Transaction ID : ${response.transaction_id}`);
        if (response.payment_url) window.open(response.payment_url, "_blank", "noopener,noreferrer");
      } else {
        setResponseMsg(`Erreur : ${response?.error || response?.message || "Erreur inconnue"}`);
      }
    } catch (err: any) {
      console.error(err);
      setResponseMsg("Une erreur est survenue. Vérifiez votre connexion ou réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setIsSuccess(false);
    setTransactionData(null);
    setResponseMsg("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getSelectedModeLabel = () => {
    const selected = mobileMoneyModes.find(m => m.value === formData.mode);
    return selected ? selected.label : "";
  };

  // Scroll automatique vers le formulaire au montage
  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Scroll vers le formulaire lors d'une erreur ou message
  useEffect(() => {
    if (responseMsg && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [responseMsg]);

  return (
    <div className="payment-form-container">
      <div className="payment-header">
        <h2>Voter pour {candidat.firstname} {candidat.lastname}</h2>
        <p>Votre vote compte ! Soutenez ce candidat en effectuant un paiement.</p>
      </div>

      {responseMsg && (
        <div className={`alert ${isSuccess ? "alert-success" : "alert-error"}`}>
          <strong>{isSuccess ? "Succès :" : "Erreur :"}</strong> {responseMsg}
          {!isSuccess && (
            <button onClick={handleRetry} className="retry-button">Réessayer</button>
          )}
        </div>
      )}

      {isSuccess && transactionData ? (
        <div className="success-container">
          <div className="alert alert-success">
            <h3>✅ Paiement initialisé avec succès !</h3>
            <p>Transaction ID: {transactionData.transaction_id}</p>
            {transactionData.payment_url && (
              <div className="payment-actions">
                <a href={transactionData.payment_url} target="_blank" rel="noopener noreferrer" className="payment-link">📱 Finaliser le paiement</a>
                <button onClick={onClose} className="btn-secondary">Fermer</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <form className="payment-form" onSubmit={handleSubmit} ref={formRef}>
          {/* Nom */}
          <div className="form-group">
            <label htmlFor="name">Nom complet</label>
            <input type="text" id="name" name="name" placeholder="Votre nom complet" value={formData.name} onChange={handleChange} required />
          </div>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input type="email" id="email" name="email" placeholder="votre@email.com" value={formData.email} onChange={handleChange} required />
          </div>
          {/* Téléphone */}
          <div className="form-group">
            <label htmlFor="phone_number">Numéro de téléphone</label>
            <input type="tel" id="phone_number" name="phone_number" placeholder="+229771234567" value={formData.phone_number} onChange={handleChange} required pattern="^\+[0-9]{10,15}$" title="Format: +229771234567" />
            <small>Commencez par l'indicatif pays</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Montant</label>
              <input type="number" id="amount" name="amount" placeholder="100" min={100} step={100} value={formData.amount} onChange={handleChange} required />
              <small>Minimum: 100 {formData.currency}</small>
            </div>

            <div className="form-group">
              <label htmlFor="currency">Devise</label>
              <select id="currency" name="currency" value={formData.currency} onChange={handleChange} disabled>
                <option value="XOF">XOF (Franc CFA)</option>
                <option value="GNF">GNF (Franc guinéen)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input type="text" id="description" name="description" placeholder="Description du paiement" value={formData.description} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="country">Pays</label>
              <input type="text" id="country" name="country" value={formData.country} disabled style={{textTransform: "uppercase"}} />
            </div>

            <div className="form-group">
              <label htmlFor="mode">Mode de paiement</label>
              <select id="mode" name="mode" onChange={handleModeChange} required>
                <option value="">Sélectionner un Mobile Money</option>
                {mobileMoneyModes.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
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
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Traitement..." : "Payer maintenant"}</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PaymentForm;
