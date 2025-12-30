// common.js (update)

// Sidebar navigation for dashboard sections
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".sidebar ul li:not(#logoutBtn)");

navLinks.forEach((link, index) => {
  link.addEventListener("click", () => {
    // Remove active class from all sections
    sections.forEach(sec => sec.classList.remove("active"));
    // Add active to the section corresponding to clicked link
    if (sections[index]) sections[index].classList.add("active");

    // Optional: highlight sidebar
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// LOGOUT FUNCTIONALITY
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "studentlogin.html";
    }
  });
}
