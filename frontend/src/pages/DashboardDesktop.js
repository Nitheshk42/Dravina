import { useState } from 'react';
import { FaUserCircle, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { logoutUser, clearAccessToken } from '../services/api';

// ─── CIRCLE PROGRESS ─────────────────────────────────────────
const CircleProgress = ({ percentage, color, size = 60 }) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className="flex-shrink-0">
      <circle cx="30" cy="30" r={radius} fill="none" stroke="#f0f0f0" strokeWidth="5" />
      <circle cx="30" cy="30" r={radius} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
        strokeLinecap="round" transform="rotate(-90 30 30)"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}/>
    </svg>
  );
};

// ─── REFERRAL BANNER ──────────────────────────────────────────
const ReferralBanner = ({ referral }) => {
  const [copied, setCopied] = useState(false);
  
  if (!referral || !referral.referralCode) return null;
  
  const referralLink = `${window.location.origin}/#/signup?ref=${referral.referralCode.trim()}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '🌍 Join Draviṇa!',
          url: referralLink,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-2xl p-5 mb-3"
      style={{background:'linear-gradient(135deg, #0f4c81 0%, #1a7a6e 100%)', boxShadow:'0 8px 32px rgba(15,76,129,0.3)'}}>
      <div className="flex items-center gap-2 mb-2">
        <span style={{fontSize:'20px'}}>🎁</span>
        <p className="font-extrabold text-white m-0 text-base">Refer & Earn $25!</p>
      </div>
      <p className="text-xs m-0 mb-3" style={{color:'rgba(255,255,255,0.7)'}}>
        Share your code and both you and your friend get <strong style={{color:'#4ecdc4'}}>$25 bonus</strong>!
      </p>
      <button onClick={handleShare}
        className="w-full rounded-xl py-2.5 font-bold text-sm border-none cursor-pointer transition-all duration-200"
        style={{background:'white', color:'#0f4c81'}}>
        🚀 Invite Friend
      </button>
    </div>
  );
};

// ─── PRICE PULSE ──────────────────────────────────────────────
const PricePulse = ({ rates, currencies, lastUpdated, loading }) => {
  const sparkData = currencies.slice(0, 5).map(c => ({
    code: c.code, flag: c.flag, name: c.name, rate: rates[c.code] || 0,
    trend: Array.from({length: 7}, (_, i) => ({
      value: (rates[c.code] || 1) * (1 + (Math.sin(i + c.code.charCodeAt(0)) * 0.02))
    }))
  }));
  return (
    <div className="bg-white rounded-3xl p-7" style={{boxShadow:'0 4px 20px rgba(0,0,0,0.06)'}}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-extrabold text-xl m-0" style={{color:'#1a1a2e'}}>📈 Price Pulse</h3>
          <p className="text-sm mt-1 m-0" style={{color:'#888'}}>7-day rate trends vs USD</p>
        </div>
        <div className="flex items-center gap-2 rounded-full px-3 py-1.5" style={{background:'#f0f7ff'}}>
          <span className="w-2 h-2 rounded-full" style={{background:'#0f4c81'}}/>
          <span className="text-xs font-semibold" style={{color:'#0f4c81'}}>Live Data</span>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-32"><p style={{color:'#aaa'}}>Fetching rates...</p></div>
      ) : (
        <div style={{overflowX:'auto', paddingBottom:'8px'}}>
          <div style={{display:'flex', gap:'16px', minWidth:'max-content'}}>
            {sparkData.map(item => {
              const min = Math.min(...item.trend.map(t => t.value));
              const max = Math.max(...item.trend.map(t => t.value));
              const isUp = item.trend[6].value >= item.trend[0].value;
              const points = item.trend.map((t, i) => {
                const x = (i / 6) * 140;
                const y = 40 - ((t.value - min) / (max - min || 1)) * 35;
                return `${x},${y}`;
              }).join(' ');
              return (
                <div key={item.code} className="rounded-2xl p-4 flex-shrink-0"
                  style={{background:'#f7f8fc', border:'1.5px solid #f0f0f0', width:'180px'}}>
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{fontSize:'20px'}}>{item.flag}</span>
                    <div>
                      <p className="font-bold text-sm m-0" style={{color:'#1a1a2e'}}>{item.code}</p>
                      <p className="text-xs m-0" style={{color:'#aaa'}}>{item.name}</p>
                    </div>
                  </div>
                  <svg width="148" height="45" style={{overflow:'visible'}}>
                    <polyline points={points} fill="none" stroke={isUp ? '#1a7a6e' : '#e74c3c'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx={(6/6)*140} cy={40 - ((item.trend[6].value - min) / (max - min || 1)) * 35} r="3" fill={isUp ? '#1a7a6e' : '#e74c3c'}/>
                  </svg>
                  <div className="flex justify-between items-center mt-1">
                    <p className="font-extrabold text-base m-0" style={{color:'#0f4c81'}}>{item.rate.toFixed(4)}</p>
                    <p className="text-xs font-semibold m-0" style={{color: isUp ? '#1a7a6e' : '#e74c3c'}}>
                      {isUp ? '↑' : '↓'} {((Math.abs(item.trend[6].value - item.trend[0].value) / item.trend[0].value) * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {!loading && <p className="text-xs text-center mt-4 m-0" style={{color:'#bbb'}}>🕐 {lastUpdated} · Auto-refreshes every 30s</p>}
    </div>
  );
};

// ─── PRICE MATCH TEASER ───────────────────────────────────────
const PriceMatchTeaser = ({ navigate }) => (
  <div className="rounded-3xl p-7 cursor-pointer"
    onClick={() => navigate('/pricematch')}
    style={{background:'linear-gradient(135deg, #0f4c81 0%, #1a7a6e 100%)', boxShadow:'0 8px 32px rgba(15,76,129,0.25)'}}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-extrabold text-xl m-0 text-white">⚡ Price Match</h3>
        <p className="text-sm mt-2 m-0" style={{color:'rgba(255,255,255,0.75)'}}>Found a better rate somewhere else?</p>
        <p className="text-sm m-0" style={{color:'rgba(255,255,255,0.75)'}}>Show us — we'll beat it, guaranteed.</p>
      </div>
      <div className="rounded-2xl px-5 py-3 flex-shrink-0 ml-4"
        style={{background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)'}}>
        <p className="font-bold text-base m-0 text-white">Beat My Rate →</p>
      </div>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════
// DESKTOP DASHBOARD
// ══════════════════════════════════════════════════════════════
const DashboardDesktop = ({ user, balance, limits, rates, loading, lastUpdated, currencies, navigate, setShowAddMoney, setShowAddRecipient, showProfile, setShowProfile, referral }) => (
  <div className="min-h-screen" style={{background:'#f7f8fc'}}>

    {/* Header */}
    <div className="relative overflow-visible" style={{background:'linear-gradient(135deg, #0f4c81 0%, #1a7a6e 100%)'}}>
      <div className="absolute inset-0 opacity-10"
        style={{backgroundImage:`radial-gradient(circle at 20% 50%, white 1px, transparent 1px)`, backgroundSize:'60px 60px'}}/>
      <div className="px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-extrabold text-white m-0" style={{letterSpacing:'-0.5px'}}>🌍 Draviṇa</p>
            <p className="text-xs mt-1 m-0" style={{color:'rgba(255,255,255,0.7)'}}>Welcome back 👋</p>
            <h1 className="text-xl font-bold text-white mt-0.5 m-0">{user?.fullName || user?.name || 'Loading...'}</h1>
          </div>
          <div className="relative z-[9999]">
            <button onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 rounded-full px-4 py-2 border-none cursor-pointer hover:bg-white/25 transition-all"
              style={{background:'rgba(255,255,255,0.15)', border:'2px solid rgba(255,255,255,0.3)', backdropFilter:'blur(10px)'}}>
              <FaUserCircle size={24} color="white" />
              <span className="text-white font-semibold text-sm">Profile</span>
            </button>
            {showProfile && (
              <div className="absolute right-0 top-14 w-80 bg-white rounded-2xl p-6 z-50"
                style={{boxShadow:'0 20px 60px rgba(0,0,0,0.15)'}}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="rounded-full p-2.5" style={{background:'linear-gradient(135deg, #0f4c81, #1a7a6e)'}}>
                    <FaUserCircle size={32} color="white"/>
                  </div>
                  <div>
                    <p className="font-bold text-base m-0" style={{color:'#1a1a2e'}}>{user?.fullName || user?.name || '...'}</p>
                    <p className="text-sm m-0" style={{color:'#888'}}>{user?.email || '...'}</p>
                  </div>
                </div>
                <hr className="mb-4" style={{borderColor:'#f0f0f0'}}/>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{color:'#888'}}>Transfer Limits</p>
                <div className="rounded-2xl p-4 mb-3" style={{background:'#f0f7ff'}}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs m-0" style={{color:'#888'}}>Daily Limit</p>
                      <p className="font-bold text-lg m-0" style={{color:'#0f4c81'}}>${limits.daily.used.toFixed(2)}</p>
                      <p className="text-xs m-0" style={{color:'#aaa'}}>of ${limits.daily.limit.toLocaleString()} used</p>
                    </div>
                    <CircleProgress percentage={limits.daily.percentage} color="#0f4c81"/>
                  </div>
                </div>
                <div className="rounded-2xl p-4 mb-4" style={{background:'#f0fff8'}}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs m-0" style={{color:'#888'}}>Weekly Limit</p>
                      <p className="font-bold text-lg m-0" style={{color:'#1a7a6e'}}>${limits.weekly.used.toFixed(2)}</p>
                      <p className="text-xs m-0" style={{color:'#aaa'}}>of ${limits.weekly.limit.toLocaleString()} used</p>
                    </div>
                    <CircleProgress percentage={limits.weekly.percentage} color="#1a7a6e"/>
                  </div>
                </div>
                <button onClick={() => { setShowProfile(false); navigate('/accounts'); }}
                  className="w-full py-2.5 rounded-xl font-bold text-sm border-none cursor-pointer mb-2 bg-teal-500/10 text-teal-400">
                  🏦 Manage Bank Accounts
                </button>
                <button onClick={async () => { await logoutUser(); clearAccessToken(); localStorage.removeItem('user'); navigate('/'); }}
                  className="w-full py-3 rounded-xl font-bold text-sm border-none cursor-pointer hover:opacity-80 transition-all"
                  style={{background:'#fff0f0', color:'#e74c3c', fontFamily:"'Sora', sans-serif"}}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="px-8 py-8">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 flex flex-col gap-5">
          {/* Balance */}
          <div className="rounded-3xl p-7 relative overflow-hidden" style={{background:'linear-gradient(135deg, #0f4c81 0%, #1a7a6e 100%)'}}>
            <div className="absolute -top-5 -right-5 w-28 h-28 rounded-full" style={{background:'rgba(255,255,255,0.08)'}}/>
            <p className="text-xs font-medium m-0" style={{color:'rgba(255,255,255,0.7)'}}>Total Balance</p>
            <h2 className="font-extrabold text-white my-2 m-0" style={{fontSize:'42px', letterSpacing:'-1px'}}>${balance.toFixed(2)}</h2>
            <p className="text-xs m-0" style={{color:'rgba(255,255,255,0.6)'}}>🇺🇸 United States Dollar</p>
            <div className="inline-block mt-5 px-4 py-2 rounded-xl" style={{background:'rgba(255,255,255,0.15)'}}>
              <span className="text-white text-xs font-semibold">● Account Active</span>
            </div>
          </div>
          {/* Limits */}
          <div className="bg-white rounded-3xl p-6" style={{boxShadow:'0 4px 20px rgba(0,0,0,0.06)'}}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{color:'#888'}}>Transfer Limits</p>
            <div className="flex justify-between items-center mb-4">
              <div><p className="text-sm m-0" style={{color:'#888'}}>Daily</p><p className="font-bold text-xl m-0" style={{color:'#0f4c81'}}>${limits.daily.used.toFixed(2)} <span className="text-sm font-normal" style={{color:'#aaa'}}>/ ${limits.daily.limit.toLocaleString()}</span></p></div>
              <CircleProgress percentage={limits.daily.percentage} color="#0f4c81"/>
            </div>
            <hr style={{borderColor:'#f5f5f5', marginBottom:'16px'}}/>
            <div className="flex justify-between items-center">
              <div><p className="text-sm m-0" style={{color:'#888'}}>Weekly</p><p className="font-bold text-xl m-0" style={{color:'#1a7a6e'}}>${limits.weekly.used.toFixed(2)} <span className="text-sm font-normal" style={{color:'#aaa'}}>/ ${limits.weekly.limit.toLocaleString()}</span></p></div>
              <CircleProgress percentage={limits.weekly.percentage} color="#1a7a6e"/>
            </div>
          </div>
          <ReferralBanner referral={referral} />
          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => navigate('/send')} className="py-4 rounded-2xl text-white font-bold text-sm border-none cursor-pointer hover:-translate-y-0.5 transition-all" style={{background:'linear-gradient(135deg, #0f4c81, #1a7a6e)', fontFamily:"'Sora', sans-serif"}}>💸 Send Money</button>
            <button onClick={() => navigate('/history')} className="py-4 rounded-2xl font-bold text-sm cursor-pointer hover:-translate-y-0.5 transition-all" style={{background:'white', color:'#0f4c81', border:'2px solid #0f4c81', fontFamily:"'Sora', sans-serif"}}>📋 History</button>
          </div>
          <button onClick={() => setShowAddMoney(true)} className="w-full py-4 rounded-2xl text-white font-bold text-sm border-none cursor-pointer hover:-translate-y-0.5 transition-all" style={{background:'linear-gradient(135deg, #1a7a6e, #0f4c81)', fontFamily:"'Sora', sans-serif"}}>💰 Add Money</button>
          <div className="bg-white rounded-2xl p-5 flex justify-between items-center" style={{boxShadow:'0 4px 20px rgba(0,0,0,0.06)'}}>
            <div>
              <p className="font-bold text-base m-0" style={{color:'#1a1a2e'}}>👥 Recipients</p>
              <p onClick={() => navigate('/recipients')} className="text-sm mt-1 m-0 cursor-pointer underline font-medium" style={{color:'#0f4c81'}}>View all →</p>
            </div>
            <button onClick={() => setShowAddRecipient(true)} className="px-4 py-2.5 rounded-xl text-white font-semibold text-sm border-none cursor-pointer" style={{background:'linear-gradient(135deg, #0f4c81, #1a7a6e)', fontFamily:"'Sora', sans-serif"}}>+ Add</button>
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-6">
          <PricePulse rates={rates} currencies={currencies} lastUpdated={lastUpdated} loading={loading} />
          <PriceMatchTeaser navigate={navigate} />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 bg-white rounded-3xl px-8 py-6 flex flex-wrap justify-between items-center gap-4" style={{boxShadow:'0 4px 20px rgba(0,0,0,0.06)'}}>
        <div><p className="font-bold text-base m-0" style={{color:'#1a1a2e'}}>🌍 Draviṇa</p><p className="text-sm mt-1 m-0" style={{color:'#888'}}>Send money globally, effortlessly.</p></div>
        <div className="text-center"><p className="text-sm m-0" style={{color:'#888'}}>Write to us</p><p className="font-semibold text-sm m-0" style={{color:'#0f4c81'}}>support@crobo.com</p></div>
        <div className="text-center">
          <p className="text-sm m-0 text-gray-400">Help Center</p>
          <p onClick={() => navigate('/faq')}
            className="font-semibold text-sm m-0 cursor-pointer hover:underline text-blue-700">
            ❓ FAQ →
          </p>
        </div>
        <div className="flex items-center gap-5">
          <FaLinkedin size={24} style={{color:'#0077b5', cursor:'pointer'}} onClick={() => window.open('#', '_blank')}/>
          <FaTwitter size={24} style={{color:'#1da1f2', cursor:'pointer'}} onClick={() => window.open('#', '_blank')}/>
          <FaInstagram size={24} style={{color:'#e1306c', cursor:'pointer'}} onClick={() => window.open('#', '_blank')}/>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardDesktop;