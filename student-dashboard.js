// student-dashboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===============================
   FIREBASE CONFIG
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyCqAA39CbpDLXRU9OQ4T1TaKDGs_iPPceE",
  authDomain: "student-management-syste-e3edc.firebaseapp.com",
  projectId: "student-management-syste-e3edc",
  storageBucket: "student-management-syste-e3edc.appspot.com",
  messagingSenderId: "674803364755",
  appId: "1:674803364755:web:ffd5e3e3a852d3624fae66"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ===============================
   ELEMENTS
================================ */
const welcomeEl = document.getElementById("welcomeText");
const nameEl = document.getElementById("profileName");
const emailEl = document.getElementById("profileEmail");
const studentIdEl = document.getElementById("profileStudentId");
const regNoEl = document.getElementById("profileRegNo");
const programEl = document.getElementById("profileProgram");

const attendanceEl = document.getElementById("attendancePercent");
const totalCoursesEl = document.getElementById("totalCourses");
const performanceEl = document.getElementById("overallPerformance");

const logoutBtn = document.getElementById("logoutBtn");

/* ===============================
   AUTH + LOAD DATA
================================ */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "studentlogin.html";
    return;
  }

  emailEl.innerText = user.email;

  // Firestore document ID
  const docId = user.email.replace(/[@.]/g, "_");

  try {
    const ref = doc(db, "Students", docId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      welcomeEl.innerText = "Welcome";
      nameEl.innerText = "Profile not found";
      studentIdEl.innerText = "-";
      regNoEl.innerText = "-";
      programEl.innerText = "-";
      return;
    }

    const data = snap.data();

    /* ===== PROFILE ===== */
    welcomeEl.innerText = `Welcome, ${data["Name"] || "Student"}`;
    nameEl.innerText = data["Name"] || "-";
    studentIdEl.innerText = data["Student Id/Teacher ID"] || "-";
    regNoEl.innerText = data["Reg No."] || "-";
    programEl.innerText = data["Program/Course"] || "-";

    /* ===== DASHBOARD FIGURES ===== */

    // Attendance %
    const attendance = data.attendancePercent || 0;
    attendanceEl.innerText = attendance + "%";

    // Courses count
    const coursesCount = data.courses?.length || 0;
    totalCoursesEl.innerText = coursesCount;

    // Performance logic
    let performance = "Average";
    if (attendance >= 85) performance = "Excellent";
    else if (attendance >= 75) performance = "Good";
    else performance = "Needs Improvement";

    performanceEl.innerText = performance;

  } catch (err) {
    console.error("Dashboard error:", err);
    nameEl.innerText = "Error loading data";
  }
});

/* ===============================
   LOGOUT
================================ */
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "studentlogin.html";
});
