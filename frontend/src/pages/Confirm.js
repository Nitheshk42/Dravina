import { useLocation, useNavigate } from 'react-router-dom';

function Confirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  // If someone visits /confirm directly without data, send them back
  if (!data) {
    return (
   // navigate('/send');
    <div style={{
        minHeight: '100vh', background: '#f7f8fc',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '16px'
      }}>
        <span style={{ fontSize: '48px' }}>⚠️</span>
        <h2 style={{ color: '#1a1a2e', fontWeight: '800' }}>No Transfer Data Found</h2>
        <p style={{ color: '#888', fontSize: '14px' }}>Please start a transfer first.</p>
        <button
          onClick={() => navigate('/send')}
          style={{
            background: 'linear-gradient(135deg, #0f4c81, #1a7a6e)',
            color: 'white', border: 'none', borderRadius: '16px',
            padding: '14px 28px', fontWeight: '700', fontSize: '15px',
            cursor: 'pointer', fontFamily: 'Sora, sans-serif'
          }}
        >
          Start a Transfer →
        </button>
      </div>
    );
}
   const handleConfirm = () => {
    // For now we just show success and go to history
    // Later this will call our backend!
    alert('Transfer Successful! 🎉');
    navigate('/history');
  };
  return (
    <div style={{ background: '#f7f8fc', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f4c81 0%, #1a7a6e 100%)',
        padding: '24px 32px',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/send')}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: '12px', padding: '8px 14px',
              color: 'white', cursor: 'pointer', fontSize: '18px'
            }}
          >
            ←
          </button>
          <div>
            <h1 style={{ color: 'white', fontWeight: '800', fontSize: '22px', margin: 0 }}>Confirm Transfer</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: 0 }}>Review before sending</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '32px auto', padding: '0 24px' }}>

        {/* Summary Card */}
        <div style={{
          background: 'white', borderRadius: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '32px',
          marginBottom: '20px'
        }}>
          <p style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
            Transfer Summary
          </p>

          {/* You Send */}
          <div style={{
            background: '#f7f8fc', borderRadius: '16px',
            padding: '20px', marginBottom: '12px'
          }}>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>You Send</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>🇺🇸</span>
                <span style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '16px' }}>USD</span>
              </div>
              <span style={{ fontWeight: '800', fontSize: '28px', color: '#1a1a2e' }}>
                ${data.amount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Arrow */}
          <div style={{ textAlign: 'center', margin: '4px 0' }}>
            <span style={{ fontSize: '20px' }}>↓</span>
          </div>

          {/* Recipient Gets */}
          <div style={{
            background: 'linear-gradient(135deg, #0f4c81, #1a7a6e)',
            borderRadius: '16px', padding: '20px', marginBottom: '24px'
          }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>Recipient Gets</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>{data.country.flag}</span>
                <span style={{ fontWeight: '700', color: 'white', fontSize: '16px' }}>{data.country.code}</span>
              </div>
              <span style={{ fontWeight: '800', fontSize: '28px', color: 'white' }}>
                {data.recipientGets}
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div style={{ borderTop: '1.5px solid #f0f0f0', paddingTop: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
              Breakdown
            </p>

            {/* Row */}
            {[
              { label: 'Transfer Amount', value: `$${data.amount.toFixed(2)}` },
              { label: 'Transfer Fee', value: `- $${data.fee}`, color: '#e74c3c' },
              { label: 'Amount After Fee', value: `$${data.amountAfterFee}` },
              { label: 'Exchange Rate', value: `1 USD = ${data.exchangeRate} ${data.country.code}` },
              { label: 'Estimated Delivery', value: `⚡ ${data.country.delivery}`, color: '#1a7a6e' },
            ].map((row) => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '12px'
              }}>
                <span style={{ fontSize: '14px', color: '#888' }}>{row.label}</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: row.color || '#1a1a2e' }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recipient Details Card */}
        <div style={{
          background: 'white', borderRadius: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '28px',
          marginBottom: '20px'
        }}>
          <p style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Sending To
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0f4c81, #1a7a6e)',
              borderRadius: '50%', width: '48px', height: '48px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', color: 'white', fontWeight: '800'
            }}>
              {data.country.flag}
            </div>
            <div>
              <p style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '16px' }}>{data.country.name}</p>
              <p style={{ fontSize: '13px', color: '#888' }}>{data.country.currency}</p>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div style={{
          background: '#fff8f0', border: '1.5px solid #ffe0b2',
          borderRadius: '16px', padding: '16px 20px', marginBottom: '24px',
          display: 'flex', gap: '12px', alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: '18px' }}>⚠️</span>
          <p style={{ fontSize: '13px', color: '#e67e22', margin: 0, lineHeight: '1.5' }}>
            Please review all details carefully. Once confirmed, transfers cannot be cancelled.
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/send')}
            style={{
              flex: 1, padding: '18px',
              background: 'white', color: '#0f4c81',
              border: '2px solid #0f4c81', borderRadius: '16px',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              fontFamily: 'Sora, sans-serif'
            }}
          >
            ← Edit
          </button>
          <button
            onClick={handleConfirm}
            style={{
              flex: 2, padding: '18px',
              background: 'linear-gradient(135deg, #0f4c81, #1a7a6e)',
              color: 'white', border: 'none', borderRadius: '16px',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              fontFamily: 'Sora, sans-serif', transition: 'transform 0.2s'
            }}
            onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.target.style.transform = 'translateY(0)'}
          >
            Confirm & Send 💸
          </button>
        </div>

      </div>
    </div>
  );
}
export default Confirm;