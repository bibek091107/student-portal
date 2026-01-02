import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: "AIzaSyCqAA39CbpDLXRU9OQ4T1TaKDGs_iPPceE",
  authDomain: "student-management-syste-e3edc.firebaseapp.com",
  projectId: "student-management-syste-e3edc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= ELEMENTS ================= */
const photoInput = document.getElementById("photoInput");
const uploadBtn = document.getElementById("uploadBtn");

/* ================= CLOUDINARY ================= */
const CLOUD_NAME = "drfbfelhl";
const UPLOAD_PRESET = "student_photo_upload";

uploadBtn.addEventListener("click", async () => {
  const file = photoInput.files[0];
  if (!file) {
    alert("Please select a photo");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "student-photos");

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();

    if (!data.secure_url) {
      throw new Error("Upload failed");
    }

    const studentDocId = localStorage.getItem("studentDocId");

    await updateDoc(doc(db, "Students", studentDocId), {
      photoLocked: true,
      photoURL: data.secure_url
    });

    window.location.href = "student-dashboard.html";

  } catch (err) {
    console.error(err);
    alert("Photo upload failed");
  }
});
