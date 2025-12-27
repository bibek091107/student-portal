// studentlogin.js
import { db } from './firebase.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('password');
const identifierInput = document.getElementById('identifier');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const identifier = identifierInput.value.trim();
  const password = passwordInput.value;

  const isPhone = /^\d+$/.test(identifier); // detect if input is phone number
  const usersRef = collection(db, "students"); // Firestore collection

  const q = isPhone
    ? query(usersRef, where("phone", "==", identifier))  // phone as string
    : query(usersRef, where("email", "==", identifier));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    alert("User not found");
    return;
  }

  let loginSuccess = false;
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.password === password) { // updated password field
      loginSuccess = true;
      if (isPhone) {
        localStorage.setItem('userPhone', identifier);
      } else {
        localStorage.setItem('userEmail', identifier);
      }
      alert("Login successful!");
      window.location.href = "dashboard.html";
    }
  });

  if (!loginSuccess) {
    alert("Incorrect password");
  }
});