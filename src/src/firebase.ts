import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAA_KKj-DNgDgZul83KpSPFCA3ompxGZgM",
  authDomain: "gen-lang-client-0198168170.firebaseapp.com",
  projectId: "gen-lang-client-0198168170",
  storageBucket: "gen-lang-client-0198168170.firebasestorage.app",
  messagingSenderId: "886999306571",
  appId: "1:886999306571:web:9e131978bfbf9f2c24d8ce"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, "ai-studio-b7d6f161-b5fd-4677-be27-c9a0230b84a6");
