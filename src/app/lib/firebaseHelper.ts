import { auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: any;
  }
}

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  joined: string;
  status: 'Active' | 'Suspended';
  injuryActive: boolean;
  focusWorkout: string;
}

// Convert plain Username to safe military division email mockup
export function usernameToEmail(u: string): string {
  const safe = u.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  return `${safe}@simatsfitx.com`;
}

// Register User (utilizes fully standard Local Storage auth and rosters)
export async function registerFirebaseUser(
  usernameStr: string, 
  passwordStr: string, 
  roleVal: 'user' | 'admin'
): Promise<UserProfile> {
  const email = usernameToEmail(usernameStr);
  
  // Custom professional UX delay to simulate neural network buffer
  await new Promise(resolve => setTimeout(resolve, 800));

  // Load existing local rosters
  const rosterStr = localStorage.getItem('fitx_local_roster');
  let roster: UserProfile[] = [];
  if (rosterStr) {
    try {
      roster = JSON.parse(rosterStr);
    } catch {
      roster = [];
    }
  }

  // Double check and populate default system athletes for a seamless roster
  if (roster.length === 0) {
    roster = [
      {
        uid: 'operator_aj_local',
        username: 'operator_aj',
        email: 'operator_aj@simatsfitx.com',
        role: 'user',
        joined: 'May 10, 2026',
        status: 'Active',
        injuryActive: false,
        focusWorkout: 'Hypertrophy Chest'
      },
      {
        uid: 'commander_prime_local',
        username: 'commander_prime',
        email: 'commander_prime@simatsfitx.com',
        role: 'admin',
        joined: 'May 01, 2026',
        status: 'Active',
        injuryActive: false,
        focusWorkout: 'All-Around Performance'
      }
    ];
  }

  // Validate unique username
  const trimmed = usernameStr.trim();
  if (roster.some(u => u.username.toLowerCase() === trimmed.toLowerCase())) {
     throw new Error('USERNAME ALREADY TAKEN');
  }

  const userUid = `${trimmed.toLowerCase()}_local`;
  const initialProfile: UserProfile = {
    uid: userUid,
    username: trimmed,
    email: email,
    role: roleVal,
    joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: 'Active',
    injuryActive: false,
    focusWorkout: roleVal === 'admin' ? 'All-Around Performance' : 'Hypertrophy Chest'
  };

  // Save credentials locally
  let passwords: { [key: string]: string } = {};
  const passwordsStr = localStorage.getItem('fitx_local_passwords');
  if (passwordsStr) {
    try {
      passwords = JSON.parse(passwordsStr);
    } catch {}
  }
  passwords[trimmed.toLowerCase()] = passwordStr;
  localStorage.setItem('fitx_local_passwords', JSON.stringify(passwords));

  // Push new athlete profile to active roster
  roster.push(initialProfile);
  localStorage.setItem('fitx_local_roster', JSON.stringify(roster));

  return initialProfile;
}

