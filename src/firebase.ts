// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDk3f6yIXQz1iEnTi0LRfxbf42ftXH24qY",
    authDomain: "verify-8761a.firebaseapp.com",
    projectId: "verify-8761a",
    storageBucket: "verify-8761a.firebasestorage.app",
    messagingSenderId: "678334068022",
    appId: "1:678334068022:web:6bc2ddb4b1a5347f41ef97",
    measurementId: "G-HV4P1ZQ6E9"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);
const auth = getAuth(app);
auth.useDeviceLanguage();


export { auth };

