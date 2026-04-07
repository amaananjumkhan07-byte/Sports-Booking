import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc'); // desc = newest first

  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setBookings(data.bookings);
      } else {
        setError(data.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5001/api/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        setBookings(prev => 
          prev.map(b => b._id === id ? { ...b, status } : b)
        );
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Filter & Sort Logic
  const filteredBookings = useMemo(() => {
    return bookings
      .filter(b => {
        const matchesSearch = 
          b.name.toLowerCase().includes(search.toLowerCase()) || 
          b.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
          b.ldapId.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [bookings, search, statusFilter, sortOrder]);

  if (loading) return <div style={{ padding: '40px', color: 'white', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="mainTitle" style={{ marginBottom: 0 }}>Admin <span>Dashboard</span></h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {error && <p style={{ color: '#ffb3bb' }}>{error}</p>}

      <div className="controls-bar">
        <input 
          type="text" 
          placeholder="Search Name, Roll, LDAP..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button 
          onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
          style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(200,166,255,0.2)', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer'}}
        >
          Sort by Date ({sortOrder === 'desc' ? 'Newest' : 'Oldest'})
        </button>
      </div>

      <div className="table-container">
        <table className="booking-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Details</th>
              <th>Court / Time</th>
              <th>Reason & File</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No bookings found.</td></tr>
            ) : null}
            
            {filteredBookings.map(b => (
              <tr key={b._id}>
                <td>
                  <strong>{b.name}</strong><br />
                  <small style={{ color: '#aaa' }}>{new Date(b.createdAt).toLocaleDateString()}</small>
                </td>
                <td>
                  {b.rollNumber}<br/>
                  <small style={{ color: '#aaa' }}>{b.ldapId}</small>
                </td>
                <td>
                  <strong>{b.sport}</strong><br/>
                  {b.date} at {b.time}
                </td>
                <td style={{ maxWidth: '250px' }}>
                  <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={b.reason}>
                    {b.reason}
                  </div>
                  {b.file && (
                    <a href={`http://localhost:5001/uploads/${b.file.filename}`} target="_blank" rel="noreferrer" className="file-link">
                      View Attachment
                    </a>
                  )}
                </td>
                <td>
                  <span className={`status-badge status-${b.status.toLowerCase()}`}>
                    {b.status}
                  </span>
                </td>
                <td>
                  {b.status === 'Pending' && (
                    <>
                      <button className="action-btn btn-approve" onClick={() => updateStatus(b._id, 'Approved')}>Approve</button>
                      <button className="action-btn btn-reject" onClick={() => updateStatus(b._id, 'Rejected')}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
