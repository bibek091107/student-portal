// studentlogin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, signInWithEmailAndPassword, updatePassword, setPersistence, browserLocalPersistence 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, collection, query, where, getDocs, doc, updateDoc 
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

// Ensure Auth session persists
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

let currentUserEmail = "";

// ----- LOGIN -----
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const identifier = identifierInput.value.trim();
  const password = passwordInput.value;

  try {
    let email = identifier;

    // If phone number entered → find email from Firestore
    if (/^\d+$/.test(identifier)) {
      const q = query(collection(db, "Students"), where("phone", "==", identifier));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("User not found");
        return;
      }

      email = querySnapshot.docs[0].data().email;
    }

    // Firebase Auth login
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    currentUserEmail = email;

    // Get student record from Firestore
    const q = query(collection(db, "Students"), where("email", "==", email));
    const snapshot = await getDocs(q);
    const studentDoc = snapshot.docs[0];
    const studentData = studentDoc.data();

    if (studentData.firstLogin === true) {
      // Show change password form
      loginContainer.style.display = "none";
      changePasswordContainer.style.display = "block";
    } else {
      // Already logged in → dashboard
      window.location.href = "dashboard.html";
    }

  } catch (error) {
    console.error(error);
    alert("Login failed: " + error.message);
  }
});

// ----- CHANGE PASSWORD -----
changePasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPassword = newPasswordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters!");
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) {
      alert("User session expired. Please login again.");
      window.location.href = "studentlogin.html";
      return;
    }

    // Update Firebase Auth password
    await updatePassword(user, newPassword);

    // Update firstLogin = false in Firestore
    const q = query(collection(db, "Students"), where("email", "==", currentUserEmail));
    const snapshot = await getDocs(q);
    const studentDoc = snapshot.docs[0];
    await updateDoc(doc(db, "Students", studentDoc.id), { firstLogin: false });

    alert("Password updated successfully!");
    window.location.href = "student-dashboard.html";

  } catch (err) {
    console.error(err);
    alert("Failed to update password: " + err.message);
  }
});