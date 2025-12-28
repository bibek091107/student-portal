import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, updatePassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

const form = document.getElementById("changePasswordForm");
const newPasswordInput = document.getElementById("newPassword");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPassword = newPasswordInput.value.trim();
  const user = auth.currentUser;

  if (!user) {
    alert("No authenticated user found.");
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
    window.location.href = "dashboard.html"; // redirect after change

  } catch (err) {
    console.error(err);
    alert("Failed to update password: " + err.message);
  }
});