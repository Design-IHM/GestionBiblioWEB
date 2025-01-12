// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAycPH0e54OEuQKZHJlJVBzrl8PJwE5eEw",
  authDomain: "test-b1637.firebaseapp.com",
  projectId: "test-b1637",
  storageBucket: "test-b1637.appspot.com",
  messagingSenderId: "912702084020",
  appId: "1:912702084020:web:7c4470b95d458da35558e1",
  measurementId: "G-PWEJXF3Q4M"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

