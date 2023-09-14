import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCvK3gIRDsTPVM5xic-OUoZi-EtvEBUAeI",
    authDomain: "potholedetecttp2.firebaseapp.com",
    projectId: "potholedetecttp2",
    storageBucket: "potholedetecttp2.appspot.com",
    messagingSenderId: "594094653874",
    appId: "1:594094653874:web:bdabc374be02c196d5a4ab",
    measurementId: "G-9H0P68BT4K"
  };

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
