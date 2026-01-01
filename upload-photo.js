// ================= FIREBASE SETUP =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config (same as studentlogin.js)
const firebaseConfig = {
  apiKey: "AIzaSyCqAA39CbpDLXRU9OQ4T1TaKDGs_iPPceE",
  authDomain: "student-management-syste-e3edc.firebaseapp.com",
  projectId: "student-management-syste-e3edc",
  storageBucket: "student-management-syste-e3edc.appspot.com",
  messagingSenderId: "674803364755",
  appId: "1:674803364755:web:ffd5e3e3a852d3624fae66"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

// ================= ELEMENTS =================
const photoInput = document.getElementById("photoInput");
const previewImg = document.getElementById("previewImg");
const statusEl = document.getElementById("status");

// ================= PREVIEW IMAGE =================
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("Only image files are allowed!");
    photoInput.value = "";
    previewImg.src = "";
    return;
  }
  previewImg.src = URL.createObjectURL(file);
});

// ================= UPLOAD FUNCTION =================
async function uploadPhoto() {
  const file = photoInput.files[0];
  if (!file) {
    alert("Please select a photo first!");
    return;
  }

  const statusEl = document.getElementById("status");
  statusEl.textContent = "Uploading...";

  try {
    const studentEmail = localStorage.getItem("studentEmail");
    const studentDocId = localStorage.getItem("studentDocId");

    if (!studentEmail || !studentDocId) throw new Error("Session expired. Please login again.");

    // Upload to Firebase Storage
    const storageRef = ref(storage, `student-photos/${studentEmail}_${file.name}`);
    await uploadBytes(storageRef, file);

    // Get download URL
    const photoURL = await getDownloadURL(storageRef);

    // Save URL in Firestore
    const studentDocRef = doc(db, "Students", studentDocId);
    await updateDoc(studentDocRef, {
      photoUrl: photoURL,
      photoLocked: true,
      photoConfirmedAt: new Date()
    });

    statusEl.textContent = "Photo uploaded successfully!";
    setTimeout(() => { window.location.href = "student-dashboard.html"; }, 1200);

  } catch (err) {
    console.error(err);
    statusEl.textContent = "Upload failed: " + err.message;
  }
}

// Attach to window so HTML button can call it
window.uploadPhoto = uploadPhoto;
