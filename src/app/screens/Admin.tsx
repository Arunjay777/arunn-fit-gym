import React, { useState } from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { 
  Users, Activity, Shield, UserPlus, Trash2, Search, Plus, 
  Check, ShieldAlert, Award, UserCheck, Eye, EyeOff, Ban, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Athlete {
  id: number;
  name: string;
  email: string;
  joined: string;
  status: 'Active' | 'Suspended';
  role: 'Athlete' | 'Coach';
  injuryActive: boolean;
  focusWorkout: string;
}

interface ActivityLog {
  id: string;
  action: string;
  targetUser: string;
  performedBy: string;
  timestamp: string;
  severity: 'info' | 'warn' | 'critical';
}

export default function Admin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [logQuery, setLogQuery] = useState('');
  
  // Interactive roster of users under admin control
  const [athletes, setAthletes] = useState<Athlete[]>([
    { id: 1, name: 'John Smith', email: 'john@example.com', joined: '2 hours ago', status: 'Active', role: 'Athlete', injuryActive: false, focusWorkout: 'Hypertrophy Chest' },
    { id: 2, name: 'Sarah Williams', email: 'sarah@example.com', joined: '5 hours ago', status: 'Active', role: 'Athlete', injuryActive: true, focusWorkout: 'Mobility Lower Body' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', joined: '1 day ago', status: 'Suspended', role: 'Athlete', injuryActive: false, focusWorkout: 'Power Lifting Splits' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', joined: '2 days ago', status: 'Active', role: 'Coach', injuryActive: false, focusWorkout: 'All-Around Performance' },
    { id: 5, name: 'Chris Brown', email: 'chris@example.com', joined: '3 days ago', status: 'Active', role: 'Athlete', injuryActive: false, focusWorkout: 'Aerobic Endurance' },
  ]);

  // Read-only system activity log for security tracking
  const [logs, setLogs] = useState<ActivityLog[]>([
    { id: '1', action: 'Roster database initialized', targetUser: 'System', performedBy: 'Admin Node', timestamp: '2 hours ago', severity: 'info' },
    { id: '2', action: 'Assigned coach access level code', targetUser: 'emily@example.com', performedBy: 'Admin Console', timestamp: '1 hour ago', severity: 'info' },
    { id: '3', action: 'User suspended: Violation triggered', targetUser: 'mike@example.com', performedBy: 'Admin Console', timestamp: '45 mins ago', severity: 'warn' },
    { id: '4', action: 'Cleared active injury status', targetUser: 'john@example.com', performedBy: 'Admin Console', timestamp: '15 mins ago', severity: 'info' },
  ]);

  const [newAthleteName, setNewAthleteName] = useState('');
  const [newAthleteEmail, setNewAthleteEmail] = useState('');
  const [newAthleteFocus, setNewAthleteFocus] = useState('Hypertrophy Chest');
  const [newAthleteRole, setNewAthleteRole] = useState<'Athlete' | 'Coach'>('Athlete');

  // Add athlete to roster
  const handleAddAthlete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAthleteName.trim() || !newAthleteEmail.trim()) return;

    const newClient: Athlete = {
      id: Date.now(),
      name: newAthleteName,
      email: newAthleteEmail,
      joined: 'Just now',
      status: 'Active',
      role: newAthleteRole,
      injuryActive: false,
      focusWorkout: newAthleteFocus
    };

    setAthletes([newClient, ...athletes]);
    setNewAthleteName('');
    setNewAthleteEmail('');

    // Append to read-only security logs
    const logEntry: ActivityLog = {
      id: Date.now().toString(),
      action: `Created new ${newAthleteRole.toLowerCase()} account`,
      targetUser: newAthleteEmail,
      performedBy: 'Admin Console',
      timestamp: 'Just now',
      severity: 'info'
    };
    setLogs(prev => [logEntry, ...prev]);
  };

  // Delete user
  const handleDeleteAthlete = (id: number) => {
    const target = athletes.find(a => a.id === id);
    if (!target) return;

    setAthletes(athletes.filter(a => a.id !== id));

    // Append to read-only security logs
    const logEntry: ActivityLog = {
      id: Date.now().toString(),
      action: `Removed user roster entry (${target.role})`,
      targetUser: target.email,
      performedBy: 'Admin Console',
      timestamp: 'Just now',
      severity: 'critical'
    };
    setLogs(prev => [logEntry, ...prev]);
  };

  // Change user role (Athlete <-> Coach)
  const handleToggleRole = (id: number) => {
    const target = athletes.find(a => a.id === id);
    if (!target) return;

    const nextRole = target.role === 'Athlete' ? 'Coach' : 'Athlete';

    setAthletes(athletes.map(a => {
      if (a.id === id) {
        return { 
          ...a, 
          role: nextRole
        };
      }
      return a;
    }));

    // Append to read-only security logs
    const logEntry: ActivityLog = {
      id: Date.now().toString(),
      action: `Swapped role level to ${nextRole.toUpperCase()}`,
      targetUser: target.email,
      performedBy: 'Admin Console',
      timestamp: 'Just now',
      severity: 'info'
    };
    setLogs(prev => [logEntry, ...prev]);
  };

  // Suspend/Ban user toggle
  const handleToggleStatus = (id: number) => {
    const target = athletes.find(a => a.id === id);
    if (!target) return;

    const nextStatus = target.status === 'Active' ? 'Suspended' : 'Active';

    setAthletes(athletes.map(a => {
      if (a.id === id) {
        return { 
          ...a, 
          status: nextStatus
        };
      }
      return a;
    }));

    // Append to read-only security logs
    const logEntry: ActivityLog = {
      id: Date.now().toString(),
      action: nextStatus === 'Suspended' ? 'Suspended user account access' : 'Restored user account access',
      targetUser: target.email,
      performedBy: 'Admin Console',
      timestamp: 'Just now',
      severity: nextStatus === 'Suspended' ? 'warn' : 'info'
    };
    setLogs(prev => [logEntry, ...prev]);
  };

  // Toggle injury warnings
  const handleToggleInjury = (id: number) => {
    const target = athletes.find(a => a.id === id);
    if (!target) return;

    const nextState = !target.injuryActive;

    setAthletes(athletes.map(a => {
      if (a.id === id) {
        return { ...a, injuryActive: nextState };
      }
      return a;
    }));

    // Append to read-only security logs
    const logEntry: ActivityLog = {
      id: Date.now().toString(),
      action: nextState ? 'Flagged active user injury warning' : 'Cleared user injury warning flags',
      targetUser: target.email,
      performedBy: 'Admin Console',
      timestamp: 'Just now',
      severity: nextState ? 'warn' : 'info'
    };
    setLogs(prev => [logEntry, ...prev]);
  };

  const filteredAthletes = athletes.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.focusWorkout.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(logQuery.toLowerCase()) ||
    l.targetUser.toLowerCase().includes(logQuery.toLowerCase()) ||
    l.performedBy.toLowerCase().includes(logQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 lg:p-8" style={{ background: '#08080c' }}>
      <TacticalHeader 
        title="ADMIN PORTAL" 
        subtitle="USER COMMAND & CORE ATHLETE CONTROL" 
      />

      {/* Main Role Accent Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-400 text-black">
            <Shield className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold text-white uppercase">User Control active</h3>
            <p className="font-sans text-xs text-white/50">Modify clear access privileges, suspend violating accounts, and assign tactical coach permissions.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/30 font-mono text-[10px] text-emerald-400 font-bold uppercase select-none">
          SYSTEM ACTIVE
        </div>
      </div>

      {/* Direct Overview Numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <TacticalCard>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-[10px] text-white/50 uppercase">Total Users</span>
          </div>
          <div className="font-mono font-bold text-2xl text-white">{athletes.length}</div>
        </TacticalCard>

        <TacticalCard>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-[10px] text-white/50 uppercase">Active Coaches</span>
          </div>
          <div className="font-mono font-bold text-2xl text-cyan-400">
            {athletes.filter(a => a.role === 'Coach').length}
          </div>
        </TacticalCard>

        <TacticalCard>
          <div className="flex items-center gap-2 mb-1">
            <Ban className="w-4 h-4 text-amber-500" />
            <span className="font-mono text-[10px] text-white/50 uppercase">Suspended</span>
          </div>
          <div className="font-mono font-bold text-2xl text-amber-500">
            {athletes.filter(a => a.status === 'Suspended').length}
          </div>
        </TacticalCard>

        <TacticalCard>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span className="font-mono text-[10px] text-white/50 uppercase">Injury Warnings</span>
          </div>
          <div className="font-mono font-bold text-2xl text-rose-450 text-rose-400">
            {athletes.filter(a => a.injuryActive).length}
          </div>
        </TacticalCard>
      </div>

      {/* Control Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Search & Live Actions Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#111218] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
            <Search className="w-5 h-5 text-white/30" />
            <input
              id="athlete-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user by name, email, or targeted focus..."
              className="w-full bg-transparent text-sm text-white font-mono placeholder:text-white/20 outline-none"
            />
            {searchQuery && (
              <button 
                id="clear-search-btn"
                onClick={() => setSearchQuery('')}
                className="text-xs text-white/45 hover:text-white font-mono uppercase"
              >
                Clear
              </button>
            )}
          </div>

          {/* Clean User Cards */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredAthletes.map((athlete) => (
                <motion.div
                  key={athlete.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-2xl bg-[#111218] border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold leading-none">
                      {athlete.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-mono font-bold text-sm text-white">{athlete.name}</h4>
                        <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          athlete.role === 'Coach' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25' : 'bg-white/5 text-white/50'
                        }`}>
                          {athlete.role}
                        </span>
                        <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          athlete.status === 'Suspended' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/25' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                        }`}>
                          {athlete.status}
                        </span>
                      </div>
                      
                      <div className="font-mono text-[11px] text-white/40 mt-0.5">{athlete.email}</div>
                      
                      {/* Workout/Injury indicators */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-white/60">
                          🎯 Split: {athlete.focusWorkout}
                        </span>
                        {athlete.injuryActive && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/25 text-rose-450 text-rose-400 flex items-center gap-1 font-bold">
                            <ShieldAlert className="w-3 h-3" />
                            INJURED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Immediate Control Knobs */}
                  <div className="flex flex-wrap gap-2 items-center justify-end w-full md:w-auto">
                    {/* Role toggle */}
                    <button
                      onClick={() => handleToggleRole(athlete.id)}
                      className="px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase bg-white/5 text-white/70 hover:bg-white/10 transition-all border border-white/5 cursor-pointer"
                    >
                      Swap Role
                    </button>

                    {/* Suspend/Ban Toggle */}
                    <button
                      onClick={() => handleToggleStatus(athlete.id)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        athlete.status === 'Suspended'
                          ? 'bg-emerald-400 text-black hover:bg-emerald-350'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20'
                      }`}
                    >
                      {athlete.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                    </button>

                    {/* Injury status toggle */}
                    <button
                      onClick={() => handleToggleInjury(athlete.id)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        athlete.injuryActive
                          ? 'bg-rose-500 text-white hover:bg-rose-600'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                      }`}
                    >
                      Injury Status
                    </button>

                    {/* Hard Delete Roster */}
                    <button
                      onClick={() => handleDeleteAthlete(athlete.id)}
                      className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 transition-all cursor-pointer"
                      title="Remove Roster Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
              {filteredAthletes.length === 0 && (
                <div className="text-center py-12 text-white/30 font-mono text-xs uppercase border border-dashed border-white/10 rounded-2xl">
                  No roster users match the query.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Add User panel */}
        <div className="space-y-6">
          <TacticalCard>
            <div className="flex items-center gap-2 mb-4 text-white">
              <UserPlus className="w-5 h-5 text-emerald-400" />
              <div className="font-mono font-bold text-sm uppercase">PROVISE NEW USER</div>
            </div>

            <form onSubmit={handleAddAthlete} className="space-y-4">
              <p className="font-sans text-xs text-white/50 leading-relaxed">
                Add an athlete or coach to the secure database stack manually here.
              </p>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-white/40 uppercase block">FullName</label>
                <input
                  type="text"
                  required
                  value={newAthleteName}
                  onChange={(e) => setNewAthleteName(e.target.value)}
                  placeholder="e.g. Liam Sterling"
                  className="w-full bg-black/40 border border-white/10 text-white font-mono text-xs rounded-xl py-2.5 px-3 outline-none focus:border-emerald-400 placeholder:text-white/20 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-white/40 uppercase block">Email Address</label>
                <input
                  type="email"
                  required
                  value={newAthleteEmail}
                  onChange={(e) => setNewAthleteEmail(e.target.value)}
                  placeholder="e.g. liam@example.com"
                  className="w-full bg-black/40 border border-white/10 text-white font-mono text-xs rounded-xl py-2.5 px-3 outline-none focus:border-emerald-400 placeholder:text-white/20 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-white/40 uppercase block">Initial Target Split</label>
                <select
                  value={newAthleteFocus}
                  onChange={(e) => setNewAthleteFocus(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 text-white font-mono text-xs rounded-xl py-2.5 px-3 outline-none focus:border-emerald-400 transition-all cursor-pointer"
                >
                  <option value="Hypertrophy Chest">Hypertrophy Chest</option>
                  <option value="Heavy Power Splits">Heavy Power Splits</option>
                  <option value="Mobility Lower Body">Mobility Lower Body</option>
                  <option value="Aerobic Endurance">Aerobic Endurance</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-white/40 uppercase block">Database Role</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setNewAthleteRole('Athlete')}
                    className={`py-2 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer ${
                      newAthleteRole === 'Athlete' 
                        ? 'bg-emerald-400 text-black border-emerald-400' 
                        : 'bg-transparent text-white/50 border-white/10 hover:text-white'
                    }`}
                  >
                    ATHLETE
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAthleteRole('Coach')}
                    className={`py-2 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer ${
                      newAthleteRole === 'Coach' 
                        ? 'bg-cyan-400 text-black border-cyan-400' 
                        : 'bg-transparent text-white/50 border-white/10 hover:text-white'
                    }`}
                  >
                    COACH
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 font-mono text-xs font-bold text-black flex items-center justify-center gap-1.5 active:scale-95 transition-all mt-6 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                CREATE ACCOUNT
              </button>
            </form>
          </TacticalCard>
          
          <div className="p-4 rounded-2xl bg-[#111218] border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <AlertCircle className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs font-bold uppercase">Quick Admin Guidelines</span>
            </div>
            <p className="font-sans text-[11px] text-white/40 leading-relaxed">
              • Access control can override an user's login. If suspended, the user receives an operational gate next time they log in. <br />
              • Adding or swapping "Coach" role permits backend strategy creation across active schedules.
            </p>
          </div>
        </div>

      </div>

      {/* System Security Logger (Read-only Security Tracking) */}
      <div id="system-activity-log-section" className="mt-8">
        <TacticalCard glow>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">SYSTEM SECURITY LOGGER</h3>
                <p className="font-sans text-xs text-white/40">Read-only cryptographic operational auditable action records.</p>
              </div>
            </div>
            
            {/* Filter Log Input */}
            <div className="relative w-full md:w-72 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-white/30" />
              <input 
                type="text"
                placeholder="Filter logs by keyword/user..."
                value={logQuery}
                onChange={(e) => setLogQuery(e.target.value)}
                className="bg-transparent text-xs font-mono text-white placeholder:text-white/20 outline-none w-full"
              />
              {logQuery && (
                <button 
                  onClick={() => setLogQuery('')}
                  className="text-[10px] font-mono text-white/50 hover:text-white uppercase"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left font-mono text-xs select-none">
              <thead>
                <tr className="border-b border-white/5 text-white/40 uppercase text-[9px] tracking-wider">
                  <th className="py-2.5 px-4 font-normal">Timestamp</th>
                  <th className="py-2.5 px-4 font-normal">Action Event</th>
                  <th className="py-2.5 px-4 font-normal">Target User</th>
                  <th className="py-2.5 px-4 font-normal">Performed By</th>
                  <th className="py-2.5 px-4 text-right font-normal">Severity</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredLogs.map((log) => (
                    <motion.tr 
                      key={log.id}
                      layout
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-all"
                    >
                      <td className="py-3 px-4 text-white/50 whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-3 px-4 font-semibold text-white">{log.action}</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold whitespace-nowrap">{log.targetUser}</td>
                      <td className="py-3 px-4 text-white/60 whitespace-nowrap">{log.performedBy}</td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
                          log.severity === 'critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          log.severity === 'warn' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {log.severity}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-white/30 uppercase tracking-widest text-[10px]">
                        No auditable records matched the query filter.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[10px] text-white/30">
            <span>SHOWING {filteredLogs.length} OF {logs.length} AUDIT LOG ENTRIES</span>
            <span className="text-emerald-400 font-bold select-none flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              • SECURE READ ONLY REPLICA REGISTER
            </span>
          </div>
        </TacticalCard>
      </div>
    </div>
  );
}