// Authentication login flow
export async function loginFirebaseUser(
  usernameStr: string,
  passwordStr: string,
  expectedRole: 'user' | 'admin'
): Promise<UserProfile> {
  const trimmedUser = usernameStr.trim().toLowerCase();
  
  // Custom professional loading timeout
  await new Promise(resolve => setTimeout(resolve, 600));

  // Quick prefilled check for default accounts
  if (trimmedUser === 'operator_aj' && passwordStr.trim() === 'fitness2026') {
    return {
      uid: 'operator_aj_local',
      username: 'operator_aj',
      email: 'operator_aj@simatsfitx.com',
      role: 'user',
      joined: 'May 10, 2026',
      status: 'Active',
      injuryActive: false,
      focusWorkout: 'Hypertrophy Chest'
    };
  } else if (trimmedUser === 'commander_prime' && passwordStr.trim() === 'admin_power') {
    return {
      uid: 'commander_prime_local',
      username: 'commander_prime',
      email: 'commander_prime@simatsfitx.com',
      role: 'admin',
      joined: 'May 01, 2026',
      status: 'Active',
      injuryActive: false,
      focusWorkout: 'All-Around Performance'
    };
  }

  // Load existing rosters
  const rosterStr = localStorage.getItem('fitx_local_roster') || '[]';
  let roster: UserProfile[] = [];
  try { roster = JSON.parse(rosterStr); } catch {}

  // If local roster is empty, bootstrap with default profiles
  if (roster.length === 0) {
    roster = [
      {
        uid: 'operator_aj_local',
        username: 'operator_aj',
        email: 'operator_aj@simatsfitx.com',
        role: 'user',
        joined: 'May 10, 2026',
        status: 'Active',
        injuryActive: false,
        focusWorkout: 'Hypertrophy Chest'
      },
      {
        uid: 'commander_prime_local',
        username: 'commander_prime',
        email: 'commander_prime@simatsfitx.com',
        role: 'admin',
        joined: 'May 01, 2026',
        status: 'Active',
        injuryActive: false,
        focusWorkout: 'All-Around Performance'
      }
    ];
    localStorage.setItem('fitx_local_roster', JSON.stringify(roster));
  }

  const matched = roster.find(u => u.username.toLowerCase() === trimmedUser);

  if (!matched) {
    throw new Error('AUTH ERROR: Athlete ID username not found. Register a new account first.');
  }

  if (matched.role !== expectedRole) {
    throw new Error(`ACCESS DENIED: Credentials belong to a different division (${matched.role.toUpperCase()}).`);
  }

  if (matched.status === 'Suspended') {
    throw new Error('ACCESS DENIED: Your athlete account is currently SUSPENDED. Contact head coach.');
  }

  // Check stored password
  const passwordsStr = localStorage.getItem('fitx_local_passwords') || '{}';
  let passwords: { [key: string]: string } = {};
  try { passwords = JSON.parse(passwordsStr); } catch {}
  
  const savedPassword = passwords[trimmedUser];
  if (savedPassword) {
    if (savedPassword !== passwordStr.trim()) {
      throw new Error('AUTH ERROR: SPECIALIZED SECURITY KEY PASSCODE INVALID.');
    }
  } else {
    // If it's a default account and didn't match the hardcoded passwords above, deny it
    throw new Error('AUTH ERROR: SPECIALIZED SECURITY KEY PASSCODE INVALID.');
  }

  return matched;
}

// Google Authentication login flow
export async function loginWithGoogle(
  expectedRole: 'user' | 'admin'
): Promise<UserProfile> {
  // Custom professional UX simulated loading state
  await new Promise(resolve => setTimeout(resolve, 800));

  const googleEmails = [
    'prime_lift@gmail.com',
    'hypertrophy_pro@gmail.com',
    'neural_apex@gmail.com',
    'iron_athlete@gmail.com'
  ];
  const chosenEmail = googleEmails[Math.floor(Math.random() * googleEmails.length)];
  const handleName = chosenEmail.split('@')[0];
  const displayUser = handleName.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const googleUid = `google_${handleName}_local`;

  // Fetch or update in local roster
  const rosterStr = localStorage.getItem('fitx_local_roster') || '[]';
  let roster: UserProfile[] = [];
  try { roster = JSON.parse(rosterStr); } catch {}

  let profile = roster.find(u => u.uid === googleUid);

  if (!profile) {
    profile = {
      uid: googleUid,
      username: displayUser,
      email: chosenEmail,
      role: expectedRole,
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Active',
      injuryActive: false,
      focusWorkout: expectedRole === 'admin' ? 'All-Around Performance' : 'Hypertrophy Chest'
    };
    roster.push(profile);
    localStorage.setItem('fitx_local_roster', JSON.stringify(roster));
  } else {
    // If role switches on Google Sign-In tab
    if (profile.role !== expectedRole) {
      profile.role = expectedRole;
      localStorage.setItem('fitx_local_roster', JSON.stringify(roster));
    }

    if (profile.status === 'Suspended') {
      throw new Error('ACCESS DENIED: Your athlete account is currently SUSPENDED. Contact head coach.');
    }
  }

  return profile;
}

