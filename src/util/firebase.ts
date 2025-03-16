import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBwBsED5vIwORDXNulgD1Mo7_gyoBSGQFw",
  authDomain: "imageguesser-d52a7.firebaseapp.com",
  projectId: "imageguesser-d52a7",
  storageBucket: "imageguesser-d52a7.firebasestorage.app",
  messagingSenderId: "685711111044",
  appId: "1:685711111044:web:390a257a9ec14a0d7ee3d1",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
