import { useNavigate } from 'react-router-dom';

const dummyTransactions = [
  {
    id: 1,
    country: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    amountSent: 500.00,
    amountReceived: '41,234.50',
    date: 'Feb 19, 2026',
    time: '10:32 AM',
    status: 'Completed',
    exchangeRate: '83.1200',
  },
  {
    id: 2,
    country: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    amountSent: 200.00,
    amountReceived: '156.82',
    date: 'Feb 18, 2026',
    time: '03:15 PM',
    status: 'Completed',
    exchangeRate: '0.7841',
  },
  {
    id: 3,
    country: 'UAE',
    flag: '🇦🇪',
    currency: 'AED',
    amountSent: 150.00,
    amountReceived: '547.23',
    date: 'Feb 17, 2026',
    time: '11:45 AM',
    status: 'Pending',
    exchangeRate: '3.6725',
  },
  {
    id: 4,
    country: 'Europe',
    flag: '🇪🇺',
    currency: 'EUR',
    amountSent: 300.00,
    amountReceived: '274.12',
    date: 'Feb 15, 2026',
    time: '09:20 AM',
    status: 'Failed',
    exchangeRate: '0.9204',
  },
  {
    id: 5,
    country: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    amountSent: 1000.00,
    amountReceived: '1,342.10',
    date: 'Feb 10, 2026',
    time: '02:00 PM',
    status: 'Completed',
    exchangeRate: '1.3421',
  },
];

const statusConfig = {
  Completed: { color: '#1a7a6e', bg: '#f0fff8', icon: '✅' },
  Pending:   { color: '#e67e22', bg: '#fff8f0', icon: '⏳' },
  Failed:    { color: '#e74c3c', bg: '#fff0f0', icon: '❌' },
};

function History() {
  const navigate = useNavigate();

  const totalSent = dummyTransactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.amountSent, 0);

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
            <p style={{ fontSize: '22px', fontWeight: '800', color: '#0f4c81', margin: '6px 0 0' }}>{dummyTransactions.length}</p>
          </div>

          <div style={{
            background: 'white', borderRadius: '20px',
            padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Completed</p>
            <p style={{ fontSize: '22px', fontWeight: '800', color: '#1a7a6e', margin: '6px 0 0' }}>
              {dummyTransactions.filter(t => t.status === 'Completed').length}
            </p>
          </div>

        </div>

        {/* Transaction List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {dummyTransactions.map((transaction) => {
            const status = statusConfig[transaction.status];
            return (
              <div
                key={transaction.id}
                style={{
                  background: 'white', borderRadius: '20px',
                  padding: '22px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'transform 0.2s',
                  cursor: 'default'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Left — Flag + Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    background: '#f7f8fc', borderRadius: '16px',
                    width: '52px', height: '52px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px'
                  }}>
                    {transaction.flag}
                  </div>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a2e', margin: '0 0 3px' }}>
                      {transaction.country}
                    </p>
                    <p style={{ fontSize: '12px', color: '#aaa', margin: '0 0 6px' }}>
                      {transaction.date} · {transaction.time}
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
                    +{transaction.amountReceived} {transaction.currency}
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

      </div>
    </div>
  );
}

export default History;