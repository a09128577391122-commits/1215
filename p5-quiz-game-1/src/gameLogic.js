// src/gameLogic.js

let questions = [];
let currentQuestionIndex = 0;
let playerAnswer = '';
let feedbackMessage = '';
let isAnswerCorrect = false;

// Load questions from CSV
function loadQuestions() {
  loadTable('data/questions.csv', 'csv', 'header', (table) => {
    for (let r = 0; r < table.getRowCount(); r++) {
      let question = table.getString(r, 'question');
      let answer = table.getString(r, 'answer');
      let correctFeedback = table.getString(r, 'correct feedback');
      let incorrectFeedback = table.getString(r, 'incorrect feedback');
      let hint = table.getString(r, 'hint text');
      questions.push({ question, answer, correctFeedback, incorrectFeedback, hint });
    }
    startQuiz();
  });
}

// Start the quiz
function startQuiz() {
  currentQuestionIndex = 0;
  displayCurrentQuestion();
}

// Display the current question
function displayCurrentQuestion() {
  if (currentQuestionIndex < questions.length) {
    let currentQuestion = questions[currentQuestionIndex];
    feedbackMessage = '';
    // Call a function to display the question in the UI
    displayQuestion(currentQuestion.question);
  } else {
    // Quiz finished
    displayFinalMessage();
  }
}

// Check the player's answer
function checkAnswer() {
  let currentQuestion = questions[currentQuestionIndex];
  if (playerAnswer === currentQuestion.answer) {
    isAnswerCorrect = true;
    feedbackMessage = currentQuestion.correctFeedback;
  } else {
    isAnswerCorrect = false;
    feedbackMessage = currentQuestion.incorrectFeedback + ' Hint: ' + currentQuestion.hint;
  }
  currentQuestionIndex++;
  playerAnswer = '';
  displayFeedback();
  displayCurrentQuestion();
}

// Set the player's answer
function setPlayerAnswer(answer) {
  playerAnswer = answer;
}

// Display feedback to the player
function displayFeedback() {
  // Call a function to display feedback in the UI
  showFeedback(feedbackMessage);
}

// Display final message when quiz is finished
function displayFinalMessage() {
  // Call a function to display a final message in the UI
  showFinalMessage('Quiz completed! Thank you for playing.');
}