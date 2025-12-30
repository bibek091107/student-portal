const totalDays = 150;
const attendancePercent = 82;

const presentDays = Math.round((attendancePercent / 100) * totalDays);
const absentDays = totalDays - presentDays;

const circle = document.getElementById("attendanceCircle");
const tooltip = document.getElementById("attendanceTooltip");
const percentText = document.getElementById("attendancePercent");

if (circle && tooltip && percentText) {
  percentText.innerText = attendancePercent + "%";

  circle.style.background = `
    conic-gradient(
      #22c55e 0% ${attendancePercent}%,
      #ef4444 ${attendancePercent}% 100%
    )
  `;

  tooltip.innerHTML = `
    Present: ${presentDays} Days<br>
    Absent: ${absentDays} Days
  `;

  circle.addEventListener("mouseenter", () => tooltip.style.opacity = "1");
  circle.addEventListener("mouseleave", () => tooltip.style.opacity = "0");
}
