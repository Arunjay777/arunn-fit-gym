// Since we are running the login and workout engine completely offline & local as requested,
// we mock out firebase so that there are absolutely zero outer dependency crashes or blank screens.

export const db: any = {};

// High-fidelity listener set
const authStateListeners: any[] = [];

// Clean local storage auth observer that mimics Firebase Auth beautifully
export const auth: any = {
  get currentUser() {
    if (typeof window === 'undefined') return null;
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    if (!userId) return null;
    return {
      uid: userId,
      email: `${username || 'athlete'}@simatsfitx.com`,
      displayName: username || 'Athlete',
      emailVerified: true,
      isAnonymous: false,
      providerData: [],
    };
  },
  onAuthStateChanged(callback: (user: any) => void) {
    // Call immediately with current state
    const user = this.currentUser;
    callback(user);
    
    // Wire listener
    authStateListeners.push(callback);
    return () => {
      const idx = authStateListeners.indexOf(callback);
      if (idx > -1) authStateListeners.splice(idx, 1);
    };
  },
  signOut() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    // Notify in microtask
    setTimeout(() => {
      authStateListeners.forEach(cb => cb(null));
    }, 0);
    return Promise.resolve();
  }
};

// Sync auth state changes across different parts of the application instantly
if (typeof window !== 'undefined') {
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (...args: any[]) {
    originalSetItem.apply(localStorage, args as any);
    const key = args[0];
    if (key === 'userId' || key === 'username') {
      setTimeout(() => {
        const u = auth.currentUser;
        authStateListeners.forEach(cb => cb(u));
      }, 50);
    }
  };
  const originalRemoveItem = localStorage.removeItem;
  localStorage.removeItem = function (...args: any[]) {
    originalRemoveItem.apply(localStorage, args as any);
    const key = args[0];
    if (key === 'userId' || key === 'username') {
      setTimeout(() => {
        const u = auth.currentUser;
        authStateListeners.forEach(cb => cb(u));
      }, 50);
    }
  };
}
