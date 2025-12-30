// Highlight active sidebar link
const sidebarLinks = document.querySelectorAll(".sidebar li");

sidebarLinks.forEach(link => {
  if (window.location.href.includes(link.getAttribute("onclick")?.match(/'(.*?)'/)?.[1])) {
    link.classList.add("active");
  }
});

/* LOGOUT FUNCTIONALIT */
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      // Clear stored data (session simulation)
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to login page
      window.location.href = "login.html";
    }
  });
}
