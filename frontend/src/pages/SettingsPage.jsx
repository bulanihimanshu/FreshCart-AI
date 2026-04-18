import React from 'react';
import { useTime } from '../context/TimeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const card = { background: 'white', border: '1px solid var(--border)', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', padding: '28px 32px', marginBottom: '20px' };

const SettingsPage = () => {
  const { hour, dow, daysGap, updateTimeState } = useTime();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const getTimeLabel = (h) => {
    if (h >= 5 && h < 12) return 'Morning';
    if (h >= 12 && h < 17) return 'Afternoon';
    if (h >= 17 && h < 21) return 'Evening';
    return 'Night';
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div style={{ background: 'var(--green-pale)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 20px 80px' }}>
        <h1 className="font-fraunces" style={{ fontSize: '34px', color: 'var(--text-primary)', marginBottom: '8px' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '36px', fontSize: '14px' }}>Manage your account and recommendation context</p>

        {/* Account */}
        <div style={card}>
          <h3 className="font-fraunces" style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--green-pale)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '26px', height: '26px', background: 'var(--green-dark)', color: 'white', borderRadius: '50%', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
            Account
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div style={{ width: '48px', height: '48px', background: 'var(--green-bright)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px', fontWeight: 600 }}>
                {(user?.display_name || user?.username || 'U').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px' }}>{user?.display_name || user?.username}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Tier {user?.tier} · {user?.tier === 3 ? 'LSTM Personalised' : user?.tier === 2 ? 'Aisle Affinity' : 'Cold Start'} · {user?.order_count} orders
                </p>
              </div>
            </div>
            <button onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, transition: 'all 0.18s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
              onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Time Context Simulator */}
        <div style={card}>
          <h3 className="font-fraunces" style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '26px', height: '26px', background: 'var(--green-dark)', color: 'white', borderRadius: '50%', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
            Time Context Simulator
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>
            Adjust variables to test LSTM time-aware recommendation predictions
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Hour */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>🕐 Time of Day</label>
                <span style={{ background: 'var(--green-light)', color: 'var(--green-dark)', padding: '3px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
                  {hour}:00 — {getTimeLabel(hour)}
                </span>
              </div>
              <input type="range" min="0" max="23" value={hour}
                onChange={e => updateTimeState({ hour: parseInt(e.target.value) })}
                style={{ width: '100%', height: '6px', cursor: 'pointer', accentColor: 'var(--green-dark)' }} />
              <div className="flex justify-between" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                <span>Midnight</span><span>Morning</span><span>Noon</span><span>Evening</span>
              </div>
            </div>

            {/* Day of week */}
            <div>
              <label style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px', display: 'block', marginBottom: '10px' }}>📅 Day of the Week</label>
              <div className="flex gap-2">
                {days.map((day, idx) => (
                  <button key={day} onClick={() => updateTimeState({ dow: idx })}
                    style={{ flex: 1, padding: '8px 4px', borderRadius: '10px', border: '1.5px solid', borderColor: dow === idx ? 'var(--green-dark)' : 'var(--border)', background: dow === idx ? 'var(--green-dark)' : 'white', color: dow === idx ? 'white' : 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.18s' }}>
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Days gap */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>📦 Days Since Prior Order</label>
                <span style={{ background: 'var(--amber-light)', color: '#92400e', padding: '3px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 700 }}>
                  {daysGap} days
                </span>
              </div>
              <input type="range" min="1" max="30" value={daysGap}
                onChange={e => updateTimeState({ daysGap: parseInt(e.target.value) })}
                style={{ width: '100%', height: '6px', cursor: 'pointer', accentColor: 'var(--green-dark)' }} />
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                1–7 = frequent shopper · 30 = monthly restock
              </p>
            </div>

            <button onClick={() => updateTimeState({ hour: new Date().getHours(), dow: new Date().getDay() })}
              style={{ alignSelf: 'flex-start', background: 'var(--green-pale)', border: '1.5px solid var(--border)', color: 'var(--green-dark)', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--green-light)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--green-pale)'}>
              Use current time
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
