importScripts("https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js");

firebase.initializeApp({

  apiKey: "AIzaSyDsrSrj2YuNQbKAfvZMhrmHf7RvZmzT9ds",

  authDomain: "anshu-calendar-app.firebaseapp.com",

  projectId: "anshu-calendar-app",

  storageBucket: "anshu-calendar-app.firebasestorage.app",

  messagingSenderId: "1053163969054",

  appId: "1:1053163969054:web:b135845b6b4cc5d83dec0f"

});

const messaging = firebase.messaging();