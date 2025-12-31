/************ FIREBASE CONFIG ************/
const PROJECT_ID = "student-management-syste-e3edc";
const COLLECTION = "Students";
/***************************************/

document.addEventListener("DOMContentLoaded", loadProfile);

async function loadProfile() {
  const email = localStorage.getItem("userEmail");
  if (!email) return;

  const docId = email.replace(/[@.]/g, "_");

  const url =
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
    `/databases/(default)/documents/${COLLECTION}/${docId}`;

  const res = await fetch(url);
  const json = await res.json();

  if (!json.fields) return;

  const f = json.fields;

  // PERSONAL INFO
  setText(0, f.name);
  setText(1, f.dob);
  setText(2, f.gender);
  setText(3, f.email);
  setText(4, f.phone);
  setText(5, f.address);

  // ACADEMIC
  setAcademic(2, f.program);
  setAcademic(3, f.batchYear);
  setAcademic(4, f.semester);
  setAcademic(5, f.section);
  setAcademic(6, f.regNo);
  setAcademic(7, f.studentId);
  setAcademic(8, f.modeOfStudy);

  // PARENTS
  setParent(0, f.fatherName);
  setParent(1, f.fatherPhone);
  setParent(2, f.motherName);
  setParent(3, f.motherPhone);
  setParent(4, f.guardian);

  // PHOTO
  const img = document.querySelector(".profile-pic-card img");
  if (img && f.photoUrl?.stringValue) {
    img.src = f.photoUrl.stringValue;
  }
}

/* ========= HELPERS ========= */
function setText(rowIndex, field) {
  const cell = document.querySelectorAll(".profile-top .profile-table tr")[rowIndex]
    ?.children[1];
  if (cell) cell.innerText = field?.stringValue || "—";
}

function setAcademic(rowIndex, field) {
  const rows = document.querySelectorAll(".wide-card:nth-of-type(2) .profile-table tr");
  if (rows[rowIndex]) rows[rowIndex].children[1].innerText = field?.stringValue || "—";
}

function setParent(rowIndex, field) {
  const rows = document.querySelectorAll(".wide-card:nth-of-type(3) .profile-table tr");
  if (rows[rowIndex]) rows[rowIndex].children[1].innerText = field?.stringValue || "—";
}

/* PREVENT BROKEN IMAGE */
const profileImg = document.querySelector(".profile-pic-card img");
if (profileImg) {
  profileImg.onerror = () => {
    profileImg.src = "https://via.placeholder.com/200";
  };
}
