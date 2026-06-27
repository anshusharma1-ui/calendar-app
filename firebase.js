import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDsrSrj2YuNQbKAfvZMhrmHf7RvZmzT9ds",
  authDomain: "anshu-calendar-app.firebaseapp.com",
  projectId: "anshu-calendar-app",
  storageBucket: "anshu-calendar-app.firebasestorage.app",
  messagingSenderId: "1053163969054",
  appId: "1:1053163969054:web:b135845b6b4cc5d83dec0f",
  measurementId: "G-6J1WG1605G"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

const provider =
new GoogleAuthProvider();

window.auth = auth;
window.provider = provider;

window.signInWithPopup =
signInWithPopup;

window.signOut = signOut;

// Global access for script.js
window.db = db;
window.doc = doc;
window.setDoc = setDoc;
window.getDoc = getDoc;

console.log("Firebase Connected");
console.log("Firestore Ready");
window.testFirebase = async () => {
  try {

    await setDoc(
      doc(db, "test", "demo"),
      {
        name: "Anshu",
        time: Date.now()
      }
    );

    console.log("TEST SUCCESS");

  } catch (e) {

    console.error("TEST ERROR", e);

  }
};
window.signOut = signOut;
window.currentUser = null;

nAuthStateChanged(auth, async (user) => {

    if(user){

        window.currentUser = user;
        document.getElementById("userInfo").style.display = "block";

document.getElementById("userPhoto").src =
user.photoURL;

document.getElementById("userName").textContent =
user.displayName;

document.getElementById("userEmail").textContent =
user.email;

document.getElementById("loginBtn").style.display =
"none";

document.getElementById("logoutBtn").style.display =
"inline-block";

        console.log("Logged In:", user.uid);

        await window.loadEventsFromFirebase();

        window.renderCalendar();

    }else{

        window.currentUser = null;
        document.getElementById("userInfo").style.display =
"none";

document.getElementById("loginBtn").style.display =
"inline-block";

document.getElementById("logoutBtn").style.display =
"none";

        console.log("No User Logged In");

    }

    const loading = document.getElementById("loadingScreen");

    if (loading) {
        loading.style.display = "none";
    }

});
console.log("Firebase.js Loaded");
