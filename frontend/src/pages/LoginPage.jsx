import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import toast from 'react-hot-toast';

const DEMO_USERS = [
  { username: 'raj_sharma',  tier: 3, label: 'LSTM · 18 orders',    emoji: '🏆' },
  { username: 'neha_gupta', tier: 2, label: 'Aisle affinity · 2 orders', emoji: '⭐' },
  { username: 'new_user_01', tier: 1, label: 'Cold start · 0 orders', emoji: '👋' },
];

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const userData = await api.login(username, password);
      login(userData);
      toast.success(`Welcome back, ${userData.display_name || userData.username}!`);
      navigate('/shop');
    } catch {
      toast.error('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: '12px 16px',
    border: '1.5px solid var(--border)',
    borderRadius: '14px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    color: 'var(--text-primary)',
    background: 'var(--green-pale)',
    outline: 'none',
    width: '100%',
    transition: 'all 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--green-dark)', display: 'flex', alignItems: 'stretch' }}>

      {/* ── LEFT PANEL ── */}
      <div style={{ flex: 1, background: 'linear-gradient(160deg, #0a2e14 0%, #1a5c32 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden' }}
        className="hidden md:flex">
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(45,138,80,0.2) 0%, transparent 65%)', borderRadius: '50%' }} />

        <img src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&auto=format&fit=crop"
          alt="Fresh grocery" style={{ width: '100%', maxWidth: '360px', height: '280px', borderRadius: '20px', objectFit: 'cover', marginBottom: '32px', boxShadow: 'var(--shadow-lg)' }} />

        <h2 className="font-fraunces" style={{ color: 'white', fontSize: '32px', marginBottom: '12px' }}>
          Your daily <em style={{ color: '#6dd98c', fontStyle: 'italic' }}>fresh essentials</em>
        </h2>
        <p style={{ color: '#8aaa97', fontSize: '15px', lineHeight: 1.7, maxWidth: '340px' }}>
          Join thousands of happy customers who get farm-fresh groceries with AI-powered personalised recommendations.
        </p>

        <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[['🚚', 'Free delivery on orders above ₹499'], ['🤖', 'LSTM-powered personalised recommendations'], ['📦', 'Track orders in real time'], ['🔄', 'Easy refunds & 24hr freshness promise']].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#a8ccb5', fontSize: '14px' }}>
              <div style={{ width: '32px', height: '32px', background: 'rgba(45,138,80,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>{icon}</div>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ width: '480px', background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px' }} className="w-full md:w-[480px]">

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--green-bright)', borderRadius: '50% 50% 50% 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>🌿</div>
          <span className="font-fraunces" style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)' }}>FreshKart</span>
          <span style={{ color: 'var(--green-bright)', fontSize: '13px', fontWeight: 600, background: 'var(--green-light)', padding: '2px 8px', borderRadius: '10px' }}>AI</span>
        </div>

        <h3 className="font-fraunces" style={{ fontSize: '26px', color: 'var(--text-primary)', marginBottom: '6px' }}>Sign in</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>Enter your credentials to continue</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.2px' }}>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username" style={inputStyle} required
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--green-bright)'; e.currentTarget.style.background = 'white'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--green-pale)'; }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password" style={{ ...inputStyle, paddingRight: '44px' }} required
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--green-bright)'; e.currentTarget.style.background = 'white'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--green-pale)'; }} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px' }}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ background: 'var(--green-dark)', color: 'white', border: 'none', padding: '14px', borderRadius: '14px', fontFamily: "'Fraunces', serif", fontSize: '17px', fontWeight: 600, cursor: 'pointer', marginTop: '4px', transition: 'all 0.2s', opacity: loading ? 0.6 : 1 }}
            onMouseEnter={e => !loading && (e.currentTarget.style.background = 'var(--green-mid)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--green-dark)')}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        {/* Demo users */}
        <div style={{ marginTop: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 16px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            Quick demo login
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {DEMO_USERS.map(u => (
              <button key={u.username} onClick={() => { setUsername(u.username); setPassword('demo1234'); }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '12px', background: 'var(--green-pale)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green-bright)'; e.currentTarget.style.background = 'var(--green-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--green-pale)'; }}>
                <span style={{ fontSize: '20px' }}>{u.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{u.username}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tier {u.tier} · {u.label}</p>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>→</span>
              </button>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
            Password for all: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-secondary)' }}>demo1234</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
