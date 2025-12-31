import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
   HELPER FUNCTIONS
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
      if (match) link = `https://drive.google.com/uc?export=view&id=${match[0]}`;
    }
    el.src = link;
  } else {
    el.src = "default-avatar.png";
  }
};

/* ===============================
   LOAD PROFILE DATA
================================ */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "studentlogin.html";
    return;
  }

  try {
    // ✅ Query Firestore by email field
    const studentsRef = collection(db, "Students");
    const q = query(studentsRef, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("No student record found!");
      return;
    }

    const data = querySnapshot.docs[0].data();

    // ----------------------
    // Personal Info
    // ----------------------
    setText("name", data.name);
    setText("cardName", data.name);
    setText("dob", data.dob);
    setText("gender", data.gender);
    setText("email", data.email);
    setText("phone", data.phone);
    setText("address", data.address);

    // ----------------------
    // Academic Info
    // ----------------------
    setText("program", data.program);
    setText("program2", data.program);
    setText("batchYear", data.batchYear);
    setText("semester", data.semester);
    setText("section", data.section);
    setText("regNo", data.regNo);
    setText("studentId", data.studentId);
    setText("modeOfStudy", data.modeOfStudy);

    // ----------------------
    // Parents / Guardian
    // ----------------------
    setText("fatherName", data.fatherName);
    setText("fatherPhone", data.fatherPhone);
    setText("motherName", data.motherName);
    setText("motherPhone", data.motherPhone);
    setText("guardian", data.guardian);

    // ----------------------
    // Profile Photo
    // ----------------------
    setImage("profilePhoto", data.photoUrl);
    setImage("navPhoto", data.photoUrl);

  } catch (err) {
    console.error("Error loading profile:", err);
  }
});
