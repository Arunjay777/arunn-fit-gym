import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Initialize Firestore using the designated Firestore Database ID from our config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

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
