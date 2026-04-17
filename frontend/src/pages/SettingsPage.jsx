import React from 'react';
import { useTime } from '../context/TimeContext';
import { useAuth } from '../context/AuthContext';
import { Clock, Calendar, Search, LogOut, User } from 'lucide-react';

const SettingsPage = () => {
  const { hour, dow, daysGap, updateTimeState } = useTime();
  const { user, logout } = useAuth();

  const handleUseCurrentTime = () => {
    const now = new Date();
    updateTimeState({
      hour: now.getHours(),
      dow: now.getDay(), // Sunday = 0
    });
  };

  const getTimeLabel = (h) => {
    if (h >= 5 && h < 12) return 'Morning';
    if (h >= 12 && h < 17) return 'Afternoon';
    if (h >= 17 && h < 21) return 'Evening';
    return 'Night';
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-slate-50 pt-6 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Settings</h1>
        
        <div className="space-y-6">
          {/* Account Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Logged In As</h3>
                <p className="text-lg font-bold text-slate-800">{user?.username}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>

          {/* Time Context Simulator Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Time Context Simulator</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Adjust variables to test the LSTM time-aware predictions
                </p>
              </div>
              <button 
                onClick={handleUseCurrentTime}
                className="text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors"
              >
                Use current time
              </button>
            </div>

            <div className="space-y-8">
              {/* Hour Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-slate-700 flex items-center gap-2">
                    <Clock size={18} className="text-slate-400" />
                    Time of Day
                  </label>
                  <span className="font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full text-sm">
                    {hour}:00 ({getTimeLabel(hour)})
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="23" 
                  value={hour} 
                  onChange={(e) => updateTimeState({ hour: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                  <span>Midnight</span>
                  <span>Morning</span>
                  <span>Noon</span>
                  <span>Evening</span>
                </div>
              </div>

              {/* Day of Week Tabs */}
              <div>
                <label className="font-semibold text-slate-700 flex items-center gap-2 mb-3">
                  <Calendar size={18} className="text-slate-400" />
                  Day of the Week
                </label>
                <div className="flex gap-2">
                  {days.map((dayName, index) => (
                    <button
                      key={dayName}
                      onClick={() => updateTimeState({ dow: index })}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                        dow === index 
                          ? 'bg-emerald-500 text-white shadow-sm' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {dayName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Days Since Last Order */}
              <div>
                <label className="font-semibold text-slate-700 flex items-center gap-2 mb-2">
                  <Search size={18} className="text-slate-400" />
                  Days Since Prior Order
                </label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    value={daysGap} 
                    onChange={(e) => updateTimeState({ daysGap: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <span className="font-bold text-emerald-500 bg-emerald-50 px-4 py-2 rounded-lg min-w-[3rem] text-center">
                    {daysGap}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  1-7 represents frequent shoppers, 30 represents a monthly restock.
                </p>
              </div>

            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default SettingsPage;
