import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgN0VsBm8SZY8n4sPlEzX1fihMgvPLR5U",
  authDomain: "plant-ai-b9d1d.firebaseapp.com",
  projectId: "plant-ai-b9d1d",
  storageBucket: "plant-ai-b9d1d.firebasestorage.app",
  messagingSenderId: "779511961523",
  appId: "1:779511961523:web:0fc39eabc4dec17ad51dc6",
  measurementId: "G-3FPYM626W2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the database so App.js can see it
export const db = getFirestore(app);
