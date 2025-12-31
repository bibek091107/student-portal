/// studentlogin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  updatePassword,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

setPersistence(auth, browserLocalPersistence);

// Elements
const loginForm = document.getElementById("loginForm");
const identifierInput = document.getElementById("identifier");
const passwordInput = document.getElementById("password");
const loginContainer = document.getElementById("loginContainer");
const changePasswordContainer = document.getElementById("changePasswordContainer");
const changePasswordForm = document.getElementById("changePasswordForm");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

let currentStudentDocId = "";
let currentUserEmail = "";

/* ---------------- LOGIN ---------------- */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = identifierInput.value.trim();
  const password = passwordInput.value;

  try {
    let email = identifier;

    // Login with phone
    if (/^\d+$/.test(identifier)) {
      const phoneSnap = await getDocs(
        query(collection(db, "Students"), where("phone", "==", identifier))
      );

      if (phoneSnap.empty) {
        alert("User not found");
        return;
      }

      const data = phoneSnap.docs[0].data();
      email = data.Email || data.EMAIL;
    }

    email = email.toLowerCase();
    currentUserEmail = email;

    // Firebase Auth
    await signInWithEmailAndPassword(auth, email, password);

    // Try Email
    let studentSnap = await getDocs(
      query(collection(db, "Students"), where("Email", "==", email))
    );

    // Try EMAIL (new form)
    if (studentSnap.empty) {
      studentSnap = await getDocs(
        query(collection(db, "Students"), where("EMAIL", "==", email))
      );
    }

    if (studentSnap.empty) {
      alert("Student record exists but field mismatch");
      return;
    }

    const studentDoc = studentSnap.docs[0];
    const studentData = studentDoc.data();
    currentStudentDocId = studentDoc.id;

    const isFirstLogin =
      studentData.firstLogin === true ||
      studentData.FirstLogin === true ||
      studentData.firstLogin === undefined;

    if (isFirstLogin) {
      loginContainer.style.display = "none";
      changePasswordContainer.style.display = "block";
    } else {
      window.location.href = "student-dashboard.html";
    }

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

/* ---------------- CHANGE PASSWORD ---------------- */
changePasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPassword = newPasswordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Session expired");

    await updatePassword(user, newPassword);

    await updateDoc(doc(db, "Students", currentStudentDocId), {
      firstLogin: false
    });

    alert("Password updated successfully");
    window.location.href = "student-dashboard.html";

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});
