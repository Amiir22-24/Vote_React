import React from 'react'
import type { PaymentMode } from '../../types/paiement';

export default function mode() {
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
        { value: "togocel", label: "TOGOCEL T-Money (Togo)" },
    
        // Mali
        { value: "orange_ml", label: "Orange Money (Mali)" },
    
        // Burkina-Faso
        { value: "moov_bf", label: "MOOV Money (Burkina-Faso)" },
        { value: "orange_bf", label: "Orange Money (Burkina-Faso)" },
    
        // Guinée
        { value: "mtn_gn", label: "MTN Mobile Money (Guinée)" },
      ];
  return (
    <div>
      
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
  )
}
