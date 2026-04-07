import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  // A reusable style for your navigation buttons to keep the code clean
  const navButtonStyle = {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '8px 20px',
    borderRadius: '20px',
    fontSize: '12px',
    letterSpacing: '1px',
    cursor: 'pointer'
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      fontFamily: 'sans-serif',
      color: 'white'
    }}>
      
      {/* Left Side: Logo and Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <img 
          src="/logo.webp" 
          alt="IITB Logo" 
          style={{ 
            height: '45px', 
            width: '45px',
            objectFit: 'contain',
            borderRadius: '50%',
            backgroundColor: 'white',
            padding: '5px'
          }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '1px' }}>
            IITB SPORTS
          </h1>
          <span style={{ 
            fontSize: '10px', 
            color: '#B088FF', /* Light purple to match your screenshot */
            letterSpacing: '2px', 
            marginTop: '4px' 
          }}>
            UNTIL. VICTORY. ALWAYS.
          </span>
        </div>
      </div>

      {/* Right Side: Navigation */}
      <div style={{ display: 'flex', gap: '15px' }}>
        <button style={navButtonStyle} onClick={() => navigate('/')}>HOME</button>
        <button style={navButtonStyle} onClick={() => navigate('/admin/dashboard')}>ADMIN PANEL</button>
      </div>

    </header>
  );
}