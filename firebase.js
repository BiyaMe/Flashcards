// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEg6SH5eYSzxMWyoSOVOgTGlbX7-osZ5E",
  authDomain: "flashcards-8f246.firebaseapp.com",
  projectId: "flashcards-8f246",
  storageBucket: "flashcards-8f246.appspot.com",
  messagingSenderId: "1098086064993",
  appId: "1:1098086064993:web:a117d281864ef2cae1db20",
  measurementId: "G-F5R9GB97NJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};