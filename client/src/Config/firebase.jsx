// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASEAPIKEY,
  authDomain: import.meta.env.FIREBASEAUTHDOMAIN,
  projectId: import.meta.env.FIREBASEPROJECTID,
  storageBucket: import.meta.env.FIREBASESTORAGEBUCKET,
  messagingSenderId: import.meta.env.FIREBASEMESSAGINGSENDERID,
  appId: import.meta.env.FIREBASEAPPID,
  measurementId: import.meta.env.FIREBASEMEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
// export const analytics = getAnalytics(app);
