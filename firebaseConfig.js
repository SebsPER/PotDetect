import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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
export const storage = getStorage(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


//export const auth = getAuth(app);

//storage._delegate._persistence = getReactNativePersistence(ReactNativeAsyncStorage);
// Obtén el objeto de autenticación
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
