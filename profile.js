// ===== IMPORTS =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

/* ================= HELPERS ================= */
const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.innerText = value || "-";
};

const setImage = (id, url) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.src = url || "default-avatar.png";
};

const formatDOB = (dobStr) => {
  if (!dobStr) return "-";
  const d = new Date(dobStr);
  if (isNaN(d)) return dobStr;
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

/* ================= LOAD PROFILE ================= */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "studentlogin.html";
    return;
  }

  try {
    let data = null;

    // ✅ 1️⃣ ALWAYS TRY STORED DOC ID FIRST
    const storedDocId = localStorage.getItem("studentDocId");

    if (storedDocId) {
      const snap = await getDoc(doc(db, "Students", storedDocId));
      if (snap.exists()) data = snap.data();
    }

    // 🔁 2️⃣ FALLBACK: QUERY BY EMAIL
    if (!data) {
      const q = query(
        collection(db, "Students"),
        where("email", "==", user.email)
      );
      const qs = await getDocs(q);
      if (!qs.empty) data = qs.docs[0].data();
    }

    if (!data) return;

    // ===== PERSONAL =====
    setText("name", data.name);
    setText("cardName", data.name);
    setText("dob", formatDOB(data.dob));
    setText("gender", data.gender);
    setText("email", data.email);
    setText("phone", data.phone);
    setText("address", data.address);

    // ===== ACADEMIC =====
    setText("program", data.program);
    setText("program2", data.program);
    setText("batchYear", data.batchYear);
    setText("semester", data.semester);
    setText("section", data.section);
    setText("regNo", data.regNo);
    setText("studentId", data.studentId);
    setText("modeOfStudy", data.modeOfStudy);

    // ===== GUARDIAN =====
    setText("fatherName", data.fatherName);
    setText("fatherPhone", data.fatherPhone);
    setText("motherName", data.motherName);
    setText("motherPhone", data.motherPhone);
    setText("guardian", data.guardian);

    // ✅ PROFILE PHOTO (NOW WORKS)
    setImage("profilePhoto", data.photoUrl);
    setImage("navPhoto", data.photoUrl);

  } catch (err) {
    console.error("Profile load error:", err);
  }
});
