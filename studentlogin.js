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

/* ================= FIREBASE CONFIG ================= */
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

/* ================= ELEMENTS ================= */
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

/* ================= LOGIN ================= */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = identifierInput.value.trim();
  const password = passwordInput.value;

  try {
    let email = identifier;

    // ---- LOGIN WITH PHONE NUMBER ----
    if (/^\d+$/.test(identifier)) {
      const phoneSnap = await getDocs(
        query(collection(db, "Students"), where("phone", "==", identifier))
      );

      if (phoneSnap.empty) {
        alert("User not found");
        return;
      }

      email = phoneSnap.docs[0].data().email;
    }

    email = email.toLowerCase();
    currentUserEmail = email;

    // ---- AUTH LOGIN ----
    await signInWithEmailAndPassword(auth, email, password);

    // ---- GET STUDENT DOCUMENT ----
    const studentSnap = await getDocs(
      query(collection(db, "Students"), where("email", "==", email))
    );

    if (studentSnap.empty) {
      alert("Student record not found");
      return;
    }

    const studentDoc = studentSnap.docs[0];
    const studentData = studentDoc.data();
    currentStudentDocId = studentDoc.id;

    const isFirstLogin =
      studentData.firstLogin === true ||
      studentData.firstLogin === undefined;

    // 🚫 If photo already uploaded → dashboard
    if (studentData.photoLocked === true) {
      window.location.href = "student-dashboard.html";
      return;
    }

    // 🔐 First login → change password
    if (isFirstLogin) {
      loginContainer.style.display = "none";
      changePasswordContainer.style.display = "block";
    } else {
      // 🔁 Password done but photo not uploaded
      window.location.href = "upload-photo.html";
    }

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

/* ================= CHANGE PASSWORD ================= */
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

    // ✅ Mark password updated but photo still required
    await updateDoc(doc(db, "Students", currentStudentDocId), {
      firstLogin: false
    });

    alert("Password updated successfully");
    window.location.href = "upload-photo.html";

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});
