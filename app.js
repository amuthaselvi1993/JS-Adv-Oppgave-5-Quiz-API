const baseUrl = "https://opentdb.com/api.php?";
//sample url:
// https://opentdb.com/api.php?amount=10&category=21&difficulty=medium&type=multiple

// Select all grid items
const gridItems = document.querySelectorAll(".grid-item");
const levelButtons = document.querySelectorAll(".level");
const questionPanel = document.querySelector("#questions-container");
let totalScore = 0;
const scoreBox = document.querySelector("#score-box");
const category = {
  gk: 9,
  scienceNature: 17,
  computers: 18,
  sports: 21,
  animals: 27,
};
let complexity = "easy";
// Add a click event listener to each button in level picker
levelButtons.forEach((level, index) => {
  level.addEventListener("click", (e) => {
    levelButtons.forEach(
      (level) => level.classList.remove("level-picker-selected")
      // level.classList.add("level")
    );
    e.preventDefault();
    level.classList.add("level-picker-selected");
    complexity = level.id;
  });
});
// Add a click event listener to each grid item
gridItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    gridItems.forEach((item) => item.classList.remove("selected-topic"));

    e.preventDefault();
    item.classList.add("selected-topic");
    const numberOfQuestions = 10;
    const difficulty = "easy";
    const questionType = "multiple";
    //form the url and invoke the getQuestions function
    let url = baseUrl + "amount=10";
    if (category[item.id]) {
      url += `&category=${category[item.id]}`;
    }
    //append difficulty
    url += `&difficulty=${complexity}`;
    getQuestions(url);
  });
});

async function getQuestions(url) {
  try {
    const result = await fetch(url);
    if (!result.ok) {
      throw new Error("Error occurred while fetching data: " + result.status);
    }
    const questions = await result.json();
    processQuestions(questions);
  } catch (error) {
    console.error("Error occurred: " + error);
    //error handling logic to be added here.
  }
}

function processQuestions(data) {
  if (data.results) {
    removeOldQuestions();

    data.results.forEach((item, index) => {
      const singleQuestionBlock = document.createElement("div");
      singleQuestionBlock.classList.add("question");
      const question = document.createElement("p");
      question.textContent = decodeHtmlEntities(
        `${index + 1}. ${item.question}`
      ); //to print question number and then question
      const correctAnswer = decodeHtmlEntities(item.correct_answer);
      let options = item.incorrect_answers;
      options.push(item.correct_answer);
      options.forEach((answer) => decodeHtmlEntities(answer));
      const optionsPane = document.createElement("div");
      optionsPane.classList.add("option-pane");
      const shuffledArray = shuffleArray(options);
      shuffledArray.forEach((option, i) => {
        const optionText = document.createElement("p");
        optionText.textContent = option;
        optionText.classList.add("option-text");
        optionsPane.append(optionText);
        optionText.addEventListener("click", () => {
          const resultText = document.createElement("p");

          optionText.classList.remove("correct-answer");
          optionText.classList.remove("wrong-answer");
          if (optionText.textContent === correctAnswer) {
            optionText.classList.add("correct-answer");
            resultText.textContent =
              "Congratulations! You have selected the correct Answer!";
            totalScore += 1;
            scoreBox.textContent = `Total Score: ${totalScore}/10`;
          } else {
            resultText.textContent =
              "Incorrect! " + correctAnswer + " is the correct answer";
            optionText.classList.add("wrong-answer");
          }
          resultText.classList.add("result-text");
          optionsPane.childNodes.forEach((child) => {
            child.classList.add("options-disabled");
          });
          singleQuestionBlock.append(resultText);
        });
      });
      singleQuestionBlock.append(question, optionsPane);
      questionPanel.append(singleQuestionBlock);
    });
  }
}
function decodeHtmlEntities(input) {
  return input
    .replaceAll("&#039;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&rsquo;", "'")
    .replaceAll("&shy;", "-")
    .replaceAll("&oacute;", "ó");
}
function removeOldQuestions() {
  while (questionPanel.firstChild)
    questionPanel.removeChild(questionPanel.firstChild);
  totalScore = 0;
  scoreBox.textContent = `Total Score: 0/10`;
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at indices i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let toTopButton = document.getElementById("scrollToTopBtn");

// When the user scrolls down 50px from the top of the document, show the button
window.onscroll = function () {
  if (
    document.body.scrollTop > window.innerHeight ||
    document.documentElement.scrollTop > window.innerHeight
  ) {
    toTopButton.style.top = "90%"; // Button falls down from the top (visible)
  } else {
    toTopButton.style.top = "-10%"; // Button moves back up and hides off-screen
  }
};

// // When the user clicks on the button, scroll to the top of the document
toTopButton.onclick = function () {
  window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to the top
};
