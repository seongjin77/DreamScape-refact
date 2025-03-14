import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import {
  initializeFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY || '',
  authDomain: process.env.REACT_APP_AUTH_DOMAIN || '',
  projectId: process.env.REACT_APP_PROJECT_ID || '',
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET || '',
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID || '',
  appId: process.env.REACT_APP_APP_ID || '',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
// Firestore 초기화
const db = initializeFirestore(
  app,
  {
    host: 'asia-northeast3-firestore.googleapis.com',
    ssl: true,
  },
  'img-db-test',
);

export { storage, db };
