// ===================== IMPORT FIREBASE =====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===================== FIREBASE CONFIG =====================
const firebaseConfig = {
  apiKey: "AIzaSyCqAA39CbpDLXRU9OQ4T1TaKDGs_iPPceE",
  authDomain: "student-management-syste-e3edc.firebaseapp.com",
  projectId: "student-management-syste-e3edc",
  storageBucket: "student-management-syste-e3edc.appspot.com",
  messagingSenderId: "674803364755",
  appId: "1:674803364755:web:ffd5e3e3a852d3624fae66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

// ===================== ELEMENTS =====================
const photoInput = document.getElementById("photoInput");
const previewImg = document.getElementById("previewImg");
const statusEl = document.getElementById("status");
const uploadBtn = document.getElementById("uploadBtn");

// ===================== GLOBAL VARIABLES =====================
// These variables must be set after login (from studentlogin.js)
let currentUserEmail = localStorage.getItem("studentEmail") || ""; 
let currentStudentDocId = localStorage.getItem("studentDocId") || "";

// ===================== IMAGE PREVIEW =====================
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

// ===================== UPLOAD PHOTO =====================
uploadBtn.addEventListener("click", async () => {
  const file = photoInput.files[0];
  if (!file) {
    alert("Please select a photo first!");
    return;
  }

  if (!currentUserEmail || !currentStudentDocId) {
    alert("Session expired. Login again.");
    window.location.href = "studentlogin.html";
    return;
  }

  statusEl.textContent = "Uploading...";

  try {
    const storageRef = ref(storage, `student-photos/${currentUserEmail}_${file.name}`);
    
    // Upload file
    await uploadBytes(storageRef, file);

    // Get URL
    const photoURL = await getDownloadURL(storageRef);

    // Update Firestore
    const studentDocRef = doc(db, "Students", currentStudentDocId);
    await updateDoc(studentDocRef, {
      photoUrl: photoURL,
      photoLocked: true,
      photoConfirmedAt: new Date()
    });

    statusEl.textContent = "Uploaded successfully!";
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = "student-dashboard.html";
    }, 1200);

  } catch (err) {
    console.error(err);
    statusEl.textContent = "Upload failed: " + err.message;
  }
});
