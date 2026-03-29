import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD2wFqo9SUGAQ-Y9OZHu-1MiI3CGC9Cb94",
    authDomain: "smart-health-51e3f.firebaseapp.com",
    projectId: "smart-health-51e3f",
    storageBucket: "smart-health-51e3f.firebasestorage.app",
    messagingSenderId: "196092778652",
    appId: "1:196092778652:web:6d3814110380e2c5987559",
    measurementId: "G-15QN5B0JM6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { app, analytics, auth, googleProvider, db };