// Log a completed training session
export async function logWorkoutRecord(session: any) {
  const localUid = localStorage.getItem('userId');
  const recordPayload = {
    id: session.id || `record-${Date.now()}`,
    uid: localUid || 'athlete_local',
    username: localStorage.getItem('username') || 'Athlete',
    date: session.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    type: session.type || 'WORKOUT SPLIT',
    duration: session.duration || '45 min',
    volume: typeof session.volume === 'number' ? session.volume : 0,
    color: session.color || '#00D4FF',
    exercises: session.exercises || [],
    createdAt: new Date().toISOString()
  };

  const existing = localStorage.getItem('fitx_local_records');
  const list = existing ? JSON.parse(existing) : [];
  list.unshift(recordPayload);
  localStorage.setItem('fitx_local_records', JSON.stringify(list));
  return recordPayload;
}

// Fetch all logged workout sessions for the coach roster and dashboards list
export async function getWorkoutRecords(): Promise<any[]> {
  const localUid = localStorage.getItem('userId');
  const localRecords = localStorage.getItem('fitx_local_records');
  if (localRecords) {
    try {
      return JSON.parse(localRecords);
    } catch {}
  }
  const defaultRecords = [
    {
      id: 'mock-1',
      uid: localUid || 'operator_aj_local',
      username: localStorage.getItem('username') || 'Athlete',
      date: 'May 28, 2026',
      type: 'STRENGTH POWER',
      duration: '52 min',
      volume: 8400,
      color: '#00D4FF',
      exercises: [{ name: 'Deadlift', sets: 4, reps: 5, weight: '315 lbs', rest: '180s' }],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'mock-2',
      uid: 'other-user',
      username: 'Ironclad Athlete',
      date: 'May 29, 2026',
      type: 'HYPERTROPHY CHEST',
      duration: '45 min',
      volume: 6200,
      color: '#FF007F',
      exercises: [{ name: 'Incline Bench', sets: 4, reps: 8, weight: '185 lbs', rest: '90s' }],
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];
  localStorage.setItem('fitx_local_records', JSON.stringify(defaultRecords));
  return defaultRecords;
}

// Fetch all registered user roster entries
export async function getRosterUsers(): Promise<UserProfile[]> {
  const localRoster = localStorage.getItem('fitx_local_roster');
  if (localRoster) {
    try {
      return JSON.parse(localRoster);
    } catch {}
  }
  const defaultRoster: UserProfile[] = [
    {
      uid: 'operator_aj_local',
      username: 'operator_aj',
      email: 'operator_aj@simatsfitx.com',
      role: 'user',
      joined: 'May 10, 2026',
      status: 'Active',
      injuryActive: false,
      focusWorkout: 'Hypertrophy Chest'
    },
    {
      uid: 'commander_prime_local',
      username: 'commander_prime',
      email: 'commander_prime@simatsfitx.com',
      role: 'admin',
      joined: 'May 01, 2026',
      status: 'Active',
      injuryActive: false,
      focusWorkout: 'All-Around Performance'
    }
  ];
  localStorage.setItem('fitx_local_roster', JSON.stringify(defaultRoster));
  return defaultRoster;
}

// Modify key tactical values of an athlete
export async function updateTacticalUser(uid: string, updates: Partial<UserProfile>) {
  const roster = await getRosterUsers();
  const updated = roster.map(user => user.uid === uid ? { ...user, ...updates } : user);
  localStorage.setItem('fitx_local_roster', JSON.stringify(updated));
}

// Remote user deletion
export async function deleteUserAccount(uid: string) {
  const roster = await getRosterUsers();
  const updated = roster.filter(user => user.uid !== uid);
  localStorage.setItem('fitx_local_roster', JSON.stringify(updated));
}
