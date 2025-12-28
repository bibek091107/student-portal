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

// Form and input elements
const loginForm = document.getElementById("teacherLoginForm");
const identifierInput = document.getElementById("teacherIdentifier");
const passwordInput = document.getElementById("teacherPassword");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = identifierInput.value.trim();
  const password = passwordInput.value;
  let email = identifier;

  try {
    // If phone number entered → find email from Firestore
    if (/^\d+$/.test(identifier)) {
      const q = query(collection(db, "Teachers"), where("phone", "==", identifier));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Teacher not found");
        return;
      }

      email = querySnapshot.docs[0].data().email;
      localStorage.setItem("teacherDocId", querySnapshot.docs[0].id);
    } else {
      // Email login → get document id from Firestore
      const q = query(collection(db, "Teachers"), where("email", "==", identifier));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Teacher not found");
        return;
      }

      localStorage.setItem("teacherDocId", querySnapshot.docs[0].id);
    }

    // Firebase Auth login
    await signInWithEmailAndPassword(auth, email, password);

    // Redirect to teacher dashboard
    window.location.href = "teacher-dashboard.html";

  } catch (error) {
    console.error(error);
    alert("Login failed: " + error.message);
  }
});