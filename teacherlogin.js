// teacherlogin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, collection, query, where, getDocs, doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config (same as student)
const firebaseConfig = {
  apiKey: "AIzaSyCqAA39CbpDLXRU9OQ4T1TaKDGs_iPPceE",
  authDomain: "student-management-syste-e3edc.firebaseapp.com",
  projectId: "student-management-syste-e3edc",
  storageBucket: "student-management-syste-e3edc.appspot.com",
  messagingSenderId: "674803364755",
  appId: "1:674803364755:web:ffd5e3e3a852d3624fae66"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Persist login session
setPersistence(auth, browserLocalPersistence);

// Elements
const loginForm = document.getElementById("loginForm");
const identifierInput = document.getElementById("identifier");
const passwordInput = document.getElementById("password");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const identifier = identifierInput.value.trim();
  const password = passwordInput.value;

  try {
    let email = identifier;

    // If phone entered, find email in Teachers collection
    if (/^\d+$/.test(identifier)) {
      const q = query(collection(db, "Teachers"), where("phone", "==", identifier));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("Teacher not found");
        return;
      }

      email = snapshot.docs[0].data().email;
    }

    // Firebase Auth login
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch teacher record
    const q = query(collection(db, "Teachers"), where("email", "==", email));
    const snapshot = await getDocs(q);
    const teacherDoc = snapshot.docs[0];
    const teacherData = teacherDoc.data();

    // Store teacher info
    localStorage.setItem("teacherEmail", email);
    localStorage.setItem("teacherName", teacherData.name);

    // First login? Redirect to change password
    if (teacherData.firstLogin === true) {
      window.location.href = "change-password.html"; // teacher change password page
    } else {
      window.location.href = "teacher-dashboard.html"; // normal dashboard
    }

  } catch (err) {
    console.error(err);
    alert("Login failed: " + err.message);
  }
});