import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Initialize storage
const storage = getStorage(app);

async function uploadPhoto() {
  const file = document.getElementById("photoInput").files[0];
  if (!file) { alert("Select a photo!"); return; }

  const statusEl = document.getElementById("status");
  statusEl.textContent = "Uploading...";

  // Upload to Storage
  const storageRef = ref(storage, `student-photos/${currentUserEmail}_${file.name}`);
  await uploadBytes(storageRef, file);

  // Get URL
  const photoURL = await getDownloadURL(storageRef);
  statusEl.textContent = "Uploaded!";

  // Save URL in Firestore
  const studentDocRef = doc(db, "Students", currentStudentDocId);
  await updateDoc(studentDocRef, {
    photoUrl: photoURL,
    photoLocked: true,
    photoConfirmedAt: new Date()
  });

  // Redirect to dashboard
  setTimeout(() => { window.location.href = "student-dashboard.html"; }, 1200);
}
