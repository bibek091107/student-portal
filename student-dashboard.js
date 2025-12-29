import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCqAA39CbpDLXRU9OQ4T1TaKDGs_iPPceE",
  authDomain: "student-management-syste-e3edc.firebaseapp.com",
  projectId: "student-management-syste-e3edc",
  storageBucket: "student-management-syste-e3edc.firebasestorage.app",
  messagingSenderId: "674803364755",
  appId: "1:674803364755:web:ffd5e3e3a852d3624fae66"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ HTML elements
const welcomeEl = document.getElementById("welcomeText");
const nameEl = document.getElementById("profileName");
const emailEl = document.getElementById("profileEmail");
const studentIdEl = document.getElementById("profileStudentId");
const regNoEl = document.getElementById("profileRegNo");
const programEl = document.getElementById("profileProgram");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "studentlogin.html";
    return;
  }

  try {
    // 🔹 Query Students collection by email
    const studentsRef = collection(db, "Students");
    const q = query(studentsRef, where("Email", "==", user.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      welcomeEl.innerText = "Welcome";
      nameEl.innerText = "Profile not found";
      emailEl.innerText = user.email;
      studentIdEl.innerText = "-";
      regNoEl.innerText = "-";
      programEl.innerText = "-";
      return;
    }

    // 🔹 Use the first matched document
    const data = querySnapshot.docs[0].data();

    // Update dashboard fields
    const name = data["Name"] || "Student";
    const email = data["Email"] || user.email;
    const studentId = data["Student Id/Teacher ID"] || "-";
    const regNo = data["Reg No."] || "-";
    const program = data["Program/Course"] || "-";

    welcomeEl.innerText = `Welcome, ${name}`;
    nameEl.innerText = name;
    emailEl.innerText = email;
    studentIdEl.innerText = studentId;
    regNoEl.innerText = regNo;
    programEl.innerText = program;

  } catch (error) {
    console.error(error);
    welcomeEl.innerText = "Welcome";
    nameEl.innerText = "Error loading name";
    emailEl.innerText = "Error loading email";
    studentIdEl.innerText = "-";
    regNoEl.innerText = "-";
    programEl.innerText = "-";
  }
});
