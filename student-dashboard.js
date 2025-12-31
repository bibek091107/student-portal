import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===============================
   FIREBASE CONFIG
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyCqAA39CbpDLXRU9OQ4T1TaKDGs_iPPceE",
  authDomain: "student-management-syste-e3edc.firebaseapp.com",
  projectId: "student-management-syste-e3edc",
  storageBucket: "student-management-syste-e3edc.appspot.com",
  messagingSenderId: "674803364755",
  appId: "1:674803364755:web:ffd5e3e3a852d3624fae66"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ===============================
   ELEMENTS
================================ */
const welcomeEl = document.getElementById("welcomeText");
const nameEl = document.getElementById("profileName");
const emailEl = document.getElementById("profileEmail");
const studentIdEl = document.getElementById("profileStudentId");
const regNoEl = document.getElementById("profileRegNo");
const programEl = document.getElementById("profileProgram");
const logoutBtn = document.getElementById("logoutBtn");
const navProfileContainer = document.querySelector(".nav-profile");

/* ===============================
   AUTH + LOAD DATA
================================ */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "studentlogin.html";
    return;
  }

  emailEl.innerText = user.email;
  let data = null;

  try {
    // 1️⃣ Try old method (email as doc ID)
    const emailDocId = user.email.replace(/[@.]/g, "_");
    const emailDocRef = doc(db, "Students", emailDocId);
    const emailSnap = await getDoc(emailDocRef);

    if (emailSnap.exists()) {
      data = emailSnap.data();
    } else {
      // 2️⃣ Try new method (query by email field)
      const q = query(
        collection(db, "Students"),
        where("email", "==", user.email)
      );
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        data = querySnap.docs[0].data();
      }
    }

    // 3️⃣ No record found
    if (!data) {
      welcomeEl.innerText = "Welcome";
      nameEl.innerText = "Student record not found";
      studentIdEl.innerText = "-";
      regNoEl.innerText = "-";
      programEl.innerText = "-";
      return;
    }

    // 4️⃣ Profile Data
    welcomeEl.innerText = `Welcome, ${data.name || "Student"}`;
    nameEl.innerText = data.name || "-";
    studentIdEl.innerText = data.studentId || "-";
    regNoEl.innerText = data.regNo || "-";
    programEl.innerText = data.program || "-";

// 5️⃣ Nav profile image
    if (data.photoUrl) {
      const img = document.createElement("img");
      // Ensure the Google Drive link is in "uc?export=view&id=" format
      img.src = data.photoUrl.includes("drive.google.com") && !data.photoUrl.includes("uc?export=view")
        ? data.photoUrl.replace("/open?id=", "/uc?export=view&id=")
        : data.photoUrl;
  img.alt = "Profile";
      img.style.width = "50px";
      img.style.height = "50px";
      img.style.borderRadius = "50%";
      img.style.objectFit = "cover";
      // Replace the emoji with the image
      navProfileContainer.innerHTML = "";
      navProfileContainer.appendChild(img);
    } else {
      // Fallback if no photo
      navProfileContainer.innerText = "👤";
    }
  } catch (err) {
    console.error("Dashboard error:", err);
    nameEl.innerText = "Error loading data";
  }
});


/* ===============================
   LOGOUT
================================ */
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "studentlogin.html";
});
