//prevents broken image 

const profileImg = document.querySelector(".profile-pic-card img");

if (profileImg) {
  profileImg.onerror = () => {
    profileImg.src = "https://via.placeholder.com/200";
  };
}
