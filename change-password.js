// change-password.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, updatePassword, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config (same as studentlogin.js)
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

// ✅ Ensure Firebase Auth session persists
setPersistence(auth, browserLocalPersistence);

const form = document.getElementById("changePasswordForm");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

form.addEventListener("submit", async (e) => {
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

  const user = auth.currentUser;

  if (!user) {
    alert("No logged-in user found. Please login again.");
    return;
  }

  try {
    // 🔹 Update Firebase Auth password
    await updatePassword(user, newPassword);

    // 🔹 Update firstLogin in Firestore
    const q = query(
      collection(db, "Students"),
      where("email", "==", user.email)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const studentDoc = snapshot.docs[0];
      await updateDoc(doc(db, "Students", studentDoc.id), { firstLogin: false });
    }

    alert("Password updated successfully!");
    window.location.href = "dashboard.html"; // redirect after password change

  } catch (err) {
    console.error(err);
    alert("Failed to update password: " + err.message);
  }
});