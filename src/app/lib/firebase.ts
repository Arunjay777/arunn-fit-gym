import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import defaultFirebaseConfig from '../../../firebase-applet-config.json';

// Support full dynamic override for athletes without direct project owner access
let firebaseConfig = defaultFirebaseConfig;
const savedConfigStr = localStorage.getItem('fitx_custom_firebase_config');
if (savedConfigStr) {
  try {
    const parsed = JSON.parse(savedConfigStr);
    if (parsed && parsed.apiKey && parsed.authDomain && parsed.projectId) {
      firebaseConfig = {
        ...defaultFirebaseConfig,
        ...parsed
      };
      console.log("SIMATS FitX: Using custom player-provided Firebase configuration.");
    }
  } catch (e) {
    console.error("SIMATS FitX: Failed to parse custom stored Firebase config:", e);
  }
}

// Clean initialization of default app
const existingApps = getApps();
const app = existingApps.length > 0 ? existingApps[0] : initializeApp(firebaseConfig);

// Initialize Firestore using the designated Firestore Database ID from our config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Test-validate the server connection asynchronously on boot (as required by the Firebase Integration Skill metadata instructions)
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. Firestore client is offline.");
    }
  }
}
testConnection();
