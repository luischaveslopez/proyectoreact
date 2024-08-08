
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAvxzypcVgMZw7FlSLN69qvtR9pBdjswjQ",
  authDomain: "jammify-c7cad.firebaseapp.com",
  projectId: "jammify-c7cad",
  storageBucket: "jammify-c7cad.appspot.com",
  messagingSenderId: "368397131558",
  appId: "1:368397131558:web:d77711cada3423ca7a6be7",
  measurementId: "G-NGBD4QTV97"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

