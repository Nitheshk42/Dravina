import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRecipients } from '../services/api';
import WorldMap from '../components/WorldMap';

const FLAT_FEE = 0.99;

const countries = [
  { code: 'GBP', name: 'United Kingdom', flag: '🇬🇧', currency: 'British Pound', delivery: '1-2 hours' },
  { code: 'EUR', name: 'Europe', flag: '🇪🇺', currency: 'Euro', delivery: '1-2 hours' },
  { code: 'INR', name: 'India', flag: '🇮🇳', currency: 'Indian Rupee', delivery: 'Instant' },
  { code: 'AUD', name: 'Australia', flag: '🇦🇺', currency: 'Australian Dollar', delivery: '2-3 hours' },
  { code: 'CAD', name: 'Canada', flag: '🇨🇦', currency: 'Canadian Dollar', delivery: '2-3 hours' },
  { code: 'SGD', name: 'Singapore', flag: '🇸🇬', currency: 'Singapore Dollar', delivery: '1-2 hours' },
  { code: 'AED', name: 'UAE', flag: '🇦🇪', currency: 'UAE Dirham', delivery: 'Instant' },
];

function SendMoney() {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedRecipient = location.state?.recipient || null;

  const [amount, setAmount] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('Getting best exchange rates for you...');
  const [selectedRecipient, setSelectedRecipient] = useState(preselectedRecipient);
  const [recipients, setRecipients] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch exchange rates with failover
  useEffect(() => {
    const fetchRates = async () => {

      // ─── API 1: Frankfurter.app ───────────────────────────
      try {
        setApiStatus('Getting best exchange rates for you...');
        console.log('🔄 Trying API 1 — Frankfurter...');
        const response = await fetch(
          'https://api.frankfurter.app/latest?from=USD&to=GBP,EUR,INR,AUD,CAD,SGD,AED',
          { signal: AbortSignal.timeout(5000) }
        );
        if (!response.ok) throw new Error('API 1 failed');
        const data = await response.json();
        setRates(data.rates);
        setLoading(false);
        console.log('✅ API 1 success!');
        return;
      } catch (error) {
        console.log('❌ API 1 failed — retrying...', error.message);
      }

      // ─── API 1 RETRY ─────────────────────────────────────
      try {
        setApiStatus('Finding the best rates...');
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('🔄 Retrying API 1...');
        const response = await fetch(
          'https://api.frankfurter.app/latest?from=USD&to=GBP,EUR,INR,AUD,CAD,SGD,AED',
          { signal: AbortSignal.timeout(5000) }
        );
        if (!response.ok) throw new Error('API 1 retry failed');
        const data = await response.json();
        setRates(data.rates);
        setLoading(false);
        console.log('✅ API 1 retry success!');
        return;
      } catch (error) {
        console.log('❌ API 1 retry failed — switching to API 2...', error.message);
      }

      // ─── API 2: ExchangeRate-API Open Access ──────────────
      try {
        setApiStatus('Checking backup rate provider...');
        console.log('🔄 Trying API 2 — ExchangeRate-API...');
        const response = await fetch(
          'https://open.er-api.com/v6/latest/USD',
          { signal: AbortSignal.timeout(5000) }
        );
        if (!response.ok) throw new Error('API 2 failed');
        const data = await response.json();
        const { GBP, EUR, INR, AUD, CAD, SGD, AED } = data.rates;
        setRates({ GBP, EUR, INR, AUD, CAD, SGD, AED });
        setLoading(false);
        console.log('✅ API 2 success!');
        return;
      } catch (error) {
        console.log('❌ API 2 failed — switching to API 3...', error.message);
      }

      // ─── API 3: Fawaz Currency API ────────────────────────
      try {
        setApiStatus('Almost there...');
        console.log('🔄 Trying API 3 — Fawaz Currency API...');
        const response = await fetch(
          'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
          { signal: AbortSignal.timeout(5000) }
        );
        if (!response.ok) throw new Error('API 3 failed');
        const data = await response.json();
        const r = data.usd;
        setRates({
          GBP: r.gbp, EUR: r.eur, INR: r.inr,
          AUD: r.aud, CAD: r.cad, SGD: r.sgd, AED: r.aed
        });
        setLoading(false);
        console.log('✅ API 3 success!');
        return;
      } catch (error) {
        console.log('❌ API 3 failed — all APIs down!', error.message);
      }

      // ─── ALL APIS FAILED ─────────────────────────────────
      console.log('🚨 All APIs failed — using fallback rates!');
      setApiStatus('Using cached rates — live rates unavailable');
      setRates({
        GBP: 0.79, EUR: 0.92, INR: 83.12,
        AUD: 1.53, CAD: 1.36, SGD: 1.34, AED: 3.67
      });
      setLoading(false);
    };

    fetchRates();
  }, []);

  // Fetch recipients
  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const response = await getRecipients();
        setRecipients(response.data.recipients);
      } catch (error) {
        console.log('Error fetching recipients:', error);
      }
    };
    fetchRecipients();
  }, []);

  // Calculation logic
  const amountNumber = parseFloat(amount) || 0;
  const amountAfterFee = amountNumber - FLAT_FEE;
  const recipientGets = amountAfterFee > 0
    ? (amountAfterFee * (rates[selectedCountry.code] || 0)).toFixed(2)
    : '0.00';
  const exchangeRate = rates[selectedCountry.code]
    ? rates[selectedCountry.code].toFixed(4)
    : '...';

  // Handle continue
  const handleContinue = () => {
    if (!amount || amountNumber <= FLAT_FEE) {
      alert(`Amount must be greater than $${FLAT_FEE} to cover the fee!`);
      return;
    }
    navigate('/confirm', {
      state: {
        amount: amountNumber,
        fee: FLAT_FEE,
        amountAfterFee: amountAfterFee.toFixed(2),
        recipientGets,
        exchangeRate,
        country: selectedCountry,
        recipient: selectedRecipient,
      }
    });
  };

  return (
    <div style={{ background: '#f7f8fc', minHeight: '100vh' }}>

      {/* Loading Screen */}
      {loading && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'linear-gradient(135deg, #0f4c81, #1a7a6e)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            width: '64px', height: '64px',
            border: '4px solid rgba(255,255,255,0.2)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '24px'
          }} />
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>🌍</p>
          <p style={{
            color: 'white', fontWeight: '700', fontSize: '18px',
            marginBottom: '8px', fontFamily: 'Sora, sans-serif',
            textAlign: 'center', padding: '0 32px'
          }}>
            {apiStatus}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontFamily: 'Sora, sans-serif' }}>
            Powered by live market data
          </p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f4c81 0%, #1a7a6e 100%)',
        padding: '24px 32px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: '12px', padding: '8px 14px',
              color: 'white', cursor: 'pointer', fontSize: '18px'
            }}
          >←</button>
          <div>
            <h1 style={{ color: 'white', fontWeight: '800', fontSize: '22px', margin: 0 }}>Send Money</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: 0 }}>Fast & secure international transfers</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{
        maxWidth: '1200px',
        margin: '32px auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '10px',
        alignItems: 'stretch'
      }}>

        {/* LEFT — World Map (hidden on mobile) */}
        {!isMobile && (
          <WorldMap 
          selectedCountry={selectedCountry?.name}
          recipientCountry={selectedRecipient?.country}
        />
        )}

        {/* RIGHT — Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Recipient Selector */}
          <div style={{
            background: 'white', borderRadius: '20px',
            padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <p style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a2e', margin: '0 0 12px' }}>
              👤 Send To
            </p>
            <select
              value={selectedRecipient?.id || ''}
              onChange={(e) => {
                const recipient = recipients.find(r => r.id === e.target.value);
                setSelectedRecipient(recipient || null);
              }}
              style={{
                width: '100%', padding: '12px 16px',
                border: '2px solid #e0e0e0', borderRadius: '12px',
                fontSize: '14px', fontFamily: 'Sora, sans-serif',
                color: '#1a1a2e', outline: 'none',
                background: 'white', marginBottom: '12px',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Select a recipient...</option>
              {recipients.map(r => (
                <option key={r.id} value={r.id}>
                  {r.fullName} — {r.country}
                </option>
              ))}
            </select>

            {selectedRecipient && (
              <div style={{
                background: '#f0f7ff', borderRadius: '14px',
                padding: '14px', display: 'flex',
                alignItems: 'center', gap: '12px'
              }}>
                <div style={{
                  width: '42px', height: '42px',
                  background: 'linear-gradient(135deg, #0f4c81, #1a7a6e)',
                  borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: '700', fontSize: '16px',
                  flexShrink: 0
                }}>
                  {selectedRecipient.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a2e', margin: 0 }}>
                    {selectedRecipient.fullName}
                  </p>
                  <p style={{ fontSize: '12px', color: '#888', margin: '2px 0 0' }}>
                    {selectedRecipient.country} · {selectedRecipient.bankAccount} · {selectedRecipient.ifscCode}
                  </p>
                  <p style={{ fontSize: '12px', color: '#0f4c81', fontWeight: '600', margin: '2px 0 0' }}>
                    {selectedRecipient.transferringTo}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* You Send */}
          <div style={{
            background: 'white', borderRadius: '20px',
            padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
              You Send
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              border: '2px solid #f0f0f0', borderRadius: '16px',
              padding: '16px 20px', marginTop: '8px',
            }}>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#0f4c81' }}>🇺🇸</span>
              <span style={{ fontWeight: '700', color: '#0f4c81', fontSize: '16px' }}>USD</span>
              <span style={{ color: '#ddd', fontSize: '20px' }}>|</span>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  border: 'none', outline: 'none', fontSize: '24px',
                  fontWeight: '800', color: '#1a1a2e', width: '100%',
                  fontFamily: 'Sora, sans-serif', background: 'transparent'
                }}
              />
            </div>
          </div>

          {/* Fee Info */}
          <div style={{
            background: 'white', borderRadius: '20px',
            padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: '#888' }}>Transfer Fee</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e' }}>- ${FLAT_FEE}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: '#888' }}>Exchange Rate</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e' }}>
                1 USD = {loading ? '...' : exchangeRate} {selectedCountry.code}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#888' }}>Estimated Delivery</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a7a6e' }}>
                ⚡ {selectedCountry.delivery}
              </span>
            </div>
          </div>

          {/* Swap Arrow */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #0f4c81, #1a7a6e)',
              borderRadius: '50%', padding: '10px 14px',
              fontSize: '20px'
            }}>
              ↕️
            </div>
          </div>

          {/* Recipient Gets */}
          <div style={{
            background: 'white', borderRadius: '20px',
            padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Recipient Gets
            </label>

            {/* Country Selector */}
            <div style={{
              border: '2px solid #f0f0f0', borderRadius: '16px',
              padding: '16px 20px', marginTop: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '22px' }}>{selectedCountry.flag}</span>
                <select
                  value={selectedCountry.code}
                  onChange={(e) => setSelectedCountry(countries.find(c => c.code === e.target.value))}
                  style={{
                    border: 'none', outline: 'none', fontSize: '16px',
                    fontWeight: '700', color: '#1a1a2e',
                    fontFamily: 'Sora, sans-serif', background: 'transparent',
                    cursor: 'pointer', width: '100%'
                  }}
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name} — {country.currency}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #0f4c81, #1a7a6e)',
                borderRadius: '12px', padding: '14px 18px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>They receive</span>
                <span style={{ color: 'white', fontWeight: '800', fontSize: '24px' }}>
                  {recipientGets} {selectedCountry.code}
                </span>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            style={{
              width: '100%', padding: '18px',
              background: 'linear-gradient(135deg, #0f4c81, #1a7a6e)',
              color: 'white', border: 'none', borderRadius: '16px',
              fontSize: '16px', fontWeight: '700', cursor: 'pointer',
              fontFamily: 'Sora, sans-serif', transition: 'transform 0.2s',
              letterSpacing: '0.5px', marginBottom: '32px'
            }}
            onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.target.style.transform = 'translateY(0)'}
          >
            Continue →
          </button>

        </div>
      </div>
    </div>
  );
}

export default SendMoney;