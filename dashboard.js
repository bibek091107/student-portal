import { db } from './firebase.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Assuming you store logged-in user's email or phone in localStorage
const userEmail = localStorage.getItem('userEmail'); 
const userPhone = localStorage.getItem('userPhone'); 

const userNameSpan = document.getElementById('userName');
const userEmailSpan = document.getElementById('userEmail');
const userPhoneSpan = document.getElementById('userPhone');
const logoutBtn = document.getElementById('logoutBtn');

async function loadUser() {
  if (!userEmail && !userPhone) {
    alert("Please login first!");
    window.location.href = "studentlogin.html";
    return;
  }

  const isPhone = /^\d+$/.test(userPhone);
  const usersRef = collection(db, "students"); // or "teachers" if needed
  const q = userEmail
    ? query(usersRef, where("email", "==", userEmail))
    : query(usersRef, where("Phone number", "==", Number(userPhone)));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    alert("User data not found!");
    return;
  }

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    userNameSpan.textContent = data.name || "User";
    userEmailSpan.textContent = data.email || "-";
    userPhoneSpan.textContent = data["Phone number"] || "-";
  });
}

// Logout function
logoutBtn.addEventListener('click', () => {
  localStorage.clear();
  window.location.href = "studentlogin.html";
});

// Load user info on page load
loadUser();