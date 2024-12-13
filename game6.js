// Show the modal
function openModal() {
  var modal = document.getElementById("geoModal");
  modal.style.display = "block";

  var span = document.getElementById("geo-close");
  span.onclick = function () {
    modal.style.display = "none";
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

document.getElementById('instructions-button').addEventListener('click', function () {
  openModal();
});

const questions = Data.BOOKS[Manager.selected].games.game6.challenge;
console.log(questions); // Log questions to check if they are loaded correctly

let currentQuestionIndex = 0;
let numCorrect = 0;
let score = Data.BOOKS[Manager.selected].games.game6.init_score;
let scoreDelta = Data.BOOKS[Manager.selected].games.game6.score;

const questionElement = document.getElementById('question');
const submitButton = document.getElementById('submitAnswer');
const feedbackElement = document.getElementById('feedback');
const scoreElement = document.getElementById('score');
const stateDropdown = document.getElementById('stateDropdown');

scoreElement.textContent = `Score: ${score}`;
feedbackElement.textContent = 'Ready, set, go!';

function loadQuestion() {
  if (questions && questions[currentQuestionIndex]) {
    questionElement.textContent = questions[currentQuestionIndex].question;
    stateDropdown.selectedIndex = 0; // Reset the dropdown menu to default
  } else {
    console.error('Questions not loaded or current question index out of bounds');
  }
}

function animateprogress(correct) {
  let loaded = false;
  currentQuestionIndex++;

  if (correct) {
    numCorrect++;
    feedbackElement.textContent = "Correct!";
  } else {
    feedbackElement.textContent = "Oops! That wasn't the right answer. Click next to continue.";
    loaded = true;
    document.getElementById('submitAnswer').style.display = 'none';
    document.getElementById('nextQ').style.display = 'inline-block';
    document.getElementById('nextQ').onclick = () => {
      feedbackElement.textContent = "Let's try this next question.";
      document.getElementById('submitAnswer').style.display = 'inline-block';
      document.getElementById('nextQ').style.display = 'none';
      setTimeout(() => { loadQuestion(); }, 100);
    }
  }

  updateScore(correct);
  if (currentQuestionIndex < questions.length) {
    if (!loaded) setTimeout(() => { loadQuestion(); }, 600);
  } else {
    endGame();
  }
}

function updateScore(correct) {
  if (correct) {
    score += scoreDelta;
    scoreElement.textContent = `Score: ${score}`;
  }
}

function endGame() {
  let maxScore = questions.length * scoreDelta;
  questionElement.style.textAlign = 'center';
  questionElement.textContent = "";
  document.getElementById('nextQ').style.display = 'none';
  submitButton.style.display = 'none';

  if (score == maxScore) {
    feedbackElement.textContent = "Congratulations, you won!";
  } else if (score <= maxScore / 2) {
    feedbackElement.textContent = "Good effort. Ask a teacher for help if the questions were too hard.";
  } else {
    feedbackElement.textContent = "Almost there. Try again?";
  }
}

submitButton.addEventListener('click', () => {
  const selectedState = stateDropdown.value;
  if (selectedState === "") {
    alert("Please select a state.");
    return;
  }
  const correctAnswer = questions[currentQuestionIndex].answer;
  console.log(`User Answer: ${selectedState}, Correct Answer: ${correctAnswer}`);
  const isCorrect = selectedState.toLowerCase() === correctAnswer.toLowerCase();
  animateprogress(isCorrect);
});

loadQuestion();
