// Import Firestore
import { db } from './firebase.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Grab form and password input
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('password');

// Login function
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const identifier = document.getElementById('identifier').value;
  const password = passwordInput.value;

  const isPhone = /^\d+$/.test(identifier); // detect if number
  const usersRef = collection(db, "students"); // Firestore collection
  const q = isPhone
    ? query(usersRef, where("Phone number", "==", Number(identifier))) // Firestore field exact
    : query(usersRef, where("email", "==", identifier));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    alert("User not found");
    return;
  }

  let loginSuccess = false;
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.Password === password) { // match Firestore field exactly
      loginSuccess = true;
      alert("Login successful!");
      // Store user info in localStorage/sessionStorage if needed
      window.location.href = "dashboard.html"; // redirect to dashboard
    }
  });

  if (!loginSuccess) {
    alert("Incorrect password");
  }
});