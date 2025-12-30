
//ADD automatic result and grade value 

const percentageCell = document.querySelector("td strong");

if (percentageCell) {
  const percent = parseFloat(percentageCell.innerText);

  if (percent >= 85) percentageCell.style.color = "#16a34a";
  else if (percent >= 75) percentageCell.style.color = "#2563eb";
  else percentageCell.style.color = "#dc2626";
}
