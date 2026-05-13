import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock } from 'lucide-react';
import TacticalCard from '../components/TacticalCard';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userRole', 'user');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#030303' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4"
               style={{ background: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)', boxShadow: '0 0 40px rgba(0, 212, 255, 0.5)' }}>
            <Shield className="w-14 h-14 text-[#030303]" />
          </div>
          <h1 className="font-mono font-bold text-3xl mb-2" style={{ color: '#00D4FF' }}>AJ-FIT SYSTEM</h1>
        </div>
        <TacticalCard>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-mono text-xs mb-2 block" style={{ color: 'rgba(0, 212, 255, 0.8)' }}>USERNAME</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded font-mono text-sm"
                style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(0, 212, 255, 0.3)', color: '#00D4FF', outline: 'none' }} required />
            </div>
            <div>
              <label className="font-mono text-xs mb-2 block" style={{ color: 'rgba(0, 212, 255, 0.8)' }}>PASSWORD</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded font-mono text-sm"
                style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(0, 212, 255, 0.3)', color: '#00D4FF', outline: 'none' }} required />
            </div>
            <button type="submit" className="w-full py-4 rounded font-mono font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)', color: '#030303' }}>
              ACCESS SYSTEM
            </button>
          </form>
        </TacticalCard>
      </div>
    </div>
  );
}
