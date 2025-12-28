import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase config (same as login)
const firebaseConfig = {
  apiKey: "AIzaSyCqAA39CbpDLXRU9OQ4T1TaKDGs_iPPceE",
  authDomain: "student-management-syste-e3edc.firebaseapp.com",
  projectId: "student-management-syste-e3edc",
  storageBucket: "student-management-syste-e3edc.appspot.com",
  messagingSenderId: "674803364755",
  appId: "1:674803364755:web:ffd5e3e3a852d3624fae66"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const welcomeText = document.getElementById("welcomeText");

// Ensure user is logged in
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "teacherlogin.html";
    return;
  }

  try {
    const teacherDocId = localStorage.getItem("teacherDocId");

    if (!teacherDocId) {
      welcomeText.textContent = "Welcome, Teacher";
      return;
    }

    const teacherRef = doc(db, "Teachers", teacherDocId);
    const teacherSnap = await getDoc(teacherRef);

    if (!teacherSnap.exists()) {
      welcomeText.textContent = "Welcome, Teacher";
      return;
    }

    const teacherData = teacherSnap.data();

    // 🔑 IMPORTANT: field name must be EXACT
    const teacherName = teacherData.name;

    welcomeText.textContent = `Welcome ${teacherName}`;

  } catch (error) {
    console.error(error);
    welcomeText.textContent = "Welcome, Teacher";
  }
});