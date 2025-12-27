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

  const isPhone = /^\d+$/.test(identifier); // check if input is all digits

  // 🔹 Correct collection name (match Firestore exactly)
  const usersRef = collection(db, "Students"); 

  // 🔹 Query based on phone or email
  const q = isPhone
    ? query(usersRef, where("phone", "==", identifier))
    : query(usersRef, where("email", "==", identifier));

  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("User not found");
      return;
    }

    let loginSuccess = false;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.password === password) { // field name matches Firestore
        loginSuccess = true;
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
  } catch (err) {
    console.error("Error fetching user:", err);
    alert("Something went wrong. Check console for details.");
  }
});