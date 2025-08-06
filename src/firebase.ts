// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCm3k5LSbgpjIwjYM7PCe82S-wdSYKMDRs",
  authDomain: "nonogram-d3c5f.firebaseapp.com",
  projectId: "nonogram-d3c5f",
  storageBucket: "nonogram-d3c5f.appspot.com",
//   storageBucket: "nonogram-d3c5f.firebasestorage.app",
  messagingSenderId: "390980274529",
  appId: "1:390980274529:web:ea5e19b4712f29669b1d20",
  measurementId: "G-W2SDXBK0Y3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);