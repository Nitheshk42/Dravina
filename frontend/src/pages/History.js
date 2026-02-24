import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../services/api';

const statusConfig = {
  Completed: { color: '#1a7a6e', bg: '#f0fff8', icon: '✅' },
  Pending:   { color: '#e67e22', bg: '#fff8f0', icon: '⏳' },
  Failed:    { color: '#e74c3c', bg: '#fff0f0', icon: '❌' },
};

function History() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistory();
        setTransactions(response.data.transactions);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching history:', error);
        if (error.response?.status === 401) {
          navigate('/');
        }
        setLoading(false);
      }
    };
    fetchHistory();
  }, [navigate]);

  const totalSent = transactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.amountSent, 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });
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
          >
            ←
          </button>
          <div>
            <h1 style={{ color: 'white', fontWeight: '800', fontSize: '22px', margin: 0 }}>Transaction History</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: 0 }}>All your past transfers</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '32px auto', padding: '0 24px' }}>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>

          <div style={{
            background: 'white', borderRadius: '20px',
            padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Sent</p>
            <p style={{ fontSize: '22px', fontWeight: '800', color: '#0f4c81', margin: '6px 0 0' }}>${totalSent.toFixed(2)}</p>
          </div>

          <div style={{
            background: 'white', borderRadius: '20px',
            padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Transfers</p>
            <p style={{ fontSize: '22px', fontWeight: '800', color: '#0f4c81', margin: '6px 0 0' }}>{transactions.length}</p>
          </div>

          <div style={{
            background: 'white', borderRadius: '20px',
            padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Completed</p>
            <p style={{ fontSize: '22px', fontWeight: '800', color: '#1a7a6e', margin: '6px 0 0' }}>
              {transactions.filter(t => t.status === 'Completed').length}
            </p>
          </div>

        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: '#aaa', fontSize: '14px' }}>Loading transactions...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && transactions.length === 0 && (
          <div style={{
            background: 'white', borderRadius: '24px',
            padding: '60px 32px', textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>💸</p>
            <p style={{ fontWeight: '700', fontSize: '18px', color: '#1a1a2e' }}>No transactions yet!</p>
            <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>Send your first transfer to get started</p>
          </div>
        )}

        {/* Transaction List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {transactions.map((transaction) => {
            const status = statusConfig[transaction.status] || statusConfig.Completed;
            return (
              <div
                key={transaction.id}
                style={{
                  background: 'white', borderRadius: '20px',
                  padding: '22px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Left — Country + Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    background: '#f7f8fc', borderRadius: '16px',
                    width: '52px', height: '52px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '28px'
                  }}>
                    🌍
                  </div>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a2e', margin: '0 0 3px' }}>
                      {transaction.country}
                    </p>
                    <p style={{ fontSize: '12px', color: '#aaa', margin: '0 0 6px' }}>
                      {formatDate(transaction.createdAt)} · {formatTime(transaction.createdAt)}
                    </p>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      background: status.bg, borderRadius: '50px',
                      padding: '3px 10px'
                    }}>
                      <span style={{ fontSize: '11px' }}>{status.icon}</span>
                      <span style={{ fontSize: '11px', fontWeight: '600', color: status.color }}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right — Amounts */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '800', fontSize: '18px', color: '#1a1a2e', margin: '0 0 3px' }}>
                    -${transaction.amountSent.toFixed(2)}
                  </p>
                  <p style={{ fontSize: '13px', color: '#1a7a6e', fontWeight: '600', margin: '0 0 3px' }}>
                    +{transaction.amountReceived.toFixed(2)} {transaction.currency}
                  </p>
                  <p style={{ fontSize: '11px', color: '#aaa', margin: 0 }}>
                    Rate: {transaction.exchangeRate}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Send Button */}
        {!loading && (
          <button
            onClick={() => navigate('/send')}
            style={{
              width: '100%', marginTop: '24px', marginBottom: '32px',
              padding: '18px',
              background: 'linear-gradient(135deg, #0f4c81, #1a7a6e)',
              color: 'white', border: 'none', borderRadius: '16px',
              fontSize: '16px', fontWeight: '700', cursor: 'pointer',
              fontFamily: 'Sora, sans-serif'
            }}
          >
            💸 Send Another Transfer
          </button>
        )}

      </div>
    </div>
  );
}

export default History;