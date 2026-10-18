selectedColor = "red";
unSelectedColor = "rgb(238, 130, 238)";
selectedCount = 0;

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
  console.log(selectedCount);
  if(selectedCount === 5) {
      window.location.href = "./team.html";
  }
}
