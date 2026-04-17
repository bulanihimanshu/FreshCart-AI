import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import toast, { Toaster } from 'react-hot-toast';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await api.login(username, password);
      login(userData);
      toast.success('Logged in successfully!');
      navigate('/shop');
    } catch (err) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Toaster position="bottom-center" />
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-semibold text-center text-slate-800 mb-6 flex items-center justify-center gap-2">
          <span className="text-emerald-500">FreshCart</span> AI
        </h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg text-sm text-slate-600 border border-slate-200">
          <p className="font-medium mb-2">Demo Users (pass: demo1234)</p>
          <ul className="list-disc list-inside space-y-1">
            <li>raj_sharma (Tier 3 - Rich history)</li>
            <li>priya_mehta (Tier 2 - Modest history)</li>
            <li>new_user_01 (Tier 1 - True cold start)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
