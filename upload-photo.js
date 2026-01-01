import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Elements
const photoInput = document.getElementById("photoInput");
const previewImg = document.getElementById("previewImg");
const statusEl = document.getElementById("status");
const uploadBtn = document.getElementById("uploadBtn");

// Preview image
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

// Upload function
uploadBtn.addEventListener("click", async () => {
  const file = photoInput.files[0];
  if (!file) {
    alert("Please select a photo first!");
    return;
  }

  statusEl.textContent = "Uploading...";
  uploadBtn.disabled = true;

  try {
    // Upload to Firebase Storage
    const storage = getStorage(app);
    const storageRef = ref(storage, `student-photos/${currentUserEmail}_${file.name}`);
    await uploadBytes(storageRef, file);

    // Get public URL
    const photoURL = await getDownloadURL(storageRef);

    // Save URL in Firestore
    const studentDocRef = doc(db, "Students", currentStudentDocId);
    await updateDoc(studentDocRef, {
      photoUrl: photoURL,
      photoLocked: true,
      photoConfirmedAt: new Date()
    });

    statusEl.textContent = "Photo uploaded successfully!";
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = "student-dashboard.html";
    }, 1200);

  } catch (err) {
    console.error(err);
    statusEl.textContent = "Upload failed: " + err.message;
    uploadBtn.disabled = false;
  }
});
