import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBalance, getLimits, logoutUser, clearAccessToken } from '../services/api';
import { getReferralStats, generateReferralCode } from '../services/api';
import AddMoneyModal from '../components/AddMoneyModal';
import AddRecipientModal from '../components/AddRecipientModal';
import ChatWidget from '../components/ChatWidget';
import DashboardDesktop from './DashboardDesktop';
import DashboardMobile from './DashboardMobile';

// ─── ANIMATIONS ──────────────────────────────────────────────
const styles = `
  @keyframes floatPulse { 0%,100%{opacity:0.3;transform:scale(1);}50%{opacity:0.6;transform:scale(1.1);} }
  @keyframes fadeInUp { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }
  @keyframes slideUp { from{opacity:0;transform:translateY(40px);}to{opacity:1;transform:translateY(0);} }
  .fade-in { animation: fadeInUp 0.5s ease forwards; }
  .slide-up { animation: slideUp 0.6s ease forwards; }
  .bottom-nav-safe { padding-bottom: env(safe-area-inset-bottom, 16px); }
`;

function Dashboard() {
  const navigate = useNavigate();
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [showAddRecipient, setShowAddRecipient] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [limits, setLimits] = useState({
    daily: { used: 0, limit: 5000, percentage: 0 },
    weekly: { used: 0, limit: 20000, percentage: 0 }
  });
  const [referral, setReferral] = useState({ referralCode: '', totalEarned: 0, totalReferrals: 0, bonusPerReferral: 25 });

  const fetchRates = async () => {
    try {
      const r = await fetch('https://open.er-api.com/v6/latest/USD', { signal: AbortSignal.timeout(5000) });
      if (!r.ok) throw new Error();
      const d = await r.json(); const { GBP, EUR, INR, AUD, CAD, SGD, AED } = d.rates;
      setRates({ GBP, EUR, INR, AUD, CAD, SGD, AED }); setLastUpdated(new Date().toLocaleTimeString()); setLoading(false); return;
    } catch {}
    setRates({ GBP:0.79, EUR:0.92, INR:83.12, AUD:1.53, CAD:1.36, SGD:1.34, AED:3.67 });
    setLastUpdated('Cached'); setLoading(false);
  };

  useEffect(() => { fetchRates(); const i = setInterval(fetchRates, 30000); return () => clearInterval(i); }, []);
  useEffect(() => {
    const fetchBalance = async () => {
      try { const r = await getBalance(); setUser(r.data.user); setBalance(r.data.user.balance); }
      catch (e) { if (e.response?.status === 401) navigate('/'); }
    };
    fetchBalance();
  }, [navigate]);
  useEffect(() => { const f = async () => { try { const r = await getLimits(); setLimits(r.data); } catch {} }; f(); }, []);

  const currencies = [
    {code:'GBP',name:'British Pound',flag:'🇬🇧'},{code:'EUR',name:'Euro',flag:'🇪🇺'},
    {code:'INR',name:'Indian Rupee',flag:'🇮🇳'},{code:'AUD',name:'Australian Dollar',flag:'🇦🇺'},
    {code:'CAD',name:'Canadian Dollar',flag:'🇨🇦'},{code:'SGD',name:'Singapore Dollar',flag:'🇸🇬'},
    {code:'AED',name:'UAE Dirham',flag:'🇦🇪'},
  ];

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        const r = await getReferralStats();
        if (!r.data.referralCode) {
          const gen = await generateReferralCode();
          setReferral({ ...r.data, referralCode: gen.data.referralCode });
        } else {
          setReferral(r.data);
        }
      } catch {}
    };
    fetchReferral();
  }, []);

  const sharedProps = { user, balance, limits, rates, loading, lastUpdated, currencies, navigate, setShowAddMoney, setShowAddRecipient, showProfile, setShowProfile, referral };

  return (
    <>
      <style>{styles}</style>

      {/* ── MOBILE ── */}
      <div className="block lg:hidden">
        <DashboardMobile {...sharedProps} />
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden lg:block">
        <DashboardDesktop {...sharedProps} />
      </div>

      {/* ── MODALS ── */}
      {showAddMoney && (
        <AddMoneyModal onClose={() => setShowAddMoney(false)}
          onSuccess={(amount) => { setBalance(prev => prev + amount); setShowAddMoney(false); alert(`✅ $${amount} added!`); }}/>
      )}
      {showAddRecipient && (
        <AddRecipientModal onClose={() => setShowAddRecipient(false)}
          onSuccess={(recipient) => { setShowAddRecipient(false); alert(`✅ ${recipient.fullName} added!`); }}/>
      )}

      {/* Chat widget */}
      <ChatWidget />
    </>
  );
}

export default Dashboard;