// This helps later when you add:
// syllabus modal
// course details page

document.querySelectorAll(".dash-card").forEach(card => {
  card.addEventListener("click", () => {
    const course = card.querySelector("h4")?.innerText;
    console.log(`Course clicked: ${course}`);
  });
});
