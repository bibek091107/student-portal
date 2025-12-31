const d = window.userData || {};

const map = {
  name: "name",
  dob: "dob",
  gender: "gender",
  email: "email",
  phone: "phone",
  address: "address",
  program: "program",
  program2: "program",
  batchYear: "batchYear",
  semester: "semester",
  section: "section",
  regNo: "regNo",
  studentId: "studentId",
  modeOfStudy: "modeOfStudy",
  fatherName: "fatherName",
  fatherPhone: "fatherPhone",
  motherName: "motherName",
  motherPhone: "motherPhone",
  guardian: "guardian"
};

Object.keys(map).forEach(id => {
  const el = document.getElementById(id);
  if (el) el.textContent = d[map[id]] || "—";
});

const photo = d.photoUrl || "https://via.placeholder.com/200";
document.getElementById("profilePhoto").src = photo;
document.getElementById("navPhoto").src = photo;
document.getElementById("cardName").textContent = d.name || "";
