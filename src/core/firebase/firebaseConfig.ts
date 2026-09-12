// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCytyw4Xlym-lhQtLSQ6188DYHYLtBlh1o",
  authDomain: "jchat-3d21a.firebaseapp.com",
  projectId: "jchat-3d21a",
  storageBucket: "jchat-3d21a.firebasestorage.app",
  messagingSenderId: "364109204241",
  appId: "1:364109204241:web:7a711ea2a98ac173291ab0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});