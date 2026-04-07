import React, { useState } from 'react';
import './BookingModal.css';

const SPORT_ICONS = {
  Tennis: '🎾',
  Badminton: '🏸',
  Squash: '🟡',
  'Table Tennis': '🏓',
};

export default function BookingModal({ sport, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    ldapId: '',
    date: '',
    time: '',
    reason: '',
  });

  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const resetForm = () => {
    setFormData({ name: '', rollNumber: '', ldapId: '', date: '', time: '', reason: '' });
    setFile(null);
    setErrorMessage('');
    setSubmitted(false);
    setBookingId(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    // Client-side validation
    const { name, rollNumber, ldapId, date, time, reason } = formData;
    if (!name || !rollNumber || !ldapId || !date || !time || !reason) {
      setErrorMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('name', name.trim());
      submitData.append('rollNumber', rollNumber.trim());
      submitData.append('ldapId', ldapId.trim());
      submitData.append('date', date);
      submitData.append('time', time);
      submitData.append('reason', reason.trim());
      submitData.append('sport', sport);
      if (file) submitData.append('file', file);

      const response = await fetch('http://localhost:5001/book', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit booking.');
      }

      setBookingId(result.bookingId);
      setSubmitted(true);
    } catch (err) {
      console.error('Booking error:', err);
      setErrorMessage(
        err.message === 'Failed to fetch'
          ? 'Cannot reach the server. Make sure the backend is running on port 5001.'
          : err.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const sportIcon = SPORT_ICONS[sport] || '🏟️';
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="modal-sport-label">{sportIcon} Court Booking</span>
            <h2>Book {sport} Court</h2>
          </div>
          <button className="close-btn" onClick={handleClose} aria-label="Close">✕</button>
        </div>

        {/* ── Success Screen ── */}
        {submitted ? (
          <div className="success-screen">
            <div className="success-icon">✓</div>
            <h3>Booking Confirmed!</h3>
            <p>
              Your {sport} court has been booked successfully.<br />
              You'll receive a confirmation shortly.
            </p>
            {bookingId && (
              <div className="booking-id-badge">BOOKING ID: #{bookingId}</div>
            )}
            <button className="submit-btn" onClick={handleClose} style={{ marginTop: '8px' }}>
              Done
            </button>
          </div>
        ) : (
          <>
            {/* ── Error Banner ── */}
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

            {/* ── Booking Form ── */}
            <form onSubmit={handleSubmit} className="booking-form" noValidate>

              {/* Row 1: Name */}
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Arjun Sharma"
                  autoComplete="name"
                />
              </div>

              {/* Row 2: Roll Number + LDAP ID */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rollNumber">Roll Number *</label>
                  <input
                    type="text"
                    id="rollNumber"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 24B0001"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ldapId">LDAP ID *</label>
                  <input
                    type="text"
                    id="ldapId"
                    name="ldapId"
                    value={formData.ldapId}
                    onChange={handleInputChange}
                    placeholder="e.g. arjun24"
                  />
                </div>
              </div>

              {/* Row 3: Date + Time */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={today}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="time">Time Slot *</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Row 4: Reason */}
              <div className="form-group">
                <label htmlFor="reason">Reason / Purpose *</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Briefly describe your reason for booking (e.g. practice session, inter-hostel tournament...)"
                  rows={3}
                />
              </div>

              {/* Row 5: File Upload */}
              <div className="form-group">
                <label>Permission Letter (Optional)</label>
                <div className="file-upload-wrapper">
                  <label className="file-upload-label" htmlFor="file">
                    <span className="file-upload-icon">📎</span>
                    <span>{file ? file.name : 'Click to attach — PDF, DOC, JPG, PNG (max 10 MB)'}</span>
                  </label>
                  <input
                    type="file"
                    id="file"
                    className="file-upload-input"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                </div>
                {file && <p className="file-selected">{file.name}</p>}
              </div>

              {/* Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Confirming…' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
