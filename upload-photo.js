import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
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

/* ================= CLOUDINARY ================= */
const CLOUD_NAME = "drfbfelhl";
const UPLOAD_PRESET = "student_photo_upload";

/* ================= ELEMENTS ================= */
const photoInput = document.getElementById("photoInput");
const previewImg = document.getElementById("previewImg");
const statusEl = document.getElementById("status");

/* ================= AUTH CHECK ================= */
let studentDocRef = null;

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
    return;
  }

  const data = snap.data();

  // 🚫 Already uploaded → block page
  if (data.photoLocked === true) {
    window.location.href = "student-dashboard.html";
  }
});

/* ================= PREVIEW ================= */
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Only image files allowed");
    photoInput.value = "";
    previewImg.src = "";
    return;
  }

  previewImg.src = URL.createObjectURL(file);
});

/* ================= UPLOAD ================= */
window.uploadPhoto = async function () {
  const file = photoInput.files[0];
  if (!file) {
    alert("Please select a photo");
    return;
  }

  statusEl.textContent = "Uploading...";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();

    if (!data.secure_url) {
      throw new Error("Upload failed");
    }

    // ✅ LOCK PHOTO IN FIRESTORE
    await updateDoc(studentDocRef, {
      photoUrl: data.secure_url,
      photoLocked: true
    });

    statusEl.textContent = "Photo uploaded successfully!";

    setTimeout(() => {
      window.location.href = "student-dashboard.html";
    }, 800);

  } catch (err) {
    console.error(err);
    statusEl.textContent = "Upload error!";
  }
};
