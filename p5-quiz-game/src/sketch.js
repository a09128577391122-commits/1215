let quizManager;
let dialogueManager;
let currentQuestion = null;
let userAnswer = '';
let feedbackMessage = '';

function preload() {
  // Load the quiz questions from the CSV file
  quizManager = new QuizManager();
  quizManager.loadQuestions('data/questions.csv');
  
  // Initialize the dialogue manager
  dialogueManager = new DialogueManager();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(32);
  
  // Start the quiz by getting a new question
  getNextQuestion();
}

function draw() {
  background(220);
  
  // Display the current question
  if (currentQuestion) {
    text(currentQuestion.question, width / 2, height / 2 - 50);
  }
  
  // Display user input and feedback
  text(userAnswer, width / 2, height / 2 + 50);
  text(feedbackMessage, width / 2, height / 2 + 100);
  
  // Display dialogue
  dialogueManager.display();
}

function keyPressed() {
  // Handle user input for answers
  if (keyCode >= 48 && keyCode <= 57) { // Number keys
    userAnswer += key;
  } else if (keyCode === BACKSPACE) {
    userAnswer = userAnswer.slice(0, -1);
  } else if (keyCode === ENTER) {
    checkAnswer();
  }
}

function getNextQuestion() {
  currentQuestion = quizManager.getRandomQuestion();
  userAnswer = '';
  feedbackMessage = '';
}

function checkAnswer() {
  if (currentQuestion && userAnswer) {
    if (parseInt(userAnswer) === currentQuestion.answer) {
      feedbackMessage = currentQuestion.correctFeedback;
    } else {
      feedbackMessage = currentQuestion.incorrectFeedback;
    }
    // Get the next question after answering
    getNextQuestion();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}