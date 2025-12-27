// Import Firestore
import { db } from './firebase.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Grab form and password elements
const loginForm = document.getElementById('loginForm');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

// Show / Hide password feature
togglePassword.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  togglePassword.classList.toggle('fa-eye-slash');
});

// Login function
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const identifier = document.getElementById('identifier').value;
  const password = passwordInput.value;

  const isPhone = /^\d+$/.test(identifier); // detect if number
  const usersRef = collection(db, "students");
  const q = isPhone
    ? query(usersRef, where("Phone number", "==", Number(identifier))) // match Firestore field exactly
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
      // Store user info if needed: localStorage/sessionStorage
      window.location.href = "dashboard.html"; // Redirect to dashboard
    }
  });

  if (!loginSuccess) {
    alert("Incorrect password");
  }
});