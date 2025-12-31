document.addEventListener("DOMContentLoaded", () => {
  const percentCell = document.getElementById("overallPercent");

  if (!percentCell) return;

  const percent = parseFloat(percentCell.innerText);

  if (percent >= 85) {
    percentCell.style.color = "#16a34a"; // green
  } else if (percent >= 75) {
    percentCell.style.color = "#2563eb"; // blue
  } else {
    percentCell.style.color = "#dc2626"; // red
  }
});
