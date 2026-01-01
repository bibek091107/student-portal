// upload-photo.js

const CLOUD_NAME = "drfbfelhl"; // your Cloudinary cloud name
const UPLOAD_PRESET = "student_photo_upload"; // your unsigned preset

const photoInput = document.getElementById("photoInput");
const previewImg = document.getElementById("previewImg");
const statusEl = document.getElementById("status");

// Preview image when selected
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

// Upload photo to Cloudinary
async function uploadPhoto() {
  const file = photoInput.files[0];
  if (!file) {
    alert("Please select a photo first!");
    return;
  }

  statusEl.textContent = "Uploading...";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.secure_url) {
      statusEl.textContent = "Photo uploaded successfully!";
      console.log("Cloudinary URL:", data.secure_url);

      // Optionally save the URL to Firestore here using your existing Firebase JS logic
      // Example:
      // const studentDocRef = doc(db, "Students", currentStudentDocId);
      // await updateDoc(studentDocRef, { photoUrl: data.secure_url, photoLocked: true });

      // Redirect after upload
      setTimeout(() => { window.location.href = "student-dashboard.html"; }, 1000);
    } else {
      statusEl.textContent = "Upload failed!";
      console.error(data);
    }
  } catch (err) {
    statusEl.textContent = "Upload error!";
    console.error(err);
  }
}
