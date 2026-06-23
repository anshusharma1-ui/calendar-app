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

