const baseUrl = "https://opentdb.com/api.php?";
//sample url:
// https://opentdb.com/api.php?amount=10&category=21&difficulty=medium&type=multiple

// Select all grid items
const gridItems = document.querySelectorAll(".grid-item");
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
// Add a click event listener to each grid item
gridItems.forEach((item, index) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(category[item.id]);
    const numberOfQuestions = 10;
    const difficulty = "easy";
    const questionType = "multiple";
    //form the url and invoke the getQuestions function
    let url = baseUrl + "amount=10";
    if (category[item.id]) {
      url += `&category=${category[item.id]}`;
    }
    url += "&difficulty=easy&type=multiple";
    getQuestions(url);
  });
});

async function getQuestions(url) {
  try {
    const result = await fetch(url);
    if (!result.ok) {
      throw new Error("Error occurred while fetching data: " + result.status);
    }
    // console.log(result);
    const questions = await result.json();
    console.log(questions);
    processQuestions(questions);
  } catch (error) {
    console.log("Error occurred: " + error);
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
      console.log(correctAnswer);
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
      console.log(shuffledArray);
    });
  }
}
function decodeHtmlEntities(input) {
  return input
    .replace(/&#039;/, "'")
    .replace(/&amp;/, "&")
    .replace(/&quot;/, '"')
    .replace(/&rsquo;/, "'")
    .replace(/&shy;/, "-");
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
// Function to display book data for a single book
function showBook(data) {
  const bookModal = document.createElement("dialog");
  bookModal.classList.add("modal");
  const bookTitle = document.createElement("h2");
  bookTitle.textContent = data.title;
  const bookAuthor = document.createElement("p");
  bookAuthor.textContent = data.authors[0].name;
  const bookSubjects = document.createElement("p");
  bookSubjects.textContent = data.subjects[0];

  //appending!
  bookModal.append(bookTitle, bookAuthor, bookSubjects);
  document.body.append(bookModal);
  bookModal.showModal();
  document.body.addEventListener("click", closeModal);
  function closeModal() {
    document.body.removeEventListener("click", closeModal);
    bookModal.close();
  }
}
