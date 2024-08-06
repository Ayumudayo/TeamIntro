import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Firebase 초기화
const firebaseConfig = {
    apiKey: "AIzaSyCXLX8DF578yqOIPeU1DUgMzwz2tk8Uuyc",
    authDomain: "teamintro-47489.firebaseapp.com",
    projectId: "teamintro-47489",
    storageBucket: "teamintro-47489.appspot.com",
    messagingSenderId: "594224193568",
    appId: "1:594224193568:web:5c6cac5fa042f1c1301c45",
    measurementId: "G-YJZZJKH6K9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

export { auth, db, provider };
