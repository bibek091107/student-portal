import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
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
const logoutBtn = document.getElementById("logoutBtn");
const navImg = document.getElementById("navProfileImg");

/* ================= DEFAULT AVATAR ================= */
const DEFAULT_AVATAR = "default-avatar.png"; // Make sure this file exists in your repo

/* ================= AUTH CHECK ================= */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Not logged in → redirect
    window.location.href = "studentlogin.html";
    return;
  }

  emailEl.innerText = user.email;

  try {
    let studentData = null;
    const docId = user.email.replace(/[@.]/g, "_");

    // Try fetching by doc ID first
    const docRef = doc(db, "Students", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      studentData = docSnap.data();
    } else {
      // Fallback: query by email
      const q = query(collection(db, "Students"), where("email", "==", user.email));
      const qs = await getDocs(q);
      if (!qs.empty) studentData = qs.docs[0].data();
    }

    if (!studentData) throw new Error("Student record not found");

    // Update dashboard elements
    welcomeEl.innerText = `Welcome, ${studentData.name || "Student"}`;
    nameEl.innerText = studentData.name || "-";
    studentIdEl.innerText = studentData.studentId || "-";
    regNoEl.innerText = studentData.regNo || "-";
    programEl.innerText = studentData.program || "-";

    // Cloudinary photo or default avatar
    navImg.src =
      studentData.photoUrl && studentData.photoUrl.trim() !== ""
        ? studentData.photoUrl
        : DEFAULT_AVATAR;

    // Fallback if image fails to load
    navImg.onerror = () => (navImg.src = DEFAULT_AVATAR);

  } catch (err) {
    console.error(err);
    navImg.src = DEFAULT_AVATAR;
  }
});

/* ================= LOGOUT ================= */
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "studentlogin.html";
});
