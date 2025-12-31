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

/* ================= FIREBASE CONFIG ================= */
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

/* ================= ELEMENTS ================= */
const welcomeEl = document.getElementById("welcomeText");
const nameEl = document.getElementById("profileName");
const emailEl = document.getElementById("profileEmail");
const studentIdEl = document.getElementById("profileStudentId");
const regNoEl = document.getElementById("profileRegNo");
const programEl = document.getElementById("profileProgram");

const profilePhotoEl = document.getElementById("profilePhoto");
const logoutBtn = document.getElementById("logoutBtn");

/* ================= AUTH + LOAD ================= */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "studentlogin.html";
    return;
  }

  emailEl.innerText = user.email;

  const docId = user.email.replace(/[@.]/g, "_");

  try {
    const snap = await getDoc(doc(db, "Students", docId));

    if (!snap.exists()) {
      welcomeEl.innerText = "Welcome!";
      return;
    }

    const data = snap.data();

    /* ===== PROFILE DATA ===== */
    welcomeEl.innerText = `Welcome, ${data.name || "Student"}`;
    nameEl.innerText = data.name || "-";
    studentIdEl.innerText = data.studentId || "-";
    regNoEl.innerText = data.regNo || "-";
    programEl.innerText = data.program || "-";

    /* ===== PROFILE IMAGE ===== */
    if (data.photoUrl && profilePhotoEl) {
      let url = data.photoUrl;

      // Convert Google Drive link to direct image
      if (url.includes("drive.google.com")) {
        const idMatch = url.match(/id=([^&]+)/);
        if (idMatch) {
          url = `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
        }
      }

      profilePhotoEl.src = url;
    }

  } catch (err) {
    console.error("Dashboard error:", err);
  }
});

/* ================= LOGOUT ================= */
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "studentlogin.html";
  });
}
