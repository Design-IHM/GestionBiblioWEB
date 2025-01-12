
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAuth } from "firebase/auth"
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

let app; 

export default  app = firebase.initializeApp(firebaseConfig)


const db = app.firestore();
const auth = getAuth(app);
const storage= getStorage(app)

export { db, auth,storage,firebase };



