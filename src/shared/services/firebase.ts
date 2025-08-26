// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCm3k5LSbgpjIwjYM7PCe82S-wdSYKMDRs",
  authDomain: "nonogram-d3c5f.firebaseapp.com",
  projectId: "nonogram-d3c5f",
  storageBucket: "nonogram-d3c5f.appspot.com",
  messagingSenderId: "390980274529",
  appId: "1:390980274529:web:ea5e19b4712f29669b1d20",
  measurementId: "G-W2SDXBK0Y3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore for real-time multiplayer synchronization
export const firestore = getFirestore(app);

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);