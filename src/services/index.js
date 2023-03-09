import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';  
import { Env } from 'config';
import { getFunctions, httpsCallable } from 'firebase/functions';
const firebaseConfig = {
  apiKey: Env.API_KEY,
  authDomain: Env.AUTH_DOMAIN,
  databaseURL: Env.DATABASE_URL,
  projectId: Env.PROJECT_ID,
  storageBucket: Env.STORAGE_BUCKET,
  messagingSenderId: Env.MESSAGING_SENDER_ID,
  appId: Env.APP_ID,
  measurementId: Env.MEASUREMENT_ID
};

// Init firebase app
const app = initializeApp(firebaseConfig);

// Use service
const firebaseAuth = getAuth(app);
const firebaseDb = getFirestore(app);

const firebaseFunctions = getFunctions();
const sendNotifyEmail = httpsCallable(firebaseFunctions, 'sendNotifyEmailv2');
const getUserData = httpsCallable(firebaseFunctions, 'getUserData');

export { firebaseAuth, firebaseDb, getUserData, sendNotifyEmail };
