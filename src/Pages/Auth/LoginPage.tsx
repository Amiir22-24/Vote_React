import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/services/auth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
        const response = await login({ email, password });
        
        // 1. Enregistrer le token
        localStorage.setItem('admin_token', response.token); 
        
        // 2. Rediriger vers le tableau de bord
        navigate('/admin/dashboard', { replace: true }); 
    } catch (err) {
  if (err instanceof Error) {
    console.error(err.message); // sûr
  } else {
    console.error(String(err)); // solution de repli
  }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f9' }}>
      <form onSubmit={handleSubmit} style={{ padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '400px' }}>
        <h1 style={{ color: '#6c63ff', textAlign: 'center' }}>Administration VoteApp</h1>
        <h3 style={{ marginTop: '5px', marginBottom: '30px', textAlign: 'center', color: '#666' }}>Page de connexion sécurisée</h3>
        
        {error && <p style={{ color: 'red', textAlign: 'center', border: '1px solid red', padding: '10px', borderRadius: '4px' }}>{error}</p>}

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
             style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mot de passe</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
             style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        
        <button type="submit" disabled={loading} style={{ 
            width: '100%', padding: '12px', backgroundColor: '#6c63ff', color: 'white', border: 'none', 
            borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' 
        }}>
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;