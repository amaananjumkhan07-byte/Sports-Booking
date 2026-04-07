import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; 
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* We will build the Sport page later! */}
        <Route path="/sport/:sport" element={<div style={{color: 'white', padding: '40px'}}>Sport Page Coming Soon...</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;