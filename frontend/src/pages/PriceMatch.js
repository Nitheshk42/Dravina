import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPriceMatchRates, verifyPriceMatch } from '../services/api';

const styles = `
  @keyframes fadeInUp { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }
  @keyframes spin { 0%{transform:rotate(0deg);}100%{transform:rotate(360deg);} }
  @keyframes slideIn { from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);} }
  .fade-in { animation: fadeInUp 0.5s ease forwards; }
  .slide-in { animation: slideIn 0.6s ease forwards; }
  .spin { animation: spin 1s linear infinite; }
  .upload-zone { transition: all 0.2s ease; }
  .upload-zone:hover { border-color: #6ee7b7 !important; background: rgba(110,231,183,0.05) !important; }
`;

const CURRENCIES = ['INR', 'PHP', 'MXN', 'GBP', 'EUR', 'CAD', 'AUD', 'SGD', 'AED', 'BDT', 'PKR', 'NGN'];

export default function PriceMatch() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState('form');
  const [liveRate, setLiveRate] = useState(null);
  const [promoActive, setPromoActive] = useState(false);
  const [formData, setFormData] = useState({ appName: '', amountSent: '', toCurrency: 'INR', competitorLink: '' });
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await getPriceMatchRates(formData.toCurrency);
        setLiveRate(res.data.liveRate);
        setPromoActive(res.data.promoActive || false);
      } catch (e) {}
    };
    fetchRate();
  }, [formData.toCurrency]);

  const handleScreenshot = (file) => {
    if (!file) return;
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleScreenshot(file);
  };

  const handleSubmit = async () => {
    if (!formData.appName || !formData.amountSent) {
      setError('Please enter app name and amount.');
      return;
    }
    if (!screenshot) {
      setError('Please upload a screenshot of the competitor rate. Links alone may not show your actual rate.');
      return;
    }
    setError(null);
    setStep('loading');
    try {
      const fd = new FormData();
      fd.append('appName', formData.appName);
      fd.append('amountSent', formData.amountSent);
      fd.append('toCurrency', formData.toCurrency);
      if (formData.competitorLink) fd.append('competitorLink', formData.competitorLink);
      fd.append('screenshot', screenshot);
      const res = await verifyPriceMatch(fd);
      setResult(res.data);
      setStep('result');
    } catch (e) {
      setError('Something went wrong. Please try again.');
      setStep('form');
    }
  };

  const reset = () => {
    setStep('form');
    setResult(null);
    setError(null);
    setScreenshot(null);
    setScreenshotPreview(null);
    setFormData({ appName: '', amountSent: '', toCurrency: 'INR', competitorLink: '' });
  };

  const isFeeCompetition = result?.competitionMode === 'fee_competition';
  const isPromo = result?.promoApplied === true;
  const youSave = result?.youSave || 0;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a1628 100%)', padding: '24px 16px', fontFamily: 'system-ui, sans-serif' }}>
      <style>{styles}</style>

      {/* Header */}
      <div className="fade-in" style={{ maxWidth: 640, margin: '0 auto 32px' }}>
        <button onClick={() => navigate('/dashboard')}
          style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#9ca3af', padding: '8px 16px', borderRadius: 12, cursor: 'pointer', fontSize: 14, marginBottom: 24 }}>
          ← Back to Dashboard
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>Price Match</h1>
          <p style={{ color: '#9ca3af', fontSize: 15, margin: 0 }}>Found a better rate? Show us — we'll beat it.</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
            {liveRate && (
              <div style={{ background: 'rgba(110,231,183,0.1)', border: '1px solid rgba(110,231,183,0.3)', borderRadius: 20, padding: '4px 14px' }}>
                <span style={{ color: '#6ee7b7', fontSize: 13 }}>Live: 1 USD = {liveRate} {formData.toCurrency}</span>
              </div>
            )}
            {promoActive && (
              <div style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', borderRadius: 20, padding: '4px 14px' }}>
                <span style={{ color: '#fbbf24', fontSize: 13 }}>🎉 Launch promo active!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FORM */}
      {step === 'form' && (
        <div className="fade-in" style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 28 }}>

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#9ca3af', fontSize: 13, display: 'block', marginBottom: 8 }}>Competitor App Name</label>
              <input type="text" placeholder="e.g. Wise, Remitly, PayPal..."
                value={formData.appName}
                onChange={e => setFormData({ ...formData, appName: e.target.value })}
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ color: '#9ca3af', fontSize: 13, display: 'block', marginBottom: 8 }}>Amount You're Sending</label>
                <input type="number" placeholder="e.g. 500"
                  value={formData.amountSent}
                  onChange={e => setFormData({ ...formData, amountSent: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ color: '#9ca3af', fontSize: 13, display: 'block', marginBottom: 8 }}>To Currency</label>
                <select value={formData.toCurrency}
                  onChange={e => setFormData({ ...formData, toCurrency: e.target.value })}
                  style={{ width: '100%', background: '#1a2535', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}>
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Screenshot — required */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#9ca3af', fontSize: 13, display: 'block', marginBottom: 8 }}>
                Screenshot of Competitor Rate <span style={{ color: '#f87171' }}>* required</span>
              </label>
              <div className="upload-zone"
                onDrop={handleDrop} onDragOver={e => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                style={{ border: `2px dashed ${screenshot ? 'rgba(110,231,183,0.4)' : 'rgba(255,255,255,0.15)'}`, borderRadius: 16, padding: 24, textAlign: 'center', cursor: 'pointer' }}>
                {screenshotPreview ? (
                  <div>
                    <img src={screenshotPreview} alt="Screenshot" style={{ maxHeight: 160, borderRadius: 8, maxWidth: '100%' }} />
                    <p style={{ color: '#6ee7b7', fontSize: 13, margin: '8px 0 0' }}>✅ {screenshot?.name}</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
                    <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>Drop screenshot here or click to upload</p>
                    <p style={{ color: '#4b5563', fontSize: 12, margin: '4px 0 0' }}>PNG, JPG supported</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => handleScreenshot(e.target.files[0])} />
              </div>
            </div>

            {/* Link — optional */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ color: '#9ca3af', fontSize: 13, display: 'block', marginBottom: 8 }}>
                Competitor Link <span style={{ color: '#4b5563' }}>(optional — screenshot is more accurate)</span>
              </label>
              <input type="url" placeholder="https://wise.com/..."
                value={formData.competitorLink}
                onChange={e => setFormData({ ...formData, competitorLink: e.target.value })}
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '10px 16px', marginBottom: 16 }}>
                <p style={{ color: '#f87171', fontSize: 14, margin: 0 }}>⚠️ {error}</p>
              </div>
            )}

            <button onClick={handleSubmit}
              style={{ width: '100%', background: 'linear-gradient(135deg, #6ee7b7, #3b82f6)', border: 'none', borderRadius: 14, padding: '14px', color: '#000', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              ⚡ Find Me a Better Rate
            </button>
          </div>
        </div>
      )}

      {/* LOADING */}
      {step === 'loading' && (
        <div style={{ maxWidth: 640, margin: '80px auto', textAlign: 'center' }}>
          <div className="spin" style={{ width: 48, height: 48, border: '3px solid rgba(110,231,183,0.2)', borderTop: '3px solid #6ee7b7', borderRadius: '50%', margin: '0 auto 24px' }} />
          <p style={{ color: '#9ca3af', fontSize: 16 }}>Analyzing competitor rate...</p>
          <p style={{ color: '#4b5563', fontSize: 13 }}>Running OCR · Fetching live rate · Calculating your savings</p>
        </div>
      )}

      {/* RESULT */}
      {step === 'result' && result && (
        <div className="slide-in" style={{ maxWidth: 640, margin: '0 auto' }}>

          {/* Google rate redirect */}
          {result.validationStatus === 'google_rate' && (
            <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <p style={{ color: '#fbbf24', fontSize: 17, fontWeight: 700, margin: '0 0 12px' }}>That's Google's mid-market rate</p>
              <p style={{ color: '#9ca3af', fontSize: 14, margin: '0 0 20px', lineHeight: 1.6 }}>{result.message}</p>
              <button onClick={reset}
                style={{ background: 'linear-gradient(135deg, #6ee7b7, #3b82f6)', border: 'none', borderRadius: 12, padding: '12px 28px', color: '#000', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
                Try Another Screenshot
              </button>
            </div>
          )}

          {/* Extraction failed */}
          {result.validationStatus === 'extraction_failed' && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>😕</div>
              <p style={{ color: '#f87171', fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>Could not extract rate</p>
              <p style={{ color: '#9ca3af', fontSize: 14, margin: '0 0 16px' }}>Please try a clearer screenshot showing the exchange rate.</p>
              <button onClick={reset} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, padding: '10px 20px', color: '#fff', cursor: 'pointer' }}>Try Again</button>
            </div>
          )}

          {/* Success */}
          {result.competitorRate && result.validationStatus !== 'google_rate' && (
            <>
              {/* Validation warning */}
              {result.warning && (
                <div style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 14, padding: '12px 16px', marginBottom: 16 }}>
                  <p style={{ color: '#fbbf24', fontSize: 14, margin: 0 }}>⚠️ {result.warning}</p>
                </div>
              )}

              {/* Promo banner */}
              {isPromo && (
                <div style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.35)', borderRadius: 14, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>🎉</span>
                  <div>
                    <p style={{ color: '#fbbf24', fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>Launch promo rate applied!</p>
                    <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>You're getting above mid-market rate — limited time only</p>
                  </div>
                </div>
              )}

              {/* Fee competition info banner */}
              {isFeeCompetition && !isPromo && (
                <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 14, padding: '12px 16px', marginBottom: 16 }}>
                  <p style={{ color: '#93c5fd', fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>
                    💡 {result.appName}'s rate is near mid-market
                  </p>
                  <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
                    Their rate looks competitive — but check their hidden fees. Draviṇa charges zero fees, no surprises.
                  </p>
                </div>
              )}

              {/* Dynamic savings banner */}
              <div style={{
                background: youSave > 0
                  ? 'linear-gradient(135deg, rgba(110,231,183,0.15), rgba(59,130,246,0.15))'
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${youSave > 0 ? 'rgba(110,231,183,0.3)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 20, padding: 24, textAlign: 'center', marginBottom: 16
              }}>
                {youSave > 0 ? (
                  <>
                    <p style={{ color: '#9ca3af', fontSize: 13, margin: '0 0 4px' }}>You save with Draviṇa</p>
                    <p style={{ color: '#6ee7b7', fontSize: 40, fontWeight: 800, margin: '0 0 4px' }}>
                      +{Math.round(youSave).toLocaleString()} {result.toCurrency}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>vs {result.appName} · Zero fees</p>
                  </>
                ) : (
                  <>
                    <p style={{ color: '#9ca3af', fontSize: 13, margin: '0 0 4px' }}>You receive with Draviṇa</p>
                    <p style={{ color: '#fff', fontSize: 40, fontWeight: 800, margin: '0 0 4px' }}>
                      {Math.round(result.dravinaReceives).toLocaleString()} {result.toCurrency}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>Zero fees · No hidden charges</p>
                  </>
                )}
              </div>

              {/* Comparison table */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '12px 20px', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: '#6b7280', fontSize: 12 }}>Provider</span>
                  <span style={{ color: '#6b7280', fontSize: 12, textAlign: 'center' }}>Rate</span>
                  <span style={{ color: '#6b7280', fontSize: 12, textAlign: 'right' }}>You Receive</span>
                </div>
                {/* Draviṇa */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '16px 20px', background: 'rgba(110,231,183,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: '#6ee7b7', fontSize: 15, fontWeight: 700 }}>🌍 Draviṇa</span>
                    <span style={{ display: 'block', color: '#6b7280', fontSize: 11 }}>
                      {isPromo ? '🎉 Promo rate · $0 fee' : '$0 fee · No hidden charges'}
                    </span>
                  </div>
                  <span style={{ color: '#fff', fontSize: 14, textAlign: 'center' }}>{result.dravinaRate?.toFixed(4)}</span>
                  <span style={{ color: '#6ee7b7', fontSize: 15, fontWeight: 700, textAlign: 'right' }}>
                    {Math.round(result.dravinaReceives).toLocaleString()} {result.toCurrency}
                  </span>
                </div>
                {/* Competitor */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '16px 20px', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: '#9ca3af', fontSize: 15, fontWeight: 600 }}>📱 {result.appName}</span>
                    <span style={{ display: 'block', color: '#6b7280', fontSize: 11 }}>
                      {isFeeCompetition ? 'May have hidden fees' : 'Fee may apply'}
                    </span>
                  </div>
                  <span style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center' }}>{result.competitorRate?.toFixed(4)}</span>
                  <span style={{ color: '#9ca3af', fontSize: 15, textAlign: 'right' }}>
                    {Math.round(result.competitorReceives).toLocaleString()} {result.toCurrency}
                  </span>
                </div>
              </div>

              {/* Mid-market reference */}
              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '12px 16px', marginBottom: 20 }}>
                <span style={{ color: '#6b7280', fontSize: 13 }}>Mid-market rate</span>
                <span style={{ color: '#9ca3af', fontSize: 13 }}>1 USD = {result.liveRate} {result.toCurrency}</span>
              </div>

              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <span style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: '4px 12px', color: '#6b7280', fontSize: 12 }}>
                  Rate verified via {result.extractionMethod?.replace('_', ' ')}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <button onClick={() => navigate('/send')}
                  style={{ background: 'linear-gradient(135deg, #6ee7b7, #3b82f6)', border: 'none', borderRadius: 14, padding: '14px', color: '#000', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                  Send with Draviṇa ✈️
                </button>
                <button onClick={reset}
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '14px', color: '#fff', fontSize: 15, cursor: 'pointer' }}>
                  Try Another
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}