// studentlogin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

const loginForm = document.getElementById("loginForm");
const identifierInput = document.getElementById("identifier");
const passwordInput = document.getElementById("password");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = identifierInput.value.trim();
  const password = passwordInput.value;

  try {
    let email = identifier;

    // 🔹 Optional: support phone lookup (only if you want)
    if (/^\d+$/.test(identifier)) {
      const q = query(
        collection(db, "Students"),
        where("phone", "==", Number(identifier)) // phone stored as Number
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("User not found");
        return;
      }

      email = querySnapshot.docs[0].data().email; // get email to login
    }

    // 🔹 Firebase Auth login (email only)
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // 🔹 Fetch student document by querying email (not UID)
    const q = query(
      collection(db, "Students"),
      where("email", "==", email)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      alert("Student record not found");
      return;
    }

    const studentData = snapshot.docs[0].data();

    // 🔹 Save session info
    localStorage.setItem("userEmail", email);

    // 🔒 Force password change on first login
    if (studentData.firstLogin === true) {
      window.location.href = "change-password.html";
    } else {
      window.location.href = "dashboard.html";
    }

  } catch (error) {
    console.error(error);
    alert("Login failed: " + error.message);
  }
});