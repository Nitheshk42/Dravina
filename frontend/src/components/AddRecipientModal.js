import { useState } from 'react';
import { addRecipient,updateRecipient } from '../services/api';

const countries = [
  'United Kingdom', 'Europe', 'India', 'Australia',
  'Canada', 'Singapore', 'UAE'
];

function AddRecipientModal({ onClose, onSuccess, editRecipient = null }) {
  const [form, setForm] = useState({
    fullName: editRecipient?.fullName || '',
    email: editRecipient?.email || '',
    phone: editRecipient?.phone || '',
    country: editRecipient?.country || '',
    bankAccount: editRecipient?.bankAccount || '',
    ifscCode: editRecipient?.ifscCode || '',
    transferringTo: editRecipient?.transferringTo || 'Someone Else'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError('');

    if (!form.fullName || !form.email || !form.phone || !form.country || !form.bankAccount || !form.ifscCode) {
      setError('Please fill in all fields!');
      return;
    }

    setLoading(true);
    try {
      let response;
     if (editRecipient) {
     response = await updateRecipient(editRecipient.id, form);
       } else {
        response = await addRecipient(form);
      }
      onSuccess(response.data.recipient, !!editRecipient);
    } catch (err) {
      setError('Something went wrong. Please try again!');
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    border: '2px solid #e0e0e0', borderRadius: '12px',
    fontSize: '14px', fontFamily: 'Sora, sans-serif',
    color: '#1a1a2e', outline: 'none',
    boxSizing: 'border-box', marginTop: '6px'
  };

  const labelStyle = {
    fontSize: '12px', fontWeight: '600',
    color: '#888', textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000,
      padding: '20px', overflowY: 'auto'
    }}>
      <div style={{
        background: 'white', borderRadius: '24px',
        padding: '32px', width: '100%',
        maxWidth: '480px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        maxHeight: '90vh', overflowY: 'auto'
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontWeight: '800', fontSize: '22px', color: '#1a1a2e', margin: 0 }}>
            {editRecipient ? '✏️ Edit Recipient' : '👤 Add Recipient'}
            </h2>
            <p style={{ color: '#888', fontSize: '13px', margin: '4px 0 0' }}>
              Save recipient for future transfers
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f7f8fc', border: 'none',
              borderRadius: '50%', width: '36px', height: '36px',
              cursor: 'pointer', fontSize: '18px'
            }}
          >✕</button>
        </div>

        {/* Transferring To */}
        <div style={{ marginBottom: '20px' }}>
          <p style={labelStyle}>Transferring To</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            {['Myself', 'My Family', 'Someone Else'].map(option => (
              <label
                key={option}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center',
                  gap: '6px', padding: '10px 12px',
                  border: `2px solid ${form.transferringTo === option ? '#0f4c81' : '#e0e0e0'}`,
                  borderRadius: '12px', cursor: 'pointer',
                  background: form.transferringTo === option ? '#f0f7ff' : 'white',
                  fontSize: '12px', fontWeight: '600',
                  color: form.transferringTo === option ? '#0f4c81' : '#888',
                  fontFamily: 'Sora, sans-serif'
                }}
              >
                <input
                  type="radio"
                  name="transferringTo"
                  value={option}
                  checked={form.transferringTo === option}
                  onChange={(e) => handleChange('transferringTo', e.target.value)}
                  style={{ display: 'none' }}
                />
                {option === 'Myself' ? '🙋' : option === 'My Family' ? '👨‍👩‍👧' : '👤'} {option}
              </label>
            ))}
          </div>
        </div>

        {/* Full Name */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={form.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Phone */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Phone Number</label>
          <input
            type="tel"
            placeholder="+91 9876543210"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Country */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Country</label>
          <select
            value={form.country}
            onChange={(e) => handleChange('country', e.target.value)}
            style={{ ...inputStyle, background: 'white' }}
          >
            <option value="">Select country</option>
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Bank Account */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Bank Account Number</label>
          <input
            type="text"
            placeholder="1234567890"
            value={form.bankAccount}
            onChange={(e) => handleChange('bankAccount', e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* IFSC Code */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>IFSC Code</label>
          <input
            type="text"
            placeholder="HDFC0001234"
            value={form.ifscCode}
            onChange={(e) => handleChange('ifscCode', e.target.value)}
            style={{ ...inputStyle, textTransform: 'uppercase' }}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fff0f0', borderRadius: '12px',
            padding: '12px', marginBottom: '16px'
          }}>
            <p style={{ color: '#e74c3c', fontSize: '13px', margin: 0 }}>❌ {error}</p>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '14px',
              border: '2px solid #e0e0e0',
              borderRadius: '12px', background: 'white',
              color: '#888', fontWeight: '600',
              cursor: 'pointer', fontFamily: 'Sora, sans-serif'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 2, padding: '14px', border: 'none',
              borderRadius: '12px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #0f4c81, #1a7a6e)',
              color: 'white', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Sora, sans-serif', fontSize: '15px'
            }}
          >
            {loading ? 'Saving...' : editRecipient ? '✏️ Update Recipient' : '👤 Save Recipient'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default AddRecipientModal;