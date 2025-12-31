// ===== IMPORTS =====
// Make sure your script tag in HTML uses type="module":
// <script type="module" src="profile.js"></script>
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ===============================
   HELPERS
================================ */
const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.innerText = value || "-";
};

const setImage = (id, url) => {
  const el = document.getElementById(id);
  if (!el) return;

  if (url) {
    let link = url;
    if (link.includes("drive.google.com")) {
      const match = link.match(/[-\w]{25,}/);
      if (match) {
        link = `https://drive.google.com/uc?export=view&id=${match[0]}`;
      }
    }
    el.src = link;
  } else {
    el.src = "default-avatar.png"; // fallback avatar
  }
};

// Format DOB like 01 Jan 2003
const formatDOB = (dobStr) => {
  if (!dobStr) return "-";
  const date = new Date(dobStr);
  if (isNaN(date)) return dobStr; // fallback if invalid
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

/* ===============================
   AUTH + LOAD PROFILE DATA
================================ */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "studentlogin.html";
    return;
  }

  let data = null;

  try {
    // 1️⃣ Try email-based document ID
    const docId = user.email.replace(/[@.]/g, "_");
    const ref = doc(db, "Students", docId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      data = snap.data();
    } else {
      // 2️⃣ Fallback: query by email field
      const q = query(
        collection(db, "Students"),
        where("email", "==", user.email)
      );
      const qs = await getDocs(q);
      if (!qs.empty) data = qs.docs[0].data();
    }

    if (!data) return;

    // ===== PERSONAL INFO =====
    setText("name", data.name);
    setText("cardName", data.name);
    setText("dob", formatDOB(data.dob));
    setText("gender", data.gender);
    setText("email", data.email);
    setText("phone", data.phone);
    setText("address", data.address);

    // ===== ACADEMIC DETAILS =====
    setText("program", data.program);
    setText("program2", data.program);
    setText("batchYear", data.batchYear);
    setText("semester", data.semester);
    setText("section", data.section);
    setText("regNo", data.regNo);
    setText("studentId", data.studentId);
    setText("modeOfStudy", data.modeOfStudy);

    // ===== PARENTS / GUARDIAN =====
    setText("fatherName", data.fatherName);
    setText("fatherPhone", data.fatherPhone);
    setText("motherName", data.motherName);
    setText("motherPhone", data.motherPhone);
    setText("guardian", data.guardian);

    // ===== PROFILE PHOTOS =====
    setImage("profilePhoto", data.photoUrl);
    setImage("navPhoto", data.photoUrl);

  } catch (err) {
    console.error("Profile load error:", err);
  }
});
