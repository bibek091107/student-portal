// studentlogin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  query, 
  where, 
  collection, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCqAA39CbpDLXRU9OQ4T1TaKDGs_iPPceE",
  authDomain: "student-management-syste-e3edc.firebaseapp.com",
  projectId: "student-management-syste-e3edc",
  storageBucket: "student-management-syste-e3edc.appspot.com",
  messagingSenderId: "674803364755",
  appId: "1:674803364755:web:ffd5e3e3a852d3624fae66"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginForm = document.getElementById("loginForm");
const identifierInput = document.getElementById("identifier");
const passwordInput = document.getElementById("password");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = identifierInput.value.trim();
  const password = passwordInput.value;

  try {
    let email = identifier;

    // If phone number entered → find email from Firestore
    if (/^\d+$/.test(identifier)) {
      const q = query(
        collection(db, "Students"),
        where("phone", "==", identifier)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("User not found");
        return;
      }

      email = querySnapshot.docs[0].data().email;
    }

    // Firebase Auth login
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = userCredential.user.uid;

    // Fetch student document
    const studentRef = doc(db, "Students", uid);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      alert("Student record not found");
      return;
    }

    const studentData = studentSnap.data();

    // Save session info
    localStorage.setItem("uid", uid);
    localStorage.setItem("userEmail", email);

    // 🔒 Force password change on first login
    if (studentData.firstLogin === true) {
      window.location.href = "change-password.html";
    } else {
      window.location.href = "dashboard.html";
    }

  } catch (error) {
    console.error(error);
    alert("Login failed: " + error.message);
  }
});