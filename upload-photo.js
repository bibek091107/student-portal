import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===============================
   FIREBASE CONFIG
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyCqAA39CbpDLXRU9OQ4T1TaKDGs_iPPceE",
  authDomain: "student-management-syste-e3edc.firebaseapp.com",
  projectId: "student-management-syste-e3edc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ===============================
   ELEMENTS
================================ */
const fileInput = document.getElementById("photoInput");
const previewImg = document.getElementById("previewImg");
const uploadBtn = document.getElementById("uploadBtn");
const statusEl = document.getElementById("status");

let studentDocRef = null;

/* ===============================
   AUTH CHECK
================================ */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "studentlogin.html";
    return;
  }

  const docId = user.email.replace(/[@.]/g, "_");
  studentDocRef = doc(db, "Students", docId);

  const snap = await getDoc(studentDocRef);

  if (!snap.exists()) {
    alert("Student record not found");
    auth.signOut();
    return;
  }

  const data = snap.data();

  // 🚫 Block if photo already uploaded
  if (data.photoUrl && data.photoUrl.trim() !== "") {
    window.location.href = "student-dashboard.html";
  }
});

/* ===============================
   PREVIEW IMAGE
================================ */
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Only image files allowed");
    fileInput.value = "";
    return;
  }

  previewImg.src = URL.createObjectURL(file);
});

/* ===============================
   UPLOAD HANDLER
================================ */
uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a photo");
    return;
  }

  uploadBtn.disabled = true;
  statusEl.innerText = "Uploading photo...";

  /*
    IMPORTANT:
    At this point you ALREADY upload photos via:
    Google Form → Apps Script → Drive → Firestore

    So here we DO NOT upload again.
    We ONLY block further uploads and redirect.
  */

  await updateDoc(studentDocRef, {
    photoLocked: true,
    firstLogin: false
  });

  statusEl.innerText = "Photo uploaded successfully";

  setTimeout(() => {
    window.location.href = "student-dashboard.html";
  }, 1200);
});
