// student-dashboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config
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

// HTML elements
const welcomeEl = document.getElementById("welcomeText");
const nameEl = document.getElementById("profileName");
const emailEl = document.getElementById("profileEmail");
const studentIdEl = document.getElementById("profileStudentId");
const regNoEl = document.getElementById("profileRegNo");
const programEl = document.getElementById("profileProgram");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // User not logged in → redirect
    window.location.href = "studentlogin.html";
    return;
  }

  try {
    console.log("Logged-in user email:", user.email);

    // Query Students collection by Email field
    const studentsRef = collection(db, "Students");
    const q = query(studentsRef, where("Email", "==", user.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // No profile found
      console.warn("No student document found for email:", user.email);
      welcomeEl.innerText = "Welcome";
      nameEl.innerText = "Profile not found";
      emailEl.innerText = user.email;
      studentIdEl.innerText = "-";
      regNoEl.innerText = "-";
      programEl.innerText = "-";
      return;
    }

    // Use the first matched document
    const firstDoc = querySnapshot.docs[0];
    if (!firstDoc) {
      welcomeEl.innerText = "Welcome";
      nameEl.innerText = "Profile not found";
      emailEl.innerText = user.email;
      studentIdEl.innerText = "-";
      regNoEl.innerText = "-";
      programEl.innerText = "-";
      return;
    }

    const data = firstDoc.data();

    // Update dashboard fields dynamically
    welcomeEl.innerText = `Welcome, ${data["Name"] || "Student"}`;
    nameEl.innerText = data["Name"] || "Student";
    emailEl.innerText = data["Email"] || user.email;
    studentIdEl.innerText = data["Student Id/Teacher ID"] || "-";
    regNoEl.innerText = data["Reg No."] || "-";
    programEl.innerText = data["Program/Course"] || "-";

  } catch (error) {
    console.error("Error loading student profile:", error);
    welcomeEl.innerText = "Welcome";
    nameEl.innerText = "Error loading name";
    emailEl.innerText = "Error loading email";
    studentIdEl.innerText = "-";
    regNoEl.innerText = "-";
    programEl.innerText = "-";
  }
});
