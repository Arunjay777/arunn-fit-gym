import React, { useState } from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Users, Activity, Database, Settings, TrendingUp, AlertCircle, Shield, UserPlus, UserMinus, Lock, User } from 'lucide-react';

export default function Admin() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'OVERVIEW', icon: Activity },
    { id: 'users', name: 'USERS', icon: Users },
    { id: 'system', name: 'SYSTEM', icon: Database },
    { id: 'settings', name: 'SETTINGS', icon: Settings },
  ];

  const systemStats = [
    { label: 'Total Users', value: '1,247', icon: Users, color: '#00D4FF', change: '+12%' },
    { label: 'Active Today', value: '342', icon: Activity, color: '#10B981', change: '+8%' },
    { label: 'Server Load', value: '34%', icon: Database, color: '#F59E0B', change: '-5%' },
    { label: 'Alerts', value: '3', icon: AlertCircle, color: '#FF3366', change: '-2' },
  ];

  const recentUsers = [
    { id: 1, name: 'John Smith', email: 'john@example.com', joined: '2 hours ago', status: 'active', role: 'member' },
    { id: 2, name: 'Sarah Williams', email: 'sarah@example.com', joined: '5 hours ago', status: 'active', role: 'member' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', joined: '1 day ago', status: 'inactive', role: 'premium' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', joined: '2 days ago', status: 'active', role: 'admin' },
    { id: 5, name: 'Chris Brown', email: 'chris@example.com', joined: '3 days ago', status: 'active', role: 'member' },
  ];

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'High memory usage detected on server 2', time: '10 min ago' },
    { id: 2, type: 'info', message: 'Database backup completed successfully', time: '1 hour ago' },
    { id: 3, type: 'error', message: 'Failed login attempts from IP 192.168.1.1', time: '2 hours ago' },
  ];

  const activityLog = [
    { id: 1, action: 'User registered', user: 'john@example.com', time: '2 hours ago' },
    { id: 2, action: 'Workout completed', user: 'sarah@example.com', time: '3 hours ago' },
    { id: 3, action: 'Profile updated', user: 'mike@example.com', time: '5 hours ago' },
    { id: 4, action: 'Subscription upgraded', user: 'emily@example.com', time: '1 day ago' },
    { id: 5, action: 'Password changed', user: 'chris@example.com', time: '2 days ago' },
  ];

  const roleColors = {
    admin: '#FF3366',
    premium: '#F59E0B',
    member: '#00D4FF',
  };

  const alertColors = {
    error: '#FF3366',
    warning: '#F59E0B',
    info: '#00D4FF',
  };

  return (
    <div className="min-h-screen p-8">
      <TacticalHeader title="ADMIN CONTROL" subtitle="SYSTEM MANAGEMENT DASHBOARD" />

      <div className="flex gap-3 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-6 py-3 rounded font-mono font-bold transition-all flex items-center gap-2 ${
                selectedTab === tab.id ? '' : 'hover:bg-[rgba(0,212,255,0.05)]'
              }`}
              style={{
                background: selectedTab === tab.id ? '#00D4FF' : 'transparent',
                color: selectedTab === tab.id ? '#030303' : '#00D4FF',
                border: `1px solid ${selectedTab === tab.id ? '#00D4FF' : 'rgba(0, 212, 255, 0.3)'}`,
              }}
            >
              <Icon className="w-5 h-5" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {selectedTab === 'overview' && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {systemStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <TacticalCard key={stat.label}>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    <span className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>
                      {stat.label}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="font-mono font-bold text-3xl" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="font-mono text-sm" style={{ color: stat.change.startsWith('+') ? '#10B981' : stat.change.startsWith('-') && stat.label === 'Alerts' ? '#10B981' : '#FF3366' }}>
                      {stat.change}
                    </div>
                  </div>
                </TacticalCard>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <TacticalCard>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5" style={{ color: '#00D4FF' }} />
                <div className="font-mono font-bold text-sm" style={{ color: '#00D4FF' }}>
                  SYSTEM ALERTS
                </div>
              </div>
              <div className="space-y-3">
                {systemAlerts.map((alert) => {
                  const color = alertColors[alert.type as keyof typeof alertColors];
                  return (
                    <div
                      key={alert.id}
                      className="p-3 rounded"
                      style={{ background: 'rgba(26, 26, 26, 0.6)', borderLeft: `3px solid ${color}` }}
                    >
                      <div className="font-mono text-sm mb-1" style={{ color }}>{alert.message}</div>
                      <div className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>{alert.time}</div>
                    </div>
                  );
                })}
              </div>
            </TacticalCard>

            <TacticalCard>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5" style={{ color: '#00D4FF' }} />
                <div className="font-mono font-bold text-sm" style={{ color: '#00D4FF' }}>
                  RECENT ACTIVITY
                </div>
              </div>
              <div className="space-y-3">
                {activityLog.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded flex items-center justify-between"
                    style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                  >
                    <div>
                      <div className="font-mono font-bold text-sm mb-1" style={{ color: '#00D4FF' }}>
                        {log.action}
                      </div>
                      <div className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>
                        {log.user}
                      </div>
                    </div>
                    <div className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>
                      {log.time}
                    </div>
                  </div>
                ))}
              </div>
            </TacticalCard>
          </div>
        </>
      )}

      {selectedTab === 'users' && (
        <TacticalCard>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" style={{ color: '#00D4FF' }} />
              <div className="font-mono font-bold text-lg" style={{ color: '#00D4FF' }}>
                USER MANAGEMENT
              </div>
            </div>
            <button
              className="px-4 py-2 rounded font-mono font-bold transition-all hover:opacity-90 flex items-center gap-2"
              style={{ background: '#10B981', color: '#030303' }}
            >
              <UserPlus className="w-4 h-4" />
              ADD USER
            </button>
          </div>

          <div className="space-y-2">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 rounded flex items-center justify-between transition-all hover:bg-[rgba(0,212,255,0.05)]"
                style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)' }}>
                    <User className="w-6 h-6 text-[#030303]" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-sm mb-1" style={{ color: '#00D4FF' }}>
                      {user.name}
                    </div>
                    <div className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="px-3 py-1 rounded font-mono text-xs uppercase"
                    style={{
                      background: `${roleColors[user.role as keyof typeof roleColors]}20`,
                      color: roleColors[user.role as keyof typeof roleColors],
                      border: `1px solid ${roleColors[user.role as keyof typeof roleColors]}40`
                    }}
                  >
                    {user.role}
                  </div>

                  <div
                    className={`w-3 h-3 rounded-full ${user.status === 'active' ? 'animate-pulse' : ''}`}
                    style={{ background: user.status === 'active' ? '#10B981' : '#888888' }}
                  />

                  <div className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)', width: '100px' }}>
                    {user.joined}
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="p-2 rounded transition-all hover:bg-[rgba(0,212,255,0.1)]"
                      style={{ border: '1px solid rgba(0, 212, 255, 0.3)' }}
                    >
                      <Lock className="w-4 h-4" style={{ color: '#00D4FF' }} />
                    </button>
                    <button
                      className="p-2 rounded transition-all hover:bg-[rgba(255,51,102,0.1)]"
                      style={{ border: '1px solid rgba(255, 51, 102, 0.3)' }}
                    >
                      <UserMinus className="w-4 h-4" style={{ color: '#FF3366' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TacticalCard>
      )}

      {selectedTab === 'system' && (
        <div className="grid grid-cols-2 gap-6">
          <TacticalCard>
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5" style={{ color: '#00D4FF' }} />
              <div className="font-mono font-bold text-sm" style={{ color: '#00D4FF' }}>
                DATABASE STATUS
              </div>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Users DB', size: '2.4 GB', status: 'healthy', uptime: '99.9%' },
                { name: 'Workouts DB', size: '5.8 GB', status: 'healthy', uptime: '99.8%' },
                { name: 'Analytics DB', size: '12.1 GB', status: 'warning', uptime: '98.2%' },
              ].map((db) => (
                <div
                  key={db.name}
                  className="p-4 rounded"
                  style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-mono font-bold text-sm" style={{ color: '#00D4FF' }}>{db.name}</div>
                    <div
                      className="px-2 py-1 rounded font-mono text-xs uppercase"
                      style={{
                        background: db.status === 'healthy' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: db.status === 'healthy' ? '#10B981' : '#F59E0B'
                      }}
                    >
                      {db.status}
                    </div>
                  </div>
                  <div className="flex items-center justify-between font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>
                    <span>Size: {db.size}</span>
                    <span>Uptime: {db.uptime}</span>
                  </div>
                </div>
              ))}
            </div>
          </TacticalCard>

          <TacticalCard>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5" style={{ color: '#00D4FF' }} />
              <div className="font-mono font-bold text-sm" style={{ color: '#00D4FF' }}>
                SERVER METRICS
              </div>
            </div>
            <div className="space-y-4">
              {[
                { metric: 'CPU Usage', value: 45, color: '#00D4FF' },
                { metric: 'Memory Usage', value: 68, color: '#F59E0B' },
                { metric: 'Disk Usage', value: 32, color: '#10B981' },
                { metric: 'Network I/O', value: 58, color: '#3B82F6' },
              ].map((metric) => (
                <div key={metric.metric}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-mono text-sm" style={{ color: '#00D4FF' }}>{metric.metric}</div>
                    <div className="font-mono font-bold text-sm" style={{ color: metric.color }}>{metric.value}%</div>
                  </div>
                  <div className="w-full h-2 rounded" style={{ background: 'rgba(26, 26, 26, 0.6)' }}>
                    <div
                      className="h-full rounded"
                      style={{ width: `${metric.value}%`, background: metric.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TacticalCard>
        </div>
      )}

      {selectedTab === 'settings' && (
        <TacticalCard>
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5" style={{ color: '#00D4FF' }} />
            <div className="font-mono font-bold text-lg" style={{ color: '#00D4FF' }}>
              SYSTEM SETTINGS
            </div>
          </div>

          <div className="space-y-6">
            {[
              { name: 'User Registration', description: 'Allow new users to register', enabled: true },
              { name: 'Email Notifications', description: 'Send system email notifications', enabled: true },
              { name: 'Maintenance Mode', description: 'Enable system maintenance mode', enabled: false },
              { name: 'API Access', description: 'Enable external API access', enabled: true },
              { name: 'Auto Backups', description: 'Automatic daily database backups', enabled: true },
              { name: 'Debug Mode', description: 'Enable detailed error logging', enabled: false },
            ].map((setting) => (
              <div
                key={setting.name}
                className="flex items-center justify-between p-4 rounded"
                style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
              >
                <div>
                  <div className="font-mono font-bold text-sm mb-1" style={{ color: '#00D4FF' }}>
                    {setting.name}
                  </div>
                  <div className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>
                    {setting.description}
                  </div>
                </div>
                <button
                  className={`relative w-14 h-7 rounded-full transition-all ${
                    setting.enabled ? 'bg-[#10B981]' : 'bg-[#888888]'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                      setting.enabled ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </TacticalCard>
      )}
    </div>
  );
}
