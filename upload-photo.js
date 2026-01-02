import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= FIREBASE ================= */
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

let studentRef = null;

/* ================= AUTH CHECK ================= */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "studentlogin.html";
    return;
  }

  const email = user.email.toLowerCase();
  const docId = email.replace(/[@.]/g, "_");

  studentRef = doc(db, "Students", docId);

  const snap = await getDoc(studentRef);

  if (!snap.exists()) {
    alert("Student document not found");
    return;
  }

  if (snap.data().photoLocked === true) {
    window.location.href = "student-dashboard.html";
  }
});

/* ================= PREVIEW ================= */
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file || !file.type.startsWith("image/")) {
    alert("Select a valid image");
    photoInput.value = "";
    previewImg.src = "";
    return;
  }
  previewImg.src = URL.createObjectURL(file);
});

/* ================= UPLOAD ================= */
window.uploadPhoto = async function () {
  if (!studentRef) {
    alert("Auth not ready");
    return;
  }

  const file = photoInput.files[0];
  if (!file) {
    alert("Select a photo first");
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
    if (!data.secure_url) throw new Error("Cloudinary upload failed");

    console.log("Uploading Firestore update...");

    await updateDoc(studentRef, {
      photoUrl: data.secure_url,
      photoLocked: true
    });

    console.log("Firestore updated successfully");

    statusEl.textContent = "Upload successful!";
    setTimeout(() => {
      window.location.href = "student-dashboard.html";
    }, 800);

  } catch (err) {
    console.error(err);
    statusEl.textContent = "Upload failed!";
    alert(err.message);
  }
};
