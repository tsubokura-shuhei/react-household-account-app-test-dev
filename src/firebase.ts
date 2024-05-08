// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseSettings = require("./.");

const firebaseConfig = {
  apiKey: "AIzaSyARgG3-Hza0cppG-wG6Uup7Yir7IYRXVE4",
  authDomain: "dev-household.firebaseapp.com",
  projectId: "dev-household",
  storageBucket: "dev-household.appspot.com",
  messagingSenderId: "501994246784",
  appId: "1:501994246784:web:baae9be208ff1e948d8c65",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
