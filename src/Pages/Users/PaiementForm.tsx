import React, { useState, type ChangeEvent, type FormEvent, } from "react";
import axios from "axios";
import "./PaiementForm.css";
import type { Candidate } from "../../types/candidat";
import { type PaymentFormData, type PaymentMode, type PaymentResponse } from "../../types/paiement";

interface PaymentFormProps {
  candidat: Candidate;
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ candidat, onClose }) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    name: `${candidat.firstname} ${candidat.lastname}`,
    email: "",
    phone_number: "",
    country: "",
    amount: "",
    currency: "XOF",
    description: `Vote pour ${candidat.firstname}`,
    mode: "" as PaymentMode,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [responseMsg, setResponseMsg] = useState<string>("");

  const mobileMoneyModes: { value: PaymentMode; label: string }[] = [
    { value: "mtn_tg", label: "MTN Money (Togo)" },
    { value: "moov_tg", label: "Moov Money (Togo)" },
    { value: "mtn_bj", label: "MTN Money (Bénin)" },
    { value: "moov_bj", label: "Moov Money (Bénin)" },
    { value: "orange_ci", label: "Orange Money (Côte d'Ivoire)" },
    { value: "mtn_ci", label: "MTN Money (Côte d'Ivoire)" },
    { value: "moov_ci", label: "Moov Money (Côte d'Ivoire)" },
    { value: "orange_bf", label: "Orange Money (Burkina Faso)" },
    { value: "airtel_bf", label: "Airtel Money (Burkina Faso)" },
    { value: "moov_bf", label: "Moov Money (Burkina Faso)" },
    { value: "mtn_gh", label: "MTN MoMo (Ghana)" },
    { value: "vodafone_gh", label: "Vodafone Cash (Ghana)" },
    { value: "airteltigo_gh", label: "AirtelTigo Money (Ghana)" },
    { value: "airtel_ne", label: "Airtel Money (Niger)" },
    { value: "moov_ne", label: "Moov Money (Niger)" },
    { value: "orange_sn", label: "Orange Money (Sénégal)" },
    { value: "wave_sn", label: "Wave (Sénégal)" },
    { value: "free_sn", label: "Free Money (Sénégal)" },
    { value: "emoney_sn", label: "E-money (Sénégal)" },
    { value: "orange_gn", label: "Orange Money (Guinée)" },
    { value: "mtn_gn", label: "MTN Money (Guinée)" },
    { value: "cellcom_gn", label: "Cellcom Money (Guinée)" },
    { value: "orange_ml", label: "Orange Money (Mali)" },
    { value: "moov_ml", label: "Moov Money (Mali)" },
    { value: "telecel_ml", label: "Telecel Money (Mali)" },
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");

    try {
      const res = await axios.post<PaymentResponse>(
        "http://localhost:8000/api/do-vote",
        formData
      );

      if (res.data.success) {
        setResponseMsg(`Paiement initié avec succès ! Transaction ID : ${res.data.transaction_id}`);
      } else {
        setResponseMsg(`Erreur : ${res.data.error || res.data.message}`);
      }
    } catch (err: any) {
      setResponseMsg(`Erreur : ${err.response?.data?.error || err.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="payment-form-container">
      <h3>Voter pour {candidat.firstname} {candidat.lastname}</h3>
      <form className="payment-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nom complet"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Adresse email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone_number"
          placeholder="Téléphone (+228...)"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="country"
          placeholder="Code pays (TG, BJ, CI...)"
          value={formData.country}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Montant"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <select name="currency" value={formData.currency} onChange={handleChange}>
          <option value="XOF">XOF</option>
          <option value="XAF">XAF</option>
          <option value="GHS">GHS</option>
          <option value="GNF">GNF</option>
        </select>

        <input
          type="text"
          name="description"
          placeholder="Description du paiement"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <select name="mode" value={formData.mode} onChange={handleChange} required>
          <option value="">Sélectionner un Mobile Money</option>
          {mobileMoneyModes.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <div className="payment-buttons">
          <button type="submit" disabled={loading}>
            {loading ? "Traitement..." : "Payer maintenant"}
          </button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            Annuler
          </button>
        </div>
      </form>

      {responseMsg && <p className="response">{responseMsg}</p>}
    </div>
  );
};

export default PaymentForm;
