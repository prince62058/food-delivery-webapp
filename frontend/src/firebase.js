// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCK3dPN8GmYGMox8GQd5TILWmfpfJHYA0I",
  authDomain: "food-del-6c089.firebaseapp.com",
  projectId: "food-del-6c089",
  storageBucket: "food-del-6c089.firebasestorage.app",
  messagingSenderId: "1928899377",
  appId: "1:1928899377:web:f357aa08938ea148a65e10",
  measurementId: "G-S73XW6K32K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app };
