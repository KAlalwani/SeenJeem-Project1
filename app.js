selectedColor = "red";
unSelectedColor = "rgb(238, 130, 238)";
selectedCount = 0;
selectedCategories = 5;
MaxRounds = selectedCategories * 5;
points = null;
rounds = 1
lifeline = 0;
team1 = true;

const startBtnElement = document.querySelectorAll(".start-btn");
const categoryElement = document.querySelectorAll(".category");
const teamNameElement = document.querySelectorAll(".team-names");
const roundsCheckBoxElement = document.querySelector("#rounds");
const pointsCheckBoxElement = document.querySelector("#points");
const roundsAmountElement = document.querySelector("#rounds-amount");
const pointsAmountElement = document.querySelector("#points-amount");
const lifelineElement = document.querySelectorAll(".lifeline");
const QElement = document.querySelectorAll('td')
const gameRoundsElement = document.querySelector('#game-rounds')


startBtnElement.forEach((button) => {
  button.addEventListener("click", nextPage);
});
categoryElement.forEach((category) => {
  category.addEventListener("click", selectCategory);
});
lifelineElement.forEach((lifeline) => {
  lifeline.addEventListener("click", selectLifeline);
});
QElement.forEach((Q) => {
  Q.addEventListener("click", selectQ);
});
if (roundsCheckBoxElement) {
  roundsCheckBoxElement.addEventListener("change", checkGameSettings);
}

if (pointsCheckBoxElement) {
  pointsCheckBoxElement.addEventListener("change", checkGameSettings);
}

function selectCategory(event) {
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
function selectLifeline(event) {
  console.log("slecet lifeline");
  let color = getComputedStyle(event.currentTarget).backgroundColor;
  console.log(color);
  if (color === unSelectedColor) {
    event.currentTarget.style.backgroundColor = "red";
    lifeline++;
    console.log(lifeline);
  } else {
    event.currentTarget.style.backgroundColor = "violet";
    color = false;
    lifeline--;
    console.log("lifelines:" + lifeline);
  }
}
function selectQ(event) {
  console.log("slecet Q");
  let color = getComputedStyle(event.currentTarget).backgroundColor;
  console.log(color);
  if (color === unSelectedColor) {
    if(team1)
    {event.currentTarget.style.backgroundColor = "green";
    team1 = false
    console.log(rounds);}
    else {
    event.currentTarget.style.backgroundColor = "yellow";
    team1 = true;
    rounds++;
    roundDisplay()
    console.log("rounds:" + rounds);
  }
  } 
}
function roundDisplay(){
  gameRoundsElement.innerHTML = rounds;
}
function checkGameSettings() {
  console.log("settings");
  if (pointsCheckBoxElement.checked) {
    console.log("point");
    pointsAmountElement.disabled = false;
  } else if (!pointsCheckBoxElement.checked)
    pointsAmountElement.disabled = true;
  if (roundsCheckBoxElement.checked) roundsAmountElement.disabled = false;
  else if (!roundsCheckBoxElement.checked) roundsAmountElement.disabled = true;
}
function nextPage(){
  if(window.location.pathname.includes('index.html')){
    if(selectedCount === 5){
      selectedCount = 0;
      window.location.href ='./team.html'
    } else {
      alert('Please selecet 5 categories.')
    }
    return
  }
  if(window.location.pathname.includes('team.html')){
    if (teamNameElement.item(0).value === "") {
    alert("Please enter the first team name.");
    return;
  }

  if (teamNameElement.item(1).value === "") {
    alert("Please enter the second team name.");
    return;
  }

  checkGameSettings();

  if (roundsCheckBoxElement.checked) {
    if (
      roundsAmountElement.value <= 0 ||
      roundsAmountElement.value > 12
    ) {
      alert("Rounds must be between 1 and 12.");
      return;
    }

    rounds = roundsAmountElement.value;
  }

  if (pointsCheckBoxElement.checked) {
    if (
      pointsAmountElement.value < 100 ||
      pointsAmountElement.value > 7500
    ) {
      alert("Points must be between 100 and 7500.");
      return;
    }

    points = pointsAmountElement.value;
  }

  if (lifeline <= 2) {
    alert("Please select 3+ lifelines.");
    return;
  }

  window.location.href = "./game.html";
}
}