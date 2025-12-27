// Import Firestore
import { db } from './firebase.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Grab form and input elements
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('password');
const identifierInput = document.getElementById('identifier');

// Login function
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const identifier = identifierInput.value.trim();
  const password = passwordInput.value;

  const isPhone = /^\d+$/.test(identifier); // detect if number
  const usersRef = collection(db, "students"); // Firestore collection
  const q = isPhone
    ? query(usersRef, where("Phone number", "==", Number(identifier))) // exact match Firestore field
    : query(usersRef, where("email", "==", identifier));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    alert("User not found");
    return;
  }

  let loginSuccess = false;
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.Password === password) { // match Firestore password
      loginSuccess = true;
      // Store email or phone in localStorage for dashboard
      if (isPhone) {
        localStorage.setItem('userPhone', identifier);
      } else {
        localStorage.setItem('userEmail', identifier);
      }
      alert("Login successful!");
      window.location.href = "dashboard.html"; // Redirect
    }
  });

  if (!loginSuccess) {
    alert("Incorrect password");
  }
});