// student-dashboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqAA39CbpDLXRU9OQ4T1TaKDGs_iPPceE",
  authDomain: "student-management-syste-e3edc.firebaseapp.com",
  projectId: "student-management-syste-e3edc",
  storageBucket: "student-management-syste-e3edc.appspot.com",
  messagingSenderId: "674803364755",
  appId: "1:674803364755:web:ffd5e3e3a852d3624fae66"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const welcomeEl = document.getElementById("welcomeText");
const nameEl = document.getElementById("profileName");
const emailEl = document.getElementById("profileEmail");
const studentIdEl = document.getElementById("profileStudentId");
const regNoEl = document.getElementById("profileRegNo");
const programEl = document.getElementById("profileProgram");
const logoutBtn = document.getElementById("logoutBtn");

// Auth check
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "studentlogin.html";
    return;
  }

  emailEl.innerText = user.email;

  try {
    // 🔥 SEARCH STUDENT BY EMAIL
    const q = query(
      collection(db, "Students"),
      where("Email", "==", user.email)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      welcomeEl.innerText = "Welcome";
      nameEl.innerText = "Profile not found";
      studentIdEl.innerText = "-";
      regNoEl.innerText = "-";
      programEl.innerText = "-";
      return;
    }

    // Take first matching document
    const data = snapshot.docs[0].data();

    welcomeEl.innerText = `Welcome, ${data["Name"] || "Student"}`;
    nameEl.innerText = data["Name"] || "-";
    studentIdEl.innerText = data["Student Id/Teacher ID"] || "-";
    regNoEl.innerText = data["Reg No."] || "-";
    programEl.innerText = data["Program/Course"] || "-";

  } catch (error) {
    console.error(error);
    nameEl.innerText = "Error loading profile";
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "studentlogin.html";
});

// Sidebar navigation
const navItems = document.querySelectorAll(".sidebar li[data-section]");
const sections = document.querySelectorAll(".section");

navItems.forEach(item => {
  item.addEventListener("click", () => {
    // Remove active class
    navItems.forEach(i => i.classList.remove("active"));
    sections.forEach(sec => sec.classList.remove("active"));

    // Activate clicked
    item.classList.add("active");
    document
      .getElementById(item.dataset.section)
      .classList.add("active");
  });
});

