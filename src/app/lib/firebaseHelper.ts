import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  orderBy, 
  where,
  deleteDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';

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
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

// Global skill instruction handler for "Missing or insufficient permissions"
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Hardened Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Convert username to a valid Firebase email securely
export function usernameToEmail(username: string): string {
  if (username.includes('@')) return username.trim().toLowerCase();
  return `${username.trim().toLowerCase()}@ajfit.com`;
}

// User Profile Entity shape
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

// Register User (utilizes Email/Password Auth plus updates user collection profiles)
export async function registerFirebaseUser(
  usernameStr: string, 
  passwordStr: string, 
  roleVal: 'user' | 'admin'
): Promise<UserProfile> {
  const email = usernameToEmail(usernameStr);
  const path = `users`;
  
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, passwordStr);
    const user = credential.user;
    
    // Set custom visual username display
    await updateProfile(user, { displayName: usernameStr });

    const initialProfile: UserProfile = {
      uid: user.uid,
      username: usernameStr,
      email: email,
      role: roleVal,
      joined: 'Just now',
      status: 'Active',
      injuryActive: false,
      focusWorkout: roleVal === 'admin' ? 'All-Around Performance' : 'Hypertrophy Chest'
    };

    // Save profile to Firestore users database
    await setDoc(doc(db, 'users', user.uid), initialProfile);
    return initialProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/(new_uid)`);
  }
}

// Authentication login flow
export async function loginFirebaseUser(
  usernameStr: string, 
  passwordStr: string,
  expectedRole: 'user' | 'admin'
): Promise<UserProfile> {
  const email = usernameToEmail(usernameStr);
  const path = `users`;

  try {
    const credential = await signInWithEmailAndPassword(auth, email, passwordStr);
    const user = credential.user;

    // Fetch account details to verify Role & active suspension
    const userDocRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      // If document is missing (e.g. legacy/manually registered user), bootstrap profile
      const defaultProfile: UserProfile = {
        uid: user.uid,
        username: user.displayName || usernameStr,
        email: email,
        role: expectedRole,
        joined: 'Just now',
        status: 'Active',
        injuryActive: false,
        focusWorkout: expectedRole === 'admin' ? 'All-Around Performance' : 'Hypertrophy Chest'
      };
      await setDoc(userDocRef, defaultProfile);
      return defaultProfile;
    }

    const profileData = userSnapshot.data() as UserProfile;

    // Block Suspended accounts cleanly
    if (profileData.status === 'Suspended') {
      await signOut(auth);
      throw new Error('ACCESS DENIED: Your athlete account is currently SUSPENDED. Contact head coach.');
    }

    return profileData;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${path}/(auth_uid)`);
  }
}

// Google Authentication login flow
export async function loginWithGoogle(expectedRole: 'user' | 'admin'): Promise<UserProfile> {
  const provider = new GoogleAuthProvider();
  try {
    const credential = await signInWithPopup(auth, provider);
    const user = credential.user;

    // Fetch account details to verify Role & active suspension
    const userDocRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      const defaultProfile: UserProfile = {
        uid: user.uid,
        username: user.displayName || user.email?.split('@')[0] || 'Athlete',
        email: user.email || `${user.uid}@ajfit.com`,
        role: expectedRole,
        joined: 'Just now',
        status: 'Active',
        injuryActive: false,
        focusWorkout: expectedRole === 'admin' ? 'All-Around Performance' : 'Hypertrophy Chest'
      };
      await setDoc(userDocRef, defaultProfile);
      return defaultProfile;
    }

    const profileData = userSnapshot.data() as UserProfile;

    // Direct role updates if user previously joined as a different role, otherwise respects DB role
    if (profileData.role !== expectedRole) {
      profileData.role = expectedRole;
      await updateDoc(userDocRef, { role: expectedRole });
    }

    if (profileData.status === 'Suspended') {
      await signOut(auth);
      throw new Error('ACCESS DENIED: Your athlete account is currently SUSPENDED. Contact head coach.');
    }

    return profileData;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'users/(google_auth)');
  }
}

// Log a completed training session
export async function logWorkoutRecord(session: any) {
  const path = `records`;
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // Create a new unique records ID
    const colRef = collection(db, 'records');
    const docRef = doc(colRef);
    
    const recordPayload = {
      id: docRef.id,
      uid: currentUser.uid,
      username: currentUser.displayName || 'Athlete',
      date: session.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: session.type || 'WORKOUT SPLIT',
      duration: session.duration || '45 min',
      volume: typeof session.volume === 'number' ? session.volume : 0,
      color: session.color || '#00D4FF',
      exercises: session.exercises || [],
      createdAt: new Date().toISOString()
    };

    await setDoc(docRef, recordPayload);
    return recordPayload;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/(new_id)`);
  }
}

// Fetch all logged workout sessions for the coach roster and dashboards list
export async function getWorkoutRecords(): Promise<any[]> {
  const path = `records`;
  try {
    const colRef = collection(db, 'records');
    const qObj = query(colRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(qObj);
    return snap.docs.map(d => d.data());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Fetch all registered user roster entries
export async function getRosterUsers(): Promise<UserProfile[]> {
  const path = `users`;
  try {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => d.data() as UserProfile);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Modify key tactical values of an athlete
export async function updateTacticalUser(uid: string, updates: Partial<UserProfile>) {
  const path = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Remote user deletion
export async function deleteUserAccount(uid: string) {
  const path = `users/${uid}`;
  try {
    await deleteDoc(doc(db, 'users', uid));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
