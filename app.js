selectedColor = "red";
unSelectedColor = "rgb(238, 130, 238)";
selectedCount = 0

const startBtnElement = document.querySelectorAll(".start-btn");
const categoryElement = document.querySelectorAll(".category");

startBtnElement.forEach((button) => {
  button.addEventListener("click", nextPage);
});

categoryElement.forEach((category) => {
  category.addEventListener("click", select);
});

function select(event) {
  console.log("slecet category");
  let color = getComputedStyle(event.currentTarget).backgroundColor;
  console.log(color);
  if (color === unSelectedColor) {
    event.currentTarget.style.backgroundColor = "red";
    selectedCount++;
    console.log(selectedCount);
  } else {
    event.currentTarget.style.backgroundColor = "violet";
    color = false;
    selectedCount--;
    console.log(selectedCount);
  }
}

function nextPage() {
  let url = window.location.href;
  console.log(url);
  if (url === "http://127.0.0.1:5500/projects/SeenJeem-Project1/index.html" && selectedCount === 5) {
    console.log("redirect");
    window.location.href = "./team.html";
}
}
