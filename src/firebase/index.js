// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
import "firebase/storage";

var firebaseConfig = {
  apiKey: String(process.env.FIREBASE_API_KEY),
  authDomain: "text-extraction-app.firebaseapp.com",
  projectId: "text-extraction-app",
  storageBucket: "text-extraction-app.appspot.com",
  messagingSenderId: "66494411585",
  appId: "1:66494411585:web:439c5e7a5c6399eb9427c0",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };