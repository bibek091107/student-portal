// studentlogin.js

// Import Firestore
import { db } from './firebase.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Grab form and input elements
const loginForm = document.getElementById('loginForm');
const identifierInput = document.getElementById('identifier');
const passwordInput = document.getElementById('password');

console.log("studentlogin.js loaded"); // debug to check if script runs

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log("Login attempt detected"); // debug

  const identifier = identifierInput.value.trim();
  const password = passwordInput.value;

  // Detect if input is a phone number
  const isPhone = /^\d+$/.test(identifier);

  try {
    const usersRef = collection(db, "students"); // Firestore collection
    const q = isPhone
      ? query(usersRef, where("Phone number", "==", Number(identifier))) // phone query
      : query(usersRef, where("email", "==", identifier)); // email query

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("User not found");
      return;
    }

    let loginSuccess = false;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("Fetched data:", data); // debug

      if (data.Password === password) {
        loginSuccess = true;

        // Store identifier in localStorage for dashboard
        if (isPhone) {
          localStorage.setItem('userPhone', identifier);
        } else {
          localStorage.setItem('userEmail', identifier);
        }

        alert("Login successful!");
        window.location.href = "dashboard.html"; // redirect
      }
    });

    if (!loginSuccess) {
      alert("Incorrect password");
    }

  } catch (error) {
    console.error("Error logging in:", error);
    alert("Something went wrong. Check console for details.");
  }
});