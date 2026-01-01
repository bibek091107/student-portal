// -------------------- IMPORTS --------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// -------------------- FIREBASE CONFIG --------------------
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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// -------------------- ELEMENTS --------------------
const photoInput = document.getElementById("photoInput");
const previewImg = document.getElementById("previewImg");
const uploadBtn = document.getElementById("uploadBtn");
const statusEl = document.getElementById("status");

// -------------------- VARIABLES --------------------
// These must come from your login page/session
let currentUserEmail = localStorage.getItem("studentEmail"); 
let currentStudentDocId = localStorage.getItem("studentDocId");

// -------------------- IMAGE PREVIEW --------------------
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

// -------------------- UPLOAD FUNCTION --------------------
uploadBtn.addEventListener("click", async () => {
  const file = photoInput.files[0];
  if (!file) {
    alert("Please select a photo first!");
    return;
  }

  statusEl.textContent = "Uploading...";

  try {
    // Upload to Firebase Storage
    const storageRef = ref(storage, `student-photos/${currentUserEmail}_${file.name}`);
    await uploadBytes(storageRef, file);

    // Get download URL
    const photoURL = await getDownloadURL(storageRef);

    // Save URL in Firestore
    const studentDocRef = doc(db, "Students", currentStudentDocId);
    await updateDoc(studentDocRef, {
      photoUrl: photoURL,
      photoLocked: true,
      photoConfirmedAt: new Date()
    });

    statusEl.textContent = "Photo uploaded successfully! Redirecting...";
    setTimeout(() => {
      window.location.href = "student-dashboard.html";
    }, 1200);

  } catch (err) {
    console.error(err);
    statusEl.textContent = "Upload failed: " + err.message;
  }
});
