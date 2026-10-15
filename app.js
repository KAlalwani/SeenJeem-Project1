const startBtnElement = document.querySelectorAll(".start-btn");
const categoryElement = document.querySelectorAll(".category");

startBtnElement.forEach((button) => {
  button.addEventListener('click', nextPage);
});

categoryElement.forEach((category) => {
  category.addEventListener('click', select);
});

function select(event){
    console.log("hi")
    event.currentTarget.style.backgroundColor = "red";
}

function nextPage(){

}