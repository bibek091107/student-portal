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

/* FIREBASE CONFIG */
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

/* ELEMENTS */
const welcomeEl = document.getElementById("welcomeText");
const nameEl = document.getElementById("profileName");
const emailEl = document.getElementById("profileEmail");
const studentIdEl = document.getElementById("profileStudentId");
const regNoEl = document.getElementById("profileRegNo");
const programEl = document.getElementById("profileProgram");
const logoutBtn = document.getElementById("logoutBtn");
const navImg = document.getElementById("navProfileImg");

/* AUTH CHECK */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "studentlogin.html";
    return;
  }

  emailEl.innerText = user.email;
  let data = null;

  try {
    const docId = user.email.replace(/[@.]/g, "_");
    const ref = doc(db, "Students", docId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      data = snap.data();
    } else {
      const q = query(
        collection(db, "Students"),
        where("email", "==", user.email)
      );
      const qs = await getDocs(q);
      if (!qs.empty) data = qs.docs[0].data();
    }

    if (!data) throw new Error("Student record not found");

    welcomeEl.innerText = `Welcome, ${data.name || "Student"}`;
    nameEl.innerText = data.name || "-";
    studentIdEl.innerText = data.studentId || "-";
    regNoEl.innerText = data.regNo || "-";
    programEl.innerText = data.program || "-";

    navImg.src =
      data.photoUrl && data.photoUrl.trim() !== ""
        ? data.photoUrl
        : "default-avatar.png";

    navImg.onerror = () => (navImg.src = "default-avatar.png");

  } catch (err) {
    console.error(err);
    navImg.src = "default-avatar.png";
  }
});

/* LOGOUT */
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "studentlogin.html";
});
