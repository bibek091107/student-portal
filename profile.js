import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    // 🔥 Correct document reference
    const docRef = doc(db, "Students", user.uid);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      console.error("Student document not found");
      return;
    }

    const data = snap.data();

    // 🔹 Helper function (prevents errors)
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.innerText = value || "-";
    };

    // 🔹 BASIC INFO
    setText("name", data.name);
    setText("email", data.email);
    setText("phone", data.phone);
    setText("gender", data.gender);
    setText("dob", data.dob);
    setText("address", data.address);

    // 🔹 ACADEMIC INFO
    setText("studentId", data.studentId);
    setText("regNo", data.regNo);
    setText("program", data.program);
    setText("semester", data.semester);
    setText("section", data.section);
    setText("batchYear", data.batchYear);
    setText("modeOfStudy", data.modeOfStudy);

    // 🔹 PARENTS INFO
    setText("fatherName", data.fatherName);
    setText("fatherPhone", data.fatherPhone);
    setText("motherName", data.motherName);
    setText("motherPhone", data.motherPhone);
    setText("guardian", data.guardian);

    // 🔹 PROFILE PHOTO
    const img = document.getElementById("profilePhoto");
    if (img && data.photoUrl) {
      img.src = data.photoUrl;
    }

  } catch (err) {
    console.error("Error loading profile:", err);
  }
});
