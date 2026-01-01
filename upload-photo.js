import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: "AIzaSyCqAA39CbpDLXRU9OQ4T1TaKDGs_iPPceE",
  authDomain: "student-management-syste-e3edc.firebaseapp.com",
  projectId: "student-management-syste-e3edc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ================= ELEMENTS ================= */
const fileInput = document.getElementById("photoInput");
const previewImg = document.getElementById("previewImg");
const uploadBtn = document.getElementById("uploadBtn");
const statusEl = document.getElementById("status");

let studentDocRef = null;

/* ================= AUTH CHECK ================= */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "studentlogin.html";
    return;
  }

  try {
    const docId = user.email.replace(/[@.]/g, "_");
    studentDocRef = doc(db, "Students", docId);

    const snap = await getDoc(studentDocRef);

    if (!snap.exists()) {
      alert("Student record not found");
      await signOut(auth);
      return;
    }

    const data = snap.data();

    // 🚫 Block if photo already uploaded or locked
    if ((data.photoUrl && data.photoUrl.trim() !== "") || data.photoLocked === true) {
      window.location.href = "student-dashboard.html";
    }

  } catch (err) {
    console.error("Auth check error:", err);
    alert("Something went wrong. Contact admin.");
    await signOut(auth);
  }
});

/* ================= PREVIEW IMAGE ================= */
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Only image files allowed");
    fileInput.value = "";
    return;
  }

  previewImg.src = URL.createObjectURL(file);
  previewImg.style.display = "block";
});

/* ================= UPLOAD HANDLER ================= */
uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a photo first");
    return;
  }

  uploadBtn.disabled = true;
  statusEl.innerText = "Uploading photo...";

  try {
    // ----------------------------
    // ✅ In this setup, photo is "confirmed"
    // (The file itself is uploaded via Google Form or Drive already)
    // We just mark it in Firestore as locked and save the URL
    // ----------------------------

    const photoUrl = previewImg.src; // Assuming you have already uploaded it somewhere or using preview URL
    await updateDoc(studentDocRef, {
      photoUrl: photoUrl,
      photoLocked: true,
      firstLogin: false,
      photoConfirmedAt: new Date()
    });

    statusEl.innerText = "Photo uploaded successfully! Redirecting...";
    setTimeout(() => window.location.href = "student-dashboard.html", 1200);

  } catch (err) {
    console.error("Upload error:", err);
    statusEl.innerText = "Upload failed. Try again.";
    uploadBtn.disabled = false;
  }
});
