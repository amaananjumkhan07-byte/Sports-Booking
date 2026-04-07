import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Booking() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', ldapId: '', date: '', time: '', reason: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    alert('Booking Confirmed!');
    navigate('/');
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>Enter Booking Details</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="LDAP ID" onChange={e => setForm({ ...form, ldapId: e.target.value })} required />
        <input type="date" onChange={e => setForm({ ...form, date: e.target.value })} required />
        <input type="time" onChange={e => setForm({ ...form, time: e.target.value })} required />
        <textarea placeholder="Reason" onChange={e => setForm({ ...form, reason: e.target.value })} required />
        <button type="submit" style={{ background: 'green', color: 'white', padding: '10px' }}>Confirm</button>
      </form>
    </div>
  );
}