import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAllASHNQ_PzG7-2Nkn9vZpxSHTYUAOaC0",
  authDomain: "vishal-ed938.firebaseapp.com",
  projectId: "vishal-ed938",
  storageBucket: "vishal-ed938.firebasestorage.app",
  messagingSenderId: "809584184209",
  appId: "1:809584184209:web:db4e848d2b9189ccf0e830",
  measurementId: "G-NEX0RCNC9E"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
