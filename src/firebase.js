import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1aSA_7LjMqE8_VYZ-4g_iegExkY4ZW8w",
  authDomain: "image-gallery-fa5f8.firebaseapp.com",
  projectId: "image-gallery-fa5f8",
  storageBucket: "image-gallery-fa5f8.appspot.com",
  messagingSenderId: "702397685772",
  appId: "1:702397685772:web:a6e1c42e8a09f0d64c8e29",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
