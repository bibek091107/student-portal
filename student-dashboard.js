import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCqAA39CbpDLXRU9OQ4T1TaKDGs_iPPceE",
  authDomain: "student-management-syste-e3edc.firebaseapp.com",
  projectId: "student-management-syste-e3edc",
  storageBucket: "student-management-syste-e3edc.firebasestorage.app",
  messagingSenderId: "674803364755",
  appId: "1:674803364755:web:ffd5e3e3a852d3624fae66"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements
const nameEl = document.getElementById("studentName");
const emailEl = document.getElementById("studentEmail");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "studentlogin.html";
    return;
  }

  try {
    const docRef = doc(db, "Students", user.uid);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      nameEl.innerText = "Profile not found";
      emailEl.innerText = user.email;
      return;
    }

    const data = snap.data();
    nameEl.innerText = data.name || "No Name";
    emailEl.innerText = data.email || user.email;

  } catch (error) {
    console.error(error);
    nameEl.innerText = "Error loading name";
    emailEl.innerText = "Error loading email";
  }
});