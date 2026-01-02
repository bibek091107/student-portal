// upload-photo.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const db = getFirestore(app);

/* ================= CLOUDINARY ================= */
const CLOUD_NAME = "drfbfelhl";
const UPLOAD_PRESET = "student_photo_upload";

/* ================= ELEMENTS ================= */
const photoInput = document.getElementById("photoInput");
const previewImg = document.getElementById("previewImg");
const statusEl = document.getElementById("status");

/* ================= IMAGE PREVIEW ================= */
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

/* ================= UPLOAD FUNCTION ================= */
window.uploadPhoto = async function () {
  const file = photoInput.files[0];
  if (!file) {
    alert("Please select a photo first");
    return;
  }

  const studentDocId = localStorage.getItem("studentDocId");
  if (!studentDocId) {
    alert("Session expired. Please login again.");
    window.location.href = "studentlogin.html";
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
      throw new Error("Cloudinary upload failed");
    }

    // ✅ Save photo URL + lock photo
    await updateDoc(doc(db, "Students", studentDocId), {
      photoUrl: data.secure_url,
      photoLocked: true
    });

    statusEl.textContent = "Photo uploaded successfully!";

    setTimeout(() => {
      window.location.href = "student-dashboard.html";
    }, 1000);

  } catch (err) {
    console.error(err);
    statusEl.textContent = "Upload failed!";
    alert("Photo upload failed");
  }
};
