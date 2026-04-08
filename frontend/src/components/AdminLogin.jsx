import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server error. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homeContainer" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 className="mainTitle">Admin <span>Login</span></h1>
      
      <form onSubmit={handleLogin} style={{
        background: 'linear-gradient(145deg, #1a0a35 0%, #120622 100%)',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(200, 166, 255, 0.18)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        maxWidth: '400px'
      }}>
        {error && (
          <div style={{
            padding: '12px',
            background: 'rgba(255, 70, 90, 0.15)',
            borderLeft: '3px solid #ff465a',
            color: '#ffb3bb',
            fontSize: '14px',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#a880e0', fontWeight: '700' }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              padding: '12px 14px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(200, 166, 255, 0.18)',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#a880e0', fontWeight: '700' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '12px 14px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(200, 166, 255, 0.18)',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '10px',
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #9b59ff 0%, #6c2ee8 100%)',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 20px rgba(108, 46, 232, 0.4)',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
