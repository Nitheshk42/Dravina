import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecipients, deleteRecipient } from '../services/api';
import AddRecipientModal from '../components/AddRecipientModal';

function Recipients() {
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editRecipient, setEditRecipient] = useState(null);

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const response = await getRecipients();
        setRecipients(response.data.recipients);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching recipients:', error);
        if (error.response?.status === 401) navigate('/');
        setLoading(false);
      }
    };
    fetchRecipients();
  }, [navigate]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name} from recipients?`)) return;
    setDeletingId(id);
    try {
      await deleteRecipient(id);
      setRecipients(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      alert('Something went wrong!');
    }
    setDeletingId(null);
  };

  const transferIcon = {
    'Myself': '🙋',
    'My Family': '👨‍👩‍👧',
    'Someone Else': '👤'
  };

  return (
    <div style={{ background: '#f7f8fc', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f4c81 0%, #1a7a6e 100%)',
        padding: '24px 32px',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: '12px', padding: '8px 14px',
              color: 'white', cursor: 'pointer', fontSize: '18px'
            }}
          >←</button>
          <div>
            <h1 style={{ color: 'white', fontWeight: '800', fontSize: '22px', margin: 0 }}>
              👥 Manage Recipients
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: 0 }}>
              {recipients.length} saved recipient{recipients.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '32px auto', padding: '0 24px' }}>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: '#aaa', fontSize: '14px' }}>Loading recipients...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && recipients.length === 0 && (
          <div style={{
            background: 'white', borderRadius: '24px',
            padding: '60px 32px', textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>👥</p>
            <p style={{ fontWeight: '700', fontSize: '18px', color: '#1a1a2e' }}>No recipients yet!</p>
            <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>
              Add recipients from the dashboard
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                marginTop: '24px', padding: '14px 32px',
                background: 'linear-gradient(135deg, #0f4c81, #1a7a6e)',
                color: 'white', border: 'none', borderRadius: '14px',
                fontWeight: '700', fontSize: '14px',
                cursor: 'pointer', fontFamily: 'Sora, sans-serif'
              }}
            >
              ← Go to Dashboard
            </button>
          </div>
        )}

        {/* Recipients List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {recipients.map(r => (
            <div
              key={r.id}
              style={{
                background: 'white', borderRadius: '20px',
                padding: '22px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                transition: 'transform 0.2s',
                borderLeft: '4px solid #0f4c81'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Top Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '48px', height: '48px',
                    background: 'linear-gradient(135deg, #0f4c81, #1a7a6e)',
                    borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: '700', fontSize: '18px',
                    flexShrink: 0
                  }}>
                    {r.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e', margin: 0 }}>
                      {r.fullName}
                    </p>
                    <p style={{ fontSize: '12px', color: '#888', margin: '3px 0 0' }}>
                      {transferIcon[r.transferringTo] || '👤'} {r.transferringTo} · {r.country}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => navigate('/send', { state: { recipient: r } })}
                    style={{
                      background: 'linear-gradient(135deg, #0f4c81, #1a7a6e)',
                      color: 'white', border: 'none',
                      borderRadius: '10px', padding: '8px 14px',
                      fontWeight: '600', fontSize: '12px',
                      cursor: 'pointer', fontFamily: 'Sora, sans-serif'
                    }}
                  >
                    💸 Send
                  </button>
                  <button
                    onClick={() => setEditRecipient(r)}
                    style={{
                    background: '#f0f7ff', color: '#0f4c81',
                    border: 'none', borderRadius: '10px',
                    padding: '8px 14px', fontWeight: '600',
                    fontSize: '12px', cursor: 'pointer',
                    fontFamily: 'Sora, sans-serif'
                    }}
                >
                    ✏️ Edit
                </button>
                  <button
                    onClick={() => handleDelete(r.id, r.fullName)}
                    disabled={deletingId === r.id}
                    style={{
                      background: '#fff0f0', color: '#e74c3c',
                      border: 'none', borderRadius: '10px',
                      padding: '8px 14px', fontWeight: '600',
                      fontSize: '12px', cursor: 'pointer',
                      fontFamily: 'Sora, sans-serif'
                    }}
                  >
                    {deletingId === r.id ? '...' : '🗑️'}
                  </button>
                </div>
              </div>

              {/* Details Row */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '10px', marginTop: '16px',
                background: '#f7f8fc', borderRadius: '12px',
                padding: '12px 16px'
              }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#aaa', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>Bank Account</p>
                  <p style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: '600', margin: '3px 0 0' }}>{r.bankAccount}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#aaa', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>IFSC Code</p>
                  <p style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: '600', margin: '3px 0 0' }}>{r.ifscCode}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#aaa', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>Email</p>
                  <p style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: '600', margin: '3px 0 0' }}>{r.email}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#aaa', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>Phone</p>
                  <p style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: '600', margin: '3px 0 0' }}>{r.phone}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Button */}
        {!loading && recipients.length > 0 && (
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              width: '100%', marginTop: '24px', marginBottom: '32px',
              padding: '18px',
              background: 'linear-gradient(135deg, #0f4c81, #1a7a6e)',
              color: 'white', border: 'none', borderRadius: '16px',
              fontSize: '16px', fontWeight: '700', cursor: 'pointer',
              fontFamily: 'Sora, sans-serif'
            }}
          >
            ← Back to Dashboard
          </button>
        )}
                    {/* Edit Modal */}
      {editRecipient && (
        <AddRecipientModal
          onClose={() => setEditRecipient(null)}
          editRecipient={editRecipient}
          onSuccess={(updated, isEdit) => {
            setRecipients(prev => prev.map(r => r.id === updated.id ? updated : r));
            setEditRecipient(null);
            alert(`✅ ${updated.fullName} updated successfully!`);
          }}
        />
      )}

      </div>
    </div>
  );
  
}

export default Recipients;