// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";  
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcTATy8UFmvEvGBQh54xevDIxU-OKPtU0",
  authDomain: "music-recommender-9fe40.firebaseapp.com",
  projectId: "music-recommender-9fe40",
  storageBucket: "music-recommender-9fe40.firebasestorage.app",
  messagingSenderId: "414657929141",
  appId: "1:414657929141:web:362bfe8018ad4f30a903fc",
  measurementId: "G-83F39LL1V3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };