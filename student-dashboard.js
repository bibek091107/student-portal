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

  if (emailEl) emailEl.innerText = user.email;

  // Firestore document ID (EMAIL BASED)
  const docId = user.email.replace(/[@.]/g, "_");

  try {
    const ref = doc(db, "Students", docId);
    const snap = await getDoc(ref);

    // FIRST LOGIN / PROFILE NOT YET CREATED
    if (!snap.exists()) {
      welcomeEl.innerText = "Welcome!";
      nameEl.innerText = "Profile not created yet";
      studentIdEl.innerText = "—";
      regNoEl.innerText = "—";
      programEl.innerText = "—";

      if (attendanceEl) attendanceEl.innerText = "0%";
      if (totalCoursesEl) totalCoursesEl.innerText = "0";
      if (performanceEl) performanceEl.innerText = "N/A";
      return;
    }

    const data = snap.data();

    /* ===== PROFILE DATA (MATCH FIRESTORE KEYS) ===== */
    welcomeEl.innerText = `Welcome, ${data.name || "Student"}`;
    nameEl.innerText = data.name || "-";
    studentIdEl.innerText = data.studentId || "-";
    regNoEl.innerText = data.regNo || "-";
    programEl.innerText = data.program || "-";

    /* ===== DASHBOARD FIGURES ===== */

    // Attendance %
    const attendance = Number(data.attendancePercent || 0);
    if (attendanceEl) attendanceEl.innerText = attendance + "%";

    // Total courses
    const coursesCount = Array.isArray(data.courses)
      ? data.courses.length
      : 0;
    if (totalCoursesEl) totalCoursesEl.innerText = coursesCount;

    // Performance
    let performance = "Average";
    if (attendance >= 85) performance = "Excellent";
    else if (attendance >= 75) performance = "Good";
    else if (attendance > 0) performance = "Needs Improvement";
    else performance = "N/A";

    if (performanceEl) performanceEl.innerText = performance;

  } catch (err) {
    console.error("Dashboard error:", err);
    nameEl.innerText = "Error loading data";
  }
});

/* ===============================
   LOGOUT
================================ */
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "studentlogin.html";
  });
}
