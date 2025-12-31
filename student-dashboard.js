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

    // 5️⃣ Nav profile image (use existing <img id="navProfileImg">)
    const navImg = document.getElementById("navProfileImg");

    if (data.photoUrl) {
      // Ensure Google Drive link is in direct access format
      let photoLink = data.photoUrl;

      if (photoLink.includes("drive.google.com")) {
        // Convert standard drive link to direct link
        if (photoLink.includes("/file/d/")) {
          const id = photoLink.match(/\/file\/d\/(.*?)\//)[1];
          photoLink = `https://drive.google.com/uc?export=view&id=${id}`;
        } else if (photoLink.includes("id=")) {
          const id = photoLink.split("id=")[1];
          photoLink = `https://drive.google.com/uc?export=view&id=${id}`;
        }
      }

      navImg.src = photoLink;
    } else {
      // fallback image
      navImg.src = "default-avatar.png"; // you can create a default avatar image
    }

      /* ===============================
   LOGOUT FUNCTIONALITY
================================ */
logoutBtn?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    // Redirect to login page after logout
    window.location.href = "studentlogin.html";
  } catch (err) {
    console.error("Logout error:", err);
  }
});


  } catch (err) {
    console.error("Dashboard error:", err);
    nameEl.innerText = "Error loading data";
  }
});
