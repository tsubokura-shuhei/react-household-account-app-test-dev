// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseSettings = require("./.");

const firebaseConfig = {
  apiKey: "AIzaSyB4f5Ly10-nBSprjKOJcxkfRtigUGAWYFo",
  authDomain: "react-household-account-app.firebaseapp.com",
  projectId: "react-household-account-app",
  storageBucket: "react-household-account-app.appspot.com",
  messagingSenderId: "304188791015",
  appId: "1:304188791015:web:93d5b6e5fe522e33262a42",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
