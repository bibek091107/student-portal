document.querySelectorAll(".profile-table tr").forEach(row => {
  row.addEventListener("mouseenter", () => {
    row.style.background = "#f1f5f9";
  });
  row.addEventListener("mouseleave", () => {
    row.style.background = "";
  });
});
