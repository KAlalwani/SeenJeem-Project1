// ===== Constants =====
const selectedColor = "red";
const unSelectedColor = "rgb(238, 130, 238)";
const selectedCategories = 5;
const page = window.location.pathname.split("/").pop() || "index.html";
const choice = new Array("a", "b", "c", "d");
const totalScore = getJSON("points");
const totalRounds = getJSON("totalRounds");

// ===== Page-local variables (only needed on one page) =====
let selectedCount = 0; // index.html only
let quizData; // question.html only
let realAns; // question.html only
let usrAns; // question.html only
// ===== Storage helpers =====
// JSON keeps types (numbers, booleans, arrays), so no "false" string bugs.
function getJSON(key, fallback = null) {
  const value = sessionStorage.getItem(key);
  return value === null ? fallback : JSON.parse(value);
}
function setJSON(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

if (page === "index.html") {
  sessionStorage.clear();
  setJSON("rounds", 1);
  setJSON("team1", true);
  setJSON("pointsT1", 0);
  setJSON("pointsT2", 0);
}
if (page === "game.html" || page === "question.html") {
  if (getJSON("team1") === null || getJSON("rounds") === null) {
    window.location.href = "./index.html"; // state lost, restart
  }
}

// ===== Elements =====
const startBtnElement = document.querySelectorAll(".start-btn");
const categoryElement = document.querySelectorAll(".category");
const teamNameElement = document.querySelectorAll(".team-names");
const roundsCheckBoxElement = document.querySelector("#rounds");
const pointsCheckBoxElement = document.querySelector("#points");
const roundsAmountElement = document.querySelector("#rounds-amount");
const pointsAmountElement = document.querySelector("#points-amount");
const setupLifelineContainerElements = document.querySelectorAll(
  ".lifelines-container.team",
);
const setupLifelineElements = document.querySelectorAll(
  ".lifelines-container.team .lifeline",
);
const questionLifelineElements = document.querySelectorAll(
  ".lifelines-container.Q .lifeline",
);
const QElement = document.querySelectorAll("td");
const gameRoundsElement = document.querySelector("#game-rounds");
const gameTotalRoundsElement = document.querySelector("#game-total-rounds");
const timeBarElement = document.querySelector(".timer-bar");
const teamPointsElement = document.querySelectorAll(".team-points");
const questionElement = document.querySelector("#side-Q > h1");
const QChoiceElement = document.querySelectorAll(".choice");
const questionImageElement = document.querySelector("#side-Q-img img");
const gameNameElement = document.querySelectorAll(".team > span");
const gameCategoryElement = document.querySelectorAll(".game-category");
const doneBtnElement = document.querySelector(".done-btn");
const scoreBarElement = document.querySelectorAll(".points-counter");
// ===== Listeners =====
startBtnElement.forEach((button) => {
  button.addEventListener("click", nextPage);
});
categoryElement.forEach((category) => {
  category.addEventListener("click", selectCategory);
});
setupLifelineElements.forEach((item) => {
  item.addEventListener("click", selectLifeline);
});
if (page === "game.html") {
  QElement.forEach((Q) => {
    Q.addEventListener("click", selectQ);
  });
}
if (roundsCheckBoxElement) {
  roundsCheckBoxElement.addEventListener("change", checkGameSettings);
}
if (pointsCheckBoxElement) {
  pointsCheckBoxElement.addEventListener("change", checkGameSettings);
}
QChoiceElement.forEach((choice) => {
  choice.addEventListener("click", selectChoice);
});
if (page === "question.html")
  doneBtnElement.addEventListener("click", () => {
    submitAnwser(usrAns);
  });

// ===== Functions =====
function selectCategory(event) {
  console.log("select category");
  let color = getComputedStyle(event.currentTarget).backgroundColor;
  if (color === unSelectedColor) {
    event.currentTarget.style.backgroundColor = "red";
    selectedCount++;
  } else {
    event.currentTarget.style.backgroundColor = "violet";
    selectedCount--;
  }
  console.log(selectedCount);
}

function selectLifeline(event) {
  const lifeline = event.currentTarget;
  const isSelected = lifeline.classList.toggle("is-selected");
  lifeline.style.backgroundColor = isSelected ? selectedColor : "violet";
}

function selectQ(event) {
  const cell = event.currentTarget;
  const team1 = getJSON("team1");
  const rounds = getJSON("rounds");

  const cellIndex = Array.from(QElement).indexOf(cell);
  const category = normalizeCategory(getJSON("categories", [])[cell.cellIndex]);
  const pointValue = Number(cell.textContent.trim());
  const used = getJSON("usedQuestions", []);

  setJSON("answeringTeam", team1);

  cell.style.backgroundColor = team1 ? "green" : "yellow";
  used.push({
    index: cellIndex,
    color: team1 ? "green" : "yellow",
  });

  setJSON("usedQuestions", used);
  setJSON("team1", !team1);

  if (!team1) {
    setJSON("rounds", rounds + 1);
  }

  setJSON("questionCriteria", { category, pointValue });
  setJSON("questionPoints", pointValue);
  window.location.href = "./question.html";
}

function normalizeCategory(category) {
  const normalized = String(category || "").trim().toLowerCase();
  const aliases = {
    cartoon: "cartoons",
    cartoons: "cartoons",
    country: "countries",
    countries: "countries",
    people: "people",
    history: "history",
    coding: "coding",
  };

  return aliases[normalized] || normalized;
}

function selectChoice(event) {
  usrAns = Array.from(QChoiceElement).indexOf(event.currentTarget);
  console.log(usrAns);
  for (let i = 0; i < 4; i++) {
    if (usrAns === i) QChoiceElement.item(i).style.backgroundColor = "green";
    else QChoiceElement.item(i).style.backgroundColor = "blanchedalmond";
  }
}

function displayGame() {
  gameNameElement.item(1).innerText = getJSON("teamNames")[0];
  gameNameElement.item(3).innerText = getJSON("teamNames")[1];
  for (let i = 0; i < getJSON("categories").length; i++) {
    gameCategoryElement.item(i).innerText = getJSON("categories")[i];
  }
}

function roundDisplay() {
  if (gameRoundsElement) {
    gameRoundsElement.innerHTML = getJSON("rounds", 1);
  }
  if (gameTotalRoundsElement) {
    gameTotalRoundsElement.textContent = getJSON(
      "totalRounds",
      selectedCategories * 5,
    );
  }
}

function restoreCells() {
  getJSON("usedQuestions", []).forEach(({ index, color }) => {
    if (QElement[index]) QElement[index].style.backgroundColor = color;
  });
}

function checkGameSettings() {
  pointsAmountElement.disabled = !pointsCheckBoxElement.checked;
  roundsAmountElement.disabled = !roundsCheckBoxElement.checked;
}

function question() {
  displayQuestionLifelines();
  timer();
  const { category, pointValue } = getJSON("questionCriteria", {});
  const questionData = getRandomQuestion(category, pointValue);

  if (!questionData) {
    questionElement.textContent = "No question is available for this board cell.";
    return;
  }
  questionElement.innerHTML = questionData.prompt;
  displayQuestionImage(questionData.category);
  QChoiceElement.forEach((choice, index) => {
    choice.textContent = questionData.options[index]?.text ?? "";
  });
  realAns = questionData.correctOptionId;
  console.log(questionData.prompt);
  console.log(questionData.options);
  console.log(questionData.correctOptionId);
}

function displayQuestionImage(category) {
  if (!questionImageElement) return;

  const categoryImages = {
    people: "./images/people-quiz.svg",
    cartoons: "./images/cartoons-quiz.svg",
    countries: "./images/countries-quiz.svg",
    history: "./images/history-quiz.svg",
    coding: "./images/coding-quiz.svg",
  };
  const imageUrl = categoryImages[category] || categoryImages.people;

  questionImageElement.src = imageUrl;
  questionImageElement.alt = `${category} quiz illustration`;
}

function displayQuestionLifelines() {
  if (questionLifelineElements.length === 0) return;

  const lifelinesByTeam = getJSON("lifelines", { team1: [], team2: [] });
  const teamKey = getJSON("answeringTeam") ? "team1" : "team2";
  const teamLifelines = lifelinesByTeam[teamKey] || [];

  questionLifelineElements.forEach((element, index) => {
    const label = teamLifelines[index];
    element.hidden = !label;
    if (label) {
      element.querySelector("figcaption").textContent = label;
    }
  });
}

function displayScore() {
  const pointsT1 = getJSON("pointsT1", 0);
  const pointsT2 = getJSON("pointsT2", 0);
  const maxScore = getJSON("points") || 1000;

  teamPointsElement.item(0).textContent = pointsT1;
  teamPointsElement.item(1).textContent = pointsT2;

  scoreBarElement.forEach((bar, index) => {
    const score = index === 0 ? pointsT1 : pointsT2;
    bar.style.height = `${Math.min((score / maxScore) * 100, 100)}%`;
  });
}
// function displayScore() {
//   let questionValue = Number(sessionStorage.getItem("questionText"));
//   let scoreLeft;
//   if (window.location.pathname.includes("game.html")) {
//     if (getJSON("team1")) {
//       setJSON("pointsT1", getJSON("pointsT1") + questionValue);
//       scoreLeft = totalScore - getJSON("pointsT1");
//       scoreBarElement.item(0).style.height = `${(scoreLeft / totalScore) * 100}%`;
//     } else {
//       setJSON("pointsT2", getJSON("pointsT2") + questionValue);
//       scoreLeft = totalScore - getJSON("pointsT2");
//       scoreBarElement.item(1).style.height = `${(scoreLeft / totalScore) * 100}%`;
//     }
//     if (scoreLeft >= totalScore) {
//       alert("Score's up!");
//     }
//   }
// }

function timer() {
  if (!timeBarElement) return;
  let timeLeft = 20;
  const totalTime = 20;
  const timerId = setInterval(() => {
    timeLeft--;

    timeBarElement.style.width = `${(timeLeft / totalTime) * 100}%`;

    if (timeLeft <= 5) {
      timeBarElement.style.backgroundColor = "red";
    }

    if (timeLeft < 0) {
      clearInterval(timerId);
      alert("Time's up!");
      submitAnwser(usrAns);
    }
  }, 1000);
}

async function loadQuizData() {
  const response = await fetch("./data/quiz_bank_starter.json");

  if (!response.ok) {
    throw new Error("Failed to load quiz bank");
  }

  quizData = await response.json();
}

function getRandomQuestion(category, pointValue) {
  const questions = quizData.questionBank.filter(
    (question) =>
      question.category === category && question.pointValue === pointValue,
  );

  if (questions.length === 0) {
    console.error(`No questions found for ${category} at ${pointValue} points`);
    return null;
  }

  const randomIndex = Math.floor(Math.random() * questions.length);

  return questions[randomIndex];
}

function submitAnwser(usrAns) {
  if (usrAns === undefined || usrAns === null) {
    alert("Please select an answer first.");
    return;
  }

  if (realAns === choice[usrAns]) {
    const answeringTeam = getJSON("answeringTeam");
    const key = answeringTeam ? "pointsT1" : "pointsT2";

    const currentPoints = getJSON(key, 0);
    const questionPoints = getJSON("questionPoints", 0);

    setJSON(key, currentPoints + questionPoints);

    alert(`Correct! +${questionPoints} points`);
  } else {
    alert("Incorrect!");
  }

  window.location.href = "./game.html";
}

function nextPage() {
  if (page === "index.html") {
    if (selectedCount === 5) {
      const names = Array.from(categoryElement)
        .filter((el) => el.style.backgroundColor === selectedColor)
        .map((el) => el.innerText);
      setJSON("categories", names);

      selectedCount = 0;
      window.location.href = "./team.html";
    } else {
      alert("Please select 5 categories.");
    }
    return;
  }

  if (page === "team.html") {
    if (teamNameElement.item(0).value === "") {
      alert("Please enter the first team name.");
      return;
    }

    if (teamNameElement.item(1).value === "") {
      alert("Please enter the second team name.");
      return;
    }

    checkGameSettings();

    let maxRounds = selectedCategories * 5;
    if (roundsCheckBoxElement.checked) {
      if (roundsAmountElement.value <= 0 || roundsAmountElement.value > 12) {
        alert("Rounds must be between 1 and 12.");
        return;
      }
      maxRounds = Number(roundsAmountElement.value);
    }

    let points = 2700;
    if (pointsCheckBoxElement.checked) {
      if (pointsAmountElement.value < 100 || pointsAmountElement.value > 7500) {
        alert("Points must be between 100 and 7500.");
        return;
      }
      points = Number(pointsAmountElement.value);
    }

    const lifelinesByTeam = Array.from(setupLifelineContainerElements).map(
      (container) =>
        Array.from(container.querySelectorAll(".lifeline"))
          .filter((lifeline) => lifeline.classList.contains("is-selected"))
          .map((lifeline) => lifeline.innerText.trim()),
    );

    if (lifelinesByTeam.some((teamLifelines) => teamLifelines.length < 3)) {
      alert("Please select 3+ lifelines for each team.");
      return;
    }

    // NEW: persist settings so game.html can use them
    setJSON("teamNames", [
      teamNameElement.item(0).value,
      teamNameElement.item(1).value,
    ]);
    setJSON("totalRounds", maxRounds);
    setJSON("points", points);
    setJSON("lifelines", {
      team1: lifelinesByTeam[0],
      team2: lifelinesByTeam[1],
    });

    window.location.href = "./game.html";
    return;
  }

  if (page === "game.html") {
    window.location.href = "./question.html";
  }
}

// ===== Run on page load =====
if (page === "game.html") {
  roundDisplay();
  restoreCells();
  displayGame();
  displayScore();
}
if (page === "question.html") {
  loadQuizData()
    .then(() => question())
    .catch((error) => console.error(error));
}
