const express = require('express');
const router = express.Router();

// ─── EXCHANGE RATES ───────────────────────────────────────────
router.get('/rates', async (req, res) => {
  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=GBP,EUR,INR,AUD,CAD,SGD,AED');
    if (!response.ok) throw new Error('failed');
    const data = await response.json();
    return res.json({ rates: { ...data.rates, USD: 1 } });
  } catch {}
//   try {
//     const response = await fetch('https://open.er-api.com/v6/latest/USD');
//     if (!response.ok) throw new Error('failed');
//     const data = await response.json();
//     const { GBP, EUR, INR, AUD, CAD, SGD, AED } = data.rates;
//     return res.json({ rates: { GBP, EUR, INR, AUD, CAD, SGD, AED, USD: 1 } });
//   } catch {}
//   try {
//     const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
//     if (!response.ok) throw new Error('failed');
//     const data = await response.json();
//     const r = data.usd;
//     return res.json({ rates: { GBP: r.gbp, EUR: r.eur, INR: r.inr, AUD: r.aud, CAD: r.cad, SGD: r.sgd, AED: r.aed, USD: 1 } });
//   } catch {}
  // Final fallback
  res.json({ rates: { GBP: 0.79, EUR: 0.92, INR: 83.12, AUD: 1.53, CAD: 1.36, SGD: 1.34, AED: 3.67, USD: 1 }, cached: true });
});

// ─── IP LOCATION ──────────────────────────────────────────────
// router.get('/location', async (req, res) => {
//   try {
//     const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim();
    
//     // If no forwarded IP (local dev), call without IP — API auto-detects
//     const url = ip ? `https://freeipapi.com/api/json/${ip}` : 'https://freeipapi.com/api/json';
    
//     const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
//     if (!response.ok) throw new Error('failed');
//     const data = await response.json();
//     console.log('📍 Location detected:', data); // ← see full response
//     return res.json({ countryCode: data.countryCode });
//   } catch (err) {
//     console.error('❌ Location error:', err.message);
//   }
//   res.json({ countryCode: 'US' });
// });

router.get('/location', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim();
  
  // Try 1 — ipapi.co (no IP needed, auto-detects)
  try {
    const url = ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/';
    const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
    const data = await response.json();
    console.log('📍 ipapi.co result:', data.country_code);
    if (data.country_code) return res.json({ countryCode: data.country_code });
  } catch (err) {
    console.log('❌ ipapi.co failed:', err.message);
  }

  // Try 2 — ip-api.com
  try {
    const url = ip ? `http://ip-api.com/json/${ip}` : 'http://ip-api.com/json/';
    const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
    const data = await response.json();
    console.log('📍 ip-api.com result:', data.countryCode);
    if (data.countryCode) return res.json({ countryCode: data.countryCode });
  } catch (err) {
    console.log('❌ ip-api.com failed:', err.message);
  }

  // Try 3 — ipinfo.io
  try {
    const url = ip ? `https://ipinfo.io/${ip}/json` : 'https://ipinfo.io/json';
    const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
    const data = await response.json();
    console.log('📍 ipinfo.io result:', data.country);
    if (data.country) return res.json({ countryCode: data.country });
  } catch (err) {
    console.log('❌ ipinfo.io failed:', err.message);
  }

  console.log('⚠️ All location APIs failed, defaulting to US');
  res.json({ countryCode: 'US' });
});

module.exports = router;