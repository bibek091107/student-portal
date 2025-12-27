// studentlogin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config
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

const loginForm = document.getElementById('loginForm');
const identifierInput = document.getElementById('identifier');
const passwordInput = document.getElementById('password');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const identifier = identifierInput.value.trim();
  const password = passwordInput.value;

  try {
    // If user enters email, we use it directly
    let email = identifier;

    // If user entered phone, we need to find email from Firestore
    if (/^\d+$/.test(identifier)) {
      // Search Firestore for student with this phone
      const studentsRef = doc(db, "Students", identifier); // you can store UID = phone
      const docSnap = await getDoc(studentsRef);

      if (!docSnap.exists()) {
        alert("User not found");
        return;
      }

      email = docSnap.data().email; // get email to use for Firebase Auth login
    }

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    localStorage.setItem("userEmail", email); // store email for dashboard
    window.location.href = "dashboard.html";

  } catch (error) {
    console.error(error);
    alert("Login failed: " + error.message);
  }
});